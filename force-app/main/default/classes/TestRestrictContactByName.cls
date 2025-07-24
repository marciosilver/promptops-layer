@isTest
public class TestRestrictContactByName {
    @isTest
    public static void unitTest (){
        contact c = new contact();
        c.LastName = 'INVALIDNAME';
        
   		Test.startTest();
        try{
            insert c;
        }
        catch (DmlException dmlEx) {
        	String expectedMessage = 'The Last Name "'+ c.LastName+'" is not allowed for DML';
            System.assertEquals(expectedMessage, dmlEx.getDmlMessage(0));
        }
        Test.stopTest();

    } 

}