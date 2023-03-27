let currentYearDate = new Date();
let startYearDate = new Date();

currentYearDate.setMonth(currentYearDate.getMonth() - 1);
currentYearDate.setDate(currentYearDate.getDate() - 11);
startYearDate.setFullYear(startYearDate.getFullYear() - 1);
startYearDate.setMonth(startYearDate.getMonth() - 1);
startYearDate.setDate(startYearDate.getDate() - 11);
console.log(startYearDate, currentYearDate);
