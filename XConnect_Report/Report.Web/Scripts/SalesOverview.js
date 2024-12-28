var app = angular.module('SalesOverviewRptapp', []);

var bid = ""; var brtypeid = ""; var mid = ""; var mrtypeid = ""; var bid = ""; var Wsid = ""; var membertypeid = "";
var isvalid = true;
app.controller('SalesOverviewRptCntr', ['$scope', '$http', '$window', '$rootScope', '$timeout', function ($scope, $http, $window, $rootScope, $timeout) {
    NgInit();
    function NgInit() {
        $scope.SalesOverviewRpt = CommonDashBoardV1DO();
        $scope.ReportFilter = ReportFilterDO();
        $scope.PostBooking = PostBookingDO();
        $scope.SendMailDO = SendMailDO();

        $scope.IsShowSupplier = GetE("hdnIsShowSupplier").value;
        $scope.LoginMemberType = GetE("hdnLoginMemberTypeId").value;
        $scope.MemberId = GetE("hdnLoginMemberId").value;//If Branch Login
        $scope.IsSalePerson = GetE("hdnIsSalePerson").value;
        $scope.IsSalePersonUserId = GetE("hdnLoginUserId").value;
        $scope.LoginBranchId = GetE("hdnBranchId").value;
        $scope.ModifySearch = true;
        $scope._IsHidePostBooking = false;
        $scope.MemberDetails = "";
        $scope.GroupingName = "";

        $scope.SortDetails = [];
        $scope.SortDetails.push(SortDetailDO());
        $scope.MainResultlistAfterFilter = [];
        $scope.ShowddlFilterList = [];
        $scope.FilterDOList = [];
        $scope.FilterTypeActive = "";
        $scope.selectedArray = "";
        $scope.OldSelectedfilterArrayValues = "";
        $scope.SalesOverviewRpt.MemberId = "10561"
        $scope.CustomDateRangeFilter = "2024";
        SortingSetting();
        ShowHideExcelColumns();
        GetsalesPerson();
        $("#ddl_BR option:selected").text("All Branch");
        $("#ddl_AG option:selected").text("All Agent");

        $scope.SalesOverviewRpt.DateFrom = '01 Jan ' + new Date().getFullYear();
        $scope.SalesOverviewRpt.DateTo = '30 Jan ' + new Date().getFullYear();
        //this is PostBooking Init()
        $scope.PostBooking = PostBooking_Init($scope.PostBooking, $scope.LoginMemberType)
        //this is On Post Booking change events
        $rootScope.$on("CallPostBooking", function (event) {
            document.getElementById("Wsdiv").style.display = "none";
            document.getElementById("agentdiv").style.display = "none";
            $scope.PostBooking = Set_PostMemberDetails(event, $scope.PostBooking);

        });
        $("#demo").addClass("collapse in");
    }
    function GetsalesPerson() {
        $http.get("../CommonData/GetSalesPersonList?MemberTypeId=" + $scope.LoginMemberType + "&MemberId=" + $scope.MemberId).then(function (d) {
            $scope.SalesPersonAcessList = d.data;
            // $("#DivBranch")[0].style.display = "block";
        }, function (error) {
            // ErrorPopup.render('Branch Load failed');
        });
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
    //select customdate option
    Customdaterangelist1 = Customdaterangelist();

    $scope.DateRangeList = Customdaterangelist1;

    $scope.NewDateRangeList = [];
    $.each($scope.DateRangeList, function (i, item) {
        if (item.Values == '01 Jan 2024~20 Apr 2024') {
            item.Values = "2024";
            $scope.NewDateRangeList.push(item);
        }
        else if (item.Values == '01 Jan 2023~31 Dec 2023') {
            item.Values = "2023";
            $scope.NewDateRangeList.push(item);
        }
    });

    $("#ddl_CustomDateRange").change(function () {
        $scope.CustomDateRangeFilter = $("#ddl_CustomDateRange").val();
    });

    //collasped and expand
    $scope.ShowModifyBtn = function () {
        $scope.ModifySearch = false;
        $("#demo")[0].style.display = 'none';

    }
    $scope.OnModifyClick = function () {
        $("#demo")[0].style.display = 'block';
    }

    $("#ddl_BR").change(function () {

        $scope.IsGetfromHome = false;

    });
    $("#ddl_WS").change(function () {

        $scope.IsGetfromHome = false;

    });
    $("#ddl_AG").change(function () {

        $scope.IsGetfromHome = false;

    });
   
    //validation and setparam on serach click
    $scope.SearchReportClick = function () {
        var isvalid = true;
        $scope.OnlyClearAll();
        $("#demo")[0].style.display = 'none';
        $("#RptDetails")[0].style.display = "none";
        $("#RptHeaderDetails")[0].style.display = "none";
        $("#Noresultdiv")[0].style.display = "none";
        PopUpController.ClosePopup("divPopup", "");
        $("#HeaderSearchdiv").removeClass();
        $("#HeaderSearchdiv").addClass("col-lg-12 col-md-12 col-sm-12 col-xs-12 container-fluid padd-lft10 padd-rgt10");
        $scope.ModifySearch = false;
        $scope.SalesOverviewRpt.DateFrom = angular.element(document.getElementById("txtFromDate")).val();
        $scope.SalesOverviewRpt.DateTo = angular.element(document.getElementById("txtToDate")).val();

        if ($scope.SalesOverviewRpt.DateFrom == "") {

            Alert.render("Please Select Arrival-From Date", "txtFromDate");
            isvalid = false;
            return false;
        }

        if ($scope.SalesOverviewRpt.DateTo == "") {
            Alert.render("Please Select Arrival-To Date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ($scope.SalesOverviewRpt.DateFrom != "" && $scope.SalesOverviewRpt.DateTo != "") {
            var dtObj1 = GetSystemDate($scope.SalesOverviewRpt.DateFrom);
            var dtObj2 = GetSystemDate($scope.SalesOverviewRpt.DateTo);
        }
       
        if (($scope.SalesOverviewRpt.DateFrom != "" && $scope.SalesOverviewRpt.DateTo != "") && (dtObj1 > dtObj2)) {
            Alert.render("Arrival-From date can not be greater than Arrival-To date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ((diffDate(new Date($scope.SalesOverviewRpt.DateTo), new Date($scope.SalesOverviewRpt.DateFrom))) > 12.50) {
            Alert.render("Report Seraching Dates Should be Upto 12 Months", "txtToDate");
            isvalid = false;
            return false;
        }
        // hdnLoginMemberId
        //PostBookingSetting
        if ($scope.LoginMemberType == 1) {
            $scope.PostBooking = PostBooking_Setting($scope.PostBooking, $scope.LoginMemberType)
            //if ($scope.PostBooking.PostMemberId == "0") {
            //    if (GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text != "All Agent") {
            //        Alert.render("Select Member to Post Booking", "ddl_BR");
            //        isvalid = false;
            //        return false;
            //    }
            //}
            if (document.getElementById('ADW').checked) {
                $scope.SalesOverviewRpt.BookingdateWise = false;
                $scope.SalesOverviewRpt.category = 'Service Date Wise';
            }
            if (document.getElementById('BDW').checked) {
                $scope.SalesOverviewRpt.BookingdateWise = true;
                $scope.SalesOverviewRpt.category = 'Booking Date Wise';
            }
            if ($scope.IsGetfromHome == true) {
                $scope.PostBooking.ReportCompanyName = $scope.OnLoadReportCompanyName;
                $scope.PostBooking.PostMemberId = $scope.OnLoadPostMemberId;
            }
            $scope.MemberDetails = $scope.PostBooking.Br_Id + "_" + $scope.PostBooking.Ws_Id + "_" + $scope.PostBooking.Ag_Id + "_" + $scope.PostBooking.ReportCompanyName + "_" + GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text;
            $scope.SalesOverviewRpt.MemberId = $scope.PostBooking.PostMemberId;
            $scope.SalesOverviewRpt.LoginUserId = (document.getElementById("hdnLoginUserId")).value;
        }
        if (document.getElementById('ADW').checked) {
            $scope.SalesOverviewRpt.BookingdateWise = false;
            $scope.SalesOverviewRpt.category = 'Service Date Wise';
        }
        if (document.getElementById('BDW').checked) {
            $scope.SalesOverviewRpt.BookingdateWise = true;
            $scope.SalesOverviewRpt.category = 'Booking Date Wise';
        }
        if (isvalid == true) {
            $scope.GetReportDetails();
        }
    }
    /* function SetLimit(LoadData) {
         $scope.Limit = "";
         if (LoadData == true) {
             //$scope.Icount = $scope.JCount + 1;
             //$scope.JCount = $scope.JCount + 20;
             //$scope.Limit = $scope.Icount + "," + 20;
             $scope.Icount = $scope.JCount + 1;
             $scope.JCount = $scope.JCount + 20;
             $scope.Limit = 0 + "," + $scope.JCount;
         }
         else {
             $scope.Icount = 0;
             $scope.JCount = 100;
             $scope.Limit = $scope.Icount + "," + $scope.JCount;
             $scope.Icount = 1;
         }
     }*/
    const ddlYear = document.getElementById('ddlYear');
    const datePicker = document.getElementById('txtFromDate');

    $('#txtFromDate').datepicker('destroy').datepicker({
        dateFormat: 'dd M yy',
        minDate: '01 Jan 2024',
        maxDate: '31 Dec 2024',
        numberOfMonths: 2,
        setDate: new Date('30 Jan 2024'),
    });
    $('#txtToDate').datepicker('destroy').datepicker({
        dateFormat: 'dd M yy',
        minDate: '01 Jan 2024',
        maxDate: '31 Dec 2024',
        numberOfMonths: 2,
        setDate: new Date('30 Jan 2024'),
    });
    $("#txtFromDate").change(function () {
        let dateString1 = angular.element(document.getElementById("txtFromDate")).val();
        var DateFrom = new Date(dateString1);
        var newDate = DateFrom.setDate(DateFrom.getDate() + 29);
        $scope.SalesOverviewRpt.DateTo = ConvertCustomrangedate(newDate);
        var DateTo = new Date(newDate);
        var lastdate = '31 Dec ' + $("#ddlYear").val();
        var DateTo1 = new Date(lastdate);
        datePicker.max = ConvertCustomrangedate(newDate);
        if (DateTo > DateTo1) {
            datePicker.max = lastdate;
            $scope.SalesOverviewRpt.DateTo = ConvertCustomrangedate(lastdate);
        }
        $('#txtToDate').datepicker('destroy').datepicker({
            dateFormat: 'dd M yy',
            minDate: dateString1,
            maxDate: datePicker.max,
            numberOfMonths: 2,
        });

    });
  
    $("#txtFromDate").change(function () {
        let dateString1 = angular.element(document.getElementById("txtFromDate")).val();
        let dateString2 = angular.element(document.getElementById("txtToDate")).val();
        if ((diffDate(new Date(dateString2), new Date(dateString1))) > 0.99) {
            Alert.render("Report Seraching Dates Should be Upto within 30 days", "txtFromDate");
            $scope.SalesOverviewRpt.DateFrom = '01 Jan ' + $("#ddlYear").val();
            $scope.SalesOverviewRpt.DateTo = '30 Jan ' + $("#ddlYear").val();
            document.getElementById("txtFromDate").value = $scope.SalesOverviewRpt.DateFrom;
            document.getElementById("txtToDate").value = $scope.SalesOverviewRpt.DateTo;

        }
    });
    $("#txtToDate").change(function () {
        let dateString1 = angular.element(document.getElementById("txtFromDate")).val();
        let dateString2 = angular.element(document.getElementById("txtToDate")).val();
        if ((diffDate(new Date(dateString2), new Date(dateString1))) > 0.99) {
            Alert.render("Report Seraching Dates Should be within 30 days", "txtToDate");
            var Mindate = new Date(dateString1);
            var newDate = Mindate.setDate(Mindate.getDate() + 29);
            document.getElementById("txtToDate").value = ConvertCustomrangedate(newDate);
        }
    });
   
    $("#ddlYear").change(function () {
        $scope.SalesOverviewRpt.DateFrom = "";
        $scope.SalesOverviewRpt.DateTo = "";
        const selectedYear = ddlYear.value;
        const minDate = new Date(selectedYear, 0 + 1, 1 - 30);
        const maxDate = new Date(selectedYear, 0 + 1, 0);
        datePicker.min = minDate.toISOString().split('T')[0];
        datePicker.max = maxDate.toISOString().split('T')[0];
        $scope.SalesOverviewRpt.DateFrom = ConvertCustomrangedate(datePicker.min);
        $scope.SalesOverviewRpt.DateTo = ConvertCustomrangedate(datePicker.max);
        document.getElementById("txtFromDate").value = $scope.SalesOverviewRpt.DateFrom;
        document.getElementById("txtToDate").value = $scope.SalesOverviewRpt.DateTo;

        //document.write(today);
        if (selectedYear == 2024) {
            $('#txtFromDate').datepicker('destroy').datepicker({
                dateFormat: 'dd M yy',
                minDate: '01 Jan 2024',
                maxDate: '31 Dec 2024',
                numberOfMonths: 2,
            });
            $('#txtToDate').datepicker('destroy').datepicker({
                dateFormat: 'dd M yy',
                minDate: '01 Jan 2024',
                maxDate: '31 Dec 2024',
                numberOfMonths: 2,
            });
        }
        if (selectedYear == 2023) {
            $('#txtFromDate').datepicker('destroy').datepicker({
                dateFormat: 'dd M yy',
                minDate: '01 Jan 2023',
                maxDate: '31 Dec 2023',
                numberOfMonths: 2,
            });
            $('#txtToDate').datepicker('destroy').datepicker({
                dateFormat: 'dd M yy',
                minDate: '01 Jan 2023',
                maxDate: '31 Dec 2023',
                numberOfMonths: 2,
            });
        }
        if (selectedYear == 2022) {
            $('#txtFromDate').datepicker('destroy').datepicker({
                dateFormat: 'dd M yy',
                minDate: '01 Jan 2022',
                maxDate: '31 Dec 2022',
                numberOfMonths: 2,
            });
            $('#txtToDate').datepicker('destroy').datepicker({
                dateFormat: 'dd M yy',
                minDate: '01 Jan 2022',
                maxDate: '31 Dec 2022',
                numberOfMonths: 2,
            });
        }
    });

    //getReportDetails on serach click
    $scope.GetReportDetails = function () {
        var ReportName = "Sales Overview Report";
        var popupdetail = $scope.PostBooking.ReportCompanyName + "~" + $scope.SalesOverviewRpt.DateFrom + "~" + $scope.SalesOverviewRpt.DateTo;
        PopUpController.OpenPopup2("divPopup", ReportName, popupdetail);
        $scope.ReportFilter.CustomDateOption = $("#ddl_CustomDateRange").val();
        $scope.currentleg = 0; $scope.count = 0;
        $("#demo").addClass("collapse in");
        $scope.SalesOverviewRpt.Year = $("#ddlYear").val();
        $scope.SalesOverviewRpt.MemberId = $("#ddl_BR").val();

        $scope.Search = ($("#ddlSalesPersonReportAcess").val() == undefined || $("#ddlSalesPersonReportAcess").val() == "0") ? false : true;
        if ($scope.Search == true) {
            $scope.SaleABranchId = $("#ddlSalesPersonReportAcess").val().split("~")[0];
            $scope.SalesAUserId = $("#ddlSalesPersonReportAcess").val().split("~")[1];
        }
        else {
            $scope.SaleABranchId = $scope.LoginBranchId;
            $scope.SalesAUserId = $scope.IsSalePersonUserId;
        }
        if ($scope.LoginMemberType == 1) {
            if ($scope.SalesOverviewRpt.MemberId != 0) {
                $scope.SaleABranchId = $scope.SalesOverviewRpt.MemberId;
            }
        }
        var Query = "";
        $scope.LoadData = false;
        $scope.Limit = "";
        const dateString1 = angular.element(document.getElementById("txtFromDate")).val();;
        const dateString2 = angular.element(document.getElementById("txtToDate")).val();;

        const dateObject1 = new Date(dateString1);
        const dateObject2 = new Date(dateString2);

        const CheckIn = `${dateObject1.getFullYear()}-${padZero(dateObject1.getMonth() + 1)}-${padZero(dateObject1.getDate())} ${padZero(dateObject1.getHours())}:${padZero(dateObject1.getMinutes())}:${padZero(dateObject1.getSeconds())}`;
        const CheckOut = `${dateObject2.getFullYear()}-${padZero(dateObject2.getMonth() + 1)}-${padZero(dateObject2.getDate())} ${padZero(dateObject2.getHours())}:${padZero(dateObject2.getMinutes())}:${padZero(dateObject2.getSeconds())}`;

        function padZero(value) {
            return (value < 10 ? '0' : '') + value;
        }
        //  rpt_sales_overview_test_2024_bk
        // SetLimit($scope.LoadData);
        if ($scope.Search == false) {
            if ($scope.LoginMemberType == 1) {
                if ($scope.SalesOverviewRpt.BookingdateWise == false) {
                    if ($scope.SalesOverviewRpt.MemberId == "0") {
                        //  Query = "SELECT CName,Type,Market,TTV_K,Bgs,Can_Book,Can_Book_Per,RN,AVBV,OM_Per,Bk_Err_Per,M_date,SalePId from rpt_salesoverview_" + $scope.SalesOverviewRpt.Year + "_ch order by Bgs desc  limit 0,100000  "
                        Query = "SELECT CName,Type,Market,TTV_K,Bgs,Can_Book,RN,AVBV,TotalBookings,Bk_Err,CostofSupplier,TTV,M_date,SalePId from rpt_salesoverview_new_" + $scope.SalesOverviewRpt.Year + "_ch where CheckInDate BETWEEN '" + CheckIn + "' AND '" + CheckOut + "'order by Bgs desc  limit 0,100000  "
                    }
                    else {
                        //Query = "SELECT CName,Type,Market,TTV_K,Bgs,Can_Book,Can_Book_Per,RN,AVBV,OM_Per,Bk_Err_Per,M_date,SalePId from rpt_salesoverview_" + $scope.SalesOverviewRpt.Year + "_ch where BrId= " + $scope.SalesOverviewRpt.MemberId + " order by Bgs desc  limit 0,100000  "
                        Query = "SELECT CName,Type,Market,TTV_K,Bgs,Can_Book,RN,AVBV,TotalBookings,Bk_Err,CostofSupplier,TTV,M_date,SalePId from rpt_salesoverview_new_" + $scope.SalesOverviewRpt.Year + "_ch where BrId= " + $scope.SalesOverviewRpt.MemberId + " AND  CheckInDate BETWEEN '" + CheckIn + "' AND '" + CheckOut + "' order by Bgs desc  limit 0,100000  "
                    }
                }
                else if ($scope.SalesOverviewRpt.BookingdateWise == true) {
                    if ($scope.SalesOverviewRpt.MemberId == "0") {
                        //  Query = "SELECT CName,Type,Market,TTV_K,Bgs,Can_Book,RN,AVBV,TotalBookings,Bk_Err,CostofSupplier,TTV,M_date,SalePId,BookDate,CheckInDate from rpt_salesoverview_" + $scope.SalesOverviewRpt.Year + "_bk where BookDate BETWEEN '" + CheckIn + "' AND '" + CheckOut + "'  order by Bgs desc  limit 0,100000  "
                        Query = "SELECT CName,Type,Market,TTV_K,Bgs,Can_Book,RN,AVBV,TotalBookings,Bk_Err,CostofSupplier,TTV,M_date,SalePId,BookDate,CheckInDate from rpt_salesoverview_new_" + $scope.SalesOverviewRpt.Year + "_bk where BookDate BETWEEN '" + CheckIn + "' AND '" + CheckOut + "'  order by Bgs desc  limit 0,100000  "
                    }
                    else {
                        // Query = "SELECT CName,Type,Market,TTV_K,Bgs,Can_Book,RN,AVBV,TotalBookings,Bk_Err,CostofSupplier,TTV,M_date,SalePId,BookDate,CheckInDate from rpt_salesoverview_" + $scope.SalesOverviewRpt.Year + "_bk where BrId= " + $scope.SalesOverviewRpt.MemberId + " AND  BookDate BETWEEN '" + CheckIn + "' AND '" + CheckOut + "'  order by Bgs desc  limit 0,100  "
                        Query = "SELECT CName,Type,Market,TTV_K,Bgs,Can_Book,RN,AVBV,TotalBookings,Bk_Err,CostofSupplier,TTV,M_date,SalePId,BookDate,CheckInDate from rpt_salesoverview_new_" + $scope.SalesOverviewRpt.Year + "_bk where BrId= " + $scope.SalesOverviewRpt.MemberId + " AND  BookDate BETWEEN '" + CheckIn + "' AND '" + CheckOut + "'  order by Bgs desc  limit 0,100000  "
                    }
                }

            }
            else if ($scope.LoginMemberType == 2) {
                if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
                    if ($scope.SalesOverviewRpt.BookingdateWise == false) {
                        // Query = "SELECT  CName,Type,Market,TTV_K,Bgs,Can_Book,Can_Book_Per,RN,AVBV,OM_Per,Bk_Err_Per,M_date,SalePId from rpt_salesoverview_new_" + $scope.SalesOverviewRpt.Year + "_ch where BrId= " + $scope.MemberId + " and SalePId=" + $scope.IsSalePersonUserId + "   order by Bgs desc  limit 0,100000  "
                        Query = "SELECT  CName,Type,Market,TTV_K,Bgs,Can_Book,RN,AVBV,TotalBookings,Bk_Err,CostofSupplier,TTV,M_date,SalePId from rpt_salesoverview_new_" + $scope.SalesOverviewRpt.Year + "_ch where BrId= " + $scope.MemberId + " and SalePId=" + $scope.IsSalePersonUserId + " AND  CheckInDate BETWEEN '" + CheckIn + "' AND '" + CheckOut + "'   order by Bgs desc  limit 0,100000  "
                    }
                    else
                        if ($scope.SalesOverviewRpt.BookingdateWise == true) {
                            // Query = "SELECT  CName,Type,Market,TTV_K,Bgs,Can_Book,RN,AVBV,TotalBookings,Bk_Err,CostofSupplier,TTV,M_date,SalePId,BookDate,CheckInDate from rpt_salesoverview_" + $scope.SalesOverviewRpt.Year + "_bk where BrId= " + $scope.MemberId + " and SalePId=" + $scope.IsSalePersonUserId + "AND   BookDate BETWEEN '" + CheckIn + "' AND '" + CheckOut + "'  order by Bgs desc  limit 0,100000  "
                            Query = "SELECT  CName,Type,Market,TTV_K,Bgs,Can_Book,RN,AVBV,TotalBookings,Bk_Err,CostofSupplier,TTV,M_date,SalePId,BookDate,CheckInDate from rpt_salesoverview_new_" + $scope.SalesOverviewRpt.Year + "_bk where BrId= " + $scope.MemberId + " and SalePId=" + $scope.IsSalePersonUserId + "AND   BookDate BETWEEN '" + CheckIn + "' AND '" + CheckOut + "'  order by Bgs desc  limit 0,100000  "

                        }
                }
                else {
                    if ($scope.SalesOverviewRpt.BookingdateWise == false) {
                        // Query = "SELECT  CName,Type,Market,TTV_K,Bgs,Can_Book,Can_Book_Per,RN,AVBV,OM_Per,Bk_Err_Per,M_date,SalePId from rpt_salesoverview_" + $scope.SalesOverviewRpt.Year + "_ch where BrId= " + $scope.MemberId + "  order by Bgs desc  limit 0,100000  "
                        Query = "SELECT  CName,Type,Market,TTV_K,Bgs,Can_Book,RN,AVBV,TotalBookings,Bk_Err,CostofSupplier,TTV,M_date,SalePId from rpt_salesoverview_new_" + $scope.SalesOverviewRpt.Year + "_ch where BrId= " + $scope.MemberId + " AND  CheckInDate BETWEEN '" + CheckIn + "' AND '" + CheckOut + "' order by Bgs desc  limit 0,100000  "
                    }
                    else
                        if ($scope.SalesOverviewRpt.BookingdateWise == true) {
                            //Query = "SELECT  CName,Type,Market,TTV_K,Bgs,Can_Book,RN,AVBV,TotalBookings,Bk_Err,CostofSupplier,TTV,M_date,SalePId,BookDate,CheckInDate from rpt_salesoverview_" + $scope.SalesOverviewRpt.Year + "_bk where BrId= " + $scope.MemberId + " AND  BookDate BETWEEN '" + CheckIn + "' AND '" + CheckOut + "' order by Bgs desc  limit 0,100000  "
                            Query = "SELECT  CName,Type,Market,TTV_K,Bgs,Can_Book,RN,AVBV,TotalBookings,Bk_Err,CostofSupplier,TTV,M_date,SalePId,BookDate,CheckInDate from rpt_salesoverview_new_" + $scope.SalesOverviewRpt.Year + "_bk where BrId= " + $scope.MemberId + " AND  BookDate BETWEEN '" + CheckIn + "' AND '" + CheckOut + "' order by Bgs desc  limit 0,100000  "

                        }
                }
            }
        }
        else {
            if ($scope.SalesOverviewRpt.BookingdateWise == false) {
                //  Query = "SELECT  CName,Type,Market,TTV_K,Bgs,Can_Book,Can_Book_Per,RN,AVBV,OM_Per,Bk_Err_Per,M_date,SalePId from rpt_salesoverview_" + $scope.SalesOverviewRpt.Year + "_ch where BrId= " + $scope.SaleABranchId + " and SalePId=" + $scope.SalesAUserId + "   order by Bgs desc  limit 0,100000  "
                Query = "SELECT  CName,Type,Market,TTV_K,Bgs,Can_Book,RN,AVBV,TotalBookings,Bk_Err,CostofSupplier,TTV,M_date,SalePId from rpt_salesoverview_new_" + $scope.SalesOverviewRpt.Year + "_ch where BrId= " + $scope.SaleABranchId + " and SalePId=" + $scope.SalesAUserId + " AND  CheckInDate BETWEEN '" + CheckIn + "' AND '" + CheckOut + "'   order by Bgs desc  limit 0,100000  "
            }
            else
                if ($scope.SalesOverviewRpt.BookingdateWise == true) {
                    // Query = "SELECT  CName,Type,Market,TTV_K,Bgs,Can_Book,RN,AVBV,TotalBookings,Bk_Err,CostofSupplier,TTV,M_date,SalePId,BookDate,CheckInDate from rpt_salesoverview_" + $scope.SalesOverviewRpt.Year + "_bk where BrId= " + $scope.SaleABranchId + " and SalePId=" + $scope.SalesAUserId + " AND BookDate BETWEEN '" + CheckIn + "' AND '" + CheckOut + "'order by Bgs desc  limit 0,100000  "
                    Query = "SELECT  CName,Type,Market,TTV_K,Bgs,Can_Book,RN,AVBV,TotalBookings,Bk_Err,CostofSupplier,TTV,M_date,SalePId,BookDate,CheckInDate from rpt_salesoverview_new_" + $scope.SalesOverviewRpt.Year + "_bk where BrId= " + $scope.SaleABranchId + " and SalePId=" + $scope.SalesAUserId + " AND BookDate BETWEEN '" + CheckIn + "' AND '" + CheckOut + "'order by Bgs desc  limit 0,100000  "
                }
        }
        var settings = {
            "url": "https://osearch.xconnect.in/_opendistro/_sql",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "query": Query
            }),
        };

        $.ajax(settings).done(function (data) {
            var results = data['datarows'];
            $scope.total = data['total'];
            _Solution = results;
            var finalresult;
            const groupedResults = _Solution.reduce((acc, current) => {
                const key = `${current[0]}_${current[1]}_${current[2]}`;
                if (!acc[key]) {
                    acc[key] = {
                        CName: (current[0]),
                        Type: (current[1]),
                        Market: (current[2]),
                        TTV_K: 0,
                        Bgs: 0,
                        CXL: 0,
                        CXL_Per: 0,
                        RN: 0,
                        AVBV: 0,
                        TotalBookings: 0,
                        Bk_Err: 0,
                        CostofSupplier: 0,
                        TTV: 0,
                    };
                }


                acc[key].TTV_K += parseFloat((current[3]).toFixed(2));
                acc[key].Bgs += parseFloat((current[4]));
                acc[key].CXL += parseFloat((current[5]));
                acc[key].RN += parseFloat((current[6]));
                acc[key].AVBV += parseFloat((current[7]));
                acc[key].TotalBookings += parseFloat((current[8]));
                acc[key].Bk_Err += parseFloat((current[9]));
                acc[key].CostofSupplier += parseFloat((current[10]));
                acc[key].TTV += parseFloat((current[11]));
                [key].count++;
                return acc;
            }, {});

            const finalGroupedResults = Object.values(groupedResults).map(group => ({
                CName: group.CName,
                Type: group.Type,
                Market: group.Market,
                TTV_K: group.TTV_K,
                Bgs: group.Bgs,
                CXL: group.CXL,
                TotalBookings: group.TotalBookings,
                CXL_Per: (group.CXL / group.TotalBookings) * 100,
                RN: group.RN,
                //  AVBV: group.AVBV / group.Bgs,
                AVBV: group.Bgs == 0 ? 0.00 : group.AVBV / group.Bgs,

                CostofSupplier: group.CostofSupplier,
                TTV: group.TTV,

                Bk_Err_Per: (group.Bk_Err / group.TotalBookings) * 100,
                // OM_Per: (group.CostofSupplier / group.TTV) * 100,
                OM_Per: group.TTV == 0 ? (((group.CostofSupplier - 1) / 1) * 100) : (((group.CostofSupplier - group.TTV) / group.TTV) * 100),

            }));
            var empty = '';
            _Solution = finalGroupedResults.map(
                c => {
                    return {
                        'CName': c.CName,
                        'Type': c.Type,
                        'Market': c.Market,
                        'TTV_K': c.TTV_K.toFixed(2),
                        'Bgs': c.Bgs,
                        'CXL': c.CXL,
                        'CXL_Per': c.CXL_Per.toFixed(2),
                        'RN': c.RN,
                        'AVBV': c.AVBV.toFixed(2),
                        'OM_Per': c.OM_Per.toFixed(2),
                        'Bk_Err_Per': c.Bk_Err_Per.toFixed(2),


                    }
                }
            ).sort((a, b) => b.Bgs - a.Bgs);

            if (_Solution != null) {
                $scope.MainResultlist = (_Solution);
                $scope.MainResultlistAfterFilter = (_Solution);
                $scope.SecondMainResultlistAfterFilter = $scope.MainResultlistAfterFilter;
                $scope.currentleg = $scope.SecondMainResultlistAfterFilter.length;
                SetDataTable();
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
        });
    }


    var $mytable = $("#SalesOverviewRpt");
    //Set DataTable
    function SetDataTable() {
        if ($scope.ReportFilter.GroupBy == "") {
            $('#SalesOverviewRpt').DataTable().clear().destroy();
            $('#SalesOverviewRpt').DataTable({
                "order": [],
                responsive: true,
                dom: 'Bfrtip',
                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: '<i class="fa fa-file-excel-o"></i>',
                        filename: function () {
                            var ReportName = "Sales Overview Report"
                            var AgeDetails = $scope.SalesOverviewRpt.DateFrom + "-" + $scope.SalesOverviewRpt.DateTo;
                            return ReportName + ' ( ' + AgeDetails + ' ) '
                        },
                        sheetName: 'SalesOverviewRptSheet',
                        title: null,
                        exportOptions: {
                            columns: $scope.ExcelCollist,
                        }
                    },
                    {
                        extend: 'copyHtml5',
                        text: '<i class="fa fa-files-o"></i>',
                        titleAttr: 'Copy',
                        exportOptions: {
                            columns: $scope.ExcelCollist,
                        },
                    },
                ],
                "columnDefs": [
                    {
                        "targets": 0,
                        orderable: true,
                    },
                    {
                        "targets": 1,
                        orderable: true,
                    },
                    {
                        "targets": 2,
                        orderable: true,
                    },
                    {
                        "targets": 3,
                        orderable: true,
                        "className": "text-right",
                    },
                    {
                        "targets": 4,
                        orderable: true,
                        "className": "text-right",
                    },
                    {
                        "targets": 5,
                        orderable: true,
                        "className": "text-right",
                    },
                    {
                        "targets": 6,
                        orderable: true,
                        "className": "text-right",
                    },
                    {
                        "targets": 7,
                        orderable: true,
                        "className": "text-right",
                    },
                    {
                        "targets": 8,
                        orderable: true,
                        "className": "text-right",
                    },
                    {
                        "targets": 9,
                        orderable: true,
                        "className": "text-right",
                        "visible": $scope.LoginMemberType == 1,
                    },
                    {
                        "targets": 10,
                        orderable: true,
                        "className": "text-right",
                    }
                ],
                searching: false,
                paging: true,
                data: $scope.SecondMainResultlistAfterFilter,
                "pageLength": 100000,
                "deferRender": true,
                select: true,
                columns: [

                    { data: 'CName' },
                    { data: 'Type' },
                    { data: 'Market' },
                    { data: 'TTV_K' },
                    { data: 'Bgs' },
                    { data: 'CXL' },
                    { data: 'CXL_Per' },
                    { data: 'RN' },
                    { data: 'AVBV' },
                    { data: 'OM_Per' },
                    { data: 'Bk_Err_Per' },
                ],

            });
            $('.dataTables_info').html('Showing ' + $scope.SecondMainResultlistAfterFilter.length + ' entries');
            $('#SalesOverviewRpt_paginate').css("display", "none");
        }
        $scope.HideColList = [];
        $scope.HideColList = GetHideColList($scope.ReportFilter.GroupBy);
        $('#ddlHide').empty();
        $('#ddlHide option').remove();
        $('#ddlHide').multiselect('destroy');
        if ($scope.HideColList.length > 0) {
            $.each($scope.HideColList, function (index) {
                $('#ddlHide').append($('<option></option>').val($scope.HideColList[index].split('~')[0]).html($scope.HideColList[index].split('~')[2]));
            });
        }
        $('#ddlHide').multiselect({
            includeSelectAllOption: true,
            enableFiltering: true,
            buttonWidth: 250
        });
    }
    $scope.count = 5;
    $scope.LoadData = false;
    /*  $(window).scroll(function (e) {
          if ($scope.LoadData == false) {
              var max = $scope.currentleg + 20; //max number of rows (just for demo)
              //listen for scroll and resize and custom 'fetchmore' events
              $(window).bind('scroll resize fetchmore', function () {
                  var viewportHeight = window.innerHeight;
                  var scrolltop = $(window).scrollTop();
                  var bottomOfTable = $mytable.offset().top + $mytable.outerHeight();
                  if ($(window).scrollTop() + viewportHeight >= bottomOfTable) {
                      if ($scope.count < max) {
                          $scope.LoadData = true;
                          if ($scope.total > 0) {
                              //load_more();
                              $(window).trigger("fetchmore"); //keep triggering this event until we've filled the viewport
                          }
                      }
                  }
              });
              //trigger initial fetch
              $(window).trigger("fetchmore");
          }
      });*/


    /* function load_more() {
         //$scope.SalesOverviewRpt.MemberId = $("#ddl_BR").val();
          if ($scope.LoginMemberType == 1) {
            if ($scope.SalesOverviewRpt.MemberId != 0) {
                $scope.SaleABranchId = $scope.SalesOverviewRpt.MemberId;
            }
        }
         $scope.SalesOverviewRpt.Year = $("#ddlYear").val();
         SetLimit($scope.LoadData);
         var Query = "";
         if ($scope.Search == false) {
             if ($scope.LoginMemberType == 1) {
                 if ($scope.SalesOverviewRpt.BookingdateWise == false) {
                     if ($scope.SalesOverviewRpt.MemberId == "0") {
                         Query = "SELECT CName,Type,Market,TTV_K,Bgs,Can_Book,Can_Book_Per,RN,AVBV,OM_Per,Bk_Err_Per,M_date,SalePId from rpt_salesoverview_" + $scope.SalesOverviewRpt.Year + "_ch order by Bgs desc  limit 0,100000  "
                     }
                     else {
                         Query = "SELECT CName,Type,Market,TTV_K,Bgs,Can_Book,Can_Book_Per,RN,AVBV,OM_Per,Bk_Err_Per,M_date,SalePId from rpt_salesoverview_" + $scope.SalesOverviewRpt.Year + "_ch where BrId= " + $scope.SalesOverviewRpt.MemberId + " order by Bgs desc  limit 0,100000  "
                     }
                 }
                 else if ($scope.SalesOverviewRpt.BookingdateWise == true) {
                     if ($scope.SalesOverviewRpt.MemberId == "0") {
                         Query = "SELECT CName,Type,Market,TTV_K,Bgs,Can_Book,Can_Book_Per,RN,AVBV,OM_Per,Bk_Err_Per,M_date,SalePId from rpt_salesoverview_" + $scope.SalesOverviewRpt.Year + "_bk  order by Bgs desc  limit 0,100000  "
                     }
                     else {
                         Query = "SELECT CName,Type,Market,TTV_K,Bgs,Can_Book,Can_Book_Per,RN,AVBV,OM_Per,Bk_Err_Per,M_date,SalePId from rpt_salesoverview_" + $scope.SalesOverviewRpt.Year + "_bk where BrId= " + $scope.SalesOverviewRpt.MemberId + "  order by Bgs desc  limit 0,100000  "
                     }
                 }
             }
             else if ($scope.LoginMemberType == 2) {
                 if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
                     if ($scope.SalesOverviewRpt.BookingdateWise == false) {
                         Query = "SELECT  CName,Type,Market,TTV_K,Bgs,Can_Book,Can_Book_Per,RN,AVBV,OM_Per,Bk_Err_Per,M_date,SalePId from rpt_salesoverview_" + $scope.SalesOverviewRpt.Year + "_ch where BrId= " + $scope.MemberId + " and SalePId=" + $scope.IsSalePersonUserId + "   order by Bgs desc  limit 0,100000  "
                     }
                     else
                         if ($scope.SalesOverviewRpt.BookingdateWise == true) {
                             Query = "SELECT  CName,Type,Market,TTV_K,Bgs,Can_Book,Can_Book_Per,RN,AVBV,OM_Per,Bk_Err_Per,M_date,SalePId from rpt_salesoverview_" + $scope.SalesOverviewRpt.Year + "_bk where BrId= " + $scope.MemberId + " and SalePId=" + $scope.IsSalePersonUserId + " order by Bgs desc  limit 0,100000  "
                         }
                 }
                 else {
                     if ($scope.SalesOverviewRpt.BookingdateWise == false) {
                         Query = "SELECT  CName,Type,Market,TTV_K,Bgs,Can_Book,Can_Book_Per,RN,AVBV,OM_Per,Bk_Err_Per,M_date,SalePId from rpt_salesoverview_" + $scope.SalesOverviewRpt.Year + "_ch where BrId= " + $scope.MemberId + "  order by Bgs desc  limit 0,100000  "
                     }
                     else
                         if ($scope.SalesOverviewRpt.BookingdateWise == true) {
                             Query = "SELECT  CName,Type,Market,TTV_K,Bgs,Can_Book,Can_Book_Per,RN,AVBV,OM_Per,Bk_Err_Per,M_date,SalePId from rpt_salesoverview_" + $scope.SalesOverviewRpt.Year + "_bk where BrId= " + $scope.MemberId + "  order by Bgs desc  limit 0,100000  "
                         }
                 }
             }
         }
         else {
             if ($scope.SalesOverviewRpt.BookingdateWise == false) {
                 Query = "SELECT  CName,Type,Market,TTV_K,Bgs,Can_Book,Can_Book_Per,RN,AVBV,OM_Per,Bk_Err_Per,M_date,SalePId from rpt_salesoverview_" + $scope.SalesOverviewRpt.Year + "_ch where BrId= " + $scope.SaleABranchId + " and SalePId=" + $scope.SalesAUserId + "   order by Bgs desc  limit 0,100000  "
             }
             else
                 if ($scope.SalesOverviewRpt.BookingdateWise == true) {
                     Query = "SELECT  CName,Type,Market,TTV_K,Bgs,Can_Book,Can_Book_Per,RN,AVBV,OM_Per,Bk_Err_Per,M_date,SalePId from rpt_salesoverview_" + $scope.SalesOverviewRpt.Year + "_bk where BrId= " + $scope.SaleABranchId + " and SalePId=" + $scope.SalesAUserId + " order by Bgs desc  limit 0,100000  "
                 }
         }
         var settings = {
             "url": "https://osearch.xconnect.in/_opendistro/_sql",
             "method": "POST",
             "timeout": 0,
             "headers": {
                 "Content-Type": "application/json"
             },
             "async": false,
             "data": JSON.stringify({
                 "query": Query
             }),
         };
         var _Solution = [];
         $.ajax(settings).done(function (data) {
             var results = data['datarows'];
             $scope.total = data['total'];
             _Solution = results;
             _Solution = results.map(
                 c => {
                     return {
                         'CName': (c[0]),
                         'Type': (c[1]),
                         'Market': (c[2]),
                         'TTV_K': (c[3]).toFixed(2),
                         'Bgs': (c[4]),
                         'CXL': (c[5]),
                         'CXL_Per': (c[6]).toFixed(2),
                         'RN': (c[7]),
                         'AVBV': (c[8]).toFixed(2),
                         'OM_Per': (c[9]).toFixed(2),
                         'Bk_Err_Per': (c[10]).toFixed(2),
                     }
                 }
             );
 
             if (_Solution != null) {
                 $scope.MainResultlistAfterFilter = (_Solution);
                 ///////////                    
                 $.each($scope.MainResultlistAfterFilter, function (i, item) {
                     if (i == 0) {
                         $("#SalesOverviewRpt").html('');
                         if ($scope.LoginMemberType == 1) {
                             added_row = '<thead class="main-head hidden-xs" id = "theaddiv"> <tr> <th>Client Name</th> <th>Type</th> <th>Market</th> <th style="text-align:right;">TTV</th> <th style="text-align:right;">Bookings</th><th style="text-align:right;">CXL</th><th style="text-align:right;">CXL %</th><th style="text-align:right;">RN</th><th style="text-align:right;">AVBV</th><th style="text-align:right;">OM %</th><th style="text-align:right;">Booking Error %</th></tr></thead >'
                         }
                         else {
                             added_row = '<thead class="main-head hidden-xs" id = "theaddiv"> <tr> <th>Client Name</th> <th>Type</th> <th>Market</th> <th style="text-align:right;">TTV</th> <th style="text-align:right;">Bookings</th><th style="text-align:right;">CXL</th><th style="text-align:right;">CXL %</th><th style="text-align:right;">RN</th><th style="text-align:right;">AVBV</th><th style="text-align:right;">Booking Error %</th></tr></thead >'
                         }
                     }
                     if ($scope.LoginMemberType == 1) {
                         added_row += '<tr>'
                             + '<td>' + item.CName + '</td>'
                             + '<td>' + item.Type + '</td>'
                             + '<td>' + item.Market + '</td>'
                             + '<td style="text-align:right;">' + item.TTV_K + '</td>'
                             + '<td style="text-align:right;">' + item.Bgs + '</td>'
                             + '<td style="text-align:right;">' + item.CXL + '</td>'
                             + '<td style="text-align:right;">' + item.CXL_Per + '</td>'
                             + '<td style="text-align:right;">' + item.RN + '</td>'
                             + '<td style="text-align:right;">' + item.AVBV + '</td>'
                             + '<td style="text-align:right;">' + item.OM_Per + '</td>'
                             + '<td style="text-align:right;">' + item.Bk_Err_Per + '</td>'
                             + '</tr>';
                     }
                     else {
                         added_row += '<tr>'
                             + '<td>' + item.CName + '</td>'
                             + '<td>' + item.Type + '</td>'
                             + '<td>' + item.Market + '</td>'
                             + '<td style="text-align:right;">' + item.TTV_K + '</td>'
                             + '<td style="text-align:right;">' + item.Bgs + '</td>'
                             + '<td style="text-align:right;">' + item.CXL + '</td>'
                             + '<td style="text-align:right;">' + item.CXL_Per + '</td>'
                             + '<td style="text-align:right;">' + item.RN + '</td>'
                             + '<td style="text-align:right;">' + item.AVBV + '</td>'                           
                             + '<td style="text-align:right;">' + item.Bk_Err_Per + '</td>'
                             + '</tr>';
                     }
                    
                     $scope.count = $scope.count + 1;
                     $scope.SecondMainResultlistAfterFilter.push(item);
                 });
                 $("#SalesOverviewRpt").append(added_row);
                 $scope.currentleg = $scope.currentleg + $scope.MainResultlistAfterFilter.length;
 
                 $('.dataTables_info').html('Showing ' + $scope.SecondMainResultlistAfterFilter.length + ' entries');
                 $('#SalesOverviewRpt_paginate').css("display", "none");
                 /////////////
                 $scope.LoadData = false;
             }
             else {
                 $scope.ModifySearch = false;
                 $("#Noresultdiv")[0].style.display = "block";
                 $("#RptHeaderDetails")[0].style.display = "block";
                 PopUpController.ClosePopup("divPopup", "");
             }
         });
     }*/

    //Show cols for Excel and Copy
    function ShowHideExcelColumns() {
        $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        if ($scope.LoginMemberType == "4") {
            $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

            if ($scope.IsShowSupplier != "true") {
                $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            }
        }
        else {
            $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

            if ($scope.IsShowSupplier != "true") {
                $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            }
        }
    }

    //onHide Popup Click
    $scope.HideColumns = function () {
        //Hide_Columns is comm. fun in CommonUtility.js
        Hide_Columns('SalesOverviewRpt')
    }

    //Filter
    //open filter popup 
    $scope.OpenFilterPopup = function (SelectedFilterType) {
        $scope.FilterTypeActive = SelectedFilterType;

        $scope.SetFilterList();

        var model1 = angular.element(document.querySelector('#filterdiv'));
        model1.modal('show');

    }

    //on Apply btn Click
    $scope.ApplyFilter = function () {

        //Apply_Filter this is comm. fun for all in CommonUtility.js
        $scope.MainResultlistAfterFilter = Apply_Filter($scope.FilterDOList, $scope.FilterTypeActive, $scope.MainResultlist);

        $("#filterdiv").modal('hide');
        SetDataTable();
        $scope.filter = true;
        $scope.ModifySearch = false;
        $("#RptDetails")[0].style.display = "block";
        $("#RptHeaderDetails")[0].style.display = "block";
        PopUpController.ClosePopup("divPopup", "");
    }

    //set filterlist in ddllist in popup
    $scope.SetFilterList = function () {

        //Set_FilterList this is comm. fun for all in CommonUtility.js
        $scope.MainResultlistAfterFilter = Set_FilterList($scope.FilterDOList, $scope.FilterTypeActive, $scope.MainResultlist, $scope.ReportFilter);

    }

    //On load clear All data
    $scope.OnlyClearAll = function () {

        $scope.FilterDOList = [];
        $scope.selectedArray = "";


        $('option', $('#ddlFilter')).each(function (element) {
            $(this).removeAttr('selected').prop('selected', false);
        });
        $("#ddlFilter").multiselect('refresh');
        $('#ddlFilter').multiselect({
            includeSelectAllOption: true,
            enableFiltering: true,
            buttonWidth: 250
        });
        $scope.selectedArray = "";

        //for remove red color when second time serach and perivios filter red colr
        var aColl = document.getElementsByClassName('filter-icon');
        for (var i = 0, len = aColl.length; i < len; i++) {
            aColl[i].style["color"] = '#337ab7';
        }
    }

    //Clear Selected filter values
    $scope.ClearFilterSelectedvalue = function () {

        $('option', $('#ddlFilter')).each(function (element) {
            $(this).removeAttr('selected').prop('selected', false);
        });
        $("#ddlFilter").multiselect('refresh');
        $('#ddlFilter').multiselect({
            includeSelectAllOption: true,
            enableFiltering: true,
            buttonWidth: 250
        });
        $scope.selectedArray = "";

        $scope.ApplyFilter();
        $("#" + $scope.FilterTypeActive)[0].style.color = "#337ab7";
    }


    ////Sorting
    function SortingSetting() {

        $scope.SortColList = [];
        $scope.SortColList = GetHideColList($scope.ReportFilter.GroupBy);

    }
    $scope.addMoreLevel = function (currentsrno) {

        $scope.TempSortDetails = AddSorting_MoreLevel(currentsrno, $scope.SortDetails);
        if ($scope.TempSortDetails.length > 0) {
            $scope.SortDetails = $scope.TempSortDetails;
        }
    }
    $scope.deleteLevel = function (SrNo) {
        $scope.SortDetails = DeleteSorting_Level(SrNo, $scope.SortDetails);
    }

    $scope.ApplySorting = function () {
        //in commonUtility.js 
        Apply_Sorting('SalesOverviewRpt', $scope.SortDetails)

    }
    $scope.ClearSorting = function () {
        $scope.SortDetails = [];
        $scope.SortDetails = Clear_Sorting('SalesOverviewRpt');
        SetDataTable();
    }

    //clear popup  sorting list  when datatble sorting
    $scope.ClearPopupSoting = function () {
        $scope.SortDetails = [];
        $scope.objSort = [];
        $scope.objSort.SrNo = (1);
        $scope.objSort.Column = "0";
        $scope.objSort.Order = "0";
        $scope.SortDetails.push($scope.objSort);

    }
    //////

    function GetReportGraph() {
        google.charts.load('current', { 'packages': ['bar'] });
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            var arrSales = [['AgName', 'SType']];    // Define an array and assign columns for the chart.
            // Loop through each data and populate the array.
            $.each($scope.MainResultlistAfterFilter, function (index, value) {
                arrSales.push([value.AgName, value.SType]);
            });
            var data2 = google.visualization.arrayToDataTable([
                ['Year', 'Sales', 'Expenses', 'Profit'],
                ['2014', 1000, 400, 200],
                ['2015', 1170, 460, 250],
                ['2016', 660, 1120, 300],
                ['2017', 1030, 540, 350]
            ]);

            var data = google.visualization.arrayToDataTable(arrSales)
            var options = {
                chart: {
                    title: 'Booking Report Graph',
                    subtitle: 'Confirmed Bookings',
                },
                bars: 'vertical',
                vAxis: { format: 'decimal' },
                height: 400,
                colors: ['#1b9e77', '#d95f02', '#7570b3']
            };
            var chart = new google.charts.Bar(document.getElementById('columnchart_material'));
            chart.draw(data, google.charts.Bar.convertOptions(options));
        }
    }
}]);


$(".sortcolunm").change(function () {
    var selecttype = $("#sortcolunm").val().split('~')[1];

    var SortOrderList = [];
    if (selecttype == '0') {
        SortOrderList.push('Smllest to Largest~asc');
        SortOrderList.push('Largest to  Smllest~desc');
    }
    else if (selecttype == '1') {
        SortOrderList.push('A to Z~asc');
        SortOrderList.push('Z to  A~desc');
    }
    else if (selecttype == '2') {
        SortOrderList.push('Smllest to Largest~asc');
        SortOrderList.push('Largest to  Smllest~desc');
    }
    alert('jiii');
});




function CalltoFilterPopup(type) {
    var scope = angular.element(document.getElementById("MainWrap")).scope();
    scope.$apply(function () {
        scope.OpenFilterPopup(type);
    })
    return;
}
function forMultiselect() {
    $('#ddlFilter').multiselect({
        includeSelectAllOption: true,
        enableFiltering: true,
        buttonWidth: 250
    });
}
function GetHideColList(GroupBy) {
    var HideColList = [];
    HideColList.push("0~RefNo~Book Ref /Pos");
    if (GetE("hdnLoginMemberTypeId").value != "4") {
        HideColList.push("1~AgName~Agency Name");
    }
    HideColList.push("2~BDate~Book Date");
    HideColList.push("3~ChkIn~Check In Date");
    HideColList.push("4~SType~Service");
    HideColList.push("5~SName~Service Name");
    HideColList.push("6~Nts~Nights");
    HideColList.push("7~CityName~City Name");
    if (GetE("hdnIsShowSupplier").value == "true") {
        HideColList.push("8~SuppName~Supplier Name");
    }
    HideColList.push("9~BType~Source");
    HideColList.push("10~BookedBy~Booked By");
    HideColList.push("12~Postbyuser~Post by User");

    if (GroupBy != "") {
        var NewHideColList = [];
        switch (GroupBy) {
            case '1':
                NewHideColList = removeElementsfromhidelist(HideColList, '1~Agency Name');
                break;
            case '4':
                NewHideColList = removeElementsfromhidelist(HideColList, '4~Service');
                break;
            case '7':
                NewHideColList = removeElementsfromhidelist(HideColList, '7~Supplier Name');
                break;
        }
    }
    NewHideColList = HideColList;
    return NewHideColList;
}

$(document).ready(function () {
    $(".date-cal").datepicker({ dateFormat: 'dd M yy', numberOfMonths: 2, });
    var table = $('#SalesOverviewRpt').dataTable();
    //for sorting icon clear custom sorting list
    table.on('click', 'th', function () {
        var info = table.fnSettings().aaSorting;
        var idx = info[0][0];
        //alert(idx);
        //alert($(this).attr('class'));
        if ($(this).attr('class') == 'sorting_asc' || $(this).attr('class') == 'sorting_desc' || $(this).attr('class') == 'sorting') {
            var scope = angular.element(document.getElementById("MainWrap")).scope();
            scope.$apply(function () {
                scope.ClearPopupSoting();
            })
            return;
        }
    });
    //for enable sorting on filter icon
    var $select = $('.filter-icon').on('click', function (e) {
        //console.log(" click on select in column =");
        e.stopPropagation();
    });
});




