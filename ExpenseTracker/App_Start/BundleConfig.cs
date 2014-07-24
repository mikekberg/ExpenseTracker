using System.Web;
using System.Web.Optimization;

namespace ExpenseTracker
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/scripts")
                .Include("~/Scripts/jquery-{version}.js")
                .Include("~/Scripts/jquery.base64.js")
                .Include("~/Scripts/bootstrap.js")
                .Include("~/Scripts/knockout-3.1.0.js")
                .Include("~/Scripts/knockout.binds.datepicker.js")
                .Include("~/Scripts/ExpenseApp.js")
                .Include("~/Scripts/ExpenseApp.ViewModels.js")
                .Include("~/Scripts/ExpenseApp.Service.js")
                .Include("~/Scripts/bootstrap-datepicker.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css",
                      "~/Content/datepicker.css"));

            // Set EnableOptimizations to false for debugging. For more information,
            // visit http://go.microsoft.com/fwlink/?LinkId=301862
            BundleTable.EnableOptimizations = false;
        }
    }
}
