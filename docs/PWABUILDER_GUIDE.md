# 📱 Guía de Generación de APK con PWABuilder

Esta es la forma recomendada de convertir tu PWA en una App Android nativa que soporte **Shortcuts** y otras funciones del sistema.

## 1. Preparación
Asegúrate de que tu última versión está desplegada en Vercel.
- Verifica que `manifest.json` tiene los shortcuts (ya lo hicimos).
- Verifica que los iconos existen (ya lo hicimos).

## 2. Generar la APK

1. Ve a **[https://www.pwabuilder.com/](https://www.pwabuilder.com/)**
2. Introduce la URL de tu aplicación (ej: `https://tu-app.vercel.app`)
3. Haz clic en **Start**.

## 3. Verificar Requisitos
PWABuilder analizará tu sitio. Deberías ver:
- **Manifest**: ✅ (Con puntuación alta)
- **Service Worker**: ✅
- **Security**: ✅

Si ves algún aviso en amarillo en "Manifest", asegúrate de que detecta los iconos y los shortcuts.

## 4. Empaquetar para Android

1. Haz clic en el botón **Package for Stores** (arriba a la derecha).
2. Selecciona **Android**.
3. En el formulario que aparece:
   - **App Name**: MiEconomia (o el que prefieras)
   - **Launcher Icon**: Debería detectarlo automáticamente.
   - **Maskable Icon**: Debería detectarlo automáticamente.
   - **Signing Key**: Selecciona "Generate new" (o usa una existente si ya tienes).
     - *Nota: Guarda bien el archivo de clave (.keystore) que te den si planeas subirla a la Play Store en el futuro.*

4. Haz clic en **Generate**.

## 5. Descargar e Instalar

1. Descarga el archivo ZIP generado.
2. Descomprímelo.
3. Busca el archivo que termina en **`.apk`** (generalmente en una carpeta llamada `apk` o `universal`).
4. Pásalo a tu móvil e instálalo.

## 🔄 Actualizaciones Futuras

- **Cambios de Código**: NO necesitas volver aquí. Solo haz `git push`.
- **Cambios de Icono/Nombre/Shortcuts**: SÍ necesitas volver aquí y regenerar la APK.
