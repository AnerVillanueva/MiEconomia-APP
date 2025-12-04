import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const YearView = ({ transactions }) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [dragDirection, setDragDirection] = useState(null); // 'vertical' or 'horizontal'

  const handleMouseDown = (e) => {
    if (e.target.closest('button')) return;
    setIsDragging(true);
    setStartX(e.pageX);
    setStartY(e.pageY);
    setScrollTop(scrollRef.current.scrollTop);
    setDragDirection(null);
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grabbing';
      scrollRef.current.style.userSelect = 'none';
    }
  };

  const handleTouchStart = (e) => {
    if (e.target.closest('button')) return;
    const touch = e.touches[0];
    setIsDragging(true);
    setStartX(touch.pageX);
    setStartY(touch.pageY);
    setScrollTop(scrollRef.current.scrollTop);
    setDragDirection(null);
    if (scrollRef.current) {
      scrollRef.current.style.userSelect = 'none';
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !scrollRef.current) return;
    const touch = e.touches[0];
    const x = touch.pageX;
    const y = touch.pageY;
    const dx = Math.abs(x - startX);
    const dy = Math.abs(y - startY);

    // Determine direction on first significant movement
    if (!dragDirection && (dx > 10 || dy > 10)) {
      if (dy > dx) {
        setDragDirection('vertical');
      } else {
        // For horizontal swipes, completely release control to parent
        setDragDirection('horizontal');
        setIsDragging(false);
        if (scrollRef.current) {
          scrollRef.current.style.userSelect = 'auto';
        }
        return;
      }
    }

    // Only handle vertical scrolling
    if (dragDirection === 'vertical') {
      e.preventDefault();
      const walk = (startY - y) * 1.5;
      scrollRef.current.scrollTop = scrollTop + walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragDirection(null);
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
      scrollRef.current.style.userSelect = 'auto';
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setDragDirection(null);
    if (scrollRef.current) {
      scrollRef.current.style.userSelect = 'auto';
    }
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (!isDragging || !scrollRef.current) return;

      const x = e.pageX;
      const y = e.pageY;
      const dx = Math.abs(x - startX);
      const dy = Math.abs(y - startY);

      // Determine direction on first significant movement
      if (!dragDirection && (dx > 10 || dy > 10)) {
        if (dy > dx) {
          setDragDirection('vertical');
        } else {
          setDragDirection('horizontal');
          setIsDragging(false); // Release control for horizontal swipe
          if (scrollRef.current) {
            scrollRef.current.style.cursor = 'grab';
            scrollRef.current.style.userSelect = 'auto';
          }
          return;
        }
      }

      // Only handle vertical scrolling
      if (dragDirection === 'vertical') {
        e.preventDefault();
        const walk = (startY - y) * 1.5;
        scrollRef.current.scrollTop = scrollTop + walk;
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setDragDirection(null);
        if (scrollRef.current) {
          scrollRef.current.style.cursor = 'grab';
          scrollRef.current.style.userSelect = 'auto';
        }
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, startX, startY, scrollTop, dragDirection]);

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

      <div
        ref={scrollRef}
        style={styles.scrollableContent}
        className="hide-scrollbar"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
      >
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
    </div>
  );
};

const styles = {
  container: {
    padding: '0',
    paddingBottom: '80px',
    height: '100%',
    maxHeight: 'calc(100vh - 200px)',
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
  scrollableContent: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '4px',
    paddingBottom: '20px',
    cursor: 'grab',
    userSelect: 'none',
    WebkitOverflowScrolling: 'touch',
    minHeight: 0,
  },
  monthsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
    marginBottom: '16px',
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
