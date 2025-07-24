public class ContactSearch {
    public static List<Contact> searchForContacts (String lName, String mailPostalCode){
        try{
            List<Contact> contacts = [SELECT Name FROM Contact WHERE (LastName = :lName AND MailingPostalCode = :mailPostalCode)];
            return contacts;
        }catch(DmlException e){
            System.debug('An error occurred: ' + e.getMessage());
            return null;
        }
        
    }
}