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
  
  // Calculate progress to next year
  // If we're in January (0), we're 1 month into the new year
  const currentMonth = now.getMonth(); // 0-11
  const currentDay = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), currentMonth + 1, 0).getDate();
  
  // Progress is current month (starting from December) plus day progress
  const monthProgress = (currentMonth + 1) / 12; // January = 1/12
  const dayProgress = (currentDay / daysInMonth) / 12; // Fraction of a month
  
  const progressToNextYear = (monthProgress + dayProgress) * 100;
  
  return {
    years,
    progressToNextYear: Math.round(progressToNextYear * 10) / 10 // Round to 1 decimal
  };
}; 