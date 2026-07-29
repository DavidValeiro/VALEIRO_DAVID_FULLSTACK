import './calculator.css'
import Button from '../button/button'
import { useState } from 'react'
import { evaluate } from 'mathjs'

function Calculator() {
    const [displayValue, setDisplayValue] = useState('0');

        function handleClick(value) {
            let buttonValue = value.target.innerText;
            console.log('Button clicked:', buttonValue);
            let numberArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            let operatorMap = {
                '÷': '/',
                '×': '*',
                '−': '-',
                '+': '+',
                '%': '%'
            };

            if (buttonValue === 'C') {
                setDisplayValue('0');
                return;
            }

            if (buttonValue === 'DEL') {
                setDisplayValue((prev) => {
                    if (prev === '0') return '0';
                    return prev.slice(0, -1) || '0';
                });
                return;
            }

            if (buttonValue === '='){
                let operation = displayValue;
                try {
                    let result = evaluate(operation);
                    setDisplayValue(result.toString());
                    console.log('Result:', result);
                }
                catch (error) {
                    setDisplayValue('Error');
                }
            }

            if (numberArray.includes(buttonValue)) {
                setDisplayValue((prev) => (prev === '0' ? buttonValue : prev + buttonValue));
                return;
            }

            if (buttonValue === '.') {
                setDisplayValue((prev) => {
                    let parts = prev.split(/[-+*/%]/);
                    let currentPart = parts[parts.length - 1];
                    if (currentPart.includes('.')) return prev;
                    return prev + '.';
                });
                return;
            }

            if (operatorMap[buttonValue]) {
                setDisplayValue((prev) => {
                    let lastChar = prev[prev.length - 1];
                    if (['/', '*', '-', '+', '%'].includes(lastChar)) {
                        return prev.slice(0, -1) + operatorMap[buttonValue];
                    }
                    return prev + operatorMap[buttonValue];
                });
            }
        }

        
return (
<div className="calculator">
    <div className="display">
    <input type="text"  value={displayValue} readOnly />
    </div>
    <div className="buttons">
    <div className="row">
        <Button value="C" onClick={handleClick} />
        <Button value="DEL" onClick={handleClick} />
        <Button value="%" onClick={handleClick} />
        <Button value="÷" onClick={handleClick} />
    </div>
    <div className="row">
        <Button value="7" onClick={handleClick} />
        <Button value="8" onClick={handleClick} />
        <Button value="9" onClick={handleClick} />
        <Button value="×" onClick={handleClick} />
    </div>
    <div className="row">
        <Button value="4" onClick={handleClick} />
        <Button value="5" onClick={handleClick} />
        <Button value="6" onClick={handleClick} />
        <Button value="−" onClick={handleClick} />
    </div>
    <div className="row">
        <Button value="1" onClick={handleClick} />
        <Button value="2" onClick={handleClick} />
        <Button value="3" onClick={handleClick} />
        <Button value="+" onClick={handleClick} />
    </div>
    <div className="row">
        <Button value="0" onClick={handleClick} />
        <Button value="." onClick={handleClick} />
        <Button value="=" onClick={handleClick} />
    </div>
    </div>
</div>
)
}

export default Calculator