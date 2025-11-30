import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import ActionButtons from './components/ActionButtons';
import Summary from './components/Summary';
import SummaryChart from './components/SummaryChart';
import StatsCards from './components/StatsCards';
import MovementsSlider from './components/MovementsSlider';
import SearchBar from './components/SearchBar';
import AddTransactionModal from './components/AddTransactionModal';
import NotificationsPopup from './components/NotificationsPopup';
import './index.css';

function App() {
  const appRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [dragDirection, setDragDirection] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);

  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem('mieconomia-transactions');
    return savedTransactions ? JSON.parse(savedTransactions).map(t => ({
      ...t,
      date: new Date(t.date)
    })) : [];
  });

  const [activeTab, setActiveTab] = useState('resumen');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('expense');
  const [searchTerm, setSearchTerm] = useState('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('mieconomia-transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  useEffect(() => {
    const root = document.getElementById('root');
    if (root) {
      appRef.current = root;
    }
  }, []);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  const notifications = [];
  if (totalExpense > 500) {
    notifications.push({ message: '¡Alerta! Has superado los 500€ en gastos.' });
  }
  if (totalExpense > 1000) {
    notifications.push({ message: '¡Cuidado! Tus gastos han superado los 1000€.' });
  }

  const filteredTransactions = transactions.filter(t =>
    t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddTransaction = (newTx) => {
    setTransactions(prev => [{ ...newTx, id: Date.now() }, ...prev]);
  };

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const getTabIndex = (tab) => {
    switch (tab) {
      case 'resumen': return 0;
      case 'mes': return 1;
      case 'año': return 2;
      case 'movimientos': return 3;
      default: return 0;
    }
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select')) {
      return;
    }

    setIsDragging(true);
    setStartX(e.pageX);
    setStartY(e.pageY - appRef.current.offsetTop);
    setScrollTop(appRef.current.scrollTop);
    setDragDirection(null);
    setDragOffset(0);

    appRef.current.style.cursor = 'grabbing';
    appRef.current.style.userSelect = 'none';
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setDragDirection(null);
    setDragOffset(0);
    if (appRef.current) {
      appRef.current.style.cursor = 'default';
      appRef.current.style.userSelect = 'auto';
    }
  };

  const handleMouseUp = (e) => {
    if (isDragging && dragDirection === 'horizontal') {
      const threshold = 80;
      const tabs = ['resumen', 'mes', 'año', 'movimientos'];
      const currentIndex = tabs.indexOf(activeTab);

      if (dragOffset > threshold && currentIndex > 0) {
        setActiveTab(tabs[currentIndex - 1]);
      } else if (dragOffset < -threshold && currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1]);
      }
    }

    setIsDragging(false);
    setDragDirection(null);
    setDragOffset(0);
    if (appRef.current) {
      appRef.current.style.cursor = 'default';
      appRef.current.style.userSelect = 'auto';
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const x = e.pageX;
    const y = e.pageY - appRef.current.offsetTop;
    const dx = x - startX;
    const dy = y - startY;

    if (!dragDirection) {
      const isSwipeArea = e.target.closest('.swipe-area');

      if (Math.abs(dx) > 15 || Math.abs(dy) > 15) {
        if (Math.abs(dx) > Math.abs(dy) && isSwipeArea) {
          setDragDirection('horizontal');
        } else {
          setDragDirection('vertical');
        }
      }
    }

    if (dragDirection === 'vertical') {
      e.preventDefault();
      const walk = (dy) * 1.5;
      appRef.current.scrollTop = scrollTop - walk;
    } else if (dragDirection === 'horizontal') {
      e.preventDefault();
      setDragOffset(dx);
    }
  };

  useEffect(() => {
    const root = appRef.current;
    if (root) {
      root.addEventListener('mousedown', handleMouseDown);
      root.addEventListener('mouseleave', handleMouseLeave);
      root.addEventListener('mouseup', handleMouseUp);
      root.addEventListener('mousemove', handleMouseMove);

      return () => {
        root.removeEventListener('mousedown', handleMouseDown);
        root.removeEventListener('mouseleave', handleMouseLeave);
        root.removeEventListener('mouseup', handleMouseUp);
        root.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [isDragging, startY, scrollTop, activeTab, startX, dragDirection, dragOffset]);

  return (
    <>
      <Header
        balance={balance}
        onNotificationClick={() => setIsNotificationsOpen(true)}
        notificationCount={notifications.length}
      />

      <NotificationsPopup
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
      />

      <ActionButtons onOpenModal={openModal} />
      <Summary activeTab={activeTab} setActiveTab={setActiveTab} />

      <div style={{ overflow: 'hidden', width: '100%' }}>
        <div style={{
          display: 'flex',
          width: '400%',
          transform: `translateX(calc(-${getTabIndex(activeTab) * 25}% + ${dragOffset}px))`,
          transition: isDragging && dragDirection === 'horizontal' ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
        }}>
          <div style={{ width: '25%', padding: '0 4px' }}>
            <div className="swipe-area">
              <SummaryChart income={totalIncome} expense={totalExpense} total={balance} />
              <StatsCards income={totalIncome} expense={totalExpense} transactions={transactions} />
            </div>
            <MovementsSlider movements={filteredTransactions} />
          </div>

          <div style={{ width: '25%', padding: '0 4px', display: 'flex', justifyContent: 'center', paddingTop: '50px' }}>
            <div className="swipe-area" style={{ width: '100%', height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ color: 'var(--text-gray)' }}>Sección Mes (En construcción)</div>
            </div>
          </div>

          <div style={{ width: '25%', padding: '0 4px', display: 'flex', justifyContent: 'center', paddingTop: '50px' }}>
            <div className="swipe-area" style={{ width: '100%', height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ color: 'var(--text-gray)' }}>Sección Año (En construcción)</div>
            </div>
          </div>

          <div style={{ width: '25%', padding: '0 4px' }} className="swipe-area">
            <div style={movimientosStyles.container}>
              <h3 style={movimientosStyles.title}>Todos los Movimientos</h3>
              {transactions.length === 0 ? (
                <div style={movimientosStyles.empty}>No hay movimientos</div>
              ) : (
                (() => {
                  // Group transactions by category only, calculating net balance
                  const groupedMovements = transactions.reduce((acc, tx) => {
                    const existing = acc.find(item => item.category === tx.category);

                    if (existing) {
                      // Add to balance: income is positive, expense is negative
                      existing.balance += tx.type === 'income' ? tx.amount : -tx.amount;
                    } else {
                      acc.push({
                        category: tx.category,
                        balance: tx.type === 'income' ? tx.amount : -tx.amount,
                        id: tx.category
                      });
                    }

                    return acc;
                  }, []);

                  return groupedMovements.map((mov) => (
                    <div key={mov.id} style={movimientosStyles.item}>
                      <div style={movimientosStyles.itemLeft}>
                        <div style={movimientosStyles.category}>{mov.category}</div>
                      </div>
                      <div style={{
                        ...movimientosStyles.amount,
                        color: mov.balance === 0 ? 'var(--text-white)' : (mov.balance > 0 ? 'var(--income-green)' : 'var(--expense-red)')
                      }}>
                        {mov.balance === 0 ? '' : (mov.balance > 0 ? '+' : '')}{mov.balance.toLocaleString('es-ES')} €
                      </div>
                    </div>
                  ));
                })()
              )}
            </div>
          </div>
        </div>
      </div>

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTransaction}
        type={modalType}
      />
    </>
  );
}

const movimientosStyles = {
  container: {
    padding: '10px 0',
  },
  title: {
    fontSize: '16px',
    fontWeight: '800',
    color: 'var(--text-white)',
    marginBottom: '20px',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: 'var(--glass-bg)',
    backgroundImage: 'var(--glass-shine)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid var(--glass-border)',
    borderRadius: '16px',
    marginBottom: '10px',
  },
  itemLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  category: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--text-white)',
  },
  amount: {
    fontSize: '16px',
    fontWeight: '800',
  },
  empty: {
    textAlign: 'center',
    color: 'var(--text-gray)',
    padding: '40px 20px',
  }
};

export default App;
