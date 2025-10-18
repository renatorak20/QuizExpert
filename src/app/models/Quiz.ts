export class Quiz {
    title: string;
    questions: string[];
    _id?: string;

    constructor(title: string, questions: string[], id?: string) 
    {
        this.title = title;
        this.questions = questions;
        this._id = id;
    }
}