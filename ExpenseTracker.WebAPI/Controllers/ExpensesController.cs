using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ExpenseTracker.Controllers.Filters;
using ExpenseTracker.Models;
using System.Threading;
using System.Web.OData;
using System.Threading.Tasks;
using System.Web.Http.Cors;

namespace ExpenseTracker.Controllers
{
    [EnableCors("*", "*", "GET,POST,PATCH,DELETE,OPTIONS")]
    [SimpleAuthorizationFilter]
    public class ExpensesController : ODataController
    {
        ExpenseDB db = new ExpenseDB();

        protected User CurrentUser
        {
            get { return Thread.CurrentPrincipal as User; }
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }

        [EnableQuery]
        public IQueryable<Expense> Get()
        {
            int userID = this.CurrentUser.Id;
            return db.Expenses.Where(x => x.User.Id == userID);
        }

        public async Task<IHttpActionResult> Post(Expense expense)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Users.Attach(this.CurrentUser);
            expense.User = this.CurrentUser;
            db.Expenses.Add(expense);

            await db.SaveChangesAsync();

            return Created(expense);
        }

        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<Expense> expense)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var entity = await db.Expenses.FindAsync(key);

            if (entity == null)
            {
                return NotFound();
            }

            expense.Patch(entity);
            await db.SaveChangesAsync();


            return Updated(entity);
        }

        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            var expense = await db.Expenses.FindAsync(key);
            if (expense == null)
            {
                return NotFound();
            }

            db.Expenses.Remove(expense);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
