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
    public class ReportParamBLL
    {
        //#region Account Report
        //public ReportViewer GetAccountReport(List<AccountReportResultDO> AcctStatementList, ReportFilterDO ReportParameters, string ReportPath)
        //{
                  
        //    ReportViewer reportViewer = new ReportSettingBLL().ReportSetting1(ReportParameters.IsOnePageReport);

            
        //    reportViewer.LocalReport.ReportPath = ReportPath;         
        //    reportViewer.LocalReport.DataSources.Add(new ReportDataSource("DataSet1", AcctStatementList));                     
        //    List<ReportParameter> parameters = new ReportParamDAL().GetAccountRptParam(ReportParameters);
        //    reportViewer.LocalReport.SetParameters(parameters);
             
            
        //    //AccountRptRes.strAccountResultDO = JsonConvert.SerializeObject(AcctStatementList);
        //    return reportViewer;
        //}

        //#endregion


        //#region Credit Report
        //public ReportViewer CreditReport(List<CreditReportResultList> CreditReportList, ReportFilterDO ReportParameters, CreditReportDO CreditReport)
        //{

        //    ReportViewer reportViewer = new ReportSettingBLL().ReportSetting1(ReportParameters.IsOnePageReport);


        //    //reportViewer.LocalReport.ReportPath = CreditReport.CreditFilterDO.ReportPath;
        //    reportViewer.LocalReport.DataSources.Add(new ReportDataSource("DataSet1", CreditReportList));
        //    List<ReportParameter> parameters = new ReportParamDAL().CreditReportParem(ReportParameters, CreditReport);
        //    reportViewer.LocalReport.SetParameters(parameters);

        //    return reportViewer;
        //}

        //#endregion
    }
}

  
