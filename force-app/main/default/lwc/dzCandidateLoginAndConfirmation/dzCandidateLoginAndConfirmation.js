/**
 * @description       :
 * @author            : D - D
 * @group             :
 * @last modified on  : 12-14-2023
 * @last modified by  : D - D
 * Modifications Log
 * Ver   Date         Author   Modification
 * 1.0   12-11-2023   D - D   Initial Version
 **/
import { LightningElement } from 'lwc';
import CandidateBuilder from './dzTestPortalUtils.js';
import getCandidateDetail from '@salesforce/apex/DZTestPortalController.getCandidateDetail';
export default class DzCandidateLoginAndConfirmation extends LightningElement {
    isLoaded = false;
    candidateBuilder;
    candidate;
    questionList;
    isTAndC = true;
    isProceed;

    connectedCallback() {
        this.candidateBuilder = new CandidateBuilder();
    }

    get numberOfQuestions() {
        return this.questionList[0]?.Test_Set__r?.Number_of_Questions__c;
    }

    confirmTermsAndConditions() {
        this.isTAndC = this.isTAndC ? false : true;
    }

    async proceedToTest() {
        this.isLoaded = true;
        let isCameraOn = await this.checkCameraStatus();
        if (isCameraOn) {
            this.isProceed = true;
            this.candidate.isValid = false;
        }
        this.isLoaded = false;
    }

    get isLoginPage() {
        return !this.isProceed && !this.isCandidateValid;
    }

    get isTAndCPage() {
        return !this.isProceed && this.isCandidateValid;
    }

    get isQuesPage() {
        return this.isProceed && !this.isCandidateValid;
    }

    get isCandidateValid() {
        return this.candidate?.isValid === 'true';
    }

    get candidateDetail() {
        return JSON.parse(JSON.stringify(this.candidateBuilder.getCandidateDetail()));
    }

    loginPageRedirection() {
        this.candidate = {};
        this.candidateBuilder.setCandidate({});
        this.showUserInfo();
    }

    handelFieldChange(event) {
        let { name, value } = event.target;
        this.candidateBuilder.setCandidateField(name, value);
        console.log('candidateDetail@@: ', JSON.stringify(this.candidateDetail));
    }

    handleEnter(event) {
        if (event.keyCode === 13) {
            this.verifyCandidate();
        }
    }

    renderedCallback() {
        const cardstyle = document.createElement('style');
        cardstyle.innerText = `.verify-candidate .slds-button {background-color:;
        border-radius: 0.25rem;
        padding:.3rem 1.2rem;
        color: #fff !important;}`;
        let verifyButton = this.template.querySelector('.verify-candidate');
        if (verifyButton) {
            verifyButton.appendChild(cardstyle);
        }

        const proceedBtntyle = document.createElement('style');
        proceedBtntyle.innerText = `.proceed-candidate .slds-button {
        border-radius: 0.25rem;
        padding:.3rem 1.2rem;
        }`;
        let proceedButton = this.template.querySelector('.proceed-candidate');
        if (proceedButton) {
            proceedButton.appendChild(proceedBtntyle);
        }

        const inputLable = document.createElement('style');
        inputLable.innerText = `.custom-input div[lightning-input_input] .slds-form-element__label {color: #4d4c4c;
        font-size: 0.875rem;
        text-transform: uppercase;}`;
        this.template.querySelectorAll('.custom-input').forEach((elem) => {
            if (elem) {
                elem.appendChild(inputLable);
            }
        });

        const inputInput = document.createElement('style');
        inputInput.innerText = `.custom-input div[lightning-input_input] div[lightning-input_input] .slds-input{height: 3rem;}`;
        this.template.querySelectorAll('.custom-input').forEach((elem) => {
            if (elem) {
                elem.appendChild(inputInput);
            }
        });

        const checkbox = document.createElement('style');
        let checkboxElem = this.template.querySelector('.terms-condi');
        checkbox.innerText = `.terms-condi .slds-form-element__control .slds-checkbox .slds-checkbox__label .slds-form-element__label{color: #007DEA;
          font-size: 16px;
          font-weight: 600;}`;
        if (checkboxElem) {
            checkboxElem.appendChild(checkbox);
        }

        const checkboxBox = document.createElement('style');
        checkboxBox.innerText = `.terms-condi .slds-form-element__control .slds-checkbox .slds-checkbox__label .slds-checkbox_faux{height: 20px;
        width: 20px;
        border-radius: 7px;
        border: 1px solid #007DEA;
        background: #FFF;}`;
        let checkboxBoxElem = this.template.querySelector('.terms-condi');
        if (checkboxBoxElem) {
            checkboxBoxElem.appendChild(checkboxBox);
        }
        this.isRendered = true;
    }

    async verifyCandidate() {
        this.isLoaded = true;

        if (!this.isInputValid('.validate')) {
            this.isLoaded = false;
            return;
        }
        let result;
        try {
            result = await getCandidateDetail({
                email: this.candidateDetail.email,
                passcode: this.candidateDetail.passcode
            });
        } catch (error) {
            console.log('error', JSON.stringify(error));
            this.fireToastMessage(
                'Please Provide Valid Information or Refresh the page',
                'error',
                'utility:error',
                20000
            );
        }

        console.log('result: ', result.isValid);
        this.candidate = result;
        if (result) {
            if (result.isValid === 'true') {
                this.candidateBuilder.setCandidate(JSON.parse(result.candidateDetail));
                this.questionList = this.candidateBuilder.setQuestionList(JSON.parse(result.questionsList));
                this.fireToastMessage(result.Message, 'success', 'utility:success', 10000);
                this.showUserInfo();
            } else {
                this.fireToastMessage(result.Message, 'error', 'utility:error', 20000);
            }
        }
        this.isLoaded = false;
    }
    showUserInfo() {
        let event = new CustomEvent('showuserinfo', {
            detail: `${this.candidateDetail?.Name} ${this.candidateDetail?.Last_Name__c}`
        });
        console.log('event:', event);
        this.dispatchEvent(event);
    }

    fireToastMessage(message, type, icon, time) {
        console.log('fireToastMessage');
        this.template.querySelector('c-common-toast').showToast(type, `<strong>${message}<strong/>`, icon, time);
    }

    //check validity of login form
    isInputValid(className) {
        let isValid = true;
        let inputFields = this.template.querySelectorAll(className);
        inputFields.forEach((inputField) => {
            if (!inputField.checkValidity()) {
                inputField.reportValidity();
                isValid = false;
            }
        });
        return isValid;
    }

    async checkCameraStatus() {
        try {
            await navigator.mediaDevices.getUserMedia({
                video: true
            });

            console.log('camera on');
            return true;
        } catch (error) {
            this.template
                .querySelector('c-common-toast')
                .showToast('error', '<strong>Please on the camera.<strong/>', 'utility:warning', 10000);
        }
        return false;
    }
}