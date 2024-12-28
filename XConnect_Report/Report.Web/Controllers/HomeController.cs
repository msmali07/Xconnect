using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.UI.WebControls;
using Report.DO;
using Report.BLL;
using Report.DAL;
using System.Xml.Linq;
using System.IO;
using Newtonsoft.Json;

namespace Report.Web.Controllers
{

    public class HomeController : ApplicationController
    {


        #region Logout
        public ActionResult LogOut()
        {
            Session.Abandon();
            return RedirectToAction("Login", "Login");
        }
        #endregion



        public ActionResult Home()
        {
            HomeList HomeDO = new HomeList();

            HomeSearchDO SearchDO = new HomeSearchDO();
            SearchDO.IsBookingdateWise = true;
            SearchDO.InTerms = 1;
            SearchDO.Currency = "INR";
            SearchDO.BranchId = 0;
            SearchDO.DashboardDate = Convert.ToDateTime(DateTime.Today).ToString("MM/dd/yyyy");

            BookingCountListDO BookingCountDO = new BookingCountListDO();
            BookingCountDO = new HomeBLL().GetBookingListDS(SearchDO);

            List<TopBranchListDO> TopBranchList = new List<TopBranchListDO>();
           TopBranchList = new HomeBLL().GetTopBranchListDS(SearchDO);

            List<TopAgencyListDO> TopAgencyList = new List<TopAgencyListDO>();
            TopAgencyList = new HomeBLL().GetTopAgencyListDS(SearchDO);

            List<TopSupplierListDO> TopSupplierList = new List<TopSupplierListDO>();
            TopSupplierList = new HomeBLL().GetTopSupplierListDS(SearchDO);

            List<FailedSupplierListDO> TopFailedSupplierList = new List<FailedSupplierListDO>();
            TopFailedSupplierList = new HomeBLL().GetFailedSupplierListDS(SearchDO);

            List<AgActiveListDO> TopAgactiveList = new List<AgActiveListDO>();
            TopAgactiveList = new HomeBLL().GetAgActiveListDS(SearchDO);

            //List<SerachBookByCityListDO> TopSearchBookList = new List<SerachBookByCityListDO>();
            // TopSearchBookList = new HomeBLL().GetSearchBookListDS(SearchDO);


            List<ServiceBookingListDO> ServiceBookingList = new List<ServiceBookingListDO>();
           ServiceBookingList = new HomeBLL().GetServiceBookingList(SearchDO);

            // List<SerachBookByAgencyListDO> TopSearchBookByAgencyList = new List<SerachBookByAgencyListDO>();
            //   TopSearchBookByAgencyList = new HomeBLL().GetSearchBookListByAgencyDS(SearchDO);


            List<Dictionary<string, object>> AgApiOutReportList = new HomeBLL().GetAgencyApiOutData(SearchDO);


            HomeDO.BookingCountList = BookingCountDO;
            HomeDO.BranchList = TopBranchList.ToList();
            HomeDO.AgencyList = TopAgencyList.ToList();
            HomeDO.SupplierList = TopSupplierList.ToList();
            HomeDO.ServiceBookingList = ServiceBookingList.ToList();
            HomeDO.FailedSuppList = TopFailedSupplierList.ToList();
            HomeDO.AgActiveList = TopAgactiveList.ToList();
            HomeDO.SearchBookByCityList = null;
            HomeDO.SearchBookByAgencyList = null;
            HomeDO.AgApiOutReportList = AgApiOutReportList.ToList();

            return View(HomeDO);
        }

        public JsonResult GetAgencyApiOutDetail(HomeSearchDO SearchDO)
        {
            List<Dictionary<string, object>> AgApiOutactiveList = new HomeBLL().GetAgencyApiOutData(SearchDO);
            var jsonResult = Json(AgApiOutactiveList.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return jsonResult;
        }

        public JsonResult GeBookingCountList(HomeSearchDO SearchDO)
        {

            BookingCountListDO BookingCountDO = new BookingCountListDO();
            BookingCountDO = new HomeBLL().GetBookingListDS(SearchDO);


            var jsonResult = Json(BookingCountDO, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return Json(jsonResult, JsonRequestBehavior.AllowGet);
        }
        public JsonResult TopBranchList(HomeSearchDO SearchDO)
        {

            List<TopBranchListDO> TopBranchList = new List<TopBranchListDO>();
            TopBranchList = new HomeBLL().GetTopBranchListDS(SearchDO);

            var jsonResult = Json(TopBranchList, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return Json(jsonResult, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GeTopAgencyList(HomeSearchDO SearchDO)
        {

            List<TopAgencyListDO> TopAgencyList = new List<TopAgencyListDO>();
            TopAgencyList = new HomeBLL().GetTopAgencyListDS(SearchDO);

            var jsonResult = Json(TopAgencyList, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return Json(jsonResult, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GeTopSupplierList(HomeSearchDO SearchDO)
        {

            List<TopSupplierListDO> TopSupplierList = new List<TopSupplierListDO>();
            TopSupplierList = new HomeBLL().GetTopSupplierListDS(SearchDO);

            var jsonResult = Json(TopSupplierList, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return Json(jsonResult, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTopFailedSupplierList(HomeSearchDO SearchDO)
        {

            List<FailedSupplierListDO> TopFailedSupplierList = new List<FailedSupplierListDO>();
            TopFailedSupplierList = new HomeBLL().GetFailedSupplierListDS(SearchDO);

            var jsonResult = Json(TopFailedSupplierList, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return Json(jsonResult, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTopAgActiveList(HomeSearchDO SearchDO)
        {

            List<AgActiveListDO> TopAgActiveList = new List<AgActiveListDO>();
            TopAgActiveList = new HomeBLL().GetAgActiveListDS(SearchDO);

            var jsonResult = Json(TopAgActiveList, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return Json(jsonResult, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTopSearchBookList(HomeSearchDO SearchDO)
        {

            List<SerachBookByCityListDO> TopSearchBookList = new List<SerachBookByCityListDO>();
            TopSearchBookList = new HomeBLL().GetSearchBookListDS(SearchDO);


            var jsonResult = Json(TopSearchBookList, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return Json(jsonResult, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetServiceBookingList(HomeSearchDO SearchDO)
        {

            List<ServiceBookingListDO> ServiceBookingList = new List<ServiceBookingListDO>();
            ServiceBookingList = new HomeBLL().GetServiceBookingList(SearchDO);

            var jsonResult = Json(ServiceBookingList, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return Json(jsonResult, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTopSearchBookByAgencyList(HomeSearchDO SearchDO)
        {

            List<SerachBookByAgencyListDO> TopSearchBookByAgencyList = new List<SerachBookByAgencyListDO>();
            TopSearchBookByAgencyList = new HomeBLL().GetSearchBookListByAgencyDS(SearchDO);

            var jsonResult = Json(TopSearchBookByAgencyList, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return Json(jsonResult, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetYearlyBookingList(HomeSearchDO SearchDO)
        {

            List<BookingByYearList> YearlyBookingList = new List<BookingByYearList>();
            YearlyBookingList = new HomeBLL().GetYearlyBookingList(SearchDO);

            ReportViewer reportViewerHome = new ReportViewer();
            reportViewerHome = new ReportSettingBLL().ReportSetting1(true);
            reportViewerHome.Width = Unit.Pixel(1200);
            reportViewerHome.Height = Unit.Pixel(100);
            reportViewerHome.ShowToolBar = false;

            reportViewerHome.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + @"\Reports\RptDashboard.rdlc";

            reportViewerHome.LocalReport.DataSources.Add(new ReportDataSource("DataSet4", YearlyBookingList));
            List<ReportParameter> parameters = new List<ReportParameter>();
            string Today = Convert.ToDateTime(DateTime.Today).ToString("MM/dd/yyyy");
            parameters.Add(new ReportParameter("CurrentDate", Today));
            reportViewerHome.LocalReport.SetParameters(parameters);
            ViewBag.ReportViewer = reportViewerHome;

            return PartialView("YearlyGraphPartial", null);
        }



    }
}