import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import { ChevronDown } from 'lucide-react';

const SummaryChart = ({ income, expense, total }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const data = [
    { name: 'Gastos', value: expense, color: '#FF5252' },
    { name: 'Ingresos', value: income, color: '#33D499' },
  ];

  // Prevent division by zero for chart if both are 0
  const chartData = (income === 0 && expense === 0)
    ? [{ name: 'Empty', value: 1, color: '#444' }]
    : data;

  const expensePct = (income + expense) === 0 ? 0 : Math.round((expense / (income + expense)) * 100) || 0;
  const incomePct = (income + expense) === 0 ? 0 : Math.round((income / (income + expense)) * 100) || 0;

  // Responsive chart dimensions
  const chartHeight = isMobile ? 140 : 200;
  const innerRadius = isMobile ? 45 : 60;
  const outerRadius = isMobile ? 60 : 80;

  return (
    <div style={{
      ...styles.card,
      ...(isMobile ? styles.mobileCard : {})
    }}>
      <div style={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <Label
                value={`${total.toLocaleString('es-ES')} €`}
                position="center"
                fill="white"
                style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '900' }}
              />
              <Label
                value="TOTAL"
                position="center"
                dy={-25}
                fill="rgba(255,255,255,0.7)"
                style={{ fontSize: '10px', fontWeight: '700' }}
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={styles.divider}></div>

      <div style={styles.stats}>
        <h4 style={styles.statsTitle}>BALANCE TOTAL</h4>

        <div style={{ ...styles.statPill, backgroundColor: 'var(--pill-expense)' }}>
          <div style={styles.statText}>
            <span style={styles.statLabel}>GASTOS</span>
            <span style={styles.statValue}>{expensePct}%</span>
          </div>
        </div>

        <div style={{ ...styles.statPill, backgroundColor: 'var(--pill-income)' }}>
          <div style={styles.statText}>
            <span style={{ ...styles.statLabel, color: '#121212' }}>INGRESOS</span>
            <span style={{ ...styles.statValue, color: '#121212' }}>{incomePct}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: 'var(--purple-gradient)',
    backgroundImage: 'var(--glass-shine), var(--purple-gradient)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '30px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '240px',
    marginBottom: '16px',
    boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.3)',
    position: 'relative',
    overflow: 'hidden',
  },
  mobileCard: {
    height: '180px',
    padding: '12px',
    borderRadius: '24px',
  },
  chartContainer: {
    flex: 1,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '120px',
  },
  divider: {
    width: '1px',
    height: '65%',
    background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0.15) 80%, transparent 100%)',
    margin: '0 8px',
    boxShadow: '0 0 8px rgba(255,255,255,0.1)',
    flexShrink: 0,
  },
  stats: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    alignItems: 'flex-end',
    paddingRight: '4px',
  },
  statsTitle: {
    fontSize: '11px',
    fontWeight: '900',
    letterSpacing: '1.5px',
    marginBottom: '4px',
    marginRight: '4px',
    color: 'white',
    opacity: 0.9,
  },
  statPill: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '130px',
    justifyContent: 'center',
  },
  statText: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    lineHeight: '1.1',
    color: 'white',
    width: '100%',
  },
  statLabel: {
    fontSize: '8px',
    fontWeight: '800',
    opacity: 0.9,
    marginBottom: '2px',
  },
  statValue: {
    fontSize: '14px',
    fontWeight: '900',
  }
};

export default SummaryChart;
