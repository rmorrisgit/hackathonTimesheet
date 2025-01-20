export const getPayPeriodDates = () => {
  const referenceDate = new Date("2025-01-14"); // Known pay period start
  const today = new Date();

  // Calculate start of the current pay period
  const daysSinceReference = Math.floor((today - referenceDate) / (1000 * 60 * 60 * 24));
  const periodsSinceReference = Math.floor(daysSinceReference / 14);
  const payPeriodStart = new Date(referenceDate);
  payPeriodStart.setDate(referenceDate.getDate() + periodsSinceReference * 14);

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  // Generate two weeks of pay periods
  const week1 = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(payPeriodStart);
    date.setDate(payPeriodStart.getDate() + i);
    return formatDate(date);
  });

  const week2 = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(payPeriodStart);
    date.setDate(payPeriodStart.getDate() + 7 + i);
    return formatDate(date);
  });

  return { week1, week2 };
};
