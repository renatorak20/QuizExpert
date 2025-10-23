export class User {
    _id?: string;
    username: string;
    password: string;
    name: string;
    email: string;
    userId?: string;
    isAdmin?: boolean;
    quizesPlayed: number;
    points: number;
    id?: string;
    avatar?: string;

    constructor(username: string, password: string, name: string, email: string, quizesPlayed: number = 0, points: number = 0, userId?: string, isAdmin?: boolean, id?: string) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.id = id;
        this.email = email;
        this.userId = userId;
        this.isAdmin = isAdmin;
        this.quizesPlayed = quizesPlayed;
        this.points = points;
    }
}