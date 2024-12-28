var loadPopup = function () {
    return {
        Popup1: function loadpopup(HeaderContent, Detail) {
            var strpopup = "";
            var CompCode = $("#hdnMainCCode").val();
            var AppUrl = $("#hdnMainAppUrl").val();
                 
            var imgname = "sml-loading" + "-" + CompCode + "-" + AppUrl + ".gif";

            strpopup += "<div class=\"modal fade user-prfl-modal modal-res in popUp\" id=\"loading\" role=\"dialog\">";
            strpopup += "<div class=\"modal-dialog modal-\" style=\"top:25%;border-radius:5px;\">";//sm
            strpopup += "<div class=\"modal-content waitpopborder\">";
            strpopup += "<div class=\"modal-header waitpopupheader\">";
            strpopup += "<h3 class=\"center-block text-center nomargin txtcolor\">" + HeaderContent + "</h3>";
            strpopup += "</div>";
            strpopup += "<div class=\"modal-body\" style=\"padding: 15px 30px;\">";
            strpopup += "<h4 class=\"center-block text-center nomargin waitpopupcolor\">Please wait while we search for the Report</h4><br/>";
            if (Detail != "")
            {
                if (GetE("hdnLoginMemberTypeId").value != "4" && Detail.split("~")[0] != "")
                {
                    strpopup += "<span class=\"center-block text-center nomargin\" style=\"font-size: 15px !important;\"><b>For</b> : " + Detail.split("~")[0] + "<br/>";
                }
               
                strpopup += "<span class=\"center-block text-center nomargin\"><b>From  Date</b> : " + Detail.split("~")[1] + " <b>To Date</b> : " + Detail.split("~")[2] + "<br/>";
                strpopup += "<span><br/>";
            }
           
            strpopup += "<img class=\"center-block text-center\" src=\"../images/" + imgname + "\"/>";          
            strpopup += "</div>";
            strpopup += "</div>";
            strpopup += "</div>";
            strpopup += "</div>";

            return strpopup;
        },
        Popup2: function loadpopup(HeaderContent) {
            var strpopup = "";
            var CompCode = $("#hdnMainCCode").val();
            var AppUrl = $("#hdnMainAppUrl").val();
            var imgname = "sml-loading" + "-" + CompCode + "-" + AppUrl + ".gif";
            HeaderContent = HeaderContent == "" ? "Please Wait" : HeaderContent;

            strpopup += "<div class=\"modal fade user-prfl-modal modal-res in popUp\" id=\"loading\" role=\"dialog\">";
            strpopup += "<div class=\"modal-dialog modal-\" style=\"top:25%;width:400px;border-radius:5px;\">";//sm
            strpopup += "<div class=\"modal-content\" style=\"border: 0px !important;\">";
            strpopup += "<div class=\"modal-header\">";
            strpopup += "<h3 class=\"center-block text-center nomargin txtcolor\">" + HeaderContent + "</h3>";
            strpopup += "</div>";
            strpopup += "<div class=\"modal-body\" style=\"padding: 15px 30px;\">";          
            strpopup += "<img class=\"center-block text-center\" src=\"../images/" + imgname + "\"/>";
            strpopup += "</div>";
            strpopup += "</div>";
            strpopup += "</div>";
            strpopup += "</div>";
            return strpopup;
        }
    }
}(loadPopup || {})

var PopUpController = function () {
    return {
        OpenPopup1: function setPopUp(ControlId, Header, Footer) {
            $("#" + ControlId).html(loadPopup.Popup1(Header, Footer));
            $("#" + ControlId).css("display", "");
        },
        OpenPopup2: function setPopUp(ControlId, Header) {
            $("#" + ControlId).html(loadPopup.Popup2(Header));
            $("#" + ControlId).css("display", "");
        },
        ClosePopup: function setPopUp(ControlId) {
           
          
            $("#" + ControlId).html("");
            $("#" + ControlId).css("display", "none !importtant");
        },
    }
}(PopUpController || {})

