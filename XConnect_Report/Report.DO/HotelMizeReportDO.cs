using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Report.DO
{
    public class HotelMizeReportDO
    {
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public int MemberId { get; set; }
        public int LoginUserId { get; set; }
        public bool BookingdateWise { get; set; }
        public int SupplierId { get; set; }
    }

    public class HotelMizeReportResultDo
    {
        public string BId { get; set; }
        public string RefNo { get; set; }
        public string BookDate { get; set; }
        public string Chkout { get; set; }
        public string ChkIn { get; set; }
        public string OriginalRefNo { get; set; }
        public string HMStatus { get; set; }
        public string Status { get; set; }
        public string SuppName { get; set; }
        public int Count { get; set; }
        public decimal HM_NetAmt { get; set; }
        public decimal NetAmt { get; set; }
        public string HM_NetCur { get; set; }
        public string NetCur { get; set; }
        public decimal Profit { get; set; }
        public string Error { get; set; }
        public string Conv { get; set; }
        public string HM_SuppName { get; set; }
    }
}
