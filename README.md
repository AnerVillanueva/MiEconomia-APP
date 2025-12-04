# MiEconomia - Aplicación de Finanzas Personales

Una aplicación web progresiva (PWA) para gestionar tus finanzas personales de forma sencilla y eficiente.

## 🚀 Características

- 📊 Seguimiento de ingresos y gastos
- 📅 Vista mensual y anual con calendarios interactivos
- 💰 Balance en tiempo real
- 📱 Instalable como aplicación móvil (PWA)
- 🌙 Modo oscuro
- 📈 Gráficos de balance
- 🔍 Búsqueda de transacciones
- 💾 Almacenamiento local (tus datos permanecen en tu dispositivo)

## 📱 Descargar APK para Android

### Opción 1: Descargar APK Pre-generada (Más Fácil)

1. Ve a la sección [Releases](https://github.com/AnerVillanueva/MiEconomia-APP/releases) de este repositorio
2. Descarga el archivo `MiEconomia.apk` de la última versión
3. Instala la APK en tu dispositivo Android
   - Puede que necesites habilitar "Instalar aplicaciones de fuentes desconocidas" en la configuración de tu dispositivo

### Opción 2: Generar APK con PWA Builder

1. Despliega la aplicación en Vercel (ver sección de despliegue)
2. Ve a [PWA Builder](https://www.pwabuilder.com/)
3. Introduce la URL de tu aplicación desplegada
4. Haz clic en "Start" y espera el análisis
5. Selecciona "Android" y configura:
   - Package ID: `com.mieconomia.app`
   - App name: `MiEconomia`
   - Version: `1.0.0`
6. Descarga la APK generada

### Opción 3: Instalar como PWA (Sin APK)

**En Android (Chrome/Edge):**
1. Abre la aplicación en tu navegador
2. Haz clic en el botón "Instalar App" que aparece en la esquina inferior derecha
3. O ve al menú del navegador → "Instalar aplicación"

**En iOS (Safari):**
1. Abre la aplicación en Safari
2. Toca el botón "Compartir" (cuadrado con flecha hacia arriba)
3. Selecciona "Añadir a la pantalla de inicio"

## 🛠️ Desarrollo Local

### Requisitos Previos

- Node.js 18 o superior
- npm o yarn

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

### Compilar para Producción

```bash
# Generar build de producción
npm run build

# Vista previa del build
npm run preview
```

## 🌐 Desplegar en Vercel

1. Haz fork de este repositorio
2. Ve a [Vercel](https://vercel.com)
3. Importa tu repositorio
4. Vercel detectará automáticamente la configuración de Vite
5. Haz clic en "Deploy"

Tu aplicación estará disponible en una URL como `https://tu-proyecto.vercel.app`

## 📦 Tecnologías Utilizadas

- **React** - Framework de UI
- **Vite** - Build tool y dev server
- **Recharts** - Gráficos interactivos
- **Lucide React** - Iconos
- **Vite PWA Plugin** - Funcionalidad PWA
- **LocalStorage** - Persistencia de datos

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📧 Contacto

Para preguntas o sugerencias, abre un issue en este repositorio.
