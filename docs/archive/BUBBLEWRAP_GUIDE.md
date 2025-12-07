# Guía para Generar APK con Bubblewrap CLI

## Requisitos Previos

1. **Java JDK** (versión 8 o superior)
   - Descarga: https://adoptium.net/
   - Verifica: `java -version`

2. **Android SDK** (opcional pero recomendado)
   - Se puede instalar automáticamente con Bubblewrap

## Pasos para Generar la APK

### 1. Instalar Bubblewrap

```bash
npm install -g @bubblewrap/cli
```

### 2. Inicializar el Proyecto TWA

```bash
bubblewrap init --manifest https://mi-economia-app.vercel.app/manifest.json
```

Responde a las preguntas:
- **Domain**: `mi-economia-app.vercel.app`
- **Application name**: `MiEconomia`
- **Short name**: `MiEconomia`
- **Application ID**: `com.mieconomia.app`
- **Display mode**: `standalone`
- **Orientation**: `portrait`
- **Theme color**: `#D4FF33`
- **Background color**: `#121212`
- **Start URL**: `/`
- **Icon URL**: `https://mi-economia-app.vercel.app/pwa-512x512.png`
- **Maskable icon URL**: `https://mi-economia-app.vercel.app/pwa-512x512.png`
- **Shortcuts**: `Yes` (detectará automáticamente del manifest)

### 3. Construir la APK

```bash
bubblewrap build
```

Esto:
- Descargará las dependencias necesarias
- Generará la APK firmada
- La guardará en `app-release-signed.apk`

### 4. Instalar en tu Móvil

```bash
# Opción 1: Copiar manualmente
# La APK estará en: ./app-release-signed.apk

# Opción 2: Instalar directamente (si tienes el móvil conectado por USB)
adb install app-release-signed.apk
```

## Solución de Problemas

### Error: "Java not found"
```bash
# Instala Java JDK 17
# Windows: Descarga de https://adoptium.net/
# Verifica: java -version
```

### Error: "Android SDK not found"
```bash
# Bubblewrap puede instalarlo automáticamente
# O descarga Android Studio: https://developer.android.com/studio
```

### Error: "Signing failed"
```bash
# Genera una nueva clave de firma
bubblewrap build --skipSigning
# Luego firma manualmente con jarsigner
```

## Alternativa Rápida: APK sin Firmar (Solo para Pruebas)

Si solo quieres probar rápidamente:

```bash
bubblewrap build --skipSigning
```

Esto genera una APK sin firmar que puedes instalar para pruebas (no para publicar en Play Store).

## Ventajas de Bubblewrap sobre PWABuilder

✅ Herramienta oficial de Google
✅ Mejor compatibilidad con Android
✅ APKs más confiables
✅ Soporte completo para shortcuts
✅ Actualizaciones automáticas del contenido web
✅ Mejor integración con Android

## Próximos Pasos

Una vez que tengas la APK generada:

1. Instálala en tu móvil
2. Prueba los shortcuts (mantén presionado el icono)
3. Verifica que todo funcione correctamente
4. Sube la APK a GitHub Releases (ver releases/HOW_TO_CREATE_RELEASE.md)
