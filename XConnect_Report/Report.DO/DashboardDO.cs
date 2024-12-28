using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;

namespace Report.DO
{
   
    public class BookStatusDO
        {
            public DateTime DateFrom { get; set; }
            public DateTime DateTo { get; set; }
            public int MemberId { get; set; }
            public int LoginUserId { get; set; }
            public bool BookingdateWise { get; set; }

            public string BookStatus { get; set; }
        }

    public class BookStatusReportResultList
    {

        public string RefNo { get; set; }
        public string AgName { get; set; }
        public string BrName { get; set; }
        public string SName { get; set; }
        public string SType { get; set; }
        public int BType { get; set; }
        public string ChkIn { get; set; }
        public string BDate { get; set; }
        public int Nts { get; set; }

        public string CityName { get; set; }

        public string SuppName { get; set; }

        public int BookedBy { get; set; }

        public string Status { get; set; }
        public string Postbyuser { get; set; }


    }

    public class SerBookingDO
    {
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public int MemberId { get; set; }
        public int LoginUserId { get; set; }
        public bool BookingdateWise { get; set; }
   
    }

    public class SerBookReportResultListDO
    {
        public int OnlineDirect
        { get; set; }
        public int OnlinePosted
        { get; set; }

        public int Offline
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


    public class BranchBookingDO
    {
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public int MemberId { get; set; }
        public int LoginUserId { get; set; }
        public bool BookingdateWise { get; set; }
        public string Currency { get; set; }
        public int InTerms { get; set; }
    }

    public class BranchBookingReportResultList
    {

       
      
        public string RefNo { get; set; }
        public string SType { get; set; }
        public int BType { get; set; }
        public string ChkIn { get; set; }
        public string BDate { get; set; }
        public int Nts { get; set; }
        public string Status { get; set; }
        public string AgName { get; set; }
        public string BrName { get; set; }       
        public decimal SellAmt { get; set; }

        public decimal MainSellAmt { get; set; }

        public int BCount { get; set; }
        public decimal TotalValue { get; set; }
        public string SuppName { get; set; }

        public string SName { get; set; }

        public string SellCur { get; set; }
        public string City { get; set; }
        public string Postbyuser { get; set; }






    }


    public class AgentBookingDO
    {
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public int MemberId { get; set; }
        public int LoginUserId { get; set; }
        public bool BookingdateWise { get; set; }
        public string Currency { get; set; }
        public int InTerms { get; set; }
    }

    public class AgentBookingReportResultList
    {

        public string RefNo { get; set; }
        public string SType { get; set; }
        public int BType { get; set; }
        public string ChkIn { get; set; }
        public string BDate { get; set; }
        public int Nts { get; set; }
        public string Status { get; set; }
        public string AgName { get; set; }    
        
        public string BrName { get; set; }
        public decimal SellAmt { get; set; }

        public int BCount { get; set; }
        public decimal TotalValue { get; set; }
        public string SuppName { get; set; }

        public string SName { get; set; }
        public string City { get; set; }
        public decimal MainSellAmt { get; set; }

        public string SellCur { get; set; }

        public string Postbyuser { get; set; }




    }

    public class SupplierBookingDO
    {
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public int MemberId { get; set; }
        public int LoginUserId { get; set; }
        public bool BookingdateWise { get; set; }
        public string Currency { get; set; }
        public int InTerms { get; set; }

        public int ProdType { get; set; }
    }

    public class SupplierBookingReportResultList
    {

        public string RefNo { get; set; }
        public string SType { get; set; }
        public int BType { get; set; }
        public string ChkIn { get; set; }
        public string BDate { get; set; }
        public int Nts { get; set; }
        public string Status { get; set; }
        public string AgName { get; set; }

        public string BrName { get; set; }
        public decimal SellAmt { get; set; }

        public int BCount { get; set; }
        public decimal TotalValue { get; set; }
        public string SuppName { get; set; }

        public string SName { get; set; }
        public string City { get; set; }
        public decimal MainSellAmt { get; set; }

        public string SellCur { get; set; }

        public string ProdType { get; set; }

        public string LastBookingDate{ get; set; }


        public string Postbyuser { get; set; }


    }

    public class BlockSupplierDO
    {
        public int SId { get; set; }
        public string SuppName { get; set; }
        public string Service { get; set; }
        public int ServId { get; set; }
    }

    public class SupplierProdReportList
    {
        public List<SupplierBookingReportResultList> MainResultlist { get; set; }

        public List<BlockSupplierDO> BlockSupplierlist { get; set; }
    }


    public class FailedBookingDO
    {
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public int MemberId { get; set; }
        public int LoginUserId { get; set; }
        public bool BookingdateWise { get; set; }
      
    }

    public class FailedBookingReportResultList
    {

        public string RefNo { get; set; }
        public string SType { get; set; }
        public int BType { get; set; }
        public string ChkIn { get; set; }
        public string BDate { get; set; }
        public int Nts { get; set; }
        public string Status { get; set; }
        public string AgName { get; set; }

        public string SellCur { get; set; }

        public string BrName { get; set; }
        public decimal SellAmt { get; set; }

        public int BCount { get; set; }
        public decimal TotalValue { get; set; }
        public string SuppName { get; set; }
        public string City { get; set; }

        public string Error { get; set; }

        public string IsAutoSoldOut { get; set; }


    }

    public class SearchCityBookingDO
    {
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public int MemberId { get; set; }
        public int LoginUserId { get; set; }
        public bool BookingdateWise { get; set; }

    }

    public class SearchCityBookingReportResultList
    {
        public string SearchDate { get; set; }
        public string ChkOut { get; set; }
        public string ChkIn { get; set; }
        public int NRooms { get; set; }
        public string RoomCng { get; set; }
        public int Nts { get; set; }
        public string Status { get; set; }
        public string HotelName { get; set; }
        public int BCount { get; set; }
        public decimal TotalValue { get; set; }
        public string SuppName { get; set; }
        public string City { get; set; }

        public string AgName { get; set; }

        public string BrName { get; set; }

        public string UserName { get; set; }

        public string SearchId { get; set; }

        public int SearchCount { get; set; }

        public decimal Ratio { get; set; }
        [JsonIgnore]
        [ScriptIgnore]
        public int CityNo { get; set; }

       



    }

    public class SearchAgentBookingDO
    {
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public int MemberId { get; set; }
        public int LoginUserId { get; set; }
        public bool BookingdateWise { get; set; }

    }

    public class SearchAgentBookingReportResultList
    {

        public string SearchDate { get; set; }
        public string ChkOut { get; set; }
        public string ChkIn { get; set; }
        public int NRooms { get; set; }
        public string RoomCng { get; set; }
        public int Nts { get; set; }
        public string Status { get; set; }
        public string HotelName { get; set; }
        public int BCount { get; set; }
        public decimal TotalValue { get; set; }
        public string SuppName { get; set; }
        public string City { get; set; }

        public string AgName { get; set; }

        public string BrName { get; set; }

        public string SearchId { get; set; }

        public int SearchCount { get; set; }

        public decimal Ratio { get; set; }
       
        [JsonIgnore]
        [ScriptIgnore]
        public int AgId { get; set; }

        public string UserName { get; set; }





    }


    public class CompareBrList
    {
        public string BranchName { get; set; }
        public string Dates { get; set; }
        public decimal TotalBookings { get; set; }
    }
}

