export const getPayPeriodDates = (startDate) => {
    const start = new Date(startDate);
    const weeks = [];
    for (let week = 0; week < 2; week++) {
      const dates = [];
      for (let day = 0; day < 7; day++) {
        const current = new Date(start);
        current.setDate(start.getDate() + week * 7 + day);
        dates.push({
          day: current.toLocaleDateString("en-US", { weekday: "long", timeZone: "America/Halifax" }),
          date: current.toLocaleDateString("en-US", { month: "long", day: "numeric", timeZone: "America/Halifax" }),
        });
      }
      weeks.push({ weekNumber: week + 1, dates });
    }
    return weeks;
  };
  