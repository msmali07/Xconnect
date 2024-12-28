var app = angular.module('reportapp', []);


var bid = ""; var brtypeid = ""; var mid = ""; var mrtypeid = ""; var bid = ""; var Wsid = ""; var membertypeid = "";
var isvalid = true;
app.controller('CreditCntr', ['$scope', '$http', '$window', '$rootScope', function ($scope, $http, $window, $rootScope) {
    NgInit();
    
    function NgInit()
    {
        //$scope.paxdo = DeclarePaxDO();
        //$scope.paxdoList = [];
        //$scope.paxdoList.push($scope.paxdo);


        $scope.CreditReport = CreditReportDO();
        $scope.ReportFilter = ReportFilterDO();
        $scope.PostBooking = PostBookingDO();

        $scope.LoginMemberType = GetE("hdnLoginMemberTypeId").value;
        $scope.ModifySearch = true;
        $scope._IsHidePostBooking = false;       
        $scope.GroupingName = "Service"        
        $scope.MemberDetails = "";
       
        if ($scope.LoginMemberType == 2) {
            $scope.PostBooking.Br_Id = $("#hdnLoginMemberId").val();
            $scope.PostBooking.MemberTypeSelected = GetE("hdnLoginMemberTypeId").value;
            $scope._IsHidePostBooking = true;
        }
        else if ($scope.LoginMemberType == 3) {

            $scope.PostBooking.Ws_Id = $("#hdnLoginMemberId").val();
            $scope.PostBooking.PostMemberId = $("#hdnLoginMemberId").val();
            $scope.PostBooking.MemberTypeSelected = GetE("hdnLoginMemberTypeId").value;
            $scope._IsHidePostBooking = true;
        }
        else if ($scope.LoginMemberType == 4) {
            $scope.PostBooking.Ag_Id = $("#hdnLoginMemberId").val();
            $scope.PostBooking.PostMemberId = $("#hdnLoginMemberId").val();
            $scope.PostBooking.PostUserId = $("#hdnLoginUserId").val();
            $scope.PostBooking.MemberTypeSelected = GetE("hdnLoginMemberTypeId").value;
            $scope._IsHidePostBooking = true;
        }
        $scope.CreditReport.FromDate = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
        $scope.CreditReport.ToDate = ConvertCustomrangedate(new Date());

        $rootScope.$on("CallPostBooking", function (event) {
            setPostMemberDetails(event);
        });

       

        if ($("#hdnsearchtype").val() == "1") {
            $scope.ModifySearch = false;
            PopUpController.OpenPopup2("divPopup", "");
            $("#HeaderSearchdiv").removeClass();
            $("#HeaderSearchdiv").addClass("col-lg-12 col-md-12 col-sm-12 col-xs-12 container-fluid padd-lft10 padd-rgt10");
            GetReportData();
        }
        else {
            $("#demo").addClass("collapse in");
        }
    }
    $scope.$on('$viewContentLoaded', function () {
        //Here your view content is fully loaded !!
    });
   
    function setPostMemberDetails(event) {

        switch (this.event.target.id) {
            case "ddl_BR":
                $scope.PostBooking.Ag_Id = 0;
                $scope.PostBooking.Ws_Id = 0;
                $scope.PostBooking.Br_Id = (this.event.target.value);
                $scope.PostBooking.ReportCompanyName = GetE("ddl_BR").options[GetE("ddl_BR").selectedIndex].text;
                $scope.PostBooking.MemberTypeSelected = 0;
                $scope.PostBooking.PostMemberId = 0;
                break;
            case "ddl_WS":
                $scope.PostBooking.Ag_Id = 0;
                $scope.PostBooking.Ws_Id = (this.event.target.value);
                $scope.PostBooking.MemberTypeSelected = 3;
                $scope.PostBooking.PostMemberId = (this.event.target.value);
                $scope.PostBooking.ReportCompanyName = GetE("ddl_WS").options[GetE("ddl_WS").selectedIndex].text;
                break;
            case "ddl_AG":
                $scope.PostBooking.Ag_Id = (this.event.target.value);
                $scope.PostBooking.MemberTypeSelected = 4;
                $scope.PostBooking.PostMemberId = (this.event.target.value);
                $scope.PostBooking.ReportCompanyName = GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text;
                break;

        }
    }   

    function getUrlVars() {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }

    function getUrlVarsDetail() {
        var vars = [], hash;
        var hashes = $("#hdnRptParam").val().split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }


    //select customdate option
    Customdaterangelist1 = Customdaterangelist();

    $scope.DateRangeList = Customdaterangelist1;

    $("#ddl_CustomDateRange").change(function () {
        $scope.CustomDateRangeFilter = $("#ddl_CustomDateRange").val();
        if ($scope.CustomDateRangeFilter != "" && $scope.CustomDateRangeFilter != "0")
        {
            GetE("txtFromDate").value = $scope.CustomDateRangeFilter.split("~")[0];
            $scope.CreditReport.FromDate = $scope.CustomDateRangeFilter.split("~")[0];

            GetE("txtToDate").value = $scope.CustomDateRangeFilter.split("~")[1];
            $scope.CreditReport.ToDate = $scope.CustomDateRangeFilter.split("~")[1];
        }
        else
        {
            GetE("txtFromDate").value = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            $scope.CreditReport.FromDate = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));

            GetE("txtToDate").value = ConvertCustomrangedate(new Date());
            $scope.CreditReport.ToDate = ConvertCustomrangedate(new Date());

        }
       


    });

    function GetReportData() {

        $scope.ReportDetailData = decodeURIComponent(getUrlVarsDetail()["Search"]);
        $scope.CreditReport = JSON.parse($scope.ReportDetailData.split("~@~")[0]);
        $scope.ReportFilter = JSON.parse($scope.ReportDetailData.split("~@~")[1]);
        $scope.MemberDetails = ($scope.ReportDetailData.split("~@~")[2]);
       
       
       
        $("#hdnIsGetMemberdetails").val("true");
        $("#hdnMemberdetails").val($scope.MemberDetails);
        $scope.PostBooking.Br_Id = $scope.MemberDetails.split("_")[0];
        $scope.PostBooking.Ws_Id = $scope.MemberDetails.split("_")[1];
        $scope.PostBooking.Ag_Id = $scope.MemberDetails.split("_")[2];
        $scope.PostBooking.ReportCompanyName = $scope.MemberDetails.split("_")[3];
        $scope.PostBooking.PostMemberId = $scope.CreditReport.MemberId;


        // HideFilter = $scope.ReportFilter.HideBy;
        var checkboxes = document.getElementsByName('HIDE');
        var vals = "";
        for (var i = 0, n = checkboxes.length; i < n; i++) {
            if ($scope.ReportFilter.HideBy.includes(checkboxes[i].value)) {
                $("#" + checkboxes[i].id).prop("checked", true);

            }
        }
     
    }
   
    //validation and setparam on serach click
    $scope.SearchReportClick = function () {

      
        PopUpController.ClosePopup("divPopup", "");      
        $("#HeaderSearchdiv").removeClass();
        $("#HeaderSearchdiv").addClass("col-lg-12 col-md-12 col-sm-12 col-xs-12 container-fluid padd-lft10 padd-rgt10");
       
    
        if ($scope.CreditReport.FromDate == "") {

            Alert.render("Please Select From Date", "txtFromDate");
            isvalid = false;
            return false;
        }

        if ($scope.CreditReport.ToDate == "") {
            Alert.render("Please Select To Date", "txtToDate");
            isvalid = false;
            return false;
        }
       

        if ($scope.LoginMemberType == "1")
        {
            if ($scope.PostBooking.ReportCompanyName == "Select Branch" || $scope.PostBooking.ReportCompanyName == "" || $scope.PostBooking.ReportCompanyName == "TestName")
            {
                $scope.PostBooking.ReportCompanyName = "All Branch";
            }
        }
        if ($scope.LoginMemberType != "1")
        {
            if ($scope.PostBooking.ReportCompanyName == "TestName")
            {
                $scope.PostBooking.ReportCompanyName = GetE("hdnLoginName").value;
            }
        }
      
        if ($scope.PostBooking.PostMemberId == "0" && $scope.PostBooking.ReportCompanyName != "All Branch") {
            Alert.render("Select Member to Post Booking", "ddl_BR");
            isvalid = false;
            return false;
        }

     
       
        $scope.ReportFilter.HideBy = "0";
        //column hide array string
        var checkboxes = document.getElementsByName('HIDE');
        var vals = "";
        for (var i = 0, n = checkboxes.length; i < n; i++) {
            if (checkboxes[i].checked) {
                $scope.ReportFilter.HideBy += checkboxes[i].value + ",";
            }
        }
        $scope.CreditReport.MemberId = $scope.PostBooking.PostMemberId;
        $scope.ReportFilter.CustomDateOption = $("#ddl_CustomDateRange").val();;       
        $scope.MemberDetails = $scope.PostBooking.Br_Id + "_" + $scope.PostBooking.Ws_Id + "_" + $scope.PostBooking.Ag_Id + "_" + $scope.PostBooking.ReportCompanyName;
        $scope.SeachType = 1;

        if (isvalid == true)
        {
            var Strvalue = JSON.stringify($scope.CreditReport) + "~@~" + JSON.stringify($scope.ReportFilter) + "~@~" + $scope.MemberDetails;

          
            var Url = "../Booking/CreditReport?Identity=" + getUrlVars()["Identity"] + "&Search=" + (Strvalue) + "&SearchType=" + $scope.SeachType;
            window.location.href = Url;


        }
    }

    $scope.GetResult = function (ResultList, Totalrecord) {

        //  $scope.MainResultlist = JSON.parse(JSON.stringify(ResultList));
        $scope.MainResultlist = JSON.parse(ResultList);
        $scope.TotalRecords = Totalrecord;
     

        if ($scope.TotalRecords == 0 || $scope.TotalRecords == undefined) {
            $("#HeaderSearchdiv")[0].style.display = "block";
            $("#Noresultdiv")[0].style.display = "block";
            $("#RptDetails")[0].style.display = "none";
        }
        else {
            $("#HeaderSearchdiv")[0].style.display = "block";
            $("#Noresultdiv")[0].style.display = "none";
            $("#RptDetails")[0].style.display = "block";
        }

        console.log($scope.TotalRecords);
    }

    $scope.ShowModifyBtn = function () {
       
        $scope.ModifySearch = false;
    }

  
}]);

function GetE(Control) {
    return document.getElementById(Control);
}

function GetDetail(ResultList, totalcount) {
    var scope = angular.element(document.getElementById("MainWrap")).scope();
    scope.$apply(function () {
        scope.GetResult(ResultList, totalcount);
    })
    return;
}
