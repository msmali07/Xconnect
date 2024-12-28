var app = angular.module('Areportapp', []);


var bid = ""; var brtypeid = ""; var mid = ""; var mrtypeid = ""; var bid = ""; var Wsid = ""; var membertypeid = "";
var isvalid = true;
app.controller('AreportCntr', ['$scope', '$http', '$window', '$rootScope', 'Excel', '$timeout', function ($scope, $http, $window, $rootScope, Excel, $timeout) {
    NgInit();

    function NgInit() {
        $scope.AccReport = AccountReportDO();
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
        $scope.SortColNo = [];
        $scope.MainResultlistAfterFilter = [];
        $scope.ShowddlFilterList = [];
        $scope.FilterDOList = [];
        $scope.FilterTypeActive = "";
        $scope.selectedArray = "";
        $scope.OldSelectedfilterArrayValues = "";
        SortingSetting();

        $("#ddl_BR option:selected").text("All Branch");
        //   $("#ddl_WS option:selected").text("All Wholesaler");
        $("#ddl_AG option:selected").text("All Agent");



        $scope.AccReport.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
        $scope.AccReport.DateTo = ConvertCustomrangedate(new Date());

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
            $scope.AccReport.DateFrom = $scope.CustomDateRangeFilter.split("~")[0];
            GetE("txtToDate").value = $scope.CustomDateRangeFilter.split("~")[1];
            $scope.AccReport.DateTo = $scope.CustomDateRangeFilter.split("~")[1];
        }
        else {
            GetE("txtFromDate").value = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            $scope.AccReport.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            GetE("txtToDate").value = ConvertCustomrangedate(new Date());
            $scope.AccReport.DateTo = ConvertCustomrangedate(new Date());
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

        if ($scope.AccReport.DateFrom == "") {

            Alert.render("Please Select Arrival-From Date", "txtFromDate");
            isvalid = false;
            return false;
        }

        if ($scope.AccReport.DateTo == "") {
            Alert.render("Please Select Arrival-To Date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ($scope.AccReport.DateFrom != "" && $scope.AccReport.DateTo != "") {
            var dtObj1 = GetSystemDate($scope.AccReport.DateFrom);
            var dtObj2 = GetSystemDate($scope.AccReport.DateTo);
        }

        if (($scope.AccReport.DateFrom != "" && $scope.AccReport.DateTo != "") && (dtObj1 > dtObj2)) {
            Alert.render("Arrival-From date can not be greater than Arrival-To date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ((diffDate(new Date($scope.AccReport.DateTo), new Date($scope.AccReport.DateFrom))) > 12.50) {
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
            $scope.AccReport.BookingdateWise = false;
        }
        if (document.getElementById('BDW').checked) {
            $scope.AccReport.BookingdateWise = true;
        }






        $scope.MemberDetails = $scope.PostBooking.Br_Id + "_" + $scope.PostBooking.Ws_Id + "_" + $scope.PostBooking.Ag_Id + "_" + $scope.PostBooking.ReportCompanyName + "_" + GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text;


        $scope.AccReport.MemberId = $scope.PostBooking.PostMemberId;
        $scope.AccReport.LoginUserId = (document.getElementById("hdnLoginUserId")).value;





        if (isvalid == true) {
            $scope.GetReportDetails();
        }
    }


    //getReportDetails on serach click
    $scope.GetReportDetails = function () {

        var popupdetail = $scope.PostBooking.ReportCompanyName + "~" + $scope.AccReport.DateFrom + "~" + $scope.AccReport.DateTo;
        PopUpController.OpenPopup1("divPopup", "Account Report", popupdetail);

        $scope.ReportFilter.Status = $scope.FilterDOList.filter(item => item.Name == 'Status').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'Status')[0].Values) : "";
        $scope.ReportFilter.SType = $scope.FilterDOList.filter(item => item.Name == 'SType').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'SType')[0].Values) : "";
        $scope.ReportFilter.AgName = $scope.FilterDOList.filter(item => item.Name == 'AgName').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'AgName')[0].Values) : "";
        $scope.ReportFilter.AgCity = $scope.FilterDOList.filter(item => item.Name == 'AgCity').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'AgCity')[0].Values) : "";
        $scope.ReportFilter.AgCountry = $scope.FilterDOList.filter(item => item.Name == 'AgCountry').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'AgCountry')[0].Values) : "";

        $scope.ReportFilter.Nts = $scope.FilterDOList.filter(item => item.Name == 'Nts').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'Nts')[0].Values) : "";
        $scope.ReportFilter.Pax = $scope.FilterDOList.filter(item => item.Name == 'Pax').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'Pax')[0].Values) : "";
        $scope.ReportFilter.SName = $scope.FilterDOList.filter(item => item.Name == 'SName').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'SName')[0].Values) : "";
        $scope.ReportFilter.SAmt = $scope.FilterDOList.filter(item => item.Name == 'SAmt').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'SAmt')[0].Values) : "";

        $scope.ReportFilter.AGPay = $scope.FilterDOList.filter(item => item.Name == 'AGPay').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'AGPay')[0].Values) : "";

        $scope.ReportFilter.BRPay = $scope.FilterDOList.filter(item => item.Name == 'BRPay').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'BRPay')[0].Values) : "";


        $scope.ReportFilter.CustomDateOption = $("#ddl_CustomDateRange").val();;



        $("#demo").addClass("collapse in");

        $http({
            method: "post",
            url: "../Booking/GetReportDetail",
            data: ({
                AccSearchReportDO: $scope.AccReport,
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
                            item["SType"] = GetBookingServiceNameDirective(item["SType"]);
                            item["Status"] = GetBookDisplayStatusDirective(item["Status"]);
                            return item;
                        }
                    );
                    $scope.MainResultlistAfterFilter = $scope.MainResultlistAfterFilter.map(
                        item => {
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

    //Modify Button for
    $scope.ShowModifyClick = function () {    
        $("#Noresultdiv")[0].style.display = "none";
        $("#Errordiv")[0].style.display = "none";
    }

    function SetDataTable() {
        if ($scope.ReportFilter.GroupBy == "") {



            $('#AccountReport').DataTable().clear().destroy();
            $('#AccountReport').DataTable({

                "order": [],
                dom: 'Bfrtip',

                buttons: [

                    {
                        extend: 'excelHtml5',
                        text: '<i class="fa fa-file-excel-o"></i>',
                        filename: function () {
                            var ReportName = "Account Report"
                            var RptDetails = $scope.AccReport.DateFrom + "-" + $scope.AccReport.DateTo;
                            return ReportName + ' ( ' + RptDetails + ' ) '
                        },
                        sheetName: 'AccountRptSheet',
                        title: null,
                        exportOptions: {

                            columns: ($scope.LoginMemberType == "4") ? [0, 1, 2, 3, 4, 5, 6, 8, 11, 15, 16, 17, 18] : (($scope.LoginMemberType == "1") ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18])


                        }
                    },
                    {
                        extend: 'copyHtml5',
                        text: '<i class="fa fa-files-o"></i>',
                        titleAttr: 'Copy',
                        exportOptions: {
                            columns: ($scope.LoginMemberType == "4") ? [0, 1, 2, 3, 4, 5, 6, 8, 11, 15, 16, 17, 18] : (($scope.LoginMemberType == "1") ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18])
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
                    //{
                    //    text: '<i class="fa fa-envelope"></i>',
                    //    titleAttr: 'Mail',
                    //    action: function (e, dt, node, config) {
                    //        $("#txtmailfrom").val("");
                    //        $("#txtmailto").val("")
                    //        $("#txtmailcc").val("")
                    //        $("#txtmailsubject").val("");
                    //        $scope._MailSubject = "Account Report From" + " (" + $scope.AccReport.DateFrom + " To " + $scope.AccReport.DateTo + " )";
                    //        $scope._Attachment = "AccountReport-" + " (" + $scope.AccReport.DateFrom + " - " + $scope.AccReport.DateTo + " )" + ".Pdf";                            
                    //        $("#MailDiv").modal('show');
                    //        $("#txtmailsubject").val($scope._MailSubject);
                    //        $("#_Attachment")[0].innerHTML=$scope._Attachment;
                    //    }
                    //}

                ],


                "columnDefs": [
                    { "visible": false },
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
                        "className": "text-center",
                    },
                    {
                        "targets": 5,
                        orderable: false,
                    },
                    {
                        "targets": 7,
                        "className": "text-left",
                        "visible": $scope.LoginMemberType == "4" ? false : true,
                    },
                    {
                        "targets": 8,
                        orderable: false,
                    },
                    {
                        "targets": 9,
                        "className": "text-left",
                        "visible": $scope.LoginMemberType == "4" ? false : true,
                    },
                    {
                        "targets": 10,
                        "className": "text-left",
                        "visible": $scope.LoginMemberType == "4" ? false : true,
                    },

                    {
                        "targets": 11,
                        "className": "text-right",
                        "render": function (data, type, row) {
                            return row["SAmt"].toFixed(2);
                        },
                    },
                    {
                        "targets": 12,
                        "className": "text-center",
                    },
                    {
                        "targets": 13,
                        "className": "text-right",
                        "visible": ($scope.LoginMemberType == "1") ? true : false,
                        "render": function (data, type, row) {
                            return row["BRPay"].toFixed(2);
                        },
                    },
                    {
                        "targets": 14,
                        "className": "text-right",
                        "render": function (data, type, row) {
                            return row["AGPay"].toFixed(2);
                        },
                        "visible": $scope.LoginMemberType == "4" ? false : true,
                    },

                    {
                        "targets": 16,
                        orderable: false,
                    },
                    {
                        "targets": 17,
                        orderable: false,
                    },
                   
                    {
                        "targets": 18,
                        orderable: false,
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
                    { data: 'RefNo' },
                    { data: 'ChkIn' },
                    { data: 'BookDate' },
                    { data: 'Nts' },
                    { data: 'Pax' },
                    { data: 'SType' },
                    { data: 'SName' },
                    { data: 'AgName' },
                    { data: 'AgRefNo' },
                    { data: 'AgCity' },
                    { data: 'AgCountry' },
                    { data: 'SAmt' },
                    { data: 'SCurr' },
                    { data: 'BRPay' },
                    { data: 'AGPay' },
                    { data: 'Status' },
                    { data: 'Postbyuser' },
                    { data: 'Posttouser' },
                    { data: 'InvoiceNo' }
                ],

                rowCallback: function (row, data) {
                    if ((data["Postbyuser"] == data["Posttouser"])) {
                        $('td:eq(16)', row).css('background-color', 'yellow',);
                        $('td:eq(17)', row).css('background-color', 'yellow');
                        $('td:eq(16)', row).css('font-weight', 'bold',);
                        $('td:eq(17)', row).css('font-weight', 'bold',);
                    }
                }




            });
        }
        else {
            var groupColumn = $scope.ReportFilter.GroupBy.split('~')[0];
            $('#AccountReport').DataTable().clear().destroy();

            $('#AccountReport').DataTable({

                "order": [],
                dom: 'Bfrtip',

                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: '<i class="fa fa-file-excel-o"></i>',
                        filename: function () {
                            var ReportName = "Account Report"
                            var RptDetails = $scope.AccReport.DateFrom + "-" + $scope.AccReport.DateTo;
                            return ReportName + ' ( ' + RptDetails + ' ) '
                        },
                        sheetName: 'AccountRptSheet',
                        title: null,
                        exportOptions: {
                            columns: ($scope.LoginMemberType == "4") ? [0, 1, 2, 3, 4, 5, 6, 8, 11, 15, 16, 17, 18] : (($scope.LoginMemberType == "1") ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18])
                        }
                    },
                    {
                        extend: 'copyHtml5',
                        text: '<i class="fa fa-files-o"></i>',
                        titleAttr: 'Copy',
                        exportOptions: {
                            columns: ($scope.LoginMemberType == "4") ? [0, 1, 2, 3, 4, 5, 6, 8, 11, 15, 16, 17, 18] : (($scope.LoginMemberType == "1") ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18])
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
                    //{
                    //    text: '<i class="fa fa-envelope"></i>',
                    //    titleAttr: 'Mail',
                    //    action: function (e, dt, node, config) {
                    //        $("#txtmailfrom").val("");
                    //        $("#txtmailto").val("")
                    //        $("#txtmailcc").val("")
                    //        $("#txtmailsubject").val("");
                    //        $scope._MailSubject = "Account Report From" + " (" + $scope.AccReport.DateFrom + " To " + $scope.AccReport.DateTo + " )";
                    //        $scope._Attachment = "AccountReport-" + " (" + $scope.AccReport.DateFrom + " - " + $scope.AccReport.DateTo + " )" + ".Pdf";                            
                    //        $("#MailDiv").modal('show');
                    //        $("#txtmailsubject").val($scope._MailSubject);
                    //        $("#_Attachment")[0].innerHTML=$scope._Attachment;
                    //    }
                    //}


                ],
                "columnDefs": [
                    { "visible": false, "targets": groupColumn },
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
                        "className": "text-center",
                    },
                    {
                        "targets": 5,
                        orderable: false,
                        "visible": groupColumn == "5" ? false : true,
                    },
                    {
                        "targets": 7,
                        "className": "text-left",
                        "visible": $scope.LoginMemberType == "4" || groupColumn == "7" ? false : true,
                    },
                    {
                        "targets": 8,
                        orderable: false,
                    },
                    {
                        "targets": 9,
                        "className": "text-left",
                        "visible": $scope.LoginMemberType == "4" ? false : true,
                    },
                    {
                        "targets": 10,
                        "className": "text-left",
                        "visible": $scope.LoginMemberType == "4" ? false : true,
                    },
                    {
                        "targets": 11,
                        "className": "text-right",
                        "render": function (data, type, row) {
                            return row["SAmt"].toFixed(2);
                        },
                    },
                    {
                        "targets": 12,
                        "className": "text-center",
                        "visible": groupColumn == "12" ? false : true,
                    },
                    {
                        "targets": 13,
                        "className": "text-right",
                        "visible": $scope.LoginMemberType == "1" ? true : false,
                        "render": function (data, type, row) {
                            return row["BRPay"].toFixed(2);
                        },
                    },
                    {
                        "targets": 14,
                        "className": "text-right",
                        "render": function (data, type, row) {
                            return row["AGPay"].toFixed(2);
                        },
                        "visible": $scope.LoginMemberType == "4" ? false : true,
                    },
                    {
                        "targets": 15,
                        "visible": groupColumn == "15" ? false : true,
                    },
                    {
                        "targets": 16,
                        orderable: false,
                    },
                    {
                        "targets": 17,
                        orderable: false,
                    },
                    {
                        "targets": 18,
                        orderable: false,
                    },

                ],

                searching: false,
                paging: true,
                data: $scope.MainResultlistAfterFilter,
                "pageLength": 30,
                select: true,
                autoWidth: false,
                ordering: true,
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
                    { data: 'ChkIn' },
                    { data: 'BookDate' },
                    { data: 'Nts' },
                    { data: 'Pax' },
                    { data: 'SType' },
                    { data: 'SName' },
                    { data: 'AgName' },
                    { data: 'AgRefNo' },
                    { data: 'AgCity' },
                    { data: 'AgCountry' },
                    { data: 'SAmt' },
                    { data: 'SCurr' },
                    { data: 'BRPay' },
                    { data: 'AGPay' },
                    { data: 'Status' },
                    { data: 'Postbyuser' },
                    { data: 'Posttouser' },
                    { data: 'InvoiceNo' }
                ],

                rowCallback: function (row, data) {
                    if ((data["Postbyuser"] == data["Posttouser"])) {
                        $('td:eq(15)', row).css('background-color', 'yellow',);
                        $('td:eq(16)', row).css('background-color', 'yellow');
                        $('td:eq(15)', row).css('font-weight', 'bold',);
                        $('td:eq(16)', row).css('font-weight', 'bold',);
                    }
                },




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

                                    '<tr class="group"><td colspan="12" style="color:#000000;font-size: 14px;text-align: left;padding: 7px 5px;">' + $scope.GroupingName + ' - ' + group + '</td></tr>'

                                );


                                last = group;
                            }
                            else {
                                groupid++;
                                $(rows).eq(i).before(


                                    '<tr class="group"><td colspan="12" style="color:#000000;font-size: 14px;text-align: left;padding: 7px 5px;">' + $scope.GroupingName + ' - ' + group + '</td></tr>'

                                );



                                last = group;
                            }

                        }





                    });


                },



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

        SortingSetting();

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
            $scope.SendMailDO.ReportName = "AccountReport-" + " (" + $scope.AccReport.DateFrom + " - " + $scope.AccReport.DateTo + " )";

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
        Hide_Columns('AccountReport')

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
        Apply_Sorting('AccountReport', $scope.SortDetails)

    }
    $scope.ClearSorting = function () {
        $scope.SortDetails = [];
        $scope.SortDetails = Clear_Sorting('AccountReport');
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


    //DONT COPY- This is Extra coding- not used
    //Export to Excel using Only Angularjs - this is working- Not used
    $scope.exportTableToExcel = function (filename) {


        // EXTRACT VALUE FOR HTML HEADER. 
        // ('Book ID', 'Book Name', 'Category' and 'Price')
        var col = [];
        for (var i = 0; i < $scope.MainResultlist.length; i++) {
            for (var key in $scope.MainResultlist[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }

        // CREATE DYNAMIC TABLE.
        var table = document.createElement("table");

        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

        var tr = table.insertRow(-1);                   // TABLE ROW.

        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");      // TABLE HEADER.
            th.innerHTML = col[i];
            tr.appendChild(th);
        }

        // ADD JSON DATA TO THE TABLE AS ROWS.
        for (var i = 0; i < $scope.MainResultlist.length; i++) {

            tr = table.insertRow(-1);

            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                tabCell.innerHTML = $scope.MainResultlist[i][col[j]];
            }
        }



        var downloadLink;
        var dataType = 'application/vnd.ms-excel';
        //  var tableSelect = document.getElementById(table);
        //  var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');


        var tableHTML = encodeURIComponent(table.outerHTML.replace(/ /g, '%20'));

        // Specify file name
        filename = filename ? filename + '.xls' : 'excel_data.xls';

        // Create download link element
        downloadLink = document.createElement("a");

        document.body.appendChild(downloadLink);

        if (navigator.msSaveOrOpenBlob) {
            var blob = new Blob(['\ufeff', tableHTML], {
                type: dataType
            });
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            // Create a link to the file
            downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

            // Setting the file name
            downloadLink.download = filename;

            //triggering the function
            downloadLink.click();
        }
    }

    $scope.tableToExcel = function () {
        var uri = 'data:application/vnd.ms-excel;base64,'
            , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" ><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>'
            , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
            , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
        return function (table, name) {

            if (!table.nodeType) table = document.getElementById(table)
            var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
            window.location.href = uri + base64(format(template, ctx))
        }
    }
    $scope.exportToExcel = function (tableId) { // ex: '#my-table'


        var col = [];
        for (var i = 0; i < $scope.MainResultlist.length; i++) {
            for (var key in $scope.MainResultlist[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }

        // CREATE DYNAMIC TABLE.
        var table = document.createElement("table");
        var tr = table.insertRow(-1);                   // TABLE ROW.
        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");      // TABLE HEADER.
            th.innerHTML = col[i];
            tr.appendChild(th);
        }
        for (var i = 0; i < $scope.MainResultlist.length; i++) {

            tr = table.insertRow(-1);

            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                tabCell.innerHTML = $scope.MainResultlist[i][col[j]];
            }
        }


        var exportHref = Excel.tableToExcel(tableId, 'AccountReportSheet', table);
        $timeout(function () { location.href = exportHref; }, 10000); // trigger download
    }

    //2nd option
    $("#btnExport").click(function () {

        var col = [];
        for (var i = 0; i < $scope.MainResultlist.length; i++) {
            for (var key in $scope.MainResultlist[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }

        // CREATE DYNAMIC TABLE.
        var table = document.createElement("table");
        var tr = table.insertRow(-1);                   // TABLE ROW.
        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");      // TABLE HEADER.
            th.innerHTML = col[i];
            tr.appendChild(th);
        }
        for (var i = 0; i < $scope.MainResultlist.length; i++) {

            tr = table.insertRow(-1);

            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                tabCell.innerHTML = $scope.MainResultlist[i][col[j]];
            }
        }


        var todaysDate = "AccountReport";
        var blobURL = tableToExcel('AccountReport', 'ReportSheet', table);
        $(this).attr('download', todaysDate + '.xls')
        $(this).attr('href', blobURL);
    });

    $scope.PDFdownload = function () {

        var col = [];
        for (var i = 0; i < $scope.MainResultlist.length; i++) {
            for (var key in $scope.MainResultlist[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }

        // CREATE DYNAMIC TABLE.
        //  var table = document.createElement("table");

        var table = document.getElementById("PdfTable");


        var tr = table.insertRow(-1);                   // TABLE ROW.
        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");      // TABLE HEADER.
            th.innerHTML = col[i];
            tr.appendChild(th);
        }
        for (var i = 0; i < $scope.MainResultlist.length; i++) {

            tr = table.insertRow(-1);

            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                tabCell.innerHTML = $scope.MainResultlist[i][col[j]];
            }
        }


        var table1 =
            //tableToJson(table),
            tableToJson($('#PdfTable').get(0)),

            cellWidth = 35,
            rowCount = 0,
            cellContents,
            leftMargin = 2,
            topMargin = 12,
            topMarginTable = 55,
            headerRowHeight = 13,
            rowHeight = 9,

            l = {
                orientation: 'l',
                unit: 'mm',
                format: 'a3',
                compress: true,
                fontSize: 8,
                lineHeight: 1,
                autoSize: true,
                printHeaders: true,
                pagesplit: true
            };

        var doc = new jsPDF(l, '', '', '');

        doc.setProperties({
            title: 'Test PDF Document',
            subject: 'This is the subject',
            author: 'author',
            keywords: 'generated, javascript, web 2.0, ajax',
            creator: 'author'
        });

        doc.cellInitialize();

        $.each(table1, function (i, row) {

            rowCount++;

            $.each(row, function (j, cellContent) {

                if (rowCount == 1) {
                    doc.margins = 1;
                    doc.setFont("helvetica");
                    doc.setFontType("bold");
                    doc.setFontSize(12);

                    doc.cell(leftMargin, topMargin, cellWidth, headerRowHeight, cellContent, i)
                }
                else if (rowCount == 2) {
                    doc.margins = 1;
                    doc.setFont("times ");
                    doc.setFontType("italic");  // or for normal font type use ------ doc.setFontType("normal");
                    doc.setFontSize(12);

                    doc.cell(leftMargin, topMargin, cellWidth, rowHeight, cellContent, i);
                }
                else {

                    doc.margins = 1;
                    doc.setFont("courier ");
                    doc.setFontType("bolditalic ");
                    doc.setFontSize(12);

                    doc.cell(leftMargin, topMargin, cellWidth, rowHeight, cellContent, i);  // 1st=left margin    2nd parameter=top margin,     3rd=row cell width      4th=Row height
                }




            })
        })



        doc.save('sample Report.pdf');;
    }

    function tableToJson(table) {
        var data = [];

        // first row needs to be headers
        var headers = [];
        for (var i = 0; i < table.rows[0].cells.length; i++) {
            headers[i] = table.rows[0].cells[i].innerHTML.toLowerCase().replace(/ /gi, '');
        }

        // go through cells
        for (var i = 1; i < table.rows.length; i++) {

            var tableRow = table.rows[i];
            var rowData = {};

            for (var j = 0; j < tableRow.cells.length; j++) {

                rowData[headers[j]] = tableRow.cells[j].innerHTML;

            }

            data.push(rowData);
        }

        return data;
    }

    $("#btnExportExcel").on("click", function () {
        var table = $('#AccountReport2').DataTable({
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

    HideColList.push("0~RefNo~Book Ref / Pos");
    HideColList.push("1~ChkIn~Check In Date");
    HideColList.push("2~BookDate~Booking Date");
    HideColList.push("3~Nts~Nights");
    HideColList.push("4~Pax~Pax Name");
    HideColList.push("5~SType~Service");

    HideColList.push("6~SName~Service Name");
   
    if (GetE("hdnLoginMemberTypeId").value != "4") {
        HideColList.push("7~AgName~Agency Name");
    }

    HideColList.push("8~AgRefNo~Agency Ref No");

    if (GetE("hdnLoginMemberTypeId").value != "4") {
        HideColList.push("9~AgName~Agency City");
        HideColList.push("10~AgName~Agency Country");
    }
        
   
    HideColList.push("11~SAmt~Sell Amt");
    HideColList.push("12~SCurr~Sell Currency");
    if (GetE("hdnLoginMemberTypeId").value == "1") {
        HideColList.push("13~BRPay~Branch Pay");
    }

    if (GetE("hdnLoginMemberTypeId").value != "4") {

        HideColList.push("14~AGPay~Agency Pay");
    }
    HideColList.push("15~Status~BookStatus");
    HideColList.push("16~Postbyuser~Post by User");
    HideColList.push("17~Posttouser~Post To User");
    HideColList.push("18~InvoiceNo~Invoice number");


    if (GroupBy != "") {
        var NewHideColList = [];
        switch (GroupBy) {
            case '7':
                NewHideColList = removeElementsfromhidelist(HideColList, '7~AgName~Agency Name');
                break;
            case '15':
                NewHideColList = removeElementsfromhidelist(HideColList, '15~Status~BookStatus');
                break;
            case '5':
                NewHideColList = removeElementsfromhidelist(HideColList, '5~SType~Service');
                break;
            case '12':
                NewHideColList = removeElementsfromhidelist(HideColList, '12~SCurr~Sell Currency');
                break;

        }

    }
    NewHideColList = HideColList;


    return NewHideColList;


}

$(document).ready(function () {

    $("#BookingReport").addClass("active");
    $(".date-cal").datepicker({ dateFormat: 'dd M yy', numberOfMonths: 2, });




    var table = $('#AccountReport').dataTable();
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




//DONT COPY- This is Extra coding- not used
function escapeUnicode(str) {
    return str.replace(/[^\0-~]/g, function (ch) {
        return "\\u" + ("000" + ch.charCodeAt().toString(16)).slice(-4);
    });
}

app.factory('Excel', function ($window) {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" ><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><style><!-- table {mso-displayed-decimal-separator: "\.";mso-displayed-thousand-separator: "\,";} --></style><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function (s) { return $window.btoa(unescape(encodeURIComponent(s))); },
        format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };
    return {
        tableToExcel: function (tableId, worksheetName, newtable) {
            //var table = $(tableId),
            var table = newtable,
                //ctx = { worksheet: worksheetName, table: table.html() },
                ctx = { worksheet: worksheetName, table: table.outerHTML },
                href = uri + base64(format(template, ctx));
            return href;
        }
    };
})

//2nd option
var tableToExcel = (function () {
    var uri = 'data:application/vnd.ms-excel;base64,'
        , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>'
        , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
        , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
    return function (table, name, newtable) {
        if (!table.nodeType) table = document.getElementById(table)

        //var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
        var ctx = { worksheet: name || 'Worksheet', table: newtable.innerHTML }
        var blob = new Blob([format(template, ctx)]);
        var blobURL = window.URL.createObjectURL(blob);
        return blobURL;
    }
})()




