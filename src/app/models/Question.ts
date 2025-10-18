export class Question {
    title: string;
    category: string;
    correct_answer_index: number;
    answers: string[];
    _id?: string;

    constructor(title: string, category: string, correct_answer_index: number, answers: string[], id?: string) 
    {
        this._id = id;
        this.title = title;
        this.category = category;
        this.correct_answer_index = correct_answer_index;
        this.answers = answers;
    }
}