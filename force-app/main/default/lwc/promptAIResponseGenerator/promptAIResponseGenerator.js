import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import gerarRespostaIA from '@salesforce/apex/PromptAIService.gerarRespostaIA';
import testarConexaoOpenAI from '@salesforce/apex/PromptAIService.testarConexaoOpenAI';

export default class PromptAIResponseGenerator extends LightningElement {
    @track promptTexto = '';
    @track estiloResposta = 'Empático'; // Valor padrão
    @track respostaIA = '';
    @track carregando = false;
    @track mensagemErro = '';

    // Opções de estilo
    get estiloOptions() {
        return [
            { label: 'Empático', value: 'Empático' },
            { label: 'Profissional', value: 'Profissional' },
            { label: 'Técnico', value: 'Técnico' },
            { label: 'Criativo', value: 'Criativo' }
        ];
    }

    // Handlers
    handleEstiloChange(event) {
        this.estiloResposta = event.detail.value;
        console.log('Estilo selecionado:', this.estiloResposta);
    }

    handlePromptChange(event) {
        this.promptTexto = event.detail.value;
        this.mensagemErro = ''; // Limpa erro ao digitar
    }

    // Copiar exemplo de prompt
    copiarPromptExemplo() {
        const exemplos = {
            'Empático': 'Por favor, escreva uma mensagem empática sobre a oportunidade Burlington Textiles Weaving Plant Generator, destacando como entendemos suas necessidades e estamos comprometidos em ajudar.',
            'Profissional': 'Elabore uma comunicação profissional sobre a oportunidade Burlington Textiles Weaving Plant Generator, fase Needs Analysis, valor R$ 235.000,00.',
            'Técnico': 'Descreva tecnicamente a solução proposta para Burlington Textiles Weaving Plant Generator, incluindo especificações e benefícios técnicos.',
            'Criativo': 'Crie uma abordagem inovadora e criativa para apresentar a oportunidade Burlington Textiles Weaving Plant Generator.'
        };

        this.promptTexto = exemplos[this.estiloResposta] || exemplos['Empático'];
        
        this.showToast('Sucesso', 'Exemplo de prompt copiado!', 'success');
    }

    // Gerar resposta com IA
    async gerarRespostaIA() {
        // Validações
        if (!this.promptTexto || this.promptTexto.trim() === '') {
            this.mensagemErro = 'Por favor, digite um prompt antes de gerar a resposta.';
            this.showToast('Aviso', 'Campo de prompt está vazio', 'warning');
            return;
        }

        if (!this.estiloResposta) {
            this.mensagemErro = 'Por favor, selecione um estilo de resposta.';
            return;
        }

        // Limpa estados anteriores
        this.carregando = true;
        this.respostaIA = '';
        this.mensagemErro = '';

        try {
            console.log('Chamando API com:', {
                promptTexto: this.promptTexto,
                estiloTexto: this.estiloResposta
            });

            // Chama o método Apex
            const resposta = await gerarRespostaIA({
                promptTexto: this.promptTexto.trim(),
                estiloTexto: this.estiloResposta
            });

            this.respostaIA = resposta;
            this.showToast('Sucesso', 'Resposta gerada com sucesso!', 'success');

        } catch (error) {
            console.error('Erro completo:', error);
            
            let mensagemErro = 'Erro ao gerar resposta.';
            
            if (error.body && error.body.message) {
                mensagemErro = error.body.message;
            } else if (error.message) {
                mensagemErro = error.message;
            }

            this.mensagemErro = mensagemErro;
            this.showToast('Erro', mensagemErro, 'error');
        } finally {
            this.carregando = false;
        }
    }

    // Testar conexão (método opcional para debug)
    async testarConexao() {
        try {
            const resultado = await testarConexaoOpenAI();
            console.log('Teste de conexão:', resultado);
            this.showToast('Teste', resultado, 'info');
        } catch (error) {
            console.error('Erro no teste:', error);
            this.showToast('Erro', 'Falha no teste de conexão', 'error');
        }
    }

    // Utility: mostrar toast
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(event);
    }

    // Getters para controle de estado
    get botaoDesabilitado() {
        return this.carregando || !this.promptTexto || this.promptTexto.trim() === '';
    }

    get temResposta() {
        return this.respostaIA && this.respostaIA.length > 0;
    }

    // Lifecycle hook
    connectedCallback() {
        console.log('Componente carregado. Estilo padrão:', this.estiloResposta);
        // Opcional: testar conexão ao carregar
        // this.testarConexao();
    }
}