---
description: Cómo generar una APK descargable de la aplicación
---

# Generar APK de MiEconomia

## 🎯 Método Recomendado: Capacitor + Android Studio

Tu app ya está configurada con **Capacitor**, lo que te permite generar APKs nativas de alta calidad.

### Requisitos Previos:
1. **Android Studio** - [Descargar aquí](https://developer.android.com/studio)
2. **Java JDK 17** - [Descargar aquí](https://adoptium.net/)

---

## 📦 Pasos para Generar APK

### 1. Compilar la Aplicación Web

// turbo
```bash
npm run build
```

### 2. Sincronizar con Android

// turbo
```bash
npx cap sync android
```

### 3. Abrir en Android Studio

// turbo
```bash
npx cap open android
```

### 4. Generar APK en Android Studio

Una vez que Android Studio se abra:

1. **Espera a que Gradle termine de sincronizar** (primera vez puede tardar varios minutos)
   - Verás un mensaje "Gradle sync in progress..." en la parte inferior
   - Espera hasta que diga "Gradle sync finished"

2. **Generar APK de Debug (para pruebas rápidas):**
   - Ve a: `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
   - Espera a que termine la compilación
   - Click en "locate" en la notificación que aparece
   - La APK estará en: `android/app/build/outputs/apk/debug/app-debug.apk`

3. **Generar APK Firmada (para distribución):**
   - Ve a: `Build` → `Generate Signed Bundle / APK`
   - Selecciona: `APK`
   - Click en `Next`
   
   **Si es la primera vez:**
   - Click en `Create new...`
   - Elige una ubicación para tu keystore (ej: `C:\Users\TuUsuario\mieconomia-keystore.jks`)
   - Completa los datos:
     - **Password:** (elige una contraseña segura y guárdala)
     - **Alias:** `mieconomia`
     - **Password (alias):** (misma contraseña o diferente)
     - **Validity:** 25 años
     - **First and Last Name:** Tu nombre
     - **Organization:** MiEconomia
   - Click en `OK`
   
   **Si ya tienes keystore:**
   - Click en `Choose existing...`
   - Selecciona tu archivo `.jks`
   - Introduce las contraseñas
   
   - Selecciona build variant: `release`
   - Marca las casillas:
     - ✅ V1 (Jar Signature)
     - ✅ V2 (Full APK Signature)
   - Click en `Finish`

4. **Ubicación de la APK:**
   ```
   android/app/release/app-release.apk
   ```

---

## 🚀 Método Rápido: APK de Debug desde Terminal

Si solo quieres una APK rápida para pruebas:

```bash
# 1. Compilar la web
npm run build

# 2. Sincronizar con Android
npx cap sync android

# 3. Generar APK de debug
cd android
./gradlew assembleDebug
```

La APK estará en: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📱 Instalar la APK en tu Móvil

### Método 1: Transferencia Directa
1. Copia el archivo `.apk` a tu móvil (por USB, email, Drive, etc.)
2. Abre el archivo APK desde el explorador de archivos de tu móvil
3. Si aparece un mensaje de seguridad:
   - Toca "Configuración" o "Settings"
   - Activa "Permitir de esta fuente" o "Allow from this source"
   - Vuelve atrás y toca "Instalar"
4. ¡Listo! La app se instalará

### Método 2: ADB (Android Debug Bridge)
Si tienes el móvil conectado por USB con depuración USB activada:

```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🔄 Workflow Completo de Actualización

Cuando hagas cambios en tu app y quieras generar una nueva APK:

```bash
# 1. Compilar los cambios
npm run build

# 2. Sincronizar con Android
npx cap sync android

# 3. Abrir Android Studio y generar APK
npx cap open android
```

Luego en Android Studio: `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`

---

## ⚙️ Configuración Avanzada

### Cambiar el Nombre de la App
Edita: `android/app/src/main/res/values/strings.xml`
```xml
<string name="app_name">MiEconomia</string>
```

### Cambiar el Icono
Los iconos se generan automáticamente desde `public/pwa-512x512.png`

Para regenerar todos los recursos:
```bash
npx capacitor-assets generate
```

### Cambiar el Package Name
Edita: `capacitor.config.json`
```json
{
  "appId": "com.mieconomia.app"
}
```

### Incrementar la Versión
Edita: `android/app/build.gradle`
```gradle
android {
    defaultConfig {
        versionCode 2        // Incrementa este número
        versionName "1.1.0"  // Incrementa esta versión
    }
}
```

---

## 🐛 Solución de Problemas

### Error: "JAVA_HOME not set"
```bash
# Instala Java JDK 17 desde https://adoptium.net/
# Reinicia Android Studio después de instalar
```

### Error: "Android SDK not found"
1. Abre Android Studio
2. Ve a: `File` → `Settings` → `Appearance & Behavior` → `System Settings` → `Android SDK`
3. Instala Android SDK Platform 33 o superior
4. Click en `Apply`

### Error: "Gradle build failed"
```bash
# Limpia el proyecto
cd android
./gradlew clean
./gradlew build
```

### La app no se actualiza en el dispositivo
1. Desinstala la versión anterior de la app
2. Asegúrate de compilar y sincronizar:
   ```bash
   npm run build
   npx cap sync android
   ```
3. Genera una nueva APK

### Error: "Execution failed for task ':app:processDebugResources'"
Esto suele ocurrir por recursos duplicados. Ejecuta:
```bash
cd android
./gradlew clean
```

---

## 🌐 Métodos Alternativos (TWA - Trusted Web Activity)

Si prefieres no usar Capacitor, puedes generar una TWA que envuelve tu PWA:

### Método 1: Bubblewrap CLI

**Requisito:** Tu app debe estar desplegada en internet (ej: Vercel)

```bash
# Instalar Bubblewrap
npm install -g @bubblewrap/cli

# Inicializar TWA
bubblewrap init --manifest https://tu-app.vercel.app/manifest.webmanifest

# Construir APK
bubblewrap build
```

### Método 2: PWA Builder

1. Ve a [pwabuilder.com](https://www.pwabuilder.com/)
2. Introduce la URL de tu app desplegada
3. Click en "Start" → "Package For Stores" → "Android"
4. Descarga el paquete generado

---

## 📚 Recursos Adicionales

- [Documentación de Capacitor](https://capacitorjs.com/docs)
- [Guía de Android Studio](https://developer.android.com/studio/intro)
- [Publicar en Google Play](https://developer.android.com/distribute/console)
- Ver también: `docs/NATIVE_APP_GUIDE.md` para más detalles

---

## 💡 Consejos Importantes

- **Guarda tu keystore en un lugar seguro** - Si la pierdes, no podrás actualizar la app en Play Store
- **Anota las contraseñas** - Las necesitarás para cada actualización
- **Prueba en dispositivos reales** - Los emuladores no siempre reflejan el comportamiento real
- **Incrementa versionCode** - Cada nueva APK debe tener un versionCode mayor
- **Usa APK firmada para distribución** - Las APK de debug solo son para pruebas

---

¡Tu APK está lista para ser instalada! 🎉
