declare module "@salesforce/apex/DZTestPortalController.getCandidateDetail" {
  export default function getCandidateDetail(param: {email: any, passcode: any}): Promise<any>;
}
declare module "@salesforce/apex/DZTestPortalController.updateCandidate" {
  export default function updateCandidate(param: {candidate: any}): Promise<any>;
}
declare module "@salesforce/apex/DZTestPortalController.createCandidateTestRecord" {
  export default function createCandidateTestRecord(param: {candidateTest: any}): Promise<any>;
}
declare module "@salesforce/apex/DZTestPortalController.calculateTestResult" {
  export default function calculateTestResult(param: {quesAndAnsStr: any, candiatetestid: any, totalQuestionSize: any}): Promise<any>;
}
declare module "@salesforce/apex/DZTestPortalController.savePhotoAsAttachment" {
  export default function savePhotoAsAttachment(param: {candidateId: any, photoDataUrl: any}): Promise<any>;
}
declare module "@salesforce/apex/DZTestPortalController.getCorrectQuestionList" {
  export default function getCorrectQuestionList(param: {candidateTestId: any}): Promise<any>;
}
