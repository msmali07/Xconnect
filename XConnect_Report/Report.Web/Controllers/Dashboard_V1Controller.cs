
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Report.DO;
using System.Web.Mvc;

namespace Report.Web.Controllers
{
    public class Dashboard_V1Controller : Controller
    {
        // GET: Dashboard_V1
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult HomeDashboard_V1()
        {
            return View();
        }
        public ActionResult HotelRNReport()
        {
            return View();
        }
        public ActionResult Destination()
        {
            return View();
        }
        public ActionResult SalesOverview()
        {
            return View();
        }
        public ActionResult HotelSales()
        {
            return View();
        }
        public ActionResult DestinationSales()
        {
            return View();
        }
        public ActionResult OverviewRpt()
        {
            return View();
        }
        public ActionResult SupplierVsClient()
        {
            return View();
        }
        public ActionResult SupplierVsClient1()
        {
            return View();
        }
        public ActionResult LMVsEarlyBookingsClients()
        {
            //LMvsEarlyBookingDO ObjLMvsEarlyBooking = new LMvsEarlyBookingDO();
            //string ReportName = "Clients";
            //if (ReportName == "Clients")
            //{
            //    ObjLMvsEarlyBooking.LMvsEarlyBooking_Client = true;
            //    ObjLMvsEarlyBooking.LMvsEarlyBooking_Supplier = false;
            //    ObjLMvsEarlyBooking.LMvsEarlyBooking_Hotel = false;
            //    ObjLMvsEarlyBooking.LMvsEarlyBooking_Destination = false;
            //}
            //return View(ObjLMvsEarlyBooking);
            return View();
        }
        public ActionResult LMVsEarlyBookingsSupplier()
        {
            return View();
        }
        public ActionResult LMVsEarlyBookingsHotel()
        {
            return View();
        }
        public ActionResult LMVsEarlyBookingsDestination()
        {
            return View();
        }

        public ActionResult CancelationDestination()
        {
            return View();
        }
        public ActionResult CancelationHotel()
        {
            return View();
        }
        public ActionResult CancelationSupplier()
        {
            return View();
        }
        public ActionResult CancelationClient()
        {
            return View();
        }
        public ActionResult NRVsRefundableClient()
        {
            return View();
        }
        public ActionResult NRVsRefundableHotel()
        {
            return View();
        }
        public ActionResult NRVsRefundableSupplier()
        {
            return View();
        }
        public ActionResult NRVsRefundableDestination()
        {
            return View();
        }

        public ActionResult SupplierOverviewReport()
        {
            return View();
        }
        public ActionResult SuppTopSellHotelRpt()
        {
            return View();
        }
        public ActionResult SuppTopSellDestRpt()
        {
            return View();
        }

        public ActionResult ClientsGrowthVsLWBookings()
        {
            return View();
        }
        public ActionResult ClientsGrowthVsLWDestination()
        {
            return View();
        }
        public ActionResult ClientsGrowthVsLWRN()
        {
            return View();
        }
        public ActionResult BookingErrLWClients()
        {
            return View();
        }
        public ActionResult BookingErrLWDest()
        {
            return View();
        }
        public ActionResult BookingErrLWSupp()
        {
            return View();
        }
    }
}