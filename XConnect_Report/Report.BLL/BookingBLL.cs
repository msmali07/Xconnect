using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Report.DO;
using Report.DAL;
using System.Web.UI.WebControls;
using System.Data;
using System.Web;
using System.Xml.Linq;
using Newtonsoft.Json.Linq;
using System.Web.Routing;
using Newtonsoft.Json;
using System.Globalization;
using System.Threading;
using System.Reflection.Emit;

namespace Report.BLL
{
    public class BookingBLL
    {



        #region Account Report
        public List<AccountReportResultDO> GeAccountReport(AccountReportDO AccSearchReportDO, int CompCode)
        {
            List<AccountReportResultDO> AccountReportList = new List<AccountReportResultDO>();
            AccountReportList = new BookingDAL().AccountStatementNew(AccSearchReportDO, CompCode);
            return AccountReportList;
        }
        public List<AccountReportResultDO> GeAccountReportV2(AccountReportDO AccSearchReportDO, int CompCode)
        {
            List<AccountReportResultDO> AccountReportList = new List<AccountReportResultDO>();
            AccountReportList = new BookingDAL().AccountStatementNewV2(AccSearchReportDO, CompCode);
            return AccountReportList;
        }
        #endregion
        public List<MarketingReportResultDO> GetMarketReport(MarketingFeeDO AccSearchReportDO, int CompCode)
        {
            List<MarketingReportResultDO> MarketReportList = new List<MarketingReportResultDO>();
            MarketReportList = new BookingDAL().MarketStatementNew(AccSearchReportDO, CompCode);
            return MarketReportList;
        }

        #region Credit Report
        public List<CreditReportResultList> GeCreditReport(CreditReportDO CreditDO, int CompCode)
        {
            List<CreditReportResultList> CreditResultList = new List<CreditReportResultList>();
            CreditResultList = new BookingDAL().GetCreditResultList(CreditDO, SessionContext.Current.AISession.CompCode, SessionContext.Current.AISession.ApplicableUrl);
            return CreditResultList;
        }
        #endregion

        #region Sales Report
        public List<SalesReportResultList> GeSalesReport(SalesReportDO SaleReportDO, int CompCode)
        {
            List<SalesReportResultList> SalesResultList = new List<SalesReportResultList>();
            SalesResultList = new BookingDAL().GetSalesReportList(SaleReportDO, SessionContext.Current.AISession.CompCode, SessionContext.Current.AISession.ApplicableUrl);
            return SalesResultList;
        }
        #endregion

        #region Production Report
        public ProductionReportResultList GeProductionReport(ProductionReportDO ProReportDO, int CompCode)
        {
            ProductionReportResultList ProResultList = new ProductionReportResultList();
            ProResultList = new BookingDAL().GetProductionReportList(ProReportDO, SessionContext.Current.AISession.CompCode, SessionContext.Current.AISession.ApplicableUrl);
            return ProResultList;
        }
        #endregion

        #region Ottila Profit And Loss Report
        public List<ProfitLossReportResultList> GeProfitLossReport(ProfitLossDO ProfitLossSearchReportDO, int CompCode)
        {
            List<ProfitLossReportResultList> ProfitLossReportList = new List<ProfitLossReportResultList>();
            ProfitLossReportList = new BookingDAL().GetProfitLoss(ProfitLossSearchReportDO, CompCode);
            return ProfitLossReportList;
        }
        #endregion


        #region Account Report-Old
        public AccountReportResponseDO GetAccountReportList(string Identity, string Dk, string Rpt, string Type, string DSearch)
        {

            AccountReportResponseDO Res = new AccountReportResponseDO();
            //DataSet Ds = new DataSet();
            //AccountReportDO AccSearchReportDO = new AccountReportDO();
            //ReportFilterDO ReportParameters = new ReportFilterDO();
            ////string SeachType = "";
            //string Fkey = "";

            //string DDSearch = (HttpUtility.UrlDecode(DSearch));

            //RouteValueDictionary objRouteValue = new RouteValueDictionary();
            //foreach (string s in DSearch.Split('&').ToArray())
            //{
            //    if (s.Split('=')[0] == "Search")
            //    {
            //        objRouteValue.Add(s.Split('=')[0], HttpUtility.UrlDecode(s.Split('=')[1]));
            //    }
            //}
            //JObject obj1 = JObject.Parse(((objRouteValue.Values.ToList()[0].ToString().Split(new string[] { "~@~" }, StringSplitOptions.None)[0]).ToString()));
            //JObject obj2 = JObject.Parse(((objRouteValue.Values.ToList()[0].ToString().Split(new string[] { "~@~" }, StringSplitOptions.None)[1]).ToString()));
            //Fkey = (objRouteValue.Values.ToList()[0].ToString().Split(new string[] { "~@~" }, StringSplitOptions.None)[2]);

            //AccSearchReportDO = Newtonsoft.Json.JsonConvert.DeserializeObject<AccountReportDO>(Convert.ToString(obj1));
            //ReportParameters = Newtonsoft.Json.JsonConvert.DeserializeObject<ReportFilterDO>(Convert.ToString(obj2));


            //List<AccountReportResultDO> AcctStatementList = new List<AccountReportResultDO>();
            //AcctStatementList = new BookingDAL().AccountStatementNew(AccSearchReportDO, SessionContext.Current.AISession.CompCode);


            //AcctStatementList = (from q in AcctStatementList
            //                     where (
            //                    (string.IsNullOrEmpty(ReportParameters.Bookstatus) || ReportParameters.Bookstatus.Split(',').Contains(q.Bookstatus)) &&
            //                    (string.IsNullOrEmpty(ReportParameters.type) || ReportParameters.type.Split(',').Contains(q.type)) &&
            //                    (string.IsNullOrEmpty(ReportParameters.ClientName) || ReportParameters.ClientName.Split(',').Contains(q.ClientName)) &&
            //                    (string.IsNullOrEmpty(ReportParameters.noofnts) || ReportParameters.noofnts.Split(',').Contains(Convert.ToString(q.noofnts))) &&
            //                    (string.IsNullOrEmpty(ReportParameters.FirstName) || ReportParameters.FirstName.Split(',').Contains(q.FirstName)) &&
            //                    (string.IsNullOrEmpty(ReportParameters.HotelName) || ReportParameters.HotelName.Split(',').Contains(q.HotelName)) &&
            //                    (string.IsNullOrEmpty(ReportParameters.SellAmount) || ReportParameters.SellAmount.Split(',').Contains(Convert.ToDecimal(q.SellAmount).ToString())) &&
            //                  //  (string.IsNullOrEmpty(ReportParameters.CheckInMonthName) || ReportParameters.CheckInMonthName.Split(',').Contains(q.CheckInMonthName)) &&                          
            //                    (string.IsNullOrEmpty(ReportParameters.RangeSellAmtOption) || SellamountRange(ReportParameters.RangeSellAmtOption, ReportParameters.RangeSellAmount, q.SellAmount))
            //                    )
            //                     select q).ToList();

            //if (AcctStatementList.Count > 0)
            //{
            //    if (!string.IsNullOrEmpty(ReportParameters.Bookstatus))
            //    {
            //        ReportParameters.StatusFilter = true;
            //        ReportParameters.ActiveFilters = "S,";
            //    }
            //    if (!string.IsNullOrEmpty(ReportParameters.type))
            //    {
            //        ReportParameters.TypeFilter = true;
            //        ReportParameters.ActiveFilters += "T,";
            //    }
            //    if (!string.IsNullOrEmpty(ReportParameters.ClientName))
            //    {
            //        ReportParameters.AgencyFilter = true;
            //        ReportParameters.ActiveFilters += "C,";
            //    }               
            //    else if (!string.IsNullOrEmpty(ReportParameters.FirstName))
            //    {
            //        ReportParameters.PaxFilter = true;
            //        ReportParameters.ActiveFilters += "P,";
            //    }

            //    if (!string.IsNullOrEmpty(ReportParameters.SellAmount))
            //    {
            //        ReportParameters.SellAmtFilter = true;
            //        ReportParameters.ActiveFilters += "A,";
            //    }
            //    if (!string.IsNullOrEmpty(ReportParameters.CheckInMonthName))
            //    {
            //        ReportParameters.DateFilter = true;
            //        ReportParameters.ActiveFilters += "D,";
            //    }
            //    if (!string.IsNullOrEmpty(ReportParameters.RangeSellAmtOption))
            //    {
            //        ReportParameters.SellAmtFilter = true;
            //    }

            //}




            //// Res.AccountFilterDO.ReportPath = Request.MapPath(Request.ApplicationPath) + @"\Reports\Account1.rdlc";
            //ReportParameters.ReportPath = HttpContext.Current.Server.MapPath("~/Reports/Account1.rdlc");
            //Res.AccountSearchDO = AccSearchReportDO;
            //Res.AccountFilterDO = ReportParameters;
            //Res.AccountRptResultList = AcctStatementList;
            return Res;
        }

        public Boolean SellamountRange(string RangeSellAmtOption, string RangeSellAmount, decimal sellamt)
        {
            bool IsDisplay = false;
            switch (RangeSellAmtOption)
            {
                case "1":
                    IsDisplay = (sellamt) == Util.GetDecimal(RangeSellAmount);
                    break;
                case "2":
                    IsDisplay = (sellamt) != Util.GetDecimal(RangeSellAmount);
                    break;
                case "3":
                    IsDisplay = (sellamt) > Util.GetDecimal(RangeSellAmount);
                    break;



            }
            return IsDisplay;
        }

        #endregion

        #region Credit Report-Old
        public CreditReportDO GetCreditReportList(string Identity, string Dk, string Rpt, string DSearch)
        {
            CreditReportDO CreditDO = new CreditReportDO();
            //DataSet Ds = new DataSet();


            //ReportFilterDO ReportParameters = new ReportFilterDO();



            //string DDSearch = (HttpUtility.UrlDecode(DSearch));

            //RouteValueDictionary objRouteValue = new RouteValueDictionary();
            //foreach (string s in DSearch.Split('&').ToArray())
            //{
            //    if (s.Split('=')[0] == "Search")
            //    {
            //        objRouteValue.Add(s.Split('=')[0], HttpUtility.UrlDecode(s.Split('=')[1]));
            //    }
            //}
            //JObject obj1 = JObject.Parse(((objRouteValue.Values.ToList()[0].ToString().Split(new string[] { "~@~" }, StringSplitOptions.None)[0]).ToString()));
            //JObject obj2 = JObject.Parse(((objRouteValue.Values.ToList()[0].ToString().Split(new string[] { "~@~" }, StringSplitOptions.None)[1]).ToString()));



            //CreditDO = Newtonsoft.Json.JsonConvert.DeserializeObject<CreditReportDO>(Convert.ToString(obj1));
            //ReportParameters = Newtonsoft.Json.JsonConvert.DeserializeObject<ReportFilterDO>(Convert.ToString(obj2));

            //List<CreditReportResultList> CreditResultList = new List<CreditReportResultList>();
            //CreditResultList = new BookingDAL().GetCreditResultList(CreditDO, SessionContext.Current.AISession.CompCode, SessionContext.Current.AISession.ApplicableUrl);


            //ReportParameters.ReportPath = HttpContext.Current.Server.MapPath("~/Reports/RptCredit.rdlc");

            //CreditDO.CreditFilterDO = ReportParameters;
            //CreditDO.CreditFilterDO.IsOnePageReport = true;
            //CreditDO.CreditReportResultList = CreditResultList;
            return CreditDO;
        }
        #endregion


        #region Net Statement Report
        public List<NetStatementReportResultDO> GeNetStatementReport(NetStatementReportDO NSSearchReportDO, int CompCode)
        {
            List<NetStatementReportResultDO> NetStatementReportList = new List<NetStatementReportResultDO>();
            NetStatementReportList = new BookingDAL().GeNetStatementReport(NSSearchReportDO, CompCode);
            return NetStatementReportList;
        }
        #endregion


        #region Daily Sales Report
        public List<DailySalesReportResultDO> GetDailySalesReport(DailySalesReportDO DSSearchReportDO, int CompCode)
        {
            return new BookingDAL().GetDailySalesReport(DSSearchReportDO, CompCode);
        }
        #endregion

        #region Corporate And CardUse Report
        public List<CorporateCardUseDO> GetCorporateCardUseData(string ReportWise, int CompCode)
        {
            return new BookingDAL().GetCorporateCardUseData(ReportWise, CompCode);
        }
        public List<CorporateCardUseReportResultDO> GetCorporateCardUseReport(CorporateCardUseReportDO CCUSearchReportDO, int CompCode)
        {
            return new BookingDAL().GetCorporateCardUseReport(CCUSearchReportDO, CompCode);
        }
        #endregion

        #region User Sales Report
        public List<UserSalesReportResultDO> GetUserSalesReport(UserSalesReportDO USSearchReportDO, int CompCode)
        {
            return new BookingDAL().GetUserSalesReport(USSearchReportDO, CompCode);
        }
        #endregion

        #region Pickup Detail Report
        public List<PickupReportResultDO> GePickupDetailReport(PickupReportDO PSearchReportDO, int CompCode, int AppUrl)
        {
            List<PickupReportResultDO> PickupReportList = new List<PickupReportResultDO>();
            CultureInfo cultureInfo = Thread.CurrentThread.CurrentCulture;
            TextInfo textInfo = cultureInfo.TextInfo;
            PickupReportList = new BookingDAL().GePickupDetailReport(PSearchReportDO, CompCode, AppUrl);
            for (var i = 0; i < PickupReportList.Count; i++)
            {
                if (PickupReportList[i].PFrom.ToLower().Contains('!') && PickupReportList[i].PickupType == 1)
                {
                    PickupReportList[i].PFrom = PickupReportList[i].PFrom.Split('!')[1];
                    PickupReportList[i].PDetail = "Flight No. " + PickupReportList[i].PDetail;
                }
                if (PickupReportList[i].PFrom.ToLower().Contains('!') && PickupReportList[i].PickupType == 4)
                {
                    PickupReportList[i].PFrom = PickupReportList[i].PFrom.Split('!')[1];
                    PickupReportList[i].PDetail = "Station : " + PickupReportList[i].PDetail;
                }
                if (PickupReportList[i].PFrom.ToLower().Contains('!') && PickupReportList[i].PickupType == 3)
                {
                    PickupReportList[i].PFrom = PickupReportList[i].PFrom.Split('!')[1];
                    PickupReportList[i].PDetail = "Ship Name/No. " + PickupReportList[i].PDetail.Split('!')[0] + "!Shipping Company. " + PickupReportList[i].PDetail.Split('!')[1] + "!" + PickupReportList[i].PDetail.Split('!')[2];
                }
                if (PickupReportList[i].DropOff.ToLower().Contains('!') && PickupReportList[i].DropOffType == 1)
                {
                    PickupReportList[i].DropOff = PickupReportList[i].DropOff.Split('!')[1];
                    PickupReportList[i].DropOffInfo = "Flight No. " + PickupReportList[i].DropOffInfo;
                }
                if (PickupReportList[i].DropOff.ToLower().Contains('!') && PickupReportList[i].DropOffType == 4)
                {
                    PickupReportList[i].DropOff = PickupReportList[i].DropOff.Split('!')[1];
                    PickupReportList[i].DropOffInfo = "Station : " + PickupReportList[i].DropOffInfo;
                }
                if (PickupReportList[i].DropOff.ToLower().Contains('!') && PickupReportList[i].DropOffType == 3)
                {
                    PickupReportList[i].DropOff = PickupReportList[i].DropOff.Split('!')[1];
                    PickupReportList[i].DropOffInfo = "Ship Name/No. " + PickupReportList[i].DropOffInfo.Split('!')[0] + "!Shipping Company. " + PickupReportList[i].DropOffInfo.Split('!')[1] + "!" + PickupReportList[i].DropOffInfo.Split('!')[2];
                }
                PickupReportList[i].LPaxName =  textInfo.ToTitleCase(PickupReportList[i].LPaxName.ToString().ToLower());
                PickupReportList[i].SName = textInfo.ToTitleCase(PickupReportList[i].SName.ToString().ToLower());
            }
            return PickupReportList;
        }
        #endregion

        #region XConnect And Loss Report
        public List<ProfitLossReportResultList> GeXConProfitLossReport(ProfitLossDO ProfitLossSearchReportDO, int CompCode)
        {
            List<ProfitLossReportResultList> ProfitLossReportList = new List<ProfitLossReportResultList>();
            ProfitLossReportList = new BookingDAL().GetXConProfitLoss(ProfitLossSearchReportDO, CompCode);
            return ProfitLossReportList;
        }
        #endregion

        #region Ottila Sales Person Wise Report
        public List<SalesPersonWiseReportResultList> GetSalesPersonWiseReport(SalesPersonWiseDO SalesPersonWiseSearchReportDO, int CompCode)
        {
            List<SalesPersonWiseReportResultList> SalesPersonWiseReportList = new List<SalesPersonWiseReportResultList>();
            SalesPersonWiseReportList = new BookingDAL().GetSalesPersonWise(SalesPersonWiseSearchReportDO, CompCode);
            return SalesPersonWiseReportList;
        }
        #endregion

        public List<ContractReportResultDO> GetContractReportDetail(ContractReportDO ConSearchReportDO, int CompCode)
        {
            List<ContractReportResultDO> ContractReportList = new List<ContractReportResultDO>();
            ContractReportList = new BookingDAL().GetContractReportDetail(ConSearchReportDO, CompCode);
            return ContractReportList;
        }

        public List<AgencyReportResultDO> GetAgencyReportDetail(AgencyReportDO AgencySearchReportDO, int CompCode)
        {
            List<AgencyReportResultDO> Agencylist = new List<AgencyReportResultDO>();
            Agencylist = new BookingDAL().GetAgencyReportDetail(AgencySearchReportDO, CompCode);
            return Agencylist; 
        }

        public List<AgencyReportResultDO> GetAgencyActivityReportDetail(AgencyReportDO AgencySearchReportDO, int CompCode)
        {
            List<AgencyReportResultDO> Agencylist = new List<AgencyReportResultDO>();
            Agencylist = new BookingDAL().GetAgencyActivityReportDetail(AgencySearchReportDO, CompCode);
            return Agencylist;
        }

        public List<Dictionary<string, object>> GetAgencyApiOutData(AgencyReportDO AgencySearchReportDO, int CompCode)
        {
            List<Dictionary<string, object>> data = new BookingDAL().GetAgencyApiOutData(AgencySearchReportDO, CompCode);
            return data;
        }

        public List<OperationalIssueResultDO> GetOperationalIssueDetail(OperationalIssueReportDO OperationalSearchReportDO, int CompCode)
        {
            List<OperationalIssueResultDO> OperationalIssuelist = new List<OperationalIssueResultDO>();
            OperationalIssuelist = new BookingDAL().GetOperationalIssueDetail(OperationalSearchReportDO, CompCode);
            return OperationalIssuelist;
        }
        public List<TransactionReportResultDO> GetTransactionDetail(TransactionReportDO TransactionSearchReportDO, int CompCode)
        {
            List<TransactionReportResultDO> TransactionIssuelist = new List<TransactionReportResultDO>();           
            TransactionIssuelist = new BookingDAL().GetTransactionDetail(TransactionSearchReportDO, CompCode);
            return TransactionIssuelist;
        }
        public List<AgencyUserReportResultDO> GetAgencyUserDetail(AgencyUserReportDO AgentUserSearchReportDO, int CompCode)
        {
            List<AgencyUserReportResultDO> AgentUserReportList = new List<AgencyUserReportResultDO>();
            AgentUserReportList = new BookingDAL().GetAgencyUserDetail(AgentUserSearchReportDO, CompCode);
            return AgentUserReportList;
        }
        public List<MemberCreditDetailsReportResultDO> GetMemberCreditDetails(MemberCreditDetailsReportDO MemberSearchReportDO, int CompCode)
        {
            List<MemberCreditDetailsReportResultDO> MemberCreditDetailsReportList = new List<MemberCreditDetailsReportResultDO>();
            MemberCreditDetailsReportList = new BookingDAL().GetMemberCreditDetails(MemberSearchReportDO, CompCode);
            return MemberCreditDetailsReportList;
        }
        public List<HotelMizeReportResultDo> GetHotelMiseReportDetail(HotelMizeReportDO HotelMiseSearchReportDO, int CompCode)
        {
            List<HotelMizeReportResultDo> HotelMisesReportResultlist = new List<HotelMizeReportResultDo>();
            HotelMisesReportResultlist = new BookingDAL().GetHotelMizeReportDetail(HotelMiseSearchReportDO, CompCode);
            return HotelMisesReportResultlist;
        }

        public List<GstReportResultList> GeGstReport(GstReportDo gstReportDO, int CompCode)
        {
            List<GstReportResultList> GstReportResultlist = new List<GstReportResultList>();
            GstReportResultlist = new BookingDAL().GetGstReportDetail(gstReportDO, CompCode);
            return GstReportResultlist;
        }
        public List<CreditReportResultList> GetTopUpReport(CreditReportDO CreditDO, int CompCode)
        {
            List<CreditReportResultList> TopUpResultList = new List<CreditReportResultList>();
            TopUpResultList = new BookingDAL().GetTopUpResultList(CreditDO, SessionContext.Current.AISession.CompCode, SessionContext.Current.AISession.ApplicableUrl);
            return TopUpResultList;
        }
    }
}

