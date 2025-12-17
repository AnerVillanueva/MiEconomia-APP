package com.mieconomia.app;

import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class QuickAddActivity extends AppCompatActivity {

  private String type;
  private EditText etAmount;
  private Spinner spinnerCategory;
  private EditText etDescription;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_quick_add);

    // Get type from Intent
    type = getIntent().getStringExtra("type"); // "income" or "expense"
    if (type == null)
      type = "expense";

    TextView tvTitle = findViewById(R.id.tv_title);
    etAmount = findViewById(R.id.et_amount);
    spinnerCategory = findViewById(R.id.spinner_category);
    etDescription = findViewById(R.id.et_description);
    Button btnSave = findViewById(R.id.btn_save);

    // Set Title and Colors
    if ("income".equals(type)) {
      tvTitle.setText("Añadir Ingreso");
      tvTitle.setTextColor(getResources().getColor(R.color.colorIncome));
      btnSave.setBackgroundResource(R.drawable.button_background);
      btnSave.getBackground().setTint(getResources().getColor(R.color.colorIncome));
    } else {
      tvTitle.setText("Añadir Gasto");
      tvTitle.setTextColor(getResources().getColor(R.color.colorExpense));
      btnSave.setBackgroundResource(R.drawable.button_background);
      btnSave.getBackground().setTint(getResources().getColor(R.color.colorExpense));
    }

    // Setup Spinner
    // Use all categories for both types
    String[] categories = new String[] { "Nómina", "Comida", "Negocios", "Gasolina", "Ropa", "Salud", "Otros" };

    // Use a custom layout for spinner items if possible, or default but with white
    // text theme
    // For now stick to simple_spinner_dropdown_item but we might need a custom one
    // for text color
    ArrayAdapter<String> adapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_dropdown_item,
        categories) {
      @Override
      public View getView(int position, View convertView, android.view.ViewGroup parent) {
        TextView view = (TextView) super.getView(position, convertView, parent);
        view.setTextColor(getResources().getColor(R.color.colorTextWhite));
        return view;
      }

      @Override
      public View getDropDownView(int position, View convertView, android.view.ViewGroup parent) {
        TextView view = (TextView) super.getDropDownView(position, convertView, parent);
        view.setBackgroundColor(getResources().getColor(R.color.colorCardDark));
        view.setTextColor(getResources().getColor(R.color.colorTextWhite));
        return view;
      }
    };
    spinnerCategory.setAdapter(adapter);

    btnSave.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View v) {
        saveTransaction();
      }
    });
  }

  private void saveTransaction() {
    String amountStr = etAmount.getText().toString();
    if (amountStr.isEmpty()) {
      Toast.makeText(this, "Introduce una cantidad", Toast.LENGTH_SHORT).show();
      return;
    }

    double amount;
    try {
      amount = Double.parseDouble(amountStr);
    } catch (NumberFormatException e) {
      Toast.makeText(this, "Cantidad inválida", Toast.LENGTH_SHORT).show();
      return;
    }

    String category = spinnerCategory.getSelectedItem().toString();
    String description = etDescription.getText().toString();

    JSONObject transaction = new JSONObject();
    try {
      transaction.put("id", System.currentTimeMillis());
      transaction.put("amount", amount);
      transaction.put("type", type);
      transaction.put("category", category);
      transaction.put("description", description);
      // ISO 8601 Date format
      SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US);
      transaction.put("date", sdf.format(new Date()));

      saveToJsonFile(transaction);

      // Update Widget Data Immediately
      updateWidgetData(type, category, amount);

      Toast.makeText(this, "Guardado", Toast.LENGTH_SHORT).show();
      finish();
    } catch (JSONException e) {
      e.printStackTrace();
      Toast.makeText(this, "Error al crear transacción", Toast.LENGTH_SHORT).show();
    }
  }

  private void updateWidgetData(String type, String category, double amount) {
    // Determine key
    String key = "widget_" + type + "_categories"; // "widget_expense_categories" or "widget_income_categories"

    // Read SharedPrefs
    android.content.SharedPreferences prefs = getSharedPreferences("CapacitorStorage", MODE_PRIVATE);
    String jsonStr = prefs.getString(key, "{}");

    // Parse
    JSONObject json;
    try {
      // Handle double encoded string if necessary (common in Capacitor)
      if (jsonStr.startsWith("\"") && jsonStr.endsWith("\"")) {
        jsonStr = jsonStr.substring(1, jsonStr.length() - 1);
        jsonStr = jsonStr.replace("\\\"", "\"");
      }
      json = new JSONObject(jsonStr);
    } catch (Exception e) {
      json = new JSONObject();
    }

    // Update value
    try {
      double currentVal = json.optDouble(category, 0.0);
      json.put(category, currentVal + amount);

      // Save back
      // Note: Capacitor often saves as stringified JSON inside a string
      // We will save as simple JSON string for our native widget usage,
      // assuming the app can handle it or we re-encode if strictly needed.
      // For native widget compatibility, simple string is best.
      prefs.edit().putString(key, json.toString()).apply();

      // Trigger Widget Update
      android.content.Intent intent = new android.content.Intent(this, RadarWidget.class);
      intent.setAction(android.appwidget.AppWidgetManager.ACTION_APPWIDGET_UPDATE);
      int[] ids = android.appwidget.AppWidgetManager.getInstance(getApplication()).getAppWidgetIds(
          new android.content.ComponentName(getApplication(), RadarWidget.class));
      intent.putExtra(android.appwidget.AppWidgetManager.EXTRA_APPWIDGET_IDS, ids);
      sendBroadcast(intent);

      // Also update the Balance Widget
      // (Assuming Balance Widget listens to same or we update balance total manually
      // if needed)
      // For now, focusing on Radar Widget.

    } catch (JSONException e) {
      e.printStackTrace();
    }
  }

  private void saveToJsonFile(JSONObject newTransaction) {
    String filename = "pending_transactions.json";
    File file = new File(getFilesDir(), filename);
    JSONArray jsonArray = new JSONArray();

    // Read existing
    if (file.exists()) {
      try {
        FileInputStream fis = new FileInputStream(file);
        InputStreamReader inputStreamReader = new InputStreamReader(fis, StandardCharsets.UTF_8);
        StringBuilder stringBuilder = new StringBuilder();
        BufferedReader reader = new BufferedReader(inputStreamReader);
        String line = reader.readLine();
        while (line != null) {
          stringBuilder.append(line).append('\n');
          line = reader.readLine();
        }
        String contents = stringBuilder.toString();
        if (!contents.isEmpty()) {
          jsonArray = new JSONArray(contents);
        }
        fis.close();
      } catch (Exception e) {
        e.printStackTrace();
      }
    }

    // Add new
    jsonArray.put(newTransaction);

    // Write back
    try {
      FileOutputStream fos = new FileOutputStream(file);
      fos.write(jsonArray.toString().getBytes(StandardCharsets.UTF_8));
      fos.close();
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}
