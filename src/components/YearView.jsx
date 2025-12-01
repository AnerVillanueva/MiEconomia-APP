import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const YearView = ({ transactions }) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const monthNamesShort = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];

  // Calculate monthly balance for a specific month
  const getMonthlyBalance = (monthIndex) => {
    const monthTransactions = transactions.filter(t => {
      const txDate = new Date(t.date);
      return txDate.getFullYear() === currentYear &&
        txDate.getMonth() === monthIndex;
    });

    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);

    const expense = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);

    return income - expense;
  };

  // Get daily balance for mini calendar
  const getDailyBalance = (monthIndex, day) => {
    const dayTransactions = transactions.filter(t => {
      const txDate = new Date(t.date);
      return txDate.getFullYear() === currentYear &&
        txDate.getMonth() === monthIndex &&
        txDate.getDate() === day;
    });

    const income = dayTransactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);

    const expense = dayTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);

    return income - expense;
  };

  // Get color for daily balance
  const getDayColor = (balance) => {
    if (balance === 0) return 'rgba(255, 255, 255, 0.05)';

    const absBalance = Math.abs(balance);
    let intensity;

    if (absBalance < 50) intensity = 0.3;
    else if (absBalance < 100) intensity = 0.5;
    else if (absBalance < 200) intensity = 0.7;
    else intensity = 0.9;

    return balance > 0
      ? `rgba(51, 212, 153, ${intensity})`
      : `rgba(255, 82, 82, ${intensity})`;
  };

  // Navigate to previous year
  const previousYear = () => {
    setCurrentYear(currentYear - 1);
  };

  // Navigate to next year
  const nextYear = () => {
    setCurrentYear(currentYear + 1);
  };

  // Check if month is current month
  const isCurrentMonth = (monthIndex) => {
    const now = new Date();
    return monthIndex === now.getMonth() && currentYear === now.getFullYear();
  };

  // Render mini calendar for a month
  const renderMiniCalendar = (monthIndex) => {
    const firstDay = new Date(currentYear, monthIndex, 1);
    const lastDay = new Date(currentYear, monthIndex + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay(); // 0 = Sunday

    const days = [];

    // Empty cells for start padding
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} style={styles.miniDayEmpty}></div>);
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const balance = getDailyBalance(monthIndex, day);
      const backgroundColor = getDayColor(balance);

      days.push(
        <div
          key={day}
          style={{
            ...styles.miniDay,
            backgroundColor
          }}
        />
      );
    }

    return <div style={styles.miniCalendarGrid}>{days}</div>;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={previousYear} style={styles.navButton}>
          <ChevronLeft size={20} />
        </button>
        <h2 style={styles.yearTitle}>{currentYear}</h2>
        <button onClick={nextYear} style={styles.navButton}>
          <ChevronRight size={20} />
        </button>
      </div>

      <div style={styles.monthsGrid}>
        {monthNames.map((monthName, index) => {
          const balance = getMonthlyBalance(index);
          const isCurrent = isCurrentMonth(index);

          return (
            <div
              key={index}
              style={{
                ...styles.monthCard,
                border: isCurrent
                  ? '2px solid var(--primary-lime)'
                  : '1px solid var(--glass-border)',
              }}
            >
              <div style={styles.monthHeader}>
                <span style={styles.monthName}>{monthNamesShort[index]}</span>
                <span style={{
                  ...styles.monthBalance,
                  color: balance >= 0 ? 'var(--income-green)' : 'var(--expense-red)',
                  opacity: balance === 0 ? 0.5 : 1
                }}>
                  {balance === 0 ? '-' : `${balance > 0 ? '+' : ''}${Math.round(balance)}€`}
                </span>
              </div>

              {renderMiniCalendar(index)}
            </div>
          );
        })}
      </div>

      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendColor, background: 'var(--expense-red)' }}></div>
          <span style={styles.legendText}>Gastos</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendColor, background: 'var(--income-green)' }}></div>
          <span style={styles.legendText}>Ingresos</span>
        </div>
      </div>

      <div style={styles.summary}>
        <div style={styles.summaryTitle}>Resumen Anual</div>
        <div style={styles.summaryStats}>
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>Total Ingresos</span>
            <span style={{ ...styles.summaryValue, color: 'var(--income-green)' }}>
              +{transactions
                .filter(t => t.type === 'income' && new Date(t.date).getFullYear() === currentYear)
                .reduce((acc, t) => acc + t.amount, 0)
                .toLocaleString('es-ES')}€
            </span>
          </div>
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>Total Gastos</span>
            <span style={{ ...styles.summaryValue, color: 'var(--expense-red)' }}>
              -{transactions
                .filter(t => t.type === 'expense' && new Date(t.date).getFullYear() === currentYear)
                .reduce((acc, t) => acc + t.amount, 0)
                .toLocaleString('es-ES')}€
            </span>
          </div>
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>Balance Anual</span>
            <span style={{
              ...styles.summaryValue,
              color: (() => {
                const yearBalance = transactions
                  .filter(t => new Date(t.date).getFullYear() === currentYear)
                  .reduce((acc, t) => t.type === 'income' ? acc + t.amount : acc - t.amount, 0);
                return yearBalance >= 0 ? 'var(--income-green)' : 'var(--expense-red)';
              })()
            }}>
              {(() => {
                const yearBalance = transactions
                  .filter(t => new Date(t.date).getFullYear() === currentYear)
                  .reduce((acc, t) => t.type === 'income' ? acc + t.amount : acc - t.amount, 0);
                return `${yearBalance >= 0 ? '+' : ''}${yearBalance.toLocaleString('es-ES')}€`;
              })()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '0',
    paddingBottom: '80px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    padding: '0 8px',
  },
  navButton: {
    background: 'var(--glass-bg)',
    backgroundImage: 'var(--glass-shine)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid var(--glass-border)',
    borderRadius: '8px',
    padding: '6px',
    color: 'var(--text-white)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  yearTitle: {
    fontSize: '16px',
    fontWeight: '800',
    color: 'var(--text-white)',
    textAlign: 'center',
    letterSpacing: '1px',
  },
  monthsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
    marginBottom: '16px',
    flex: 1,
    overflowY: 'auto',
    padding: '4px',
  },
  monthCard: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '12px',
    padding: '8px',
    background: 'var(--glass-bg)',
    backgroundImage: 'var(--glass-shine)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    transition: 'all 0.2s',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    minHeight: '90px',
  },
  monthHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
    paddingBottom: '4px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  monthName: {
    fontSize: '11px',
    fontWeight: '800',
    color: 'var(--text-white)',
    textTransform: 'uppercase',
  },
  monthBalance: {
    fontSize: '9px',
    fontWeight: '700',
  },
  miniCalendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '2px',
    alignContent: 'start',
  },
  miniDay: {
    aspectRatio: '1',
    borderRadius: '1px',
    width: '100%',
  },
  miniDayEmpty: {
    aspectRatio: '1',
    width: '100%',
  },
  legend: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '12px',
    padding: '10px',
    background: 'var(--glass-bg)',
    backgroundImage: 'var(--glass-shine)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid var(--glass-border)',
    borderRadius: '12px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  legendColor: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
  legendText: {
    fontSize: '9px',
    color: 'var(--text-gray)',
    fontWeight: '600',
  },
  summary: {
    background: 'var(--glass-bg)',
    backgroundImage: 'var(--glass-shine)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid var(--glass-border)',
    borderRadius: '16px',
    padding: '16px',
  },
  summaryTitle: {
    fontSize: '12px',
    fontWeight: '800',
    color: 'var(--text-white)',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  summaryStats: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--text-gray)',
  },
  summaryValue: {
    fontSize: '12px',
    fontWeight: '800',
  },
};

export default YearView;
