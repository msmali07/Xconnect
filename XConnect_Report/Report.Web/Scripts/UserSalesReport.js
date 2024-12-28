var app = angular.module('USReportapp', []);


var bid = ""; var brtypeid = ""; var mid = ""; var mrtypeid = ""; var bid = ""; var Wsid = ""; var membertypeid = "";
var isvalid = true;
app.controller('USReportCntr', ['$scope', '$http', '$window', '$rootScope', '$timeout', function ($scope, $http, $window, $rootScope, $timeout) {
    NgInit();

    function NgInit() {
        $scope.UserSReport = UserSalesReportDO();
        $scope.ReportFilter = ReportFilterDO();
        $scope.SendMailDO = SendMailDO();
        $scope.LoginMemberType = GetE("hdnLoginMemberTypeId").value;
        $scope.ModifySearch = true;
        $scope.SortDetails = [];
        $scope.SortDetails.push(SortDetailDO());
        $scope.SortColNo = [];
        $scope.MainResultlistAfterFilter = [];
        $scope.ShowddlFilterList = [];
        $scope.FilterDOList = [];
        $scope.FilterTypeActive = "";
        $scope.selectedArray = "";
        $scope.OldSelectedfilterArrayValues = "";
        $scope.UserLevel = true
        SortingSetting();
        BranchLoad();

        $scope.UserSReport.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
        $scope.UserSReport.DateTo = ConvertCustomrangedate(new Date());

        $("#demo").addClass("collapse in");

    }

    function BranchLoad() {

        var logintype = ($("#hdnLoginMemberTypeId")).val()
        switch (logintype) {
            case '1':  //HQ
                $http.get("../CommonData/GetBracnhList").then(function (d) {
                    $scope.branchlist = d.data;
                }, function (error) {
                    ErrorPopup.render('Branch Load failed');
                });
                break;
            case '2':   
            case '3':
            case '4':
                document.getElementById("divbranch").style.display = "none";
                MId = $("#hdnLoginMemberId").val();
                $scope.getUserList(MId);
                break;
            default:
        }
    }

    $("#ddl_BR").change(function () {
        $scope.Brmemberid = $("#ddl_BR option:selected").val();
        MId = $scope.Brmemberid;
        $scope.getUserList(MId);
    });

    $scope.getUserList = function (MId) {
        $http.get("../CommonData/GetUserList?MemberId=" + MId).then(function (d) {
            $scope.Userlist = d.data;
            document.getElementById("Userdiv").style.display = "block";
        }, function (error) {
            ErrorPopup.render('User Load failed');
        });
    }

    Customdaterangelist1 = Customdaterangelist();

    $scope.DateRangeList = Customdaterangelist1;

    $("#ddl_CustomDateRange").change(function () {
        $scope.CustomDateRangeFilter = $("#ddl_CustomDateRange").val();

        if ($scope.CustomDateRangeFilter != "" && $scope.CustomDateRangeFilter != "0") {
            GetE("txtFromDate").value = $scope.CustomDateRangeFilter.split("~")[0];
            $scope.UserSReport.DateFrom = $scope.CustomDateRangeFilter.split("~")[0];
            GetE("txtToDate").value = $scope.CustomDateRangeFilter.split("~")[1];
            $scope.UserSReport.DateTo = $scope.CustomDateRangeFilter.split("~")[1];
        }
        else {
            GetE("txtFromDate").value = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            $scope.UserSReport.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));
            GetE("txtToDate").value = ConvertCustomrangedate(new Date());
            $scope.UserSReport.DateTo = ConvertCustomrangedate(new Date());
        }

    });

    $scope.ShowModifyBtn = function () {
        $scope.ModifySearch = false;

    }

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

        if ($scope.UserSReport.DateFrom == "") {

            Alert.render("Please Select Arrival-From Date", "txtFromDate");
            isvalid = false;
            return false;
        }

        if ($scope.UserSReport.DateTo == "") {
            Alert.render("Please Select Arrival-To Date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ($scope.UserSReport.DateFrom != "" && $scope.UserSReport.DateTo != "") {
            var dtObj1 = GetSystemDate($scope.UserSReport.DateFrom);
            var dtObj2 = GetSystemDate($scope.UserSReport.DateTo);
        }

        if (($scope.UserSReport.DateFrom != "" && $scope.UserSReport.DateTo != "") && (dtObj1 > dtObj2)) {
            Alert.render("Arrival-From date can not be greater than Arrival-To date", "txtToDate");
            isvalid = false;
            return false;
        }
        if ((diffDate(new Date($scope.UserSReport.DateTo), new Date($scope.UserSReport.DateFrom))) > 12.50) {
            Alert.render("Report Seraching Dates Should be Upto 12 Months", "txtToDate");
            isvalid = false;
            return false;
        }

        if (GetE("ddl_BR").options[GetE("ddl_BR").selectedIndex].text == "Select Branch") {
            Alert.render("Please Select Branch", "ddl_BR");
            isvalid = false;
            return false;
        }

        if (document.getElementById('ADW').checked) {
            $scope.UserSReport.BookingdateWise = false;
        }
        if (document.getElementById('BDW').checked) {
            $scope.UserSReport.BookingdateWise = true;
        }

        
        $scope.UserSReport.UserId = GetE("ddl_User").options[GetE("ddl_User").selectedIndex].value;
        $scope.UserSReport.MemberId = GetE("ddl_BR").options[GetE("ddl_BR").selectedIndex].value;
        $scope.UserSReport.LoginUserId = (document.getElementById("hdnLoginUserId")).value;

        if (isvalid == true) {
            $scope.GetReportDetails();
        }
    }

    //getReportDetails on serach click
    $scope.GetReportDetails = function () {

        var popupdetail = (GetE("ddl_User").options[GetE("ddl_User").selectedIndex].value == 0 ? GetE("ddl_BR").options[GetE("ddl_BR").selectedIndex].text : GetE("ddl_User").options[GetE("ddl_User").selectedIndex].text) + "~" + $scope.UserSReport.DateFrom + "~" + $scope.UserSReport.DateTo;
        PopUpController.OpenPopup1("divPopup", "User Sales Report", popupdetail);

        $scope.ReportFilter.Status = $scope.FilterDOList.filter(item=> item.Name == 'Status').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'Status')[0].Values) : "";
        $scope.ReportFilter.CustomDateOption = $("#ddl_CustomDateRange").val();;

        $("#demo").addClass("collapse in");

        $http({
            method: "post",
            url: "../Booking/GetUSReportDetail",
            data: ({
                USSearchReportDO: $scope.UserSReport,
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
                           item["Status"] = GetBookDisplayStatusDirective(item["Status"]);
                           return item;
                       }
                    );
                    $scope.MainResultlistAfterFilter = $scope.MainResultlistAfterFilter.map(
                        item=> {
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
        $('#USReport').DataTable().clear().destroy();
        $('#USReport').DataTable({

            "order": [],
            dom: 'Bfrtip',

            buttons: [

                {
                    extend: 'excelHtml5',
                    text: '<i class="fa fa-file-excel-o"></i>',
                    filename: function () {
                        var ReportName = "User Sales Report"
                        var RptDetails = $scope.UserSReport.DateFrom + "-" + $scope.UserSReport.DateTo;
                        return ReportName + ' ( ' + RptDetails + ' ) '
                    },
                    sheetName: 'USRptSheet',
                    title: null,
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4, 5, 6]
                    }
                },
               {
                   extend: 'copyHtml5',
                   text: '<i class="fa fa-files-o"></i>',
                   titleAttr: 'Copy',
                   exportOptions: {
                       columns: [0, 1, 2, 3, 4, 5, 6]
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
            ],

            searching: false,
            paging: true,
            data: $scope.MainResultlistAfterFilter,
            "pageLength": 30,
            "deferRender": true,
            select: true,
            autoWidth: false,

            columns: [
                   { data: 'StId' },
                   { data: 'AgName' },
                   { data: 'RefNo' },
                   { data: 'BookDate' },
                   { data: 'VNo' },
                   { data: 'VIDate' },
                   { data: 'Status' }
            ],

        });
    }

    $scope.HideColList = [];
    $scope.HideColList = GetHideColList();

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
            $scope.SendMailDO.ReportName = "USReport-" + " (" + $scope.UserSReport.DateFrom + " - " + $scope.UserSReport.DateTo + " )";

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
        Hide_Columns('USReport')

    }

    ////Sorting
    function SortingSetting() {

        $scope.SortColList = [];
        $scope.SortColList = GetHideColList();

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
        Apply_Sorting('USReport', $scope.SortDetails)

    }
    $scope.ClearSorting = function () {
        $scope.SortDetails = [];
        $scope.SortDetails = Clear_Sorting('USReport');
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

function GetHideColList() {
    var HideColList = [];

    HideColList.push("0~StId~Emp Code");
    HideColList.push("1~AgName~Emp Name");
    HideColList.push("2~RefNo~Book Ref No / Pos");
    HideColList.push("3~BookDate~Book Date");
    HideColList.push("4~VNo~Voucher No.");
    HideColList.push("5~VIDate~Voucher Date");
    HideColList.push("6~Status~Book Status");

    return HideColList;

}

$(document).ready(function () {
    $(".date-cal").datepicker({ dateFormat: 'dd M yy', numberOfMonths: 2, });

    var table = $('#USReport').dataTable();
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


