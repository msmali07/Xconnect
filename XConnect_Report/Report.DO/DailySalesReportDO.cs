using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;

namespace Report.DO
{
    public class DailySalesReportDO
    {
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public int MemberId { get; set; }
        public int LoginUserId { get; set; }
        public int BookingdateWise { get; set; }

    }
    public class DailySalesReportResultDO
    {

        public string RefNo { get; set; }
        public string Pos { get; set; }
        public string ChkIn { get; set; }
        public string BookDate { get; set; }
        public int Nts { get; set; }
        public string SName { get; set; }
        public string Pax { get; set; }
        public string SCurr { get; set; }
        public string Status { get; set; }
        public string SType { get; set; }
        public string AgName { get; set; }
        public decimal SAmt { get; set; }
        public string NCurr { get; set; }
        public string SupName { get; set; }
        public string INo { get; set; }
        public decimal NAmt { get; set; }
        public string ChkOut { get; set; }
        public decimal ROE { get; set; }
        public decimal IAmt { get; set; }
        public string City { get; set; }
        public string DDate { get; set; }
        public string SupRefNo { get; set; }
        public decimal GInAED { get; set; }
        public string VNo { get; set; }
        public string StId { get; set; }

        public string Postbyuser { get; set; }


        public string PostToUser { get; set; }
        public string AcManager { get; set; }
        public string AgCountry { get; set; }
        public string AgCity { get; set; }

    }
}
