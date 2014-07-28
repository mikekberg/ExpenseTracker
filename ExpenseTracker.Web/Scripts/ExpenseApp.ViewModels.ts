/// <reference path="expenseapp.ts" />
/// <reference path="tslib/knockout.d.ts" />
/// <reference path="tslib/bootstrap.d.ts" />
/// <reference path="expenseapp.service.ts" />

module ExpenseApp.ViewModels {
    export class ExpenseAppViewModel {
        public User: ExpenseAppUser;
        public CurrentPage: KnockoutObservable<ExpenseAppPage>;
        public LoginVM: LoginViewModel;
        public CreateAccountVM: CreateAccountViewModel;
        public ExpensesVM: ExpenseListingViewModel;

        constructor() {
            this.LoginVM = new LoginViewModel(this.UserAuthenticated.bind(this));
            this.CreateAccountVM = new CreateAccountViewModel(this.UserAuthenticated.bind(this));
            this.ExpensesVM = new ExpenseListingViewModel();

            this.CurrentPage = ko.observable(ExpenseAppPage.ExpenseList);
        }

        public UserAuthenticated(user: ExpenseAppUser) {
            this.CurrentPage(ExpenseAppPage.ExpenseList);
        }


        public OnPage(page: ExpenseAppPage) {
            return this.CurrentPage() == page;
        }

        public CreateAccountClicked() {
            this.CurrentPage(ExpenseAppPage.CreateAccount);
        }

        public CancelAccountClicked() {
            this.CurrentPage(ExpenseAppPage.Login);
        }
    }

    export enum MessageTypes {
        Warning,
        Info,
        Success
    }

    export class ExpenseViewModel {
        public Id: number;
        public Date: KnockoutObservable<Date>;
        public Description: KnockoutObservable<string>;
        public Amount: KnockoutObservable<number>;
        public Comment: KnockoutObservable<string>;
        public FormattedDate: KnockoutComputed<string>;
        public FormattedAmount: KnockoutComputed<string>;

        constructor(Id: number, Date: Date, Description: string, Amount: number, Comment: string) {
            this.Id = Id;
            this.Date = ko.observable(Date);
            this.Description = ko.observable(Description);
            this.Amount = ko.observable(Amount);
            this.Comment = ko.observable(Comment);

            this.FormattedDate = ko.computed(() => (this.Date().getMonth() + 1) + '/' + this.Date().getDate() + '/' + this.Date().getFullYear());
            this.FormattedAmount = ko.computed(() => "$" + Number(this.Amount()).toFixed(2));
        }

        public ToJSON() {
            var js = ko.toJS(this);
            js.Date = js.Date.toJSON();

            delete js['FormattedDate'];
            delete js['FormattedAmount'];
            delete js['ToJSON'];

            return js;
        }
    }

    export class ExpenseListingViewModel {
        public Expenses: KnockoutObservableArray<ExpenseViewModel>;
        public TopMessage: KnockoutObservable<string>;
        public TopMessageType: KnockoutObservable<string>;
        public Loading: KnockoutObservable<boolean>;
        public EditCreateExpenseVM: KnockoutObservable<ExpenseViewModel>;

        constructor() {
            this.EditCreateExpenseVM = ko.observable(new ExpenseViewModel(-1, new Date(), "", 0, ""));
            this.Expenses = ko.observableArray<ExpenseViewModel>();
            this.Loading = ko.observable(true);

            /* Get Expenses From the Service */
            Services.Expense.GetAll().done(expenses => {
                ko.utils.arrayPushAll(this.Expenses, $.map(expenses, exp => new ExpenseViewModel(exp.Id, new Date(Date.parse(exp.Date)), exp.Description, exp.Amount, exp.Comment))); 
                this.Loading = ko.observable(false);
            });
        }

        public RemoveExpense(expense: ExpenseViewModel) {
            Services.Expense.RemoveExpense(expense.Id).done(this.Expenses.remove.bind(this.Expenses, expense));
        }

        public EditExpense(expense: ExpenseViewModel) {
            this.EditCreateExpenseVM(new ExpenseViewModel(expense.Id, expense.Date(), expense.Description(), expense.Amount(), expense.Comment()));
            $("#EditExpenseDialog").modal();
        }

        public AddNewExpense() {
            this.EditCreateExpenseVM(new ExpenseViewModel(-1, new Date(), "", 0, ""));
            $("#EditExpenseDialog").modal();
        }

        public SaveNewExpense(expense: ExpenseViewModel) {
            Services.Expense.AddExpense(expense.ToJSON()).done(() => this.Expenses.push(expense));
            $("#EditExpenseDialog").modal("hide");
        }

        public UpdateExpense(expense: ExpenseViewModel) {
            var editedViewMode = jQuery.grep(this.Expenses(), exp => exp.Id == expense.Id)[0];

            editedViewMode.Amount(expense.Amount());
            editedViewMode.Comment(expense.Comment());
            editedViewMode.Date(expense.Date());
            editedViewMode.Description(expense.Description());

            Services.Expense.UpdateExpense(editedViewMode.ToJSON());

            $("#EditExpenseDialog").modal("hide");
        }

        public CancelNewExpense() {
            $("#EditExpenseDialog").modal("hide");
        }
    }

    export class CreateAccountViewModel {
        public Username: KnockoutObservable<string>;
        public Password: KnockoutObservable<string>;
        public ConfirmPassword: KnockoutObservable<string>;
        public CreationError: KnockoutObservable<string>;
        public OnUserCreated: (ExpenseAppUser) => void;

        constructor(onUserCreated: (ExpenseAppUser) => void) {
            this.Username = ko.observable("");
            this.Password = ko.observable("");
            this.ConfirmPassword = ko.observable("");
            this.CreationError = ko.observable(null);
            this.OnUserCreated = onUserCreated;
        }

        public CreateAccountClicked() {
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


            Services.Auth.CreateAccount(this.Username(), this.Password()).always((result) => {
                if (result == null) {
                    this.CreationError("User already Exists");
                } else {
                    this.CreationError(null);
                    this.OnUserCreated(result);
                }
            });
        }
    }

    export class LoginViewModel {
        public Username: KnockoutObservable<string>;
        public Password: KnockoutObservable<string>;
        public LoginError: KnockoutObservable<string>;
        public OnLogin: (ExpenseAppUser) => void;

        constructor(onLogin: (ExpenseAppUser) => void) {
            this.Username = ko.observable("");
            this.Password = ko.observable("");
            this.LoginError = ko.observable(null);
            this.OnLogin = onLogin;
        }

        public LoginClicked() {
            Services.Auth.Login(this.Username(), this.Password()).always((result) => {
                if (result == null) {
                    this.LoginError("User not found");
                } else {
                    this.LoginError(null);
                    this.OnLogin(result);
                }
            });
        }
    }
} 