import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function MatchGraphArea({ data, isDarkMode, showTarget = true }) {
  // Custom tooltip for the match chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const userPoint = payload.find(p => p.dataKey === 'userValue')?.payload;
      if (!userPoint) return null;
      
      return (
        <div className="bg-slate-800 dark:bg-slate-700 text-white p-3 rounded-lg shadow-xl text-sm border border-slate-700 dark:border-slate-600 transition-colors duration-200">
          <p className="font-semibold mb-1 text-primary-300 dark:text-primary-400">Time: {label}</p>
          <div className="space-y-1">
            <p className="text-xl font-bold text-white flex justify-between gap-4">
              <span>Your Value:</span> 
              <span>{Math.round(userPoint.userValue * 10) / 10}</span>
            </p>
            {showTarget && (
              <p className="text-lg font-medium text-slate-300 dark:text-slate-400 flex justify-between gap-4">
                <span>Target Value:</span> 
                <span>{Math.round(userPoint.targetValue * 10) / 10}</span>
              </p>
            )}
            {showTarget && (
              <div className="pt-2 mt-2 border-t border-slate-600 dark:border-slate-500">
                <p className="text-xs text-slate-400">
                  Difference: {Math.abs(Math.round((userPoint.userValue - userPoint.targetValue) * 10) / 10)}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const axisColor = isDarkMode ? '#64748b' : '#94a3b8';
  const axisLineColor = isDarkMode ? '#334155' : '#cbd5e1';
  const gridColor = isDarkMode ? '#334155' : '#e2e8f0';

  return (
    <div className="w-full h-full flex flex-col p-4 lg:p-6 bg-slate-50 dark:bg-slate-900 lg:bg-transparent transition-colors duration-200">
      <div className="mb-4 lg:mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-slate-800 dark:text-slate-100">Match the Graph</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm lg:text-base">
            Adjust the parameters to reconstruct the dashed target line!
          </p>
        </div>
      </div>
      
      <div className="flex-1 min-h-[300px] bg-white dark:bg-slate-800 rounded-2xl p-4 lg:p-6 relative overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-200">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke={axisColor} 
              tick={{ fill: axisColor, fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: axisLineColor }}
              label={{ value: 'Time (t)', position: 'insideBottom', offset: -15, fill: axisColor, fontSize: 13, fontWeight: 500 }}
            />
            <YAxis 
              stroke={axisColor} 
              tick={{ fill: axisColor, fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: axisLineColor }}
              width={40}
            />
            <RechartsTooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke={axisLineColor} />
            
            {showTarget && (
              <Line
                type="monotone"
                dataKey="targetValue"
                stroke={isDarkMode ? '#64748b' : '#94a3b8'}
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={false}
                activeDot={false}
                animationDuration={0} // Disable animation for the target so it feels solid
              />
            )}
            
            <Line
              type="monotone"
              dataKey="userValue"
              stroke="#14b8a6"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#0d9488', stroke: isDarkMode ? '#1e293b' : '#fff', strokeWidth: 2 }}
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
