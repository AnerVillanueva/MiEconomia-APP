import React, { useRef, useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const MovementsList = ({ transactions }) => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [clickStartY, setClickStartY] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartY(e.pageY - scrollRef.current.offsetTop);
    setScrollTop(scrollRef.current.scrollTop);
    setClickStartY(e.pageY);
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grabbing';
      scrollRef.current.style.userSelect = 'none';
    }
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setStartY(touch.pageY - scrollRef.current.offsetTop);
    setScrollTop(scrollRef.current.scrollTop);
    setClickStartY(touch.pageY);
    if (scrollRef.current) {
      scrollRef.current.style.userSelect = 'none';
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const y = e.pageY - scrollRef.current.offsetTop;
    const walk = (y - startY) * 1.5;
    scrollRef.current.scrollTop = scrollTop - walk;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const y = touch.pageY - scrollRef.current.offsetTop;
    const walk = (y - startY) * 1.5;
    scrollRef.current.scrollTop = scrollTop - walk;
  };

  const handleMouseUp = (e) => {
    const dragDistance = Math.abs(e.pageY - clickStartY);
    setIsDragging(false);
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
      scrollRef.current.style.userSelect = 'auto';
    }
    // If drag distance is small, it's a click
    return dragDistance < 5;
  };

  const handleTouchEnd = (e) => {
    const touch = e.changedTouches[0];
    const dragDistance = Math.abs(touch.pageY - clickStartY);
    setIsDragging(false);
    if (scrollRef.current) {
      scrollRef.current.style.userSelect = 'auto';
    }
    // If drag distance is small, it's a tap
    return dragDistance < 5;
  };

  const handleItemClick = (e, txId, hasDescription) => {
    // Prevent click if user was dragging
    const dragDistance = Math.abs(e.pageY - clickStartY) + Math.abs(e.pageX - (e.pageX));
    if (dragDistance > 5) return;

    if (!hasDescription) return;
    setExpandedId(expandedId === txId ? null : txId);
  };

  // Add global mouse up listener to handle mouse up outside the container
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        if (scrollRef.current) {
          scrollRef.current.style.cursor = 'grab';
          scrollRef.current.style.userSelect = 'auto';
        }
      }
    };

    if (isDragging) {
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging, startY, scrollTop]);

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Todos los Movimientos</h3>
      <div
        ref={scrollRef}
        style={styles.scrollContainer}
        className="hide-scrollbar"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
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
    height: 'calc(100vh - 200px)',
    overflowY: 'auto',
    paddingBottom: '120px',
    cursor: 'grab',
    userSelect: 'none',
    WebkitOverflowScrolling: 'touch',
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
