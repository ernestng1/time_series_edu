import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings2, Layers, TrendingUp, Activity, Hash, Calculator, ChevronDown, HelpCircle } from 'lucide-react';

export function EducationalTooltip({ title, content }) {
  return (
    <div className="group relative inline-flex items-center justify-center cursor-help">
      <HelpCircle className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors ml-1" />
      <div className="absolute top-full right-0 mt-2 w-60 p-3 bg-slate-800 dark:bg-slate-700 text-white text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        <strong className="block mb-1 text-primary-300 dark:text-primary-400">{title}</strong>
        <p className="text-slate-300 dark:text-slate-200 leading-relaxed">{content}</p>
        <div className="absolute bottom-full right-2 -mb-1 border-4 border-transparent border-b-slate-800 dark:border-b-slate-700"></div>
      </div>
    </div>
  );
}

const AccordionItem = ({ id, title, icon: Icon, isOpen, onToggle, children, tooltip, hasToggle, isActive, onActiveToggle }) => {
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 shadow-sm transition-colors duration-200 w-full max-w-full relative z-10 hover:z-50">
      <div className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors pr-4 pl-3 py-2">
        
        <div className="flex items-center gap-3">
          {hasToggle ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onActiveToggle();
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none ${isActive ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-600'}`}
              aria-label={`Toggle ${title}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          ) : (
            <div className="p-1.5 bg-primary-50 dark:bg-primary-900/30 rounded-lg text-primary-600 dark:text-primary-400">
              <Icon className="w-5 h-5" />
            </div>
          )}
          
          <button
            className="flex-1 text-left focus:outline-none py-1"
            onClick={() => onToggle(id)}
          >
            <span className="font-semibold text-slate-800 dark:text-slate-100">{title}</span>
          </button>
        </div>

        <div className="flex items-center shrink-0">
          {tooltip && <EducationalTooltip title={tooltip.title} content={tooltip.content} />}
          <button onClick={() => onToggle(id)} className="ml-2 p-1 focus:outline-none">
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
              <ChevronDown className="w-5 h-5 text-slate-400 dark:text-slate-500" />
            </motion.div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-b-xl">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Sidebar({ state, dispatch, setActiveInteraction, className = "", hideNoise = false, children }) {
  const [openSection, setOpenSection] = useState('model');

  const updateState = (key, value) => {
    dispatch({ type: 'UPDATE_PARAM', payload: { key, value } });
    if (setActiveInteraction) setActiveInteraction(key);
  };

  const handleToggle = (id) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className={`w-full lg:w-80 h-full bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col p-4 overflow-x-hidden overflow-y-auto transition-colors duration-200 ${className}`}>
      
      <div className="mb-6 flex items-center gap-2 shrink-0">
        <Settings2 className="w-5 h-5 text-slate-400 dark:text-slate-500" />
        <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Model Parameters</h2>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-4 space-y-3">
        {/* Model Selection */}
        <AccordionItem
          id="model"
          title="Model Selection"
          icon={Calculator}
          isOpen={openSection === 'model'}
          onToggle={handleToggle}
          tooltip={{
            title: "Model Type",
            content: "Additive models simply add components together. Multiplicative models multiply them, meaning seasonal swings get larger as the trend grows."
          }}
        >
          <div className="space-y-3 pt-1">
            <label className={`flex flex-col cursor-pointer p-3 rounded-lg border transition-colors ${state.modelType === 'additive' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
              <div className="flex items-center space-x-3 w-full">
                <input
                  type="radio"
                  name="modelType"
                  value="additive"
                  checked={state.modelType === 'additive'}
                  onChange={(e) => updateState('modelType', e.target.value)}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500 dark:bg-slate-700 dark:border-slate-600 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="block font-medium text-slate-700 dark:text-slate-200">Additive</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400 whitespace-normal break-words">y(t) = Level + Trend + Seasonality</span>
                </div>
              </div>
            </label>
            <label className={`flex flex-col cursor-pointer p-3 rounded-lg border transition-colors ${state.modelType === 'multiplicative' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
              <div className="flex items-center space-x-3 w-full">
                <input
                  type="radio"
                  name="modelType"
                  value="multiplicative"
                  checked={state.modelType === 'multiplicative'}
                  onChange={(e) => updateState('modelType', e.target.value)}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500 dark:bg-slate-700 dark:border-slate-600 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="block font-medium text-slate-700 dark:text-slate-200">Multiplicative</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400 whitespace-normal break-words">y(t) = Level × Trend × Seasonality × Noise</span>
                </div>
              </div>
            </label>
          </div>
        </AccordionItem>

        {/* Level */}
        <AccordionItem
          id="level"
          title="Level"
          icon={Layers}
          isOpen={openSection === 'level'}
          onToggle={handleToggle}
          hasToggle={true}
          isActive={state.activeComponents.level}
          onActiveToggle={() => dispatch({ type: 'TOGGLE_COMPONENT', payload: 'level' })}
          tooltip={{
            title: "Base Level",
            content: "The average value or baseline of the series around which other components fluctuate."
          }}
        >
          <div 
            className={`space-y-4 transition-opacity ${!state.activeComponents.level ? 'opacity-50' : 'opacity-100'}`}
            onMouseEnter={() => setActiveInteraction && setActiveInteraction('level')}
            onMouseLeave={() => setActiveInteraction && setActiveInteraction(null)}
            onTouchStart={() => setActiveInteraction && setActiveInteraction('level')}
          >
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Base Level</label>
              <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{state.level}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={state.level}
              onChange={(e) => updateState('level', Number(e.target.value))}
              disabled={!state.activeComponents.level}
              className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${state.activeComponents.level ? 'bg-primary-200 dark:bg-primary-900 accent-primary-600' : 'bg-slate-200 dark:bg-slate-700 accent-slate-400'}`}
            />
          </div>
        </AccordionItem>

        {/* Trend */}
        <AccordionItem
          id="trend"
          title="Trend"
          icon={TrendingUp}
          isOpen={openSection === 'trend'}
          onToggle={handleToggle}
          hasToggle={true}
          isActive={state.activeComponents.trend}
          onActiveToggle={() => dispatch({ type: 'TOGGLE_COMPONENT', payload: 'trend' })}
          tooltip={{
            title: "Trend Component",
            content: "The long-term progression of the series. Can be an upward or downward trajectory over time."
          }}
        >
          <div 
            className={`space-y-4 transition-opacity ${!state.activeComponents.trend ? 'opacity-50' : 'opacity-100'}`}
            onMouseEnter={() => setActiveInteraction && setActiveInteraction('trend')}
            onMouseLeave={() => setActiveInteraction && setActiveInteraction(null)}
            onTouchStart={() => setActiveInteraction && setActiveInteraction('trend')}
          >
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Slope / Growth</label>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{state.trend}</span>
            </div>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.1"
              value={state.trend}
              onChange={(e) => updateState('trend', Number(e.target.value))}
              disabled={!state.activeComponents.trend}
              className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${state.activeComponents.trend ? 'bg-emerald-200 dark:bg-emerald-900 accent-emerald-600' : 'bg-slate-200 dark:bg-slate-700 accent-slate-400'}`}
            />
          </div>
        </AccordionItem>

        {/* Seasonality */}
        <AccordionItem
          id="seasonality"
          title="Seasonality"
          icon={Activity}
          isOpen={openSection === 'seasonality'}
          onToggle={handleToggle}
          hasToggle={true}
          isActive={state.activeComponents.seasonality}
          onActiveToggle={() => dispatch({ type: 'TOGGLE_COMPONENT', payload: 'seasonality' })}
          tooltip={{
            title: "Seasonal Component",
            content: "Repeating, predictable patterns that occur over a fixed period (like daily, monthly, or yearly)."
          }}
        >
          <div 
            className={`space-y-4 transition-opacity ${!state.activeComponents.seasonality ? 'opacity-50' : 'opacity-100'}`}
            onMouseEnter={() => setActiveInteraction && setActiveInteraction('seasonality')}
            onMouseLeave={() => setActiveInteraction && setActiveInteraction(null)}
            onTouchStart={() => setActiveInteraction && setActiveInteraction('seasonality')}
          >
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Amplitude</label>
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{state.seasonality}</span>
            </div>
            <input
              type="range"
              min="0"
              max={state.modelType === 'multiplicative' ? 100 : 50}
              value={state.seasonality}
              onChange={(e) => updateState('seasonality', Number(e.target.value))}
              disabled={!state.activeComponents.seasonality}
              className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${state.activeComponents.seasonality ? 'bg-purple-200 dark:bg-purple-900 accent-purple-600' : 'bg-slate-200 dark:bg-slate-700 accent-slate-400'}`}
            />
          </div>
        </AccordionItem>

        {/* Noise */}
        {!hideNoise && (
          <AccordionItem
            id="noise"
            title="Noise"
            icon={Hash}
            isOpen={openSection === 'noise'}
            onToggle={handleToggle}
            hasToggle={true}
            isActive={state.activeComponents.noise}
            onActiveToggle={() => dispatch({ type: 'TOGGLE_COMPONENT', payload: 'noise' })}
            tooltip={{
              title: "Noise / Residual",
              content: "Random, unpredictable variations in the data that cannot be explained by the other components."
            }}
          >
            <div 
              className={`space-y-4 transition-opacity ${!state.activeComponents.noise ? 'opacity-50' : 'opacity-100'}`}
              onMouseEnter={() => setActiveInteraction && setActiveInteraction('noise')}
              onMouseLeave={() => setActiveInteraction && setActiveInteraction(null)}
              onTouchStart={() => setActiveInteraction && setActiveInteraction('noise')}
            >
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Variance</label>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{state.noise}</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={state.noise}
                onChange={(e) => updateState('noise', Number(e.target.value))}
                disabled={!state.activeComponents.noise}
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${state.activeComponents.noise ? 'bg-amber-200 dark:bg-amber-900 accent-amber-600' : 'bg-slate-200 dark:bg-slate-700 accent-slate-400'}`}
              />
            </div>
          </AccordionItem>
        )}
        
      </div>

      {children && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 shrink-0">
          {children}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 shrink-0 text-center pb-1">
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          A project by <a href="https://www.linkedin.com/in/ernestngweijun/" target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">Ernest Ng</a>
        </p>
      </div>
    </div>
  );
}
