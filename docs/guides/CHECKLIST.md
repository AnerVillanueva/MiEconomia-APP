# 📋 Checklist: Generar tu Primera APK

## ✅ Requisitos Previos

### Software Necesario

- [ ] **Node.js 18+** instalado
  - Verifica: `node --version`
  - Si no: [Descargar Node.js](https://nodejs.org/)

- [ ] **npm** instalado
  - Verifica: `npm --version`
  - Viene con Node.js

- [ ] **Java JDK 17+** instalado (solo para APK firmada)
  - Verifica: `java -version`
  - Si no: [Descargar JDK](https://adoptium.net/)

- [ ] **Android Studio** instalado (solo para APK firmada)
  - Si no: [Descargar Android Studio](https://developer.android.com/studio)

### Proyecto

- [ ] Dependencias instaladas
  ```bash
  npm install
  ```

- [ ] Build exitosa
  ```bash
  npm run build
  ```

---

## 🚀 Método 1: APK de Debug (Rápido - 5 minutos)

### Pasos

- [ ] **1. Ejecutar el comando**
  ```bash
  npm run apk:debug
  ```

- [ ] **2. Esperar a que termine** (puede tardar 2-5 minutos la primera vez)

- [ ] **3. Verificar que se generó**
  - Ubicación: `android/app/build/outputs/apk/debug/app-debug.apk`
  - Tamaño: ~10-20 MB

- [ ] **4. Transferir a tu móvil**
  - Por USB, email, Drive, etc.

- [ ] **5. Instalar en el móvil**
  - Abrir el archivo APK
  - Permitir instalación de fuentes desconocidas
  - Instalar

- [ ] **6. ¡Probar la app!**

---

## 🏆 Método 2: APK Firmada (Para Distribución - 15-30 minutos)

### Preparación

- [ ] **1. Abrir Android Studio**
  ```bash
  npm run cap:open:android
  ```

- [ ] **2. Esperar sincronización de Gradle**
  - Verás "Gradle sync in progress..."
  - Espera hasta "Gradle sync finished"

### Crear Keystore (Solo la primera vez)

- [ ] **3. Ir a Build → Generate Signed Bundle / APK**

- [ ] **4. Seleccionar APK → Next**

- [ ] **5. Click en "Create new..."**

- [ ] **6. Completar información:**
  - [ ] Key store path: `C:\Users\TuUsuario\mieconomia-keystore.jks`
  - [ ] Password: [tu-contraseña] ⚠️ **¡ANÓTALA!**
  - [ ] Alias: `mieconomia`
  - [ ] Password (alias): [tu-contraseña] ⚠️ **¡ANÓTALA!**
  - [ ] Validity: `25` años
  - [ ] First and Last Name: [tu nombre]
  - [ ] Organization: `MiEconomia`

- [ ] **7. Click OK**

### Generar APK

- [ ] **8. Click Next**

- [ ] **9. Configurar:**
  - [ ] Build variant: `release`
  - [ ] ✅ V1 (Jar Signature)
  - [ ] ✅ V2 (Full APK Signature)

- [ ] **10. Click Finish**

- [ ] **11. Esperar compilación** (2-5 minutos)

- [ ] **12. Verificar APK generada**
  - Ubicación: `android/app/release/app-release.apk`
  - Tamaño: ~8-15 MB (más pequeña que debug)

### Guardar Keystore (¡MUY IMPORTANTE!)

- [ ] **13. Hacer backup del archivo `.jks`**
  - Copia `mieconomia-keystore.jks` a un lugar seguro
  - USB, Drive, email a ti mismo, etc.

- [ ] **14. Guardar contraseñas**
  - Anota las contraseñas en un lugar seguro
  - Las necesitarás para cada actualización

---

## 📱 Instalación en el Móvil

### Preparar el Móvil

- [ ] **1. Habilitar instalación de fuentes desconocidas**
  - Ajustes → Seguridad
  - Activar "Fuentes desconocidas" o "Instalar apps desconocidas"

### Instalar

- [ ] **2. Transferir APK al móvil**
  - Método USB, email, Drive, etc.

- [ ] **3. Abrir el archivo APK**
  - Desde el explorador de archivos
  - O desde la app de descargas

- [ ] **4. Permitir instalación**
  - Si aparece advertencia de seguridad
  - Toca "Configuración" → Activar → Volver

- [ ] **5. Instalar**
  - Toca "Instalar"
  - Espera a que termine

- [ ] **6. Abrir la app**
  - Toca "Abrir"
  - O busca "MiEconomia" en tu cajón de apps

---

## 🧪 Pruebas

### Funcionalidad Básica

- [ ] La app abre correctamente
- [ ] Se ve el splash screen
- [ ] La interfaz se muestra bien
- [ ] Puedes agregar transacciones
- [ ] Las transacciones se guardan
- [ ] La navegación funciona
- [ ] Los gráficos se muestran

### Funcionalidad Nativa

- [ ] El botón de retroceso funciona
- [ ] La app no se cierra inesperadamente
- [ ] La barra de estado tiene el color correcto
- [ ] La app se ve en pantalla completa
- [ ] Los datos persisten al cerrar y abrir

---

## 🔄 Actualizar la App

### Cuando hagas cambios en el código:

- [ ] **1. Hacer cambios en el código**

- [ ] **2. Compilar**
  ```bash
  npm run build
  ```

- [ ] **3. Sincronizar**
  ```bash
  npm run cap:sync android
  ```

- [ ] **4. Incrementar versión**
  - Editar `android/app/build.gradle`
  - Incrementar `versionCode` (ej: de 1 a 2)
  - Incrementar `versionName` (ej: de "1.0.0" a "1.0.1")

- [ ] **5. Generar nueva APK**
  ```bash
  npm run apk:debug
  # o
  npm run cap:open:android
  ```

- [ ] **6. Desinstalar versión anterior del móvil**

- [ ] **7. Instalar nueva versión**

---

## 🐛 Solución de Problemas

### La APK no se genera

- [ ] Verificar que `npm run build` funcione
- [ ] Limpiar proyecto:
  ```bash
  cd android
  ./gradlew clean
  cd ..
  npm run build:native
  ```

### Error de Java

- [ ] Verificar que Java esté instalado: `java -version`
- [ ] Instalar JDK 17 desde [adoptium.net](https://adoptium.net/)
- [ ] Reiniciar terminal/Android Studio

### Error de Gradle

- [ ] En Android Studio: File → Invalidate Caches / Restart
- [ ] Esperar a que reinicie
- [ ] Intentar de nuevo

### La app no se instala en el móvil

- [ ] Verificar que "Fuentes desconocidas" esté activado
- [ ] Desinstalar versión anterior si existe
- [ ] Verificar que la APK no esté corrupta (tamaño > 0 MB)
- [ ] Intentar con otra APK

### La app se cierra inmediatamente

- [ ] Verificar logs en Android Studio
- [ ] Generar APK de debug para ver errores
- [ ] Verificar que `npm run dev` funcione sin errores

---

## 📊 Verificación Final

### Antes de Distribuir

- [ ] La app funciona correctamente en tu móvil
- [ ] Has probado todas las funcionalidades
- [ ] Has probado en diferentes tamaños de pantalla
- [ ] Has guardado tu keystore en un lugar seguro
- [ ] Has anotado todas las contraseñas
- [ ] Has incrementado el versionCode
- [ ] La APK es de tipo "release" (no debug)

---

## 🎯 Próximos Pasos

### Después de tu Primera APK

- [ ] Compartir con amigos/familia para pruebas
- [ ] Recopilar feedback
- [ ] Hacer mejoras
- [ ] Generar nueva versión
- [ ] (Opcional) Publicar en Google Play Store

---

## 📚 Recursos

| Documento | Para qué sirve |
|-----------|----------------|
| **START_HERE.md** | Inicio rápido |
| **docs/SETUP_SUMMARY.md** | Resumen completo |
| **docs/NATIVE_APP_GUIDE.md** | Guía completa |
| **docs/ANDROID_STUDIO_GUIDE.md** | Guía visual de Android Studio |
| **.agent/workflows/generate-apk.md** | Workflow detallado |

---

## ✅ ¡Listo!

Una vez que hayas completado todos los pasos, ¡tendrás tu app instalada en tu móvil!

**Comando más rápido para empezar:**
```bash
npm run apk:debug
```

---

<div align="center">

**¿Completaste todos los pasos?** 🎉

**¡Disfruta tu app nativa!** 📱

</div>
