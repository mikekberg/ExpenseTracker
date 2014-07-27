using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ExpenseTracker.Controllers.Filters;
using ExpenseTracker.Models;
using System.Threading;
using System.Globalization;

namespace ExpenseTracker.Controllers
{
    [SimpleAuthorizationFilter]
    public class ExpensesController : ApiController
    {
        protected User CurrentUser
        {
            get { return Thread.CurrentPrincipal as User; }
        }

        [Route("api/expenses/getall")]
        public IHttpActionResult GetAll()
        {
            using (var db = new ExpenseDB())
            {
                db.Users.Attach(this.CurrentUser);

                return Ok<IEnumerable<Expense>>(this.CurrentUser.Expenses.ToArray());
            }
        }

        [Route("api/expenses/add")]
        public IHttpActionResult Add(Expense expense)
        {
            using (var db = new ExpenseDB())
            {
                db.Users.Attach(this.CurrentUser);
                expense.User = this.CurrentUser;

                db.Expenses.Add(expense);
                db.SaveChanges();

                return Ok();
            }
        }

        [Route("api/expenses/expensesbyweek")]
        public IHttpActionResult GetExpensesByWeek()
        {
            using (var db = new ExpenseDB())
            {
                db.Users.Attach(this.CurrentUser);
                return Ok(this.CurrentUser.Expenses.GroupBy(d => CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(d.Date, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Saturday))
                    .Select(w => new { Week = w.Key, Total = w.Sum(x => x.Amount), Expenses = w, Average = Math.Round(w.Average(x => x.Amount), 2) }).ToArray());
            }
        }

        [Route("api/expenses/update")]
        public IHttpActionResult Update([FromBody]Expense expense) {
            using (var db = new ExpenseDB()) {
                Expense dbExpense = db.Expenses.Where(x => x.Id == expense.Id).First();

                if (dbExpense.User.Id != CurrentUser.Id)
                    return ResponseMessage(Request.CreateResponse<string>(HttpStatusCode.Unauthorized, "You do not own this expense"));

                dbExpense.Amount = expense.Amount;
                dbExpense.Comment = expense.Comment;
                dbExpense.Date = expense.Date;
                dbExpense.Description = expense.Description;

                db.SaveChanges();
            }

            return Ok();
        }

        
        [Route("api/expenses/delete")]
        [HttpGet]
        public IHttpActionResult Delete(int expenseId)
        {
            using (var db = new ExpenseDB())
            {
                Expense dbExpense = db.Expenses.Where(x => x.Id == expenseId).First();

                if (dbExpense.User.Id != CurrentUser.Id)
                    return ResponseMessage(Request.CreateResponse<string>(HttpStatusCode.Unauthorized, "You do not own this expense"));

                db.Expenses.Remove(dbExpense);

                db.SaveChanges();
            }

            return Ok();
        }
    }
}
