using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;

namespace Report.DO
{
    public class NetStatementReportDO
    {
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public int MemberId { get; set; }
        public int LoginUserId { get; set; }
        public bool BookingdateWise { get; set; }

    }

    public class NetStatementReportResultDO
    {

        public string RefNo { get; set; }
        public string ChkIn { get; set; }

        [JsonIgnore]
        [ScriptIgnore]
        public string BookDate { get; set; }
        public int Nts { get; set; }
        public string SName { get; set; }
        public string Pax { get; set; }
        public string SCurr { get; set; }
        public string Status { get; set; }
        public string SType { get; set; }
        public string AgName { get; set; }

        public string AgCity { get; set; }
        public string AgCountry { get; set; }
        public decimal SAmt { get; set; }
        public string NCurr { get; set; }
        public string SupName { get; set; }
        public string VNo { get; set; }
        public decimal NAmt { get; set; }
        public string ChkOut { get; set; }
        public string ACode { get; set; }
        public decimal ROE { get; set; }
        public string SupRefNo { get; set; }
        public decimal NInAED { get; set; }
        public decimal SInAED { get; set; }
        public int NORooms { get; set; }
        public string Postbyuser { get; set; }

    }

}
