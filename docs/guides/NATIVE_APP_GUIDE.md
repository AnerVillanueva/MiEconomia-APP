# 📱 Guía Completa: App Nativa con Capacitor

## ✅ Estado Actual del Proyecto

Tu proyecto **MiEconomia** ya está configurado como una app nativa usando **Capacitor**. Esto significa que puedes:

- ✅ Generar APKs para Android
- ✅ Generar IPAs para iOS
- ✅ Acceder a funcionalidades nativas del dispositivo
- ✅ Publicar en Google Play Store y App Store

## 🎯 Requisitos Previos

### Para Android:
1. **Android Studio** (descarga desde: https://developer.android.com/studio)
2. **Java JDK 17** (descarga desde: https://adoptium.net/)

### Para iOS (solo en macOS):
1. **Xcode** (desde la App Store)
2. **CocoaPods** (instalar con: `sudo gem install cocoapods`)

## 🚀 Comandos Disponibles

### Desarrollo Web (PWA)
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Compilar para producción
npm run preview      # Vista previa de la build
```

### Desarrollo Nativo
```bash
npm run build:native      # Compilar web + sincronizar con plataformas nativas
npm run cap:sync          # Sincronizar cambios con plataformas nativas
npm run cap:open:android  # Abrir proyecto en Android Studio
npm run cap:open:ios      # Abrir proyecto en Xcode
npm run cap:run:android   # Compilar y ejecutar en dispositivo Android
```

## 📦 Generar APK para Android

### Opción 1: Desde Android Studio (Recomendado)

1. **Abrir el proyecto en Android Studio:**
   ```bash
   npm run cap:open:android
   ```

2. **Esperar a que Gradle termine de sincronizar** (primera vez puede tardar varios minutos)

3. **Generar APK firmada:**
   - Ve a: `Build` → `Generate Signed Bundle / APK`
   - Selecciona: `APK`
   - Crea una nueva keystore (guárdala en un lugar seguro):
     - Key store path: `C:\Users\TuUsuario\mieconomia-keystore.jks`
     - Password: (elige una contraseña segura)
     - Alias: `mieconomia`
     - Validity: 25 años
   - Selecciona build variant: `release`
   - Click en `Finish`

4. **Ubicación de la APK:**
   ```
   android/app/release/app-release.apk
   ```

### Opción 2: Desde la Línea de Comandos

1. **Generar APK de depuración (solo para pruebas):**
   ```bash
   cd android
   ./gradlew assembleDebug
   ```
   APK generada en: `android/app/build/outputs/apk/debug/app-debug.apk`

2. **Generar APK de release (requiere keystore):**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

## 📱 Instalar APK en tu Móvil

### Método 1: Transferencia Directa
1. Copia el archivo APK a tu móvil
2. Abre el archivo APK desde el explorador de archivos
3. Permite la instalación de fuentes desconocidas si es necesario

### Método 2: ADB (Android Debug Bridge)
```bash
adb install android/app/release/app-release.apk
```

## 🍎 Generar IPA para iOS (solo macOS)

1. **Abrir el proyecto en Xcode:**
   ```bash
   npm run cap:open:ios
   ```

2. **Configurar el equipo de desarrollo:**
   - Selecciona el proyecto en el navegador
   - Ve a `Signing & Capabilities`
   - Selecciona tu equipo de Apple Developer

3. **Generar archivo IPA:**
   - Ve a: `Product` → `Archive`
   - Una vez completado, click en `Distribute App`
   - Sigue el asistente para exportar el IPA

## 🔄 Workflow de Desarrollo

### Cuando hagas cambios en el código web:

1. **Compilar los cambios:**
   ```bash
   npm run build
   ```

2. **Sincronizar con las plataformas nativas:**
   ```bash
   npm run cap:sync
   ```

3. **Probar en el dispositivo:**
   ```bash
   npm run cap:run:android
   # o
   npm run cap:open:ios
   ```

### Atajo rápido:
```bash
npm run build:native
```
Este comando hace build + sync automáticamente.

## 🎨 Personalizar Iconos y Splash Screens

### Iconos
Los iconos se generan automáticamente desde:
- `public/pwa-512x512.png` (para Android)
- `public/apple-touch-icon.png` (para iOS)

Para regenerar iconos:
```bash
npx capacitor-assets generate --iconBackgroundColor '#121212' --iconBackgroundColorDark '#121212' --splashBackgroundColor '#121212' --splashBackgroundColorDark '#121212'
```

### Splash Screen
El splash screen está configurado en `capacitor.config.json`:
- Color de fondo: `#121212` (negro)
- Color del spinner: `#D4FF33` (verde lima)
- Duración: 2 segundos

## 🔧 Configuración de Plugins Nativos

Los siguientes plugins ya están instalados y configurados:

### 1. **Status Bar**
- Estilo: Oscuro
- Color de fondo: `#121212`

### 2. **Splash Screen**
- Duración: 2 segundos
- Auto-hide: Sí
- Pantalla completa: Sí

### 3. **App**
- Manejo del botón de retroceso en Android
- Detección de estado de la app (activa/inactiva)

## 📝 Archivos Importantes

```
MiEconomia-APP/
├── capacitor.config.json      # Configuración de Capacitor
├── android/                   # Proyecto nativo de Android
├── ios/                       # Proyecto nativo de iOS
├── src/hooks/useCapacitor.jsx # Inicialización de plugins nativos
└── public/                    # Recursos (iconos, etc.)
```

## 🐛 Solución de Problemas

### Error: "JAVA_HOME not set"
```bash
# Instala Java JDK 17 desde https://adoptium.net/
# Configura la variable de entorno JAVA_HOME
```

### Error: "Android SDK not found"
```bash
# Instala Android Studio
# Abre Android Studio → Settings → Android SDK
# Instala Android SDK Platform 33 o superior
```

### Error: "Gradle build failed"
```bash
# Limpia el proyecto
cd android
./gradlew clean
./gradlew build
```

### La app no se actualiza en el dispositivo
```bash
# Asegúrate de compilar y sincronizar
npm run build:native
```

## 🚀 Publicar en Tiendas

### Google Play Store
1. Genera una APK firmada (release)
2. Crea una cuenta de Google Play Developer ($25 único pago)
3. Sube la APK en Google Play Console
4. Completa la información de la app
5. Envía para revisión

### Apple App Store
1. Genera un IPA firmado
2. Crea una cuenta de Apple Developer ($99/año)
3. Sube el IPA usando Xcode o Transporter
4. Completa la información en App Store Connect
5. Envía para revisión

## 💡 Consejos

- **Siempre prueba en dispositivos reales**, no solo en emuladores
- **Guarda tu keystore en un lugar seguro** (si la pierdes, no podrás actualizar la app)
- **Incrementa el versionCode/versionName** en cada actualización
- **Prueba la app en diferentes versiones de Android/iOS**
- **Optimiza el tamaño de la APK** eliminando recursos no utilizados

## 📚 Recursos Adicionales

- [Documentación de Capacitor](https://capacitorjs.com/docs)
- [Guía de Android Studio](https://developer.android.com/studio/intro)
- [Guía de Xcode](https://developer.apple.com/xcode/)
- [Capacitor Plugins](https://capacitorjs.com/docs/plugins)

---

¡Tu app está lista para ser compilada como nativa! 🎉
