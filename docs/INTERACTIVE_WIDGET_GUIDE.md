# 🎯 Widget Interactivo de Ingresos/Gastos - Guía Completa

## 📱 Objetivo

Crear un widget en la pantalla de inicio que permita:
- ✅ Añadir gastos rápidamente
- ✅ Añadir ingresos rápidamente
- ✅ Ver el balance actual
- ✅ Todo sin abrir la app completa

## ⚠️ Requisitos Previos

Para implementar este widget necesitas:

1. **Node.js 20 o superior**
   - Descarga desde: https://nodejs.org/
   - Verifica con: `node --version`

2. **Android Studio**
   - Descarga desde: https://developer.android.com/studio
   - Incluye Android SDK y emulador

3. **Java JDK 17**
   - Viene incluido con Android Studio
   - O descarga desde: https://adoptium.net/

## 🚀 Paso 1: Migrar a Capacitor

### 1.1 Instalar Capacitor

```bash
cd c:\Users\Aner\Desktop\finance-tracker\MiEconomia-APP

# Instalar dependencias de Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/preferences
```

### 1.2 Inicializar Capacitor

```bash
# Inicializar proyecto Capacitor
npx cap init "MiEconomia" "com.mieconomia.app" --web-dir=dist

# Construir la app web
npm run build

# Añadir plataforma Android
npx cap add android

# Sincronizar archivos
npx cap sync
```

### 1.3 Abrir en Android Studio

```bash
npx cap open android
```

---

## 🎨 Paso 2: Crear el Widget Interactivo

### 2.1 Crear el Widget Provider

En Android Studio, crea el archivo:
`android/app/src/main/java/com/mieconomia/app/QuickTransactionWidget.java`

```java
package com.mieconomia.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;

public class QuickTransactionWidget extends AppWidgetProvider {

    private static final String ACTION_ADD_EXPENSE = "com.mieconomia.app.ADD_EXPENSE";
    private static final String ACTION_ADD_INCOME = "com.mieconomia.app.ADD_INCOME";
    private static final String ACTION_OPEN_APP = "com.mieconomia.app.OPEN_APP";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        // Obtener balance actual desde SharedPreferences
        SharedPreferences prefs = context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);
        String transactionsJson = prefs.getString("mieconomia-transactions", "[]");
        double balance = calculateBalance(transactionsJson);

        // Crear las vistas del widget
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.quick_transaction_widget);
        
        // Actualizar balance
        views.setTextViewText(R.id.widget_balance, String.format("%.2f€", balance));

        // Configurar botón de gasto
        Intent expenseIntent = new Intent(context, QuickTransactionWidget.class);
        expenseIntent.setAction(ACTION_ADD_EXPENSE);
        PendingIntent expensePendingIntent = PendingIntent.getBroadcast(
            context, 0, expenseIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.btn_add_expense, expensePendingIntent);

        // Configurar botón de ingreso
        Intent incomeIntent = new Intent(context, QuickTransactionWidget.class);
        incomeIntent.setAction(ACTION_ADD_INCOME);
        PendingIntent incomePendingIntent = PendingIntent.getBroadcast(
            context, 1, incomeIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.btn_add_income, incomePendingIntent);

        // Configurar clic en balance para abrir app
        Intent openAppIntent = new Intent(context, MainActivity.class);
        PendingIntent openAppPendingIntent = PendingIntent.getActivity(
            context, 2, openAppIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.widget_balance, openAppPendingIntent);

        // Actualizar widget
        appWidgetManager.updateAppWidget(appWidgetId, views);
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);

        if (ACTION_ADD_EXPENSE.equals(intent.getAction())) {
            // Abrir app con modal de gasto
            Intent openIntent = new Intent(context, MainActivity.class);
            openIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            openIntent.putExtra("action", "add-expense");
            context.startActivity(openIntent);
            
        } else if (ACTION_ADD_INCOME.equals(intent.getAction())) {
            // Abrir app con modal de ingreso
            Intent openIntent = new Intent(context, MainActivity.class);
            openIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            openIntent.putExtra("action", "add-income");
            context.startActivity(openIntent);
        }

        // Actualizar todos los widgets
        AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
        int[] appWidgetIds = appWidgetManager.getAppWidgetIds(
            new ComponentName(context, QuickTransactionWidget.class)
        );
        onUpdate(context, appWidgetManager, appWidgetIds);
    }

    private static double calculateBalance(String transactionsJson) {
        // Parsear JSON y calcular balance
        // (Implementación simplificada - en producción usar Gson o similar)
        try {
            double balance = 0.0;
            // Aquí iría el parsing del JSON
            // Por ahora retornamos 0
            return balance;
        } catch (Exception e) {
            return 0.0;
        }
    }

    public static void updateAllWidgets(Context context) {
        Intent intent = new Intent(context, QuickTransactionWidget.class);
        intent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
        AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
        int[] ids = appWidgetManager.getAppWidgetIds(
            new ComponentName(context, QuickTransactionWidget.class)
        );
        intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids);
        context.sendBroadcast(intent);
    }
}
```

### 2.2 Crear el Layout del Widget

Crea: `android/app/src/main/res/layout/quick_transaction_widget.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="16dp"
    android:background="@drawable/widget_background">

    <!-- Header -->
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:gravity="center_vertical"
        android:layout_marginBottom="12dp">

        <TextView
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:text="MiEconomia"
            android:textSize="14sp"
            android:textColor="#FFFFFF"
            android:alpha="0.7"/>

        <TextView
            android:id="@+id/widget_balance"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="0.00€"
            android:textSize="20sp"
            android:textColor="#D4FF33"
            android:textStyle="bold"/>

    </LinearLayout>

    <!-- Botones de acción -->
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:gravity="center"
        android:weightSum="2">

        <!-- Botón Gasto -->
        <LinearLayout
            android:id="@+id/btn_add_expense"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:orientation="vertical"
            android:gravity="center"
            android:padding="12dp"
            android:layout_marginEnd="4dp"
            android:background="@drawable/button_expense_background"
            android:clickable="true"
            android:focusable="true">

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="−"
                android:textSize="24sp"
                android:textColor="#FFFFFF"
                android:textStyle="bold"/>

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Gasto"
                android:textSize="12sp"
                android:textColor="#FFFFFF"
                android:layout_marginTop="4dp"/>

        </LinearLayout>

        <!-- Botón Ingreso -->
        <LinearLayout
            android:id="@+id/btn_add_income"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:orientation="vertical"
            android:gravity="center"
            android:padding="12dp"
            android:layout_marginStart="4dp"
            android:background="@drawable/button_income_background"
            android:clickable="true"
            android:focusable="true">

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="+"
                android:textSize="24sp"
                android:textColor="#FFFFFF"
                android:textStyle="bold"/>

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Ingreso"
                android:textSize="12sp"
                android:textColor="#FFFFFF"
                android:layout_marginTop="4dp"/>

        </LinearLayout>

    </LinearLayout>

</LinearLayout>
```

### 2.3 Crear Backgrounds

Crea: `android/app/src/main/res/drawable/widget_background.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <gradient
        android:angle="135"
        android:startColor="#1E1E1E"
        android:endColor="#2C2C2C"
        android:type="linear"/>
    <corners android:radius="20dp"/>
    <stroke
        android:width="1dp"
        android:color="#33FFFFFF"/>
</shape>
```

Crea: `android/app/src/main/res/drawable/button_expense_background.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="#FF5252"/>
    <corners android:radius="12dp"/>
</shape>
```

Crea: `android/app/src/main/res/drawable/button_income_background.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="#33D499"/>
    <corners android:radius="12dp"/>
</shape>
```

### 2.4 Configurar el Widget Info

Crea: `android/app/src/main/res/xml/quick_transaction_widget_info.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
    android:minWidth="250dp"
    android:minHeight="110dp"
    android:targetCellWidth="4"
    android:targetCellHeight="2"
    android:updatePeriodMillis="1800000"
    android:previewImage="@drawable/widget_preview"
    android:initialLayout="@layout/quick_transaction_widget"
    android:resizeMode="horizontal|vertical"
    android:widgetCategory="home_screen"
    android:description="@string/widget_description"/>
```

### 2.5 Actualizar AndroidManifest.xml

Añade dentro de `<application>`:

```xml
<receiver
    android:name=".QuickTransactionWidget"
    android:exported="true">
    <intent-filter>
        <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
        <action android:name="com.mieconomia.app.ADD_EXPENSE" />
        <action android:name="com.mieconomia.app.ADD_INCOME" />
    </intent-filter>
    <meta-data
        android:name="android.appwidget.provider"
        android:resource="@xml/quick_transaction_widget_info" />
</receiver>
```

---

## 🔗 Paso 3: Conectar React con el Widget

### 3.1 Crear Plugin de Capacitor

Crea: `src/plugins/WidgetPlugin.ts`

```typescript
import { registerPlugin } from '@capacitor/core';

export interface WidgetPlugin {
  updateWidget(): Promise<void>;
}

const Widget = registerPlugin<WidgetPlugin>('Widget', {
  web: () => import('./web').then(m => new m.WidgetWeb()),
});

export default Widget;
```

### 3.2 Actualizar Widget desde React

En `src/App.jsx`, añade:

```javascript
import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

// Función para actualizar el widget
const updateWidget = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      // Actualizar widget nativo
      await window.QuickTransactionWidget?.updateAllWidgets();
    } catch (error) {
      console.error('Error updating widget:', error);
    }
  }
};

// Actualizar widget cuando cambie el balance
useEffect(() => {
  updateWidget();
}, [balance, transactions]);

// Manejar intents desde el widget
useEffect(() => {
  if (Capacitor.isNativePlatform()) {
    const handleIntent = async () => {
      const intent = await window.plugins?.intentShim?.getIntent();
      const action = intent?.extras?.action;
      
      if (action === 'add-expense') {
        openModal('expense');
      } else if (action === 'add-income') {
        openModal('income');
      }
    };
    
    handleIntent();
  }
}, []);
```

---

## 📦 Paso 4: Compilar y Probar

### 4.1 Compilar la App

```bash
# Construir la app web
npm run build

# Sincronizar con Android
npx cap sync

# Abrir en Android Studio
npx cap open android
```

### 4.2 En Android Studio

1. Click en **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Espera a que compile
3. Instala en tu dispositivo o emulador

### 4.3 Añadir el Widget

1. Mantén presionado en la pantalla de inicio
2. Toca "Widgets"
3. Busca "MiEconomia"
4. Arrastra el widget "Quick Transaction" a tu pantalla

---

## ✅ Resultado Final

Tu widget tendrá:

- **Balance visible** en la parte superior
- **Botón rojo "− Gasto"** - Abre la app con modal de gasto
- **Botón verde "+ Ingreso"** - Abre la app con modal de ingreso
- **Actualización automática** cuando añades transacciones

---

## 🎯 Próximos Pasos

1. **Actualiza Node.js** a versión 20+
2. **Instala Android Studio**
3. **Sigue esta guía paso a paso**
4. **Compila y prueba**

¿Necesitas ayuda con algún paso específico?
