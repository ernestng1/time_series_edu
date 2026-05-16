import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Play, Pause, Columns, MousePointer2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GraphArea from './GraphArea';
import { generateTimeSeriesData } from '../utils/timeSeries';

export default function ExpandedLearningView({ combo, onBack }) {
  // Step-by-step construction:
  // 0: Initial (empty or just level if combo has it)
  // 1: Level + Trend
  // 2: Level + Trend + Seasonality
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [modelType, setModelType] = useState('additive');
  const [compareMode, setCompareMode] = useState(false);

  // Manual toggle overrides
  const [manualToggles, setManualToggles] = useState({
    level: combo.level,
    trend: combo.trend,
    seasonality: combo.seasonality
  });

  // We determine maximum steps based on what the combo has
  const hasLevel = combo.level;
  const hasTrend = combo.trend;
  const hasSeasonality = combo.seasonality;

  // Ordered list of components to add
  const stepsList = [];
  if (hasLevel) stepsList.push('level');
  if (hasTrend) stepsList.push('trend');
  if (hasSeasonality) stepsList.push('seasonality');
  
  const maxSteps = Math.max(0, stepsList.length - 1);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setStep((prev) => {
          if (prev >= maxSteps) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, maxSteps]);

  const activeComponents = {
    level: false,
    trend: false,
    seasonality: false,
    noise: false
  };

  // Turn on components up to current step (if playing animation)
  if (isPlaying || step > 0) {
    for (let i = 0; i <= step; i++) {
      if (stepsList[i]) {
        activeComponents[stepsList[i]] = true;
      }
    }
  } else {
    // If not playing, use manual toggles
    activeComponents.level = manualToggles.level;
    activeComponents.trend = manualToggles.trend;
    activeComponents.seasonality = manualToggles.seasonality;
  }

  // If combo has NOTHING (None combo), just show empty
  if (stepsList.length === 0) {
    activeComponents.level = false;
  }

  const chartData = useMemo(() => {
    return generateTimeSeriesData({
      length: 120,
      level: 50,
      trend: 0.5,
      seasonality: 20,
      noise: 0,
      modelType: modelType,
      activeComponents
    });
  }, [step, modelType, activeComponents]);

  const multiplicativeData = useMemo(() => {
    if (!compareMode) return [];
    return generateTimeSeriesData({
      length: 120,
      level: 50,
      trend: 0.5,
      seasonality: 20,
      noise: 0,
      modelType: 'multiplicative',
      activeComponents
    });
  }, [step, compareMode, activeComponents]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border-b border-slate-100 bg-slate-50 gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
            title="Back to Matrix"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h3 className="font-bold text-lg text-slate-800">{combo.name}</h3>
            <div className="flex gap-2 mt-1">
              <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${combo.level ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-400'}`}>Level</span>
              <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${combo.trend ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-400'}`}>Trend</span>
              <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${combo.seasonality ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-400'}`}>Seasonality</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setCompareMode(!compareMode)}
            disabled={!combo.trend || !combo.seasonality}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors border ${compareMode ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'} ${(!combo.trend || !combo.seasonality) ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={(!combo.trend || !combo.seasonality) ? "Comparison requires Trend and Seasonality" : ""}
          >
            <Columns className="w-4 h-4" />
            <span className="hidden sm:inline">Compare Modes</span>
          </button>
          
          {!compareMode && (
             <div className="flex bg-slate-200 p-1 rounded-lg">
                <button
                  onClick={() => setModelType('additive')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${modelType === 'additive' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Additive
                </button>
                <button
                  onClick={() => setModelType('multiplicative')}
                  disabled={!combo.trend || !combo.seasonality}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${modelType === 'multiplicative' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'} ${(!combo.trend || !combo.seasonality) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Multiplicative
                </button>
             </div>
          )}
        </div>
      </div>

      {/* Main Graph Area */}
      <div className={`flex-1 flex flex-col ${compareMode ? 'lg:flex-row' : ''} min-h-[40vh]`}>
        <div className="flex-1 border-r border-slate-100">
          <GraphArea 
            data={chartData} 
            modelType={compareMode ? 'additive' : modelType} 
          />
        </div>
        {compareMode && (
          <div className="flex-1 bg-slate-50/50">
            <GraphArea 
              data={multiplicativeData} 
              modelType="multiplicative" 
            />
          </div>
        )}
      </div>

      {/* Construction Controls (Bottom) */}
      <div className="p-4 bg-white border-t border-slate-200">
        <p className="text-slate-600 mb-4">{combo.desc}</p>
        
        <div className="flex flex-col xl:flex-row gap-6 xl:items-center justify-between">
          {/* Manual Toggles */}
          <div className="flex gap-4">
            {['level', 'trend', 'seasonality'].map((comp) => {
              if (!combo[comp]) return null; // Only show toggles for components originally in this combo
              return (
                <label key={comp} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={manualToggles[comp]} 
                    onChange={(e) => {
                      setIsPlaying(false);
                      setStep(0); // Reset animation if manual interaction
                      setManualToggles(prev => ({ ...prev, [comp]: e.target.checked }));
                    }}
                    className="w-4 h-4 text-primary-600 rounded border-slate-300"
                  />
                  <span className="text-sm font-medium text-slate-700 capitalize">{comp}</span>
                </label>
              );
            })}
          </div>

          {/* Animation Steps */}
          {stepsList.length > 0 ? (
            <div className="flex items-center gap-4 flex-1 max-w-xl">
              <button
                onClick={() => {
                  if (step >= maxSteps) setStep(0);
                  setIsPlaying(!isPlaying);
                }}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors shrink-0"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              
              <div className="flex-1 flex items-center justify-between w-full relative">
                <div className="absolute left-0 right-0 h-1 bg-slate-100 rounded-full top-1/2 -translate-y-1/2 z-0" />
                <div 
                  className="absolute left-0 h-1 bg-primary-400 rounded-full top-1/2 -translate-y-1/2 z-0 transition-all duration-300"
                  style={{ width: `${maxSteps > 0 ? (step / maxSteps) * 100 : 100}%` }}
                />
                
                {stepsList.map((comp, idx) => (
                  <button
                    key={comp}
                    onClick={() => {
                      setStep(idx);
                      setIsPlaying(false);
                      // Force manual toggles to match step
                      const newToggles = { ...manualToggles };
                      stepsList.forEach((c, i) => {
                        newToggles[c] = i <= idx;
                      });
                      setManualToggles(newToggles);
                    }}
                    className={`relative z-10 flex flex-col items-center gap-2 transition-all ${idx <= step ? 'text-primary-600' : 'text-slate-400'}`}
                  >
                    <div className={`w-3 h-3 rounded-full border-2 transition-colors ${idx <= step ? 'bg-primary-500 border-primary-500' : 'bg-white border-slate-300'}`} />
                    <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">{comp}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <MousePointer2 className="w-4 h-4" />
              No components to animate.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
