export class Categories {
    categories: string[];
    id?: string;

    constructor(categories: string[], id?: string) 
    {
        this.id = id;
        this.categories = categories;
    }
}