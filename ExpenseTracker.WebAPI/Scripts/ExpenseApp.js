/// <reference path="tslib/knockout.d.ts" />
/// <reference path="tslib/jquery.base64.d.ts" />
var ExpenseApp;
(function (ExpenseApp) {
    (function (ExpenseAppPage) {
        ExpenseAppPage[ExpenseAppPage["Login"] = 0] = "Login";
        ExpenseAppPage[ExpenseAppPage["CreateAccount"] = 1] = "CreateAccount";
        ExpenseAppPage[ExpenseAppPage["ExpenseList"] = 2] = "ExpenseList";
    })(ExpenseApp.ExpenseAppPage || (ExpenseApp.ExpenseAppPage = {}));
    var ExpenseAppPage = ExpenseApp.ExpenseAppPage;

    var ExpenseAppUser = (function () {
        function ExpenseAppUser(Username, Password) {
            this.Username = Username;
            this.Password = Password;
        }
        ExpenseAppUser.prototype.GetAuthKey = function () {
            return $.base64.encode(this.Username + ":" + this.Password);
        };
        return ExpenseAppUser;
    })();
    ExpenseApp.ExpenseAppUser = ExpenseAppUser;
})(ExpenseApp || (ExpenseApp = {}));
//# sourceMappingURL=ExpenseApp.js.map
