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
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Web.Routing;
using System.Text;
using System.Reflection;
using SautinSoft;
using System.IO;
using System.Web.Hosting;

namespace Report.Web.Controllers
{    
    public class DashboardController : ApplicationController
    {
        // GET: Dashboard
        public ActionResult BookStatusReport()
        {
            return View();
        }
        public ActionResult ServiceBookingReport()
        {
            return View();
        }

        public ActionResult BranchProductivityReport()
        {
            return View();
        }

        public ActionResult AgentProductivityReport()
        {
            return View();
        }

        public ActionResult AgencyActivityReport()
        {
            return View();
        }
        public ActionResult AgencyActivityApiOut()
        {
            return View();
        }


        public ActionResult SupplierSelloutReport()
        {
            return View();
        }
        public ActionResult FailedBookingReport()
        {
            return View();
        }

        public ActionResult SearchCityBookingReport()
        {
            return View();
        }

        public ActionResult SearchAgentBookingReport()
        {
            return View();
        }

        public ActionResult SearchToBookingReport()
        {
            return View();
        }



        #region BookStatus Report
        [HTTPCompression.ActionFilters.Compress]
        public JsonResult GetBoookStatusReport(BookStatusDO BoookStatusReportDO)
        {
            List<string> finalList = new List<string>();
            List<BookStatusReportResultList> BookStatustList = new List<BookStatusReportResultList>();
            BookStatustList = new DashboardBLL().GeBookStatusReport(BoookStatusReportDO, SessionContext.Current.AISession.CompCode);

            var jsonResult = Json(BookStatustList.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return Json(jsonResult, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region Servicewise Report
        [HTTPCompression.ActionFilters.Compress]
        public JsonResult GetSerBookingReport(SerBookingDO SerBookingReportDO)
        {
            List<string> finalList = new List<string>();
            List<SerBookReportResultListDO> SerBookingList = new List<SerBookReportResultListDO>();
            SerBookingList = new DashboardBLL().GeSerBookingReport(SerBookingReportDO, SessionContext.Current.AISession.CompCode);

            var jsonResult = Json(SerBookingList.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return Json(jsonResult, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region BranchBooking Report
        [HTTPCompression.ActionFilters.Compress]        
        public JsonResult GetBranchBookingReport(BranchBookingDO BrBookingReportDO)
        {

            List<BranchBookingReportResultList> BrBookingReportList = new List<BranchBookingReportResultList>();
            BrBookingReportList = new DashboardBLL().GeBranchProductivityReport(BrBookingReportDO, SessionContext.Current.AISession.CompCode);

            var jsonResult = Json(BrBookingReportList.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            //return jsonResult;
            return Json(jsonResult, JsonRequestBehavior.AllowGet);

            //if (SessionContext.Current.AISession.SessionId == null)
            //{
            // //  string Result = "[{\"Session\":\"" + false + "\",\"Result\":\"" + JsonConvert.SerializeObject(BrBookingReportList.ToList(), new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore }) + "}]";
            //    return Json(new { session = HasSession(), Result= jsonResult }, JsonRequestBehavior.AllowGet);
            //   // return Json(Result, "application/json", System.Text.Encoding.UTF8, JsonRequestBehavior.AllowGet);
            //}
            //else
            //{
            //    // string Result = "[{\"Session\":\"" + true + "\",\"Result\":\"" + JsonConvert.SerializeObject(BrBookingReportList.ToList(), new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore }) + "}]";
            //    return Json(new { session = true, Result = jsonResult }, JsonRequestBehavior.AllowGet);
            //    //  return Json(Result, "application/json", System.Text.Encoding.UTF8, JsonRequestBehavior.AllowGet);
            //    //return jsonResult;
            //}



            

        }

        #endregion

        #region AgenctBooking Report
        [HTTPCompression.ActionFilters.Compress]
        public JsonResult GetAgentBookingReport(AgentBookingDO AgBookingReportDO)
        {

            List<AgentBookingReportResultList> AgBookingReportList = new List<AgentBookingReportResultList>();
            AgBookingReportList = new DashboardBLL().GeAgencyProductivityReport(AgBookingReportDO, SessionContext.Current.AISession.CompCode);

            var jsonResult = Json(AgBookingReportList.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return Json(jsonResult, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region AgencyActivity Report
        [HTTPCompression.ActionFilters.Compress]
        public JsonResult GetAgencyActivityReportDetail(AgencyReportDO AgencySearchReportDO)
        {
            List<string> finalList = new List<string>();
            List<AgencyReportResultDO> Agencylist = new List<AgencyReportResultDO>();
            Agencylist = new BookingBLL().GetAgencyActivityReportDetail(AgencySearchReportDO, SessionContext.Current.AISession.CompCode);

            var jsonResult = Json(Agencylist.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return jsonResult;
        }
        #endregion

        #region AgencyActivity Report
        [HTTPCompression.ActionFilters.Compress]
        public JsonResult GetAgencyApiOutDetail(AgencyReportDO AgencySearchReportDO)
        {
            List<Dictionary<string, object>> AgApiOutactiveList = new BookingBLL().GetAgencyApiOutData(AgencySearchReportDO, SessionContext.Current.AISession.CompCode);
            var jsonResult = Json(AgApiOutactiveList.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return jsonResult;
        }
        #endregion

        #region SupplierBooking Report
        [HTTPCompression.ActionFilters.Compress]
        public JsonResult GetSupplierBookingReport(SupplierBookingDO SuppBookingReportDO)
        {

            List<SupplierBookingReportResultList> SuppBookingReportList = new List<SupplierBookingReportResultList>();
            SuppBookingReportList = new DashboardBLL().GeSupplierProductivityReport(SuppBookingReportDO, SessionContext.Current.AISession.CompCode);


            List<BlockSupplierDO> objBlockSupplierList = new List<BlockSupplierDO>();
            objBlockSupplierList = new DashboardBLL().GetSupplierListForBlock();


            SupplierProdReportList SupplierReportList = new SupplierProdReportList();
            SupplierReportList.MainResultlist = SuppBookingReportList;
            SupplierReportList.BlockSupplierlist = objBlockSupplierList;

            var jsonResult = Json(SupplierReportList, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
           
           

            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });

            return Json(jsonResult, JsonRequestBehavior.AllowGet);


        }

        #endregion

        #region FailedBooking Report 
        [HTTPCompression.ActionFilters.Compress]
        public JsonResult GetFailedBookingReport(FailedBookingDO FailedBookingReportDO)
        {

            List<FailedBookingReportResultList> FailedBookingReportList = new List<FailedBookingReportResultList>();
            FailedBookingReportList = new DashboardBLL().GetFailedBookingReport(FailedBookingReportDO, SessionContext.Current.AISession.CompCode);

            var jsonResult = Json(FailedBookingReportList.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return Json(jsonResult, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region SearchCityBooking Report 
        [HTTPCompression.ActionFilters.Compress]
        public JsonResult GetSearchCityBookingReport(SearchCityBookingDO SearchCityBookingSearchReportDO)
        {

            List<SearchCityBookingReportResultList> SearchCityReportList = new List<SearchCityBookingReportResultList>();
            SearchCityReportList = new DashboardBLL().GetSearchCityBookingReport(SearchCityBookingSearchReportDO, SessionContext.Current.AISession.CompCode);

            var jsonResult = Json(SearchCityReportList.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return Json(jsonResult, JsonRequestBehavior.AllowGet);
        }

        #endregion


        #region SearchAgentBooking Report 
        [HTTPCompression.ActionFilters.Compress]
        public JsonResult GetSearchAgentBookingReport(SearchAgentBookingDO SearchAgentBookingSearchReportDO)
        {

            List<SearchAgentBookingReportResultList> SearchAgentReportList = new List<SearchAgentBookingReportResultList>();
            SearchAgentReportList = new DashboardBLL().GetSearchAgentBookingReport(SearchAgentBookingSearchReportDO, SessionContext.Current.AISession.CompCode);

            var jsonResult = Json(SearchAgentReportList.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return Json(jsonResult, JsonRequestBehavior.AllowGet);
        }

        #endregion


        #region SearchToBookReport
        public JsonResult GetSearchToBookingReport(SearchAgentBookingDO SearchAgentBookingSearchReportDO)
        {
            List<SearchAgentBookingReportResultList> SearchAgentReportList = new List<SearchAgentBookingReportResultList>();
            SearchAgentReportList = new DashboardBLL().GetSearchToBookingReport(SearchAgentBookingSearchReportDO, SessionContext.Current.AISession.CompCode);

            var jsonResult = Json(SearchAgentReportList.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return Json(jsonResult, JsonRequestBehavior.AllowGet);
        }
        #endregion


        public ActionResult GetBRCompareReportList(List<CompareBrList> ReportList)
        {

          

            ReportViewer reportViewerHome = new ReportViewer();
            reportViewerHome = new ReportSettingBLL().ReportSetting1(true);
            reportViewerHome.Width = Unit.Pixel(1200);
            reportViewerHome.Height = Unit.Pixel(100);
            reportViewerHome.ShowToolBar = false;

            reportViewerHome.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + @"\Reports\RptBRCompareReport.rdlc";

            reportViewerHome.LocalReport.DataSources.Add(new ReportDataSource("DataSet5", ReportList));
            List<ReportParameter> parameters = new List<ReportParameter>();
            string Today = Convert.ToDateTime(DateTime.Today).ToString("MM/dd/yyyy");
            parameters.Add(new ReportParameter("CurrentDate", Today));
            reportViewerHome.LocalReport.SetParameters(parameters);
            ViewBag.ReportViewer = reportViewerHome;

            return PartialView("YearlyGraphPartial", null);
        }

        
    }
}