# Coloca tu archivo APK aquí

Para publicar tu APK:

1. Genera la APK usando uno de los métodos descritos en `.agent/workflows/generate-apk.md`
2. Renombra el archivo a: `MiEconomia-v1.0.0.apk`
3. Coloca el archivo en esta carpeta
4. Sigue las instrucciones a continuación para crear un Release en GitHub

## Crear un Release en GitHub

### Opción 1: Desde la Web (Más Fácil)

1. Ve a tu repositorio en GitHub
2. Haz clic en "Releases" (en el menú lateral derecho)
3. Haz clic en "Create a new release"
4. Configura el release:
   - **Tag version:** v1.0.0
   - **Release title:** MiEconomia v1.0.0 - Lanzamiento Inicial
   - **Description:** 
     ```
     Primera versión de MiEconomia - Tu gestor de finanzas personal
     
     ## ✨ Características
     - 📊 Seguimiento de ingresos y gastos
     - 📅 Vista mensual y anual
     - 💰 Balance en tiempo real
     - 🌙 Modo oscuro
     - 📈 Gráficos interactivos
     
     ## 📥 Instalación
     Descarga el archivo APK y sigue las instrucciones en [releases/README.md](releases/README.md)
     ```
5. Arrastra y suelta tu archivo `MiEconomia-v1.0.0.apk` en la sección "Attach binaries"
6. Marca "Set as the latest release"
7. Haz clic en "Publish release"

### Opción 2: Desde la Línea de Comandos (Requiere GitHub CLI)

```bash
# Instalar GitHub CLI si no lo tienes
# https://cli.github.com/

# Crear el release
gh release create v1.0.0 \
  ./releases/MiEconomia-v1.0.0.apk \
  --title "MiEconomia v1.0.0 - Lanzamiento Inicial" \
  --notes "Primera versión de MiEconomia"
```

## Actualizar el README principal

Después de crear el release, actualiza el README.md principal con el enlace de descarga correcto.
