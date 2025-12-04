# 📦 Cómo Publicar tu APK en GitHub Releases

## Paso a Paso con Imágenes

### 1️⃣ Preparar tu APK

Primero, asegúrate de tener tu archivo APK generado y renombrado correctamente:

- **Nombre del archivo:** `MiEconomia-v1.0.0.apk`
- **Ubicación:** Puede estar en cualquier lugar de tu computadora (no lo subas al repositorio)

---

### 2️⃣ Ir a tu Repositorio en GitHub

1. Abre tu navegador y ve a: `https://github.com/AnerVillanueva/MiEconomia-APP`
2. Asegúrate de haber hecho push de todos los cambios recientes

---

### 3️⃣ Crear un Nuevo Release

1. En la página principal de tu repositorio, busca el menú lateral derecho
2. Haz clic en **"Releases"** (o **"0 releases"** si es tu primer release)
3. Haz clic en el botón **"Create a new release"** o **"Draft a new release"**

---

### 4️⃣ Configurar el Release

Completa el formulario con los siguientes datos:

#### **Tag version** (Etiqueta de versión)
```
v1.0.0
```
- Haz clic en "Choose a tag" y escribe `v1.0.0`
- Selecciona "Create new tag: v1.0.0 on publish"

#### **Release title** (Título del release)
```
MiEconomia v1.0.0 - Lanzamiento Inicial 🚀
```

#### **Description** (Descripción)
Copia y pega esto:

```markdown
# 🎉 Primera Versión de MiEconomia

Tu gestor de finanzas personal ahora disponible para Android.

## ✨ Características

- 📊 **Seguimiento completo** de ingresos y gastos
- 📅 **Vista mensual y anual** con calendarios interactivos
- 💰 **Balance en tiempo real** actualizado automáticamente
- 🌙 **Modo oscuro** para mejor experiencia visual
- 📈 **Gráficos interactivos** para visualizar tus finanzas
- 🔍 **Búsqueda rápida** de transacciones
- 💾 **Datos locales** - Tu información permanece en tu dispositivo
- 📱 **Instalable** como app nativa en Android

## 📥 Instalación

1. Descarga el archivo `MiEconomia-v1.0.0.apk` 
2. Abre el archivo en tu dispositivo Android
3. Permite la instalación desde fuentes desconocidas si se solicita
4. ¡Disfruta de MiEconomia!

## 📖 Documentación

Para más información, consulta el [README](https://github.com/AnerVillanueva/MiEconomia-APP#readme)

## 🐛 Reportar Problemas

Si encuentras algún error, por favor [abre un issue](https://github.com/AnerVillanueva/MiEconomia-APP/issues/new)

---

**Tamaño del archivo:** ~10-15 MB  
**Versión mínima de Android:** 5.0 (API 21)  
**Última actualización:** 4 de diciembre de 2025
```

---

### 5️⃣ Adjuntar el Archivo APK

1. Busca la sección **"Attach binaries by dropping them here or selecting them"**
2. **Arrastra y suelta** tu archivo `MiEconomia-v1.0.0.apk` en esa área
   - O haz clic en "selecting them" para buscar el archivo en tu computadora
3. Espera a que se suba el archivo (verás una barra de progreso)
4. Una vez subido, verás el nombre del archivo listado

---

### 6️⃣ Publicar el Release

1. Asegúrate de que la casilla **"Set as the latest release"** esté marcada ✅
2. **NO marques** "Set as a pre-release" (a menos que sea una versión beta)
3. Haz clic en el botón verde **"Publish release"**

---

### 7️⃣ ¡Listo! 🎉

Tu APK ahora está disponible para descarga. Los usuarios podrán:

- Ver el release en: `https://github.com/AnerVillanueva/MiEconomia-APP/releases`
- Descargar directamente desde: `https://github.com/AnerVillanueva/MiEconomia-APP/releases/latest`
- El enlace en tu README funcionará automáticamente

---

## 🔄 Actualizar a una Nueva Versión

Cuando quieras publicar una actualización:

1. Genera una nueva APK con el nuevo número de versión
2. Repite los pasos anteriores con:
   - **Tag:** `v1.1.0` (o la versión que corresponda)
   - **Nombre del archivo:** `MiEconomia-v1.1.0.apk`
   - **Descripción:** Incluye un changelog con los cambios

---

## 💡 Consejos

- ✅ **Siempre usa versionado semántico:** v1.0.0, v1.1.0, v2.0.0
- ✅ **Incluye un changelog** detallado en cada release
- ✅ **Prueba la APK** antes de publicarla
- ✅ **No borres releases antiguos** - los usuarios pueden querer versiones anteriores
- ❌ **No subas APKs al repositorio** - usa solo Releases para archivos binarios

---

## 🆘 Solución de Problemas

### El archivo APK es demasiado grande
- GitHub permite archivos de hasta 2 GB en releases
- Si tu APK es mayor, considera optimizar el build

### No puedo crear el tag
- Asegúrate de que no exista ya un tag con ese nombre
- Usa un formato consistente: `v1.0.0`, `v1.1.0`, etc.

### El enlace de descarga no funciona
- Espera unos minutos después de publicar
- Verifica que el release esté marcado como "latest"
- Comprueba que el archivo se haya subido correctamente
