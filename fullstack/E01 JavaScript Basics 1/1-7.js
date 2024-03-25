let year = prompt("Enter year: ");

function isLeapYear(year) {
    if (year % 4 == 0 && year % 100 != 0) {
      return true;
    }
    if (year % 400 == 0) {
      return true;
    }
    else
    return false;
  }

let isLeap = isLeapYear(year);
// Display message indicating whether input is a leap year
if (isLeap) {
    console.log(year + "is a leap year.");
} else {
  console.log(year + "is not a leap year.");
}

// Node throws a ReferenceError in VSC terminal but code works correctly in browser console