var app = angular.module('Prodreportapp', ['angucomplete-alt']);


var bid = ""; var brtypeid = ""; var mid = ""; var mrtypeid = ""; var bid = ""; var Wsid = ""; var membertypeid = "";
var isvalid = true;
app.controller('ProdreportCntr', ['$scope', '$http', '$window', '$rootScope', function ($scope, $http, $window, $rootScope) {
    NgInit();

    function NgInit() {
        $scope.ProdReport = ProdReportDO();
        $scope.ReportFilter = ReportFilterDO();
        $scope.PostBooking = PostBookingDO();
        $scope.SendMailDO = SendMailDO();

        LoadSupplierList();

        $scope.LoginMemberType = GetE("hdnLoginMemberTypeId").value;
        $scope.ModifySearch = true;
        $scope._IsHidePostBooking = false;
        $scope.MemberDetails = "";
        $scope.GroupingName = "";


        if ($scope.LoginMemberType == 2) {
            $scope.PostBooking.Br_Id = $("#hdnLoginMemberId").val();
            $scope.PostBooking.MemberTypeSelected = GetE("hdnLoginMemberTypeId").value;
            $scope.PostBooking.PostParentMemberId = $("#hdnLoginMemberId").val();
            $scope._IsHidePostBooking = true;
        }
        else if ($scope.LoginMemberType == 3) {

            $scope.PostBooking.Ws_Id = $("#hdnLoginMemberId").val();
            $scope.PostBooking.PostMemberId = $("#hdnLoginMemberId").val();
            $scope.PostBooking.MemberTypeSelected = GetE("hdnLoginMemberTypeId").value;
            $scope.PostBooking.PostParentMemberId = $("#hdnLoginMemberId").val();
            $scope._IsHidePostBooking = true;
        }
        else if ($scope.LoginMemberType == 4) {
            $scope.PostBooking.Ag_Id = $("#hdnLoginMemberId").val();
            $scope.PostBooking.PostMemberId = $("#hdnLoginMemberId").val();
            $scope.PostBooking.PostUserId = $("#hdnLoginUserId").val();
            $scope.PostBooking.MemberTypeSelected = GetE("hdnLoginMemberTypeId").value;
            $scope.PostBooking.PostParentMemberId = $("#hdnLoginMemberId").val();
            $scope._IsHidePostBooking = true;
        }



        $scope.ProdReport.From = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
        $scope.ProdReport.To = ConvertCustomrangedate(new Date());

        $rootScope.$on("CallPostBooking", function (event) {
            setPostMemberDetails(event);
        });
        $("#demo").addClass("collapse in");

    }

    function setPostMemberDetails(event) {

        switch (this.event.target.id) {
            case "ddl_BR":
                $scope.PostBooking.Ag_Id = 0;
                $scope.PostBooking.Ws_Id = 0;
                $scope.PostBooking.Br_Id = (this.event.target.value);
                $scope.PostBooking.ReportCompanyName = GetE("ddl_BR").options[GetE("ddl_BR").selectedIndex].text;
                $scope.PostBooking.MemberTypeSelected = 0;
                $scope.PostBooking.PostMemberId = 0;
                $scope.PostBooking.PostParentMemberId = this.event.target.value;
                break;
            case "ddl_WS":
                $scope.PostBooking.Ag_Id = 0;
                $scope.PostBooking.Ws_Id = (this.event.target.value);
                $scope.PostBooking.MemberTypeSelected = 3;
                $scope.PostBooking.PostMemberId = (this.event.target.value);
                $scope.PostBooking.PostParentMemberId = this.event.target.value;
                $scope.PostBooking.ReportCompanyName = GetE("ddl_WS").options[GetE("ddl_WS").selectedIndex].text;
                break;
            case "ddl_AG":
                $scope.PostBooking.Ag_Id = (this.event.target.value);
                $scope.PostBooking.MemberTypeSelected = 4;
                $scope.PostBooking.PostMemberId = (this.event.target.value);
                $scope.PostBooking.ReportCompanyName = GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text;
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


  
    //validation and setparam on serach click
    $scope.SearchReportClick = function () {


        var isvalid = true;
     
        $("#RptDetails")[0].style.display = "none";
        PopUpController.ClosePopup("divPopup", "");
        $("#HeaderSearchdiv").removeClass();
        $("#HeaderSearchdiv").addClass("col-lg-12 col-md-12 col-sm-12 col-xs-12 container-fluid padd-lft10 padd-rgt10");
        $scope.ModifySearch = false;

        if ($scope.ProdReport.From == "") {

            Alert.render("Please Select Arrival-From Date", "txtArrivalFromDate");
            isvalid = false;
            return false;
        }

        if ($scope.ProdReport.To == "") {
            Alert.render("Please Select Arrival-To Date", "txtArrivalToDate");
            isvalid = false;
            return false;
        }
        if ($scope.ProdReport.From != "" && $scope.ProdReport.To != "") {
            var dtObj1 = GetSystemDate($scope.ProdReport.From);
            var dtObj2 = GetSystemDate($scope.ProdReport.To);
        }

        if (($scope.ProdReport.From != "" && $scope.ProdReport.To != "") && (dtObj1 > dtObj2)) {
            Alert.render("Arrival-From date can not be greater than Arrival-To date", "txtArrivalToDate");
            isvalid = false;
            return false;
        }
        if ((diffDate(new Date($scope.ProdReport.To), new Date($scope.ProdReport.From))) > 12.50) {
            Alert.render("Report Seraching Dates Should be Upto 12 Months", "txtArrivalToDate");
            isvalid = false;
            return false;
        }
        if ($scope.LoginMemberType == "1") {
            if ($scope.PostBooking.ReportCompanyName == "Select Branch" || $scope.PostBooking.ReportCompanyName == "" || $scope.PostBooking.ReportCompanyName == "TestName") {
                $scope.PostBooking.ReportCompanyName = "All Branch";
            }
        }
        if (GetE("hdnLoginMemberType").value != "1") {
            if ($scope.PostBooking.ReportCompanyName == "TestName") {
                $scope.PostBooking.ReportCompanyName = GetE("hdnLoginName").value;
            }
        }

        if (document.getElementById('ADW').checked) {
            $scope.ProdReport.BookingdateWise = false;
        }
        if (document.getElementById('BDW').checked) {
            $scope.ProdReport.BookingdateWise = true;
        }

        if ($scope.PostBooking.ReportCompanyName == "All Branch") {
            $scope.PostBooking.PostMemberId = $("#hdnLoginMemberId").val();
        }
        if (GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text == "All Agent") {
            $scope.PostBooking.PostMemberId = $("#hdnLoginMemberId").val();
        }

        if ($scope.PostBooking.PostMemberId == "0" && $scope.PostBooking.ReportCompanyName != "All Branch") {
            if (GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text != "All Agent") {
                Alert.render("Select Member to Post Booking", "ddl_BR");
                isvalid = false;
                return false;
            }
        }




        $scope.MemberDetails = $scope.PostBooking.Br_Id + "_" + $scope.PostBooking.Ws_Id + "_" + $scope.PostBooking.Ag_Id + "_" + $scope.PostBooking.ReportCompanyName + "_" + GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text;


        $scope.ProdReport.MemberId = $scope.PostBooking.PostMemberId;       
        $scope.ProdReport.LoginUserId = (document.getElementById("hdnLoginUserId")).value;



        $scope.ReportFilter.HideBy = "";
        //column hide array string
        var checkboxes = document.getElementsByName('HIDE');
        var vals = "";
        for (var i = 0, n = checkboxes.length; i < n; i++) {
            if (checkboxes[i].checked) {
                $scope.ReportFilter.HideBy += checkboxes[i].value + ",";
            }
        }


        if (isvalid == true) {
            $scope.GetReportDetails();
        }
    }


    //getReportDetails on serach click
    $scope.GetReportDetails = function () {
        PopUpController.OpenPopup2("divPopup", "");
      
        $scope.ReportFilter.CustomDateOption = $("#ddl_CustomDateRange").val();;

        $("#demo").addClass("collapse in");
        PopUpController.OpenPopup2("divPopup", "");

        console.log($scope.ProdReport);

        $http({
            method: "post",
            url: "../Booking/GetProductionReport",
            data: ({
                ProductionReportDO: $scope.ProdReport,
            }),
            dataType: "json",
            headers: { "Content-Type": "application/json" }

        }).then(function (d) {

            if (d.data != undefined || d.data != null) {
               

                    $scope.MainResultlist = (d.data);

                    $scope.HotelResultlist = (d.data["ProHotelResultList"]);
                    $scope.HotelResultlist = $scope.HotelResultlist.map(
                                item=> {                                    
                                    item["Status"] = GetBookDisplayStatusDirective(item["Status"]);
                                    return item;
                                }
                             );
                    $scope.TransferResultlist = (d.data["ProTransferResultList"]);
                    $scope.TransferResultlist = $scope.TransferResultlist.map(
                          item=> {
                              item["PickId"] = GetTransferServiceTypeDirective(item["PickId"]);
                              item["DropId"] = GetTransferServiceTypeDirective(item["DropId"]);
                              item["TType"] = GetTransferTourTypeDirective(item["TType"]);
                              item["Status"] = GetBookDisplayStatusDirective(item["Status"]);
                              return item;
                          }
                       );

                    $scope.TourResultlist = (d.data["ProTourResultList"]);
                    $scope.TourResultlist = $scope.TourResultlist.map(
                             item=> {                                 
                                 item["TType"] = GetTransferTourTypeDirective(item["TType"]);
                                 item["Status"] = GetBookDisplayStatusDirective(item["Status"]);
                                 return item;
                             }
                          );
                   
                    console.log($scope.MainResultlist);
                    
                    SetDataTable();
                    $scope.ModifySearch = false;
                    $("#RptDetails")[0].style.display = "block";
                    PopUpController.ClosePopup("divPopup", "");
               

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

        $('#HotelReport').DataTable().clear().destroy();
        $('#TranferReport').DataTable().clear().destroy();
        $('#TourReport').DataTable().clear().destroy();


        if ($scope.HotelResultlist.length > 0)
        {
            $("#Hoteldiv")[0].style.display = "block";
            $('#HotelReport').DataTable({

                dom: 'Bfrtip',


                "columnDefs": [
                    { "visible": false },
                    {
                        "targets": 4,
                        "className": "text-center",
                    },
                    {
                        "targets": 9,
                        "className": "text-center",
                    },
                     
                    {
                        "targets": 10,
                        "className": "text-right",
                    },
                ],
                "order": [[0, 'asc'], [1, 'asc']],
                ordering: false,
                searching: false,
                paging: true,
                data: $scope.HotelResultlist,
                "pageLength": 15,
                "deferRender": true,
                select: true,

               // "scrollX": true,

                columns: [
                     {
                         "className": 'details-control1',
                         "orderable": false,
                         "data": null,
                         "defaultContent": '<a><i class="fa fa-plus-square"></i></a>'
                     },
                       { data: 'RefNo' },
                       { data: 'ChkIn' },
                       { data: 'ChkOut' },
                       { data: 'Nts' },                     
                       { data: 'SName' },
                    
                       { data: 'City' },
                      
                       { data: 'SuppN' },
                       { data: 'Status' },
                       { data: 'Sellcur' },
                       { data: 'SellAmt' },
                      
                ],


            });

        }
        else
        {
            $("#Hoteldiv")[0].style.display = "none";
        }

        if ($scope.TransferResultlist.length > 0)
        {
            $("#Transferdiv")[0].style.display = "block";
            $('#TranferReport').DataTable({

                dom: 'Bfrtip',


                "columnDefs": [
                     { "visible": false },
                     {
                         "targets":9,
                         "className": "text-center",
                     },
                    
                     {
                         "targets":10,
                         "className": "text-right",
                     },
                ],
                "order": [[0, 'asc'], [1, 'asc']],
                ordering: false,
                searching: false,
                paging: true,
                data: $scope.TransferResultlist,
                "pageLength": 15,
                "deferRender": true,
                select: true,

              

                columns: [
                     {
                         "className": 'details-control1',
                         "orderable": false,
                         "data": null,
                         "defaultContent": '<a><i class="fa fa-plus-square"></i></a>'
                     },
                       { data: 'RefNo' },
                       { data: 'TDate' },                      
                       { data: 'SName' },                     
                       { data: 'PickId' },
                       { data: 'DropId' },
                       { data: 'City' },                  
                       { data: 'SuppN' },
                       { data: 'Status' },
                       { data: 'Sellcur' },
                       { data: 'SellAmt' },
                 
                ],


            });
        }
        else
        {
            $("#Transferdiv")[0].style.display = "none";
        }
        if ($scope.TourResultlist.length > 0)
        {
            $("#Tourdiv")[0].style.display = "block";
            $('#TourReport').DataTable({

                dom: 'Bfrtip',


                "columnDefs": [
                      { "visible": false },
                     
                        {
                            "targets": 7,
                            "className": "text-center",
                        },                     
                      {
                          "targets": 8,
                          "className": "text-right",
                      },
                ],
                "order": [[0, 'asc'], [1, 'asc']],
                ordering: false,
                searching: false,
                paging: true,
                data: $scope.TourResultlist,
                "pageLength": 15,
                "deferRender": true,
                select: true,

                columns: [
                     {
                         "className": 'details-control1',
                         "orderable": false,
                         "data": null,
                         "defaultContent": '<a><i class="fa fa-plus-square"></i></a>'
                     },
                       { data: 'RefNo' },
                       { data: 'TDate' },                      
                       { data: 'SName' },
                      
                       { data: 'City' },
                     
                       { data: 'SuppN' },
                       { data: 'Status' },
                       { data: 'Sellcur' },
                       { data: 'SellAmt' },
                      
                ],


            });
        }
        else
        {
            $("#Tourdiv")[0].style.display = "none";
        }



      
    }

    //select customdate option
    Customdaterangelist1 = Customdaterangelist();

    $scope.DateRangeList = Customdaterangelist1;

    $("#ddl_CustomDateRange").change(function () {
        $scope.CustomDateRangeFilter = $("#ddl_CustomDateRange").val();

        if ($scope.CustomDateRangeFilter != "" && $scope.CustomDateRangeFilter != "0") {
            GetE("txtArrivalFromDate").value = $scope.CustomDateRangeFilter.split("~")[0];
            $scope.ProdReport.From = $scope.CustomDateRangeFilter.split("~")[0];
            GetE("txtArrivalToDate").value = $scope.CustomDateRangeFilter.split("~")[1];
            $scope.ProdReport.To = $scope.CustomDateRangeFilter.split("~")[1];
        }
        else {
            GetE("txtArrivalFromDate").value = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            $scope.ProdReport.From = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            GetE("txtArrivalToDate").value = ConvertCustomrangedate(new Date());
            $scope.ProdReport.To = ConvertCustomrangedate(new Date());
        }

    });


    $scope.ShowModifyBtn = function () {
        $scope.ModifySearch = false;

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

            sortByKey(solution1, 'match');
            $scope.cities = solution1.splice(0, 100);

        }
    }
    $("#txtautocomplete").change(function () {
        var j = angular.element('#txtautocomplete_value');
        var str = j[0].value;
        if (str == "") {

            $scope.cities = $scope.cities;
            cityid = "";
            document.getElementById("hdncityid").value = "";
            $scope.SelectedCityCountry = "";
            $("#cityhedaing")[0].style.visibility = "hidden";
        }
    });

    $scope.AfterSelectedCity = function (selected) {

        if (selected != undefined) {
            $scope.SelectedCityCountry = selected.originalObject;
            var cityid = $scope.SelectedCityCountry.value;
            $("#hdncityid").val(cityid);
           
            $scope.cities = $scope.cities.filter(c => {
                return c.major == 1;
            });

            $("#cityhedaing")[0].style.visibility = "visible";
        }
        else {
            $scope.cities = $scope.cities;
            cityid = "";
            document.getElementById("hdncityid").value = "";
            $scope.SelectedCityCountry = "";
        }
    }

    //GetSupplierList
    function LoadSupplierList() {
        $scope.Supplierlist = [];
        $http.get("../CommonData/GetSuppiler").then(function (d) {
            $scope.Supplierlist = d.data;

        }, function (error) {
        })
    }
   

}]);

$(document).ready(function () {


    $(".date-cal").datepicker({ dateFormat: 'dd M yy', numberOfMonths: 2, });

    //for Hotel get details call from heare
    $('#HotelReport').on('click', 'tr td', function () {


        var oTable = $('#HotelReport').DataTable();
        var tr = $(this).closest('tr');
        var row = oTable.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            row.child(format(row.data())).show();
            tr.addClass('shown');
        }
    });
   
    function format(d) {
        // `d` is the original data object for the row
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
            '<tr>' +
                '<td>Country:</td>' +
                '<td>' + d.Country + '</td>' +
            '</tr>' +
            '<tr>' +
                '<td>No Of Pax:</td>' +
                '<td>' + d.NoPax + '</td>' +
            '</tr>' +
             '<tr>' +
                '<td>Client Name:</td>' +
                '<td>' + d.Client + '</td>' +
            '</tr>' +
              '<tr>' +
                '<td>Sell Amount:</td>' +
                '<td>' + d.SellAmt + '</td>' +
            '</tr>' +
              '<tr>' +
                '<td>Sell Currency:</td>' +
                '<td>' + d.Sellcur + '</td>' +
            '</tr>' +
            //'<tr>' +
            //    '<td>Extra info:</td>' +
            //    '<td>And any further details here (images etc)...</td>' +
            //'</tr>' +
        '</table>';
    }

    //transfer detail
    $('#TranferReport').on('click', 'tr td', function () {


        var oTable = $('#TranferReport').DataTable();
        var tr = $(this).closest('tr');
        var row = oTable.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            row.child(Tformat(row.data())).show();
            tr.addClass('shown');
        }
    });

    function Tformat(d) {
        // `d` is the original data object for the row
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
             '<tr>' +
                '<td>Country:</td>' +
                '<td>' + d.Country + '</td>' +
            '</tr>' +
            '<tr>' +
                '<td>Transfer Type:</td>' +
                '<td>' + d.TType + '</td>' +
            '</tr>' +
            '<tr>' +
                '<td>No Of Pax:</td>' +
                '<td>' + d.NoPax + '</td>' +
            '</tr>' +
             '<tr>' +
                '<td>Client Name:</td>' +
                '<td>' + d.Client + '</td>' +
            '</tr>' +
              '<tr>' +
                '<td>Sell Amount:</td>' +
                '<td>' + d.SellAmt + '</td>' +
            '</tr>' +
              '<tr>' +
                '<td>Sell Currency:</td>' +
                '<td>' + d.Sellcur + '</td>' +
            '</tr>' +          
        '</table>';
    }

    //transfer detail
    $('#TourReport').on('click', 'tr td', function () {


        var oTable = $('#TourReport').DataTable();
        var tr = $(this).closest('tr');
        var row = oTable.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            row.child(Sformat(row.data())).show();
            tr.addClass('shown');
        }
    });

    function Sformat(d) {
        // `d` is the original data object for the row
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
             '<tr>' +
                '<td>Country:</td>' +
                '<td>' + d.Country + '</td>' +
            '</tr>' +
            '<tr>' +
                '<td>Tour Type:</td>' +
                '<td>' + d.TType + '</td>' +
            '</tr>' +
             '<tr>' +
                '<td>Pickup Point:</td>' +
                '<td>' + d.PickPt + '</td>' +
            '</tr>' +
             '<tr>' +
                '<td>Duration:</td>' +
                '<td>' + d.Durtn + '</td>' +
            '</tr>' +
            '<tr>' +
                '<td>No Of Pax:</td>' +
                '<td>' + d.NoPax + '</td>' +
            '</tr>' +
             '<tr>' +
                '<td>Client Name:</td>' +
                '<td>' + d.Client + '</td>' +
            '</tr>' +
              '<tr>' +
                '<td>Sell Amount:</td>' +
                '<td>' + d.SellAmt + '</td>' +
            '</tr>' +
              '<tr>' +
                '<td>Sell Currency:</td>' +
                '<td>' + d.Sellcur + '</td>' +
            '</tr>' +
        '</table>';
    }




    $("#txtArrivalFromDate").change(function () {
        $("#ddl_CustomDateRange")[0].selectedIndex = 0;
    });

    function changeMe(sel, id) {
        $("#" + id).show();
        sel.style.color = "#000";

    }
});



function GetE(Control) {
    return document.getElementById(Control);
}

function GetSystemDate(date) {
    var dateArr = new Array("", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
    var txtVal = date.split(" ");
    var mon = txtVal[1];
    var monNum = dateArr.indexOf(mon);
    var dtNum = txtVal[0];
    var yrTime = txtVal[2].split(" ");
    var yrNum = yrTime[0];


    var dtObj = new Date(monNum + "/" + dtNum + "/" + yrNum);
    return dtObj;
}














