import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function EducationalTooltip({ title, content }) {
  return (
    <div className="group relative inline-flex items-center justify-center cursor-help">
      <HelpCircle className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-colors ml-1" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-white text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        <strong className="block mb-1 text-primary-300">{title}</strong>
        <p className="text-slate-300 leading-relaxed">{content}</p>
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
      </div>
    </div>
  );
}
