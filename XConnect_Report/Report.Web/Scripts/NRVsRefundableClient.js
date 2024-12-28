﻿var app = angular.module('NRVsRefClientapp', []);

var bid = ""; var brtypeid = ""; var mid = ""; var mrtypeid = ""; var bid = ""; var Wsid = ""; var membertypeid = "";
var isvalid = true;
app.controller('NRVsRefClientCntr', ['$scope', '$http', '$window', '$rootScope', '$timeout', function ($scope, $http, $window, $rootScope, $timeout) {
    NgInit();
    function NgInit() {
        $scope.NRVsRefClient = CommonDashBoardV1DO();
        $scope.ReportFilter = ReportFilterDO();
        $scope.PostBooking = PostBookingDO();
        $scope.SendMailDO = SendMailDO();

        $scope.IsShowSupplier = GetE("hdnIsShowSupplier").value;
        $scope.LoginMemberTypeID = GetE("hdnLoginMemberTypeId").value;
        $scope.MemberId = GetE("hdnLoginMemberId").value;//If Branch Login      

        $scope.IsSalePerson = GetE("hdnIsSalePerson").value;
        $scope.IsSalePersonUserId = GetE("hdnLoginUserId").value;
        GetsalesPerson();
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
        $scope.CustomDateRangeFilter = "2024";
        SortingSetting();
        ShowHideExcelColumns();

        $("#ddl_BR option:selected").text("All Branch");
        $("#ddl_AG option:selected").text("All Agent");
        $scope.NRVsRefClient.DateFrom = '01 Jan ' + new Date().getFullYear();
        $scope.NRVsRefClient.DateTo = '30 Jan ' + new Date().getFullYear();
        /* $scope.NRVsRefClient.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
         $scope.NRVsRefClient.DateTo = ConvertCustomrangedate(new Date());*/
        //this is PostBooking Init()
        $scope.PostBooking = PostBooking_Init($scope.PostBooking, $scope.LoginMemberTypeID)
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
        $scope.NRVsRefClient.DateFrom = angular.element(document.getElementById("txtFromDate")).val();
        $scope.NRVsRefClient.DateTo = angular.element(document.getElementById("txtToDate")).val();
        if ($scope.NRVsRefClient.DateFrom == "") {

            Alert.render("Please Select Arrival-From Date", "txtFromDate");
            isvalid = false;
            return false;
        }

        if ($scope.NRVsRefClient.DateTo == "") {
            Alert.render("Please Select Arrival-To Date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ($scope.NRVsRefClient.DateFrom != "" && $scope.NRVsRefClient.DateTo != "") {
            var dtObj1 = GetSystemDate($scope.NRVsRefClient.DateFrom);
            var dtObj2 = GetSystemDate($scope.NRVsRefClient.DateTo);
        }

        if (($scope.NRVsRefClient.DateFrom != "" && $scope.NRVsRefClient.DateTo != "") && (dtObj1 > dtObj2)) {
            Alert.render("Arrival-From date can not be greater than Arrival-To date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ((diffDate(new Date($scope.NRVsRefClient.DateTo), new Date($scope.NRVsRefClient.DateFrom))) > 12.50) {
            Alert.render("Report Seraching Dates Should be Upto 12 Months", "txtToDate");
            isvalid = false;
            return false;
        }
        // hdnLoginMemberId
        //PostBookingSetting
        if ($scope.LoginMemberTypeID == 1) {
            $scope.PostBooking = PostBooking_Setting($scope.PostBooking, $scope.LoginMemberTypeID)
            //if ($scope.PostBooking.PostMemberId == "0") {
            //    if (GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text != "All Agent") {
            //        Alert.render("Select Member to Post Booking", "ddl_BR");
            //        isvalid = false;
            //        return false;
            //    }
            //}
            if (document.getElementById('ADW').checked) {
                $scope.NRVsRefClient.BookingdateWise = false;
                $scope.NRVsRefClient.category = 'Service Date Wise';
            }
            if (document.getElementById('BDW').checked) {
                $scope.NRVsRefClient.BookingdateWise = true;
                $scope.NRVsRefClient.category = 'Booking Date Wise';
            }
            if ($scope.IsGetfromHome == true) {
                $scope.PostBooking.ReportCompanyName = $scope.OnLoadReportCompanyName;
                $scope.PostBooking.PostMemberId = $scope.OnLoadPostMemberId;
            }
            $scope.MemberDetails = $scope.PostBooking.Br_Id + "_" + $scope.PostBooking.Ws_Id + "_" + $scope.PostBooking.Ag_Id + "_" + $scope.PostBooking.ReportCompanyName + "_" + GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text;
            $scope.NRVsRefClient.MemberId = $scope.PostBooking.PostMemberId;
            $scope.NRVsRefClient.LoginUserId = (document.getElementById("hdnLoginUserId")).value;
        }
        if (document.getElementById('ADW').checked) {
            $scope.NRVsRefClient.BookingdateWise = false;
            $scope.NRVsRefClient.category = 'Service Date Wise';
        }
        if (document.getElementById('BDW').checked) {
            $scope.NRVsRefClient.BookingdateWise = true;
            $scope.NRVsRefClient.category = 'Booking Date Wise';
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
            $scope.JCount = 50;
            $scope.Limit = $scope.Icount + "," + $scope.JCount;
            $scope.Icount = 1;
        }
    }
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
        $scope.NRVsRefClient.DateTo = ConvertCustomrangedate(newDate);
        var DateTo = new Date(newDate);
        var lastdate = '31 Dec ' + $("#ddlYear").val();
        var DateTo1 = new Date(lastdate);
        datePicker.max = ConvertCustomrangedate(newDate);
        if (DateTo > DateTo1) {
            datePicker.max = lastdate;
            $scope.NRVsRefClient.DateTo = ConvertCustomrangedate(lastdate);
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
            $scope.NRVsRefClient.DateFrom = '01 Jan ' + $("#ddlYear").val();
            $scope.NRVsRefClient.DateTo = '30 Jan ' + $("#ddlYear").val();
            document.getElementById("txtFromDate").value = $scope.NRVsRefClient.DateFrom;
            document.getElementById("txtToDate").value = $scope.NRVsRefClient.DateTo;

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
        $scope.NRVsRefClient.DateFrom = "";
        $scope.NRVsRefClient.DateTo = "";
        const selectedYear = ddlYear.value;
        const minDate = new Date(selectedYear, 0 + 1, 1 - 30);
        const maxDate = new Date(selectedYear, 0 + 1, 0);
        datePicker.min = minDate.toISOString().split('T')[0];
        datePicker.max = maxDate.toISOString().split('T')[0];
        $scope.NRVsRefClient.DateFrom = ConvertCustomrangedate(datePicker.min);
        $scope.NRVsRefClient.DateTo = ConvertCustomrangedate(datePicker.max);
        document.getElementById("txtFromDate").value = $scope.NRVsRefClient.DateFrom;
        document.getElementById("txtToDate").value = $scope.NRVsRefClient.DateTo;

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
        var ReportName = "NR Vs Refundable Client Report";
        var popupdetail = $scope.PostBooking.ReportCompanyName + "~" + $scope.NRVsRefClient.DateFrom + "~" + $scope.NRVsRefClient.DateTo;
        PopUpController.OpenPopup2("divPopup", ReportName, popupdetail);
        $scope.ReportFilter.CustomDateOption = $("#ddl_CustomDateRange").val();
        $scope.currentleg = 0; $scope.count = 0;
        $("#demo").addClass("collapse in");
        $scope.NRVsRefClient.Year = $("#ddlYear").val();
        $scope.NRVsRefClient.MemberId = $("#ddl_BR").val();
      
        var Query = "";
        $scope.Limit = "";
        $scope.LoadData = false;
        const dateString1 = angular.element(document.getElementById("txtFromDate")).val();;
        const dateString2 = angular.element(document.getElementById("txtToDate")).val();;

        const dateObject1 = new Date(dateString1);
        const dateObject2 = new Date(dateString2);

        const CheckIn = `${dateObject1.getFullYear()}-${padZero(dateObject1.getMonth() + 1)}-${padZero(dateObject1.getDate())} ${padZero(dateObject1.getHours())}:${padZero(dateObject1.getMinutes())}:${padZero(dateObject1.getSeconds())}`;
        const CheckOut = `${dateObject2.getFullYear()}-${padZero(dateObject2.getMonth() + 1)}-${padZero(dateObject2.getDate())} ${padZero(dateObject2.getHours())}:${padZero(dateObject2.getMinutes())}:${padZero(dateObject2.getSeconds())}`;

        function padZero(value) {
            return (value < 10 ? '0' : '') + value;
        }
        // SetLimit($scope.LoadData);
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
            if ($scope.NRVsRefClient.MemberId != 0) {
                $scope.SaleABranchId = $scope.NRVsRefClient.MemberId;
            }
        }
        if ($scope.Search == false) {
            if ($scope.LoginMemberTypeID == 1) {
                if ($scope.NRVsRefClient.BookingdateWise == false) {
                    if ($scope.NRVsRefClient.MemberId == 0) {
                        // Query = "select C_ID,ClientName,Type,Market,Owner,sum(NR),SUM(RF),sum(T_bookings) as Total from rpt_nr_refundable_clients_" + $scope.NRVsRefClient.Year + "_bk group by  C_ID,ClientName,Type,Market,Owner order by Total desc LIMIT " + $scope.Limit + " "
                        Query = "select C_ID,ClientName,Type,Market,Owner,NR,RF,T_bookings as Total from rpt_nr_refundable_clients_new_" + $scope.NRVsRefClient.Year + "_ch  where CheckInDate BETWEEN '" + CheckIn + "' AND '" + CheckOut + "' order by Total desc limit 0,100000  "
                    }
                    else {
                        // Query = "select C_ID,ClientName,Type,Market,Owner,sum(NR),SUM(RF),sum(T_bookings) as Total from rpt_nr_refundable_clients_" + $scope.NRVsRefClient.Year + "_bk where BrId=" + $scope.NRVsRefClient.MemberId + " group by  C_ID,ClientName,Type,Market,Owner order by Total desc LIMIT " + $scope.Limit + " "
                        Query = "select C_ID,ClientName,Type,Market,Owner,NR,RF,T_bookings as Total from rpt_nr_refundable_clients_new_" + $scope.NRVsRefClient.Year + "_ch where BrId=" + $scope.NRVsRefClient.MemberId + "  AND  CheckInDate BETWEEN '" + CheckIn + "' AND '" + CheckOut + "'  order by Total desc limit 0,100000  "
                    }
                }
               else if ($scope.NRVsRefClient.BookingdateWise == true) {
                    if ($scope.NRVsRefClient.MemberId == 0) {
                        // Query = "select C_ID,ClientName,Type,Market,Owner,sum(NR),SUM(RF),sum(T_bookings) as Total from rpt_nr_refundable_clients_" + $scope.NRVsRefClient.Year + "_bk group by  C_ID,ClientName,Type,Market,Owner order by Total desc LIMIT " + $scope.Limit + " "
                        Query = "select C_ID,ClientName,Type,Market,Owner,NR,RF,T_bookings as Total from rpt_nr_refundable_clients_new_" + $scope.NRVsRefClient.Year + "_bk where BookDate BETWEEN '" + CheckIn + "' AND '" + CheckOut + "' order by Total desc limit 0,100000  "
                    }
                    else {
                        //Query = "select C_ID,ClientName,Type,Market,Owner,sum(NR),SUM(RF),sum(T_bookings) as Total from rpt_nr_refundable_clients_" + $scope.NRVsRefClient.Year + "_bk where BrId=" + $scope.NRVsRefClient.MemberId + " group by  C_ID,ClientName,Type,Market,Owner order by Total desc LIMIT " + $scope.Limit + " "
                        Query = "select C_ID,ClientName,Type,Market,Owner,NR,RF,T_bookings as Total from rpt_nr_refundable_clients_new_" + $scope.NRVsRefClient.Year + "_bk where BrId=" + $scope.NRVsRefClient.MemberId + " AND  BookDate BETWEEN '" + CheckIn + "' AND '" + CheckOut + "' order by Total desc limit 0,100000  "
                    }
                }

            }
            else if ($scope.LoginMemberTypeID == 2) {
                if ($scope.NRVsRefClient.BookingdateWise == false) {
                    if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
                        // Query = "select C_ID,ClientName,Type,Market,Owner,sum(NR),SUM(RF),sum(T_bookings) as Total,BrId,Saleperson from rpt_nr_refundable_clients_" + $scope.NRVsRefClient.Year + "_bk where BrId=" + $scope.MemberId + "  and Saleperson = " + $scope.IsSalePersonUserId + " group by  C_ID,ClientName,Type,Market,Owner,BrId,Saleperson order by Total desc LIMIT " + $scope.Limit + " "
                        Query = "select C_ID,ClientName,Type,Market,Owner,NR,RF,T_bookings as Total,BrId,Saleperson from rpt_nr_refundable_clients_new_" + $scope.NRVsRefClient.Year + "_ch where BrId=" + $scope.MemberId + "  and Saleperson = " + $scope.IsSalePersonUserId + "  AND  CheckInDate BETWEEN '" + CheckIn + "' AND '" + CheckOut + "'  order by Total desc limit 0,100000  "
                    }
                    else {
                        //  Query = "select C_ID,ClientName,Type,Market,Owner,sum(NR),SUM(RF),sum(T_bookings) as Total from rpt_nr_refundable_clients_" + $scope.NRVsRefClient.Year + "_bk where BrId=" + $scope.MemberId + " group by  C_ID,ClientName,Type,Market,Owner order by Total desc LIMIT " + $scope.Limit + " "
                        Query = "select C_ID,ClientName,Type,Market,Owner,NR,RF,T_bookings as Total from rpt_nr_refundable_clients_new_" + $scope.NRVsRefClient.Year + "_ch where BrId=" + $scope.MemberId + " AND  CheckInDate BETWEEN '" + CheckIn + "' AND '" + CheckOut + "'  order by Total desc limit 0,100000  "
                    }
                }
               else if ($scope.NRVsRefClient.BookingdateWise == true) {
                    if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
                        //   Query = "select C_ID,ClientName,Type,Market,Owner,sum(NR),SUM(RF),sum(T_bookings) as Total,BrId,Saleperson from rpt_nr_refundable_clients_" + $scope.NRVsRefClient.Year + "_bk where BrId=" + $scope.MemberId + "  and Saleperson = " + $scope.IsSalePersonUserId + " group by  C_ID,ClientName,Type,Market,Owner,BrId,Saleperson order by Total desc LIMIT " + $scope.Limit + " "
                        Query = "select C_ID,ClientName,Type,Market,Owner,NR,RF,T_bookings as Total,BrId,Saleperson from rpt_nr_refundable_clients_new_" + $scope.NRVsRefClient.Year + "_bk where BrId=" + $scope.MemberId + "  and Saleperson = " + $scope.IsSalePersonUserId + " AND  BookDate BETWEEN '" + CheckIn + "' AND '" + CheckOut + "'   order by Total desc limit 0,100000  "
                    }
                    else {
                        //Query = "select C_ID,ClientName,Type,Market,Owner,sum(NR),SUM(RF),sum(T_bookings) as Total from rpt_nr_refundable_clients_" + $scope.NRVsRefClient.Year + "_bk where BrId=" + $scope.MemberId + " group by  C_ID,ClientName,Type,Market,Owner order by Total desc LIMIT " + $scope.Limit + " "
                        Query = "select C_ID,ClientName,Type,Market,Owner,NR,RF,T_bookings as Total from rpt_nr_refundable_clients_new_" + $scope.NRVsRefClient.Year + "_bk where BrId=" + $scope.MemberId + "  AND  BookDate BETWEEN '" + CheckIn + "' AND '" + CheckOut + "'  order by Total desc limit 0,100000  "
                    }
                }

            }
        }
        else {
            if ($scope.NRVsRefClient.BookingdateWise == false) {
                // Query = "select C_ID,ClientName,Type,Market,Owner,sum(NR),SUM(RF),sum(T_bookings) as Total,BrId,Saleperson from rpt_nr_refundable_clients_" + $scope.NRVsRefClient.Year + "_bk where BrId=" + $scope.SaleABranchId + "  and Saleperson = " + $scope.SalesAUserId + " group by  C_ID,ClientName,Type,Market,Owner,BrId,Saleperson order by Total desc LIMIT " + $scope.Limit + " "
                Query = "select C_ID,ClientName,Type,Market,Owner,NR,RF,T_bookings as Total,BrId,Saleperson from rpt_nr_refundable_clients_new_" + $scope.NRVsRefClient.Year + "_ch where BrId=" + $scope.SaleABranchId + "  and Saleperson = " + $scope.SalesAUserId + "  AND  CheckInDate BETWEEN '" + CheckIn + "' AND '" + CheckOut + "'  order by Total desc limit 0,100000  "
            }
           else if ($scope.NRVsRefClient.BookingdateWise == true) {
                //Query = "select C_ID,ClientName,Type,Market,Owner,sum(NR),SUM(RF),sum(T_bookings) as Total,BrId,Saleperson from rpt_nr_refundable_clients_" + $scope.NRVsRefClient.Year + "_bk where BrId=" + $scope.SaleABranchId + "  and Saleperson = " + $scope.SalesAUserId + " group by  C_ID,ClientName,Type,Market,Owner,BrId,Saleperson order by Total desc LIMIT " + $scope.Limit + " "
                Query = "select C_ID,ClientName,Type,Market,Owner,NR,RF,T_bookings as Total,BrId,Saleperson from rpt_nr_refundable_clients_new_" + $scope.NRVsRefClient.Year + "_bk where BrId=" + $scope.SaleABranchId + "  and Saleperson = " + $scope.SalesAUserId + "  AND  BookDate BETWEEN '" + CheckIn + "' AND '" + CheckOut + "'  order by Total desc limit 0,100000  "
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
            if ($scope.Search == false) {
                if ($scope.LoginMemberTypeID == 1) {
                    const groupedResults = _Solution.reduce((acc, current) => {
                        //const key = `${current[0]}`;
                        const key = `${current[0]}_${current[1]}_${current[2]}_${current[3]}_${current[4]}`;
                        if (!acc[key]) {
                            acc[key] = {
                                C_ID: (current[0]),
                                ClientName: (current[1]),
                                Type: (current[2]),
                                Market: (current[3]),
                                Owner: (current[4]),
                                NR: 0,
                                RF: 0,
                                T_bookings: 0,
                            };
                        }
                        acc[key].NR += parseFloat((current[5]).toFixed(2));
                        acc[key].RF += parseFloat((current[6]).toFixed(2));
                        acc[key].T_bookings += parseFloat((current[7]));


                        [key].count++;
                        return acc;
                    }, {});

                    finalGroupedResults = Object.values(groupedResults).map(group => ({
                        C_ID: group.C_ID,
                        ClientName: group.ClientName,
                        Type: group.Type,
                        Market: group.Market,
                        Owner: group.Owner,
                        T_bookings: group.T_bookings,
                        NR: group.T_bookings == 0 ? 0 : (group.NR / group.T_bookings) * 100,
                        RF: group.T_bookings == 0 ? 0 : (group.RF / group.T_bookings) * 100,

                    }));
                    finalresult = finalGroupedResults;

                }
                else if ($scope.LoginMemberTypeID == 2) {

                    if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
                        const groupedResults = _Solution.reduce((acc, current) => {
                            //const key = `${current[0]}`;
                            const key = `${current[0]}_${current[1]}_${current[2]}_${current[3]}_${current[4]}_${current[8]}_${current[9]}`;
                            if (!acc[key]) {
                                acc[key] = {
                                    C_ID: (current[0]),
                                    ClientName: (current[1]),
                                    Type: (current[2]),
                                    Market: (current[3]),
                                    Owner: (current[4]),
                                    NR: 0,
                                    RF: 0,
                                    T_bookings: 0,
                                    BrId: (current[8]),
                                    Saleperson: (current[9]),

                                };
                            }
                            acc[key].NR += parseFloat((current[5]).toFixed(2));
                            acc[key].RF += parseFloat((current[6]).toFixed(2));
                            acc[key].T_bookings += parseFloat((current[7]));


                            [key].count++;
                            return acc;
                        }, {});

                        finalGroupedResults = Object.values(groupedResults).map(group => ({
                            C_ID: group.C_ID,
                            ClientName: group.ClientName,
                            Type: group.Type,
                            Market: group.Market,
                            Owner: group.Owner,
                            T_bookings: group.T_bookings,
                            BrId: group.BrId,
                            Saleperson: group.Saleperson,
                            NR: group.T_bookings == 0 ? 0 : (group.NR / group.T_bookings) * 100,
                            RF: group.T_bookings == 0 ? 0 : (group.RF / group.T_bookings) * 100,

                        }));
                        finalresult = finalGroupedResults;


                    }
                    else {
                        const groupedResults = _Solution.reduce((acc, current) => {
                            //const key = `${current[0]}`;
                            const key = `${current[0]}_${current[1]}_${current[2]}_${current[3]}_${current[4]}`;
                            if (!acc[key]) {
                                acc[key] = {
                                    C_ID: (current[0]),
                                    ClientName: (current[1]),
                                    Type: (current[2]),
                                    Market: (current[3]),
                                    Owner: (current[4]),
                                    NR: 0,
                                    RF: 0,
                                    T_bookings: 0,
                                };
                            }
                            acc[key].NR += parseFloat((current[5]).toFixed(2));
                            acc[key].RF += parseFloat((current[6]).toFixed(2));
                            acc[key].T_bookings += parseFloat((current[7]));


                            [key].count++;
                            return acc;
                        }, {});

                        finalGroupedResults = Object.values(groupedResults).map(group => ({
                            C_ID: group.C_ID,
                            ClientName: group.ClientName,
                            Type: group.Type,
                            Market: group.Market,
                            Owner: group.Owner,
                            T_bookings: group.T_bookings,
                            NR: group.T_bookings == 0 ? 0 : (group.NR / group.T_bookings) * 100,
                            RF: group.T_bookings == 0 ? 0 : (group.RF / group.T_bookings) * 100,

                        }));
                        finalresult = finalGroupedResults;


                    }

                }
            }
            else {
                const groupedResults = _Solution.reduce((acc, current) => {
                    //const key = `${current[0]}`;
                    const key = `${current[0]}_${current[1]}_${current[2]}_${current[3]}_${current[4]}_${current[8]}_${current[9]}`;
                    if (!acc[key]) {
                        acc[key] = {
                            C_ID: (current[0]),
                            ClientName: (current[1]),
                            Type: (current[2]),
                            Market: (current[3]),
                            Owner: (current[4]),
                            NR: 0,
                            RF: 0,
                            T_bookings: 0,
                            BrId: (current[8]),
                            Saleperson: (current[9]),

                        };
                    }
                    acc[key].NR += parseFloat((current[5]).toFixed(2));
                    acc[key].RF += parseFloat((current[6]).toFixed(2));
                    acc[key].T_bookings += parseFloat((current[7]));


                    [key].count++;
                    return acc;
                }, {});

                finalGroupedResults = Object.values(groupedResults).map(group => ({
                    C_ID: group.C_ID,
                    ClientName: group.ClientName,
                    Type: group.Type,
                    Market: group.Market,
                    Owner: group.Owner,
                    T_bookings: group.T_bookings,
                    BrId: group.BrId,
                    Saleperson: group.Saleperson,
                    NR: group.T_bookings == 0 ? 0 : (group.NR / group.T_bookings) * 100,
                    RF: group.T_bookings == 0 ? 0 : (group.RF / group.T_bookings) * 100,

                }));
                finalresult = finalGroupedResults;
            }

            var empty = '';
            // _Solution = finalGroupedResults.map(
            _Solution = finalresult.map(
                c => {
                    return {
                        'ClientName': c.ClientName,
                        'Type': c.Type,
                        'Market': c.Market,
                        'Owner': c.Owner,
                        'NR': c.NR.toFixed(2),
                        'RF': c.RF.toFixed(2),
                        'T_bookings': c.T_bookings,

                    }
                }
            ).sort((a, b) => b.T_bookings - a.T_bookings);
            /* _Solution = results.map(
                 c => {
                     return {
                         'ClientName': (c[1]),
                         'Type': (c[2]),
                         'Market': (c[3]),
                         'Owner': (c[4]),
                         'NR': (c[7]) == 0 ? 0 : ((c[5]) / (c[7]) * 100).toFixed(2),
                         'RF': (c[7]) == 0 ? 0 : ((c[6]) / (c[7]) * 100).toFixed(2),
                         'TBookings': (c[7]),
                     }
                 }
             );*/
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


    var $mytable = $("#NRVsRefClient");
    //Set DataTable
    function SetDataTable() {
        if ($scope.ReportFilter.GroupBy == "") {
            $('#NRVsRefClient').DataTable().clear().destroy();
            $('#NRVsRefClient').DataTable({
                "order": [],
                responsive: true,
                dom: 'Bfrtip',
                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: '<i class="fa fa-file-excel-o"></i>',
                        filename: function () {
                            var ReportName = "NR Vs Refundable Client Report"
                            var AgeDetails = $scope.NRVsRefClient.DateFrom + "-" + $scope.NRVsRefClient.DateTo;
                            return ReportName + ' ( ' + AgeDetails + ' ) '
                        },
                        sheetName: 'NRVsRefClientSheet',
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
                    },
                    {
                        "targets": 4,
                        orderable: true,
                        "className": "text-right",
                        titleAttr: "Bookings"
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
                    { data: 'NR' },
                    { data: 'RF' },
                ],
            });
            $('.dataTables_info').html('Showing ' + $scope.SecondMainResultlistAfterFilter.length + ' entries');
            $('#NRVsRefClient_paginate').css("display", "none");
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

    /* $(window).scroll(function (e) {
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
                             load_more();
                             $(window).trigger("fetchmore"); //keep triggering this event until we've filled the viewport
                         }
                     }
                 }
             });
             //trigger initial fetch
             $(window).trigger("fetchmore");
         }
     });*/


    /*function load_more() {
        //$scope.NRVsRefClient.MemberId = $("#ddl_BR").val();
         if ($scope.LoginMemberType == 1) {
            if ($scope.NRVsRefClient.MemberId != 0) {
                $scope.SaleABranchId = $scope.NRVsRefClient.MemberId;
            }
        }
        $scope.NRVsRefClient.Year = $("#ddlYear").val();
        SetLimit($scope.LoadData);
        var Query = "";
        if ($scope.Search == false) {
            if ($scope.LoginMemberTypeID == 1) {
                if ($scope.NRVsRefClient.MemberId == 0) {
                    Query = "select C_ID,ClientName,Type,Market,Owner,sum(NR),SUM(RF),sum(T_bookings) as Total from rpt_nr_refundable_clients_" + $scope.NRVsRefClient.Year + "_bk group by  C_ID,ClientName,Type,Market,Owner order by Total desc LIMIT " + $scope.Limit + " "
                }
                else {
                    Query = "select C_ID,ClientName,Type,Market,Owner,sum(NR),SUM(RF),sum(T_bookings) as Total from rpt_nr_refundable_clients_" + $scope.NRVsRefClient.Year + "_bk where BrId=" + $scope.NRVsRefClient.MemberId + " group by  C_ID,ClientName,Type,Market,Owner order by Total desc LIMIT " + $scope.Limit + " "
                }
            }
            else if ($scope.LoginMemberTypeID == 2) {
                if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
                    Query = "select C_ID,ClientName,Type,Market,Owner,sum(NR),SUM(RF),sum(T_bookings) as Total,BrId,Saleperson from rpt_nr_refundable_clients_" + $scope.NRVsRefClient.Year + "_bk where BrId=" + $scope.MemberId + "  and Saleperson = " + $scope.IsSalePersonUserId + " group by  C_ID,ClientName,Type,Market,Owner,BrId,Saleperson order by Total desc LIMIT " + $scope.Limit + " "
                }
                else {
                    Query = "select C_ID,ClientName,Type,Market,Owner,sum(NR),SUM(RF),sum(T_bookings) as Total from rpt_nr_refundable_clients_" + $scope.NRVsRefClient.Year + "_bk where BrId=" + $scope.MemberId + " group by  C_ID,ClientName,Type,Market,Owner order by Total desc LIMIT " + $scope.Limit + " "
                }
            }
        }
        else {
            Query = "select C_ID,ClientName,Type,Market,Owner,sum(NR),SUM(RF),sum(T_bookings) as Total,BrId,Saleperson from rpt_nr_refundable_clients_" + $scope.NRVsRefClient.Year + "_bk where BrId=" + $scope.SaleABranchId + "  and Saleperson = " + $scope.SalesAUserId + " group by  C_ID,ClientName,Type,Market,Owner,BrId,Saleperson order by Total desc LIMIT " + $scope.Limit + " "
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
                        'ClientName': (c[1]),
                        'Type': (c[2]),
                        'Market': (c[3]),
                        'Owner': (c[4]),
                        'NR': (c[7]) == 0 ? 0 : ((c[5]) / (c[7]) * 100).toFixed(2),
                        'RF': (c[7]) == 0 ? 0 : ((c[6]) / (c[7]) * 100).toFixed(2),
                        'TBookings': (c[7]),
                    }
                }
            );

            if (_Solution != null) {

                $scope.MainResultlistAfterFilter = (_Solution);

                ///////////                    
                $.each($scope.MainResultlistAfterFilter, function (i, item) {
                    if (i == 0) {
                        $("#NRVsRefClient").html('');
                        added_row = '<thead class="main-head hidden-xs" id="theaddiv"><tr><th>Client Name</th><th>Type</th><th>Market</th><th title="Key Account Manager">KAM</th><th>BKG</th><th style="text-align:right;">NR %</th><th style="text-align:right;">RF %</th></tr></thead>'
                    }
                    added_row += '<tr>'
                        + '<td>' + item.ClientName + '</td>'
                        + '<td>' + item.Type + '</td>'
                        + '<td>' + item.Market + '</td>'
                        + '<td>' + item.Owner + '</td>'
                        + '<td style="text-align:right;">' + item.TBookings + '</td>'
                        + '<td style="text-align:right;">' + item.NR + '</td>'
                        + '<td style="text-align:right;">' + item.RF + '</td>'
                        + '</tr>';

                    $scope.count = $scope.count + 1;
                    $scope.SecondMainResultlistAfterFilter.push(item);
                });
                $("#NRVsRefClient").append(added_row);
                $scope.currentleg = $scope.SecondMainResultlistAfterFilter.length;

                $('.dataTables_info').html('Showing ' + $scope.SecondMainResultlistAfterFilter.length + ' entries');
                $('#NRVsRefClient_paginate').css("display", "none");
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
*/
    //Show cols for Excel and Copy
    function ShowHideExcelColumns() {
        $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6];

        if ($scope.LoginMemberTypeID == "4") {
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
        Hide_Columns('NRVsRefClient')
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
        Apply_Sorting('NRVsRefClient', $scope.SortDetails)

    }
    $scope.ClearSorting = function () {
        $scope.SortDetails = [];
        $scope.SortDetails = Clear_Sorting('NRVsRefClient');
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
    var table = $('#NRVsRefClient').dataTable();
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



