var app = angular.module('TransactionReportapp', []);


var bid = ""; var brtypeid = ""; var mid = ""; var mrtypeid = ""; var bid = ""; var Wsid = ""; var membertypeid = "";
var isvalid = true;
app.controller('TransactionReportCntr', ['$scope', '$http', '$window', '$rootScope', '$timeout', function ($scope, $http, $window, $rootScope, $timeout) {
    NgInit();
    function NgInit() {
        $scope.TransactionReport = TransactionReportDO();
        $scope.ReportFilter = ReportFilterDO();
        $scope.PostBooking = PostBookingDO();
        $scope.SendMailDO = SendMailDO();

        $scope.IsShowSupplier = GetE("hdnIsShowSupplier").value;
        $scope.LoginMemberType = GetE("hdnLoginMemberTypeId").value;
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



        if ($scope.CCode == 1) {
            // $("#ddl_BR option:selected").text("Select Branch");           
            $("#ddl_BR option[value=" + 0 + "]").hide();
            $("#ddl_BR option[value=" + 0 + "]").add("Select Branch");

        }
        else {
            $("#ddl_BR option:selected").text("All Branch");
        }
        ///   $("#ddl_WS option:selected").text("All Wholesaler");
        $("#ddl_AG option:selected").text("All Agent");




        $scope.TransactionReport.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
        $scope.TransactionReport.DateTo = ConvertCustomrangedate(new Date());


        //this is PostBooking Init()
        $scope.PostBooking = PostBooking_Init($scope.PostBooking, $scope.LoginMemberType)

        //this is On Post Booking change events
        $rootScope.$on("CallPostBooking", function (event) {
            $scope.PostBooking = Set_PostMemberDetails(event, $scope.PostBooking);

        });
        $("#demo").addClass("collapse in");

        //GetDetails();


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


    //select grouping option
    $("#ddl_Grp").change(function () {
        $scope.ReportFilter.GroupBy = $("#ddl_Grp").val().split('~')[0];
        $scope.GroupingName = $("#ddl_Grp").val().split('~')[1];
    });

    //select customdate option
    Customdaterangelist1 = Customdaterangelist();

    $scope.DateRangeList = Customdaterangelist1;

    $("#ddl_CustomDateRange").change(function () {
        $scope.CustomDateRangeFilter = $("#ddl_CustomDateRange").val();

        if ($scope.CustomDateRangeFilter != "" && $scope.CustomDateRangeFilter != "0") {
            GetE("txtFromDate").value = $scope.CustomDateRangeFilter.split("~")[0];
            $scope.TransactionReport.DateFrom = $scope.CustomDateRangeFilter.split("~")[0];
            GetE("txtToDate").value = $scope.CustomDateRangeFilter.split("~")[1];
            $scope.TransactionReport.DateTo = $scope.CustomDateRangeFilter.split("~")[1];
        }
        else {
            GetE("txtFromDate").value = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            $scope.TransactionReport.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            GetE("txtToDate").value = ConvertCustomrangedate(new Date());
            $scope.TransactionReport.DateTo = ConvertCustomrangedate(new Date());
        }

    });

    //collasped and expand

    $scope.ShowModifyBtn = function () {
        $("#demo")[0].style.display = "none";
        $scope.ModifySearch = false;

    }

    //Modify Button for
    $scope.ShowModifyClick = function () {
        $("#demo")[0].style.display = "block";
        $("#Noresultdiv")[0].style.display = "none";
        $("#Errordiv")[0].style.display = "none";
    }

    //validation and setparam on serach click
    $scope.SearchReportClick = function () {


        var isvalid = true;
        $scope.OnlyClearAll();
        //$("#demo")[0].style.display = 'none';
        $("#RptDetails")[0].style.display = "none";
        $("#RptHeaderDetails")[0].style.display = "none";
        $("#Noresultdiv")[0].style.display = "none";
        PopUpController.ClosePopup("divPopup", "");
        //$("#HeaderSearchdiv").removeClass();
        //$("#HeaderSearchdiv").addClass("col-lg-12 col-md-12 col-sm-12 col-xs-12 container-fluid padd-lft10 padd-rgt10");
        $scope.ModifySearch = false;

        if ($scope.TransactionReport.DateFrom == "") {

            Alert.render("Please Select From-Date", "txtFromDate");
            isvalid = false;
            $scope.ModifySearch = true;
            return false;
        }

        if ($scope.TransactionReport.DateTo == "") {
            Alert.render("Please Select To-Date", "txtToDate");
            isvalid = false;
            $scope.ModifySearch = true;
            return false;
        }
        if ($scope.TransactionReport.DateFrom != "" && $scope.TransactionReport.DateTo != "") {
            var dtObj1 = GetSystemDate($scope.TransactionReport.DateFrom);
            var dtObj2 = GetSystemDate($scope.TransactionReport.DateTo);
        }

        if (($scope.TransactionReport.DateFrom != "" && $scope.TransactionReport.DateTo != "") && (dtObj1 > dtObj2)) {
            Alert.render("From date can not be greater than To date", "txtToDate");
            isvalid = false;
            $scope.ModifySearch = true;
            return false;
        }
        if ((diffDate(new Date($scope.TransactionReport.DateTo), new Date($scope.TransactionReport.DateFrom))) > 12.50) {
            Alert.render("Report Seraching Dates Should be Upto 12 Months", "txtToDate");
            isvalid = false;
            $scope.ModifySearch = true;
            return false;
        }
        //PostBookingSetting
        $scope.PostBooking = PostBooking_Setting($scope.PostBooking, $scope.LoginMemberType)
        if ($scope.CCode == 1 || $scope.CCode == "1")
        {
            if ($scope.LoginMemberType == "1")
            {
                if (GetE("ddl_BR").options[GetE("ddl_BR").selectedIndex].text == "Select Branch") {
                    Alert.render("Select Branch to Post Booking", "ddl_BR");
                    isvalid = false;
                    $scope.ModifySearch = true;
                    return false;
                }
            }
        }

        if ($scope.PostBooking.PostMemberId == "0") {
            if (GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text != "All Agent") {
                Alert.render("Select Member to Post Booking", "ddl_BR");
                isvalid = false;
                $scope.ModifySearch = true;
                return false;
            }
        }

        $scope.MemberDetails = $scope.PostBooking.Br_Id + "_" + $scope.PostBooking.Ws_Id + "_" + $scope.PostBooking.Ag_Id + "_" + $scope.PostBooking.ReportCompanyName + "_" + GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text;


        $scope.TransactionReport.MemberId = $scope.PostBooking.PostMemberId;
        $scope.TransactionReport.LoginUserId = (document.getElementById("hdnLoginUserId")).value;


        if (isvalid == true) {
            $scope.GetReportDetails();
        }
    }


    //getReportDetails on serach click
    $scope.GetReportDetails = function () {

        $("#divhdeading")[0].style.display = "block";
        $("#demo")[0].style.display = "none";
        $("#HeaderSearchdiv").removeClass();
        $("#HeaderSearchdiv").addClass("col-lg-12 col-md-12 col-sm-12 col-xs-12 container-fluid padd-lft10 padd-rgt10");

        //var ReportName = $scope.TransactionReport.BookStatus + " Transaction Report";
        var popupdetail = $scope.PostBooking.ReportCompanyName + "~" + $scope.TransactionReport.DateFrom + "~" + $scope.TransactionReport.DateTo;
        PopUpController.OpenPopup1("divPopup", "Transaction Report", popupdetail);


        $scope.ReportFilter.AgName = $scope.FilterDOList.filter(item => item.Name == 'AgName').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'AgName')[0].Values) : "";
        $scope.ReportFilter.Status = $scope.FilterDOList.filter(item => item.Name == 'Status').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'Status')[0].Values) : "";
        $scope.ReportFilter.CustomDateOption = $("#ddl_CustomDateRange").val();


        $("#demo").addClass("collapse in");


        $http({
            method: "post",
            url: "../Booking/GetTransactionDetail",
            data: ({
                TransactionSearchReportDO: $scope.TransactionReport,
            }),
            dataType: "json",
            headers: { "Content-Type": "application/json" }

        }).then(function (d) {

            if (d.data == undefined || d.data == null) {
                SessionTimeout(); //this function in Commonutility js
            }
            else {
                if (d.data != undefined || d.data != null) {
                    if (d.data.length > 0) {

                        $scope.MainResultlist = (d.data);
                        $scope.MainResultlistAfterFilter = (d.data);

                        $scope.MainResultlist = $scope.MainResultlist.map(
                            item => {
                                item["AgName"] = GetBookingServiceNameDirective(item["AgName"]);
                                item["Status"] = GetBookingTypeDirective(item["Status"]);

                                return item;
                            }
                        );
                        $scope.MainResultlistAfterFilter = $scope.MainResultlistAfterFilter.map(
                            item => {
                                item["AgencyName"] = GetBookingServiceNameDirective(item["AgencyName"]);
                                item["StatusType"] = GetBookingTypeDirective(item["StatusType"]);

                                return item;
                            }
                        );


                        //console.log(d.data);

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
            }

        }, function (error) {
            $scope.ModifySearch = false;
            $("#Errordiv")[0].style.display = "block";
            PopUpController.ClosePopup("divPopup", "");
        });


    }

    //Set DataTable
    function SetDataTable() {
        if ($scope.ReportFilter.GroupBy == "") {



            $('#TransactionReport').DataTable().clear().destroy();
            //$scope.collapsedGroups = {};
            $('#TransactionReport').DataTable({

                "order": [],
                dom: 'Bfrtip',

                buttons: [

                    {
                        extend: 'excelHtml5',
                        text: '<i class="fa fa-file-excel-o"></i>',
                        filename: function () {
                            var ReportName = "Transaction Report"
                            var RptDetails = $scope.TransactionReport.DateFrom + "-" + $scope.TransactionReport.DateTo;
                            return ReportName + ' ( ' + RptDetails + ' ) '
                        },
                        sheetName: 'TransactionReportRptSheet',
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
                        titleAttr: 'hide',
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

                    },

                    {
                        "targets": 1,
                        "className": "text-left",
                        orderable: false,
                    },

                    {
                        "targets": 2,
                        "className": "text-left",

                    },

                    {
                        "targets": 3,
                        "className": "text-right",
                    },

                    {
                        "targets": 4,
                        "className": "text-left",

                    },

                    {
                        "targets": 5,
                        "className": "text-left",
                        orderable: false,

                    },

                    {
                        "targets": 6,
                        "className": "text-left",
                    },

                    {
                        "targets": 7,
                        "className": "text-left",
                    },

                    {
                        "targets": 8,
                        "className": "text-left",

                    },

                ],

                searching: false,

                paging: true,
                data: $scope.MainResultlistAfterFilter,
                "pageLength": 30,
                "deferRender": true,
                select: true,
                columns: [
                    { data: 'AgName' },
                    { data: 'Transact_Id' },
                    { data: 'SCurr' },
                    { data: 'SAmt' },
                    { data: 'Remarks' },
                    { data: 'PDate' },
                    { data: 'RefNo' },
                    { data: 'Status' },
                    { data: 'SName' }
                ],

            });

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


    //Show cols for Excel and Copy
    function ShowHideExcelColumns() {

        if ($scope.CCode == "1") {
            $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        }
        else {
            $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        }

    }

    //onHide Popup Click
    $scope.HideColumns = function () {
        //Hide_Columns is comm. fun in CommonUtility.js
        Hide_Columns('TransactionReport')
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
        Apply_Sorting('TransactionReport', $scope.SortDetails)

    }
    $scope.ClearSorting = function () {
        $scope.SortDetails = [];
        $scope.SortDetails = Clear_Sorting('TransactionReport');
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
    HideColList.push("0~AgName~Agency Name");
    HideColList.push("1~Transact_Id~Transact_Id");
    HideColList.push("2~SCurr~Currency");
    HideColList.push("3~SAmt~Amount");
    HideColList.push("4~Remarks~Remarks");
    HideColList.push("5~PDate~Payment Date");
    HideColList.push("6~RefNo~Book Ref / Pos");
    HideColList.push("7~Status~Status");
    HideColList.push("8~SName~Service Name");

    NewHideColList = HideColList;
    return NewHideColList;

}



$(document).ready(function () {

    $(".date-cal").datepicker({ dateFormat: 'dd M yy', numberOfMonths: 2, });
    var table = $('#TransactionReport').dataTable();
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




