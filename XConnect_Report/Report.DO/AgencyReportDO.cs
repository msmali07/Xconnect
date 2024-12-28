using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Report.DO
{
  public  class AgencyReportDO
    {
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public int MemberId { get; set; }
        public int LoginUserId { get; set; }
        public bool BookingdateWise { get; set; }
    }

    public class AgencyReportResultDO
    {
        public string Agname { get; set; }
        public string search { get; set; }
        public string Book { get; set; }
        public string Reconf { get; set; }

        public string finish { get; set; }
        public string canlwtc { get; set; }
        public string canlwtnc { get; set; }
        public string tlbook { get; set; }
        public string fail { get; set; }

        public string SalesPerson { get; set; }
        public string Email { get; set; }
        public string City { get; set; }
       public string Country { get; set; }
        public decimal Per { get; set; }
        public string Regdate { get; set; }
        public string bkdate { get; set; }
        public string Paymode { get; set; }
        public string Active { get; set; }
        public string Currency { get; set; }
        public decimal Tsale { get; set; }

        public int Agnotlogged { get; set; }

        public int cancel { get; set; }


        public decimal RRPer
        { get; set; }

        public decimal XXPer
        { get; set; }
    }
}
