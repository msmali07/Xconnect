using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Report.DO
{
   
        public class MailSettingDO
        {
            public MailSettingDO() { }

            public string MailServer { get; set; }
            public string UserId { get; set; }
            public string Password { get; set; }
            public string FromMailId { get; set; }
            public List<MailList> ToMailIdList { get; set; }
            public int PortNo { get; set; }
            public bool EnableSsl { get; set; }
            public int CCode { get; set; }

            public int AppUrl { get; set; }
        }

    public class SendMailDO
    {
        public string Status { get; set; }
        public string ReportName { get; set; }       
        public string MailFrom { get; set; }
        public string MailTo { get; set; }
        public string MailCc { get; set; }       
        public string Subject { get; set; }
        public StringBuilder MailBody { get; set; }
        public int UserId { get; set; }
       
       
        public DateTime SendMailDate { get; set; }
        public string Message { get; set; }
        public string UserName { get; set; }
        public string Attachment { get; set; }
        

    }

    public class MailList
    {
        public string Type { get; set; }
        public string MailId { get; set; }
    }
}
