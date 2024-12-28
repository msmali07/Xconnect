using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Report.DO
{
   public class OperationalIssueReportDO
    {
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public int MemberId { get; set; }
        public int LoginUserId { get; set; }
        public bool BookingdateWise { get; set; }
        public int SupplierId { get; set; }
    }


    public class OperationalIssueResultDO
    {
        public string RefNo { get; set; }
        public string SuppName { get; set; }
        public string BDate { get; set; }
        public string ChkIn { get; set; }
        public string SType { get; set; }
        public string SName { get; set; }
        public int BType { get; set; }
        public string Remarks { get; set; }
        public string RDate { get; set; }
        public string Postbyuser { get; set; }
        public int MType { get; set; }
        public int Count { get; set; }
   
    }
}
