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
    categories = new String[] { "Nómina", "Comida", "Negocios", "Gasolina", "Ropa", "Salud", "Otros" };

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

      Toast.makeText(this, "Guardado", Toast.LENGTH_SHORT).show();
      finish();
    } catch (JSONException e) {
      e.printStackTrace();
      Toast.makeText(this, "Error al crear transacción", Toast.LENGTH_SHORT).show();
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
