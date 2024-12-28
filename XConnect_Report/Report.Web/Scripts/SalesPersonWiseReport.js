var app = angular.module('SalesPersonWisereportapp', []);


var bid = ""; var brtypeid = ""; var mid = ""; var mrtypeid = ""; var bid = ""; var Wsid = ""; var membertypeid = "";
var isvalid = true;
app.controller('SalesPersonWisereportCntr', ['$scope', '$http', '$window', '$rootScope', function ($scope, $http, $window, $rootScope) {
    NgInit();

    function NgInit() {
        $scope.SalesPersonWiseReport = SalesPersonWiseDO();
        $scope.ReportFilter = ReportFilterDO();
        $scope.PostBooking = PostBookingDO();
        $scope.SendMailDO = SendMailDO();


        $scope.IsShowSupplier = GetE("hdnIsShowSupplier").value;
        $scope.LoginMemberType = GetE("hdnLoginMemberTypeId").value;
        $scope.LoginUserId = GetE("hdnLoginUserId").value;
        $scope.CCode = GetE("hdnCCode").value;
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
        SortingSetting();
        ShowHideExcelColumns();


        //its for top show Functionality
        //$scope.IsTopShowAValue = "0";
        //$scope.IsTopShowActive = false;
        //$scope.TopDivShow = true;
        ////

        $("#ddl_BR option[value=" + 0 + "]").hide();
        $("#ddl_BR option[value=" + 0 + "]").add("Select Branch");

        $("#ddl_AG option:selected").text("All Agent");
        //Load supplier
        LoadSupplierList();

        $scope.SalesPersonWiseReport.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
        $scope.SalesPersonWiseReport.DateTo = ConvertCustomrangedate(new Date());

        $scope.PostBooking = PostBooking_Init($scope.PostBooking, $scope.LoginMemberType)

        //this is On Post Booking change events
        $rootScope.$on("CallPostBooking", function (event) {
            $scope.PostBooking = Set_PostMemberDetails(event, $scope.PostBooking);

        });
        $("#demo").addClass("collapse in");
    }


    //GetSupplierList
    function LoadSupplierList() {
        $scope.Supplierlist = [];
        $http.get("../CommonData/GetSuppiler").then(function (d) {
            $scope.Supplierlist = d.data;

        }, function (error) {
        })
    }

    $scope.SalesPersonWiseReport.InTerms = 1;
    //select customdate option
    Customdaterangelist1 = Customdaterangelist();

    $scope.DateRangeList = Customdaterangelist1;

    $("#ddl_CustomDateRange").change(function () {
        $scope.CustomDateRangeFilter = $("#ddl_CustomDateRange").val();

        if ($scope.CustomDateRangeFilter != "" && $scope.CustomDateRangeFilter != "0") {
            GetE("txtFromDate").value = $scope.CustomDateRangeFilter.split("~")[0];
            $scope.SalesPersonWiseReport.DateFrom = $scope.CustomDateRangeFilter.split("~")[0];
            GetE("txtToDate").value = $scope.CustomDateRangeFilter.split("~")[1];
            $scope.SalesPersonWiseReport.DateTo = $scope.CustomDateRangeFilter.split("~")[1];
        }
        else {
            GetE("txtFromDate").value = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            $scope.SalesPersonWiseReport.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            GetE("txtToDate").value = ConvertCustomrangedate(new Date());
            $scope.SalesPersonWiseReport.DateTo = ConvertCustomrangedate(new Date());
        }

    });

    //collasped and expand
    $scope.ShowModifyBtn = function () {
        $scope.ModifySearch = false;
        $("#demo")[0].style.display = 'none';

    }
    $scope.OnModifyClick = function () {
        $("#Noresultdiv")[0].style.display = "none";
        $("#Errordiv")[0].style.display = "none";
        $("#demo")[0].style.display = 'block';
    }

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

        if ($scope.SalesPersonWiseReport.DateFrom == "") {

            Alert.render("Please Select Arrival-From Date", "txtFromDate");
            isvalid = false;
            return false;
        }

        if ($scope.SalesPersonWiseReport.DateTo == "") {
            Alert.render("Please Select Arrival-To Date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ($scope.SalesPersonWiseReport.DateFrom != "" && $scope.SalesPersonWiseReport.DateTo != "") {
            var dtObj1 = GetSystemDate($scope.SalesPersonWiseReport.DateFrom);
            var dtObj2 = GetSystemDate($scope.SalesPersonWiseReport.DateTo);
        }

        if (($scope.SalesPersonWiseReport.DateFrom != "" && $scope.SalesPersonWiseReport.DateTo != "") && (dtObj1 > dtObj2)) {
            Alert.render("Arrival-From date can not be greater than Arrival-To date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ((diffDate(new Date($scope.SalesPersonWiseReport.DateTo), new Date($scope.SalesPersonWiseReport.DateFrom))) > 12.50) {
            Alert.render("Report Seraching Dates Should be Upto 12 Months", "txtToDate");
            isvalid = false;
            return false;
        }

        isvalid = true;
        //PostBookingSetting
        $scope.PostBooking = PostBooking_Setting($scope.PostBooking, $scope.LoginMemberType)

        if ($scope.CCode == 1 || $scope.CCode == "1") {
            if ($scope.LoginMemberType == "1") {
                if (GetE("ddl_BR").options[GetE("ddl_BR").selectedIndex].text == "Select Branch") {
                    Alert.render("Select Branch to Post Booking", "ddl_BR");
                    isvalid = false;
                    $("#demo")[0].style.display = 'block';
                    $scope.ModifySearch = true;
                    return false;
                }
            }
        }


        if ($scope.PostBooking.PostMemberId == "0") {
            if (GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text != "All Agent") {
                Alert.render("Select Member to Post Booking", "ddl_BR");
                isvalid = false;
                $("#demo")[0].style.display = 'block';
                $scope.ModifySearch = true;
                return false;
            }
        }

        
        if (document.getElementById('ADW').checked) {
            $scope.SalesPersonWiseReport.BookingdateWise = false;
        }
        if (document.getElementById('BDW').checked) {
            $scope.SalesPersonWiseReport.BookingdateWise = true;
        }

        if ($scope.IsGetfromHome == true) {
            $scope.PostBooking.ReportCompanyName = $scope.OnLoadReportCompanyName;
            $scope.PostBooking.PostMemberId = $scope.OnLoadPostMemberId;
        }

        $scope.SalesPersonWiseReport.MemberId = $scope.PostBooking.PostMemberId;
        $scope.SalesPersonWiseReport.LoginUserId = (document.getElementById("hdnLoginUserId")).value;

        if (isvalid == true) {
            $scope.GetReportDetails();
        }
    }


    //getReportDetails on serach click
    $scope.GetReportDetails = function () {

        var popupdetail = $scope.PostBooking.ReportCompanyName + "~" + $scope.SalesPersonWiseReport.DateFrom + "~" + $scope.SalesPersonWiseReport.DateTo;
        $scope.SalesPersonWiseReport.CustomDateOption = $("#ddl_CustomDateRange").val();;
        PopUpController.OpenPopup1("divPopup", "Sales Person Wise Report", popupdetail);

        $scope.ReportFilter.AgName = $scope.FilterDOList.filter(item => item.Name == 'AgName').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'AgName')[0].Values) : "";
        $scope.ReportFilter.AgCity = $scope.FilterDOList.filter(item => item.Name == 'AgCity').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'AgCity')[0].Values) : "";

        $scope.ReportFilter.SType = $scope.FilterDOList.filter(item => item.Name == 'SType').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'SType')[0].Values) : "";
        $scope.ReportFilter.Status = $scope.FilterDOList.filter(item => item.Name == 'Status').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'Status')[0].Values) : "";
        $scope.ReportFilter.SellCur = $scope.FilterDOList.filter(item => item.Name == 'SellCur').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'SellCur')[0].Values) : "";
        $scope.ReportFilter.NetCur = $scope.FilterDOList.filter(item => item.Name == 'NetCur').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'NetCur')[0].Values) : "";
        $scope.SalesPersonWiseReport.CustomDateOption = $("#ddl_CustomDateRange").val();;

        $("#demo").addClass("collapse in");

        $http({
            method: "post",
            url: "../Booking/GetSalesPersonWiseReport",
            data: ({
                SalesPersonWiseReportDO: $scope.SalesPersonWiseReport,
            }),
            dataType: "json",
            headers: { "Content-Type": "application/json" }

        }).then(function (d) {

            if (d.data != undefined || d.data != null) {
                if (d.data.length > 0) {

                    $scope.MainResultlist = (d.data);
                    $scope.MainResultlistAfterFilter = (d.data);

                    console.log(d.data);

                    console.log($scope.MainResultlistAfterFilter.length);
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
        var groupColumn = 19;
        if ($scope.ReportFilter.GroupBy == "") {
            $('#SalesPersonWiseReport').DataTable().clear().destroy();
            $scope.collapsedGroups = {};
            var top = '';
            var parent = '';

            $('#SalesPersonWiseReport').DataTable({


                "order": [],
                responsive: true,
                dom: 'Bfrtip',
                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: '<i class="fa fa-file-excel-o"></i>',
                        filename: function () {
                            var ReportName = "Sales Person Wise Report"
                            var RptDetails = $scope.SalesPersonWiseReport.DateFrom + "-" + $scope.SalesPersonWiseReport.DateTo;
                            return ReportName + ' ( ' + RptDetails + ' ) '
                        },
                        sheetName: 'SalesPersonWiseReport',
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
                        text: '<button  id="btnExpand" class="cust-dt-button2" >Expand All</button>',
                        titleAttr: 'Expand All',
                        action: function (e, dt, node, config) {
                            $scope.filter = true;
                            $scope.Expand = true;

                            ExpandAll();
                            $("#btnExpand").attr("disabled", "disabled");
                            $("#btncollase").removeAttr("disabled");
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
                //'rowsGroup': [0, 18],              

                "columnDefs": [
                    {
                        "targets": 0,
                        "orderable": false,
                        "className": "text-left",
                    },
                    {
                        "targets": 1,
                        "className": "text-center",
                        "visible": false,
                        "render": function (data, type, row) {
                            return (row["SalesP"]);
                        },
                    },
                    {
                        "visible": $scope.LoginMemberType == "4" ? false : true,
                        "render": function (data, type, row) {
                            return row["AgName"].substring(0, 50);
                        },

                        "targets": 2,
                        "orderable": false,
                        "className": "text-left",
                    },
                    {
                        "targets": 3,
                        "orderable": false,
                        "className": "text-left",
                    },
                    {
                        "render": function (data, type, row) {
                            return row["SName"].substring(0, 50);
                        },
                        "targets": 4,
                        "orderable": false,
                        "className": "text-left",
                    },
                    {
                        "targets": 5,
                        "orderable": false,
                        "className": "text-center",
                    },
                    {
                        "targets": 6,
                        "orderable": false,
                        "className": "text-center",
                    },
                    {
                        "targets": 7,
                        "orderable": false,
                        "className": "text-center",
                    },
                    {
                        "targets": 8,
                        "orderable": false,
                        "className": "text-center",
                    },
                    {
                        "targets": 9,
                        "orderable": false,
                        "className": "text-center",
                    },
                    {
                        "render": function (data, type, row) {
                            return row["SNetAmt"].toFixed(2);
                        },
                        "targets": 10,
                        "orderable": false,
                        "className": "text-center",
                    },
                    {
                        "targets": 11,
                        "className": "text-center sorting_disabled",
                        "orderable": false,
                    },
                    {
                        "render": function (data, type, row) {
                            return row["AGPay"].toFixed(2);
                        },
                        "targets": 12,
                        "orderable": false,
                        "className": "text-right",
                    },

                    {
                        "render": function (data, type, row) {
                            return row["TaxPay"].toFixed(2);
                        },
                        "targets": 13,
                        "orderable": false,
                        "className": "text-right",
                    },
                    {
                        "render": function (data, type, row) {
                            return row["SSNetAmt"].toFixed(2);
                        },
                        "targets": 14,
                        "orderable": false,
                        "className": "text-right",
                    },

                    {
                        "render": function (data, type, row) {
                            return row["ConvFeeAmt"].toFixed(2);
                        },
                        "targets": 15,
                        "orderable": false,
                        "className": "text-right",
                    },
                    {
                        "render": function (data, type, row) {
                            return row["ProfitAmt"].toFixed(2);
                        },
                        "targets": 16,
                        "orderable": false,
                        "className": "text-right"

                    },
                    {
                        "render": function (data, type, row) {
                            return row["Profit"].toFixed(2);
                        },
                        "targets": 17,
                        "orderable": false,
                        "className": "text-right",
                    },
                    {
                        "targets": 18,
                        "orderable": false,
                        "className": "text-center",
                    },


                ],

                searching: false,
                paging: false,
                data: $scope.MainResultlistAfterFilter,
                "pageLength": 30,
                "deferRender": true,
                select: true,

                columns: [
                    { data: 'RefNo' },
                    { data: 'SalesP' },
                    { data: 'AgName' },
                    { data: 'AgCity' },
                    { data: 'SName' },
                    { data: 'SType' },
                    { data: 'BDate' },
                    { data: 'ChkIn' },
                    { data: 'Nts' },
                    { data: 'NetCur' },
                    { data: 'SNetAmt' },
                    { data: 'SellCur' },
                    { data: 'AGPay' },
                    { data: 'TaxPay' },
                    { data: 'SSNetAmt' },
                    { data: 'ConvFeeAmt' },
                    { data: 'ProfitAmt' },
                    { data: 'Profit' },
                    { data: 'Status' }

                ],

                //"orderFixed": [[1, 'desc']],
                rowGroup: {
                    dataSrc: ['SalesP', 'SellCur'],
                    startRender: function (rows, group, level) {
                        var all;

                        if (level === 0) {
                            top = group;
                            all = group;
                            middle = '';
                        } else {
                            //if parent collapsed, nothing to do
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
                            }


                        }


                        if ($scope.SalesPersonWiseReport.InTerms == 1 && middle != '') {
                            var TotalSellamount = rows
                                .data()
                                .pluck('ProfitAmt')
                                .reduce(function (a, b) {
                                    return a + b;
                                });
                            return $('<tr/>')
                                .append('<td colspan="19">' + '<span  class="fa fa-fw ' + toggleClass + ' toggler"/><span>Sell Currency : ' + group + '</span><span style="margin-left:5px;">  (' + rows.count() + ')' + '  <span style="margin-left:25px;">' + ' Total Profit Amount : ' + parseFloat(TotalSellamount).toFixed(2) + '</span></td>')
                                .attr('data-name', all)
                                .toggleClass('collapsed', collapsed);
                        }



                        if ($scope.SalesPersonWiseReport.InTerms == 1 && middle == '') {
                            var total = rows
                                .data()
                                .pluck('TotalValue')
                                .reduce(function (a, b) {
                                    return a + 0;
                                });

                            return $('<tr/>')
                                .append('<td colspan="19">' + '<span  class="fa fa-fw ' + toggleClass + ' toggler"/><span style="width: 34% !important;font-size: 15px;"> ' + group + '</span></td>')
                                .attr('data-name', group)
                                .toggleClass('collapsed', collapsed);
                        }


                    }
                },


                "orderFixed": [[1, 'desc']], //by Total desc,Supp name asc
                initComplete: function () {
                    // Start with closed groups
                    $('#SalesPersonWiseReport tbody tr.dtrg-start').each(function () {
                        var name = $(this).data('name');
                        $scope.collapsedGroups[name] = !$scope.collapsedGroups[name];

                    });
                    $('#SalesPersonWiseReport').DataTable().draw(false);


                }


            });


            if ($scope.filter != true) {
                $('#SalesPersonWiseReport tbody').on('click', 'tr.dtrg-start', function () {
                    var name = $(this).data('name');

                    $scope.collapsedGroups[name] = !$scope.collapsedGroups[name];
                    $('#SalesPersonWiseReport').DataTable().draw(false);

                    console.log($scope.collapsedGroups);
                });
            }
            //$('select[id="ddltopdata"] option[value="' + $scope.IsTopShowAValue + '"]').attr("selected", "selected");

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


    function insert(str, value) {
        var mid = str.length / 2;
        var indexBeyondMid = str.indexOf(' ', mid);
        var indexBeforeMid = str.substring(0, mid).lastIndexOf(' ');
        var splitPoint = mid - indexBeforeMid < indexBeyondMid - mid
            ? indexBeforeMid
            : indexBeyondMid;
        var firstHalf = str.substring(0, splitPoint);
        var secondHalf = str.substring(splitPoint + 1);
        var Newstr = firstHalf.concat("", "");
        var Newstr2 = Newstr + secondHalf;
        return Newstr + value + secondHalf;

    }
    function CollapsedAll() {
        $('#SalesPersonWiseReport tbody tr.dtrg-start').each(function () {
            var name = $(this).data('name');
            $scope.collapsedGroups = {};
        });
        $('#SalesPersonWiseReport').DataTable().draw(false);
    }
    function ExpandAll() {
        $('#SalesPersonWiseReport tbody tr.dtrg-start').each(function () {
            var name = $(this).data('name');
            $scope.collapsedGroups = {};

        });
        $('#SalesPersonWiseReport').DataTable().draw(false);
    }




    //Show cols for Excel and Copy
    function ShowHideExcelColumns() {
        if ($scope.CCode == "1") {
            $scope.ExcelCollist = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
        }
        else {
            $scope.ExcelCollist = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
        }

    }

    //onHide Popup Click
    $scope.HideColumns = function () {
        //Hide_Columns is comm. fun in CommonUtility.js
        Hide_Columns('SalesPersonWiseReport')
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
        $scope.filter = true;
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
        if ($scope.TopDivShow == true) {
            $scope.MainResultlistAfterFilter = TopData_With_Sort($scope.MainResultlistAfterFilter, $scope.SortDetails);
            $('select[id="ddltopdata"] option[value="' + $("#ddltopdatawithsort").val() + '"]').attr("selected", "selected");
        }
        Apply_Sorting('SalesPersonWiseReport', $scope.SortDetails)

    }
    $scope.ClearSorting = function () {
        $scope.SortDetails = [];
        $scope.SortDetails = Clear_Sorting('SalesPersonWiseReport');
        if ($scope.TopDivShow == true) {
            $scope.MainResultlistAfterFilter = $scope.MainResultlist;//this bcz now first load data as show           
        }
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
    //////
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



//GetCurrencyList
function LoadCurrency() {
    $scope.Currencylist = [];
    $http.get("../CommonData/GetCurrency").then(function (d) {
        $scope.Currencylist = d.data;

    }, function (error) {
    })
}



function GetHideColList(GroupBy) {
    var HideColList = [];

    HideColList.push("0~RefNo~BookRefNo");
    /*  HideColList.push("1~SalesP~SalesPerson");*/
    HideColList.push("2~AgName~WS/AgName");
    HideColList.push("3~AgCity~WS/AgCity");
    HideColList.push("4~SName~ServiceName");
    HideColList.push("5~SType~ServiceType");
    HideColList.push("6~BDate~BookDate");
    HideColList.push("7~ChkIn~CheckInDate");
    HideColList.push("8~Nts~Nights ");
    HideColList.push("9~NetCur~NetCurrency");
    HideColList.push("10~SNetAmt~NetAmt");
    HideColList.push("11~SellCur~SellCurrency");
    HideColList.push("12~AGPay~WS/AgPayable");
    HideColList.push("13~TaxPay~Tax");
    HideColList.push("14~SSNetAmt~Net(Sell Currency)");
    HideColList.push("15~ConvFeeAmt~ConvenienceFee");
    HideColList.push("16~ProfitAmt~ProfitAmount");
    HideColList.push("17~Profit~Profit(%)");
    HideColList.push("18~Status~Status");


    if (GroupBy != "") {
        var NewHideColList = [];

    }
    NewHideColList = HideColList;

    return NewHideColList;


}
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
//function ShowNumberFilterList() {
//    var NumberFilterColList = ['HMStatus', 'Status', 'SupplierName', 'SuppName', 'HM_NetCur'];
//    return NumberFilterColList;
//}

$(document).ready(function () {

    $("#OPLReport").addClass("active");
    $(".date-cal").datepicker({ dateFormat: 'dd M yy', numberOfMonths: 2, });




    var table = $('#SalesPersonWiseReport').dataTable();
    //for sorting icon clear custom sorting list
    table.on('click', 'th', function () {

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


    function CalltoFilterPopup(type) {

        var scope = angular.element(document.getElementById("MainWrap")).scope();
        scope.$apply(function () {
            scope.OpenFilterPopup(type);
        })
        return;
    }

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




