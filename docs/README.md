# 📚 Índice de Documentación - MiEconomia

Bienvenido a la documentación de **MiEconomia**. Esta carpeta contiene toda la documentación necesaria para desarrollar, compilar y distribuir la aplicación.

---

## 🚀 Inicio Rápido

¿Primera vez aquí? Empieza por estos archivos en orden:

1. **[../START_HERE.md](../START_HERE.md)** ⭐ - Inicio rápido para generar tu primera APK
2. **[guides/CHECKLIST.md](guides/CHECKLIST.md)** - Checklist paso a paso
3. **[guides/NATIVE_APP_GUIDE.md](guides/NATIVE_APP_GUIDE.md)** - Guía completa

---

## 📂 Estructura de la Documentación

### 📖 [guides/](guides/) - Guías Principales

Documentación esencial para el desarrollo de la app nativa:

- **[NATIVE_APP_GUIDE.md](guides/NATIVE_APP_GUIDE.md)** - Guía completa de desarrollo nativo
  - Requisitos y configuración
  - Generación de APK e IPA
  - Personalización
  - Solución de problemas
  - Publicación en tiendas

- **[ANDROID_STUDIO_GUIDE.md](guides/ANDROID_STUDIO_GUIDE.md)** - Guía visual de Android Studio
  - Paso a paso con instrucciones detalladas
  - Generar APK firmada
  - Configuración avanzada
  - Atajos de teclado

- **[CHECKLIST.md](guides/CHECKLIST.md)** - Checklist interactivo
  - Lista de verificación completa
  - Requisitos previos
  - Proceso de generación de APK
  - Instalación en móvil

- **[SETUP_SUMMARY.md](guides/SETUP_SUMMARY.md)** - Resumen de configuración
  - Todos los cambios realizados
  - Scripts disponibles
  - Comandos útiles
  - Próximos pasos

---

### 🛠️ [tools/](tools/) - Herramientas de Desarrollo

Herramientas HTML interactivas opcionales:

- **generate-icons.html** - Generador de iconos
- **apk-generator-guide.html** - Guía interactiva para APK
- **widget-preview.html** - Vista previa de widgets

> 💡 **Nota:** Estas herramientas son opcionales. Puedes ignorar esta carpeta si no las necesitas.

---

### 📦 [archive/](archive/) - Documentación Archivada

Métodos alternativos y características experimentales:

- **BUBBLEWRAP_GUIDE.md** - Método alternativo con Bubblewrap CLI
- **PWABUILDER_GUIDE.md** - Método alternativo con PWA Builder
- **WIDGETS_GUIDE.md** - Guías de widgets (experimental)
- **INTERACTIVE_WIDGET_GUIDE.md** - Widgets interactivos (experimental)
- **WIDGET_ACTION_PLAN.md** - Plan de acción para widgets

> ⚠️ **Nota:** Estos archivos están archivados porque representan métodos alternativos o características no implementadas actualmente.

---

## 🎯 Guías por Objetivo

### Quiero generar mi primera APK
1. Lee: [../START_HERE.md](../START_HERE.md)
2. Sigue: [guides/CHECKLIST.md](guides/CHECKLIST.md)
3. Ejecuta: `npm run apk:debug`

### Quiero generar una APK firmada para distribución
1. Lee: [guides/ANDROID_STUDIO_GUIDE.md](guides/ANDROID_STUDIO_GUIDE.md)
2. Sigue la sección "Generar APK Firmada"
3. Guarda tu keystore en un lugar seguro

### Tengo un problema o error
1. Consulta: [guides/NATIVE_APP_GUIDE.md - Solución de Problemas](guides/NATIVE_APP_GUIDE.md#-solución-de-problemas)
2. Revisa: [guides/ANDROID_STUDIO_GUIDE.md - Solución de Problemas](guides/ANDROID_STUDIO_GUIDE.md#-solución-de-problemas-en-android-studio)

### Quiero personalizar la app
1. Lee: [guides/NATIVE_APP_GUIDE.md - Configuración](guides/NATIVE_APP_GUIDE.md#-configuración)
2. Edita `capacitor.config.json`
3. Ejecuta `npm run cap:sync`

### Quiero publicar en Google Play Store
1. Lee: [guides/NATIVE_APP_GUIDE.md - Publicar en Tiendas](guides/NATIVE_APP_GUIDE.md#-publicar-en-tiendas)
2. Genera APK firmada
3. Sigue los pasos de Google Play Console

### Prefiero un método alternativo (sin Capacitor)
1. Consulta: [archive/BUBBLEWRAP_GUIDE.md](archive/BUBBLEWRAP_GUIDE.md) - Para TWA
2. O consulta: [archive/PWABUILDER_GUIDE.md](archive/PWABUILDER_GUIDE.md) - Para método web

---

## 📋 Workflows Automatizados

Además de esta documentación, hay workflows en `.agent/workflows/`:

- **[../.agent/workflows/generate-apk.md](../.agent/workflows/generate-apk.md)** - Workflow completo para generar APK
- **[../.agent/workflows/deployment.md](../.agent/workflows/deployment.md)** - Cómo desplegar la app en Vercel

---

## 🔍 Búsqueda Rápida

| Busco... | Archivo |
|----------|---------|
| Inicio rápido | [../START_HERE.md](../START_HERE.md) |
| Checklist completo | [guides/CHECKLIST.md](guides/CHECKLIST.md) |
| Guía completa | [guides/NATIVE_APP_GUIDE.md](guides/NATIVE_APP_GUIDE.md) |
| Android Studio | [guides/ANDROID_STUDIO_GUIDE.md](guides/ANDROID_STUDIO_GUIDE.md) |
| Resumen de cambios | [guides/SETUP_SUMMARY.md](guides/SETUP_SUMMARY.md) |
| Solución de problemas | [guides/NATIVE_APP_GUIDE.md#-solución-de-problemas](guides/NATIVE_APP_GUIDE.md#-solución-de-problemas) |
| Métodos alternativos | [archive/](archive/) |
| Herramientas HTML | [tools/](tools/) |

---

## 💡 Consejos

- **Empieza por START_HERE.md** - Es el punto de entrada más rápido
- **Usa el CHECKLIST.md** - Te guía paso a paso sin perderte
- **Consulta NATIVE_APP_GUIDE.md** - Para información detallada
- **Revisa archive/** - Solo si Capacitor no funciona para ti

---

## 📞 Soporte

Si tienes problemas:
1. Revisa la sección de solución de problemas en las guías
2. Consulta los archivos archivados para métodos alternativos
3. Abre un issue en el repositorio

---

<div align="center">

**¿Listo para empezar?**

[⬆ Volver al README principal](../README.md) | [🚀 Ir a START_HERE.md](../START_HERE.md)

</div>
