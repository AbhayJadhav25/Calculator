const buttons = document.querySelectorAll(".button");
const resultDisplay = document.getElementById("result");

let currentInput = "";
let operator = "";
let firstOperand = null;

buttons.forEach(button => {
  button.addEventListener("click", function () {
    const value = button.id;

    if (!isNaN(value) || value === ".") {
      currentInput += value;
      updateDisplay(getDisplayText());
    } else {
      handleOperator(value);
    }
  });
});

function updateDisplay(value) {
  resultDisplay.value = value;
}

function getOperatorSymbol(op) {
  switch (op) {
    case "plus": return "+";
    case "minus": return "-";
    case "multiply": return "×";
    case "divide": return "÷";
    case "percentage": return "%";
    default: return "";
  }
}

function getDisplayText() {
  if (firstOperand !== null && operator !== "") {
    return firstOperand + " " + getOperatorSymbol(operator) + " " + currentInput;
  }
  return currentInput || "0";
}

function handleOperator(opr) {
  switch (opr) {
    case "AC":
      currentInput = "";
      firstOperand = null;
      operator = "";
      updateDisplay("0");
      break;
    case "backspace":
      currentInput = currentInput.slice(0, -1);
      updateDisplay(getDisplayText());
      break;
    case "pos-neg":
      if (currentInput) {
        currentInput = String(parseFloat(currentInput) * -1);
        updateDisplay(getDisplayText());
      }
      break;
    case "plus":
    case "minus":
    case "multiply":
    case "divide":
    case "percentage":
      if (currentInput === "") return;
      firstOperand = parseFloat(currentInput);
      operator = opr;
      currentInput = "";
      updateDisplay(getDisplayText());
      break;
    case "equal-to":
      if (firstOperand === null || currentInput === "") return;
      let secondOperand = parseFloat(currentInput);
      let result = calculate(firstOperand, secondOperand, operator);
      updateDisplay(result);
      currentInput = String(result);
      firstOperand = null;
      operator = "";
      break;
  }
}

function calculate(a, b, op) {
  switch (op) {
    case "plus": return a + b;
    case "minus": return a - b;
    case "multiply": return a * b;
    case "divide": return b !== 0 ? a / b : "Error";
    case "percentage": return (a * b) / 100;
    default: return b;
  }
}

updateDisplay("0")
