let sum = 0;
let lastCalledAction = null;
const resultText = document.querySelector(".result-header");

const numButtons = document.querySelector(".num-buttons");
numButtons.addEventListener("click", function(event) {
    if (event.target.innerHTML.length > 1) {
        return;
    }
    if (resultText.innerHTML === "0") {
        resultText.innerHTML = "";
    }
    resultText.innerHTML += event.target.innerHTML;
});

const clearButton = document.querySelector(".clear-button");
clearButton.addEventListener("click", function() {
    sum = 0;
    lastCalledAction = null;
    resultText.innerHTML = '0';
});

const backspaceButton = document.querySelector(".backspace-button");
backspaceButton.addEventListener("click", function() {
    resultText.innerHTML = resultText.innerHTML.substring(0, resultText.innerHTML.length - 1);
});

const actionButtons = document.querySelector(".action-buttons");
actionButtons.addEventListener("click", function(event) {
    switch (event.target.innerHTML) {
        case "÷": {
            handleDivide();
            resultText.innerHTML = "0";
            lastCalledAction = handleDivide;
            break;
        }
        case "×": {
            handleMult();
            resultText.innerHTML = "0";
            lastCalledAction = handleMult;
            break;
        }
        case "-": {
            handleMinus();
            resultText.innerHTML = "0";
            lastCalledAction = handleMinus;
            break;
        }
        case "+": {
            handlePlus();
            resultText.innerHTML = "0";
            lastCalledAction = handlePlus;
            break;
        }
        case "=": {
            handleEquals();
            break;
        }
    }
});

function handlePlus() {
    if (lastCalledAction === handleEquals) {
        return;
    } 
    sum += +resultText.innerHTML;
}

function handleDivide() {
    if (lastCalledAction === handleEquals) {
        return;
    } 
    sum /= +resultText.innerHTML;
}

function handleMult() {
    if (lastCalledAction === handleEquals) {
        return;
    } 
    sum *= + resultText.innerHTML;
}

function handleMinus() {
    if (lastCalledAction === handleEquals) {
        return;
    } 
    sum -= +resultText.innerHTML;
}

function handleEquals() {
    if (lastCalledAction != null) {
        lastCalledAction();
    }
    resultText.innerHTML = sum.toString();
    lastCalledAction = handleEquals;
}