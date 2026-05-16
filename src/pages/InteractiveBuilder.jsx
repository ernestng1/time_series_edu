import React, { useReducer, useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import GraphArea from '../components/GraphArea';
import EquationSection from '../components/EquationSection';
import { generateTimeSeriesData } from '../utils/timeSeries';

const initialState = {
  level: 50,
  trend: 0.5,
  seasonality: 20,
  noise: 5,
  modelType: 'additive', // 'additive' | 'multiplicative'
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

export default function InteractiveBuilder({ isDarkMode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [activeInteraction, setActiveInteraction] = useState(null);

  // Generate data whenever state changes
  const chartData = useMemo(() => {
    return generateTimeSeriesData({
      length: 120, // 10 years of monthly data
      level: state.level,
      trend: state.trend,
      seasonality: state.seasonality,
      noise: state.noise,
      modelType: state.modelType,
      activeComponents: state.activeComponents
    });
  }, [state]);

  return (
    <div className="flex flex-col lg:flex-row h-full w-full relative bg-slate-50 dark:bg-slate-900 overflow-y-auto lg:overflow-hidden transition-colors duration-200">
      
      {/* Desktop Sidebar (Hidden on mobile, uses flex-row layout) */}
      <div className="hidden lg:block h-full shrink-0 border-r border-slate-200 dark:border-slate-800">
        <Sidebar 
          state={state} 
          dispatch={dispatch} 
          setActiveInteraction={setActiveInteraction}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:h-full">
        
        {/* Graph Area (Always Primary, 60vh on mobile, flex-1 on desktop) */}
        <div className="h-[60vh] lg:h-auto lg:flex-1 w-full bg-white dark:bg-slate-900 lg:bg-transparent shrink-0 transition-colors duration-200">
          <GraphArea 
            data={chartData} 
            modelType={state.modelType} 
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Stacked Content Below Graph (Mobile) / Below Graph (Desktop) */}
        <div className="flex-1 lg:h-auto border-t border-slate-200 dark:border-slate-800 lg:border-none flex flex-col transition-colors duration-200">
          <EquationSection 
            modelType={state.modelType} 
            activeInteraction={activeInteraction}
            activeComponents={state.activeComponents}
            isDarkMode={isDarkMode}
          />
          
          {/* Mobile inline controls (Hidden on Desktop because desktop uses left sidebar) */}
          <div className="lg:hidden w-full">
            <Sidebar 
              state={state} 
              dispatch={dispatch} 
              setActiveInteraction={setActiveInteraction}
              className="w-full !border-r-0 !bg-white dark:!bg-slate-900"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
