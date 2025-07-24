public with sharing class PromptLogService {
    
    /**
     * Cria um novo registro do Prompt_Log__c com os dados fornecidos.
     *
     * @param recordId         ID do registro relacionado (ex: caseId, contactId, etc.)
     * @param objectApiName    Nome do objeto relacionado (ex: 'Case', 'Contact')
     * @param prompt           Texto do prompt gerado
     * @param promptType       Tipo do prompt (ex: 'resposta', 'email', etc.)
     */
    @AuraEnabled
    public static void savePromptLog(String recordId, String objectApiName, String prompt, String promptType) {
        try {
            Prompt_Log__c log = new Prompt_Log__c();
            log.RecordId__c = recordId;
            log.ObjectApiName__c = objectApiName;
            log.Prompt__c = prompt;
            log.PromptType__c = promptType;
            log.UsedOn__c = System.now();

            insert log;
        } catch (Exception e) {
            throw new AuraHandledException('Erro ao salvar prompt: ' + e.getMessage());
        }
    }
}
