import { useEffect } from 'react';
import { App } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

/**
 * Hook para inicializar los plugins nativos de Capacitor
 */
export const useCapacitor = () => {
  useEffect(() => {
    const initCapacitor = async () => {
      // Solo ejecutar en plataformas nativas
      if (!Capacitor.isNativePlatform()) {
        return;
      }

      try {
        // Configurar la barra de estado
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#121212' });

        // Ocultar el splash screen después de que la app esté lista
        await SplashScreen.hide();

        // Listener para el botón de retroceso en Android
        App.addListener('backButton', ({ canGoBack }) => {
          if (!canGoBack) {
            App.exitApp();
          } else {
            window.history.back();
          }
        });

        // Listener para cuando la app vuelve al primer plano
        App.addListener('appStateChange', ({ isActive }) => {
          console.log('App state changed. Is active?', isActive);
        });

        console.log('✅ Capacitor plugins initialized');
      } catch (error) {
        console.error('Error initializing Capacitor:', error);
      }
    };

    initCapacitor();

    // Cleanup
    return () => {
      if (Capacitor.isNativePlatform()) {
        App.removeAllListeners();
      }
    };
  }, []);
};

/**
 * Componente wrapper para inicializar Capacitor
 */
export const CapacitorProvider = ({ children }) => {
  useCapacitor();
  return children;
};
