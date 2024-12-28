﻿var app = angular.module('DSReportapp', []);


var bid = ""; var brtypeid = ""; var mid = ""; var mrtypeid = ""; var bid = ""; var Wsid = ""; var membertypeid = "";
var isvalid = true;
app.controller('DSReportCntr', ['$scope', '$http', '$window', '$rootScope', '$timeout', function ($scope, $http, $window, $rootScope, $timeout) {
    NgInit();

    function NgInit() {
        $scope.DailySReport = DailySalesReportDO();
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
        $scope.SortColNo = [];
        $scope.MainResultlistAfterFilter = [];
        $scope.ShowddlFilterList = [];
        $scope.FilterDOList = [];
        $scope.FilterTypeActive = "";
        $scope.selectedArray = "";
        $scope.OldSelectedfilterArrayValues = "";
        SortingSetting();
        ShowHideExcelColumns();

        $("#ddl_BR option:selected").text("All Branch");
      //  $("#ddl_WS option:selected").text("All Wholesaler");
        $("#ddl_AG option:selected").text("All Agent");




        $scope.DailySReport.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
        $scope.DailySReport.DateTo = ConvertCustomrangedate(new Date());

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
            $scope.DailySReport.DateFrom = $scope.CustomDateRangeFilter.split("~")[0];
            GetE("txtToDate").value = $scope.CustomDateRangeFilter.split("~")[1];
            $scope.DailySReport.DateTo = $scope.CustomDateRangeFilter.split("~")[1];
        }
        else {
            GetE("txtFromDate").value = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            $scope.DailySReport.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            GetE("txtToDate").value = ConvertCustomrangedate(new Date());
            $scope.DailySReport.DateTo = ConvertCustomrangedate(new Date());
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

        if ($scope.DailySReport.DateFrom == "") {

            Alert.render("Please Select Arrival-From Date", "txtFromDate");
            isvalid = false;
            return false;
        }

        if ($scope.DailySReport.DateTo == "") {
            Alert.render("Please Select Arrival-To Date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ($scope.DailySReport.DateFrom != "" && $scope.DailySReport.DateTo != "") {
            var dtObj1 = GetSystemDate($scope.DailySReport.DateFrom);
            var dtObj2 = GetSystemDate($scope.DailySReport.DateTo);
        }

        if (($scope.DailySReport.DateFrom != "" && $scope.DailySReport.DateTo != "") && (dtObj1 > dtObj2)) {
            Alert.render("Arrival-From date can not be greater than Arrival-To date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ((diffDate(new Date($scope.DailySReport.DateTo), new Date($scope.DailySReport.DateFrom))) > 12.50) {
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



        //if (document.getElementById('ADW').checked) {
        //    $scope.DailySReport.BookingdateWise = false;
        //}
        //if (document.getElementById('BDW').checked) {
        //    $scope.DailySReport.BookingdateWise = true;
        //}

        if (document.getElementById('ADW').checked) {
            $scope.DailySReport.BookingdateWise = 0;
        }
        if (document.getElementById('BDW').checked) {
            $scope.DailySReport.BookingdateWise = 1;
        }
        if (document.getElementById('RDW').checked) {
            $scope.DailySReport.BookingdateWise = 2;
        }




        $scope.MemberDetails = $scope.PostBooking.Br_Id + "_" + $scope.PostBooking.Ws_Id + "_" + $scope.PostBooking.Ag_Id + "_" + $scope.PostBooking.ReportCompanyName + "_" + GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text;


        $scope.DailySReport.MemberId = $scope.PostBooking.PostMemberId;
        $scope.DailySReport.LoginUserId = (document.getElementById("hdnLoginUserId")).value;





        if (isvalid == true) {
            $scope.GetReportDetails();
        }
    }


    //getReportDetails on serach click
    $scope.GetReportDetails = function () {

        var popupdetail = $scope.PostBooking.ReportCompanyName + "~" + $scope.DailySReport.DateFrom + "~" + $scope.DailySReport.DateTo;
        PopUpController.OpenPopup1("divPopup", "Daily Sales Report", popupdetail);

        $scope.ReportFilter.Status = $scope.FilterDOList.filter(item=> item.Name == 'Status').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'Status')[0].Values) : "";
        $scope.ReportFilter.SType = $scope.FilterDOList.filter(item=> item.Name == 'SType').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'SType')[0].Values) : "";
        $scope.ReportFilter.AgName = $scope.FilterDOList.filter(item=> item.Name == 'AgName').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'AgName')[0].Values) : "";
        $scope.ReportFilter.Nts = $scope.FilterDOList.filter(item=> item.Name == 'Nts').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'Nts')[0].Values) : "";
        $scope.ReportFilter.Pax = $scope.FilterDOList.filter(item=> item.Name == 'Pax').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'Pax')[0].Values) : "";
        $scope.ReportFilter.SName = $scope.FilterDOList.filter(item=> item.Name == 'SName').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'SName')[0].Values) : "";
        $scope.ReportFilter.SupName = $scope.FilterDOList.filter(item=> item.Name == 'SupName').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'SupName')[0].Values) : "";
        $scope.ReportFilter.NCurr = $scope.FilterDOList.filter(item=> item.Name == 'NCurr').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'NCurr')[0].Values) : "";
        $scope.ReportFilter.SCurr = $scope.FilterDOList.filter(item=> item.Name == 'SCurr').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'SCurr')[0].Values) : "";
        $scope.ReportFilter.SAmt = $scope.FilterDOList.filter(item=> item.Name == 'SAmt').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'SAmt')[0].Values) : "";
        $scope.ReportFilter.NAmt = $scope.FilterDOList.filter(item=> item.Name == 'NAmt').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'NAmt')[0].Values) : "";
        $scope.ReportFilter.GInAED = $scope.FilterDOList.filter(item => item.Name == 'GInAED').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'GInAED')[0].Values) : "";

        $scope.ReportFilter.AgCountry = $scope.FilterDOList.filter(item => item.Name == 'AgCountry').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'AgCountry')[0].Values) : "";
        $scope.ReportFilter.AgCity = $scope.FilterDOList.filter(item => item.Name == 'AgCity').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'AgCity')[0].Values) : "";
        $scope.ReportFilter.CustomDateOption = $("#ddl_CustomDateRange").val();;

        $("#demo").addClass("collapse in");

        $http({
            method: "post",
            url: "../Booking/GetDSReportDetail",
            data: ({
                DSSearchReportDO: $scope.DailySReport,
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
        if ($scope.ReportFilter.GroupBy == "") {

            $('#DSReport').DataTable().clear().destroy();
            $('#DSReport').DataTable({

                "order": [],
                dom: 'Bfrtip',

                buttons: [

                    {
                        extend: 'excelHtml5',
                        text: '<i class="fa fa-file-excel-o"></i>',
                        filename: function () {
                            var ReportName = "Daily Sales Report"
                            var RptDetails = $scope.DailySReport.DateFrom + "-" + $scope.DailySReport.DateTo;
                            return ReportName + ' ( ' + RptDetails + ' ) '
                        },
                        sheetName: 'DSRptSheet',
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
                       "targets": 1,
                       orderable: false,
                   },   
                        {
                            "visible": $scope.CCode == "4" ? true : false,
                            "targets": 2,
                        },
                     {
                         "targets": 3,
                         "className": "text-center",
                     },
                        {
                            "visible": groupColumn == "6" ? false : true,
                            "targets": 6,
                        },
                         {
                             "targets": 8,
                             orderable: false,
                             "visible": $scope.IsShowSupplier == "true" ? true : false,
                         },
                     {
                         "targets": 9,
                         orderable: false,
                     },
                      {
                          "visible": $scope.CCode == "4" ? true : false,
                          "targets": 10,
                      },
                      {
                          "visible": $scope.LoginMemberType == "4" || groupColumn=="11" ? false : true,
                          "targets": 11,

                      },
                     {
                         "targets": 12,
                         orderable: false,
                     },
                    {
                        "targets": 13,
                        "className": "text-center",
                    },
                    {
                        "targets": 14,
                        "className": "text-right",
                        "render": function (data, type, row) {
                            return row["NAmt"].toFixed(2);
                        },
                    },
                    {
                        "visible": groupColumn == "15" ? false : true,
                        "targets": 15,
                        "className": "text-center",
                    },
                    {
                        "targets": 16,
                        "className": "text-right",
                        "render": function (data, type, row) {
                            return row["SAmt"].toFixed(2);
                        },
                    },
                    {
                        "visible": $scope.CCode == "4" ? true : false,
                        "targets": 17,
                        "className": "text-right",
                        "render": function (data, type, row) {
                            return row["GInAED"].toFixed(2);
                        },
                    },
                        {
                            "visible": groupColumn == "18" ? false : true,
                            "targets": 18,
                    },
                    {
                        "targets": 19,
                        orderable: false,
                    },
                    {
                        "targets": 20,
                        orderable: false,

                    },
                    {
                        "targets": 21,
                        orderable: false,
                    },
                    {
                        "targets": 22,
                        orderable: false,
                    },
                    {
                        "targets": 23,
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
                       { data: 'VNo' },
                       { data: 'Nts' },
                        { data: 'City' },
                       { data: 'Pax' },
                       { data: 'SType' },
                       { data: 'SName' },
                       { data: 'SupName' },
                       { data: 'SupRefNo' },
                       { data: 'StId' },
                       { data: 'AgName' },
                       { data: 'DDate' },
                        { data: 'NCurr' },
                        { data: 'NAmt' },
                        { data: 'SCurr' },
                        { data: 'SAmt' },
                        { data: 'GInAED' },
                         { data: 'Status' },
                    { data: 'Postbyuser' },
                    { data: 'PostToUser' },
                    { data:'AcManager'},
                    { data:'AgCountry'},
                    { data:'AgCity'}
                ],
                rowCallback: function (row, data) {
                    if ((data["Postbyuser"] == data["PostToUser"] )) {                        
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
            $('#DSReport').DataTable().clear().destroy();

            $('#DSReport').DataTable({

                dom: 'Bfrtip',

                buttons: [

                    {
                        extend: 'excelHtml5',
                        text: '<i class="fa fa-file-excel-o"></i>',
                        filename: function () {
                            var ReportName = "Daily Sales Report"
                            var RptDetails = $scope.DailySReport.DateFrom + "-" + $scope.DailySReport.DateTo;
                            return ReportName + ' ( ' + RptDetails + ' ) '
                        },
                        sheetName: 'DSRptSheet',
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
                    { "visible": false, "targets": groupColumn },
                    {
                        "targets": 1,
                        orderable: false,
                    },
                        {
                            "visible": $scope.CCode == "4" ? true : false,
                            "targets": 2,
                        },
                     {
                         "targets": 3,
                         "className": "text-center",
                     },
                        {
                            "visible": groupColumn == "6" ? false : true,
                            "targets": 6,
                        },
                         {
                             "targets": 8,
                             orderable: false,
                             "visible": $scope.IsShowSupplier == "true" ? true : false,
                         },
                     {
                         "targets": 9,
                         orderable: false,
                     },
                      {
                          "visible": $scope.CCode == "4" ? true : false,
                          "targets": 10,
                      },
                      {
                          "visible": $scope.LoginMemberType == "4" || groupColumn == "11" ? false : true,
                          "targets": 11,

                      },
                     {
                         "targets": 12,
                         orderable: false,
                     },
                    {
                        "targets": 13,
                        "className": "text-center",
                    },
                    {
                        "targets": 14,
                        "className": "text-right",
                        "render": function (data, type, row) {
                            return row["NAmt"].toFixed(2);
                        },
                    },
                    {
                        "visible": groupColumn == "15" ? false : true,
                        "targets": 15,
                        "className": "text-center",
                    },
                    {
                        "targets": 16,
                        "className": "text-right",
                        "render": function (data, type, row) {
                            return row["SAmt"].toFixed(2);
                        },
                    },
                    {
                        "visible": $scope.CCode == "4" ? true : false,
                        "targets": 17,
                        "className": "text-right",
                        "render": function (data, type, row) {
                            return row["GInAED"].toFixed(2);
                        },
                    },
                        {
                            "visible": groupColumn == "18" ? false : true,
                            "targets": 18,
                    },
                    {
                        "targets": 19,
                        orderable: false,
                    },
                    {
                        "targets": 20,
                        orderable: false,

                    },
                    {
                        "targets": 21,
                        orderable: false,
                    },
                    {
                        "targets": 22,
                        orderable: false,
                    },
                    {
                        "targets": 23,
                        orderable: false,
                    },
                  
                ],

                searching: false,
                paging: true,
                data: $scope.MainResultlistAfterFilter,
                "pageLength": 30,
                select: true,
                autoWidth: false,
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
                       { data: 'VNo' },
                       { data: 'Nts' },
                        { data: 'City' },
                       { data: 'Pax' },
                       { data: 'SType' },
                       { data: 'SName' },
                       { data: 'SupName' },
                       { data: 'SupRefNo' },
                       { data: 'StId' },
                       { data: 'AgName' },
                       { data: 'DDate' },
                        { data: 'NCurr' },
                        { data: 'NAmt' },
                        { data: 'SCurr' },
                        { data: 'SAmt' },
                        { data: 'GInAED' },
                    { data: 'Status' },
                    { data: 'Postbyuser' },
                    { data: 'PostToUser' },
                    { data: 'AcManager' },
                    { data: 'AgCountry' },
                    { data: 'AgCity' }
                ],
                rowCallback: function (row, data) {
                    if ((data["Postbyuser"] == data["PostToUser"])) {
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

                                    '<tr class="group"><td colspan="20" style="color:#000000;font-size: 14px;text-align: left;padding: 7px 5px;">' + $scope.GroupingName + ' - ' + group + '</td></tr>'

                                );


                                last = group;
                            }
                            else {
                                groupid++;
                                $(rows).eq(i).before(


                                    '<tr class="group"><td colspan="20" style="color:#000000;font-size: 14px;text-align: left;padding: 7px 5px;">' + $scope.GroupingName + ' - ' + group + '</td></tr>'

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

    //Show cols for Excel and Copy
    function ShowHideExcelColumns() {
       

        if ($scope.CCode == "4")
        {
            $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,19,20,21,22,23];
            if ($scope.LoginMemberType == "4") {
                $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]

                if ($scope.IsShowSupplier != "true") {
                    $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
                }
            }
            else {
                $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]

                if ($scope.IsShowSupplier != "true") {
                    $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
                }
            }
        }
        else {

            $scope.ExcelCollist = [0, 1, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 23];

            if ($scope.LoginMemberType == "4") {
                $scope.ExcelCollist = [0, 1, 3, 4, 5, 6, 7, 8, 9, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 23]

                if ($scope.IsShowSupplier != "true") {
                    $scope.ExcelCollist = [0, 1, 3, 4, 5, 6, 7, 9, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 23]
                }
            }
            else {
                $scope.ExcelCollist = [0, 1, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 23]

                if ($scope.IsShowSupplier != "true") {
                    $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
                }
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
            $scope.SendMailDO.ReportName = "DSReport-" + " (" + $scope.DailySReport.DateFrom + " - " + $scope.DailySReport.DateTo + " )";

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
        Hide_Columns('DSReport')

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
        Apply_Sorting('DSReport', $scope.SortDetails)

    }
    $scope.ClearSorting = function () {
        $scope.SortDetails = [];
        $scope.SortDetails = Clear_Sorting('DSReport');
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

    HideColList.push("0~RefNo~Book Ref No /Pos");
    HideColList.push("1~ChkIn~Check In Date");
    if (GetE("hdnCCode").value == "4") {
        HideColList.push("2~VNo~Voucher No");
    }
    HideColList.push("3~Nts~Nights");
    HideColList.push("4~City~City Name");
    HideColList.push("5~Pax~Pax Name");
    HideColList.push("6~SType~Service");
    HideColList.push("7~SName~Service Name");
    if (GetE("hdnIsShowSupplier").value == "true") {
        HideColList.push("8~SupName~Supplier Name");
    }
    HideColList.push("9~SupRefNo~Supplier Ref No");
    if (GetE("hdnCCode").value == "4") {
        HideColList.push("10~StId~Staff Id");
    }
    if (GetE("hdnLoginMemberTypeId").value != "4") {
        HideColList.push("11~AgName~Agency Name");
    }
    HideColList.push("12~DDate~Deadline Date");
    HideColList.push("13~NCurr~Net Currency");
    HideColList.push("14~NAmt~Net Amount");
    HideColList.push("15~SCurr~Gross Currency");
    HideColList.push("16~SAmt~Gross Amount");
    if (GetE("hdnCCode").value == "4") {
        HideColList.push("17~GInAED~Gross In AED");
    }
    HideColList.push("18~Status~BookStatus");
    HideColList.push("19~Postbyuser~Post by User");

    HideColList.push("20~PostToUser~Post To User");
    HideColList.push("21~AcManager~Account Manager");
    HideColList.push("22~AgCountry~Agent Country");
    HideColList.push("23~AgCity~Agent City");




    if (GroupBy != "") {
        var NewHideColList = [];
        switch (GroupBy) {
            case '11':
                NewHideColList = removeElementsfromhidelist(HideColList, '11~AgName~Agency Name');
                break;
            case '18':
                NewHideColList = removeElementsfromhidelist(HideColList, '18~Status~BookStatus');
                break;
            case '6':
                NewHideColList = removeElementsfromhidelist(HideColList, '6~SType~Service');
                break;
            case '15':
                NewHideColList = removeElementsfromhidelist(HideColList, '15~SCurr~Gross Currency');
                break;
        }
    }

    NewHideColList = HideColList;
    return NewHideColList;

}

$(document).ready(function () {
    $(".date-cal").datepicker({ dateFormat: 'dd M yy', numberOfMonths: 2, });

    var table = $('#DSReport').dataTable();
    //for sorting icon clear custom sorting list
    table.on('click', 'th', function () {
        if ($(this).attr('class') == 'sorting_asc' || $(this).attr('class') == 'sorting_desc' || $(this).attr('class') == 'sorting') {
            var scope = angular.element(document.getElementById("MainWrap")).scope();
            scope.$apply(function () {
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

