public with sharing class PromptAIService {
    // Classe desativada em 24/07/2025 após remoção da camada de IA do PromptOps
    /*
    private static final String NAMED_CREDENTIAL = 'OpenAI_API';
    private static final String ENDPOINT = '/v1/chat/completions';

    @AuraEnabled(cacheable=false)
    public static String gerarRespostaIA(String promptTexto, String estiloTexto) {
        try {
            if (String.isBlank(promptTexto)) {
                throw new AuraHandledException('Prompt não pode estar vazio.');
            }

            Map<String, Object> body = new Map<String, Object>{
                'model' => 'gpt-4-0613',
                'messages' => new List<Object>{
                    new Map<String, String>{
                        'role' => 'system',
                        'content' => 'Responda no estilo: ' + estiloTexto
                    },
                    new Map<String, String>{
                        'role' => 'user',
                        'content' => promptTexto
                    }
                },
                'temperature' => 0.7,
                'max_tokens' => 500
            };

            HttpRequest req = new HttpRequest();
            req.setEndpoint('callout:' + NAMED_CREDENTIAL + ENDPOINT);
            req.setMethod('POST');
            req.setHeader('Content-Type', 'application/json');
            req.setBody(JSON.serialize(body));
            req.setTimeout(120000); // 2 minutos

            Http http = new Http();
            HttpResponse res = http.send(req);

            System.debug('Response Status: ' + res.getStatusCode());
            System.debug('Response Body: ' + res.getBody());

            if (res.getStatusCode() == 200) {
                Map<String, Object> resposta = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
                List<Object> choices = (List<Object>) resposta.get('choices');
                if (choices != null && !choices.isEmpty()) {
                    Map<String, Object> choice = (Map<String, Object>) choices[0];
                    Map<String, Object> message = (Map<String, Object>) choice.get('message');
                    return (String) message.get('content');
                }
                return 'Resposta vazia da IA';
            } else if (res.getStatusCode() == 401) {
                throw new AuraHandledException('Erro de autenticação. Verifique a chave da API.');
            } else if (res.getStatusCode() == 429) {
                throw new AuraHandledException('Limite de requisições excedido. Tente novamente mais tarde.');
            } else {
                // Log detalhado do erro
                System.debug('Error Response Body: ' + res.getBody());
                throw new AuraHandledException('Erro ao obter resposta: ' + res.getStatus() + ' - ' + res.getBody());
            }
        } catch (AuraHandledException e) {
            // Re-throw AuraHandledException as is
            throw e;
        } catch (Exception e) {
            System.debug('Exception Type: ' + e.getTypeName());
            System.debug('Exception Message: ' + e.getMessage());
            System.debug('Stack Trace: ' + e.getStackTraceString());
            
            // Se for erro de Named Credential, dar uma mensagem mais clara
            if (e.getMessage().contains('credential')) {
                throw new AuraHandledException('Erro de configuração: Verifique se o Named Credential "' + NAMED_CREDENTIAL + '" está configurado corretamente e você tem as permissões necessárias.');
            }
            
            throw new AuraHandledException('Erro inesperado: ' + e.getMessage());
        }
    }

    // Método de teste para verificar autenticação
    @AuraEnabled(cacheable=false)
    public static String testarConexaoOpenAI() {
        try {
            HttpRequest req = new HttpRequest();
            req.setEndpoint('callout:' + NAMED_CREDENTIAL + '/v1/models');
            req.setMethod('GET');
            req.setHeader('Content-Type', 'application/json');
            req.setTimeout(30000);

            System.debug('Testing endpoint: ' + req.getEndpoint());

            Http http = new Http();
            HttpResponse res = http.send(req);

            System.debug('Test Response Status: ' + res.getStatusCode());
            System.debug('Test Response Headers: ' + res.getHeaderKeys());

            if (res.getStatusCode() == 200) {
                // Parse response to show available models
                Map<String, Object> modelsResponse = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
                List<Object> models = (List<Object>) modelsResponse.get('data');
                
                String modelsList = 'Modelos disponíveis: ';
                Integer count = 0;
                for (Object model : models) {
                    Map<String, Object> modelMap = (Map<String, Object>) model;
                    if (count < 5) { // Show only first 5 models
                        modelsList += (String) modelMap.get('id') + ', ';
                        count++;
                    }
                }
                
                return 'Conexão bem-sucedida! Status: ' + res.getStatusCode() + '\n' + modelsList;
            } else {
                return 'Erro na conexão. Status: ' + res.getStatusCode() + '\nDetalhes: ' + res.getBody();
            }
        } catch (Exception e) {
            System.debug('Test Exception: ' + e.getMessage());
            System.debug('Test Stack Trace: ' + e.getStackTraceString());
            
            if (e.getMessage().contains('credential')) {
                return 'Erro: Named Credential não encontrado ou sem permissão. Verifique a configuração.';
            }
            
            return 'Erro: ' + e.getMessage();
        }
    }
    
    // Método adicional para debug detalhado
    @AuraEnabled(cacheable=false)
    public static String debugConfiguration() {
        Map<String, String> debugInfo = new Map<String, String>();
        
        try {
            debugInfo.put('Named Credential', NAMED_CREDENTIAL);
            debugInfo.put('User', UserInfo.getName());
            debugInfo.put('Profile', UserInfo.getProfileId());
            
            // Tenta construir o endpoint
            String testEndpoint = 'callout:' + NAMED_CREDENTIAL + '/test';
            debugInfo.put('Test Endpoint', testEndpoint);
            
            // Verifica Permission Sets
            List<PermissionSetAssignment> psAssignments = [
                SELECT PermissionSet.Name 
                FROM PermissionSetAssignment 
                WHERE AssigneeId = :UserInfo.getUserId()
            ];
            
            List<String> permSetNames = new List<String>();
            for(PermissionSetAssignment psa : psAssignments) {
                permSetNames.add(psa.PermissionSet.Name);
            }
            debugInfo.put('Permission Sets', String.join(permSetNames, ', '));
            
        } catch (Exception e) {
            debugInfo.put('Debug Error', e.getMessage());
        }
        
        return JSON.serialize(debugInfo);
    }
        */
}