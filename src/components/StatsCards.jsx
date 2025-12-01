import React, { useState, useRef, useLayoutEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const StatsCards = ({ income, expense, transactions }) => {
  const [expandedCard, setExpandedCard] = useState(null); // 'income' | 'expense' | null

  const toggleCard = (type) => {
    if (expandedCard === type) {
      setExpandedCard(null);
    } else {
      setExpandedCard(type);
    }
  };

  const getCategoryBreakdown = (type) => {
    const filtered = transactions.filter(t => t.type === type);
    const breakdown = filtered.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

    return Object.entries(breakdown).map(([cat, amount]) => ({
      category: cat,
      amount
    })).sort((a, b) => b.amount - a.amount);
  };

  const renderBreakdown = (type) => {
    const items = getCategoryBreakdown(type);

    return (
      <div style={styles.breakdownContainer}>
        {items.length === 0 ? (
          <div style={styles.emptyState}>No hay movimientos</div>
        ) : (
          items.map((item, index) => (
            <div key={index} style={styles.breakdownItem}>
              <span style={styles.breakdownCategory}>{item.category}</span>
              <span style={{
                ...styles.breakdownAmount,
                color: type === 'income' ? 'var(--income-green)' : 'var(--expense-red)'
              }}>
                {item.amount.toLocaleString('es-ES')} €
              </span>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {/* Income Card */}
      <div
        style={{ ...styles.card, ...(expandedCard === 'income' ? styles.expandedCard : {}) }}
        onClick={() => toggleCard('income')}
      >
        <div style={styles.cardHeader}>
          <span style={styles.label}>ENTRADAS</span>
          <div style={styles.iconContainer}>
            {expandedCard === 'income' ?
              <ChevronUp size={16} color="var(--stats-icon-color)" /> :
              <ChevronDown size={16} color="var(--stats-icon-color)" />
            }
          </div>
        </div>
        <FitText style={styles.amount}>{income.toLocaleString('es-ES')} €</FitText>
        <div style={styles.subtext}>Ingresos recientes</div>

        {expandedCard === 'income' && renderBreakdown('income')}
      </div>

      {/* Expense Card */}
      <div
        style={{ ...styles.card, ...(expandedCard === 'expense' ? styles.expandedCard : {}) }}
        onClick={() => toggleCard('expense')}
      >
        <div style={styles.cardHeader}>
          <span style={styles.label}>SALIDAS</span>
          <div style={styles.iconContainer}>
            {expandedCard === 'expense' ?
              <ChevronUp size={16} color="var(--stats-icon-color)" /> :
              <ChevronDown size={16} color="var(--stats-icon-color)" />
            }
          </div>
        </div>
        <FitText style={styles.amount}>{expense.toLocaleString('es-ES')} €</FitText>
        <div style={styles.subtext}>Gastos recientes</div>

        {expandedCard === 'expense' && renderBreakdown('expense')}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    gap: '16px',
    marginTop: '10px',
    alignItems: 'flex-start',
  },
  card: {
    flex: 1,
    backgroundColor: 'var(--glass-bg)',
    backgroundImage: 'var(--glass-shine)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid var(--glass-border)',
    borderRadius: '24px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '120px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)',
  },
  expandedCard: {
    backgroundColor: 'var(--glass-bg)',
    border: '1px solid var(--primary-lime)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '800',
    color: 'var(--text-gray)',
    letterSpacing: '0.5px',
  },
  iconContainer: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'var(--stats-icon-bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amount: {
    fontSize: '28px',
    fontWeight: '800',
    color: 'var(--text-white)',
    marginBottom: '4px',
  },
  subtext: {
    fontSize: '12px',
    color: 'var(--text-gray)',
    marginBottom: '16px',
  },
  breakdownContainer: {
    marginTop: '10px',
    borderTop: '1px solid #333',
    paddingTop: '10px',
    animation: 'fadeIn 0.3s ease',
  },
  breakdownItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  breakdownCategory: {
    fontSize: '12px',
    color: 'var(--text-white)',
    fontWeight: '600',
  },
  breakdownAmount: {
    fontSize: '12px',
    fontWeight: '700',
  },
  emptyState: {
    fontSize: '12px',
    color: 'var(--text-gray)',
    textAlign: 'center',
    padding: '10px',
  }
};

const FitText = ({ children, style }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    if (containerRef.current && textRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const textWidth = textRef.current.offsetWidth;

      if (textWidth > containerWidth) {
        setScale(containerWidth / textWidth);
      } else {
        setScale(1);
      }
    }
  }, [children]);

  return (
    <div ref={containerRef} style={{ ...style, width: '100%', overflow: 'hidden' }}>
      <div
        ref={textRef}
        style={{
          display: 'inline-block',
          whiteSpace: 'nowrap',
          transform: `scale(${scale})`,
          transformOrigin: 'left center',
          transition: 'transform 0.1s ease'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default StatsCards;
