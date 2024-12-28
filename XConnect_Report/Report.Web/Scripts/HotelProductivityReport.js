var app = angular.module('HotelProdreportapp', ['angucomplete-alt']);


var bid = ""; var brtypeid = ""; var mid = ""; var mrtypeid = ""; var bid = ""; var Wsid = ""; var membertypeid = "";
var isvalid = true;
app.controller('HotelProdreportCntr', ['$scope', '$http', '$window', '$rootScope', function ($scope, $http, $window, $rootScope) {
    NgInit();

    function NgInit() {
        $scope.HotelProd = HotelProdDO();
        $scope.ReportFilter = ReportFilterDO();
        $scope.PostBooking = PostBookingDO();
        $scope.SendMailDO = SendMailDO();

        $scope.LoginMemberType = GetE("hdnLoginMemberTypeId").value;
        $scope.CCode = GetE("hdnCCode").value;
        $scope.ModifySearch = true;
        $scope._IsHidePostBooking = false;
        $scope.MemberDetails = "";
        $scope.GroupingName = "";
        $scope.ReportView = "";
        

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
        //its for top show Functionality
        $scope.IsTopShowAValue = "0";
        $scope.IsTopShowActive = false;
        $scope.TopDivShow = true;
        $scope.Top_Result = "";
        ////

        $("#ddl_BR option:selected").text("All Branch");
        $("#ddl_WS option:selected").text("All Wholesaler");
        $("#ddl_AG option:selected").text("All Agent");


        //Load supplier
        LoadSupplierList();


        $scope.HotelProd.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
        $scope.HotelProd.DateTo = ConvertCustomrangedate(new Date());

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
            $scope.HotelProd.DateFrom = $scope.CustomDateRangeFilter.split("~")[0];
            GetE("txtToDate").value = $scope.CustomDateRangeFilter.split("~")[1];
            $scope.HotelProd.DateTo = $scope.CustomDateRangeFilter.split("~")[1];
        }
        else {
            GetE("txtFromDate").value = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            $scope.HotelProd.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            GetE("txtToDate").value = ConvertCustomrangedate(new Date());
            $scope.HotelProd.DateTo = ConvertCustomrangedate(new Date());
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

    $("#ddl_RptView").change(function () {
        if ($("#ddl_RptView").val() == '3') {
            $("#DivServiceType")[0].style.display = "block";
        }
        else {
            $("#DivServiceType")[0].style.display = "none";
        }

        if ($("#ddl_RptView").val() == '2') {
            $("#DivHotelName")[0].style.display = "none";
            $("#Div_ShowTop")[0].style.display = "none";
        }
        else {
            $("#DivHotelName")[0].style.display = "block";
            $("#Div_ShowTop")[0].style.display = "block";
        }

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

        if ($scope.HotelProd.DateFrom == "") {

            Alert.render("Please Select Arrival-From Date", "txtFromDate");
            isvalid = false;
            return false;
        }

        if ($scope.HotelProd.DateTo == "") {
            Alert.render("Please Select Arrival-To Date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ($scope.HotelProd.DateFrom != "" && $scope.HotelProd.DateTo != "") {
            var dtObj1 = GetSystemDate($scope.HotelProd.DateFrom);
            var dtObj2 = GetSystemDate($scope.HotelProd.DateTo);
        }

        if (($scope.HotelProd.DateFrom != "" && $scope.HotelProd.DateTo != "") && (dtObj1 > dtObj2)) {
            Alert.render("Arrival-From date can not be greater than Arrival-To date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ((diffDate(new Date($scope.HotelProd.DateTo), new Date($scope.HotelProd.DateFrom))) > 12.50) {
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
            $scope.HotelProd.BookingdateWise = false;
        }
        if (document.getElementById('BDW').checked) {
            $scope.HotelProd.BookingdateWise = true;
        }






        $scope.MemberDetails = $scope.PostBooking.Br_Id + "_" + $scope.PostBooking.Ws_Id + "_" + $scope.PostBooking.Ag_Id + "_" + $scope.PostBooking.ReportCompanyName + "_" + GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text;


        $scope.HotelProd.MemberId = $scope.PostBooking.PostMemberId;
        $scope.HotelProd.LoginUserId = (document.getElementById("hdnLoginUserId")).value;
        $scope.HotelProd.ReportView = $("#ddl_RptView").val();
        $scope.ReportView = GetE("ddl_RptView").options[GetE("ddl_RptView").selectedIndex].text;
        $("#ReportViewspan")[0].style.visibility = "visible";

        $scope.HotelProd.BookingType = $("#ddl_BookingType").val();
        $scope.HotelProd.ServiceType = $("#ddl_ServiceType").val();

        $scope.HotelProd.SupplierId = $("#ddl_Supplier").val();
        $scope.HotelProd.CityId = $("#hdncityid").val();
        $scope.HotelProd.CountryId = $("#hdncountryid").val();
        $scope.HotelProd.NationalityId = $("#hdnnationalityid").val();

        console.log($scope.HotelProd);


        if (isvalid == true) {
            $scope.GetReportDetails();
        }
    }

    //getReportDetails on serach click
    $scope.GetReportDetails = function () {
        var popupdetail = $scope.PostBooking.ReportCompanyName + "~" + $scope.HotelProd.DateFrom + "~" + $scope.HotelProd.DateTo;
        PopUpController.OpenPopup1("divPopup", "Hotel Productivity Report", popupdetail);

        $scope.ReportFilter.Country = $scope.FilterDOList.filter(item => item.Name == 'Country').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'Country')[0].Values) : "";
        $scope.ReportFilter.City = $scope.FilterDOList.filter(item => item.Name == 'City').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'City')[0].Values) : "";
        $scope.ReportFilter.SName = $scope.FilterDOList.filter(item => item.Name == 'SName').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'SName')[0].Values) : "";
        $scope.ReportFilter.Nts = $scope.FilterDOList.filter(item => item.Name == 'Nts').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'Nts')[0].Values) : "";
        $scope.ReportFilter.NoOfAdults = $scope.FilterDOList.filter(item => item.Name == 'NoOfAdults').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'NoOfAdults')[0].Values) : "";
        $scope.ReportFilter.NoOfChilds = $scope.FilterDOList.filter(item => item.Name == 'NoOfChilds').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'NoOfChilds')[0].Values) : "";
        $scope.ReportFilter.NoOfPax = $scope.FilterDOList.filter(item => item.Name == 'NoOfPax').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'NoOfPax')[0].Values) : "";

        $scope.ReportFilter.CustomDateOption = $("#ddl_CustomDateRange").val();;



        $("#demo").addClass("collapse in");

        $http({
            method: "post",
            url: "../Production/GetHotelProductivityReport",
            data: ({
                HProdReportDO: $scope.HotelProd,               
            }),
            dataType: "json",
            headers: { "Content-Type": "application/json" }

        }).then(function (d) {

            if (d.data != undefined || d.data != null) {
                if (d.data.length > 0) {
               
                        $scope.MainResultlist = (d.data);
                        $scope.MainResultlistAfterFilter = (d.data);
                        console.log(d.data);                  
                    console.log($scope.MainResultlistAfterFilter.length);
                    $('#HotelProd').DataTable().clear().destroy();
                    if ($("#txtTopResult").val() != "")
                    {
                        $scope.ShowTopDataChange(1);
                    }
                    else {
                        SetDataTable();
                    }
                   
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
        if ($scope.ReportFilter.GroupBy == "") {

            $scope.TopDivShow = true;
            var Oldtable = $('#HotelProd').dataTable();
            
            var oldinfo = Oldtable.fnSettings().aaSorting;
            var orderdata = [];
            for (d = 0; d < oldinfo.length; d++) {
                if (oldinfo[d][0] != 0) {
                    orderdata.push([oldinfo[d][0], oldinfo[d][1]]);
                }

            }
            //console.log(orderdata);

            $('#HotelProd').DataTable().clear().destroy();
          
            $('#HotelProd').DataTable({

                dom: 'Bfrtip',
                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: '<i class="fa fa-file-excel-o"></i>',
                        filename: function () {
                            var ReportName = "Hotel Productivity Report " + "-" + $scope.ReportView
                            var RptDetails = $scope.HotelProd.DateFrom + "-" + $scope.HotelProd.DateTo;
                            return ReportName + ' ( ' + RptDetails + ' ) '
                        },
                        sheetName: 'HotelProductivityRptSheet',
                        title: null,
                        exportOptions: {
                            columns: $scope.HotelProd.ReportView == 1 ? ($scope.CCode == "1" ? [0, 1, 2, 3, 4, 8] : [0, 1, 2, 3, 4]) : ($scope.HotelProd.ReportView == 2 ? [0, 1, 4] : [0, 1, 2, 5, 6, 7])
                        }
                    },
                    {
                        extend: 'copyHtml5',
                        text: '<i class="fa fa-files-o"></i>',
                        titleAttr: 'Copy',
                        exportOptions: {
                            columns: $scope.HotelProd.ReportView == 1 ? ($scope.CCode == "1" ? [0, 1, 2, 3, 4, 8] : [0, 1, 2, 3, 4]) : ($scope.HotelProd.ReportView == 2 ? [0, 1, 4] : [0, 1, 2, 5, 6, 7])
                        }
                    },
                    //{
                    //    text: '<span class="cust-dt-button">Column Visibility</span>',
                    //    titleAttr: 'Hide',
                    //    action: function (e, dt, node, config) {

                    //        $("#hidecoldiv").modal('show');

                    //    }
                    //},
                    {
                        text: '<span class="cust-dt-button">Custom Sort</span>',
                        titleAttr: 'Custom Sort',
                        action: function (e, dt, node, config) {
                            $("#Sortcoldiv").modal('show');
                        }
                    },
                    {
                        text: '<span class="cust-dt-button">Show : </span>',
                        titleAttr: 'Top',
                    },
                ],
                searching: true,
                paging: false,
                "autoWidth": false,
                "order": orderdata,
                ordering: true,
                "columnDefs": [

                    { "visible": false, "targets": parseInt(groupColumn) },
                    {
                        "visible": $scope.HotelProd.ReportView == 2 ? false : true,
                        "targets": 2,
                        "render": function (data, type, row) {
                            return $scope.HotelProd.ReportView == 2 ? "" : row["SName"].substring(0, 50);
                        },
                    },
                    {
                        "visible": $scope.HotelProd.ReportView == 1 ? true : false,
                        "targets": 3,
                        "className": "text-right",
                    },
                    {
                        "visible": $scope.HotelProd.ReportView == 3 ? false : true,
                        "targets": 4,
                        "className": "text-right",
                    },
                    {
                        "visible": $scope.HotelProd.ReportView == 3 ? true : false,
                        "targets": 5,
                        "className": "text-right",
                    },
                    {
                        "visible": $scope.HotelProd.ReportView == 3 ? true : false,
                        "targets": 6,
                        "className": "text-right",
                    },
                    {
                        "visible": $scope.HotelProd.ReportView == 3 ? true : false,
                        "targets": 7,
                        "className": "text-right",
                    },
                    {
                        "visible": ($scope.HotelProd.ReportView == 1 && $scope.CCode == "1") ? true : false,
                        "targets": 8,
                        "className": "text-right",

                    },
                  
                ],
              
                data: ($scope.IsTopShowActive == true ? $scope.MainResultlistAfterFilter.slice(0, $scope.IsTopShowAValue) : $scope.MainResultlistAfterFilter),
                "pageLength": 30,
                "deferRender": true,
                select: true,
                columns: [
                    { data: 'Country' },
                    { data: 'City' },
                    { data: 'SName' },
                    { data: 'StarCat' },
                    { data: 'Nts' },
                    { data: 'NoOfAdults' },
                    { data: 'NoOfChilds' },
                    { data: 'NoOfPax' },
                    { data: "TTVinUSD" },
                ],
                "footerCallback": function (row, data, start, end, display) {
                    var api = this.api(), data;
                    // converting to interger to find total
                    var intVal = function (i) {
                        return typeof i === 'string' ?
                            i.replace(/[\$,]/g, '') * 1 :
                            typeof i === 'number' ?
                                i : 0;
                    };
                    // computing column Total of the complete result 
                    //var Total3 = api
                    //    .column(3)
                    //    .data()
                    //    .reduce(function (a, b) {
                    //        return intVal(a) + intVal(b);
                    //    }, 0);
                    var Total4 = api
                        .column(4)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);
                    var Total5 = api
                        .column(5)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);
                    var Total6 = api
                        .column(6)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);
                    var Total7 = api
                        .column(7)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);
                    var Total8 = api
                        .column(8)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);
                    // Update footer by showing the total with the reference of the column index 

                    $(api.column(1).footer()).html('Total');
                    //$(api.column(3).footer()).html(Total3);
                    $(api.column(4).footer()).html(Total4);
                    $(api.column(5).footer()).html(Total5);
                    $(api.column(6).footer()).html(Total6);
                    $(api.column(7).footer()).html(Total7);
                    $(api.column(8).footer()).html(Total8);
                }
            });                              
            var TopArr = [];
            TopArr.push(Number($scope.Top_Result));
            var strOption = "";
            if ($scope.Top_Result != "" && Number($scope.Top_Result) > 0) {
                strOption = '<option value="' + Number($scope.Top_Result) + '">' + Number($scope.Top_Result) + '</option>';
                $('select[id="ddltopdata"] option[value="' + Number($scope.Top_Result) + '"]').attr("selected", "selected");
            }
            $('<div class="pull-right">' +
                '<select class="ddltop" id="ddltopdata">' +
                '<option value="0">All</option>' +
                 strOption +
                '<option value="10">10</option>' +
                '<option value="15">15</option>' +
                '<option value="25">25</option>' +
                '<option value="50">50</option>' +
                '</select>' +
                '</div>').appendTo("#HotelProd_wrapper .dt-buttons"); //example is our table id
            $('select[id="ddltopdata"] option[value="' + $scope.IsTopShowAValue + '"]').attr("selected", "selected");          
        }
        else {
            $scope.TopDivShow = false;
            var groupColumn = $scope.ReportFilter.GroupBy.split('~')[0];
            $('#HotelProd').DataTable().clear().destroy();

            $('#HotelProd').DataTable({

                dom: 'Bfrtip',
                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: '<i class="fa fa-file-excel-o"></i>',
                        filename: function () {
                            var ReportName = "Hotel Productivity Report " + "-" + $scope.ReportView
                            var RptDetails = $scope.HotelProd.DateFrom + "-" + $scope.HotelProd.DateTo;
                            return ReportName + ' ( ' + RptDetails + ' ) '
                        },
                        sheetName: 'HotelProductivityRptSheet',
                        title: null,
                        exportOptions: {
                            columns: $scope.HotelProd.ReportView == 1 ? ($scope.CCode == "1" ? [0, 1, 2, 3, 4, 8] : [0, 1, 2, 3, 4]) : ($scope.HotelProd.ReportView == 2 ? [0, 1, 4] : [0, 1, 2, 5, 6, 7])
                        }
                    },
                    {
                        extend: 'copyHtml5',
                        text: '<i class="fa fa-files-o"></i>',
                        titleAttr: 'Copy',
                        exportOptions: {
                            columns: $scope.HotelProd.ReportView == 1 ? ($scope.CCode == "1" ? [0, 1, 2, 3, 4, 8] : [0, 1, 2, 3, 4]) : ($scope.HotelProd.ReportView == 2 ? [0, 1, 4] : [0, 1, 2, 5, 6, 7])
                        }
                    },
                    //{
                    //    text: '<span class="cust-dt-button">Column Visibility</span>',
                    //    titleAttr: 'Hide',
                    //    action: function (e, dt, node, config) {

                    //        $("#hidecoldiv").modal('show');

                    //    }
                    //},
                    {
                        text: '<span class="cust-dt-button">Custom Sort</span>',
                        titleAttr: 'Custom Sort',
                        action: function (e, dt, node, config) {
                            $("#Sortcoldiv").modal('show');
                        }
                    },
                ],
                "order": [],
                ordering: true,
                "columnDefs": [

                    { "visible": false, "targets": parseInt(groupColumn) },

                    {
                        "visible": groupColumn == "0" ? false : true,
                        "targets": 0,
                    },
                    {
                        "visible": groupColumn == "1" ? false : true,
                        "targets": 1,
                    },
                    {
                        "visible": $scope.HotelProd.ReportView == 2 ? false : true,
                        "targets": 2,
                        "render": function (data, type, row) {
                            return $scope.HotelProd.ReportView == 2 ? "" : row["SName"].substring(0, 50);
                        },
                    },
                    {
                        "visible": $scope.HotelProd.ReportView == 1 ? true : false,
                        "targets": 3,
                        "className": "text-right",

                    },
                    {
                        "visible": $scope.HotelProd.ReportView == 3 ? false : true,
                        "targets": 4,
                        "className": "text-right",
                    },
                    {
                        "visible": $scope.HotelProd.ReportView == 3 ? true : false,
                        "targets": 5,
                        "className": "text-right",
                    },
                    {
                        "visible": $scope.HotelProd.ReportView == 3 ? true : false,
                        "targets": 6,
                        "className": "text-right",
                    },
                    {
                        "visible": $scope.HotelProd.ReportView == 3 ? true : false,
                        "targets": 7,
                        "className": "text-right",
                    },
                    {
                        "visible": ($scope.HotelProd.ReportView == 1 && $scope.CCode == "1") ? true : false,
                        "targets": 8,
                        "className": "text-right",
                    },
                ],
                ordering: true,
                searching: true,
                paging: false,
                data: ($scope.IsTopShowActive == true ? $scope.MainResultlistAfterFilter.slice(0, $scope.IsTopShowAValue) : $scope.MainResultlistAfterFilter),
                "pageLength": 30,
                select: true,
                order: [[groupColumn]],
                "orderFixed": [groupColumn, 'asc'],
                rowGroup: {
                    startRender: null,
                    endRender: function (rows, group) {
                        var salaryAvg = rows
                            .data()
                            .pluck(3)
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
                    { data: 'Country' },
                    { data: 'City' },
                    { data: 'SName' },
                    { data: 'StarCat' },
                    { data: 'Nts' },
                    { data: 'NoOfAdults' },
                    { data: 'NoOfChilds' },
                    { data: 'NoOfPax' },
                    { data: "TTVinUSD" },
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
                                    '<tr class="group"><td colspan="5" style="color:#000000;font-size: 14px;text-align: left;padding: 7px 5px;">' + $scope.GroupingName + ' - ' + group + '</td></tr>'
                                );
                                last = group;
                            }
                            else {
                                groupid++;
                                $(rows).eq(i).before(
                                    '<tr class="group"><td colspan="5" style="color:#000000;font-size: 14px;text-align: left;padding: 7px 5px;">' + $scope.GroupingName + ' - ' + group + '</td></tr>'
                                );
                                last = group;
                            }
                        }
                    });
                },
                "footerCallback": function (row, data, start, end, display) {
                    var api = this.api(), data;
                    // converting to interger to find total
                    var intVal = function (i) {
                        return typeof i === 'string' ?
                            i.replace(/[\$,]/g, '') * 1 :
                            typeof i === 'number' ?
                                i : 0;
                    };
                    // computing column Total of the complete result 
                    //var Total3 = api
                    //    .column(3)
                    //    .data()
                    //    .reduce(function (a, b) {
                    //        return intVal(a) + intVal(b);
                    //    }, 0);
                    var Total4 = api
                        .column(4)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);
                    var Total5 = api
                        .column(5)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);
                    var Total6 = api
                        .column(6)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);
                    var Total7 = api
                        .column(7)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);
                    var Total8 = api
                        .column(8)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);
                    // Update footer by showing the total with the reference of the column index 
                    $(api.column(1).footer()).html('Total');
                    //$(api.column(3).footer()).html(Total3);
                    $(api.column(4).footer()).html(Total4);
                    $(api.column(5).footer()).html(Total5);
                    $(api.column(6).footer()).html(Total6);
                    $(api.column(7).footer()).html(Total7);
                    $(api.column(8).footer()).html(Total8);
                }
            });
            var table = $('#HotelProd').DataTable();
            var info = table.page.info();
            $('#HotelProd_info').html(
                'Total Records: ' + ($scope.MainResultlistAfterFilter.length)
            );
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
    //On Top ddl change ( //its for top show Functionality)
    $scope.ShowTopDataChange = function (strvalue) {
        
        if (strvalue == 1)
        {
            var topvalue = $("#txtTopResult").val();
        }

        else
        {
            $("#txtTopResult").val('');
            var topvalue = $("#ddltopdata").val();
        }

        switch (topvalue) {
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
            default:
                $scope.IsTopShowActive = true;
                break;

        }       
        $scope.IsTopShowAValue = topvalue;

        SetDataTable();

        if ($scope.IsTopShowAValue.indexOf(topvalue) !== -1 && $("#txtTopResult").val() != '')
        {
            var strOption = "";
            strOption = '<option value="' + Number($scope.Top_Result) + '">' + Number($scope.Top_Result) + '</option>';
            $('select[id="ddltopdata"] option[value="' + Number($scope.Top_Result) + '"]').attr("selected", "selected");
           /* $('#ddltopdata').append($('<option selected="selected"></option>').val(topvalue).html(topvalue));*/
        }
        else {
            $('select[id="ddltopdata"] option[value="' + $scope.IsTopShowAValue + '"]').attr("selected", "selected");
        }      
        $("#ddltopdatawithsort").val($scope.IsTopShowAValue);
    }
    ///

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
    ///


    //onHide Popup Click
    $scope.HideColumns = function () {

        //Hide_Columns is comm. fun in CommonUtility.js
        Hide_Columns('HotelProd')

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
        //in commonUtility.js  ( //its for top show Functionality)
        if ($scope.TopDivShow == true) {
            $scope.MainResultlistAfterFilter = TopData_With_Sort($scope.MainResultlistAfterFilter, $scope.SortDetails);
            $('select[id="ddltopdata"] option[value="' + $("#ddltopdatawithsort").val() + '"]').attr("selected", "selected");
            $scope.ShowTopDataChange(0);
        }

        Apply_Sorting('HotelProd', $scope.SortDetails);


    }
    $scope.ClearSorting = function () {
        $scope.SortDetails = [];
        $scope.SortDetails = Clear_Sorting('HotelProd');
        if ($scope.TopDivShow == true) {
            $scope.MainResultlistAfterFilter = $scope.MainResultlist;//this bcz now first load data as show
            $scope.ShowTopDataChange(0);
        }
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


    ///Number Filter
    //Number Filter set values
    $scope.NumberFilterClick = function () {
        $("#filterdiv").modal('hide');
        $("#Numberfilterdiv").modal('show');

        $scope.MainResultlistAfterFilter = Set_NumberRangeFilterList($scope.FilterDOList, $scope.FilterTypeActive, $scope.MainResultlist, $scope.ReportFilter);

    }

    $("#ddl_Range").change(function () {

        if ($("#ddl_Range").val() != "") {
            $("#Rabgelistdiv")[0].style.display = "block";
        }
        else {
            $("#Rabgelistdiv")[0].style.display = "none";
            Alert.render("Please Select Range Filter Option", "");
            return false;
        }
    });

    $scope.ClearNumberFiltervalue = function () {
        $("#ddl_Range").val("");
        $('#numberrangetext').val("");
        $('#numberrange').val("");


        $("#Rabgelistdiv")[0].style.display = "none";
        $("#Numberfilterdiv").modal('hide');

        // $scope.MainResultlistAfterFilter = Apply_NumberRangeFilter($scope.FilterDOList, $scope.FilterTypeActive, $scope.MainResultlist);   
        // SetDataTable();
    }

    //on Apply Numbert btn Click
    $scope.NumberApplyFilter = function () {
        var Isvalidapply = Apply_NumberRangeFilterValidation();


        if (Isvalidapply == true) {
            $scope.MainResultlistAfterFilter = Apply_NumberRangeFilter($scope.FilterDOList, $scope.FilterTypeActive, $scope.MainResultlist);
            $("#Numberfilterdiv").modal('hide');
            $("#filterdiv").modal('hide');
            SetDataTable();
        }

    }
    ////


    //GetSupplierList
    function LoadSupplierList() {
        $scope.Supplierlist = [];
        $http.get("../CommonData/GetSuppiler").then(function (d) {
            $scope.Supplierlist = d.data.filter(a => a.SId != 0);
            

        }, function (error) {
        })
    }

    //City 
    var Cdata = CityList();

    $scope.allcites = Cdata;
    $scope.cities = $scope.allcites.slice(0, 150);
    $scope.OnKeyUpCity = function (text) {
        var i = angular.element('#txtautocomplete_value');
        var str = i[0].value;
        var solution1 = [];

        if (str.length >= 1) {
            $scope.cities = [];
            $scope.all = [];
            $scope.all = $scope.allcites;
            var matches = [];
            $scope.all.filter(v => {

                if (v.display.toLowerCase().indexOf(str.toString().toLowerCase()) !== -1) {
                    var matchindex = v.display.toLowerCase().indexOf(str.toString().toLowerCase());
                    return solution1.push({
                        "display": v.display, "value": v.value, "currency": v.currency, "match": matchindex
                    });
                }
            })

            sortByKeyAsc(solution1, 'match');
            $scope.cities = solution1.splice(0, 100);

        }
    }
    $("#txtautocomplete").change(function () {
        var j = angular.element('#txtautocomplete_value');
        var str = j[0].value;
        if (str == "") {

            // $scope.cities = $scope.cities;
            cityid = "";
            document.getElementById("hdncityid").value = "";
            $scope.SelectedCityCountry = "";
            $scope.allcites = Cdata;
            $scope.cities = $scope.allcites.slice(0, 150);

        }
    });

    $scope.AfterSelectedCity = function (selected) {

        if (selected != undefined) {
            $scope.SelectedCityCountry = selected.originalObject;
            var cityid = $scope.SelectedCityCountry.value;
            $("#hdncityid").val(cityid);
            $scope.HotelProd.CityId = cityid;

            //$scope.cities = $scope.cities.filter(c => {
            //    return c.major == 1;
            //});


        }
        else {
            $scope.cities = $scope.cities;
            cityid = "";
            document.getElementById("hdncityid").value = "";
            $scope.SelectedCityCountry = "";
        }
    }

    //Country

    var Countrydata = CountryList();

    $scope.allcountries = Countrydata;
    $scope.countries = $scope.allcountries.slice(0, 150);
    $scope.OnKeyUpCountry = function (text) {
        var i = angular.element('#txtautocompletecountry_value');
        var str = i[0].value;
        var solution2 = [];

        if (str.length >= 1) {
            $scope.countries = [];
            $scope.countriesall = [];
            $scope.countriesall = $scope.allcountries;
            var matches = [];
            $scope.countriesall.filter(v => {

                if (v.display.toLowerCase().indexOf(str.toString().toLowerCase()) !== -1) {
                    var matchindex = v.display.toLowerCase().indexOf(str.toString().toLowerCase());
                    return solution2.push({
                        "display": v.display, "value": v.value, "match": matchindex
                    });
                }
            })

            sortByKeyAsc(solution2, 'match');
            $scope.countries = solution2.splice(0, 100);

        }
    }
    $("#txtautocompletecountry").change(function () {
        var j = angular.element('#txtautocompletecountry_value');
        var str = j[0].value;
        if (str == "") {

            $scope.countries = $scope.countries;
            countryid = "";
            document.getElementById("hdncountryid").value = "";
            $scope.SelectedCountry = "";

        }
    });

    $scope.AfterSelectedCountry = function (selected) {

        if (selected != undefined) {
            $scope.SelectedCountry = selected.originalObject;
            var countryid = $scope.SelectedCountry.value;
            $("#hdncountryid").val(countryid);
            $scope.HotelProd.CountryId = countryid;

        }
        else {
            $scope.countries = $scope.countries;
            countryid = "";
            document.getElementById("hdncountryid").value = "";
            $scope.SelectedCountry = "";
        }
    }


    //Nationality

    var Nationalitydata = CountryList();

    $scope.allnationalities = Nationalitydata;
    $scope.nationalities = $scope.allnationalities.slice(0, 150);
    $scope.OnKeyUpnationality = function (text) {
        var i = angular.element('#txtautocompletenationality_value');
        var str = i[0].value;
        var solution2 = [];

        if (str.length >= 1) {
            $scope.nationalities = [];
            $scope.nationalitiesall = [];
            $scope.nationalitiesall = $scope.allnationalities;
            var matches = [];
            $scope.nationalitiesall.filter(v => {

                if (v.display.toLowerCase().indexOf(str.toString().toLowerCase()) !== -1) {
                    var matchindex = v.display.toLowerCase().indexOf(str.toString().toLowerCase());
                    return solution2.push({
                        "display": v.display, "value": v.value, "match": matchindex
                    });
                }
            })

            sortByKeyAsc(solution2, 'match');
            $scope.nationalities = solution2.splice(0, 100);

        }
    }
    $("#txtautocompletenationality").change(function () {
        var j = angular.element('#txtautocompletenationality_value');
        var str = j[0].value;
        if (str == "") {

            $scope.nationalities = $scope.nationalities;
            nationalityid = "";
            document.getElementById("hdnnationalityid").value = "";
            $scope.Selectednationality = "";

        }
    });

    $scope.AfterSelectednationality = function (selected) {

        if (selected != undefined) {
            $scope.Selectednationality = selected.originalObject;
            var nationalityid = $scope.Selectednationality.value;
            $("#hdnnationalityid").val(nationalityid);
            $scope.HotelProd.NationalityId = nationalityid;

        }
        else {
            $scope.nationalities = $scope.nationalities;
            nationalityid = "";
            document.getElementById("hdnnationalityid").value = "";
            $scope.Selectednationality = "";
        }
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
        buttonWidth: 250
    });


}

function GetHideColList(GroupBy) {
    var HideColList = [];


    HideColList.push("0~Country~Country Name");
    HideColList.push("1~City~City Name");
    if ($("#ddl_RptView").val() != '2') {
        HideColList.push("2~SName~Hotel Name");
    }
    if ($("#ddl_RptView").val() != '3') {
        HideColList.push("4~Nts~No Of RommsNts");
    }
    if ($("#ddl_RptView").val() == '3') {
        HideColList.push("5~NoOfAdults~No Of Adults");
        HideColList.push("6~NoOfChilds~No Of Childs");
        HideColList.push("7~NoOfPax~Total Pax");
    }
    if ($("#ddl_RptView").val() == '1')
    {
        HideColList.push("3~StarCat~Star Category");

        if ($("hdnCCode").val() == "1")
        {
            HideColList.push("8~TTVinUSD~TTV in USD");
        }
    }




    if (GroupBy != "") {
        var NewHideColList = [];
        switch (GroupBy) {
            case '0':
                NewHideColList = removeElementsfromhidelist(HideColList, '0~Country~Country Name');
                break;
            case '1':
                NewHideColList = removeElementsfromhidelist(HideColList, '1~City~City Name');
                break;

        }

    }
    NewHideColList = HideColList;


    return NewHideColList;


}


function ShowNumberFilterList() {
    var NumberFilterColList = [''];

    return NumberFilterColList;

}

$(document).ready(function () {

    $("#ProductionReport").addClass("active");
    $(".date-cal").datepicker({ dateFormat: 'dd M yy', numberOfMonths: 2, });




    var table = $('#HotelProd').dataTable();
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


    $(document).on('change', '#ddltopdata', function () {
        //alert('Change Happened');
        var scope = angular.element(document.getElementById("MainWrap")).scope();
        scope.$apply(function () {
            scope.ShowTopDataChange(0);
        })
        return;


    });





});


//not in used
jQuery.fn.dataTableExt.oApi.fnLengthChange = function (oSettings, iDisplay) {
    oSettings._iDisplayLength = iDisplay;
    oSettings.oApi._fnCalculateEnd(oSettings);

    /* If we have space to show extra rows (backing up from the end point - then do so */
    if (oSettings._iDisplayEnd == oSettings.aiDisplay.length) {
        oSettings._iDisplayStart = oSettings._iDisplayEnd - oSettings._iDisplayLength;
        if (oSettings._iDisplayStart < 0) {
            oSettings._iDisplayStart = 0;
        }
    }

    if (oSettings._iDisplayLength == -1) {
        oSettings._iDisplayStart = 0;
    }

    oSettings.oApi._fnDraw(oSettings);

    if (oSettings.aanFeatures.l) {
        $('select', oSettings.aanFeatures.l).val(iDisplay);
    }
};






