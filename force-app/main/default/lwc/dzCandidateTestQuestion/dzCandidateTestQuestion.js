/* eslint-disable no-unused-expressions */
/* eslint-disable @lwc/lwc/no-api-reassignments */
/* eslint-disable @lwc/lwc/no-document-query */
/**
 * @description       :
 * @author            :
 * @group             :
 * @last modified on  : 12-19-2023
 * @last modified by  : D - D
 **/

import { LightningElement, api, track } from 'lwc';
import QuestionsBuilder from './dzQuestionsBuilderUtils';
import updateCandidate from '@salesforce/apex/DZTestPortalController.updateCandidate';
// import savePhotoAsAttachment from '@salesforce/apex/DZTestPortalController.savePhotoAsAttachment';
import calculateTestResult from '@salesforce/apex/DZTestPortalController.calculateTestResult';
import createCandidateTestRecord from '@salesforce/apex/DZTestPortalController.createCandidateTestRecord';
import StartTest from '@salesforce/schema/Candidate__c.Sart_Test__c';
import Id from '@salesforce/schema/Candidate__c.Id';
import Name from '@salesforce/schema/Candidate_Test__c.Name';
import candidateField from '@salesforce/schema/Candidate_Test__c.Candidate__c';
import testSetId from '@salesforce/schema/Candidate_Test__c.Test_Set__c';
import Test_Cancel_Reason__c from '@salesforce/schema/Candidate__c.Test_Cancel_Reason__c';
export default class DzCandidateTestQuestion extends LightningElement {
    @api questionsList;
    isRendered = true;
    isLoaded = false;
    pictureClickCounter = 0;
    questionsBuilder = new QuestionsBuilder();
    completedQuestion = 0;
    completedQuestionObj = [];
    reverseTimeCount;
    isRender = false;
    isTestEnd = false;
    @track modalContainerClass = 'slds-modal_container_right'; // Default: hidden
    @track backdropClass = 'slds-backdrop'; // Default: hidden
    percentage; // Set the initial percentage
    @track dashArray = 252;
    isCameraOn = false;
    @api candidate;

    get dashOffset() {
        return (this.percentage * 252) / 100;
    }

    connectedCallback() {
        this.questionsBuilder.setQuestionList(this.questionsList);
        this.startReverseTimeCount(this.currentQuestion?.Test_Set__r?.Duration__c);
        this.handelCameraStatus();
        this.detectTabChange();
        this.createCandidateTestRecord();
        this.updateCandidateStartTest();
    }

    get candidateTest() {
        return this.questionsBuilder.getCandidateTestDetail();
    }

    get videoElementNode() {
        let videoElement = this.template.querySelector('.videoElement');

        return videoElement;
    }

    get notCompletedQuestions() {
        return this.totalQuestions - this.completedQuestion;
    }

    get completedQuestions() {
        return this.completedQuestion;
    }

    get totalQuestions() {
        return this.getQuestionsList.length;
    }

    get currentQuestionNumber() {
        return this.currentQuestionIndex + 1;
    }

    get getQuestionsList() {
        return this.questionsBuilder.getQuestionsList();
    }

    get isLastQuestion() {
        return this.totalQuestions === this.currentQuestionIndex + 1;
    }

    get getMCQMap() {
        return this.questionsBuilder.getMCQMap();
    }

    get isFirstQuestion() {
        return this.currentQuestionIndex === 0;
    }

    get currentQuestionIndex() {
        return this.questionsBuilder.getCurrentIndex();
    }

    get isPreviewMode() {
        return this.currentQuestion && this.currentQuestion.isPreview ? true : false;
    }

    get currentQuestion() {
        return this.currentQuestionIndex <= this.getQuestionsList.length && this.getQuestionsList
            ? this.getQuestionsList[this.currentQuestionIndex]
            : null;
    }

    get incrementOFCurrentIndex() {
        let question = this.template.querySelectorAll('.question-number');
        if (question) {
            question.forEach((item, index) => {
                let number = this.template.querySelector(`[data-currrentquestionnumber="${index}"]`);
                if (number) {
                    number.innerHTML = index + 1;
                }
            });
        }

        return 0;
    }

    openPreviewForm() {
        this.modalContainerClass = 'slds-modal_container_right slds-fade-in-open';
        this.backdropClass = 'slds-backdrop slds-backdrop_open';
        this.template.querySelector('.main-content').classList.add('main-content75');
        this.template.querySelector('.main-content').classList.remove('main-content100');

        this.template.querySelectorAll('.main-card').forEach((item) => {
            item.style.marginRight = '0px';
        });
        this.fireHeaderSizeEvent('432px');
    }

    closeModal() {
        // Close the modal and backdrop
        this.modalContainerClass = 'slds-modal_container_right';
        this.backdropClass = 'slds-backdrop';
        this.template.querySelector('.main-content').classList.add('main-content100');
        this.template.querySelector('.main-content').classList.remove('main-content75');
        this.fireHeaderSizeEvent('0px');
        this.template.querySelectorAll('.main-card').forEach((item) => {
            item.style.marginRight = '90px';
        });
    }

    fireHeaderSizeEvent(size) {
        let event = new CustomEvent('preview', {
            detail: size
        });
        this.dispatchEvent(event);
    }

    renderedCallback() {
        if (this.questionsList.length > 0 && this.isRendered) {
            this.isLoaded = true;
            document.addEventListener('keydown', (event) => {
                if (event.key === 'ArrowRight') {
                    if (this.currentQuestionIndex < this.questionsList.length - 1) {
                        this.handleNextQuestion();
                    }
                } else if (event.key === 'ArrowLeft') {
                    if (this.currentQuestionIndex > 0) {
                        this.handlePreviousQuestion();
                    }
                }
            });

            this.isRendered = false;
        }
        this.isLoaded = false;
    }

    handelOptionSelect(event) {
        this.isLoaded = true;
        let isOptionSelect = event.target.checked;
        let {
            optionid: optionId,
            questionid: questionId,
            optionnumber: optionNumber,
            isradio: isRadio
        } = event.target.dataset;

        if (isOptionSelect && !this.completedQuestionObj.includes(questionId)) {
            this.completedQuestionObj.push(questionId);
            ++this.completedQuestion;
        }
        this.questionsBuilder.setSelectedOptionToQuestion(
            this.currentQuestionIndex,
            optionNumber,
            isOptionSelect,
            isRadio
        );
        this.questionsBuilder.buildMCQMap(questionId, optionId, isOptionSelect, isRadio);

        this.isLoaded = false;
    }

    async calculateTestResult() {
        await calculateTestResult({
            quesAndAnsStr: JSON.stringify(this.getMCQMap),
            candiatetestid: this.candidateTest.Id,
            totalQuestionSize: this.questionsList.length
        });
    }

    async capturePicture() {
        if (this.videoElementNode) {
            // Create a canvas element for capturing the photo
            // let canvasElementURL = this.questionsBuilder.getCanvasURLToCaptureImg(this.videoElementNode);
            // await savePhotoAsAttachment({
            //     candidateId: this.candidate.Id,
            //     photoDataUrl: canvasElementURL
            // });
        }
    }

    closeThankYou() {
        this.isLoaded = true;
        window.location.reload();
    }

    async submitTest() {
        this.isLoaded = true;
        try {
            this.calculateTestResult();
            await this.stopWebCam();
            this.isTestEnd = true;
            await this.removeEventListener('visibilitychange');
            // window.location.reload();
        } catch (error) {
            console.log(error);
        } finally {
            this.isLoaded = false;
        }

        this.isLoaded = false;
    }

    handlePreviousQuestion() {
        this.checkCameraStatus();
        this.isLoaded = true;
        if (this.isCameraOn) this.questionsBuilder.previousQuestion();
        this.isLoaded = true;
    }

    handleNextQuestion() {
        if (!this.currentQuestion.isPreview) {
            this.checkCameraStatus();
            if (this.isCameraOn) {
                this.questionsBuilder.nextQuestion();
                this.capturePicture();
            } else {
                this.template
                    .querySelector('c-common-toast')
                    .showToast('error', '<strong>Please on the camera.<strong/>', 'utility:warning', 10000);
            }
        } else {
            this.questionsBuilder.nextQuestion();
        }
    }

    navigateQuestion(event) {
        this.isLoaded = true;
        this.questionsBuilder
            // eslint-disable-next-line radix
            .setCurrentIndex(parseInt(event.target.dataset.currrentquestionnumber));
        this.isLoaded = false;
    }

    async detectTabChange() {
        document.addEventListener('visibilitychange', async () => {
            if (document.visibilityState !== 'visible') {
                await this.stopWebCam();

                let candidateToUpdate = {};
                candidateToUpdate[Test_Cancel_Reason__c.fieldApiName] = 'Candidate Changed tab.';
                candidateToUpdate[Id.fieldApiName] = this.candidate.Id;

                try {
                    // alert('Tab Changed');
                    let result = await updateCandidate({ candidate: candidateToUpdate });
                } catch (error) {
                    console.error('error: ', JSON.stringify(error));
                }

                await this.calculateTestResult();
                this.reverseTimeCount = '';
                this.isTestEnd = true;
                window.location.reload();
            }
        });
    }

    async updateCandidateStartTest() {
        let candidateToUpdate = {};
        candidateToUpdate[StartTest.fieldApiName] = true;
        candidateToUpdate[Id.fieldApiName] = this.candidate.Id;

        try {
            let result = await updateCandidate({ candidate: candidateToUpdate });
        } catch (error) {
            console.error('error: ', JSON.stringify(error));
        }
    }

    //create candidate test record ..
    async createCandidateTestRecord() {
        //create Test candidate record.
        let CandidateTestToInsert = this.questionsBuilder
            .setCandidateTestField(Name.fieldApiName, `${this.candidate.Name} ${this.candidate.Last_Name__c} Test`)
            .setCandidateTestField(candidateField.fieldApiName, this.candidate.Id)
            .setCandidateTestField(testSetId.fieldApiName, this.currentQuestion.Test_Set__c)
            .getCandidateTestDetail();

        let result;

        try {
            result = await createCandidateTestRecord({ candidateTest: CandidateTestToInsert });
            this.questionsBuilder.setCandidateTestField('Id', result?.Id);
        } catch (error) {
            console.log('error:', error);
        }
    }

    //handel camera status when next question is populated.
    async handelCameraStatus() {
        await this.checkCameraStatus(this.candidate, true);
    }

    async checkCameraStatus() {
        try {
            let stream = await navigator.mediaDevices.getUserMedia({
                video: true
            });
            this.videoElementNode.srcObject = stream;
            if (this.videoElementNode.srcObject) {
                this.videoElementNode.play();
                this.isCameraOn = true;
            }
        } catch (error) {
            this.isCameraOn = false;
            this.template
                .querySelector('c-common-toast')
                .showToast('error', '<strong>Please on the camera.<strong/>', 'utility:warning', 10000);
        }
    }

    async stopWebCam() {
        try {
            this.videoElementNode.srcObject.getTracks().forEach((track1) => track1.stop());
            this.videoElementNode.srcObject = null;
        } catch (error) {
            console.log(error, 'error');
        }
    }

    async startReverseTimeCount(duration) {
        try {
            let countDownDate = new Date().getTime() + duration * 60000;
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            this.interval = setInterval(async () => {
                let now = new Date().getTime();
                let distance = countDownDate - now;
                let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = Math.floor((distance % (1000 * 60)) / 1000);
                this.reverseTimeCount = `${minutes}:${seconds}`;
                let totalMin = (minutes * 60 + seconds) / 60;
                this.percentage = (totalMin / duration) * 100;
                if (distance < 0) {
                    this.reverseTimeCount = `00:00`;
                    this.percentage = 0;
                    clearInterval(this.interval);
                    //calculate score ...
                    await this.calculateTestResult();
                    window.location.reload();
                }
            }, 1000);
        } catch (error) {
            console.log('error:', error);
        }
    }
}
