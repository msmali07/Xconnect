var app = angular.module('AgApiOut', []);


var bid = ""; var brtypeid = ""; var mid = ""; var mrtypeid = ""; var bid = ""; var Wsid = ""; var membertypeid = "";
var isvalid = true;
app.controller('AgApiOutCntr', ['$scope', '$http', '$window', '$rootScope', '$timeout', function ($scope, $http, $window, $rootScope, $timeout) {
    NgInit();

    function NgInit() {
        $scope.AgencyReport = AgencyReportDO();
        $scope.ReportFilter = ReportFilterDO();
        $scope.PostBooking = PostBookingDO();
        $scope.SendMailDO = SendMailDO();

        $scope.LoginMemberType = GetE("hdnLoginMemberTypeId").value;
        $scope.CCode = GetE("hdnCCode").value;
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
        $scope.JsonObj = [];
        $scope.mycolumns = [];
        $scope.columnNames = [];

        SortingSetting();
        ShowHideExcelColumns();


        $("#ddl_BR option:selected").text("All Branch");

        $("#ddl_AG option:selected").text("All Agent");



        $scope.AgencyReport.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
        $scope.AgencyReport.DateTo = ConvertCustomrangedate(new Date());

        //this is PostBooking Init()
        $scope.PostBooking = PostBooking_Init($scope.PostBooking, $scope.LoginMemberType)

        //this is On Post Booking change events
        $rootScope.$on("CallPostBooking", function (event) {
            $scope.PostBooking = Set_PostMemberDetails(event, $scope.PostBooking);

        });
        $("#demo").addClass("collapse in");

        GetDetails();
    }



    //select Customdate option
    Customdaterangelist1 = Customdaterangelist();

    $scope.DateRangeList = Customdaterangelist1;

    $("#ddl_CustomDateRange").change(function () {
        $scope.CustomDateRangeFilter = $("#ddl_CustomDateRange").val();

        if ($scope.CustomDateRangeFilter != "" && $scope.CustomDateRangeFilter != "0") {
            GetE("txtFromDate").value = $scope.CustomDateRangeFilter.split("~")[0];
            $scope.AgencyReport.DateFrom = $scope.CustomDateRangeFilter.split("~")[0];
            GetE("txtToDate").value = $scope.CustomDateRangeFilter.split("~")[1];
            $scope.AgencyReport.DateTo = $scope.CustomDateRangeFilter.split("~")[1];
        }
        else {
            GetE("txtFromDate").value = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            $scope.AgencyReport.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            GetE("txtToDate").value = ConvertCustomrangedate(new Date());
            $scope.AgencyReport.DateTo = ConvertCustomrangedate(new Date());
        }

    });


    $scope.ShowModifyBtn = function () {
        $("#demo")[0].style.display = "none";
        $scope.ModifySearch = false;

    }


    function setPostMemberDetails(event) {

        switch (this.event.target.id) {
            case "ddl_BR":
                $scope.PostBooking.Ag_Id = 0;
                $scope.PostBooking.Ws_Id = 0;
                $scope.PostBooking.Br_Id = (this.event.target.value);
                $scope.PostBooking.ReportCompanyName = GetE("ddl_BR").options[GetE("ddl_BR").selectedIndex].text;
                $scope.PostBooking.MemberTypeSelected = 0;
                $scope.PostBooking.PostMemberId = (this.event.target.value);
                $scope.PostBooking.PostParentMemberId = this.event.target.value;
                document.getElementById("Wsdiv").style.display = "none";
                document.getElementById("agentdiv").style.display = "none";
                break;

        }
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

    function GetDetails() {
        $scope.serachstring = atob(getUrlVars()["S"]);
        console.log($scope.serachstring);


        $scope.AgencyReport.DateFrom = ConvertCustomrangedate(new Date())
        $scope.AgencyReport.DateTo = ConvertCustomrangedate(new Date())
        $scope.AgencyReport.BookingdateWise = $scope.serachstring.split('_')[3];
        $scope.AgencyReport.InTerms = ($scope.serachstring.split('_')[5]);
        $scope.AgencyReport.DateFrom = ($scope.serachstring.split('_')[6]);
        $scope.AgencyReport.DateTo = ($scope.serachstring.split('_')[7]);

        if ($scope.AgencyReport.BookingdateWise == "true") {
            $("#BDW").prop("checked", true);
        }
        else {
            $("#ADW").prop("checked", true);
        }



        if ($scope.serachstring.split('_')[1] == 0) //for all branch
        {
            $scope.AgencyReport.MemberId = $scope.serachstring.split('_')[0];
            $scope.PostBooking.PostMemberId = $scope.serachstring.split('_')[0];
            $scope.PostBooking.ReportCompanyName = $scope.serachstring.split('_')[2];

            $scope.OnLoadPostMemberId = $scope.serachstring.split('_')[0];
            $scope.OnLoadReportCompanyName = $scope.serachstring.split('_')[2];
            $scope.IsGetfromHome = true;
        }
        else {
            $scope.AgencyReport.MemberId = $scope.serachstring.split('_')[1];
            $scope.PostBooking.PostMemberId = $scope.serachstring.split('_')[1];
            $scope.PostBooking.ReportCompanyName = $scope.serachstring.split('_')[2];

            $scope.OnLoadPostMemberId = $scope.serachstring.split('_')[1];
            $scope.OnLoadReportCompanyName = $scope.serachstring.split('_')[2];

            $scope.IsGetfromHome = true;
            $("#hdnIsGetMemberdetails").val("true");
            $("#hdnMemberdetails").val($scope.AgencyReport.MemberId);


        }

        if ($scope.LoginMemberType == "2" || $scope.LoginMemberType == "3") {
            $scope.OnLoadReportCompanyName = "All Agent"
        }

        $timeout(function () {

            angular.element('#btnsearch').triggerHandler('click');

        });
        $("#demo")[0].style.display = 'none';
        console.log($scope.AgencyReport);
    }

    //select grouping option
    $("#ddl_Grp").change(function () {
        $scope.ReportFilter.GroupBy = $("#ddl_Grp").val().split('~')[0];
        $scope.GroupingName = $("#ddl_Grp").val().split('~')[1];
    });

    $("#ddl_BR").change(function () {

        $scope.IsGetfromHome = false;

    });
    $("#ddl_WS").change(function () {

        $scope.IsGetfromHome = false;

    });
    $("#ddl_AG").change(function () {

        $scope.IsGetfromHome = false;

    });
    //Validation and setparam on serach click
    $scope.SearchReportClick = function () {

        var isvalid = true;
        $scope.OnlyClearAll();
        $("#AgeDetails")[0].style.display = "none";
        $("#RptHeaderDetails")[0].style.display = "none";
        $("#Noresultdiv")[0].style.display = "none";
        PopUpController.ClosePopup("divPopup", "");
        //$("#HeaderSearchdiv").removeClass();
        //$("#HeaderSearchdiv").addClass("col-lg-12 col-md-12 col-sm-12 col-xs-12 container-fluid padd-lft10 padd-rgt10");
        $scope.ModifySearch = false;

        if ($scope.AgencyReport.DateFrom == "") {

            Alert.render("Please Select Arrival-From Date", "txtFromDate");
            isvalid = false;
            $scope.ModifySearch = true;
            return false;
        }

        if ($scope.AgencyReport.DateTo == "") {
            Alert.render("Please Select Arrival-To Date", "txtToDate");
            isvalid = false;
            $scope.ModifySearch = true;
            return false;
        }
        if ($scope.AgencyReport.DateFrom != "" && $scope.AgencyReport.DateTo != "") {
            var dtObj1 = GetSystemDate($scope.AgencyReport.DateFrom);
            var dtObj2 = GetSystemDate($scope.AgencyReport.DateTo);
        }

        if (($scope.AgencyReport.DateFrom != "" && $scope.AgencyReport.DateTo != "") && (dtObj1 > dtObj2)) {
            Alert.render("Arrival-From date can not be greater than Arrival-To date", "txtToDate");
            isvalid = false;
            $scope.ModifySearch = true;
            return false;
        }
        if ((diffDate(new Date($scope.AgencyReport.DateTo), new Date($scope.AgencyReport.DateFrom))) > 12.50) {
            Alert.render("Report Seraching Dates Should be Upto 12 Months", "txtToDate");
            isvalid = false;
            $scope.ModifySearch = true;
            return false;
        }

        //PostBookingSetting
        $scope.PostBooking = PostBooking_Setting($scope.PostBooking, $scope.LoginMemberType)
        //if ($scope.CCode == 1) {
        //    if ($scope.LoginMemberType == 1 && GetE("ddl_BR").options[GetE("ddl_BR").selectedIndex].text == "Select Branch") {
        //        Alert.render("Select Branch to Post Booking", "ddl_BR");
        //        isvalid = false;
        //        $scope.ModifySearch = true;
        //        return false;
        //    }
        //}

        if ($scope.PostBooking.PostMemberId == "0") {
            if (GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text != "All Agent") {
                Alert.render("Select Member to Post Booking", "ddl_BR");
                isvalid = false;
                $scope.ModifySearch = true;
                return false;
            }
        }



        if (document.getElementById('ADW').checked) {
            $scope.AgencyReport.BookingdateWise = false;
        }
        if (document.getElementById('BDW').checked) {
            $scope.AgencyReport.BookingdateWise = true;
        }



        if ($scope.IsGetfromHome == true) {
            $scope.PostBooking.ReportCompanyName = $scope.OnLoadReportCompanyName;
            $scope.PostBooking.PostMemberId = $scope.OnLoadPostMemberId;
        }


        $scope.MemberDetails = $scope.PostBooking.Br_Id + "_" + $scope.PostBooking.Ws_Id + "_" + $scope.PostBooking.Ag_Id + "_" + $scope.PostBooking.ReportCompanyName + "_" + GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text;


        $scope.AgencyReport.MemberId = $scope.PostBooking.PostMemberId;
        $scope.AgencyReport.LoginUserId = (document.getElementById("hdnLoginUserId")).value;





        if (isvalid == true) {
            $scope.GetReportDetails();
        }
    }

    function changeMe() {
        console.log("Change event triggered.");
    }

    //getReportDetails on serach click
    $scope.GetReportDetails = function () {

        var popupdetail = $scope.PostBooking.ReportCompanyName + "~" + $scope.AgencyReport.DateFrom + "~" + $scope.AgencyReport.DateTo;
        PopUpController.OpenPopup1("divPopup", "Agency Activity Report", popupdetail);
        $scope.ReportFilter.CustomDateOption = $("#ddl_CustomDateRange").val();

        $("#divhdeading")[0].style.display = "block";
        $("#demo")[0].style.display = "none";
        //$("#btnsearch")[0].style.display = "none";
        $("#HeaderSearchdiv").removeClass();
        $("#HeaderSearchdiv").addClass("col-lg-12 col-md-12 col-sm-12 col-xs-12 container-fluid padd-lft10 padd-rgt10");
        $("#demo").addClass("collapse in");

        $http({
            method: "post",
            url: "../Dashboard/GetAgencyApiOutDetail",
            data: ({
                AgencySearchReportDO: $scope.AgencyReport,
            }),
            dataType: "json",
            headers: { "Content-Type": "application/json" }

        }).then(function (d) {

            if (d.data != undefined || d.data != null) {
                if (d.data.length > 0) {

                    $scope.MainResultlist = (d.data);
                    $scope.MainResultlistAfterFilter = (d.data);
                    $scope.JsonObj = $scope.MainResultlistAfterFilter;
                    $scope.columnNames = Object.keys($scope.JsonObj[0]);
                    $scope.mycolumns = $scope.columnNames.map(function (column) {
                        return { data: column.includes('.') ? column.split('.') : column, title: column };
                    });

                    console.log($scope.MainResultlistAfterFilter.length);
                    SetDataTable();
                    $scope.ModifySearch = false;
                    $("#AgeDetails")[0].style.display = "block";
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

    //Modify Button for
    $scope.ShowFormClick = function () {
        $("#demo")[0].style.display = "block";
        $("#Noresultdiv")[0].style.display = "none";
        $("#Errordiv")[0].style.display = "none";
    }

    function SetDataTable() {
        if ($.fn.DataTable.isDataTable('#AgencyReport')) {
            $('#AgencyReport').DataTable().clear().destroy();
        }

        let theadContent = '<tr>';
        $scope.columnNames.forEach(column => {
            theadContent += `<th>${column}</th>`;
        });
        theadContent += '</tr>';
        $('#AgencyReport thead').html(theadContent);

        $scope.mycolumns = $scope.columnNames.map(column => {
            return { data: column, title: column };
        });

        $('#AgencyReport').DataTable({
            data: $scope.JsonObj,
            columns: $scope.mycolumns,
            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: '<i class="fa fa-file-excel-o"></i>',
                    filename: function () {
                        return `AgencyActivityReport (${$scope.AgencyReport.DateFrom} - ${$scope.AgencyReport.DateTo})`;
                    },
                    exportOptions: {
                        columns: ':visible'
                    }
                },
                {
                    extend: 'copyHtml5',
                    text: '<i class="fa fa-files-o"></i>',
                    exportOptions: {
                        columns: ':visible'
                    }
                },
                {
                    text: '<span class="cust-dt-button">Column Visibility</span>',
                    action: function () {
                        $("#hidecoldiv").modal("show");
                    }
                }
            ],
            paging: false,
            searching: false,
            autoWidth: false,
            order: [],
            columnDefs: [
                { targets: '_all', className: 'dt-center' }
            ]
        });


        if ($scope.filter != true) {
            $('#AgencyReport tbody').on('click', 'tr.dtrg-start', function () {
                var name = $(this).data('name');

                $scope.collapsedGroups[name] = !$scope.collapsedGroups[name];

                $('#AgencyReport').DataTable().draw(false);

                $("#btncollase").removeAttr("disabled");
                $("#btnExpand").removeAttr("disabled");
                console.log($scope.collapsedGroups);
            });
        }

        // Add event listener for opening and closing details
        $('#ConReport tbody').on('click', 'td.details-control', function () {
            var tr = $(this).closest('tr');
            var row = table.row(tr);

            var collapsed = !!$scope.collapsedGroups[group];

            rows.nodes().each(function (r) {
                //   r.style.display = collapsed ? 'none' : '';
                r.style.display = collapsed ? '' : 'none';
            });
        });
        $scope.HideColList = [];




        $('#ddlHide').empty();
        $('#ddlHide option').remove();
        $('#ddlHide').multiselect('destroy');

        if ($scope.columnNames.length > 0) {
            $scope.columnNames.forEach((columnName, index) => {
                $('#ddlHide').append($('<option></option>').val(index).html(columnName));

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

        $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

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
        $("#AgeDetails")[0].style.display = "block";
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

    //onHide Popup Clicksrno
    $scope.HideColumns = function () {

        //Hide_Columns is comm. fun in CommonUtility.js
        Hide_Columns('AgencyReport')

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
        Apply_Sorting('AgencyReport', $scope.SortDetails)

    }
    $scope.ClearSorting = function () {
        $scope.SortDetails = [];
        $scope.SortDetails = Clear_Sorting('AgencyReport');
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

function GetHideColList(GroupBy) {
    var HideColList = [];


    HideColList.push("0~Agency Name~Agency Name");
    HideColList.push("1~Branch Name~Branch Name");
    HideColList.push("2~TotalHits~TotalHits");
    HideColList.push("3~HSearchByCity~HSearchByCity");
    HideColList.push("4~HSearchByHCodes~HSearchByHCodes");
    HideColList.push("5~HSearchByHotelCode_V2_S~HSearchByHotelCode_V2_S");
    HideColList.push("6~HSearchByHotelCode_V2_M~HSearchByHotelCode_V2_M");
    HideColList.push("7~HPreBooking~HPreBooking");
    HideColList.push("8~HCancelBooking~HCancelBooking");
    HideColList.push("9~HCreateBooking~HCreateBooking");
    HideColList.push("10~HVoucherBooking~HVoucherBooking");
    HideColList.push("11~GetCountryList~GetCountryList");
    HideColList.push("12~GetCityList~GetCityList");
    HideColList.push("13~GetHInfo~GetHInfo");




    NewHideColList = HideColList;


    return NewHideColList;


}

$(document).ready(function () {

    $("#BookingReport").addClass("active");
    $(".date-cal").datepicker({ dateFormat: 'dd M yy', numberOfMonths: 2, });


    var $table = $('#AgencyReport');

    // Clone the header
    var $headerClone = $table.find('thead').clone();

    // Create a fixed header div
    var $fixedHeader = $('<div class="fixed-header"></div>').append($headerClone);

    // Append the fixed header above the table
    $table.before($fixedHeader);

    // Adjust the fixed header on scroll
    $(window).on('scroll', function () {
        var scrollTop = $(this).scrollTop();
        if (scrollTop > $table.offset().top) {
            $fixedHeader.css({
                display: 'block',
                position: 'fixed',
                top: '0',
                left: $table.offset().left,
                width: $table.width()
            });
        } else {
            $fixedHeader.hide();
        }
    });

});

