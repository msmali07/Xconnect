using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;

namespace Report.DO
{
    public class CorporateCardUseDO
    {
        public int CId { get; set; }
        public string CName { get; set; }
        public string Curr { get; set; }

    }
    public class CorporateCardUseReportDO
    {
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public int LoginUserId { get; set; }
        public bool BookingdateWise { get; set; }
        public string ReportWise { get; set; }
        public string CardUse { get; set; }
        public int CorporateId { get; set; }
    }
    public class CorporateCardUseReportResultDO
    {
        public string CName { get; set; }
        public string CUse { get; set; }
        public string VNo { get; set; }
        public string RefNo { get; set; }
        public int NORooms { get; set; }
        public int Nts { get; set; }
        public string NOPax { get; set; }
        public string Pax { get; set; }
        public string BookDate { get; set; }
        public string ChkIn { get; set; }
        public string ChkOut { get; set; }
        public string SName { get; set; }
        public string City { get; set; }
        public string SupName { get; set; }
        public string NCurr { get; set; }
        public decimal NAmt { get; set; }
        public string SCurr { get; set; }
        public decimal SAmt { get; set; }
        public int NoOfAdult { get; set; }
        public int NoOfChild { get; set; }

    }

}
