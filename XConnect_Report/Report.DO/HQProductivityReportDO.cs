using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Report.DO
{
    public class HQProductivityReportDO
    {
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public int MemberId { get; set; }
        public int LoginUserId { get; set; }
        public bool BookingdateWise { get; set; }

    }
    public class HQProductivityResultDO
    {

        public string BStatus
        { get; set; }
        public int Confirm
        { get; set; }
        public int ReCon
        { get; set; }
        public int Cancel
        { get; set; }
        public int Failed
        { get; set; }
        public string SName
        { get; set; }
        public decimal SellAmt
        { get; set; }
        public decimal XXCharge
        { get; set; }
        public decimal Total
        { get; set; }
    }
}
