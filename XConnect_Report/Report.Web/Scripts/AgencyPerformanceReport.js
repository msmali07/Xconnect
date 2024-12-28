var app = angular.module('Ageport', []);


var bid = ""; var brtypeid = ""; var mid = ""; var mrtypeid = ""; var bid = ""; var Wsid = ""; var membertypeid = "";
var isvalid = true;
app.controller('Ageportcntr', ['$scope', '$http', '$window', '$rootScope', '$timeout', function ($scope, $http, $window, $rootScope, $timeout) {
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
        SortingSetting();
        ShowHideExcelColumns();
        if ($scope.CCode == 1) {
            // $("#ddl_BR option:selected").text("Select Branch");           
            $("#ddl_BR option[value=" + 0 + "]").hide();
            $("#ddl_BR option[value=" + 0 + "]").add("Select Branch");
            $('#ddl_BR').prepend($('<option></option>').val("0").html('All Branch'));
        }
        else {
            $("#ddl_BR option:selected").text("All Branch");
        }
        //   $("#ddl_WS option:selected").text("All Wholesaler");
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

    //select grouping option
    $("#ddl_Grp").change(function () {
        $scope.ReportFilter.GroupBy = $("#ddl_Grp").val().split('~')[0];
        $scope.GroupingName = $("#ddl_Grp").val().split('~')[1];
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
        if ($scope.CCode == 1) {
            if ($scope.LoginMemberType == 1 && GetE("ddl_BR").options[GetE("ddl_BR").selectedIndex].text == "Select Branch") {
                Alert.render("Select Branch to Post Booking", "ddl_BR");
                isvalid = false;
                $scope.ModifySearch = true;
                return false;
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



        if (document.getElementById('ADW').checked) {
            $scope.AgencyReport.BookingdateWise = false;
        }
        if (document.getElementById('BDW').checked) {
            $scope.AgencyReport.BookingdateWise = true;
        }






        $scope.MemberDetails = $scope.PostBooking.Br_Id + "_" + $scope.PostBooking.Ws_Id + "_" + $scope.PostBooking.Ag_Id + "_" + $scope.PostBooking.ReportCompanyName + "_" + GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text;


        $scope.AgencyReport.MemberId = $scope.PostBooking.PostMemberId;
        $scope.AgencyReport.LoginUserId = (document.getElementById("hdnLoginUserId")).value;





        if (isvalid == true) {
            $scope.GetReportDetails();
        }
    }


    //getReportDetails on serach click
    $scope.GetReportDetails = function () {

        var popupdetail = $scope.PostBooking.ReportCompanyName + "~" + $scope.AgencyReport.DateFrom + "~" + $scope.AgencyReport.DateTo;
        PopUpController.OpenPopup1("divPopup", "Agency Performace Report", popupdetail);
        $scope.ReportFilter.CustomDateOption = $("#ddl_CustomDateRange").val();

        $("#divhdeading")[0].style.display = "block";
        $("#demo")[0].style.display = "none";
        //$("#btnsearch")[0].style.display = "none";
        $("#HeaderSearchdiv").removeClass();
        $("#HeaderSearchdiv").addClass("col-lg-12 col-md-12 col-sm-12 col-xs-12 container-fluid padd-lft10 padd-rgt10");
        $("#demo").addClass("collapse in");

        $http({
            method: "post",
            url: "../Booking/GetAgencyReportDetail",
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
        if ($scope.ReportFilter.GroupBy == "") {
            $('#AgencyReport').DataTable().clear().destroy();
            $scope.collapsedGroups = {};
            $('#AgencyReport').DataTable({
                "order": [],
                dom: 'Bfrtip',
                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: '<i class="fa fa-file-excel-o"></i>',
                        filename: function () {
                            var ReportName = "Agency Performance Report"
                            var AgeDetails = $scope.AgencyReport.DateFrom + "-" + $scope.AgencyReport.DateTo;
                            return ReportName + ' ( ' + AgeDetails + ' ) '
                        },
                        sheetName: 'AgencyPerformanceRptSheet',
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
                    {
                        "visible": false,
                        orderable: false,
                    },
                    {
                        "targets": 0,
                        orderable: true,
                        "className": "text-left",
                    },
                    {
                        "targets": 1,
                        orderable: true,
                        "className": "text-left",
                    },
                    {
                        "targets": 2,
                        orderable: true,
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
                        "visible": $scope.CCode != "1" ? true : false
                    },
                    {
                        "targets": 5,
                        orderable: false,
                        "className": "text-left",
                        "visible": $scope.CCode != "1" ? true : false
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
                        orderable: false,
                        "className": "text-left",
                    },
                    {
                        "targets": 9,
                        orderable: true,
                        "className": "text-right",
                    },
                    {
                        "targets": 10,
                        orderable: false,
                        "className": "text-right",
                    },
                    {
                        "targets": 11,
                        orderable: true,
                        "className": "text-center",
                    },
                    //{
                    //    "targets": 11,
                    //    orderable: true,
                    //    "className": "text-center",
                    //},

                    {
                        "targets": 12,
                        orderable: true,
                        "className": "text-center",
                    },
                    {
                        "targets": 13,
                        orderable: false,
                        "className": "text-center",
                        "visible": $scope.CCode != "1" ? true : false,
                    },
                    {
                        "targets": 14,
                        orderable: true,
                        "className": "text-center",
                        "visible": $scope.CCode == "1" ? true : false,
                    },
                    {
                        "targets": 15,
                        orderable: false,
                        "className": "text-center",
                        "visible": $scope.CCode != "1" ? true : false,
                    },
                    {
                        "targets": 16,
                        orderable: false,
                        "className": "text-center",
                        "visible": $scope.CCode != "1" ? true : false,
                    },

                    {
                        "targets": 17,
                        orderable: false,
                        "className": "text-center",
                        "visible": $scope.CCode != "1" ? true : false,
                    },

                    {
                        "targets": 18,
                        orderable: true,
                        "className": "text-center",
                    },
                    {
                        "visible": $scope.CCode != '1' ? true : false,
                        "targets": 19,
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
                    { data: 'Agname' },
                    { data: 'City' },
                    { data: 'Country' },
                    { data: 'Email' },
                    { data: 'Regdate' },
                    { data: 'bkdate' },
                    { data: 'Paymode' },
                    { data: 'Active' },
                    { data: 'Currency' },
                    { data: 'Tsale' },
                    { data: 'Agnotlogged' },
                    /*    { data: 'search' },*/
                    { data: 'Book' },
                    { data: 'Reconf' },
                    { data: 'finish' },//
                    { data: 'cancel' },//For ottila only
                    { data: 'canlwtc' },//+canceled Status
                    { data: 'canlwtnc' },
                    { data: 'tlbook' },//
                    { data: 'fail' },
                    { data: 'SalesPerson' }
                ],




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

        }
        else {
            //var groupColumn = $scope.ReportFilter.GroupBy.split('~')[0];
            //$('#AgencyReport').DataTable().clear().destroy();

            //$('#AgencyReport').DataTable({

            //    "order": [],
            //    dom: 'Bfrtip',

            //    buttons: [
            //           {
            //               extend: 'excelHtml5',
            //               text: '<i class="fa fa-file-excel-o"></i>',
            //               filename: function () {
            //                   var ReportName = "Account Report"
            //                   var AgeDetails = $scope.AgencyReport.DateFrom + "-" + $scope.AgencyReport.DateTo;
            //                   return ReportName + ' ( ' + AgeDetails + ' ) '
            //               },
            //            sheetName: 'AgencyPerformanceRptSheet',
            //               title: null,
            //               exportOptions: {
            //                   columns: $scope.LoginMemberType == "4" ? [0, 1, 2, 3, 4, 5, 9, 13, 14] : [0, 1, 2, 3, 4, 5, 6, 7, 8]
            //               }
            //           },
            //       {
            //           extend: 'copyHtml5',
            //           text: '<i class="fa fa-files-o"></i>',
            //           titleAttr: 'Copy',
            //           exportOptions: {
            //               columns: $scope.LoginMemberType == "4" ? [0, 1, 2, 3, 4, 5, 9, 13, 14] : [0, 1, 2, 3, 4, 5, 6, 7, 8]
            //           }
            //       },
            //         {
            //             text: '<span class="cust-dt-button">Column Visibility</span>',
            //             titleAttr: 'Hide',
            //             action: function (e, dt, node, config) {

            //                 $("#hidecoldiv").modal('show');

            //             }
            //         },
            //          {
            //              text: '<span class="cust-dt-button">Custom Sort</span>',
            //              titleAttr: 'Custom Sort',
            //              action: function (e, dt, node, config) {

            //                  $("#Sortcoldiv").modal('show');

            //              }
            //          },

            //    ],
            //    "columnDefs": [
            //        { "visible": false, orderable: false, "targets": groupColumn },
            //          {
            //              "targets": 0,
            //              orderable: false,
            //              "className": "text-left",
            //          },
            //       {
            //           "targets": 1,
            //           orderable: false,
            //           "className": "text-center",
            //       },
            //         {
            //             "targets": 2,
            //             orderable: false,
            //             "className": "text-center",
            //         },

            //          {
            //              "targets": 3,
            //              orderable: false,
            //              "className": "text-center",
            //          },
            //                 {
            //                     "targets": 4,
            //                     orderable: false,
            //                     "className": "text-center",
            //                 },
            //            {
            //                "targets": 5,
            //                orderable: false,
            //                "className": "text-center",
            //            },
            //            {
            //                "targets": 6,
            //                orderable: false,
            //                "className": "text-center",
            //            },
            //            {
            //                "targets": 7,
            //                orderable: false,
            //                "className": "text-center",
            //            },

            //        {
            //            "targets": 8,
            //            orderable: false,
            //            "className": "text-center",
            //        },


            //    ],

            //    searching: false,
            //    paging: true,
            //    data: $scope.MainResultlistAfterFilter,
            //    "pageLength": 30,
            //    select: true,
            //    autoWidth: false,
            //    ordering: true,
            //    order: [[groupColumn]],
            //    "orderFixed": [groupColumn, 'asc'],
            //    rowGroup: {
            //        startRender: null,
            //        endRender: function (rows, group) {
            //            var salaryAvg = rows
            //                .data()
            //                .pluck(7)
            //                .reduce(function (a, b) {
            //                    return a + b.replace(/[^\d]/g, '') * 1;
            //                }, 0) / rows.count();
            //            salaryAvg = $.fn.dataTable.render.number(',', '.', 0, '$').display(salaryAvg);


            //            return $('<tr/>')
            //                .append('<td colspan="7">Averages for ' + group + '</td>')
            //                .append('<td>' + salaryAvg + '</td>')
            //            .append('<td/>')
            //            .append('<td/>')

            //        },
            //        dataSrc: [groupColumn]
            //    },


            //    columns: [
            //          { data: 'Agname' },
            //           { data: 'search' },
            //           { data: 'Book' },
            //           { data: 'Reconf' },
            //           { data: 'finish' },
            //           { data: 'canlwtc' },
            //        { data: 'canlwtnc' },
            //        { data: 'tlbook' },
            //        { data: 'fail' }
            //    ],





            //    drawCallback: function (settings) {
            //        var api = this.api();
            //        var rows = api.rows({ page: 'current' }).nodes();
            //        var last = null;
            //        var totale = new Array();
            //        totale['Totale'] = new Array();
            //        var groupid = -1;
            //        var subtotale = new Array();
            //        var Colspan = 0;


            //        api.column(groupColumn, { page: 'current' }).data().each(function (group, i) {

            //            if (last !== group) {
            //                if (i > 0) {
            //                    groupid++;

            //                    $(rows).eq(i).before(

            //                        '<tr class="group"><td colspan="12" style="color:#000000;font-size: 14px;text-align: left;padding: 7px 5px;">' + $scope.GroupingName + ' - ' + group + '</td></tr>'

            //                    );


            //                    last = group;
            //                }
            //                else {
            //                    groupid++;
            //                    $(rows).eq(i).before(


            //                        '<tr class="group"><td colspan="12" style="color:#000000;font-size: 14px;text-align: left;padding: 7px 5px;">' + $scope.GroupingName + ' - ' + group + '</td></tr>'

            //                    );



            //                    last = group;
            //                }

            //            }





            //        });


            //    },



            //});
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
        if ($scope.CCode == "1") {
            $scope.ExcelCollist = [0, 1, 2, 3, 6, 7, 8, 9, 10, 11, 12, 14, 18];
        }
        else {
            $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18,19];
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

    HideColList.push("0~Agname~Agency Name");
    HideColList.push("1~City~City");
    HideColList.push("2~Country~Country");
    HideColList.push("3~Email~Email");
    //if (GetE("hdnCCode").value != "1") {
    //    HideColList.push("4~Regdate~Registered Date");
    //}  
    
    HideColList.push("6~Paymode~Payment Mode");
    HideColList.push("7~Active~Active");
    HideColList.push("8~Currency~Currency");
    HideColList.push("9~Tsale~Total Sales");
    HideColList.push("10~Agnotlogged~Agents not logged");
    /*  HideColList.push("10~search~Searches");*/
    HideColList.push("11~Book~Bookings");
    HideColList.push("12~Reconf~Reconfirmed");
    if (GetE("hdnCCode").value == "1") {
        HideColList.push("14~cancel~Cancelled");
    }
    if (GetE("hdnCCode").value != "1") {
        HideColList.push("4~Regdate~Registered Date");
        HideColList.push("5~bkdate~Last Book Date");
        HideColList.push("13~finish~Finished");
        HideColList.push("15~canlwtc~Cancelled with Charge");
        HideColList.push("16~canlwtnc~Cancelled with no charge");
        HideColList.push("17~tlbook~Under TL Bookings");
        HideColList.push("19~SalesPerson~Sales Person");
    }
    HideColList.push("18~fail~Failed");


    if (GroupBy != "") {
        var NewHideColList = [];
        switch (GroupBy) {
            case '7':
                NewHideColList = removeElementsfromhidelist(HideColList, '6~Agname~Agency Name');
                break;
            case '14':
                NewHideColList = removeElementsfromhidelist(HideColList, '13~Status~BookStatus');
                break;
            case '4':
                NewHideColList = removeElementsfromhidelist(HideColList, '4~SType~Service');
                break;
            case '11':
                NewHideColList = removeElementsfromhidelist(HideColList, '10~SCurr~Sell Currency');
                break;

        }

    }
    NewHideColList = HideColList;


    return NewHideColList;


}

$(document).ready(function () {

    $("#BookingReport").addClass("active");
    $(".date-cal").datepicker({ dateFormat: 'dd M yy', numberOfMonths: 2, });




    var table = $('#AgencyReport').dataTable();
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

