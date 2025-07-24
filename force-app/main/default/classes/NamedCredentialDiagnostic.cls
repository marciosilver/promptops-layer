public class NamedCredentialDiagnostic {
    
    // Método para verificar se o usuário tem acesso ao Named Credential
    public static void checkUserAccess() {
        try {
            // Verifica o usuário atual
            User currentUser = [SELECT Id, Name, Profile.Name, UserRole.Name 
                               FROM User 
                               WHERE Id = :UserInfo.getUserId()];
            System.debug('Current User: ' + currentUser.Name);
            System.debug('Profile: ' + currentUser.Profile.Name);
            
            // Verifica Permission Sets atribuídos
            List<PermissionSetAssignment> psAssignments = [
                SELECT PermissionSet.Name, PermissionSet.Label 
                FROM PermissionSetAssignment 
                WHERE AssigneeId = :UserInfo.getUserId()
            ];
            
            System.debug('Permission Sets Assigned:');
            for(PermissionSetAssignment psa : psAssignments) {
                System.debug('- ' + psa.PermissionSet.Name);
            }
            
            // Tenta listar External Credentials (requer permissão View Setup)
            try {
                List<ExternalCredential> extCreds = [
                    SELECT Id, DeveloperName, MasterLabel 
                    FROM ExternalCredential 
                    WHERE DeveloperName = 'OpenAI_Credential'
                ];
                System.debug('External Credential found: ' + !extCreds.isEmpty());
            } catch(Exception e) {
                System.debug('Cannot query ExternalCredential: ' + e.getMessage());
            }
            
        } catch(Exception e) {
            System.debug('Error checking access: ' + e.getMessage());
        }
    }
    
    // Teste simples de callout
    public static void testSimpleCallout() {
        try {
            HttpRequest req = new HttpRequest();
            req.setEndpoint('callout:OpenAI_API/v1/models');
            req.setMethod('GET');
            req.setTimeout(30000);
            
            System.debug('Attempting callout to: ' + req.getEndpoint());
            
            Http http = new Http();
            HttpResponse res = http.send(req);
            
            System.debug('Response Status: ' + res.getStatusCode());
            System.debug('Response Body (first 200 chars): ' + res.getBody().left(200));
            
        } catch(Exception e) {
            System.debug('Callout Error Type: ' + e.getTypeName());
            System.debug('Callout Error Message: ' + e.getMessage());
            System.debug('Stack Trace: ' + e.getStackTraceString());
        }
    }
    
    // Verifica se o Named Credential existe e está acessível
    public static void verifyNamedCredential() {
        try {
            // Tenta fazer um callout mínimo
            HttpRequest req = new HttpRequest();
            req.setEndpoint('callout:OpenAI_API/');
            System.debug('Named Credential endpoint construído com sucesso');
            
            // Verifica se consegue acessar metadados (se tiver permissão)
            List<NamedCredential> ncs = [
                SELECT Id, DeveloperName, Endpoint 
                FROM NamedCredential 
                WHERE DeveloperName = 'OpenAI_API'
                LIMIT 1
            ];
            
            if(!ncs.isEmpty()) {
                System.debug('Named Credential found: ' + ncs[0].DeveloperName);
                System.debug('Endpoint: ' + ncs[0].Endpoint);
            }
            
        } catch(Exception e) {
            System.debug('Error verifying Named Credential: ' + e.getMessage());
        }
    }
}