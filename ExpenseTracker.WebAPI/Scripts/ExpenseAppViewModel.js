/// <reference path="tslib/knockout.d.ts" />
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
        return ExpenseAppUser;
    })();
    ExpenseApp.ExpenseAppUser = ExpenseAppUser;

    var ExpenseAppViewModel = (function () {
        function ExpenseAppViewModel() {
            this.LoginVM = new LoginViewModel();
            this.CreateAccountVM = new CreateAccountViewModel();

            this.CurrentPage = ko.observable(0 /* Login */);
        }
        ExpenseAppViewModel.prototype.OnPage = function (page) {
            return this.CurrentPage() == page;
        };
        return ExpenseAppViewModel;
    })();
    ExpenseApp.ExpenseAppViewModel = ExpenseAppViewModel;

    var CreateAccountViewModel = (function () {
        function CreateAccountViewModel() {
            this.Username = ko.observable("");
            this.Password = ko.observable("");
            this.ConfirmPassword = ko.observable("");
        }
        return CreateAccountViewModel;
    })();
    ExpenseApp.CreateAccountViewModel = CreateAccountViewModel;

    var LoginViewModel = (function () {
        function LoginViewModel() {
            this.Username = ko.observable("");
            this.Password = ko.observable("");
        }
        return LoginViewModel;
    })();
    ExpenseApp.LoginViewModel = LoginViewModel;
})(ExpenseApp || (ExpenseApp = {}));
//# sourceMappingURL=ExpenseAppViewModel.js.map
