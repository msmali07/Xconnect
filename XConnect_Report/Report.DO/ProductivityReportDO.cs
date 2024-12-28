using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Report.DO
{
    public class ProductivityReportResultDO
    {
        public string bRefNo { get; set; }
        public string BookDt { get; set; }
        public string CkInDt { get; set; }
        public string CkOutDt { get; set; }
        public decimal SellAmt { get; set; }
        public string SellCcy { get; set; }
        public int nAdult { get; set; }
        public int nChild { get; set; }       
        public string Agency { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string ServiceTyp { get; set; }
        public int nNTS { get; set; }
        public int nRooms { get; set; }
        public int nPax { get; set; }
        public string bStatus { get; set; }
        public string bSource { get; set; }
        public int BrCode { get; set; }
        public string Service { get; set; }
        public string StarCat { get; set; }
        public string SuppName { get; set; }
    }

    public class ProductivityReportDO
    {
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public int MemberId { get; set; }
        public int LoginUserId { get; set; }
        public bool BookingdateWise { get; set; }
        public int CountryId { get; set; }
        public int CityId { get; set; }
        public int SupplierId { get; set; }
        public int BookingType { get; set; }
        public int ccode { get; set; }
        public string BookingStatus { get; set; }

    }
}
