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
    public class PickupReportDO
    {
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }

    }

    public class PickupReportResultDO
    {
       
        public string BRefNo { get; set; }
    
        public string VehicleDetail { get; set; }
        public string SName { get; set; }
        public string SType { get; set; }
        public decimal AGPay { get; set; }
        public string City { get; set; }
        public string PFrom { get; set; }
        public string PDetail { get; set; }
        public string ATime { get; set; }
        public string DropOff { get; set; }
        public string DropOffInfo { get; set; }
        public string LPaxName { get; set; }
        public int NoOfAdult { get; set; }
        public int NoOfChild { get; set; }
        public string SRequest { get; set; }
        public int VehicleCount { get; set; }
        public string VehicleName { get; set; }
        public int PickupType { get; set; }
        public int DropOffType { get; set; }
        public string SDate { get; set; }
        public string BookingStatus { get; set; }
    }

    //not used
    public class PickupReportResponseDO
    {
        public AccountReportDO AccountSearchDO { get; set; }
        public ReportFilterDO AccountFilterDO { get; set; }
        public List<AccountReportResultDO> AccountRptResultList { get; set; }
        public ReportViewer AccountRdlc { get; set; }

        public int TotalRecords { get; set; }

        public string AccountResultJosn { get; set; }


    }


  
    
}
