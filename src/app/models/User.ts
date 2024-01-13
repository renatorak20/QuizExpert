export class User {
    username: string;
    password: string;
    name: string;
    email: string;
    userId?: string;
    isAdmin?: boolean;
    quizesPlayed: number;
    points: number;
    quizHistoryTitle?: string[];

    constructor(username: string, password: string, name: string, email: string, quizesPlayed: number = 0, points: number = 0, userId?: string, isAdmin?: boolean, quizHistoryTitle?: string[]) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.email = email;
        this.userId = userId;
        this.isAdmin = isAdmin;
        this.quizesPlayed = quizesPlayed;
        this.points = points;
        this.quizHistoryTitle = quizHistoryTitle;
    }
}