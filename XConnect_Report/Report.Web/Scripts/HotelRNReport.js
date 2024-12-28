﻿var app = angular.module('HotelRNreportapp', []);


var bid = ""; var brtypeid = ""; var mid = ""; var mrtypeid = ""; var bid = ""; var Wsid = ""; var membertypeid = "";
var isvalid = true;
app.controller('HotelRNreportCntr', ['$scope', '$http', '$window', '$rootScope', '$timeout', function ($scope, $http, $window, $rootScope, $timeout) {
    NgInit();
    function NgInit() {
        $scope.HotelRNReport = CommonDashBoardV1DO();
        $scope.ReportFilter = ReportFilterDO();
        $scope.PostBooking = PostBookingDO();
        $scope.SendMailDO = SendMailDO();

        $scope.IsShowSupplier = GetE("hdnIsShowSupplier").value;
        $scope.LoginMemberType = GetE("hdnLoginMemberTypeId").value;

        $scope.MemberId = GetE("hdnLoginMemberId").value;//If Branch Login
        $scope.LoginBranchId = GetE("hdnBranchId").value;
        $scope.IsSalePerson = GetE("hdnIsSalePerson").value;
        $scope.IsSalePersonUserId = GetE("hdnLoginUserId").value;
        $scope.ModifySearch = true;
        $scope._IsHidePostBooking = false;
        $scope.MemberDetails = "";
        $scope.GroupingName = "";
        GetsalesPerson();
        $scope.SortDetails = [];
        $scope.SortDetails.push(SortDetailDO());
        $scope.MainResultlistAfterFilter = [];
        $scope.ShowddlFilterList = [];
        $scope.FilterDOList = [];
        $scope.FilterTypeActive = "";
        $scope.selectedArray = "";
        $scope.OldSelectedfilterArrayValues = "";
        $scope.HotelRNReport.MemberId = "10561"
        $scope.CustomDateRangeFilter = "2024";
        SortingSetting();
        ShowHideExcelColumns();
        $scope.Icount = 0;
        $scope.JCount = 0;


        $("#ddl_BR option:selected").text("All Branch");
        $("#ddl_AG option:selected").text("All Agent");





        $scope.HotelRNReport.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
        $scope.HotelRNReport.DateTo = ConvertCustomrangedate(new Date());

        if ($scope.LoginMemberType == 1) {
            //this is PostBooking Init()
            $scope.PostBooking = PostBooking_Init($scope.PostBooking, $scope.LoginMemberType)

            //this is On Post Booking change events
            $rootScope.$on("CallPostBooking", function (event) {
                document.getElementById("Wsdiv").style.display = "none";
                document.getElementById("agentdiv").style.display = "none";
                $scope.PostBooking = Set_PostMemberDetails(event, $scope.PostBooking);

            });
        }
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

        if ($scope.HotelRNReport.DateFrom == "") {

            Alert.render("Please Select Arrival-From Date", "txtFromDate");
            isvalid = false;
            return false;
        }

        if ($scope.HotelRNReport.DateTo == "") {
            Alert.render("Please Select Arrival-To Date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ($scope.HotelRNReport.DateFrom != "" && $scope.HotelRNReport.DateTo != "") {
            var dtObj1 = GetSystemDate($scope.HotelRNReport.DateFrom);
            var dtObj2 = GetSystemDate($scope.HotelRNReport.DateTo);
        }

        if (($scope.HotelRNReport.DateFrom != "" && $scope.HotelRNReport.DateTo != "") && (dtObj1 > dtObj2)) {
            Alert.render("Arrival-From date can not be greater than Arrival-To date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ((diffDate(new Date($scope.HotelRNReport.DateTo), new Date($scope.HotelRNReport.DateFrom))) > 12.50) {
            Alert.render("Report Seraching Dates Should be Upto 12 Months", "txtToDate");
            isvalid = false;
            return false;
        }
        if ($scope.LoginMemberType == 1) {
            //PostBookingSetting
            $scope.PostBooking = PostBooking_Setting($scope.PostBooking, $scope.LoginMemberType)
            //if ($scope.PostBooking.PostMemberId == "0") {
            //    if (GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text != "All Agent") {
            //        Alert.render("Select Member to Post Booking", "ddl_BR");
            //        isvalid = false;
            //        return false;
            //    }
            //}
            //if ($scope.HotelRNReport.MemberId == 0) {
            //    Alert.render("Select Branch to Post Booking", "ddl_BR");
            //    isvalid = false;
            //    return false;
            //}
            if (document.getElementById('ADW').checked) {
                $scope.HotelRNReport.BookingdateWise = false;
            }
            if (document.getElementById('BDW').checked) {
                $scope.HotelRNReport.BookingdateWise = true;
            }
            if ($scope.IsGetfromHome == true) {
                $scope.PostBooking.ReportCompanyName = $scope.OnLoadReportCompanyName;
                $scope.PostBooking.PostMemberId = $scope.OnLoadPostMemberId;
            }
            $scope.MemberDetails = $scope.PostBooking.Br_Id + "_" + $scope.PostBooking.Ws_Id + "_" + $scope.PostBooking.Ag_Id + "_" + $scope.PostBooking.ReportCompanyName + "_" + GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text;
            $scope.HotelRNReport.MemberId = $scope.PostBooking.PostMemberId;
            $scope.HotelRNReport.LoginUserId = (document.getElementById("hdnLoginUserId")).value;

        }
        if (document.getElementById('ADW').checked) {
            $scope.HotelRNReport.BookingdateWise = false;
        }
        if (document.getElementById('BDW').checked) {
            $scope.HotelRNReport.BookingdateWise = true;
        }
        if (isvalid == true) {
            $scope.GetReportDetails();
        }
    }


    //getReportDetails on serach click
    $scope.GetReportDetails = function () {
        var ReportName = " Hotel RN Report";
        var popupdetail = $scope.PostBooking.ReportCompanyName + "~" + $scope.HotelRNReport.DateFrom + "~" + $scope.HotelRNReport.DateTo;
        PopUpController.OpenPopup2("divPopup", ReportName, popupdetail);
        $scope.ReportFilter.CustomDateOption = $("#ddl_CustomDateRange").val();;
        $scope.HotelRNReport.MemberId = $("#ddl_BR").val();
        $scope.HotelRNReport.Year = $("#ddlYear").val();

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


        $scope.currentleg = 0; $scope.count = 0;
        $("#demo").addClass("collapse in");
        SetLimit($scope.LoadData);
        var query = "";
        if ($scope.Search == false) {
            if ($scope.LoginMemberType == 1) {
                //Booking Date Wise Data for HQ         
                if ($scope.HotelRNReport.BookingdateWise == true) {
                    if ($scope.HotelRNReport.MemberId == "0") {
                        query = "SELECT HName,Dest,SUM(C_Year) as C_Year,SUM(L_Year) as L_Year,count(HName) RoomNts FROM  rpt_rr_roomnt_" + $scope.HotelRNReport.Year + "_1 group by HName,Dest Order by C_Year desc LIMIT " + $scope.Limit + " "
                        /*  query = "SELECT HName,Dest,SUM(C_Year) as C_Year,SUM(L_Year) as L_Year,count(HName) RoomNts FROM  rpt_rr_roomnt_" + $scope.HotelRNReport.Year + "_1 group by HName,Dest Order by Dest, HName desc"*/
                    }
                    else {
                        query = "SELECT HName,Dest,SUM(C_Year) as C_Year,SUM(L_Year) as L_Year,count(HName) RoomNts FROM rpt_rr_roomnt_" + $scope.HotelRNReport.Year + "_1  where BrId =" + $scope.HotelRNReport.MemberId + "group by HName,Dest Order by C_Year desc LIMIT " + $scope.Limit + " "

                        //query = "SELECT HName,Dest,SUM(C_Year) as C_Year,SUM(L_Year) as L_Year,count(HName) RoomNts FROM rpt_rr_roomnt_" + $scope.HotelRNReport.Year + "_1  where BrId =" + $scope.HotelRNReport.MemberId + "group by HName,Dest Order by Dest, HName desc"
                    }
                }
                //CheckIn Date Wise Data for HQ
                else {
                    if ($scope.HotelRNReport.MemberId == "0") {
                        query = "SELECT HName,Dest,SUM(C_Year) as C_Year,SUM(L_Year) as L_Year,count(HName) RoomNts FROM  rpt_rr_roomnt_" + $scope.HotelRNReport.Year + "_2 group by HName,Dest Order by C_Year desc LIMIT " + $scope.Limit + " "
                    }
                    else {
                        query = "SELECT HName,Dest,SUM(C_Year) as C_Year,SUM(L_Year) as L_Year,count(HName) RoomNts FROM rpt_rr_roomnt_" + $scope.HotelRNReport.Year + "_1  where BrId =" + $scope.HotelRNReport.MemberId + "group by HName,Dest Order by C_Year desc LIMIT " + $scope.Limit + " "
                    }
                }
            }
            else if ($scope.LoginMemberType == 2) {
                //For SalesPerson
                if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
                    if ($scope.HotelRNReport.BookingdateWise == true) {
                        query = " SELECT HName, Dest, SUM(C_Year) as C_Year, SUM(L_Year) as L_Year, count(HName) RoomNts, M_date FROM rpt_rr_roomnt_" + $scope.HotelRNReport.Year + "_2 where BrId =" + $scope.MemberId + " and S_PersonId=" + $scope.IsSalePersonUserId + " group by HName, Dest, M_date Order by Dest, HName desc LIMIT " + $scope.Limit + " "
                    }
                    else {
                        query = " SELECT HName, Dest, SUM(C_Year) as C_Year, SUM(L_Year) as L_Year, count(HName) RoomNts, M_date FROM rpt_rr_roomnt_" + $scope.HotelRNReport.Year + "_1  where BrId =" + $scope.MemberId + " and S_PersonId=" + $scope.IsSalePersonUserId + " group by HName, Dest, M_date Order by C_Year desc LIMIT " + $scope.Limit + " "
                    }
                }
                else {
                    if ($scope.HotelRNReport.BookingdateWise == true) {
                        query = "SELECT HName,Dest,SUM(C_Year) as C_Year,SUM(L_Year) as L_Year,count(HName) RoomNts FROM rpt_rr_roomnt_" + $scope.HotelRNReport.Year + "_2  where BrId =" + $scope.MemberId + "group by HName,Dest Order by C_Year desc  LIMIT " + $scope.Limit + " "
                    }
                    else {
                        query = "SELECT HName,Dest,SUM(C_Year) as C_Year,SUM(L_Year) as L_Year,count(HName) RoomNts FROM rpt_rr_roomnt_" + $scope.HotelRNReport.Year + "_1  where BrId =" + $scope.MemberId + "group by HName,Dest Order by C_Year desc  LIMIT " + $scope.Limit + " "
                    }
                }
            }
        }
        else {
            if ($scope.HotelRNReport.BookingdateWise == true) {
                query = " SELECT HName, Dest, SUM(C_Year) as C_Year, SUM(L_Year) as L_Year, count(HName) RoomNts, M_date FROM rpt_rr_roomnt_" + $scope.HotelRNReport.Year + "_2 where BrId =" + $scope.SaleABranchId + " and S_PersonId=" + $scope.SalesAUserId + " group by HName, Dest, M_date Order by Dest, HName desc LIMIT " + $scope.Limit + " "
            }
            else {
                query = " SELECT HName, Dest, SUM(C_Year) as C_Year, SUM(L_Year) as L_Year, count(HName) RoomNts, M_date FROM rpt_rr_roomnt_" + $scope.HotelRNReport.Year + "_1  where BrId =" + $scope.SaleABranchId + " and S_PersonId=" + $scope.SalesAUserId + " group by HName, Dest, M_date Order by C_Year desc LIMIT " + $scope.Limit + " "
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
        $.ajax(settings).done(function (data) {
            var results = data['datarows'];
            $scope.total = data['total'];
            _Solution = results;
            _Solution = results.map(
                c => {
                    return {
                        'HName': (c[0]),
                        'Desti': (c[1]),
                        'CFY': (c[2]),
                        'LFY': (c[3]),
                        'Vs': (c[3]) == 0 ? 0.00 : (((c[2]) - (c[3])) / (c[3]) * 100).toFixed(2),
                    }
                }
            );


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


    var $mytable = $("#HotelRNReport");
    //Set DataTable
    function SetDataTable() {
        if ($scope.ReportFilter.GroupBy == "") {
            $('#HotelRNReport').DataTable().clear().destroy();
            $('#HotelRNReport').DataTable({
                "order": [],
                responsive: true,
                dom: 'Bfrtip',
                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: '<i class="fa fa-file-excel-o"></i>',
                        filename: function () {
                            var ReportName = "HotelRN Report"
                            var AgeDetails = $scope.HotelRNReport.DateFrom + "-" + $scope.HotelRNReport.DateTo;
                            return ReportName + ' ( ' + AgeDetails + ' ) '
                        },
                        sheetName: 'HotelRNReportSheet',
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
                "aLengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                bScrollInfinite: true,
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
                        "className": "text-right",
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
                    }
                ],
                searching: false,
                paging: true,
                data: $scope.SecondMainResultlistAfterFilter,
                "pageLength": 100,
                "deferRender": true,
                select: true,
                columns: [
                    { data: 'HName' },
                    { data: 'Desti' },
                    { data: 'CFY' },
                    { data: 'LFY' },
                    { data: 'Vs' },
                ],


            });
            $('.dataTables_info').html('Showing ' + $scope.SecondMainResultlistAfterFilter.length + ' entries');
            $('#HotelRNReport_paginate').css("display", "none");
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

    $(window).scroll(function (e) {
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
    });

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

    function load_more() {
        //$scope.HotelRNReport.MemberId = $("#ddl_BR").val();
        $scope.HotelRNReport.Year = $("#ddlYear").val();
        var query = "";
        SetLimit($scope.LoadData);
        if ($scope.Search == false) {
            if ($scope.LoginMemberType == 1) {
                //Booking Date Wise Data for HQ
                if ($scope.HotelRNReport.BookingdateWise = true) {
                    if ($scope.HotelRNReport.MemberId == "0") {
                        query = "SELECT HName,Dest,SUM(C_Year) as C_Year,SUM(L_Year) as L_Year,count(HName) RoomNts FROM  rpt_rr_roomnt_" + $scope.HotelRNReport.Year + "_1 group by HName,Dest Order by C_Year desc LIMIT " + $scope.Limit + " "

                        /* query = "SELECT HName,Dest,SUM(C_Year) as C_Year,SUM(L_Year) as L_Year,count(HName) RoomNts FROM  rpt_rr_roomnt_" + $scope.HotelRNReport.Year + "_1 group by HName,Dest Order by Dest, HName desc "*/
                    }
                    else {
                        query = "SELECT HName,Dest,SUM(C_Year) as C_Year,SUM(L_Year) as L_Year,count(HName) RoomNts FROM rpt_rr_roomnt_" + $scope.HotelRNReport.Year + "_1  where BrId =" + $scope.HotelRNReport.MemberId + "group by HName,Dest Order by C_Year desc LIMIT " + $scope.Limit + " "

                        /*query = "SELECT HName,Dest,SUM(C_Year) as C_Year,SUM(L_Year) as L_Year,count(HName) RoomNts FROM rpt_rr_roomnt_" + $scope.HotelRNReport.Year + "_1  where BrId =" + $scope.HotelRNReport.MemberId + "group by HName,Dest Order by Dest, HName desc "*/
                    }
                }
                //CheckIn Date Wise Data for HQ
                else {
                    if ($scope.HotelRNReport.MemberId == "0") {
                        query = "SELECT HName,Dest,SUM(C_Year) as C_Year,SUM(L_Year) as L_Year,count(HName) RoomNts FROM  rpt_rr_roomnt_" + $scope.HotelRNReport.Year + "_2 group by HName,Dest Order by C_Year desc LIMIT " + $scope.Limit + " "
                    }
                    else {
                        query = "SELECT HName,Dest,SUM(C_Year) as C_Year,SUM(L_Year) as L_Year,count(HName) RoomNts FROM rpt_rr_roomnt_" + $scope.HotelRNReport.Year + "_2  where BrId =" + $scope.HotelRNReport.MemberId + "group by HName,Dest Order by C_Year desc LIMIT " + $scope.Limit + " "
                    }
                }
            }
            else if ($scope.LoginMemberType == 2) {
                //For SalesPerson
                if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
                    if ($scope.HotelRNReport.BookingdateWise == true) {
                        query = " SELECT HName, Dest, SUM(C_Year) as C_Year, SUM(L_Year) as L_Year, count(HName) RoomNts, M_date FROM rpt_rr_roomnt_" + $scope.HotelRNReport.Year + "_2 where BrId =" + $scope.MemberId + " and S_PersonId=" + $scope.IsSalePersonUserId + " group by HName, Dest, M_date Order by C_Year desc LIMIT " + $scope.Limit + " "
                    }
                    else {
                        query = " SELECT HName, Dest, SUM(C_Year) as C_Year, SUM(L_Year) as L_Year, count(HName) RoomNts, M_date FROM rpt_rr_roomnt_" + $scope.HotelRNReport.Year + "_1  where BrId =" + $scope.MemberId + " and S_PersonId=" + $scope.IsSalePersonUserId + " group by HName, Dest, M_date Order by C_Year desc LIMIT " + $scope.Limit + " "
                    }
                }
                else {
                    if ($scope.HotelRNReport.BookingdateWise == true) {
                        query = "SELECT HName,Dest,SUM(C_Year) as C_Year,SUM(L_Year) as L_Year,count(HName) RoomNts FROM rpt_rr_roomnt_" + $scope.HotelRNReport.Year + "_2  where BrId =" + $scope.MemberId + "group by HName,Dest Order by C_Year desc  LIMIT " + $scope.Limit + " "
                    }
                    else {
                        query = "SELECT HName,Dest,SUM(C_Year) as C_Year,SUM(L_Year) as L_Year,count(HName) RoomNts FROM rpt_rr_roomnt_" + $scope.HotelRNReport.Year + "_1  where BrId =" + $scope.MemberId + "group by HName,Dest Order by C_Year desc  LIMIT " + $scope.Limit + " "
                    }
                }
            }
        }
        else {
            if ($scope.HotelRNReport.BookingdateWise == true) {
                query = " SELECT HName, Dest, SUM(C_Year) as C_Year, SUM(L_Year) as L_Year, count(HName) RoomNts, M_date FROM rpt_rr_roomnt_" + $scope.HotelRNReport.Year + "_2 where BrId =" + $scope.SaleABranchId + " and S_PersonId=" + $scope.SalesAUserId + " group by HName, Dest, M_date Order by Dest, HName desc LIMIT " + $scope.Limit + " "
            }
            else {
                query = " SELECT HName, Dest, SUM(C_Year) as C_Year, SUM(L_Year) as L_Year, count(HName) RoomNts, M_date FROM rpt_rr_roomnt_" + $scope.HotelRNReport.Year + "_1  where BrId =" + $scope.SaleABranchId + " and S_PersonId=" + $scope.SalesAUserId + " group by HName, Dest, M_date Order by C_Year desc LIMIT " + $scope.Limit + " "
            }
        }
        var settings = {
            "url": "https://osearch.xconnect.in/_opendistro/_sql",
            "method": "POST",
            "timeout": 0,
            "headers":
            {
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
                        'HName': (c[0]),
                        'Desti': (c[1]),
                        'CFY': (c[2]),
                        'LFY': (c[3]),
                        'Vs': (c[3]) == 0 ? 0.00 : (((c[2]) - (c[3])) / (c[3]) * 100).toFixed(2),
                    }
                }
            );

            if (_Solution != null) {
                $scope.MainResultlistAfterFilter = (_Solution);
                ///////////                    
                $.each($scope.MainResultlistAfterFilter, function (i, item) {
                    if (i == 0) {
                        $("#HotelRNReport").html('');
                        added_row = '<thead class="main-head hidden-xs" id="theaddiv"><tr><th>Hotel Name</th> <th>Destination</th><th>CFY</th><th>LFY</th><th>VS%</th></tr></thead>'
                    }
                    added_row += '<tr>'
                        + '<td>' + item.HName + '</td>'
                        + '<td> ' + item.Desti + '</td>'
                        + '<td style="text-align:right;">' + item.CFY + '</td>'
                        + '<td style="text-align:right;">' + item.LFY + '</td>'
                        + '<td style="text-align:right;">' + item.Vs + '</td>'
                        + '</tr>';

                    $scope.count = $scope.count + 1;
                    $scope.SecondMainResultlistAfterFilter.push(item);
                });
                $("#HotelRNReport").append(added_row);
                $scope.currentleg = $scope.currentleg + $scope.MainResultlistAfterFilter.length;

                $('.dataTables_info').html('Showing ' + $scope.SecondMainResultlistAfterFilter.length + ' entries');
                $('#HotelRNReport_paginate').css("display", "none");
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
        $scope.ExcelCollist = [0, 1, 2, 3, 4];

        if ($scope.LoginMemberType == "4") {
            $scope.ExcelCollist = [0, 1, 2, 3, 4]

            if ($scope.IsShowSupplier != "true") {
                $scope.ExcelCollist = [0, 1, 2, 3, 4]
            }
        }
        else {
            $scope.ExcelCollist = [0, 1, 2, 3, 4]

            if ($scope.IsShowSupplier != "true") {
                $scope.ExcelCollist = [0, 1, 2, 3, 4]
            }
        }
    }

    //onHide Popup Click
    $scope.HideColumns = function () {
        //Hide_Columns is comm. fun in CommonUtility.js
        Hide_Columns('HotelRNReport')
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
        Apply_Sorting('HotelRNReport', $scope.SortDetails)

    }
    $scope.ClearSorting = function () {
        $scope.SortDetails = [];
        $scope.SortDetails = Clear_Sorting('HotelRNReport');
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
    var table = $('#HotelRNReport').dataTable();
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



