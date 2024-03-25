displayArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

function displayArray(numbers) {
    console.log("Original array: ", numbers);
    let oddNumbers = numbers.filter(number => number % 2 != 0);  
    // Display the array with only odd numbers
    console.log("Array with only odd numbers: ", oddNumbers);
}