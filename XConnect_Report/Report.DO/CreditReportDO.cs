using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Report.DO
{
    public class CreditReportDO
    {
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public int MemberId { get; set; }
      
    }

    public class CreditReportResultList
    {
      
        public string BookRefNo { get; set; }       
        public float Debit { get; set; }
        public float Credit { get; set; }
        public string BookingAction { get; set; }
        public float CurrentCreditBalance { get; set; }     
        public string Remark { get; set; }
        public string LeadPaxName { get; set; }
        public string BookStatus { get; set; }
        public float OpeningBal { get; set; }
        public decimal IniCreditBalance { get; set; }
        public DateTime Action { get; set; }
        public string CompanyName { get; set; }
        public string Address { get; set; }
        public int MemberTypeId { get; set; }
        public string ActionDate { get; set; }
        public string CreditCurrency { get; set; }
        public string ServiceType { get; set; }
        public string Agname { get; set; }
        public string City { get; set; }
    }
}
