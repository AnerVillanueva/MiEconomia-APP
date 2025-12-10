package com.mieconomia.app;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
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

    try {
      // Construct the RemoteViews object
      RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.balance_widget);

      // Read data from Capacitor Preferences
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

      // PendingIntent for Add Expense
      Intent expenseIntent = new Intent(context, QuickAddActivity.class);
      expenseIntent.putExtra("type", "expense");
      android.app.PendingIntent expensePendingIntent = android.app.PendingIntent.getActivity(
          context,
          1,
          expenseIntent,
          android.app.PendingIntent.FLAG_UPDATE_CURRENT | android.app.PendingIntent.FLAG_IMMUTABLE);
      views.setOnClickPendingIntent(R.id.btn_add_expense, expensePendingIntent);

      // PendingIntent for Add Income
      Intent incomeIntent = new Intent(context, QuickAddActivity.class);
      incomeIntent.putExtra("type", "income");
      android.app.PendingIntent incomePendingIntent = android.app.PendingIntent.getActivity(
          context,
          2,
          incomeIntent,
          android.app.PendingIntent.FLAG_UPDATE_CURRENT | android.app.PendingIntent.FLAG_IMMUTABLE);
      views.setOnClickPendingIntent(R.id.btn_add_income, incomePendingIntent);

      // Instruct the widget manager to update the widget
      appWidgetManager.updateAppWidget(appWidgetId, views);
    } catch (Exception e) {
      // Prevent crash
    }
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
