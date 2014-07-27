/// <reference path="tslib/knockout.d.ts" />
/// <reference path="tslib/jquery.base64.d.ts" />

module ExpenseApp {
    export enum ExpenseAppPage {
        Login,
        CreateAccount,
        ExpenseList
    }

    export class ExpenseAppUser {
        constructor(public Username: string, public Password: string) { }

        public GetAuthKey() {
            return $.base64.encode(this.Username + ":" + this.Password);
        }
    }

    export interface IExpense {
        Id: number;
        Date: Date;
        Description: string;
        Amount: number;
        Comment: string;
    }
} 