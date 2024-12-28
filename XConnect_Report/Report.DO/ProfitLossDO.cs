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
    public class ProfitLossDO
    {
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public int MemberId { get; set; }    
        public int LoginUserId { get; set; }
        public int BookingdateWise { get; set; }
    }

    public class ProfitLossReportResultList
    {

        public string RefNo { get; set; }
        public string AgName { get; set; }
        public string AgCity { get; set; }
        public string AgCountry { get; set; }
        public string BrName { get; set; }       
        public string SName { get; set; }
        public string SCity { get; set; }
        public string SCountry { get; set; }
        public string SType { get; set; }
        public int BType { get; set; }
        public string ChkIn { get; set; }
        public string BDate { get; set; }

        public string RRDate { get; set; }
        public int Nts { get; set; }
        public decimal NetAmt { get; set; }
        public decimal SNetAmt { get; set; }
        public decimal SSNetAmt { get; set; }
        public string NetCur { get; set; }
        public decimal SellAmt { get; set; }
        public string SellCur { get; set; }      
        public string SuppName { get; set; }
        public string Invoiced { get; set; }        
        public string IsInbound  { get; set; }        
        public string Status { get; set; }

        public int BookedBy { get; set; }
        public decimal AGPay { get; set; }
        public decimal TaxPay { get; set; }
        public decimal HQExtra { get; set; }
        public decimal BRExtra { get; set; }
        public decimal ProfitAmt { get; set; }
        public decimal Profit { get; set; }

        public decimal ConvFeeAmt { get; set; }

        public bool IncludeExcludeConvFee { get; set; }

        public decimal ConvAmt { get; set; }


        public int Version { get; set; }

        public string SalesP { get; set; }

        public string DeptName { get; set; }



    }
}
