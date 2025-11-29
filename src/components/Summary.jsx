import React from 'react';
import { LayoutGrid } from 'lucide-react';

const Summary = ({ activeTab, setActiveTab }) => {
  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h3 style={styles.title}>RESUMEN</h3>
        <LayoutGrid size={20} color="var(--text-gray)" />
      </div>

      <div style={styles.tabs}>
        <button
          style={{ ...styles.tab, ...(activeTab === 'resumen' ? styles.activeTab : {}) }}
          onClick={() => setActiveTab('resumen')}
        >
          Resumen
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'mes' ? styles.activeTab : {}) }}
          onClick={() => setActiveTab('mes')}
        >
          Mes
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'año' ? styles.activeTab : {}) }}
          onClick={() => setActiveTab('año')}
        >
          Año
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'movimientos' ? styles.activeTab : {}) }}
          onClick={() => setActiveTab('movimientos')}
        >
          Movimientos
        </button>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '16px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '14px',
    color: 'var(--text-gray)',
    fontWeight: '700',
    letterSpacing: '1px',
  },
  tabs: {
    display: 'flex',
    backgroundColor: 'var(--bg-card-lighter)',
    borderRadius: '20px',
    padding: '4px',
  },
  tab: {
    flex: 1,
    padding: '8px',
    borderRadius: '16px',
    color: 'var(--text-gray)',
    fontSize: '12px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
  activeTab: {
    backgroundColor: 'var(--primary-lime)',
    color: 'var(--bg-dark)',
  },
};

export default Summary;
