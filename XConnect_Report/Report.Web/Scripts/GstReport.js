var app = angular.module('GstRptapp', []);


var bid = ""; var brtypeid = ""; var mid = ""; var mrtypeid = ""; var bid = ""; var Wsid = ""; var membertypeid = "";
var isvalid = true;
app.controller('GstRptCntr', ['$scope', '$http', '$window', '$rootScope', function ($scope, $http, $window, $rootScope) {
    NgInit();

    function NgInit() {

        $scope.GstReport = GstReportDo();
        $scope.ReportFilter = ReportFilterDO();
        $scope.PostBooking = PostBookingDO();

        $scope.LoginMemberType = GetE("hdnLoginMemberTypeId").value;
        $scope.ModifySearch = true;
        $scope._IsHidePostBooking = false;
        $scope.GroupingName = "Service"
        $scope.MemberDetails = "";

        if ($scope.LoginMemberType == 2) {
            $scope.PostBooking.Br_Id = $("#hdnLoginMemberId").val();
            $scope.PostBooking.MemberTypeSelected = GetE("hdnLoginMemberTypeId").value;
            $scope._IsHidePostBooking = true;
        }
        else if ($scope.LoginMemberType == 3) {

            $scope.PostBooking.Ws_Id = $("#hdnLoginMemberId").val();
            $scope.PostBooking.PostMemberId = $("#hdnLoginMemberId").val();
            $scope.PostBooking.MemberTypeSelected = GetE("hdnLoginMemberTypeId").value;
            $scope._IsHidePostBooking = true;
        }
        else if ($scope.LoginMemberType == 4) {
            $scope.PostBooking.Ag_Id = $("#hdnLoginMemberId").val();
            $scope.PostBooking.PostMemberId = $("#hdnLoginMemberId").val();
            $scope.PostBooking.PostUserId = $("#hdnLoginUserId").val();
            $scope.PostBooking.MemberTypeSelected = GetE("hdnLoginMemberTypeId").value;
            $scope._IsHidePostBooking = true;
        }
        $scope.GstReport.FromDate = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
        $scope.GstReport.ToDate = ConvertCustomrangedate(new Date());

        $rootScope.$on("CallPostBooking", function (event) {
            setPostMemberDetails(event);
        });
        $("#demo").addClass("collapse in");

    }
    $scope.$on('$viewContentLoaded', function () {
        //Here your view content is fully loaded !!
    });

    function setPostMemberDetails(event) {

        switch (this.event.target.id) {
            case "ddl_BR":
                $scope.PostBooking.Ag_Id = 0;
                $scope.PostBooking.Ws_Id = 0;
                $scope.PostBooking.Br_Id = (this.event.target.value);
                $scope.PostBooking.ReportCompanyName = GetE("ddl_BR").options[GetE("ddl_BR").selectedIndex].text;
                $scope.PostBooking.MemberTypeSelected = 0;
                $scope.PostBooking.PostMemberId = (this.event.target.value);
                break;
            case "ddl_WS":
                $scope.PostBooking.Ag_Id = 0;
                $scope.PostBooking.Ws_Id = (this.event.target.value);
                $scope.PostBooking.MemberTypeSelected = 3;
                $scope.PostBooking.PostMemberId = (this.event.target.value);
                $scope.PostBooking.ReportCompanyName = GetE("ddl_WS").options[GetE("ddl_WS").selectedIndex].text;
                break;
            case "ddl_AG":
                $scope.PostBooking.Ag_Id = (this.event.target.value);
                $scope.PostBooking.MemberTypeSelected = 4;
                if (GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text != "All Agent") {
                    $scope.PostBooking.PostMemberId = (this.event.target.value);
                    $scope.PostBooking.ReportCompanyName = GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text;
                }
                
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

    function getUrlVarsDetail() {
        var vars = [], hash;
        var hashes = $("#hdnRptParam").val().split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }

    $scope.fnShowHide = function (iCol) {
        /* Get the DataTables object again - this is not a recreation, just a get of the object */
        var oTable = $('#GstSReport').dataTable();

        var bVis = oTable.fnSettings().aoColumns[iCol].bVisible;
        oTable.fnSetColumnVis(iCol, bVis ? false : true);


    }
    //select customdate option
    Customdaterangelist1 = Customdaterangelist();

    $scope.DateRangeList = Customdaterangelist1;

    $("#ddl_CustomDateRange").change(function () {
        $scope.CustomDateRangeFilter = $("#ddl_CustomDateRange").val();
        if ($scope.CustomDateRangeFilter != "" && $scope.CustomDateRangeFilter != "0") {
            GetE("txtFromDate").value = $scope.CustomDateRangeFilter.split("~")[0];
            $scope.GstReport.FromDate = $scope.CustomDateRangeFilter.split("~")[0];

            GetE("txtToDate").value = $scope.CustomDateRangeFilter.split("~")[1];
            $scope.GstReport.ToDate = $scope.CustomDateRangeFilter.split("~")[1];
        }
        else {
            GetE("txtFromDate").value = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            $scope.GstReport.FromDate = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));

            GetE("txtToDate").value = ConvertCustomrangedate(new Date());
            $scope.GstReport.ToDate = ConvertCustomrangedate(new Date());

        }



    });

    //Modify Button for
    $scope.ShowModifyClick = function () {
        $("#demo")[0].style.display = "block";
        $("#Noresultdiv")[0].style.display = "none";
        $("#Errordiv")[0].style.display = "none";
    }

    //validation and setparam on serach click
    $scope.SearchReportClick = function () {


        var isvalid = true;
        $("#RptDetails")[0].style.display = "none";
        $("#RptHeaderDetails")[0].style.display = "none";
        $("#Noresultdiv")[0].style.display = "none";
        PopUpController.ClosePopup("divPopup", "");
        //$("#HeaderSearchdiv").removeClass();
        //$("#HeaderSearchdiv").addClass("col-lg-12 col-md-12 col-sm-12 col-xs-12 container-fluid padd-lft10 padd-rgt10");
        $scope.ModifySearch = false;


        if ($scope.GstReport.FromDate == "") {

            Alert.render("Please Select From Date", "txtFromDate");
            isvalid = false;
            $scope.ModifySearch = true;
            return false;
        }

        if ($scope.GstReport.ToDate == "") {
            Alert.render("Please Select To Date", "txtToDate");
            isvalid = false;
            $scope.ModifySearch = true;
            return false;
        }


        //if ($scope.LoginMemberType == "1") {
        //    if ($scope.PostBooking.ReportCompanyName == "Select Branch" || $scope.PostBooking.ReportCompanyName == "" || $scope.PostBooking.ReportCompanyName == "TestName") {
        //        $scope.PostBooking.ReportCompanyName = "All Branch";
        //    }
        //}
        if ($scope.LoginMemberType != "1") {
            if ($scope.PostBooking.ReportCompanyName == "TestName") {
                $scope.PostBooking.ReportCompanyName = GetE("hdnLoginName").value;
            }
        }

        if ($scope.PostBooking.PostMemberId == 0 && $scope.PostBooking.ReportCompanyName != "All Branch") {
            Alert.render("Select Member to Post Booking", "ddl_BR");
            isvalid = false;
            $scope.ModifySearch = true;
            return false;
        }


        $scope.ReportFilter.HideBy = "0";
        //column hide array string
        var checkboxes = document.getElementsByName('HIDE');
        var vals = "";
        for (var i = 0, n = checkboxes.length; i < n; i++) {
            if (checkboxes[i].checked) {
                $scope.ReportFilter.HideBy += checkboxes[i].value + ",";
            }
        }
        $scope.GstReport.MemberId = $scope.PostBooking.PostMemberId;
        $scope.ReportFilter.CustomDateOption = $("#ddl_CustomDateRange").val();;
        $scope.MemberDetails = $scope.PostBooking.Br_Id + "_" + $scope.PostBooking.Ws_Id + "_" + $scope.PostBooking.Ag_Id + "_" + $scope.PostBooking.ReportCompanyName;

        if (isvalid == true) {
            $scope.GetReportDetails();
        }
    }


    //getReportDetails on serach click
    $scope.GetReportDetails = function () {

        var popupdetail = $scope.PostBooking.ReportCompanyName + "~" + $scope.GstReport.FromDate + "~" + $scope.GstReport.ToDate;
        PopUpController.OpenPopup1("divPopup", "GST Report", popupdetail);

        $("#divhdeading")[0].style.display = "block";
        $("#demo")[0].style.display = "none";
        //$("#btnsearch")[0].style.display = "none";
        $("#HeaderSearchdiv").removeClass();
        $("#HeaderSearchdiv").addClass("col-lg-12 col-md-12 col-sm-12 col-xs-12 container-fluid padd-lft10 padd-rgt10");

        $scope.ReportFilter.CustomDateOption = $("#ddl_CustomDateRange").val();;
        $("#demo").addClass("collapse in");


        $http({
            method: "post",
            url: "../Booking/GetGstReport",
            data: ({
                gstReportDO: $scope.GstReport,
            }),
            dataType: "json",
            headers: { "Content-Type": "application/json" }

        }).then(function (d) {

            if (d.data != undefined || d.data != null) {
                if (d.data.length > 0) {

                    $scope.MainResultlist = (d.data);
                    $scope.MainResultlistAfterFilter = (d.data);

                    //$scope.OpeningBalance = d.data[0].OpeningBal;
                    //$scope.ClosingBalance = d.data[d.data.length - 1].CurrentCreditBalance;
                    //$scope.MainResultlist = $scope.MainResultlist.map(
                    //    item => {
                    //        item["ServiceType"] = GetBookingServiceNameDirective(item["ServiceType"]);
                    //        item["BookStatus"] = GetBookDisplayStatusDirective(item["BookStatus"]);
                    //        item["BookingAction"] = GetBookDisplayStatusDirective(item["BookingAction"]);
                    //        return item;
                    //    }
                    //);
                    //$scope.MainResultlistAfterFilter = $scope.MainResultlistAfterFilter.map(
                    //    item => {
                    //        item["ServiceType"] = GetBookingServiceNameDirective(item["ServiceType"]);
                    //        item["BookStatus"] = GetBookDisplayStatusDirective(item["BookStatus"]);
                    //        item["BookingAction"] = GetBookDisplayStatusDirective(item["BookingAction"]);
                    //        return item;
                    //    }
                    //);

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
        if ($scope.ReportFilter.GroupBy == "") {

            $('#GstSReport').DataTable().clear().destroy();
            //$("#trfooter")[0].style.visibility = "visible";
            $('#GstSReport').DataTable({

                dom: 'Bfrtip',
                buttons: [


                    {
                        extend: 'excelHtml5',
                        text: '<i class="fa fa-file-excel-o"></i>',
                        filename: function () {
                            var ReportName = "Gst Report"
                            var RptDetails = $scope.GstReport.FromDate + "-" + $scope.GstReport.ToDate;
                            return ReportName + ' ( ' + RptDetails + ' ) '
                        },
                        sheetName: 'GstRptSheet',
                        title: null

                    },
                    {
                        extend: 'copyHtml5',
                        text: '<i class="fa fa-files-o"></i>',
                        titleAttr: 'Copy',

                    },


                ],


                "columnDefs": [
                    {
                        "visible": false
                    },
                    {
                        "targets": 0,
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
                        "className": "text-left",
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
                        "className": "text-right",
                    },

                    {
                        "targets": 8,
                        "className": "text-left",

                    },
                    {
                        "targets": 9,
                        "className": "text-right",

                    },
                    {
                        "targets": 10,
                        "className": "text-right",

                    },
                    {
                        "targets": 11,
                        "className": "text-left",

                    },
                    {
                        "targets": 12,
                        "className": "text-right",

                    },
                    {
                        "targets": 13,
                        "className": "text-right",

                    },
                    {
                        "targets": 14,
                        "className": "text-right",

                    },
                    {
                        "targets": 15,
                        "className": "text-right",

                    },
                    {
                        "targets": 16,
                        "className": "text-right",

                    },
                    {
                        "targets": 17,
                        "className": "text-right",

                    },

                    {
                        "targets": 18,
                        "className": "text-right",

                    },
                    {
                        "targets": 19,
                        "className": "text-right",

                    },
                    {
                        "targets": 20,
                        "className": "text-right",

                    },
                    {
                        "targets": 21,
                        "className": "text-right",

                    },
                    {
                        "targets": 22,
                        "className": "text-right",

                    },
                    {
                        "targets": 23,
                        "className": "text-right",

                    },
                    {
                        "targets": 24,
                        "className": "text-right",

                    },
                    {
                        "targets": 25,
                        "className": "text-right",

                    },
                    {
                        "targets": 26,
                        "className": "text-left",

                    },
                    {
                        "targets": 27,
                        "className": "text-left",

                    },
                    {
                        "targets": 28,
                        "className": "text-left",

                    },
                    {
                        "targets": 29,
                        "className": "text-left",

                    },
                    {
                        "targets": 30,
                        "className": "text-left",

                    },
                    {
                        "targets": 31,
                        "className": "text-left",

                    },

                ],
                "order": [[0, 'asc'], [1, 'asc']],
                ordering: false,
                searching: false,
                data: $scope.MainResultlistAfterFilter,
                "deferRender": true,
                select: true,
                autoWidth: false,
                paging: false,
                columns: [
                    { data: 'bookRef' },
                    { data: 'InvNo' },
                    { data: 'dtInv' },
                    { data: 'AgName' },
                    { data: 'AgNo' },
                    { data: 'SupName' },
                    { data: 'PaxName' },
                    { data: 'SupNetAmt' },
                    { data: 'SupNetCur' },
                    { data: 'Roe' },
                    { data: 'NetAmt' },
                    { data: 'NetCur' },
                    { data: 'GstPer' },
                    { data: 'HqPer' },
                    { data: 'BrPer' },
                    { data: 'WsPer' },
                    { data: 'AgPer' },
                    { data: 'SrvCharge' },
                    { data: 'DiscAmt' },
                    { data: 'OrgSrvCharge' },
                    { data: 'SrvTax' },
                    { data: 'SGST' },
                    { data: 'CGST' },
                    { data: 'IGST' },
                    { data: 'HqPay' },
                    { data: 'SellAmt' },
                    { data: 'SellCur' },
                    { data: 'AgState' },
                    { data: 'AgPan' },
                    { data: 'AgGST' },
                    { data: 'BookPan' },
                    { data: 'BookPanName' }

                ],
                "footerCallback": function (row, data, start, end, display) {
                    var api = this.api(), data;

                    // Remove the formatting to get integer data for summation
                    var intVal = function (i) {
                        return typeof i === 'string' ?
                            i.replace(/[\$,]/g, '') * 1 :
                            typeof i === 'number' ?
                                i : 0;
                    };

                    // Total Debit
                    //Debittotal = api
                    //    .column(3)
                    //    .data()
                    //    .reduce(function (a, b) {
                    //        return intVal(a) + intVal(b);
                    //    }, 0);


                    // Total Credit
                    //Credittotal = api
                    //    .column(4)
                    //    .data()
                    //    .reduce(function (a, b) {
                    //        return intVal(a) + intVal(b);
                    //    }, 0);

                    // Total over this page
                    //pageTotal = api
                    //    .column(3, { page: 'last' })
                    //    .data()
                    //    .reduce(function (a, b) {
                    //        return intVal(a) + intVal(b);
                    //    }, 0);

                    // Update footer
                    //if (end == data.length) {
                    //    $(api.column(3).footer()).html(

                    //        '<b>' + Debittotal.toFixed(2) + '</b>'
                    //    );
                    //    $(api.column(4).footer()).html(

                    //        '<b>' + Credittotal.toFixed(2) + '</b>'
                    //    );
                    //}
                    //else {
                    //    $(api.column(3).footer()).html('')
                    //    $(api.column(4).footer()).html('')
                    //}
                }

            });
        }
        else {
            var groupColumn = $scope.ReportFilter.GroupBy.split('~')[0];
            $('#GstSReport').DataTable().clear().destroy();
            //   $("#trfooter")[0].style.visibility = "hidden";
            $('#GstSReport').DataTable({

                dom: 'Bfrtip',
                buttons: [
                    {
                        extend: 'pdfHtml5',
                        title: function () {
                            return "GST Report";
                        },
                        orientation: 'landscape',
                        pageSize: 'LEGAL',
                        text: '<i class="fa fa-file-pdf-o"> PDF</i>',
                        titleAttr: 'PDF'
                    },
                    'print',
                    {
                        extend: 'excelHtml5',
                        text: 'Excel',
                        filename: function () {
                            var ReportName = "Gst Report"
                            var RptDetails = $scope.GstReport.FromDate + "-" + $scope.GstReport.ToDate;
                            return ReportName + ' ( ' + RptDetails + ' ) '
                        },
                        sheetName: 'GstRptSheet',
                        title: null

                    },
                    'copyHtml5',
                    {
                        text: 'Mail',
                        action: function (e, dt, node, config) {
                            $("#txtmailfrom").val("");
                            $("#txtmailto").val("")
                            $("#txtmailcc").val("")
                            $("#txtmailsubject").val("");
                            $scope._MailSubject = "GST Report From" + " (" + $scope.GstReport.FromDate + " To " + $scope.GstReport.ToDate + " )";
                            $scope._Attachment = "GstReport-" + " (" + $scope.GstReport.FromDate + " - " + $scope.GstReport.ToDate + " )" + ".Pdf";
                            $("#MailDiv").modal('show');
                            $("#txtmailsubject").val($scope._MailSubject);
                            $("#_Attachment")[0].innerHTML = $scope._Attachment;
                        }
                    }

                ],


                "columnDefs": [
                    {
                        "visible": false
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
                        "className": "text-left",
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
                        "className": "text-right",
                    },

                    {
                        "targets": 8,
                        "className": "text-left",

                    },
                    {
                        "targets": 9,
                        "className": "text-right",

                    },
                    {
                        "targets": 10,
                        "className": "text-right",

                    },
                    {
                        "targets": 11,
                        "className": "text-left",

                    },
                    {
                        "targets": 12,
                        "className": "text-right",

                    },
                    {
                        "targets": 13,
                        "className": "text-right",

                    },
                    {
                        "targets": 14,
                        "className": "text-right",

                    },
                    {
                        "targets": 15,
                        "className": "text-right",

                    },
                    {
                        "targets": 16,
                        "className": "text-right",

                    },
                    {
                        "targets": 17,
                        "className": "text-right",

                    },

                    {
                        "targets": 18,
                        "className": "text-right",

                    },
                    {
                        "targets": 19,
                        "className": "text-right",

                    },
                    {
                        "targets": 20,
                        "className": "text-right",

                    },
                    {
                        "targets": 21,
                        "className": "text-right",

                    },
                    {
                        "targets": 22,
                        "className": "text-right",

                    },
                    {
                        "targets": 23,
                        "className": "text-right",

                    },
                    {
                        "targets": 24,
                        "className": "text-right",

                    },
                    {
                        "targets": 25,
                        "className": "text-right",

                    },
                    {
                        "targets": 26,
                        "className": "text-left",

                    },
                    {
                        "targets": 27,
                        "className": "text-left",

                    },
                    {
                        "targets": 28,
                        "className": "text-left",

                    },
                    {
                        "targets": 29,
                        "className": "text-left",

                    },
                    {
                        "targets": 30,
                        "className": "text-left",

                    },
                    {
                        "targets": 31,
                        "className": "text-left",

                    },

                ],
                ordering: true,
                searching: false,
                paging: false,
                data: $scope.MainResultlistAfterFilter,

                select: true,
                autoWidth: false,
                order: [[groupColumn]],

                columns: [
                    { data: 'bookRef' },
                    { data: 'InvNo' },
                    { data: 'dtInv' },
                    { data: 'AgName' },
                    { data: 'AgNo' },
                    { data: 'SupName' },
                    { data: 'PaxName' },
                    { data: 'SupNetAmt' },
                    { data: 'SupNetCur' },
                    { data: 'Roe' },

                    { data: 'NetAmt' },
                    { data: 'NetCur' },
                    { data: 'GstPer' },
                    { data: 'HqPer' },
                    { data: 'BrPer' },
                    { data: 'WsPer' },
                    { data: 'AgPer' },
                    { data: 'SrvCharge' },
                    { data: 'DiscAmt' },
                    { data: 'OrgSrvCharge' },

                    { data: 'SrvTax' },
                    { data: 'SGST' },
                    { data: 'CGST' },
                    { data: 'IGST' },
                    { data: 'HqPay' },
                    { data: 'SellAmt' },
                    { data: 'SellCur' },
                    { data: 'AgState' },
                    { data: 'AgPan' },
                    { data: 'AgGST' },
                    { data: 'BookPan' },
                    { data: 'BookPanName' }

                ],


                drawCallback: function (settings) {
                    var api = this.api();
                    var rows = api.rows({ page: 'current' }).nodes();
                    var last = null;
                    var totale = new Array();
                    totale['Totale'] = new Array();
                    var groupid = -1;
                    var subtotale = new Array();


                    api.column(groupColumn, { page: 'current' }).data().each(function (group, i) {

                        if (last !== group) {
                            if (i > 0) {
                                groupid++;

                                $(rows).eq(i).before(

                                    // '<tr class="endgroup"><td colspan="10" style="font-weight:700;color:#000000;font-size: 14px;text-align: left;padding: 7px 5px;">' + "" + '</td></tr>',
                                    '<tr class="group"><td colspan="10" style="font-weight:700;color:#000000;font-size: 14px;text-align: center;padding: 7px 5px;">' + group + '</td></tr>'

                                );


                                last = group;
                            }
                            else {
                                groupid++;
                                $(rows).eq(i).before(

                                    '<tr class="group"><td colspan="10" style="font-weight:700;color:#000000;font-size: 14px;text-align: center;padding: 7px 5px;">' + group + '</td></tr>'

                                );



                                last = group;
                            }

                        }



                    });

                },

                "footerCallback": function (row, data, start, end, display) {
                    var api = this.api(), data;

                    // Remove the formatting to get integer data for summation
                    var intVal = function (i) {
                        return typeof i === 'string' ?
                            i.replace(/[\$,]/g, '') * 1 :
                            typeof i === 'number' ?
                                i : 0;
                    };

                    // Total Debit
                    Debittotal = api
                        .column(3)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);


                    // Total Credit
                    Credittotal = api
                        .column(4)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Total over this page
                    pageTotal = api
                        .column(3, { page: 'last' })
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Update footer
                    if (end == data.length) {
                        $(api.column(3).footer()).html(

                            '<b>' + Debittotal.toFixed(2) + '</b>'
                        );
                        $(api.column(4).footer()).html(

                            '<b>' + Credittotal.toFixed(2) + '</b>'
                        );
                    }
                    else {
                        $(api.column(3).footer()).html('')
                        $(api.column(4).footer()).html('')
                    }
                }



            });
        }


        var table = $('#GstSReport').DataTable();
        var info = table.page.info();
        $('#GstSReport_info').html(
            'Total Records: ' + ($scope.MainResultlistAfterFilter.length)
        );

        //if ($scope.ReportFilter.HideBy != "") {
        //    var oTable = $('#GstSReport').dataTable();

        //    for (var i = 0; i < ($scope.ReportFilter.HideBy.split(',').length - 1); i++) {
        //        var iCol = $scope.ReportFilter.HideBy.split(',')[i];
        //        var bVis = oTable.fnSettings().aoColumns[iCol].bVisible;
        //        oTable.fnSetColumnVis(iCol, bVis ? false : true);
        //    }
        //}



    }

    //select grouping option
    $("#ddl_Grp").change(function () {
        $scope.ReportFilter.GroupBy = $("#ddl_Grp").val().split('~')[0];
        $scope.GroupingName = $("#ddl_Grp").val().split('~')[1];
    });


    $scope.ShowModifyBtn = function () {
        $("#demo")[0].style.display = "none";
        $scope.ModifySearch = false;
    }


}]);

function GetE(Control) {
    return document.getElementById(Control);
}

