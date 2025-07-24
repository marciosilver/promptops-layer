import { LightningElement, api } from 'lwc';

export default class Numerator extends LightningElement {
    // Propriedades privadas
    _currentCount = 0;
    priorCount = 0;

    // Getter e setter para counter
    @api
    get counter() {
        return this._currentCount;
    }
    
    set counter(value) {
        this.priorCount = this._currentCount;
        this._currentCount = value;
    }

    // Função pública que o pai pode chamar
    @api
    maximizeCounter() {
        this.counter += 1000000;
    }

    handleStartChange(event) {
        this.counter = parseInt(event.target.value) || 0;
    }

    handleIncrement() {
        this.counter++;
        this.dispatchEvent(new CustomEvent('counterchange', {
            detail: { value: this.counter }
        }));
    }

    handleDecrement() {
        this.counter--;
        this.dispatchEvent(new CustomEvent('counterchange', {
            detail: { value: this.counter }
        }));
    }

    handleMultiply() {
        this.counter *= 2;
        this.dispatchEvent(new CustomEvent('counterchange', {
            detail: { value: this.counter }
        }));
    }
}