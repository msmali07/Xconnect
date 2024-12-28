var app = angular.module('Salereportapp', []);


var bid = ""; var brtypeid = ""; var mid = ""; var mrtypeid = ""; var bid = ""; var Wsid = ""; var membertypeid = "";
var isvalid = true;
app.controller('SalereportCntr', ['$scope', '$http', '$window', '$rootScope',  function ($scope, $http, $window, $rootScope) {
    NgInit();

    function NgInit() {
        $scope.SaleReport = SalesReportDO();
        $scope.ReportFilter = ReportFilterDO();
        $scope.PostBooking = PostBookingDO();
        $scope.SendMailDO = SendMailDO();

        $scope.LoginMemberType = GetE("hdnLoginMemberTypeId").value;
        $scope.ModifySearch = true;
        $scope._IsHidePostBooking = false;
        $scope.MemberDetails = "";
        $scope.GroupingName = "";


        $scope.MainResultlistAfterFilter = [];
        $scope.ShowddlFilterList = [];
        $scope.FilterDOList = [];
        $scope.FilterTypeActive = "";
        $scope.selectedArray = "";
        $scope.OldSelectedfilterArrayValues = "";

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



        $scope.SaleReport.ChkInDateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
        $scope.SaleReport.ChkInDateTo = ConvertCustomrangedate(new Date());

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


    $scope.fnShowHide = function (iCol) {
        /* Get the DataTables object again - this is not a recreation, just a get of the object */
        var oTable = $('#SalesReport').dataTable();

        var bVis = oTable.fnSettings().aoColumns[iCol].bVisible;
        oTable.fnSetColumnVis(iCol, bVis ? false : true);


    }

    //validation and setparam on serach click
    $scope.SearchReportClick = function () {


        var isvalid = true;
      
        $("#RptDetails")[0].style.display = "none";
        PopUpController.ClosePopup("divPopup", "");
        $("#HeaderSearchdiv").removeClass();
        $("#HeaderSearchdiv").addClass("col-lg-12 col-md-12 col-sm-12 col-xs-12 container-fluid padd-lft10 padd-rgt10");
        $scope.ModifySearch = false;

        if ($scope.SaleReport.ChkInDateFrom == "") {

            Alert.render("Please Select Arrival-From Date", "txtChcekInFromDate");
            isvalid = false;
            return false;
        }

        if ($scope.SaleReport.ChkInDateTo == "") {
            Alert.render("Please Select Arrival-To Date", "txtChcekInToDate");
            isvalid = false;
            return false;
        }
        if ($scope.SaleReport.ChkInDateFrom != "" && $scope.SaleReport.ChkInDateTo != "") {
            var dtObj1 = GetSystemDate($scope.SaleReport.ChkInDateFrom);
            var dtObj2 = GetSystemDate($scope.SaleReport.ChkInDateTo);
        }

        if (($scope.SaleReport.ChkInDateFrom != "" && $scope.SaleReport.ChkInDateTo != "") && (dtObj1 > dtObj2)) {
            Alert.render("Arrival-From date can not be greater than Arrival-To date", "txtChcekInToDate");
            isvalid = false;
            return false;
        }
        if ((diffDate(new Date($scope.SaleReport.ChkInDateTo), new Date($scope.SaleReport.ChkInDateFrom))) > 12.50) {
            Alert.render("Report Seraching Dates Should be Upto 12 Months", "txtChcekInToDate");
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


        $scope.SaleReport.MemberId = $scope.PostBooking.PostMemberId;
        $scope.SaleReport.LoginMemberId = $("#hdnLoginMemberId").val();
        $scope.SaleReport.LoginUserId = (document.getElementById("hdnLoginUserId")).value;



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

        $http({
            method: "post",
            url: "../Booking/GetSalesReport",
            data: ({
                SalesReportDO: $scope.SaleReport,
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
                           item["type"] = GetBookingServiceNameDirective(item["type"]);
                           item["BkStatus"] = GetBookDisplayStatusDirective(item["BkStatus"]);
                           return item;
                       }
                    );
                    $scope.MainResultlistAfterFilter = $scope.MainResultlistAfterFilter.map(
                        item=> {
                            item["type"] = GetBookingServiceNameDirective(item["type"]);
                            item["BkStatus"] = GetBookDisplayStatusDirective(item["BkStatus"]);
                            return item;
                        }
                    );

                    console.log($scope.MainResultlistAfterFilter.length);
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
            $('#SalesReport').DataTable().clear().destroy();
          
            $('#SalesReport').DataTable({

                dom: 'Bfrtip',
                buttons: [
                    {
                        extend: 'pdfHtml5',
                        title: function () {
                            return "Sales Report";
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
                            var ReportName = "Sales Report"
                            var RptDetails = $scope.SaleReport.ChkInDateFrom + "-" + $scope.SaleReport.ChkInDateTo;
                            return ReportName + ' ( ' + RptDetails + ' ) '
                        },
                        sheetName: 'SalesRptSheet',
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
                             $scope._MailSubject = "Sales Report From" + " (" + $scope.SaleReport.ChkInDateFrom + " To " + $scope.SaleReport.ChkInDateTo + " )";
                             $scope._Attachment = "SalesReport-" + " (" + $scope.SaleReport.ChkInDateFrom + " - " + $scope.SaleReport.ChkInDateTo + " )" + ".Pdf";
                             $("#MailDiv").modal('show');
                             $("#txtmailsubject").val($scope._MailSubject);
                             $("#_Attachment")[0].innerHTML = $scope._Attachment;
                         }
                     }

                ],


                "columnDefs": [
                    { "visible": false },
                    {
                        "targets": 3,
                        "className": "text-center",
                    },
                    {
                        "targets": 10,
                        "className": "text-center",
                    },
                    {
                        "targets": 11,
                        "className": "text-right",
                    },
                     {
                         "targets": 12,
                         "className": "text-right",
                     },
                      {
                          "targets": 13,
                          "className": "text-right",
                      },
                    
                ],
                "order": [[0, 'asc'], [1, 'asc']],
                ordering: false,
                searching: false,
                paging: true,
                data: $scope.MainResultlistAfterFilter,
                "pageLength": 30,
                "deferRender": true,
                select: true,
                "scrollX": true,
                columns: [
                       { data: 'RefNo', "width": "10%" },
                       { data: 'ChkIn', "width": "10%" },
                       { data: 'ChkOut' , "width": "10%" },
                       { data: 'Nts' , "width": "10%" },
                       { data: 'Destination', "width": "10%"  },
                       { data: 'ServiceName', "width": "10%" },
                       { data: 'Client', "width": "10%" },
                       { data: 'SuppName', "width": "10%" },
                       { data: 'SuppRefNo', "width": "10%" },
                       { data: 'Status', "width": "10%" },
                       { data: 'SellCurrency', "width": "10%" },
                       { data: 'SellAmt', "width": "10%" },
                       { data: 'Commission', "width": "10%" },
                       { data: 'BookPaidAmt', "width": "10%" }
                ],
                //"footerCallback": function (row, data, start, end, display) {
                //    var api = this.api(), data;

                //    // Remove the formatting to get integer data for summation
                //    var intVal = function (i) {
                //        return typeof i === 'string' ?
                //            i.replace(/[\$,]/g, '') * 1 :
                //            typeof i === 'number' ?
                //            i : 0;
                //    };

                //    // Total over all pages
                //    total = api
                //        .column(7)
                //        .data()
                //        .reduce(function (a, b) {
                //            return intVal(a) + intVal(b);
                //        }, 0);

                //    // Total over this page
                //    pageTotal = api
                //        .column(7, { page: 'last' })
                //        .data()
                //        .reduce(function (a, b) {
                //            return intVal(a) + intVal(b);
                //        }, 0);

                //    // Update footer
                //    if (end == data.length) {
                //    $(api.column(7).footer()).html(
                //        //'$' + pageTotal + ' ( $' + total + ' total)'
                //        total
                //    );
                //    }
                //    else {
                //        $(api.column(7).footer()).html('')
                //    }                  
                //}

            });
        }
        else {
            var groupColumn = $scope.ReportFilter.GroupBy.split('~')[0];
            $('#SalesReport').DataTable().clear().destroy();
          
            $('#SalesReport').DataTable({

                dom: 'Bfrtip',
                buttons: [
                    {
                        extend: 'pdfHtml5',
                        title: function () {
                            return "Sales Report";
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
                            var ReportName = "Sales Report"
                            var RptDetails = $scope.SaleReport.ChkInDateFrom + "-" + $scope.SaleReport.ChkInDateTo;
                            return ReportName + ' ( ' + RptDetails + ' ) '
                        },
                        sheetName: 'SalesRptSheet',
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
                             $scope._MailSubject = "Sales Report From" + " (" + $scope.SaleReport.ChkInDateFrom + " To " + $scope.SaleReport.ChkInDateTo + " )";
                             $scope._Attachment = "SalesReport-" + " (" + $scope.SaleReport.ChkInDateFrom + " - " + $scope.SaleReport.ChkInDateTo + " )" + ".Pdf";
                             $("#MailDiv").modal('show');
                             $("#txtmailsubject").val($scope._MailSubject);
                             $("#_Attachment")[0].innerHTML = $scope._Attachment;
                         }
                     }


                ],
                "columnDefs": [
                    { "visible": false },
                    {
                        "targets": 3,
                        "className": "text-center",
                    },
                    {
                        "targets": 10,
                        "className": "text-center",
                    },
                    {
                        "targets": 11,
                        "className": "text-right",
                    },
                     {
                         "targets": 12,
                         "className": "text-right",
                     },
                      {
                          "targets": 13,
                          "className": "text-right",
                      },

                ],
                ordering: true,
                searching: false,
                paging: true,
                data: $scope.MainResultlistAfterFilter,
                "pageLength": 30,
                select: true,
              
                order: [[groupColumn]],
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
                       { data: 'ChkOut' },
                       { data: 'Nts' },
                       { data: 'Destination' },
                       { data: 'ServiceName' },
                       { data: 'Client' },
                       { data: 'SuppName' },
                       { data: 'SuppRefNo' },
                       { data: 'Status' },
                       { data: 'SellCurrency' },
                       { data: 'SellAmt' },
                       { data: 'Commission' },
                       { data: 'BookPaidAmt' }
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

            });
        }

        if ($scope.ReportFilter.HideBy != "") {
            var oTable = $('#SalesReport').dataTable();

            for (var i = 0; i < ($scope.ReportFilter.HideBy.split(',').length - 1) ; i++) {
                var iCol = $scope.ReportFilter.HideBy.split(',')[i];
                var bVis = oTable.fnSettings().aoColumns[iCol].bVisible;
                oTable.fnSetColumnVis(iCol, bVis ? false : true);
            }
        }



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
            GetE("txtChcekInFromDate").value = $scope.CustomDateRangeFilter.split("~")[0];
            $scope.SaleReport.ChkInDateFrom = $scope.CustomDateRangeFilter.split("~")[0];
            GetE("txtChcekInToDate").value = $scope.CustomDateRangeFilter.split("~")[1];
            $scope.SaleReport.ChkInDateTo = $scope.CustomDateRangeFilter.split("~")[1];
        }
        else {
            GetE("txtChcekInFromDate").value = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            $scope.SaleReport.ChkInDateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            GetE("txtChcekInToDate").value = ConvertCustomrangedate(new Date());
            $scope.SaleReport.ChkInDateTo = ConvertCustomrangedate(new Date());
        }

    });


    $scope.ShowModifyBtn = function () {
        $scope.ModifySearch = false;

    }


}]);







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






