public with sharing class PromptOpsService {

    @AuraEnabled(cacheable=true)
    public static Map<String, String> getRecordContext(Id recordId) {
        Map<String, String> contextMap = new Map<String, String>();
        if (recordId == null) return contextMap;

        String sObjectType = recordId.getSObjectType().getDescribe().getName();

        try {
            switch on sObjectType {
                when 'Case' {
                    Case c = [SELECT Subject, Status, Priority, Origin, Description FROM Case WHERE Id = :recordId LIMIT 1];
                    contextMap.put('Tipo', 'case');
                    contextMap.put('Assunto', String.valueOf(c.Subject));
                    contextMap.put('Status', String.valueOf(c.Status));
                    contextMap.put('Prioridade', String.valueOf(c.Priority));
                    contextMap.put('Origem', String.valueOf(c.Origin));
                    contextMap.put('Descrição', String.valueOf(c.Description));
                }
                when 'Lead' {
                    Lead l = [SELECT Name, Company, Status, Email FROM Lead WHERE Id = :recordId LIMIT 1];
                    contextMap.put('Tipo', 'lead');
                    contextMap.put('Nome', String.valueOf(l.Name));
                    contextMap.put('Empresa', String.valueOf(l.Company));
                    contextMap.put('Status', String.valueOf(l.Status));
                    contextMap.put('Email', String.valueOf(l.Email));
                }
                when 'Opportunity' {
                    Opportunity o = [SELECT Name, StageName, CloseDate, Amount FROM Opportunity WHERE Id = :recordId LIMIT 1];
                    contextMap.put('Tipo', 'opportunity');
                    contextMap.put('Nome', String.valueOf(o.Name));
                    contextMap.put('Fase', String.valueOf(o.StageName));
                    contextMap.put('DataFechamento', String.valueOf(o.CloseDate));
                    contextMap.put('Valor', String.valueOf(o.Amount));
                }
                when 'Account' {
                    Account a = [SELECT Name, Industry, Type, Rating FROM Account WHERE Id = :recordId LIMIT 1];
                    contextMap.put('Tipo', 'account');
                    contextMap.put('Nome', String.valueOf(a.Name));
                    contextMap.put('Industria', String.valueOf(a.Industry));
                    contextMap.put('TipoConta', String.valueOf(a.Type));
                    contextMap.put('Rating', String.valueOf(a.Rating));
                }
                when 'Contact' {
                    Contact c = [SELECT Name, Title, Phone, Email FROM Contact WHERE Id = :recordId LIMIT 1];
                    contextMap.put('Tipo', 'contact');
                    contextMap.put('Nome', String.valueOf(c.Name));
                    contextMap.put('Cargo', String.valueOf(c.Title));
                    contextMap.put('Telefone', String.valueOf(c.Phone));
                    contextMap.put('Email', String.valueOf(c.Email));
                }
                when else {
                    contextMap.put('Tipo', 'desconhecido');
                    contextMap.put('Mensagem', 'Tipo de registro ainda não suportado pela PromptOps.');
                }
            }
        } catch (Exception e) {
            System.debug('Erro ao gerar contexto para PromptOps: ' + e.getMessage());
            contextMap.put('Tipo', 'erro');
            contextMap.put('Mensagem', 'Erro ao recuperar dados do registro.');
        }

        return contextMap;
    }
}
