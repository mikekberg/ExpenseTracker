var ExpenseApp;
(function (ExpenseApp) {
    /// <reference path="expenseapp.service.ts" />
    /// <reference path="expenseapp.ts" />
    (function (Tests) {
        var AuthService = new ExpenseApp.Services.MockExpenseAppAuthService();
        var ExpenseService = new ExpenseApp.Services.MockExpenseAppExpenseService();
    })(ExpenseApp.Tests || (ExpenseApp.Tests = {}));
    var Tests = ExpenseApp.Tests;
})(ExpenseApp || (ExpenseApp = {}));
//# sourceMappingURL=ExpenseApp.Tests.js.map
