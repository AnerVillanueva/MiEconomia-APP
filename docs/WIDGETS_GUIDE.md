# 📱 Implementar Widgets en MiEconomia

## ⚠️ Importante: Limitaciones de PWA/GoNative

**Las PWAs empaquetadas con GoNative NO pueden crear widgets nativos** porque:
- Los widgets requieren código nativo de Android (Java/Kotlin)
- Las PWAs solo tienen acceso a APIs web, no a APIs nativas de Android
- GoNative es un contenedor web, no genera código nativo

## ✅ Soluciones Disponibles

### Opción 1: Migrar a Capacitor (Recomendado) ⭐

Capacitor te permite mantener tu código React y añadir funcionalidades nativas como widgets.

#### Ventajas:
- ✅ Widgets nativos de Android
- ✅ Acceso completo a APIs nativas
- ✅ Mantiene tu código React actual
- ✅ Publicable en Google Play Store
- ✅ Mejor rendimiento que PWA

#### Desventajas:
- ⚠️ Requiere Node.js 20+
- ⚠️ Requiere Android Studio
- ⚠️ Más complejo de configurar

#### Pasos para Implementar:

##### 1. Actualizar Node.js
```bash
# Descarga e instala Node.js 20 LTS desde:
# https://nodejs.org/
```

##### 2. Instalar Capacitor
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
```

##### 3. Inicializar Capacitor
```bash
npx cap init "MiEconomia" "com.mieconomia.app" --web-dir=dist
```

##### 4. Añadir plataforma Android
```bash
npm run build
npx cap add android
npx cap sync
```

##### 5. Crear el Widget

Abre el proyecto en Android Studio:
```bash
npx cap open android
```

En Android Studio, crea un nuevo Widget:
1. Click derecho en `app/java/com.mieconomia.app`
2. New → Widget → App Widget
3. Nombra el widget: `BalanceWidget`

##### 6. Código del Widget (Java)

Crea `BalanceWidget.java`:

```java
package com.mieconomia.app;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.SharedPreferences;
import android.widget.RemoteViews;

public class BalanceWidget extends AppWidgetProvider {

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager,
                                int appWidgetId) {
        
        // Obtener datos del localStorage (compartido desde la WebView)
        SharedPreferences prefs = context.getSharedPreferences("mieconomia", Context.MODE_PRIVATE);
        String balance = prefs.getString("balance", "0.00");
        
        // Crear las vistas del widget
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.balance_widget);
        views.setTextViewText(R.id.widget_balance, balance + "€");
        
        // Actualizar el widget
        appWidgetManager.updateAppWidget(appWidgetId, views);
    }

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }
}
```

##### 7. Layout del Widget (XML)

Crea `res/layout/balance_widget.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="16dp"
    android:background="@drawable/widget_background">

    <TextView
        android:id="@+id/widget_title"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Balance Total"
        android:textSize="14sp"
        android:textColor="#FFFFFF"
        android:alpha="0.7"/>

    <TextView
        android:id="@+id/widget_balance"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="0.00€"
        android:textSize="32sp"
        android:textColor="#D4FF33"
        android:textStyle="bold"
        android:layout_marginTop="8dp"/>

</LinearLayout>
```

##### 8. Comunicación entre React y Widget

En tu código React, guarda datos para el widget:

```javascript
// src/utils/widgetBridge.js
export const updateWidget = (balance) => {
  if (window.Capacitor && window.Capacitor.Plugins.Preferences) {
    window.Capacitor.Plugins.Preferences.set({
      key: 'balance',
      value: balance.toString()
    });
    
    // Notificar al widget que se actualice
    if (window.WidgetBridge) {
      window.WidgetBridge.updateWidget();
    }
  }
};

// Usar en tu componente
import { updateWidget } from './utils/widgetBridge';

// Cuando el balance cambie:
useEffect(() => {
  updateWidget(balance);
}, [balance]);
```

---

### Opción 2: Usar React Native (Alternativa Completa)

Si quieres funcionalidades nativas avanzadas, considera migrar a React Native.

#### Ventajas:
- ✅ Widgets nativos completos
- ✅ Máximo rendimiento
- ✅ Acceso a todas las APIs nativas
- ✅ Comunidad muy grande

#### Desventajas:
- ❌ Requiere reescribir parte del código
- ❌ Curva de aprendizaje más alta
- ❌ Más tiempo de desarrollo

#### Pasos Básicos:

```bash
# 1. Crear proyecto React Native
npx react-native init MiEconomia

# 2. Copiar tu lógica de negocio
# (componentes, hooks, utils)

# 3. Instalar librería de widgets
npm install react-native-android-widget

# 4. Configurar widget según documentación
```

---

### Opción 3: Shortcuts de Android (Limitado)

Si solo necesitas acceso rápido a funciones, usa **App Shortcuts** (disponible en PWAs).

#### Ventajas:
- ✅ Funciona con tu APK actual de GoNative
- ✅ No requiere código nativo
- ✅ Fácil de implementar

#### Desventajas:
- ❌ No es un widget visual
- ❌ Solo accesos directos en el menú largo-press

#### Implementación:

Actualiza tu `manifest.json`:

```json
{
  "name": "MiEconomia",
  "short_name": "MiEconomia",
  "shortcuts": [
    {
      "name": "Añadir Gasto",
      "short_name": "Gasto",
      "description": "Registrar un nuevo gasto rápidamente",
      "url": "/?action=add-expense",
      "icons": [
        {
          "src": "/icons/expense-shortcut.png",
          "sizes": "192x192"
        }
      ]
    },
    {
      "name": "Añadir Ingreso",
      "short_name": "Ingreso",
      "description": "Registrar un nuevo ingreso",
      "url": "/?action=add-income",
      "icons": [
        {
          "src": "/icons/income-shortcut.png",
          "sizes": "192x192"
        }
      ]
    },
    {
      "name": "Ver Balance",
      "short_name": "Balance",
      "description": "Ver balance actual",
      "url": "/?view=balance",
      "icons": [
        {
          "src": "/icons/balance-shortcut.png",
          "sizes": "192x192"
        }
      ]
    }
  ]
}
```

Luego maneja las acciones en tu App.jsx:

```javascript
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const action = params.get('action');
  
  if (action === 'add-expense') {
    openModal('expense');
  } else if (action === 'add-income') {
    openModal('income');
  }
}, []);
```

---

## 📊 Comparación de Opciones

| Característica | Capacitor | React Native | Shortcuts |
|----------------|-----------|--------------|-----------|
| Widget Visual | ✅ Sí | ✅ Sí | ❌ No |
| Complejidad | Media | Alta | Baja |
| Mantiene código actual | ✅ Sí | ⚠️ Parcial | ✅ Sí |
| Requiere Node 20+ | ✅ Sí | ✅ Sí | ❌ No |
| Requiere Android Studio | ✅ Sí | ✅ Sí | ❌ No |
| Tiempo implementación | 2-3 días | 1-2 semanas | 1 hora |

---

## 🎯 Recomendación

Para MiEconomia, recomiendo:

### Corto Plazo (Ahora):
**Implementar Shortcuts** (Opción 3)
- Rápido de implementar
- Funciona con tu APK actual
- Mejora la experiencia del usuario

### Largo Plazo (Futuro):
**Migrar a Capacitor** (Opción 1)
- Cuando actualices Node.js a v20+
- Te permitirá añadir widgets reales
- Mantiene tu código React actual
- Más funcionalidades nativas disponibles

---

## 🚀 Siguiente Paso

¿Quieres que implemente los **Shortcuts** ahora (rápido y fácil)?

O prefieres que prepare la migración a **Capacitor** para tener widgets completos (requiere actualizar Node.js primero)?
