import React, { useRef, useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const MovementsList = ({ transactions }) => {
  const scrollRef = useRef(null);
  const [expandedId, setExpandedId] = useState(null);

  const handleItemClick = (e, txId, hasDescription) => {
    if (!hasDescription) return;
    setExpandedId(expandedId === txId ? null : txId);
  };

  return (
    <div style={styles.container} className="swipe-area">
      <h3 style={styles.title}>Todos los Movimientos</h3>
      <div
        ref={scrollRef}
        style={styles.scrollContainer}
        className="hide-scrollbar movements-scroll-container"
      >
        {transactions.length === 0 ? (
          <div style={styles.empty}>No hay movimientos</div>
        ) : (
          transactions.map((tx) => {
            const isExpanded = expandedId === tx.id;
            const hasDescription = tx.description && tx.description.trim() !== '';

            return (
              <div
                key={tx.id}
                style={{
                  ...styles.item,
                  cursor: hasDescription ? 'pointer' : 'default',
                }}
                onClick={(e) => handleItemClick(e, tx.id, hasDescription)}
              >
                <div style={styles.itemContent}>
                  <div style={styles.itemLeft}>
                    <div style={styles.category}>{tx.category}</div>
                    <div style={styles.date}>
                      {tx.date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })} • {tx.date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div style={styles.itemRight}>
                    <div style={{
                      ...styles.amount,
                      color: tx.type === 'income' ? 'var(--income-green)' : 'var(--expense-red)'
                    }}>
                      {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString('es-ES')} €
                    </div>
                    {hasDescription && (
                      <div style={styles.chevronIcon}>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    )}
                  </div>
                </div>

                {hasDescription && isExpanded && (
                  <div style={styles.description}>
                    <div style={styles.descriptionLabel}>Descripción:</div>
                    <div style={styles.descriptionText}>{tx.description}</div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '10px 0',
  },
  title: {
    fontSize: '16px',
    fontWeight: '800',
    color: 'var(--text-white)',
    marginBottom: '20px',
  },
  scrollContainer: {
    paddingBottom: '120px',
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
    backgroundColor: 'var(--glass-bg)',
    backgroundImage: 'var(--glass-shine)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid var(--glass-border)',
    borderRadius: '16px',
    marginBottom: '10px',
    transition: 'all 0.3s ease',
  },
  itemContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  itemLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  itemRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  category: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--text-white)',
  },
  date: {
    fontSize: '12px',
    color: 'var(--text-gray)',
    fontWeight: '500',
  },
  amount: {
    fontSize: '16px',
    fontWeight: '800',
  },
  chevronIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-gray)',
    transition: 'transform 0.3s ease',
  },
  description: {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    animation: 'slideDown 0.3s ease',
  },
  descriptionLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--text-gray)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '6px',
  },
  descriptionText: {
    fontSize: '13px',
    color: 'var(--text-white)',
    fontWeight: '500',
    lineHeight: '1.5',
  },
  empty: {
    textAlign: 'center',
    color: 'var(--text-gray)',
    padding: '40px 20px',
  },
};

export default MovementsList;
