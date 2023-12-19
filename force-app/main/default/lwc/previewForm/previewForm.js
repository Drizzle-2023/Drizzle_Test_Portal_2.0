/**
 * @description       :
 * @author            :
 * @group             :
 * @last modified on  : 12-19-2023
 * @last modified by  : D - D
 **/
import { LightningElement, api, wire } from 'lwc';
import { CloseActionScreenEvent } from 'lightning/actions';
import getCorrectQuestionList from '@salesforce/apex/DZTestPortalController.getCorrectQuestionList';
export default class PreviewForm extends LightningElement {
    record_Id;
    result;
    @api set recordId(value) {
        this.record_Id = value;
    }

    get recordId() {
        console.log('get', this.record_Id);
        return this.record_Id;
    }

    get questionList() {
        if (this.result) {
            let resultMap = this.result.jsonResult ? JSON.parse(JSON.stringify(this.result.jsonResult)) : null;
            let questionAndAnswerList = JSON.parse(JSON.stringify(this.result.questionAndAnswerList));

            if (resultMap) {
                let jsonResult = JSON.parse(resultMap);
                questionAndAnswerList.forEach((question) => {
                    let getSolveQuestion = jsonResult[question.Id];

                    question.Test_Question_Options__r.forEach((option) => {
                        if (option.Correct_Option__c) {
                            option.correctStyle =
                                'background-color: rgba(0, 128, 0, 0.2); padding: 0.5rem; border-radius: 8px;border: 1px solid green;';
                        } else {
                            if (getSolveQuestion && getSolveQuestion.includes(option.Id)) {
                                option.correctStyle =
                                    'background-color: rgba(214, 0, 0, 0.2); padding: 0.5rem; border-radius: 8px;border: 1px solid red;';
                            }
                        }
                        if (getSolveQuestion && getSolveQuestion.includes(option.Id)) {
                            option.isOptionSelect = true;
                        }
                        // if (condition) {
                        //     option.wrongStyle =
                        //         'background-color: rgba(214, 0, 0, 0.2); padding: 0.5rem; border-radius: 8px;border: 1px solid red;';
                        // }

                        delete option.Correct_Option__c;
                        console.log('optionStr:' + JSON.stringify(option));
                    });
                });
            }
            console.log('questionList:', JSON.stringify(questionAndAnswerList));
            return questionAndAnswerList;
        }
        return null;
    }

    @wire(getCorrectQuestionList, { candidateTestId: '$record_Id' })
    wiredData({ error, data }) {
        if (data) {
            this.result = data;
            console.log('result:' + JSON.stringify(this.result));
        } else if (error) {
            console.error('Error:', error);
        }
    }

    handleOnClick() {
        this.dispatchEvent(new CloseActionScreenEvent());
    }
}
