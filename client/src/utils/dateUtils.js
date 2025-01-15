import { format, getDaysInMonth } from "date-fns";

export const getWeeksForCurrentPeriod = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();
  const daysInMonth = getDaysInMonth(today);

  // Determine if the current date is in the first or second half
  const isFirstHalf = day <= 15;

  // Generate the date range for the current period
  const startDay = isFirstHalf ? 1 : 15;
  const endDay = isFirstHalf ? 15 : daysInMonth;

  const dates = [];
  for (let i = startDay; i <= endDay; i++) {
    const date = new Date(year, month, i);
    dates.push({
      day: format(date, "EEEE"), // e.g., "Monday"
      date: format(date, "MMMM d"), // e.g., "January 15"
    });
  }

  // Split into two weeks
  const midIndex = Math.ceil(dates.length / 2);
  const week1 = dates.slice(0, midIndex);
  const week2 = dates.slice(midIndex);

  return { week1, week2 };
};
