import { LightningElement, api, wire } from 'lwc';
import getRecordContext from '@salesforce/apex/PromptOpsService.getRecordContext';
import getPromptTemplatesMap from '@salesforce/apex/PromptTemplateService.getPromptTemplatesMap';
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

  promptTemplates = {};

  connectedCallback() {
    getPromptTemplatesMap()
      .then(result => {
        this.promptTemplates = result;
        if (this.contextMap && Object.keys(this.contextMap).length > 0) {
          this.generatePrompt();
        }
      })
      .catch(error => {
        console.error('Erro ao carregar templates:', error);
        this.promptText = 'Erro ao carregar os modelos de prompt.';
      });
  }

  @wire(getRecordContext, { recordId: '$recordId' })
  wiredContext({ error, data }) {
    if (data) {
      this.contextMap = data;
      if (this.promptTemplates && Object.keys(this.promptTemplates).length > 0) {
        this.generatePrompt();
      }
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
    const tipo = this.contextMap?.Tipo?.toLowerCase();
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
    this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
  }
}