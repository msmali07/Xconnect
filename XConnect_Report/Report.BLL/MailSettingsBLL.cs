using System.Net.Mail;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web.Security;
using System.Xml;
using System.Net;
using Report.DO;
using System;

using System.Web.UI.WebControls;


namespace Report.BLL
{
    public class MailSettingsBLL
    {
        public static MailSettingDO GetMailSettings(int CCode, string Key, SmtpClient smtp, int AppUrl, string status)
        {

            string MailServer = string.Empty;
            MailSettingDO objMail = new MailSettingDO();

            //string status = ConfigurationManager.AppSettings["Status"].ToString().ToUpper();           
            string xmlPath = System.Web.HttpContext.Current.Server.MapPath("~/App_Data/MailSettings.xml");

            XmlDocument docx = new XmlDocument();
            docx.Load(xmlPath);

            XmlNode ndXmlMail = docx.SelectSingleNode(string.Format("MailSettings/Server[@Status='" + status.ToUpper() + "']"));

            XmlNode CompNode = ndXmlMail.SelectSingleNode(string.Format("CompCode[@Id='" + CCode + "']"));

            XmlNode AppUrlNode = CompNode.SelectSingleNode(string.Format("AppUrl[@Id='" + AppUrl + "']"));

            XmlNode ndSmtp = AppUrlNode.SelectSingleNode(string.Format("Smtp[@Key='" + Key + "']"));

            string Host = ndSmtp.SelectSingleNode("MailServer").InnerText.Trim();
            string UserId = ndSmtp.SelectSingleNode("UserId").InnerText.Trim();
            string Password = ndSmtp.SelectSingleNode("Password").InnerText.Trim();
            string EnableSSL = ndSmtp.SelectSingleNode("EnableSSL").InnerText.Trim();
            string PortNo = ndSmtp.SelectSingleNode("PortNo").InnerText.Trim();

            XmlNodeList ndList = AppUrlNode.SelectNodes("ToMailIds/ToMailId");

            objMail.ToMailIdList = new List<MailList>();
            foreach (XmlNode node in ndList)
            {
                MailList lst = new MailList();
                lst.Type = node.Attributes["Type"].Value;
                lst.MailId = node.InnerText;
                objMail.ToMailIdList.Add(lst);
            }

            objMail.FromMailId = ndSmtp.SelectSingleNode("FromMailId").InnerText.Trim();

            smtp.Host = Host;

            if (string.IsNullOrEmpty(PortNo))
            {
                smtp.Port = smtp.Port;
            }
            else
            {
                smtp.Port = Convert.ToInt32(PortNo);
            }
            if (string.IsNullOrEmpty(EnableSSL))
            {
                smtp.EnableSsl = smtp.EnableSsl;
            }
            else
            {
                smtp.EnableSsl = Convert.ToBoolean(EnableSSL);
            }
            smtp.UseDefaultCredentials = false;
            smtp.Credentials = new NetworkCredential(UserId, Password);

            return objMail;

        }
    }
}
