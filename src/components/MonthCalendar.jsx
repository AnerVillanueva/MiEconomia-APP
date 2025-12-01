import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MonthCalendar = ({ transactions }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get the first and last day of the current month
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Calculate daily balances for the current month
  const getDailyBalance = (day) => {
    const dateToCheck = new Date(year, month, day);
    const dayTransactions = transactions.filter(t => {
      const txDate = new Date(t.date);
      return txDate.getFullYear() === year &&
        txDate.getMonth() === month &&
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

  // Get color intensity based on balance
  const getColorForBalance = (balance) => {
    if (balance === 0) {
      return 'transparent';
    }

    const absBalance = Math.abs(balance);
    let intensity;

    // Scale intensity based on amount (0-500€ range)
    if (absBalance < 50) {
      intensity = 0.2;
    } else if (absBalance < 100) {
      intensity = 0.4;
    } else if (absBalance < 200) {
      intensity = 0.6;
    } else if (absBalance < 350) {
      intensity = 0.8;
    } else {
      intensity = 1;
    }

    if (balance > 0) {
      // Green for positive balance
      return `rgba(51, 212, 153, ${intensity})`;
    } else {
      // Red for negative balance
      return `rgba(255, 82, 82, ${intensity})`;
    }
  };

  // Navigate to previous month
  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Generate calendar days
  const calendarDays = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(<div key={`empty-${i}`} style={styles.emptyDay}></div>);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const balance = getDailyBalance(day);
    const backgroundColor = getColorForBalance(balance);
    const isToday =
      day === new Date().getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear();

    calendarDays.push(
      <div
        key={day}
        style={{
          ...styles.day,
          backgroundColor,
          border: isToday ? '2px solid var(--primary-lime)' : '1px solid var(--glass-border)',
        }}
      >
        <div style={styles.dayNumber}>{day}</div>
        {balance !== 0 && (
          <div style={styles.dayBalance}>
            {balance > 0 ? '+' : ''}{balance.toLocaleString('es-ES', { maximumFractionDigits: 0 })}€
          </div>
        )}
      </div>
    );
  }

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={previousMonth} style={styles.navButton}>
          <ChevronLeft size={20} />
        </button>
        <h2 style={styles.monthTitle}>
          {monthNames[month]} {year}
        </h2>
        <button onClick={nextMonth} style={styles.navButton}>
          <ChevronRight size={20} />
        </button>
      </div>

      <div style={styles.weekDays}>
        {dayNames.map(day => (
          <div key={day} style={styles.weekDay}>{day}</div>
        ))}
      </div>

      <div style={styles.calendar}>
        {calendarDays}
      </div>

      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendColor, background: 'linear-gradient(to right, rgba(255, 82, 82, 0.2), rgba(255, 82, 82, 1))' }}></div>
          <span style={styles.legendText}>Gastos</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendColor, background: 'linear-gradient(to right, rgba(51, 212, 153, 0.2), rgba(51, 212, 153, 1))' }}></div>
          <span style={styles.legendText}>Ingresos</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '10px 0',
    paddingBottom: '100px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  navButton: {
    background: 'var(--glass-bg)',
    backgroundImage: 'var(--glass-shine)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid var(--glass-border)',
    borderRadius: '12px',
    padding: '10px',
    color: 'var(--text-white)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  monthTitle: {
    fontSize: '18px',
    fontWeight: '800',
    color: 'var(--text-white)',
    textAlign: 'center',
    letterSpacing: '0.5px',
  },
  weekDays: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px',
    marginBottom: '8px',
  },
  weekDay: {
    fontSize: '10px',
    fontWeight: '700',
    color: 'var(--text-gray)',
    textAlign: 'center',
    padding: '8px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  calendar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px',
    marginBottom: '20px',
  },
  emptyDay: {
    aspectRatio: '1',
  },
  day: {
    aspectRatio: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    padding: '4px',
    position: 'relative',
    transition: 'all 0.2s',
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  dayNumber: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--text-white)',
    marginBottom: '2px',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
  },
  dayBalance: {
    fontSize: '7px',
    fontWeight: '700',
    color: 'var(--text-white)',
    textAlign: 'center',
    lineHeight: '1.2',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
  },
  legend: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '16px',
    padding: '16px',
    background: 'var(--glass-bg)',
    backgroundImage: 'var(--glass-shine)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid var(--glass-border)',
    borderRadius: '16px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  legendColor: {
    width: '60px',
    height: '12px',
    borderRadius: '6px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  legendText: {
    fontSize: '11px',
    color: 'var(--text-gray)',
    fontWeight: '600',
  },
};

export default MonthCalendar;
