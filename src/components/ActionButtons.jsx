import React from 'react';
import { Plus } from 'lucide-react';

const ActionButtons = ({ onOpenModal }) => {
  return (
    <div style={styles.container}>
      <button style={styles.button} onClick={() => onOpenModal('expense')}>
        <Plus size={20} style={{ marginRight: '8px' }} />
        NUEVO PAGO
      </button>
      <button style={styles.button} onClick={() => onOpenModal('income')}>
        <Plus size={20} style={{ marginRight: '8px' }} />
        NUEVO INGRESO
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    backgroundColor: 'var(--text-white)',
    color: 'var(--bg-dark)',
    padding: '16px',
    borderRadius: '30px',
    fontWeight: '700',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  }
};

export default ActionButtons;
