export class User {
    username: string;
    password: string;
    name: string;
    email: string;
    userId?: string;
    isAdmin?: boolean;
    quizesPlayed: number;
    points: number;

    constructor(username: string, password: string, name: string, email: string, quizesPlayed: number = 0, points: number = 0, userId?: string, isAdmin?: boolean) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.email = email;
        this.userId = userId;
        this.isAdmin = isAdmin;
        this.quizesPlayed = quizesPlayed;
        this.points = points;
    }
}