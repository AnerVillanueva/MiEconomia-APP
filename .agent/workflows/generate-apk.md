---
description: Cómo generar una APK descargable de la aplicación
---

# Generar APK de MiEconomia

Hay dos métodos para generar una APK descargable:

## Método 1: PWA Builder (Recomendado - Más Fácil)

1. Asegúrate de que la aplicación esté desplegada en Vercel o cualquier hosting HTTPS
2. Ve a https://www.pwabuilder.com/
3. Introduce la URL de tu aplicación desplegada
4. Haz clic en "Start" y espera a que analice tu PWA
5. Selecciona la opción "Android" 
6. Configura las opciones:
   - Package ID: `com.mieconomia.app`
   - App name: `MiEconomia`
   - Version: `1.0.0`
7. Haz clic en "Generate" para descargar la APK
8. La APK generada se puede instalar directamente en Android o subir a Google Play Store

## Método 2: Capacitor (Requiere Android Studio)

### Requisitos previos:
- Node.js >= 20.0.0
- Android Studio instalado
- Java JDK 17 o superior

### Pasos:

1. Actualiza Node.js a la versión 20 o superior desde https://nodejs.org/

2. Instala Capacitor:
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android --save-dev
```

3. Inicializa Capacitor:
```bash
npx cap init "MiEconomia" "com.mieconomia.app" --web-dir=dist
```

4. Construye la aplicación web:
```bash
npm run build
```

5. Añade la plataforma Android:
```bash
npx cap add android
```

6. Sincroniza los archivos:
```bash
npx cap sync
```

7. Abre el proyecto en Android Studio:
```bash
npx cap open android
```

8. En Android Studio:
   - Ve a Build > Build Bundle(s) / APK(s) > Build APK(s)
   - Espera a que se complete la compilación
   - La APK estará en `android/app/build/outputs/apk/debug/app-debug.apk`

## Método 3: GitHub Actions (Automatizado)

Puedes configurar GitHub Actions para que genere automáticamente la APK cada vez que hagas push. El archivo de workflow ya está configurado en `.github/workflows/build-apk.yml`.

Para usarlo:
1. Haz push de tus cambios a GitHub
2. Ve a la pestaña "Actions" en tu repositorio
3. Espera a que se complete el workflow
4. Descarga la APK desde los "Artifacts" del workflow
