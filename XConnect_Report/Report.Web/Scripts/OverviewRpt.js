 
var app = angular.module('OverviewRptapp', []);

var bid = ""; var brtypeid = ""; var mid = ""; var mrtypeid = ""; var bid = ""; var Wsid = ""; var membertypeid = "";
var isvalid = true;
app.controller('OverviewRptCntr', ['$scope', '$http', '$window', '$rootScope', '$timeout', function ($scope, $http, $window, $rootScope, $timeout) {
    NgInit();
    function NgInit() {
        $scope.OverviewRpt = CommonDashBoardV1DO();
        $scope.ReportFilter = ReportFilterDO();
        $scope.PostBooking = PostBookingDO();
        $scope.SendMailDO = SendMailDO();

        $scope.IsShowSupplier = GetE("hdnIsShowSupplier").value;
        $scope.LoginMemberType = GetE("hdnLoginMemberTypeId").value;
        $scope.MemberId = GetE("hdnLoginMemberId").value;//If Branch Login
        $scope.ReportCompName = GetE("hdnLoginName").value;

        $scope.LoginBranchId = GetE("hdnBranchId").value;
        $scope.IsSalePerson = GetE("hdnIsSalePerson").value;
        $scope.IsSalePersonUserId = GetE("hdnLoginUserId").value;

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
        $scope.OverviewRpt.MemberId = "10561"
        $scope.CustomDateRangeFilter = "2024";
        SortingSetting();
        ShowHideExcelColumns();
        GetsalesPerson();
        $("#ddl_BR option:selected").text("All Branch");
        $("#ddl_AG option:selected").text("All Agent");

        $scope.OverviewRpt.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
        $scope.OverviewRpt.DateTo = ConvertCustomrangedate(new Date());
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

        if ($scope.OverviewRpt.DateFrom == "") {

            Alert.render("Please Select Arrival-From Date", "txtFromDate");
            isvalid = false;
            return false;
        }

        if ($scope.OverviewRpt.DateTo == "") {
            Alert.render("Please Select Arrival-To Date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ($scope.OverviewRpt.DateFrom != "" && $scope.OverviewRpt.DateTo != "") {
            var dtObj1 = GetSystemDate($scope.OverviewRpt.DateFrom);
            var dtObj2 = GetSystemDate($scope.OverviewRpt.DateTo);
        }

        if (($scope.OverviewRpt.DateFrom != "" && $scope.OverviewRpt.DateTo != "") && (dtObj1 > dtObj2)) {
            Alert.render("Arrival-From date can not be greater than Arrival-To date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ((diffDate(new Date($scope.OverviewRpt.DateTo), new Date($scope.OverviewRpt.DateFrom))) > 12.50) {
            Alert.render("Report Seraching Dates Should be Upto 12 Months", "txtToDate");
            isvalid = false;
            return false;
        }

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
            //if (document.getElementById('ADW').checked) {
            //    $scope.OverviewRpt.BookingdateWise = false;
            //}
            //if (document.getElementById('BDW').checked) {
            //    $scope.OverviewRpt.BookingdateWise = true;
            //}
            if ($scope.IsGetfromHome == true) {
                $scope.PostBooking.ReportCompanyName = $scope.OnLoadReportCompanyName;
                $scope.PostBooking.PostMemberId = $scope.OnLoadPostMemberId;
            }
            $scope.MemberDetails = $scope.PostBooking.Br_Id + "_" + $scope.PostBooking.Ws_Id + "_" + $scope.PostBooking.Ag_Id + "_" + $scope.PostBooking.ReportCompanyName + "_" + GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text;
            $scope.OverviewRpt.MemberId = $scope.PostBooking.PostMemberId;
            $scope.OverviewRpt.LoginUserId = (document.getElementById("hdnLoginUserId")).value;
        }
        if (isvalid == true) {
            $scope.GetReportDetails();
        }
    }


    //getReportDetails on serach click
    $scope.GetReportDetails = function () {
        var ReportName = " Overview Report";
        $scope.OverviewRpt.Year = $("#ddlYear").val();
        //$scope.Search = $("#ddlSalesPersonReportAcess").val() == "0" ? false : true;
        //if($scope.Search == true) {
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


        var popupdetail = $scope.PostBooking.ReportCompanyName + "~" + $scope.OverviewRpt.Year + "~" + $scope.OverviewRpt.Year;;
        PopUpController.OpenPopup2("divPopup", ReportName, popupdetail);
        $scope.ReportFilter.CustomDateOption = $("#ddl_CustomDateRange").val();
        $scope.OverviewRpt.MemberId = $("#ddl_BR").val();
        $scope.currentleg = 0; $scope.count = 0;
        $("#demo").addClass("collapse in");
        var query = '';
        if ($scope.Search == false) {
            if ($scope.LoginMemberType == 1) {
                if ($scope.OverviewRpt.MemberId == 0) {
                    query = "select Month,MonthId, Type,Report,Sum(BookCount) as BCount,Sum(case when Month!='' then 1 else 0 end) as Count,M_date from rpt_ops_overviews_" + $scope.OverviewRpt.Year + "  group by Month,MonthId,Type,Report,M_date"
                }
                else {
                    query = "select Month,MonthId, Type,Report,Sum(BookCount) as BCount,Sum(case when Month!='' then 1 else 0 end) as Count, M_date,BrId from rpt_ops_overviews_" + $scope.OverviewRpt.Year + " where BrId=" + $scope.OverviewRpt.MemberId + "  group by Month,MonthId,Type,Report,M_date,BrId"
                }
            }
            else if ($scope.LoginMemberType == 2) {
                if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
                    query = "select Month,MonthId, Type,Report,Sum(BookCount) as BCount,Sum(case when Month!='' then 1 else 0 end) as Count ,M_date,BrId,Saleperson from rpt_ops_overviews_" + $scope.OverviewRpt.Year + " where BrId=" + $scope.MemberId + " and Saleperson = " + $scope.IsSalePersonUserId + "  group by Month,MonthId,Type,Report,M_date,BrId,Saleperson"
                } else {
                    query = "select Month,MonthId, Type,Report,Sum(BookCount) as BCount,Sum(case when Month!='' then 1 else 0 end) as Count, M_date,BrId from rpt_ops_overviews_" + $scope.OverviewRpt.Year + " where BrId=" + $scope.MemberId + "  group by Month,MonthId,Type,Report,M_date,BrId"
                }
            }
        }
        else {
            query = "select Month,MonthId, Type,Report,Sum(BookCount) as BCount,Sum(case when Month!='' then 1 else 0 end) as Count ,M_date,BrId,Saleperson from rpt_ops_overviews_" + $scope.OverviewRpt.Year + " where BrId=" + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + "  group by Month,MonthId,Type,Report,M_date,BrId,Saleperson"
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
            if ($scope.LoginMemberTypeID == 2) {
                var list = [
                    { RId: 1, RName: 'Bookings', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 },
                    { RId: 2, RName: 'CheckIn', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 },
                    { RId: 3, RName: 'RN', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 },
                    { RId: 4, RName: 'Cancellation', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 },
                    //{ RId: 5, RName: 'OM', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 },
                    //{ RId: 6, RName: 'OM%', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 },
                    { RId: 7, RName: 'L2B - XML', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 },
                    { RId: 8, RName: 'L2B - Retail', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 },
                    { RId: 9, RName: 'Booking Error%', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 },
                    { RId: 10, RName: 'TTV(K)', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 }
                ];
            }
            else {
                var list = [
                    { RId: 1, RName: 'Bookings', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 },
                    { RId: 2, RName: 'CheckIn', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 },
                    { RId: 3, RName: 'RN', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 },
                    { RId: 4, RName: 'Cancellation', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 },
                    { RId: 5, RName: 'OM', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 },
                    { RId: 6, RName: 'OM%', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 },
                    { RId: 7, RName: 'L2B - XML', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 },
                    { RId: 8, RName: 'L2B - Retail', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 },
                    { RId: 9, RName: 'Booking Error%', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 },
                    { RId: 10, RName: 'TTV(K)', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 }
                ];
            }
            $scope.MainResultlist = list.map(li => {
                return {
                    RName: li.RName,
                    Jan: Filter_Monthwise(data.datarows, li.RId, 1),
                    Feb: Filter_Monthwise(data.datarows, li.RId, 2),
                    Mar: Filter_Monthwise(data.datarows, li.RId, 3),
                    Apr: Filter_Monthwise(data.datarows, li.RId, 4),
                    May: Filter_Monthwise(data.datarows, li.RId, 5),
                    Jun: Filter_Monthwise(data.datarows, li.RId, 6),
                    Jul: Filter_Monthwise(data.datarows, li.RId, 7),
                    Aug: Filter_Monthwise(data.datarows, li.RId, 8),
                    Sep: Filter_Monthwise(data.datarows, li.RId, 9),
                    Oct: Filter_Monthwise(data.datarows, li.RId, 10),
                    Nov: Filter_Monthwise(data.datarows, li.RId, 11),
                    Dec: Filter_Monthwise(data.datarows, li.RId, 12),
                    M_date: Filter_Monthwise(data.datarows, li.RId, 13),
                    Summary: Filter_Monthwise(data.datarows, li.RId, 14),
                }
            });
            if ($scope.MainResultlist != null) {
                /*  $scope.MainResultlist = (_Solution);*/
                $scope.MainResultlistAfterFilter = ($scope.MainResultlist);
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
    function Filter_Monthwise(data, report, month) {
        var Count = 0;
        data.filter(d => {
            if (d[2] == report && d[1] == month && Count == 0) {
                if (report == 6 || report == 9) {
                    Count = (d[4] / d[5]).toFixed(2);
                }
                else {
                    Count = d[4];
                }
            }
            else if (month == 13) {//For Mdate
                Count = d[6];
            }
            else if (d[2] == report && month == 14 && Count == 0) { //For Summary
                data.forEach(x => {
                    if (x[2] == report) {
                        if (report == 6 || report == 9) {
                            var a = (x[4] / x[5])
                            Count += a;
                        }
                        else {
                            Count += x[4];
                        }
                    }
                })
                if (report == 6 || report == 9) {
                    var C_Year = new Date().getFullYear()
                    if ($scope.OverviewRpt.Year != C_Year) {
                        Count = (Count / 12).toFixed(2);
                    }
                    else {
                        const d = new Date();
                        let month = parseInt(d.getMonth()) + parseInt(1);
                        Count = (Count / month).toFixed(2);
                    }
                }
            }
        });
        return Count;
    }


    var $mytable = $("#OverviewRpt");
    //Set DataTable
    function SetDataTable() {
        if ($scope.ReportFilter.GroupBy == "") {
            $('#OverviewRpt').DataTable().clear().destroy();
            $('#OverviewRpt').DataTable({
                "order": [],
                responsive: true,
                dom: 'Bfrtip',
                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: '<i class="fa fa-file-excel-o"></i>',
                        filename: function () {
                            var ReportName = "Overview Report"
                          //  var AgeDetails = $scope.OverviewRpt.DateFrom + "-" + $scope.OverviewRpt.DateTo;
                            var AgeDetails = $scope.OverviewRpt.Year;
                            return ReportName + ' ( ' + AgeDetails + ' ) '
                        },
                        sheetName: 'OverviewRptSheet',
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
                        "className": "text-right",
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
                    },
                    {
                        "targets": 10,
                        orderable: true,
                        "className": "text-right",
                    },
                    {
                        "targets": 11,
                        orderable: true,
                        "className": "text-right",
                    },
                    {
                        "targets": 12,
                        orderable: true,
                        "className": "text-right",
                    },
                    {
                        "targets": 13,
                        orderable: true,
                        "className": "text-right",
                    }
                ],
                searching: false,
                paging: true,
                data: $scope.SecondMainResultlistAfterFilter,
                "pageLength": 30,
                "deferRender": true,
                select: true,
                columns: [
                    { data: 'RName' },
                    { data: 'Jan' },
                    { data: 'Feb' },
                    { data: 'Mar' },
                    { data: 'Apr' },
                    { data: 'May' },
                    { data: 'Jun' },
                    { data: 'Jul' },
                    { data: 'Aug' },
                    { data: 'Sep' },
                    { data: 'Oct' },
                    { data: 'Nov' },
                    { data: 'Dec' },
                    { data: 'Summary' },

                ],
            });
            $('.dataTables_info').html('Showing ' + $scope.SecondMainResultlistAfterFilter.length + ' entries');
            $('#OverviewRpt_paginate').css("display", "none");
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
    //                    load_more();
    //                    $(window).trigger("fetchmore"); //keep triggering this event until we've filled the viewport
    //                }
    //            }
    //        });
    //        //trigger initial fetch
    //        $(window).trigger("fetchmore");
    //    }
    //});


    function load_more() {
        $scope.OverviewRpt.MemberId = $("#ddl_BR").val();
        $scope.OverviewRpt.Year = $("#ddlYear").val();
        var query = '';
        if ($scope.OverviewRpt.MemberId == 0) {
            query = "Select RName, Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec From rpt_ops_overview_" + $scope.OverviewRpt.Year + ""
        }
        else {
            query = "Select RName,Jan,Feb, Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec  From rpt_ops_overview_br_" + $scope.OverviewRpt.Year + " Where BrId = " + $scope.OverviewRpt.MemberId + ""
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
        var _Solution = [];
        $.ajax(settings).done(function (data) {
            var results = data['datarows'];
            _Solution = results;
            _Solution = results.map(
                c => {
                    return {

                        'RName': (c[0]),
                        'Jan': (c[1]),
                        'Feb': (c[2]),
                        'Mar': (c[3]),
                        'Apr': (c[4]),
                        'May': (c[5]),
                        'Jun': (c[6]),
                        'Jul': (c[7]),
                        'Aug': (c[8]),
                        'Sep': (c[9]),
                        'Oct': (c[10]),
                        'Nov': (c[11]),
                        'Dec': (c[12]),
                        /*'Summary': (c[1]) + (c[2]) + (c[3]) + (c[4]) + (c[5]) + (c[6]) + (c[7]) + (c[8]) + (c[9]) + (c[10]) + (c[10]) + (c[12])*/

                    }
                }
            );

            if (_Solution != null) {
                $scope.MainResultlistAfterFilter = (_Solution);
                ///////////                    
                $.each($scope.MainResultlistAfterFilter, function (i, item) {
                    added_row = '<tr>'
                        + '<td>' + item.RName + '</td>'
                        + '<td>' + item.Jan + '</td>'
                        + '<td>' + item.Feb + '</td>'
                        + '<td>' + item.Mar + '</td>'
                        + '<td>' + item.Apr + '</td>'
                        + '<td>' + item.May + '</td>'
                        + '<td>' + item.Jun + '</td>'
                        + '<td>' + item.Jul + '</td>'
                        + '<td>' + item.Aug + '</td>'
                        + '<td>' + item.Sep + '</td>'
                        + '<td>' + item.Oct + '</td>'
                        + '<td>' + item.Nov + '</td>'
                        + '<td>' + item.Dec + '</td>'
                        + '<td>' + item.Summary + '</td>'
                        + '</tr>';
                    $("#OverviewRpt").append(added_row);
                    $scope.count = $scope.count + 1;
                    $scope.SecondMainResultlistAfterFilter.push(item);
                });
                $scope.currentleg = $scope.currentleg + $scope.MainResultlistAfterFilter.length;

                $('.dataTables_info').html('Showing ' + $scope.SecondMainResultlistAfterFilter.length + ' entries');
                $('#OverviewRpt_paginate').css("display", "none");
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
        $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

        if ($scope.LoginMemberType == "4") {
            $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

            if ($scope.IsShowSupplier != "true") {
                $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
            }
        }
        else {
            $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

            if ($scope.IsShowSupplier != "true") {
                $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
            }
        }
    }

    //onHide Popup Click
    $scope.HideColumns = function () {
        //Hide_Columns is comm. fun in CommonUtility.js
        Hide_Columns('OverviewRpt')
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
        Apply_Sorting('OverviewRpt', $scope.SortDetails)

    }
    $scope.ClearSorting = function () {
        $scope.SortDetails = [];
        $scope.SortDetails = Clear_Sorting('OverviewRpt');
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
    var table = $('#OverviewRpt').dataTable();
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






