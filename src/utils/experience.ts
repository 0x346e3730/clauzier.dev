import { experiences } from '../data/experiences';

export const calculateExperience = () => {
  const now = new Date();

  // Get all unique months worked (to avoid counting overlapping periods)
  const monthsWorked = new Set();
  
  experiences.forEach(exp => {
    let startDate = new Date(exp.startDate.year, exp.startDate.month - 1, 1);
    let endDate = exp.endDate 
      ? new Date(exp.endDate.year, exp.endDate.month - 1, 1)
      : new Date(now.getFullYear(), now.getMonth(), 1);
      
    // Add each month to the set
    while (startDate <= endDate) {
      monthsWorked.add(`${startDate.getFullYear()}-${startDate.getMonth()}`);
      startDate.setMonth(startDate.getMonth() + 1);
    }
  });

  const totalMonths = monthsWorked.size;
  const years = Math.floor(totalMonths / 12);

  // Calculate progress to next experience year
  // Find the earliest start date to determine the anniversary date
  let earliestStart = new Date();
  experiences.forEach(exp => {
    const startDate = new Date(exp.startDate.year, exp.startDate.month - 1, 1);
    if (startDate < earliestStart) {
      earliestStart = startDate;
    }
  });

  // Calculate the most recent anniversary and the next one
  const anniversaryMonth = earliestStart.getMonth();
  const anniversaryDay = 1; // Using first day of the month for consistency

  const currentYear = now.getFullYear();
  const thisYearAnniversary = new Date(currentYear, anniversaryMonth, anniversaryDay);
  const nextYearAnniversary = new Date(currentYear + 1, anniversaryMonth, anniversaryDay);
  const lastYearAnniversary = new Date(currentYear - 1, anniversaryMonth, anniversaryDay);

  // Determine which anniversary period we're in
  const startAnniversary = now >= thisYearAnniversary ? thisYearAnniversary : lastYearAnniversary;
  const endAnniversary = now >= thisYearAnniversary ? nextYearAnniversary : thisYearAnniversary;

  // Calculate progress within the current experience year
  const yearDuration = endAnniversary.getTime() - startAnniversary.getTime();
  const timeSinceAnniversary = now.getTime() - startAnniversary.getTime();
  const progressToNextYear = (timeSinceAnniversary / yearDuration) * 100;

  return {
    years,
    progressToNextYear: Math.round(progressToNextYear * 10) / 10 // Round to 1 decimal
  };
}; 