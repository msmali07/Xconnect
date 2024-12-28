var app = angular.module('AgencyUserReportapp', []);


var bid = ""; var brtypeid = ""; var mid = ""; var mrtypeid = ""; var bid = ""; var Wsid = ""; var membertypeid = "";
var isvalid = true;
app.controller('AgencyUserReportCntr', ['$scope', '$http', '$window', '$rootScope', '$timeout', function ($scope, $http, $window, $rootScope, $timeout) {
    NgInit();

    function NgInit() {
        $scope.AgencyUserReport = AgencyUserReportDO();
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
        BranchLoad();
       
        $("#ddl_BR option:selected").text("All Branch");

        $("#ddl_AG option:selected").text("All Agent");


        $scope.AgencyUserReport.DateFrom = ConvertCustomrangedate(new Date(new Date().setDate(new Date().getDate() - 1)));

        $scope.AgencyUserReport.DateTo = ConvertCustomrangedate(new Date());

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
    function BranchLoad() {

        var logintype = ($("#hdnLoginMemberTypeId")).val()
        switch (logintype) {
            case '1':  //HQ
                $http.get("../CommonData/GetBracnhList").then(function (d) {
                    //$scope.sortAgSSWise();
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
  
    //});


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

        
        //PostBookingSetting
        $scope.PostBooking = PostBooking_Setting($scope.PostBooking, $scope.LoginMemberType)

        if ($scope.PostBooking.PostMemberId == "0") {
            if (GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text != "All Agent") {
                Alert.render("Select Member to Post Booking", "ddl_BR");
                isvalid = false;
                return false;
            }
        }

        $scope.MemberDetails = $scope.PostBooking.Br_Id + "_" + $scope.PostBooking.Ws_Id + "_" + $scope.PostBooking.Ag_Id + "_" + $scope.PostBooking.ReportCompanyName + "_" + GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text;


        $scope.AgencyUserReport.MemberId = $scope.PostBooking.PostMemberId;
        $scope.AgencyUserReport.LoginUserId = (document.getElementById("hdnLoginUserId")).value;





        if (isvalid == true) {
            $scope.GetReportDetails();
        }
    }


    //getReportDetails on serach click
    $scope.GetReportDetails = function () {

        var popupdetail = $scope.PostBooking.ReportCompanyName + "~" + $scope.AgencyUserReport.DateFrom + "~" + $scope.AgencyUserReport.DateTo;
        PopUpController.OpenPopup1("divPopup", "Agency User Report", popupdetail);
        $scope.ReportFilter.Agname = $scope.FilterDOList.filter(item=> item.Name == 'Agname').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'Agname')[0].Values) : "";
        $scope.ReportFilter.AgCountry = $scope.FilterDOList.filter(item=> item.Name == 'AgCountry').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'AgCountry')[0].Values) : "";
        $scope.ReportFilter.AgCity = $scope.FilterDOList.filter(item=> item.Name == 'AgCity').length > 0 ? ($scope.FilterDOList.filter(item=> item.Name == 'AgCity')[0].Values) : "";
        $scope.ReportFilter.UsrCreatedDate = $scope.FilterDOList.filter(item => item.Name == 'UsrCreatedDate').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'UsrCreatedDate')[0].Values) : "";
        $scope.ReportFilter.Active = $scope.FilterDOList.filter(item => item.Name == 'Active').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'Active')[0].Values) : "";
        $scope.ReportFilter.UName = $scope.FilterDOList.filter(item => item.Name == 'UName').length > 0 ? ($scope.FilterDOList.filter(item => item.Name == 'UName')[0].Values) : "";
        $scope.ReportFilter.Br_Id = $("#ddl_BR").val();;


        $("#demo").addClass("collapse in");

        $http({
            method: "post",
            url: "../Booking/GetAgencyUserDetail",
            data: ({
                AgentUserSearchReportDO: $scope.AgencyUserReport,
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
         PopUpController.ClosePopup("divPopup", "");
        });


    }

    //Modify Button for
    $scope.ShowModifyClick = function () {    
        $("#Noresultdiv")[0].style.display = "none";
        $("#Errordiv")[0].style.display = "none";
    }

    function SetDataTable() {
        if ($scope.ReportFilter.GroupBy == "") {



            $('#AgencyUserReport').DataTable().clear().destroy();
            $scope.collapsedGroups = {};
            $('#AgencyUserReport').DataTable({

                "order": [],
                dom: 'Bfrtip',

                buttons: [

                    {
                        extend: 'excelHtml5',
                        text: '<i class="fa fa-file-excel-o"></i>',
                        filename: function () {
                            var ReportName = "Agency User Report"
                            return ReportName + ' ( ' + RptDetails + ' ) '
                        },
                        sheetName: 'AgencyUserRptSheet',
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
                          orderable: false,
                          "className": "text-left",
                      },
                      {
                          "targets": 4,
                          orderable: false,
                          "className": "text-left",
                      },
                          {
                              "targets": 5,
                              orderable: false,
                              "className": "text-left",
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
                        orderable: false,
                        "className": "text-left",
                    },
                    {
                        "targets": 10,
                        orderable: false,
                        "className": "text-left",
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
                            { data: 'AgCountry' },
                          { data: 'AgCity' },
                            { data: 'Title' },
                             { data: 'FirstName' },
                              { data: 'LastName' },
                     { data: 'Mobile' },
                      { data: 'Email' },
                    { data: 'UsrCreatedDate' },
                    { data: 'Active' },
                    { data: 'UName' },
                ],




            });

            if ($scope.filter != true) {
                $('#AgencyUserReport tbody').on('click', 'tr.dtrg-start', function () {
                    var name = $(this).data('name');

                    $scope.collapsedGroups[name] = !$scope.collapsedGroups[name];

                    $('#AgencyUserReport').DataTable().draw(false);

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
            $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6, 7, 8,9,10];
        }
        else {
            $scope.ExcelCollist = [0, 1, 2, 3, 4, 5, 6, 7, 8,9,10];
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

        //To remove red color when second time serach and perivios filter red colr
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
        Hide_Columns('AgencyUserReport')

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
        Apply_Sorting('AgencyUserReport', $scope.SortDetails)

    }
    $scope.ClearSorting = function () {
        $scope.SortDetails = [];
        $scope.SortDetails = Clear_Sorting('AgencyUserReport');
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
    HideColList.push("1~Country~Country");
    HideColList.push("2~City~City");
    HideColList.push("3~Title~Title");
    HideColList.push("4~FirstName~FirstName");
    HideColList.push("5~LastName~LastName");
    HideColList.push("6~Mobile~Mobile");
    HideColList.push("7~Email~Email");
    HideColList.push("8~UsrCreatedDate~User Created Date");
    HideColList.push("9~Active~Active");
    HideColList.push("10~UName~User Name");
    //if (GetE("hdnCCode").value != "1") {
    //    HideColList.push("9~SalesPerson~Sales Person");
    //}





    //if (GroupBy != "") {
    //    var NewHideColList = [];
    //    switch (GroupBy) {
    //        case '6':
    //            NewHideColList = removeElementsfromhidelist(HideColList, '0~AgName~Agency Name');
    //            break;
    //        case '13':
    //            NewHideColList = removeElementsfromhidelist(HideColList, '13~Status~BookStatus');
    //            break;
    //        case '4':
    //            NewHideColList = removeElementsfromhidelist(HideColList, '4~SType~Service');
    //            break;
    //        case '10':
    //            NewHideColList = removeElementsfromhidelist(HideColList, '10~SCurr~Sell Currency');
    //            break;

    //    }

    //}
    NewHideColList = HideColList;


    return NewHideColList;


}


$(document).ready(function () {

    $("#BookingReport").addClass("active");
    //$(".date-cal").datepicker({ dateFormat: 'dd M yy', numberOfMonths: 2, });




    var table = $('#AgencyUserReport').dataTable();
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

        e.stopPropagation();
    });





});

