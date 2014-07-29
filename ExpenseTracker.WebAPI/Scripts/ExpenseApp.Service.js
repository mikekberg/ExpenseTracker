/// <reference path="tslib/jquery.d.ts" />
/// <reference path="expenseapp.ts" />
var ExpenseApp;
(function (ExpenseApp) {
    (function (Services) {
        var IMockUser = (function () {
            function IMockUser() {
            }
            return IMockUser;
        })();
        Services.IMockUser = IMockUser;

        Services.WebAPIRootUrl = "api";

        var WebAPIAuthAppExpenseService = (function () {
            function WebAPIAuthAppExpenseService() {
                this.AuthUrl = "/auth";
            }
            WebAPIAuthAppExpenseService.prototype.Login = function (Username, Password) {
                return $.ajax({
                    url: Services.WebAPIRootUrl + this.AuthUrl + "/login?username=" + Username + "&password=" + Password,
                    type: 'POST'
                }).done(function (data) {
                    return new ExpenseApp.ExpenseAppUser(Username, Password);
                });
            };

            WebAPIAuthAppExpenseService.prototype.CreateAccount = function (Username, Password) {
                return $.ajax({
                    url: Services.WebAPIRootUrl + this.AuthUrl + "/register?username=" + Username + "&password=" + Password,
                    type: 'POST'
                }).done(function (data) {
                    return new ExpenseApp.ExpenseAppUser(Username, Password);
                });
            };
            return WebAPIAuthAppExpenseService;
        })();
        Services.WebAPIAuthAppExpenseService = WebAPIAuthAppExpenseService;

        var WebAPIExpenseAppExpenseService = (function () {
            function WebAPIExpenseAppExpenseService(user) {
                this.ExpensesUrl = "/Expenses";
                if (user) {
                    this.User = user;
                }
            }
            WebAPIExpenseAppExpenseService.prototype.SetUser = function (user) {
                this.User = user;
            };

            WebAPIExpenseAppExpenseService.prototype.GetUser = function () {
                return this.User;
            };

            WebAPIExpenseAppExpenseService.prototype.GetAll = function () {
                return $.ajax({
                    url: Services.WebAPIRootUrl + this.ExpensesUrl,
                    type: 'GET',
                    headers: { 'Authorization': 'basic ' + this.User.GetAuthKey() }
                }).then(function (data) {
                    return data.value;
                });
            };

            WebAPIExpenseAppExpenseService.prototype.AddExpense = function (expense) {
                $.ajaxSettings.headers = { 'Authorization': 'basic ' + this.User.GetAuthKey() };
                return $.ajax({
                    url: Services.WebAPIRootUrl + this.ExpensesUrl,
                    data: expense, type: 'POST',
                    headers: { 'Authorization': 'basic ' + this.User.GetAuthKey() }
                });
            };

            WebAPIExpenseAppExpenseService.prototype.UpdateExpense = function (expense) {
                return $.ajax({
                    url: Services.WebAPIRootUrl + this.ExpensesUrl + "(" + expense.Id + ")",
                    headers: { 'Authorization': 'basic ' + this.User.GetAuthKey() },
                    data: JSON.stringify(expense),
                    dataType: 'json',
                    contentType: 'application/json',
                    type: 'PATCH'
                });
            };

            WebAPIExpenseAppExpenseService.prototype.RemoveExpense = function (expenseId) {
                return $.ajax({
                    url: Services.WebAPIRootUrl + this.ExpensesUrl + "(" + expenseId + ")",
                    headers: { 'Authorization': 'basic ' + this.User.GetAuthKey() },
                    type: 'DELETE'
                });
            };
            return WebAPIExpenseAppExpenseService;
        })();
        Services.WebAPIExpenseAppExpenseService = WebAPIExpenseAppExpenseService;

        var MockExpenseAppExpenseService = (function () {
            function MockExpenseAppExpenseService() {
                this.Expenses = [
                    { Id: 1, Date: new Date(2014, 1, 12), Description: "Testing Expense 1", Amount: 123.00, Comment: "No Comment" },
                    { Id: 2, Date: new Date(2014, 4, 2), Description: "Another Expense", Amount: 3.30, Comment: "" },
                    { Id: 3, Date: new Date(2014, 6, 8), Description: "Shoes", Amount: 13.11, Comment: null },
                    { Id: 5, Date: new Date(2011, 9, 3), Description: "Food", Amount: 3.32, Comment: "Longer comment asd as ad aasdasdas das asd " },
                    { Id: 23, Date: new Date(2014, 4, 2), Description: "Other Things", Amount: 13.32, Comment: "Another Random Comment" }
                ];
            }
            MockExpenseAppExpenseService.prototype.SetUser = function (user) {
                // Uses Mock User
            };

            MockExpenseAppExpenseService.prototype.GetUser = function () {
                // Uses Mock User
                return new ExpenseApp.ExpenseAppUser("test", "Test");
            };

            MockExpenseAppExpenseService.prototype.GetAll = function () {
                var _this = this;
                var deferred = $.Deferred();
                var promise = deferred.then(function () {
                    return _this.Expenses;
                });

                deferred.resolve();

                return promise;
            };

            MockExpenseAppExpenseService.prototype.AddExpense = function (expense) {
                var _this = this;
                var deferred = $.Deferred();
                var promise = deferred.then(function () {
                    _this.Expenses.push(expense);
                });

                deferred.resolve();

                return promise;
            };

            MockExpenseAppExpenseService.prototype.RemoveExpense = function (expenseId) {
                var _this = this;
                var deferred = $.Deferred();
                var promise = deferred.then(function () {
                    var index = jQuery.inArray(expenseId, jQuery.map(_this.Expenses, function (exp) {
                        return exp.Id;
                    }));
                    _this.Expenses.splice(index, 1);
                });

                deferred.resolve();

                return promise;
            };

            MockExpenseAppExpenseService.prototype.UpdateExpense = function (expense) {
                var _this = this;
                var deferred = $.Deferred();
                var promise = deferred.then(function () {
                    var foundExpense = jQuery.grep(_this.Expenses, function (exp) {
                        return exp.Id == expense.Id;
                    });

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
            };
            return MockExpenseAppExpenseService;
        })();
        Services.MockExpenseAppExpenseService = MockExpenseAppExpenseService;

        var MockExpenseAppAuthService = (function () {
            function MockExpenseAppAuthService() {
                this.Users = [
                    { Username: "Test", Password: "Test" }
                ];
            }
            MockExpenseAppAuthService.prototype.Login = function (Username, Password) {
                var _this = this;
                var deferred = $.Deferred();
                var promise = deferred.then(function () {
                    var user = jQuery.grep(_this.Users, function (user) {
                        return user.Password == Password && user.Username == Username;
                    });
                    return user.length > 0 ? new ExpenseApp.ExpenseAppUser(user[0].Username, user[0].Password) : null;
                });

                deferred.resolve();

                return promise;
            };

            MockExpenseAppAuthService.prototype.CreateAccount = function (Username, Password) {
                var _this = this;
                var deferred = $.Deferred();
                var promise = deferred.then(function () {
                    var user = jQuery.grep(_this.Users, function (user) {
                        return user.Password == Password && user.Username == Username;
                    });
                    return user.length > 0 ? null : new ExpenseApp.ExpenseAppUser(Username, Password);
                });

                deferred.resolve();

                return promise;
            };
            return MockExpenseAppAuthService;
        })();
        Services.MockExpenseAppAuthService = MockExpenseAppAuthService;

        /* Simple Dependancy Injection */
        Services.Auth = new WebAPIAuthAppExpenseService();
        Services.Expense = new WebAPIExpenseAppExpenseService();
    })(ExpenseApp.Services || (ExpenseApp.Services = {}));
    var Services = ExpenseApp.Services;
})(ExpenseApp || (ExpenseApp = {}));
//# sourceMappingURL=ExpenseApp.Service.js.map
