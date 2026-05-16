import React, { useState, useReducer, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import MatchGraphArea from '../components/MatchGraphArea';
import { generateTimeSeriesData } from '../utils/timeSeries';
import { generateTargetParams } from '../utils/gameLogic';
import { computeMSE, computeMatchPercentage, generateHint } from '../utils/scoring';
import { Play, CheckCircle, RefreshCcw, Info } from 'lucide-react';

const initialUserState = {
  level: 50,
  trend: 0,
  seasonality: 0,
  noise: 0,
  modelType: 'additive',
  activeComponents: {
    level: true,
    trend: false,
    seasonality: false,
    noise: false
  }
};

function userReducer(state, action) {
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
    case 'RESET':
      return initialUserState;
    default:
      return state;
  }
}

export default function MatchGame({ isDarkMode }) {
  const [userState, dispatch] = useReducer(userReducer, initialUserState);
  const [targetState, setTargetState] = useState(null);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'submitted'
  const [score, setScore] = useState(null);
  const [hint, setHint] = useState("");

  const startNewGame = () => {
    dispatch({ type: 'RESET' });
    setTargetState(generateTargetParams());
    setGameState('playing');
    setScore(null);
    setHint("");
  };

  useEffect(() => {
    // Start game on first mount
    if (!targetState) {
      startNewGame();
    }
  }, []);

  const targetData = useMemo(() => {
    if (!targetState) return [];
    return generateTimeSeriesData({ ...targetState, length: 120 });
  }, [targetState]);

  const chartData = useMemo(() => {
    if (!targetData.length) return [];
    
    // Force user noise to 0 so the line is smooth for matching
    const cleanUserState = {
      ...userState,
      noise: 0,
      activeComponents: { ...userState.activeComponents, noise: false }
    };
    
    const userData = generateTimeSeriesData({ ...cleanUserState, length: 120 });
    
    return targetData.map((pt, i) => ({
      time: pt.time,
      targetValue: pt.value,
      userValue: userData[i].value
    }));
  }, [userState, targetData]);

  const handleSubmit = () => {
    const targetData = chartData.map(d => ({ value: d.targetValue }));
    const userData = chartData.map(d => ({ value: d.userValue }));
    
    const mse = computeMSE(targetData, userData);
    const percentage = computeMatchPercentage(targetData, mse);
    const newHint = generateHint(targetState, userState, targetState.activeComponents, userState.activeComponents);
    
    setScore(percentage);
    setHint(newHint);
    setGameState('submitted');
  };

  if (!targetState) return null;

  const SubmitButton = gameState === 'playing' ? (
    <button
      onClick={handleSubmit}
      className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-lg transition-colors shadow-sm flex items-center justify-center gap-2"
    >
      <CheckCircle className="w-5 h-5" />
      <span>Submit Match</span>
    </button>
  ) : null;

  return (
    <div className="flex flex-col lg:flex-row h-full w-full relative bg-slate-50 dark:bg-slate-900 overflow-y-auto lg:overflow-hidden transition-colors duration-200">
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full shrink-0 border-r border-slate-200 dark:border-slate-800">
        <Sidebar 
          state={userState} 
          dispatch={dispatch} 
          hideNoise={true}
        >
          {SubmitButton}
        </Sidebar>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:h-full relative">
        
        {/* Top Status Bar */}
        <div className="px-4 py-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center transition-colors duration-200 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Play className="w-5 h-5 text-primary-500 shrink-0" />
            <h2 className="font-bold text-slate-800 dark:text-slate-100 truncate text-sm sm:text-base">Match the Target Line!</h2>
          </div>
        </div>

        {/* Graph Area */}
        <div className="min-h-[45vh] lg:h-auto lg:flex-1 w-full bg-white dark:bg-slate-900 lg:bg-transparent shrink-0 transition-colors duration-200 relative">
          <MatchGraphArea 
            data={chartData} 
            isDarkMode={isDarkMode}
            showTarget={true} // Always show target
          />

          {/* Feedback Overlay when submitted */}
          <AnimatePresence>
            {gameState === 'submitted' && (
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed inset-x-2 bottom-4 lg:absolute lg:inset-x-8 lg:bottom-8 z-50 lg:z-10"
              >
                <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md p-4 lg:p-6 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4 lg:gap-6">
                  
                  <div className="flex items-center gap-4 lg:gap-6 w-full md:w-auto">
                    <div className="flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 w-16 h-16 lg:w-24 lg:h-24 rounded-full border-[3px] lg:border-4 border-primary-500 shrink-0">
                      <span className="text-xl lg:text-3xl font-black text-slate-800 dark:text-slate-100">{score}%</span>
                      <span className="text-[10px] lg:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase hidden sm:block">Match</span>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg lg:text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                        {score >= 95 ? 'Incredible Accuracy!' : score >= 80 ? 'Great Job!' : 'Keep Trying!'}
                      </h3>
                      <p className="text-xs lg:text-sm text-slate-600 dark:text-slate-300 font-medium mb-1 lg:mb-2 bg-slate-100 dark:bg-slate-900/50 inline-block px-2 py-1 rounded-md">
                        Hint: {hint}
                      </p>
                      <div className="hidden sm:flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 max-w-md">
                        <Info className="w-4 h-4 shrink-0 mt-0.5" />
                        <p>
                          Your score is calculated using <strong>Mean Squared Error (MSE)</strong>, a mathematical way to measure how far your line is from the target. Smaller errors result in higher percentage scores!
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={startNewGame}
                    className="w-full md:w-auto px-4 py-2 lg:px-6 lg:py-3 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white rounded-xl font-bold transition-colors shadow-lg flex items-center justify-center gap-2 shrink-0"
                  >
                    <RefreshCcw className="w-5 h-5" />
                    Play Again
                  </button>
                  
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Sidebar */}
        <div className="lg:hidden flex-1 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto">
          <Sidebar 
            state={userState} 
            dispatch={dispatch} 
            className="w-full !border-r-0 !bg-white dark:!bg-slate-900"
            hideNoise={true}
          >
            {SubmitButton}
          </Sidebar>
        </div>

      </div>
    </div>
  );
}
