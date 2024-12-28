using Microsoft.Reporting.WebForms;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;


namespace Report.DO
{
    public class ProductionReportDO
    {
        public DateTime From { get; set; }
        public DateTime To { get; set; }
        public int MemberId { get; set; }
        public int LoginUserId { get; set; }
        public bool BookingdateWise { get; set; }

        public int SupplierId { get; set; }

        public int CityId { get; set; }

        public string Status { get; set; }
    }

    public class ProductionReportResultList
    {
        public List<ProHotelReportList> ProHotelResultList { get; set; }

        public List<ProTransferReportList> ProTransferResultList { get; set; }

        public List<ProTourReportList> ProTourResultList { get; set; }
    }
    public class ProHotelReportList
    {
        public string RefNo { get; set; }       
        public string ChkIn { get; set; }
        public string ChkOut { get; set; }
        public int Nts { get; set; }
        public string Type { get; set; }
        public string SName { get; set; }
        public int NoPax { get; set; }
        [JsonIgnore][ScriptIgnore]
        public int CityId { get; set; }
        public string City { get; set; }
        public string Country { get; set; }

        [JsonIgnore]
        [ScriptIgnore]
        public int SuppId { get; set; }
        public string SuppN { get; set; }

        public string Sellcur { get; set; }

        public decimal SellAmt { get; set; }

        public string Client { get; set; }

        public string Status { get; set; }

    }

    public class ProTransferReportList
    {
        public string RefNo { get; set; }
        public string TDate { get; set; }     
        public string Type { get; set; }
        public int TType { get; set; }
        public int PickId { get; set; }
        public int DropId { get; set; }
        public string SName { get; set; }
        public int NoPax { get; set; }
        [JsonIgnore]
        [ScriptIgnore]
        public int CityId { get; set; }
        public string City { get; set; }
        public string Country { get; set; }

        [JsonIgnore]
        [ScriptIgnore]
        public int SuppId { get; set; }
        public string SuppN { get; set; }

        public string Sellcur { get; set; }

        public decimal SellAmt { get; set; }
        public string Client { get; set; }

        public string Status { get; set; }

    }

    public class ProTourReportList
    {
        public string RefNo { get; set; }
        public string TDate { get; set; }
        public string Type { get; set; }
        public int TType { get; set; }
        public string PickPt { get; set; }
        public string Durtn { get; set; }
        public string SName { get; set; }
        public int NoPax { get; set; }
        [JsonIgnore]
        [ScriptIgnore]
        public int CityId { get; set; }
        public string City { get; set; }
        public string Country { get; set; }

        [JsonIgnore]
        [ScriptIgnore]
        public int SuppId { get; set; }
        public string SuppN { get; set; }

        public string Sellcur { get; set; }

        public decimal SellAmt { get; set; }
        public string Client { get; set; }

        public string Status { get; set; }

    }
}
