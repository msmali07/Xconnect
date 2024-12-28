var app = angular.module('homeapp', []);

app.controller('homeCntr', ['$scope', '$http', '$window', '$rootScope', '$timeout', '$q', function ($scope, $http, $window, $rootScope, $timeout, $q)
{
    $scope.CompCode = ($("#hdnCCode")).val();
    $scope.logintype = ($("#hdnLoginMemberTypeId")).val();
    $scope.LoginMemberId = ($("#hdnLoginMemberId")).val();
    $scope.IsOverSeas = $("#hdnIsOverSeas").val();
    $scope.LoginSellCurrency = $("#hdnSellCurrency").val();
    if ($scope.logintype == '2' && $scope.IsOverSeas == 'True')
    {
        $scope.BranchIsOverSeas = true;
    }
    $scope.IsBookingdateWise = true;
    $scope.InTermsOf = 1;
    $scope.BasedOn = 1;
    $scope.Currency = "";
    $scope.BasedOnDate = "Book Date"
    $("#selecteddate").text(ConvertCustomrangedate(new Date()));
    $("#selecteddate").val(ConvertCustomrangedate(new Date()));


    LoadCurrency();

    //loading
    $scope.BrDataLoading = false; $scope.BrNoRecords = false;
    $scope.AgDataLoading = false; $scope.AgNoRecords = false;
    $scope.SuppDataLoading = false; $scope.SuppNoRecords = false;
    $scope.CitysearchDataLoading = false; $scope.CitysearchNoRecords = false;
    $scope.AgsearchDataLoading = false; $scope.AgsearchNoRecords = false;
    $scope.failedDataLoading = false; $scope.failedNoRecords = false;
    $scope.AgActiveDataLoading = false; $scope.AgActiveNoRecords = false;
    $scope.AgApiOutActiveDataLoading = false; $scope.AgApiOutActiveNoRecords = false;
    $scope.servicebookingDataLoading = false; $scope.servicebookingNoRecords = false;
    $scope.YearlygraphLoading = false; 

    if ($scope.logintype == '1') {
        GetBranchList();
    }
   
  

    function GetBranchList()
    {
        $http.get("../CommonData/GetBracnhList").then(function (d) {
            $scope.branchlist = d.data;
            $("#DivBranch")[0].style.display = "block";
    }, function (error) {
           // ErrorPopup.render('Branch Load failed');
    });
    }
   
        //at Page Load
    $scope.GetHomeDetails = function (data)
    {        
        $scope.HomeSearchDO = {};
        $scope.HomeSearchDO.BranchId = 0;
        $scope.HomeSearchDO.IsBookingdateWise = $scope.IsBookingdateWise;
        $scope.HomeSearchDO.InTerms = $scope.InTermsOf;
        $scope.HomeSearchDO.Currency = $scope.Currency;
        $scope.HomeSearchDO.BranchId = $("#ddl_branch").val();
        $scope.HomeSearchDO.DashboardDate = $("#selecteddate").val();

        $scope.HomeList = data;
        console.log($scope.HomeList);
        $scope.BookingCount = $scope.HomeList.BookingCountList;

        $scope.TopBranchList = $scope.HomeList.BranchList;
        $scope.BrNoRecords = $scope.TopBranchList.length == 0 ? true : false;

        $scope.TopAgencyList = $scope.HomeList.AgencyList;
        $scope.AgNoRecords = $scope.TopAgencyList.length == 0 ? true : false;

        $scope.TopSupplierList = $scope.HomeList.SupplierList;
        $scope.SuppNoRecords = $scope.TopSupplierList.length == 0 ? true : false;

       
        //$scope.SearchBookByAgencyList = $scope.HomeList.SearchBookByAgencyList;
        //$scope.AgsearchNoRecords = $scope.SearchBookByAgencyList.length == 0 ? true : false;
        $scope.AgsearchDataLoading = true,
        $scope.GetTopSearchBookByAgencyList(),

        //$scope.SearchBookByCityList = $scope.HomeList.SearchBookByCityList;
        //$scope.CitysearchNoRecords = $scope.SearchBookByCityList.length == 0 ? true : false;
        $scope.CitysearchDataLoading = true,
        $scope.GetTopSearchBookList(),

        $scope.FailedSuppList = $scope.HomeList.FailedSuppList;
        $scope.failedNoRecords = $scope.FailedSuppList.length == 0 ? true : false;


        $scope.AgActiveList = $scope.HomeList.AgActiveList;
        $scope.AgActiveNoRecords = $scope.AgActiveList.length == 0 ? true : false;

        $scope.AgApiOutActiveList = $scope.HomeList.AgApiOutReportList;

        // Ensure JsonObj is initialized properly
        $scope.JsonObj = $scope.AgApiOutActiveList || [];
        $scope.columnNames = $scope.JsonObj.length > 0 ? Object.keys($scope.JsonObj[0]) : [];

        // Generate table header content
        let theadContent = '<tr>';
        $scope.columnNames.forEach(column => {
            theadContent += `<th class="text-center" width="3%">${column}</th>`;
        });
        theadContent += '</tr>';

        // Update the table header in the HTML
        $('#AgencyReport thead').html(theadContent);

        // Generate table body content
        let tBodyContent = '';
        $scope.JsonObj.forEach(row => {
            tBodyContent += '<tr>';
            $scope.columnNames.forEach(column => {
                tBodyContent += `<td class="data-td-responsive ng-binding text-right" data-td="${column}">${row[column]}</td>`;
            });
            tBodyContent += '</tr>';
        });

        // Update the table body in the HTML
        $('#AgencyReport tbody').html(tBodyContent);



        $scope.AgApiOutActiveNoRecords = $scope.AgApiOutActiveList.length == 0 ? true : false;

        $scope.ServiceBookingList = $scope.HomeList.ServiceBookingList;
        $scope.servicebookingNoRecords = $scope.ServiceBookingList.length == 0 ? true : false;

        $scope.YearlygraphLoading = true,
        $scope.GetYearLyBookingGraph(),


        PopUpController.ClosePopup("divPopup", "");
        $("#Homediv")[0].style.display = "block";

    }

   
        //on changed functions
    $("#ddl_basedon").change(function ()
    {
        $scope.onCurrencyChanged = false;
        $scope.onTermsChanged = false;
        if ($("#ddl_basedon").val() == "2")
        {
            $('#hiddenInput').datepicker('destroy').datepicker({
                showOn: 'button',
                buttonImage: "../images/calender.png",
                buttonImageOnly: true,
                buttonText: 'Select Date for Dashborad',
                dateFormat: 'dd M yy',               
                onSelect: function (selectedDate) {
                   
                    $("#selecteddate").text(selectedDate);
                    $("#selecteddate").val(selectedDate);
                    $scope.GetSelectedDate(selectedDate);                    
                }
            });
        }
        else {
            $('#hiddenInput').datepicker('destroy').datepicker({
                showOn: 'button',
                buttonImage: "../images/calender.png",
                buttonImageOnly: true,
                buttonText: 'Select Date for Dashborad',
                dateFormat: 'dd M yy',
                maxDate: new Date(),
                onSelect: function (selectedDate) {

                    $("#selecteddate").text(selectedDate);
                    $("#selecteddate").val(selectedDate);
                    $scope.GetSelectedDate(selectedDate);
                }
            });
        }
        GetDashBoradDataAscy();
    });

    $("#ddl_terms").change(function ()
    {
         if($("#ddl_terms").val() == "2")
        {
                $("#Divcurrency")[0].style.display = "block";
        }
         else
         {
                $("#Divcurrency")[0].style.display = "none";
         }

         $scope.onTermsChanged = true;
         $scope.onCurrencyChanged = false;
        GetDashBoradDataAscy();
       
    });

    $("#ddl_currency").change(function ()
    {
        $scope.onCurrencyChanged = true;
        $scope.onTermsChanged = false;
        GetDashBoradDataAscy();
    });
   
    $("#ddl_branch").change(function ()
    {
        $scope.onCurrencyChanged = false;
        $scope.onTermsChanged = false;
        if ($("#ddl_branch").val() == 0)
        {
            $("#BranchReportDiv")[0].style.display = 'block';
        } else
        {
            $("#BranchReportDiv")[0].style.display = 'none';
        }
       
        GetDashBoradDataAscy();
    });

      
    function GetDashBoradDataAscy()
    {

        if ($("#ddl_basedon").val() == "1")
        {
            $scope.IsBookingdateWise = true;
            $scope.BasedOn = 1;
            $scope.BasedOnDate = "Book Date"
        }
        else if ($("#ddl_basedon").val() == "2") {
            $scope.IsBookingdateWise = false;
            $scope.BasedOn = 2;
            $scope.BasedOnDate = "Service Date"
        }

        $scope.InTermsOf = $("#ddl_terms").val();

        if ($scope.InTermsOf == "2")
        {
            $scope.Currency = $("#ddl_currency").val();
        }

      

        $scope.HomeSearchDO = {};
        $scope.HomeSearchDO.BranchId = 0;
        $scope.HomeSearchDO.IsBookingdateWise = $scope.IsBookingdateWise;
        $scope.HomeSearchDO.InTerms = $scope.InTermsOf;
        $scope.HomeSearchDO.Currency = $scope.Currency;
        $scope.HomeSearchDO.BranchId = $("#ddl_branch").val();
        $scope.HomeSearchDO.DashboardDate = $("#selecteddate").val();

        console.log($scope.HomeSearchDO);

        if ($scope.onTermsChanged == true || $scope.onCurrencyChanged == true)
        {
            $q.all([
                           
                $scope.BrDataLoading = true,
                $scope.GetTopBranchList(),

                $scope.AgDataLoading = true,
                $scope.GetTopAgencyList(),

                $scope.SuppDataLoading = true,
                $scope.GetTopSupplierList(),           





            ]).then(
            function (successResult) {                                
            }, function (failureReason) {
                console.log('Failed: ' + failureReason);
            }
            );
          }
        else
        {
            $q.all([
                $scope.GetBookingList(),

                $scope.BrDataLoading = true,
                $scope.GetTopBranchList(),

                $scope.AgDataLoading = true,
                $scope.GetTopAgencyList(),

                $scope.SuppDataLoading = true,
                $scope.GetTopSupplierList(),

                $scope.CitysearchDataLoading = true,
                $scope.GetTopSearchBookList(),

                $scope.AgsearchDataLoading = true,
                $scope.GetTopSearchBookByAgencyList(),

                $scope.failedDataLoading = true,
                $scope.GetFailedSupplierList(),

                $scope.AgActiveDataLoading = true,
                $scope.GetAgActiveList(),

                $scope.AgApiOutActiveDataLoading = true,
                $scope.GetAgApiOutActiveList(),

                $scope.servicebookingDataLoading = true,
                $scope.GetServiceBookingList(),

                $scope.YearlygraphLoading = true,
                $scope.GetYearLyBookingGraph(),

            ]).then(
            function (successResult) {
            }, function (failureReason) {
                console.log('Failed: ' + failureReason);
            }
            );
            }
    }

    $scope.GetBookingList = function () {

         
    $scope.BookingCount = [];
    $http({
        method: "post",
        url: "../Home/GeBookingCountList",
        data: ({
        SearchDO: $scope.HomeSearchDO,
    }),
        dataType: "json",
        headers: { "Content-Type": "application/json" }

    }).then(function (d) {

    if (d.data != undefined || d.data != null) {
    if (d.data.Data != undefined || d.data.Data != null) {

    $scope.BookingCount = d.data.Data;

    }
    }
    }, function (error) {

    });
         
       

    }

    $scope.GetTopBranchList = function () {
        $scope.TopBranchList = [];
        $http({
            method: "post",
            url: "../Home/TopBranchList",
            data: ({
                SearchDO: $scope.HomeSearchDO,
            }),
            dataType: "json",
            headers: { "Content-Type": "application/json" }

        }).then(function (d) {

            if (d.data != undefined || d.data != null) {
                if (d.data.Data != undefined || d.data.Data != null) {

                    $scope.TopBranchList = d.data.Data;
                    $scope.BrDataLoading = false;
                    $scope.BrNoRecords = $scope.TopBranchList.length == 0 ? true :false;

                }
            }
        }, function (error) {

        });

    }

    $scope.GetTopAgencyList = function () {
        $scope.TopAgencyList = [];
        $http({
            method: "post",
            url: "../Home/GeTopAgencyList",
            data: ({
                SearchDO: $scope.HomeSearchDO,
            }),
            dataType: "json",
            headers: { "Content-Type": "application/json" }

        }).then(function (d) {

            if (d.data != undefined || d.data != null) {
                if (d.data.Data != undefined || d.data.Data != null) {

                    $scope.TopAgencyList = d.data.Data;
                    $scope.AgDataLoading = false;
                    $scope.AgNoRecords = $scope.TopAgencyList.length == 0 ? true : false;

                }
            }
        }, function (error) {

        });

    }


    $scope.GetTopSupplierList = function () {

    $scope.TopSupplierList = [];
    $http({
            method: "post",
            url: "../Home/GeTopSupplierList",
            data: ({
            SearchDO: $scope.HomeSearchDO,
        }),
            dataType: "json",
            headers: { "Content-Type": "application/json" }

        }).then(function (d) {

            if (d.data != undefined || d.data != null)
            {
                if (d.data.Data != undefined || d.data.Data != null)
                {

                    $scope.TopSupplierList = d.data.Data;
                    $scope.SuppDataLoading = false;
                    $scope.SuppNoRecords = $scope.TopSupplierList.length == 0 ? true : false;

                 }
            }
        }, function (error) {

       });

    }

    $scope.GetTopSearchBookList = function () {

    $scope.SearchBookByCityList = [];
    //$http({
    //    method: "post",
    //    url: "../Home/GetTopSearchBookList",
    //    data: ({
    //    SearchDO: $scope.HomeSearchDO,
    //}),
    //    dataType: "json",
    //    headers: { "Content-Type": "application/json" }

    //}).then(function (d) {

    //    if (d.data != undefined || d.data != null)
    //    {
    //        if (d.data.Data != undefined || d.data.Data != null)
    //        {

    //            $scope.SearchBookByCityList = d.data.Data;
    //            $scope.CitysearchDataLoading = false;
    //            $scope.CitysearchNoRecords = $scope.SearchBookByCityList.length == 0 ? true : false;
    //        }
    //    }
    //}, function (error) {

    //});

    }

    $scope.GetTopSearchBookByAgencyList = function () {

    $scope.SearchBookByAgencyList = [];
    //$http({
    //    method: "post",
    //    url: "../Home/GetTopSearchBookByAgencyList",
    //    data: ({
    //    SearchDO: $scope.HomeSearchDO,
    //}),
    //    dataType: "json",
    //    headers: { "Content-Type": "application/json" }

    //}).then(function (d) {

    //    if (d.data != undefined || d.data != null)
    //    {
    //        if (d.data.Data != undefined || d.data.Data != null)
    //        {

    //            $scope.SearchBookByAgencyList = d.data.Data;
    //            $scope.AgsearchDataLoading = false;
    //            $scope.AgsearchNoRecords = $scope.SearchBookByAgencyList.length == 0 ? true : false;
    //        }
    //    }
    //}, function (error) {

    //});

    }

    $scope.GetFailedSupplierList = function () {

    $scope.FailedSuppList = [];
    $http({
        method: "post",
        url: "../Home/GetTopFailedSupplierList",
        data: ({
        SearchDO: $scope.HomeSearchDO,
    }),
        dataType: "json",
        headers: { "Content-Type": "application/json" }

    }).then(function (d) {

        if (d.data != undefined || d.data != null)
        {
            if (d.data.Data != undefined || d.data.Data != null)
            {
                $scope.FailedSuppList = d.data.Data;
                $scope.failedDataLoading = false;
                $scope.failedNoRecords = $scope.FailedSuppList.length == 0 ? true : false;
            }
        }
    }, function (error) {

    });

    }

    $scope.GetAgActiveList = function () {

        $scope.AgActiveList = [];
        $http({
            method: "post",
            url: "../Home/GetTopAgActiveList",
            data: ({
                SearchDO: $scope.HomeSearchDO,
            }),
            dataType: "json",
            headers: { "Content-Type": "application/json" }

        }).then(function (d) {

            if (d.data != undefined || d.data != null) {
                if (d.data.Data != undefined || d.data.Data != null) {
                    $scope.AgActiveList = d.data.Data;
                    $scope.AgActiveDataLoading = false;
                    $scope.AgActiveNoRecords = $scope.AgActiveList.length == 0 ? true : false;
                }
            }
        }, function (error) {

        });

    }

        $scope.GetAgApiOutActiveList = function () {
            $scope.AgApiOutActiveNoRecords = false;
            $scope.AgApiOutActiveList = [];
            $http({
                method: "post",
                url: "../Home/GetAgencyApiOutDetail",
                data: ({
                    SearchDO: $scope.HomeSearchDO,
                }),
                dataType: "json",
                headers: { "Content-Type": "application/json" }

            }).then(function (d) {

                if (d.data != undefined || d.data != null) {
                 
                        $scope.AgApiOutActiveList = d.data;

                        // Ensure JsonObj is initialized properly
                        $scope.JsonObj = $scope.AgApiOutActiveList || [];
                        $scope.columnNames = $scope.JsonObj.length > 0 ? Object.keys($scope.JsonObj[0]) : [];

                        // Generate table header content
                        let theadContent = '<tr>';
                        $scope.columnNames.forEach(column => {
                            theadContent += `<th class="text-center" width="3%">${column}</th>`;
                        });
                        theadContent += '</tr>';

                        // Update the table header in the HTML
                        $('#AgencyReport thead').html(theadContent);

                        // Generate table body content
                        let tBodyContent = '';
                        $scope.JsonObj.forEach(row => {
                            tBodyContent += '<tr>';
                            $scope.columnNames.forEach(column => {
                                tBodyContent += `<td class="data-td-responsive ng-binding text-right" data-td="${column}">${row[column]}</td>`;
                            });
                            tBodyContent += '</tr>';
                        });

                        // Update the table body in the HTML
                        $('#AgencyReport tbody').html(tBodyContent);


                        $scope.AgApiOutActiveDataLoading = false;
                        $scope.AgApiOutActiveNoRecords = $scope.AgApiOutActiveList.length == 0 ? true : false;
                }
                
            }, function (error) {

            });

    }

    $scope.GetServiceBookingList = function () {

    $scope.ServiceBookingList = [];
    $http({
        method: "post",
        url: "../Home/GetServiceBookingList",
        data: ({
        SearchDO: $scope.HomeSearchDO,
    }),
        dataType: "json",
        headers: { "Content-Type": "application/json" }

    }).then(function (d) {

         if (d.data != undefined || d.data != null)
         {
            if (d.data.Data != undefined || d.data.Data != null)
            {

                    $scope.ServiceBookingList = d.data.Data;
                    $scope.servicebookingDataLoading = false;
                    $scope.servicebookingNoRecords = $scope.ServiceBookingList.length == 0 ? true : false;
              
            }
         }
    }, function (error) {

    });

    }

    $scope.GetYearLyBookingGraph = function () {

        
        $http({
            method: "post",
            url: "../Home/GetYearlyBookingList",
            data: ({
                SearchDO: $scope.HomeSearchDO,
            }),
            dataType: "json",
            headers: { "Content-Type": "application/json" }

        }).then(function (d) {

            if (d.data != undefined || d.data != null) 
            {
                $("#YearlyGraphDiv")[0].style.display = "block";
                $("#YearlyGraphDiv").html(d.data);
                $scope.YearlygraphLoading = false;
           }
            
        }, function (error) {

        });

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

    $scope.Statusclick = function (Status) {

      
        var strValue = btoa($("#hdnLoginMemberId").val() + "_" + $("#ddl_branch").val() + "_" + $("#ddl_branch option:selected").text().trim() + "_" + $scope.IsBookingdateWise + "_" + Status + "_" + $("#selecteddate").val() + "_" + $("#selecteddate").val());
        var Url = "../Dashboard/BookStatusReport?Identity=" + getUrlVars()["Identity"] + "&S=" + strValue;
        window.location.href = Url;
    }

    $scope.ServiceBookViewMore = function () {


        var strValue1 = btoa($("#hdnLoginMemberId").val() + "_" + $("#ddl_branch").val() + "_" + $("#ddl_branch option:selected").text().trim() + "_" + $scope.IsBookingdateWise + "_" + $("#selecteddate").val() + "_" + $("#selecteddate").val());
        var Url = "../Dashboard/ServiceBookingReport?Identity=" + getUrlVars()["Identity"] + "&S=" + strValue1;
        window.location.href = Url;
    }


    $scope.BrReportViewMoreclick = function () {


        var strValue = btoa($("#hdnLoginMemberId").val() + "_" + "All Branch" + "_" + $scope.IsBookingdateWise + "_" + $("#ddl_currency").val() + "_" + $("#ddl_terms").val()+ "_" + $("#selecteddate").val() + "_" + $("#selecteddate").val());
        var Url = "../Dashboard/BranchProductivityReport?Identity=" + getUrlVars()["Identity"] + "&S=" + strValue;
        window.location.href = Url;
    }

    $scope.AgReportViewMoreclick = function () {


        var strValue = btoa($("#hdnLoginMemberId").val() + "_" + $("#ddl_branch").val() + "_" + $("#ddl_branch option:selected").text().trim() + "_" +  $scope.IsBookingdateWise + "_" + $("#ddl_currency").val() + "_" + $("#ddl_terms").val()+ "_" + $("#selecteddate").val() + "_" + $("#selecteddate").val());
        var Url = "../Dashboard/AgentProductivityReport?Identity=" + getUrlVars()["Identity"] + "&S=" + strValue;
        window.location.href = Url;
    }

    $scope.SuppReportViewMoreclick = function () {


        var strValue = btoa($("#hdnLoginMemberId").val() + "_" + $("#ddl_branch").val() + "_" + $("#ddl_branch option:selected").text().trim() + "_" + $scope.IsBookingdateWise + "_" + $("#ddl_currency").val() + "_" + $("#ddl_terms").val() + "_" + $("#selecteddate").val() + "_" + $("#selecteddate").val());
        var Url = "../Dashboard/SupplierSelloutReport?Identity=" + getUrlVars()["Identity"] + "&S=" + strValue;
        window.location.href = Url;
    }

    $scope.FailedBookingReportViewMoreclick = function () {


        var strValue = btoa($("#hdnLoginMemberId").val() + "_" + $("#ddl_branch").val() + "_" + $("#ddl_branch option:selected").text().trim() + "_" + $scope.IsBookingdateWise + "_" + $("#selecteddate").val() + "_" + $("#selecteddate").val());
        var Url = "../Dashboard/FailedBookingReport?Identity=" + getUrlVars()["Identity"] + "&S=" + strValue;
        window.location.href = Url;
    }

    $scope.AgActivityReportViewMoreclick = function () {


        var strValue = btoa($("#hdnLoginMemberId").val() + "_" + $("#ddl_branch").val() + "_" + $("#ddl_branch option:selected").text().trim() + "_" + $scope.IsBookingdateWise + "_" + $("#ddl_currency").val() + "_" + $("#ddl_terms").val() + "_" + $("#selecteddate").val() + "_" + $("#selecteddate").val());
        var Url = "../Dashboard/AgencyActivityReport?Identity=" + getUrlVars()["Identity"] + "&S=" + strValue;
        window.location.href = Url;
    }

    $scope.AgApiOutActivityReportViewMoreclick = function () {


        var strValue = btoa($("#hdnLoginMemberId").val() + "_" + $("#ddl_branch").val() + "_" + $("#ddl_branch option:selected").text().trim() + "_" + $scope.IsBookingdateWise + "_" + $("#ddl_currency").val() + "_" + $("#ddl_terms").val() + "_" + $("#selecteddate").val() + "_" + $("#selecteddate").val());
        var Url = "../Dashboard/AgencyActivityApiOut?Identity=" + getUrlVars()["Identity"] + "&S=" + strValue;
        window.location.href = Url;
    }

    $scope.SearchCityBookingReportViewMoreclick = function () {


        var strValue = btoa($("#hdnLoginMemberId").val() + "_" + $("#ddl_branch").val() + "_" + $("#ddl_branch option:selected").text().trim() + "_" + $scope.IsBookingdateWise + "_" + $("#selecteddate").val() + "_" + $("#selecteddate").val());
        var Url = "../Dashboard/SearchCityBookingReport?Identity=" + getUrlVars()["Identity"] + "&S=" + strValue;
        window.location.href = Url;
    }

    $scope.SearchAgentBookingReportViewMoreclick = function () {


        var strValue = btoa($("#hdnLoginMemberId").val() + "_" + $("#ddl_branch").val() + "_" + $("#ddl_branch option:selected").text().trim() + "_" + $scope.IsBookingdateWise + "_" + $("#selecteddate").val() + "_" + $("#selecteddate").val());
        var Url = "../Dashboard/SearchAgentBookingReport?Identity=" + getUrlVars()["Identity"] + "&S=" + strValue;
        window.location.href = Url;
    }
   

    //GetCurrencyList
    function LoadCurrency() {
        $scope.Currencylist = [];
        $http.get("../CommonData/GetCurrency").then(function (d) {
            $scope.Currencylist = d.data;

        }, function (error) {
        })
    }

    $scope.GetSelectedDate = function (selectedDate)
    {
        var due_date = $('#selecteddate').val();
        var today = ConvertCustomrangedate(new Date());
        if (due_date == today)
        {
            $("#selecteddate").text(ConvertCustomrangedate(new Date()));
        }
        GetDashBoradDataAscy();
    }

}]);


function GetHomeDetails(ResultList) {
        var scope = angular.element(document.getElementById("MainWrap")).scope();
        scope.$apply(function () {
            scope.GetHomeDetails(ResultList);
        })
        return;
}

$(document).ready(function () {
    $('#hiddenInput').datepicker({
        showOn: 'button',
        buttonImage: "../images/calender.png",
        buttonImageOnly: true,
        buttonText: 'Select Date for Dashborad',
        dateFormat: 'dd M yy',
        maxDate: new Date(),
        onSelect: function (selectedDate) {
            // $('#Dashboraddate').text(selectedDate);
            $("#selecteddate").text(selectedDate);
            $("#selecteddate").val(selectedDate);
            // $('#hiddenInput').datepicker('destroy');
            var scope = angular.element(document.getElementById("MainWrap")).scope();
            scope.$apply(function () {
                scope.GetSelectedDate(selectedDate);
            })
            return;
        }
    });

});