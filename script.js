let numbers = [];
let solutions = [];

function generateNumbers() {
    do {
        numbers = Array.from({ length: 4 }, () => Math.floor(Math.random() * 99) + 1);
    } while (!findSolutions());

    document.getElementById('numbers').innerText = `ตัวเลข: ${numbers.join(', ')}`;
    document.getElementById('resultText').value = ''; // Clear previous results
}

function checkSolution() {
    const userInput = document.getElementById('userInput').value;
    const resultText = document.getElementById('resultText');
    resultText.value = '';

    try {
        const userResult = eval(userInput);

        if (Math.abs(userResult - 240) < 1e-6 && validateExpression(userInput)) {
            resultText.value = 'ถูกต้อง! คำตอบคือ 240.';
        } else {
            resultText.value = 'ผิดพลาด. คำตอบไม่ใช่ 240.';
        }
    } catch (e) {
        resultText.value = `ข้อผิดพลาด: ${e.message}`;
    }
}

function validateExpression(expression) {
    const expressionNumbers = expression.match(/\d+/g).map(Number);
    const originalNumbers = [...numbers];

    return expressionNumbers.length === 4 && 
           expressionNumbers.every(num => originalNumbers.includes(num));
}

function findSolutions() {
    const ops = ['+', '-', '*', '/'];
    solutions = [];
    
    function evaluateExpression(expression) {
        try {
            return Math.abs(eval(expression) - 240) < 1e-6;
        } catch {
            return false;
        }
    }

    const permutations = permute(numbers);

    for (const nums of permutations) {
        for (const opsComb of cartesianProduct(ops, ops, ops)) {
            const expressions = [
                `((${nums[0]} ${opsComb[0]} ${nums[1]}) ${opsComb[1]} ${nums[2]}) ${opsComb[2]} ${nums[3]}`,
                `(${nums[0]} ${opsComb[0]} (${nums[1]} ${opsComb[1]} ${nums[2]})) ${opsComb[2]} ${nums[3]}`,
                `${nums[0]} ${opsComb[0]} ((${nums[1]} ${opsComb[1]} ${nums[2]}) ${opsComb[2]} ${nums[3]})`,
                `${nums[0]} ${opsComb[0]} (${nums[1]} ${opsComb[1]} (${nums[2]} ${opsComb[2]} ${nums[3]}))`
            ];

            for (const expression of expressions) {
                if (evaluateExpression(expression)) {
                    solutions.push(expression);
                }
            }
        }
    }

    return solutions.length > 0;
}

function showSolutions() {
    const resultText = document.getElementById('resultText');
    resultText.value = '';

    if (solutions.length > 0) {
        resultText.value = 'คำตอบที่พบ:\n' + solutions.map((sol, idx) => `คำตอบ ${idx + 1}: ${sol}`).join('\n');
    } else {
        resultText.value = 'ไม่พบคำตอบ.';
    }
}

// Utility functions
function permute(arr) {
    if (arr.length <= 1) return [arr];
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        const rest = permute(arr.slice(0, i).concat(arr.slice(i + 1)));
        rest.forEach(subPerm => result.push([arr[i], ...subPerm]));
    }
    return result;
}

function cartesianProduct(...arrays) {
    return arrays.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));
}
