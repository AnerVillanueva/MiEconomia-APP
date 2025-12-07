# MiEconomia - Aplicación de Finanzas Personales

<div align="center">

![MiEconomia](public/pwa-192x192.png)

**Una aplicación nativa y PWA para gestionar tus finanzas personales de forma sencilla y eficiente.**

[![Descargar APK](https://img.shields.io/badge/Descargar-APK%20v1.0.0-brightgreen?style=for-the-badge&logo=android)](https://github.com/AnerVillanueva/MiEconomia-APP/releases/latest)
[![Versión](https://img.shields.io/badge/versión-1.0.0-blue?style=for-the-badge)](https://github.com/AnerVillanueva/MiEconomia-APP/releases)
[![Licencia](https://img.shields.io/badge/licencia-MIT-orange?style=for-the-badge)](LICENSE)

[📥 Descargar APK](https://github.com/AnerVillanueva/MiEconomia-APP/releases/latest) • [🌐 Ver Demo](https://tu-app.vercel.app) • [📖 Documentación](docs/guides/)

</div>

---

## 🚀 Características

- 📊 **Seguimiento de ingresos y gastos** - Registra todas tus transacciones
- 📅 **Vista mensual y anual** - Calendarios interactivos con balance diario
- 💰 **Balance en tiempo real** - Visualiza tu situación financiera al instante
- 📱 **App Nativa** - Disponible como APK para Android e IPA para iOS
- 🌐 **PWA** - También instalable como Progressive Web App
- 🌙 **Modo oscuro** - Interfaz elegante y cómoda para la vista
- 📈 **Gráficos de balance** - Visualiza la evolución de tus finanzas
- 🔍 **Búsqueda de transacciones** - Encuentra rápidamente cualquier movimiento
- 💾 **Almacenamiento local** - Tus datos permanecen en tu dispositivo
- ⚡ **Rendimiento nativo** - Experiencia fluida y rápida

## 📱 Descargar e Instalar

### 📥 Android (APK)

**[⬇️ Descargar MiEconomia APK v1.0.0](https://github.com/AnerVillanueva/MiEconomia-APP/releases/latest)**

1. Haz clic en el enlace de arriba
2. Descarga el archivo `MiEconomia-v1.0.0.apk`
3. Abre el archivo en tu dispositivo Android
4. Permite la instalación desde fuentes desconocidas si se solicita
5. ¡Listo! La app estará instalada en tu dispositivo

> 📖 **Instrucciones detalladas:** Ver [releases/README.md](releases/README.md)

### 🍎 iOS (IPA)

La versión para iOS está en desarrollo. Mientras tanto, puedes usar la versión PWA.

### 🌐 Instalar como PWA (Sin Descargar APK)

**En Android (Chrome/Edge):**
1. Abre la aplicación en tu navegador
2. Haz clic en el botón "Instalar App" que aparece
3. O ve al menú del navegador → "Instalar aplicación"

**En iOS (Safari):**
1. Abre la aplicación en Safari
2. Toca el botón "Compartir" (cuadrado con flecha hacia arriba)
3. Selecciona "Añadir a la pantalla de inicio"

## 🛠️ Desarrollo Local

### Requisitos Previos

- Node.js 18 o superior
- npm o yarn
- (Opcional) Android Studio para generar APKs
- (Opcional) Xcode para generar IPAs (solo macOS)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/AnerVillanueva/MiEconomia-APP.git

# Entrar al directorio
cd MiEconomia-APP

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Comandos Disponibles

```bash
# Desarrollo web
npm run dev              # Servidor de desarrollo
npm run build            # Compilar para producción
npm run preview          # Vista previa del build

# Desarrollo nativo
npm run build:native     # Compilar web + sincronizar con plataformas nativas
npm run cap:sync         # Sincronizar cambios con plataformas nativas
npm run cap:open:android # Abrir proyecto en Android Studio
npm run cap:open:ios     # Abrir proyecto en Xcode
npm run cap:run:android  # Compilar y ejecutar en dispositivo Android
```

### Generar APK

Ver la guía completa en [`.agent/workflows/generate-apk.md`](.agent/workflows/generate-apk.md)

**Método rápido:**
```bash
# 1. Compilar la aplicación
npm run build

# 2. Sincronizar con Android
npx cap sync android

# 3. Abrir en Android Studio
npx cap open android

# 4. En Android Studio: Build → Build Bundle(s) / APK(s) → Build APK(s)
```

## 🌐 Desplegar en Vercel

1. Haz fork de este repositorio
2. Ve a [Vercel](https://vercel.com)
3. Importa tu repositorio
4. Vercel detectará automáticamente la configuración de Vite
5. Haz clic en "Deploy"

Tu aplicación estará disponible en una URL como `https://tu-proyecto.vercel.app`

Ver guía completa: [`.agent/workflows/deployment.md`](.agent/workflows/deployment.md)

## 📦 Tecnologías Utilizadas

### Frontend
- **React 19** - Framework de UI
- **Vite 5** - Build tool y dev server ultra rápido
- **Recharts** - Gráficos interactivos
- **Lucide React** - Iconos modernos

### Mobile
- **Capacitor 6** - Framework para apps nativas
- **Android SDK** - Plataforma Android
- **iOS SDK** - Plataforma iOS

### PWA
- **Vite PWA Plugin** - Service Worker y manifest
- **Workbox** - Estrategias de caché avanzadas

### Almacenamiento
- **LocalStorage** - Persistencia de datos local

## 📁 Estructura del Proyecto

```
MiEconomia-APP/
├── START_HERE.md             # ⭐ EMPIEZA AQUÍ - Inicio rápido
├── README.md                 # Documentación principal
├── src/                      # Código fuente de la aplicación
│   ├── components/           # Componentes React
│   ├── hooks/                # Custom hooks (incluye useCapacitor)
│   ├── App.jsx               # Componente principal
│   └── main.jsx              # Punto de entrada
├── public/                   # Recursos estáticos
│   ├── pwa-512x512.png       # Icono de la app
│   └── manifest.json         # Web App Manifest
├── android/                  # Proyecto nativo de Android
├── ios/                      # Proyecto nativo de iOS
├── docs/                     # Documentación
│   ├── guides/               # Guías principales
│   │   ├── NATIVE_APP_GUIDE.md      # Guía completa de app nativa
│   │   ├── ANDROID_STUDIO_GUIDE.md  # Guía visual de Android Studio
│   │   ├── CHECKLIST.md             # Checklist paso a paso
│   │   └── SETUP_SUMMARY.md         # Resumen de configuración
│   ├── tools/                # Herramientas HTML
│   └── archive/              # Documentación archivada
├── .agent/workflows/         # Workflows automatizados
│   ├── generate-apk.md       # Cómo generar APK
│   └── deployment.md         # Cómo desplegar la app
├── scripts/
│   └── build-apk.js          # Script automatizado para APK
├── capacitor.config.json     # Configuración de Capacitor
├── vite.config.js            # Configuración de Vite
└── package.json              # Dependencias y scripts
```

## 📖 Documentación

- **[Inicio Rápido](START_HERE.md)** - Empieza aquí para generar tu primera APK
- **[Guía de App Nativa](docs/guides/NATIVE_APP_GUIDE.md)** - Documentación completa sobre desarrollo nativo
- **[Guía de Android Studio](docs/guides/ANDROID_STUDIO_GUIDE.md)** - Guía visual paso a paso
- **[Checklist](docs/guides/CHECKLIST.md)** - Lista de verificación completa
- **[Generar APK](.agent/workflows/generate-apk.md)** - Workflow para generar APK
- **[Despliegue](.agent/workflows/deployment.md)** - Cómo desplegar la aplicación

## 🔧 Configuración

### Cambiar el Nombre de la App
Edita `capacitor.config.json`:
```json
{
  "appName": "TuNombre"
}
```

### Cambiar el Package ID
Edita `capacitor.config.json`:
```json
{
  "appId": "com.tuempresa.tuapp"
}
```

### Personalizar Colores
Edita `capacitor.config.json` en la sección `plugins.SplashScreen`:
```json
{
  "backgroundColor": "#121212",
  "spinnerColor": "#D4FF33"
}
```

## 🐛 Solución de Problemas

### La app no se actualiza
```bash
npm run build
npx cap sync
```

### Error al generar APK
Ver [docs/guides/NATIVE_APP_GUIDE.md](docs/guides/NATIVE_APP_GUIDE.md#-solución-de-problemas)

### Más ayuda
Abre un issue en este repositorio con tu problema.

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 🎯 Roadmap

- [x] App web (PWA)
- [x] App nativa para Android
- [ ] App nativa para iOS
- [ ] Sincronización en la nube
- [ ] Exportar datos a CSV/Excel
- [ ] Categorías personalizadas
- [ ] Presupuestos mensuales
- [ ] Notificaciones de gastos

## 📧 Contacto

Para preguntas o sugerencias, abre un issue en este repositorio.

---

<div align="center">

**Hecho con ❤️ para ayudarte a gestionar tus finanzas**

[⬆ Volver arriba](#mieconomia---aplicación-de-finanzas-personales)

</div>
