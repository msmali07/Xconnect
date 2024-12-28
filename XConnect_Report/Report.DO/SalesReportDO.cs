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
    public class SalesReportDO
    {
        public DateTime ChkInDateFrom { get; set; }
        public DateTime ChkInDateTo { get; set; }
        public DateTime ReceiptDateFrom { get; set; }
        public DateTime ReceiptDateTo { get; set; }
        public int MemberId { get; set; }      
        public int LoginUserId { get; set; }
      
    }

    public class SalesReportResultList
    {
      
        public string RefNo { get; set; }          
        public string SuppRefNo { get; set; }                  
        public string Status { get; set; }
        public int Nts { get; set; }      
        public string ServiceName { get; set; }      
        public Double SellAmt { get; set; }
        public float BookPaidAmt { get; set; }
        public Single Commission { get; set; }       
        public string SellCurrency { get; set; }
        public string Destination { get; set; }
        public string ChkIn { get; set; }
        public string ChkOut { get; set; }
        public string SuppName { get; set; }
        public string Client { get; set; }


        //not show in report
        [JsonIgnore][ScriptIgnore]
        public string ReceiptCurrency { get; set; }

        [JsonIgnore][ScriptIgnore]
        public string ReceiptFrom { get; set; }

        [JsonIgnore][ScriptIgnore]
        public string ReceiptDate { get; set; }

        [JsonIgnore][ScriptIgnore]
        public string ReceiptNo { get; set; }

        [JsonIgnore] [ScriptIgnore]
        public Double PaidAmount { get; set; }
      
    }
}
