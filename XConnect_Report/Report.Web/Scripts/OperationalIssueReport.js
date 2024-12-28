var app = angular.module('OperationalIssuereportapp', []);


var bid = ""; var brtypeid = ""; var mid = ""; var mrtypeid = ""; var bid = ""; var Wsid = ""; var membertypeid = "";
var isvalid = true;
app.controller('OperationalIssuereportCntr', ['$scope', '$http', '$window', '$rootScope', '$timeout', function ($scope, $http, $window, $rootScope, $timeout) {
    NgInit();
    function NgInit() {
        $scope.OperationalIssueReport = OperationalIssueReportDO();
        $scope.ReportFilter = ReportFilterDO();
        $scope.PostBooking = PostBookingDO();
        $scope.SendMailDO = SendMailDO();

        $scope.IsShowSupplier = GetE("hdnIsShowSupplier").value;
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
        ShowHideExcelColumns();

        //Load supplier
        LoadSupplierList();

        //$scope.IsTopShowAValue = "0";
        //$scope.IsTopShowActive = false;
        //$scope.TopDivShow = true;

        $scope.OperationalIssueReport.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
        $scope.OperationalIssueReport.DateTo = ConvertCustomrangedate(new Date());


        //this is PostBooking Init()
        $scope.PostBooking = PostBooking_Init($scope.PostBooking, $scope.LoginMemberType)

        //this is On Post Booking change events
        $rootScope.$on("CallPostBooking", function (event) {
            $scope.PostBooking = Set_PostMemberDetails(event, $scope.PostBooking);

        });
        $("#demo").addClass("collapse in");

        //  GetDetails();


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

    //GetSupplierList
    function LoadSupplierList() {
        $scope.Supplierlist = [];
        $http.get("../CommonData/GetSuppiler").then(function (d) {
            $scope.Supplierlist = d.data;

        }, function (error) {
        })
    }


    //select customdate option
    Customdaterangelist1 = Customdaterangelist();

    $scope.DateRangeList = Customdaterangelist1;

    $("#ddl_CustomDateRange").change(function () {
        $scope.CustomDateRangeFilter = $("#ddl_CustomDateRange").val();

        if ($scope.CustomDateRangeFilter != "" && $scope.CustomDateRangeFilter != "0") {
            GetE("txtFromDate").value = $scope.CustomDateRangeFilter.split("~")[0];
            $scope.OperationalIssueReport.DateFrom = $scope.CustomDateRangeFilter.split("~")[0];
            GetE("txtToDate").value = $scope.CustomDateRangeFilter.split("~")[1];
            $scope.OperationalIssueReport.DateTo = $scope.CustomDateRangeFilter.split("~")[1];
        }
        else {
            GetE("txtFromDate").value = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            $scope.OperationalIssueReport.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            GetE("txtToDate").value = ConvertCustomrangedate(new Date());
            $scope.OperationalIssueReport.DateTo = ConvertCustomrangedate(new Date());
        }

    });

    //collasped and expand
    $scope.ShowModifyBtn = function () {
        $scope.ModifySearch = false;
        $("#demo")[0].style.display = 'none';

    }
    $scope.OnModifyClick = function () {
        $("#Noresultdiv")[0].style.display = "none";
        $("#Errordiv")[0].style.display = "none";
        $("#demo")[0].style.display = 'block';
    }

    
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

        if ($scope.OperationalIssueReport.DateFrom == "") {

            Alert.render("Please Select Arrival-From Date", "txtFromDate");
            isvalid = false;
            return false;
        }

        if ($scope.OperationalIssueReport.DateTo == "") {
            Alert.render("Please Select Arrival-To Date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ($scope.OperationalIssueReport.DateFrom != "" && $scope.OperationalIssueReport.DateTo != "") {
            var dtObj1 = GetSystemDate($scope.OperationalIssueReport.DateFrom);
            var dtObj2 = GetSystemDate($scope.OperationalIssueReport.DateTo);
        }

        if (($scope.OperationalIssueReport.DateFrom != "" && $scope.OperationalIssueReport.DateTo != "") && (dtObj1 > dtObj2)) {
            Alert.render("Arrival-From date can not be greater than Arrival-To date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ((diffDate(new Date($scope.OperationalIssueReport.DateTo), new Date($scope.OperationalIssueReport.DateFrom))) > 12.50) {
            Alert.render("Report Seraching Dates Should be Upto 12 Months", "txtToDate");
            isvalid = false;
            return false;
        }




        if (document.getElementById('ADW').checked) {
            $scope.OperationalIssueReport.BookingdateWise = false;
        }
        if (document.getElementById('BDW').checked) {
            $scope.OperationalIssueReport.BookingdateWise = true;
        }


        if ($scope.IsGetfromHome == true) {
            $scope.PostBooking.ReportCompanyName = $scope.OnLoadReportCompanyName;
            $scope.PostBooking.PostMemberId = $scope.OnLoadPostMemberId;
        }





        $scope.OperationalIssueReport.MemberId = $scope.PostBooking.PostMemberId;
        $scope.OperationalIssueReport.LoginUserId = (document.getElementById("hdnLoginUserId")).value;
     




        if (isvalid == true) {
            $scope.GetReportDetails();
        }
    }


    //getReportDetails on serach click
    $scope.GetReportDetails = function () {

        //var ReportName = $scope.OperationalIssueReport.BookStatus + " Booking Report";
        var popupdetail = $scope.OperationalIssueReport.SupplierName + "~" + $scope.OperationalIssueReport.DateFrom + "~" + $scope.OperationalIssueReport.DateTo;
        PopUpController.OpenPopup1("divPopup", "Operational Issue Report", popupdetail);
        $scope.ReportFilter.CustomDateOption = $("#ddl_CustomDateRange").val();;


        $scope.ReportFilter.SType = $scope.FilterDOList.filter(item=> item.Name == 'SType').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'SType')[0].Values) : "";
        $scope.ReportFilter.BType = $scope.FilterDOList.filter(item=> item.Name == 'BType').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'BType')[0].Values) : "";
        $scope.ReportFilter.CustomDateOption = $("#ddl_CustomDateRange").val();


        $("#demo").addClass("collapse in");


        $http({
            method: "post",
            url: "../Booking/GetOperationalIssueDetail",
            data: ({
                OperationalSearchReportDO: $scope.OperationalIssueReport,
            }),
            dataType: "json",
            headers: { "Content-Type": "application/json" }

        }).then(function (d) {

            if (d.data != undefined || d.data != null) {
                if (d.data.length > 0) {

                    $scope.MainResultlist = (d.data);
                    $scope.MainResultlistAfterFilter = (d.data);

                    console.log(d.data);

                    $scope.MainResultlist = $scope.MainResultlist.map(
                              item=> {
                                  item["SType"] = GetBookingServiceNameDirective(item["SType"]);
                                  item["BType"] = GetBookingTypeDirective(item["BType"]);
                                  

                                  return item;
                              }
                           );
                    $scope.MainResultlistAfterFilter = $scope.MainResultlistAfterFilter.map(
                        item=> {
                            item["SType"] = GetBookingServiceNameDirective(item["SType"]);
                            item["BType"] = GetBookingTypeDirective(item["BType"]);
                            item["Remarks"] = insert(item["Remarks"], "`")

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

    //Set DataTable
    function SetDataTable() {
        // var test = 2;

        if ($scope.ReportFilter.GroupBy == "") {
            $scope.TopDivShow = true;
            var Oldtable = $('#OperationalIssueReport').dataTable();

            var oldinfo = Oldtable.fnSettings().aaSorting;
            var orderdata = [];
            for (d = 0; d < oldinfo.length; d++) {
                if (oldinfo[d][0] != 0) {
                    orderdata.push([oldinfo[d][0], oldinfo[d][1]]);
                }

            }
            //console.log(orderdata);
            
            $('#OperationalIssueReport').DataTable().clear().destroy();


            $('#OperationalIssueReport').DataTable({


                "order": [],
                responsive: true,
                dom: 'Bfrtip',
                buttons: [


                    {
                        extend: 'excelHtml5',
                        text: '<i class="fa fa-file-excel-o"></i>',
                        filename: function () {
                            var ReportName = "Operational Issue Report"
                            var RptDetails = $scope.OperationalIssueReport.DateFrom + "-" + $scope.OperationalIssueReport.DateTo;
                            return ReportName + ' ( ' + RptDetails + ' ) '
                        },
                        sheetName: 'OperationalIssueRptSheet',
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
                       
                        //{
                        //    text: '<span class="cust-dt-button">Show : </span>',
                        //    titleAttr: 'Top',

                        //},
                        {

                        }

                ],

                "autoWidth": false,
                //'rowsGroup': [0, 9],
                "columnDefs": [
                    {
                        "visible": false,
                        orderable: false,
                    },
                     {
                         "targets": 0,
                         orderable: false,
                         "className": "text-left",
                     },
                   {
                       "targets": 1,
                       orderable: false,
                       "className": "text-left",
                   },
                     {
                         "targets": 2,
                         orderable: false,
                         "className": "text-left",
                     },
                      {
                          "targets": 3,
                          orderable: true,
                          "className": "text-left",
                      },
                      {
                          "targets": 4,
                          orderable: false,
                          "className": "text-center",
                      },
                          {
                              "targets": 5,
                              orderable: false,
                              "className": "text-center",
                          },
                            {
                                "targets": 6,
                                orderable: false,
                                "className": "text-center",
                            },
                              {
                                  "targets": 7,
                                  orderable: true,
                                  "className": "text-center",
                              },

                                {
                                    "targets": 8,
                                    orderable: false,
                                    text: "text-left",
                                    
                                },
                                   {
                                       "targets": 9,
                                       orderable: false,
                                       text: "text-left",
                                       
                                   },

                                {
                                    "targets": 10,
                                    orderable: false,
                                    //"className": "datatabletxtclps",
                       
                               
                                    "render": function (data, type, row) {
                                        return data.split("`").join("<br/>");
                                
                                    }

                                  
                                },
                                
                ],

                searching: false,
                rowGroup: {
                    dataSrc: [0]
                },
                paging: true,
                data: ($scope.IsTopShowActive == true ? $scope.MainResultlistAfterFilter.slice(0, $scope.IsTopShowAValue) : $scope.MainResultlistAfterFilter),
                "pageLength": 30,
                "deferRender": true,
                select: true,
                 autoWidth: false,

                columns: [
                      { data: 'RefNo' },
                       { data: 'SuppName' },
                       { data: 'BDate' },
                       { data: 'ChkIn' },
                       { data: 'SType' },
                       { data: 'SName' },
                       { data: 'BType' },
                       { data: 'Postbyuser'},
                       { data: 'RDate' },
                       {data:'MType'},
                       { data: 'Remarks'}
                      

                ],

                createdRow: function (row, data, dataIndex) {
                    // If name is "Ashton Cox"
                    if (data['MType'] == 1 && data['Count'] == 2) {
                        $('td:eq(0)', row).attr('rowspan', 2);
                        $('td:eq(1)', row).attr('rowspan', 2);
                        $('td:eq(2)', row).attr('rowspan', 2);
                        $('td:eq(3)', row).attr('rowspan', 2);
                        $('td:eq(4)', row).attr('rowspan', 2);
                        $('td:eq(5)', row).attr('rowspan', 2);
                        $('td:eq(6)', row).attr('rowspan', 2);
                    }

                    if (data['MType'] == 2 && data['Count'] === 2) {
                        // Add COLSPAN attribute
                        //$('td:eq(1)', row).attr('colspan', 6);

                        // Hide required number of columns
                        // next to the cell with COLSPAN attribute
                        $('td:eq(0)', row).css('display', 'none');
                        $('td:eq(1)', row).css('display', 'none');
                        $('td:eq(2)', row).css('display', 'none');
                        $('td:eq(3)', row).css('display', 'none');
                        $('td:eq(4)', row).css('display', 'none');
                        $('td:eq(5)', row).css('display', 'none');
                        $('td:eq(6)', row).css('display', 'none');

                     

                        // Update cell data
                        this.api().cell($('td:eq(1)', row)).data('N/A');
                    }
                }
           
              

            });
            //$('<div class="pull-right">' +
            //       '<select class="ddltop" id="ddltopdata">' +
            //       '<option value="0">All</option>' +
            //       '<option value="10">10</option>' +
            //       '<option value="15">15</option>' +
            //       '<option value="25">25</option>' +
            //        '<option value="50">50</option>' +
            //       '</select>' +
            //       '</div>').appendTo("#OperationalIssueReport_wrapper .dt-buttons"); //example is our table id


            $('select[id="ddltopdata"] option[value="' + $scope.IsTopShowAValue + '"]').attr("selected", "selected");


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

    function insert(str, value) {
        //return str.substr(0, index) + value + str.substr(index);
        //str = 'Bkg was confirmed on 29 Dec and after many follow up we got an update on 30 Dec evening that the hotel is sold out, Agent was very much upset on this issue. As per Ms. Anna from hotel Sales she had already sent stop sale on 29 Dec itself and it was not updated from supplier side.'
        var mid = str.length/2;
        var indexBeyondMid = str.indexOf(' ',mid);
        var indexBeforeMid = str.substring(0,mid).lastIndexOf(' ');
        var splitPoint = mid - indexBeforeMid < indexBeyondMid - mid 
                 ? indexBeforeMid 
                 : indexBeyondMid;
       var  firstHalf = str.substring(0,splitPoint);
       var secondHalf = str.substring(splitPoint + 1);
       //console.log(firstHalf);
       //console.log(secondHalf);
       var Newstr = firstHalf.concat("", "");
       var Newstr2 = Newstr + secondHalf;
       return Newstr + value + secondHalf;
  

    }
    //On Top ddl change ( //its for top show Functionality)
    $scope.ShowTopDataChange = function () {
        var topvalue = $("#ddltopdata").val();
        switch ($("#ddltopdata").val()) {
            case "10":
                $scope.IsTopShowActive = true;
                break;
            case "15":
                $scope.IsTopShowActive = true;
                break;
            case "25":
                $scope.IsTopShowActive = true;
                break;
            case "50":
                $scope.IsTopShowActive = true;
                break;
            case "0":
                $scope.IsTopShowActive = false;
                break;
        }
        $scope.IsTopShowAValue = topvalue;

        SetDataTable();
        $('select[id="ddltopdata"] option[value="' + $scope.IsTopShowAValue + '"]').attr("selected", "selected");
        $("#ddltopdatawithsort").val($scope.IsTopShowAValue);
    }


    //Show cols for Excel and Copy
    function ShowHideExcelColumns() {
        if ($scope.CCode == "1") {
            $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6, 7, 8,9,10];
        }
        else {
            $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6, 7, 8,9,10];
        }

    }

    //onHide Popup Click
    $scope.HideColumns = function () {
        //Hide_Columns is comm. fun in CommonUtility.js
        Hide_Columns('OperationalIssueReport')
    }

    //Filter
    //open filter popup 
    //$scope.OpenFilterPopup = function (SelectedFilterType) {
    //    $scope.FilterTypeActive = SelectedFilterType;

    //    $scope.SetFilterList();

    //    var model1 = angular.element(document.querySelector('#filterdiv'));
    //    model1.modal('show');

    //}
      //Filter
    //open filter popup 
    $scope.OpenFilterPopup = function (SelectedFilterType) {
        $scope.FilterTypeActive = SelectedFilterType;

        $scope.SetFilterList();
        //for show number filter for number col.
        if (ShowNumberFilterList().includes(SelectedFilterType)) {
            $scope.IsShowNumberFilter = true;
            $scope.NumFilterActive = false;
            if ($scope.FilterDOList.length > 0) {
                $scope.FilterDOList.filter(r => {
                    if (r.Name == $scope.FilterTypeActive && r.Values != "") {
                        if (r.Values.indexOf('~') == -1) {
                            $scope.NumFilterActive = true;
                        }

                    }
                });
            }

        }
        else {
            $scope.IsShowNumberFilter = false;
        }


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
        if ($scope.TopDivShow == true) {
            $scope.MainResultlistAfterFilter = TopData_With_Sort($scope.MainResultlistAfterFilter, $scope.SortDetails);
            $('select[id="ddltopdata"] option[value="' + $("#ddltopdatawithsort").val() + '"]').attr("selected", "selected");
            $scope.ShowTopDataChange();
        }
        Apply_Sorting('OperationalIssueReport', $scope.SortDetails)

    }
    $scope.ClearSorting = function () {
        $scope.SortDetails = [];
        $scope.SortDetails = Clear_Sorting('OperationalIssueReport');
        if ($scope.TopDivShow == true) {
            $scope.MainResultlistAfterFilter = $scope.MainResultlist;//this bcz now first load data as show
            $scope.ShowTopDataChange();
        }
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

    //function GetReportGraph() {
    //    google.charts.load('current', { 'packages': ['bar'] });
    //    google.charts.setOnLoadCallback(drawChart);

    //    function drawChart() {

    //        var arrSales = [['AgName', 'SType']];    // Define an array and assign columns for the chart.

    //        // Loop through each data and populate the array.
    //        $.each($scope.MainResultlistAfterFilter, function (index, value) {
    //            arrSales.push([value.AgName, value.SType]);
    //        });


    //        var data2 = google.visualization.arrayToDataTable([
    //          ['Year', 'Sales', 'Expenses', 'Profit'],
    //          ['2014', 1000, 400, 200],
    //          ['2015', 1170, 460, 250],
    //          ['2016', 660, 1120, 300],
    //          ['2017', 1030, 540, 350]
    //        ]);

    //        var data = google.visualization.arrayToDataTable(arrSales)


    //        var options = {
    //            chart: {
    //                title: 'Booking Report Graph',
    //                subtitle: 'Confirmed Bookings',
    //            },
    //            bars: 'vertical',
    //            vAxis: { format: 'decimal' },
    //            height: 400,
    //            colors: ['#1b9e77', '#d95f02', '#7570b3']
    //        };

    //        var chart = new google.charts.Bar(document.getElementById('columnchart_material'));

    //        chart.draw(data, google.charts.Bar.convertOptions(options));
    //    }
    //}


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

    HideColList.push("0~RefNo~Book Ref /Pos");
    HideColList.push("1~SuppName~Supplier Name");
    HideColList.push("2~BDate~Book Date");
    HideColList.push("3~ChkIn~Check In Date");
    HideColList.push("4~SType~Service");
    HideColList.push("5~SName~Service Name");
    HideColList.push("6~BType~Source");
    HideColList.push("7~Postbyuser~User");
    HideColList.push("8~RDate~Date");
    HideColList.push("9~MType~Member Type");
    HideColList.push("10~Remarks~Remarks")

 


    if (GroupBy != "") {
        var NewHideColList = [];

    }
    NewHideColList = HideColList;

 return NewHideColList;


}



$(document).ready(function () {

    $("#OPLReport").addClass("active");
    $(".date-cal").datepicker({ dateFormat: 'dd M yy', numberOfMonths: 2, });




    var table = $('#OperationalIssueReport').dataTable();
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


    $(document).on('change', '#ddltopdata', function () {
        //alert('Change Happened');
        var scope = angular.element(document.getElementById("MainWrap")).scope();
        scope.$apply(function () {
            scope.ShowTopDataChange();
        })
        return;

        //var oTable = $('#ProfitLossReport').dataTable();
        //oTable.fnLengthChange($('#ddltopdata').val());    
        //$('select[id="ddltopdata"] option[value="' + topvalue + '"]').attr("selected", "selected");



    });



});




