﻿using ExpenseTracker.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Mvc;
using System.Net.Http.Headers;
using System.Web.Mvc.Filters;
using System.Text;
using System.Web.Http.Filters;
using System.Threading.Tasks;
using System.Web.Http;

namespace ExpenseTracker.Controllers.Filters
{
    public class SimpleAuthorizationFilter : AuthorizationFilterAttribute
    {
        protected User CurrentUser
        {
            get { return Thread.CurrentPrincipal as User; }
            set { Thread.CurrentPrincipal = value as User; }
        }

        public override void OnAuthorization(HttpActionContext actionContext)
        {
            var authHeader = actionContext.Request.Headers.Authorization;

            if (authHeader == null)
                UnauthorizedRequest();

            Credentials parsedCredentials = ParseAuthorizationHeader(authHeader.Parameter);

            using (var db = new ExpenseDB())
            {
                User usr = db.Users.Where(x => x.Username == parsedCredentials.Username && x.Password == parsedCredentials.Password).FirstOrDefault();

                if (usr == null)
                    UnauthorizedRequest();

                this.CurrentUser = usr;
            }
        }

        protected void UnauthorizedRequest()
        {
            throw new HttpResponseException(new System.Net.Http.HttpResponseMessage(System.Net.HttpStatusCode.Unauthorized));
        }

        private Credentials ParseAuthorizationHeader(string authHeader)
        {
            string[] credentials = Encoding.ASCII.GetString(Convert.FromBase64String(authHeader)).Split(new[] { ':' });

            if (credentials.Length != 2 || string.IsNullOrEmpty(credentials[0]) || string.IsNullOrEmpty(credentials[1]))
                return null;

            return new Credentials() { Username = credentials[0], Password = credentials[1], };
        }
    }


    public class Credentials
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}