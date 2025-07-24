import { LightningElement, api, wire } from 'lwc';
import getRecordContext from '@salesforce/apex/PromptOpsService.getRecordContext';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import savePromptLog from '@salesforce/apex/PromptLogService.savePromptLog';
export default class PromptOpsLayer extends LightningElement {

  @api recordId;
  @api objectApiName;

  isVisible = false;
  promptText = 'Carregando sugestão de prompt...';
  contextMap = {};
  selectedPromptType = 'resposta';
  promptTypeOptions = [
  { label: 'Resposta empática', value: 'resposta' },
  { label: 'E-mail de follow-up', value: 'email' },
  { label: 'Resumo técnico', value: 'resumo' },
  { label: 'Instrução interna', value: 'instrucao' }
  ];

  promptTemplates = {

    case: {
      resposta: 'Responda ao cliente com cordialidade. Assunto: "{Assunto}", Status: {Status}, Prioridade: {Prioridade}.',
      email: 'Escreva um e-mail sobre o chamado "{Assunto}" com status {Status} e origem {Origem}.', 
      resumo: 'Resumo técnico do chamado: "{Assunto}", prioridade: {Prioridade}, status: {Status}.', 
      instrucao: 'Instrução interna sobre o caso "{Assunto}", ações pendentes conforme status {Status}.' 
    },

    lead: { 
      resposta: 'Responda ao lead {Nome}, da empresa {Empresa}, com status atual "{Status}".', 
      email: 'Escreva um e-mail de follow-up para {Nome}, da empresa {Empresa}, com base no status "{Status}".', 
      resumo: 'Resumo do lead {Nome} ({Empresa}), status atual: {Status}.', 
      instrucao: 'Instruções para abordagem do lead {Nome}, empresa {Empresa}, status {Status}.' 
    }, 

    opportunity: { 
      resposta: 'Comunique-se sobre a oportunidade "{Nome}", fase: {Fase}, valor: R$ {Valor}.', 
      email: 'Crie um e-mail sobre a oportunidade "{Nome}", prevista para fechar em {DataFechamento}.', 
      resumo: 'Resumo da oportunidade: {Nome}, valor: R$ {Valor}, fase: {Fase}, data: {DataFechamento}.',
      instrucao: 'Oriente o time sobre como avançar com a oportunidade "{Nome}", que está na fase {Fase}.'
    }, 

  account: { 
    resposta: 'Mensagem institucional para a conta "{Nome}", setor: {Indústria}, tipo: {TipoConta}.',
    email: 'Escreva um e-mail de relacionamento para a conta "{Nome}", rating: {Rating}.', 
    resumo: 'Resumo da conta: "{Nome}", setor: {Indústria}, tipo: {TipoConta}, rating: {Rating}.',
    instrucao: 'Instrução interna sobre o atendimento à conta "{Nome}", com foco no setor {Indústria}.' 
    }, 

  contact: { 
      resposta: 'Mensagem de saudações para o contato "{Nome}", cargo: {Cargo}.', 
      email: 'Crie um e-mail introdutório para "{Nome}", mencionando seu cargo "{Cargo}".', 
      resumo: 'Resumo do contato: "{Nome}", cargo: {Cargo}, telefone: {Telefone}.', 
      instrucao: 'Instrução interna sobre abordagem ao contato "{Nome}", com base no cargo {Cargo}.' 
    },
  };

  @wire(getRecordContext, { recordId: '$recordId' })
  wiredContext({ error, data }) {
    if (data) { 
    this.contextMap = data; 
    this.generatePrompt(); 
    } else if (error) { 
      console.error('Erro ao buscar contexto:', error);
    }
  }

  handleToggle() {
    this.isVisible = !this.isVisible;
    if (this.isVisible && Object.keys(this.contextMap).length > 0) {
      this.generatePrompt(); 
    }
  }

  handlePromptTypeChange(event) {
  this.selectedPromptType = event.detail.value; 
  this.generatePrompt(); 
  }

  handlePromptEdit(event) {
  this.promptText = event.detail.value;
  }

  generatePrompt() {
  const tipo = this.contextMap.Tipo?.toLowerCase();
  const estilo = this.selectedPromptType;

  const template = this.promptTemplates?.[tipo]?.[estilo];
    if (template) {
      this.promptText = this.replacePlaceholders(template, this.contextMap);
    } else {
      this.promptText = 'Modelo de prompt não disponível para este tipo de registro.';
    }
  }


  replacePlaceholders(template, contextMap) {
    return template.replace(/{(.*?)}/g, (match, key) => {
    return contextMap[key] || `[${key}]`;
    });
  }

  handleCopy() {
    const textToCopy = this.promptText;
    const textarea = document.createElement('textarea');
    textarea.value = textToCopy;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';

    document.body.appendChild(textarea);
    textarea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        this.showToast('Copiado', 'Prompt copiado com sucesso!', 'success');
      } else {
        this.showToast('Falha', 'Não foi possível copiar o prompt.', 'error');
      }
    } catch (err) {
      console.error('Erro ao copiar o texto:', err);
      this.showToast('Erro', 'Erro inesperado ao copiar.', 'error');
    }
    document.body.removeChild(textarea);
  }

    salvarPromptLogEntry() {
        savePromptLog({
            prompt: this.promptText,
            recordId: this.recordId,
            objectName: this.objectApiName,
            promptType: this.selectedPromptType
        })
        .then(() => {
            this.showToast('Sucesso', 'Prompt salvo com sucesso!', 'success');
        })
        .catch(error => {
            console.error('Erro ao salvar prompt:', error);
            this.showToast('Erro', 'Não foi possível salvar o prompt.', 'error');
        });
    }

  showToast(title, message, variant) {
    this.dispatchEvent(new ShowToastEvent({
    title, message, variant
    }
    ));
  }
}