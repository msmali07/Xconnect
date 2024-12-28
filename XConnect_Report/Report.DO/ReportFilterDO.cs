using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Report.DO
{
    public class ReportFilterDO
    {
        public bool IsOnePageReport
        { get; set; }
        public string ReportPath
        { get; set; }
        public string Bookstatus
        { get; set; }
        public string type
        { get; set; }
        public string ClientName
        { get; set; }
        public string noofnts
        { get; set; }
        public string FirstName
        { get; set; }
        public string HotelName
        { get; set; }
        public string SellAmount
        { get; set; }
        public string CheckInDate
        { get; set; }

        public string CheckInMonthName
        { get; set; }
        public string RangeSellAmount
        { get; set; }
        public string RangeSellAmtOption
        { get; set; }
        public string GroupBy
        { get; set; }
        public string HideBy
        { get; set; }
        public string ActiveFilters
        { get; set; }

        public string CustomDateOption
        { get; set; }

        public bool DateFilter
        { get; set; }
        public bool PaxFilter
        { get; set; }
        public bool TypeFilter
        { get; set; }
        public bool AgencyFilter
        { get; set; }
        public bool SellAmtFilter
        { get; set; }
        public bool StatusFilter
        { get; set; }

    }
}
