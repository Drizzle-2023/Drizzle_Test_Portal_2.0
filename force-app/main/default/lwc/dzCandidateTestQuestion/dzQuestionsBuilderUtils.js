class QuestionsBuilder {
    constructor() {
        this.currentIndex = 0;
        this.optionAndQesIdsMap = {};
        this.questionsList = [];
        this.candidateTest = {};
    }

    getQuestionsList() {
        return this.questionsList;
    }

    getMCQMap() {
        return JSON.parse(JSON.stringify(this.optionAndQesIdsMap));
    }

    setQuestionList(questionsList) {
        // console.log('setQuestionList:' + JSON.stringify(questionsList));
        this.questionsList = JSON.parse(JSON.stringify(questionsList));
        return this;
    }

    setSelectedOptionToQuestion(questionNumber, optionNumber, isChecked, isRadio) {
        if (isRadio === 'false') {
            this.questionsList[questionNumber].Test_Question_Options__r.records.forEach((item, index) => {
                item.isOptionSelect = false;
            });
        }
        this.questionsList[questionNumber].Test_Question_Options__r.records[optionNumber].isOptionSelect = isChecked;

        return this.questionsList;
    }

    setCurrentIndex(index) {
        this.currentIndex = index;
        return this;
    }

    setMCQMap(optionAndQesIdsMap) {
        this.optionAndQesIdsMap = optionAndQesIdsMap;
        return this;
    }

    buildMCQMap(questionId, optionId, isChecked, isRadio) {
        if (isRadio === 'false') {
            this.optionAndQesIdsMap[questionId] = [optionId];
            return;
        }
        if (!this.optionAndQesIdsMap[questionId]) {
            this.optionAndQesIdsMap[questionId] = [];
        }

        if (isChecked) {
            this.optionAndQesIdsMap[questionId].push(optionId);
        } else {
            this.optionAndQesIdsMap[questionId]?.splice(this.optionAndQesIdsMap[questionId].indexOf(optionId), 1);
        }
        // console.log('this.optionAndQesIdsMap:', JSON.stringify(this.optionAndQesIdsMap));
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
    setCandidateTestField(label, value) {
        this.candidateTest[label] = value;
        return this;
    }
    getCandidateTestDetail() {
        return this.candidateTest;
    }

    getCanvasURLToCaptureImg(videoElementNode) {
        let canvasElement = document.createElement('canvas');
        canvasElement.width = videoElementNode.videoWidth;
        canvasElement.height = videoElementNode.videoHeight;

        // Capture a frame from the video and draw it on the canvas
        const context = canvasElement.getContext('2d');
        context.drawImage(videoElementNode, 0, 0, canvasElement.width, canvasElement.height);
        return canvasElement.toDataURL();
    }
}

export default QuestionsBuilder;