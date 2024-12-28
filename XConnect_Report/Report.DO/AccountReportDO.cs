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
    public class AccountReportDO
    {
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public int MemberId { get; set; }
        public int LoginUserId { get; set; }
        public bool BookingdateWise { get; set; }

    }

    public class AccountReportResultDO
    {
       
        public string RefNo { get; set; }
        public string Pos { get; set; }       
        public string ChkIn { get; set; }

      //  public string BookingDate { get; set; }

       // [JsonIgnore]
       // [ScriptIgnore]
        public string BookDate { get; set; }
        public int Nts { get; set; }       
        public string SName { get; set; }
        public string Pax { get; set; }       
        public string SCurr { get; set; }
        public string Status { get; set; }
        public string SType { get; set; }
        public string AgName { get; set; }

        public string AgRefNo { get; set; }

        public string AgCity { get; set; }
        public string AgCountry { get; set; }
        public decimal SAmt { get; set; }

        public decimal AGPay { get; set; }

        public decimal BRPay { get; set; }

        public string Postbyuser { get; set; }

        public string Posttouser { get; set; }

        public string InvoiceNo { get; set; }

        public decimal WsNewPay { get; set; }

        public decimal NAmt { get; set; }

        public string NCur { get; set; }

        public decimal HqSell { get; set; }
        public decimal BrSell { get; set; }

        public decimal WsSell { get; set; }

    }

    //not used
    public class AccountReportResponseDO
    {
        public AccountReportDO AccountSearchDO { get; set; }
        public ReportFilterDO AccountFilterDO { get; set; }
        public List<AccountReportResultDO> AccountRptResultList { get; set; }
        public ReportViewer AccountRdlc { get; set; }

        public int TotalRecords { get; set; }

        public string AccountResultJosn { get; set; }


    }


  
    
}
