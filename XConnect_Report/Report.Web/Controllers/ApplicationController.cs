
using Report.Web.ActionFilter;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
namespace Report.Web.Controllers
{
    [SessionTimeout]
    public class ApplicationController : Controller
    {
        //
        // GET: /ApplicationController/
        private const string LogOnSession = "_userSession_Report";
        private const string ErrorController = "Error";
        private const string LogOnController = "Login";
        private const string LogOnAction = "Login";


        protected override void Initialize(RequestContext requestContext)
        {
            base.Initialize(requestContext);


            /*important to check both, because logOnController should be access able with out any session*/
            if (!IsNonSessionController(requestContext) && !HasSession())
            {
                Redirect(requestContext, Url.Action(LogOnAction, LogOnController));
            }

        }


        private bool IsNonSessionController(RequestContext requestContext)
        {
            var currentController = requestContext.RouteData.Values["controller"].ToString().ToLower();
            var nonSessionedController = new List<string>() { ErrorController.ToLower(), LogOnController.ToLower() };
            return nonSessionedController.Contains(currentController);
        }

        private void Redirect(RequestContext requestContext, string action)
        {
            requestContext.HttpContext.Response.Clear();
            requestContext.HttpContext.Response.Redirect(action);
            requestContext.HttpContext.Response.End();
        }

        protected bool HasSession()
        {
            return Session[LogOnSession] != null;
        }

        protected override JsonResult Json(object data, string contentType,
           Encoding contentEncoding, JsonRequestBehavior behavior)
        {
            return new JsonResult()
            {
                Data = data,
                ContentType = contentType,
                ContentEncoding = contentEncoding,
                JsonRequestBehavior = behavior,
                MaxJsonLength = int.MaxValue
            };
        }
    }
}