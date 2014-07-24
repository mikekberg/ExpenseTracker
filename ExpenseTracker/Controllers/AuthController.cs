using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using ExpenseTracker.Models;
using System.Security.Claims;
using System.Web.Security;

namespace ExpenseTracker.Controllers
{
    public class AuthController : ApiController
    {
        [Route("api/auth/login")]
        public IHttpActionResult IsRegistered(string username, string password)
        {
            using (ExpenseDB db = new ExpenseDB())
            {
                if (db.Users.Where(x => x.Username == username && x.Password == password).Any())
                {
                    return Ok();
                }
            }

            return NotFound();
        }

        [Route("api/auth/register")]
        public IHttpActionResult RegisterUser(string username, string password)
        {
            using (ExpenseDB db = new ExpenseDB())
            {
                if (db.Users.Where(x => x.Username == username).Any()) 
                    return ResponseMessage(Request.CreateResponse<string>(HttpStatusCode.Conflict, "User already exists"));

                var user = new User()
                {
                    Username = username,
                    Password = password
                };

                db.Users.Add(user);
                db.SaveChanges();

                return this.Ok();
            }
        }
    }
}
