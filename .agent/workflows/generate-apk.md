---
description: Cómo generar una APK descargable de la aplicación
---

# Generar APK de MiEconomia

## ⚠️ Requisito Previo: Desplegar la Aplicación

Antes de generar la APK, **debes desplegar tu aplicación en internet con HTTPS**. 

### Desplegar en Vercel (Gratis):
1. Ve a [vercel.com](https://vercel.com) e inicia sesión con GitHub
2. Haz clic en "Add New Project"
3. Selecciona el repositorio `MiEconomia-APP`
4. Haz clic en "Deploy"
5. Copia la URL generada (ej: `https://mi-economia-app.vercel.app`)

---

## Método 1: GoNative.io (⭐ RECOMENDADO - Más Fácil)

**Ventajas:** No requiere instalaciones, interfaz visual, APK lista en minutos.

### Pasos:
1. Ve a [gonative.io](https://gonative.io)
2. Crea una cuenta gratuita
3. Haz clic en "Create New App"
4. Introduce los datos:
   - **App Name:** MiEconomia
   - **Website URL:** [Tu URL de Vercel]
   - **Package Name:** com.mieconomia.app
5. En la sección "Design":
   - Sube el icono desde `public/pwa-512x512.png`
   - Configura colores si deseas
6. En "Settings":
   - Activa "Full Screen Mode"
   - Activa "Hide Navigation Bar"
7. Haz clic en "Build" → "Android"
8. Espera 5-10 minutos
9. Descarga la APK generada

**Nota:** La versión gratuita incluye una pequeña marca de agua de GoNative.

---

## Método 2: WebToAPK.com (Gratis, Sin Registro)

**Ventajas:** Rápido, sin necesidad de cuenta.

### Pasos:
1. Ve a [webtoapk.com](https://webtoapk.com)
2. Introduce:
   - **Website URL:** [Tu URL de Vercel]
   - **App Name:** MiEconomia
   - **Package Name:** com.mieconomia.app
3. Sube el icono desde `public/pwa-512x512.png`
4. Haz clic en "Generate APK"
5. Descarga la APK cuando esté lista

---

## Método 3: Bubblewrap CLI (Para Desarrolladores)

**Ventajas:** APK oficial de Google, sin marcas de agua, control total.

**Requisitos:**
- Node.js instalado
- Java JDK 11 o superior
- Android SDK

### Pasos:

// turbo
1. Instala Bubblewrap globalmente:
```bash
npm install -g @bubblewrap/cli
```

2. Inicializa el proyecto TWA:
```bash
bubblewrap init --manifest https://[TU-URL-VERCEL]/manifest.webmanifest
```

3. Responde las preguntas:
   - **Domain:** [tu-dominio.vercel.app]
   - **Application Name:** MiEconomia
   - **Package ID:** com.mieconomia.app
   - **Key path:** Presiona Enter para generar una nueva

4. Construye la APK:
```bash
bubblewrap build
```

5. La APK estará en `app-release-signed.apk`

---

## Método 4: Android Studio + TWA (Avanzado)

**Ventajas:** Control total, personalización completa, publicable en Play Store.

**Requisitos:**
- Android Studio instalado
- Java JDK 17+

### Pasos:

1. Abre Android Studio
2. File → New → New Project
3. Selecciona "Empty Activity"
4. Configura:
   - **Name:** MiEconomia
   - **Package name:** com.mieconomia.app
   - **Language:** Java
   - **Minimum SDK:** API 21
5. Haz clic en "Finish"

6. Edita `build.gradle` (Module: app) y añade:
```gradle
dependencies {
    implementation 'com.google.androidbrowserhelper:androidbrowserhelper:2.5.0'
}
```

7. Edita `AndroidManifest.xml` y reemplaza el contenido con el archivo en `android-twa/AndroidManifest.xml` (reemplaza `YOUR_VERCEL_URL_HERE` con tu URL)

8. Sincroniza el proyecto (Sync Now)

9. Build → Build Bundle(s) / APK(s) → Build APK(s)

10. La APK estará en `app/build/outputs/apk/debug/app-debug.apk`

---

## 📱 Instalar la APK en Android

1. Transfiere el archivo `.apk` a tu teléfono
2. Abre el archivo en tu teléfono
3. Permite "Instalar desde fuentes desconocidas" si se solicita
4. Instala la aplicación
5. ¡Listo!

---

## 🔧 Solución de Problemas

### PWA Builder no acepta mi app:
- Verifica que tu app esté desplegada con HTTPS
- Asegúrate de que el `manifest.json` sea accesible
- Comprueba que los iconos estén en las rutas correctas

### La APK no se instala:
- Verifica que hayas habilitado "Fuentes desconocidas"
- Asegúrate de que la APK no esté corrupta
- Intenta con otro método de generación

### La app muestra una página en blanco:
- Verifica que la URL en la configuración sea correcta
- Asegúrate de que la app esté desplegada y accesible
- Comprueba que el manifest.json tenga la configuración correcta
