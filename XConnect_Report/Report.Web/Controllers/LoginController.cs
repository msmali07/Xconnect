using Report.BLL;
using Report.DAL;
using Report.DO;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using System.Xml;


namespace Report.Web.Controllers
{
    public class LoginController : Controller
    {
        string NewsessionId = string.Empty;
        public ActionResult Login(int Code=0)
        {
            if(Code == 1)
            {
                TempData["Error"] = "1";
            }
            else
            {
                TempData["Error"] = "";
            }
           
            return View();
        }
        [HttpPost]
        public ActionResult Login(LoginDO objlogin)
        {

            string HostUrl = string.Empty;
            string _sessionId = string.Empty;
            string Url = Request.ServerVariables["SERVER_NAME"];
            try
            {
                HostUrl = Request.Url.Host;

            }
            catch
            { }
            XmlDocument xdoc = new XmlDocument();
            xdoc.Load(Server.MapPath("~/App_Data/Setting.xml"));
            int[] obj = new LoginBLL().GetApplicableUrl(xdoc, HostUrl);
            int CompCode = obj[0];
            int AppURL = obj[1];
            if (objlogin.Username.Length > 0 && objlogin.Password.Length > 0)
            {
                AISessionDO SessionDO = new AuthenticationModule().Authenticate(objlogin.Username, objlogin.Password, IpAddress(), AppURL, CompCode, NewsessionId, 1);
                if (SessionDO.Connected)
                {
                    FormsAuthentication.RedirectFromLoginPage(objlogin.Username, true);

                    string sessionId = Session["LogSessionId_Report"].ToString();
                    return RedirectToAction("Home", "Home", new { Identity = sessionId });
                }
            }

            return View(objlogin);
        }

        public string IpAddress()
        {
            string strIp;
            strIp = Request.ServerVariables["HTTPXFORWARDEDFOR"];
            if (strIp == null)
            {
                strIp = Request.ServerVariables["REMOTEADDR"];
            }
            if (strIp == string.Empty || strIp == null)
            {
                strIp = Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
            }
            if (strIp == string.Empty || strIp == null)
            {
                strIp = Request.ServerVariables["REMOTE_ADDR"];
            }
            if (strIp == string.Empty || strIp == null)
            {
                strIp = Request.ServerVariables["REMOTE_HOST"];
            }

            return strIp.Trim();
        }
        
        public ActionResult RedirectHome(string key, string Identity)
        {
            TempData["Error"] = "";
            string sessionId = string.Empty;
            try
            {                
                string URLData = Request.Url.AbsoluteUri.ToString().Split(new string[] { Request.RequestContext.RouteData.Values["key"] + "?" }, StringSplitOptions.None)[1];
                if (URLData.Split('&')[0].Split('=')[0] == "key")
                {
                    key = URLData.Split('&')[0].Split('=')[1];

                    string[] URLdetailsTemp = (URLData.Split(new string[] { "key=" }, StringSplitOptions.None).ToArray());
                    key = (URLdetailsTemp[1]).ToString().Split('&')[0];
                }

                string decrypteduserid = EncryptDecrypt.DecryptString(key, Convert.ToString(Identity));

                decrypteduserid = decrypteduserid.Replace("/images", "images");
                int CompCode = Convert.ToInt32(decrypteduserid.Split('~')[0].ToString());
                string Username = decrypteduserid.Split('~')[1].ToString();
                string Pwd = decrypteduserid.Split('~')[2].ToString();
                string ParentSite = decrypteduserid.Split('~')[3].ToString();
                int AppURL = Convert.ToInt32(decrypteduserid.Split('~')[4].ToString());
                string MainComlogo = string.Empty;
                string defaultlogo = "http://atharva.xconnect.in/images/CompanyLogo/eihab-logo.jpg";
                try

                {
                    if (decrypteduserid.Split('~').Count() > 5)
                    {
                        MainComlogo = decrypteduserid.Split('~')[5].ToString();
                    }
                    else
                    {
                        MainComlogo = defaultlogo;
                    }

                }
                catch
                {
                    MainComlogo = defaultlogo;
                }


                int LogintypeId = 1;
                LoginDO objlogin = new LoginDO();
                objlogin.Username = Username;
                objlogin.Password = Pwd;

                CrossLoginDO Crossobjlogin = new CrossLoginDO();

                int MainCompCode = CompCode;
                int MainAppURL = AppURL;
                string MainCompanyName = string.Empty;

                try
                {

                    Crossobjlogin = new ClientSettings().GetCompanyNameForCrossLogin(CompCode);
                    if (Crossobjlogin.IsCrossLogin == true)
                    {
                        objlogin.Username = Crossobjlogin.UserName; ;
                        objlogin.Password = Crossobjlogin.Password;
                        CompCode = Crossobjlogin.CrossCompCode;
                        AppURL = Crossobjlogin.CrossAppUrl; ;
                        LogintypeId = Convert.ToInt32(Crossobjlogin.LoginType);
                        MainCompanyName = Crossobjlogin.MainCompanyName;

                    }
                    else
                    {
                        objlogin.Username = Username;
                        objlogin.Password = Pwd;
                        CompCode = Convert.ToInt32(decrypteduserid.Split('~')[0].ToString());
                        AppURL = Convert.ToInt32(decrypteduserid.Split('~')[4].ToString());
                    }
                }
                catch
                {
                    objlogin.Username = Username;
                    objlogin.Password = Pwd;
                    CompCode = Convert.ToInt32(decrypteduserid.Split('~')[0].ToString());
                    AppURL = Convert.ToInt32(decrypteduserid.Split('~')[4].ToString());

                }

               
                if (objlogin.Username.Length > 0 && objlogin.Password.Length > 0)
                {
                    AISessionDO SessionDO = new AuthenticationModule().Authenticate(objlogin.Username, objlogin.Password, IpAddress(), AppURL, CompCode, NewsessionId, LogintypeId);
                    if (SessionDO.Connected)
                    {
                        sessionId = Session["LogSessionId_Report"].ToString();
                        SessionDO.ParentSite = ParentSite;
                        SessionDO.IsCrossLogin = Crossobjlogin.IsCrossLogin;

                        SessionDO.MainCompCode = MainCompCode;
                        SessionDO.MainAppURL = MainAppURL;
                        if (!string.IsNullOrEmpty(MainComlogo))
                        {
                            SessionDO.CompanyLogo = MainComlogo;
                        }
                        //this is for in footer main company name for @copyright only if cross login else sessionDAL as same
                        if (!string.IsNullOrEmpty(MainCompanyName))
                        {
                            SessionDO.CompanyName = MainCompanyName;
                        }
                    }
                    else
                    {
                        TempData["Error"] = "1";
                        return RedirectToAction("Login", "Login", new { Code = 1 });
                    }
                }
            }
            catch (Exception ex)
            {
                TempData["Error"] = "1";
                Util.ErrorLock(ex.ToString());
                return RedirectToAction("Login", "Login", new { Code = 1 });
            }

            return RedirectToAction("Home", "Home", new { Identity = sessionId });
        }
        
        public ActionResult Keepalive()
        {

            return Json("OK", JsonRequestBehavior.AllowGet);
        }




    }
}