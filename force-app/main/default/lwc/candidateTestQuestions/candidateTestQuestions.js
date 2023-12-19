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
class QuestionsBuilder {
    constructor() {
        this.currentIndex = 0;
    }

    nextQuestion() {
        ++this.currentIndex;
        return this.currentIndex;
    }
    getCurrentIndex() {
        return this.currentIndex;
    }
    previousQuestion() {
        --this.currentIndex;
        return this.currentIndex;
    }
}
import { LightningElement, api } from 'lwc';
export default class CandidateTestQuestions extends LightningElement {
    @api questionsList;

    questionsBuilder;

    connectedCallback() {
        this.questionsBuilder = new QuestionsBuilder();
        console.log('Connected Callback:', JSON.stringify(this.questionsList));
        this.currentQuestion = this.questionsList[this.currentQuestionIndex];
    }

    get totalQuestions() {
        return this.questionsList.length;
    }

    get currentQuestionNumber() {
        return this.currentQuestionIndex + 1;
    }

    get isLastQuestion() {
        return this.questionsList.length === this.currentQuestionIndex + 1;
    }

    get isFirstQuestion() {
        return this.currentQuestionIndex === 0;
    }

    get currentQuestionIndex() {
        return this.questionsBuilder.getCurrentIndex();
    }
    currentQuestion;
    // get currentQuestion() {
    //     console.log(
    //         'this.questionsList[this.currentQuestionIndex]:',
    //         JSON.stringify(this.questionsList[this.currentQuestionIndex])
    //     );
    //     return this.questionsList[this.currentQuestionIndex];
    // }

    handlePreviousQuestion() {
        this.questionsBuilder.previousQuestion();
        this.currentQuestion = this.questionsList[this.currentQuestionIndex];
        console.log('pre ques');
    }

    handleNextQuestion() {
        console.log(this.questionsBuilder.nextQuestion());
        this.currentQuestion = this.questionsList[this.currentQuestionIndex];
        console.log('next ques');
    }
}
