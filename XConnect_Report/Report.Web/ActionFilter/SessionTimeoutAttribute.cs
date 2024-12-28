
using Report.BLL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Report.Web.ActionFilter
{
    public class SessionTimeoutAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {

            if (SessionContext.Current.AISession.SessionId == null)
            {
                 filterContext.Result = new RedirectResult("~/Login/Login");             
                return;
            }

            base.OnActionExecuting(filterContext);
        }
    

    }
}