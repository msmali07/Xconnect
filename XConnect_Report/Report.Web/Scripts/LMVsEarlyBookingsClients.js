﻿var app = angular.module('LMVsEarlyBookingsClientapp', []);

var bid = ""; var brtypeid = ""; var mid = ""; var mrtypeid = ""; var bid = ""; var Wsid = ""; var membertypeid = "";
var isvalid = true;
app.controller('LMVsEarlyBookingsClientCntr', ['$scope', '$http', '$window', '$rootScope', '$timeout', function ($scope, $http, $window, $rootScope, $timeout) {
    NgInit();
    function NgInit() { 
        $scope.LMVsEarlyBookingsClient = CommonDashBoardV1DO();
        $scope.ReportFilter = ReportFilterDO();
        $scope.PostBooking = PostBookingDO();
        $scope.SendMailDO = SendMailDO();

        $scope.IsShowSupplier = GetE("hdnIsShowSupplier").value;
        $scope.LoginMemberTypeID = GetE("hdnLoginMemberTypeId").value;

        $scope.MemberId = GetE("hdnLoginMemberId").value;//If Branch Login

        $scope.LoginBranchId = GetE("hdnBranchId").value;
        $scope.IsSalePerson = GetE("hdnIsSalePerson").value;
        $scope.IsSalePersonUserId = GetE("hdnLoginUserId").value;
        GetsalesPerson();
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
       // $scope.LMVsEarlyBookingsClient.MemberId = "10561"
        $scope.CustomDateRangeFilter = "2024";
        SortingSetting();
        ShowHideExcelColumns();

        $("#ddl_BR option:selected").text("All Branch");
        $("#ddl_AG option:selected").text("All Agent");



     
        $('#txtFromDate').datepicker({
            changeMonth: true,
            dateFormat: 'dd M yy',
            minDate: '01 Jan 2024',
            maxDate: '31 Dec 2024',
            numberOfMonths: 2,
        });

        /*$scope.DateTo = ConvertCustomrangedate('31-Dec-2024');*/
        $('#txtToDate').datepicker({
            changeMonth: true,
            dateFormat: 'dd M yy',
            minDate: '01 Jan 2024',
            maxDate: '31 Dec 2024',
            numberOfMonths: 2,
        });
        $scope.DateFrom = '01 Jan 2024';
        $scope.DateTo = '30 Jan 2024';

        $scope.DateWise = '';
       

        $scope.LMVsEarlyBookingsClient.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
        $scope.LMVsEarlyBookingsClient.DateTo = ConvertCustomrangedate(new Date());
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
        $http.get("../CommonData/GetSalesPersonList?MemberTypeId=" + $scope.LoginMemberTypeID + "&MemberId=" + $scope.MemberId).then(function (d) {
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

        //$scope.PostBooking.ReportCompanyName = "";

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
        $scope.DateFrom= angular.element(document.getElementById("txtFromDate")).val();
        $scope.DateTo = angular.element(document.getElementById("txtToDate")).val();
        if ($scope.LMVsEarlyBookingsClient.DateFrom == "") {

            Alert.render("Please Select Arrival-From Date", "txtFromDate");
            isvalid = false;
            return false;
        }

        if ($scope.LMVsEarlyBookingsClient.DateTo == "") {
            Alert.render("Please Select Arrival-To Date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ($scope.DateFrom != "" && $scope.DateTo != "") {
            var dtObj1 = GetSystemDate($scope.DateFrom);
            var dtObj2 = GetSystemDate($scope.DateTo);
        }

        /*if (($scope.LMVsEarlyBookingsClient.DateFrom != "" && $scope.LMVsEarlyBookingsClient.DateTo != "") && (dtObj1 > dtObj2)) {
            Alert.render("Arrival-From date can not be greater than Arrival-To date", "txtToDate");
            isvalid = false;
            return false;
        }*/
        if ((diffDate(new Date($scope.LMVsEarlyBookingsClient.DateTo), new Date($scope.LMVsEarlyBookingsClient.DateFrom))) > 12.50) {
            Alert.render("Report Seraching Dates Should be Upto 12 Months", "txtToDate");
            isvalid = false;
            return false;
        }

      
        if ($scope.DateFrom == "") {
            Alert.render("Please Select From Date", "txtFromDate");
            isvalid = false;
            return false;
        }

        if ($scope.DateTo == "") {
            Alert.render("Please Select To Date", "txtToDate");
            isvalid = false;
            return false;
        }
        if (($scope.DateFrom != "" && $scope.DateTo != "") && (dtObj1 > dtObj2)) {
            Alert.render("Arrival-From date can not be greater than Arrival-To date", "txtToDate");
            isvalid = false;
            return false;
        }
        const date1 = new Date($scope.DateFrom);
        const date2 = new Date($scope.DateTo);
        const days = 29;
        const newDate = addDays(date1, days);
        if (date2 > newDate) {
            Alert.render("From and To Date should be within 30 days ", "txtToDate");
            isvalid = false;
            return false;
        }
        $scope.DateFromSearch = formatdate($scope.DateFrom)
        $scope.DateToSearch = formatdate($scope.DateTo)

        if (document.getElementById('ADW').checked) {
            $scope.LMVsEarlyBookingsClient.BookingdateWise = false;
            $scope.DateWise = 'Service Date Wise';
        }
        if (document.getElementById('BDW').checked) {
            $scope.LMVsEarlyBookingsClient.BookingdateWise = true;
            $scope.DateWise = 'Booking Date Wise';
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
                $scope.LMVsEarlyBookingsClient.BookingdateWise = false;
            }
            if (document.getElementById('BDW').checked) {
                $scope.LMVsEarlyBookingsClient.BookingdateWise = true;
            }
            if ($scope.IsGetfromHome == true) {
                $scope.PostBooking.ReportCompanyName = $scope.OnLoadReportCompanyName;
                $scope.PostBooking.PostMemberId = $scope.OnLoadPostMemberId;
            }
            $scope.MemberDetails = $scope.PostBooking.Br_Id + "_" + $scope.PostBooking.Ws_Id + "_" + $scope.PostBooking.Ag_Id + "_" + $scope.PostBooking.ReportCompanyName + "_" + GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text;
            $scope.LMVsEarlyBookingsClient.MemberId = $scope.PostBooking.PostMemberId;
            $scope.LMVsEarlyBookingsClient.LoginUserId = (document.getElementById("hdnLoginUserId")).value;
        }
        if (document.getElementById('ADW').checked) {
            $scope.LMVsEarlyBookingsClient.BookingdateWise = false;
        }
        if (document.getElementById('BDW').checked) {
            $scope.LMVsEarlyBookingsClient.BookingdateWise = true;
        }
        if (isvalid == true) {
            $scope.GetReportDetails();
        }
    }
    function SetLimit(LoadData) {
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
    }
    const ddlYear = document.getElementById('ddlYear');
    const datePicker = document.getElementById('txtFromDate');
    $("#txtFromDate").change(function () {
        let dateString1 = angular.element(document.getElementById("txtFromDate")).val();
        var DateFrom = new Date(dateString1);
        var newDate = DateFrom.setDate(DateFrom.getDate() + 29);
        $scope.DateTo = ConvertCustomrangedate(newDate);
        var DateTo = new Date(newDate);
        var lastdate = '31 Dec ' + $("#ddlYear").val();
        var DateTo1 = new Date(lastdate);
        datePicker.max = ConvertCustomrangedate(newDate);
        if (DateTo > DateTo1) {
            datePicker.max = lastdate;
            $scope.DateTo = ConvertCustomrangedate(lastdate);
        }
        $('#txtToDate').datepicker('destroy').datepicker({
            dateFormat: 'dd M yy',
            minDate: dateString1,
            maxDate: datePicker.max,
            numberOfMonths: 2,
        });

    });

    $("#ddlYear").change(function () {
        $scope.LMVsEarlyBookingsClient.DateFrom = "";
        $scope.LMVsEarlyBookingsClient.DateTo = "";
        const selectedYear = ddlYear.value;
        const minDate = new Date(selectedYear, 0 + 1, 1 - 30);
        const maxDate = new Date(selectedYear, 0 + 1, 0);
        datePicker.min = minDate.toISOString().split('T')[0];
        datePicker.max = maxDate.toISOString().split('T')[0];
        $scope.LMVsEarlyBookingsClient.DateFrom = ConvertCustomrangedate(datePicker.min);
        $scope.LMVsEarlyBookingsClient.DateTo = ConvertCustomrangedate(datePicker.max);
        document.getElementById("txtFromDate").value = $scope.LMVsEarlyBookingsClient.DateFrom;
        document.getElementById("txtToDate").value = $scope.LMVsEarlyBookingsClient.DateTo;

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


        var ReportName = "LM Vs Early Bookings Client Report";
        var popupdetail = $scope.PostBooking.ReportCompanyName + "~" + $scope.LMVsEarlyBookingsClient.DateFrom + "~" + $scope.LMVsEarlyBookingsClient.DateTo;
        PopUpController.OpenPopup2("divPopup", ReportName, popupdetail);
        $scope.ReportFilter.CustomDateOption = $("#ddl_CustomDateRange").val();
        $scope.currentleg = 0; $scope.count = 0;
        $("#demo").addClass("collapse in");
        $scope.LMVsEarlyBookingsClient.Year = $("#ddlYear").val();
        $scope.LMVsEarlyBookingsClient.MemberId = $("#ddl_BR").val();
        $scope.Limit = "";
        $scope.LoadData = false;
        SetLimit($scope.LoadData);
        var query = "";
        //$scope.Search = $("#ddlSalesPersonReportAcess").val() == "0" ? false : true;
        //if ($scope.Search == true) {
        //    $scope.SaleABranchId = $("#ddlSalesPersonReportAcess").val().split("~")[0];
        //    $scope.SalesAUserId = $("#ddlSalesPersonReportAcess").val().split("~")[1];
        //}

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
            if ($scope.LMVsEarlyBookingsClient.MemberId != 0) {
                $scope.SaleABranchId = $scope.LMVsEarlyBookingsClient.MemberId;
            }
        }

        //if ($scope.Search == false) {
        //    if ($scope.LoginMemberTypeID == 1) {
        //        if ($scope.LMVsEarlyBookingsClient.MemberId == "0") {
        //            query = " select C_ID, BrId,ClientName,Type,Market,Owner,sum(LM) as LM ,sum(SevToThirty) as SevToThirty ,sum(ThirtyPlus) as ThirtyPlus, sum(T_bookings) as Tbookings, M_date from rpt_early_book_clients_" + $scope.LMVsEarlyBookingsClient.Year + "_bk  group by C_ID,Market,ClientName,Owner,Type,BrId , M_date order by Tbookings desc LIMIT " + $scope.Limit + " "
        //        }
        //        else {
        //            query = " select C_ID, BrId,ClientName,Type,Market,Owner,sum(LM) as LM ,sum(SevToThirty) as SevToThirty ,sum(ThirtyPlus) as ThirtyPlus, sum(T_bookings) as Tbookings, M_date from rpt_early_book_clients_" + $scope.LMVsEarlyBookingsClient.Year + "_bk where BrId =" + $scope.LMVsEarlyBookingsClient.MemberId + "  group by C_ID,Market,ClientName,Owner,Type,BrId , M_date order by Tbookings desc LIMIT " + $scope.Limit + " "
        //        }
        //    }
        //    else if ($scope.LoginMemberTypeID == 2) {
        //        if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
        //            query = " select C_ID, BrId,ClientName,Type,Market,Owner,sum(LM) as LM ,sum(SevToThirty) as SevToThirty ,sum(ThirtyPlus) as ThirtyPlus, sum(T_bookings) as Tbookings, M_date from rpt_early_book_clients_" + $scope.LMVsEarlyBookingsClient.Year + "_bk where BrId =" + $scope.MemberId + " and Saleperson = " + $scope.IsSalePersonUserId + "  group by C_ID,Market,ClientName,Owner,Type,BrId , M_date order by Tbookings desc LIMIT " + $scope.Limit + " "
        //        }
        //        else {
        //            query = " select C_ID, BrId,ClientName,Type,Market,Owner,sum(LM) as LM ,sum(SevToThirty) as SevToThirty ,sum(ThirtyPlus) as ThirtyPlus, sum(T_bookings) as Tbookings, M_date from rpt_early_book_clients_" + $scope.LMVsEarlyBookingsClient.Year + "_bk where BrId =" + $scope.MemberId + "  group by C_ID,Market,ClientName,Owner,Type,BrId , M_date order by Tbookings desc LIMIT " + $scope.Limit + " "
        //        }
        //    }
        //}
        //else {
        //    query = " select C_ID, BrId,ClientName,Type,Market,Owner,sum(LM) as LM ,sum(SevToThirty) as SevToThirty ,sum(ThirtyPlus) as ThirtyPlus, sum(T_bookings) as Tbookings, M_date from rpt_early_book_clients_" + $scope.LMVsEarlyBookingsClient.Year + "_bk where BrId =" + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + "  group by C_ID,Market,ClientName,Owner,Type,BrId , M_date order by Tbookings desc LIMIT " + $scope.Limit + " "
        //}

      
        if ($scope.Search == false) {
            if ($scope.LoginMemberTypeID == 1) {
                if ($scope.LMVsEarlyBookingsClient.BookingdateWise == false && $scope.LMVsEarlyBookingsClient.MemberId == "0") {
                    query = " select C_ID, BrId,ClientName,Type,Market,Owner,LM ,SevToThirty ,ThirtyPlus, T_bookings as Tbookings, M_date from rpt_early_book_clients_new_" + $scope.LMVsEarlyBookingsClient.Year + "_ch Where CheckInDate BETWEEN '" + $scope.DateFromSearch + "' AND '" + $scope.DateToSearch + "'  order by Tbookings desc LIMIT 100000";
                }
                else if ($scope.LMVsEarlyBookingsClient.BookingdateWise == true && $scope.LMVsEarlyBookingsClient.MemberId == 0) {
                    query = " select C_ID, BrId,ClientName,Type,Market,Owner,LM ,SevToThirty ,ThirtyPlus, T_bookings as Tbookings, M_date from rpt_early_book_clients_new_" + $scope.LMVsEarlyBookingsClient.Year + "_bk Where BookDate BETWEEN '" + $scope.DateFromSearch + "' AND '" + $scope.DateToSearch + "'  order by Tbookings desc LIMIT 100000";
                }
                else if ($scope.LMVsEarlyBookingsClient.BookingdateWise == false && $scope.LMVsEarlyBookingsClient.MemberId != 0) {
                    query = " select C_ID, BrId,ClientName,Type,Market,Owner,LM ,SevToThirty ,ThirtyPlus, T_bookings as Tbookings, M_date  from rpt_early_book_clients_new_" + $scope.LMVsEarlyBookingsClient.Year + "_ch where BrId =" + $scope.LMVsEarlyBookingsClient.MemberId + "  AND CheckInDate BETWEEN '" + $scope.DateFromSearch + "' AND '" + $scope.DateToSearch + "' order by Tbookings desc LIMIT 100000";
                }
                else if ($scope.LMVsEarlyBookingsClient.BookingdateWise == true && $scope.LMVsEarlyBookingsClient.MemberId != 0) {
                    query = " select C_ID, BrId,ClientName,Type,Market,Owner,LM ,SevToThirty ,ThirtyPlus, T_bookings as Tbookings, M_date  from rpt_early_book_clients_new_" + $scope.LMVsEarlyBookingsClient.Year + "_bk where BrId =" + $scope.LMVsEarlyBookingsClient.MemberId + " AND BookDate BETWEEN '" + $scope.DateFromSearch + "' AND '" + $scope.DateToSearch + "' order by Tbookings desc LIMIT 100000";
                }
            }
            else if ($scope.LoginMemberTypeID == 2) {
                if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
                    if ($scope.LMVsEarlyBookingsClient.BookingdateWise == false) {
                        query = " select C_ID, BrId,ClientName,Type,Market,Owner,LM ,SevToThirty ,ThirtyPlus, T_bookings as Tbookings, M_date  from rpt_early_book_clients_new_" + $scope.LMVsEarlyBookingsClient.Year + "_ch where BrId =" + $scope.MemberId + " and Saleperson = " + $scope.IsSalePersonUserId + " AND CheckInDate BETWEEN '" + $scope.DateFromSearch + "' AND '" + $scope.DateToSearch + "'  order by Tbookings desc LIMIT 100000";
                    }
                    else if ($scope.LMVsEarlyBookingsClient.BookingdateWise == true) {
                        query = " select C_ID, BrId,ClientName,Type,Market,Owner,LM ,SevToThirty ,ThirtyPlus, T_bookings as Tbookings, M_date  from rpt_early_book_clients_new_" + $scope.LMVsEarlyBookingsClient.Year + "_bk where BrId =" + $scope.MemberId + " and Saleperson = " + $scope.IsSalePersonUserId + " AND BookDate BETWEEN '" + $scope.DateFromSearch + "' AND '" + $scope.DateToSearch + "' order by Tbookings desc LIMIT 100000";
                    }
                }
                else {
                    if ($scope.LMVsEarlyBookingsClient.BookingdateWise == false) {
                        query = " select C_ID, BrId,ClientName,Type,Market,Owner,LM ,SevToThirty ,ThirtyPlus, T_bookings as Tbookings, M_date  from rpt_early_book_clients_new_" + $scope.LMVsEarlyBookingsClient.Year + "_ch where BrId =" + $scope.MemberId + " AND CheckInDate BETWEEN '" + $scope.DateFromSearch + "' AND '" + $scope.DateToSearch + "' order by Tbookings desc LIMIT 100000";
                    }
                    else if ($scope.LMVsEarlyBookingsClient.BookingdateWise == true) {
                        query = " select C_ID, BrId,ClientName,Type,Market,Owner,LM ,SevToThirty ,ThirtyPlus, T_bookings as Tbookings, M_date  from rpt_early_book_clients_new_" + $scope.LMVsEarlyBookingsClient.Year + "_bk where BrId =" + $scope.MemberId + " AND BookDate BETWEEN '" + $scope.DateFromSearch + "' AND '" + $scope.DateToSearch + "'  order by Tbookings desc LIMIT 100000";
                    }
                }
            }
        }
        else {
            if ($scope.LMVsEarlyBookingsClient.BookingdateWise == false) {
                query = " select C_ID, BrId,ClientName,Type,Market,Owner,LM ,SevToThirty ,ThirtyPlus, T_bookings as Tbookings, M_date  from rpt_early_book_clients_new_" + $scope.LMVsEarlyBookingsClient.Year + "_ch where BrId =" + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + " AND CheckInDate BETWEEN '" + $scope.DateFromSearch + "' AND '" + $scope.DateToSearch + "'   order by Tbookings desc LIMIT 100000";
            }
            else if ($scope.LMVsEarlyBookingsClient.BookingdateWise == true) {
                query = " select C_ID, BrId,ClientName,Type,Market,Owner,LM ,SevToThirty ,ThirtyPlus, T_bookings as Tbookings, M_date  from rpt_early_book_clients_new_" + $scope.LMVsEarlyBookingsClient.Year + "_bk where BrId =" + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + " AND BookDate BETWEEN '" + $scope.DateFromSearch + "' AND '" + $scope.DateToSearch + "'   order by Tbookings desc LIMIT 100000";
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
                "query": query
            }),
        };
        //$.ajax(settings).done(function (data) {
        //    var results = data['datarows'];
        //    $scope.total = data['total'];
        //    _Solution = results;
        //    _Solution = results.map(
        //        c => {
        //            return {
        //                'ClientName': (c[2]),
        //                'Type': (c[3]),
        //                'Market': (c[4]),
        //                'Owner': (c[5]),
        //                'T_bookings': (c[9]),
        //                'LM': (c[9]) == 0 ? 0 : ((c[6]) / (c[9]) * 100).toFixed(2),
        //                'SevToThirty': (c[9]) == 0 ? 0 : ((c[7]) / (c[9]) * 100).toFixed(2),
        //                'ThirtyPlus': (c[9]) == 0 ? 0 : ((c[8]) / (c[9]) * 100).toFixed(2),
        //            }
        //        }
        //    );
        //    if (_Solution != null) {
        //        $scope.MainResultlist = (_Solution);
        //        $scope.MainResultlistAfterFilter = (_Solution);
        //        $scope.SecondMainResultlistAfterFilter = $scope.MainResultlistAfterFilter;
        //        $scope.currentleg = $scope.SecondMainResultlistAfterFilter.length;
        //        SetDataTable();
        //        $scope.ModifySearch = false;
        //        $("#RptDetails")[0].style.display = "block";
        //        $("#RptHeaderDetails")[0].style.display = "block";
        //        PopUpController.ClosePopup("divPopup", "");
        //    }
        //    else {
        //        $scope.ModifySearch = false;
        //        $("#Noresultdiv")[0].style.display = "block";
        //        $("#RptHeaderDetails")[0].style.display = "block";
        //        PopUpController.ClosePopup("divPopup", "");
        //    }
        //});

     
        $.ajax(settings).done(function (data) {
            var results = data['datarows'];
            $scope.total = data['total'];
            _Solution = results;
            // Creating const group result 

            const groupedResults = _Solution.reduce((acc, current) => {
                const key = `${current[0]}_${current[1]}_${current[2]}_${current[3]}_${current[4]}_${current[5]}_${current[10]}`;
                if (!acc[key]) {
                    acc[key] = {
                        C_ID: (current[0]),
                        BrId: (current[1]),
                        ClientName: (current[2]),
                        Type: (current[3]),
                        Market: (current[4]),
                        Owner: (current[5]),
                        LM: 0,
                        SevToThirty: 0,
                        ThirtyPlus: 0,
                        Tbookings: 0,
                        M_date: (current[10])
                    };
                }
                acc[key].LM += parseFloat((current[6]));
                acc[key].SevToThirty += parseFloat((current[7]));
                acc[key].ThirtyPlus += parseFloat((current[8]));
                acc[key].Tbookings += parseFloat((current[9]));
                acc[key].count++;
                return acc;
            }, {});

            // groupedResults = groupedResults.sort(a => a.SupplierName =="Rail Europe 4A")
            // groupedResults = groupedResults.sort(a => b.SupplierName == "Rail Europe 4A");
            const finalGroupedResults = Object.values(groupedResults).map(group => ({
                C_ID: group.C_ID,
                RNBrId: group.BrId,
                ClientName: group.ClientName,
                Type: group.Type,
                Market: group.Market,
                Owner: group.Owner,
                LM: group.LM,
                SevToThirty: group.SevToThirty,
                ThirtyPlus: group.ThirtyPlus,
                Tbookings: group.Tbookings,
                M_date: group.M_date
            }));


            _Solution = finalGroupedResults.map(
                c => {
                    return {


                        //'ClientName': (c[2]),
                        //'Type': (c[3]),
                        //'Market': (c[4]),
                        //'Owner': (c[5]),
                        //'T_bookings': (c[9]),
                        //'LM': (c[9]) == 0 ? 0 : ((c[6]) / (c[9]) * 100).toFixed(2),
                        //'SevToThirty': (c[9]) == 0 ? 0 : ((c[7]) / (c[9]) * 100).toFixed(2),
                        //'ThirtyPlus': (c[9]) == 0 ? 0 : ((c[8]) / (c[9]) * 100).toFixed(2),

                        'ClientName': c.ClientName,
                        'Type': c.Type,
                        'Market': c.Market,
                        'Owner': c.Owner,
                        'T_bookings': c.Tbookings,
                        'LM': (c.Tbookings == 0 ? (c.LM / 1).toFixed(2) : (c.LM / c.Tbookings)*100).toFixed(2),
                        'SevToThirty': (c.Tbookings == 0 ? (c.SevToThirty / 1).toFixed(2) : (c.SevToThirty / c.Tbookings) * 100).toFixed(2),
                        'ThirtyPlus': (c.Tbookings == 0 ? (c.ThirtyPlus / 1).toFixed(2) : (c.ThirtyPlus / c.Tbookings) * 100).toFixed(2),

                    }
                }
            );
            _Solution = _Solution.sort((a, b) => b.T_bookings - a.T_bookings);

            if (_Solution != null) {
                //if (d.data.length > 0)

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


    var $mytable = $("#LMVsEarlyBookingsClient");
    //Set DataTable
    function SetDataTable() {
        if ($scope.ReportFilter.GroupBy == "") {
            $('#LMVsEarlyBookingsClient').DataTable().clear().destroy();
            $('#LMVsEarlyBookingsClient').DataTable({
                "order": [],
                responsive: true,
                dom: 'Bfrtip',
                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: '<i class="fa fa-file-excel-o"></i>',
                        filename: function () {
                            var ReportName = "Sales Overview Report"
                            if ($scope.LMVsEarlyBookingsClient.MemberId == "0") {
                                var AgeDetails = $scope.DateFrom + "-" + $scope.DateTo;
                            } else {
                                var AgeDetails = $scope.PostBooking.ReportCompanyName + " From " + $scope.DateFrom + "-" + $scope.DateTo
                            }
                            //var AgeDetails = $scope.LMVsEarlyBookingsClient.DateFrom + "-" + $scope.LMVsEarlyBookingsClient.DateTo;
                            return ReportName + ' ( ' + AgeDetails + ' ) '
                        },
                        sheetName: 'LMVsEarlyBookingsClientSheet',
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
                        orderable: false,
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
                    }


                ],
                searching: false,
                paging: true,
                data: $scope.SecondMainResultlistAfterFilter,
                "pageLength": 100000,
                "deferRender": true,
                select: true,
                columns: [
                    { data: 'ClientName' },
                    { data: 'Type' },
                    { data: 'Market' },
                    { data: 'Owner' },
                    { data: 'T_bookings' },
                    { data: 'LM' },
                    { data: 'SevToThirty' },
                    { data: 'ThirtyPlus' },
                ],

            });
            $('.dataTables_info').html('Showing ' + $scope.SecondMainResultlistAfterFilter.length + ' entries');
            $('#LMVsEarlyBookingsClient_paginate').css("display", "none");
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
    //$(window).scroll(function (e) {
    //    if ($scope.LoadData == false) {
    //        var max = $scope.currentleg + 20; //max number of rows (just for demo)
    //        //listen for scroll and resize and custom 'fetchmore' events
    //        $(window).bind('scroll resize fetchmore', function () {
    //            var viewportHeight = window.innerHeight;
    //            var scrolltop = $(window).scrollTop();
    //            var bottomOfTable = $mytable.offset().top + $mytable.outerHeight();
    //            if ($(window).scrollTop() + viewportHeight >= bottomOfTable) {
    //                if ($scope.count < max) {
    //                    $scope.LoadData = true;
    //                    if ($scope.total > 0) {
    //                        load_more();
    //                        $(window).trigger("fetchmore"); //keep triggering this event until we've filled the viewport
    //                    }
    //                }
    //            }
    //        });
    //        //trigger initial fetch
    //        $(window).trigger("fetchmore");
    //    }
    //});


    function load_more() {
        $scope.LMVsEarlyBookingsClient.MemberId = $("#ddl_BR").val();
        $scope.LMVsEarlyBookingsClient.Year = $("#ddlYear").val();
        SetLimit($scope.LoadData);
        var query = "";
        if ($scope.Search == false) {
            if ($scope.LoginMemberTypeID == 1) {
                if ($scope.LMVsEarlyBookingsClient.MemberId == "0") {
                    query = " select C_ID, BrId,ClientName,Type,Market,Owner,sum(LM) as LM ,sum(SevToThirty) as SevToThirty ,sum(ThirtyPlus) as ThirtyPlus, sum(T_bookings) as Tbookings, M_date from rpt_early_book_clients_" + $scope.LMVsEarlyBookingsClient.Year + "_bk  group by C_ID,Market,ClientName,Owner,Type,BrId , M_date order by Tbookings desc LIMIT " + $scope.Limit + " "
                }
                else {
                    query = " select C_ID, BrId,ClientName,Type,Market,Owner,sum(LM) as LM ,sum(SevToThirty) as SevToThirty ,sum(ThirtyPlus) as ThirtyPlus, sum(T_bookings) as Tbookings, M_date from rpt_early_book_clients_" + $scope.LMVsEarlyBookingsClient.Year + "_bk where BrId =" + $scope.LMVsEarlyBookingsClient.MemberId + "  group by C_ID,Market,ClientName,Owner,Type,BrId , M_date order by Tbookings desc LIMIT " + $scope.Limit + " "
                }
            }
            else if ($scope.LoginMemberTypeID == 2) {
                if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
                    query = " select C_ID, BrId,ClientName,Type,Market,Owner,sum(LM) as LM ,sum(SevToThirty) as SevToThirty ,sum(ThirtyPlus) as ThirtyPlus, sum(T_bookings) as Tbookings, M_date from rpt_early_book_clients_" + $scope.LMVsEarlyBookingsClient.Year + "_bk where BrId =" + $scope.MemberId + " and Saleperson = " + $scope.IsSalePersonUserId + "  group by C_ID,Market,ClientName,Owner,Type,BrId , M_date order by Tbookings desc LIMIT " + $scope.Limit + " "
                }
                else {
                    query = " select C_ID, BrId,ClientName,Type,Market,Owner,sum(LM) as LM ,sum(SevToThirty) as SevToThirty ,sum(ThirtyPlus) as ThirtyPlus, sum(T_bookings) as Tbookings, M_date from rpt_early_book_clients_" + $scope.LMVsEarlyBookingsClient.Year + "_bk where BrId =" + $scope.MemberId + "  group by C_ID,Market,ClientName,Owner,Type,BrId , M_date order by Tbookings desc LIMIT " + $scope.Limit + " "
                }
            }
        }
        else {
            query = " select C_ID, BrId,ClientName,Type,Market,Owner,sum(LM) as LM ,sum(SevToThirty) as SevToThirty ,sum(ThirtyPlus) as ThirtyPlus, sum(T_bookings) as Tbookings, M_date from rpt_early_book_clients_" + $scope.LMVsEarlyBookingsClient.Year + "_bk where BrId =" + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + "  group by C_ID,Market,ClientName,Owner,Type,BrId , M_date order by Tbookings desc LIMIT " + $scope.Limit + " "
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
                "query": query
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
                        'ClientName': (c[2]),
                        'Type': (c[3]),
                        'Market': (c[4]),
                        'Owner': (c[5]),
                        'T_bookings': (c[9]),
                        'LM': (c[9]) == 0 ? 0 : ((c[6]) / (c[9]) * 100).toFixed(2),
                        'SevToThirty': (c[9]) == 0 ? 0 : ((c[7]) / (c[9]) * 100).toFixed(2),
                        'ThirtyPlus': (c[9]) == 0 ? 0 : ((c[8]) / (c[9]) * 100).toFixed(2),
                    }
                }
            );

            if (_Solution != null) {
                $scope.MainResultlistAfterFilter = (_Solution);
                ///////////                    
                $.each($scope.MainResultlistAfterFilter, function (i, item) {
                    if (i == 0) {
                        $("#LMVsEarlyBookingsClient").html('');
                        added_row = '<thead class="main-head hidden-xs" id="theaddiv"><tr><th>Client Name</th><th>Type</th><th>Market</th><th title="Key Account Manager">KAM</th> <th style="text-align:right;" title="Bookings">BKG</th><th style="text-align:right;" >LM</th><th style="text-align:right;">7To30</th> <th style="text-align:right;">+30</th></tr></thead>';
                    }
                    added_row += '<tr>'
                        + '<td>' + item.ClientName + '</td>'
                        + '<td>' + item.Type + '</td>'
                        + '<td>' + item.Market + '</td>'
                        + '<td>' + item.Owner + '</td>'
                        + '<td style="text-align:right;">' + item.T_bookings + '</td>'
                        + '<td style="text-align:right;">' + item.LM + '</td>'
                        + '<td style="text-align:right;">' + item.SevToThirty + '</td>'
                        + '<td style="text-align:right;">' + item.ThirtyPlus + '</td>'
                        + '</tr>';

                    $scope.count = $scope.count + 1;
                    $scope.SecondMainResultlistAfterFilter.push(item);
                });
                $("#LMVsEarlyBookingsClient").append(added_row);
                $scope.currentleg = $scope.currentleg + $scope.MainResultlistAfterFilter.length;

                $('.dataTables_info').html('Showing ' + $scope.SecondMainResultlistAfterFilter.length + ' entries');
                $('#LMVsEarlyBookingsClient_paginate').css("display", "none");
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
    }

    //Show cols for Excel and Copy
    function ShowHideExcelColumns() {
        $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6];

        if ($scope.LoginMemberType == "4") {
            $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6];

            if ($scope.IsShowSupplier != "true") {
                $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6];
            }
        }
        else {
            $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6];

            if ($scope.IsShowSupplier != "true") {
                $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6];
            }
        }
    }

    //onHide Popup Click
    $scope.HideColumns = function () {
        //Hide_Columns is comm. fun in CommonUtility.js
        Hide_Columns('LMVsEarlyBookingsClient')
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
        Apply_Sorting('LMVsEarlyBookingsClient', $scope.SortDetails)

    }
    $scope.ClearSorting = function () {
        $scope.SortDetails = [];
        $scope.SortDetails = Clear_Sorting('LMVsEarlyBookingsClient');
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

function formatdate(inputdate) {
    const parts = inputdate.split(" ");
    const day = parseInt(parts[0]);
    const month = String(parts[1]);
    const year = parseInt(parts[2]);
    const Month = GetMonthName(month);

    const day2 = String(parts[0]);

    //if (day > 10) {
    //    day2 = "0" + day2;
    //}
    const formatteddate = year + "-" + Month + "-" + day2 + " 00:00:00";

    return formatteddate
}
function GetMonthName(Month) {
    switch (String(Month)) {
        case "Jan":
            return "01";
            break;
        case "Feb":
            return "02";
            break;
        case "Mar":
            return "03";
            break;
        case "Apr":
            return "04";
            break;
        case "May":
            return "05";
            break;
        case "Jun":
            return "06";
            break;
        case "Jul":
            return "07";
            break;
        case "Aug":
            return "08";
            break;
        case "Sep":
            return "09";
            break;
        case "Oct":
            return "10";
            break;
        case "Nov":
            return "11";
            break;
        case "Dec":
            return "12";
            break;
    }
}


function addDays(date, days) {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    return newDate;
}



$(document).ready(function () {
    $(".date-cal").datepicker({ dateFormat: 'dd M yy', numberOfMonths: 2, });
    var table = $('#LMVsEarlyBookingsClient').dataTable();
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




