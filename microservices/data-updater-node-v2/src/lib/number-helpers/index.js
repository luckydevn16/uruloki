"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.percentChange = exports.handleNumberFormat = void 0;
const handleNumberFormat = (num) => {
    let value = num.toString();
    const pattern = /^\d*\.?\d*$/;
    if (!pattern.test(value))
        return "";
    let newValue = "";
    if (value.search("\\.") !== -1) {
        let [integerPart, decimalPart] = value.split(".");
        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        newValue = `${integerPart}.${decimalPart ? decimalPart : ""}`;
    }
    else {
        newValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return newValue;
};
exports.handleNumberFormat = handleNumberFormat;
function percentChange(initial, final) {
    return 100 * ((final - initial) / initial);
}
exports.percentChange = percentChange;
