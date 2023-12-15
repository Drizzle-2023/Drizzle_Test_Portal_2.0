/**
 * @description       : Controller Is Used to Handel Aura Enabled Method.
 * @author            : D - D
 * @group             :
 * @last modified on  : 12-13-2023
 * @last modified by  : D - D
 * Modifications Log
 * Ver   Date         Author   Modification
 * 1.0   12-11-2023   D - D   Initial Version
 **/
public with sharing class DZTestPortalController {
    @AuraEnabled
    public static Map<String, String> getCandidateDetail(String email, String passcode) {
        try {
            return DZTestPortalHelper.getCandidateDetail(email, passcode);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static String updateCandidate(Candidate__c candidate) {
        try {
            DZTestPortalHelper.updateCandidate(candidate);
            return 'Record Update';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Candidate_Test__c createCandidateTestRecord(Candidate_Test__c candidateTest) {
        try {
            return DZTestPortalHelper.createCandidateTestRecord(candidateTest);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void calculateTestResult(String quesAndAnsStr, String candiatetestid) {
        try {
            DZTestPortalHelper.calculateTestResult(quesAndAnsStr, candiatetestid);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Id savePhotoAsAttachment(Id candidateId, String photoDataUrl) {
        try {
            return DZTestPortalHelper.savePhotoAsAttachment(candidateId, photoDataUrl);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
