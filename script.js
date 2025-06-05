const buttons = document.querySelectorAll("button");
const resultDisplay = document.getElementById("result");
let expression = "";

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.id;
    if (!isNaN(value) || value === ".") {
      expression += value;
      updateDisplay(expression);
    } else {
      handleOperator(value);
    }
  });
});

function updateDisplay(value) {
  resultDisplay.value = value;
}

function handleOperator(opr) {
  switch (opr) {
    case "AC":
      expression = "";
      updateDisplay("0");
      break;
    case "backspace":
      expression = expression.slice(0, -1);
      updateDisplay(expression || "0");
      break;
    case "pos-neg":
      toggleSign();
      break;
    case "=":
      try {
        const safeExpression = expression
          .replace(/×/g, "*")
          .replace(/÷/g, "/")
          .replace(/−/g, "-")
          .replace(/%/g, "/100");
        const tokens = tokenize(safeExpression);
        const rpn = toRPN(tokens);
        const result = evaluateRPN(rpn);
        expression = String(result);
        updateDisplay(expression);
      } catch (e) {
        updateDisplay("Error");
        expression = "";
      }
      break;
    case "+":
    case "-":
    case "*":
    case "/":
    case "%":
      expression += opr;
      updateDisplay(expression);
      break;
  }
}

function toggleSign() {
  const match = expression.match(/(-?\d+\.?\d*)$/);
  if (match) {
    const number = match[0];
    const toggled = number.startsWith("-") ? number.slice(1) : "-" + number;
    expression = expression.slice(0, -number.length) + toggled;
    updateDisplay(expression);
  }
}

updateDisplay("0");

function tokenize(expr) {
  return expr.match(/(\d+\.?\d*|\.\d+|[+\-*/()%])/g);
}

function toRPN(tokens) {
  const output = [];
  const operators = [];
  const precedence = { "+": 1, "-": 1, "*": 2, "/": 2, "%": 2 };
  const isLeftAssoc = { "+": true, "-": true, "*": true, "/": true, "%": true };

  tokens.forEach(token => {
    if (!isNaN(token)) {
      output.push(token);
    } else if ("+-*/%".includes(token)) {
      while (
        operators.length &&
        "+-*/%".includes(operators[operators.length - 1]) &&
        (
          (isLeftAssoc[token] && precedence[token] <= precedence[operators[operators.length - 1]]) ||
          (!isLeftAssoc[token] && precedence[token] < precedence[operators[operators.length - 1]])
        )
      ) {
        output.push(operators.pop());
      }
      operators.push(token);
    } else if (token === "(") {
      operators.push(token);
    } else if (token === ")") {
      while (operators.length && operators[operators.length - 1] !== "(") {
        output.push(operators.pop());
      }
      operators.pop();
    }
  });

  while (operators.length) {
    output.push(operators.pop());
  }

  return output;
}

function evaluateRPN(rpn) {
  const stack = [];
  rpn.forEach(token => {
    if (!isNaN(token)) {
      stack.push(parseFloat(token));
    } else {
      const b = stack.pop();
      const a = stack.pop();
      switch (token) {
        case "+": stack.push(a + b); break;
        case "-": stack.push(a - b); break;
        case "*": stack.push(a * b); break;
        case "/": stack.push(a / b); break;
        case "%": stack.push(a % b); break;
      }
    }
  });
  return stack[0];
}

