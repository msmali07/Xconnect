var app = angular.module('SuppHotelSalesRptapp', []);

var bid = ""; var brtypeid = ""; var mid = ""; var mrtypeid = ""; var bid = ""; var Wsid = ""; var membertypeid = "";
var isvalid = true;
app.controller('SuppHotelSalesRptCntr', ['$scope', '$http', '$window', '$rootScope', '$timeout', function ($scope, $http, $window, $rootScope, $timeout) {
    NgInit();
    function NgInit() {
        $scope.SuppHotelSalesRpt = CommonDashBoardV1DO();
        $scope.ReportFilter = ReportFilterDO();
        $scope.PostBooking = PostBookingDO();
        $scope.SendMailDO = SendMailDO();

        $scope.IsShowSupplier = GetE("hdnIsShowSupplier").value;
        $scope.LoginMemberTypeID = GetE("hdnLoginMemberTypeId").value;
        $scope.MemberId = GetE("hdnLoginMemberId").value;//If Branch Login

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
        $scope.SuppHotelSalesRpt.MemberId = "10561"
        $scope.CustomDateRangeFilter = "2024";
        SortingSetting();
        ShowHideExcelColumns();

        $("#ddl_BR option:selected").text("All Branch");
        $("#ddl_AG option:selected").text("All Agent");

        $scope.SuppHotelSalesRpt.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
        $scope.SuppHotelSalesRpt.DateTo = ConvertCustomrangedate(new Date());
        if ($scope.LoginMemberTypeID == 1) {
            //this is PostBooking Init()
            $scope.PostBooking = PostBooking_Init($scope.PostBooking, $scope.LoginMemberTypeID)
            //this is On Post Booking change events
            $rootScope.$on("CallPostBooking", function (event) {
                document.getElementById("Wsdiv").style.display = "none";
                document.getElementById("agentdiv").style.display = "none";
                $scope.PostBooking = Set_PostMemberDetails(event, $scope.PostBooking);

            });
        }
        $("#demo").addClass("collapse in");
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

        if ($scope.SuppHotelSalesRpt.DateFrom == "") {

            Alert.render("Please Select Arrival-From Date", "txtFromDate");
            isvalid = false;
            return false;
        }

        if ($scope.SuppHotelSalesRpt.DateTo == "") {
            Alert.render("Please Select Arrival-To Date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ($scope.SuppHotelSalesRpt.DateFrom != "" && $scope.SuppHotelSalesRpt.DateTo != "") {
            var dtObj1 = GetSystemDate($scope.SuppHotelSalesRpt.DateFrom);
            var dtObj2 = GetSystemDate($scope.SuppHotelSalesRpt.DateTo);
        }

        if (($scope.SuppHotelSalesRpt.DateFrom != "" && $scope.SuppHotelSalesRpt.DateTo != "") && (dtObj1 > dtObj2)) {
            Alert.render("Arrival-From date can not be greater than Arrival-To date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ((diffDate(new Date($scope.SuppHotelSalesRpt.DateTo), new Date($scope.SuppHotelSalesRpt.DateFrom))) > 12.50) {
            Alert.render("Report Seraching Dates Should be Upto 12 Months", "txtToDate");
            isvalid = false;
            return false;
        }
        if ($scope.LoginMemberTypeID == 1) {
            //PostBookingSetting
            $scope.PostBooking = PostBooking_Setting($scope.PostBooking, $scope.LoginMemberTypeID)
            //if ($scope.PostBooking.PostMemberId == "0") {
            //    if (GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text != "All Agent") {
            //        Alert.render("Select Member to Post Booking", "ddl_BR");
            //        isvalid = false;
            //        return false;
            //    }
            //}
            if (document.getElementById('ADW').checked) {
                $scope.SuppHotelSalesRpt.BookingdateWise = false;
            }
            if (document.getElementById('BDW').checked) {
                $scope.SuppHotelSalesRpt.BookingdateWise = true;
            }
            if ($scope.IsGetfromHome == true) {
                $scope.PostBooking.ReportCompanyName = $scope.OnLoadReportCompanyName;
                $scope.PostBooking.PostMemberId = $scope.OnLoadPostMemberId;
            }
            $scope.MemberDetails = $scope.PostBooking.Br_Id + "_" + $scope.PostBooking.Ws_Id + "_" + $scope.PostBooking.Ag_Id + "_" + $scope.PostBooking.ReportCompanyName + "_" + GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text;
            $scope.SuppHotelSalesRpt.MemberId = $scope.PostBooking.PostMemberId;
            $scope.SuppHotelSalesRpt.LoginUserId = (document.getElementById("hdnLoginUserId")).value;
        }
        if (isvalid == true) {
            $scope.GetReportDetails();
        }
    }


    //getReportDetails on serach click
    $scope.GetReportDetails = function () {
        var ReportName = " Top Selling Hotel (Supplier Wise) Report";
        var popupdetail = $scope.PostBooking.ReportCompanyName + "~" + $scope.SuppHotelSalesRpt.DateFrom + "~" + $scope.SuppHotelSalesRpt.DateTo;
        PopUpController.OpenPopup2("divPopup", ReportName, popupdetail);
        $scope.ReportFilter.CustomDateOption = $("#ddl_CustomDateRange").val();;
        $scope.SuppHotelSalesRpt.MemberId = 0;//$("#ddl_BR").val();
        $scope.currentleg = 0; $scope.count = 0;
        $("#demo").addClass("collapse in");
        $scope.SuppHotelSalesRpt.Year = $("#ddlYear").val();
        $scope.SuppHotelSalesRpt.MemberId = $("#ddl_BR").val();
        SetLimit($scope.LoadData);
        var Query = '';
        if ($scope.LoginMemberTypeID == 1) {
            if ($scope.SuppHotelSalesRpt.BookingdateWise == false && $scope.SuppHotelSalesRpt.MemberId == 0) {
                Query = "SELECT HName, Dest, SUM(RN) as Rn, SUM(Bgs) as BKG, SUM(NoOfSearch) as NoOfSearch, SUM(TTV) as TTVK, M_date FROM rpt_sales_hotels_" + $scope.SuppHotelSalesRpt.Year + "_ch GROUP BY HName, Dest, M_date order by BKG desc LIMIT " + $scope.Limit + "";
            }
            else if ($scope.SuppHotelSalesRpt.BookingdateWise == true && $scope.SuppHotelSalesRpt.MemberId == 0) {
                Query = "SELECT HName, Dest, SUM(RN) as Rn, SUM(Bgs) as BKG, SUM(NoOfSearch) as NoOfSearch, SUM(TTV) as TTVK, M_date FROM rpt_sales_hotels_" + $scope.SuppHotelSalesRpt.Year + "_bk GROUP BY HName, Dest, M_date order by BKG desc LIMIT " + $scope.Limit + "";
            }
            else if ($scope.SuppHotelSalesRpt.BookingdateWise == false && $scope.SuppHotelSalesRpt.MemberId != 0) {
                Query = "SELECT HName, Dest, SUM(RN) as Rn, SUM(Bgs) as BKG, SUM(NoOfSearch) as NoOfSearch, SUM(TTV) as TTVK, M_date,BrId FROM rpt_sales_hotels_" + $scope.SuppHotelSalesRpt.Year + "_ch WHERE BrId=" + $scope.SuppHotelSalesRpt.MemberId + " GROUP BY HName, Dest, M_date order by BKG desc LIMIT " + $scope.Limit + "";
            }
            else if ($scope.SuppHotelSalesRpt.BookingdateWise == true && $scope.SuppHotelSalesRpt.MemberId != 0) {
                Query = "SELECT HName, Dest, SUM(RN) as Rn, SUM(Bgs) as BKG, SUM(NoOfSearch) as NoOfSearch, SUM(TTV) as TTVK, M_date,BrId FROM rpt_sales_hotels_" + $scope.SuppHotelSalesRpt.Year + "_bk WHERE BrId=" + $scope.SuppHotelSalesRpt.MemberId + " GROUP BY HName, Dest, M_date,BrId,BrId order by BKG desc LIMIT " + $scope.Limit + "";
            }
        }
        else if ($scope.LoginMemberTypeID == 2) {
            if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
                if ($scope.SuppHotelSalesRpt.BookingdateWise == false) {
                    Query = "SELECT HName, Dest, SUM(RN) as Rn, SUM(Bgs) as BKG, SUM(NoOfSearch) as NoOfSearch, SUM(TTV) as TTVK, M_date,BrId,Saleperson FROM rpt_sales_hotels_" + $scope.SuppHotelSalesRpt.Year + "_ch WHERE BrId=" + $scope.MemberId + "  and  Saleperson = " + $scope.IsSalePersonUserId + " GROUP BY HName, Dest, M_date,BrId,Saleperson order by BKG descLIMIT " + $scope.Limit + "";
                }
                else if ($scope.SuppHotelSalesRpt.BookingdateWise == true) {
                    Query = "SELECT HName, Dest, SUM(RN) as Rn, SUM(Bgs) as BKG, SUM(NoOfSearch) as NoOfSearch, SUM(TTV) as TTVK, M_date,BrId,Saleperson FROM rpt_sales_hotels_" + $scope.SuppHotelSalesRpt.Year + "_bk WHERE BrId=" + $scope.MemberId + " and  Saleperson = " + $scope.IsSalePersonUserId + "  GROUP BY HName, Dest, M_date,BrId,Saleperson order by BKG desc LIMIT " + $scope.Limit + "";
                }
            }
            else {
                if ($scope.SuppHotelSalesRpt.BookingdateWise == false) {
                    Query = "SELECT HName, Dest, SUM(RN) as Rn, SUM(Bgs) as BKG, SUM(NoOfSearch) as NoOfSearch, SUM(TTV) as TTVK, M_date,BrId FROM rpt_sales_hotels_" + $scope.SuppHotelSalesRpt.Year + "_ch WHERE BrId=" + $scope.MemberId + " GROUP BY HName, Dest, M_date,BrId order by BKG desc LIMIT " + $scope.Limit + "";
                }
                else if ($scope.SuppHotelSalesRpt.BookingdateWise == true) {
                    Query = "SELECT HName, Dest, SUM(RN) as Rn, SUM(Bgs) as BKG, SUM(NoOfSearch) as NoOfSearch, SUM(TTV) as TTVK, M_date,BrId FROM rpt_sales_hotels_" + $scope.SuppHotelSalesRpt.Year + "_bk WHERE BrId=" + $scope.MemberId + " GROUP BY HName, Dest, M_date,BrId order by BKG desc LIMIT " + $scope.Limit + "";
                }
            }
        }
        var settings = {
            "url": "https://es.xconnect.in/_opendistro/_sql",
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
            _Solution = results.map(
                c => {
                    return {
                        'SupplierName': (c[0]),
                        'HotelName': (c[0]),
                        'Dest': (c[1]),
                        'TTV_K': (c[3]),
                        'RN': (c[2]),
                        'Bgs': (c[3]),
                        'OM_Per': (c[5]),
                    }
                }
            );
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


    var $mytable = $("#SuppHotelSalesRpt");
    //Set DataTable
    function SetDataTable() {
        if ($scope.ReportFilter.GroupBy == "") {
            $('#SuppHotelSalesRpt').DataTable().clear().destroy();
            $('#SuppHotelSalesRpt').DataTable({
                "order": [],
                responsive: true,
                dom: 'Bfrtip',
                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: '<i class="fa fa-file-excel-o"></i>',
                        filename: function () {
                            var ReportName = "Top Selling Hotel (Supplier Wise) Report"
                            var AgeDetails = $scope.SuppHotelSalesRpt.DateFrom + "-" + $scope.SuppHotelSalesRpt.DateTo;
                            return ReportName + ' ( ' + AgeDetails + ' ) '
                        },
                        sheetName: 'SuppHotelSalesRptSheet',
                        title: null,
                        exportOptions: {
                            columns: $scope.ExcelCollist
                        }
                    },
                    {
                        extend: 'copyHtml5',
                        text: '<i class="fa fa-files-o"></i>',
                        titleAttr: 'Copy',
                        exportOptions: {
                            columns: $scope.ExcelCollist
                        },
                    }
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
                        orderable: false,                        
                    },
                    {
                        "targets": 3,
                        orderable: false,
                        "className": "text-right",
                    },
                    {
                        "targets": 4,
                        orderable: false,
                        "className": "text-right",
                    },
                    {
                        "targets": 5,
                        orderable: false,
                        "className": "text-right",
                    },
                    {
                        "targets": 6,
                        orderable: false,
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
                    { data: 'SupplierName' },
                    { data: 'HotelName' },
                    { data: 'Dest' },
                    { data: 'TTV_K' },
                    { data: 'RN' },
                    { data: 'Bgs' },
                    { data: 'OM_Per' }
                ],
            });
            $('.dataTables_info').html('Showing ' + $scope.SecondMainResultlistAfterFilter.length + ' entries');
            $('#SuppHotelSalesRpt_paginate').css("display", "none");
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
            $scope.JCount = 100;
            $scope.Limit = $scope.Icount + "," + $scope.JCount;
            $scope.Icount = 1;
        }
    }

    function load_more() {
        $scope.SuppHotelSalesRpt.MemberId = 0;//$("#ddl_BR").val();
        SetLimit($scope.LoadData);
        $scope.SuppHotelSalesRpt.Year = $("#ddlYear").val();
        var Query = '';
        if ($scope.LoginMemberTypeID == 1) {
            if ($scope.SuppHotelSalesRpt.BookingdateWise == false && $scope.SuppHotelSalesRpt.MemberId == 0) {
                Query = "SELECT HName, Dest, SUM(RN) as Rn, SUM(Bgs) as BKG, SUM(NoOfSearch) as NoOfSearch, SUM(TTV) as TTVK, M_date FROM rpt_sales_hotels_" + $scope.SuppHotelSalesRpt.Year + "_ch GROUP BY HName, Dest, M_date order by BKG desc LIMIT " + $scope.Limit + "";
            }
            else if ($scope.SuppHotelSalesRpt.BookingdateWise == true && $scope.SuppHotelSalesRpt.MemberId == 0) {
                Query = "SELECT HName, Dest, SUM(RN) as Rn, SUM(Bgs) as BKG, SUM(NoOfSearch) as NoOfSearch, SUM(TTV) as TTVK, M_date FROM rpt_sales_hotels_" + $scope.SuppHotelSalesRpt.Year + "_bk GROUP BY HName, Dest, M_date order by BKG desc LIMIT " + $scope.Limit + "";
            }
            else if ($scope.SuppHotelSalesRpt.BookingdateWise == false && $scope.SuppHotelSalesRpt.MemberId != 0) {
                Query = "SELECT HName, Dest, SUM(RN) as Rn, SUM(Bgs) as BKG, SUM(NoOfSearch) as NoOfSearch, SUM(TTV) as TTVK, M_date,BrId FROM rpt_sales_hotels_" + $scope.SuppHotelSalesRpt.Year + "_ch WHERE BrId=" + $scope.SuppHotelSalesRpt.MemberId + " GROUP BY HName, Dest, M_date order by BKG desc LIMIT " + $scope.Limit + "";
            }
            else if ($scope.SuppHotelSalesRpt.BookingdateWise == true && $scope.SuppHotelSalesRpt.MemberId != 0) {
                Query = "SELECT HName, Dest, SUM(RN) as Rn, SUM(Bgs) as BKG, SUM(NoOfSearch) as NoOfSearch, SUM(TTV) as TTVK, M_date,BrId FROM rpt_sales_hotels_" + $scope.SuppHotelSalesRpt.Year + "_bk WHERE BrId=" + $scope.SuppHotelSalesRpt.MemberId + " GROUP BY HName, Dest, M_date,BrId,BrId order by BKG desc LIMIT " + $scope.Limit + "";
            }
        }
        else if ($scope.LoginMemberTypeID == 2) {
            if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
                if ($scope.SuppHotelSalesRpt.BookingdateWise == false) {
                    Query = "SELECT HName, Dest, SUM(RN) as Rn, SUM(Bgs) as BKG, SUM(NoOfSearch) as NoOfSearch, SUM(TTV) as TTVK, M_date,BrId,Saleperson FROM rpt_sales_hotels_" + $scope.SuppHotelSalesRpt.Year + "_ch WHERE BrId=" + $scope.MemberId + "  and  Saleperson = " + $scope.IsSalePersonUserId + " GROUP BY HName, Dest, M_date,BrId,Saleperson order by BKG descLIMIT " + $scope.Limit + "";
                }
                else if ($scope.SuppHotelSalesRpt.BookingdateWise == true) {
                    Query = "SELECT HName, Dest, SUM(RN) as Rn, SUM(Bgs) as BKG, SUM(NoOfSearch) as NoOfSearch, SUM(TTV) as TTVK, M_date,BrId,Saleperson FROM rpt_sales_hotels_" + $scope.SuppHotelSalesRpt.Year + "_bk WHERE BrId=" + $scope.MemberId + " and  Saleperson = " + $scope.IsSalePersonUserId + "  GROUP BY HName, Dest, M_date,BrId,Saleperson order by BKG desc LIMIT " + $scope.Limit + "";
                }
            }
            else {
                if ($scope.SuppHotelSalesRpt.BookingdateWise == false) {
                    Query = "SELECT HName, Dest, SUM(RN) as Rn, SUM(Bgs) as BKG, SUM(NoOfSearch) as NoOfSearch, SUM(TTV) as TTVK, M_date,BrId FROM rpt_sales_hotels_" + $scope.SuppHotelSalesRpt.Year + "_ch WHERE BrId=" + $scope.MemberId + " GROUP BY HName, Dest, M_date,BrId order by BKG desc LIMIT " + $scope.Limit + "";
                }
                else if ($scope.SuppHotelSalesRpt.BookingdateWise == true) {
                    Query = "SELECT HName, Dest, SUM(RN) as Rn, SUM(Bgs) as BKG, SUM(NoOfSearch) as NoOfSearch, SUM(TTV) as TTVK, M_date,BrId FROM rpt_sales_hotels_" + $scope.SuppHotelSalesRpt.Year + "_bk WHERE BrId=" + $scope.MemberId + " GROUP BY HName, Dest, M_date,BrId order by BKG desc LIMIT " + $scope.Limit + "";
                }
            }
        }
        var settings = {
            "url": "https://es.xconnect.in/_opendistro/_sql",
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
                        'SupplierName': (c[0]),
                        'HotelName': (c[0]),
                        'Dest': (c[1]),
                        'TTV_K': (c[3]),
                        'RN': (c[2]),
                        'Bgs': (c[3]),
                        'OM_Per': (c[5]),
                    }
                }
            );

            if (_Solution != null) {
                $scope.MainResultlistAfterFilter = (_Solution);
                ///////////                    
                $.each($scope.MainResultlistAfterFilter, function (i, item) {

                    if (i == 0) {
                        $("#SuppHotelSalesRpt").html('');
                        if ($scope.LoginMemberTypeID == 1) {
                            added_row = ' <thead class="main-head hidden-xs" id="theaddiv">< tr > <th>Supplier Name</th> <th>Hotel Name</th> <th>Destination</th> <th style="text-align:right;" >TTV (K)</th> <th style="text-align:right;" title="Room Nights">RN</th>   <th style="text-align:right;" title="Bookings">BKG</th>  <th style="text-align:right;">OM %</th>  </thead >'
                            
                        }
                        else {
                            added_row = ' <thead class="main-head hidden-xs" id="theaddiv">< tr > <th>Supplier Name</th> <th>Hotel Name</th> <th>Destination</th> <th style="text-align:right;" >TTV (K)</th> <th style="text-align:right;" title="Room Nights">RN</th>   <th style="text-align:right;" title="Bookings">BKG</th> </thead >'
                        }
                    }
                    if ($scope.LoginMemberTypeID == 1) {
                        added_row += '<tr>'
                            + '<td>' + item.SupplierName + '</td>'
                            + '<td>' + item.HotelName + '</td>'
                            + '<td>' + item.Dest + '</td>'
                            + '<td style="text-align:right;">' + item.TTV_K + '</td>'
                            + '<td style="text-align:right;">' + item.RN + '</td>'
                            + '<td style="text-align:right;">' + item.Bgs + '</td>'
                            + '<td style="text-align:right;">' + item.OM_Per + '</td>'
                            + '</tr>';
                    }
                    else {
                        added_row += '<tr>'
                            + '<td>' + item.SupplierName + '</td>'
                            + '<td>' + item.HotelName + '</td>'
                            + '<td>' + item.Dest + '</td>'
                            + '<td style="text-align:right;">' + item.TTV_K + '</td>'
                            + '<td style="text-align:right;">' + item.RN + '</td>'
                            + '<td style="text-align:right;">' + item.Bgs + '</td>'
                            + '</tr>';
                    }

                    $scope.count = $scope.count + 1;
                    $scope.SecondMainResultlistAfterFilter.push(item);
                });
                $("#SuppHotelSalesRpt").append(added_row);
                $scope.currentleg = $scope.currentleg + $scope.MainResultlistAfterFilter.length;

                $('.dataTables_info').html('Showing ' + $scope.SecondMainResultlistAfterFilter.length + ' entries');
                $('#SuppHotelSalesRpt_paginate').css("display", "none");
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
        Hide_Columns('SuppHotelSalesRpt')
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
        Apply_Sorting('SuppHotelSalesRpt', $scope.SortDetails)

    }
    $scope.ClearSorting = function () {
        $scope.SortDetails = [];
        $scope.SortDetails = Clear_Sorting('SuppHotelSalesRpt');
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
    var table = $('#SuppHotelSalesRpt').dataTable();
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




