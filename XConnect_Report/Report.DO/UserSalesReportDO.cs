using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;

namespace Report.DO
{
    public class UserSalesReportDO
    {
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public int MemberId { get; set; }
        public int UserID { get; set; }
        public int LoginUserId { get; set; }
        public bool BookingdateWise { get; set; }
    }
    public class UserSalesReportResultDO
    {

        public string RefNo { get; set; }
        [JsonIgnore]
        [ScriptIgnore]
        public string ChkIn { get; set; }
       
        public string BookDate { get; set; }
        public int UId { get; set; }
        public string BName { get; set; }
        public string StId { get; set; }
        public string Status { get; set; }
        public string UName { get; set; }
        public string AgName { get; set; }
        public int MId { get; set; }
        public string VNo { get; set; }
        public string VIDate { get; set; }

    }
}
