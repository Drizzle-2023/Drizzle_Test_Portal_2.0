class CandidateBuilder {
    constructor() {
        this.candidate = {};
        this.questionsList = [];
    }

    getQuestionsList() {
        return this.questionsList;
    }

    setCandidate(candidate) {
        this.candidate = candidate;
    }

    setQuestionList(questionsList) {
        console.log('setQuestionList:' + JSON.stringify(questionsList));
        this.questionsList = questionsList;
        return this.getRandomQuestionList(this.questionsList);
    }

    setCandidateField(fieldLabel, fieldValue) {
        this.candidate[fieldLabel] = fieldValue;
        console.log('this.candidate: ', JSON.stringify(this.candidate));
        return this;
    }

    getCandidateDetail() {
        return this.candidate;
    }

    getRandomQuestionList(questions) {
        let randomQuestions = [];

        while (questions.length > 0) {
            let randomIndex = Math.floor(Math.random() * questions.length);
            randomQuestions.push(questions[randomIndex]);
            questions.splice(randomIndex, 1);
        }
        return randomQuestions;
    }
}

export default CandidateBuilder;