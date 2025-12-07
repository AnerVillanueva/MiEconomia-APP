# 🎨 Guía Visual: Android Studio

## 📱 Generar APK Firmada - Paso a Paso

### 1️⃣ Abrir el Proyecto en Android Studio

```bash
npm run cap:open:android
```

Espera a que Android Studio se abra y cargue el proyecto.

---

### 2️⃣ Esperar Sincronización de Gradle

En la parte inferior de Android Studio verás:
```
Gradle sync in progress...
```

**⏳ Espera hasta que veas:**
```
✓ Gradle sync finished in X seconds
```

> **Nota:** La primera vez puede tardar varios minutos descargando dependencias.

---

### 3️⃣ Generar APK Firmada

#### Opción A: APK de Debug (Rápido, para pruebas)

1. Ve al menú: **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Espera a que termine la compilación
3. Verás una notificación: **APK(s) generated successfully**
4. Click en **locate** para abrir la carpeta
5. La APK estará en: `android/app/build/outputs/apk/debug/app-debug.apk`

#### Opción B: APK Firmada (Para distribución)

1. Ve al menú: **Build** → **Generate Signed Bundle / APK**

2. Selecciona: **APK** → Click en **Next**

3. **Configurar Keystore:**

   **Si es la primera vez (crear nueva keystore):**
   
   - Click en **Create new...**
   - Completa el formulario:
     ```
     Key store path: C:\Users\TuUsuario\mieconomia-keystore.jks
     Password: [tu-contraseña-segura]
     Confirm: [tu-contraseña-segura]
     
     Alias: mieconomia
     Password: [misma-contraseña-o-diferente]
     Confirm: [misma-contraseña-o-diferente]
     Validity (years): 25
     
     Certificate:
     First and Last Name: Tu Nombre
     Organizational Unit: MiEconomia
     Organization: MiEconomia
     City or Locality: Tu Ciudad
     State or Province: Tu Estado
     Country Code (XX): ES (o tu país)
     ```
   - Click en **OK**
   
   **Si ya tienes keystore:**
   
   - Click en **Choose existing...**
   - Selecciona tu archivo `.jks`
   - Introduce las contraseñas

4. Click en **Next**

5. **Configurar Build:**
   - Destination Folder: (deja por defecto o elige una carpeta)
   - Build Variants: Selecciona **release**
   - Signature Versions:
     - ✅ V1 (Jar Signature)
     - ✅ V2 (Full APK Signature)

6. Click en **Finish**

7. Espera a que termine la compilación

8. La APK estará en: `android/app/release/app-release.apk`

---

### 4️⃣ Verificar la APK Generada

En la ventana **Event Log** de Android Studio verás:
```
✓ BUILD SUCCESSFUL in Xs
✓ Generated APK: android/app/release/app-release.apk
```

---

## 🔧 Configuración Avanzada

### Incrementar Versión de la App

1. Abre: `android/app/build.gradle`

2. Busca la sección `defaultConfig`:
   ```gradle
   android {
       defaultConfig {
           applicationId "com.mieconomia.app"
           minSdkVersion 22
           targetSdkVersion 33
           versionCode 1        // ← Incrementa este número
           versionName "1.0.0"  // ← Incrementa esta versión
       }
   }
   ```

3. Para cada nueva versión:
   - `versionCode`: Incrementa en 1 (1, 2, 3, 4...)
   - `versionName`: Incrementa según semver (1.0.0, 1.0.1, 1.1.0, 2.0.0...)

4. Guarda el archivo

5. Sincroniza Gradle: **File** → **Sync Project with Gradle Files**

---

### Configurar Firma Automática

Para no tener que introducir las contraseñas cada vez:

1. Crea un archivo `keystore.properties` en la carpeta `android/`:
   ```properties
   storePassword=tu-contraseña-store
   keyPassword=tu-contraseña-key
   keyAlias=mieconomia
   storeFile=C:/Users/TuUsuario/mieconomia-keystore.jks
   ```

2. Edita `android/app/build.gradle`:
   ```gradle
   // Antes de android {
   def keystorePropertiesFile = rootProject.file("keystore.properties")
   def keystoreProperties = new Properties()
   if (keystorePropertiesFile.exists()) {
       keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
   }
   
   android {
       // ... configuración existente ...
       
       signingConfigs {
           release {
               keyAlias keystoreProperties['keyAlias']
               keyPassword keystoreProperties['keyPassword']
               storeFile file(keystoreProperties['storeFile'])
               storePassword keystoreProperties['storePassword']
           }
       }
       
       buildTypes {
           release {
               signingConfig signingConfigs.release
               minifyEnabled false
               proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
           }
       }
   }
   ```

3. **⚠️ IMPORTANTE:** Agrega `keystore.properties` al `.gitignore`:
   ```
   android/keystore.properties
   ```

4. Ahora puedes generar APK firmada automáticamente:
   ```bash
   npm run apk:release
   ```

---

### Cambiar Icono de la App

Los iconos se generan automáticamente desde `public/pwa-512x512.png`.

**Para regenerar iconos:**

1. Reemplaza `public/pwa-512x512.png` con tu nuevo icono (512x512px)

2. Ejecuta:
   ```bash
   npx @capacitor/assets generate
   ```

3. Sincroniza:
   ```bash
   npm run cap:sync android
   ```

---

### Cambiar Nombre de la App

1. Edita: `android/app/src/main/res/values/strings.xml`
   ```xml
   <resources>
       <string name="app_name">MiEconomia</string>
       <string name="title_activity_main">MiEconomia</string>
       <string name="package_name">com.mieconomia.app</string>
       <string name="custom_url_scheme">com.mieconomia.app</string>
   </resources>
   ```

2. Cambia `app_name` por el nombre que quieras

3. Sincroniza Gradle

---

### Cambiar Colores del Tema

1. Edita: `android/app/src/main/res/values/styles.xml`
   ```xml
   <resources>
       <style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar">
           <item name="colorPrimary">#D4FF33</item>
           <item name="colorPrimaryDark">#121212</item>
           <item name="colorAccent">#D4FF33</item>
       </style>
   </resources>
   ```

---

## 🐛 Solución de Problemas en Android Studio

### Error: "SDK location not found"

1. Ve a: **File** → **Project Structure** → **SDK Location**
2. Asegúrate de que el Android SDK esté configurado
3. Si no está, descárgalo desde: **Tools** → **SDK Manager**

---

### Error: "Gradle sync failed"

1. Ve a: **File** → **Invalidate Caches / Restart**
2. Selecciona: **Invalidate and Restart**
3. Espera a que Android Studio reinicie
4. Intenta sincronizar de nuevo

---

### Error: "Unable to find bundletool"

1. Abre el terminal en Android Studio
2. Ejecuta:
   ```bash
   cd android
   ./gradlew clean
   ./gradlew build
   ```

---

### La APK no se genera

1. Verifica que no haya errores en el código
2. Limpia el proyecto: **Build** → **Clean Project**
3. Reconstruye: **Build** → **Rebuild Project**
4. Intenta generar la APK de nuevo

---

### Error de firma (Signing failed)

1. Verifica que las contraseñas sean correctas
2. Verifica que el archivo `.jks` exista en la ruta especificada
3. Intenta crear una nueva keystore si el problema persiste

---

## 📊 Información de la APK

### Ver detalles de la APK generada

1. Ve a: **Build** → **Analyze APK**
2. Selecciona tu APK
3. Verás:
   - Tamaño total
   - Tamaño de cada componente
   - Recursos incluidos
   - Permisos solicitados

---

## 🚀 Ejecutar en Dispositivo

### Desde Android Studio

1. Conecta tu dispositivo Android por USB
2. Activa **Depuración USB** en tu móvil:
   - Ajustes → Acerca del teléfono
   - Toca 7 veces en "Número de compilación"
   - Vuelve → Opciones de desarrollador
   - Activa "Depuración USB"

3. En Android Studio, selecciona tu dispositivo en la barra superior
4. Click en el botón **Run** (▶️) o presiona **Shift + F10**

---

## 💡 Atajos de Teclado Útiles

| Acción | Windows/Linux | macOS |
|--------|---------------|-------|
| Compilar proyecto | Ctrl + F9 | Cmd + F9 |
| Ejecutar app | Shift + F10 | Ctrl + R |
| Sincronizar Gradle | Ctrl + Shift + O | Cmd + Shift + O |
| Limpiar proyecto | - | - |
| Buscar | Ctrl + Shift + F | Cmd + Shift + F |

---

## 📚 Recursos Adicionales

- [Documentación de Android Studio](https://developer.android.com/studio/intro)
- [Guía de Gradle](https://developer.android.com/studio/build)
- [Firma de aplicaciones](https://developer.android.com/studio/publish/app-signing)
- [Capacitor Android](https://capacitorjs.com/docs/android)

---

¡Con esta guía deberías poder generar tu APK sin problemas! 🎉
