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

namespace Report.BLL
{
    public class DashboardBLL
    {
        #region BookStatus Report
        public List<BookStatusReportResultList> GeBookStatusReport(BookStatusDO StatusSearchReportDO, int CompCode)
        {
            List<BookStatusReportResultList> BookStatusReportList = new List<BookStatusReportResultList>();
            BookStatusReportList = new DashboardDAL().GetStatusReport(StatusSearchReportDO, CompCode);
            return BookStatusReportList;
        }
        #endregion

        #region Service Booking Report
        public List<SerBookReportResultListDO> GeSerBookingReport(SerBookingDO BookSearchReportDO, int CompCode)
        {
            List<SerBookReportResultListDO> SerBookReportList = new List<SerBookReportResultListDO>();
            SerBookReportList = new DashboardDAL().GetSerBookingReport(BookSearchReportDO, CompCode);
            return SerBookReportList;
        }
        #endregion

        #region BranchProductivity Report
        public List<BranchBookingReportResultList> GeBranchProductivityReport(BranchBookingDO BrBookingSearchReportDO, int CompCode)
        {
            List<BranchBookingReportResultList> BranchProductivityReportList = new List<BranchBookingReportResultList>();
            BranchProductivityReportList = new DashboardDAL().GetBranchBookingReport(BrBookingSearchReportDO, CompCode);
            return BranchProductivityReportList;
        }
        #endregion

        #region AgentProductivity Report
        public List<AgentBookingReportResultList> GeAgencyProductivityReport(AgentBookingDO AgBookingSearchReportDO, int CompCode)
        {
            List<AgentBookingReportResultList> AgencyProductivityReportList = new List<AgentBookingReportResultList>();
            AgencyProductivityReportList = new DashboardDAL().GetAgencyBookingReport(AgBookingSearchReportDO, CompCode);
            return AgencyProductivityReportList;
        }
        #endregion

        #region SupplierProductivity Report
        public List<SupplierBookingReportResultList> GeSupplierProductivityReport(SupplierBookingDO SuppBookingSearchReportDO, int CompCode)
        {
            List<SupplierBookingReportResultList> SupplierProductivityReportList = new List<SupplierBookingReportResultList>();
            SupplierProductivityReportList = new DashboardDAL().GetSupplierBookingReport(SuppBookingSearchReportDO, CompCode);
            return SupplierProductivityReportList;
        }

        public List<BlockSupplierDO> GetSupplierListForBlock()
        {
            return new DashboardDAL().GetBlockSupplierList(SessionContext.Current.AISession.CompCode);
        }
        #endregion

        #region Failed Report
        public List<FailedBookingReportResultList> GetFailedBookingReport(FailedBookingDO FailedBookingSearchReportDO, int CompCode)
        {
            List<FailedBookingReportResultList> SupplierProductivityReportList = new List<FailedBookingReportResultList>();
            SupplierProductivityReportList = new DashboardDAL().GetFailedBookingReport(FailedBookingSearchReportDO, CompCode);
            return SupplierProductivityReportList;
        }
        #endregion

        #region SearchCityBooking Report
        public List<SearchCityBookingReportResultList> GetSearchCityBookingReport(SearchCityBookingDO SearchCityBookingSearchReportDO, int CompCode)
        {
            List<SearchCityBookingReportResultList> SearchCityReportList = new List<SearchCityBookingReportResultList>();
            SearchCityReportList = new DashboardDAL().GetSearchCityBookingReport(SearchCityBookingSearchReportDO, CompCode);
            return SearchCityReportList;
        }
        #endregion

        #region SearchAgentBooking Report
        public List<SearchAgentBookingReportResultList> GetSearchAgentBookingReport(SearchAgentBookingDO SearchAgentBookingSearchReportDO, int CompCode)
        {
            List<SearchAgentBookingReportResultList> SearchAgentReportList = new List<SearchAgentBookingReportResultList>();
            SearchAgentReportList = new DashboardDAL().GetSearchAgentBookingReport(SearchAgentBookingSearchReportDO, CompCode, SessionContext.Current.AISession.LoginMemberTypeId);
            return SearchAgentReportList;
        }
        #endregion

        #region SearchAgentBooking Report
        public List<SearchAgentBookingReportResultList> GetSearchToBookingReport(SearchAgentBookingDO SearchAgentBookingSearchReportDO, int CompCode)
        {
            List<SearchAgentBookingReportResultList> SearchAgentReportList = new List<SearchAgentBookingReportResultList>();
            SearchAgentReportList = new DashboardDAL().GetSearchToBookingReport(SearchAgentBookingSearchReportDO, CompCode, SessionContext.Current.AISession.LoginMemberTypeId);
            return SearchAgentReportList;
        }
        #endregion



    }
}
