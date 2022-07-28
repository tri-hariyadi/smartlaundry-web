const getAllDaysInMonth = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  const dates = [];
  while (date.getMonth() === month) {
    dates.push(new Date(date).getDate());
    date.setDate(date.getDate() + 1);
  }
  return dates;
};

export default getAllDaysInMonth;
