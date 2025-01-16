export const getPayPeriodDates = () => {
    const referenceDate = new Date("2025-01-14"); // Start of a known 2-week pay period
    const today = new Date();
  
    // Calculate the number of days since the reference date
    const daysSinceReference = Math.floor((today - referenceDate) / (1000 * 60 * 60 * 24));
    
    // Calculate the current pay period index (2 weeks = 14 days)
    const periodsSinceReference = Math.floor(daysSinceReference / 14);
  
    // Calculate the start date of the current pay period
    const payPeriodStartDate = new Date(referenceDate);
    payPeriodStartDate.setDate(referenceDate.getDate() + periodsSinceReference * 14);
  
    // Generate the two weeks of pay period dates
    const weeks = [];
    for (let week = 0; week < 2; week++) {
      const dates = [];
      for (let day = 0; day < 7; day++) {
        const current = new Date(payPeriodStartDate);
        current.setDate(payPeriodStartDate.getDate() + week * 7 + day);
        
        dates.push({
          day: current.toLocaleDateString("en-US", { weekday: "long", timeZone: "America/Halifax" }),
          date: current.toLocaleDateString("en-US", { month: "long", day: "numeric", timeZone: "America/Halifax" }),
        });
      }
      weeks.push({ weekNumber: week + 1, dates });
    }
  
    return weeks;
  };
  