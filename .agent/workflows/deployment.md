---
description: Cómo desplegar la aplicación a Vercel
---

# Despliegue en Vercel

Esta guía te explica cómo subir tu aplicación a internet para que cualquiera pueda verla.

## Prerrequisitos
1. Tener el código subido a un repositorio de GitHub.
2. Tener una cuenta en [Vercel](https://vercel.com) (puedes entrar con tu cuenta de GitHub).

## Pasos

1. **Guardar y Subir Cambios**
   Asegúrate de que todos tus cambios locales están confirmados y subidos a GitHub.
   ```bash
   git add .
   git commit -m "Preparando para despliegue"
   git push origin main
   ```

2. **Conectar con Vercel**
   - Ve a [vercel.com/new](https://vercel.com/new).
   - Selecciona tu repositorio `finance-tracker` (o el nombre que tenga en GitHub).
   - Haz clic en **Import**.

3. **Configurar Proyecto**
   - Vercel detectará automáticamente que es un proyecto **Vite**.
   - No necesitas cambiar nada en la configuración de construcción ("Build and Output Settings").
   - Haz clic en **Deploy**.

4. **¡Listo!**
   - Espera unos segundos a que termine el proceso.
   - Vercel te dará una URL (ej: `mi-economia-app.vercel.app`) que puedes compartir.

## Actualizaciones
Cada vez que hagas un cambio y ejecutes `git push`, Vercel actualizará automáticamente tu página web.
