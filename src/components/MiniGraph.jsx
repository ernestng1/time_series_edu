import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export default function MiniGraph({ data }) {
  return (
    <div className="w-full h-32 bg-slate-50 rounded-lg p-2 border border-slate-100">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke="#14b8a6"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
