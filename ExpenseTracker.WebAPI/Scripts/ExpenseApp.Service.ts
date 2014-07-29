﻿/// <reference path="tslib/jquery.d.ts" />
/// <reference path="expenseapp.ts" />

module ExpenseApp.Services {
    export interface IExpenseAppAuthService {
        Login(Username: string, Password: string): JQueryPromise<ExpenseAppUser>;
        CreateAccount(Username: string, Password: string): JQueryPromise<ExpenseAppUser>;
    }

    export interface IExpenseAppExpenseService {
        SetUser(user: ExpenseAppUser);
        GetUser(): ExpenseAppUser;
        GetAll(): JQueryPromise<IExpense[]>;
        AddExpense(expense: IExpense): JQueryPromise<void>;
        UpdateExpense(expense: IExpense): JQueryPromise<void>;
        RemoveExpense(expense: number): JQueryPromise<void>;
    }

    export class IMockUser {
        Username: string;
        Password: string;
    }

    export var WebAPIRootUrl = "api";

    export class WebAPIAuthAppExpenseService implements IExpenseAppAuthService {
        public AuthUrl = "/auth";


        public Login(Username: string, Password: string) {
            return $.ajax({
                url: Services.WebAPIRootUrl + this.AuthUrl + "/login?username=" + Username + "&password=" + Password,
                type: 'POST'
            }).done(function (data) {
                return new ExpenseAppUser(Username, Password);
            });
        }

        public CreateAccount(Username: string, Password: string) {
            return $.ajax({
                url: Services.WebAPIRootUrl + this.AuthUrl + "/register?username=" + Username + "&password=" + Password,
                type: 'POST'
            }).done(function (data) {
                return new ExpenseAppUser(Username, Password);
            });
        }
    }

    export class WebAPIExpenseAppExpenseService implements IExpenseAppExpenseService {
        public ExpensesUrl = "/Expenses";
        public User: ExpenseAppUser;

        constructor(user?: ExpenseAppUser) {
            if (user) {
                this.User = user;
            }
        }

        public SetUser(user: ExpenseAppUser) {
            this.User = user;
        }

        public GetUser() {
            return this.User;
        }

        public GetAll() {
            return $.ajax({
                url: Services.WebAPIRootUrl + this.ExpensesUrl,
                type: 'GET',
                headers: { 'Authorization': 'basic ' + this.User.GetAuthKey() }
            }).then(function (data) { return data.value; });
        }

        public AddExpense(expense: IExpense) {
            $.ajaxSettings.headers = { 'Authorization': 'basic ' + this.User.GetAuthKey() };
            return $.ajax({
                url: Services.WebAPIRootUrl + this.ExpensesUrl,
                data: expense, type: 'POST',
                headers: { 'Authorization': 'basic ' + this.User.GetAuthKey() }
            });
        }

        public UpdateExpense(expense: IExpense) {
            return $.ajax({
                url: Services.WebAPIRootUrl + this.ExpensesUrl + "(" + expense.Id + ")",
                headers: { 'Authorization': 'basic ' + this.User.GetAuthKey() },
                data: JSON.stringify(expense),
                dataType: 'json',
                contentType: 'application/json',
                type: 'PATCH'
            });
        }

        public RemoveExpense(expenseId: number) {
            return $.ajax({
                url: Services.WebAPIRootUrl + this.ExpensesUrl + "(" + expenseId + ")",
                headers: { 'Authorization': 'basic ' + this.User.GetAuthKey() },
                type: 'DELETE'
            });
        }
    }

    export class MockExpenseAppExpenseService implements IExpenseAppExpenseService {
        public Expenses: IExpense[];

        constructor() {
            this.Expenses = [
                { Id: 1, Date: new Date(2014, 1, 12), Description: "Testing Expense 1", Amount: 123.00, Comment: "No Comment" },
                { Id: 2, Date: new Date(2014, 4, 2), Description: "Another Expense", Amount: 3.30, Comment: "" },
                { Id: 3, Date: new Date(2014, 6, 8), Description: "Shoes", Amount: 13.11, Comment: null },
                { Id: 5, Date: new Date(2011, 9, 3), Description: "Food", Amount: 3.32, Comment: "Longer comment asd as ad aasdasdas das asd " },
                { Id: 23, Date: new Date(2014, 4, 2), Description: "Other Things", Amount: 13.32, Comment: "Another Random Comment" }
            ];
        }

        public SetUser(user: ExpenseAppUser) {
            // Uses Mock User
        }

        public GetUser() {
            // Uses Mock User
            return new ExpenseAppUser("test", "Test");
        }

        public GetAll() {
            var deferred = $.Deferred<IExpense[]>();
            var promise = deferred.then(() => {
                return this.Expenses;
            });

            deferred.resolve();

            return promise;
        }

        public AddExpense(expense: IExpense) {
            var deferred = $.Deferred<IExpense[]>();
            var promise = deferred.then(() => {
                this.Expenses.push(expense);
            });

            deferred.resolve();

            return promise;
        }

        public RemoveExpense(expenseId: number) {
            var deferred = $.Deferred<IExpense[]>();
            var promise = deferred.then(() => {
                var index = jQuery.inArray(expenseId, jQuery.map(this.Expenses, exp => exp.Id));
                this.Expenses.splice(index, 1);
            });

            deferred.resolve();

            return promise;
        }

        public UpdateExpense(expense: IExpense) {
            var deferred = $.Deferred<IExpense[]>();
            var promise = deferred.then(() => {
                var foundExpense = jQuery.grep(this.Expenses, exp => exp.Id == expense.Id);

                if (foundExpense.length > 0) {
                    var updateExp = foundExpense[0];

                    updateExp.Amount = expense.Amount;
                    updateExp.Comment = expense.Comment;
                    updateExp.Date = expense.Date;
                    updateExp.Description = expense.Description;
                }
            });

            deferred.resolve();

            return promise;
        }
    }

    export class MockExpenseAppAuthService implements IExpenseAppAuthService {
        public Users: IMockUser[];

        constructor() {
            this.Users = [
                { Username: "Test", Password: "Test" }
            ];
        }

        public Login(Username: string, Password: string) {
            var deferred = $.Deferred<ExpenseAppUser>();
            var promise = deferred.then(() => {
                var user = jQuery.grep(this.Users, user => user.Password == Password && user.Username == Username);
                return user.length > 0 ? new ExpenseAppUser(user[0].Username, user[0].Password) : null;
            });

            deferred.resolve();
            
            return promise;
        }

        public CreateAccount(Username: string, Password: string) {
            var deferred = $.Deferred<ExpenseAppUser>();
            var promise = deferred.then(() => {
                var user = jQuery.grep(this.Users, user => user.Password == Password && user.Username == Username);
                return user.length > 0 ? null : new ExpenseAppUser(Username, Password);
            });

            deferred.resolve();

            return promise;
        }
    }





    /* Simple Dependancy Injection */
    export var Auth: IExpenseAppAuthService = new WebAPIAuthAppExpenseService();
    export var Expense: IExpenseAppExpenseService = new WebAPIExpenseAppExpenseService();
} 