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
    public class BookingController : ApplicationController
    {
        public string _SessionId = SessionContext.Current.AISession.SessionId;
        // GET:
        public ActionResult AccountReport()
        {
            return View();
        }
        public ActionResult AccountReportV2()
        {
            return View();
        }
        public ActionResult CreditReportDT()
        {
            return View();
        }
        public ActionResult SalesReport()
        {
            return View();
        }
        public ActionResult ProductionReport()
        {
            return View();
        }

        public ActionResult ProfitLossReport()
        {
            return View();
        }

        public ActionResult XConProfitLossReport()
        {
            return View();
        }


        public ActionResult PickupReport()
        {
            return View();
        }

        public ActionResult ContractReport1()
        {
            return View();
        }

        public ActionResult AgencyPerformanceReport()
        {
            return View();
        }

   
        public ActionResult OperationalIssueReport()
        {
            return View();
        }
        public ActionResult TransactionReport()
        {
            return View();
        }
        public ActionResult AgencyUserReport()
        {
            return View();
        }

        public ActionResult MemberCreditDetailsReport()
        {
            return View();
        }

        public ActionResult HotelMizeReport()
        {
            return View();
        }
        public ActionResult MarketingFeeReport()
        {
            return View();
        }

        public ActionResult SalesPersonWiseReport()
        {
            return View();
        }
        public ActionResult GSTReport()
        {
            return View();
        }
        public ActionResult TopUpReport()
        {
            return View();
        } 

        #region Account Report-New
        [HTTPCompression.ActionFilters.Compress]
        public JsonResult GetReportDetail(AccountReportDO AccSearchReportDO)
        {
            List<string> finalList = new List<string>();
            List<AccountReportResultDO> AcctStatementList = new List<AccountReportResultDO>();
            AcctStatementList = new BookingBLL().GeAccountReport(AccSearchReportDO, SessionContext.Current.AISession.CompCode);

            var jsonResult = Json(AcctStatementList.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return jsonResult;
        }

        public JsonResult ReportMailDesign(List<AccountReportResultDO> AcctStatementList, SendMailDO SendMailDO)
        {
            string Status = string.Empty;
            SendMailDO.Status = System.Configuration.ConfigurationManager.AppSettings["Status"].ToString().ToUpper();
            Status = new ReportMailBLL().ReportMailDesign(AcctStatementList, SendMailDO);
            return Json(Status, JsonRequestBehavior.AllowGet);
        }

        [HTTPCompression.ActionFilters.Compress]
        public JsonResult GetReportDetailV2(AccountReportDO AccSearchReportDO)
        {
            List<string> finalList = new List<string>();
            List<AccountReportResultDO> AcctStatementList = new List<AccountReportResultDO>();
            AcctStatementList = new BookingBLL().GeAccountReportV2(AccSearchReportDO, SessionContext.Current.AISession.CompCode);

            var jsonResult = Json(AcctStatementList.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return jsonResult;
        }
        #endregion

        [HTTPCompression.ActionFilters.Compress]
        public JsonResult GetMarketFeeDetail(MarketingFeeDO AccSearchReportDO)
        {
            List<string> finalList = new List<string>();
            List<MarketingReportResultDO> MarketFeetList = new List<MarketingReportResultDO>();
            MarketFeetList = new BookingBLL().GetMarketReport(AccSearchReportDO, SessionContext.Current.AISession.CompCode);

            var jsonResult = Json(MarketFeetList.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return jsonResult;
        }

        #region Credit Report-New

        public JsonResult GetCreditReport(CreditReportDO CreditReportDO)
        {
            List<string> finalList = new List<string>();
            List<CreditReportResultList> CreditResultList = new List<CreditReportResultList>();
            CreditResultList = new BookingBLL().GeCreditReport(CreditReportDO, SessionContext.Current.AISession.CompCode);

            var jsonResult = Json(CreditResultList.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return jsonResult;
        }
        #endregion

        #region Sales Report
        [HTTPCompression.ActionFilters.Compress]
        public JsonResult GetSalesReport(SalesReportDO SalesReportDO)
        {
            List<string> finalList = new List<string>();
            List<SalesReportResultList> SalesReportList = new List<SalesReportResultList>();
            SalesReportList = new BookingBLL().GeSalesReport(SalesReportDO, SessionContext.Current.AISession.CompCode);

            var jsonResult = Json(SalesReportList.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return jsonResult;
        }
        #endregion

        #region Production Report
        [HTTPCompression.ActionFilters.Compress]
        public JsonResult GetProductionReport(ProductionReportDO ProductionReportDO)
        {
            List<string> finalList = new List<string>();
            ProductionReportResultList ProdtnReportList = new ProductionReportResultList();
            ProdtnReportList = new BookingBLL().GeProductionReport(ProductionReportDO, SessionContext.Current.AISession.CompCode);

            var jsonResult = Json(ProdtnReportList, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return jsonResult;
        }
        #endregion

        #region Ottila Profit Loss Report

        [HTTPCompression.ActionFilters.Compress]
        public JsonResult GetProfitLossReport(ProfitLossDO ProfitLossReportDO)
        {
            List<string> finalList = new List<string>();
            List<ProfitLossReportResultList> ProfitLosstList = new List<ProfitLossReportResultList>();
            ProfitLosstList = new BookingBLL().GeProfitLossReport(ProfitLossReportDO, SessionContext.Current.AISession.CompCode);

            var jsonResult = Json(ProfitLosstList.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return jsonResult;
        }
        #endregion

        #region XConnect Profit Loss Report

        [HTTPCompression.ActionFilters.Compress]
        public JsonResult GetXConProfitLossReport(ProfitLossDO ProfitLossReportDO)
        {
            List<string> finalList = new List<string>();
            List<ProfitLossReportResultList> ProfitLosstList = new List<ProfitLossReportResultList>();
            ProfitLosstList = new BookingBLL().GeXConProfitLossReport(ProfitLossReportDO, SessionContext.Current.AISession.CompCode);

            var jsonResult = Json(ProfitLosstList.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return jsonResult;
        }
        #endregion


        #region Account Report-Rdlc
        public ActionResult AccountReportNew(string SearchType, string Rpt, String Dk)
        {
            AccountReportResponseDO AccResponse = new AccountReportResponseDO();
            if (string.IsNullOrEmpty(SearchType))
            {

                return View(AccResponse);
            }
            else
            {

                string DecryptKey = Guid.NewGuid().ToString() + "_" + SessionContext.Current.AISession.SessionId;

                string RptSearch = EncryptDecrypt.GetEncryptedParametrs(Request, DecryptKey);
                return RedirectToAction("AccountReportDetail", new { @Identity = _SessionId, @Rpt = RptSearch, @Type = SearchType, @Dk = DecryptKey });

            }

        }

        public ActionResult AccountReportDetail(string Identity, string Dk, string Rpt, string Type)
        {

            string DSearch = EncryptDecrypt.GetDecryptedParametrs(Request, Dk);

            AccountReportResponseDO AccountReportDO = new AccountReportResponseDO();

            AccountReportDO = new BookingBLL().GetAccountReportList(Identity, Dk, Rpt, Type, DSearch);

            //  AccountReportDO.AccountRdlc = new ReportParamBLL().GetAccountReport(AccountReportDO.AccountRptResultList, AccountReportDO.AccountFilterDO, AccountReportDO.AccountFilterDO.ReportPath);

            AccountReportDO.TotalRecords = AccountReportDO.AccountRptResultList.Count();
            AccountReportDO.AccountResultJosn = JsonConvert.SerializeObject(AccountReportDO.AccountRptResultList);
            ViewBag.RptSearch = DSearch;
            ViewBag.ReportViewer = AccountReportDO.AccountRdlc;
            TempData["SearchType"] = "1";
            return View("AccountReportNew", AccountReportDO);

        }

        public JsonResult GetReportDetail_New(int Type, int Record)
        {

            //List<string> finalList = new List<string>();

            //AccountReportDO AccSearchReportDO = new AccountReportDO();

            //AccSearchReportDO.StartTime = DateTime.Now.ToString("h:mm:ss tt");
            //AccSearchReportDO.ArrivalFrom = Convert.ToDateTime("01 Jan 2019");
            //AccSearchReportDO.ArrivalTo = Convert.ToDateTime("31 Dec 2019");
            //AccSearchReportDO.BookingdateWise = false;
            //AccSearchReportDO.LoginMemberId = 1;
            //AccSearchReportDO.LoginUserId = 566;
            //AccSearchReportDO.MemberId = 1;

            //List<AccountReportResultDO> AcctStatementList = new List<AccountReportResultDO>();

            //AcctStatementList = new BookingDAL().AccountStatementNew(AccSearchReportDO, 1);

            //AccSearchReportDO.Count = AcctStatementList.Count;


            //AccSearchReportDO.EndTime = DateTime.Now.ToString("h:mm:ss tt");
            //if (Type == 1)
            //{

            //}
            //else
            //{
            //    AccSearchReportDO.AcctStatementList = new List<AccountReportResultDO>();
            //    AccSearchReportDO.AcctStatementList = AcctStatementList.Take(Record).ToList();
            //}

            //var jsonResult = Json(AccSearchReportDO, JsonRequestBehavior.AllowGet);
            //jsonResult.MaxJsonLength = int.MaxValue;
            //return jsonResult;
            return Json(1, JsonRequestBehavior.AllowGet);

        }

        #endregion

        #region Credit Report-Rdlc
        public ActionResult CreditReport(string SearchType, string Rpt, String Dk)
        {
            CreditReportDO CreditReport = new CreditReportDO();
            if (string.IsNullOrEmpty(SearchType))
            {

                return View(CreditReport);
            }
            else
            {

                string DecryptKey = Guid.NewGuid().ToString() + "_" + SessionContext.Current.AISession.SessionId;
                string RptSearch = EncryptDecrypt.GetEncryptedParametrs(Request, DecryptKey);
                return RedirectToAction("CreditReportDetail", new { @Identity = _SessionId, @Rpt = RptSearch, @Type = SearchType, @Dk = DecryptKey });

            }

        }

        public ActionResult CreditReportDetail(string Identity, string Dk, string Rpt, string Type)
        {
            CreditReportDO CreditReport = new CreditReportDO();
            List<CreditReportResultList> CreditResultList = new List<CreditReportResultList>();
            string DSearch = EncryptDecrypt.GetDecryptedParametrs(Request, Dk);

            CreditReport = new BookingBLL().GetCreditReportList(_SessionId, Dk, Rpt, DSearch);
            // CreditReport.CreditRdlc = new ReportParamBLL().CreditReport(CreditResultList, CreditReport.CreditFilterDO, CreditReport);

            // CreditReport.TotalRecords = CreditResultList.Count();
            // CreditReport.ResultJosn = JsonConvert.SerializeObject(CreditResultList);
            ViewBag.RptSearch = DSearch;
            // ViewBag.ReportViewer = CreditReport.CreditRdlc;
            TempData["SearchType"] = "1";

            return View("CreditReport", CreditReport);

        }


        #endregion

        #region Net Statement Report
        public ActionResult NetStatementReport()
        {
            return View();
        }

        [HTTPCompression.ActionFilters.Compress]
        public JsonResult GetNSReportDetail(NetStatementReportDO NSSearchReportDO)
        {
            List<string> finalList = new List<string>();
            List<NetStatementReportResultDO> NetStatementList = new List<NetStatementReportResultDO>();
            NetStatementList = new BookingBLL().GeNetStatementReport(NSSearchReportDO, SessionContext.Current.AISession.CompCode);

            var jsonResult = Json(NetStatementList.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return jsonResult;
        }
        #endregion


        #region Daily Sales Report
        public ActionResult DailySalesReport()
        {
            return View();
        }

        [HTTPCompression.ActionFilters.Compress]
        public JsonResult GetDSReportDetail(DailySalesReportDO DSSearchReportDO)
        {
            List<string> finalList = new List<string>();
            List<DailySalesReportResultDO> DailySalesList = new List<DailySalesReportResultDO>();
            DailySalesList = new BookingBLL().GetDailySalesReport(DSSearchReportDO, SessionContext.Current.AISession.CompCode);

            var jsonResult = Json(DailySalesList.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return jsonResult;
        }
        #endregion

        #region Corporate And Card Use Report
        public ActionResult CorporateCardUseReport()
        {
            return View();
        }

        [HTTPCompression.ActionFilters.Compress]
        public JsonResult GetCCardUseData(string ReportWise)
        {
            List<string> finalList = new List<string>();
            List<CorporateCardUseDO> CCUList = new List<CorporateCardUseDO>();
            CCUList = new BookingBLL().GetCorporateCardUseData(ReportWise, SessionContext.Current.AISession.CompCode);

            var jsonResult = Json(CCUList.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return jsonResult;
        }
        public JsonResult GetCCUDetail(CorporateCardUseReportDO CCUSearchReportDO)
        {
            List<string> finalList = new List<string>();
            List<CorporateCardUseReportResultDO> CCUReportList = new List<CorporateCardUseReportResultDO>();
            CCUReportList = new BookingBLL().GetCorporateCardUseReport(CCUSearchReportDO, SessionContext.Current.AISession.CompCode);
            List<CorporateCardUseReportResultDO> CCUFinalReportList = new List<CorporateCardUseReportResultDO>();

            CCUFinalReportList = (from data in CCUReportList
                                  group data by new { data.RefNo }
                                  into d
                                  select new CorporateCardUseReportResultDO
                                  {
                                      CName = d.First().CName,
                                      CUse = d.First().CUse,
                                      VNo = d.First().VNo,
                                      RefNo = d.First().RefNo,
                                      NORooms = d.Count(),
                                      Nts = d.First().Nts,
                                      Pax = d.First().Pax,
                                      BookDate = d.First().BookDate,
                                      ChkIn = d.First().ChkIn,
                                      ChkOut = d.First().ChkOut,
                                      SName = d.First().SName,
                                      City = d.First().City,
                                      SupName = d.First().SupName,
                                      NCurr = d.First().NCurr,
                                      NAmt = d.First().NAmt,
                                      SCurr = d.First().SCurr,
                                      SAmt = d.First().SAmt,
                                      NOPax = d.Sum(x => x.NoOfAdult) + " Adult" + (d.Sum(x => x.NoOfChild) > 0 ? " " + d.Sum(x => x.NoOfChild) + " Child" : ""),
                                  }).ToList();

            var jsonResult = Json(CCUFinalReportList.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return jsonResult;
        }
        #endregion


        #region User Sales Report
        public ActionResult UserSalesReport()
        {
            return View();
        }

        [HTTPCompression.ActionFilters.Compress]
        public JsonResult GetUSReportDetail(UserSalesReportDO USSearchReportDO)
        {
            List<string> finalList = new List<string>();
            List<UserSalesReportResultDO> UserSalesList = new List<UserSalesReportResultDO>();
            UserSalesList = new BookingBLL().GetUserSalesReport(USSearchReportDO, SessionContext.Current.AISession.CompCode);

            var jsonResult = Json(UserSalesList.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return jsonResult;
        }
        #endregion

        #region Pickup Detail Report
        [HTTPCompression.ActionFilters.Compress]
        public JsonResult GetPickupReportDetail(PickupReportDO PSearchReportDO)
        {
            List<string> finalList = new List<string>();
            List<PickupReportResultDO> NetStatementList = new List<PickupReportResultDO>();
            NetStatementList = new BookingBLL().GePickupDetailReport(PSearchReportDO, SessionContext.Current.AISession.CompCode, SessionContext.Current.AISession.ApplicableUrl);

            var jsonResult = Json(NetStatementList.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return jsonResult;
        }
        #endregion

        #region Contract Report
        [HTTPCompression.ActionFilters.Compress]
        public JsonResult GetContractReportDetail(ContractReportDO ContractSearchReportDO)
        {
            List<string> finalList = new List<string>();
            List<ContractReportResultDO> Contractlist = new List<ContractReportResultDO>();
            Contractlist = new BookingBLL().GetContractReportDetail(ContractSearchReportDO, SessionContext.Current.AISession.CompCode);

            var jsonResult = Json(Contractlist.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return jsonResult;
        }
        #endregion



        #region AgencyPerformace Report
        [HTTPCompression.ActionFilters.Compress]
        public JsonResult GetAgencyReportDetail(AgencyReportDO AgencySearchReportDO)
        {
            List<string> finalList = new List<string>();
            List<AgencyReportResultDO> Agencylist = new List<AgencyReportResultDO>();
            Agencylist = new BookingBLL().GetAgencyReportDetail(AgencySearchReportDO, SessionContext.Current.AISession.CompCode);

            var jsonResult = Json(Agencylist.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return jsonResult;
        }
        #endregion


      

        #region Operational Issue Report
        [HTTPCompression.ActionFilters.Compress]
        public JsonResult GetOperationalIssueDetail(OperationalIssueReportDO OperationalSearchReportDO)
        {
            List<string> finalList = new List<string>();
            List<OperationalIssueResultDO> OperationalIssuelist = new List<OperationalIssueResultDO>();
            OperationalIssuelist = new BookingBLL().GetOperationalIssueDetail(OperationalSearchReportDO, SessionContext.Current.AISession.CompCode);

            var jsonResult = Json(OperationalIssuelist.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return jsonResult;
        }
        #endregion


        #region Transaction Issue Report
        [HTTPCompression.ActionFilters.Compress]
        public JsonResult GetTransactionDetail(TransactionReportDO TransactionSearchReportDO)
        {
            List<string> finalList = new List<string>();
            List<TransactionReportResultDO> TransactionIssuelist = new List<TransactionReportResultDO>();
            TransactionIssuelist = new BookingBLL().GetTransactionDetail(TransactionSearchReportDO, SessionContext.Current.AISession.CompCode);

            var jsonResult = Json(TransactionIssuelist.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return jsonResult;
        }
        #endregion

        #region Agency User Report
        [HTTPCompression.ActionFilters.Compress]
        public JsonResult GetAgencyUserDetail(AgencyUserReportDO AgentUserSearchReportDO)
        {
            List<string> finalList = new List<string>();
            List<AgencyUserReportResultDO> AgentUserReportList = new List<AgencyUserReportResultDO>();
            AgentUserReportList = new BookingBLL().GetAgencyUserDetail(AgentUserSearchReportDO, SessionContext.Current.AISession.CompCode);

            var jsonResult = Json(AgentUserReportList.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return jsonResult;
        }
        #endregion

        #region Member Credit Detail Report
        [HTTPCompression.ActionFilters.Compress]
        public JsonResult GetMemberCreditDetails(MemberCreditDetailsReportDO MemberSearchReportDO)
        {
            List<string> finalList = new List<string>();
            List<MemberCreditDetailsReportResultDO> MemberCreditDetailsReportList = new List<MemberCreditDetailsReportResultDO>();
            MemberCreditDetailsReportList = new BookingBLL().GetMemberCreditDetails(MemberSearchReportDO, SessionContext.Current.AISession.CompCode);

            var jsonResult = Json(MemberCreditDetailsReportList.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return jsonResult;
        }
        #endregion

        #region Hotel Mize Report
        public JsonResult GetHotelMiseReportDetail(HotelMizeReportDO HotelMiseSearchReportDO)
        {
            List<string> finallist = new List<string>();
            List<HotelMizeReportResultDo> HotelMiseReportlist = new List<HotelMizeReportResultDo>();
            HotelMiseReportlist = new BookingBLL().GetHotelMiseReportDetail(HotelMiseSearchReportDO, SessionContext.Current.AISession.CompCode);

            var jsonResult = Json(HotelMiseReportlist.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return jsonResult;
        }
        #endregion

        #region Ottila Sales Person Wise Report

        [HTTPCompression.ActionFilters.Compress]
        public JsonResult GetSalesPersonWiseReport(SalesPersonWiseDO SalesPersonWiseReportDO)
        {
            List<string> finalList = new List<string>();
            List<SalesPersonWiseReportResultList> SalesPersonWiseList = new List<SalesPersonWiseReportResultList>();
            SalesPersonWiseList = new BookingBLL().GetSalesPersonWiseReport(SalesPersonWiseReportDO, SessionContext.Current.AISession.CompCode);

            var jsonResult = Json(SalesPersonWiseList.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return jsonResult;
        }
        #endregion

        public JsonResult GetGstReport(GstReportDo gstReportDO)
        {
            List<string> finalList = new List<string>();
            List<GstReportResultList> GstResultList = new List<GstReportResultList>();
            GstResultList = new BookingBLL().GeGstReport(gstReportDO, SessionContext.Current.AISession.CompCode);

            var jsonResult = Json(GstResultList.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return jsonResult;
        }
        public JsonResult GetTopUpReport(CreditReportDO CreditReportDO)
        {
            List<string> finalList = new List<string>();
            List<CreditReportResultList> CreditResultList = new List<CreditReportResultList>();
            CreditResultList = new BookingBLL().GetTopUpReport(CreditReportDO, SessionContext.Current.AISession.CompCode);

            var jsonResult = Json(CreditResultList.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return jsonResult;
        }
    }
}