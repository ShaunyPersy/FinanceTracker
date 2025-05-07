export class Bar {
    amount: number;
    color: string;
    name: string;

    constructor(
        name: string = '',
        amount: number = 0,
        color: string = "#000000",
    ){
        this.amount = amount;
        this.color = color;
        this.name = name;
    }
}
