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
    public class ProductionBLL
    {
        #region Hotel Productivity Report
        public List<HotelProductivityResultList> GetHotelProductivity(HotelProductivityReportDO HProdReportDO, int CompCode)
        {
            List<HotelProductivityResultList> ProfitLossReportList = new List<HotelProductivityResultList>();
            ProfitLossReportList = new ProductionDAL().GetHotelProductivity(HProdReportDO, CompCode);
            return ProfitLossReportList;
        }
        #endregion

        #region Hotel Productivity Report API
        public List<HotelProductivityResultList> GetHotelProductivityAPI(HotelProductivityReportDO HProdReportDO, int CompCode)
        {
            List<HotelProductivityResultList> ProfitLossReportList = new List<HotelProductivityResultList>();
            ProfitLossReportList = new ProductionDAL().GetHotelProductivityAPI(HProdReportDO, CompCode);
            return ProfitLossReportList;
        }
        #endregion
        public List<ProductivityReportResultDO> GetProductivityReport(ProductivityReportDO productivityReportDO, int compcode)
        {
            List<ProductivityReportResultDO> productivityReportRes = new List<ProductivityReportResultDO>();
            productivityReportRes = new ProductionDAL().GetProductivityRpt(productivityReportDO, compcode);
            return productivityReportRes;
        }

        public List<SalesProductivityResultDO> GetSalesReport(SalesProductivityReportDO AccSearchReportDO, int CompCode)
        {
            List<SalesProductivityResultDO> SalesReportList = new List<SalesProductivityResultDO>();
            SalesReportList = new ProductionDAL().SalesStatementNew(AccSearchReportDO, CompCode);
            return SalesReportList;
        }

        public List<HQProductivityResultDO> GetHQReport(HQProductivityReportDO AccSearchReportDO, int CompCode)
        {
            List<HQProductivityResultDO> HQReportList = new List<HQProductivityResultDO>();
            HQReportList = new ProductionDAL().HQStatementNew(AccSearchReportDO, CompCode);
            return HQReportList;
        }
    }
}
