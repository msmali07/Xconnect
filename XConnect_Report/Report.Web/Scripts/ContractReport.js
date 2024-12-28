var app = angular.module('Conportapp', []);


var bid = ""; var brtypeid = ""; var mid = ""; var mrtypeid = ""; var bid = ""; var Wsid = ""; var membertypeid = "";
var isvalid = true;
app.controller('ConportCntr', ['$scope', '$http', '$window', '$rootScope', '$timeout', function ($scope, $http, $window, $rootScope, $timeout) {
    NgInit();

    function NgInit() {
        $scope.ConReport = ContractReportDO();
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



        $scope.ConReport.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
        $scope.ConReport.DateTo = ConvertCustomrangedate(new Date());

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
            $scope.ConReport.DateFrom = $scope.CustomDateRangeFilter.split("~")[0];
            GetE("txtToDate").value = $scope.CustomDateRangeFilter.split("~")[1];
            $scope.ConReport.DateTo = $scope.CustomDateRangeFilter.split("~")[1];
        }
        else {
            GetE("txtFromDate").value = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            $scope.ConReport.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            GetE("txtToDate").value = ConvertCustomrangedate(new Date());
            $scope.ConReport.DateTo = ConvertCustomrangedate(new Date());
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

        if ($scope.ConReport.DateFrom == "") {

            Alert.render("Please Select Arrival-From Date", "txtFromDate");
            isvalid = false;
            return false;
        }

        if ($scope.ConReport.DateTo == "") {
            Alert.render("Please Select Arrival-To Date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ($scope.ConReport.DateFrom != "" && $scope.ConReport.DateTo != "") {
            var dtObj1 = GetSystemDate($scope.ConReport.DateFrom);
            var dtObj2 = GetSystemDate($scope.ConReport.DateTo);
        }

        if (($scope.ConReport.DateFrom != "" && $scope.ConReport.DateTo != "") && (dtObj1 > dtObj2)) {
            Alert.render("Arrival-From date can not be greater than Arrival-To date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ((diffDate(new Date($scope.ConReport.DateTo), new Date($scope.ConReport.DateFrom))) > 12.50) {
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
            $scope.ConReport.BookingdateWise = false;
        }
        if (document.getElementById('BDW').checked) {
            $scope.ConReport.BookingdateWise = true;
        }






        $scope.MemberDetails = $scope.PostBooking.Br_Id + "_" + $scope.PostBooking.Ws_Id + "_" + $scope.PostBooking.Ag_Id + "_" + $scope.PostBooking.ReportCompanyName + "_" + GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text;


        $scope.ConReport.MemberId = $scope.PostBooking.PostMemberId;
        $scope.ConReport.LoginUserId = (document.getElementById("hdnLoginUserId")).value;





        if (isvalid == true) {
            $scope.GetReportDetails();
        }
    }


    //getReportDetails on serach click
    $scope.GetReportDetails = function () {

        var popupdetail = $scope.PostBooking.ReportCompanyName + "~" + $scope.ConReport.DateFrom + "~" + $scope.ConReport.DateTo;
        PopUpController.OpenPopup1("divPopup", "Contract Report", popupdetail);

        //$scope.ReportFilter.Status = $scope.FilterDOList.filter(item=> item.Name == 'Status').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'Status')[0].Values) : "";
        //$scope.ReportFilter.SType = $scope.FilterDOList.filter(item=> item.Name == 'SType').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'SType')[0].Values) : "";
        //$scope.ReportFilter.AgName = $scope.FilterDOList.filter(item => item.Name == 'AgName').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'AgName')[0].Values) : "";
        //$scope.ReportFilter.AgCity = $scope.FilterDOList.filter(item => item.Name == 'AgCity').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'AgCity')[0].Values) : "";
        //$scope.ReportFilter.AgCountry = $scope.FilterDOList.filter(item => item.Name == 'AgCountry').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'AgCountry')[0].Values) : "";

        //$scope.ReportFilter.Nts = $scope.FilterDOList.filter(item=> item.Name == 'Nts').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'Nts')[0].Values) : "";
        //$scope.ReportFilter.Pax = $scope.FilterDOList.filter(item=> item.Name == 'Pax').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'Pax')[0].Values) : "";
        //$scope.ReportFilter.SName = $scope.FilterDOList.filter(item=> item.Name == 'SName').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'SName')[0].Values) : "";
        //$scope.ReportFilter.SAmt = $scope.FilterDOList.filter(item=> item.Name == 'SAmt').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'SAmt')[0].Values) : "";

        //$scope.ReportFilter.AGPay = $scope.FilterDOList.filter(item=> item.Name == 'AGPay').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'AGPay')[0].Values) : "";

        //$scope.ReportFilter.BRPay = $scope.FilterDOList.filter(item=> item.Name == 'BRPay').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'BRPay')[0].Values) : "";


        $scope.ReportFilter.CustomDateOption = $("#ddl_CustomDateRange").val();;



        $("#demo").addClass("collapse in");

        $http({
            method: "post",
            url: "../Booking/GetContractReportDetail",
            data: ({
                ContractSearchReportDO: $scope.ConReport,
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



            $('#ContractReport').DataTable().clear().destroy();
            $scope.collapsedGroups = {};
            $('#ContractReport').DataTable({

                "order": [],
                dom: 'Bfrtip',

                buttons: [

                    {
                        extend: 'excelHtml5',
                        text: '<i class="fa fa-file-excel-o"></i>',
                        filename: function () {
                            var ReportName = "Contract Report"
                            var RptDetails = $scope.ConReport.DateFrom + "-" + $scope.ConReport.DateTo;
                            return ReportName + ' ( ' + RptDetails + ' ) '
                        },
                        sheetName: 'ContractRptSheet',
                        title: null,
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
                        }
                    },
                   {
                       extend: 'copyHtml5',
                       text: '<i class="fa fa-files-o"></i>',
                       titleAttr: 'Copy',
                       exportOptions: {
                           columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
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
                    { "visible": false ,
                    orderable: false,
                    },
                                                                                   {
                                                                                       "targets": 0,
                                                                                       orderable: false,
                                                                                   },
                   {
                       "targets": 1,
                       orderable: false,
                       "visible": false,
                   },
                     {
                         "targets": 2,
                         orderable: false,
                     },
                                                               {
                                                                   "targets": 3,
                                                                   orderable: false,
                                                               },
                      {
                          "targets": 4,
                          orderable: false,
                      },
                             {
                                 "targets": 5,
                                 orderable: false,
                             },
                        {
                            "targets": 6,
                            orderable: false,
                        },
                        {
                            "targets": 7,
                            orderable: false,
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
                         "targets": 11,
                         orderable: false,
                     },
                      {
                          "targets": 12,
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
                       { data: 'Conid' },
                       { data: 'Hname' },
                       { data: 'SCat' },
                       { data: 'ConFrom' },
                       { data: 'ConTo' },
                       { data: 'Remark' },
                    { data: 'PName' },
                    { data: 'PFrom' },
                    { data: 'PTo' },
                        { data: 'BookDate' },
                        { data: 'ProUp' },
                        { data: 'SaleUp' },
                        { data: 'SaleDate' }
                ],
              //  "orderFixed": [[13, 'desc'], [11, 'asc']],
                rowGroup: {

                    
                    dataSrc: ['Hname'],
                    startRender: function (rows, group) {
                        var collapsed = !!$scope.collapsedGroups[group];

                        rows.nodes().each(function (r) {
                            if ($scope.Expand == true) {
                                r.style.display = collapsed ? 'none' : '';
                            }
                            else {
                                r.style.display = collapsed ? '' : 'none';
                            }
                            
                        });
                        if ($scope.Expand == true)
                        {
                            var toggleClass = collapsed ? 'fa-plus-square' : 'fa-minus-square';
                        }
                        else {
                            var toggleClass = collapsed ? 'fa-minus-square' : 'fa-plus-square';
                        }
                        

                      
                        // Add group name to <tr>
                        return $('<tr/>')
                            .append('<td  colspan="' + rows.columns()[0].length + '" >' + '<span  class="fa fa-fw ' + toggleClass + ' toggler"/><span style="width: 34% !important;"> ' + group + ' </span><span style="margin-left:10px;font-weight: normal;"> </span></td>')
                            .attr('data-name', group)
                            .attr('id',group)
                            .toggleClass('collapsed', collapsed);
                    },

                    


                },


            });

            if ($scope.filter != true)
            {
                $('#ContractReport tbody').on('click', 'tr.dtrg-start', function () {
                    var name = $(this).data('name');
                    
                    $scope.collapsedGroups[name] = !$scope.collapsedGroups[name];
                   
                    $('#ContractReport').DataTable().draw(false);

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
            var groupColumn = $scope.ReportFilter.GroupBy.split('~')[0];
            $('#ContractReport').DataTable().clear().destroy();

            $('#ContractReport').DataTable({

                "order": [],
                dom: 'Bfrtip',

                buttons: [
                       {
                           extend: 'excelHtml5',
                           text: '<i class="fa fa-file-excel-o"></i>',
                           filename: function () {
                               var ReportName = "Account Report"
                               var RptDetails = $scope.ConReport.DateFrom + "-" + $scope.ConReport.DateTo;
                               return ReportName + ' ( ' + RptDetails + ' ) '
                           },
                           sheetName: 'AccountRptSheet',
                           title: null,
                           exportOptions: {
                               columns: $scope.LoginMemberType == "4" ? [0, 1, 2, 3, 4, 5, 9, 13, 14] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
                           }
                       },
                   {
                       extend: 'copyHtml5',
                       text: '<i class="fa fa-files-o"></i>',
                       titleAttr: 'Copy',
                       exportOptions: {
                           columns: $scope.LoginMemberType == "4" ? [0, 1, 2, 3, 4, 5, 9, 13, 14] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
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
                    { "visible": false, orderable: false, "targets": groupColumn },
                     {
                   "targets": 0,
                    orderable: false,
                     },
                    {
                        "targets": 1,
                        orderable: false,
                        "visible": false,
                    },
                     {
                         "targets": 2,
                         orderable: false,
                     },
                                          {
                                              "targets": 3,
                                              orderable: false,
                                          },
                      {
                          "targets": 4,
                          orderable: false,
                      },
                                                   {
                                                       "targets": 5,
                                                       orderable: false,
                                                   },
                         {
                             "targets": 6,
                             orderable: false,
                         },
                        {
                            "targets": 7,
                            orderable: false,
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
                         "targets": 11,
                         orderable: false,
                     },
                      {
                          "targets": 12,
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
                       { data: 'Conid' },
                       { data: 'Hname' },
                       { data: 'SCat' },
                       { data: 'ConFrom' },
                       { data: 'ConTo' },
                       { data: 'Remark' },
                    { data: 'PName' },
                    { data: 'PFrom' },
                    { data: 'PTo' },
                        { data: 'BookDate' },
                        { data: 'ProUp' },
                        { data: 'SaleUp' },
                         { data: 'SaleDate' }
                ],





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

    //onHide Popup Clicksrno
    $scope.HideColumns = function () {

        //Hide_Columns is comm. fun in CommonUtility.js
        Hide_Columns('ContractReport')

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
        Apply_Sorting('ContractReport', $scope.SortDetails)

    }
    $scope.ClearSorting = function () {
        $scope.SortDetails = [];
        $scope.SortDetails = Clear_Sorting('ContractReport');
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

    HideColList.push("0~Conid~Sr No");
    HideColList.push("1~Hname~CHotel/Apartment Name");
    HideColList.push("2~SCat~Star Category");
    HideColList.push("3~ConFrom~Contract Validity From ");
    HideColList.push("4~ConTo~Contract Validity To");
    HideColList.push("5~Remark~Remarks");
    HideColList.push("6~PName~Promotion Name ");
    HideColList.push("7~PFrom~Promotion  Validity From");
    HideColList.push("8~BookDate~Promotion  Validity To");
    HideColList.push("9~ProUp~Book By Date");
    HideColList.push("10~SaleUp~Promo Last Updated On");
    HideColList.push("11~SaleDate~Stop Sale Last  Update ON");
    HideColList.push("12~PTo~Stop Sale Dates");
  



    if (GroupBy != "") {
        var NewHideColList = [];
        switch (GroupBy) {
            case '6':
                NewHideColList = removeElementsfromhidelist(HideColList, '6~AgName~Agency Name');
                break;
            case '13':
                NewHideColList = removeElementsfromhidelist(HideColList, '13~Status~BookStatus');
                break;
            case '4':
                NewHideColList = removeElementsfromhidelist(HideColList, '4~SType~Service');
                break;
            case '10':
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




    var table = $('#ContractReport').dataTable();
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

