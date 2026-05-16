import React, { useState, useEffect, useMemo } from 'react';
import GraphArea from '../components/GraphArea';
import { generateTimeSeriesData } from '../utils/timeSeries';
import { generateQuizQuestion } from '../utils/quizGenerator';
import { Brain, CheckCircle, XCircle, ArrowRight, Award, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuizMode() {
  const [difficulty, setDifficulty] = useState('beginner'); // beginner, intermediate, advanced
  const [quizState, setQuizState] = useState(null); // { params, question }
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [questionRevealed, setQuestionRevealed] = useState(false);
  
  // Score tracking
  const [score, setScore] = useState(0);
  const [roundsPlayed, setRoundsPlayed] = useState(0);

  // Initialize first question
  useEffect(() => {
    generateNewQuestion(difficulty);
  }, [difficulty]);

  const generateNewQuestion = (diffLevel) => {
    const newQuiz = generateQuizQuestion(diffLevel);
    setQuizState(newQuiz);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuestionRevealed(false);
  };

  const handleAnswer = (answer) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
    setRoundsPlayed(prev => prev + 1);
    if (answer === quizState.question.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    // Auto progress difficulty if doing well
    let nextDiff = difficulty;
    if (difficulty === 'beginner' && score >= 2) nextDiff = 'intermediate';
    if (difficulty === 'intermediate' && score >= 5) nextDiff = 'advanced';
    
    if (nextDiff !== difficulty) {
      setDifficulty(nextDiff);
    } else {
      generateNewQuestion(difficulty);
    }
  };

  // Generate chart data based on current quiz params
  const chartData = useMemo(() => {
    if (!quizState) return [];
    return generateTimeSeriesData({
      length: 120,
      ...quizState.params
    });
  }, [quizState]);

  if (!quizState) return null;

  const isCorrect = selectedAnswer === quizState.question.correctAnswer;

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto">
      
      {/* Header & Score */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white border-b border-slate-200 shrink-0 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Knowledge Check</h2>
            <div className="flex gap-2 text-sm mt-1">
              <span className={`px-2 py-0.5 rounded-md font-medium ${
                difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl">
          <Award className="w-5 h-5 text-amber-500" />
          <span className="font-medium text-slate-600">Score:</span>
          <div className="text-xl font-bold text-slate-800">
            {score} <span className="text-sm text-slate-400 font-normal">/ {roundsPlayed}</span>
          </div>
        </div>
      </div>

      {/* Primary Focus: The Graph */}
      <div className="w-full h-[50vh] lg:h-[60vh] bg-white border-b border-slate-200 shrink-0 shadow-sm relative">
        {!questionRevealed && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-indigo-50 border border-indigo-200 text-indigo-700 px-4 py-2 rounded-full font-medium text-sm shadow-sm flex items-center gap-2">
            <Eye className="w-4 h-4" /> Analyze the data below carefully
          </div>
        )}
        <GraphArea 
          data={chartData} 
          modelType={quizState.params.modelType} 
          activeInteraction={null}
        />
      </div>

      {/* Question & Answer Area */}
      <div className="flex-1 w-full max-w-4xl mx-auto p-6 lg:p-8">
        {!questionRevealed ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center pt-8 text-center"
          >
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Ready to test your observation?</h3>
            <p className="text-slate-500 mb-8 max-w-lg">
              Take a moment to visually analyze the time series above. Look for patterns like slopes, waves, or shifting baselines before continuing.
            </p>
            <button
              onClick={() => setQuestionRevealed(true)}
              className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              Reveal Question
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8"
          >
            <h3 className="text-xl lg:text-2xl font-semibold text-slate-800 mb-8 text-center">
              {quizState.question.text}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {quizState.question.options.map((option, idx) => {
                let btnClass = "border-slate-200 hover:border-primary-300 hover:bg-primary-50 text-slate-700";
                
                if (showResult) {
                  if (option === quizState.question.correctAnswer) {
                    btnClass = "border-green-500 bg-green-50 text-green-700 shadow-sm";
                  } else if (option === selectedAnswer) {
                    btnClass = "border-red-500 bg-red-50 text-red-700";
                  } else {
                    btnClass = "border-slate-200 bg-slate-50 text-slate-400 opacity-50";
                  }
                } else if (selectedAnswer === option) {
                  btnClass = "border-primary-500 bg-primary-50 text-primary-700";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option)}
                    disabled={showResult}
                    className={`w-full p-4 rounded-xl border-2 font-medium transition-all text-center flex items-center justify-center gap-3 text-lg ${btnClass}`}
                  >
                    <span>{option}</span>
                    {showResult && option === quizState.question.correctAnswer && (
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    )}
                    {showResult && option === selectedAnswer && option !== quizState.question.correctAnswer && (
                      <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-8 overflow-hidden max-w-2xl mx-auto"
                >
                  <div className={`p-5 rounded-xl border ${isCorrect ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                    <h4 className={`font-bold text-lg mb-2 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                      {isCorrect ? 'Correct!' : 'Not quite.'}
                    </h4>
                    <p className={`text-base ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      {quizState.question.explanation}
                    </p>
                  </div>
                  
                  <div className="mt-8 flex justify-end">
                    <button 
                      onClick={nextQuestion}
                      className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-colors shadow-md hover:shadow-lg w-full sm:w-auto"
                    >
                      Analyze Next Graph <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
      
    </div>
  );
}
