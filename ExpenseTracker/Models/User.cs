using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ExpenseTracker.Models
{
    public class User : IPrincipal
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }

        public virtual ICollection<Expense> Expenses { get; set; }

        public IIdentity Identity
        {
            get { return new GenericIdentity(Username); }
        }

        public bool IsInRole(string role)
        {
            return true;
        }
    }
}