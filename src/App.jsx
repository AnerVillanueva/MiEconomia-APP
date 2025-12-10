import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import ActionButtons from './components/ActionButtons';
import Summary from './components/Summary';
import SummaryChart from './components/SummaryChart';
import StatsCards from './components/StatsCards';
import MovementsSlider from './components/MovementsSlider';
import MovementsList from './components/MovementsList';
import MonthCalendar from './components/MonthCalendar';
import YearView from './components/YearView';
import SearchBar from './components/SearchBar';
import AddTransactionModal from './components/AddTransactionModal';
import NotificationsPopup from './components/NotificationsPopup';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { UpdateNotification } from './components/UpdateNotification';
import { App as CapacitorApp } from '@capacitor/app';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import './index.css';
import { Preferences } from '@capacitor/preferences';

function App() {
  const appRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [movementsScrollTop, setMovementsScrollTop] = useState(0);
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

  // Handle app shortcuts
  // Handle app shortcuts (Deep Links)
  useEffect(() => {
    const handleDeepLink = (url) => {
      // url could be "mieconomia://actions?type=add-expense" or "https://.../?action=add-expense"
      // We will parse parameters from it.
      let params;
      try {
        const urlObj = new URL(url);
        params = new URLSearchParams(urlObj.search);
      } catch (e) {
        // Fallback or just ignore if invalid
        console.error("Invalid URL", url);
        return;
      }

      const action = params.get('action') || params.get('type'); // support both

      if (action === 'add-expense') {
        setModalType('expense');
        setIsModalOpen(true);
      } else if (action === 'add-income') {
        setModalType('income');
        setIsModalOpen(true);
      } else if (params.get('view') === 'balance') {
        setActiveTab('resumen');
      }

      // Clean up URL ?
      // window.history.replaceState({}, '', '/');
    };

    // Check for launch URL (Cold Start)
    CapacitorApp.getLaunchUrl().then(launchUrl => {
      if (launchUrl && launchUrl.url) {
        handleDeepLink(launchUrl.url);
      } else {
        // Fallback for web testing or standard window location
        const params = new URLSearchParams(window.location.search);
        const action = params.get('action');
        const view = params.get('view');
        if (action || view) {
          // Construct a dummy full URL to reuse logic or just manual call
          // Reuse logic:
          const dummyUrl = `custom://dummy${window.location.search}`;
          handleDeepLink(dummyUrl);
        }
      }
    });

    // Listen for future URL opens (Resume / While Running)
    const listener = CapacitorApp.addListener('appUrlOpen', (data) => {
      handleDeepLink(data.url);
    });

    return () => {
      listener.then(remove => remove.remove());
    };
  }, []);


  useEffect(() => {
    const root = document.getElementById('root');
    if (root) {
      appRef.current = root;
    }
  }, []);

  // Historical Balance (for Header)
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  // Monthly Balance (for SummaryChart and StatsCards)
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const monthIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const monthExpense = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const monthBalance = monthIncome - monthExpense;

  const notifications = [];
  if (totalExpense > 500) {
    notifications.push({ message: '¡Alerta! Has superado los 500€ en gastos.' });
  }
  if (totalExpense > 1000) {
    notifications.push({ message: '¡Cuidado! Tus gastos han superado los 1000€.' });
  }

  // Check for pending transactions from Widget
  const checkPendingTransactions = async () => {
    try {
      const file = 'pending_transactions.json';
      const result = await Filesystem.readFile({
        path: file,
        directory: Directory.Data,
        encoding: Encoding.UTF8
      });

      if (result.data) {
        // Filesystem returns data as string for text files
        const pending = JSON.parse(result.data);
        if (Array.isArray(pending) && pending.length > 0) {
          const newTransactions = pending.map(t => ({
            ...t,
            date: new Date(t.date) // Restore Date object
          }));

          setTransactions(prev => [...newTransactions, ...prev]);

          // Clean up the file after successful import
          await Filesystem.deleteFile({
            path: file,
            directory: Directory.Data
          });

          console.log('Imported pending transactions from widget', newTransactions.length);
        }
      }
    } catch (e) {
      // File missing is normal if no pending transactions
      // console.log('No pending transactions or error reading', e);
    }
  };

  useEffect(() => {
    // Check on startup
    checkPendingTransactions();

    // Check on resume
    const listener = CapacitorApp.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        checkPendingTransactions();
      }
    });

    return () => {
      listener.then(r => r.remove());
    };
  }, []);

  // Widget Data Sync
  useEffect(() => {
    const updateWidgetData = async () => {
      try {
        await Preferences.set({
          key: 'widget_balance',
          value: balance.toString()
        });
        await Preferences.set({
          key: 'widget_month_expense',
          value: monthExpense.toString()
        });
        await Preferences.set({
          key: 'widget_month_income',
          value: monthIncome.toString()
        });

        // Calculate Category Totals for Radar Widget
        const expenseCategories = {};
        const incomeCategories = {};

        currentMonthTransactions.forEach(t => {
          if (t.type === 'expense') {
            expenseCategories[t.category] = (expenseCategories[t.category] || 0) + t.amount;
          } else {
            incomeCategories[t.category] = (incomeCategories[t.category] || 0) + t.amount;
          }
        });

        await Preferences.set({
          key: 'widget_expense_categories',
          value: JSON.stringify(expenseCategories)
        });
        await Preferences.set({
          key: 'widget_income_categories',
          value: JSON.stringify(incomeCategories)
        });

        // Also trigger a widget update if possible, but standard Preferences don't emit events to native easily without a listener.
        // However, the Widget can read these values when it updates (every 30 mins or on click).
      } catch (error) {
        console.error('Error updating widget data:', error);
      }
    };
    updateWidgetData();
  }, [balance, monthExpense, monthIncome, currentMonthTransactions]);

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

    const movementsContainer = e.target.closest('.movements-scroll-container');

    setIsDragging(true);
    setStartX(e.pageX);
    setStartY(e.pageY - appRef.current.offsetTop);
    setScrollTop(appRef.current.scrollTop);

    if (movementsContainer) {
      setMovementsScrollTop(movementsContainer.scrollTop);
    }

    setDragDirection(null);
    setDragOffset(0);

    appRef.current.style.cursor = 'grabbing';
    appRef.current.style.userSelect = 'none';
  };

  const handleTouchStart = (e) => {
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select')) {
      return;
    }

    const movementsContainer = e.target.closest('.movements-scroll-container');
    const touch = e.touches[0];

    setIsDragging(true);
    setStartX(touch.pageX);
    setStartY(touch.pageY - appRef.current.offsetTop);
    setScrollTop(appRef.current.scrollTop);

    if (movementsContainer) {
      setMovementsScrollTop(movementsContainer.scrollTop);
    }

    setDragDirection(null);
    setDragOffset(0);

    appRef.current.style.userSelect = 'none';
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
      const movementsScrollContainer = e.target.closest('.movements-scroll-container');

      if (Math.abs(dx) > 15 || Math.abs(dy) > 15) {
        if (Math.abs(dx) > Math.abs(dy) && isSwipeArea) {
          setDragDirection('horizontal');
        }
      }
    }

    if (dragDirection === 'horizontal') {
      e.preventDefault();
      setDragOffset(dx);
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const x = touch.pageX;
    const y = touch.pageY - appRef.current.offsetTop;
    const dx = x - startX;
    const dy = y - startY;

    if (!dragDirection) {
      const isSwipeArea = e.target.closest('.swipe-area');
      const movementsScrollContainer = e.target.closest('.movements-scroll-container');

      if (Math.abs(dx) > 15 || Math.abs(dy) > 15) {
        if (Math.abs(dx) > Math.abs(dy) && isSwipeArea) {
          setDragDirection('horizontal');
        }
      }
    }

    if (dragDirection === 'horizontal') {
      e.preventDefault();
      setDragOffset(dx);
    }
  };

  const handleTouchEnd = (e) => {
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
      appRef.current.style.userSelect = 'auto';
    }
  };

  useEffect(() => {
    const root = appRef.current;
    if (root) {
      root.addEventListener('mousedown', handleMouseDown);
      root.addEventListener('touchstart', handleTouchStart, { passive: false });
      root.addEventListener('touchmove', handleTouchMove, { passive: false });
      root.addEventListener('touchend', handleTouchEnd);

      // Add mouse events to document to capture events even outside the app
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mousemove', handleMouseMove);

      return () => {
        root.removeEventListener('mousedown', handleMouseDown);
        root.removeEventListener('touchstart', handleTouchStart);
        root.removeEventListener('touchmove', handleTouchMove);
        root.removeEventListener('touchend', handleTouchEnd);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [isDragging, startY, scrollTop, movementsScrollTop, activeTab, startX, dragDirection, dragOffset]);

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

      <div style={{ flex: 1, overflow: 'hidden', width: '100%', position: 'relative' }}>
        <div style={{
          display: 'flex',
          width: '400%',
          height: '100%',
          transform: `translateX(calc(-${getTabIndex(activeTab) * 25}% + ${dragOffset}px))`,
          transition: isDragging && dragDirection === 'horizontal' ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
        }}>
          <div className="hide-scrollbar" style={{ width: '25%', padding: '0 8px', height: '100%', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <div className="swipe-area" style={{ paddingBottom: '20px' }}>
              <SummaryChart
                income={monthIncome}
                expense={monthExpense}
                total={monthBalance}
                transactions={currentMonthTransactions}
              />
              <StatsCards income={monthIncome} expense={monthExpense} transactions={currentMonthTransactions} />
            </div>
            <MovementsSlider movements={filteredTransactions} />
          </div>

          <div className="hide-scrollbar" style={{ width: '25%', padding: '0 8px', height: '100%', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <div className="swipe-area">
              <MonthCalendar transactions={transactions} />
            </div>
          </div>

          <div className="hide-scrollbar" style={{ width: '25%', padding: '0 8px', height: '100%', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <div className="swipe-area">
              <YearView transactions={transactions} />
            </div>
          </div>

          <div className="hide-scrollbar" style={{ width: '25%', padding: '0 8px', height: '100%', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <MovementsList transactions={filteredTransactions} />
          </div>
        </div>
      </div>

      {(activeTab === 'movimientos') && (
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      )}

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTransaction}
        type={modalType}
      />
      <PWAInstallPrompt />
      <UpdateNotification />
    </>
  );
}

export default App;
