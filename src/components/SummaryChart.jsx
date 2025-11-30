import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import { ChevronDown } from 'lucide-react';

const SummaryChart = ({ income, expense, total }) => {
  const data = [
    { name: 'Gastos', value: expense, color: '#FF5252' },
    { name: 'Ingresos', value: income, color: '#33D499' },
  ];

  // Prevent division by zero for chart if both are 0
  const chartData = (income === 0 && expense === 0)
    ? [{ name: 'Empty', value: 1, color: '#444' }]
    : data;

  const expensePct = total === 0 ? 0 : Math.round((expense / (income + expense)) * 100) || 0;
  const incomePct = total === 0 ? 0 : Math.round((income / (income + expense)) * 100) || 0;

  return (
    <div style={styles.card}>
      <div style={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
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
                style={{ fontSize: '18px', fontWeight: '900' }}
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

        <div style={{ ...styles.statPill, backgroundColor: 'var(--pill-expense)', boxShadow: '0 4px 15px -4px rgba(255, 82, 82, 0.4)' }}>
          <div style={styles.iconCircle}><ChevronDown size={12} color="#FF5252" /></div>
          <div style={styles.statText}>
            <span style={styles.statLabel}>GASTOS</span>
            <span style={styles.statValue}>{expensePct}%</span>
          </div>
        </div>

        <div style={{ ...styles.statPill, backgroundColor: 'var(--pill-income)', boxShadow: '0 4px 15px -4px rgba(51, 212, 153, 0.4)' }}>
          <div style={{ ...styles.iconCircle, backgroundColor: 'rgba(0,0,0,0.1)' }}><ChevronDown size={12} color="#121212" /></div>
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
  chartContainer: {
    flex: 1.2,
    height: '100%',
    minWidth: '140px',
  },
  divider: {
    width: '1px',
    height: '60%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    margin: '0 10px',
  },
  stats: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    alignItems: 'flex-end',
    paddingRight: '10px',
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
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statText: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    lineHeight: '1.1',
    color: 'white',
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
