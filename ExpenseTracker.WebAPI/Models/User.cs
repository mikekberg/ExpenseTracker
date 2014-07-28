using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

namespace ExpenseTracker.Models
{
    [DataContract(IsReference = true)]
    public class User : IPrincipal
    {
        [DataMember]
        public int Id { get; set; }

        [DataMember]
        [MaxLength(100)]
        [Index(IsUnique=true)]
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