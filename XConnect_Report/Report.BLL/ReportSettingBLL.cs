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
    public class ReportSettingBLL
    {
        public ReportViewer ReportSetting1(bool IsOnePageReport)
        {
            ReportViewer reportViewer = new ReportViewer();
            reportViewer.ProcessingMode = ProcessingMode.Local;
            reportViewer.SizeToReportContent = true;
            reportViewer.ZoomMode = ZoomMode.PageWidth;
            reportViewer.Width = Unit.Pixel(1600);
            reportViewer.Height = Unit.Pixel(100);
            reportViewer.ShowBackButton = false;
            reportViewer.ShowPrintButton = false;
            reportViewer.ShowZoomControl = false;
            reportViewer.ShowRefreshButton = false;
            reportViewer.Reset();
            reportViewer.LocalReport.DataSources.Clear();
            reportViewer.LocalReport.Refresh();
            reportViewer.LocalReport.EnableHyperlinks = true;
            if(IsOnePageReport == true)
            {
                reportViewer.ShowToolBar = false;
            }

            return reportViewer;
        }
    }
}
