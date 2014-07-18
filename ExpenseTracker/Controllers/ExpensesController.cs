using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ExpenseTracker.Controllers.Filters;
using ExpenseTracker.Models;

namespace ExpenseTracker.Controllers
{
    [SimpleAuthorizationFilter]
    public class ExpensesController : ApiController
    {
        public IHttpActionResult GetAll()
        {
            using (var db = new ExpenseDB())
            {
                return Ok<IEnumerable<Expense>>(db.Expenses.ToArray());
            }
        }

        public IHttpActionResult Add(Expense expense)
        {
            using (var db = new ExpenseDB())
            {
                db.Expenses.Add(expense);
                db.SaveChanges();

                return Ok();
            }
        }
    }
}
