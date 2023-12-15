/**
 * @description       : Class Is Handel to Fetch Record, Update Record, Create Record
 * @author            : D - D
 * @group             :
 * @last modified on  : 12-13-2023
 * @last modified by  : D - D
 * Modifications Log
 * Ver   Date         Author   Modification
 * 1.0   12-11-2023   D - D   Initial Version
 **/
public without sharing class DZTestPortalHelper {
    /**
     * @description Method is used to validate candidate Details using email. Ans return message is Valid or Error.
     * @author D - D | 12-13-2023
     * @param String email
     * @param String passcode
     * @return String
     **/
    public static Map<String, String> getCandidateDetail(String email, String passcode) {
        Candidate__c candidateDetail;
        Map<String, String> candidateDetailMap = new Map<String, String>();
        try {
            candidateDetail = [
                SELECT Id, Name, Last_Name__c, Candidate_Type__c, Email__c, Pass_Code__c, Sart_Test__c
                FROM Candidate__c
                WHERE Email__c = :email
                LIMIT 1
            ];
        } catch (Exception e) {
            candidateDetailMap.put('isValid', 'false');
            candidateDetailMap.put('Message', 'Invalid Email! Please provide valid email provided by our HR team.');
            return candidateDetailMap;
        }
        if (candidateDetail != null && candidateDetail.Pass_Code__c == passcode) {
            if (candidateDetail.Sart_Test__c) {
                candidateDetailMap.put('isValid', 'false');
                candidateDetailMap.put(
                    'Message',
                    'Your test is Submited please contact our HR team(contact@drizzleit.org).'
                );
                return candidateDetailMap;
            }
            candidateDetailMap.put('isValid', 'true');
            candidateDetailMap.put('Message', 'Login Succesfully Completed!.');
            candidateDetailMap.put('candidateDetail', JSON.serialize(candidateDetail));
            candidateDetailMap.put(
                'questionsList',
                JSON.serialize(getQuestionsANdOptionsList(candidateDetail.Candidate_Type__c))
            );
            return candidateDetailMap;
        } else {
            candidateDetailMap.put('isValid', 'false');
            candidateDetailMap.put(
                'Message',
                'Invalid Pass-Code! Please provide valid Pass-Code provided by our HR Team.'
            );
            System.debug('candidateDetailMap: ' + candidateDetailMap);
            return candidateDetailMap;
        }
    }

    private static List<Test_Questions__c> getQuestionsANdOptionsList(String setType) {
        List<Test_Set__c> testSetList;
        List<Test_Questions__c> questionAndOptionList;
        try {
            testSetList = [
                SELECT Id, Name, Duration__c, Number_of_Questions__c
                FROM Test_Set__c
                WHERE Type__c = :setType
            ];
            Integer randomInRange = Integer.valueof((Math.random() * testSetList.size()));

            questionAndOptionList = [
                SELECT
                    Id,
                    Question__c,
                    Multiple_Selection__c,
                    CreatedById,
                    Test_Set__c,
                    Test_Set__r.Duration__c,
                    Test_Set__r.Number_of_Questions__c,
                    (SELECT Id, Option_Description__c FROM Test_Question_Options__r)
                FROM Test_Questions__c
                WHERE Test_Set__c = :testSetList[randomInRange].Id
                ORDER BY CreatedById DESC
                LIMIT :(Integer) testSetList[randomInRange].Number_of_Questions__c
            ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return questionAndOptionList;
    }

    public static void updateCandidate(Candidate__c candidate) {
        try {
            // update candidate;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public static Candidate_Test__c createCandidateTestRecord(Candidate_Test__c candidateTest) {
        try {
            // upsert candidateTest;
            return candidateTest;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public static void calculateTestResult(String quesAndAnsStr, String candiatetestid) {
        try {
            Map<String, Set<String>> quesAndAnsMap = (Map<String, Set<String>>) JSON.deserialize(
                quesAndAnsStr,
                Map<String, Set<String>>.class
            );

            List<Test_Question_Option__c> questionOptions = [
                SELECT Id, Correct_Option__c, Test_Questions__c
                FROM Test_Question_Option__c
                WHERE
                    Test_Questions__c IN (
                        SELECT Id
                        FROM Test_Questions__c
                        WHERE Id IN :quesAndAnsMap.keySet()
                    )
                    AND Correct_Option__c = TRUE
            ];
            Map<String, Set<String>> correctQuesAndAnsMap = new Map<String, Set<String>>();
            for (Test_Question_Option__c correntOption : questionOptions) {
                if (!correctQuesAndAnsMap.containsKey(correntOption.Test_Questions__c)) {
                    correctQuesAndAnsMap.put(correntOption.Test_Questions__c, new Set<String>());
                }
                if (correctQuesAndAnsMap.containsKey(correntOption.Test_Questions__c)) {
                    correctQuesAndAnsMap.get(correntOption.Test_Questions__c).add(correntOption.Id);
                }
            }
            System.debug('correctQuesAndAnsMap: ' + correctQuesAndAnsMap);
            Integer totalMarks = 0;
            for (String testQuestion : quesAndAnsMap.keySet()) {
                if (correctQuesAndAnsMap.get(testQuestion).equals(quesAndAnsMap.get(testQuestion))) {
                    ++totalMarks;
                    System.debug('CorrectOption:' + totalMarks);
                }
            }
            Candidate_Test__c candidatetestToUpdate = new Candidate_Test__c(
                Id = candiatetestid,
                Score__c = totalMarks,
                Total_Marks__c = quesAndAnsMap.keySet().size(),
                Json_Result__c = quesAndAnsStr
            );
            // update candidatetestToUpdate;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public static Id savePhotoAsAttachment(Id candidateId, String photoDataUrl) {
        Blob photoData = EncodingUtil.base64Decode(photoDataUrl.substringAfter(','));

        Attachment attachment = new Attachment();
        attachment.ParentId = candidateId;
        attachment.Name = 'Photo.jpg';
        attachment.Body = photoData;
        attachment.ContentType = 'image/jpeg';

        // insert attachment;

        return attachment.Id;
    }
}
