import React, { useMemo, useState } from 'react';
import MiniGraph from '../components/MiniGraph';
import ExpandedLearningView from '../components/ExpandedLearningView';
import { generateTimeSeriesData } from '../utils/timeSeries';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COMBINATIONS = [
  { id: 1, name: 'None (Minimal Signal)', level: false, trend: false, seasonality: false, desc: 'A flat line at zero. Represents no underlying structure.' },
  { id: 2, name: 'Level Only', level: true, trend: false, seasonality: false, desc: 'A constant horizontal line representing a stable baseline.' },
  { id: 3, name: 'Trend Only', level: false, trend: true, seasonality: false, desc: 'A steady upward slope showing continuous growth.' },
  { id: 4, name: 'Seasonality Only', level: false, trend: false, seasonality: true, desc: 'A repeating wave pattern centered around zero.' },
  { id: 5, name: 'Level + Trend', level: true, trend: true, seasonality: false, desc: 'A sloped line starting from a higher baseline.' },
  { id: 6, name: 'Level + Seasonality', level: true, trend: false, seasonality: true, desc: 'A repeating wave pattern elevated by a constant baseline.' },
  { id: 7, name: 'Trend + Seasonality', level: false, trend: true, seasonality: true, desc: 'A repeating wave superimposed on an upward slope.' },
  { id: 8, name: 'Level + Trend + Seasonality', level: true, trend: true, seasonality: true, desc: 'The complete model: baseline, slope, and waves all combined.' },
];

export default function OverviewMatrix({ onNavigate }) {
  const [selectedCombo, setSelectedCombo] = useState(null);

  const combinationsData = useMemo(() => {
    return COMBINATIONS.map(combo => ({
      ...combo,
      data: generateTimeSeriesData({
        length: 120,
        level: 50,
        trend: 0.5,
        seasonality: 20,
        noise: 0, // No noise for clear concepts
        modelType: 'additive',
        activeComponents: {
          level: combo.level,
          trend: combo.trend,
          seasonality: combo.seasonality,
          noise: false
        }
      })
    }));
  }, []);

  return (
    <div className="h-full overflow-y-auto bg-slate-50 relative p-4 lg:p-8">
      <AnimatePresence mode="wait">
        {!selectedCombo ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-7xl mx-auto h-full"
          >
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-800">Concept Matrix</h2>
                <p className="text-slate-500 mt-2 max-w-2xl text-sm lg:text-base">
                  Explore the 8 fundamental combinations of time series components. Select a card to launch the interactive learning module and see how the data is constructed step-by-step.
                </p>
              </div>
              <button 
                onClick={() => onNavigate('builder')}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-medium transition-colors shrink-0"
              >
                Go to Interactive Builder <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {combinationsData.map((combo) => (
                <motion.div
                  key={combo.id}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedCombo(combo)}
                  className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full group"
                >
                  <h3 className="font-bold text-slate-800 mb-2 truncate group-hover:text-primary-600 transition-colors">{combo.name}</h3>
                  <div className="pointer-events-none">
                    <MiniGraph data={combo.data} />
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2 mb-3">
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${combo.level ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-400'}`}>Level</span>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${combo.trend ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>Trend</span>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${combo.seasonality ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-400'}`}>Seasonality</span>
                  </div>
                  
                  <p className="text-xs text-slate-500 mt-auto leading-relaxed">{combo.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="learning-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="max-w-7xl mx-auto h-full min-h-[600px]"
          >
            <ExpandedLearningView 
              combo={selectedCombo} 
              onBack={() => setSelectedCombo(null)} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
