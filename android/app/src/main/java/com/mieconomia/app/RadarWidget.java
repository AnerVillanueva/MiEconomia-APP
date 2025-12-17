package com.mieconomia.app;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.ComponentName;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.drawable.Drawable;
import android.widget.RemoteViews;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Locale;

public class RadarWidget extends AppWidgetProvider {

  static void updateAppWidget(Context context, AppWidgetManager appWidgetManager,
      int appWidgetId) {

    try {
      RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.radar_widget);

      // Read Data
      SharedPreferences prefs = context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);
      String expenseJson = prefs.getString("widget_expense_categories", "{}");
      String incomeJson = prefs.getString("widget_income_categories", "{}");

      Map<String, Double> expenses = parseCategories(expenseJson);
      Map<String, Double> income = parseCategories(incomeJson);

      // Calculate Totals
      double totalExpense = 0;
      for (Double val : expenses.values())
        totalExpense += val;

      double totalIncome = 0;
      for (Double val : income.values())
        totalIncome += val;

      double balance = totalIncome - totalExpense;

      // Update Text Views
      views.setTextViewText(R.id.widget_balance, String.format(Locale.GERMANY, "%.2f €", balance));
      views.setTextViewText(R.id.widget_income, String.format(Locale.GERMANY, "+ %.2f €", totalIncome));
      views.setTextViewText(R.id.widget_expense, String.format(Locale.GERMANY, "- %.2f €", totalExpense));

      // Calculate chart
      Bitmap chartBitmap = createRadarChartBitmap(context, expenses, income);
      if (chartBitmap != null) {
        views.setImageViewBitmap(R.id.img_radar_chart, chartBitmap);
      }

      appWidgetManager.updateAppWidget(appWidgetId, views);
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  private static Bitmap createRadarChartBitmap(Context context, Map<String, Double> expenses,
      Map<String, Double> income) {
    int width = 300; // Reduced resolution for performance/IPC limits
    int height = 300;
    Bitmap bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
    Canvas canvas = new Canvas(bitmap);

    // Config
    float centerX = width / 2f;
    float centerY = height / 2f;
    float radius = Math.min(centerX, centerY) * 0.65f; // Slightly smaller to fit icons

    // Colors
    int colorExpense = Color.parseColor("#FF5252");
    int colorIncome = Color.parseColor("#33D499");
    int colorGrid = Color.parseColor("#33FFFFFF");

    Paint paint = new Paint();
    paint.setAntiAlias(true);

    // Hardcoded list of all possible categories
    List<String> allCategories = new ArrayList<>();
    allCategories.add("Nómina");
    allCategories.add("Comida");
    allCategories.add("Negocios");
    allCategories.add("Gasolina");
    allCategories.add("Ropa");
    allCategories.add("Salud");
    allCategories.add("Otros");

    double maxValue = 100; // Default minimum max
    for (Double val : expenses.values())
      maxValue = Math.max(maxValue, val);
    for (Double val : income.values())
      maxValue = Math.max(maxValue, val);

    // Draw Grid
    int sides = allCategories.size();
    float angleStep = (float) (2 * Math.PI / sides);

    // Grid Paint (Dashed)
    Paint paintGrid = new Paint();
    paintGrid.setStyle(Paint.Style.STROKE);
    paintGrid.setColor(colorGrid);
    paintGrid.setStrokeWidth(2f);
    paintGrid.setPathEffect(new android.graphics.DashPathEffect(new float[] { 10f, 10f }, 0f));
    paintGrid.setAntiAlias(true);

    for (int i = 1; i <= 3; i++) {
      float r = radius * (i / 3f);
      Path gridPath = new Path();
      for (int j = 0; j < sides; j++) {
        float angle = j * angleStep - (float) Math.PI / 2;
        float x = centerX + (float) Math.cos(angle) * r;
        float y = centerY + (float) Math.sin(angle) * r;
        if (j == 0)
          gridPath.moveTo(x, y);
        else
          gridPath.lineTo(x, y);
      }
      gridPath.close();
      canvas.drawPath(gridPath, paintGrid);
    }

    // Axes & Icons
    for (int j = 0; j < sides; j++) {
      float angle = j * angleStep - (float) Math.PI / 2;
      float x = centerX + (float) Math.cos(angle) * radius;
      float y = centerY + (float) Math.sin(angle) * radius;

      // Draw axis line
      canvas.drawLine(centerX, centerY, x, y, paintGrid);

      // Icons
      float labelRadius = radius * 1.2f;
      float lx = centerX + (float) Math.cos(angle) * labelRadius;
      float ly = centerY + (float) Math.sin(angle) * labelRadius;

      int iconResId = getIconResourceForCategory(allCategories.get(j));
      Drawable icon = context.getDrawable(iconResId);
      if (icon != null) {
        icon.setTint(Color.WHITE);
        int iconSize = 48; // px
        int iconHalf = iconSize / 2;
        icon.setBounds((int) lx - iconHalf, (int) ly - iconHalf, (int) lx + iconHalf, (int) ly + iconHalf);
        icon.draw(canvas);
      }
    }

    // Draw Expense Data
    drawPoly(canvas, centerX, centerY, radius, sides, angleStep, allCategories, expenses, maxValue, colorExpense, 80);

    // Draw Income Data
    drawPoly(canvas, centerX, centerY, radius, sides, angleStep, allCategories, income, maxValue, colorIncome, 80);

    return bitmap;
  }

  private static void drawPoly(Canvas canvas, float cx, float cy, float radius, int sides, float angleStep,
      List<String> categories, Map<String, Double> data, double maxValue, int color, int alpha) {
    Path path = new Path();
    Paint paint = new Paint();
    paint.setAntiAlias(true);

    for (int j = 0; j < sides; j++) {
      String cat = categories.get(j);
      double val = data.containsKey(cat) ? data.get(cat) : 0;
      float r = (float) ((val / maxValue) * radius);
      // Min radius for visibility
      if (val > 0 && r < 10)
        r = 10;

      float angle = j * angleStep - (float) Math.PI / 2;
      float x = cx + (float) Math.cos(angle) * r;
      float y = cy + (float) Math.sin(angle) * r;

      if (j == 0)
        path.moveTo(x, y);
      else
        path.lineTo(x, y);
    }
    path.close();

    // Fill
    paint.setStyle(Paint.Style.FILL);
    paint.setColor(color);
    paint.setAlpha(alpha); // Transparency
    canvas.drawPath(path, paint);

    // Stroke
    paint.setStyle(Paint.Style.STROKE);
    paint.setColor(color);
    paint.setStrokeWidth(4f);
    paint.setAlpha(255);
    canvas.drawPath(path, paint);
  }

  private static Map<String, Double> parseCategories(String jsonStr) {
    Map<String, Double> map = new HashMap<>();
    try {
      // Remove quotes if double encoded
      if (jsonStr.startsWith("\"") && jsonStr.endsWith("\"")) {
        jsonStr = jsonStr.substring(1, jsonStr.length() - 1);
        jsonStr = jsonStr.replace("\\\"", "\"");
      }

      JSONObject json = new JSONObject(jsonStr);
      Iterator<String> keys = json.keys();
      while (keys.hasNext()) {
        String key = keys.next();
        map.put(key, json.getDouble(key));
      }
    } catch (Exception e) {
      // e.printStackTrace();
    }
    return map;
  }

  @Override
  public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
    for (int appWidgetId : appWidgetIds) {
      updateAppWidget(context, appWidgetManager, appWidgetId);
    }
  }

  @Override
  public void onReceive(Context context, Intent intent) {
    super.onReceive(context, intent);
    if (intent.getAction() != null && intent.getAction().equals(AppWidgetManager.ACTION_APPWIDGET_UPDATE)) {
      AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
      ComponentName thisAppWidget = new ComponentName(context.getPackageName(), RadarWidget.class.getName());
      int[] appWidgetIds = appWidgetManager.getAppWidgetIds(thisAppWidget);
      onUpdate(context, appWidgetManager, appWidgetIds);
    }
  }

  private static int getIconResourceForCategory(String category) {
    switch (category) {
      case "Nómina":
        return R.drawable.ic_cat_nomina;
      case "Comida":
        return R.drawable.ic_cat_comida;
      case "Negocios":
        return R.drawable.ic_cat_negocios;
      case "Gasolina":
        return R.drawable.ic_cat_gasolina;
      case "Ropa":
        return R.drawable.ic_cat_ropa;
      case "Salud":
        return R.drawable.ic_cat_salud;
      case "Otros":
        return R.drawable.ic_cat_otros;
      default:
        return R.drawable.ic_cat_otros;
    }
  }
}
