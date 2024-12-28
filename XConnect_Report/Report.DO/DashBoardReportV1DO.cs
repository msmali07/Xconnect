using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Report.DO
{
    //public class DashBoardReportV1DO
    //{
    //    public List<LMvsEarlyBookingDO> LMvsEarlyBooking { get; set; }

    //}
    public class SalesPersonAccessDo
    {
        public string SalesPersonName { get; set; }
        public int  UserId { get; set; }
        public int MemberId { get; set; }
        public bool bSalesPerson { get; set; }

    }

}
