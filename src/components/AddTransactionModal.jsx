import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddTransactionModal = ({ isOpen, onClose, onAdd, type }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return;

    onAdd({
      amount: parseFloat(amount),
      category: category || 'OTROS', // Default to OTROS if no category selected
      description,
      type, // 'income' or 'expense'
      date: new Date(),
    });

    // Reset and close
    setAmount('');
    setCategory('');
    setDescription('');
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3>{type === 'income' ? 'Nuevo Ingreso' : 'Nuevo Pago'}</h3>
          <button onClick={onClose}><X size={24} color="white" /></button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label>Cantidad (€)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={styles.input}
              placeholder="0.00"
              autoFocus
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Categoría (Opcional)</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={styles.select}
            >
              <option value="">Seleccionar...</option>
              <option value="COMIDA">Comida</option>
              <option value="JUEGOS">Juegos</option>
              <option value="NEGOCIOS">Negocios</option>
              <option value="GASOLINA">Gasolina</option>
              <option value="ROPA">Ropa</option>
              <option value="SALUD">Salud</option>
              <option value="OTROS">Otros</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label>Descripción (Opcional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={styles.input}
              placeholder="Detalles..."
            />
          </div>

          <button type="submit" style={{
            ...styles.submitBtn,
            backgroundColor: type === 'income' ? 'var(--income-green)' : 'var(--expense-red)'
          }}>
            GUARDAR
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'var(--bg-card)',
    padding: '24px',
    borderRadius: '24px',
    width: '90%',
    maxWidth: '400px',
    border: '1px solid #333',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  input: {
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid #444',
    backgroundColor: '#2C2C2C',
    color: 'white',
    fontSize: '16px',
    outline: 'none',
  },
  select: {
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid #444',
    backgroundColor: '#2C2C2C',
    color: 'white',
    fontSize: '16px',
    outline: 'none',
  },
  submitBtn: {
    padding: '16px',
    borderRadius: '30px',
    color: '#121212',
    fontWeight: '800',
    fontSize: '16px',
    marginTop: '10px',
  }
};

export default AddTransactionModal;
