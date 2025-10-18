export class Categories {
    categories: string[];
    _id?: string;

    constructor(categories: string[], id?: string) 
    {
        this._id = id;
        this.categories = categories;
    }
}

export class Category {
    _id?: string;
    title: string;

    constructor(title: string, id?: string) {
        this.title = title;
        this._id = id;
    }
}