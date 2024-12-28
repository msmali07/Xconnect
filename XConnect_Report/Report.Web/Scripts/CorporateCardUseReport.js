var app = angular.module('CCUReportapp', []);


var bid = ""; var brtypeid = ""; var mid = ""; var mrtypeid = ""; var bid = ""; var Wsid = ""; var membertypeid = "";
var isvalid = true;
app.controller('CCUReportCntr', ['$scope', '$http', '$window', '$rootScope', '$timeout', function ($scope, $http, $window, $rootScope, $timeout) {
    NgInit();

    function NgInit() {
        $scope.CorpCUReport = CorporateCardUseReportDO();
        $scope.ReportFilter = ReportFilterDO();
        $scope.SendMailDO = SendMailDO();

        $scope.IsShowSupplier = GetE("hdnIsShowSupplier").value;
        $scope.LoginMemberType = GetE("hdnLoginMemberTypeId").value;
        $scope.ModifySearch = true;

        $scope.CorpCardUseData = [];
        $scope.SortDetails = [];
        $scope.SortDetails.push(SortDetailDO());
        $scope.SortColNo = [];
        $scope.MainResultlistAfterFilter = [];
        $scope.ShowddlFilterList = [];
        $scope.FilterDOList = [];
        $scope.FilterTypeActive = "";
        $scope.CCReportWise = "Corporate";
        $scope.CorpCUName = "";
        $scope.selectedArray = "";
        $scope.OldSelectedfilterArrayValues = "";
        GetReportDetails($scope.CCReportWise);
        SortingSetting();
        ShowHideExcelColumns();

        $scope.CorpCUReport.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
        $scope.CorpCUReport.DateTo = ConvertCustomrangedate(new Date());
        $("#demo").addClass("collapse in");
    }

    function GetReportDetails(CCRWise) {
        if (CCRWise == "Corporate")
            if (document.getElementById('CRW').checked)
                $scope.CCReportWise = "Corporate";
            else
                $scope.CCReportWise = "CardUse";
        else
            if (document.getElementById('CUW').checked)
                $scope.CCReportWise = "CardUse";
            else
                $scope.CCReportWise = "Corporate";

        $http({
            method: "post",
            url: "../Booking/GetCCardUseData",
            data: ({
                ReportWise: $scope.CCReportWise,
            }),
            dataType: "json",
            headers: { "Content-Type": "application/json" }

        }).then(function (d) {

            if (d.data != undefined || d.data != null) {
                if (d.data.length > 0) {
                    if ($scope.CCReportWise == "Corporate") {
                        for (var i in d.data) {
                            $scope.CorpCardUseData.push({ "Id": d.data[i].CId, "Name": d.data[i].CName });
                        }
                    }
                    else {
                        for (var i in d.data) {
                            $scope.CorpCardUseData.push({ "Id": i, "Name": d.data[i].Curr });
                        }
                    }
                }
            }
        });
    }

    $scope.GetReportDetail = function (CCRWise) {
        $scope.CorpCardUseData = [];
        GetReportDetails(CCRWise);
    }

    //select Customdate option
    Customdaterangelist1 = Customdaterangelist();

    $scope.DateRangeList = Customdaterangelist1;

    $("#ddl_CustomDateRange").change(function () {
        $scope.CustomDateRangeFilter = $("#ddl_CustomDateRange").val();

        if ($scope.CustomDateRangeFilter != "" && $scope.CustomDateRangeFilter != "0") {
            GetE("txtFromDate").value = $scope.CustomDateRangeFilter.split("~")[0];
            $scope.CorpCUReport.DateFrom = $scope.CustomDateRangeFilter.split("~")[0];
            GetE("txtToDate").value = $scope.CustomDateRangeFilter.split("~")[1];
            $scope.CorpCUReport.DateTo = $scope.CustomDateRangeFilter.split("~")[1];
        }
        else {
            GetE("txtFromDate").value = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            $scope.CorpCUReport.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            GetE("txtToDate").value = ConvertCustomrangedate(new Date());
            $scope.CorpCUReport.DateTo = ConvertCustomrangedate(new Date());
        }

    });

    $scope.ShowModifyBtn = function () {
        $scope.ModifySearch = false;

    }

    //Validation and setparam on serach click
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

        if ($scope.CorpCUReport.DateFrom == "") {

            Alert.render("Please Select Arrival-From Date", "txtFromDate");
            isvalid = false;
            return false;
        }

        if ($scope.CorpCUReport.DateTo == "") {
            Alert.render("Please Select Arrival-To Date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ($scope.CorpCUReport.DateFrom != "" && $scope.CorpCUReport.DateTo != "") {
            var dtObj1 = GetSystemDate($scope.CorpCUReport.DateFrom);
            var dtObj2 = GetSystemDate($scope.CorpCUReport.DateTo);
        }

        if (($scope.CorpCUReport.DateFrom != "" && $scope.CorpCUReport.DateTo != "") && (dtObj1 > dtObj2)) {
            Alert.render("Arrival-From date can not be greater than Arrival-To date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ((diffDate(new Date($scope.CorpCUReport.DateTo), new Date($scope.CorpCUReport.DateFrom))) > 12.50) {
            Alert.render("Report Seraching Dates Should be Upto 12 Months", "txtToDate");
            isvalid = false;
            return false;
        }

        if (document.getElementById('ADW').checked) {
            $scope.CorpCUReport.BookingdateWise = false;
        }
        if (document.getElementById('BDW').checked) {
            $scope.CorpCUReport.BookingdateWise = true;
        }

        $scope.CorpCUReport.LoginUserId = (document.getElementById("hdnLoginUserId")).value;
        $scope.CorpCUReport.ReportWise = $scope.CCReportWise;

        if ($scope.CCReportWise == "Corporate")
            $scope.CorpCUReport.CorporateId = GetE("ddl_CorporateCardUse").options[GetE("ddl_CorporateCardUse").selectedIndex].value;
        else
            $scope.CorpCUReport.CardUse = GetE("ddl_CorporateCardUse").options[GetE("ddl_CorporateCardUse").selectedIndex].text;

        if (isvalid == true) {
            $scope.GetReportDetails();
        }
    }

    //getReportDetails on serach click
    $scope.GetReportDetails = function () {

        var popupdetail = $scope.CCReportWise + "~" + $scope.CorpCUReport.DateFrom + "~" + $scope.CorpCUReport.DateTo;
        PopUpController.OpenPopup1("divPopup", "Corporate And Card Use Report", popupdetail);

        $scope.ReportFilter.CName = $scope.FilterDOList.filter(item=> item.Name == 'CName').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'CName')[0].Values) : "";
        $scope.ReportFilter.CUse = $scope.FilterDOList.filter(item=> item.Name == 'CUse').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'CUse')[0].Values) : "";
        $scope.ReportFilter.NORooms = $scope.FilterDOList.filter(item=> item.Name == 'NORooms').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'NORooms')[0].Values) : "";
        $scope.ReportFilter.Nts = $scope.FilterDOList.filter(item=> item.Name == 'Nts').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'Nts')[0].Values) : "";
        $scope.ReportFilter.Pax = $scope.FilterDOList.filter(item=> item.Name == 'Pax').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'Pax')[0].Values) : "";
        $scope.ReportFilter.SName = $scope.FilterDOList.filter(item=> item.Name == 'SName').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'SName')[0].Values) : "";
        $scope.ReportFilter.SupName = $scope.FilterDOList.filter(item=> item.Name == 'SupName').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'SupName')[0].Values) : "";
        $scope.ReportFilter.NCurr = $scope.FilterDOList.filter(item=> item.Name == 'NCurr').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'NCurr')[0].Values) : "";
        $scope.ReportFilter.NAmt = $scope.FilterDOList.filter(item=> item.Name == 'NAmt').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'NAmt')[0].Values) : "";
        $scope.ReportFilter.SCurr = $scope.FilterDOList.filter(item=> item.Name == 'SCurr').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'SCurr')[0].Values) : "";
        $scope.ReportFilter.SAmt = $scope.FilterDOList.filter(item=> item.Name == 'SAmt').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'SAmt')[0].Values) : "";

        $scope.ReportFilter.CustomDateOption = $("#ddl_CustomDateRange").val();;

        $("#demo").addClass("collapse in");

        $http({
            method: "post",
            url: "../Booking/GetCCUDetail",
            data: ({
                CCUSearchReportDO: $scope.CorpCUReport,
            }),
            dataType: "json",
            headers: { "Content-Type": "application/json" }

        }).then(function (d) {

            if (d.data != undefined || d.data != null) {
                if (d.data.length > 0) {

                    $scope.MainResultlist = (d.data);
                    $scope.MainResultlistAfterFilter = (d.data);

                    $scope.MainResultlist = $scope.MainResultlist.map(
                       item=> {
                           item["SType"] = GetBookingServiceNameDirective(item["SType"]);
                           item["Status"] = GetBookDisplayStatusDirective(item["Status"]);
                           return item;
                       }
                    );
                    $scope.MainResultlistAfterFilter = $scope.MainResultlistAfterFilter.map(
                        item=> {
                            item["SType"] = GetBookingServiceNameDirective(item["SType"]);
                            item["Status"] = GetBookDisplayStatusDirective(item["Status"]);
                            return item;
                        }
                    );

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

    function SetDataTable() {
        $('#CCUReport').DataTable().clear().destroy();
        $('#CCUReport').DataTable({

            "order": [],
            dom: 'Bfrtip',

            buttons: [

                {
                    extend: 'excelHtml5',
                    text: '<i class="fa fa-file-excel-o"></i>',
                    filename: function () {
                        var ReportName = "Corporate And Card Use Report"
                        var RptDetails = $scope.CorpCUReport.DateFrom + "-" + $scope.CorpCUReport.DateTo;
                        return ReportName + ' ( ' + RptDetails + ' ) '
                    },
                    sheetName: 'CCURptSheet',
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


            ],

            "columnDefs": [
                { "visible": false },
               {
                   "targets": 0,
                   visible: $scope.CCReportWise == 'Corporate' ? true : false,
               },
               {
                   "targets": 1,
                   visible: $scope.CCReportWise == 'Corporate' ? false : true,
               },
                 {
                     "targets": 4,
                     "className": "text-center",
                 },
                 {
                     "targets": 5,
                     "className": "text-center",
                 },
                  {
                      "targets": 8,
                      orderable: false,
                  },
                  {
                      "targets": 9,
                      orderable: false,
                  },
                  {
                      "targets": 10,
                      orderable: false,
                  },
                   {
                       "targets": 13,
                       "visible": $scope.IsShowSupplier == "true" ? true : false,
                   },
                 {
                     "targets": 14,
                     "className": "text-center",
                 },
                {
                    "targets": 15,
                    "className": "text-right",
                    "render": function (data, type, row) {
                        return row["NAmt"].toFixed(2);
                    },
                },
                 {
                     "targets": 16,
                     "className": "text-center",
                 },
                {
                    "targets": 17,
                    "className": "text-right",
                    "render": function (data, type, row) {
                        return row["SAmt"].toFixed(2);
                    },
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
                   { data: 'CName' },
                   { data: 'CUse' },
                   { data: 'VNo' },
                   { data: 'RefNo' },
                   { data: 'NORooms' },
                   { data: 'Nts' },
                   { data: 'NOPax' },
                   { data: 'Pax' },
                   { data: 'BookDate' },
                   { data: 'ChkIn' },
                   { data: 'ChkOut' },
                   { data: 'SName' },
                   { data: 'City' },
                    { data: 'SupName' },
                    { data: 'NCurr' },
                    { data: 'NAmt' },
                     { data: 'SCurr' },
                   { data: 'SAmt' }
            ],

        });

        $scope.HideColList = [];
        $scope.HideColList = GetHideColList();
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
    function ShowHideExcelColumns()
    {
        $scope.ExcelCollist = [0,1, 2, 3, 4, 5, 6, 7, 8, 9,10, 11, 12, 13, 14, 15, 16, 17];

        if ($scope.CCReportWise == 'Corporate') {
            $scope.ExcelCollist = [0, 2, 3, 4, 5, 6, 7, 8, 9,10, 11, 12, 13, 14, 15, 16, 17]

            if ($scope.IsShowSupplier != "true") {
                $scope.ExcelCollist = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17]
            }
        }
        else {
            $scope.ExcelCollist = [1, 2, 3, 4, 5, 6, 7, 8, 9,10, 11, 12, 13, 14, 15, 16, 17]

            if ($scope.IsShowSupplier != "true") {
                $scope.ExcelCollist = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,14, 15, 16, 17]
            }
        }
    }


    //Mail Click
    $scope.MailReport = function () {

        isvalid = true;
        var regexp = "^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$";
        if ($("#txtmailfrom").val() == "") {
            Alert.render("Please Enter From Mailaddress.", "txtmailfrom");
            isvalid = false;
            return false;
        }
        if ($("#txtmailfrom").val() != "") {
            if ($("#txtmailfrom").val().search(regexp) == -1) {
                Alert.render("Please Specify A Valid Email from  Address.", "txtmailfrom");
                isvalid = false;
                return false;
            }
        }
        if ($("#txtmailto").val() == "") {
            Alert.render("Please Enter To Mailaddress.", "txtmailfrom");
            return false;
        }
        if ($("#txtmailto").val() != "") {
            if ($("#txtmailto").val().search(regexp) == -1) {
                Alert.render("Please Specify A Valid Email to Address.", "txtmailto");
                isvalid = false;
                return false;

            }
        }
        if ($("#txtmailcc").val() != "") {
            if ($("#txtmailcc").val().search(regexp) == -1) {
                Alert.render("Please Specify A Valid Email Cc Address.", "txtmailcc");
                isvalid = false;
                return false;
            }
        }
        if (isvalid == true) {
            PopUpController.OpenPopup2("divPopup", "");
            $scope.SendMailDO.MailFrom = $("#txtmailfrom").val();
            $scope.SendMailDO.MailTo = $("#txtmailto").val()
            $scope.SendMailDO.MailCc = $("#txtmailcc").val()
            $scope.SendMailDO.Subject = $("#txtmailsubject").val();
            $scope.SendMailDO.ReportName = "CCUReport-" + " (" + $scope.CorpCUReport.DateFrom + " - " + $scope.CorpCUReport.DateTo + " )";

            $http({
                method: "post",
                url: "../Booking/ReportMailDesign",
                data: ({
                    AcctStatementList: $scope.MainResultlist,
                    SendMailDO: $scope.SendMailDO
                }),
                dataType: "json",
                headers: { "Content-Type": "application/json" }

            }).then(function (d) {

                if (d.data == "true") {
                    PopUpController.ClosePopup("divPopup", "");
                    $("#MailDiv").modal('hide');
                    Alert.render("Mail Send Successfully");
                }
                else {
                    PopUpController.ClosePopup("divPopup", "");
                    $("#MailDiv").modal('hide');
                    Alert.render("Mail Not Send");
                }

                //clear all 
                $("#txtmailfrom").val("");
                $("#txtmailto").val("")
                $("#txtmailcc").val("")
                $("#txtmailsubject").val("");



            }, function (error) {
                ErrorPopup.render('Error');
                PopUpController.ClosePopup("divPopup", "");
                $("#MailDiv").modal('hide');
                Alert.render("Sorry,Due to Some issue Mail Not Send Successfully");
            });
        }

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

    //onHide Popup Click
    $scope.HideColumns = function () {

        //Hide_Columns is comm. fun in CommonUtility.js
        Hide_Columns('CCUReport')
    }

    ////Sorting
    function SortingSetting() {

        $scope.SortColList = [];
        $scope.SortColList = GetHideColList();

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
        Apply_Sorting('CCUReport', $scope.SortDetails)
    }
    $scope.ClearSorting = function () {
        $scope.SortDetails = [];
        $scope.SortDetails = Clear_Sorting('CCUReport');
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

function GetHideColList() {
    var HideColList = [];

    if (GetE("CRW").checked) {
        HideColList.push("0~CName~Corporate Name");
    }
    else {
        HideColList.push("1~CUse~Card Use");
    }
    HideColList.push("2~VNo~Voucher No");
    HideColList.push("3~RefNo~Book Ref /Pos");
    HideColList.push("4~NORooms~No.Of Rooms");
    HideColList.push("5~Nts~No.Of Nts");
    HideColList.push("6~NOPax~No.Of Pax");
    HideColList.push("7~Pax~Pax Name");
    HideColList.push("8~BookDate~Booking Date");
    HideColList.push("9~ChkIn~CheckIn Date");
    HideColList.push("10~ChkOut~CheckOut Date");
    HideColList.push("11~SName~Service Name");
    HideColList.push("12~City~City Name");
    if (GetE("hdnIsShowSupplier").value == "true") {
        HideColList.push("13~SupName~Supplier Name");
    }
    HideColList.push("14~NCurr~Net Currency");
    HideColList.push("15~NAmt~Net Amount");
    HideColList.push("16~SCurr~Sell Currency");
    HideColList.push("17~SAmt~Sell Amount");

    return HideColList;
}

$(document).ready(function () {
    $(".date-cal").datepicker({ dateFormat: 'dd M yy', numberOfMonths: 2, });
    var table = $('#CCUReport').dataTable();
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
});





