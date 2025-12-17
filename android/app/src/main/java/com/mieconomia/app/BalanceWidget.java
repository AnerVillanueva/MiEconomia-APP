package com.mieconomia.app;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.widget.RemoteViews;

import org.json.JSONObject;

import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;

public class BalanceWidget extends AppWidgetProvider {

  static void updateAppWidget(Context context, AppWidgetManager appWidgetManager,
      int appWidgetId) {

    RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.balance_widget);

    try {
      SharedPreferences prefs = context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);

      // --- Balance Info ---
      String balanceStr = prefs.getString("widget_balance", "0").replace("\"", "");
      String incomeStr = prefs.getString("widget_month_income", "0").replace("\"", "");
      String expenseStr = prefs.getString("widget_month_expense", "0").replace("\"", "");

      try {
        double balance = Double.parseDouble(balanceStr);
        double income = Double.parseDouble(incomeStr);
        double expense = Double.parseDouble(expenseStr);
        NumberFormat format = NumberFormat.getCurrencyInstance(Locale.GERMANY);

        views.setTextViewText(R.id.widget_balance, format.format(balance));
        views.setTextViewText(R.id.widget_income, "+ " + format.format(income));
        views.setTextViewText(R.id.widget_expense, "- " + format.format(expense));
      } catch (Exception e) {
        views.setTextViewText(R.id.widget_balance, balanceStr + " €");
        views.setTextViewText(R.id.widget_income, incomeStr + " €");
        views.setTextViewText(R.id.widget_expense, expenseStr + " €");
      }

      // --- Radar Chart ---
      // Removed from BalanceWidget in favor of dedicated RadarWidget
      /*
       * Bitmap chartBitmap = createRadarChartBitmap(context);
       * if (chartBitmap != null) {
       * views.setImageViewBitmap(R.id.img_chart, chartBitmap);
       * }
       */

    } catch (Exception e) {
      // Ignore
    }

    appWidgetManager.updateAppWidget(appWidgetId, views);
  }

  // --- Radar Logic Copied & Adapted ---

  private static Bitmap createRadarChartBitmap(Context context) {
    int width = 300;
    int height = 300;
    Bitmap bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
    Canvas canvas = new Canvas(bitmap);

    float centerX = width / 2f;
    float centerY = height / 2f;
    float radius = Math.min(centerX, centerY) * 0.6f; // Smaller radius to fit icons

    int colorExpense = Color.parseColor("#FF5252");
    int colorIncome = Color.parseColor("#33D499");
    int colorGrid = Color.parseColor("#33FFFFFF");

    Paint paint = new Paint();
    paint.setAntiAlias(true);

    SharedPreferences prefs = context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);
    String expenseJson = prefs.getString("widget_expense_categories", "{}");
    String incomeJson = prefs.getString("widget_income_categories", "{}");

    Map<String, Double> expenses = parseCategories(expenseJson);
    Map<String, Double> income = parseCategories(incomeJson);

    List<String> allCategories = new ArrayList<>();
    allCategories.add("Nómina");
    allCategories.add("Comida");
    allCategories.add("Negocios");
    allCategories.add("Gasolina");
    allCategories.add("Ropa");
    allCategories.add("Salud");
    allCategories.add("Otros");

    double maxValue = 100;
    for (Double val : expenses.values())
      maxValue = Math.max(maxValue, val);
    for (Double val : income.values())
      maxValue = Math.max(maxValue, val);

    int sides = allCategories.size();
    float angleStep = (float) (2 * Math.PI / sides);

    // Grid
    paint.setStyle(Paint.Style.STROKE);
    paint.setColor(colorGrid);
    paint.setStrokeWidth(2f);

    for (int i = 1; i <= 3; i++) { // Fewer rings for small size
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
      canvas.drawPath(gridPath, paint);
    }

    // Axes & Icons
    for (int j = 0; j < sides; j++) {
      float angle = j * angleStep - (float) Math.PI / 2;
      float x = centerX + (float) Math.cos(angle) * radius;
      float y = centerY + (float) Math.sin(angle) * radius;
      canvas.drawLine(centerX, centerY, x, y, paint);

      // Icons
      float labelRadius = radius * 1.35f; // More spacing
      float lx = centerX + (float) Math.cos(angle) * labelRadius;
      float ly = centerY + (float) Math.sin(angle) * labelRadius;

      Bitmap icon = getIconForCategory(context, allCategories.get(j));
      if (icon != null) {
        canvas.drawBitmap(icon, lx - icon.getWidth() / 2f, ly - icon.getHeight() / 2f, null);
      }
    }

    // Data
    drawPoly(canvas, centerX, centerY, radius, sides, angleStep, allCategories, expenses, maxValue, colorExpense, 80);
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
      if (val > 0 && r < 5)
        r = 5;

      float angle = j * angleStep - (float) Math.PI / 2;
      float x = cx + (float) Math.cos(angle) * r;
      float y = cy + (float) Math.sin(angle) * r;

      if (j == 0)
        path.moveTo(x, y);
      else
        path.lineTo(x, y);
    }
    path.close();

    paint.setStyle(Paint.Style.FILL);
    paint.setColor(color);
    paint.setAlpha(alpha);
    canvas.drawPath(path, paint);

    paint.setStyle(Paint.Style.STROKE);
    paint.setColor(color);
    paint.setStrokeWidth(3f);
    paint.setAlpha(255);
    canvas.drawPath(path, paint);
  }

  private static Map<String, Double> parseCategories(String jsonStr) {
    Map<String, Double> map = new HashMap<>();
    try {
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
    }
    return map;
  }

  private static Bitmap getIconForCategory(Context context, String category) {
    int resId;
    switch (category) {
      case "Nómina":
        resId = R.drawable.ic_cat_nomina;
        break;
      case "Comida":
        resId = R.drawable.ic_cat_comida;
        break;
      case "Negocios":
        resId = R.drawable.ic_cat_negocios;
        break;
      case "Gasolina":
        resId = R.drawable.ic_cat_gasolina;
        break;
      case "Ropa":
        resId = R.drawable.ic_cat_ropa;
        break;
      case "Salud":
        resId = R.drawable.ic_cat_salud;
        break;
      default:
        resId = R.drawable.ic_cat_otros;
        break;
    }
    try {
      android.graphics.drawable.Drawable drawable = context.getDrawable(resId);
      if (drawable == null)
        return null;

      int size = 32; // Smaller icons for this widget
      Bitmap bitmap = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888);
      Canvas canvas = new Canvas(bitmap);
      drawable.setBounds(0, 0, canvas.getWidth(), canvas.getHeight());
      drawable.setTint(Color.parseColor("#B3FFFFFF"));
      drawable.draw(canvas);
      return bitmap;
    } catch (Exception e) {
      return null;
    }
  }

  @Override
  public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
    for (int appWidgetId : appWidgetIds) {
      updateAppWidget(context, appWidgetManager, appWidgetId);
    }
  }
}
