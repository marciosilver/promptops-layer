import { LightningElement } from 'lwc';

export default class Augmentor extends LightningElement {
    startCounter = 0;

    handleStartChange(event) {
        this.startCounter = parseInt(event.target.value);
        const numeratorComponent = this.template.querySelector('c-numerator');
        if (numeratorComponent) {
            numeratorComponent.counter = this.startCounter;
        }
    }

    handleCounterChange(event) {
        console.log('Contador atualizado para:', event.detail.value);
    }

    // Função que chama o método público do componente filho
    handleMaximizeCounter() {
        this.template.querySelector('c-numerator').maximizeCounter();
    }
}