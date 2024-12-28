var app = angular.module('Supplierreportapp', []);


var bid = ""; var brtypeid = ""; var mid = ""; var mrtypeid = ""; var bid = ""; var Wsid = ""; var membertypeid = "";
var isvalid = true;
app.controller('SupplierreportCntr', ['$scope', '$http', '$window', '$rootScope', '$timeout', function ($scope, $http, $window, $rootScope, $timeout) {
    NgInit();
    function NgInit() {
        $scope.SupplierReport = SupplierReportDO();
        $scope.ReportFilter = ReportFilterDO();
        $scope.PostBooking = PostBookingDO();
        $scope.SendMailDO = SendMailDO();
         
        $scope.LoginMemberType = GetE("hdnLoginMemberTypeId").value;
        $scope.ModifySearch = true;
        $scope._IsHidePostBooking = false;
        $scope.MemberDetails = "";
        $scope.GroupingName = "";

        LoadCurrency();

        $scope.SortDetails = [];
        $scope.SortDetails.push(SortDetailDO());
        $scope.MainResultlistAfterFilter = [];
        $scope.ShowddlFilterList = [];
        $scope.FilterDOList = [];
        $scope.FilterTypeActive = "";
        $scope.selectedArray = "";
        $scope.OldSelectedfilterArrayValues = "";
        SortingSetting();




        $("#ddl_BR option:selected").text("All Branch");
        $("#ddl_WS option:selected").text("All Wholesaler");
        $("#ddl_AG option:selected").text("All Agent");





        $scope.SupplierReport.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
        $scope.SupplierReport.DateTo = ConvertCustomrangedate(new Date());


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
    function GetDetails() {
        $scope.serachstring = atob(getUrlVars()["S"]);
        console.log($scope.serachstring);
        $scope.SupplierReport.DateFrom = ConvertCustomrangedate(new Date())
        $scope.SupplierReport.DateTo = ConvertCustomrangedate(new Date())

        $scope.SupplierReport.BookingdateWise = $scope.serachstring.split('_')[3];
        $scope.SupplierReport.Currency = $scope.serachstring.split('_')[4];
        $scope.SupplierReport.InTerms = $scope.serachstring.split('_')[5];
        $scope.SupplierReport.DateFrom = ($scope.serachstring.split('_')[6]);
        $scope.SupplierReport.DateTo = ($scope.serachstring.split('_')[7]);

        if ($scope.SupplierReport.BookingdateWise == "true") {
            $("#BDW").prop("checked", true);
        }
        else {
            $("#ADW").prop("checked", true);
        }

        if ($scope.serachstring.split('_')[1] == 0) {
            $scope.SupplierReport.MemberId = $scope.serachstring.split('_')[0];
            $scope.OnLoadPostMemberId = $scope.serachstring.split('_')[0];
            $scope.OnLoadReportCompanyName = $scope.serachstring.split('_')[2];
            $scope.IsGetfromHome = true;

        }
        else {
            $scope.SupplierReport.MemberId = $scope.serachstring.split('_')[1];
            $scope.OnLoadPostMemberId = $scope.serachstring.split('_')[1];
            $scope.OnLoadReportCompanyName = $scope.serachstring.split('_')[2];
            $scope.IsGetfromHome = true;
            $("#hdnIsGetMemberdetails").val("true");
            $("#hdnMemberdetails").val($scope.SupplierReport.MemberId);


        }

        if ($scope.SupplierReport.InTerms == "2") {
            $("#Divcurrency")[0].style.display = "block";
        }
        else {
            $("#Divcurrency")[0].style.display = "none";
        }

        if ($scope.LoginMemberType == "2" || $scope.LoginMemberType == "3") {
            $scope.OnLoadReportCompanyName = "All Agent"
        }


        $timeout(function () {

            angular.element('#btnReportSerach').triggerHandler('click');

        });
        $("#demo")[0].style.display = 'none';
        console.log($scope.SupplierReport);
    }


    //select grouping option
    $("#ddl_Grp").change(function () {
        $scope.ReportFilter.GroupBy = $("#ddl_Grp").val().split('~')[0];
        $scope.GroupingName = $("#ddl_Grp").val().split('~')[1];
    });

    $("#ddl_terms").change(function () {
        if ($("#ddl_terms").val() == "2") {
            $("#Divcurrency")[0].style.display = "block";
        }
        else {
            $("#Divcurrency")[0].style.display = "none";
        }
    });

    $("#ddl_currency").change(function () {
        $scope.SupplierReport.Currency = $("#ddl_currency").val();
    });

    //select customdate option
    Customdaterangelist1 = Customdaterangelist();

    $scope.DateRangeList = Customdaterangelist1;

    $("#ddl_CustomDateRange").change(function () {
        $scope.CustomDateRangeFilter = $("#ddl_CustomDateRange").val();

        if ($scope.CustomDateRangeFilter != "" && $scope.CustomDateRangeFilter != "0") {
            GetE("txtFromDate").value = $scope.CustomDateRangeFilter.split("~")[0];
            $scope.SupplierReport.DateFrom = $scope.CustomDateRangeFilter.split("~")[0];
            GetE("txtToDate").value = $scope.CustomDateRangeFilter.split("~")[1];
            $scope.SupplierReport.DateTo = $scope.CustomDateRangeFilter.split("~")[1];
        }
        else {
            GetE("txtFromDate").value = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            $scope.SupplierReport.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            GetE("txtToDate").value = ConvertCustomrangedate(new Date());
            $scope.SupplierReport.DateTo = ConvertCustomrangedate(new Date());
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
        $("#RptNonProdSupp")[0].style.display = "none";
        $("#RptBlockSupplier")[0].style.display = "none";

        $("#RptHeaderDetails")[0].style.display = "none";
        $("#Noresultdiv")[0].style.display = "none";
        PopUpController.ClosePopup("divPopup", "");
        $("#HeaderSearchdiv").removeClass();
        $("#HeaderSearchdiv").addClass("col-lg-12 col-md-12 col-sm-12 col-xs-12 container-fluid padd-lft10 padd-rgt10");
        $scope.ModifySearch = false;

        if ($scope.SupplierReport.DateFrom == "") {

            Alert.render("Please Select Arrival-From Date", "txtFromDate");
            isvalid = false;
            return false;
        }

        if ($scope.SupplierReport.DateTo == "") {
            Alert.render("Please Select Arrival-To Date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ($scope.SupplierReport.DateFrom != "" && $scope.SupplierReport.DateTo != "") {
            var dtObj1 = GetSystemDate($scope.SupplierReport.DateFrom);
            var dtObj2 = GetSystemDate($scope.SupplierReport.DateTo);
        }

        if (($scope.SupplierReport.DateFrom != "" && $scope.SupplierReport.DateTo != "") && (dtObj1 > dtObj2)) {
            Alert.render("Arrival-From date can not be greater than Arrival-To date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ((diffDate(new Date($scope.SupplierReport.DateTo), new Date($scope.SupplierReport.DateFrom))) > 12.50) {
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
            $scope.SupplierReport.BookingdateWise = false;
        }
        if (document.getElementById('BDW').checked) {
            $scope.SupplierReport.BookingdateWise = true;
        }

        if ($scope.SupplierReport.InTerms == "2" || $("#ddl_terms").val() == "2") {
            if ($scope.SupplierReport.Currency == "0" && $("#ddl_currency").val() == "0") {
                Alert.render("Plaese Select Currency", "ddl_currency");
                isvalid = false;
                return false;
            }
        }

        if ($scope.IsGetfromHome == true) {
            $scope.PostBooking.ReportCompanyName = $scope.OnLoadReportCompanyName;
            $scope.PostBooking.PostMemberId = $scope.OnLoadPostMemberId;
        }


        $scope.MemberDetails = $scope.PostBooking.Br_Id + "_" + $scope.PostBooking.Ws_Id + "_" + $scope.PostBooking.Ag_Id + "_" + $scope.PostBooking.ReportCompanyName + "_" + GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text;


        $scope.SupplierReport.MemberId = $scope.PostBooking.PostMemberId;
        $scope.SupplierReport.LoginUserId = (document.getElementById("hdnLoginUserId")).value;

        $scope.SupplierReport.InTerms = $("#ddl_terms").val();

        $scope.SupplierReport.ProdType = $("#ddl_productive").val();





        if (isvalid == true) {
            $scope.GetReportDetails();
        }
    }


    //getReportDetails on serach click
    $scope.GetReportDetails = function () {

        var ReportName = "Suppliers Productivity Report";
        var popupdetail = $scope.PostBooking.ReportCompanyName + "~" + $scope.SupplierReport.DateFrom + "~" + $scope.SupplierReport.DateTo;
        PopUpController.OpenPopup1("divPopup", ReportName, popupdetail);

        $scope.ReportFilter.City = $scope.FilterDOList.filter(item=> item.Name == 'City').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'City')[0].Values) : "";
        $scope.ReportFilter.BrName = $scope.FilterDOList.filter(item=> item.Name == 'BrName').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'BrName')[0].Values) : "";
        $scope.ReportFilter.Nts = $scope.FilterDOList.filter(item=> item.Name == 'Nts').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'Nts')[0].Values) : "";
        $scope.ReportFilter.SType = $scope.FilterDOList.filter(item=> item.Name == 'SType').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'SType')[0].Values) : "";
        $scope.ReportFilter.BType = $scope.FilterDOList.filter(item=> item.Name == 'BType').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'BType')[0].Values) : "";
        $scope.ReportFilter.AgName = $scope.FilterDOList.filter(item=> item.Name == 'AgName').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'AgName')[0].Values) : "";
        $scope.ReportFilter.SellCur = $scope.FilterDOList.filter(item=> item.Name == 'SellCur').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'SellCur')[0].Values) : "";
        $scope.ReportFilter.Status = $scope.FilterDOList.filter(item=> item.Name == 'Status').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'Status')[0].Values) : "";


        $scope.ReportFilter.CustomDateOption = $("#ddl_CustomDateRange").val();;



        $("#demo").addClass("collapse in");


        $http({
            method: "post",
            url: "../Dashboard/GetSupplierBookingReport",
            data: ({
                SuppBookingReportDO: $scope.SupplierReport,
            }),
            dataType: "json",
            headers: { "Content-Type": "application/json" }

        }).then(function (d) {

            if (d.data["Data"] == undefined || d.data["Data"] == null) {
                SessionTimeout(); //this function in Commonutility js
            }
            else {
                if (d.data["Data"] != undefined || d.data["Data"] != null) {
                    if (d.data["Data"].MainResultlist.length > 0) {

                        $scope.Resultlist = (d.data["Data"].MainResultlist);

                        $scope.MainResultlist = (d.data["Data"].MainResultlist).filter(a=>a.RefNo != "/" || a.AgName != "");
                        $scope.MainResultlistAfterFilter = (d.data["Data"].MainResultlist).filter(a=>a.RefNo != "/" || a.AgName != "");

                        $scope.NonProdResultlist = (d.data["Data"].MainResultlist).filter(a=>a.RefNo == "/" || a.AgName == "");
                        $scope.NonProdResultlist = sortByKeyAsc($scope.NonProdResultlist, 'SuppName')

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

                        if ($scope.SupplierReport.ProdType == 3) {
                            $("#RptDetails")[0].style.display = "none";
                            $("#RptNonProdSupp")[0].style.display = "block";
                            GetNonProductiveSupplier();
                        }
                        // $scope.BlockSupplierList = [];

                        //d.data.BlockSupplierlist.HSupplierDOList.filter(a=>
                        //{
                        //    $scope.BlockSupplierList.push(a);
                        //});

                        //d.data.BlockSupplierlist.TSupplierDOList.filter(a=> {
                        //    $scope.BlockSupplierList.push(a);
                        //});

                        //d.data.BlockSupplierlist.SSupplierDOList.filter(a=> {
                        //    $scope.BlockSupplierList.push(a);
                        //});

                        //d.data.BlockSupplierlist.CSupplierDOList.filter(a=> {
                        //    $scope.BlockSupplierList.push(a);
                        //});


                        $scope.BlockSupplierList = d.data["Data"].BlockSupplierlist.map(
                             item=> {
                                 item["Service"] = GetBookingServiceNameDirective(item["Service"]);
                                 return item;
                             }
                         );


                        console.log($scope.BlockSupplierList);

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
        var groupColumn = 11; //main grouping by Total
        var groupedData = {};
        let branchName = [];
        let tooltipContent;
        if ($scope.ReportFilter.GroupBy == "") {
            $('#SupplierReport').DataTable().clear().destroy();
            $scope.collapsedGroups = {};
            var top = '';
            var parent = '';
            $('#SupplierReport').DataTable({



                responsive: true,
                dom: 'Bfrtip',
                buttons: [


                    {
                        extend: 'excelHtml5',
                        text: '<i class="fa fa-file-excel-o"></i>',
                        filename: function () {
                            var ReportName = "Supplier Productivity  Report"
                            var RptDetails = $scope.SupplierReport.DateFrom + "-" + $scope.SupplierReport.DateTo;
                            return ReportName + ' ( ' + RptDetails + ' ) '
                        },
                        sheetName: 'SupplierProductivityRptSheet',
                        title: null,
                        exportOptions: {

                            columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12, 14],
                        }

                    },
                      {
                          extend: 'copyHtml5',
                          text: '<i class="fa fa-files-o"></i>',
                          titleAttr: 'Copy',
                          exportOptions: {

                              columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14],
                          }
                      },
                       {
                           text: '<span class="cust-dt-button">Column Visibility</span>',
                           titleAttr: 'hide',
                           action: function (e, dt, node, config) {

                               $("#hidecoldiv").modal('show');

                           }
                       },
                       //{
                       //    text: '<span class="cust-dt-button">Custom Sort</span>',
                       //    titleAttr: 'Custom Sort',
                       //    action: function (e, dt, node, config) {

                       //        $("#Sortcoldiv").modal('show');

                       //    }
                       //},
                       {
                           text: '<span class="cust-dt-button">Summary</span>',
                           titleAttr: 'summary',
                           action: function (e, dt, node, config) {

                               GetReportSummary();

                           }
                       },
                       {
                          
                           text: $scope.SupplierReport.ProdType != 2 ? '<span class="cust-dt-button" >Non-Productive Supplier(XML)</span>' : '',
                           titleAttr: $scope.SupplierReport.ProdType != 2 ? 'Non-Productive Supplier(XML)' : '',
                           action: function (e, dt, node, config) {

                               GetNonProductiveSupplier();
                              
                           }
                       },
                       {

                           text:'<span class="cust-dt-button">Blocked Supplier</span>',
                           titleAttr: 'Blocked Supplier',
                           action: function (e, dt, node, config) {

                               GetBlockSupplier();

                           }
                       },
                        {
                            text: '<button id="btncollase" class="cust-dt-button2">collapse All</button>',
                            titleAttr: 'collapse All',
                            action: function (e, dt, node, config) {
                                $scope.filter = true;
                                $scope.Expand = false;

                                CollapsedAll();
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

                                 ExpandAll();
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
                          {
                              "targets": 0,
                              "orderable": false,
                          },
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
                                 "render": function (data, type, row) {
                                     return row["SName"].substring(0, 30);
                                 },
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
                                 "className": "text-left sorting_disabled",

                                 "orderable": false,
                             },
                         {
                             "targets": 10,
                             "orderable": false,
                             "className": "text-right",
                             "render": function (data, type, row) {
                                 return row["MainSellAmt"].toFixed(2);
                             },
                         },
                               {
                                   "targets": 11,

                                   "orderable": false,
                               },
                          {
                              "targets": 12,
                              "className": "text-center",
                              "visible": false,
                              "render": function (data, type, row) {
                                  return (row["SuppName"]).split('~')[0]
                              },
                          },
                          {
                              "targets": 13,
                              "className": "text-center",
                              "visible": false,
                          },
                                                    {
                                                        "targets": 14,
                                                        "orderable": false,
                                                    },


                ],

                searching: true,

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
                          { data: 'SName' },
                        { data: 'BType' },
                        { data: 'BrName' },
                         { data: 'AgName' },
                            { data: 'SellCur' },
                          { data: 'MainSellAmt' },
                      { data: 'Status' },

                       { data: 'SuppName' },
                        { data: 'TotalValue' },
                        { data: 'Postbyuser' }

                ],
                rowGroup: {
                    dataSrc: ['SuppName', 'SellCur'],
                    startRender: function (rows, group, level) {
                        
                        //----------------------------------------
                        var tooldata;

                        var currency;
                        var RowsData01;

                        if (level === 0) {
                             //Initialize the group for BrName                          
                            if (!groupedData[group]) {
                                groupedData[group] = [];
                                branchName = group;
                            }
                        } else {
                            // Add SellCur and its count to the corresponding BrName group
                             let currency = group;
                            let Count = rows.count();
                            var TotalSellamount1 = rows
                                .data()
                                .pluck('MainSellAmt')
                                .reduce(function (a, b) {
                                    return a + b;
                                });
                            let RowsData01 = parseFloat(TotalSellamount1).toFixed(2);
                            let brName = rows.data()[0].SuppName;
                           
                            let exists = groupedData[brName].some(item => item.SellCur === currency);

                            if (!exists) {
                                groupedData[brName].push({ SellCur: currency, Count: Count, Amount: RowsData01 });
                            }
                        }
                       tooldata = groupedData;
                        console.log(groupedData);
     //------------------------------------------------------
                        var all;

                        if (level === 0) {
                            top = group;
                            all = group;
                            middle = '';
                        } else {
                            // if parent collapsed, nothing to do
                            if (!!$scope.collapsedGroups[top]) {
                                return;
                            }
                            if (level === 1) {
                                middle = group
                            }
                            all = top + middle + group;
                        }



                        var collapsed = !!$scope.collapsedGroups[all];



                        rows.nodes().each(function (r) {
                            if ($scope.Expand == true) {
                                r.style.display = collapsed ? 'none' : '';
                            }
                            else {
                                if (level === 0) {
                                    r.style.display = collapsed ? 'none' : '';
                                }
                                else {
                                    r.style.display = collapsed ? '' : 'none';
                                }
                            }
                        });

                        if ($scope.Expand == true) {

                            var toggleClass = collapsed ? 'fa-plus-square' : 'fa-minus-square';

                        }
                        else {
                            if (level === 0) {
                                var toggleClass = collapsed ? 'fa-plus-square' : 'fa-minus-square';
                            }
                            else {
                                var toggleClass = collapsed ? 'fa-minus-square' : 'fa-plus-square';
                            }

                        }

                        if ($scope.SupplierReport.InTerms == 2 && middle != '') {
                            var TotalSellamount = rows
                                  .data()
                                  .pluck('MainSellAmt')
                                  .reduce(function (a, b) {
                                      return a + b;
                                  });


                            return $('<tr/>')
                                 .append('<td colspan="13">' + '<span  class="fa fa-fw ' + toggleClass + ' toggler"/><span>Sell Currency : ' + group + '</span><span style="margin-left:5px;"> (' + rows.count() + ')' + '   Total SellAmount : ' + parseFloat(TotalSellamount).toFixed(2) + '</span></td>')
                                .attr('data-name', all)
                                .toggleClass('collapsed', collapsed);
                        }
                        else if ($scope.SupplierReport.InTerms == 1 && middle != '') {
                            var TotalSellamount = rows
                               .data()
                               .pluck('MainSellAmt')
                               .reduce(function (a, b) {
                                   return a + b;
                               });

                            return $('<tr/>')
                                .append('<td colspan="13">' + '<span  class="fa fa-fw ' + toggleClass + ' toggler"/><span>Sell Currency : ' + group + '</span><span style="margin-left:5px;">  (' + rows.count() + ')' + '   Total SellAmount : ' + parseFloat(TotalSellamount).toFixed(2) + '</span></td>')
                                .attr('data-name', all)
                                .toggleClass('collapsed', collapsed);
                        }
                        else if ($scope.SupplierReport.InTerms == 2 && middle == '') {
                            var total = rows
                                   .data()
                                   .pluck('TotalValue')
                                   .reduce(function (a, b) {
                                       return a + 0;
                                   });


                            return $('<tr/>')
                              .append('<td colspan="13">' + '<span  class="fa fa-fw ' + toggleClass + ' toggler"/><span style="width: 34% !important;font-size: 15px;"> ' + group.split('~')[0] + '</span><span style="margin-left:10px;font-weight: normal;"> Total Selling in ' + $scope.SupplierReport.Currency + ': ' + total.toFixed(2) + '</span></td>')
                                .attr('data-name', all)
                                .toggleClass('collapsed', collapsed);
                        }
                        else if ($scope.SupplierReport.InTerms == 1 && middle == '') {
                            var total = rows
                                  .data()
                                  .pluck('TotalValue')
                                  .reduce(function (a, b) {
                                      return a + 0;
                                  });
                            //tooltip--------------------
                            branchName = group; //to check branch name
                            if (groupedData[branchName]) {
                                tooltipContent = groupedData[branchName].map(item => `Sell Currency :${item.SellCur} (${item.Count}), Total Payable :${item.Amount}`).join('\n');
                            }
                            //tooltip--------------------
                            return $('<tr/>')
                                .append('<td class="title-tip"   data-title= "' + tooltipContent +'"  colspan="13">' + '<span  class="fa fa-fw ' + toggleClass + ' toggler"/><span style="width: 34% !important;font-size: 15px;"> ' + group.split('~')[0] + '</span><span style="margin-left:10px;font-weight: normal;"> Total Bookings : ' + rows.count() + '</span></td>')
                                .attr('data-name', all)
                                .toggleClass('collapsed', collapsed);
                        }


                    }
                },


                "orderFixed": [[13, 'desc'], [12, 'desc'], [9, 'asc']], //by Total desc,Supp name asc
                initComplete: function () {
                    // Start with closed groups
                    $('#SupplierReport tbody tr.dtrg-start').each(function () {
                        var name = $(this).data('name');
                        $scope.collapsedGroups[name] = !$scope.collapsedGroups[name];

                    });
                    $('#SupplierReport').DataTable().draw(false);


                }

            });

            if ($scope.filter != true) {
                $('#SupplierReport tbody').on('click', 'tr.dtrg-start', function () {
                    var name = $(this).data('name');
                    //if ($scope.collapsedGroups[name] != true)
                    //{
                    $scope.collapsedGroups[name] = !$scope.collapsedGroups[name];
                    $('#SupplierReport').DataTable().draw(false);
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

    function CollapsedAll() {
        $('#SupplierReport tbody tr.dtrg-start').each(function () {
            var name = $(this).data('name');
            $scope.collapsedGroups[name] = !$scope.collapsedGroups[name];

        });
        $('#SupplierReport').DataTable().draw(false);
    }

    function ExpandAll() {
        $('#SupplierReport tbody tr.dtrg-start').each(function () {
            var name = $(this).data('name');
            $scope.collapsedGroups = {};

        });
        $('#SupplierReport').DataTable().draw(false);

    }


    //onHide Popup Click
    $scope.HideColumns = function () {
        //Hide_Columns is comm. fun in CommonUtility.js
        Hide_Columns('SupplierReport')
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
        Apply_Sorting('SupplierReport', $scope.SortDetails)


    }
    $scope.ClearSorting = function () {
        $scope.SortDetails = [];
        $scope.SortDetails = Clear_Sorting('SupplierReport');
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

    //GetCurrencyList
    function LoadCurrency() {
        $scope.Currencylist = [];
        $http.get("../CommonData/GetCurrency").then(function (d) {
            $scope.Currencylist = d.data;

        }, function (error) {
        })
    }

    //ReportSummry
    function GetReportSummary() {
        $("#RptDetails")[0].style.display = "none";
        $("#RptSummary")[0].style.display = "block";
        $("#RptNonProdSupp")[0].style.display = "none";
        $("#RptBlockSupplier")[0].style.display = "none";

        $scope.SummaryList = groupBy($scope.Resultlist, 'SuppName');


        $scope.TotalSummaryList = [];

        $.each($scope.SummaryList, function (item) {

            var Bookingcount = 0;
            var Total = 0;


            $.each($scope.SummaryList[item], function (i) {

                Bookingcount = $scope.SummaryList[item].length;

            });
            if ($scope.SupplierReport.InTerms == 2) {

                $scope.SummaryList[item].filter(a=> {
                    Total = a.TotalValue;
                });


            }

            $scope.TotalSummaryList.push({ SuppName: item, ProdType: $scope.SummaryList[item][0].ProdType, LastBookingDate: $scope.SummaryList[item][0].LastBookingDate, TotalBookings: Bookingcount, TotalSelling: Total.toFixed(2), MainTotalSelling: Total.toFixed(2) });
        });

        if ($scope.SupplierReport.InTerms == 1) {
            $scope.TotalSummaryList = sortByKeyDesc($scope.TotalSummaryList, 'TotalBookings')
        }
        else {
            $scope.TotalSummaryList = sortByKeyDesc($scope.TotalSummaryList, 'TotalSelling')
        }





        $('#SupplierSummaryReport').DataTable().clear().destroy();

        $('#SupplierSummaryReport').DataTable({

            dom: 'Bfrtip',

            buttons: [


                    {
                        extend: 'excelHtml5',
                        text: '<i class="fa fa-file-excel-o"></i>',
                        filename: function () {
                            var ReportName = "Supplier Productivity Summary  Report"
                            var RptDetails = $scope.SupplierReport.DateFrom + "-" + $scope.SupplierReport.DateTo;
                            return ReportName + ' ( ' + RptDetails + ' ) '
                        },
                        sheetName: 'SupplierProductivityRptSummarySheet',
                        title: null,
                        exportOptions: {

                            columns: $scope.SupplierReport.InTerms == 1 ? [0, 1] : [0, 2],
                        }


                    },
                      {
                          extend: 'copyHtml5',
                          text: '<i class="fa fa-files-o"></i>',
                          titleAttr: 'Copy',
                          exportOptions: {

                              columns: $scope.SupplierReport.InTerms == 1 ? [0, 1] : [0, 2],
                          }


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
                    orderable: false,
                    "render": function (data, type, row) {
                        return row["SuppName"].split('~')[0];
                    },

                },
            {
                "targets": 1,
                "className": "text-right",
                orderable: false,
                "visible": $scope.SupplierReport.InTerms == 1 ? true : false,
                "render": function (data, type, row) {
                    if (row["ProdType"] == 'Non Productive Supplier') {
                        return 0;
                    }
                    else {
                        return row["TotalBookings"];
                    }
                },

            },
             {
                 "targets": 2,
                 "className": "text-right",
                 orderable: false,
                 "visible": $scope.SupplierReport.InTerms == 2 ? true : false,
                 "className": "text-right"
             },
              {
                  "targets": 3,
                  orderable: false,
                  "visible": false

              },
              {
                  "targets": 4,
                  "className": "text-right",
                  orderable: false,
                  "visible": false,
                  "render": function (data, type, row) {
                      var diff = Math.floor((new Date()).getTime() - new Date(row["LastBookingDate"]).getTime());
                      var day = 1000 * 60 * 60 * 24;

                      var days = Math.floor(diff / day);

                      if(days > 1)
                      {
                          var diffDays = days + " days ago";
                      }
                      else {
                          var diffDays = days + " day ago";
                      }
                     

                      //var months = Math.floor(days / 31);
                      //var years = Math.floor(months / 12);

                      //if (years > 0 && months > 0) {
                      //    var diffDays = days + " days " + months + " months " + years + " years ago";
                      //}
                      //if (years == 0) {
                      //    var diffDays = days + " days " + months + " months ago";
                      //}
                      //if (months == 0) {
                      //    var diffDays = days + " days ago";
                      //}
                      return row["LastBookingDate"] + '&nbsp;&nbsp;( ' + diffDays + ' )';
                  },
              },
                {
                    "targets": 5,
                    orderable: false,
                    "visible": false,
                    "render": function (data, type, row) {

                        if (row["ProdType"] == 'Productive Supplier' && row["MainTotalSelling"] == "0.00") {
                            return (0.001);  //thus is for if sellamt = 0 then in ordering have issue for prod.supplier.(this is not show in excel)
                        }
                        else {
                            return (row["MainTotalSelling"]);
                        }
                    },

                },

            ],

            searching: true,
            paging: false,
            data: $scope.TotalSummaryList,
            "orderFixed": $scope.SupplierReport.InTerms == 1 ? [[1, 'desc'], [0, 'asc']] : [[5, 'desc'], [0, 'asc']],
            "deferRender": true,
            "bInfo": false,
            columns: [
                      { data: 'SuppName' },
                      { data: 'TotalBookings' },
                      { data: 'TotalSelling' },
                      { data: 'ProdType' },
                      { data: 'LastBookingDate' },
                      { data: 'MainTotalSelling' }


            ],
            rowGroup: {
                dataSrc: ['ProdType'],

            },
        });


    }


    $scope.backtoreport = function () {
        $("#RptDetails")[0].style.display = "block";
        $("#RptSummary")[0].style.display = "none";
        $("#RptNonProdSupp")[0].style.display = "none";
        $("#RptBlockSupplier")[0].style.display = "none";
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

    //Non-Productive
    function GetNonProductiveSupplier() {
        $("#RptDetails")[0].style.display = "none";
        $("#RptSummary")[0].style.display = "none";
        $("#RptNonProdSupp")[0].style.display = "block";
        $("#RptBlockSupplier")[0].style.display = "none";

        $('#NonProdSupplierReport').DataTable().clear().destroy();

        $('#NonProdSupplierReport').DataTable({

            dom: 'Bfrtip',

            buttons: [


                    {
                        extend: 'excelHtml5',
                        text: '<i class="fa fa-file-excel-o"></i>',
                        filename: function () {
                            var ReportName = "Supplier Non Productivity Report"
                            var RptDetails = $scope.SupplierReport.DateFrom + "-" + $scope.SupplierReport.DateTo;
                            return ReportName + ' ( ' + RptDetails + ' ) '
                        },
                        sheetName: 'SupplierNonProductivityRptSheet',
                        title: null,
                       
                       
                    },
                      {
                          extend: 'copyHtml5',
                          text: '<i class="fa fa-files-o"></i>',
                          titleAttr: 'Copy',
                          
                      },
                       {

                           text: '<span class="cust-dt-button">Blocked Supplier</span>',
                           titleAttr: 'Blocked Supplier',
                           action: function (e, dt, node, config) {

                               GetBlockSupplier();

                           }
                       },

                       {
                           text: $scope.SupplierReport.ProdType != 3 ? '<span class="cust-dt-button">Report View</span>' : '',
                           titleAttr: $scope.SupplierReport.ProdType != 3 ?'Report View' :'',
                           action: function (e, dt, node, config) {

                               $scope.backtoreport();

                           }
                       }


            ],

            "columnDefs": [
                {
                    "targets": 0,
                    "orderable": "false",
                    "render": function (data, type, row) {
                        return row["SuppName"].split('~')[0];
                    },

                },
                 {
                     "targets": 1,                     
                     "className": "text-right",
                     "type": 'date',
                   
                 },
                
              {
                  "targets": 2,
                  "className": "text-right",
                  orderable: false,
                  "render": function (data, type, row) {
                      var diff = Math.floor((new Date()).getTime() - new Date(row["LastBookingDate"]).getTime());
                      var day = 1000 * 60 * 60 * 24;

                      var days = Math.floor(diff / day);

                      if (days > 1) {
                          var diffDays = days + " days ago";
                      }
                      else {
                          var diffDays = days + " day ago";
                      }


                      return diffDays;
                  },
              },
                

            ],
            order:[],
            searching: true,
            paging: false,
            data: $scope.NonProdResultlist,
            "deferRender": true,
           
            columns: [
                      { data: 'SuppName' },                   
                      { data: 'LastBookingDate' },
                      { data: 'LastBookingDate' },
                     


            ],
           
        });


    }

    //BlockSupplier
    function GetBlockSupplier() {
        $("#RptDetails")[0].style.display = "none";
        $("#RptSummary")[0].style.display = "none";
        $("#RptNonProdSupp")[0].style.display = "none";
        $("#RptBlockSupplier")[0].style.display = "block";


        $('#BlockSupplierReport').DataTable().clear().destroy();
       
        $('#BlockSupplierReport').DataTable({

            dom: 'Bfrtip',

            buttons: [


                        {
                            extend: 'excelHtml5',
                            text: '<i class="fa fa-file-excel-o"></i>',
                            filename: function () {
                                var ReportName = "Blocked Supplier Report"
                                var RptDetails = $scope.SupplierReport.DateFrom + "-" + $scope.SupplierReport.DateTo;
                                return ReportName + ' ( ' + RptDetails + ' ) '
                            },
                            sheetName: 'BlockedSupplierRptSheet',
                            title: null,
                            exportOptions: {
                                columns: [0, 1],
                            }

                        },
                          {
                              extend: 'copyHtml5',
                              text: '<i class="fa fa-files-o"></i>',
                              titleAttr: 'Copy',
                              exportOptions: {
                                  columns: [0, 1],
                              }

                          },
                          {

                              text: $scope.SupplierReport.ProdType != 2 ? '<span class="cust-dt-button">Non-Productive Supplier(XML)</span>' : '',
                              titleAttr: $scope.SupplierReport.ProdType != 2 ? 'Non-Productive Supplier(XML)' : '',
                              action: function (e, dt, node, config) {

                                  GetNonProductiveSupplier();

                              }
                          },
                          
                           {
                               text: $scope.SupplierReport.ProdType != 3 ? '<span class="cust-dt-button">Report View</span>' :'',
                               titleAttr:$scope.SupplierReport.ProdType != 3 ? 'Report View' :'',
                               action: function (e, dt, node, config) {

                                   $scope.backtoreport();

                               }
                           }


            ],

            "columnDefs": [
                {
                    "targets": 0,
                    orderable: false,
                   

                },
                 {
                     "targets": 1,
                     orderable: false,
                     visible:false

                 },
                   {
                       "targets": 2,
                       orderable: false,
                       visible: false

                   },
                
            ],
            order: [],
            searching: true,
            paging: false,
            data: $scope.BlockSupplierList,
            "deferRender": true,

            columns: [
                      { data: 'SuppName' },
                      { data: 'Service' },
                     { data: 'ServId' }



            ],
            rowGroup: {
                dataSrc: ['ServId'],
                startRender: function (rows, group) {
                   var  Servicegrp = rows
                              .data()
                              .pluck('Service')
                               .reduce(function (a, b) {
                                    return a;
                             });


                    // Add group name to <tr>
                    return $('<tr/>')
                        .append('<td colspan="11">' + '<span style="width: 34% !important;"> ' + Servicegrp + '</span></td>')
                        .attr('data-name', group)
                        .attr('id', group);
                     
                },
            },

            "orderFixed":[[1,'asc'],[0,'asc']]
          

        });

      
           
       


    }



   
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
    HideColList.push("5~SName~Service Name");
    HideColList.push("6~BType~Source");
    HideColList.push("7~BrName~Branch Name");
    HideColList.push("8~AgName~Agency Name");
    HideColList.push("9~SellCur~Sell Currency");
    HideColList.push("10~MainSellAmt~Sell Amount");
    HideColList.push("11~Status~Status");
    HideColList.push("14~Postbyuser~Post by User");



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
    var table = $('#SupplierReport').dataTable();
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




