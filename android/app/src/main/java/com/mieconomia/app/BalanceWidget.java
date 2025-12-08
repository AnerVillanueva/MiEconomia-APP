package com.mieconomia.app;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.SharedPreferences;
import android.widget.RemoteViews;
import java.text.NumberFormat;
import java.util.Locale;

/**
 * Implementation of App Widget functionality.
 */
public class BalanceWidget extends AppWidgetProvider {

  static void updateAppWidget(Context context, AppWidgetManager appWidgetManager,
      int appWidgetId) {

    // Construct the RemoteViews object
    RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.balance_widget);

    // Read data from Capacitor Preferences
    // The file name used by Capacitor Preferences is "CapacitorStorage"
    SharedPreferences prefs = context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);

    String balanceStr = prefs.getString("widget_balance", "0");
    String incomeStr = prefs.getString("widget_month_income", "0");
    String expenseStr = prefs.getString("widget_month_expense", "0");

    try {
      // Remove any quotes if they were stored as JSON strings
      balanceStr = balanceStr.replace("\"", "");
      incomeStr = incomeStr.replace("\"", "");
      expenseStr = expenseStr.replace("\"", "");

      double balance = Double.parseDouble(balanceStr);
      double income = Double.parseDouble(incomeStr);
      double expense = Double.parseDouble(expenseStr);

      NumberFormat format = NumberFormat.getCurrencyInstance(Locale.GERMANY); // Euro format

      views.setTextViewText(R.id.widget_balance, format.format(balance));
      views.setTextViewText(R.id.widget_income, "+ " + format.format(income));
      views.setTextViewText(R.id.widget_expense, "- " + format.format(expense));

    } catch (Exception e) {
      views.setTextViewText(R.id.widget_balance, balanceStr + " €");
      views.setTextViewText(R.id.widget_income, incomeStr + " €");
      views.setTextViewText(R.id.widget_expense, expenseStr + " €");
    }

    // Instruct the widget manager to update the widget
    appWidgetManager.updateAppWidget(appWidgetId, views);
  }

  @Override
  public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
    // There may be multiple widgets active, so update all of them
    for (int appWidgetId : appWidgetIds) {
      updateAppWidget(context, appWidgetManager, appWidgetId);
    }
  }

  @Override
  public void onEnabled(Context context) {
    // Enter relevant functionality for when the first widget is created
  }

  @Override
  public void onDisabled(Context context) {
    // Enter relevant functionality for when the last widget is disabled
  }
}
