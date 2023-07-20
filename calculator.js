class Calculator {
    constructor() {
        this.closeBrackets = 0; //counts no of bracket close needed
        this.period = true; //true symbolises user can add a period
        this.clear();
    }

    clear() {
        bigScreen.value = "";
        smallScreen.value = "";
        this.closeBrackets = 0;
        this.period = true;
    }

    appendNum(num) {
        if (num != '.') {
            if (this.exprSlice(-1) === ')') {num = '*' + num}
            this.updateScreen(bigScreen, num, 'append');
        }

        else {
            if (this.period) {
                this.updateScreen(bigScreen, num, 'append');
                this.period = false;
            }
        }
    }

    appendOp(op) {
        if (op != 'backspace') {
            this.period = true;
        }

        if (op === 'backspace') {
            if (this.exprSlice(-1) === '.') {
                this.period = true;
            }

            if (this.exprSlice(-1) === '(') {
                this.closeBrackets -= 1;
            }

            let x = bigScreen.value.length;
            this.updateScreen(bigScreen, this.exprSlice(0, x - 1));
        }

        else if (op === 'clear') {
            this.clear();
        }

        else if (op === 'equalto') {
            this.compute(bigScreen.value);
        }

        else if (['+', '-', '*', '/', '%', '^','(','','y'].includes(this.exprSlice(-1)) === false 
                 && 
                 ['+', '*', '/', '%', '^'].includes(op) === true) {
            this.updateScreen(bigScreen, op, 'append');
        }

        else if (op === ')' && this.closeBrackets > 0) {
            this.updateScreen(bigScreen, op, 'append');
            this.closeBrackets -= 1;
        }

        else if (op === '(') {
            if (/\d|\)/g.test(this.exprSlice(-1))) {
                this.updateScreen(bigScreen, '*'+ op, 'append')
            }
            else {
                this.updateScreen(bigScreen, op, 'append');
            }
            this.closeBrackets += 1;
        }

        else if (op === '-') { // op === '-'
            let x = bigScreen.value.length;
            if (this.exprSlice(-1) === '+') {
                this.updateScreen(bigScreen, this.exprSlice(0, x - 1) + '-');
            }
            else if (this.exprSlice(-1) === '-') {
                this.updateScreen(bigScreen, this.exprSlice(0, x - 1) + '+');
            }
            else {
                this.updateScreen(bigScreen, '-', 'append')
            }
        }
    }

    compute(str) {
        let answer;
        try {
            answer = eval(str.replace('^', '**'));
        }
        catch {
            answer = str
        }
        this.updateScreen(smallScreen, str);
        this.updateScreen(bigScreen, answer);
    }

    updateScreen(screenType, updation, type = '') {
        // screenType.value = updation;
        if (type === 'append' && screenType.value != 'Infinity') {
            screenType.value += updation; 
        }
        else {
            screenType.value = updation;
        }
    }

    autoScroll(){
        if (bigScreen.value.length >= 12) {
        bigScreen.scrollTo(20*bigScreen.value.length, 0);
        smallScreen.scrollTo(20*bigScreen.value.length, 0);
        }
    }

    exprSlice(x, y) {
        if (x === -1) {
            return bigScreen.value.slice(x)
        } else {
            return bigScreen.value.slice(x, y)
        }
    }
}

// screens
const bigScreen = document.querySelector(".big-screen");
const smallScreen = document.querySelector(".small-screen");

// number buttons (0 - 9, .)
const numButtons = document.querySelectorAll("[data-num]");

//operation buttons ((, ), *, ***, %, /, -, +, AC, C, equalto)
const opButtons = document.querySelectorAll("[data-op]");

// Calculator initialisation
const calculator = new Calculator();

// adding event-listeners to number buttons
numButtons.forEach((num) => {
    num.addEventListener('click', () => {
        calculator.appendNum(num.dataset.num);
        calculator.autoScroll();
    })
})

// adding event-listeners to operand buttons
opButtons.forEach((op) => {
    op.addEventListener('click', () => {
        calculator.appendOp(op.dataset.op);
        calculator.autoScroll();
    })
})


//Theme changer
const Theme = document.querySelector('.theme')
const Wrapper = document.querySelector('.wrapper')
const btn = document.querySelectorAll('button') 
Theme.addEventListener('click', () => {
    Wrapper.classList.toggle('dark-theme-wrapper');
    btn.forEach(button => {
        button.classList.toggle('dark-theme-num')
    });
    if (Wrapper.classList.contains("dark-theme-wrapper")) {
        Theme.src = "light-theme.png"
    }
    else {
        Theme.src = "dark-theme.png"
    }
})
