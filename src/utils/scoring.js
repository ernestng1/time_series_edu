export const computeMSE = (targetData, userData) => {
  if (!targetData || !userData || targetData.length !== userData.length || targetData.length === 0) {
    return 0;
  }
  
  let sumSquaredError = 0;
  for (let i = 0; i < targetData.length; i++) {
    const error = targetData[i].value - userData[i].value;
    sumSquaredError += error * error;
  }
  
  return sumSquaredError / targetData.length;
};

export const computeMatchPercentage = (targetData, mse) => {
  if (!targetData || targetData.length === 0) return 0;
  
  // Calculate variance of the target data to use as a baseline for normalization (R-squared approach)
  const mean = targetData.reduce((sum, pt) => sum + pt.value, 0) / targetData.length;
  let sumSquaredVariance = 0;
  
  for (let i = 0; i < targetData.length; i++) {
    const diff = targetData[i].value - mean;
    sumSquaredVariance += diff * diff;
  }
  
  const targetVariance = sumSquaredVariance / targetData.length;
  
  if (targetVariance === 0) return mse === 0 ? 100 : 0;
  
  // R-squared formula: 1 - (MSE / Variance)
  const rSquared = 1 - (mse / targetVariance);
  
  // Convert to a 0-100% score
  const matchPercentage = Math.max(0, Math.min(100, rSquared * 100));
  
  return Math.round(matchPercentage);
};

export const generateHint = (targetParams, userParams, targetActive, userActive) => {
  // First check if they have the wrong model type
  if (targetParams.modelType !== userParams.modelType) {
    return `Try switching to a ${targetParams.modelType === 'additive' ? 'Additive' : 'Multiplicative'} model to match the scaling behavior!`;
  }
  
  const components = ['level', 'trend', 'seasonality'];
  let biggestError = { component: null, diff: 0, direction: '' };
  
  for (const comp of components) {
    const tActive = targetActive[comp];
    const uActive = userActive[comp];
    
    // Check if they missed a toggle entirely
    if (tActive && !uActive) return `You forgot to turn on ${comp}!`;
    if (!tActive && uActive) return `The target graph doesn't actually have any ${comp}. Try turning it off.`;
    
    if (tActive && uActive) {
      let tVal = targetParams[comp];
      let uVal = userParams[comp];
      
      // Normalize values to calculate relative error
      let maxVal = comp === 'trend' ? 5 : (comp === 'level' ? 100 : 100);
      let diff = Math.abs(tVal - uVal) / maxVal;
      
      if (diff > biggestError.diff) {
        biggestError = {
          component: comp,
          diff,
          direction: uVal < tVal ? 'Increase' : 'Decrease'
        };
      }
    }
  }
  
  if (biggestError.diff > 0.05) { // Only give a hint if they are more than 5% off
    return `${biggestError.direction} your ${biggestError.component} value.`;
  }
  
  return "You are incredibly close! Just tiny adjustments needed.";
};
