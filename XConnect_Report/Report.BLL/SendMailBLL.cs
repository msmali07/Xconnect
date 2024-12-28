using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Web;
using System.Xml.Linq;
using System.Net;
using System.Net.Mail;
using System.Configuration;
using Report.DO;
using Report.DAL;

namespace Report.BLL
{
    public class SendMailBLL
    {
        public string sendMail(SendMailDO mail)
        {
            string Success = "false";
            int Appurl = SessionContext.Current.AISession.ApplicableUrl;
            int CompCode = SessionContext.Current.AISession.CompCode;
            SmtpClient smtp = new SmtpClient();
            MailSettingDO objMailDO = new MailSettingDO();
            objMailDO = MailSettingsBLL.GetMailSettings(SessionContext.Current.AISession.CompCode, "reporting", smtp, Appurl, mail.Status);

            System.Net.Mail.MailMessage mails = new System.Net.Mail.MailMessage();
            mails.From = new MailAddress(mail.MailFrom);
            mails.To.Add(mail.MailTo);

            if (!string.IsNullOrEmpty(mail.MailCc))
            {
                mails.CC.Add(mail.MailCc);
            }
            mails.Subject = mail.Subject;
            mails.Body = mail.Message.ToString();
            mails.IsBodyHtml = true;
            if (mail.Attachment != string.Empty && mail.Attachment != null)
            {
                System.Net.Mail.Attachment attach = new System.Net.Mail.Attachment(mail.Attachment);
                mails.Attachments.Add(attach);
            }

            try
            {
                smtp.Send(mails);
                Success = "true";
                mails.Attachments.Dispose();
            }
            catch (Exception ex)
            {
                string g = ex.Message;
                Success = "false";
                mails.Attachments.Dispose();
            }
            return Success;
        }
    }
}
