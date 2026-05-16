import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Calculator } from 'lucide-react';

export default function EquationSection({ modelType, activeInteraction, activeComponents, isDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const isMultiplicative = modelType === 'multiplicative';

  // Animation variants for highlighting text
  const getVariant = (term) => {
    // If component is entirely turned off, fade it out
    if (activeComponents && !activeComponents[term]) {
      return { opacity: 0.3, scale: 1, color: isDarkMode ? '#64748b' : '#94a3b8', fontWeight: 400 }; 
    }
    // If it's being interacted with
    if (activeInteraction === term) {
      return { opacity: 1, scale: 1.15, color: isDarkMode ? '#38bdf8' : '#0ea5e9', fontWeight: 700 }; 
    }
    // Default idle state
    return { opacity: 1, scale: 1, color: isDarkMode ? '#e2e8f0' : '#475569', fontWeight: 500 }; 
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
          <Calculator className="w-5 h-5 text-slate-400 dark:text-slate-500" />
          Formula Breakdown
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="w-5 h-5 text-slate-400 dark:text-slate-500" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-slate-50 dark:bg-slate-800/50 transition-colors duration-200"
          >
            <div className="p-6 flex flex-col items-center justify-center border-t border-slate-100 dark:border-slate-800/50">
              <div className="flex flex-wrap items-center justify-center gap-2 text-lg md:text-xl font-mono tracking-tight text-slate-700 dark:text-slate-300">
                <span className="font-semibold text-slate-800 dark:text-slate-100 mr-2">Y(t) =</span>
                
                {isMultiplicative ? (
                  <>
                    <span className="text-slate-400 dark:text-slate-500 mr-1">(</span>
                    <motion.span animate={getVariant('trend')} transition={{ duration: 0.2 }} className="inline-block">slope × time</motion.span>
                    <span className="text-slate-400 dark:text-slate-500 ml-1">)</span>
                    <span className="text-slate-400 dark:text-slate-500 mx-2">×</span>
                    <motion.span animate={getVariant('seasonality')} transition={{ duration: 0.2 }} className="inline-block">seasonality</motion.span>
                    <span className="text-slate-400 dark:text-slate-500 mx-2">×</span>
                    <motion.span animate={getVariant('level')} transition={{ duration: 0.2 }} className="inline-block">level</motion.span>
                    <span className="text-slate-400 dark:text-slate-500 mx-2">×</span>
                    <motion.span animate={getVariant('noise')} transition={{ duration: 0.2 }} className="inline-block">error</motion.span>
                  </>
                ) : (
                  <>
                    <span className="text-slate-400 dark:text-slate-500 mr-1">(</span>
                    <motion.span animate={getVariant('trend')} transition={{ duration: 0.2 }} className="inline-block">slope × time</motion.span>
                    <span className="text-slate-400 dark:text-slate-500 ml-1">)</span>
                    <span className="text-slate-400 dark:text-slate-500 mx-2">+</span>
                    <motion.span animate={getVariant('seasonality')} transition={{ duration: 0.2 }} className="inline-block">seasonality</motion.span>
                    <span className="text-slate-400 dark:text-slate-500 mx-2">+</span>
                    <motion.span animate={getVariant('level')} transition={{ duration: 0.2 }} className="inline-block">level</motion.span>
                    <span className="text-slate-400 dark:text-slate-500 mx-2">+</span>
                    <motion.span animate={getVariant('noise')} transition={{ duration: 0.2 }} className="inline-block">error</motion.span>
                  </>
                )}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 text-center max-w-lg">
                The formula updates based on whether the model is additive or multiplicative. Toggling components off fades them out, while interacting highlights them.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
