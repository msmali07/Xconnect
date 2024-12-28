var app = angular.module('HQApp', []);


var bid = ""; var brtypeid = ""; var mid = ""; var mrtypeid = ""; var bid = ""; var Wsid = ""; var membertypeid = "";
var isvalid = true;
app.controller('HQCntr', ['$scope', '$http', '$window', '$rootScope', 'Excel', '$timeout', function ($scope, $http, $window, $rootScope, Excel, $timeout) {

    $scope.AccReport = HQProdReportDO();
    $scope.ReportFilter = ReportFilterDO();
    $scope.PostBooking = PostBookingDO();
    $scope.logintype = ($("#hdnLoginMemberTypeId")).val();
    $scope.LoginMemberId = ($("#hdnLoginMemberId")).val();
    $scope.IsBookingdateWise = true;
    $scope.BasedOnDate = "Book Date"
    $scope.LoginMemberType = GetE("hdnLoginMemberTypeId").value;



    $("#ddl_BR option:selected").text("All Branch");
    //   $("#ddl_WS option:selected").text("All Wholesaler");
    $("#ddl_AG option:selected").text("All Agent");



    $scope.AccReport.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
    $scope.AccReport.DateTo = ConvertCustomrangedate(new Date());

    //this is PostBooking Init()
    $scope.PostBooking = PostBooking_Init($scope.PostBooking, $scope.LoginMemberType)

    //this is On Post Booking change events
    $rootScope.$on("CallPostBooking", function (event) {
        $scope.PostBooking = Set_PostMemberDetails(event, $scope.PostBooking);

    });
    $("#demo").addClass("collapse in");






    //select Customdate option
    Customdaterangelist1 = Customdaterangelist();

    $scope.DateRangeList = Customdaterangelist1;

    $("#ddl_CustomDateRange").change(function () {
        $scope.CustomDateRangeFilter = $("#ddl_CustomDateRange").val();

        if ($scope.CustomDateRangeFilter != "" && $scope.CustomDateRangeFilter != "0") {
            GetE("txtFromDate").value = $scope.CustomDateRangeFilter.split("~")[0];
            $scope.AccReport.DateFrom = $scope.CustomDateRangeFilter.split("~")[0];
            GetE("txtToDate").value = $scope.CustomDateRangeFilter.split("~")[1];
            $scope.AccReport.DateTo = $scope.CustomDateRangeFilter.split("~")[1];
        }
        else {
            GetE("txtFromDate").value = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            $scope.AccReport.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            GetE("txtToDate").value = ConvertCustomrangedate(new Date());
            $scope.AccReport.DateTo = ConvertCustomrangedate(new Date());
        }

    });


    $scope.ShowModifyBtn = function () {
        $scope.ModifySearch = false;

    }

    $scope.SearchReportClick = function () {


        var isvalid = true;

        $("#RptDetails")[0].style.display = "none";
        $("#RptHeaderDetails")[0].style.display = "none";
        $("#Noresultdiv")[0].style.display = "none";
        PopUpController.ClosePopup("divPopup", "");
        $("#HeaderSearchdiv").removeClass();
        $("#HeaderSearchdiv").addClass("col-lg-12 col-md-12 col-sm-12 col-xs-12 container-fluid padd-lft10 padd-rgt10");
        $scope.ModifySearch = false;

        if ($scope.AccReport.DateFrom == "") {

            Alert.render("Please Select Arrival-From Date", "txtFromDate");
            isvalid = false;
            return false;
        }

        if ($scope.AccReport.DateTo == "") {
            Alert.render("Please Select Arrival-To Date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ($scope.AccReport.DateFrom != "" && $scope.AccReport.DateTo != "") {
            var dtObj1 = GetSystemDate($scope.AccReport.DateFrom);
            var dtObj2 = GetSystemDate($scope.AccReport.DateTo);
        }

        if (($scope.AccReport.DateFrom != "" && $scope.AccReport.DateTo != "") && (dtObj1 > dtObj2)) {
            Alert.render("Arrival-From date can not be greater than Arrival-To date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ((diffDate(new Date($scope.AccReport.DateTo), new Date($scope.AccReport.DateFrom))) > 12.50) {
            Alert.render("Report Seraching Dates Should be Upto 12 Months", "txtToDate");
            isvalid = false;
            return false;
        }

        //PostBookingSetting
        $scope.PostBooking = PostBooking_Setting($scope.PostBooking, $scope.LoginMemberType)

        if ($scope.PostBooking.PostMemberId == "0") {
            if (GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text != "All Agent") {
                Alert.render("Select Member to Post Booking", "ddl_BR");
                isvalid = false;
                return false;
            }
        }


        $scope.MemberDetails = $scope.PostBooking.Br_Id + "_" + $scope.PostBooking.Ws_Id + "_" + $scope.PostBooking.Ag_Id + "_" + $scope.PostBooking.ReportCompanyName + "_" + GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text;


        $scope.AccReport.MemberId = $scope.PostBooking.PostMemberId;
        $scope.AccReport.LoginUserId = (document.getElementById("hdnLoginUserId")).value;





        if (isvalid == true) {
            $scope.GetReportDetails();
        }
    }



    $scope.GetReportDetails = function () {

        var popupdetail = $scope.PostBooking.ReportCompanyName + "~" + $scope.AccReport.DateFrom + "~" + $scope.AccReport.DateTo;
        PopUpController.OpenPopup1("divPopup", "HQ Productivity Report", popupdetail);
        $scope.ReportFilter.CustomDateOption = $("#ddl_CustomDateRange").val();

        $scope.HQProductivityList = [];
        $http({
            method: "post",
            url: "../Production/GetHQProductivityDetail",
            data: ({
                AccSearchReportDO: $scope.AccReport,
            }),
            dataType: "json",
            headers: { "Content-Type": "application/json" }

        }).then(function (d) {

            if (d.data != undefined || d.data != null) {
                if ((d.data).length > 0) {

                    $scope.HQProductivityList = d.data;
                    $scope.ModifySearch = false;
                    $("#RptDetails")[0].style.display = "block";
                    $("#RptHeaderDetails")[0].style.display = "block";
                    PopUpController.ClosePopup("divPopup", "");


                }
                else {
                    $scope.ModifySearch = false;
                    $("#Noresultdiv")[0].style.display = "block";
                    $("#RptHeaderDetails")[0].style.display = "block";
                    PopUpController.ClosePopup("divPopup", "");
                }
            }
            else {
                $scope.ModifySearch = false;
                $("#Noresultdiv")[0].style.display = "block";
                $("#RptHeaderDetails")[0].style.display = "block";
                PopUpController.ClosePopup("divPopup", "");
            }
        }, function (error) {

        });


    }


    //Modify Button for
    $scope.ShowModifyClick = function () {
        $("#Noresultdiv")[0].style.display = "none";
        $("#Errordiv")[0].style.display = "none";
    }

}]);


$(document).ready(function () {

    $(".date-cal").datepicker({ dateFormat: 'dd M yy', numberOfMonths: 2, });

});



app.factory('Excel', function ($window) {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" ><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><style><!-- table {mso-displayed-decimal-separator: "\.";mso-displayed-thousand-separator: "\,";} --></style><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function (s) { return $window.btoa(unescape(encodeURIComponent(s))); },
        format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };
    return {
        tableToExcel: function (tableId, worksheetName, newtable) {
            //var table = $(tableId),
            var table = newtable,
                //ctx = { worksheet: worksheetName, table: table.html() },
                ctx = { worksheet: worksheetName, table: table.outerHTML },
                href = uri + base64(format(template, ctx));
            return href;
        }
    };
})







