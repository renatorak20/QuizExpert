export class Categories {
    categories: string[];
    id?: string;

    constructor(categories: string[], id?: string) 
    {
        this.id = id;
        this.categories = categories;
    }
}

export class Category {
    id?: string;
    title: string;

    constructor(title: string, id?: string) {
        this.title = title;
        this.id = id;
    }
}