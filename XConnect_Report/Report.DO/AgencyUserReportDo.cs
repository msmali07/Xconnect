using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Report.DO
{
    public class AgencyUserReportDO
    {
       
        public int MemberId { get; set; }
        public int LoginUserId { get; set; }
       
    }
    public class AgencyUserReportResultDO
    {
        public string Agname { get; set; }
        public string AgCountry { get; set; }
        public string AgCity { get; set; }
        public string Title { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Mobile { get; set; }
        public string Email { get; set; }
        public string UsrCreatedDate { get; set; }
        public string SalesPerson { get; set; }
        public string ReserveStaff { get; set; }
        public string Active { get; set; }
        public string UName { get; set; }
    }
   
}
