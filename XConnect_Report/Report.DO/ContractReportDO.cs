using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Report.DO
{
    public class ContractReportDO
    {
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public int MemberId { get; set; }
        public int LoginUserId { get; set; }
        public bool BookingdateWise { get; set; }
    }

    public class ContractReportResultDO
    {
        public string Conid { get; set; }
        public string Hname { get; set; }
        public string SCat { get; set; }
        public string ConFrom { get; set; }
        public string ConTo { get; set; }
        public string Remark { get; set; }
        public string PName { get; set; }
        public string PFrom { get; set; }
        public string PTo { get; set; }
        public string BookDate { get; set; }
        public string ProUp { get; set; }
        public string SaleUp { get; set; }
        public string SaleDate { get; set; }


    }
}
