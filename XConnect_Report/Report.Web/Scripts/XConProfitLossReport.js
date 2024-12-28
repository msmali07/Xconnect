var app = angular.module('XProfitlossreportapp', []);


var bid = ""; var brtypeid = ""; var mid = ""; var mrtypeid = ""; var bid = ""; var Wsid = ""; var membertypeid = "";
var isvalid = true;
app.controller('XProfitlossreportCntr', ['$scope', '$http', '$window', '$rootScope', function ($scope, $http, $window, $rootScope) {
    NgInit();

    function NgInit() {
        $scope.ProfitLossReport = ProfitLossDO();
        $scope.ReportFilter = ReportFilterDO();
        $scope.PostBooking = PostBookingDO();
        $scope.SendMailDO = SendMailDO();


        $scope.IsShowSupplier = GetE("hdnIsShowSupplier").value;
        $scope.LoginMemberType = GetE("hdnLoginMemberTypeId").value;
        $scope.ModifySearch = true;
        $scope._IsHidePostBooking = false;
        $scope.MemberDetails = "";
        $scope.GroupingName = "";


        $scope.SortDetails = [];
        $scope.SortDetails.push(SortDetailDO());
        $scope.SortColNo = [];
        $scope.MainResultlistAfterFilter = [];
        $scope.ShowddlFilterList = [];
        $scope.FilterDOList = [];
        $scope.FilterTypeActive = "";
        $scope.selectedArray = "";
        $scope.OldSelectedfilterArrayValues = "";
        SortingSetting();
        ShowHideExcelColumns();

        //its for top show Functionality
        $scope.IsTopShowAValue = "0";
        $scope.IsTopShowActive = false;
        $scope.TopDivShow = true;
        ////

        $("#ddl_BR option:selected").text("All Branch");
        $("#ddl_WS option:selected").text("All Wholesaler");
        $("#ddl_AG option:selected").text("All Agent");

        $scope.ProfitLossReport.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
        $scope.ProfitLossReport.DateTo = ConvertCustomrangedate(new Date());

        //this is PostBooking Init()
        $scope.PostBooking = PostBooking_Init($scope.PostBooking, $scope.LoginMemberType)

        //this is On Post Booking change events
        $rootScope.$on("CallPostBooking", function (event) {
            $scope.PostBooking = Set_PostMemberDetails(event, $scope.PostBooking);

        });
        $("#demo").addClass("collapse in");

    }



    //select Customdate option
    Customdaterangelist1 = Customdaterangelist();

    $scope.DateRangeList = Customdaterangelist1;

    $("#ddl_CustomDateRange").change(function () {
        $scope.CustomDateRangeFilter = $("#ddl_CustomDateRange").val();

        if ($scope.CustomDateRangeFilter != "" && $scope.CustomDateRangeFilter != "0") {
            GetE("txtFromDate").value = $scope.CustomDateRangeFilter.split("~")[0];
            $scope.ProfitLossReport.DateFrom = $scope.CustomDateRangeFilter.split("~")[0];
            GetE("txtToDate").value = $scope.CustomDateRangeFilter.split("~")[1];
            $scope.ProfitLossReport.DateTo = $scope.CustomDateRangeFilter.split("~")[1];
        }
        else {
            GetE("txtFromDate").value = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            $scope.ProfitLossReport.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            GetE("txtToDate").value = ConvertCustomrangedate(new Date());
            $scope.ProfitLossReport.DateTo = ConvertCustomrangedate(new Date());
        }

    });


    $scope.ShowModifyBtn = function () {
        $scope.ModifySearch = false;

    }

    //select grouping option
    $("#ddl_Grp").change(function () {
        $scope.ReportFilter.GroupBy = $("#ddl_Grp").val().split('~')[0];
        $scope.GroupingName = $("#ddl_Grp").val().split('~')[1];
    });

    //Modify Button for
    $scope.ShowModifyClick = function () {       
        $("#Noresultdiv")[0].style.display = "none";
        $("#Errordiv")[0].style.display = "none";
    }

    //Validation and setparam on serach click
    $scope.SearchReportClick = function () {


        var isvalid = true;
        $scope.OnlyClearAll();
        $("#RptDetails")[0].style.display = "none";
        $("#RptSummary")[0].style.display = "none";
        $("#RptHeaderDetails")[0].style.display = "none";
        $("#Noresultdiv")[0].style.display = "none";
        PopUpController.ClosePopup("divPopup", "");
        $("#HeaderSearchdiv").removeClass();
        $("#HeaderSearchdiv").addClass("col-lg-12 col-md-12 col-sm-12 col-xs-12 container-fluid padd-lft10 padd-rgt10");
        $scope.ModifySearch = false;

        if ($scope.ProfitLossReport.DateFrom == "") {

            Alert.render("Please Select Arrival-From Date", "txtFromDate");
            isvalid = false;
            return false;
        }

        if ($scope.ProfitLossReport.DateTo == "") {
            Alert.render("Please Select Arrival-To Date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ($scope.ProfitLossReport.DateFrom != "" && $scope.ProfitLossReport.DateTo != "") {
            var dtObj1 = GetSystemDate($scope.ProfitLossReport.DateFrom);
            var dtObj2 = GetSystemDate($scope.ProfitLossReport.DateTo);
        }

        if (($scope.ProfitLossReport.DateFrom != "" && $scope.ProfitLossReport.DateTo != "") && (dtObj1 > dtObj2)) {
            Alert.render("Arrival-From date can not be greater than Arrival-To date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ((diffDate(new Date($scope.ProfitLossReport.DateTo), new Date($scope.ProfitLossReport.DateFrom))) > 12.50) {
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


        if (document.getElementById('ADW').checked) {
            $scope.ProfitLossReport.BookingdateWise = 0;
        }
        if (document.getElementById('BDW').checked) {
            $scope.ProfitLossReport.BookingdateWise = 1;
        }
        if (document.getElementById('RDW').checked) {
            $scope.ProfitLossReport.BookingdateWise = 2;
        }


        $scope.MemberDetails = $scope.PostBooking.Br_Id + "_" + $scope.PostBooking.Ws_Id + "_" + $scope.PostBooking.Ag_Id + "_" + $scope.PostBooking.ReportCompanyName + "_" + GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text;


        $scope.ProfitLossReport.MemberId = $scope.PostBooking.PostMemberId;
        $scope.ProfitLossReport.LoginUserId = (document.getElementById("hdnLoginUserId")).value;




        if (isvalid == true) {
            $scope.GetReportDetails();
        }
    }

    //getReportDetails on serach click
    $scope.GetReportDetails = function () {
        var popupdetail = $scope.PostBooking.ReportCompanyName + "~" + $scope.ProfitLossReport.DateFrom + "~" + $scope.ProfitLossReport.DateTo;
        PopUpController.OpenPopup1("divPopup", "Profit & Loss Report", popupdetail);

        $scope.ReportFilter.BrName = $scope.FilterDOList.filter(item => item.Name == 'BrName').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'BrName')[0].Values) : "";
        $scope.ReportFilter.AgName = $scope.FilterDOList.filter(item => item.Name == 'AgName').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'AgName')[0].Values) : "";
        $scope.ReportFilter.AgCity = $scope.FilterDOList.filter(item => item.Name == 'AgCity').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'AgCity')[0].Values) : "";
        $scope.ReportFilter.AgCountry = $scope.FilterDOList.filter(item => item.Name == 'AgCountry').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'AgCountry')[0].Values) : "";
        $scope.ReportFilter.SType = $scope.FilterDOList.filter(item => item.Name == 'SType').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'SType')[0].Values) : "";
        $scope.ReportFilter.SCity = $scope.FilterDOList.filter(item => item.Name == 'SCity').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'SCity')[0].Values) : "";
        $scope.ReportFilter.SCountry = $scope.FilterDOList.filter(item => item.Name == 'SCountry').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'SCountry')[0].Values) : "";
        $scope.ReportFilter.BType = $scope.FilterDOList.filter(item => item.Name == 'BType').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'BType')[0].Values) : "";
        $scope.ReportFilter.BookedBy = $scope.FilterDOList.filter(item => item.Name == 'BookedBy').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'BookedBy')[0].Values) : "";

        $scope.ReportFilter.SuppName = $scope.FilterDOList.filter(item => item.Name == 'SuppName').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'SuppName')[0].Values) : "";
       
        $scope.ReportFilter.Status = $scope.FilterDOList.filter(item => item.Name == 'Status').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'Status')[0].Values) : "";
        $scope.ReportFilter.SellCur = $scope.FilterDOList.filter(item => item.Name == 'SellCur').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'SellCur')[0].Values) : "";
        $scope.ReportFilter.NetCur = $scope.FilterDOList.filter(item => item.Name == 'NetCur').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'NetCur')[0].Values) : "";

        $scope.ReportFilter.CustomDateOption = $("#ddl_CustomDateRange").val();;



        $("#demo").addClass("collapse in");

        $http({
            method: "post",
            url: "../Booking/GetXConProfitLossReport",
            data: ({
                ProfitLossReportDO: $scope.ProfitLossReport,
            }),
            dataType: "json",
            headers: { "Content-Type": "application/json" }

        }).then(function (d) {

            if (d.data != undefined || d.data != null) {
                if (d.data.length > 0) {

                    $scope.MainResultlist = (d.data);
                    $scope.MainResultlistAfterFilter = (d.data);
                    console.log(d.data);

                    $scope.MainResultlist = $scope.MainResultlist.map(
                        item => {
                            item["SType"] = GetBookingServiceNameDirective(item["SType"]);
                            item["BookedBy"] = GetMemberTypeDirective(item["BookedBy"]);
                            item["BType"] = GetBookingTypeDirective(item["BType"]);

                            return item;
                        }
                    );
                    $scope.MainResultlistAfterFilter = $scope.MainResultlistAfterFilter.map(
                        item => {
                            item["SType"] = GetBookingServiceNameDirective(item["SType"]);
                            item["BookedBy"] = GetMemberTypeDirective(item["BookedBy"]);
                            item["BType"] = GetBookingTypeDirective(item["BType"]);

                            return item;
                        }
                    );

                    console.log($scope.MainResultlistAfterFilter.length);
                    $('#ProfitLossReport').DataTable().clear().destroy();
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

            }
            else {
                $scope.ModifySearch = false;
                $("#Noresultdiv")[0].style.display = "block";
                $("#RptHeaderDetails")[0].style.display = "block";
                PopUpController.ClosePopup("divPopup", "");
            }

        }, function (error) {
            $scope.ModifySearch = false;
            $("#Errordiv")[0].style.display = "block";
            //ErrorPopup.render('Error');
            PopUpController.ClosePopup("divPopup", "");
        });


    }

    //Set DataTable
    function SetDataTable() {
        if ($scope.ReportFilter.GroupBy == "") {

            $scope.TopDivShow = true;
            var Oldtable = $('#ProfitLossReport').dataTable();

            var oldinfo = Oldtable.fnSettings().aaSorting;
            var orderdata = [];
            for (d = 0; d < oldinfo.length; d++) {
                if (oldinfo[d][0] != 0) {
                    orderdata.push([oldinfo[d][0], oldinfo[d][1]]);
                }

            }
            //console.log(orderdata);

            $('#ProfitLossReport').DataTable().clear().destroy();

            $('#ProfitLossReport').DataTable({

                dom: 'Bfrtip',
                buttons: [

                    {
                        extend: 'excelHtml5',
                        text: '<i class="fa fa-file-excel-o"></i>',
                        filename: function () {
                            var ReportName = "Profit & Loss Report"
                            var RptDetails = $scope.ProfitLossReport.DateFrom + "-" + $scope.ProfitLossReport.DateTo;
                            return ReportName + ' ( ' + RptDetails + ' ) '
                        },
                        sheetName: 'Profit&LossRptSheet',
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
                        }
                    },
                    {
                        text: '<span class="cust-dt-button">Column Visibility</span>',
                        titleAttr: 'Hide',
                        action: function (e, dt, node, config) {

                            $("#hidecoldiv").modal('show');

                        }
                    },
                    {
                        text: '<span class="cust-dt-button">Custom Sort</span>',
                        titleAttr: 'Custom Sort',
                        action: function (e, dt, node, config) {

                            $("#Sortcoldiv").modal('show');

                        }
                    },
                    {
                        text: '<span class="cust-dt-button">Summary</span>',
                        titleAttr: 'Summary',
                        action: function (e, dt, node, config) {

                            $scope.getsummary3();

                        }
                    },
                    {
                        text: '<span class="cust-dt-button">Show : </span>',
                        titleAttr: 'Top',

                    },

                ],

                "autoWidth": false,
                "order": orderdata,
                ordering: true,
                "columnDefs": [

                    { "visible": false, "targets": parseInt(groupColumn) },

                    {
                        "visible": $scope.LoginMemberType == "2" ? false : true,
                        "render": function (data, type, row) {
                            return row["BrName"].substring(0, 20);
                        },
                        "targets": 1,

                    },
                    {

                        "visible": $scope.LoginMemberType == "4" ? false : true,
                        "render": function (data, type, row) {
                            return row["AgName"].substring(0, 20);
                        },
                        "targets": 2,

                    },
                    {
                        "render": function (data, type, row) {
                            return row["SuppName"].substring(0, 20);
                        },
                        "targets": 5,
                        "visible": $scope.IsShowSupplier == "false" ? false : true,

                    },
                    {
                        "render": function (data, type, row) {
                            return row["SName"].substring(0, 30);
                        },
                        "targets":6,

                    },
                    {
                        "targets": 7,
                        orderable: false,
                    },
                    {
                        "targets": 10,
                        "className": "text-center",
                        orderable: false,
                    },
                    {
                        "targets": 11,
                        "className": "text-center",
                        orderable: false,
                    },
                   
                    {                       
                        "targets": 12,
                        "className": "text-center",
                        orderable: false,
                    },
                    {
                        "targets":13,
                        "className": "text-center",
                        orderable: false,
                    },
                    {
                        "targets": 14,
                        "className": "text-center",
                        orderable: false,
                    },
                    {
                       
                        "targets": 15,
                        "className": "text-center",
                        orderable: false,
                    },
                    {
                        "render": function (data, type, row) {
                            return row["SNetAmt"].toFixed(2);
                        },
                        "targets": 16,
                        "className": "text-right",
                    },
                    {
                        "targets": 17,
                        "className": "text-center",
                        orderable: false,
                    },
                    {
                        "render": function (data, type, row) {
                            return row["HQExtra"].toFixed(2);
                        },
                        "targets": 18,
                        "className": "text-right",
                        orderable: false,
                    },
                    {
                        "render": function (data, type, row) {
                            return row["BRExtra"].toFixed(2);
                        },
                        "targets": 19,
                        "className": "text-right",
                        orderable: false,
                    },
                    {
                        "render": function (data, type, row) {
                            return row["AGPay"].toFixed(2);
                        },
                        "targets": 20,
                        "className": "text-right",
                    },
                    {
                        "render": function (data, type, row) {
                            return row["TaxPay"].toFixed(2);
                        },
                        "targets": 21,
                        "className": "text-right",
                    },
                    {
                        "render": function (data, type, row) {
                            return row["SSNetAmt"].toFixed(2);
                        },
                        "targets": 22,
                        "className": "text-right",
                    },
                    {
                        "targets": 23,
                         visible: false
                    },
                   
                    {
                        "render": function (data, type, row) {
                            return row["ProfitAmt"].toFixed(2);
                        },
                        "targets": 24,
                        "className": "text-right",
                    },
                    {
                        "render": function (data, type, row) {
                            return row["Profit"].toFixed(2);
                        },
                        "targets": 25,
                        "className": "text-right",
                    },
                    {
                        "visible": groupColumn == "26" ? false : true,
                        "targets": 26,
                        "className": "text-center",
                        orderable: false,

                    },
                   

                ],

                searching: false,

                paging: true,
                data: ($scope.IsTopShowActive == true ? $scope.MainResultlistAfterFilter.slice(0, $scope.IsTopShowAValue) : $scope.MainResultlistAfterFilter),
                "pageLength": 30,

                "deferRender": true,
                select: true,               
                columns: [
                    { data: 'RefNo' },
                    { data: 'BrName' },
                    { data: 'AgName' },
                    { data: 'AgCity' },
                    { data: 'AgCountry' },
                    { data: 'SuppName' },
                    { data: 'SName' },                 
                    { data: 'SType' },
                    { data: 'SCity' },
                    { data: 'SCountry' },
                    { data: "BookedBy" },
                    { data: 'BType' },                 
                    { data: 'BDate' },
                    { data: 'ChkIn' },
                    { data: 'Nts' },
                    { data: 'NetCur' },
                    { data: 'SNetAmt' },
                    { data: 'SellCur' },
                    { data: 'HQExtra' },
                    { data: 'BRExtra' },
                    { data: 'AGPay' },
                    { data: 'TaxPay' },
                    { data: 'SSNetAmt' },
                    { data: 'ConvFeeAmt' },
                    { data: 'ProfitAmt' },
                    { data: 'Profit' },
                    { data: 'Status' },
                    { data: 'RRDate' },
                    { data: 'SalesP' }
                ],


            });

            $('<div class="pull-right">' +
                '<select class="ddltop" id="ddltopdata">' +
                '<option value="0">All</option>' +
                '<option value="10">10</option>' +
                '<option value="15">15</option>' +
                '<option value="25">25</option>' +
                '<option value="50">50</option>' +
                '</select>' +
                '</div>').appendTo("#ProfitLossReport_wrapper .dt-buttons"); //example is our table id


            $('select[id="ddltopdata"] option[value="' + $scope.IsTopShowAValue + '"]').attr("selected", "selected");
        }
        else {
            $scope.TopDivShow = false;
            var groupColumn = $scope.ReportFilter.GroupBy.split('~')[0];
            $('#ProfitLossReport').DataTable().clear().destroy();

            $('#ProfitLossReport').DataTable({

                dom: 'Bfrtip',
                buttons: [


                    {
                        extend: 'excelHtml5',
                        text: '<i class="fa fa-file-excel-o"></i>',
                        filename: function () {
                            var ReportName = "Profit & Loss Report"
                            var RptDetails = $scope.ProfitLossReport.DateFrom + "-" + $scope.ProfitLossReport.DateTo;
                            return ReportName + ' ( ' + RptDetails + ' ) '
                        },
                        sheetName: 'Profit&LossRptSheet',
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
                        }
                    },
                    {
                        text: '<span class="cust-dt-button">Column Visibility</span>',
                        titleAttr: 'Hide',
                        action: function (e, dt, node, config) {

                            $("#hidecoldiv").modal('show');

                        }
                    },
                    {
                        text: '<span class="cust-dt-button">Custom Sort</span>',
                        titleAttr: 'Custom Sort',
                        action: function (e, dt, node, config) {

                            $("#Sortcoldiv").modal('show');

                        }
                    },
                    {
                        text: '<span class="cust-dt-button">Summary</span>',
                        titleAttr: 'Summary',
                        action: function (e, dt, node, config) {

                            $scope.getsummary3();

                        }
                    },


                ],
                "order": [],
                ordering: true,
                "columnDefs": [

                    { "visible": false, "targets": parseInt(groupColumn) },

                    {
                        "visible": $scope.LoginMemberType == "2" || groupColumn == "1" ? false : true,
                        "render": function (data, type, row) {
                            return row["BrName"].substring(0, 20);
                        },
                        "targets": 1,

                    },
                    {

                        "visible": $scope.LoginMemberType == "4" || groupColumn == "2" ? false : true,
                        "render": function (data, type, row) {
                            return row["AgName"].substring(0, 20);
                        },
                        "targets": 2,

                    },
                    {
                        "visible": groupColumn == "5" || $scope.IsShowSupplier == "false" ? false : true,
                        "render": function (data, type, row) {
                            return row["SuppName"].substring(0, 20);
                        },
                        "targets": 5,

                    },
                    {
                        "render": function (data, type, row) {
                            return row["SName"].substring(0, 30);
                        },
                        "targets": 6,

                    },
                    {
                        "visible": groupColumn == "7" ? false : true,
                        "targets": 7,
                        orderable: false,
                    },
                    {
                        "targets":10,
                        "className": "text-center",
                        orderable: false,
                    },
                    {
                        "targets": 11,
                        "className": "text-center",
                        orderable: false,
                    },

                    {
                        "targets": 12,
                        "className": "text-center",
                        orderable: false,
                    },
                    {
                        "targets": 13,
                        "className": "text-center",
                        orderable: false,
                    },
                    {
                        "targets": 14,
                        "className": "text-center",
                        orderable: false,
                    },
                    {

                        "targets": 15,
                        "className": "text-center",
                        orderable: false,
                    },
                    {
                        "render": function (data, type, row) {
                            return row["SNetAmt"].toFixed(2);
                        },
                        "targets": 16,
                        "className": "text-right",
                    },
                    {
                        "targets": 17,
                        "className": "text-center",
                        orderable: false,
                    },
                    {
                        "render": function (data, type, row) {
                            return row["HQExtra"].toFixed(2);
                        },
                        "targets": 18,
                        "className": "text-right",
                        orderable: false,
                    },
                    {
                        "render": function (data, type, row) {
                            return row["BRExtra"].toFixed(2);
                        },
                        "targets": 19,
                        "className": "text-right",
                        orderable: false,
                    },
                    {
                        "render": function (data, type, row) {
                            return row["AGPay"].toFixed(2);
                        },
                        "targets": 20,
                        "className": "text-right",
                    },
                    {
                        "render": function (data, type, row) {
                            return row["TaxPay"].toFixed(2);
                        },
                        "targets": 21,
                        "className": "text-right",
                    },
                    {
                        "render": function (data, type, row) {
                            return row["SSNetAmt"].toFixed(2);
                        },
                        "targets": 22,
                        "className": "text-right",
                    },
                    {
                        "targets": 23,
                        visible: false
                    },

                    {
                        "render": function (data, type, row) {
                            return row["ProfitAmt"].toFixed(2);
                        },
                        "targets": 24,
                        "className": "text-right",
                    },
                    {
                        "render": function (data, type, row) {
                            return row["Profit"].toFixed(2);
                        },
                        "targets":25,
                        "className": "text-right",
                    },
                    {
                        "visible": groupColumn == "26" ? false : true,
                        "targets": 26,
                        "className": "text-center",
                        orderable: false,

                    },
                   
                  

                ],
                ordering: true,
                searching: false,
                paging: true,
                data: ($scope.IsTopShowActive == true ? $scope.MainResultlistAfterFilter.slice(0, $scope.IsTopShowAValue) : $scope.MainResultlistAfterFilter),
                "pageLength": 30,
                select: true,
                // "scrollX": true,
                order: [[groupColumn]],
                "orderFixed": [groupColumn, 'asc'],
                rowGroup: {
                    startRender: null,
                    endRender: function (rows, group) {
                        var salaryAvg = rows
                            .data()
                            .pluck(7)
                            .reduce(function (a, b) {
                                return a + b.replace(/[^\d]/g, '') * 1;
                            }, 0) / rows.count();
                        salaryAvg = $.fn.dataTable.render.number(',', '.', 0, '$').display(salaryAvg);


                        return $('<tr/>')
                            .append('<td colspan="7">Averages for ' + group + '</td>')
                            .append('<td>' + salaryAvg + '</td>')
                            .append('<td/>')
                            .append('<td/>')

                    },
                    dataSrc: [groupColumn]
                },

                columns: [
                    { data: 'RefNo' },
                    { data: 'BrName' },
                    { data: 'AgName' },
                    { data: 'AgCity' },
                    { data: 'AgCountry' },
                    { data: 'SuppName' },
                    { data: 'SName' },                  
                    { data: 'SType' },
                    { data: 'SCity' },
                    { data: 'SCountry' },
                    { data: "BookedBy" },
                    { data: 'BType' },                  
                    { data: 'BDate' },
                    { data: 'ChkIn' },
                    { data: 'Nts' },
                    { data: 'NetCur' },
                    { data: 'SNetAmt' },
                    { data: 'SellCur' },
                    { data: 'HQExtra' },
                    { data: 'BRExtra' },
                    { data: 'AGPay' },
                    { data: 'TaxPay' },
                    { data: 'SSNetAmt' },
                    { data: 'ConvFeeAmt' },
                    { data: 'ProfitAmt' },
                    { data: 'Profit' },
                    { data: 'Status' },
                    { data: 'RRDate' },
                    { data: 'SalesP' }
                ],

                drawCallback: function (settings) {
                    var api = this.api();
                    var rows = api.rows({ page: 'current' }).nodes();
                    var last = null;
                    var totale = new Array();
                    totale['Totale'] = new Array();
                    var groupid = -1;
                    var subtotale = new Array();
                    var Colspan = 0;


                    api.column(groupColumn, { page: 'current' }).data().each(function (group, i) {

                        if (last !== group) {
                            if (i > 0) {
                                groupid++;

                                $(rows).eq(i).before(

                                    // '<tr class="endgroup"><td colspan="' + Colspan + '"></td><td id="tdSNetAmt" colspan="1" style="font-weight:700;color:#000000;font-size: 12px;text-align: right;padding: 7px 5px;">' + "" + '</td><td id="tdHQExtra" colspan="2" style="font-weight:700;color:#000000;font-size: 12px;text-align: right;padding: 7px 5px;">' + "" + '</td><td id="tdBRExtra" style="font-weight:700;color:#000000;font-size: 12px;text-align: right;padding: 7px 5px;">' + "" + '</td><td id="tdAGPay"  style="font-weight:700;color:#000000;font-size: 12px;text-align: right;padding: 7px 5px;">' + "" + '</td><td id="tdTaxPay" style="font-weight:700;color:#000000;font-size: 12px;text-align: right;padding: 7px 5px;">' + "" + '</td><td id="tdSSNetAmt" style="font-weight:700;color:#000000;font-size: 12px;text-align: right;padding: 7px 5px;">' + "" + '</td><td id="tdProfitAmt"  style="font-weight:700;color:#000000;font-size: 12px;text-align: right;padding: 7px 5px;">' + "" + '</td><td id="tdProfit"  style="font-weight:700;color:#000000;font-size: 12px;text-align: right;padding: 7px 5px;">' + "" + '</td><td >' + "" + '</td></tr>',
                                    '<tr class="group"><td colspan="24" style="color:#000000;font-size: 14px;text-align: left;padding: 7px 5px;">' + $scope.GroupingName + ' - ' + group + '</td></tr>'

                                );


                                last = group;
                            }
                            else {
                                groupid++;
                                $(rows).eq(i).before(


                                    '<tr class="group"><td colspan="24" style="color:#000000;font-size: 14px;text-align: left;padding: 7px 5px;">' + $scope.GroupingName + ' - ' + group + '</td></tr>'

                                );



                                last = group;
                            }

                        }





                    });


                },

            });

            var table = $('#ProfitLossReport').DataTable();
            var info = table.page.info();
            $('#ProfitLossReport_info').html(
                'Total Records: ' + ($scope.MainResultlistAfterFilter.length)
            );
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

        SortingSetting();

    }


    //Show cols for Excel and Copy
    function ShowHideExcelColumns() {
        $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,22,24,25,26,27,28];

        if ($scope.LoginMemberType == "2") {
            $scope.ExcelCollist = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 24, 25, 26, 27,28]

            if ($scope.IsShowSupplier != "true") {
                $scope.ExcelCollist = [0, 2, 4, 3, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 24, 25, 26, 27, 28]
            }
        }
        else if ($scope.LoginMemberType == "4") {
            $scope.ExcelCollist = [0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 24, 25, 26, 27, 28]

            if ($scope.IsShowSupplier != "true") {
                $scope.ExcelCollist = [0, 1, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 24, 25, 26, 27, 28]
            }
        }
        
    }

    //On Top ddl change ( //its for top show Functionality)
    $scope.ShowTopDataChange = function () {
        var topvalue = $("#ddltopdata").val();
        switch ($("#ddltopdata").val()) {
            case "10":
                $scope.IsTopShowActive = true;
                break;
            case "15":
                $scope.IsTopShowActive = true;
                break;
            case "25":
                $scope.IsTopShowActive = true;
                break;
            case "50":
                $scope.IsTopShowActive = true;
                break;
            case "0":
                $scope.IsTopShowActive = false;
                break;
        }
        $scope.IsTopShowAValue = topvalue;

        SetDataTable();
        $('select[id="ddltopdata"] option[value="' + $scope.IsTopShowAValue + '"]').attr("selected", "selected");
        $("#ddltopdatawithsort").val($scope.IsTopShowAValue);


        //var oTable = $('#ProfitLossReport').dataTable();
        //oTable.fnLengthChange($('#ddltopdata').val());
        //SetDataTable();
        //$('select[id="ddltopdata"] option[value="' + topvalue + '"]').attr("selected", "selected");




    }
    ///

    //Filter
    //open filter popup 
    $scope.OpenFilterPopup = function (SelectedFilterType) {
        $scope.FilterTypeActive = SelectedFilterType;

        $scope.SetFilterList();
        //for show number filter for number col.
        if (ShowNumberFilterList().includes(SelectedFilterType)) {
            $scope.IsShowNumberFilter = true;
            $scope.NumFilterActive = false;
            if ($scope.FilterDOList.length > 0) {
                $scope.FilterDOList.filter(r => {
                    if (r.Name == $scope.FilterTypeActive && r.Values != "") {
                        if (r.Values.indexOf('~') == -1) {
                            $scope.NumFilterActive = true;
                        }

                    }
                });
            }

        }
        else {
            $scope.IsShowNumberFilter = false;
        }


        var model1 = angular.element(document.querySelector('#filterdiv'));
        model1.modal('show');
    }

    //on Apply btn Click
    $scope.ApplyFilter = function () {

        //Apply_Filter this is comm. fun for all in CommonUtility.js
        $scope.MainResultlistAfterFilter = Apply_Filter($scope.FilterDOList, $scope.FilterTypeActive, $scope.MainResultlist);

        $("#filterdiv").modal('hide');
        SetDataTable();
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
        if (ShowNumberFilterList().includes($scope.FilterTypeActive)) {
            // $scope.ClearNumberFiltervalue();//clear number filter also if popup of numer col
        }
        $("#" + $scope.FilterTypeActive)[0].style.color = "#337ab7";
    }
    ///


    //onHide Popup Click
    $scope.HideColumns = function () {

        //Hide_Columns is comm. fun in CommonUtility.js
        Hide_Columns('ProfitLossReport')

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
        //in commonUtility.js  ( //its for top show Functionality)
        if ($scope.TopDivShow == true) {
            $scope.MainResultlistAfterFilter = TopData_With_Sort($scope.MainResultlistAfterFilter, $scope.SortDetails);
            $('select[id="ddltopdata"] option[value="' + $("#ddltopdatawithsort").val() + '"]').attr("selected", "selected");
            $scope.ShowTopDataChange();
        }

        Apply_Sorting('ProfitLossReport', $scope.SortDetails);


    }
    $scope.ClearSorting = function () {
        $scope.SortDetails = [];
        $scope.SortDetails = Clear_Sorting('ProfitLossReport');
        if ($scope.TopDivShow == true) {
            $scope.MainResultlistAfterFilter = $scope.MainResultlist;//this bcz now first load data as show
            $scope.ShowTopDataChange();
        }
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

    //on tablecol sorting click- also data sort
    $scope.OnColSorting = function (event) {

        var sortcol = event.target.children[0].id;

        //var sortcol = event.target.cellIndex;
        if (event.target.className == 'sorting_asc') {
            var sortorder = 'asc';
        }
        else if ((event.target.className == 'sorting_desc')) {
            sortorder = 'desc'
        }
        if (sortorder == 'asc') {
            $scope.MainResultlistAfterFilter = sortByKeyAsc($scope.MainResultlistAfterFilter, sortcol);
        }
        else if (sortorder == 'desc') {
            $scope.MainResultlistAfterFilter = sortByKeyDesc($scope.MainResultlistAfterFilter, sortcol);
        }

    }
    //////


    ///Number Filter
    //Number Filter set values
    $scope.NumberFilterClick = function () {
        $("#filterdiv").modal('hide');
        $("#Numberfilterdiv").modal('show');

        $scope.MainResultlistAfterFilter = Set_NumberRangeFilterList($scope.FilterDOList, $scope.FilterTypeActive, $scope.MainResultlist, $scope.ReportFilter);

    }

    $("#ddl_Range").change(function () {

        if ($("#ddl_Range").val() != "") {
            $("#Rabgelistdiv")[0].style.display = "block";
        }
        else {
            $("#Rabgelistdiv")[0].style.display = "none";
            Alert.render("Please Select Range Filter Option", "");
            return false;
        }
    });

    $scope.ClearNumberFiltervalue = function () {
        $("#ddl_Range").val("");
        $('#numberrangetext').val("");
        $('#numberrange').val("");


        $("#Rabgelistdiv")[0].style.display = "none";
        $("#Numberfilterdiv").modal('hide');

        // $scope.MainResultlistAfterFilter = Apply_NumberRangeFilter($scope.FilterDOList, $scope.FilterTypeActive, $scope.MainResultlist);   
        // SetDataTable();
    }

    //on Apply Numbert btn Click
    $scope.NumberApplyFilter = function () {
        var Isvalidapply = Apply_NumberRangeFilterValidation();


        if (Isvalidapply == true) {
            $scope.MainResultlistAfterFilter = Apply_NumberRangeFilter($scope.FilterDOList, $scope.FilterTypeActive, $scope.MainResultlist);
            $("#Numberfilterdiv").modal('hide');
            $("#filterdiv").modal('hide');
            SetDataTable();
        }

    }
    ////



   
  
    const groupBy = (array, key) => {
        // Return the end result
        return array.reduce((result, currentValue) => {
            // If an array already present for key, push it to the array. Else create an array and push the object
            (result[currentValue[key]] = result[currentValue[key]] || []).push(
                currentValue
            );
            // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
            return result;
        }, {}); // empty object is the initial value for result object
    };

  

    //summary-3
    $scope.getsummary3 = function () {


        $("#RptDetails")[0].style.display = "none";
        $("#RptSummary")[0].style.display = "block";
        $scope.GetProfitTotal();

    }

    $scope.GetProfitTotal = function () {
        $scope.AmountCurrWise = groupBy($scope.MainResultlistAfterFilter, 'SellCur');

        console.log('Sell Curr wise:');

        console.log($scope.AmountCurrWise);
        $scope.TotalAmountList = [];


        $.each($scope.AmountCurrWise, function (item) {

            var totalsnetinsell = 0;
            var totalSellAmt = 0;
            var totalagpay = 0;
            var totalProfitamt = 0;
            var Bookingcount = 0;


            $.each($scope.AmountCurrWise[item], function (i) {

                Bookingcount = $scope.AmountCurrWise[item].length;
                totalagpay += $scope.AmountCurrWise[item][i].AGPay;

                totalsnetinsell += $scope.AmountCurrWise[item][i].SSNetAmt;
                totalSellAmt += $scope.AmountCurrWise[item][i].SellAmt;

                totalProfitamt += $scope.AmountCurrWise[item][i].ProfitAmt;




            });
            $scope.TotalAmountList.push({
                SellCurrency: item,
                BookingCount: Bookingcount,
                TotalAgPAy: totalagpay.toFixed(2),
                TotalSNetAmtInSell: totalsnetinsell.toFixed(2),
                TotalProfitAmt: totalProfitamt.toFixed(2),
                TotalProfitPer: (totalProfitamt / totalSellAmt * 100).toFixed(2),
            });
        });


        console.log("Profit total:");
        console.log($scope.TotalAmountList);

        $('#ProfitLossReportSummary').DataTable().clear().destroy();
        $('#ProfitLossReportSummary').DataTable({

            dom: 'Bfrtip',

            buttons: [


                {
                    extend: 'excelHtml5',
                    text: '<i class="fa fa-file-excel-o"></i>',
                    filename: function () {
                        var ReportName = "Profit & Loss Report Summary"
                        var RptDetails = $scope.ProfitLossReport.DateFrom + "-" + $scope.ProfitLossReport.DateTo;
                        return ReportName + ' ( ' + RptDetails + ' ) '
                    },
                    sheetName: 'Profit&LossRptSummarySheet',
                    title: null

                },
                {
                    extend: 'copyHtml5',
                    text: '<i class="fa fa-files-o"></i>',
                    titleAttr: 'Copy'
                },

                {
                    text: '<span class="cust-dt-button">Report View</span>',
                    titleAttr: 'Report View',
                    action: function (e, dt, node, config) {

                        $scope.backtoreport();

                    }
                }

            ],

            "columnDefs": [

                {
                    "targets": 1,
                    "className": "text-right",


                },
                {
                    "targets": 2,
                    "className": "text-right",


                },
                {
                    "targets": 3,
                    "className": "text-right",


                },
                {
                    "targets": 4,
                    "className": "text-right",


                },
              
               
            ],

            searching: false,
            paging: false,
            data: $scope.TotalAmountList,
            "pageLength": 30,
            "deferRender": true,
            select: true,
            columns: [
                { data: 'SellCurrency' },
                { data: 'TotalAgPAy' },                
                { data: 'TotalSNetAmtInSell' },             
                { data: 'TotalProfitAmt' },
                { data: 'TotalProfitPer' },



            ],
        });


    }


    $scope.backtoreport = function () {
        $("#RptDetails")[0].style.display = "block";
        $("#RptSummary")[0].style.display = "none";
    }
  

}]);




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
    if (GetE("hdnLoginMemberTypeId").value != "2") {
        HideColList.push("1~BrName~Branch Name");
    }
    if (GetE("hdnLoginMemberTypeId").value != "4") {
        HideColList.push("2~AgName~WS / Ag Name");
        HideColList.push("3~AgCity~WS / Ag City");
        HideColList.push("4~AgCountry~WS / Ag Country");
    }

    if (GetE("hdnIsShowSupplier").value == "true") {
        HideColList.push("5~SuppName~Supplier Name");
    }
    HideColList.push("6~SName~Service Name");
    HideColList.push("7~SType~Service");
    HideColList.push("8~SCity~Service City");
    HideColList.push("9~SCountry~Service Country");
   
    HideColList.push("10~BookedBy~Booked By");
    HideColList.push("11~BType~Source");
  
    HideColList.push("12~BDate~Book Date");
    HideColList.push("13~ChkIn~Check In Date");
    HideColList.push("14~Nts~Nights");

    HideColList.push("15~NetCur~Net Currency");
    HideColList.push("16~SNetAmt~Net Amt");
    HideColList.push("17~SellCur~Sell Currency");
    HideColList.push("18~HQExtra~HQ Extra Quoted");
    HideColList.push("19~BRExtra~BR Extra Quoted");
    HideColList.push("20~AGPay~WS / Ag Payable");
    HideColList.push("21~TaxPay~Tax");
    HideColList.push("22~SSNetAmt~Net (Sell Currency)");

   // HideColList.push("23~ConvFeeAmt~Convenience Fee");
    HideColList.push("24~ProfitAmt~Profit Amount");
    HideColList.push("25~Profit~Profit (%)");

    HideColList.push("26~Status~Status");
    HideColList.push("27~RRDate~RR Date");
    HideColList.push("28~SalesP~Sales Person");


    if (GroupBy != "") {
        var NewHideColList = [];
        switch (GroupBy) {
            case '1':
                NewHideColList = removeElementsfromhidelist(HideColList, '1~BrName~Branch Name');
                break;
            case '2':
                NewHideColList = removeElementsfromhidelist(HideColList, '2~AgName~WS / Ag Name');
                break;
            case '5':
                NewHideColList = removeElementsfromhidelist(HideColList, '5~SuppName~Supplier Name');
                break;
            case '7':
                NewHideColList = removeElementsfromhidelist(HideColList, '7~SType~Service');
                break;
            case '26':
                NewHideColList = removeElementsfromhidelist(HideColList, '26~Status~Status');
                break;
        }

    }
    NewHideColList = HideColList;


    return NewHideColList;


}


function ShowNumberFilterList() {
    var NumberFilterColList = ['Nts', 'SNetAmt', 'HQExtra', 'BRExtra', 'AGPay', 'TaxPay', 'SSNetAmt', 'ProfitAmt', 'Profit'];

    return NumberFilterColList;

}

$(document).ready(function () {

    $("#PLReport").addClass("active");
    $(".date-cal").datepicker({ dateFormat: 'dd M yy', numberOfMonths: 2, });




    var table = $('#ProfitLossReport').dataTable();
    //for sorting icon clear custom sorting list
    table.on('click', 'th', function () {
        // var info = table.fnSettings().aaSorting;
        // var idx = info[0][0];
        //alert(idx);
        //alert($(this).attr('class'));

        if ($(this).attr('class') == 'sorting_asc' || $(this).attr('class') == 'sorting_desc' || $(this).attr('class') == 'sorting') {
            var scope = angular.element(document.getElementById("MainWrap")).scope();
            // var colid =  $(this)[0].children[0].id;
            // var order= 'asc'
            scope.$apply(function () {
                //$(this)[0].children[0].id
                //$(this)[0].cellIndex

                scope.ClearPopupSoting();
                scope.OnColSorting(event)
            })
            return;
        }


    });

    //for enable sorting on filter icon
    var $select = $('.filter-icon').on('click', function (e) {
        //console.log(" click on select in column =");
        e.stopPropagation();
    });


    $(document).on('change', '#ddltopdata', function () {
        //alert('Change Happened');
        var scope = angular.element(document.getElementById("MainWrap")).scope();
        scope.$apply(function () {
            scope.ShowTopDataChange();
        })
        return;

        //var oTable = $('#ProfitLossReport').dataTable();
        //oTable.fnLengthChange($('#ddltopdata').val());    
        //$('select[id="ddltopdata"] option[value="' + topvalue + '"]').attr("selected", "selected");



    });





});








