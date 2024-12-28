using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Report.DO
{
   
    public class MemberCreditDetailsReportDO
    {
        public int MemberId { get; set; }
        public int LoginUserId { get; set; }
    }
    public class MemberCreditDetailsReportResultDO
    {
        public string AgName { get; set; }
        public string Member_Email { get; set; }
        public string BrName { get; set; }
        public string Status { get; set; }        
        public string Currency { get; set; }
        public string Balance { get; set; }
        public string TempCredit { get; set; }

    }
}
