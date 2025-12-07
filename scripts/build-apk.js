#!/usr/bin/env node

/**
 * Script de ayuda para generar APK de MiEconomia
 * 
 * Uso:
 *   node scripts/build-apk.js [opciones]
 * 
 * Opciones:
 *   --debug    Genera APK de debug (más rápido, solo para pruebas)
 *   --release  Genera APK de release (requiere keystore)
 *   --help     Muestra esta ayuda
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const isDebug = args.includes('--debug');
const isRelease = args.includes('--release');
const showHelp = args.includes('--help');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function showHelpMessage() {
  log('\n📱 Script de Generación de APK para MiEconomia\n', 'bright');
  log('Uso:', 'blue');
  log('  node scripts/build-apk.js [opciones]\n');
  log('Opciones:', 'blue');
  log('  --debug    Genera APK de debug (más rápido, solo para pruebas)');
  log('  --release  Genera APK de release (requiere keystore configurada)');
  log('  --help     Muestra esta ayuda\n');
  log('Ejemplos:', 'blue');
  log('  node scripts/build-apk.js --debug');
  log('  node scripts/build-apk.js --release\n');
}

function exec(command, options = {}) {
  try {
    log(`\n▶ ${command}`, 'blue');
    execSync(command, { stdio: 'inherit', ...options });
    return true;
  } catch (error) {
    log(`\n❌ Error ejecutando: ${command}`, 'red');
    return false;
  }
}

function checkRequirements() {
  log('\n🔍 Verificando requisitos...', 'yellow');

  // Verificar que existe la carpeta android
  if (!fs.existsSync('android')) {
    log('❌ No se encontró la carpeta android/', 'red');
    log('   Ejecuta: npx cap add android', 'yellow');
    return false;
  }

  log('✅ Carpeta android encontrada', 'green');
  return true;
}

function buildWeb() {
  log('\n📦 Paso 1: Compilando aplicación web...', 'bright');
  return exec('npm run build');
}

function syncAndroid() {
  log('\n🔄 Paso 2: Sincronizando con Android...', 'bright');
  return exec('npx cap sync android');
}

function buildDebugAPK() {
  log('\n🔨 Paso 3: Generando APK de debug...', 'bright');

  const gradlew = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
  const success = exec(`cd android && ${gradlew} assembleDebug`);

  if (success) {
    const apkPath = path.join('android', 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
    if (fs.existsSync(apkPath)) {
      log('\n✅ ¡APK de debug generada exitosamente!', 'green');
      log(`📍 Ubicación: ${apkPath}`, 'blue');
      log(`📏 Tamaño: ${(fs.statSync(apkPath).size / 1024 / 1024).toFixed(2)} MB`, 'blue');
      return true;
    }
  }

  return false;
}

function buildReleaseAPK() {
  log('\n🔨 Paso 3: Generando APK de release...', 'bright');
  log('⚠️  Asegúrate de tener configurada tu keystore en android/app/build.gradle', 'yellow');

  const gradlew = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
  const success = exec(`cd android && ${gradlew} assembleRelease`);

  if (success) {
    const apkPath = path.join('android', 'app', 'build', 'outputs', 'apk', 'release', 'app-release.apk');
    if (fs.existsSync(apkPath)) {
      log('\n✅ ¡APK de release generada exitosamente!', 'green');
      log(`📍 Ubicación: ${apkPath}`, 'blue');
      log(`📏 Tamaño: ${(fs.statSync(apkPath).size / 1024 / 1024).toFixed(2)} MB`, 'blue');
      return true;
    }
  }

  return false;
}

function openAndroidStudio() {
  log('\n💡 Tip: Para generar una APK firmada:', 'yellow');
  log('   1. Ejecuta: npm run cap:open:android', 'blue');
  log('   2. En Android Studio: Build → Generate Signed Bundle / APK', 'blue');
  log('   3. Sigue el asistente para crear/usar tu keystore\n', 'blue');
}

async function main() {
  log('\n╔════════════════════════════════════════════╗', 'bright');
  log('║   📱 MiEconomia - Generador de APK       ║', 'bright');
  log('╚════════════════════════════════════════════╝\n', 'bright');

  if (showHelp || (!isDebug && !isRelease)) {
    showHelpMessage();
    return;
  }

  if (!checkRequirements()) {
    process.exit(1);
  }

  // Paso 1: Build web
  if (!buildWeb()) {
    log('\n❌ Error al compilar la aplicación web', 'red');
    process.exit(1);
  }

  // Paso 2: Sync Android
  if (!syncAndroid()) {
    log('\n❌ Error al sincronizar con Android', 'red');
    process.exit(1);
  }

  // Paso 3: Build APK
  let success = false;
  if (isDebug) {
    success = buildDebugAPK();
  } else if (isRelease) {
    success = buildReleaseAPK();
    if (!success) {
      log('\n⚠️  Si no tienes configurada una keystore, usa --debug o:', 'yellow');
      openAndroidStudio();
    }
  }

  if (success) {
    log('\n╔════════════════════════════════════════════╗', 'green');
    log('║          ✅ ¡Proceso completado!          ║', 'green');
    log('╚════════════════════════════════════════════╝\n', 'green');

    log('📱 Próximos pasos:', 'blue');
    log('   1. Transfiere la APK a tu móvil');
    log('   2. Abre el archivo APK en tu móvil');
    log('   3. Permite la instalación de fuentes desconocidas');
    log('   4. ¡Instala y disfruta!\n');
  } else {
    log('\n❌ Hubo un error al generar la APK', 'red');
    log('   Revisa los mensajes de error anteriores\n', 'yellow');
    process.exit(1);
  }
}

main();
