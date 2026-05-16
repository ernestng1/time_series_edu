export const generateTimeSeriesData = (params) => {
  const {
    length = 100,
    level = 50,
    trend = 0,
    seasonality = 0,
    noise = 0,
    modelType = 'additive',
    activeComponents = {
      level: true,
      trend: true,
      seasonality: true,
      noise: true
    }
  } = params;

  const data = [];
  const seasonalPeriod = 12; // 12 periods per season

  for (let t = 0; t < length; t++) {
    let value = 0;
    let dataPoint = {};

    if (modelType === 'additive') {
      // 1. Level
      const currentLevel = activeComponents.level ? level : 0;
      // 2. Trend
      const currentTrend = activeComponents.trend ? trend * t : 0;
      // 3. Seasonality
      const currentSeasonality = activeComponents.seasonality ? seasonality * Math.sin((2 * Math.PI * t) / seasonalPeriod) : 0;
      // 4. Noise
      const currentNoise = activeComponents.noise ? (Math.random() * 2 - 1) * noise : 0;

      value = currentLevel + currentTrend + currentSeasonality + currentNoise;

      dataPoint = {
        time: t,
        value: Math.max(0, value),
        level: currentLevel,
        trend: currentTrend,
        seasonality: currentSeasonality,
        noise: currentNoise
      };
    } else {
      // Multiplicative Model
      const currentLevel = activeComponents.level ? level : 1;
      
      // Trend is a compound multiplier. A trend slider of 5 means a 2.5% increase per step to prevent graph from blowing up visually
      const currentTrend = activeComponents.trend ? Math.pow(1 + (trend / 200), t) : 1;
      
      // Seasonality is a multiplier oscillating around 1. 
      const currentSeasonality = activeComponents.seasonality ? 1 + (Math.sin((2 * Math.PI * t) / seasonalPeriod) * (seasonality / 100)) : 1;
      
      // Noise is a multiplier centered around 1.
      const currentNoise = activeComponents.noise ? 1 + ((Math.random() * 2 - 1) * (noise / 100)) : 1;

      value = currentLevel * currentTrend * currentSeasonality * currentNoise;

      dataPoint = {
        time: t,
        value: Math.max(0, value),
        level: currentLevel,
        trend: currentTrend,
        seasonality: currentSeasonality,
        noise: currentNoise
      };
    }

    data.push(dataPoint);
  }

  return data;
};
