
const getDigitValue = (char: string): number => {
    const charCode = char.charCodeAt(0);
    if (charCode >= 48 && charCode <= 57) { // 0-9
        return charCode - 48;
    }
    if (charCode >= 65 && charCode <= 90) { // A-Z
        return charCode - 65 + 10;
    }
    throw new Error(`Invalid character: ${char}`);
};

const getCharFromValue = (value: number): string => {
    if (value >= 0 && value <= 9) {
        return String(value);
    }
    if (value >= 10 && value <= 35) {
        return String.fromCharCode(value - 10 + 65); // A-Z
    }
    throw new Error(`Invalid value for character conversion: ${value}`);
};

export const convertBase = (numberStr: string, fromBase: number, toBase: number, precision: number): string => {
    // LEVEL 1: Pre-processing & Validation
    if (typeof numberStr !== 'string' || numberStr.trim() === '') {
        return '';
    }

    if (fromBase < 2 || fromBase > 36 || toBase < 2 || toBase > 36) {
        throw new Error('Base must be between 2 and 36');
    }
    if (Math.floor(fromBase) !== fromBase || Math.floor(toBase) !== toBase) {
        throw new Error('Base must be an integer');
    }
    
    numberStr = numberStr.toUpperCase();
    const isNegative = numberStr.startsWith('-');
    const absNumberStr = isNegative ? numberStr.substring(1) : numberStr;

    if (absNumberStr === '.') {
        throw new Error('Invalid number: isolated decimal point');
    }

    if (absNumberStr.split('.').length > 2) {
        throw new Error('Invalid number: multiple decimal points');
    }

    const [integerPartStr, fractionalPartStr = ''] = absNumberStr.split('.');

    if (!integerPartStr && !fractionalPartStr) {
        return '';
    }
    
    for (const char of integerPartStr + fractionalPartStr) {
        if (getDigitValue(char) >= fromBase) {
            throw new Error(`Invalid digit '${char}' for base ${fromBase}`);
        }
    }
    
    if (/^0+$/.test(absNumberStr.replace('.', ''))) {
        return '0';
    }


    // LEVEL 2 & 3: Conversion to Decimal
    // Integer part
    let decimalInteger = 0n;
    if (integerPartStr) {
        for (const digit of integerPartStr) {
            decimalInteger = decimalInteger * BigInt(fromBase) + BigInt(getDigitValue(digit));
        }
    }
    
    // Fractional part
    let decimalFraction = 0.0;
    if (fractionalPartStr) {
        for (let i = 0; i < fractionalPartStr.length; i++) {
            decimalFraction += getDigitValue(fractionalPartStr[i]) / Math.pow(fromBase, i + 1);
        }
    }

    // Convert Decimal to Target Base
    // Integer part
    let targetIntegerStr = '';
    if (decimalInteger === 0n) {
        targetIntegerStr = '0';
    } else {
        let tempInt = decimalInteger;
        while (tempInt > 0n) {
            const remainder = tempInt % BigInt(toBase);
            targetIntegerStr = getCharFromValue(Number(remainder)) + targetIntegerStr;
            tempInt /= BigInt(toBase);
        }
    }

    // Fractional part
    let targetFractionalStr = '';
    if (decimalFraction > 0 && precision > 0) {
        let tempFrac = decimalFraction;
        for (let i = 0; i < precision; i++) {
            tempFrac *= toBase;
            const digit = Math.floor(tempFrac);
            targetFractionalStr += getCharFromValue(digit);
            tempFrac -= digit;
            if (tempFrac < Number.EPSILON) break; // Stop if remainder is negligible
        }
    }
    
    // LEVEL 4: Post-processing & Optimization
    const sign = isNegative ? '-' : '';
    let finalResult = sign + (targetIntegerStr || '0');
    if (targetFractionalStr) {
        finalResult += '.' + targetFractionalStr;
    }

    return finalResult;
};