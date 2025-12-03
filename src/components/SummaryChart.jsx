import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { ChevronDown, ChevronUp } from 'lucide-react';

const SummaryChart = ({ income, expense, total, transactions = [] }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  const [isExpanded, setIsExpanded] = useState(false);

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
  const pieData = (income === 0 && expense === 0)
    ? [{ name: 'Empty', value: 1, color: '#444' }]
    : data;

  const expensePct = (income + expense) === 0 ? 0 : Math.round((expense / (income + expense)) * 100) || 0;
  const incomePct = (income + expense) === 0 ? 0 : Math.round((income / (income + expense)) * 100) || 0;

  // Responsive chart dimensions
  const chartHeight = isMobile ? 140 : 200;
  const innerRadius = isMobile ? 45 : 60;
  const outerRadius = isMobile ? 60 : 80;

  // Calculate hourly balance data for the current month
  const { areaChartData, dayTicks } = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let runningBalance = 0;
    const data = [];
    const ticks = [];

    // Create a map for quick lookup of transaction amounts by hour
    const txMap = {};
    transactions.forEach(t => {
      const d = new Date(t.date);
      // Ensure it's this month
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        const key = `${d.getDate()}-${d.getHours()}`;
        if (!txMap[key]) txMap[key] = 0;
        txMap[key] += (t.type === 'income' ? t.amount : -t.amount);
      }
    });

    // Start from the 1st of the month at 00:00
    const startDate = new Date(currentYear, currentMonth, 1, 0, 0, 0);
    // End at the current time
    const endDate = now;

    let current = new Date(startDate);

    while (current <= endDate) {
      const day = current.getDate();
      const hour = current.getHours();
      const key = `${day}-${hour}`;

      if (txMap[key]) {
        runningBalance += txMap[key];
      }

      const timestamp = current.getTime();

      // Add tick for the start of each day (00:00)
      if (hour === 0) {
        ticks.push(timestamp);
      }

      data.push({
        timestamp,
        day,
        hour,
        balance: runningBalance,
        formattedLabel: `Día ${day}, ${hour.toString().padStart(2, '0')}:00`
      });

      // Increment by 1 hour
      current.setHours(current.getHours() + 1);
    }

    if (data.length === 0) {
      const timestamp = startDate.getTime();
      data.push({
        timestamp,
        day: 1,
        hour: 0,
        balance: 0,
        formattedLabel: `Día 1, 00:00`
      });
      ticks.push(timestamp);
    }

    return { areaChartData: data, dayTicks: ticks };
  }, [transactions]);

  return (
    <div
      style={{
        ...styles.card,
        ...(isMobile ? styles.mobileCard : {}),
        height: isExpanded ? (isMobile ? '380px' : '440px') : (isMobile ? '180px' : '240px'),
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'center',
        cursor: 'pointer'
      }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Expand Icon in Top Right Corner */}
      {/* Expand Icon in Bottom Center */}
      <div style={{
        position: 'absolute',
        bottom: '8px',
        left: '50%',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20,
        transition: 'transform 0.3s ease',
        transform: `translateX(-50%) ${isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'}`,
        cursor: 'pointer'
      }}>
        <ChevronDown size={20} color="white" />
      </div>

      {/* Top Section (Original Content) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1, width: '100%', flexShrink: 0 }}>
        <div style={styles.chartContainer}>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <Label
                  value={`${total.toLocaleString('es-ES')} €`}
                  position="center"
                  fill="white"
                  style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '900' }}
                />
                <Label
                  value="MES"
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
          <h4 style={styles.statsTitle}>BALANCE MES</h4>

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

      {/* Expanded Section (Area Chart) */}
      <div style={{
        height: isExpanded ? '180px' : '0',
        opacity: isExpanded ? 1 : 0,
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        width: '100%',
        marginTop: isExpanded ? '-10px' : '0',
        paddingBottom: isExpanded ? '10px' : '0'
      }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={areaChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBalanceMonth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fff" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#fff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="timestamp"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 500 }}
              ticks={dayTicks}
              tickFormatter={(timestamp) => new Date(timestamp).getDate()}
              interval="preserveStartEnd"
              minTickGap={20}
              dy={5}
            />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div style={{
                      backgroundColor: 'rgba(20, 20, 20, 0.85)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      padding: '8px 12px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                      backdropFilter: 'blur(8px)',
                      minWidth: '100px',
                      textAlign: 'center'
                    }}>
                      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {payload[0].payload.formattedLabel}
                      </p>
                      <p style={{ color: '#fff', fontSize: '16px', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>
                        {`${payload[0].value.toLocaleString('es-ES')} €`}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
              cursor={{ stroke: 'rgba(255,255,255,0.3)', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#fff"
              fillOpacity={1}
              fill="url(#colorBalanceMonth)"
              strokeWidth={3}
              activeDot={{ r: 6, stroke: 'rgba(255,255,255,0.3)', strokeWidth: 4, fill: '#fff' }}
              animationDuration={1000}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
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
    // alignItems: 'center', // Changed in inline style
    // justifyContent: 'space-between', // Changed in inline style
    // height: '240px', // Changed in inline style
    marginBottom: '16px',
    boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.3)',
    position: 'relative',
    overflow: 'hidden',
    transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  mobileCard: {
    // height: '180px', // Changed in inline style
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsTitle: {
    fontSize: '11px',
    fontWeight: '900',
    letterSpacing: '1.5px',
    marginBottom: '4px',
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
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
