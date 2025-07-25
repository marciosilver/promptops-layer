public with sharing class PromptTemplateService {
    @AuraEnabled(cacheable=true)
    public static Map<String, Map<String, String>> getPromptTemplatesMap() {
        Map<String, Map<String, String>> templateMap = new Map<String, Map<String, String>>();

        for (Prompt_Config__mdt config : [
            SELECT Object_Type__c, Prompt_Type__c, Prompt_Text__c, Is_Active__c
            FROM Prompt_Config__mdt
            WHERE Is_Active__c = true
        ]) {
            String obj = config.Object_Type__c?.toLowerCase();
            String tipo = config.Prompt_Type__c?.toLowerCase();

            if (!templateMap.containsKey(obj)) {
                templateMap.put(obj, new Map<String, String>());
            }

            templateMap.get(obj).put(tipo, config.Prompt_Text__c);
        }

        return templateMap;
    }
}