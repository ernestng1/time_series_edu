import React, { useReducer, useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import GraphArea from '../components/GraphArea';
import { generateTimeSeriesData } from '../utils/timeSeries';
import { Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const initialState = {
  level: 50,
  trend: 0.5,
  seasonality: 20,
  noise: 5,
  modelType: 'additive', // ignored for data generation in this view
  activeComponents: {
    level: true,
    trend: true,
    seasonality: true,
    noise: false
  }
};

function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_PARAM':
      return { ...state, [action.payload.key]: action.payload.value };
    case 'TOGGLE_COMPONENT':
      return {
        ...state,
        activeComponents: {
          ...state.activeComponents,
          [action.payload]: !state.activeComponents[action.payload]
        }
      };
    default:
      return state;
  }
}

export default function CompareModels() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [activeInteraction, setActiveInteraction] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Generate data for both models
  const additiveData = useMemo(() => {
    return generateTimeSeriesData({
      length: 120,
      level: state.level,
      trend: state.trend,
      seasonality: state.seasonality,
      noise: state.noise,
      modelType: 'additive',
      activeComponents: state.activeComponents
    });
  }, [state]);

  const multiplicativeData = useMemo(() => {
    return generateTimeSeriesData({
      length: 120,
      level: state.level,
      trend: state.trend,
      seasonality: state.seasonality,
      noise: state.noise,
      modelType: 'multiplicative',
      activeComponents: state.activeComponents
    });
  }, [state]);

  return (
    <div className="flex h-full w-full relative">
      {/* Shared Controls Sidebar */}
      <div className="hidden lg:block h-full">
        {/* Hide Model Selection section in Compare mode using CSS or just let it exist but be overridden visually? 
            Since Sidebar expects it, we'll let it exist but it won't affect the graphs here. */}
        <Sidebar 
          state={state} 
          dispatch={dispatch} 
          setActiveInteraction={setActiveInteraction}
        />
      </div>

      <div className="flex-1 flex flex-col relative h-full">
        {/* Mobile controls toggle */}
        <div className="lg:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-30">
          <button 
            onClick={() => setMobileDrawerOpen(true)}
            className="px-6 py-3 bg-slate-800 text-white rounded-full shadow-xl flex items-center gap-2 font-medium"
          >
            <Settings2 className="w-5 h-5" />
            Tune Shared Parameters
          </button>
        </div>

        <div className="flex-1 overflow-auto bg-slate-50/50 p-4 lg:p-8 flex flex-col lg:flex-row gap-8">
          <div className="flex-1 flex flex-col min-h-[400px]">
            <GraphArea 
              data={additiveData} 
              modelType="additive" 
              activeInteraction={activeInteraction} 
            />
          </div>
          <div className="flex-1 flex flex-col min-h-[400px]">
            <GraphArea 
              data={multiplicativeData} 
              modelType="multiplicative" 
              activeInteraction={activeInteraction} 
            />
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm"
              onClick={() => setMobileDrawerOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 h-[80vh] bg-white z-50 rounded-t-3xl shadow-2xl overflow-hidden flex flex-col lg:hidden"
            >
              <div className="w-full flex justify-center py-3 bg-white shrink-0">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
              </div>
              <div className="flex-1 overflow-y-auto">
                <Sidebar 
                  state={state} 
                  dispatch={dispatch} 
                  setActiveInteraction={setActiveInteraction}
                  className="w-full border-r-0"
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
