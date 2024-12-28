using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Reporting.WebForms;
using Report.DO;

namespace Report.DAL
{
    public class ReportParamDAL
    {
        public List<ReportParameter> GetAccountRptParam(ReportFilterDO ReportParameters)
        {
            List<ReportParameter> parameters = new List<ReportParameter>();

            parameters.Add(new ReportParameter("ActiveFilters", string.IsNullOrEmpty(ReportParameters.ActiveFilters) ? "" : ReportParameters.ActiveFilters));           
            parameters.Add(new ReportParameter("GroupBy", string.IsNullOrEmpty(ReportParameters.GroupBy) ? "" : ReportParameters.GroupBy));
            parameters.Add(new ReportParameter("DateFilter", Convert.ToString(ReportParameters.DateFilter)));
            parameters.Add(new ReportParameter("PaxFilter", Convert.ToString(ReportParameters.PaxFilter)));
            parameters.Add(new ReportParameter("TypeFilter", Convert.ToString(ReportParameters.TypeFilter)));
            parameters.Add(new ReportParameter("AgencyFilter", Convert.ToString(ReportParameters.AgencyFilter)));
            parameters.Add(new ReportParameter("SellAmtFilter", Convert.ToString(ReportParameters.SellAmtFilter)));
            parameters.Add(new ReportParameter("StatusFilter", Convert.ToString(ReportParameters.StatusFilter)));
            parameters.Add(new ReportParameter("HideBy", string.IsNullOrEmpty(ReportParameters.HideBy) ? "" : ReportParameters.HideBy));




            return parameters;
        }

        public List<ReportParameter> CreditReportParem(ReportFilterDO ReportParameters, CreditReportDO CreditReport)
        {
            List<ReportParameter> parameters = new List<ReportParameter>();

            parameters.Add(new ReportParameter("FromDate", Convert.ToDateTime(CreditReport.FromDate == DateTime.MinValue ? (object)DBNull.Value : CreditReport.FromDate).ToString("dd MMM yyyy")));
            parameters.Add(new ReportParameter("ToDate", Convert.ToDateTime(CreditReport.ToDate == DateTime.MinValue ? (object)DBNull.Value : CreditReport.ToDate).ToString("dd MMM yyyy")));


            parameters.Add(new ReportParameter("HideBy", string.IsNullOrEmpty(ReportParameters.HideBy) ? "0" : ReportParameters.HideBy));




            return parameters;
        }
    }
}
