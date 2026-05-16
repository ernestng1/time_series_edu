export const generateTargetParams = () => {
  const modelType = Math.random() > 0.5 ? 'additive' : 'multiplicative';
  
  // Keep noise minimal but present as requested
  const noise = Math.floor(Math.random() * 5) + 1; // 1 to 5
  
  // Random level 20 to 80
  const level = Math.floor(Math.random() * 60) + 20;
  
  // Random trend: -2 to +3
  const trend = Math.round((Math.random() * 5 - 2) * 10) / 10;
  
  // Random seasonality
  const maxSeasonality = modelType === 'multiplicative' ? 40 : 30;
  const seasonality = Math.floor(Math.random() * maxSeasonality) + 10; // 10 to max
  
  // Randomly decide which components are active (level always active for a base)
  const activeComponents = {
    level: true,
    trend: Math.random() > 0.2, // 80% chance to have trend
    seasonality: Math.random() > 0.1, // 90% chance to have seasonality
    noise: true // Noise always active but minimal
  };
  
  return {
    modelType,
    level,
    trend,
    seasonality,
    noise,
    activeComponents
  };
};
