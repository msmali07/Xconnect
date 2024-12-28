var app = angular.module('ProdRptApp', ['angucomplete-alt']);
var bid = ""; var brtypeid = ""; var mid = ""; var mrtypeid = ""; var bid = ""; var Wsid = ""; var membertypeid = "";
var isvalid = true;
app.controller('ProdRptCntr', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    NgInit();
    function NgInit() {
        $scope.ProdRpt1 = ProdtivityReportDO();
        $scope.ProdReportFilter = ProdReportFilterDO();
        $scope.PostBooking = PostBookingDO();

        $scope.IsShowSupplier = GetE("hdnIsShowSupplier").value;
        $scope.LoginMemberType = GetE("hdnLoginMemberTypeId").value;
        $scope.ModifySearch = true;
        $scope._IsHidePostBooking = false;
        $scope.MemberDetails = "";
        $scope.GroupingName = "";
        $scope.ccode = $("#hdncompcode1").val();
        $scope.SortDetails = [];
        $scope.SortDetails.push(SortDetailDO());
        $scope.SortColNo = [];
        $scope.MainResultlistAfterFilter = [];
        $scope.ShowddlFilterList = [];
        $scope.FilterDOList = [];
        $scope.FilterTypeActive = "";
        $scope.selectedArray = "";
        $scope.OldSelectedfilterArrayValues = "";
        ShowHideExcelColumns();
        SortingSetting();
        LoadSupplierList();
        $scope.serachcounter = 0;
        $("#ddl_BR option:selected").text("All Branch");
        //   $("#ddl_WS option:selected").text("All Wholesaler");
        $("#ddl_AG option:selected").text("All Agent");
        $scope.ProdRpt1.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
        $scope.ProdRpt1.DateTo = ConvertCustomrangedate(new Date());
        //this is PostBooking Init()
        $scope.PostBooking = PostBooking_Init($scope.PostBooking, $scope.LoginMemberType)
        //this is On Post Booking change events
        $rootScope.$on("CallPostBooking", function (event) {
            $scope.PostBooking = Set_PostMemberDetails(event, $scope.PostBooking);
        });
        $("#demo").addClass("collapse in");
    }
    Customdaterangelist = Customdaterangelist();
    $scope.DateRangeList = Customdaterangelist;
    $("#ddl_CustomDateRange").change(function () {
        $scope.CustomDateRangeFilter = $("#ddl_CustomDateRange").val();

        if ($scope.CustomDateRangeFilter != "" && $scope.CustomDateRangeFilter != "0") {
            GetE("txtFromDate").value = $scope.CustomDateRangeFilter.split("~")[0];
            $scope.ProdRpt1.DateFrom = $scope.CustomDateRangeFilter.split("~")[0];
            GetE("txtToDate").value = $scope.CustomDateRangeFilter.split("~")[1];
            $scope.ProdRpt1.DateTo = $scope.CustomDateRangeFilter.split("~")[1];
        }
        else {
            GetE("txtFromDate").value = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            $scope.ProdRpt1.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            GetE("txtToDate").value = ConvertCustomrangedate(new Date());
            $scope.ProdRpt1.DateTo = ConvertCustomrangedate(new Date());
        }

    });

    $scope.ShowModifyBtn = function () {
        $scope.ModifySearch = false;
    }

    //Modify Button for
    $scope.ShowModifyClick = function () {     
        $("#Noresultdiv")[0].style.display = "none";
        $("#Errordiv")[0].style.display = "none";
    }

    //var code = $("#hdncompcode1").val();
    //validation and setparam on serach click
    $scope.SearchReportClick = function () {
        var isvalid = true;
        $scope.OnlyClearAll();
        $("#RptDetails")[0].style.display = "none";
        $("#RptHeaderDetails")[0].style.display = "none";
        $("#Noresultdiv")[0].style.display = "none";
        PopUpController.ClosePopup("divPopup", "");
        $("#HeaderSearchdiv").removeClass();
        $("#HeaderSearchdiv").addClass("col-lg-12 col-md-12 col-sm-12 col-xs-12 container-fluid padd-lft10 padd-rgt10");
        $scope.ModifySearch = false;
        if ($scope.ProdRpt1.DateFrom == "") {

            Alert.render("Please Select Arrival-From Date", "txtFromDate");
            isvalid = false;
            return false;
        }
        if ($scope.ProdRpt1.DateTo == "") {
            Alert.render("Please Select Arrival-To Date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ($scope.ProdRpt1.DateFrom != "" && $scope.ProdRpt1.DateTo != "") {
            var dtObj1 = GetSystemDate($scope.ProdRpt1.DateFrom);
            var dtObj2 = GetSystemDate($scope.ProdRpt1.DateTo);
        }
        if (($scope.ProdRpt1.DateFrom != "" && $scope.ProdRpt1.DateTo != "") && (dtObj1 > dtObj2)) {
            Alert.render("Arrival-From date can not be greater than Arrival-To date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ((diffDate(new Date($scope.ProdRpt1.DateTo), new Date($scope.ProdRpt1.DateFrom))) > 12.50) {
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
            $scope.ProdRpt1.BookingdateWise = false;
        }
        if (document.getElementById('BDW').checked) {
            $scope.ProdRpt1.BookingdateWise = true;
        }
        $scope.MemberDetails = $scope.PostBooking.Br_Id + "_" + $scope.PostBooking.Ws_Id + "_" + $scope.PostBooking.Ag_Id + "_" + $scope.PostBooking.ReportCompanyName + "_" + GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text;
        $scope.ProdRpt1.MemberId = $scope.PostBooking.PostMemberId;
        $scope.ProdRpt1.LoginUserId = (document.getElementById("hdnLoginUserId")).value;
        $scope.ProdRpt1.BookingType = $("#ddl_BookingType").val();
        $scope.ProdRpt1.SupplierId = $("#ddl_Supplier").val();
        $scope.ProdRpt1.CityId = $("#hdncityid").val();
        $scope.ProdRpt1.CountryId = $("#hdncountryid").val();      
        $scope.ProdRpt1.BookingStatus = $("#ddl_BookingStatus").val();
        if (isvalid == true) {
            $scope.GetReportDetails();
        }
    }
    //getReportDetails on serach click
    $scope.GetReportDetails = function () {
        var popupdetail = $scope.PostBooking.ReportCompanyName + "~" + $scope.ProdRpt1.DateFrom + "~" + $scope.ProdRpt1.DateTo;
        PopUpController.OpenPopup1("divPopup", "Country City Productivity Report", popupdetail);
        $scope.ProdReportFilter.BookRefNo = $scope.FilterDOList.filter(item => item.Name == 'bRefNo').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'bRefNo')[0].Values) : "";
        $scope.ProdReportFilter.Bookdate = $scope.FilterDOList.filter(item => item.Name == 'BookDt').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'BookDt')[0].Values) : "";
        $scope.ProdReportFilter.CkinDt = $scope.FilterDOList.filter(item => item.Name == 'CkInDt').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'CkInDt')[0].Values) : "";
        $scope.ProdReportFilter.CkOutDt = $scope.FilterDOList.filter(item => item.Name == 'CkOutDt').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'CkOutDt')[0].Values) : "";
        $scope.ProdReportFilter.SellAmt = $scope.FilterDOList.filter(item => item.Name == 'SellAmt').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'SellAmt')[0].Values) : "";
        $scope.ProdReportFilter.SellCcy = $scope.FilterDOList.filter(item => item.Name == 'SellCcy').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'SellCcy')[0].Values) : "";
        $scope.ProdReportFilter.Agency = $scope.FilterDOList.filter(item => item.Name == 'Agency').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'Agency')[0].Values) : "";
        $scope.ProdReportFilter.Country = $scope.FilterDOList.filter(item => item.Name == 'Country').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'Country')[0].Values) : "";
        $scope.ProdReportFilter.City = $scope.FilterDOList.filter(item => item.Name == 'City').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'City')[0].Values) : "";
        $scope.ProdReportFilter.ServiceTyp = $scope.FilterDOList.filter(item => item.Name == 'ServiceTyp').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'ServiceTyp')[0].Values) : "";
        $scope.ProdReportFilter.nNTS = $scope.FilterDOList.filter(item => item.Name == 'nNTS').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'nNTS')[0].Values) : "";
        $scope.ProdReportFilter.nRooms = $scope.FilterDOList.filter(item => item.Name == 'nRooms').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'nRooms')[0].Values) : "";
        $scope.ProdReportFilter.nPax = $scope.FilterDOList.filter(item => item.Name == 'nPax').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'nPax')[0].Values) : "";
        $scope.ProdReportFilter.bStatus = $scope.FilterDOList.filter(item => item.Name == 'bStatus').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'bStatus')[0].Values) : "";
        $scope.ProdReportFilter.bSource = $scope.FilterDOList.filter(item => item.Name == 'bSource').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'bSource')[0].Values) : "";
        if ($scope.ccode == 1) {
            $scope.ProdReportFilter.BrCode = $scope.FilterDOList.filter(item => item.Name == 'BrCode').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'BrCode')[0].Values) : "";
        }
        $scope.ProdReportFilter.Service = $scope.FilterDOList.filter(item => item.Name == 'Service').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'Service')[0].Values) : "";
        $scope.ProdReportFilter.StarCat = $scope.FilterDOList.filter(item => item.Name == 'StarCat').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'StarCat')[0].Values) : "";
        $scope.ProdReportFilter.SuppName = $scope.FilterDOList.filter(item => item.Name == 'SuppName').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'SuppName')[0].Values) : "";


        $scope.ProdReportFilter.CustomDateOption = $("#ddl_CustomDateRange").val();;
        $("#demo").addClass("collapse in");
        $http({
            method: "post",
            url: "../Production/GetProductivityReport",
            data: ({
                productivityReportDO: $scope.ProdRpt1,
            }),
            dataType: "json",
            headers: { "Content-Type": "application/json" }
        }).then(function (d) {
            if (d.data != undefined || d.data != null) {
                if (d.data.length > 0) {
                    $scope.MainResultlist = (d.data);
                    $scope.MainResultlistAfterFilter = (d.data);
                    $scope.MainResultlist = $scope.MainResultlist.map(
                        item => {
                            item["ServiceTyp"] = GetBookingServiceNameDirective(item["ServiceTyp"]);
                            item["bStatus"] = GetBookDisplayStatusDirective(item["bStatus"]);
                            return item;
                        }
                    );
                    $scope.MainResultlistAfterFilter = $scope.MainResultlistAfterFilter.map(
                        item => {
                            item["ServiceTyp"] = GetBookingServiceNameDirective(item["ServiceTyp"]);
                            item["bStatus"] = GetBookDisplayStatusDirective(item["bStatus"]);
                            return item;
                        }
                    );
                    console.log($scope.MainResultlistAfterFilter.length);
                    $scope.serachcounter++;
                    if ($scope.serachcounter == 1) {
                        $scope.filter = false;
                    }
                    else {
                        $scope.filter = true;
                    }
                    SetDataTable();
                    $scope.ModifySearch = false;
                    $("#RptDetails")[0].style.display = "block";
                    $("#RptHeaderDetails")[0].style.display = "block";
                    PopUpController.ClosePopup("divPopup", "");
                }
                else {
                    $scope.serachcounter++;
                    if ($scope.serachcounter == 1) {
                        $scope.filter = false;
                    }
                    else {
                        $scope.filter = true;
                    }
                    $scope.ModifySearch = false;
                    $("#Noresultdiv")[0].style.display = "block";
                    $("#RptHeaderDetails")[0].style.display = "block";
                    PopUpController.ClosePopup("divPopup", "");
                }
            }
            else {
                $scope.serachcounter++;
                if ($scope.serachcounter == 1) {
                    $scope.filter = false;
                }
                else {
                    $scope.filter = true;
                }
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
    function SetDataTable() {
        //For Ottila Client Colums
        var Gname = $("#ddl_Grp").val().split('~')[2];
        var groupColumn = $scope.ProdReportFilter.GroupBy.split('~')[0];      
            if ($scope.ProdReportFilter.GroupBy == "") {
                $('#ProductivityRpt').DataTable().clear().destroy();
                $('#ProductivityRpt').DataTable({
                    "order": [],
                    dom: 'Bfrtip',
                    buttons: [
                        {
                            extend: 'excelHtml5',
                            text: '<i class="fa fa-file-excel-o"></i>',
                            filename: function () {
                                var ReportName = "Country City Productivity Report"
                                var RptDetails = $scope.ProdRpt1.DateFrom + "-" + $scope.ProdRpt1.DateTo;
                                return ReportName + ' ( ' + RptDetails + ' ) '
                            },
                            sheetName: 'CCProdRptSheet',
                            title: null,
                            titleAttr: 'Export to Excel',
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

                    ],
                    "autoWidth": false,
                    "columnDefs": [
                        {
                            "visible": false,
                            orderable: false,
                        },
                        {
                            "targets": 0,
                            "className": "text-left",
                            orderable: false,
                        },
                        {
                            "targets": 1,
                            "className": "text-left",

                        },
                        {
                            "targets": 2,
                            "className": "text-left",
                            orderable: false,
                        },
                        {
                            "targets": 3,
                            "className": "text-left",
                            orderable: false,
                        },
                        {
                            "targets": 4,
                            "className": "text-left",
                            orderable: false,
                        },
                        {
                            "targets": 5,
                            "className": "text-left",
                            orderable: false,

                        },
                        {
                            "targets": 6,
                            "className": "text-left",
                            orderable: false,
                        },
                        {
                            "targets": 7,
                            "className": "text-left",
                            orderable: false,
                        },
                        {
                            "targets": 8,
                            "className": "text-center",
                            orderable: false,
                        },

                        {
                            "targets": 9,
                            "className": "text-left",
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
                            "targets": 13,
                            "className": "text-left",
                            orderable: false,
                        },
                        {
                            "targets": 14,
                            "className": "text-right",
                            orderable: false,
                        },
                        {
                            "targets": 15,
                            "className": "text-center",
                            orderable: false,
                        },
                        {
                            "targets": 16,
                            "className": "text-left",
                            orderable: false,
                        },
                        {
                            "targets": 17,
                            "className": "text-right",
                        },
                        {
                            "targets": 18,
                            "className": "text-right",
                            orderable: false,
                            "visible": $scope.ccode != 1 ? false : true
                        },
                    ],
                    searching: false,
                    paging: true,
                    data: $scope.MainResultlistAfterFilter,
                    "pageLength": 30,
                    "deferRender": true,
                    select: true,
                    autoWidth: false,
                    columns: [
                        { data: 'bRefNo' },
                        { data: 'BookDt' },
                        { data: 'CkInDt' },
                        { data: 'CkOutDt' },
                        { data: 'Service' },
                        { data: 'ServiceTyp' },
                        { data: 'Country' },
                        { data: 'City' },
                        { data: 'nNTS' },
                        { data: 'Agency' },
                        { data: 'nRooms' },
                        { data: 'nPax' },
                        { data: 'bSource' },
                        { data: 'SuppName' },
                        { data: 'SellAmt' },
                        { data: 'SellCcy' },
                        { data: 'bStatus' },
                        { data: 'StarCat' },
                        { data: 'BrCode' }
                    ],
                });
            }
            else {               
                //var Gname = $("#ddl_Grp").val().split('~')[2];
                $('#ProductivityRpt').DataTable().clear().destroy();
                $scope.collapsedGroups = {};
                var top = '';
                var parent = '';
                var groupColumn = $scope.ProdReportFilter.GroupBy.split('~')[0];
                $('#ProductivityRpt').DataTable({
                    "order": [],
                    dom: 'Bfrtip',
                    buttons: [
                        {
                            extend: 'excelHtml5',
                            text: '<i class="fa fa-file-excel-o"></i>',
                            filename: function () {
                                var ReportName = "Country City Productivity Report"
                                var RptDetails = $scope.ProdRpt1.DateFrom + "-" + $scope.ProdRpt1.DateTo;
                                return ReportName + ' ( ' + RptDetails + ' ) '
                            },
                            sheetName: 'CCProdRptSheet',
                            title: null,
                            titleAttr: 'Export to Excel',
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
                            text: '<button id="btncollase" class="cust-dt-button2">collapse All</button>',
                            titleAttr: 'collapse All',
                            action: function (e, dt, node, config) {
                                $scope.filter = true;
                                $scope.Expand = false;
                                CollapsedAll();
                                SetDataTable();
                                $("#btncollase").attr("disabled", "disabled");
                                $("#btnExpand").removeAttr("disabled");
                            }
                        },
                        {
                            text: '<button  id="btnExpand" class="cust-dt-button2">Expand All</button>',
                            titleAttr: 'Expand All',
                            action: function (e, dt, node, config) {
                                $scope.filter = true;
                                $scope.Expand = true;
                                ExpandAll();
                                $("#btnExpand").attr("disabled", "disabled");
                                $("#btncollase").removeAttr("disabled");
                            }
                        }
                    ],
                    "autoWidth": false,
                    "columnDefs": [
                        {
                            "visible": false,
                            orderable: false,
                        },
                        {
                            "targets": 0,
                            "className": "text-left",
                            orderable: false,
                        },
                        {
                            "targets": 1,
                            "className": "text-left",

                        },
                        {
                            "targets": 2,
                            "className": "text-left",
                            orderable: false,
                        },
                        {
                            "targets": 3,
                            "className": "text-left",
                            orderable: false,
                        },
                        {
                            "targets": 4,
                            "className": "text-left",
                            orderable: false,
                        },
                        {
                            "targets": 5,
                            "className": "text-left",
                            orderable: false,
                            "visible":   $scope.ProdReportFilter.GroupBy != 5 ? true : false

                        },
                        {
                            "targets": 6,
                            "className": "text-left",
                            orderable: false,
                            "visible" : $scope.ProdReportFilter.GroupBy != 6 ? true : false,
                        },
                       
                        {
                            "targets": 7,
                            "className": "text-left",
                            orderable: false,
                            "visible": $scope.ProdReportFilter.GroupBy  != 7 ? true : false,
                        },
                        {
                            "targets": 8,
                            "className": "text-center",
                            orderable: false,
                        },

                        {
                            "targets": 9,
                            "className": "text-left",
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
                            "targets": 13,
                            "className": "text-left",
                            orderable: false,
                            visible:  $scope.ProdReportFilter.GroupBy != 13 ? true : false
                        },
                        {
                            "targets": 14,
                            "className": "text-right",
                            orderable: false,
                        },
                        {
                            "targets": 15,
                            "className": "text-center",
                            orderable: false,
                        },
                        {
                            "targets": 16,
                            "className": "text-left",
                            orderable: false,
                        },
                        {
                            "targets": 17,
                            "className": "text-right",
                        },
                        {
                            "targets": 18,
                            "className": "text-right",
                            orderable: false,
                            "visible": $scope.ccode != 1 ? false : true 
                        },
                    ],
                    searching: false,
                    paging: false,
                    data: $scope.MainResultlistAfterFilter,
                    "pageLength": 30,
                    select: true,
                    autoWidth: false,
                    ordering: true,
                    order: [groupColumn],
                    "orderFixed": [groupColumn],
                    columns: [
                        { data: 'bRefNo' },
                        { data: 'BookDt' },
                        { data: 'CkInDt' },
                        { data: 'CkOutDt' },
                        { data: 'Service' },
                        { data: 'ServiceTyp' },
                        { data: 'Country' },
                        { data: 'City' },
                        { data: 'nNTS' },
                        { data: 'Agency' },
                        { data: 'nRooms' },
                        { data: 'nPax' },
                        { data: 'bSource' },
                        { data: 'SuppName' },
                        { data: 'SellAmt' },
                        { data: 'SellCcy' },
                        { data: 'bStatus' },
                        { data: 'StarCat' },
                        { data: 'BrCode' }
                    ],
                    rowGroup: {
                        dataSrc: [Gname],
                        startRender: function (rows, group, level) {
                            var all;
                            if (level === 0) {
                                top = group;
                                all = group;
                                middle = '';
                            }
                            else {
                                // if parent collapsed, nothing to do-- Agency
                                if (!!$scope.collapsedGroups[top]) {
                                    return;
                                }
                                if (level === 1) {
                                    middle = group
                                }
                                all = top + middle + group;
                            }
                            var collapsed = !!$scope.collapsedGroups[all];
                            rows.nodes().each(function (r) {
                                if ($scope.Expand == true) {
                                    r.style.display = collapsed ? 'none' : '';
                                }
                                else {
                                    if (level === 0) {
                                        r.style.display = collapsed ? 'none' : '';
                                    }
                                    else {
                                        r.style.display = collapsed ? '' : 'none';
                                    }
                                }
                            });
                            if ($scope.Expand == true) {
                                var toggleClass = collapsed ? 'fa-plus-square' : 'fa-minus-square';
                            }
                            else {
                                if (level === 0) {
                                    var toggleClass = collapsed ? 'fa-plus-square' : 'fa-minus-square';
                                }
                                else {
                                    var toggleClass = collapsed ? 'fa-minus-square' : 'fa-plus-square';
                                    $('.whitebg').css('width', 'auto');
                                }
                            }
                            if ($scope.ProdReportFilter.GroupBy == 7) {
                                
                                return $('<tr/>')
                                    .append('<td colspan="22"> ' + '<span  class="fa fa-fw ' + toggleClass + ' toggler"/><span style="width: 34% !important;">City : ' + group + ' </span><span style="margin-left:10px;font-weight: normal;">       Total Bookings : (' + rows.count() + ')' + '</span></td>')
                                    .attr('data-name', all)
                                    .toggleClass('collapsed', collapsed);
                             
                            }
                            else if ($scope.ProdReportFilter.GroupBy == 6 ) {
                                return $('<tr/>')
                                    .append('<td colspan="22"> ' + '<span  class="fa fa-fw ' + toggleClass + ' toggler"/><span style="width: 34% !important;">Country : ' + group + ' </span><span style="margin-left:10px;font-weight: normal;">       Total Bookings : (' + rows.count() + ')' + '</span></td>')
                                    .attr('data-name', all)
                                    .toggleClass('collapsed', collapsed);
                            }
                            else if ($scope.ProdReportFilter.GroupBy == 13) {
                                return $('<tr/>')
                                    .append('<td colspan="22"> ' + '<span  class="fa fa-fw ' + toggleClass + ' toggler"/><span style="width: 34% !important;">Supplier : ' + group + ' </span><span style="margin-left:10px;font-weight: normal;">      Total Bookings : (' + rows.count() + ')' + '</span></td>')
                                    .attr('data-name', all)
                                    .toggleClass('collapsed', collapsed);
                            }
                            else if ($scope.ProdReportFilter.GroupBy == 5 ) {
                                return $('<tr/>')
                                    .append('<td colspan="22"> ' + '<span  class="fa fa-fw ' + toggleClass + ' toggler"/><span style="width: 34% !important;">Service : ' + group + ' </span><span style="margin-left:10px;font-weight: normal;">      Total Bookings : (' + rows.count() + ')' + '</span></td>')
                                    .attr('data-name', all)
                                    .toggleClass('collapsed', collapsed);
                            }
                        },
                    },
                    initComplete: function () {
                        // Start with closed groups
                        $('#ProductivityRpt tbody tr.dtrg-start').each(function () {
                            var name = $(this).data('name');
                            $scope.collapsedGroups[name] = !$scope.collapsedGroups[name];

                        });
                        $('#ProductivityRpt').DataTable().draw(false);
                    },
                   
                });
                if ($scope.filter != true) {
                    $('#ProductivityRpt tbody').on('click', 'tr.dtrg-start', function () {
                        var name = $(this).data('name');
                        $scope.collapsedGroups[name] = !$scope.collapsedGroups[name];
                        $('#ProductivityRpt').DataTable().draw(false);
                        $("#btncollase").removeAttr("disabled");
                        $("#btnExpand").removeAttr("disabled");
                        console.log($scope.collapsedGroups);
                    });

                }
            }       
        $scope.HideColList = [];
        $scope.HideColList = GetHideColList($scope.ProdReportFilter.GroupBy);
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
    function CollapsedAll() {
        $('#ProductivityRpt tbody tr.dtrg-start').each(function () {
            var name = $(this).data('name');
            $scope.collapsedGroups[name] = !$scope.collapsedGroups[name];
        });
        $('#ProductivityRpt').DataTable().draw(false);
    }

    function ExpandAll() {
        $('#ProductivityRpt tbody tr.dtrg-start').each(function () {
            var name = $(this).data('name');
            $scope.collapsedGroups = {};
        });
        $('#ProductivityRpt').DataTable().draw(false);
    }

    function GetHideColList(GroupBy) {
        var HideColList = [];        
            HideColList.push("0~bRefNo~Book Ref No");
            HideColList.push("1~BookDt~Book Date");
            HideColList.push("2~CkInDt~Check In Date");
            HideColList.push("3~CkOutDt~Check Out Date");
            HideColList.push("4~Service~Service");
            HideColList.push("5~ServiceTyp~Service Type");
            HideColList.push("6~Country~Agency Country");
            HideColList.push("7~City~Agency City");
            HideColList.push("8~nNTS~No Of NTS");
            HideColList.push("9~Agency~Agency Name");
            HideColList.push("10~nRooms~No Of Rooms");
            HideColList.push("11~nPax~No Of Pax");
            HideColList.push("12~bSource~Booking Source");
            HideColList.push("13~SuppName~Supplier Name");
            HideColList.push("14~SellAmt~Sell Amount");
            HideColList.push("15~SellCcy~Sell Currency");
            HideColList.push("16~bStatus~Status");
            HideColList.push("17~StarCat~Star Catagory");
            if ($scope.ccode == 1) {
                HideColList.push("18~BrCode~Branch Code");
            }
            NewHideColList = HideColList;       
        return NewHideColList;
    }
    function ShowHideExcelColumns() {       
            $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
            if ($scope.LoginMemberType == "1" || $scope.ccode == 1) {
                $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11, 12, 13, 14, 15, 16, 17, 18]
                if ($scope.IsShowSupplier != "true") {
                    $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6, 7,8, 9, 10,11, 12, 14, 15, 16, 17, 18]
                }
            }
            else {
                $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
                if ($scope.IsShowSupplier != "true") {
                    $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17]
                }
            }
    }
    //select grouping option
    $("#ddl_Grp").change(function () {
        $scope.ProdReportFilter.GroupBy = $("#ddl_Grp").val().split('~')[0];
        $scope.GroupingName = $("#ddl_Grp").val().split('~')[1];
    });
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
        $scope.ModifySearch = false;
        $("#RptDetails")[0].style.display = "block";
        $("#RptHeaderDetails")[0].style.display = "block";
        PopUpController.ClosePopup("divPopup", "");
    }
    //set filterlist in ddllist in popup
    $scope.SetFilterList = function () {
        //Set_FilterList this is comm. fun for all in CommonUtility.js
        $scope.MainResultlistAfterFilter = Set_FilterList($scope.FilterDOList, $scope.FilterTypeActive, $scope.MainResultlist, $scope.ProdReportFilter);
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
    //onHide Popup Click
    $scope.HideColumns = function () {

        //Hide_Columns is comm. fun in CommonUtility.js
        Hide_Columns('ProductivityRpt')

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
    function SortingSetting() {

        $scope.SortColList = [];
        $scope.SortColList = GetHideColList($scope.ProdRpt1.GroupBy);

    }
    $scope.ApplySorting = function () {
        //in commonUtility.js 
        Apply_Sorting('ProductivityRpt', $scope.SortDetails)

    }
    $scope.ClearSorting = function () {
        $scope.SortDetails = [];
        $scope.SortDetails = Clear_Sorting('ProductivityRpt');
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
    $("#btnExportExcel").on("click", function () {
        var table = $('#ProductivityRpt1').DataTable({
            data: $scope.MainResultlistAfterFilter,
            buttons: true
        });
        buttons: [
            {
                extend: 'excelHtml5',
            }
        ]
        table.button('.buttons-excel').trigger();
    });
    function LoadSupplierList() {
        $scope.Supplierlist = [];
        $http.get("../CommonData/GetSuppiler").then(function (d) {
            $scope.Supplierlist = d.data;

        }, function (error) {
        })
    }

    //City 
    var Cdata = CityList();

    $scope.allcites = Cdata;
    $scope.cities = $scope.allcites.slice(0, 150);
    $scope.OnKeyUpCity = function (text) {
        var i = angular.element('#txtautocomplete_value');
        var str = i[0].value;
        var solution1 = [];

        if (str.length >= 1) {
            $scope.cities = [];
            $scope.all = [];
            $scope.all = $scope.allcites;
            var matches = [];
            $scope.all.filter(v => {

                if (v.display.toLowerCase().indexOf(str.toString().toLowerCase()) !== -1) {
                    var matchindex = v.display.toLowerCase().indexOf(str.toString().toLowerCase());
                    return solution1.push({
                        "display": v.display, "value": v.value, "currency": v.currency, "match": matchindex
                    });
                }
            })

            sortByKeyAsc(solution1, 'match');
            $scope.cities = solution1.splice(0, 100);

        }
    }
    $("#txtautocomplete").change(function () {
        var j = angular.element('#txtautocomplete_value');
        var str = j[0].value;
        if (str == "") {

            // $scope.cities = $scope.cities;
            cityid = "";
            document.getElementById("hdncityid").value = "";
            $scope.SelectedCityCountry = "";
            $scope.allcites = Cdata;
            $scope.cities = $scope.allcites.slice(0, 150);

        }
    });
    $scope.AfterSelectedCity = function (selected) {

        if (selected != undefined) {
            $scope.SelectedCityCountry = selected.originalObject;
            var cityid = $scope.SelectedCityCountry.value;
            $("#hdncityid").val(cityid);
            $scope.ProdRpt1.CityId = cityid;

            //$scope.cities = $scope.cities.filter(c => {
            //    return c.major == 1;
            //});


        }
        else {
            $scope.cities = $scope.cities;
            cityid = "";
            document.getElementById("hdncityid").value = "";
            $scope.SelectedCityCountry = "";
        }
    }

    //Country
    var Countrydata = CountryList();
    $scope.allcountries = Countrydata;
    $scope.countries = $scope.allcountries.slice(0, 150);
    $scope.OnKeyUpCountry = function (text) {
        var i = angular.element('#txtautocompletecountry_value');
        var str = i[0].value;
        var solution2 = [];

        if (str.length >= 1) {
            $scope.countries = [];
            $scope.countriesall = [];
            $scope.countriesall = $scope.allcountries;
            var matches = [];
            $scope.countriesall.filter(v => {

                if (v.display.toLowerCase().indexOf(str.toString().toLowerCase()) !== -1) {
                    var matchindex = v.display.toLowerCase().indexOf(str.toString().toLowerCase());
                    return solution2.push({
                        "display": v.display, "value": v.value, "match": matchindex
                    });
                }
            })

            sortByKeyAsc(solution2, 'match');
            $scope.countries = solution2.splice(0, 100);

        }
    }
    $("#txtautocompletecountry").change(function () {
        var j = angular.element('#txtautocompletecountry_value');
        var str = j[0].value;
        if (str == "") {

            $scope.countries = $scope.countries;
            countryid = "";
            document.getElementById("hdncountryid").value = "";
            $scope.SelectedCountry = "";

        }
    });
    $scope.AfterSelectedCountry = function (selected) {

        if (selected != undefined) {
            $scope.SelectedCountry = selected.originalObject;
            var countryid = $scope.SelectedCountry.value;
            $("#hdncountryid").val(countryid);
            $scope.ProdRpt1.CountryId = countryid;

        }
        else {
            $scope.countries = $scope.countries;
            countryid = "";
            document.getElementById("hdncountryid").value = "";
            $scope.SelectedCountry = "";
        }
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

$(document).ready(function () {

    $("#BookingReport").addClass("active");
    $(".date-cal").datepicker({ dateFormat: 'dd M yy', numberOfMonths: 2, });
    var table = $('#ProductivityRpt').dataTable();
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
    });

   
});