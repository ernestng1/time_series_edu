export const generateQuizQuestion = (difficulty) => {
  // Common randomizers
  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const randFloat = (min, max) => Math.random() * (max - min) + min;
  
  // Decide whether the correct answer is additive or multiplicative
  const isMultiplicative = Math.random() > 0.5;
  const modelType = isMultiplicative ? 'multiplicative' : 'additive';

  let params = {
    level: 50,
    trend: 0,
    seasonality: 0,
    noise: 0,
    modelType,
    activeComponents: {
      level: true,
      trend: false,
      seasonality: false,
      noise: false
    }
  };

  let questionText = "";
  let correctAnswer = "";
  let explanation = "";
  let options = [];

  if (difficulty === 'beginner') {
    // Single distinct component recognition (either trend or seasonality)
    const askAbout = Math.random() > 0.5 ? 'trend' : 'seasonality';
    
    if (askAbout === 'trend') {
      params.trend = randFloat(0.5, 1.5) * (Math.random() > 0.5 ? 1 : -1);
      params.activeComponents.trend = true;
      questionText = "Does this graph contain a trend?";
      correctAnswer = "Yes";
      options = ["Yes", "No"];
      explanation = "A trend represents a long-term upward or downward movement in the data.";
    } else {
      params.seasonality = randInt(15, 30);
      params.activeComponents.seasonality = true;
      params.modelType = 'additive'; // Keep simple
      questionText = "Does this graph contain seasonality?";
      correctAnswer = "Yes";
      options = ["Yes", "No"];
      explanation = "Seasonality represents a repeating pattern or cycle of a fixed period.";
    }

  } else if (difficulty === 'intermediate') {
    // Combinations of components
    params.trend = randFloat(0.3, 1.0);
    params.seasonality = randInt(10, 25);
    params.activeComponents.trend = true;
    params.activeComponents.seasonality = true;
    params.noise = randInt(2, 5); // Mild noise
    params.activeComponents.noise = true;
    
    // Sometimes force additive for comparison
    params.modelType = Math.random() > 0.5 ? 'additive' : 'multiplicative';

    questionText = "Which structural components are visible in this graph?";
    
    // We generated it with Trend + Seasonality
    const hasTrend = true;
    const hasSeasonality = true;
    
    // Randomize actual question slightly
    const askAboutCombo = Math.random() > 0.5;
    if (askAboutCombo) {
      questionText = "What combination of components is present?";
      correctAnswer = "Trend + Seasonality";
      options = ["Level Only", "Trend Only", "Seasonality Only", "Trend + Seasonality"];
      explanation = "The graph exhibits an overall upward slope (Trend) along with repeating waves (Seasonality).";
    } else {
      questionText = "Is this model Additive or Multiplicative?";
      correctAnswer = params.modelType === 'additive' ? "Additive" : "Multiplicative";
      options = ["Additive", "Multiplicative"];
      explanation = params.modelType === 'additive' 
        ? "The seasonal waves remain a constant size regardless of the overall level/trend."
        : "The seasonal waves increase in magnitude as the overall level/trend increases.";
    }

  } else if (difficulty === 'advanced') {
    // Heavy noise, multiplicative vs additive
    params.trend = randFloat(0.8, 1.5);
    params.seasonality = randInt(15, 30);
    params.noise = randInt(10, 20); // Heavy noise
    params.activeComponents.trend = true;
    params.activeComponents.seasonality = true;
    params.activeComponents.noise = true;

    questionText = "Despite the noise, is the underlying seasonality Additive or Multiplicative?";
    correctAnswer = params.modelType === 'additive' ? "Additive" : "Multiplicative";
    options = ["Additive", "Multiplicative"];
    explanation = params.modelType === 'additive'
      ? "Even with heavy noise, you can see the amplitude (height) of the seasonal peaks does not grow proportionally with the trend."
      : "Even with heavy noise, notice how the variance/amplitude of the seasonal peaks gets noticeably wider as the trend grows higher.";
  }

  // Shuffle options
  options = options.sort(() => Math.random() - 0.5);

  return {
    params,
    question: {
      text: questionText,
      options,
      correctAnswer,
      explanation
    }
  };
};
