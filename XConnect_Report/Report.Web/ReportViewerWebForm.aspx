<%@ Page Language="C#" AutoEventWireup="True" CodeBehind="ReportViewerWebForm.aspx.cs" Inherits="ReportViewerForMvc.ReportViewerWebForm" %>

<%@ Register Assembly="Microsoft.ReportViewer.WebForms, Version=11.0.0.0, Culture=neutral, PublicKeyToken=89845dcd8080cc91" Namespace="Microsoft.Reporting.WebForms" TagPrefix="rsweb" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
     <%--<script src="http://code.jquery.com/jquery-1.11.3.min.js"></script>--%>
  
   <%-- <link href="Css/Site.css" rel="stylesheet" />--%>
    <link href="Css/report.css" rel="stylesheet" />

       <link href="Css/style-36-1.css" rel="stylesheet" />

    
  
    <script src="libs/jquery-1.10.2.min.js"></script>
   
   <script src="Scripts/Popup.js"></script>

    <script type="text/javascript">
        $(document).ready(function () {              
            $("#WFbtnclose").trigger("click");

           
            //$("iframe").on("load", function () {
            //    let table = $("iframe").contents().find("table");
            //    let css = '<style>iframe table {background-color: #ff0000;}</style>';
            //    $(table).append(css);
            //});

            });
        function CloseLoadingPopupWF() {
            localStorage.setItem("loading", true);          
            PopUpController.ClosePopup("divPopup", "");                     
        }

        //$(window).load(function () {
           // frameListener = setInterval("frameLoaded()", 3000);
          
       // });
       // function frameLoaded() {
            //var frame = $('iframe').get(0);
            //if (frame != null) {
               // var frmHead = $('iframe').contents().find('table');
               // if (frmHead != null) {
                    //frmHead.append($('style, link[rel=stylesheet]').clone()); // clone existing css link
                  //  frmHead.append($("<link/>", { rel: "stylesheet", href: "/styles/report.css", type: "text/css" })); // or create css link yourself
                //}
           // }
      //  }
       
    </script>
    <style type="text/css">
        .fixScrollBarBug div div
        {
            overflow: visible;
        }

        .fixScrollBarBug div div div
        {
            overflow: hidden;
        }
    </style>
   
</head>
    
<body style="margin: 0px; padding: 0px;overflow-x:auto;">
     <input type="hidden" id="hdntest" value="true" />
    <a class="btn hover-btn nomargin" onclick="CloseLoadingPopupWF()" id="WFbtnclose" style="display:none;"></a>
   
    <form id="form1" runat="server" >
        <div >
            <asp:ScriptManager ID="ScriptManager1" runat="server">
                <Scripts>
                    <asp:ScriptReference Assembly="ReportViewerForMvc" Name="ReportViewerForMvc.Scripts.PostMessage.js" />
                    
                </Scripts>
            </asp:ScriptManager>
            <rsweb:ReportViewer ID="ReportViewer1" runat="server" SizeToReportContent = "true" CssClass="fixScrollBarBug" >
                 <%--<LocalReport ReportPath="Reports/RptAccountreport.rdlc" EnableHyperlinks="true" ></LocalReport>--%>
            </rsweb:ReportViewer>
        
        </div>
        
    </form>
    
</body>
</html>
  
