/**
 * @description       : Controller Is Used to Handel Aura Enabled Method.
 * @author            : D - D
 * @group             :
 * @last modified on  : 12-19-2023
 * @last modified by  : D - D
 * Modifications Log
 * Ver   Date         Author   Modification
 * 1.0   12-11-2023   D - D   Initial Version
 **/
public with sharing class DZTestPortalController {
    /**
     * @description - method is used to get candidate detail with the test set whose type is matchinf to the candidate
     * @author D - D | 12-19-2023
     * @param String email
     * @param String passcode
     * @return Map<String, String>
     **/
    @AuraEnabled
    public static Map<String, String> getCandidateDetail(String email, String passcode) {
        try {
            return DZTestPortalHelper.getCandidateDetail(email, passcode);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    /**
     * @description method is used to update candidate depending upon input parameter as json this method is used when tab is change or candidate start the test.
     * @author D - D | 12-19-2023
     * @param Candidate__c candidate
     * @return String
     **/
    @AuraEnabled
    public static String updateCandidate(Candidate__c candidate) {
        try {
            DZTestPortalHelper.updateCandidate(candidate);
            return 'Record Update';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    /**
     * @description - method is used to crreate candidate test record when canidate start the test.
     * @author D - D | 12-19-2023
     * @param Candidate_Test__c candidateTest
     * @return Candidate_Test__c
     **/
    @AuraEnabled
    public static Candidate_Test__c createCandidateTestRecord(Candidate_Test__c candidateTest) {
        try {
            return DZTestPortalHelper.createCandidateTestRecord(candidateTest);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    /**
     * @description method is used to calculate test result depending upon json.
     * @author D - D | 12-19-2023
     * @param String quesAndAnsStr
     * @param String candiatetestid
     **/
    @AuraEnabled
    public static void calculateTestResult(String quesAndAnsStr, String candiatetestid, Integer totalQuestionSize) {
        try {
            DZTestPortalHelper.calculateTestResult(quesAndAnsStr, candiatetestid, totalQuestionSize);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    /**
     * @description method is used to the capture candidate photo and save as candidate record attachment.
     * @author D - D | 12-19-2023
     * @param Id candidateId
     * @param String photoDataUrl
     * @return Id
     **/
    @AuraEnabled
    public static Id savePhotoAsAttachment(Id candidateId, String photoDataUrl) {
        try {
            return DZTestPortalHelper.savePhotoAsAttachment(candidateId, photoDataUrl);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static TestQuestionAndMAp getCorrectQuestionList(Id candidateTestId) {
        System.debug('candidateTestId: ' + candidateTestId);
        List<Test_Questions__c> questionAndAnswerList;
        Candidate_Test__c candidateTest = [
            SELECT Test_Set__c, Json_result__c
            FROM Candidate_Test__c
            WHERE Id = :candidateTestId
        ];
        try {
            questionAndAnswerList = [
                SELECT
                    Id,
                    Question__c,
                    Multiple_Selection__c,
                    CreatedById,
                    Test_Set__c,
                    Test_Set__r.Duration__c,
                    (
                        SELECT Id, Option_Description__c, Correct_Option__c
                        FROM Test_Question_Options__r
                    )
                FROM Test_Questions__c
                WHERE Test_Set__c = :candidateTest.Test_Set__c
                ORDER BY CreatedById DESC
            ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        System.debug('questionAndAnswerList: ' + questionAndAnswerList);
        TestQuestionAndMAp testQesMap = new TestQuestionAndMAp();
        testQesMap.jsonResult = candidateTest.Json_Result__c;
        testQesMap.questionAndAnswerList = questionAndAnswerList;
        return testQesMap;
    }

    public class TestQuestionAndMAp {
        @AuraEnabled
        public String jsonResult;
        @AuraEnabled
        public List<Test_Questions__c> questionAndAnswerList;
    }
}
