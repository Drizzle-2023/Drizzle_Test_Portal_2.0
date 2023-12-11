/**
 * @description       :
 * @author            : Dharmraj Baravkar
 * @group             :
 * @last modified on  : 08-31-2023
 * @last modified by  :
 **/
public class PasscodeHelper {
  static String passcodeGenerator() {
    integer len = 8;
    final String chars = 'ABCD01234EFGabcdeHISTUVWXYZ5678JKLMNOPQR9fghijklmnopqrstuvwxyz';
    String randStr = '';
    while (randStr.length() < len) {
      Integer idx = Math.mod(
        Math.abs(Crypto.getRandomInteger()),
        chars.length()
      );
      randStr += chars.substring(idx, idx + 1);
    }
    return randStr;
  }

  public static void addPasscodes(
    list<Candidate__c> newCandidates,
    Map<Id, Candidate__c> oldcandidateMap
  ) {
    integer i = 0;
    List<Candidate__c> candidatelist = new List<Candidate__c>();

    string passcode = passcodeGenerator();
    System.debug('passcode: ' + passcode);
    for (Candidate__c candidate : newCandidates) {
      if (oldcandidateMap == null) {
        System.debug('passcode: ' + passcode);
        candidate.Pass_Code__c = passcode;
        candidatelist.add(candidate);
      }
      if (oldcandidateMap != null && !oldcandidateMap.isEmpty()) {
        Candidate__c oldCandiate = oldcandidateMap.get(candidate.Id);
        if (
          oldCandiate.Sart_Test__c == false &&
          candidate.Sart_Test__c == true
        ) {
          candidate.Pass_Code__c = passcode;
          candidatelist.add(candidate);
        }
      }
    }
  }
}