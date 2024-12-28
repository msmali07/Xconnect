using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Report.DO
{

    public class HomeSearchDO
    {
        public bool IsBookingdateWise
        { get; set; }

        public int InTerms
        { get; set; }

        public string Currency
        { get; set; }

        public int BranchId
        { get; set; }

        public string DashboardDate
        { get; set; }
    }
    public class HomeList
    {
        public BookingCountListDO BookingCountList { get; set; }

        public List<TopBranchListDO> BranchList { get; set; }
        public List<TopAgencyListDO> AgencyList { get; set; }
        public List<TopSupplierListDO> SupplierList { get; set; }
        public List<FailedSupplierListDO> FailedSuppList { get; set; }

        public List<AgActiveListDO> AgActiveList { get; set; }
        public List<SerachBookByCityListDO> SearchBookByCityList { get; set; }
        public List<ServiceBookingListDO> ServiceBookingList { get; set; }
        public List<SerachBookByAgencyListDO> SearchBookByAgencyList { get; set; }
        public List<BlockedSupplierListDO> BlockedSupplierList { get; set; }
        public List<BookingByYearList> YearlyBookingList { get; set; }
        public List<Dictionary<string, object>> AgApiOutReportList {  get; set; }

    }


    public class BookingCountListDO
    {

        public int Confirmed
        { get; set; }
        public int Reconfirmed
        { get; set; }
        public int Cancelled
        { get; set; }
        public int Failed
        { get; set; }

        public int Requested
        { get; set; }




    }

    public class TopBranchListDO
    {
        public int BookingCount
        { get; set; }
        public int MemberId
        { get; set; }
        public decimal TotalSelling
        { get; set; }
        public string BranchName
        { get; set; }
        public string SellCurrency
        { get; set; }
        public string City
        { get; set; }

    }
    public class TopAgencyListDO
    {
        public int BookingCount
        { get; set; }
        public int MemberId
        { get; set; }
        public decimal TotalSelling
        { get; set; }
        public string AgencyName
        { get; set; }
        public string AgCity
        { get; set; }
        public string SellCurrency
        { get; set; }

    }
    public class TopSupplierListDO
    {
        public decimal TotalSelling
        { get; set; }
        public int BookingCount
        { get; set; }
        public int SupplierId
        { get; set; }

        public string SupplierName
        { get; set; }

        public string SellCurrency
        { get; set; }

    }

    public class FailedSupplierListDO
    {

        public int BookingCount
        { get; set; }
        public int SupplierId
        { get; set; }

        public string SupplierName
        { get; set; }



    }

    public class AgActiveListDO
    {

        public int Bookings
        { get; set; }
        public int Reconfirmed
        { get; set; }

        public int Cancelled
        { get; set; }

        public string AgName
        { get; set; }

        public string City
        { get; set; }

        public string Country
        { get; set; }

        public string Email
        { get; set; }

        public decimal RRPer
        { get; set; }

        public decimal XXPer
        { get; set; }


    }

    public class SerachBookByCityListDO
    {

        public int BookingCount
        { get; set; }
        public int SearchCount
        { get; set; }

        public decimal Ratio
        { get; set; }

        public string CityName
        { get; set; }



    }
    public class SerachBookByAgencyListDO
    {

        public int BookingCount
        { get; set; }
        public int SearchCount
        { get; set; }

        public decimal Ratio
        { get; set; }

        public string AgencyName
        { get; set; }

        public string AgCityName
        { get; set; }



    }

    public class ServiceBookingListDO
    {
        public int OnlineDirect
        { get; set; }
        public int OnlinePosted
        { get; set; }
        public int OfflineDirect
        { get; set; }
        public int OfflinePosted
        { get; set; }
        public int Total
        { get; set; }
        public string Service
        { get; set; }

        public bool IsAppService
        { get; set; }


    }


    public class BlockedSupplierListDO
    {
        public string UserName
        { get; set; }
        public string Date
        { get; set; }
        public string SupplierName
        { get; set; }
        public int NoOfadays
        { get; set; }


    }
    public class BookingByYearList
    {
        public int BookingCount
        { get; set; }
        public string BookingMonth
        { get; set; }

        public int MonthNo
        { get; set; }

        public string BookingYear
        { get; set; }

    }

    public class AgentActivityApiOut
    {
        public string AgName { get; set; }
        public string BrName { get; set; }
        public int TotalHits { get; set; }
        public int HSearchByCity { get; set; }
        public int MyProperty { get; set; }
        public int HSearchByHCodes { get; set; }
        public int HSearchByHotelCode_V2_S { get; set; }
        public int HSearchByHotelCode_V2_M { get; set; }
        public int HPreBooking { get; set; }
        public int GetCountryList { get; set; }
        public int GetCityList { get; set; }
        public int GetHInfo { get; set; }
        public int HBookingInfo { get; set; }
        public int HCancelBooking { get; set; }

        public int HCreateBooking { get; set; }
        public int HVoucherBooking { get; set; }

    }

}
