var app = angular.module('Failedbookingreportapp', []);


var bid = ""; var brtypeid = ""; var mid = ""; var mrtypeid = ""; var bid = ""; var Wsid = ""; var membertypeid = "";
var isvalid = true;
app.controller('FailedbookingreportCntr', ['$scope', '$http', '$window', '$rootScope', '$timeout', function ($scope, $http, $window, $rootScope, $timeout) {
    NgInit();
    function NgInit() {
        $scope.FailedBookReport = FailedBookReportDO();
        $scope.ReportFilter = ReportFilterDO();
        $scope.PostBooking = PostBookingDO();
        $scope.SendMailDO = SendMailDO();
        
        $scope.LoginMemberType = GetE("hdnLoginMemberTypeId").value;
        $scope.LoginUserId = GetE("hdnLoginUserId").value;
        $scope.CompCode = GetE("hdnCCode").value;
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

        $("#ddl_BR option:selected").text("All Branch");
        $("#ddl_WS option:selected").text("All Wholesaler");
        $("#ddl_AG option:selected").text("All Agent");

        $scope.FailedBookReport.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
        $scope.FailedBookReport.DateTo = ConvertCustomrangedate(new Date());
       
        //this is PostBooking Init()
        $scope.PostBooking = PostBooking_Init($scope.PostBooking, $scope.LoginMemberType)

        //this is On Post Booking change events
        $rootScope.$on("CallPostBooking", function (event) {
            $scope.PostBooking = Set_PostMemberDetails(event, $scope.PostBooking);

        });
        $("#demo").addClass("collapse in");
       
       GetDetails();
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
    function GetDetails ()
    {
        $scope.serachstring = atob(getUrlVars()["S"]);      
        console.log($scope.serachstring);
        $scope.FailedBookReport.DateFrom = ConvertCustomrangedate(new Date())
        $scope.FailedBookReport.DateTo = ConvertCustomrangedate(new Date())
              
        $scope.FailedBookReport.BookingdateWise = $scope.serachstring.split('_')[3];
        $scope.FailedBookReport.DateFrom = ($scope.serachstring.split('_')[4]);
        $scope.FailedBookReport.DateTo = ($scope.serachstring.split('_')[5]);

        if ($scope.FailedBookReport.BookingdateWise == "true")
        {
            $("#BDW").prop("checked", true);
        }
        else {
            $("#ADW").prop("checked", true);
        }

        if ($scope.serachstring.split('_')[1] == 0)
        {
            $scope.FailedBookReport.MemberId = $scope.serachstring.split('_')[0];
            $scope.OnLoadPostMemberId = $scope.serachstring.split('_')[0];
            $scope.OnLoadReportCompanyName = $scope.serachstring.split('_')[2];
            $scope.IsGetfromHome = true;
            
        }
        else
        {
            $scope.FailedBookReport.MemberId = $scope.serachstring.split('_')[1];
            $scope.OnLoadPostMemberId = $scope.serachstring.split('_')[1];
            $scope.OnLoadReportCompanyName = $scope.serachstring.split('_')[2];
            $scope.IsGetfromHome = true;
           
          $("#hdnIsGetMemberdetails").val("true");
          $("#hdnMemberdetails").val($scope.FailedBookReport.MemberId);
                  
        }
        if ($scope.LoginMemberType == "2" || $scope.LoginMemberType == "3") {
            $scope.OnLoadReportCompanyName = "All Agent"
        }
      
      

        $timeout(function () {
            
            angular.element('#btnReportSerach').triggerHandler('click');
           
        });
        $("#demo")[0].style.display = 'none';
        console.log($scope.FailedBookReport);
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
            $scope.FailedBookReport.DateFrom = $scope.CustomDateRangeFilter.split("~")[0];
            GetE("txtToDate").value = $scope.CustomDateRangeFilter.split("~")[1];
            $scope.FailedBookReport.DateTo = $scope.CustomDateRangeFilter.split("~")[1];
        }
        else {
            GetE("txtFromDate").value = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            $scope.FailedBookReport.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            GetE("txtToDate").value = ConvertCustomrangedate(new Date());
            $scope.FailedBookReport.DateTo = ConvertCustomrangedate(new Date());
        }

    });

    //collasped and expand
    $scope.ShowModifyBtn = function () {
        $scope.ModifySearch = false;
        $("#demo")[0].style.display = 'none';

    }
    $scope.OnModifyClick = function()
    {
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
        $("#RptHeaderDetails")[0].style.display = "none";
        $("#Noresultdiv")[0].style.display = "none";
        PopUpController.ClosePopup("divPopup", "");
        $("#HeaderSearchdiv").removeClass();
        $("#HeaderSearchdiv").addClass("col-lg-12 col-md-12 col-sm-12 col-xs-12 container-fluid padd-lft10 padd-rgt10");
        $scope.ModifySearch = false;

        if ($scope.FailedBookReport.DateFrom == "") {

            Alert.render("Please Select Arrival-From Date", "txtFromDate");
            isvalid = false;
            return false;
        }

        if ($scope.FailedBookReport.DateTo == "") {
            Alert.render("Please Select Arrival-To Date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ($scope.FailedBookReport.DateFrom != "" && $scope.FailedBookReport.DateTo != "") {
            var dtObj1 = GetSystemDate($scope.FailedBookReport.DateFrom);
            var dtObj2 = GetSystemDate($scope.FailedBookReport.DateTo);
        }

        if (($scope.FailedBookReport.DateFrom != "" && $scope.FailedBookReport.DateTo != "") && (dtObj1 > dtObj2)) {
            Alert.render("Arrival-From date can not be greater than Arrival-To date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ((diffDate(new Date($scope.FailedBookReport.DateTo), new Date($scope.FailedBookReport.DateFrom))) > 12.50) {
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
            $scope.FailedBookReport.BookingdateWise = false;
        }
        if (document.getElementById('BDW').checked) {
            $scope.FailedBookReport.BookingdateWise = true;
        }



        if ($scope.IsGetfromHome == true) {
            $scope.PostBooking.ReportCompanyName = $scope.OnLoadReportCompanyName;
            $scope.PostBooking.PostMemberId = $scope.OnLoadPostMemberId;
        }


        $scope.MemberDetails = $scope.PostBooking.Br_Id + "_" + $scope.PostBooking.Ws_Id + "_" + $scope.PostBooking.Ag_Id + "_" + $scope.PostBooking.ReportCompanyName + "_" + GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text;


        $scope.FailedBookReport.MemberId = $scope.PostBooking.PostMemberId;
        $scope.FailedBookReport.LoginUserId = (document.getElementById("hdnLoginUserId")).value;
       




        if (isvalid == true) {
            $scope.GetReportDetails();
        }
    }


    //getReportDetails on serach click
    $scope.GetReportDetails = function () {

        var ReportName = "Failed Bookings Report";
        var popupdetail = $scope.PostBooking.ReportCompanyName + "~" + $scope.FailedBookReport.DateFrom + "~" + $scope.FailedBookReport.DateTo;
        PopUpController.OpenPopup1("divPopup", ReportName, popupdetail);

        $scope.ReportFilter.City = $scope.FilterDOList.filter(item=> item.Name == 'City').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'City')[0].Values) : "";
        $scope.ReportFilter.BrName = $scope.FilterDOList.filter(item=> item.Name == 'BrName').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'BrName')[0].Values) : "";
        $scope.ReportFilter.SType = $scope.FilterDOList.filter(item=> item.Name == 'SType').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'SType')[0].Values) : "";
        $scope.ReportFilter.BType = $scope.FilterDOList.filter(item=> item.Name == 'BType').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'BType')[0].Values) : "";
        $scope.ReportFilter.AgName = $scope.FilterDOList.filter(item=> item.Name == 'AgName').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'AgName')[0].Values) : "";
        $scope.ReportFilter.Status = $scope.FilterDOList.filter(item=> item.Name == 'Status').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'Status')[0].Values) : "";
        $scope.ReportFilter.SellCur = $scope.FilterDOList.filter(item=> item.Name == 'SellCur').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'SellCur')[0].Values) : "";
        $scope.ReportFilter.SellAmt = $scope.FilterDOList.filter(item=> item.Name == 'SellAmt').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'SellAmt')[0].Values) : "";

        $scope.ReportFilter.CustomDateOption = $("#ddl_CustomDateRange").val();;

        $scope.ReportFilter.IsAutoSoldOut = $scope.FilterDOList.filter(item=> item.Name == 'IsAutoSoldOut').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'IsAutoSoldOut')[0].Values) : "";;


        $("#demo").addClass("collapse in");

       
        $http({
            method: "post",
            url: "../Dashboard/GetFailedBookingReport",
            data: ({
                FailedBookingReportDO: $scope.FailedBookReport,
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


                        $scope.MainResultlist = $scope.MainResultlist.map(
                             item=> {
                                 item["SType"] = GetBookingServiceNameDirective(item["SType"]);
                                 item["Status"] = GetBookDisplayStatusDirective(item["Status"]);
                                 item["BType"] = GetBookingTypeDirective(item["BType"]);

                                 return item;
                             }
                          );
                        $scope.MainResultlistAfterFilter = $scope.MainResultlistAfterFilter.map(
                            item=> {
                                item["SType"] = GetBookingServiceNameDirective(item["SType"]);
                                item["Status"] = GetBookDisplayStatusDirective(item["Status"]);
                                item["BType"] = GetBookingTypeDirective(item["BType"]);

                                return item;
                            }
                        );
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
        var groupColumn = 12; //main grouping by Total              
        if ($scope.ReportFilter.GroupBy == "") {
            $('#FailedBookReport').DataTable().clear().destroy();
            $scope.collapsedGroups = {};
            $('#FailedBookReport').DataTable({

               
                "order": [],
                responsive: true,
                dom: 'Bfrtip',
                buttons: [


                    {
                        extend: 'excelHtml5',
                        text: '<i class="fa fa-file-excel-o"></i>',
                        filename: function () {
                            var ReportName = "Failed Bookings Report"
                            var RptDetails = $scope.FailedBookReport.DateFrom + "-" + $scope.FailedBookReport.DateTo;
                            return ReportName + ' ( ' + RptDetails + ' ) '
                        },
                        sheetName: 'FailedBookingsReportReportRptSheet',
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
                        {
                            text: '<button id="btncollase" class="cust-dt-button2">collapse All</button>',
                            titleAttr: 'collapse All',
                            action: function (e, dt, node, config) {
                                $scope.filter = true;
                                $scope.Expand = false;

                                SetDataTable();
                                $("#btncollase").attr("disabled", "disabled");
                                $("#btnExpand").removeAttr("disabled");


                            }
                        },
                         {
                             text: '<button  id="btnExpand" class="cust-dt-button2">Expand All</button>',
                             titleAttr: 'Expand All',
                             action: function (e, dt, node, config) {
                                 $scope.filter = true;
                                 $scope.Expand = true;

                                 SetDataTable();
                                 $("#btnExpand").attr("disabled", "disabled");
                                 $("#btncollase").removeAttr("disabled");


                             }
                         },
                       // {
                       //     text: '<span class="cust-dt-button">Compare</span>',
                       //    titleAttr: 'Compare',
                       //    action: function (e, dt, node, config) {

                       //        $("#RptGraph")[0].style.display = "block";
                       //        $("#RptDetails")[0].style.display = "none";
                       //        GetReportGraph();
                       //    }
                       //}


                ],

                "autoWidth": false,
                "columnDefs": [
                  { "visible": false, "targets": parseInt(groupColumn) },

             {

                 "targets": 1,
                 "orderable": false,
             },
              {
                  "targets": 2,
                  "orderable": false,
              },
              {

                  "targets": 3,
                  "className": "text-center",
              },
              {
                  "targets": 4,
                  "orderable": false,
              },
              {
                  "targets": 5,
                  "orderable": false,
              },
               {
                   "targets": 6,
                   "orderable": false,
               },
                {
                    "targets": 7,
                    "orderable": false,
                },
                 {
                     "targets": 8,
                     "orderable": false,
                 },
                 {

                     "targets": 9,
                     "orderable": false,

                 },

             {

                 "targets": 10,
                 "className": "text-right",
                
             },

              {

                  "targets": 11,
                  "visible": false,
              },
                 {

                     "targets": 12,
                     "visible": false,
                 },
                  {
                      "targets": 13,
                      "visible" :$scope.LoginUserId == "566" && $scope.CompCode=="1" ? true : false,

                  },
                  {
                      "targets": 14,                      
                  },

                ],
              
                searching: false,

                paging: false,
                data: $scope.MainResultlistAfterFilter,
                "pageLength": 30,
                "deferRender": true,
                select: true,
                columns: [
                      { data: 'RefNo' },

                       { data: 'ChkIn' },
                        { data: 'City' },
                       { data: 'Nts' },
                       { data: 'SType' },
                       { data: 'BType' },
                       { data: 'BrName' },
                        { data: 'AgName' },
                     { data: 'Status' },
                      { data: 'SellCur' },
                      { data: 'SellAmt' },
                      { data: 'SuppName' },
                       { data: 'TotalValue' },
                       { data: 'IsAutoSoldOut'},
                          { data: 'Error' }
                            


                ],            
                rowGroup: {                    
                    dataSrc: ['SuppName'],
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

                        if ($scope.Expand == true) {
                            var toggleClass = collapsed ? 'fa-plus-square' : 'fa-minus-square';
                        }
                        else {
                            var toggleClass = collapsed ? 'fa-minus-square' : 'fa-plus-square';
                        }


                        // Add group name to <tr>
                        return $('<tr/>')
                            .append('<td colspan="13">' + '<span  class="fa fa-fw ' + toggleClass + ' toggler"/><span style="width: 34% !important;font-size: 15px;"> ' + group + '</span><span style="margin-left:10px;font-weight: normal;"> Total Bookings : ' + rows.count() + '</span></td>')
                            .attr('data-name', group)
                            .attr('id',group)
                            .toggleClass('collapsed', collapsed);
                    },
                },

                "orderFixed": [[12, 'desc'], [11, 'asc']], //by Total desc,Supp name asc

            });
            if ($scope.filter != true) {
                $('#FailedBookReport tbody').on('click', 'tr.dtrg-start', function () {
                    var name = $(this).data('name');
                    //if ($scope.collapsedGroups[name] != true)
                    //{
                    $scope.collapsedGroups[name] = !$scope.collapsedGroups[name];
                    $('#FailedBookReport').DataTable().draw(false);
                    //}
                    console.log($scope.collapsedGroups);
                });
            }

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

    function ShowHideExcelColumns() {
        if ($scope.LoginUserId == "566" && $scope.CompCode == "1") {
            $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14]
        }
        else {
            $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14]
        }
    }

    //onHide Popup Click
    $scope.HideColumns = function () {
        //Hide_Columns is comm. fun in CommonUtility.js
        Hide_Columns('FailedBookReport')
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
        Apply_Sorting('FailedBookReport', $scope.SortDetails)
        

    }
    $scope.ClearSorting = function () {
        $scope.SortDetails = [];
        $scope.SortDetails = Clear_Sorting('FailedBookReport');
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
        enableCaseInsensitiveFiltering: true,
        buttonWidth: 250
    });


}

function GetHideColList(GroupBy) {
    var HideColList = [];

    HideColList.push("0~RefNo~Book Ref / Pos");
    HideColList.push("1~ChkIn~Check In Date");
    HideColList.push("2~City~City Name");
    HideColList.push("3~Nts~Nights");
    HideColList.push("4~SType~Service");
    HideColList.push("5~BType~Source");
    HideColList.push("6~BrName~Branch Name");
    HideColList.push("8~AgName~Agency Name");
    HideColList.push("8~Status~Status");
    HideColList.push("9~SellCur~Sell Currency");
    HideColList.push("10~SellAmt~Sell Amount");
    if (GetE("hdnLoginUserId").value == "566" && GetE("hdnCCode").value == "1") {
        HideColList.push("13~IsAutoSoldOut~Auto SoldOut");
    }
        HideColList.push("14~Error~Error");
   
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
    var table = $('#FailedBookReport').dataTable();
    //for sorting icon clear custom sorting list
    table.on('click', 'th', function () {
        var info = table.fnSettings().aaSorting;
        var idx = info[0][0];
        //alert(idx);
        //alert($(this).attr('class'));
        if ($(this).attr('class') == 'sorting_asc' || $(this).attr('class') == 'sorting_desc' || $(this).attr('class') == 'sorting' || $(this).attr('class') == 'text-center sorting_asc' || $(this).attr('class') == 'text-center sorting_desc' || $(this).attr('class') == 'text-right sorting_asc' || $(this).attr('class') == 'text-right sorting_desc')
        {
             var scope = angular.element(document.getElementById("MainWrap")).scope();
             scope.$apply(function () {               
                 scope.ClearPopupSoting();
                 scope.Onsortinghidegroup();
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




