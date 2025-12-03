import React from 'react';
import { Bell } from 'lucide-react';

const Header = ({ balance, onNotificationClick, notificationCount }) => {
  return (
    <header style={styles.header}>
      <div style={styles.balanceContainer}>
        <h1 style={styles.balance}>{balance.toLocaleString('es-ES')} €</h1>
      </div>

      <div style={styles.actions}>
        <button className="icon-btn" style={{ position: 'relative' }} onClick={onNotificationClick}>
          <Bell size={24} />
          {notificationCount > 0 && <span style={styles.notificationDot}></span>}
        </button>

        <div style={styles.profile}>
          <img
            src="https://i.pravatar.cc/150?img=11"
            alt="Profile"
            style={styles.avatar}
          />
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
  },
  balanceContainer: {
    flex: 1,
    textAlign: 'center',
    marginLeft: '60px',
  },
  balance: {
    fontSize: '32px',
    fontWeight: '800',
    color: 'var(--text-white)',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '8px',
    height: '8px',
    backgroundColor: 'var(--expense-red)',
    borderRadius: '50%',
    border: '1px solid var(--bg-dark)',
  },
  profile: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '1px solid var(--text-gray)',
  },
  avatar: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  }
};

export default Header;
