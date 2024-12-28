using Report.DO;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Hosting;
using System.Xml;
using System.Xml.Linq;

namespace Report.DAL
{
    public class ClientSettings
    {
        int InboundMemberID = 2564;
        public string GetNoImage(int CCode, int AppUrl)
        {
            string strNoImage = string.Empty;
            switch (CCode)
            {
                case 3:
                    strNoImage = "../images/no-image3-31.jpg";
                    break;
                case 36:
                    strNoImage = "../images/no-image36.jpg";
                    break;
                case 37:
                    strNoImage = "../images/no-image37.jpg";
                    break;
                case 39:
                    strNoImage = "../images/no-image39.jpg";
                    break;
                case 38:
                    strNoImage = "../images/no-image38.jpg";
                    break;
                case 33:
                    strNoImage = "../images/no-image33.jpg";
                    break;
                case 35:
                    strNoImage = "../images/no-image35.jpg";
                    break;
                case 34:
                    strNoImage = "../images/no-image34.jpg";
                    break;
                case 5:
                    strNoImage = "../images/no-image5.jpg";
                    break;
                default:
                    strNoImage = "../images/no-image37.jpg";
                    break;
                case 29:
                    strNoImage = "../images/no-image29.jpg";
                    break;
                case 41:
                    strNoImage = "../images/no-image41.jpg";
                    break;
            }
            return strNoImage;

        }

        public CrossLoginDO GetCompanyNameForCrossLogin(int CompCode)
        {
            string CompanyName = string.Empty;
            string UserName = string.Empty;
            string Password = string.Empty;
            int AppUrl = 0;
            int LoginType = 0;
            CrossLoginDO objCrosslogin = new CrossLoginDO();


            try
            {
                string status = ConfigurationManager.AppSettings["Status"].ToString().ToUpper();
                string xmlPath = HttpContext.Current.Server.MapPath("~/App_Data/CrossLogin.xml");
                XmlDocument docx = new XmlDocument();
                docx.Load(xmlPath);


                XmlNode ndXmlMail = docx.SelectSingleNode(string.Format("CrossLogins/Server[@Status='" + status.ToUpper() + "']"));
                XmlNode CompNode = ndXmlMail.SelectSingleNode(string.Format("CompCode[@Id='" + CompCode + "']"));

                if (CompNode != null)
                {
                    objCrosslogin.MainCompanyName = CompNode.SelectSingleNode("MainCompanyName").InnerText.Trim();
                    objCrosslogin.UserName = CompNode.SelectSingleNode("UserName").InnerText.Trim();
                    objCrosslogin.Password = CompNode.SelectSingleNode("Password").InnerText.Trim();
                    objCrosslogin.CrossAppUrl = Convert.ToInt32(CompNode.SelectSingleNode("CrossAppUrl").InnerText.Trim());
                    objCrosslogin.LoginType = Convert.ToInt32(CompNode.SelectSingleNode("LoginType").InnerText.Trim());
                    objCrosslogin.CrossCompCode = Convert.ToInt32(CompNode.SelectSingleNode("CrossCompCode").InnerText.Trim());
                   
                    objCrosslogin.IsCrossLogin = true;


                }
                else
                {
                    objCrosslogin.IsCrossLogin = false;
                }
            }catch
            {
                objCrosslogin.IsCrossLogin = false;
            }

            return objCrosslogin;

           // return CompanyName +"~" + UserName +"~" + Password +"~" + AppUrl + "~" + LoginType;
        }


        public int CheckInboundByMemberId(int MemberId,int CompCode)
        {
           
            if (MemberId == InboundMemberID && CompCode == 1)
            {
                return 1;
            }
            return MemberId;
        }
    }

  
}
