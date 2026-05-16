import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function GraphArea({ data, modelType, isDarkMode }) {
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-slate-800 dark:bg-slate-700 text-white p-3 rounded-lg shadow-xl text-sm border border-slate-700 dark:border-slate-600 transition-colors duration-200">
          <p className="font-semibold mb-1 text-primary-300 dark:text-primary-400">Time: {label}</p>
          <div className="space-y-1">
            <p className="text-xl font-bold text-white">Value: {Math.round(dataPoint.value * 10) / 10}</p>
            <div className="h-px w-full bg-slate-600 dark:bg-slate-500 my-2"></div>
            <p className="text-slate-300 dark:text-slate-200">Level: <span className="text-slate-100 dark:text-white">{Math.round(dataPoint.level * 10) / 10}</span></p>
            <p className="text-slate-300 dark:text-slate-200">Trend: <span className="text-slate-100 dark:text-white">
              {modelType === 'multiplicative' 
                ? `${dataPoint.trend.toFixed(2)}x` 
                : Math.round(dataPoint.trend * 10) / 10}
            </span></p>
            <p className="text-slate-300 dark:text-slate-200">Seasonality: <span className="text-slate-100 dark:text-white">
              {modelType === 'multiplicative' 
                ? `${dataPoint.seasonality.toFixed(2)}x` 
                : Math.round(dataPoint.seasonality * 10) / 10}
            </span></p>
            <p className="text-slate-300 dark:text-slate-200">Noise: <span className="text-slate-100 dark:text-white">
              {modelType === 'multiplicative' 
                ? `${dataPoint.noise.toFixed(2)}x` 
                : Math.round(dataPoint.noise * 10) / 10}
            </span></p>
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
          <h2 className="text-xl lg:text-2xl font-bold text-slate-800 dark:text-slate-100">Time Series Visualization</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm lg:text-base">
            Currently viewing: <span className="font-semibold text-primary-600 dark:text-primary-400 capitalize">{modelType} Model</span>
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
            <Line
              type="monotone"
              dataKey="value"
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
