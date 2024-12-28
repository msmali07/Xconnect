using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Report.DO
{
    
    public class GstReportDo
    {
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public int MemberId { get; set; }
        //public int TotalRecords { get; set; }
        //public string ResultJosn {  get; set; } 
    }

    public class GstReportResultList
    {

        public string InvNo { get; set; }
        public string dtInv { get; set; }
        public string bookRef { get; set; }
        public string AgName { get; set; }
        public string AgNo { get; set; }
        public string SupName { get; set; }
        public string PaxName { get; set; }
        public float Roe { get; set; }
        public decimal SupNetAmt { get; set; }
        public string SupNetCur { get; set; }
        public decimal NetAmt { get; set; }
        public string NetCur { get; set; }
        public decimal SrvCharge { get; set; }
        public decimal DiscAmt { get; set; }
        public decimal OrgSrvCharge { get; set; }
        public int GstPer { get; set; }
        public decimal HqPer { get; set; }
        public decimal BrPer { get; set; }
        public decimal WsPer { get; set; }
        public decimal AgPer { get; set; }
        public decimal SrvTax { get; set; }
        public decimal SGST { get; set; }
        public decimal CGST { get; set; }
        public decimal IGST { get; set; }

        public decimal HqPay { get; set; }
        public decimal SellAmt { get; set; }

        public string SellCur { get; set; }
        public string AgState { get; set; }
        public string AgPan { get; set;}
        public string AgGST { get; set; }
        public string BookPan { get; set; }
        public string BookPanName { get; set; }
    }
}
