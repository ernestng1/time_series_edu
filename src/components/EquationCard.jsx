import React from 'react';
import { motion } from 'framer-motion';

export default function EquationCard({ modelType, activeInteraction }) {
  const isMultiplicative = modelType === 'multiplicative';

  // Animation variants for highlighting text
  const termVariants = {
    idle: { scale: 1, color: '#475569', fontWeight: 500 }, // slate-600
    active: { scale: 1.15, color: '#0ea5e9', fontWeight: 700 }, // sky-500
  };

  const getVariant = (term) => (activeInteraction === term ? 'active' : 'idle');

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-md border border-slate-200/60 pointer-events-none flex items-center justify-center">
      <div className="flex items-center space-x-2 text-lg md:text-xl font-mono tracking-tight text-slate-700">
        <span className="font-semibold text-slate-800 mr-2">y(t) =</span>
        
        {isMultiplicative ? (
          <>
            <span className="text-slate-400">(</span>
            <motion.span variants={termVariants} animate={getVariant('level')} transition={{ duration: 0.2 }}>Level</motion.span>
            <span className="text-slate-400 mx-2">+</span>
            <motion.span variants={termVariants} animate={getVariant('trend')} transition={{ duration: 0.2 }}>Trend</motion.span>
            <span className="text-slate-400">)</span>
            <span className="text-slate-400 mx-2">×</span>
            <motion.span variants={termVariants} animate={getVariant('seasonality')} transition={{ duration: 0.2 }}>Seasonality</motion.span>
          </>
        ) : (
          <>
            <motion.span variants={termVariants} animate={getVariant('level')} transition={{ duration: 0.2 }}>Level</motion.span>
            <span className="text-slate-400 mx-2">+</span>
            <motion.span variants={termVariants} animate={getVariant('trend')} transition={{ duration: 0.2 }}>Trend</motion.span>
            <span className="text-slate-400 mx-2">+</span>
            <motion.span variants={termVariants} animate={getVariant('seasonality')} transition={{ duration: 0.2 }}>Seasonality</motion.span>
          </>
        )}
        
        <span className="text-slate-400 mx-2">+</span>
        <motion.span variants={termVariants} animate={getVariant('noise')} transition={{ duration: 0.2 }}>Noise</motion.span>
      </div>
    </div>
  );
}
