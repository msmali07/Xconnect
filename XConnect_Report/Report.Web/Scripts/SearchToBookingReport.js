var app = angular.module('SearchAgentreportapp', []);


var bid = ""; var brtypeid = ""; var mid = ""; var mrtypeid = ""; var bid = ""; var Wsid = ""; var membertypeid = "";
var isvalid = true;
app.controller('SearchAgentreportCntr', ['$scope', '$http', '$window', '$rootScope', '$timeout', function ($scope, $http, $window, $rootScope, $timeout) {
    NgInit();
    function NgInit() {
        $scope.SearchAgentBookReport = SearchAgentBookReportDO();
        $scope.ReportFilter = ReportFilterDO();
        $scope.PostBooking = PostBookingDO();
        $scope.SendMailDO = SendMailDO();

        $scope.LoginMemberType = GetE("hdnLoginMemberTypeId").value;
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
        $scope.IsGetfromHome = false;



        $("#ddl_BR option:selected").text("All Branch");
        $("#ddl_WS option:selected").text("All Wholesaler");
        $("#ddl_AG option:selected").text("All Agent");



        $scope.SearchAgentBookReport.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
        $scope.SearchAgentBookReport.DateTo = ConvertCustomrangedate(new Date());


        //this is PostBooking Init()
        $scope.PostBooking = PostBooking_Init($scope.PostBooking, $scope.LoginMemberType)

        //this is On Post Booking change events
        $rootScope.$on("CallPostBooking", function (event) {
            $scope.PostBooking = Set_PostMemberDetails(event, $scope.PostBooking);

        });
        $("#demo").addClass("collapse in");

        //GetDetails();
        $scope.serachcounter = 0;

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
        $scope.SearchAgentBookReport.DateFrom = ConvertCustomrangedate(new Date())
        $scope.SearchAgentBookReport.DateTo = ConvertCustomrangedate(new Date())

        $scope.SearchAgentBookReport.BookingdateWise = $scope.serachstring.split('_')[3];
        $scope.SearchAgentBookReport.DateFrom = ($scope.serachstring.split('_')[4]);
        $scope.SearchAgentBookReport.DateTo = ($scope.serachstring.split('_')[5]);

        if ($scope.SearchAgentBookReport.BookingdateWise == "true") {
            $("#BDW").prop("checked", true);
        }
        else {
            $("#ADW").prop("checked", true);
        }

        if ($scope.serachstring.split('_')[1] == 0) {
            $scope.SearchAgentBookReport.MemberId = $scope.serachstring.split('_')[0];
            $scope.OnLoadPostMemberId = $scope.serachstring.split('_')[0];
            $scope.OnLoadReportCompanyName = $scope.serachstring.split('_')[2];
            $scope.IsGetfromHome = true;
        }
        else {
            $scope.SearchAgentBookReport.MemberId = $scope.serachstring.split('_')[1];
            $scope.OnLoadPostMemberId = $scope.serachstring.split('_')[1];
            $scope.OnLoadReportCompanyName = $scope.serachstring.split('_')[2];
            $("#hdnIsGetMemberdetails").val("true");
            $("#hdnMemberdetails").val($scope.SearchAgentBookReport.MemberId);
            $scope.IsGetfromHome = true;
        }
        if ($scope.LoginMemberType == "2" || $scope.LoginMemberType == "3") {
            $scope.OnLoadReportCompanyName = "All Agent"
        }
        else if ($scope.LoginMemberType == "4") {
            $scope.OnLoadReportCompanyName = $("#hdnLoginName").val();
        }



        $timeout(function () {

            angular.element('#btnReportSerach').triggerHandler('click');

        });
        $("#demo")[0].style.display = 'none';
        console.log($scope.SearchAgentBookReport);
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
            $scope.SearchAgentBookReport.DateFrom = $scope.CustomDateRangeFilter.split("~")[0];
            GetE("txtToDate").value = $scope.CustomDateRangeFilter.split("~")[1];
            $scope.SearchAgentBookReport.DateTo = $scope.CustomDateRangeFilter.split("~")[1];
        }
        else {
            GetE("txtFromDate").value = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            $scope.SearchAgentBookReport.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            GetE("txtToDate").value = ConvertCustomrangedate(new Date());
            $scope.SearchAgentBookReport.DateTo = ConvertCustomrangedate(new Date());
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
        $("#RptSummary")[0].style.display = "none";
        $("#RptHeaderDetails")[0].style.display = "none";
        $("#Noresultdiv")[0].style.display = "none";
        PopUpController.ClosePopup("divPopup", "");
        $("#HeaderSearchdiv").removeClass();
        $("#HeaderSearchdiv").addClass("col-lg-12 col-md-12 col-sm-12 col-xs-12 container-fluid padd-lft10 padd-rgt10");
        $scope.ModifySearch = false;

        if ($scope.SearchAgentBookReport.DateFrom == "") {

            Alert.render("Please Select Arrival-From Date", "txtFromDate");
            isvalid = false;
            return false;
        }

        if ($scope.SearchAgentBookReport.DateTo == "") {
            Alert.render("Please Select Arrival-To Date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ($scope.SearchAgentBookReport.DateFrom != "" && $scope.SearchAgentBookReport.DateTo != "") {
            var dtObj1 = GetSystemDate($scope.SearchAgentBookReport.DateFrom);
            var dtObj2 = GetSystemDate($scope.SearchAgentBookReport.DateTo);
        }

        if (($scope.SearchAgentBookReport.DateFrom != "" && $scope.SearchAgentBookReport.DateTo != "") && (dtObj1 > dtObj2)) {
            Alert.render("Arrival-From date can not be greater than Arrival-To date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ((diffDate(new Date($scope.SearchAgentBookReport.DateTo), new Date($scope.SearchAgentBookReport.DateFrom))) > 12.50) {
            Alert.render("Report Seraching Dates Should be Upto 12 Months", "txtToDate");
            isvalid = false;
            return false;
        }

        if ($("#ddl_AG").val()=="0") {
            Alert.render("Please Select Agent", "ddl_AG");
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
            $scope.SearchAgentBookReport.BookingdateWise = false;
        }
        if (document.getElementById('BDW').checked) {
            $scope.SearchAgentBookReport.BookingdateWise = true;
        }


        if ($scope.IsGetfromHome == true) {
            $scope.PostBooking.ReportCompanyName = $scope.OnLoadReportCompanyName;
            $scope.PostBooking.PostMemberId = $scope.OnLoadPostMemberId;
        }



        $scope.MemberDetails = $scope.PostBooking.Br_Id + "_" + $scope.PostBooking.Ws_Id + "_" + $scope.PostBooking.Ag_Id + "_" + $scope.PostBooking.ReportCompanyName + "_" + GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text;


        $scope.SearchAgentBookReport.MemberId = $scope.PostBooking.PostMemberId;
        $scope.SearchAgentBookReport.LoginUserId = (document.getElementById("hdnLoginUserId")).value;





        if (isvalid == true) {
            $scope.GetReportDetails();
        }
    }


    //getReportDetails on serach click
    $scope.GetReportDetails = function () {

        var ReportName = "Searched Agent Bookings Report";
        var popupdetail = $scope.PostBooking.ReportCompanyName + "~" + $scope.SearchAgentBookReport.DateFrom + "~" + $scope.SearchAgentBookReport.DateTo;
        PopUpController.OpenPopup1("divPopup", ReportName, popupdetail);

        $scope.ReportFilter.Status = $scope.FilterDOList.filter(item => item.Name == 'Status').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'Status')[0].Values) : "";
        $scope.ReportFilter.HotelName = $scope.FilterDOList.filter(item => item.Name == 'HotelName').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'HotelName')[0].Values) : "";
        $scope.ReportFilter.NRooms = $scope.FilterDOList.filter(item => item.Name == 'NRooms').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'NRooms')[0].Values) : "";
        $scope.ReportFilter.Nts = $scope.FilterDOList.filter(item => item.Name == 'Nts').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'Nts')[0].Values) : "";
        $scope.ReportFilter.City = $scope.FilterDOList.filter(item => item.Name == 'City').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'City')[0].Values) : "";

        $scope.ReportFilter.CustomDateOption = $("#ddl_CustomDateRange").val();;



        $("#demo").addClass("collapse in");


        $http({
            method: "post",
            url: "../Dashboard/GetSearchToBookingReport",
            data: ({
                SearchAgentBookingSearchReportDO: $scope.SearchAgentBookReport,
            }),
            dataType: "json",
            headers: { "Content-Type": "application/json" }

        }).then(function (d) {

            if (d.data["Data"] == undefined || d.data["Data"] == null) {
                SessionTimeout(); //this function in Commonutility js
            }
            else {
                if (d.data["Data"] != undefined || d.data["Data"] != null) {
                    if (d.data["Data"].length > 0) {

                        $scope.MainResultlist = (d.data["Data"]);
                        $scope.MainResultlistAfterFilter = (d.data["Data"]);
                        console.log(d.data["Data"]);

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



        }, function (error) {
            $scope.ModifySearch = false;
            $("#Errordiv")[0].style.display = "block";
            PopUpController.ClosePopup("divPopup", "");
        });


    }

    //Set DataTable
    function SetDataTable() {
        var groupColumn = 0; // Grouping by the first column, 'Agent'
        if ($scope.ReportFilter.GroupBy === "") {
            $('#SearchAgentBookReport').DataTable().clear().destroy();
            $scope.collapsedGroups = {}; // Store collapsed state for each group
            $('#SearchAgentBookReport').DataTable({
                "bInfo": false,
                "order": [],
                responsive: true,
                dom: 'Bfrtip',
                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: '<i class="fa fa-file-excel-o"></i> Export to Excel',
                        title: function () {
                            var ReportName = "Searched Agent Bookings Report";
                            var RptDetails = $scope.SearchAgentBookReport.DateFrom + "-" + $scope.SearchAgentBookReport.DateTo;
                            return ReportName + ' (' + RptDetails + ')';
                        },
                        sheetName: 'AgentBookingsReport',
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4] // Export these columns
                        },
                        customize: function (xlsx) {
                            // Customize the Excel export to handle nested grouping
                            var sheet = xlsx.xl.worksheets['sheet1.xml'];

                            // You can further customize the formatting here, such as adjusting the row height,
                            // adding merged cells, or styling.
                        }
                    },
                    {
                        extend: 'copyHtml5',
                        text: '<i class="fa fa-files-o"></i> Copy',
                        titleAttr: 'Copy',
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4]
                        }
                    }
                ],
                "autoWidth": false,
                "columnDefs": [
                    {
                        "targets": 0,  // Assuming "Agent" is in the first column
                        "visible": false, // Hide the column
                    },
                    {
                        "targets": 4,
                        "className": "text-center",
                    }
                ],
                searching: false,
                paging: false,
                data: $scope.MainResultlistAfterFilter,
                "pageLength": 30,
                "deferRender": true,
                select: true,
                columns: [
                    { data: 'AgName' }, // Hidden column for grouping
                    { data: 'City', title: 'City' },
                    { data: 'SearchCount', title: 'Search' },
                    { data: 'BCount', title: 'Bookings' },
                    { data: 'Ratio', title: 'Ratio' }
                ],
                "orderFixed": [[0, 'asc']],
                rowGroup: {
                    dataSrc: 'AgName',
                    startRender: function (rows, group) {
                        // Assume branch name is in each row of the grouped data
                        var branchName = rows.data()[0].BrName; // Retrieve the branch name from the first row of the group

                        var totalSearch = rows.data().pluck('SearchCount').reduce((a, b) => a + b, 0);
                        var totalBooking = rows.data().pluck('BCount').reduce((a, b) => a + b, 0);
                        var ratio = (totalBooking / totalSearch) * 100 || 0;

                        var collapsed = $scope.collapsedGroups[group] !== undefined ? $scope.collapsedGroups[group] : true;
                        rows.nodes().each(function (r) {
                            r.style.display = collapsed ? 'none' : '';
                        });

                        var toggleClass = collapsed ? 'fa-plus-square' : 'fa-minus-square';

                        // Display branch name in parentheses above the agent name
                        return $('<tr/>')
                            .append('<td colspan="4">' +
                                '<span class="fa fa-fw ' + toggleClass + ' toggler"></span>' +
                                ' (' + branchName + ') ' + group + ' - Search: ' + totalSearch + ', Bookings: ' + totalBooking + ', Ratio: ' + ratio.toFixed(2) + '%' +
                                '</td>')
                            .attr('data-name', group)
                            .toggleClass('collapsed', collapsed);
                    }
                },
                "footerCallback": function (row, data, start, end, display) {
                    var api = this.api();
                    var totalSearch = api.column(2).data().reduce((a, b) => a + b, 0);
                    var totalBookings = api.column(3).data().reduce((a, b) => a + b, 0);
                    var totalRatio = totalBookings === 0 ? 0 : ((totalBookings / totalSearch) * 100).toFixed(2);
                    $(api.column(1).footer()).html('Total:');
                    $(api.column(2).footer()).html(totalSearch);
                    $(api.column(3).footer()).html(totalBookings);
                    $(api.column(4).footer()).html(totalRatio + '%');
                }
            });

            // Event listener to handle group row click for expanding/collapsing
            $('#SearchAgentBookReport tbody').on('click', 'tr.dtrg-start', function () {
                var name = $(this).data('name');

                // Toggle the collapsed state for the group
                $scope.collapsedGroups[name] = !$scope.collapsedGroups[name];

                // Redraw the table to apply the collapsed state
                $('#SearchAgentBookReport').DataTable().draw(false);
            });
        }
        $scope.HideColList = GetHideColList($scope.ReportFilter.GroupBy);
        $('#ddlHide').empty().multiselect('destroy');
        $.each($scope.HideColList, function (index) {
            $('#ddlHide').append($('<option></option>').val($scope.HideColList[index].split('~')[0]).html($scope.HideColList[index].split('~')[2]));
        });
        $('#ddlHide').multiselect({
            includeSelectAllOption: true,
            enableFiltering: true,
            buttonWidth: 250
        });
        SortingSetting();
    }



    //onHide Popup Click
    $scope.HideColumns = function () {
        //Hide_Columns is comm. fun in CommonUtility.js
        Hide_Columns('SearchAgentBookReport')
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
        Apply_Sorting('SearchAgentBookReport', $scope.SortDetails)


    }
    $scope.ClearSorting = function () {
        $scope.SortDetails = [];
        $scope.SortDetails = Clear_Sorting('SearchAgentBookReport');
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

    //ReportSummry
    function GetReportSummary() {
        $("#RptDetails")[0].style.display = "none";
        $("#RptSummary")[0].style.display = "block";

        $scope.SummaryList = groupBy($scope.MainResultlistAfterFilter, 'AgName');
        $scope.TotalSummaryList = [];

        $.each($scope.SummaryList, function (item) {

            var Bookingcount = 0;
            var serachingcount = 0;
            var ratio = 0;

            $.each($scope.SummaryList[item], function (i) {

                Bookingcount = $scope.SummaryList[item].filter(a => a.Status == 'Booked').length;
                serachingcount = $scope.SummaryList[item].length;
                ratio = ((Bookingcount / serachingcount) * 100).toFixed(2);



            });
            $scope.TotalSummaryList.push({ AgName: item, TotalBookings: Bookingcount, TotalSeraching: serachingcount, Ratio: ratio });
        });


        $scope.TotalSummaryList = sortByKeyDesc($scope.TotalSummaryList, 'TotalSeraching')


        $('#SearchAgentBookSummaryReport').DataTable().clear().destroy();
        $('#SearchAgentBookSummaryReport').DataTable({

            dom: 'Bfrtip',

            buttons: [


                {
                    extend: 'excelHtml5',
                    text: '<i class="fa fa-file-excel-o"></i>',
                    filename: function () {
                        var ReportName = "Searched Agent Bookings Summary Report"
                        var RptDetails = $scope.SearchAgentBookReport.DateFrom + "-" + $scope.SearchAgentBookReport.DateTo;
                        return ReportName + ' ( ' + RptDetails + ' ) '
                    },
                    sheetName: 'SearchedAgentBookingsSummaryRptSheet',
                    title: null,
                    footer: true


                },
                {
                    extend: 'copyHtml5',
                    text: '<i class="fa fa-files-o"></i>',
                    titleAttr: 'Copy',
                    footer: true

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
                    "targets": 0,
                    "orderable": "false",

                },
                {
                    "targets": 1,
                    "className": "text-right",
                    "orderable": "true",
                },
                {
                    "targets": 2,
                    "className": "text-right",
                    "orderable": "true",


                },
                {
                    "targets": 3,
                    "className": "text-right",
                    "orderable": "true",
                },


            ],

            searching: false,
            paging: false,
            data: $scope.TotalSummaryList,
            order: [1, 'dsc'],
            "deferRender": true,
            "bInfo": false,
            columns: [
                { data: 'AgName' },
                { data: 'TotalSeraching' },
                { data: 'TotalBookings' },
                { data: 'Ratio' }


            ],
            "footerCallback": function (row, data, start, end, display) {
                var api = this.api(), data;


                $scope.TotalS = api
                    .column(1)
                    .data()
                    .reduce(function (a, b) {
                        return (a) + (b);
                    }, 0);
                $scope.TotalB = api
                    .column(2)
                    .data()
                    .reduce(function (a, b) {
                        return (a) + (b);
                    }, 0);


                // Update footer
                $(api.column(0).footer()).html(
                    '<span><b>Total</b> </span>'
                );
                $(api.column(1).footer()).html(
                    '<span>' + $scope.TotalS + '</span>'
                );
                $(api.column(2).footer()).html(
                    '<span>' + $scope.TotalB + '</span>'
                );
                $(api.column(3).footer()).html(
                    '<span>' + (($scope.TotalB / $scope.TotalS) * 100).toFixed(2) + ' %' + '</span>'
                );


            }
        });
    }

    $scope.backtoreport = function () {
        $("#RptDetails")[0].style.display = "block";
        $("#RptSummary")[0].style.display = "none";
    }

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

    //HideColList.push("0~SearchDate~Search Date");
    //HideColList.push("1~ChkIn~Check In Date");
    //HideColList.push("2~ChkOut~Check Out Date");
    //HideColList.push("3~City~City");
    //HideColList.push("4~Nts~Nights");
    //HideColList.push("5~NRooms~No of Rooms");
    //HideColList.push("6~RoomCng~Room Config");
    //HideColList.push("7~HotelName~Hotel Name");
    //HideColList.push("8~UserName~Search by");
    //HideColList.push("9~Status~Status");



    if (GroupBy != "") {
        var NewHideColList = [];
        switch (GroupBy) {


        }

    }
    NewHideColList = HideColList;


    return NewHideColList;


}

$(document).ready(function () {

    $(".date-cal").datepicker({ dateFormat: 'dd M yy', numberOfMonths: 2, });
    var table = $('#SearchAgentBookReport').dataTable();
    //for sorting icon clear custom sorting list
    table.on('click', 'th', function () {
        var info = table.fnSettings().aaSorting;
        var idx = info[0][0];
        //alert(idx);
        //alert($(this).attr('class'));
        if ($(this).attr('class') == 'sorting_asc' || $(this).attr('class') == 'sorting_desc' || $(this).attr('class') == 'sorting' || $(this).attr('class') == 'text-center sorting_asc' || $(this).attr('class') == 'text-center sorting_desc' || $(this).attr('class') == 'text-right sorting_asc' || $(this).attr('class') == 'text-right sorting_desc') {
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




