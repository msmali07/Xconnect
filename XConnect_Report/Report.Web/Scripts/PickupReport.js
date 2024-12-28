var app = angular.module('PReportapp', []);


var bid = ""; var brtypeid = ""; var mid = ""; var mrtypeid = ""; var bid = ""; var Wsid = ""; var membertypeid = "";
var isvalid = true;
app.controller('PReportCntr', ['$scope', '$http', '$window', '$rootScope', 'Excel', '$timeout', function ($scope, $http, $window, $rootScope, Excel, $timeout) {
    NgInit();

    function NgInit() {
        $scope.PickupReport = PickupReportDO();
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
        $("#ddl_WS option:selected").text("All Wholesaler");
        $("#ddl_AG option:selected").text("All Agent");



        $scope.PickupReport.DateFrom = ConvertCustomrangedate(new Date());
        $scope.PickupReport.DateTo = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() + 1)));

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
            $scope.PickupReport.DateFrom = $scope.CustomDateRangeFilter.split("~")[0];
            GetE("txtToDate").value = $scope.CustomDateRangeFilter.split("~")[1];
            $scope.PickupReport.DateTo = $scope.CustomDateRangeFilter.split("~")[1];
        }
        else {
            GetE("txtFromDate").value = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            $scope.PickupReport.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            GetE("txtToDate").value = ConvertCustomrangedate(new Date());
            $scope.PickupReport.DateTo = ConvertCustomrangedate(new Date());
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

        if ($scope.PickupReport.DateFrom == "") {

            Alert.render("Please Select Arrival-From Date", "txtFromDate");
            isvalid = false;
            return false;
        }

        if ($scope.PickupReport.DateTo == "") {
            Alert.render("Please Select Arrival-To Date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ($scope.PickupReport.DateFrom != "" && $scope.PickupReport.DateTo != "") {
            var dtObj1 = GetSystemDate($scope.PickupReport.DateFrom);
            var dtObj2 = GetSystemDate($scope.PickupReport.DateTo);
        }

        if (($scope.PickupReport.DateFrom != "" && $scope.PickupReport.DateTo != "") && (dtObj1 > dtObj2)) {
            Alert.render("Arrival-From date can not be greater than Arrival-To date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ((diffDate(new Date($scope.PickupReport.DateTo), new Date($scope.PickupReport.DateFrom))) > 12.50) {
            Alert.render("Report Seraching Dates Should be Upto 12 Months", "txtToDate");
            isvalid = false;
            return false;
        }

        

        



        //if (document.getElementById('ADW').checked) {
        //    $scope.PickupReport.BookingdateWise = false;
        //}
        //if (document.getElementById('BDW').checked) {
        //    $scope.PickupReport.BookingdateWise = true;
        //}






        //$scope.MemberDetails = $scope.PostBooking.Br_Id + "_" + $scope.PostBooking.Ws_Id + "_" + $scope.PostBooking.Ag_Id + "_" + $scope.PostBooking.ReportCompanyName + "_" + GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text;


        //$scope.PickupReport.MemberId = $scope.PostBooking.PostMemberId;
        //$scope.PickupReport.LoginUserId = (document.getElementById("hdnLoginUserId")).value;





        if (isvalid == true) {
            $scope.GetReportDetails();
        }
    }


    //getReportDetails on serach click
    $scope.GetReportDetails = function () {

        var popupdetail = "" + "~" + $scope.PickupReport.DateFrom + "~" + $scope.PickupReport.DateTo;
        PopUpController.OpenPopup1("divPopup", "Pickup Report", popupdetail);

        $scope.ReportFilter.City = $scope.FilterDOList.filter(item=> item.Name == 'City').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'City')[0].Values) : "";
        $scope.ReportFilter.SType = $scope.FilterDOList.filter(item=> item.Name == 'SType').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'SType')[0].Values) : "";
      
        $scope.ReportFilter.BookingStatus = $scope.FilterDOList.filter(item => item.Name == 'BookingStatus').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'BookingStatus')[0].Values) : "";

        $scope.ReportFilter.CustomDateOption = $("#ddl_CustomDateRange").val();;



        $("#demo").addClass("collapse in");

        $http({
            method: "post",
            url: "../Booking/GetPickupReportDetail",
            data: ({
                PSearchReportDO: $scope.PickupReport,
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



            $('#PickupReport').DataTable().clear().destroy();
            $('#PickupReport').DataTable({

                "order": [],
                dom: 'Bfrtip',

                buttons: [

                    {
                        extend: 'excelHtml5',
                        text: '<i class="fa fa-file-excel-o"></i>',
                        filename: function () {
                            var ReportName = "Pickup Report"
                            var RptDetails = $scope.PickupReport.DateFrom + "-" + $scope.PickupReport.DateTo;
                            return ReportName + ' ( ' + RptDetails + ' ) '
                        },
                        sheetName: 'PickupRptSheet',
                        title: null,
                        exportOptions: {

                            format: {
                                body: function (data, row, column, node) {
                                    // Strip $ from salary column to make it numeric

                                    //return data.split("$ ").join("<br/>");
                                    return column === 6 || column === 8 ?
                                        data.replace(/<br\s*\/?>/ig, " ,  ") :
                                        data;


                                }
                            },
                            columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11,12],
                        }
                    },
                   {
                       extend: 'copyHtml5',
                       text: '<i class="fa fa-files-o"></i>',
                       titleAttr: 'Copy',
                      
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
                        "targets": 0,
                        orderable: true,

                    },
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
                         //"className": "text-center",
                     },
                      {
                          "targets": 5,
                          orderable: false,
                      },
                       {
                           "targets": 6,
                           orderable: false,
                           "render": function (data, type, row) {
                               return data.split("!").join("<br/>");
                           }
                       },
                       {
                           "targets": 7,
                           //"className": "text-right",
                           orderable: false,
                           "visible": $scope.LoginMemberType == "4" ? false : true,
                       },

                    {
                        "targets": 8,
                        //"className": "text-right",
                        //"render": function (data, type, row) {
                        //    return row["SAmt"].toFixed(2);
                        //},
                        orderable: false,
                        "render": function (data, type, row) {
                            return data.split("!").join("<br/>");
                        }
                    },
                    {
                        "targets": 9,
                        //"className": "text-center",
                        orderable: false,
                    },
                     {
                         "targets": 10,
                         //"className": "text-right",
                         //"render": function (data, type, row) {
                         //    return row["BRPay"].toFixed(2);
                         //},
                         orderable: false,
                     },
                      {
                          "targets": 11,
                          //"className": "text-right",
                          //"render": function (data, type, row) {
                          //    return row["AGPay"].toFixed(2);
                          //},
                          //"visible": $scope.LoginMemberType == "4" ? false : true,
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
                       { data: 'BRefNo' },
                       { data: 'SDate' },
                       { data: 'SName' },
                    { data: 'SType' },
                    { data: 'BookingStatus' },
                       { data: 'City' },
                       { data: 'PFrom' },
                       { data: 'PDetail' },
                       //{ data: 'ATime' },
                        { data: 'DropOff' },
                        { data: 'DropOffInfo' },
                        { data: 'LPaxName' },
                        { data: 'VehicleName' },
                       //  { data: 'NoOfAdult' },
                       //{ data: 'NoOfChild' },
                    { data: 'SRequest' }
                ],





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
            $scope.SendMailDO.ReportName = "PickUpReport-" + " (" + $scope.PickupReport.DateFrom + " - " + $scope.PickupReport.DateTo + " )";

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
        Hide_Columns('PickupReport')

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
        Apply_Sorting('PickupReport', $scope.SortDetails)

    }
    $scope.ClearSorting = function () {
        $scope.SortDetails = [];
        $scope.SortDetails = Clear_Sorting('PickupReport');
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


        var exportHref = Excel.tableToExcel(tableId, 'PickupReportSheet', table);
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


        var todaysDate = "PickupReport";
        var blobURL = tableToExcel('PickupReport', 'ReportSheet', table);
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
        var table = $('#PickupReport2').DataTable({
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
    HideColList.push("0~BRefNo~Book Ref / Pos");
    HideColList.push("1~SDate~Service Date");
HideColList.push("2~SName~Service Name");
    HideColList.push("3~SType~Type");
    HideColList.push("4~BookingStatus~BookingStatus");
HideColList.push("5~City~City");
HideColList.push("6~PFrom~Pickup From");

HideColList.push("7~PDetail~Pickup Detail");
HideColList.push("8~DropOff~DropOff");
HideColList.push("9~DropOffInfo~DropOff Info");
HideColList.push("10~LPaxName~Pax Detail");
HideColList.push("11~VehicleName~Vehicle");

    HideColList.push("12~SRequest~Special Request");


   



    NewHideColList = HideColList;


    return NewHideColList;


}

$(document).ready(function () {

    $("#BookingReport").addClass("active");
    $(".date-cal").datepicker({ dateFormat: 'dd M yy', numberOfMonths: 2, });




    var table = $('#PickupReport').dataTable();
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




