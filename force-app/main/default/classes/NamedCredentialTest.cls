public class NamedCredentialTest {
    public static void testAccess() {
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:OpenAI_API/v1/models');
        req.setMethod('GET');
        
        Http http = new Http();
        HttpResponse res = http.send(req);
        System.debug('STATUS: ' + res.getStatusCode());
        System.debug('BODY: ' + res.getBody());
    }
}
