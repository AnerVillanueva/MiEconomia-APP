package com.mieconomia.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.widget.RemoteViews;

/**
 * Quick Add Widget
 */
public class QuickAddWidget extends AppWidgetProvider {

  static void updateAppWidget(Context context, AppWidgetManager appWidgetManager,
      int appWidgetId) {

    RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.quick_add_widget);

    // Expense Intent
    Intent expenseIntent = new Intent(context, QuickAddActivity.class);
    expenseIntent.putExtra("type", "expense");
    expenseIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);

    PendingIntent expensePendingIntent = PendingIntent.getActivity(context, 101, expenseIntent,
        PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    views.setOnClickPendingIntent(R.id.btn_add_expense, expensePendingIntent);

    // Income Intent
    Intent incomeIntent = new Intent(context, QuickAddActivity.class);
    incomeIntent.putExtra("type", "income");
    incomeIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);

    PendingIntent incomePendingIntent = PendingIntent.getActivity(context, 102, incomeIntent,
        PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    views.setOnClickPendingIntent(R.id.btn_add_income, incomePendingIntent);

    appWidgetManager.updateAppWidget(appWidgetId, views);
  }

  @Override
  public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
    for (int appWidgetId : appWidgetIds) {
      updateAppWidget(context, appWidgetManager, appWidgetId);
    }
  }
}
