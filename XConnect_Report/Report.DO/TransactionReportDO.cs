using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Report.DO
{
    public class TransactionReportDO
    {
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public int MemberId { get; set; }
        public int LoginUserId { get; set; }
        public bool BookingdateWise { get; set; }
    }
    public class TransactionReportResultDO
    {

        public string AgName { get; set; }
        public string Transact_Id { get; set; }
        public string SCurr { get; set; }
        public decimal SAmt { get; set; }

        public string Remarks { get; set; }
        public string PDate { get; set; }
        public string RefNo { get; set; }
        public string Status { get; set; }
        public string SName { get; set; }

      


    }
}
