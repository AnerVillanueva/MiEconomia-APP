import React from 'react';
import { X, AlertCircle } from 'lucide-react';

const NotificationsPopup = ({ isOpen, onClose, notifications }) => {
  if (!isOpen) return null;

  return (
    <>
      <div style={styles.overlay} onClick={onClose} />
      <div style={styles.container}>
        <div style={styles.header}>
          <h3 style={styles.title}>Notificaciones</h3>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={20} color="var(--text-white)" />
          </button>
        </div>

        <div style={styles.list}>
          {notifications.length === 0 ? (
            <div style={styles.empty}>No tienes notificaciones nuevas</div>
          ) : (
            notifications.map((notif, index) => (
              <div key={index} style={styles.item}>
                <div style={styles.iconContainer}>
                  <AlertCircle size={20} color="var(--expense-red)" />
                </div>
                <div style={styles.content}>
                  <p style={styles.message}>{notif.message}</p>
                  <span style={styles.time}>Ahora</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 998,
  },
  container: {
    position: 'absolute',
    top: '60px',
    right: '20px',
    width: '300px',
    backgroundColor: 'var(--bg-card)',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
    zIndex: 999,
    border: '1px solid rgba(255,255,255,0.1)',
    overflow: 'hidden',
    animation: 'fadeIn 0.2s ease-out',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  title: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--text-white)',
  },
  closeBtn: {
    padding: '4px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  list: {
    maxHeight: '300px',
    overflowY: 'auto',
  },
  item: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    alignItems: 'start',
  },
  iconContainer: {
    marginTop: '2px',
  },
  content: {
    flex: 1,
  },
  message: {
    fontSize: '14px',
    color: 'var(--text-white)',
    marginBottom: '4px',
    lineHeight: '1.4',
  },
  time: {
    fontSize: '11px',
    color: 'var(--text-gray)',
  },
  empty: {
    padding: '30px 20px',
    textAlign: 'center',
    color: 'var(--text-gray)',
    fontSize: '14px',
  }
};

export default NotificationsPopup;
