import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, X, CheckCircle, XCircle } from 'lucide-react';

export default function QuizOverlay({ onClose }) {
  const [step, setStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  // Pre-configured questions
  const questions = [
    {
      id: 1,
      imagePlaceholder: "A graph where the seasonal waves get larger as the trend goes up.",
      description: "Notice how the seasonal peaks and valleys expand as the overall value increases.",
      correctAnswer: 'multiplicative',
      explanation: "Because the seasonal amplitude increases proportionally with the trend, this is a Multiplicative model."
    },
    {
      id: 2,
      imagePlaceholder: "A graph where the seasonal waves remain the exact same size despite an upward trend.",
      description: "Notice how the distance between the peaks and valleys stays constant.",
      correctAnswer: 'additive',
      explanation: "Because the seasonal amplitude remains constant regardless of the trend level, this is an Additive model."
    }
  ];

  const currentQuestion = questions[step];

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setShowResult(true);
  };

  const nextQuestion = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2 text-primary-600 font-semibold">
            <Brain className="w-5 h-5" />
            Knowledge Check ({step + 1}/{questions.length})
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 lg:p-8">
          <p className="text-lg text-slate-800 mb-6 font-medium text-center">
            Based on the description below, what type of model is this?
          </p>

          <div className="bg-slate-100 rounded-xl p-8 mb-6 border border-slate-200 flex items-center justify-center text-center min-h-[160px]">
            <div>
              <p className="text-slate-600 italic mb-2">"{currentQuestion.imagePlaceholder}"</p>
              <p className="text-sm text-slate-500">{currentQuestion.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => !showResult && handleAnswer('additive')}
              disabled={showResult}
              className={`p-4 rounded-xl border-2 font-medium transition-all ${
                showResult 
                  ? currentQuestion.correctAnswer === 'additive'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : selectedAnswer === 'additive'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-slate-200 bg-slate-50 text-slate-400 opacity-50'
                  : 'border-slate-200 hover:border-primary-300 hover:bg-primary-50 text-slate-700'
              }`}
            >
              Additive Model
            </button>
            <button
              onClick={() => !showResult && handleAnswer('multiplicative')}
              disabled={showResult}
              className={`p-4 rounded-xl border-2 font-medium transition-all ${
                showResult 
                  ? currentQuestion.correctAnswer === 'multiplicative'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : selectedAnswer === 'multiplicative'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-slate-200 bg-slate-50 text-slate-400 opacity-50'
                  : 'border-slate-200 hover:border-primary-300 hover:bg-primary-50 text-slate-700'
              }`}
            >
              Multiplicative Model
            </button>
          </div>

          <AnimatePresence>
            {showResult && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 overflow-hidden"
              >
                <div className={`p-4 rounded-xl flex gap-3 ${selectedAnswer === currentQuestion.correctAnswer ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  {selectedAnswer === currentQuestion.correctAnswer ? (
                    <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500 shrink-0" />
                  )}
                  <div>
                    <p className="font-semibold mb-1">
                      {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Not quite.'}
                    </p>
                    <p className="text-sm opacity-90">{currentQuestion.explanation}</p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button 
                    onClick={nextQuestion}
                    className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
                  >
                    {step < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
