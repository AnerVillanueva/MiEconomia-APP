import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="Buscar..."
        style={styles.input}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button style={styles.button} onClick={() => setSearchTerm('')}>
        <Search size={20} color="#121212ff" />
      </button>
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'calc(100% - 40px)',
    maxWidth: '440px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: '6px',
    zIndex: 100,
  },
  input: {
    flex: 1,
    border: 'none',
    backgroundColor: 'rgba(224, 224, 224, 0.95)',
    borderRadius: '20px',
    padding: '10px 16px',
    fontSize: '14px',
    color: '#121212',
    outline: 'none',
    fontWeight: '500',
    marginRight: '10px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
  },
  button: {
    width: '40px',
    height: '40px',
    backgroundColor: 'var(--primary-lime)',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.1s',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    flexShrink: 0,
  },
};

export default SearchBar;
