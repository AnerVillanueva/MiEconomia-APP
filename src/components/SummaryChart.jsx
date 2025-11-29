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
                style={{ fontSize: '16px', fontWeight: 'bold' }}
              />
              <Label
                value="TOTAL"
                position="center"
                dy={-20}
                fill="rgba(255,255,255,0.7)"
                style={{ fontSize: '10px' }}
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={styles.stats}>
        <h4 style={styles.statsTitle}>BALANCE TOTAL</h4>

        <div style={{ ...styles.statPill, backgroundColor: '#FF5252' }}>
          <div style={styles.iconCircle}><ChevronDown size={12} color="white" /></div>
          <div style={styles.statText}>
            <span style={styles.statLabel}>GASTOS</span>
            <span style={styles.statValue}>{expensePct}%</span>
          </div>
        </div>

        <div style={{ ...styles.statPill, backgroundColor: '#33D499' }}>
          <div style={{ ...styles.iconCircle, backgroundColor: 'rgba(0,0,0,0.2)' }}><ChevronDown size={12} color="black" /></div>
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
    borderRadius: '24px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '220px',
    marginBottom: '16px', // Moved margin here from wrapper
  },
  chartContainer: {
    flex: 1,
    height: '100%',
    minWidth: '150px',
  },
  stats: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    alignItems: 'flex-end',
  },
  statsTitle: {
    fontSize: '12px',
    fontWeight: '800',
    letterSpacing: '1px',
    marginBottom: '4px',
    marginRight: '4px',
    color: 'white',
  },
  statPill: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '140px',
    justifyContent: 'space-between',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  },
  iconCircle: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.3)',
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
    fontSize: '10px',
    fontWeight: '700',
    opacity: 0.9,
  },
  statValue: {
    fontSize: '14px',
    fontWeight: '800',
  }
};

export default SummaryChart;
