import './button.css';
import React from 'react';

function Button({ value, onClick }) {

    function classNames() {
        if (value === '÷' || value === '×' || value === '−' || value === '+' || value === 'DEL' || value === '%') {
            return 'btn operator';
        }
        if (value === '=') {
            return 'btn equals';
        }
        if (value === 'C') {
            return 'btn clear';
        }
        return 'btn';
    }

    return (
        <button className={classNames()} onClick={onClick}>
            {value}
        </button>
    );
}

export default Button;