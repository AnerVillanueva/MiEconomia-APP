import React, { useRef, useState } from 'react';

const MovementsSlider = ({ movements }) => {
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Group movements by category and sum amounts
  const groupedMovements = movements.reduce((acc, mov) => {
    const existing = acc.find(item => item.category === mov.category && item.type === mov.type);

    if (existing) {
      existing.amount += mov.amount;
    } else {
      acc.push({
        category: mov.category,
        amount: mov.amount,
        type: mov.type,
        id: mov.category + mov.type // Unique key for rendering
      });
    }

    return acc;
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
    sliderRef.current.style.cursor = 'grabbing';
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (sliderRef.current) {
      sliderRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (sliderRef.current) {
      sliderRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Multiply for faster scroll
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div style={styles.wrapper}>
      <h3 style={styles.title}>MOVIMIENTOS</h3>
      <div
        ref={sliderRef}
        style={styles.slider}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {groupedMovements.map((mov) => (
          <div key={mov.id} style={styles.card}>
            <div style={{
              ...styles.amount,
              color: mov.amount === 0 ? 'var(--text-white)' : (mov.type === 'income' ? 'var(--income-green)' : 'var(--expense-red)')
            }}>
              {mov.amount === 0 ? '' : (mov.type === 'income' ? '+' : '-')} {mov.amount.toLocaleString('es-ES')}€
            </div>
            <div style={styles.category}>{mov.category}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '10px',
    overflow: 'hidden',
  },
  title: {
    fontSize: '14px',
    color: 'var(--text-gray)',
    fontWeight: '800',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  slider: {
    display: 'flex',
    gap: '7px',
    overflowX: 'auto',
    overflowY: 'hidden',
    paddingBottom: '10px',
    WebkitOverflowScrolling: 'touch',
    cursor: 'grab',
    userSelect: 'none',
  },
  card: {
    minWidth: '100px',
    height: '100px',
    backgroundColor: 'var(--bg-card)',
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #2C2C2C',
    flexShrink: 0,
    pointerEvents: 'none', // Prevent card clicks from interfering with drag
  },
  amount: {
    fontSize: '18px',
    fontWeight: '800',
    marginBottom: '8px',
  },
  category: {
    fontSize: '10px',
    fontWeight: '700',
    color: 'var(--text-gray)',
    letterSpacing: '0.5px',
  }
};

export default MovementsSlider;
