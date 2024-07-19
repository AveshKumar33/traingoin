export const getCurrentDateInput = () => {
  //get date after 15 days

  let daysafter15 = new Date().getTime() + 15 * 24 * 60 * 60 * 1000;

  //Add 15 days to current date

  const dateObj = new Date(daysafter15);

  // get the month in this format of 04, the same for months
  const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
  const day = ("0" + dateObj.getDate()).slice(-2);
  const year = dateObj.getFullYear();

  const shortDate = `${year}-${month}-${day}`;

  return shortDate;
};
