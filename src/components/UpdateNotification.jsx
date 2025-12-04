import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

export const UpdateNotification = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    // Detectar cuando hay una nueva versión disponible
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);

        // Escuchar actualizaciones
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Nueva versión disponible
              setShowUpdate(true);
            }
          });
        });
      });

      // Verificar actualizaciones cada 30 minutos
      const interval = setInterval(() => {
        navigator.serviceWorker.ready.then((reg) => {
          reg.update();
        });
      }, 30 * 60 * 1000); // 30 minutos

      return () => clearInterval(interval);
    }
  }, []);

  const handleUpdate = () => {
    if (registration && registration.waiting) {
      // Activar el nuevo service worker
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });

      // Recargar la página
      window.location.reload();
    }
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3">
        <RefreshCw size={20} className="animate-spin-slow" />
        <div className="flex flex-col">
          <span className="font-semibold text-sm">Nueva versión disponible</span>
          <span className="text-xs opacity-90">Actualiza para obtener las últimas mejoras</span>
        </div>
        <button
          onClick={handleUpdate}
          className="ml-4 bg-white text-blue-600 px-4 py-2 rounded-full font-semibold text-sm hover:bg-blue-50 transition-all"
        >
          Actualizar
        </button>
        <button
          onClick={() => setShowUpdate(false)}
          className="ml-2 text-white/80 hover:text-white text-xl"
        >
          ×
        </button>
      </div>
    </div>
  );
};
