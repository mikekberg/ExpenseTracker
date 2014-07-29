/// <reference path="expenseapp.ts" />
/// <reference path="tslib/knockout.d.ts" />
/// <reference path="tslib/bootstrap.d.ts" />
/// <reference path="expenseapp.service.ts" />
var ExpenseApp;
(function (ExpenseApp) {
    (function (ViewModels) {
        var ExpenseAppViewModel = (function () {
            function ExpenseAppViewModel() {
                this.LoginVM = new LoginViewModel(this.UserAuthenticated.bind(this));
                this.CreateAccountVM = new CreateAccountViewModel(this.UserAuthenticated.bind(this));
                this.ExpensesVM = new ExpenseListingViewModel();

                this.CurrentPage = ko.observable(0 /* Login */);
            }
            ExpenseAppViewModel.prototype.UserAuthenticated = function (user) {
                ExpenseApp.Services.Expense.SetUser(user);
                this.ExpensesVM.IsAuthed(true);
                this.CurrentPage(2 /* ExpenseList */);
            };

            ExpenseAppViewModel.prototype.OnPage = function (page) {
                return this.CurrentPage() == page;
            };

            ExpenseAppViewModel.prototype.CreateAccountClicked = function () {
                this.CurrentPage(1 /* CreateAccount */);
            };

            ExpenseAppViewModel.prototype.CancelAccountClicked = function () {
                this.CurrentPage(0 /* Login */);
            };
            return ExpenseAppViewModel;
        })();
        ViewModels.ExpenseAppViewModel = ExpenseAppViewModel;

        (function (MessageTypes) {
            MessageTypes[MessageTypes["Warning"] = 0] = "Warning";
            MessageTypes[MessageTypes["Info"] = 1] = "Info";
            MessageTypes[MessageTypes["Success"] = 2] = "Success";
        })(ViewModels.MessageTypes || (ViewModels.MessageTypes = {}));
        var MessageTypes = ViewModels.MessageTypes;

        var ExpenseViewModel = (function () {
            function ExpenseViewModel(Id, Date, Description, Amount, Comment) {
                var _this = this;
                this.Id = Id;
                this.Date = ko.observable(Date);
                this.Description = ko.observable(Description);
                this.Amount = ko.observable(Amount);
                this.Comment = ko.observable(Comment);

                this.FormattedDate = ko.computed(function () {
                    return (_this.Date().getMonth() + 1) + '/' + _this.Date().getDate() + '/' + _this.Date().getFullYear();
                });
                this.FormattedAmount = ko.computed(function () {
                    return "$" + Number(_this.Amount()).toFixed(2);
                });
            }
            ExpenseViewModel.prototype.ToJSON = function () {
                var js = ko.toJS(this);
                js.Date = js.Date.toJSON();

                delete js['FormattedDate'];
                delete js['FormattedAmount'];
                delete js['ToJSON'];

                return js;
            };
            return ExpenseViewModel;
        })();
        ViewModels.ExpenseViewModel = ExpenseViewModel;

        var ExpenseListingViewModel = (function () {
            function ExpenseListingViewModel() {
                var _this = this;
                this.EditCreateExpenseVM = ko.observable(new ExpenseViewModel(-1, new Date(), "", 0, ""));
                this.Expenses = ko.observableArray();
                this.Loading = ko.observable(true);
                this.FilteredExpenses = ko.computed(this.ComputeFilteredExpenses.bind(this));
                this.FilterString = ko.observable("");
                this.IsAuthed = ko.observable(false);

                this.IsAuthed.subscribe(function (value) {
                    if (value) {
                        ExpenseApp.Services.Expense.GetAll().done(function (expenses) {
                            ko.utils.arrayPushAll(_this.Expenses, $.map(expenses, function (exp) {
                                return new ExpenseViewModel(exp.Id, new Date(Date.parse(exp.Date)), exp.Description, exp.Amount, exp.Comment);
                            }));
                            _this.Loading = ko.observable(false);
                        });
                    }
                });
            }
            ExpenseListingViewModel.prototype.ComputeFilteredExpenses = function () {
                var _this = this;
                return this.Expenses().filter(function (expense, index, arr) {
                    return _this.FilterString().length == 0 || expense.Amount().toString().indexOf(_this.FilterString()) > -1 || expense.Comment().indexOf(_this.FilterString()) > -1 || expense.FormattedDate().indexOf(_this.FilterString()) > -1 || expense.Description().indexOf(_this.FilterString()) > -1;
                });
            };

            ExpenseListingViewModel.prototype.RemoveExpense = function (expense) {
                ExpenseApp.Services.Expense.RemoveExpense(expense.Id).done(this.Expenses.remove.bind(this.Expenses, expense));
            };

            ExpenseListingViewModel.prototype.EditExpense = function (expense) {
                this.EditCreateExpenseVM(new ExpenseViewModel(expense.Id, expense.Date(), expense.Description(), expense.Amount(), expense.Comment()));
                $("#EditExpenseDialog").modal();
            };

            ExpenseListingViewModel.prototype.AddNewExpense = function () {
                this.EditCreateExpenseVM(new ExpenseViewModel(-1, new Date(), "", 0, ""));
                $("#EditExpenseDialog").modal();
            };

            ExpenseListingViewModel.prototype.SaveNewExpense = function (expense) {
                var _this = this;
                ExpenseApp.Services.Expense.AddExpense(expense.ToJSON()).done(function () {
                    _this.Expenses.push(_this.EditCreateExpenseVM());
                    _this.EditCreateExpenseVM(new ExpenseViewModel(-1, new Date(), "", 0, ""));
                    _this.FilteredExpenses.notifySubscribers();
                });
                $("#EditExpenseDialog").modal("hide");
            };

            ExpenseListingViewModel.prototype.UpdateExpense = function (expense) {
                var editedViewMode = jQuery.grep(this.Expenses(), function (exp) {
                    return exp.Id == expense.Id;
                })[0];

                editedViewMode.Amount(expense.Amount());
                editedViewMode.Comment(expense.Comment());
                editedViewMode.Date(expense.Date());
                editedViewMode.Description(expense.Description());

                ExpenseApp.Services.Expense.UpdateExpense(editedViewMode.ToJSON());

                $("#EditExpenseDialog").modal("hide");
            };

            ExpenseListingViewModel.prototype.CancelNewExpense = function () {
                $("#EditExpenseDialog").modal("hide");
            };
            return ExpenseListingViewModel;
        })();
        ViewModels.ExpenseListingViewModel = ExpenseListingViewModel;

        var CreateAccountViewModel = (function () {
            function CreateAccountViewModel(onUserCreated) {
                this.Username = ko.observable("");
                this.Password = ko.observable("");
                this.ConfirmPassword = ko.observable("");
                this.CreationError = ko.observable(null);
                this.OnUserCreated = onUserCreated;
            }
            CreateAccountViewModel.prototype.CreateAccountClicked = function () {
                var _this = this;
                if (this.Username().length == 0) {
                    this.CreationError("No Username given");
                    return;
                }
                if (this.Password().length == 0) {
                    this.CreationError("No Password given");
                    return;
                }
                if (this.Password() != this.ConfirmPassword()) {
                    this.CreationError("Passwords do not match");
                    return;
                }

                ExpenseApp.Services.Auth.CreateAccount(this.Username(), this.Password()).always(function (result) {
                    if (result == null) {
                        _this.CreationError("User already Exists");
                    } else {
                        _this.CreationError(null);
                        _this.OnUserCreated(result);
                    }
                });
            };
            return CreateAccountViewModel;
        })();
        ViewModels.CreateAccountViewModel = CreateAccountViewModel;

        var LoginViewModel = (function () {
            function LoginViewModel(onLogin) {
                this.Username = ko.observable("");
                this.Password = ko.observable("");
                this.LoginError = ko.observable(null);
                this.OnLogin = onLogin;
            }
            LoginViewModel.prototype.LoginClicked = function () {
                var _this = this;
                ExpenseApp.Services.Auth.Login(this.Username(), this.Password()).done(function (result) {
                    _this.LoginError(null);
                    _this.OnLogin(new ExpenseApp.ExpenseAppUser(_this.Username(), _this.Password()));
                }).fail(function (result) {
                    _this.LoginError("Incorrect User/Pass");
                });
            };
            return LoginViewModel;
        })();
        ViewModels.LoginViewModel = LoginViewModel;
    })(ExpenseApp.ViewModels || (ExpenseApp.ViewModels = {}));
    var ViewModels = ExpenseApp.ViewModels;
})(ExpenseApp || (ExpenseApp = {}));
//# sourceMappingURL=ExpenseApp.ViewModels.js.map
