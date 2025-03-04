// Everything is loaded dynamically on one page 

const apiUrl = "https://api.quotable.io/random";
const quoteSection = document.getElementById("quote"); 
const userInput = document.getElementById("quote-input");
const timeDisplay = document.getElementById("time");
const errorDisplay = document.getElementById("errors");
const resultTime = document.getElementById("result-time");
const resultErrors = document.getElementById("result-errors");
const resultSpeed = document.getElementById("result-speed");
const testCountDisplay = document.getElementById("test-count");

let completedTests = [];
let quote = "";
let time = 0;
let timer = null;
let mistakes = 0;
let testStarted = false; // Track whether test is started

const renderNewQuote = async () => {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        quote = data.content;
        quoteSection.innerHTML = "";

        quote.split("").forEach((char) => {
            const span = document.createElement("span");
            span.classList.add("quote-chars");
            span.innerText = char;
            quoteSection.appendChild(span);
        }); // Convert quote text into spans for character comparison
        userInput.value = ""; // Clear input field  when new quote is displayed
        userInput.disabled = false; // Enable input
        testStarted = false; // Reset test start tracking

    } catch (error) {
        console.error("Error fetching quote:", error);
    }
}

const startTest = () => {
    mistakes = 0;
    time = 0;
    userInput.disabled = false;
    userInput.focus();
    errorDisplay.innerText = "0";
    timeDisplay.innerText = "0";

    if (timer) clearInterval(timer); // Reset timer if already running
    timer = setInterval(updateTimer, 1000);

    document.querySelector(".result").style.display = "none"; // Hide result when restarting
    document.getElementById("stop-test").style.display = "block"; // Show stop button
    // document.getElementById("start-test").style.display = "none"; // Hide start button
    
};

function updateTimer() {
    time++;
    timeDisplay.innerText = time;
} // Update timer

userInput.addEventListener("input", () => {
    if (!testStarted) {
        startTest(); // Start the test when user types the first character
        testStarted = true;
    }
    
    let quoteChars = document.querySelectorAll(".quote-chars");
    let userInputChars = userInput.value.split("");

    mistakes = 0;
    let isComplete = userInput.value.length === quote.length; // Check whether length of user input matches quote exactly

    quoteChars.forEach((char, index) => {
        if (userInputChars[index] === char.innerText) {
            char.classList.add("correct");
            char.classList.remove("incorrect"); // Correct: green
        } else if (userInputChars[index]) {
            char.classList.add("incorrect");
            char.classList.remove("correct"); // Incorrect: red
            mistakes++;
        }
    }); 

    errorDisplay.innerText = mistakes;

    if (isComplete && userInput.value === quote) {
        displayResult(); // Stop test when user finishes typing correct input
    }
});

arrayDetails = function() {
    console.log("Completed Tests:");
    completedTests.forEach((test, index) => {
        console.log(`Test ${index + 1}:`);
        console.log(`Timestamp: ${test.timestamp}`);
        console.log(`Time Taken: ${test.timeTaken} seconds`);
        console.log(`Errors: ${test.errors}`);
        console.log(`Words Per Minute: ${test.wordsPerMinute}`);
    });
}; // Display completed tests in console

const displayResult = () => {
    clearInterval(timer); // Stop the timer when "Stop Test" is clicked
    document.querySelector(".result").style.display = "block"; // Show result
    document.getElementById("stop-test").style.display = "none"; // Hide stop button

    // document.getElementById("start-test").style.display = "block"; // Show start button
    if (mistakes > 0 || userInput.value !== quote) {
        alert("The text does not match. Please try again.");
        renderNewQuote(); // Reload a new quote instead of restarting test
        return; // Exit the function early
    }

    resultTime.innerText = time;
    resultErrors.innerText = mistakes;

    let words = quote.split(" ").length;
    let wpm = Math.round((words / time) * 60);
    resultSpeed.innerText = isFinite(wpm) ? wpm : 0; // Prevent NaN issue if time is 0

    completedTests.push({
        timestamp: new Date().toLocaleString(),
        timeTaken: time,
        errors: mistakes,
        wordsPerMinute: wpm ? wpm : 0
    }); // Store test details in array

    if (testCountDisplay) {
        testCountDisplay.innerText = completedTests.length;
    } else {
        console.error("Error: testCountDisplay element not found!"); // Error handling
    } // Update/display count of completed tests

    // Load a new quote after successfully completing a test
    setTimeout(renderNewQuote, 5000); // Wait 5 seconds before loading a new quote
} 

window.onload = () => {
    renderNewQuote();
    
    /* if (timeDisplay) {
        timeDisplay.innerText = "0"; // Ensure timer is visible at page load
        timeDisplay.display = "block";
    } else {
        console.error("Error: timeDisplay element not found!");
    }

    if (errorDisplay) {
        errorDisplay.innerText = "0"; // Ensure error counter is visible at page load
    } else {
        console.error("Error: errorDisplay element not found!");
    } */

    document.getElementById("stop-test").style.display = "none"; // Hide stop button initially
}; 
