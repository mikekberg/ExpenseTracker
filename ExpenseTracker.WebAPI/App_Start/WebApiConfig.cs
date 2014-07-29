using ExpenseTracker.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.OData.Builder;
using System.Web.OData.Extensions;

namespace ExpenseTracker
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // Web API routes
            ODataModelBuilder builder = new ODataConventionModelBuilder();

            builder.EntitySet<Expense>("Expenses");

            
            config.MapODataServiceRoute(
                routeName: "ODataRoute",
                routePrefix: "api/",
                model: builder.GetEdmModel());

            config.MapHttpAttributeRoutes();
        }
    }
}
