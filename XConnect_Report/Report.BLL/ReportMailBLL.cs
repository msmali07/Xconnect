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
using SautinSoft; 

namespace Report.BLL
{
    public class ReportMailBLL
    {
        public string  ReportMailDesign(List<AccountReportResultDO> AcctStatementList, SendMailDO SendMailDO)
        {
            string htmlVoucher = string.Empty;

           string Success = "false";

            htmlVoucher += "<html>";
            htmlVoucher += "<head>";
            htmlVoucher += "<meta charset='utf-8'/>";
            #region CSS
            htmlVoucher += "<style type='text/css'>";
            htmlVoucher += "* {box-sizing: border-box;-moz-box-sizing: border-box; font-family:roboto, sans-serif;}";
            htmlVoucher += ".page {width:21cm;margin: 1cm auto;background: white; border:1px solid #ffffff;}";
            htmlVoucher += "@page {size: A4;color:#ff0000;margin: 1cm auto;}";
            htmlVoucher += "@page:left { margin-left: 3cm;}";

            htmlVoucher += "@page:right { margin-right : 4cm;}";
            htmlVoucher += "@media print{.page{margin:0;border:initial;border-radius:initial;width:initial;min-height:initial;box-shadow:initial;background:initial;page-break-after:always;}";

            htmlVoucher += "</style>";
            #endregion
            htmlVoucher += "</head>";
            htmlVoucher += "<body style=\"font-size:14px !important;font-family:'Roboto', sans-serif;\">";

            htmlVoucher += "<label style=\"font-size:20px !important;font-family:'Roboto', sans - serif;\">Account Report</label>";

            htmlVoucher += "<br></br>";

            htmlVoucher += "<table  width=\"100%\" style=\"font-size:14px;\">";

            htmlVoucher += "<tr>";
            htmlVoucher += "<td align=\"left\" style=\"color:#696969;padding: 5px;font-size: 12px;\"><b>Book Ref No</b></td>";
            htmlVoucher += "<td align=\"left\" style=\"color:#696969;padding: 5px;font-size: 12px;\"><b>Service Date</b></td>";
            htmlVoucher += "<td align=\"left\" style=\"color:#696969;padding: 5px;font-size: 12px;\"><b>Nights</b></td>";
            htmlVoucher += "<td align=\"left\" style=\"color:#696969;padding: 5px;font-size: 12px;\"><b>Pax Name</b></td>";
            htmlVoucher += "<td align=\"left\" style=\"color:#696969;padding: 5px;font-size: 12px;\"><b>Type</b></td>";
            htmlVoucher += "<td align=\"left\" style=\"color:#696969;padding: 5px;font-size: 12px;\"><b>Service Name</b></td>";
            htmlVoucher += "<td align=\"left\" style=\"color:#696969;padding: 5px;font-size: 12px;\"><b>Agency Name</b></td>";
            htmlVoucher += "<td align=\"left\" style=\"color:#696969;padding: 5px;font-size: 12px;\"><b>Sell Amount</b></td>";
            htmlVoucher += "<td align=\"left\" style=\"color:#696969;padding: 5px;font-size: 12px;\"><b>Currency</b></td>";
            htmlVoucher += "</tr>";

            for(int i = 0;i< AcctStatementList.Count();i++)
            {
                htmlVoucher += "<tr>";
                htmlVoucher += "<td align=\"left\" style=\"color:#696969;padding: 5px;font-size: 12px;\">" + AcctStatementList[i].RefNo + "</td>";
                htmlVoucher += "<td align=\"left\" style=\"color:#696969;padding: 5px;font-size: 12px;\">" + AcctStatementList[i].ChkIn + "</td>";
                htmlVoucher += "<td align=\"left\" style=\"color:#696969;padding: 5px;font-size: 12px;\">" + AcctStatementList[i].Nts + "</td>";
                htmlVoucher += "<td align=\"left\" style=\"color:#696969;padding: 5px;font-size: 12px;\">" + AcctStatementList[i].Pax + "</td>";
                htmlVoucher += "<td align=\"left\" style=\"color:#696969;padding: 5px;font-size: 12px;\">" + AcctStatementList[i].SType + "</td>";
                htmlVoucher += "<td align=\"left\" style=\"color:#696969;padding: 5px;font-size: 12px;\">" + AcctStatementList[i].SName + "</td>";
                htmlVoucher += "<td align=\"left\" style=\"color:#696969;padding: 5px;font-size: 12px;\">" + AcctStatementList[i].AgName + "</td>";
                htmlVoucher += "<td align=\"left\" style=\"color:#696969;padding: 5px;font-size: 12px;\">" + AcctStatementList[i].SAmt + "</td>";
                htmlVoucher += "<td align=\"left\" style=\"color:#696969;padding: 5px;font-size: 12px;\">" + AcctStatementList[i].SCurr + "</td>";
                htmlVoucher += "</tr>";
            }
          



            htmlVoucher += "</table>";

            htmlVoucher += "</div></center></body></html>";


            SendMailDO mail = new SendMailDO();
            mail.MailTo = SendMailDO.MailTo;
            mail.MailFrom = SendMailDO.MailFrom; 
            if (!string.IsNullOrEmpty(SendMailDO.MailCc))
            {
                mail.MailCc = SendMailDO.MailCc;
            }

            if (!string.IsNullOrEmpty(htmlVoucher))
            {
                string Filename = SendMailDO.ReportName;

                string FilePath = System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath + "ReportMail\\SendReports";

                Filename = FilePath + "\\Report-" + Filename + ".pdf";


                byte[] resByte = null;

                if (!System.IO.File.Exists(Filename))
                {
                    PdfMetamorphosis pdf = new PdfMetamorphosis();
                    pdf.Serial = "10045618889";
                    pdf.PageSettings.Orientation = PdfMetamorphosis.PageSetting.Orientations.Portrait;
                    pdf.PageSettings.Size.Letter();
                    pdf.PageSettings.MarginTop.Mm(15);
                    pdf.PageSettings.MarginLeft.Mm(8);
                    pdf.PageSettings.MarginRight.Mm(8);
                    resByte = pdf.HtmlToPdfConvertStringToByte(htmlVoucher);
                    System.IO.FileStream output = new System.IO.FileStream(Filename, System.IO.FileMode.Create);
                    output.Write(resByte, 0, resByte.Length);
                    output.Close();
                    output.Dispose();
                }
                mail.Subject = SendMailDO.Subject;
                mail.MailBody = new StringBuilder();
               
                    string Msg = string.Empty;
                    Msg += "Please find the attached Report file.";
                    Msg += "<br/><br/>";
                    Msg += "Thank You";
                    mail.Message = Msg;
               
                mail.Attachment = Filename;
                mail.Status = SendMailDO.Status;

                Success = new SendMailBLL().sendMail(mail);


                //after mail send delete file
                try
                {
                    System.IO.FileInfo myFile = new System.IO.FileInfo(Filename);
                    if (myFile.Exists)
                    {
                        myFile.Delete();
                    }
                }
                catch (Exception ex)
                {
                    string s = string.Empty;
                    s = ex.Message;
                }
            }

            return Success;
        }
    }
}
