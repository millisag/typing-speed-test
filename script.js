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
        }); // Convert quote text into spans for character accuracy comparison
        userInput.value = ""; // Clear input field  when new quote is displayed
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
    document.getElementById("start-test").style.display = "none"; // Hide start button
    
    renderNewQuote(); // Get a new quote
};

function updateTimer() {
    time++;
    timeDisplay.innerText = time;
} // Update timer

userInput.addEventListener("input", () => {
    let quoteChars = document.querySelectorAll(".quote-chars");
    let userInputChars = userInput.value.split("");

    mistakes = 0;
    quoteChars.forEach((char, index) => {
        if (userInputChars[index] === char.innerText) {
            char.classList.add("correct");
            char.classList.remove("incorrect");
        } else if (userInputChars[index]) {
            char.classList.add("incorrect");
            char.classList.remove("correct");
            mistakes++;
        }
    }); // Check input accuracy for each character

    errorDisplay.innerText = mistakes;

    if (userInput.value === quote) {
        displayResult(); // Stop test when user finishes typing
    }
});

const displayResult = () => {
    clearInterval(timer); // Stop the timer when "Stop Test" is clicked
    document.querySelector(".result").style.display = "block"; // Show result
    document.getElementById("stop-test").style.display = "none"; // Hide stop button
    document.getElementById("start-test").style.display = "block"; // Show start button

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
        console.error("Error: testCountDisplay element not found!");
    } // Update/display count of completed tests
}; 

window.onload = () => {
    renderNewQuote();
    document.getElementById("stop-test").style.display = "none"; // Hide stop button initially
}; 

