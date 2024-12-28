
var app = angular.module('HotelMiseReportApp', []);

var isvalid = true;
app.controller('HotelMiseReportCntr', ['$scope', '$http', '$window', '$rootScope', '$timeout', function ($scope, $http, $window, $rootScope, $timeout) {
    NgInit();
    function NgInit() {
        $scope.HotelMiseReport = HotelMiseReportDO();
        $scope.ReportFilter = ReportFilterDO();
        $scope.PostBooking = PostBookingDO();
        $scope.SendMailDO = SendMailDO();


        $scope.IsShowSupplier = GetE("hdnIsShowSupplier").value;
        $scope.LoginMemberType = GetE("hdnLoginMemberTypeId").value;
        $scope.LoginUserId = GetE("hdnLoginUserId").value;       
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

        //Load supplier
        LoadSupplierList();

        $scope.HotelMiseReport.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
        $scope.HotelMiseReport.DateTo = ConvertCustomrangedate(new Date());

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


    //select customdate option
    Customdaterangelist1 = Customdaterangelist();

    $scope.DateRangeList = Customdaterangelist1;

    $("#ddl_CustomDateRange").change(function () {
        $scope.CustomDateRangeFilter = $("#ddl_CustomDateRange").val();

        if ($scope.CustomDateRangeFilter != "" && $scope.CustomDateRangeFilter != "0") {
            GetE("txtFromDate").value = $scope.CustomDateRangeFilter.split("~")[0];
            $scope.HotelMiseReport.DateFrom = $scope.CustomDateRangeFilter.split("~")[0];
            GetE("txtToDate").value = $scope.CustomDateRangeFilter.split("~")[1];
            $scope.HotelMiseReport.DateTo = $scope.CustomDateRangeFilter.split("~")[1];
        }
        else {
            GetE("txtFromDate").value = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            $scope.HotelMiseReport.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            GetE("txtToDate").value = ConvertCustomrangedate(new Date());
            $scope.HotelMiseReport.DateTo = ConvertCustomrangedate(new Date());
        }

    });

    //collasped and expand
    $scope.ShowModifyBtn = function () {
        $scope.ModifySearch = false;
        $("#demo")[0].style.display = 'none';

    }
    $scope.OnModifyClick = function () {

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

        if ($scope.HotelMiseReport.DateFrom == "") {

            Alert.render("Please Select Arrival-From Date", "txtFromDate");
            isvalid = false;
            return false;
        }

        if ($scope.HotelMiseReport.DateTo == "") {
            Alert.render("Please Select Arrival-To Date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ($scope.HotelMiseReport.DateFrom != "" && $scope.HotelMiseReport.DateTo != "") {
            var dtObj1 = GetSystemDate($scope.HotelMiseReport.DateFrom);
            var dtObj2 = GetSystemDate($scope.HotelMiseReport.DateTo);
        }

        if (($scope.HotelMiseReport.DateFrom != "" && $scope.HotelMiseReport.DateTo != "") && (dtObj1 > dtObj2)) {
            Alert.render("Arrival-From date can not be greater than Arrival-To date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ((diffDate(new Date($scope.HotelMiseReport.DateTo), new Date($scope.HotelMiseReport.DateFrom))) > 12.50) {
            Alert.render("Report Seraching Dates Should be Upto 12 Months", "txtToDate");
            isvalid = false;
            return false;
        }

        if ($scope.IsGetfromHome == true) {
            $scope.PostBooking.ReportCompanyName = $scope.OnLoadReportCompanyName;
            $scope.PostBooking.PostMemberId = $scope.OnLoadPostMemberId;
        }

        if (document.getElementById('ADW').checked) {
            $scope.HotelMiseReport.BookingdateWise = false;
        }
        if (document.getElementById('BDW').checked) {
            $scope.HotelMiseReport.BookingdateWise = true;
        }

        $scope.HotelMiseReport.MemberId = $scope.PostBooking.PostMemberId;
        $scope.HotelMiseReport.LoginUserId = (document.getElementById("hdnLoginUserId")).value;

        if (isvalid == true) {
            $scope.GetReportDetails();
        }
    }


    //getReportDetails on serach click
    $scope.GetReportDetails = function () {

        var popupdetail = $scope.HotelMiseReport.SupplierName + "~" + $scope.HotelMiseReport.DateFrom + "~" + $scope.HotelMiseReport.DateTo;
        PopUpController.OpenPopup1("divPopup", "Hotel Mize Report", popupdetail);        
        $scope.ReportFilter.HMStatus = $scope.FilterDOList.filter(item => item.Name == 'HMStatus').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'HMStatus')[0].Values) : "";
        $scope.ReportFilter.Status = $scope.FilterDOList.filter(item => item.Name == 'Status').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'OldBookStatus')[0].Values) : "";
        $scope.ReportFilter.HM_SuppName = $scope.FilterDOList.filter(item => item.Name == 'HM_SuppName').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'SupplierName')[0].Values) : "";
        $scope.ReportFilter.SuppName = $scope.FilterDOList.filter(item => item.Name == 'SuppName').length > 0 ? ($scope.FilterDOList.filter
            (item => item.Name == 'OldSupplierName')[0].Values) : "";
        $scope.ReportFilter.HM_NetCur = $scope.FilterDOList.filter(item => item.Name == 'HM_NetCur').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'HM_NetCur')[0].Values) : "";
        $scope.HotelMiseReport.CustomDateOption = $("#ddl_CustomDateRange").val();;

        $("#demo").addClass("collapse in");

        $http({
            method: "post",
            url: "../Booking/GetHotelMiseReportDetail",
            data: ({
                HotelMiseSearchReportDO: $scope.HotelMiseReport,
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
                    ExpandAll();
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
            $('#HotelMiseReport').DataTable().clear().destroy();
            $scope.collapsedGroups = {};           
          




            $('#HotelMiseReport').DataTable({

                
                "order": [],
                responsive: true,
                dom: 'Bfrtip',
                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: '<i class="fa fa-file-excel-o"></i>',
                        filename: function () {
                            var ReportName = "Hotel Mize Report"
                            var RptDetails = $scope.HotelMiseReport.DateFrom + "-" + $scope.HotelMiseReport.DateTo;
                            return ReportName + ' ( ' + RptDetails + ' ) '
                        },
                        sheetName: 'HotelMizeReport',
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
                ],
                          
                "autoWidth": false,
                //'rowsGroup': [0, 9],
                "columnDefs": [                    
                    {
                        "targets": 0,
                        orderable: false,
                        "className": "text-left",
                    },
                    {
                        "targets": 1,
                        orderable: false,
                        "className": "text-left",
                    },
                    {
                        "targets": 2,
                        orderable: false,
                        "className": "text-left",
                    },
                    {
                        "targets": 3,
                        orderable: false,
                        "className": "text-left",
                    },
                    {
                        "targets": 4,
                        orderable: false,
                        "className": "text-left",
                    },
                    {
                        "targets": 5,
                        orderable: false,
                        "className": "text-left",
                    },
                    {
                        "targets": 6,
                        orderable: false,
                        "className": "text-left",
                    },
                    {
                        "targets": 7,
                        orderable: false,
                        "className": "text-left",
                    },
                    {
                        "targets": 8,
                        orderable: true,
                        "render": function (data, type, row) {
                            return row["HM_NetAmt"].toFixed(2);
                        },
                        "className": "text-right",
                    },
                    {
                        "targets": 9,
                        orderable: false,
                        "className": "text-right",
                    },
                    {
                        "targets": 10,
                        orderable: true,
                        "render": function (data, type, row) {
                            return row["NetAmt"].toFixed(2);
                        },
                        "className": "text-right",
                    },
                    {
                        "targets": 11,
                        "render": function (data, type, row) {
                            return row["HM_NetCur"].substring(0, 30);
                        },
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
                        orderable: false,
                        "className": "text-left",
                    },
                    {
                        "visible": $scope.LoginUserId == "566" ? true : false,
                        "targets": 14,
                        orderable: false,
                        "className": "text-left",
                    },


                ],

                searching: false,
                paging: false,
                data: $scope.MainResultlistAfterFilter,
                "pageLength": 30,
                "deferRender": true,
                select: true,
              
                columns: [
                    { data: 'BId' },
                    { data: 'RefNo' },
                    { data: 'BookDate' },
                    { data: 'ChkIn' },
                    { data: 'Chkout' },              
                    { data: 'HMStatus' },
                    { data:'Status'},
                    { data: 'HM_SuppName' },
                    { data: 'NetAmt' },
                    { data: 'SuppName' },
                    { data: 'NetAmt' },
                    { data: 'HM_NetCur' },
                    { data: 'Profit' },
                    { data: 'Error' },
                    { data: 'Conv' }

                ],
                "orderFixed": [[11, 'desc']],
                rowGroup: {
                    dataSrc: ['HM_NetCur'],
                    startRender: function (rows, group) {
                        var all;
                        
                        var collapsed = !!$scope.collapsedGroups[group];

                        rows.nodes().each(function (r) {
                            if ($scope.Expand == true) {
                                r.style.display = collapsed ? 'none' : '';
                            }
                            else {
                                r.style.display = collapsed ? '' : 'none';
                            }
                        });

                        if ($scope.Expand == true) {
                            var toggleClass = collapsed ? 'fa-plus-square' : 'fa-minus-square';
                        }
                        else {
                            var toggleClass = collapsed ? 'fa-minus-square' : 'fa-plus-square';
                        }


                        //var TotalNew_NetAmt = rows
                        //    .data()
                        //    .pluck('New_NetAmt')
                        //    .reduce(function (a, b) {
                        //        return a + b;
                        //    });
                        //var TotalOld_NetAmt = rows
                        //    .data()
                        //    .pluck('Old_NetAmt')
                        //    .reduce(function (a, b) {
                        //        return a + b;
                        //    });
                        var TotalProfit = rows
                            .data()
                            .pluck('Profit')
                            .reduce(function (a, b) {
                                return a + b;
                            });
                        /*<span style="margin-left:5px;"> (' + rows.count() + ')' + '   Total Conv_NetAmt : ' + parseFloat(TotalNew_NetAmt).toFixed(2) + '</span><span style="margin-left:5px;"> Total Old_NetAmt : ' + parseFloat(TotalOld_NetAmt).toFixed(2) + '</span>*/
                        return $('<tr/>')
                            .append('<td colspan="15">' + '<span  class="fa fa-fw ' + toggleClass + ' toggler"/><span>Sell Currency : ' + group + '</span><span style="margin-left:5px;"> (' + rows.count() + ')' + ',' + ' Total Profit :' + '(' + parseFloat(TotalProfit).toFixed(2) + ')' + '</span></td>')
                            .attr('data-name', group)                          
                            .toggleClass('collapsed', collapsed);

                    },

                },
             

                rowCallback: function (row, data) {
                    if ((data["BookStatus"] == "Failed")) {
                        $('td:eq(0)', row).css('color', 'Red',);
                        $('td:eq(5)', row).css('color', 'Red',);
                    }
                }
                        
            });
          
            if ($scope.filter != true) {
                $('#HotelMiseReport tbody').on('click', 'tr.dtrg-start', function () {
                    var name = $(this).data('name');

                    $scope.collapsedGroups[name] = !$scope.collapsedGroups[name];
                    $('#HotelMiseReport').DataTable().draw(false);

                    console.log($scope.collapsedGroups);
                });
            }

            $('select[id="ddltopdata"] option[value="' + $scope.IsTopShowAValue + '"]').attr("selected", "selected");

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
        //return str.substr(0, index) + value + str.substr(index);
        //str = 'Bkg was confirmed on 29 Dec and after many follow up we got an update on 30 Dec evening that the hotel is sold out, Agent was very much upset on this issue. As per Ms. Anna from hotel Sales she had already sent stop sale on 29 Dec itself and it was not updated from supplier side.'
        var mid = str.length / 2;
        var indexBeyondMid = str.indexOf(' ', mid);
        var indexBeforeMid = str.substring(0, mid).lastIndexOf(' ');
        var splitPoint = mid - indexBeforeMid < indexBeyondMid - mid
            ? indexBeforeMid
            : indexBeyondMid;
        var firstHalf = str.substring(0, splitPoint);
        var secondHalf = str.substring(splitPoint + 1);
        //console.log(firstHalf);
        //console.log(secondHalf);
        var Newstr = firstHalf.concat("", "");
        var Newstr2 = Newstr + secondHalf;
        return Newstr + value + secondHalf;

    }
    function CollapsedAll() {
        $('#HotelMiseReport tbody tr.dtrg-start').each(function () {
            var name = $(this).data('name');
            $scope.collapsedGroups = {};                      
        });
        $('#HotelMiseReport').DataTable().draw(false);
    }
    function ExpandAll() {
        $('#HotelMiseReport tbody tr.dtrg-start').each(function () {
            var name = $(this).data('name');
            $scope.collapsedGroups = {};           

        });
        $('#HotelMiseReport').DataTable().draw(false);        
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
    }


    //Show cols for Excel and Copy
    function ShowHideExcelColumns() {
        if ($scope.CCode == "1") {
            $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6, 7,8,9,10,11,12,13,14];
        }
        else {
            $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6, 7,8,9,10,11,12,13,14];
        }

    }

    //onHide Popup Click
    $scope.HideColumns = function () {
        //Hide_Columns is comm. fun in CommonUtility.js
        Hide_Columns('HotelMiseReport')
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
            $scope.ShowTopDataChange();
        }
        Apply_Sorting('HotelMiseReport', $scope.SortDetails)

    }
    $scope.ClearSorting = function () {
        $scope.SortDetails = [];
        $scope.SortDetails = Clear_Sorting('HotelMiseReport');
        if ($scope.TopDivShow == true) {
            $scope.MainResultlistAfterFilter = $scope.MainResultlist;//this bcz now first load data as show
            $scope.ShowTopDataChange();
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


function GetHideColList(GroupBy) {
    var HideColList = [];

    HideColList.push("0~BId~BookingId");
    HideColList.push("1~RefNo~BookRefNo");
    HideColList.push("2~BookDate~HM_BookDate");
    HideColList.push("3~ChkIn~CheckInDate");
    HideColList.push("4~Chkout~CheckOutDate");
    /*    HideColList.push("5~Ddate~Conv_DeadlineDate");*/
    HideColList.push("5~HMStatus~HM_BookStatus");
    HideColList.push("6~Status~BookStatus");
    HideColList.push("7~HM_SuppName~HM_SuppName");
    HideColList.push("8~HM_NetAmt~HM_NetAmt(in Sell Curr.) ");
    HideColList.push("9~SuppName~SuppName");
    HideColList.push("10~NetAmt~NetAmt(in Sell Curr.)");
    HideColList.push("11~HM_NetCur~Sell Currency");
    HideColList.push("12~Profit~Profit");
    HideColList.push("13~Error~Error");
    HideColList.push("14~Conv~Calculation");
   
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
function ShowNumberFilterList() {
    var NumberFilterColList = ['HMStatus', 'Status', 'SupplierName', 'SuppName', 'HM_NetCur'];
    return NumberFilterColList;
}

$(document).ready(function () {

    $("#OPLReport").addClass("active");
    $(".date-cal").datepicker({ dateFormat: 'dd M yy', numberOfMonths: 2, });




    var table = $('#HotelMiseReport').dataTable();
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

