var app = angular.module('homeDashboard_V1app', []);

app.controller('homeDashboard_V1Cntr', ['$scope', '$http', '$window', '$rootScope', '$timeout', '$q', function ($scope, $http, $window, $rootScope, $timeout, $q) {
    NgInit()

    function NgInit() {
        $scope.LoginMemberTypeID = GetE("hdnLoginMemberTypeId").value;
        $scope.LoginBranchId = GetE("hdnBranchId").value;
        $scope.IsSalePerson = GetE("hdnIsSalePerson").value;
        $scope.IsSalePersonUserId = GetE("hdnLoginUserId").value;
        $scope.Year = new Date().getFullYear();
        $scope.Date;
        GetsalesPerson();
        $scope.Search = false;




      



        /************ Hotel Overview /Hotel/ Destination ************/
        GetHotelRnReport();
        GetDestinationReport();
        GetOverviewReport();

        /////*********** Sales Overview /Hotel/ Destination ***********/
        //  GetSalesOverviewReport();
        //GetHotelSalesReport();
        //GetSalesDestinationReport();
        /////************ Sales Vs Clients ************/
        //GetSupplierVsClients();

        /////************ Last Minit Vs Early Bookings ************/
        //GetLMVsEarlyBookingClient();
        //GetLMVsEarlyBookingSupplier();
        //GetLMVsEarlyBookingHotel();
        //GetLMVsEarlyBookingDestination();

        /////************ Cancelation ************/
        //GetCancelationHotel();
        //GetCancelationClient();
        //GetCancelationSupplier();
        //GetCancelationDestination();

        ////*************** NR Vs Refundable *********
        //GetNRVsRefDestination();
        //GetNRVsRefHotel();
        //GetNRVsRefClient();
        //GetNRVsRefSupplier();

    }
    $scope.LoadDataSales = false;
    $scope.LoadDataSalesDestination = false;
    $scope.LoadDataSuppVsClient = false;
    $scope.LoadDataLM = false;
    $scope.LoadDataCan = false;
    $scope.LoadDataNRRN = false;
    $scope.LoadDataLMVsEarlyBooking = false;
    $scope.LoadDataCan1 = false;
    $scope.LoadDataNRRN1 = false;
    $scope.LoadDataSuppOverview = false
    $scope.LoadDataSalesDestSuppwise = false;

    $scope.SalesClientGrowth = false
    $scope.SalesBookingErr = false
    function GetsalesPerson() {        
        $http.get("../CommonData/GetSalesPersonList?MemberTypeId=" + $scope.LoginMemberTypeID + "&MemberId=" + $scope.LoginBranchId).then(function (d) {
            $scope.SalesPersonAcessList = d.data;
            // $("#DivBranch")[0].style.display = "block";
        }, function (error) {
            // ErrorPopup.render('Branch Load failed');
        });
    }

    window.addEventListener('scroll', function () {
        // Get current vertical scroll position
        const scrollY = window.scrollY;

        // Example: Calculate vertical threshold based on document height
        const documentHeight = document.documentElement.scrollHeight;
        const verticalThreshold = documentHeight * 0.75; // Trigger at 75% of document height


        if (scrollY > 50) {
            if ($scope.LoadDataSales == false) {
                GetSalesOverviewReport();
                $scope.LoadDataSales = true;
            }
        }
        if (scrollY > 100) {
            if ($scope.LoadDataSalesDestination == false && $scope.LoadDataSales == true) {
                GetHotelSalesReport();
                GetSalesDestinationReport();
                $scope.LoadDataSalesDestination = true;
            }
        }
        if (scrollY > 200) {
            if ($scope.LoadDataSuppVsClient == false && $scope.LoadDataSalesDestination == true) {
                GetSupplierVsClients();
                $scope.LoadDataSuppVsClient = true;
            }
        }
        if (scrollY > 250) {
            if ($scope.LoadDataLMVsEarlyBooking == false && $scope.LoadDataSuppVsClient == true) {
                GetLMVsEarlyBookingClient();
                GetLMVsEarlyBookingSupplier();
                $scope.LoadDataLMVsEarlyBooking = true;
            }
        }


        if (scrollY > 300) {
            if ($scope.LoadDataLM == false && $scope.LoadDataLMVsEarlyBooking == true) {
                GetLMVsEarlyBookingHotel();
                GetLMVsEarlyBookingDestination();
                $scope.LoadDataLM = true;
            }
        }
        if (scrollY > 400) {
            if ($scope.LoadDataCan == false && $scope.LoadDataLM == true) {
                GetCancelationHotel();
                GetCancelationClient();
                $scope.LoadDataCan = true;
            }
        }

        if (scrollY > 450) {
            if ($scope.LoadDataCan1 == false && $scope.LoadDataCan == true) {
                GetCancelationSupplier();
                GetCancelationDestination();
                $scope.LoadDataCan1 = true;
            }
        }
        if (scrollY > 500) {
            if ($scope.LoadDataNRRN == false && $scope.LoadDataCan1 == true) {
                GetNRVsRefDestination();
                GetNRVsRefHotel();
                $scope.LoadDataNRRN = true;
            }
        }

        if (scrollY > 550) {
            if ($scope.LoadDataNRRN1 == false && $scope.LoadDataNRRN == true) {
                GetNRVsRefClient();
                GetNRVsRefSupplier();
                $scope.LoadDataNRRN1 = true;
            }
        }
        if (scrollY > 600) {
            if ($scope.SalesClientGrowth==false && $scope.LoadDataNRRN1 == true) {
                GetClientGrowthLwBookings();
                GetClientGrowthLwDestination();
                GetClientGrowthLwRN();                
                $scope.SalesClientGrowth = true;
            }
        }
        if (scrollY > 650) {
            if ($scope.SalesBookingErr == false && $scope.SalesClientGrowth == true) {               
                GetBookingErrLwClients();
                GetBookingErrLwSupplier();
                GetBookingErrLwDestination();
                $scope.SalesBookingErr = true;
            }
        }
        
    });

    $scope.SalesPerSearch = function () {
        $scope.Search = true;
        $scope.SaleABranchId = $("#ddlSalesPersonReportAcess").val().split("~")[0];
        $scope.SalesAUserId = $("#ddlSalesPersonReportAcess").val().split("~")[1];
        GetHotelRnReport();
        GetDestinationReport();
        GetOverviewReport();

        $scope.LoadDataSales = false;
        $scope.LoadDataSalesDestination = false;
        $scope.LoadDataSuppVsClient = false;
        $scope.LoadDataLM = false;
        $scope.LoadDataCan = false;
        $scope.LoadDataNRRN = false;
        $scope.LoadDataLMVsEarlyBooking = false;
        $scope.LoadDataCan1 = false;
        $scope.LoadDataNRRN1 = false;
        $scope.LoadDataSuppOverview = false
        $scope.LoadDataSalesDestSuppwise = false;
        $scope.SalesClientGrowth = false
        $scope.SalesBookingErr = false
        $("#SalesOverviewReport").html('');
        $("#SALESOVERVIEWPopup").css("display", "block");
        $("#SaleOverdate").html('');
        $("#SaleOverMonth").html('');

        $("#HotelSalesReport").html('');
        $("#SELLINGHOTELPopUp").css("display", "block");
        $("#SaleHoteldate").html('');
        $("#SaleHotelmonth").html('');

        $("#DestinationSaleReport").html('');
        $("#DestinationSaleReportPopUp").css("display", "block");
        $("#SaleDestidate").html('');
        $("#SaleDestimonth").html('');

        $("#SuppVsClientReport").html('');
        $("#SuppVsClientReportPopup").css("display", "block");
        $("#SuppVsClientdate").html('');
        $("#SuppVsClientmonth").html('');

        $("#LMVSEARLYReport").html('');
        $("#LMVSEARLYBOOKINGPopup").css("display", "block");
        $("#LmVsEarlyBCDate").html('');
        $("#LmVsEarlyBCMonth").html('');

        $("#LMVSEARLYSupplierReport").html('');
        $("#LMVSEARLYSupplierPopup").css("display", "block");
        $("#LmVsEarlyBSDate").html('');
        $("#LmVsEarlyBSMonth").html('');
        

        $("#LMVSHotelReport").html('');
        $("#LMVSHotelReportPopup").css("display", "block");
        $("#LmVsEarlyBHDate").html('');
        $("#LmVsEarlyBHMonth").html('');

        $("#LMDestinationReport").html('');
        $("#LMDestinationReportPopup").css("display", "block");
        $("#LmVsEarlyBDDate").html('');
        $("#LmVsEarlyBDMonth").html('');

        $("#cancelationHotelReport").html('');
        $("#cancelationHotelPopup").css("display", "block");
        $("#CanHotelDate").html('');
        $("#CanHotelMonth").html('');

        $("#CanCXLClientReport").html('');
        $("#CanCXLClientPopup").css("display", "block");
        $("#CanClientDate").html('');
        $("#CanClientMonth").html('');

        $("#CanCXLSUPPLIERReport").html('');
        $("#CanCXLSUPPLIERPopup").css("display", "block");
        $("#CanSupplierDate").html('');
        $("#CanSupplierMonth").html('');

        $("#CanDestReport").html('');
        $("#CanDestPopup").css("display", "block");
        $("#CanDestinationDate").html('');
        $("#CanDestinationMonth").html('');

        $("#NRVsRFDestReport").html('');
        $("#NRVsRFDestPopup").css("display", "block");
        $("#NRVsRFDestDate").html('');
        $("#NRVsRFDestMonth").html('');

        $("#NRRFHotelReport").html('');
        $("#NRRFHotelPopup").css("display", "block");
        $("#NRVsRFHotelDate").html('');
        $("#NRVsRFHotelMonth").html('');

        $("#NRVsRefClientReport").html('');
        $("#NRVsRefClientPopup").css("display", "block");
        $("#NRVsRFClientDate").html('');
        $("#NRVsRFClientMonths").html('');

        $("#NRvsRFSuppReport").html('');
        $("#NRvsRFSuppPopup").css("display", "block");
        $("#NRVsRFSupplierDate").html('');
        $("#NRVsRFSupplierMonth").html('');

        $("#ClientGrowthLwBookingsRpt").html('');
        $("#ClientGrowthLwBookingsPopup").css("display", "block");
        $("#ClientGrowthLwBookingsDate").html('');

        $("#ClientGrowthLWDestRpt").html('');       
        $("#ClientGrowthLWDestPopup").css("display", "block");
        $("#ClientGrowthLWDestDate").html('');

        $("#ClientGrowthLWRNRpt").html('');
        $("#ClientGrowthLWRNPopup").css("display", "block");
        $("#ClientGrowthLWRNDate").html('');

        $("#BookingErrLWClientsRpt").html('');
        $("#BookingErrLWClientsPopup").css("display", "block");
        $("#BookingErrLWClientsDate").html('');

        $("#BookingErrLWSuppRpt").html('');
        $("#BookingErrLWSuppPopup").css("display", "block");
        $("#BookingErrLWSuppDate").html('');

        $("#BookingErrLWDestRpt").html('');
        $("#BookingErrLWDestPopup").css("display", "block");
        $("#BookingErrLWDestDate").html('');

    }
    $scope.ClearAccess = function () {
        $scope.Search = false;
        $("#ddlSalesPersonReportAcess").val(0);
        //$scope.SaleABranchId = $("#ddlSalesPersonReportAcess").val().split("~")[0];
        //$scope.SalesAUserId = $("#ddlSalesPersonReportAcess").val().split("~")[1];
        GetHotelRnReport();
        GetDestinationReport();
        GetOverviewReport();

        $scope.LoadDataSales = false;
        $scope.LoadDataSalesDestination = false;
        $scope.LoadDataSuppVsClient = false;
        $scope.LoadDataLM = false;
        $scope.LoadDataCan = false;
        $scope.LoadDataNRRN = false;
        $scope.LoadDataLMVsEarlyBooking = false;
        $scope.LoadDataCan1 = false;
        $scope.LoadDataNRRN1 = false;
        $scope.LoadDataSuppOverview = false
        $scope.LoadDataSalesDestSuppwise = false;
        $scope.SalesClientGrowth = false
        $scope.SalesBookingErr = false

        $("#SalesOverviewReport").html('');
        $("#SALESOVERVIEWPopup").css("display", "block");
        $("#SaleOverdate").html('');
        $("#SaleOverMonth").html('');

        $("#HotelSalesReport").html('');
        $("#SELLINGHOTELPopUp").css("display", "block");
        $("#SaleHoteldate").html('');
        $("#SaleHotelmonth").html('');
        $("#SaleDestimonth").html('');

        $("#DestinationSaleReport").html('');
        $("#DestinationSaleReportPopUp").css("display", "block");
        $("#SaleDestidate").html('');

        $("#SuppVsClientReport").html('');
        $("#SuppVsClientReportPopup").css("display", "block");
        $("#SuppVsClientdate").html('');
        $("#SuppVsClientmonth").html('');

        $("#LMVSEARLYReport").html('');
        $("#LMVSEARLYBOOKINGPopup").css("display", "block");
        $("#LmVsEarlyBCDate").html('');
        $("#LmVsEarlyBCMonth").html('');

        $("#LMVSEARLYSupplierReport").html('');
        $("#LMVSEARLYSupplierPopup").css("display", "block");
        $("#LmVsEarlyBSDate").html('');
        $("#LmVsEarlyBSMonth").html('');


        $("#LMVSHotelReport").html('');
        $("#LMVSHotelReportPopup").css("display", "block");
        $("#LmVsEarlyBHDate").html('');
        $("#LmVsEarlyBHMonth").html('');

        $("#LMDestinationReport").html('');
        $("#LMDestinationReportPopup").css("display", "block");
        $("#LmVsEarlyBDDate").html('');
        $("#LmVsEarlyBDMonth").html('');

        $("#cancelationHotelReport").html('');
        $("#cancelationHotelPopup").css("display", "block");
        $("#CanHotelDate").html('');
        $("#CanHotelMonth").html('');

        $("#CanCXLClientReport").html('');
        $("#CanCXLClientPopup").css("display", "block");
        $("#CanClientDate").html('');
        $("#CanClientMonth").html('');

        $("#CanCXLSUPPLIERReport").html('');
        $("#CanCXLSUPPLIERPopup").css("display", "block");
        $("#CanSupplierDate").html('');
        $("#CanSupplierMonth").html('');

        $("#CanDestReport").html('');
        $("#CanDestPopup").css("display", "block");
        $("#CanDestinationDate").html('');
        $("#CanDestinationMonth").html('');

        $("#NRVsRFDestReport").html('');
        $("#NRVsRFDestPopup").css("display", "block");
        $("#NRVsRFDestDate").html('');
        $("#NRVsRFDestMonth").html('');

        $("#NRRFHotelReport").html('');
        $("#NRRFHotelPopup").css("display", "block");
        $("#NRVsRFHotelDate").html('');
        $("#NRVsRFHotelMonth").html('');

        $("#NRVsRefClientReport").html('');
        $("#NRVsRefClientPopup").css("display", "block");
        $("#NRVsRFClientDate").html('');
        $("#NRVsRFClientMonths").html('');

        $("#NRvsRFSuppReport").html('');
        $("#NRvsRFSuppPopup").css("display", "block");
        $("#NRVsRFSupplierDate").html('');
        $("#NRVsRFSupplierMonth").html('');

        $("#ClientGrowthLwBookingsRpt").html('');
        $("#ClientGrowthLwBookingsPopup").css("display", "block");
        $("#ClientGrowthLwBookingsDate").html('');

        $("#ClientGrowthLWDestRpt").html('');
        $("#ClientGrowthLWDestPopup").css("display", "block");
        $("#ClientGrowthLWDestDate").html('');

        $("#ClientGrowthLWRNRpt").html('');
        $("#ClientGrowthLWRNPopup").css("display", "block");
        $("#ClientGrowthLWRNDate").html('');

        $("#BookingErrLWClientsRpt").html('');
        $("#BookingErrLWClientsPopup").css("display", "block");
        $("#BookingErrLWClientsDate").html('');

        $("#BookingErrLWSuppRpt").html('');
        $("#BookingErrLWSuppPopup").css("display", "block");
        $("#BookingErrLWSuppDate").html('');

        $("#BookingErrLWDestRpt").html('');
        $("#BookingErrLWDestPopup").css("display", "block");
        $("#BookingErrLWDestDate").html('');


    }
    function GetHotelRnReport() {
        var query = "";
        if ($scope.Search == false) {
            if ($scope.LoginMemberTypeID == 1) {
                query = "SELECT HName, Dest, SUM(C_Year) as C_Year, SUM(L_Year) as L_Year, count(HName) RoomNts, M_date FROM rpt_rr_roomnt_" + $scope.Year + "_1 group by HName, Dest, M_date Order by C_Year desc LIMIT 0,5"
            }
            else if ($scope.LoginMemberTypeID == 2) {
                if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
                    query = " SELECT HName, Dest, SUM(C_Year) as C_Year, SUM(L_Year) as L_Year, count(HName) RoomNts, M_date FROM rpt_rr_roomnt_" + $scope.Year + "_2 where BrId =" + $scope.LoginBranchId + " and S_PersonId=" + $scope.IsSalePersonUserId + " group by HName, Dest, M_date Order by C_Year desc LIMIT 0,5"
                }
                else {
                    query = " SELECT HName, Dest, SUM(C_Year) as C_Year, SUM(L_Year) as L_Year, count(HName) RoomNts, M_date FROM rpt_rr_roomnt_" + $scope.Year + "_1 where BrId =" + $scope.LoginBranchId + "  group by HName, Dest, M_date Order by C_Year desc LIMIT 0, 5"
                }
            }
        }
        else {
            query = " SELECT HName, Dest, SUM(C_Year) as C_Year, SUM(L_Year) as L_Year, count(HName) RoomNts, M_date FROM rpt_rr_roomnt_" + $scope.Year + "_2 where BrId =" + $scope.SaleABranchId + " and S_PersonId=" + $scope.SalesAUserId + " group by HName, Dest, M_date Order by C_Year desc LIMIT 0,5"
        }

        var ReportName = " Hotel RN Report";
        var settings = {
            "url": "https://osearch.xconnect.in/_opendistro/_sql",
            "method": "POST",
            "async": false,
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "query": query
            }),
        };
        var _Solution = [];
        $.ajax(settings).done(function (data) {
            var results = data['datarows'];
            _Solution = results;
            $scope.MainResultlist1 = results.map(
                c => {
                    return {
                        'HName': (c[0]),
                        'Dest': (c[1]),
                        'CFY': (c[2]),
                        'LFY': (c[3]),
                        'Vs': (c[3]) == 0 ? 0.00 : (((c[2]) - (c[3])) / (c[3]) * 100).toFixed(2),
                        'M_date': (c[5])
                    }
                }
            );
            $scope.UpdatedHotelRNdate = $scope.MainResultlist1.length == 0 ? "" : $scope.MainResultlist1[0].M_date;
        });
    }

    function GetDestinationReport() {

        const date = new Date();

        var myVariable = date;
        var makeDate = new Date(myVariable);
        makeDate = new Date(makeDate.setMonth(makeDate.getMonth() - 1));

        let monthno = makeDate.getMonth() + 1;
        let year = makeDate.getFullYear();
        const Month = GetMonth(monthno);

        const MonthName = GetMonthName(monthno);

        const FromDate = GetFromDate(Month);
        const ToDate = GetToDate(Month);


        var query = "";
        //if ($scope.Search == false) {
        //    if ($scope.LoginMemberTypeID == 1) {
        //        query = "SELECT Dest,sum(RN) as RN, sum(Bgs) as BKG, sum(SellAmount)/ (case when sum(Bgs)=0 then cast(1 as long) else sum(Bgs) end)  as ABV, sum(RN)/ (case when sum(Bgs)=0 then cast(1 as long) else sum(Bgs) end)  as LoS, sum(NoOfSearch)/ (case when sum(Bgs)=0 then cast(1 as long) else sum(Bgs) end)  as L2B,M_date  from rpt_ops_destinations_" + $scope.Year + "_bk GROUP by Dest,M_date order by BKG Desc LIMIT 0,5"
        //    }
        //    else if ($scope.LoginMemberTypeID == 2) {
        //        if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
        //            query = "SELECT Dest,sum(RN) as RN, sum(Bgs)  as BKG, sum(SellAmount)/(case when sum(Bgs)=0 then cast(1 as long) else sum(Bgs)end )  as ABV, sum(RN)/ (case when sum(Bgs)=0 then cast(1 as long) else sum(Bgs) end)  as LoS, sum(NoOfSearch)/ (case when sum(Bgs)=0 then cast(1 as long) else sum(Bgs) end)  as L2B,M_date,Saleperson  from rpt_ops_destinations_" + $scope.Year + "_bk where BrId=" + $scope.LoginBranchId + " and Saleperson = " + $scope.IsSalePersonUserId + " GROUP by Dest,M_date order by BKG Desc LIMIT 0,5"
        //        }
        //        else {
        //            query = "SELECT Dest,sum(RN) as RN, sum(Bgs) as BKG, sum(SellAmount)/ (case when sum(Bgs)=0 then cast(1 as long) else sum(Bgs) end) as ABV, sum(RN)/ (case when sum(Bgs)=0 then cast(1 as long) else sum(Bgs) end) as LoS, sum(NoOfSearch)/ (case when sum(Bgs)=0 then cast(1 as long) else sum(Bgs) end) as L2B,M_date  from rpt_ops_destinations_" + $scope.Year + "_bk where BrId=" + $scope.LoginBranchId + " GROUP by Dest,M_date order by BKG Desc LIMIT 0,5"
        //        }
        //    }
        //}
        //else {
        //    query = "SELECT Dest,sum(RN) as RN, sum(Bgs)  as BKG, sum(SellAmount)/(case when sum(Bgs)=0 then cast(1 as long) else sum(Bgs)end )  as ABV, sum(RN)/ (case when sum(Bgs)=0 then cast(1 as long) else sum(Bgs) end)  as LoS, sum(NoOfSearch)/ (case when sum(Bgs)=0 then cast(1 as long) else sum(Bgs) end)  as L2B,M_date,Saleperson  from rpt_ops_destinations_" + $scope.Year + "_bk where BrId=" + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + " GROUP by Dest,M_date order by BKG Desc LIMIT 0,5"
        //}
        if ($scope.Search == false) {
            if ($scope.LoginMemberTypeID == 1) {
                query = "SELECT Dest,RN, Bgs as BKG, SellAmount/ (case when Bgs=0 then cast(1 as long) else Bgs end)  as ABV, RN/ (case when Bgs=0 then cast(1 as long) else Bgs end)  as LoS, NoOfSearch/ (case when Bgs=0 then cast(1 as long) else Bgs end)  as L2B,M_date  from rpt_ops_destinations_new_new_" + $scope.Year + "_bk_months  order by BKG Desc LIMIT 0,5"
            }
            else if ($scope.LoginMemberTypeID == 2) {
                if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
                    query = "SELECT Dest,RN, Bgs as BKG, SellAmount/ (case when Bgs=0 then cast(1 as long) else Bgs end)  as ABV, RN/ (case when Bgs=0 then cast(1 as long) else Bgs end)  as LoS, NoOfSearch/ (case when Bgs=0 then cast(1 as long) else Bgs end)  as L2B,M_date,Saleperson  from rpt_ops_destinations_new_new_" + $scope.Year + "_bk_months_sp where BrId=" + $scope.LoginBranchId + " and Saleperson = " + $scope.IsSalePersonUserId + "  order by BKG Desc LIMIT 0,5"
                }
                else {
                    query = "SELECT Dest,RN, Bgs as BKG, SellAmount/ (case when Bgs=0 then cast(1 as long) else Bgs end)  as ABV, RN/ (case when Bgs=0 then cast(1 as long) else Bgs end)  as LoS, NoOfSearch/ (case when Bgs=0 then cast(1 as long) else Bgs end)  as L2B,M_date,Saleperson  from rpt_ops_destinations_new_new_" + $scope.Year + "_bk_months_br where BrId=" + $scope.LoginBranchId + "  order by BKG Desc LIMIT 0,5"
                }
            }
        }
        else {
            query = "SELECT Dest,RN, Bgs as BKG, SellAmount/ (case when Bgs=0 then cast(1 as long) else Bgs end)  as ABV, RN/ (case when Bgs=0 then cast(1 as long) else Bgs end)  as LoS, NoOfSearch/ (case when Bgs=0 then cast(1 as long) else Bgs end)  as L2B,M_date,Saleperson  from rpt_ops_destinations_new_new_" + $scope.Year + "_bk_months_sp where BrId=" + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + "  order by BKG Desc LIMIT 0,5"
        }

        var ReportName = " Destination Report";
        var settings = {
            "url": "https://osearch.xconnect.in/_opendistro/_sql",
            "method": "POST",
            "async": false,
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "query": query//"SELECT * from rpt_ops_destination_2024_bk LIMIT 0,5"
            }),
        };
        var _Solution = [];
        $.ajax(settings).done(function (data) {
            var results = data['datarows'];
            _Solution = results;
            $scope.MainResultlistDest = results.map(
                c => {
                    return {
                        'Dest': (c[0]),
                        'RN': (c[1]),
                        'Bgs': (c[2]),
                        'ABV': (c[3]).toFixed(2),
                        'LOS': (c[4]),
                        'L2B': (c[5]),
                        'M_date': (c[6])
                    }
                }
            );
            $scope.UpdatedDestDate = $scope.MainResultlistDest.length == 0 ? "" : $scope.MainResultlistDest[0].M_date;
            $scope.UpdateDestMonth = MonthName + " " + $scope.Year;
     
        });

    }

    function GetOverviewReport() {
        var query = "";
        if ($scope.Search == false) {
            if ($scope.LoginMemberTypeID == 1) {
                query = "select Month,MonthId, Type,Report,Sum(BookCount) as BCount,Sum(case when Month!='' then 1 else 0 end) as Count, M_date from rpt_ops_overviews_" + $scope.Year + "  group by Month,MonthId,Type,Report,M_date"
            }
            else if ($scope.LoginMemberTypeID == 2) {
                if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
                    query = "select Month,MonthId, Type,Report,Sum(BookCount) as BCount , Sum(case when Month!='' then 1 else 0 end) as Count,M_date,BrId,Saleperson from rpt_ops_overviews_" + $scope.Year + " where BrId=" + $scope.LoginBranchId + " and Saleperson = " + $scope.IsSalePersonUserId + "  group by Month,MonthId,Type,Report,M_date,BrId,Saleperson"
                }
                else {
                    query = "select Month,MonthId, Type,Report,Sum(BookCount) as BCount, Sum(case when Month!='' then 1 else 0 end) as Count, M_date,BrId from rpt_ops_overviews_" + $scope.Year + " where BrId=" + $scope.LoginBranchId + "  group by Month,MonthId,Type,Report,M_date,BrId"
                }
            }
        }
        else {
            query = "select Month,MonthId, Type,Report,Sum(BookCount) as BCount , Sum(case when Month!='' then 1 else 0 end) as Count,M_date,BrId,Saleperson from rpt_ops_overviews_" + $scope.Year + " where BrId=" + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + "  group by Month,MonthId,Type,Report,M_date,BrId,Saleperson"
        }


        var ReportName = " OverView Report";
        var settings = {
            "url": "https://osearch.xconnect.in/_opendistro/_sql",
            "method": "POST",
            "async": false,
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "query": query
            }),
        };
        var _Solution = [];
        $.ajax(settings).done(function (data) {
            if ($scope.LoginMemberTypeID == 2) {
                var list = [
                    { RId: 1, RName: 'Bookings', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 },
                    { RId: 2, RName: 'CheckIn', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 },
                    { RId: 3, RName: 'RN', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 },
                    { RId: 4, RName: 'Cancellation', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 },
                    //{ RId: 5, RName: 'OM', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 },
                    //{ RId: 6, RName: 'OM%', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 },
                    { RId: 7, RName: 'L2B - XML', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 },
                    { RId: 8, RName: 'L2B - Retail', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 },
                    { RId: 9, RName: 'Booking Error%', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 },
                    { RId: 10, RName: 'TTV(K)', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 }
                ];
            }
            else {
                var list = [
                    { RId: 1, RName: 'Bookings', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 },
                    { RId: 2, RName: 'CheckIn', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 },
                    { RId: 3, RName: 'RN', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 },
                    { RId: 4, RName: 'Cancellation', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 },
                    { RId: 5, RName: 'OM', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 },
                    { RId: 6, RName: 'OM%', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 },
                    { RId: 7, RName: 'L2B - XML', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 },
                    { RId: 8, RName: 'L2B - Retail', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 },
                    { RId: 9, RName: 'Booking Error%', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 },
                    { RId: 10, RName: 'TTV(K)', Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0, M_date: '', Summary: 0 }
                ];
            }
            $scope.MainResultlist3 = list.map(li => {
                return {
                    RName: li.RName,
                    Jan: Filter_Monthwise(data.datarows, li.RId, 1),
                    Feb: Filter_Monthwise(data.datarows, li.RId, 2),
                    Mar: Filter_Monthwise(data.datarows, li.RId, 3),
                    Apr: Filter_Monthwise(data.datarows, li.RId, 4),
                    May: Filter_Monthwise(data.datarows, li.RId, 5),
                    Jun: Filter_Monthwise(data.datarows, li.RId, 6),
                    Jul: Filter_Monthwise(data.datarows, li.RId, 7),
                    Aug: Filter_Monthwise(data.datarows, li.RId, 8),
                    Sep: Filter_Monthwise(data.datarows, li.RId, 9),
                    Oct: Filter_Monthwise(data.datarows, li.RId, 10),
                    Nov: Filter_Monthwise(data.datarows, li.RId, 11),
                    Dec: Filter_Monthwise(data.datarows, li.RId, 12),
                    M_date: Filter_Monthwise(data.datarows, li.RId, 13),
                    Summary: Filter_Monthwise(data.datarows, li.RId, 14),
                }
            });
            $scope.UpdatedDateOverview = $scope.MainResultlist3.length == 0 ? "" : $scope.MainResultlist3[0].M_date;
        });
    }


    function Filter_Monthwise(data, report, month) {
        var Count = 0;

        data.filter(d => {
            if (d[2] == report && d[1] == month && Count == 0) {
                if (report == 6 || report == 9) {
                    Count = (d[4] / d[5]).toFixed(2);
                }
                else {
                    Count = d[4];
                }
            }
            else if (month == 13) {//For Mdate
                Count = d[6];
            }
            else if (d[2] == report && month == 14 && Count == 0) { //For Summary
                data.forEach(x => {
                    if (x[2] == report) {
                        if (report == 6 || report == 9) {
                            var a = (x[4] / x[5])
                            Count += a;
                        }
                        else {
                            Count += x[4];
                        }
                    }
                })
                if (report == 6 || report == 9) {
                    var C_Year = new Date().getFullYear()
                    if ($scope.Year != C_Year) {
                        Count = (Count / 12).toFixed(2);
                    }
                    else {
                        const d = new Date();
                        let month = parseInt(d.getMonth()) + parseInt(1);
                        Count = (Count / month).toFixed(2);
                    }
                }
            }
        });

        return Count;
    }

    function GetSalesOverviewReport() {/*get*/

        const date = new Date();

        var myVariable = date;
        var makeDate = new Date(myVariable);
        makeDate = new Date(makeDate.setMonth(makeDate.getMonth() - 1));

        let monthno = makeDate.getMonth() + 1;
        let year = makeDate.getFullYear();
        const Month = GetMonth(monthno);

        const MonthName = GetMonthName(monthno);

        const FromDate = GetFromDate(Month);
        const ToDate = GetToDate(Month);


        var query = "";
        //if ($scope.Search == false) {
        //    if ($scope.LoginMemberTypeID == 1) {
        //        query = "select CName,Type,Market,TTV_K,Bgs,Can_Book,Can_Book_Per,RN,AVBV,OM_Per,Bk_Err_Per,M_date,SalePId FROM rpt_sales_overview_" + $scope.Year + "_bk order by Bgs desc LIMIT 0,5"
        //    }
        //    else if ($scope.LoginMemberTypeID == 2) {
        //        if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
        //            query = " select CName,Type,Market,TTV_K,Bgs,Can_Book,Can_Book_Per,RN,AVBV,OM_Per,Bk_Err_Per,M_date,SalePId FROM rpt_sales_overview_" + $scope.Year + "_bk where BrId =" + $scope.LoginBranchId + " and SalePId=" + $scope.IsSalePersonUserId + " order by Bgs desc LIMIT 0, 5"
        //        }
        //        else {
        //            query = " select CName,Type,Market,TTV_K,Bgs,Can_Book,Can_Book_Per,RN,AVBV,OM_Per,Bk_Err_Per,M_date,SalePId FROM rpt_sales_overview_" + $scope.Year + "_bk where BrId =" + $scope.LoginBranchId + "   order by Bgs desc LIMIT 0, 5"
        //        }
        //    }
        //}
        //else {
        //    query = " select CName,Type,Market,TTV_K,Bgs,Can_Book,Can_Book_Per,RN,AVBV,OM_Per,Bk_Err_Per,M_date,SalePId FROM rpt_sales_overview_" + $scope.Year + "_bk where BrId =" + $scope.SaleABranchId + " and SalePId=" + $scope.SalesAUserId + " order by Bgs desc LIMIT 0, 5"
        //}

        if ($scope.Search == false) {
            if ($scope.LoginMemberTypeID == 1) {
                query = "select CName,Type,Market,TTV_K,Bgs,Can_Book,RN,AVBV,TotalBookings,Bk_Err,CostofSupplier,TTV,M_date,SalePId FROM rpt_salesoverview_new_" + $scope.Year + "_bk_months order by Bgs desc LIMIT 0,5"
            }
            else if ($scope.LoginMemberTypeID == 2) {
                if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
                    query = " select CName,Type,Market,TTV_K,Bgs,Can_Book,RN,AVBV,TotalBookings,Bk_Err,CostofSupplier,TTV,M_date,SalePId FROM rpt_salesoverview_new_" + $scope.Year + "_bk_months where BrId =" + $scope.LoginBranchId + " and SalePId=" + $scope.IsSalePersonUserId + " order by Bgs desc LIMIT 0, 5"
                }
                else {
                    query = " select CName,Type,Market,TTV_K,Bgs,Can_Book,RN,AVBV,TotalBookings,Bk_Err,CostofSupplier,TTV,M_date,SalePId FROM rpt_salesoverview_new_" + $scope.Year + "_bk_months where BrId =" + $scope.LoginBranchId + "   order by Bgs desc LIMIT 0, 5"
                }
            }
        }
        else {
            query = " select CName,Type,Market,TTV_K,Bgs,Can_Book,RN,AVBV,TotalBookings,Bk_Err,CostofSupplier,TTV,M_date,SalePId FROM rpt_salesoverview_new_" + $scope.Year + "_bk_months where BrId =" + $scope.SaleABranchId + " and SalePId=" + $scope.SalesAUserId + " order by Bgs desc LIMIT 0, 5"
        }

        var ReportName = " Sales OverView Report";
        var settings = {
            "url": "https://osearch.xconnect.in/_opendistro/_sql",
            "method": "POST",
            "async": false,
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                query: query
            }),
        };
        var _Solution = [];
        $.ajax(settings).done(function (data) {
            var results = data['datarows'];
            _Solution = results;
            $scope.MainResultlistSalesOverview = results.map(
                c => {
                    return {
                        'CName': (c[0]),
                        'Type': (c[1]),
                        'Market': (c[2]),
                        'TTV_K': (c[3]).toFixed(2),
                        'Bgs': (c[4]),
                        'CXL': (c[5]),
                        'CXL_Per': ((c[5] / c[8]) * 100).toFixed(2),
                        'RN': (c[6]),
                        'AVBV': (c[4] == 0 ? 0.00 : c[7] / c[4]).toFixed(2),
                        'OM_Per': (c[11] == 0 ? (((c[10] - 1) / 1) * 100) : (((c[10] - c[11]) / c[11]) * 100)).toFixed(2),
                        'Bk_Err_Per': ((c[9] / c[8]) * 100).toFixed(2),
                        'M_date': (c[12]),
                    }
                }
            );
            if ($scope.MainResultlistSalesOverview.length > 0) {
                $.each($scope.MainResultlistSalesOverview, function (i, item) {
                    if (i == 0) {
                        //  $("#SalesOverviewReport").html('');
                        if ($scope.Search == false) {
                            if ($scope.LoginMemberTypeID == 1) {
                                added_row = ' <thead class="main-head hidden-xs" id="theaddiv1"><tr><th>Client Name</th><th>Type</th><th>Market</th><th style="text-align:right;">TTV(K)</th><th style="text-align:right;" title="Reconfirm Bookings" >BKG</th><th title="Cancellation" style="text-align:right;">CXL</th><th title="Cancellation Percentage" style="text-align:right;">CXL%</th><th title="Room Nights" style="text-align:right;">RN</th><th style="text-align:right;">AVBV</th><th title="Oprating Margine" style="text-align:right;" ng-if="LoginMemberTypeID==1">OM %</th><th style="text-align:right;">Booking Error %</th></tr</thead>';
                            }
                            else {
                                added_row = ' <thead class="main-head hidden-xs" id="theaddiv1"><tr><th>Client Name</th><th>Type</th><th>Market</th><th style="text-align:right;">TTV(K)</th><th style="text-align:right;" title="Reconfirm Bookings">BKG</th><th title="Cancellation" style="text-align:right;">CXL</th><th title="Cancellation Percentage" style="text-align:right;">CXL%</th><th title="Room Nights" style="text-align:right;">RN</th><th style="text-align:right;">AVBV</th><th style="text-align:right;">Booking Error %</th></tr</thead>';
                            }
                        }
                        else {
                            added_row = ' <thead class="main-head hidden-xs" id="theaddiv1"><tr><th>Client Name</th><th>Type</th><th>Market</th><th style="text-align:right;">TTV(K)</th><th style="text-align:right;" title="Reconfirm Bookings">BKG</th><th title="Cancellation" style="text-align:right;">CXL</th><th title="Cancellation Percentage" style="text-align:right;">CXL%</th><th title="Room Nights" style="text-align:right;">RN</th><th style="text-align:right;">AVBV</th><th style="text-align:right;">Booking Error %</th></tr</thead>';
                        }
                        added_row += '<tbody class="hsrr-tbody-main">';
                        $scope.Date = item.M_date;
                    }
                    if ($scope.Search == false) {
                        if ($scope.LoginMemberTypeID == 1) {
                            added_row += '<tr>'
                                + '<td>' + item.CName + '</td>'
                                + '<td>' + item.Type + '</td>'
                                + '<td>' + item.Market + '</td>'
                                + '<td style="text-align:right;">' + item.TTV_K + '</td>'
                                + '<td style="text-align:right;">' + item.Bgs + '</td>'
                                + '<td style="text-align:right;">' + item.CXL + '</td>'
                                + '<td style="text-align:right;">' + item.CXL_Per + '</td>'
                                + '<td style="text-align:right;">' + item.RN + '</td>'
                                + '<td style="text-align:right;">' + item.AVBV + '</td>'
                                + '<td style="text-align:right;">' + item.OM_Per + '</td>'
                                + '<td style="text-align:right;">' + item.Bk_Err_Per + '</td>'
                                + '</tr>';
                        }
                        else {
                            added_row += '<tr>'
                                + '<td>' + item.CName + '</td>'
                                + '<td>' + item.Type + '</td>'
                                + '<td>' + item.Market + '</td>'
                                + '<td style="text-align:right;">' + item.TTV_K + '</td>'
                                + '<td style="text-align:right;">' + item.Bgs + '</td>'
                                + '<td style="text-align:right;">' + item.CXL + '</td>'
                                + '<td style="text-align:right;">' + item.CXL_Per + '</td>'
                                + '<td style="text-align:right;">' + item.RN + '</td>'
                                + '<td style="text-align:right;">' + item.AVBV + '</td>'
                                + '<td style="text-align:right;">' + item.Bk_Err_Per + '</td>'
                                + '</tr>';
                        }
                    }
                    else {
                        added_row += '<tr>'
                            + '<td>' + item.CName + '</td>'
                            + '<td>' + item.Type + '</td>'
                            + '<td>' + item.Market + '</td>'
                            + '<td style="text-align:right;">' + item.TTV_K + '</td>'
                            + '<td style="text-align:right;">' + item.Bgs + '</td>'
                            + '<td style="text-align:right;">' + item.CXL + '</td>'
                            + '<td style="text-align:right;">' + item.CXL_Per + '</td>'
                            + '<td style="text-align:right;">' + item.RN + '</td>'
                            + '<td style="text-align:right;">' + item.AVBV + '</td>'
                            + '<td style="text-align:right;">' + item.Bk_Err_Per + '</td>'
                            + '</tr>';
                    }
                });
                added_row += '</tbody>';
                $("#SalesOverviewReport").append(added_row);
                $("#SALESOVERVIEWPopup").css("display", "none");
                $("#SaleOverdate").append('Last Updated Date : ' + $scope.Date);
                $("#SaleOverMonth").append('Top Results of ' + MonthName + " " + year);
            }
            else {
                $("#SALESOVERVIEWPopup").css("display", "none");
            }
        });
    }
    //salesper
    function GetHotelSalesReport() {

        const date = new Date();

        var myVariable = date;
        var makeDate = new Date(myVariable);
        makeDate = new Date(makeDate.setMonth(makeDate.getMonth() - 1));

        let monthno = makeDate.getMonth() + 1;
        let year = makeDate.getFullYear();
        const Month = GetMonth(monthno);

        const MonthName = GetMonthName(monthno);

        const FromDate = GetFromDate(Month);
        const ToDate = GetToDate(Month);


        var ReportName = " Hotel Sales Report";
        var query = "";
        //if ($scope.Search == false) {
        //    if ($scope.LoginMemberTypeID == 1) {
        //        query = "SELECT HName, Dest, SUM(RN) as Rn, SUM(Bgs) as BKG, SUM(NoOfSearch) as NoOfSearch, SUM(TTV) as TTVK, M_date FROM rpt_sales_hotels_" + $scope.Year + "_bk GROUP BY HName, Dest, M_date order by BKG desc LIMIT 0, 5"
        //    }
        //    else if ($scope.LoginMemberTypeID == 2) {
        //        if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
        //            query = "SELECT HName, Dest, SUM(RN) as Rn, SUM(Bgs) as BKG, SUM(NoOfSearch) as NoOfSearch, SUM(TTV) as TTVK, M_date,BrId,Saleperson FROM rpt_sales_hotels_" + $scope.Year + "_bk WHERE BrId=" + $scope.LoginBranchId + " and  Saleperson = " + $scope.IsSalePersonUserId + " GROUP BY HName, Dest, M_date,BrId,Saleperson order by BKG desc LIMIT 0, 5"
        //        }
        //        else {
        //            query = "SELECT HName, Dest, SUM(RN) as Rn, SUM(Bgs) as BKG, SUM(NoOfSearch) as NoOfSearch, SUM(TTV) as TTVK, M_date FROM rpt_sales_hotels_" + $scope.Year + "_bk WHERE BrId=" + $scope.LoginBranchId + "  GROUP BY HName, Dest, M_date,BrId order by BKG desc LIMIT 0, 5"
        //        }
        //    }
        //}
        //else {
        //    query = "SELECT HName, Dest, SUM(RN) as Rn, SUM(Bgs) as BKG, SUM(NoOfSearch) as NoOfSearch, SUM(TTV) as TTVK, M_date,BrId,Saleperson FROM rpt_sales_hotels_" + $scope.Year + "_bk WHERE BrId=" + $scope.SaleABranchId + " and  Saleperson = " + $scope.SalesAUserId + " GROUP BY HName, Dest, M_date,BrId,Saleperson order by BKG desc LIMIT 0, 5"
        //}
        if ($scope.Search == false) {
            if ($scope.LoginMemberTypeID == 1) {
                query = "SELECT HName, Dest, RN as Rn, Bgs as BKG, NoOfSearch as NoOfSearch, TTV as TTVK, M_date FROM rpt_sales_hotels_new_" + $scope.Year + "_bk_months  order by BKG desc LIMIT 0, 5"
            }
            else if ($scope.LoginMemberTypeID == 2) {
                if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
                    query = "SELECT HName, Dest, RN as Rn, Bgs as BKG, NoOfSearch as NoOfSearch, TTV as TTVK, M_date,BrId,Saleperson FROM rpt_sales_hotels_new_" + $scope.Year + "_bk_months_sp WHERE BrId=" + $scope.LoginBranchId + " and  Saleperson = " + $scope.IsSalePersonUserId + "  order by BKG desc LIMIT 0, 5"
                }
                else {
                    query = "SELECT HName, Dest, RN as Rn, Bgs as BKG, NoOfSearch as NoOfSearch, TTV as TTVK, M_date FROM rpt_sales_hotels_new_" + $scope.Year + "_bk_months_br WHERE BrId=" + $scope.LoginBranchId + "   order by BKG desc LIMIT 0, 5"
                }
            }
        }
        else {
            query = "SELECT HName, Dest, RN as Rn, Bgs as BKG, NoOfSearch as NoOfSearch, TTV as TTVK, M_date,BrId,Saleperson FROM rpt_sales_hotels_new_" + $scope.Year + "_bk_months_sp WHERE BrId=" + $scope.SaleABranchId + " and  Saleperson = " + $scope.SalesAUserId + "  order by BKG desc LIMIT 0, 5"
        }
        var settings = {
            "url": "https://osearch.xconnect.in/_opendistro/_sql",
            "method": "POST",
            "async": false,
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "query": query
            }),
        };
        var _Solution = [];
        $.ajax(settings).done(function (data) {
            var results = data['datarows'];
            _Solution = results;
            $scope.MainResultlistHSales = results.map(
                c => {
                    return {
                        //sum(SellAmount)/ (case when sum(Bgs) = 0 then cast(1 as long) else sum(Bgs) end) as ABV

                        'HName': (c[0]),
                        'Dest': (c[1]),
                        'RN': (c[2]),
                        'Bgs': (c[3]),
                        'ABV': (c[3]) == 0 ? 0 : ((c[5]) / (c[3])).toFixed(2),
                        'LOS': (c[3]) == 0 ? 0 : ((c[2]) / (c[3])).toFixed(2),
                        'L2B': (c[3]) == 0 ? 0 : ((c[4]) / (c[3])).toFixed(2),
                        'M_date': (c[6]),

                    }
                }
            );
            if ($scope.MainResultlistHSales.length > 0) {
                $.each($scope.MainResultlistHSales, function (i, item) {
                    if (i == 0) {
                        //  $("#SalesOverviewReport").html('');
                        added_row = '<thead class="main-head hidden-xs"><tr><th>Hotel Name</th><th>Destination</th><th title="Room Nights" style="text-align:right;">RN</th><th title="Reconfirm Bookings" style="text-align:right;">BKG</th><th title="Average Booking Value" style="text-align:right;">ABV</th><th style="text-align:right;">LOS</th><th style="text-align:right;">L2B</th></tr></thead>';
                        added_row += '<tbody class="hsrr-tbody-main">';
                        $scope.Date = item.M_date;
                    }
                    added_row += '<tr>'
                        + '<td>' + item.HName + '</td>'
                        + '<td>' + item.Dest + '</td>'
                        + '<td style="text-align:right;">' + item.RN + '</td>'
                        + '<td style="text-align:right;">' + item.Bgs + '</td>'
                        + '<td style="text-align:right;">' + item.ABV + '</td>'
                        + '<td style="text-align:right;">' + item.LOS + '</td>'
                        + '<td style="text-align:right;">' + item.L2B + '</td>'
                        + '</tr>';
                });
                added_row += '</tbody>';
                $("#HotelSalesReport").append(added_row);
                $("#SELLINGHOTELPopUp").css("display", "none");
                $("#SaleHoteldate").append('Last Updated Date : ' + $scope.Date);
                $("#SaleHotelmonth").append('Top Results of ' + MonthName + " " + year);
                $scope.UpadateSaleHoteldate = $scope.MainResultlistHSales.length == 0 ? "" : $scope.MainResultlistHSales[0].M_date;

            }
            else {
                $("#SELLINGHOTELPopUp").css("display", "none");
            }
        });
    }

    function GetSalesDestinationReport() {

        const date = new Date();

        var myVariable = date;
        var makeDate = new Date(myVariable);
        makeDate = new Date(makeDate.setMonth(makeDate.getMonth() - 1));

        let monthno = makeDate.getMonth() + 1;
        let year = makeDate.getFullYear();
        const Month = GetMonth(monthno);

        const MonthName = GetMonthName(monthno);

        const FromDate = GetFromDate(Month);
        const ToDate = GetToDate(Month);

        var query = "";
        //if ($scope.Search == false) {
        //    if ($scope.LoginMemberTypeID == 1) {
        //        query = "SELECT Dest,sum(RN) as RN, sum(Bgs) as BKG, sum(SellAmount)/ (case when sum(Bgs)=0 then cast(1 as long) else sum(Bgs) end)  as ABV, sum(RN)/ (case when sum(Bgs)=0 then cast(1 as long) else sum(Bgs) end)  as LoS, sum(NoOfSearch)/ (case when sum(Bgs)=0 then cast(1 as long) else sum(Bgs) end)  as L2B,M_date  from rpt_sales_destinations_" + $scope.Year + "_bk GROUP by Dest,M_date order by BKG Desc LIMIT 0,5"
        //    }
        //    else if ($scope.LoginMemberTypeID == 2) {
        //        if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
        //            query = "SELECT Dest,sum(RN) as RN, sum(Bgs)  as BKG, sum(SellAmount)/(case when sum(Bgs)=0 then cast(1 as long) else sum(Bgs)end )  as ABV, sum(RN)/ (case when sum(Bgs)=0 then cast(1 as long) else sum(Bgs) end)  as LoS, sum(NoOfSearch)/ (case when sum(Bgs)=0 then cast(1 as long) else sum(Bgs) end)  as L2B,M_date,Saleperson  from rpt_sales_destinations_" + $scope.Year + "_bk where BrId=" + $scope.LoginBranchId + " and Saleperson = " + $scope.IsSalePersonUserId + " GROUP by Dest,M_date order by BKG Desc LIMIT 0,5"
        //        }
        //        else {
        //            query = "SELECT Dest,sum(RN) as RN, sum(Bgs) as BKG, sum(SellAmount)/ (case when sum(Bgs)=0 then cast(1 as long) else sum(Bgs) end) as ABV, sum(RN)/ (case when sum(Bgs)=0 then cast(1 as long) else sum(Bgs) end) as LoS, sum(NoOfSearch)/ (case when sum(Bgs)=0 then cast(1 as long) else sum(Bgs) end) as L2B,M_date  from rpt_sales_destinations_" + $scope.Year + "_bk where BrId=" + $scope.LoginBranchId + " GROUP by Dest,M_date order by BKG Desc LIMIT 0,5"
        //        }
        //    }
        //}
        //else {
        //    query = "SELECT Dest,sum(RN) as RN, sum(Bgs)  as BKG, sum(SellAmount)/(case when sum(Bgs)=0 then cast(1 as long) else sum(Bgs)end )  as ABV, sum(RN)/ (case when sum(Bgs)=0 then cast(1 as long) else sum(Bgs) end)  as LoS, sum(NoOfSearch)/ (case when sum(Bgs)=0 then cast(1 as long) else sum(Bgs) end)  as L2B,M_date,Saleperson  from rpt_sales_destinations_" + $scope.Year + "_bk where BrId=" + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + " GROUP by Dest,M_date order by BKG Desc LIMIT 0,5"
        //}

        if ($scope.Search == false) {
            if ($scope.LoginMemberTypeID == 1) {
                query = "SELECT Dest,RN as RN, Bgs as BKG, SellAmount/ (case when Bgs=0 then cast(1 as long) else Bgs end)  as ABV, RN/ (case when Bgs=0 then cast(1 as long) else Bgs end)  as LoS, NoOfSearch/ (case when Bgs=0 then cast(1 as long) else Bgs end)  as L2B,M_date  from rpt_sales_destinations_new_" + $scope.Year + "_bk_months  order by BKG Desc LIMIT 0,5"
            }
            else if ($scope.LoginMemberTypeID == 2) {
                if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
                    query = "SELECT Dest,RN as RN, Bgs as BKG, SellAmount/ (case when Bgs=0 then cast(1 as long) else Bgs end)  as ABV, RN/ (case when Bgs=0 then cast(1 as long) else Bgs end)  as LoS, NoOfSearch/ (case when Bgs=0 then cast(1 as long) else Bgs end)  as L2B,M_date,Saleperson  from rpt_sales_destinations_new_" + $scope.Year + "_bk_months_sp where BrId=" + $scope.LoginBranchId + " and Saleperson = " + $scope.IsSalePersonUserId + "  order by BKG Desc LIMIT 0,5"
                }
                else {
                    query = "SELECT Dest,RN as RN, Bgs as BKG, SellAmount/ (case when Bgs=0 then cast(1 as long) else Bgs end)  as ABV, RN/ (case when Bgs=0 then cast(1 as long) else Bgs end)  as LoS, NoOfSearch/ (case when Bgs=0 then cast(1 as long) else Bgs end)  as L2B,M_date  from rpt_sales_destinations_new_" + $scope.Year + "_bk_months_br where BrId=" + $scope.LoginBranchId + "  order by BKG Desc LIMIT 0,5"
                }
            }
        }
        else {
            query = "SELECT Dest,RN as RN, Bgs as BKG, SellAmount/ (case when Bgs=0 then cast(1 as long) else Bgs end)  as ABV, RN/ (case when Bgs=0 then cast(1 as long) else Bgs end)  as LoS, NoOfSearch/ (case when Bgs=0 then cast(1 as long) else Bgs end)  as L2B,M_date,Saleperson  from rpt_sales_destinations_new_" + $scope.Year + "_bk_months_sp where BrId=" + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + " order by BKG Desc LIMIT 0,5"
        }
        var ReportName = "Sales Destination Report";
        var settings = {
            "url": "https://osearch.xconnect.in/_opendistro/_sql",
            "method": "POST",
            "async": false,
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "query": query //"SELECT * from rpt_sales_destinations_" + $scope.Year + "_bk order by Bgs desc LIMIT 0,5"
            }),
        };
        var _Solution = [];
        $.ajax(settings).done(function (data) {
            var results = data['datarows'];
            _Solution = results;
            $scope.MainResultlistSalesDest = results.map(
                c => {
                    return {
                        'Dest': (c[0]),
                        'RN': (c[1]),
                        'Bgs': (c[2]),
                        'ABV': (c[3]).toFixed(2),
                        'LOS': (c[4]),
                        'L2B': (c[5]),
                        'M_date': (c[6])
                    }
                }
            );
            if ($scope.MainResultlistSalesDest.length > 0) {
                $.each($scope.MainResultlistSalesDest, function (i, item) {
                    if (i == 0) {
                        added_row = '<thead class="main-head hidden-xs"><tr><th>Destination</th><th title="Room Nights" style="text-align:right;">RN</th><th title="Reconfirm Bookings" style="text-align:right;" >BKG</th><th title="Average Booking Value" style="text-align:right;">ABV</th><th style="text-align:right;">LOS</th><th style="text-align:right;">L2B</th></tr></thead>';
                        added_row += '<tbody class="hsrr-tbody-main">';
                        $scope.Date = item.M_date;
                    }
                    added_row += '<tr>'
                        + '<td>' + item.Dest + '</td>'
                        + '<td style="text-align:right;">' + item.RN + '</td>'
                        + '<td style="text-align:right;">' + item.Bgs + '</td>'
                        + '<td style="text-align:right;">' + item.ABV + '</td>'
                        + '<td style="text-align:right;">' + item.LOS + '</td>'
                        + '<td style="text-align:right;">' + item.L2B + '</td>'
                        + '</tr>';
                });
                added_row += '</tbody>';
                $("#DestinationSaleReport").append(added_row);
                $("#DestinationSaleReportPopUp").css("display", "none");
                $("#SaleDestidate").append('Last Updated Date : ' + $scope.Date);
                $("#SaleDestimonth").append('Top Results of ' + MonthName + " " + year);
                $scope.UpdatedSaleDestDate = $scope.MainResultlistSalesDest.length == 0 ? "" : $scope.MainResultlistSalesDest[0].M_date;
            }
            else {
                $("#DestinationSaleReportPopUp").css("display", "none");
            }
        });
    }
    //salesper
    function GetSupplierVsClients() {//

        // Modified by Vinayak on 11.10.2024
        const date = new Date();

        var myVariable = date;
        var makeDate = new Date(myVariable);
        makeDate = new Date(makeDate.setMonth(makeDate.getMonth() - 1));

        let monthno = makeDate.getMonth() + 1;
        let year = makeDate.getFullYear();
        const Month = GetMonth(monthno);

        const MonthName = GetMonthName(monthno);

        const FromDate = GetFromDate(Month);
        const ToDate = GetToDate(Month);

       



        var ReportName = "Sales Supplier Vs Clients Report";
        if ($scope.Search == false) {
            if ($scope.LoginMemberTypeID == 1) {
                query = "SELECT SupplierName, ClientName, Market, Owner, TTV_K,Bookings, RN, AVBV,CXL, L2B, M_date,Bk_Err , CostofSupplier, TRRBookings, TTV  FROM rpt_suppliervsclients_new_" + $scope.Year + "_bk_months   order by Bookings desc LIMIT 0, 5"
            }
            else if ($scope.LoginMemberTypeID == 2) {
                if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
                    query = "SELECT  SupplierName, ClientName, Market, Owner, TTV_K,Bookings, RN, AVBV,CXL, L2B, M_date,Bk_Err , CostofSupplier, TRRBookings, TTV ,BrId,Saleperson FROM rpt_suppliervsclients_new_" + $scope.Year + "_bk_months_sp where BrId=" + $scope.LoginBranchId + " and Saleperson = " + $scope.IsSalePersonUserId + "  order by Bookings desc LIMIT 0, 5"
                }
                else {
                    query = "SELECT  SupplierName, ClientName, Market, Owner, TTV_K,Bookings, RN, AVBV,CXL, L2B, M_date,Bk_Err , CostofSupplier, TRRBookings, TTV ,BrId FROM rpt_suppliervsclients_new_" + $scope.Year + "_bk_months_br  where BrId=" + $scope.LoginBranchId + "   order by Bookings desc LIMIT 0, 5"
                }
            }
        }
        else {
            query = "SELECT SupplierName, ClientName, Market, Owner, TTV_K,Bookings, RN, AVBV,CXL, L2B, M_date,Bk_Err , CostofSupplier, TRRBookings, TTV ,BrId,Saleperson FROM rpt_suppliervsclients_new_" + $scope.Year + "_bk_months_sp where BrId=" + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + "   order by Bookings desc LIMIT 0, 5"
        }
        var settings = {
            "url": "https://osearch.xconnect.in/_opendistro/_sql",
            "method": "POST",
            "async": false,
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "query": query
            }),
        };
        var _Solution = [];
        $.ajax(settings).done(function (data) {

            var results = data['datarows'];
            _Solution = results;
            $scope.MainResultlistSuppVsClient = results.map(
                c => {
                    return {
                        'SupplierName': (c[0]),
                        'ClientName': (c[1]),
                        'Market': (c[2]),
                        'Owner': (c[3]),
                        'TTV_K': (c[4]).toFixed(2),
                        'Bookings': (c[5]),
                        'RN': (c[6]),
                        'AVBV': (c[7] / c[5]).toFixed(2),
                        'OM_Per': c[14] == 0 ? (((c[12] - 1) / 1) * 100).toFixed(2) : (((c[12] - c[14]) / c[14]) * 100).toFixed(2),
                        'CXL': (c[8]),
                        'CXL_Per': ((c[8]/c[13])*100).toFixed(2),
                        'Bk_Err_Per': ((c[11] / c[13]) * 100).toFixed(2),
                        'L2B': (c[9]),
                        'M_date': (c[10]),
                    }
                }
            );
            if ($scope.MainResultlistSuppVsClient.length > 0) {
                $.each($scope.MainResultlistSuppVsClient, function (i, item) {
                    if (i == 0) {
                        //  $("#SalesOverviewReport").html('');
                        if ($scope.Search == false) {
                            if ($scope.LoginMemberTypeID == 1) {
                                added_row = '<thead class="main-head hidden-xs" id="theaddiv1"><tr><th>Suppliers Name</th><th>Client Name</th><th>Market</th><th title="Key Account Manager">KAM</th><th style="text-align:right;">TTV(K)</th><th title="Reconfirm Bookings" style="text-align:right;" >BKG</th><th title="Room Nights" style="text-align:right;">RN</th><th style="text-align:right;">AVBV</th><th title="Operating Margine Percentage" style="text-align:right;" ng-if="LoginMemberTypeID==1">OM %</th><th title="Cancellation" style="text-align:right;">CXL</th><th title="Cancellation Percentage" style="text-align:right;">CXL %</th><th style="text-align:right;">Booking Error %</th><th style="text-align:right;">L2B</th></tr></thead>';
                            } else {
                                added_row = '<thead class="main-head hidden-xs" id="theaddiv1"><tr><th>Suppliers Name</th><th>Client Name</th><th>Market</th><th title="Key Account Manager">KAM</th><th style="text-align:right;">TTV(K)</th><th title="Reconfirm Bookings" style="text-align:right;" >BKG</th><th title="Room Nights" style="text-align:right;">RN</th><th style="text-align:right;">AVBV</th><th title="Cancellation" style="text-align:right;">CXL</th><th title="Cancellation Percentage" style="text-align:right;">CXL %</th><th style="text-align:right;">Booking Error %</th><th style="text-align:right;">L2B</th></tr></thead>';
                            }
                        }
                        else {
                            added_row = '<thead class="main-head hidden-xs" id="theaddiv1"><tr><th>Suppliers Name</th><th>Client Name</th><th>Market</th><th title="Key Account Manager">KAM</th><th style="text-align:right;">TTV(K)</th><th title="Reconfirm Bookings" style="text-align:right;" >BKG</th><th title="Room Nights" style="text-align:right;">RN</th><th style="text-align:right;">AVBV</th><th title="Cancellation" style="text-align:right;">CXL</th><th title="Cancellation Percentage" style="text-align:right;">CXL %</th><th style="text-align:right;">Booking Error %</th><th style="text-align:right;">L2B</th></tr></thead>';
                        }
                        added_row += '<tbody class="hsrr-tbody-main">';
                        $scope.Date = item.M_date;
                    }
                    if ($scope.Search == false) {
                        if ($scope.LoginMemberTypeID == 1) {
                            added_row += '<tr>'
                                + '<td>' + item.SupplierName + '</td>'
                                + '<td>' + item.ClientName + '</td>'
                                + '<td>' + item.Market + '</td>'
                                + '<td>' + item.Owner + '</td>'
                                + '<td style="text-align:right;">' + item.TTV_K + '</td>'
                                + '<td style="text-align:right;">' + item.Bookings + '</td>'
                                + '<td style="text-align:right;">' + item.RN + '</td>'
                                + '<td style="text-align:right;">' + item.AVBV + '</td>'
                                + '<td style="text-align:right;">' + item.OM_Per + '</td>'
                                + '<td style="text-align:right;">' + item.CXL + '</td>'
                                + '<td style="text-align:right;">' + item.CXL_Per + '</td>'
                                + '<td style="text-align:right;">' + item.Bk_Err_Per + '</td>'
                                + '<td style="text-align:right;">' + item.L2B + '</td>'
                                + '</tr>';
                        } else {
                            added_row += '<tr>'
                                + '<td>' + item.SupplierName + '</td>'
                                + '<td>' + item.ClientName + '</td>'
                                + '<td>' + item.Market + '</td>'
                                + '<td>' + item.Owner + '</td>'
                                + '<td style="text-align:right;">' + item.TTV_K + '</td>'
                                + '<td style="text-align:right;">' + item.Bookings + '</td>'
                                + '<td style="text-align:right;">' + item.RN + '</td>'
                                + '<td style="text-align:right;">' + item.AVBV + '</td>'
                                + '<td style="text-align:right;">' + item.CXL + '</td>'
                                + '<td style="text-align:right;">' + item.CXL_Per + '</td>'
                                + '<td style="text-align:right;">' + item.Bk_Err_Per + '</td>'
                                + '<td style="text-align:right;">' + item.L2B + '</td>'
                                + '</tr>';
                        }
                    }
                    else {
                        added_row += '<tr>'
                            + '<td>' + item.SupplierName + '</td>'
                            + '<td>' + item.ClientName + '</td>'
                            + '<td>' + item.Market + '</td>'
                            + '<td>' + item.Owner + '</td>'
                            + '<td style="text-align:right;">' + item.TTV_K + '</td>'
                            + '<td style="text-align:right;">' + item.Bookings + '</td>'
                            + '<td style="text-align:right;">' + item.RN + '</td>'
                            + '<td style="text-align:right;">' + item.AVBV + '</td>'
                            + '<td style="text-align:right;">' + item.CXL + '</td>'
                            + '<td style="text-align:right;">' + item.CXL_Per + '</td>'
                            + '<td style="text-align:right;">' + item.Bk_Err_Per + '</td>'
                            + '<td style="text-align:right;">' + item.L2B + '</td>'
                            + '</tr>';
                    }
                });
                added_row += '</tbody>';
                $("#SuppVsClientReport").append(added_row);
                $("#SuppVsClientReportPopup").css("display", "none");
                $("#SuppVsClientdate").append('Last Updated Date : ' + $scope.Date);
                $("#SuppVsClientmonth").append('Top Results of ' + MonthName + " " + year);
                $scope.UpadateSuppVClient = $scope.MainResultlistSuppVsClient.length == 0 ? "" : $scope.MainResultlistSuppVsClient[0].M_date
            }
            else {
                $("#SuppVsClientReportPopup").css("display", "none");
            }
        });
    }



    function GetLMVsEarlyBookingClient() {

        const date = new Date();

        var myVariable = date;
        var makeDate = new Date(myVariable);
        makeDate = new Date(makeDate.setMonth(makeDate.getMonth() - 1));

        let monthno = makeDate.getMonth() + 1;
        let year = makeDate.getFullYear();
        const Month = GetMonth(monthno);

        const MonthName = GetMonthName(monthno);

        const FromDate = GetFromDate(Month);
        const ToDate = GetToDate(Month);

        var query = "";
        if ($scope.Search == false) {
            if ($scope.LoginMemberTypeID == 1) {
                query = " select C_ID, BrId,ClientName,Type,Market,Owner,LM as LM ,SevToThirty as SevToThirty ,ThirtyPlus as ThirtyPlus, T_bookings as Tbookings, M_date from rpt_early_book_clients_new_" + $scope.Year + "_bk_months   order by Tbookings desc LIMIT 0,5"
            }
            else if ($scope.LoginMemberTypeID == 2) {
                if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
                    query = " select C_ID, BrId,ClientName,Type,Market,Owner,LM as LM ,SevToThirty as SevToThirty ,ThirtyPlus as ThirtyPlus, T_bookings as Tbookings, M_date,Saleperson from rpt_early_book_clients_new_" + $scope.Year + "_bk_months_sp where BrId=" + $scope.LoginBranchId + " and Saleperson = " + $scope.IsSalePersonUserId + "  order by Tbookings desc LIMIT 0,5"
                }
                else {
                    query = "select C_ID, BrId,ClientName,Type,Market,Owner,LM as LM ,SevToThirty as SevToThirty ,ThirtyPlus as ThirtyPlus, T_bookings as Tbookings, M_date from rpt_early_book_clients_new_" + $scope.Year + "_bk_months_br where BrId=" + $scope.LoginBranchId + "  order by Tbookings desc LIMIT 0,5"
                }
            }
        }
        else {
            query = " select C_ID, BrId,ClientName,Type,Market,Owner,LM as LM ,SevToThirty as SevToThirty ,ThirtyPlus as ThirtyPlus, T_bookings as Tbookings, M_date,Saleperson from rpt_early_book_clients_new_" + $scope.Year + "_bk_months_sp where BrId=" + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + "  order by Tbookings desc LIMIT 0,5"
        }

        var ReportName = "LM Vs Early Booking Client Report";
        var settings = {
            "url": "https://osearch.xconnect.in/_opendistro/_sql",
            "method": "POST",
            "async": false,
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "query": query
            }),
        };
        var _Solution = [];
        $.ajax(settings).done(function (data) {
            var results = data['datarows'];
            _Solution = results;
            $scope.MainResultlistLMvsEarlyBookingClient = results.map(
                c => {
                    return {
                        'ClientName': (c[2]),
                        'Type': (c[3]),
                        'Market': (c[4]),
                        'Owner': (c[5]),
                        'T_bookings': (c[9]),
                        'LM': (c[9]) == 0 ? 0 : ((c[6]) / (c[9]) * 100).toFixed(2),
                        'SevToThirty': (c[9]) == 0 ? 0 : ((c[7]) / (c[9]) * 100).toFixed(2),
                        'ThirtyPlus': (c[9]) == 0 ? 0 : ((c[8]) / (c[9]) * 100).toFixed(2),
                        'M_date': (c[10]),
                    }
                }
            );
            if ($scope.MainResultlistLMvsEarlyBookingClient.length > 0) {
                $.each($scope.MainResultlistLMvsEarlyBookingClient, function (i, item) {
                    if (i == 0) {
                        //  $("#SalesOverviewReport").html('');
                        added_row = '<thead class="main-head hidden-xs"><tr><th>Client Name</th><th>Type</th><th>Market</th><th title="Key Account Manager">KAM</th><th style="text-align:right;" title="Reconfirm Bookings">BKG</th><th style="text-align:right;">LM %</th><th style="text-align:right;">7To30 %</th><th style="text-align:right;">+30 %</th></tr></thead>';
                        added_row += '<tbody class="hsrr-tbody-main">';
                        $scope.Date = item.M_date;
                    }
                    added_row += '<tr>'
                        + '<td>' + item.ClientName + '</td>'
                        + '<td>' + item.Type + '</td>'
                        + '<td>' + item.Market + '</td>'
                        + '<td>' + item.Owner + '</td>'
                        + '<td style="text-align:right;">' + item.T_bookings + '</td>'
                        + '<td style="text-align:right;">' + item.LM + '</td>'
                        + '<td style="text-align:right;">' + item.SevToThirty + '</td>'
                        + '<td style="text-align:right;">' + item.ThirtyPlus + '</td>'
                        + '</tr>';
                });
                added_row += '</tbody>';
                $("#LMVSEARLYReport").append(added_row);
                $("#LMVSEARLYBOOKINGPopup").css("display", "none");
                $("#LmVsEarlyBCDate").append('Last Updated Date : ' + $scope.Date);
                $("#LmVsEarlyBCMonth").append('Top Results of ' + MonthName + " " + year);

                $scope.UpdatedDateLMClient = $scope.MainResultlistLMvsEarlyBookingClient.length == 0 ? "" : $scope.MainResultlistLMvsEarlyBookingClient[0].M_date;
            }
            else {
                $("#LMVSEARLYBOOKINGPopup").css("display", "none");
            }
        });
    }

    function GetLMVsEarlyBookingSupplier() {

        const date = new Date();

        var myVariable = date;
        var makeDate = new Date(myVariable);
        makeDate = new Date(makeDate.setMonth(makeDate.getMonth() - 1));

        let monthno = makeDate.getMonth() + 1;
        let year = makeDate.getFullYear();
        const Month = GetMonth(monthno);

        const MonthName = GetMonthName(monthno);

        const FromDate = GetFromDate(Month);
        const ToDate = GetToDate(Month);

        var query = "";
        //if ($scope.Search == false) {
        //    if ($scope.LoginMemberTypeID == 1) {
        //        query = "select  SupplierName, Type, sum(LM) as LM, sum(SevToThirty) as SevToThirty, sum(ThirtyPlus) as ThirtyPlus, sum(T_bookings) as Tbookings,M_date ,Supp_Id from rpt_early_book_suppliers_" + $scope.Year + "_bk group by SupplierName, Type,Supp_Id,M_date  order by Tbookings desc LIMIT 0,5"
        //    }
        //    else if ($scope.LoginMemberTypeID == 2) {
        //        if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
        //            query = "select  SupplierName, Type, sum(LM) as LM, sum(SevToThirty) as SevToThirty, sum(ThirtyPlus) as ThirtyPlus, sum(T_bookings) as Tbookings, M_date,Supp_Id from rpt_early_book_suppliers_" + $scope.Year + "_bk where BrId=" + $scope.LoginBranchId + " and Saleperson = " + $scope.IsSalePersonUserId + "  group by SupplierName, Type,Supp_Id,M_date  order by Tbookings desc LIMIT 0,5"
        //        }
        //        else {
        //            query = "select  SupplierName, Type, sum(LM) as LM, sum(SevToThirty) as SevToThirty, sum(ThirtyPlus) as ThirtyPlus, sum(T_bookings) as Tbookings, M_date,Supp_Id from rpt_early_book_suppliers_" + $scope.Year + "_bk where BrId=" + $scope.LoginBranchId + " group by SupplierName, Type,Supp_Id,M_date  order by Tbookings desc  LIMIT 0,5"
        //        }
        //    }
        //}
        //else {
        //    query = "select  SupplierName, Type, sum(LM) as LM, sum(SevToThirty) as SevToThirty, sum(ThirtyPlus) as ThirtyPlus, sum(T_bookings) as Tbookings, M_date,Supp_Id from rpt_early_book_suppliers_" + $scope.Year + "_bk where BrId=" + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + "  group by SupplierName, Type,Supp_Id,M_date  order by Tbookings desc LIMIT 0,5"
        //}

        if ($scope.Search == false) {
            if ($scope.LoginMemberTypeID == 1) {
                query = "select  SupplierName, Type, LM as LM, SevToThirty as SevToThirty, ThirtyPlus as ThirtyPlus, T_bookings as Tbookings,M_date ,Supp_Id from rpt_early_book_suppliers_new_" + $scope.Year + "_bk_months   order by Tbookings desc LIMIT 0,5"
            }
            else if ($scope.LoginMemberTypeID == 2) {
                if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
                    query = "select  SupplierName, Type, LM as LM, SevToThirty as SevToThirty, ThirtyPlus as ThirtyPlus, T_bookings as Tbookings,M_date,Supp_Id from rpt_early_book_suppliers_new_" + $scope.Year + "_bk_months_sp where BrId=" + $scope.LoginBranchId + " and Saleperson = " + $scope.IsSalePersonUserId + "    order by Tbookings desc LIMIT 0,5"
                }
                else {
                    query = "select  SupplierName, Type, LM as LM, SevToThirty as SevToThirty, ThirtyPlus as ThirtyPlus, T_bookings as Tbookings,M_date,Supp_Id from  rpt_early_book_suppliers_new_" + $scope.Year + "_bk_months_br where BrId=" + $scope.LoginBranchId + "   order by Tbookings desc  LIMIT 0,5"
                }
            }
        }
        else {
            query = "select  SupplierName, Type, LM as LM, SevToThirty as SevToThirty, ThirtyPlus as ThirtyPlus, T_bookings as Tbookings,M_date,Supp_Id from rpt_early_book_suppliers_new_" + $scope.Year + "_bk_months_sp where BrId=" + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + "   order by Tbookings desc LIMIT 0,5"
        }

        var ReportName = "LM Vs Early Booking Supplier Report";
        var settings = {
            "url": "https://osearch.xconnect.in/_opendistro/_sql",
            "method": "POST",
            "async": false,
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                query: query
            }),
        };
        var _Solution = [];
        $.ajax(settings).done(function (data) {
            var results = data['datarows'];
            _Solution = results;
            $scope.MainResultlistLMvsEarlyBookingSupplier = results.map(
                c => {
                    return {
                        'SupplierName': (c[0]),
                        'Type': (c[1]),
                        'T_bookings': (c[5]),
                        'LM': (c[5]) == 0 ? 0 : ((c[2]) / (c[5]) * 100).toFixed(2),
                        'SevToThirty': (c[5]) == 0 ? 0 : ((c[3]) / (c[5]) * 100).toFixed(2),
                        'ThirtyPlus': (c[5]) == 0 ? 0 : ((c[4]) / (c[5]) * 100).toFixed(2),
                        'M_date': (c[6])
                    }
                }
            );

            if ($scope.MainResultlistLMvsEarlyBookingSupplier.length > 0) {
                $.each($scope.MainResultlistLMvsEarlyBookingSupplier, function (i, item) {
                    if (i == 0) {
                        //  $("#SalesOverviewReport").html('');
                        added_row = '<thead class="main-head hidden-xs"><tr><th>Supplier Name</th><th>Type</th><th style="text-align:right;" title="Reconfirm Bookings">BKG</th><th style="text-align:right;">LM %</th><th style="text-align:right;">7To30 %</th><th style="text-align:right;">+30 %</th></tr></thead>';
                        added_row += '<tbody class="hsrr-tbody-main">';
                        $scope.Date = item.M_date;
                    }
                    added_row += '<tr>'
                        + '<td>' + item.SupplierName + '</td>'
                        + '<td>' + item.Type + '</td>'
                        + '<td style="text-align:right;">' + item.T_bookings + '</td>'
                        + '<td style="text-align:right;">' + item.LM + '</td>'
                        + '<td style="text-align:right;">' + item.SevToThirty + '</td>'
                        + '<td style="text-align:right;">' + item.ThirtyPlus + '</td>'
                        + '</tr>';
                });
                added_row += '</tbody>';
                $("#LMVSEARLYSupplierReport").append(added_row);
                $("#LMVSEARLYSupplierPopup").css("display", "none");
                $("#LmVsEarlyBSDate").append('Last Updated Date : ' + $scope.Date);
                $("#LmVsEarlyBSMonth").append('Top Results of ' + MonthName + " " + year);
                $scope.UpdateLMVCSuppier = $scope.MainResultlistLMvsEarlyBookingSupplier.length == 0 ? "" : $scope.MainResultlistLMvsEarlyBookingSupplier[0].M_date
            }
            else {
                $("#LMVSEARLYSupplierPopup").css("display", "none");
            }
        });
    }

    function GetLMVsEarlyBookingHotel() {

        const date = new Date();

        var myVariable = date;
        var makeDate = new Date(myVariable);
        makeDate = new Date(makeDate.setMonth(makeDate.getMonth() - 1));

        let monthno = makeDate.getMonth() + 1;
        let year = makeDate.getFullYear();
        const Month = GetMonth(monthno);

        const MonthName = GetMonthName(monthno);

        const FromDate = GetFromDate(Month);
        const ToDate = GetToDate(Month);


        var query = "";
        //if ($scope.Search == false) {
        //    if ($scope.LoginMemberTypeID == 1) {
        //        query = "select BrId, HotelName, Dest, sum(LM) as LM, sum(SevToThirty) as SevToThirty, sum(ThirtyPlus) as ThirtyPlus, sum(T_bookings) as Tbookings,M_date from rpt_early_book_hotels_" + $scope.Year + "_bk group by Dest, HotelName, BrId,M_date  order by Tbookings desc   LIMIT 0,5"
        //    }
        //    else if ($scope.LoginMemberTypeID == 2) {
        //        if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
        //            query = "select BrId, HotelName, Dest, sum(LM) as LM, sum(SevToThirty) as SevToThirty, sum(ThirtyPlus) as ThirtyPlus, sum(T_bookings) as Tbookings,M_date,Saleperson from rpt_early_book_hotels_" + $scope.Year + "_bk  where BrId = " + $scope.LoginBranchId + " and Saleperson = " + $scope.IsSalePersonUserId + " group by Dest, HotelName, BrId,M_date,Saleperson  order by Tbookings desc  LIMIT 0,5"
        //        }
        //        else {
        //            query = "select BrId, HotelName, Dest, sum(LM) as LM, sum(SevToThirty) as SevToThirty, sum(ThirtyPlus) as ThirtyPlus, sum(T_bookings) as Tbookings,M_date from rpt_early_book_hotels_" + $scope.Year + "_bk  where BrId = " + $scope.LoginBranchId + " group by Dest, HotelName, BrId,M_date  order by Tbookings desc  LIMIT 0,5"
        //        }
        //    }
        //}
        //else {
        //    query = "select BrId, HotelName, Dest, sum(LM) as LM, sum(SevToThirty) as SevToThirty, sum(ThirtyPlus) as ThirtyPlus, sum(T_bookings) as Tbookings,M_date,Saleperson from rpt_early_book_hotels_" + $scope.Year + "_bk  where BrId = " + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + " group by Dest, HotelName, BrId,M_date,Saleperson  order by Tbookings desc  LIMIT 0,5"
        //}
        if ($scope.Search == false) {
            if ($scope.LoginMemberTypeID == 1) {
                query = "select BrId, HotelName, Dest, LM as LM, SevToThirty as SevToThirty, ThirtyPlus as ThirtyPlus, T_bookings as Tbookings,M_date from rpt_early_book_hotels_new_" + $scope.Year + "_bk_months   order by Tbookings desc   LIMIT 0,5"
            }
            else if ($scope.LoginMemberTypeID == 2) {
                if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
                    query = "select BrId, HotelName, Dest, LM as LM, SevToThirty as SevToThirty, ThirtyPlus as ThirtyPlus, T_bookings as Tbookings,M_date,Saleperson from rpt_early_book_hotels_new_" + $scope.Year + "_bk_months_sp  where BrId = " + $scope.LoginBranchId + " and Saleperson = " + $scope.IsSalePersonUserId + "  order by Tbookings desc  LIMIT 0,5"
                }
                else {
                    query = "select BrId, HotelName, Dest, LM as LM, SevToThirty as SevToThirty, ThirtyPlus as ThirtyPlus, T_bookings as Tbookings,M_date from rpt_early_book_hotels_new_" + $scope.Year + "_bk_months_br  where BrId = " + $scope.LoginBranchId + "  order by Tbookings desc  LIMIT 0,5"
                }
            }
        }
        else {
            query = "select BrId, HotelName, Dest, LM as LM, SevToThirty as SevToThirty, ThirtyPlus as ThirtyPlus, T_bookings as Tbookings,M_date,Saleperson from rpt_early_book_hotels_new_" + $scope.Year + "_bk_months_sp  where BrId = " + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + " order by Tbookings desc  LIMIT 0,5"
        }

        var ReportName = "LM Vs Early Booking Hotel Report";
        var settings = {
            "url": "https://osearch.xconnect.in/_opendistro/_sql",
            "method": "POST",
            "async": false,
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "query": query
            }),
        };
        var _Solution = [];
        $.ajax(settings).done(function (data) {
            var results = data['datarows'];
            _Solution = results;
            $scope.MainResultlistLMvsEarlyBookingHotel = results.map(
                c => {
                    return {
                        'HotelName': (c[1]),
                        'Dest': (c[2]),
                        'T_bookings': (c[6]),
                        'LM': ((c[6]) == 0 ? 0 : (c[3]) / (c[6]) * 100).toFixed(2),
                        'SevToThirty': ((c[6]) == 0 ? 0 : (c[4]) / (c[6]) * 100).toFixed(2),
                        'ThirtyPlus': ((c[6]) == 0 ? 0 : (c[5]) / (c[6]) * 100).toFixed(2),
                        'M_date': (c[7])
                    }
                }
            );

            if ($scope.MainResultlistLMvsEarlyBookingHotel.length > 0) {
                $.each($scope.MainResultlistLMvsEarlyBookingHotel, function (i, item) {
                    if (i == 0) {
                        added_row = '<thead class="main-head hidden-xs"><tr><th>Hotel Name</th><th>Destination</th><th style="text-align:right;" title="Reconfirm Bookings">BKG</th><th style="text-align:right;">LM %</th><th style="text-align:right;">7To30 %</th><th style="text-align:right;">+30 %</th></tr></thead>';
                        added_row += '<tbody class="hsrr-tbody-main">';
                        $scope.Date = item.M_date;
                    }
                    added_row += '<tr>'
                        + '<td>' + item.HotelName + '</td>'
                        + '<td>' + item.Dest + '</td>'
                        + '<td style="text-align:right;">' + item.T_bookings + '</td>'
                        + '<td style="text-align:right;">' + item.LM + '</td>'
                        + '<td style="text-align:right;">' + item.SevToThirty + '</td>'
                        + '<td style="text-align:right;">' + item.ThirtyPlus + '</td>'
                        + '</tr>';
                });
                added_row += '</tbody>';
                $("#LMVSHotelReport").append(added_row);
                $("#LMVSHotelReportPopup").css("display", "none");
                $("#LmVsEarlyBHDate").append('Last Updated Date : ' + $scope.Date);
                $("#LmVsEarlyBHMonth").append('Top Results of ' + MonthName + " " + year);
                $scope.UpdatedDate = $scope.MainResultlistLMvsEarlyBookingHotel.length == 0 ? "" : $scope.MainResultlistLMvsEarlyBookingHotel[0].M_date
            }
            else {
                $("#LMVSHotelReportPopup").css("display", "none");
            }
        });

    }

    function GetLMVsEarlyBookingDestination() {

        const date = new Date();

        var myVariable = date;
        var makeDate = new Date(myVariable);
        makeDate = new Date(makeDate.setMonth(makeDate.getMonth() - 1));

        let monthno = makeDate.getMonth() + 1;
        let year = makeDate.getFullYear();
        const Month = GetMonth(monthno);

        const MonthName = GetMonthName(monthno);

        const FromDate = GetFromDate(Month);
        const ToDate = GetToDate(Month);

        var query = "";
        //if ($scope.Search == false) {
        //    if ($scope.LoginMemberTypeID == 1) {
        //        query = "SELECT Market, sum(LM) as LM, sum(SevToThirty) as SevToThirty, sum(ThirtyPlus) as ThirtyPlus, sum(T_bookings) as Tbookings,M_date from rpt_early_book_destinations_" + $scope.Year + "_bk group by  Market,M_date  order by Tbookings desc  LIMIT 0,5"
        //    }
        //    else if ($scope.LoginMemberTypeID == 2) {
        //        if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
        //            query = "SELECT Market, sum(LM) as LM, sum(SevToThirty) as SevToThirty, sum(ThirtyPlus) as ThirtyPlus, sum(T_bookings) as Tbookings,M_date,Saleperson from rpt_early_book_destinations_" + $scope.Year + "_bk  where BrId = " + $scope.LoginBranchId + " and Saleperson = " + $scope.IsSalePersonUserId + "group by  Market,M_date  order by Tbookings desc   LIMIT 0,5"
        //        }
        //        else {
        //            query = "SELECT Market, sum(LM) as LM, sum(SevToThirty) as SevToThirty, sum(ThirtyPlus) as ThirtyPlus, sum(T_bookings) as Tbookings,M_date from rpt_early_book_destinations_" + $scope.Year + "_bk  where BrId = " + $scope.LoginBranchId + " group by  Market,M_date  order by Tbookings desc  LIMIT 0,5"
        //        }
        //    }
        //}
        //else {
        //    query = "SELECT Market, sum(LM) as LM, sum(SevToThirty) as SevToThirty, sum(ThirtyPlus) as ThirtyPlus, sum(T_bookings) as Tbookings,M_date,Saleperson from rpt_early_book_destinations_" + $scope.Year + "_bk  where BrId = " + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + "group by  Market,M_date  order by Tbookings desc   LIMIT 0,5"
        //}
        if ($scope.Search == false) {
            if ($scope.LoginMemberTypeID == 1) {
                query = "SELECT Market, LM as LM, SevToThirty as SevToThirty, ThirtyPlus as ThirtyPlus, T_bookings as Tbookings,M_date from rpt_early_book_destinations_new_" + $scope.Year + "_bk_months   order by Tbookings desc  LIMIT 0,5"
            }
            else if ($scope.LoginMemberTypeID == 2) {
                if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
                    query = "SELECT Market, LM as LM, SevToThirty as SevToThirty, ThirtyPlus as ThirtyPlus, T_bookings as Tbookings,M_date,Saleperson from rpt_early_book_destinations_new_" + $scope.Year + "_bk_months_sp  where BrId = " + $scope.LoginBranchId + " and Saleperson = " + $scope.IsSalePersonUserId + "  order by Tbookings desc   LIMIT 0,5"
                }
                else {
                    query = "SELECT Market, LM as LM, SevToThirty as SevToThirty, ThirtyPlus as ThirtyPlus, T_bookings as Tbookings,M_date from rpt_early_book_destinations_new_" + $scope.Year + "_bk_months_br  where BrId = " + $scope.LoginBranchId + "  order by Tbookings desc  LIMIT 0,5"
                }
            }
        }
        else {
            query = "SELECT Market, LM as LM, SevToThirty as SevToThirty, ThirtyPlus as ThirtyPlus, T_bookings as Tbookings,M_date,Saleperson from rpt_early_book_destinations_new_" + $scope.Year + "_bk_months_sp  where BrId = " + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + " order by Tbookings desc   LIMIT 0,5"
        }

        var ReportName = "LM Vs Early Booking Destination Report";
        var settings = {
            "url": "https://osearch.xconnect.in/_opendistro/_sql",
            "method": "POST",
            "async": false,
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "query": query
            }),
        };
        var _Solution = [];
        $.ajax(settings).done(function (data) {
            var results = data['datarows'];
            _Solution = results;
            $scope.MainResultlistLMvsEarlyBookingDestination = results.map(
                c => {
                    return {
                        'Market': (c[0]),
                        'T_bookings': (c[4]),
                        'LM': (c[4]) == 0 ? 0 : ((c[1]) / (c[4]) * 100).toFixed(2),
                        'SevToThirty': (c[4]) == 0 ? 0 : ((c[2]) / (c[4]) * 100).toFixed(2),
                        'ThirtyPlus': (c[4]) == 0 ? 0 : ((c[3]) / (c[4]) * 100).toFixed(2),
                        'M_date': (c[5])
                    }

                }
            );

            if ($scope.MainResultlistLMvsEarlyBookingDestination.length > 0) {
                $.each($scope.MainResultlistLMvsEarlyBookingDestination, function (i, item) {
                    if (i == 0) {
                        added_row = '<thead class="main-head hidden-xs"><tr><th>Destination</th><th style="text-align:right;" title="Reconfirm Bookings">BKG</th><th style="text-align:right;">LM %</th><th style="text-align:right;">7To30 %</th><th style="text-align:right;">+30 %</th></tr></thead >';
                        added_row += '<tbody class="hsrr-tbody-main">';
                        $scope.Date = item.M_date;
                    }
                    added_row += '<tr>'
                        + '<td>' + item.Market + '</td>'
                        + '<td style="text-align:right;">' + item.T_bookings + '</td>'
                        + '<td style="text-align:right;">' + item.LM + '</td>'
                        + '<td style="text-align:right;">' + item.SevToThirty + '</td>'
                        + '<td style="text-align:right;">' + item.ThirtyPlus + '</td>'
                        + '</tr>';
                });
                added_row += '</tbody>';
                $("#LMDestinationReport").append(added_row);
                $("#LMDestinationReportPopup").css("display", "none");
                $("#LmVsEarlyBDDate").append('Last Updated Date : ' + $scope.Date);
                $("#LmVsEarlyBDMonth").append('Top Results of ' + MonthName + " " + year);
                $scope.UpdateLMVCLDest = $scope.MainResultlistLMvsEarlyBookingDestination.length == 0 ? "" : $scope.MainResultlistLMvsEarlyBookingDestination[0].M_date
            }
            else {
                $("#LMDestinationReportPopup").css("display", "none");
            }
        });
    }



    function GetCancelationHotel() {

        const date = new Date();

        var myVariable = date;
        var makeDate = new Date(myVariable);
        makeDate = new Date(makeDate.setMonth(makeDate.getMonth() - 1));

        let monthno = makeDate.getMonth() + 1;
        let year = makeDate.getFullYear();
        const Month = GetMonth(monthno);

        const MonthName = GetMonthName(monthno);

        const FromDate = GetFromDate(Month);
        const ToDate = GetToDate(Month);

        var query = "";
        //if ($scope.Search == false) {
        //    if ($scope.LoginMemberTypeID == 1) {
        //        query = "select  H_code,H_Name,Market as Dest, sum(case when (LM >0) then 1 else 0 end)  as LM, sum(case when (Seven>0) then 1 else 0 end) as SevenToThirty ,sum(case when (ThirtyPlus>0) then 1 else 0 end) as ThirtyPlus ,count(BookRefNo) as T_booking,M_date,BranchID from rpt_early_cancellation_booking_" + $scope.Year + "_bk  group by H_code,H_Name,Market,M_date,BranchID order by T_booking desc  LIMIT 0,5"
        //    }
        //    else if ($scope.LoginMemberTypeID == 2) {
        //        if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
        //            query = "select  H_code,H_Name,Market as Dest, sum(case when (LM >0) then 1 else 0 end)  as LM, sum(case when (Seven>0) then 1 else 0 end) as SevenToThirty ,sum(case when (ThirtyPlus>0) then 1 else 0 end) as ThirtyPlus ,count(BookRefNo) as T_booking,M_date,BranchID,Saleperson from rpt_early_cancellation_booking_" + $scope.Year + "_bk  where BranchID = " + $scope.LoginBranchId + " and Saleperson=" + $scope.IsSalePersonUserId + "  group by H_code,H_Name,Market,M_date,BranchID,Saleperson  order by T_booking desc   LIMIT 0,5"
        //        }
        //        else {
        //            query = "select  H_code,H_Name,Market as Dest, sum(case when (LM >0) then 1 else 0 end)  as LM, sum(case when (Seven>0) then 1 else 0 end) as SevenToThirty ,sum(case when (ThirtyPlus>0) then 1 else 0 end) as ThirtyPlus ,count(BookRefNo) as T_booking,M_date,BranchID from rpt_early_cancellation_booking_" + $scope.Year + "_bk  where BranchID = " + $scope.LoginBranchId + " group by H_code,H_Name,Market,M_date,BranchID  order by T_booking desc   LIMIT 0,5"
        //        }
        //    }
        //}
        //else {
        //    query = "select  H_code,H_Name,Market as Dest, sum(case when (LM >0) then 1 else 0 end)  as LM, sum(case when (Seven>0) then 1 else 0 end) as SevenToThirty ,sum(case when (ThirtyPlus>0) then 1 else 0 end) as ThirtyPlus ,count(BookRefNo) as T_booking,M_date,BranchID,Saleperson from rpt_early_cancellation_booking_" + $scope.Year + "_bk  where BranchID = " + $scope.SaleABranchId + " and Saleperson=" + $scope.SalesAUserId + "  group by H_code,H_Name,Market,M_date,BranchID,Saleperson  order by T_booking desc   LIMIT 0,5"
        //}
        if ($scope.Search == false) {
            if ($scope.LoginMemberTypeID == 1) {
                query = "select  H_code,H_Name,Market as Dest, LM,Seven as SevenToThirty ,ThirtyPlus ,Bookings as T_booking,M_date,BranchID from rpt_early_cancellation_booking_new_" + $scope.Year + "_bk_monthshotel  order by T_booking desc  LIMIT 0,5"
            }
            else if ($scope.LoginMemberTypeID == 2) {
                if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
                    query = "select  H_code,H_Name,Market as Dest, LM, Seven as SevenToThirty ,ThirtyPlus ,Bookings as T_booking,M_date,BranchID,Saleperson from rpt_early_cancellation_booking_new_" + $scope.Year + "_bk_monthshotel_sp  where BranchID = " + $scope.LoginBranchId + " and Saleperson=" + $scope.IsSalePersonUserId + "    order by T_booking desc   LIMIT 0,5"
                }
                else {
                    query = "select  H_code,H_Name,Market as Dest,LM,Seven as SevenToThirty ,ThirtyPlus ,Bookings as T_booking,M_date,BranchID from rpt_early_cancellation_booking_new_" + $scope.Year + "_bk_monthshotel_br  where BranchID = " + $scope.LoginBranchId + "   order by T_booking desc   LIMIT 0,5"
                }
            }
        }
        else {
            query = "select  H_code,H_Name,Market as Dest, LM,Seven as SevenToThirty ,ThirtyPlus ,Bookings as T_booking,M_date,BranchID,Saleperson from rpt_early_cancellation_booking_new_" + $scope.Year + "_bk_monthshotel_sp  where BranchID = " + $scope.SaleABranchId + " and Saleperson=" + $scope.SalesAUserId + "   order by T_booking desc   LIMIT 0,5"
        }


        var ReportName = "Cancelation Hotel Report";
        var settings = {
            "url": "https://osearch.xconnect.in/_opendistro/_sql",
            "method": "POST",
            "async": false,
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "query": query
            }),
        };
        var _Solution = [];
        $.ajax(settings).done(function (data) {
            var results = data['datarows'];
            _Solution = results;
            $scope.MainResultlistcancelationHotel = results.map(
                c => {
                    return {
                        'HotelName': (c[1]),
                        'Dest': (c[2]),
                        'T_booking': (c[6]),
                        'LM': (c[6]) == 0 ? 0 : ((c[3]) / (c[6]) * 100).toFixed(2),
                        'SevToThirty': (c[6]) == 0 ? 0 : ((c[4]) / (c[6]) * 100).toFixed(2),
                        'ThirtyPlus': (c[6]) == 0 ? 0 : ((c[5]) / (c[6]) * 100).toFixed(2),
                        'M_date': (c[7]),
                    }
                }
            );

            if ($scope.MainResultlistcancelationHotel.length > 0) {
                $.each($scope.MainResultlistcancelationHotel, function (i, item) {
                    if (i == 0) {
                        added_row = '<thead class="main-head hidden-xs"><tr><th>Hotel Name</th><th>Destination</th><th style="text-align:right;" title="Reconfirm Bookings">BKG</th><th style="text-align:right;">LM %</th><th style="text-align:right;">7To30 %</th><th style="text-align:right;">+30 %</th></tr></thead>';
                        added_row += '<tbody class="hsrr-tbody-main">';
                        $scope.Date = item.M_date;
                    }
                    added_row += '<tr>'
                        + '<td>' + item.HotelName + '</td>'
                        + '<td>' + item.Dest + '</td>'
                        + '<td style="text-align:right;">' + item.T_booking + '</td>'
                        + '<td style="text-align:right;">' + item.LM + '</td>'
                        + '<td style="text-align:right;">' + item.SevToThirty + '</td>'
                        + '<td style="text-align:right;">' + item.ThirtyPlus + '</td>'
                        + '</tr>';
                });
                added_row += '</tbody>';
                $("#cancelationHotelReport").append(added_row);
                $("#cancelationHotelPopup").css("display", "none");
                $("#CanHotelDate").append('Last Updated Date : ' + $scope.Date);
                $("#CanHotelMonth").append('Top Results of ' + MonthName + " " + year);
                $scope.UpdatedDateCxlHotel = $scope.MainResultlistcancelationHotel.length == 0 ? "" : $scope.MainResultlistcancelationHotel[0].M_date
            }
            else {
                $("#cancelationHotelPopup").css("display", "none");
            }
        });

    }

    function GetCancelationClient() {

        const date = new Date();
        var myVariable = date;
        var makeDate = new Date(myVariable);
        makeDate = new Date(makeDate.setMonth(makeDate.getMonth() - 1));

        let monthno = makeDate.getMonth() + 1;
        let year = makeDate.getFullYear();
        const Month = GetMonth(monthno);

        const MonthName = GetMonthName(monthno);

        const FromDate = GetFromDate(Month);
        const ToDate = GetToDate(Month);

        var query = "";
        //if ($scope.Search == false) {
        //    if ($scope.LoginMemberTypeID == 1) {
        //        query = "select  MemberId,ClientName,Market , sum(case when (LM >0) then 1 else 0 end)  as LM, sum(case when (Seven>0) then 1 else 0 end) as SevenToThirty ,sum(case when (ThirtyPlus>0) then 1 else 0 end) as ThirtyPlus ,count(BookRefNo) as T_booking,(case when ApiBooking=0 then 'Client' else 'API' end) as Type, Owner, M_date from rpt_early_cancellation_booking_" + $scope.Year + "_bk  group by MemberId,ClientName,Type, Owner,Market,M_date  order by T_booking desc  LIMIT 0,5 "
        //    }
        //    else if ($scope.LoginMemberTypeID == 2) {
        //        if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
        //            query = "select  MemberId,ClientName,Market , sum(case when (LM >0) then 1 else 0 end)  as LM, sum(case when (Seven>0) then 1 else 0 end) as SevenToThirty ,sum(case when (ThirtyPlus>0) then 1 else 0 end) as ThirtyPlus ,count(BookRefNo) as T_booking,(case when ApiBooking=0 then 'Client' else 'API' end) as Type, Owner, M_date,Saleperson,BranchID from rpt_early_cancellation_booking_" + $scope.Year + "_bk where BranchID = " + $scope.LoginBranchId + " and Saleperson=" + $scope.IsSalePersonUserId + " group by MemberId,ClientName,Type, Owner,Market,M_date,Saleperson  order by T_booking desc   LIMIT 0,5 "
        //        }
        //        else {
        //            query = "select  MemberId,ClientName,Market , sum(case when (LM >0) then 1 else 0 end)  as LM, sum(case when (Seven>0) then 1 else 0 end) as SevenToThirty ,sum(case when (ThirtyPlus>0) then 1 else 0 end) as ThirtyPlus ,count(BookRefNo) as T_booking,(case when ApiBooking=0 then 'Client'else 'API' end) as Type ,Owner,M_date,BranchID  from rpt_early_cancellation_booking_" + $scope.Year + "_bk where BranchID = " + $scope.LoginBranchId + "   group by MemberId,ClientName,Type,Owner,Market,M_date,BranchID  order by T_booking desc  LIMIT 0,5 "
        //        }
        //    }
        //} else {
        //    query = "select  MemberId,ClientName,Market , sum(case when (LM >0) then 1 else 0 end)  as LM, sum(case when (Seven>0) then 1 else 0 end) as SevenToThirty ,sum(case when (ThirtyPlus>0) then 1 else 0 end) as ThirtyPlus ,count(BookRefNo) as T_booking,(case when ApiBooking=0 then 'Client' else 'API' end) as Type, Owner, M_date,Saleperson,BranchID from rpt_early_cancellation_booking_" + $scope.Year + "_bk where BranchID = " + $scope.SaleABranchId + " and Saleperson=" + $scope.SalesAUserId + " group by MemberId,ClientName,Type, Owner,Market,M_date,Saleperson  order by T_booking desc   LIMIT 0,5 "
        //}

        if ($scope.Search == false) {
            if ($scope.LoginMemberTypeID == 1) {
                query = "select  MemberId,ClientName,Market , LM,Seven as SevenToThirty ,ThirtyPlus ,Bookings as T_booking,case when ApiBooking=0 then 'Client' else 'API' end as Type, Owner, M_date from rpt_early_cancellation_booking_new_" + $scope.Year + "_bk_monthsclient   order by T_booking desc  LIMIT 0,5 "
            }
            else if ($scope.LoginMemberTypeID == 2) {
                if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
                    query = "select MemberId,ClientName,Market , LM,Seven as SevenToThirty ,ThirtyPlus ,Bookings as T_booking,case when ApiBooking=0 then 'Client' else 'API' end as Type, Owner, M_date,Saleperson,BranchID from rpt_early_cancellation_booking_new_" + $scope.Year + "_bk_monthsclient_sp where BranchID = " + $scope.LoginBranchId + " and Saleperson=" + $scope.IsSalePersonUserId + "   order by T_booking desc   LIMIT 0,5 "
                }
                else {
                    query = "select   MemberId,ClientName,Market , LM,Seven as SevenToThirty ,ThirtyPlus ,Bookings as T_booking,case when ApiBooking=0 then 'Client' else 'API' end as Type, Owner, M_date,BranchID  from rpt_early_cancellation_booking_new_" + $scope.Year + "_bk_monthsclient_br where BranchID = " + $scope.LoginBranchId + "  order by T_booking desc  LIMIT 0,5 "
                }
            }
        } else {
            query = "select   MemberId,ClientName,Market ,LM,Seven as SevenToThirty ,ThirtyPlus ,Bookings as T_booking,case when ApiBooking=0 then 'Client' else 'API' end as Type, Owner, M_date,Saleperson,BranchID from rpt_early_cancellation_booking_new_" + $scope.Year + "_bk_monthsclient_sp where BranchID = " + $scope.SaleABranchId + " and Saleperson=" + $scope.SalesAUserId + "   order by T_booking desc   LIMIT 0,5 "
        }

        var ReportName = "Cancelation Client Report";
        var settings = {
            "url": "https://osearch.xconnect.in/_opendistro/_sql",
            "method": "POST",
            "async": false,
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "query": query
            }),
        };
        var _Solution = [];
        $.ajax(settings).done(function (data) {
            var results = data['datarows'];
            _Solution = results;
            $scope.MainResultlistCXLClient = results.map(
                c => {
                    return {
                        'ClientName': (c[1]),
                        'Type': (c[7]),
                        'Market': (c[2]),
                        'Owner': (c[8]),
                        'T_booking': (c[6]),
                        'LM': (c[6]) == 0 ? 0 : ((c[3]) / (c[6]) * 100).toFixed(2),
                        'SevToThirty': (c[6]) == 0 ? 0 : ((c[4]) / (c[6]) * 100).toFixed(2),
                        'ThirtyPlus': (c[6]) == 0 ? 0 : ((c[5]) / (c[6]) * 100).toFixed(2),
                        'M_date': (c[9]),
                    }
                }
            );

            if ($scope.MainResultlistCXLClient.length > 0) {
                $.each($scope.MainResultlistCXLClient, function (i, item) {
                    if (i == 0) {
                        added_row = '<thead class="main-head hidden-xs"><tr><th>Client Name</th><th>Type</th><th>Market</th><th title="Key Account Manager">KAM</th><th style="text-align:right;" title="Reconfirm Bookings">BKG</th><th style="text-align:right;">LM %</th><th style="text-align:right;">7To30 %</th><th style="text-align:right;">+30 %</th></tr></thead>';
                        added_row += '<tbody class="hsrr-tbody-main">';
                        $scope.Date = item.M_date;
                    }
                    added_row += '<tr>'
                        + '<td>' + item.ClientName + '</td>'
                        + '<td>' + item.Type + '</td>'
                        + '<td>' + item.Market + '</td>'
                        + '<td>' + item.Owner + '</td>'
                        + '<td style="text-align:right;">' + item.T_booking + '</td>'
                        + '<td style="text-align:right;">' + item.LM + '</td>'
                        + '<td style="text-align:right;">' + item.SevToThirty + '</td>'
                        + '<td style="text-align:right;">' + item.ThirtyPlus + '</td>'
                        + '</tr>';
                });
                added_row += '</tbody>';

                $("#CanCXLClientReport").append(added_row);
                $("#CanCXLClientPopup").css("display", "none");
                $("#CanClientDate").append('Last Updated Date : ' + $scope.Date);
                $("#CanClientMonth").append('Top Results of ' + MonthName + " " + year);
                $scope.UpdatedDateCxlClient = $scope.MainResultlistCXLClient.length == 0 ? "" : $scope.MainResultlistCXLClient[0].M_date;
            }
            else {
                $("#CanCXLClientPopup").css("display", "none");
            }
        });

    }

    function GetCancelationSupplier() {

        const date = new Date();
        var myVariable = date;
        var makeDate = new Date(myVariable);
        makeDate = new Date(makeDate.setMonth(makeDate.getMonth() - 1));

        let monthno = makeDate.getMonth() + 1;
        let year = makeDate.getFullYear();
        const Month = GetMonth(monthno);

        const MonthName = GetMonthName(monthno);

        const FromDate = GetFromDate(Month);
        const ToDate = GetToDate(Month);



        var query = "";
        //if ($scope.Search == false) {
        //    if ($scope.LoginMemberTypeID == 1) {
        //        query = "select  SupplierName,Supp_Id,(case when ApiBooking=0 then 'Client' else 'API' end) as Type , sum(case when (LM >0) then 1 else 0 end)  as LM, sum(case when (Seven>0) then 1 else 0 end) as SevenToThirty ,sum(case when (ThirtyPlus>0) then 1 else 0 end) as ThirtyPlus ,count(BookRefNo) as T_booking, M_date from rpt_early_cancellation_booking_" + $scope.Year + "_bk group by Supp_Id,SupplierName,Type,M_date  order by T_booking desc  LIMIT 0,5 "
        //    }
        //    else if ($scope.LoginMemberTypeID == 2) {
        //        if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
        //            query = "select  SupplierName,Supp_Id,(case when ApiBooking=0 then 'Client' else 'API' end) as Type , sum(case when (LM >0) then 1 else 0 end)  as LM, sum(case when (Seven>0) then 1 else 0 end) as SevenToThirty ,sum(case when (ThirtyPlus>0) then 1 else 0 end) as ThirtyPlus ,count(BookRefNo) as T_booking, M_date,BranchID,Saleperson from rpt_early_cancellation_booking_" + $scope.Year + "_bk where BranchID = " + $scope.LoginBranchId + " and Saleperson = " + $scope.IsSalePersonUserId + " group by Supp_Id,SupplierName,Type,M_date,BranchID,Saleperson  order by T_booking desc  LIMIT 0,5 "
        //        }
        //        else {
        //            query = "select  SupplierName,Supp_Id,(case when ApiBooking=0 then 'Client' else 'API' end) as Type , sum(case when (LM >0) then 1 else 0 end)  as LM, sum(case when (Seven>0) then 1 else 0 end) as SevenToThirty ,sum(case when (ThirtyPlus>0) then 1 else 0 end) as ThirtyPlus ,count(BookRefNo) as T_booking, M_date from rpt_early_cancellation_booking_" + $scope.Year + "_bk where BranchID = " + $scope.LoginBranchId + "  group by Supp_Id,SupplierName,Type,M_date  order by T_booking desc  LIMIT 0,5 "
        //        }
        //    }
        //}
        //else {
        //    query = "select  SupplierName,Supp_Id,(case when ApiBooking=0 then 'Client' else 'API' end) as Type , sum(case when (LM >0) then 1 else 0 end)  as LM, sum(case when (Seven>0) then 1 else 0 end) as SevenToThirty ,sum(case when (ThirtyPlus>0) then 1 else 0 end) as ThirtyPlus ,count(BookRefNo) as T_booking, M_date,BranchID,Saleperson from rpt_early_cancellation_booking_" + $scope.Year + "_bk where BranchID = " + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + " group by Supp_Id,SupplierName,Type,M_date,BranchID,Saleperson  order by T_booking desc  LIMIT 0,5 "
        //}
        if ($scope.Search == false) {
            if ($scope.LoginMemberTypeID == 1) {
                query = "select  SupplierName,Supp_Id,case when ApiBooking=0 then 'Client' else 'API' end as Type , LM,Seven as SevenToThirty ,ThirtyPlus ,Bookings as T_booking, M_date from rpt_early_cancellation_booking_new_" + $scope.Year + "_bk_monthssupplier   order by T_booking desc  LIMIT 0,5 "
            }
            else if ($scope.LoginMemberTypeID == 2) {
                if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
                    query = "select  SupplierName,Supp_Id,case when ApiBooking=0 then 'Client' else 'API' end as Type , LM,Seven as SevenToThirty ,ThirtyPlus ,Bookings as T_booking, M_date,BranchID,Saleperson from rpt_early_cancellation_booking_new_" + $scope.Year + "_bk_monthssupplier_sp where BranchID = " + $scope.LoginBranchId + " and Saleperson = " + $scope.IsSalePersonUserId + "   order by T_booking desc  LIMIT 0,5 "
                }
                else {
                    query = "select  SupplierName,Supp_Id,case when ApiBooking=0 then 'Client' else 'API' end as Type , LM,Seven as SevenToThirty ,ThirtyPlus ,Bookings as T_booking, M_date from rpt_early_cancellation_booking_new_" + $scope.Year + "_bk_monthssupplier_br where BranchID = " + $scope.LoginBranchId + "   order by T_booking desc  LIMIT 0,5 "
                }
            }
        }
        else {
            query = "select  SupplierName,Supp_Id,case when ApiBooking=0 then 'Client' else 'API' end as Type ,LM,Seven as SevenToThirty ,ThirtyPlus ,Bookings as T_booking, M_date,BranchID,Saleperson from rpt_early_cancellation_booking_new_" + $scope.Year + "_bk_monthssupplier_sp where BranchID = " + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + " order by T_booking desc  LIMIT 0,5 "
        }

        var ReportName = "Cancelation Supplier Report";
        var settings = {
            "url": "https://osearch.xconnect.in/_opendistro/_sql",
            "method": "POST",
            "async": false,
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "query": query
            }),
        };
        var _Solution = [];
        $.ajax(settings).done(function (data) {
            var results = data['datarows'];
            _Solution = results;
            $scope.MainResultlistCXLSupplier = results.map(
                c => {
                    return {
                        'SupplierName': (c[0]),
                        'Type': (c[2]),
                        'T_booking': (c[6]),
                        'LM': (c[6]) == 0 ? 0 : ((c[3]) / (c[6]) * 100).toFixed(2),
                        'SevToThirty': (c[6]) == 0 ? 0 : ((c[4]) / (c[6]) * 100).toFixed(2),
                        'ThirtyPlus': (c[6]) == 0 ? 0 : ((c[5]) / (c[6]) * 100).toFixed(2),
                        'M_date': (c[7]),
                    }
                }
            );
            if ($scope.MainResultlistCXLSupplier.length > 0) {
                $.each($scope.MainResultlistCXLSupplier, function (i, item) {
                    if (i == 0) {
                        added_row = '<thead class="main-head hidden-xs"><tr><th>Supplier Name</th><th>Type</th><th style="text-align:right;" title="Reconfirm Bookings">BKG</th><th style="text-align:right;">LM %</th><th style="text-align:right;">7To30 %</th><th style="text-align:right;">+30 %</th></tr></thead>';
                        added_row += '<tbody class="hsrr-tbody-main">';
                        $scope.Date = item.M_date;
                    }
                    added_row += '<tr>'
                        + '<td>' + item.SupplierName + '</td>'
                        + '<td>' + item.Type + '</td>'
                        + '<td style="text-align:right;">' + item.T_booking + '</td>'
                        + '<td style="text-align:right;">' + item.LM + '</td>'
                        + '<td style="text-align:right;">' + item.SevToThirty + '</td>'
                        + '<td style="text-align:right;">' + item.ThirtyPlus + '</td>'
                        + '</tr>';
                });
                added_row += '</tbody>';
                $("#CanCXLSUPPLIERReport").append(added_row);
                $("#CanCXLSUPPLIERPopup").css("display", "none");
                $("#CanSupplierDate").append('Last Updated Date : ' + $scope.Date);
                $("#CanSupplierMonth").append('Top Results of ' + MonthName + " " + year);
                $scope.UpdatedDateCxlSupp = $scope.MainResultlistCXLSupplier.length == 0 ? "" : $scope.MainResultlistCXLSupplier[0].M_date;
            }
            else {
                $("#CanCXLSUPPLIERPopup").css("display", "none");
            }
        });

    }

    function GetCancelationDestination() {

        const date = new Date();
        var myVariable = date;
        var makeDate = new Date(myVariable);
        makeDate = new Date(makeDate.setMonth(makeDate.getMonth() - 1));

        let monthno = makeDate.getMonth() + 1;
        let year = makeDate.getFullYear();
        const Month = GetMonth(monthno);

        const MonthName = GetMonthName(monthno);

        const FromDate = GetFromDate(Month);
        const ToDate = GetToDate(Month);


        var query = "";
        //if ($scope.Search == false) {
        //    if ($scope.LoginMemberTypeID == 1) {
        //        query = "select  Market as dest, sum(case when(LM > 0) then 1 else 0 end) as LM, sum(case when(Seven > 0) then 1 else 0 end) as SevenToThirty, sum(case when(ThirtyPlus > 0) then 1 else 0 end) as ThirtyPlus, count(BookRefNo) as T_booking, M_date from rpt_early_cancellation_booking_" + $scope.Year + "_bk group by dest, M_date  order by T_booking desc  LIMIT 0,5 "
        //    }
        //    else if ($scope.LoginMemberTypeID == 2) {
        //        if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
        //            query = " select  Market as dest, sum(case when(LM > 0) then 1 else 0 end) as LM, sum(case when(Seven > 0) then 1 else 0 end) as SevenToThirty, sum(case when(ThirtyPlus > 0) then 1 else 0 end) as ThirtyPlus, count(BookRefNo) as T_booking, M_date,BranchID,Saleperson from rpt_early_cancellation_booking_" + $scope.Year + "_bk where BranchID = " + $scope.LoginBranchId + " and Saleperson = " + $scope.IsSalePersonUserId + " group by dest, M_date,BranchID,Saleperson  order by T_booking desc  LIMIT 0,5 "
        //        }
        //        else {
        //            query = " select  Market as dest, sum(case when(LM > 0) then 1 else 0 end) as LM, sum(case when(Seven > 0) then 1 else 0 end) as SevenToThirty, sum(case when(ThirtyPlus > 0) then 1 else 0 end) as ThirtyPlus, count(BookRefNo) as T_booking, M_date,BranchID from rpt_early_cancellation_booking_" + $scope.Year + "_bk where BranchID = " + $scope.LoginBranchId + "  group by dest, M_date,BranchID  order by T_booking desc  LIMIT 0,5 "
        //        }
        //    }
        //}
        //else {
        //    query = " select  Market as dest, sum(case when(LM > 0) then 1 else 0 end) as LM, sum(case when(Seven > 0) then 1 else 0 end) as SevenToThirty, sum(case when(ThirtyPlus > 0) then 1 else 0 end) as ThirtyPlus, count(BookRefNo) as T_booking, M_date,BranchID,Saleperson from rpt_early_cancellation_booking_" + $scope.Year + "_bk where BranchID = " + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + " group by dest, M_date,BranchID,Saleperson  order by T_booking desc  LIMIT 0,5 "
        //}

        if ($scope.Search == false) {
            if ($scope.LoginMemberTypeID == 1) {
                query = "select  Market as dest, LM,Seven as SevenToThirty ,ThirtyPlus, Bookings as T_booking, M_date from rpt_early_cancellation_booking_new_" + $scope.Year + "_bk_monthsdestination   order by T_booking desc  LIMIT 0,5 "
            }
            else if ($scope.LoginMemberTypeID == 2) {
                if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
                    query = " select  Market as dest, LM,Seven as SevenToThirty ,ThirtyPlus, Bookings as T_booking, M_date,BranchID,Saleperson from rpt_early_cancellation_booking_new_" + $scope.Year + "_bk_monthsdestination_sp where BranchID = " + $scope.LoginBranchId + " and Saleperson = " + $scope.IsSalePersonUserId + "   order by T_booking desc  LIMIT 0,5 "
                }
                else {
                    query = " select  Market as dest, LM,Seven as SevenToThirty ,ThirtyPlus, Bookings as T_booking, M_date,BranchID from rpt_early_cancellation_booking_new_" + $scope.Year + "_bk_monthsdestination_br where BranchID = " + $scope.LoginBranchId + "    order by T_booking desc  LIMIT 0,5 "
                }
            }
        }
        else {
            query = " select  Market as dest, LM,Seven as SevenToThirty ,ThirtyPlus, Bookings as T_booking, M_date,BranchID,Saleperson from rpt_early_cancellation_booking_new_" + $scope.Year + "_bk_monthsdestination_sp where BranchID = " + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + "   order by T_booking desc  LIMIT 0,5 "
        }

        var ReportName = "Cancelation Destination Report";
        var settings = {
            "url": "https://osearch.xconnect.in/_opendistro/_sql",
            "method": "POST",
            "async": false,
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "query": query
            }),
        };
        var _Solution = [];
        $.ajax(settings).done(function (data) {
            var results = data['datarows'];
            _Solution = results;
            $scope.MainResultlistCXLDest = results.map(
                c => {
                    return {
                        'Dest': (c[0]),
                        'T_booking': (c[4]),
                        'LM': (c[4]) == 0 ? 0 : ((c[1]) / (c[4]) * 100).toFixed(2),
                        'SevToThirty': (c[4]) == 0 ? 0 : ((c[2]) / (c[4]) * 100).toFixed(2),
                        'ThirtyPlus': (c[4]) == 0 ? 0 : ((c[3]) / (c[4]) * 100).toFixed(2),
                        'M_date': (c[5]),
                    }
                }
            );
            if ($scope.MainResultlistCXLDest.length > 0) {
                $.each($scope.MainResultlistCXLDest, function (i, item) {
                    if (i == 0) {
                        added_row = '<thead class="main-head hidden-xs"><tr><th>Destination</th><th style="text-align:right;" title="Reconfirm Bookings">BKG</th><th style="text-align:right;">LM %</th><th style="text-align:right;">7To30 %</th><th style="text-align:right;">+30 %</th></tr></thead>';
                        added_row += '<tbody class="hsrr-tbody-main">';
                        $scope.Date = item.M_date;
                    }
                    added_row += '<tr>'
                        + '<td>' + item.Dest + '</td>'
                        + '<td style="text-align:right;">' + item.T_booking + '</td>'
                        + '<td style="text-align:right;">' + item.LM + '</td>'
                        + '<td style="text-align:right;">' + item.SevToThirty + '</td>'
                        + '<td style="text-align:right;">' + item.ThirtyPlus + '</td>'
                        + '</tr>';
                });
                added_row += '</tbody>';
                $("#CanDestReport").append(added_row);
                $("#CanDestPopup").css("display", "none");
                $("#CanDestinationDate").append('Last Updated Date : ' + $scope.Date);
                $("#CanDestinationMonth").append('Top Results of ' + MonthName + " " + year);
                $scope.UpdatedDateCxlDest = $scope.MainResultlistCXLDest.length == 0 ? "" : $scope.MainResultlistCXLDest[0].M_date;
            }
            else {
                $("#CanDestPopup").css("display", "none");
            }
        });
    }



    function GetNRVsRefDestination() {
        const date = new Date();

        var myVariable = date;
        var makeDate = new Date(myVariable);
        makeDate = new Date(makeDate.setMonth(makeDate.getMonth() - 1));

        let monthno = makeDate.getMonth() + 1;
        let year = makeDate.getFullYear();
        const Month = GetMonth(monthno);

        const MonthName = GetMonthName(monthno);

        const FromDate = GetFromDate(Month);
        const ToDate = GetToDate(Month);

        var query = "";
        //if ($scope.Search == false) {
        //    if ($scope.LoginMemberTypeID == 1) {
        //        query = "select City_ID, Market, SUM(NR), SUM(RF), SUM(T_bookings) as ToatlBkg,M_date from  rpt_nr_refundable_destination_" + $scope.Year + "_bk  GROUP BY City_ID, Market,M_date order by ToatlBkg desc LIMIT 0,5"
        //    }
        //    else if ($scope.LoginMemberTypeID == 2) {
        //        if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
        //            query = "select City_ID, Market, SUM(NR), SUM(RF), SUM(T_bookings) as ToatlBkg,M_date,BrId,Saleperson from  rpt_nr_refundable_destination_" + $scope.Year + "_bk   where BrId=" + $scope.LoginBranchId + " and Saleperson = " + $scope.IsSalePersonUserId + " GROUP BY City_ID, Market,M_date,BrId,Saleperson order by ToatlBkg desc LIMIT 0,5"
        //        }
        //        else {
        //            query = "select City_ID, Market, SUM(NR), SUM(RF), SUM(T_bookings) as ToatlBkg,M_date,BrId from  rpt_nr_refundable_destination_" + $scope.Year + "_bk  where BrId=" + $scope.LoginBranchId + "  GROUP BY City_ID, Market,M_date,BrId  order by ToatlBkg desc LIMIT 0,5"
        //        }
        //    }
        //}
        //else {
        //    query = "select City_ID, Market, SUM(NR), SUM(RF), SUM(T_bookings) as ToatlBkg,M_date,BrId,Saleperson from  rpt_nr_refundable_destination_" + $scope.Year + "_bk   where BrId=" + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + " GROUP BY City_ID, Market,M_date,BrId,Saleperson order by ToatlBkg desc LIMIT 0,5"
        //}

        if ($scope.Search == false) {
            if ($scope.LoginMemberTypeID == 1) {
                query = "select City_ID, Market, NR, RF, T_bookings as ToatlBkg,M_date from  rpt_nr_refundable_destination_new_" + $scope.Year + "_bk_months   order by ToatlBkg desc LIMIT 0,5"
            }
            else if ($scope.LoginMemberTypeID == 2) {
                if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
                    query = "select City_ID, Market, NR, RF, T_bookings as ToatlBkg,M_date,BrId,Saleperson from  rpt_nr_refundable_destination_new_" + $scope.Year + "_bk_months_sp   where BrId=" + $scope.LoginBranchId + " and Saleperson = " + $scope.IsSalePersonUserId + "  order by ToatlBkg desc LIMIT 0,5"
                }
                else {
                    query = "select City_ID, Market, NR, RF, T_bookings as ToatlBkg,M_date,BrId from  rpt_nr_refundable_destination_new_" + $scope.Year + "_bk_months_br  where BrId=" + $scope.LoginBranchId + "    order by ToatlBkg desc LIMIT 0,5"
                }
            }
        }
        else {
            query = "select City_ID, Market, NR, RF, T_bookings as ToatlBkg,M_date,BrId,Saleperson from  rpt_nr_refundable_destination_new_" + $scope.Year + "_bk_months_sp   where BrId=" + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + "  order by ToatlBkg desc LIMIT 0,5"
        }

        var ReportName = "NR Vs Refundable Destination Report";
        var settings = {
            "url": "https://osearch.xconnect.in/_opendistro/_sql",
            "method": "POST",
            "async": false,
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "query": query
            }),
        };
        var _Solution = [];
        $.ajax(settings).done(function (data) {
            var results = data['datarows'];
            _Solution = results;
            $scope.MainResultlistNRVsRFDest = results.map(
                c => {
                    return {
                        'Dest': (c[1]),
                        'NR': (c[4]) == 0 ? 0 : ((c[2]) / (c[4]) * 100).toFixed(2),
                        'RF': (c[4]) == 0 ? 0 : ((c[3]) / (c[4]) * 100).toFixed(2),
                        'T_bookings': (c[4]),
                        'M_date': (c[5]),
                    }
                }
            );
            if ($scope.MainResultlistNRVsRFDest.length > 0) {
                $.each($scope.MainResultlistNRVsRFDest, function (i, item) {
                    if (i == 0) {
                        added_row = '<thead class="main-head hidden-xs"><tr><th>Destination</th><th style="text-align:right;" title="Reconfirm Bookings">BKG</th><th style="text-align:right;">NR %</th><th style="text-align:right;">RF %</th></tr></thead>';
                        added_row += '<tbody class="hsrr-tbody-main">';
                        $scope.Date = item.M_date;
                    }
                    added_row += '<tr>'
                        + '<td>' + item.Dest + '</td>'
                        + '<td style="text-align:right;">' + item.T_bookings + '</td>'
                        + '<td style="text-align:right;">' + item.NR + '</td>'
                        + '<td style="text-align:right;">' + item.RF + '</td>'
                        + '</tr>';
                });
                added_row += '</tbody>';
                $("#NRVsRFDestReport").append(added_row);
                $("#NRVsRFDestPopup").css("display", "none");
                $("#NRVsRFDestDate").append('Last Updated Date : ' + $scope.Date);
                $("#NRVsRFDestMonth").append('Top Results of ' + MonthName + " " + year);
                $scope.UpdatedDateNRVsRFDest = $scope.MainResultlistNRVsRFDest.length == 0 ? "" : $scope.MainResultlistNRVsRFDest[0].M_date;
            }
            else {
                $("#NRVsRFDestPopup").css("display", "none");
            }
        });
    }

    function GetNRVsRefHotel() {
        const date = new Date();

        var myVariable = date;
        var makeDate = new Date(myVariable);
        makeDate = new Date(makeDate.setMonth(makeDate.getMonth() - 1));

        let monthno = makeDate.getMonth() + 1;
        let year = makeDate.getFullYear();
        const Month = GetMonth(monthno);

        const MonthName = GetMonthName(monthno);

        const FromDate = GetFromDate(Month);
        const ToDate = GetToDate(Month);


        var query = "";
        //if ($scope.Search == false) {
        //    if ($scope.LoginMemberTypeID == 1) {
        //        query = "select H_code,HotelName,Dest,sum(NR),SUM(RF),sum(T_bookings) as TotalBkg,M_date from rpt_nr_refundable_hotel_" + $scope.Year + "_bk group by  H_code,HotelName,Dest,M_date order by TotalBkg desc LIMIT 0,5"
        //    }
        //    else if ($scope.LoginMemberTypeID == 2) {
        //        if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
        //            query = "select H_code,HotelName,Dest,sum(NR),SUM(RF),sum(T_bookings) as TotalBkg,M_date,BrId,Saleperson from rpt_nr_refundable_hotel_" + $scope.Year + "_bk where BrId=" + $scope.LoginBranchId + " and Saleperson = " + $scope.IsSalePersonUserId + " group by  H_code,HotelName,Dest,BrId,Saleperson,M_date order by TotalBkg desc LIMIT 0,5"
        //        }
        //        else {
        //            query = "select H_code,HotelName,Dest,sum(NR),SUM(RF),sum(T_bookings) as TotalBkg,M_date,BrId,Saleperson from rpt_nr_refundable_hotel_" + $scope.Year + "_bk where BrId=" + $scope.LoginBranchId + "  group by H_code,HotelName,Dest,BrId,Saleperson,M_date order by TotalBkg desc LIMIT 0,5"
        //        }
        //    }
        //}
        //else {
        //    query = "select H_code,HotelName,Dest,sum(NR),SUM(RF),sum(T_bookings) as TotalBkg,M_date,BrId,Saleperson from rpt_nr_refundable_hotel_" + $scope.Year + "_bk where BrId=" + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + " group by  H_code,HotelName,Dest,BrId,Saleperson,M_date order by TotalBkg desc LIMIT 0,5"
        //}
        if ($scope.Search == false) {
            if ($scope.LoginMemberTypeID == 1) {
                query = "select H_code,HotelName,Dest,NR,RF,T_bookings as TotalBkg,M_date from rpt_nr_refundable_hotel_new_" + $scope.Year + "_bk_months  order by TotalBkg desc LIMIT 0,5"
            }
            else if ($scope.LoginMemberTypeID == 2) {
                if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
                    query = "select H_code,HotelName,Dest,NR,RF,T_bookings as TotalBkg,M_date,BrId,Saleperson from rpt_nr_refundable_hotel_new_" + $scope.Year + "_bk_months_sp where BrId=" + $scope.LoginBranchId + " and Saleperson = " + $scope.IsSalePersonUserId + "  order by TotalBkg desc LIMIT 0,5"
                }
                else {
                    query = "select H_code,HotelName,Dest,NR,RF,T_bookings as TotalBkg,M_date,BrId,Saleperson from rpt_nr_refundable_hotel_new_" + $scope.Year + "_bk_months_br where BrId=" + $scope.LoginBranchId + "   order by TotalBkg desc LIMIT 0,5"
                }
            }
        }
        else {
            query = "select H_code,HotelName,Dest,NR,RF,T_bookings as TotalBkg,M_date,BrId,Saleperson from rpt_nr_refundable_hotel_new_" + $scope.Year + "_bk_months_sp where BrId=" + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + "  order by TotalBkg desc LIMIT 0,5"
        }

        var ReportName = "NR Vs Refundable Hotel Report";
        var settings = {
            "url": "https://osearch.xconnect.in/_opendistro/_sql",
            "method": "POST",
            "async": false,
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "query": query
            }),
        };
        var _Solution = [];
        $.ajax(settings).done(function (data) {
            var results = data['datarows'];
            _Solution = results;
            $scope.MainResultlistNRvsRFHotel = results.map(
                c => {
                    return {
                        'HotelName': (c[1]),
                        'Dest': (c[2]),
                        'T_bookings': (c[5]),
                        'NR': (c[5]) == 0 ? 0 : ((c[3]) / (c[5]) * 100).toFixed(2),
                        'RF': (c[5]) == 0 ? 0 : ((c[4]) / (c[5]) * 100).toFixed(2),
                        'M_date': (c[6]),
                    }
                }
            );
            if ($scope.MainResultlistNRvsRFHotel.length > 0) {
                $.each($scope.MainResultlistNRvsRFHotel, function (i, item) {
                    if (i == 0) {
                        added_row = '<thead class="main-head hidden-xs"><tr><th>Hotel Name</th><th>Destination</th><th style="text-align:right;" title="Reconfirm Bookings">BKG</th><th style="text-align:right;">NR %</th><th style="text-align:right;">RF %</th></tr></thead>';
                        added_row += '<tbody class="hsrr-tbody-main">';
                        $scope.Date = item.M_date;
                    }
                    added_row += '<tr>'
                        + '<td>' + item.HotelName + '</td>'
                        + '<td>' + item.Dest + '</td>'
                        + '<td style="text-align:right;">' + item.T_bookings + '</td>'
                        + '<td style="text-align:right;">' + item.NR + '</td>'
                        + '<td style="text-align:right;">' + item.RF + '</td>'
                        + '</tr>';
                });
                added_row += '</tbody>';
                $("#NRRFHotelReport").append(added_row);
                $("#NRRFHotelPopup").css("display", "none");
                $("#NRVsRFHotelDate").append('Last Updated Date : ' + $scope.Date);
                $("#NRVsRFHotelMonth").append('Top Results of ' + MonthName + " " + year);
                $scope.UpdatedDateNRvsRFHotel = $scope.MainResultlistNRvsRFHotel.length == 0 ? "" : $scope.MainResultlistNRvsRFHotel[0].M_date;
            }
            else {
                $("#NRRFHotelPopup").css("display", "none");
            }
        });
    }

    function GetNRVsRefClient() {

        const date = new Date();

        var myVariable = date;
        var makeDate = new Date(myVariable);
        makeDate = new Date(makeDate.setMonth(makeDate.getMonth() - 1));

        let monthno = makeDate.getMonth() + 1;
        let year = makeDate.getFullYear();
        const Month = GetMonth(monthno);

        const MonthName = GetMonthName(monthno);

        const FromDate = GetFromDate(Month);
        const ToDate = GetToDate(Month);


        var query = "";
        //if ($scope.Search == false) {
        //    if ($scope.LoginMemberTypeID == 1) {
        //        query = "select C_ID,ClientName,Type,Market,Owner,sum(NR),SUM(RF),sum(T_bookings) as TotalBkg,M_date from rpt_nr_refundable_clients_" + $scope.Year + "_bk group by C_ID,ClientName,Type,Market,Owner,M_date order by TotalBkg desc LIMIT 0,5"
        //    }
        //    else if ($scope.LoginMemberTypeID == 2) {
        //        if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
        //            query = "select C_ID,ClientName,Type,Market,Owner,sum(NR),SUM(RF),sum(T_bookings) as TotalBkg,M_date,BrId,Saleperson from rpt_nr_refundable_clients_" + $scope.Year + "_bk where BrId=" + $scope.LoginBranchId + " and Saleperson = " + $scope.IsSalePersonUserId + "  group by  C_ID,ClientName,Type,Market,Owner,BrId,Saleperson,M_date order by TotalBkg desc  LIMIT 0,5"
        //        }
        //        else {
        //            query = "select C_ID,ClientName,Type,Market,Owner,sum(NR),SUM(RF),sum(T_bookings) as TotalBkg,M_date,BrId,Saleperson from rpt_nr_refundable_clients_" + $scope.Year + "_bk where BrId=" + $scope.LoginBranchId + "  group by  C_ID,ClientName,Type,Market,Owner,BrId,Saleperson,M_date order by TotalBkg desc LIMIT 0,5"
        //        }
        //    }
        //}
        //else {
        //    query = "select C_ID,ClientName,Type,Market,Owner,sum(NR),SUM(RF),sum(T_bookings) as TotalBkg,M_date,BrId,Saleperson from rpt_nr_refundable_clients_" + $scope.Year + "_bk where BrId=" + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + "  group by  C_ID,ClientName,Type,Market,Owner,BrId,Saleperson,M_date order by TotalBkg desc  LIMIT 0,5"
        //}
        if ($scope.Search == false) {
            if ($scope.LoginMemberTypeID == 1) {
                query = "select C_ID,ClientName,Type,Market,Owner,NR,RF,T_bookings as TotalBkg,M_date from rpt_nr_refundable_clients_new_" + $scope.Year + "_bk_months  order by TotalBkg desc LIMIT 0,5"
            }
            else if ($scope.LoginMemberTypeID == 2) {
                if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
                    query = "select C_ID,ClientName,Type,Market,Owner,NR,RF,T_bookings as TotalBkg,M_date,BrId,Saleperson from rpt_nr_refundable_clients_new_" + $scope.Year + "_bk_months_sp where BrId=" + $scope.LoginBranchId + " and Saleperson = " + $scope.IsSalePersonUserId + "   order by TotalBkg desc  LIMIT 0,5"
                }
                else {
                    query = "select C_ID,ClientName,Type,Market,Owner,NR,RF,T_bookings as TotalBkg,M_date,BrId,Saleperson from rpt_nr_refundable_clients_new_" + $scope.Year + "_bk_months_br where BrId=" + $scope.LoginBranchId + "   order by TotalBkg desc LIMIT 0,5"
                }
            }
        }
        else {
            query = "select C_ID,ClientName,Type,Market,Owner,NR,RF,T_bookings as TotalBkg,M_date,BrId,Saleperson from rpt_nr_refundable_clients_new_" + $scope.Year + "_bk_months_sp where BrId=" + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + "  order by TotalBkg desc  LIMIT 0,5"
        }

        var ReportName = "NR Vs Refundable Client Report";
        var settings = {
            "url": "https://osearch.xconnect.in/_opendistro/_sql",
            "method": "POST",
            "async": false,
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "query": query
            }),
        };
        var _Solution = [];
        $.ajax(settings).done(function (data) {
            var results = data['datarows'];
            _Solution = results;
            $scope.MainResultlistNRvsRFClient = results.map(
                c => {
                    return {
                        'ClientName': (c[1]),
                        'Type': (c[2]),
                        'Market': (c[3]),
                        'Owner': (c[4]),
                        'NR': (c[7]) == 0 ? 0 : ((c[5]) / (c[7]) * 100).toFixed(2),
                        'RF': (c[7]) == 0 ? 0 : ((c[6]) / (c[7]) * 100).toFixed(2),
                        'T_bookings': (c[7]),
                        'M_date': (c[8])

                    }
                }
            );
            if ($scope.MainResultlistNRvsRFClient.length > 0) {
                $.each($scope.MainResultlistNRvsRFClient, function (i, item) {
                    if (i == 0) {
                        added_row = '<thead class="main-head hidden-xs"><tr><th>Client Name</th><th>Type</th><th>Market</th><th title="Key Account Manager">KAM</th><th style="text-align:right;" title="Reconfirm Bookings">BKG</th><th style="text-align:right;">NR %</th><th style="text-align:right;">RF %</th></tr></thead>';
                        added_row += '<tbody class="hsrr-tbody-main">';
                        $scope.Date = item.M_date;
                    }
                    added_row += '<tr>'
                        + '<td>' + item.ClientName + '</td>'
                        + '<td>' + item.Type + '</td>'
                        + '<td>' + item.Market + '</td>'
                        + '<td>' + item.Owner + '</td>'
                        + '<td style="text-align:right;">' + item.T_bookings + '</td>'
                        + '<td style="text-align:right;">' + item.NR + '</td>'
                        + '<td style="text-align:right;">' + item.RF + '</td>'
                        + '</tr>';
                });
                added_row += '</tbody>';
                $("#NRVsRefClientReport").append(added_row);
                $("#NRVsRefClientPopup").css("display", "none");
                $("#NRVsRFClientDate").append('Last Updated Date : ' + $scope.Date);
                $("#NRVsRFClientMonths").append('Top Results of ' + MonthName + " " + year);
                $scope.UpdatedDateNRvsRFClient = $scope.MainResultlistNRvsRFClient.length == 0 ? "" : $scope.MainResultlistNRvsRFClient[0].M_date;
            }
            else {
                $("#NRVsRefClientPopup").css("display", "none");
            }
        });
    }

    function GetNRVsRefSupplier() {

        const date = new Date();

        var myVariable = date;
        var makeDate = new Date(myVariable);
        makeDate = new Date(makeDate.setMonth(makeDate.getMonth() - 1));

        let monthno = makeDate.getMonth() + 1;
        let year = makeDate.getFullYear();
        const Month = GetMonth(monthno);

        const MonthName = GetMonthName(monthno);

        const FromDate = GetFromDate(Month);
        const ToDate = GetToDate(Month);


        var query = "";
        //if ($scope.Search == false) {
        //    if ($scope.LoginMemberTypeID == 1) {
        //        query = "select Supp_Id,SupplierName,Type,Sum(NR),SUM(RF),Sum(T_bookings) as TotalBkg ,M_date from rpt_nr_refundable_suppliers_" + $scope.Year + "_bk group by Supp_Id,SupplierName,Type,M_date  order by TotalBkg desc LIMIT 0,5"
        //    }
        //    else if ($scope.LoginMemberTypeID == 2) {
        //        if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
        //            query = "select Supp_Id,SupplierName,Type,Sum(NR),SUM(RF),Sum(T_bookings) as TotalBkg,M_date,BrId,Saleperson from rpt_nr_refundable_suppliers_" + $scope.Year + "_bk  where BrId=" + $scope.LoginBranchId + " and Saleperson = " + $scope.IsSalePersonUserId + " group by Supp_Id,SupplierName,Type,M_date,BrId,Saleperson order by TotalBkg desc  LIMIT 0,5"
        //        }
        //        else {
        //            query = "select Supp_Id,SupplierName,Type,Sum(NR),SUM(RF),Sum(T_bookings) as TotalBkg,M_date,BrId from rpt_nr_refundable_suppliers_" + $scope.Year + "_bk  where BrId=" + $scope.LoginBranchId + " group by Supp_Id,SupplierName,Type,M_date,BrId order by TotalBkg desc  LIMIT 0,5"
        //        }
        //    }
        //}
        //else {
        //    query = "select Supp_Id,SupplierName,Type,Sum(NR),SUM(RF),Sum(T_bookings) as TotalBkg,M_date,BrId,Saleperson from rpt_nr_refundable_suppliers_" + $scope.Year + "_bk  where BrId=" + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + " group by Supp_Id,SupplierName,Type,M_date,BrId,Saleperson order by TotalBkg desc  LIMIT 0,5"
        //}

        if ($scope.Search == false) {
            if ($scope.LoginMemberTypeID == 1) {
                query = "select Supp_Id,SupplierName,Type,NR,RF,T_bookings as TotalBkg ,M_date from rpt_nr_refundable_suppliers_new_" + $scope.Year + "_bk_months   order by TotalBkg desc LIMIT 0,5"
            }
            else if ($scope.LoginMemberTypeID == 2) {
                if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
                    query = "select Supp_Id,SupplierName,Type,NR,RF,T_bookings as TotalBkg ,M_date,BrId,Saleperson from rpt_nr_refundable_suppliers_new_" + $scope.Year + "_bk_months_sp  where BrId=" + $scope.LoginBranchId + " and Saleperson = " + $scope.IsSalePersonUserId + " order by TotalBkg desc  LIMIT 0,5"
                }
                else {
                    query = "select Supp_Id,SupplierName,Type,NR,RF,T_bookings as TotalBkg ,M_date,BrId from rpt_nr_refundable_suppliers_new_" + $scope.Year + "_bk_months_br  where BrId=" + $scope.LoginBranchId + "  order by TotalBkg desc  LIMIT 0,5"
                }
            }
        }
        else {
            query = "select Supp_Id,SupplierName,Type,NR,RF,T_bookings as TotalBkg ,M_date,BrId,Saleperson from rpt_nr_refundable_suppliers_new_" + $scope.Year + "_bk_months_sp  where BrId=" + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + " order by TotalBkg desc  LIMIT 0,5"
        }

        var ReportName = "NR Vs Refundable Supplier Report";
        var settings = {
            "url": "https://osearch.xconnect.in/_opendistro/_sql",
            "method": "POST",
            "async": false,
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "query": query
            }),
        };
        var _Solution = [];
        $.ajax(settings).done(function (data) {
            var results = data['datarows'];
            _Solution = results;
            $scope.MainResultlistNRvsRFSupp = results.map(
                c => {
                    return {
                        'SupplierName': (c[1]),
                        'Type': (c[2]),
                        'NR': (c[5]) == 0 ? 0 : ((c[3]) / (c[5]) * 100).toFixed(2),
                        'RF': (c[5]) == 0 ? 0 : ((c[4]) / (c[5]) * 100).toFixed(2),
                        'T_bookings': (c[5]),
                        'M_date': (c[6]),
                    }
                }
            );
            if ($scope.MainResultlistCXLDest.length > 0) {
                $.each($scope.MainResultlistNRvsRFSupp, function (i, item) {
                    if (i == 0) {
                        added_row = '<thead class="main-head hidden-xs"><tr><th>Supplier Name</th><th>Type</th><th style="text-align:right;" title="Reconfirm Bookings">BKG</th><th style="text-align:right;">NR %</th><th style="text-align:right;">RF %</th></tr ></thead >';
                        added_row += '<tbody class="hsrr-tbody-main">';
                        $scope.Date = item.M_date;
                    }
                    added_row += '<tr>'
                        + '<td>' + item.SupplierName + '</td>'
                        + '<td>' + item.Type + '</td>'
                        + '<td style="text-align:right;">' + item.T_bookings + '</td>'
                        + '<td style="text-align:right;">' + item.NR + '</td>'
                        + '<td style="text-align:right;">' + item.RF + '</td>'
                        + '</tr>';
                });
                added_row += '</tbody>';
                $("#NRvsRFSuppReport").append(added_row);
                $("#NRvsRFSuppPopup").css("display", "none");
                $("#NRVsRFSupplierDate").append('Last Updated Date : ' + $scope.Date);
                $("#NRVsRFSupplierMonth").append('Top Results of ' + MonthName + " " + year);
                $scope.UpdatedDateNRvsRFSuppt = $scope.MainResultlistNRvsRFSupp.length == 0 ? "" : $scope.MainResultlistNRvsRFSupp[0].M_date;
            }
            else {
                $("#NRvsRFSuppPopup").css("display", "none");
            }
        });
    }


    function GetClientGrowthLwBookings() {
        var query = "";
        if ($scope.Search == false) {
            if ($scope.LoginMemberTypeID == 1) {
                query = "select ClientName, Type, Market, Owner,T_bookings, CW, LW2, LW3, LW4,M_date,BrId,Saleperson from rpt_nr_salesclientgrowth_booking_" + $scope.Year + "_bk order by T_bookings desc LIMIT 0, 5"
            }
            else if ($scope.LoginMemberTypeID == 2) {
                if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {                    
                    query = "select ClientName, Type, Market, Owner,T_bookings, CW, LW2, LW3, LW4,M_date,BrId,Saleperson from rpt_nr_salesclientgrowth_booking_" + $scope.Year + "_bk where  BrId=" + $scope.LoginBranchId + " and Saleperson = " + $scope.IsSalePersonUserId + " order by T_bookings desc LIMIT 0, 5"
                }
                else {                   
                    query = "select ClientName, Type, Market, Owner,T_bookings, CW, LW2, LW3, LW4,M_date,BrId,Saleperson from rpt_nr_salesclientgrowth_booking_" + $scope.Year + "_bk where  BrId=" + $scope.LoginBranchId + "  order by T_bookings desc LIMIT 0, 5"
                }
            }
        }
        else {            
            query = "select ClientName, Type, Market, Owner,T_bookings, CW, LW2, LW3, LW4,M_date,BrId,Saleperson from rpt_nr_salesclientgrowth_booking_" + $scope.Year + "_bk where  BrId=" + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + " order by T_bookings desc LIMIT 0, 5"
        }

        var ReportName = "SALES CLIENTS GROWTH VS LW - BOOKINGS";
        var settings = {
            "url": "https://osearch.xconnect.in/_opendistro/_sql",
            "method": "POST",
            "async": false,
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "query": query
            }),
        };
        var _Solution = [];
        $.ajax(settings).done(function (data) {
            var results = data['datarows'];
            _Solution = results;
            $scope.MainResultlistSalesClientGwth = results.map(
                c => {
                    return {                       
                        'ClientName': (c[0]),
                        'Type': (c[1]),
                        'Market': (c[2]) ,
                        'Owner': (c[3]),
                        'T_bookings': (c[4]),
                        'CW': (c[5]),
                        'LW2': (c[6]),
                        'LW3': (c[7]),
                        'LW4': (c[8]),
                        'M_date': (c[9]),
                    }
                }
            );
            if ($scope.MainResultlistSalesClientGwth.length > 0) {
                $.each($scope.MainResultlistSalesClientGwth, function (i, item) {
                    if (i == 0) {
                        added_row = '<thead class="main-head hidden-xs">< tr ><th>Client Name</th><th>Type</th><th>Market</th><th  title="Key Account Manager">KAM</th><th style="text-align:right;"  title="Reconfirm Bookings">BKG</th><th style="text-align:right;" title="Current Week Bookings">CW</th><th style="text-align:right;" title="Last 2nd Week Bookings"> LW2</th><th style="text-align:right;"  title="Last 3rd Week Bookings">LW3</th><th style="text-align:right;"  title="Last 4th Week Bookings">LW4</th></tr ></thead >';
                        added_row += '<tbody class="hsrr-tbody-main">';
                        $scope.Date = item.M_date;
                    }
                    added_row += '<tr>'
                        + '<td>' + item.ClientName + '</td>'
                        + '<td>' + item.Type + '</td>'
                        + '<td>' + item.Market + '</td>'
                        + '<td>' + item.Owner + '</td>'
                        + '<td style="text-align:right;">' + item.T_bookings + '</td>'
                        + '<td style="text-align:right;">' + item.CW + '</td>'
                        + '<td style="text-align:right;">' + item.LW2 + '</td>'
                        + '<td style="text-align:right;">' + item.LW3 + '</td>'
                        + '<td style="text-align:right;">' + item.LW4 + '</td>'
                        + '</tr>';
                });
                added_row += '</tbody>';
                $("#ClientGrowthLwBookingsRpt").append(added_row);
                $("#ClientGrowthLwBookingsPopup").css("display", "none");
                $("#ClientGrowthLwBookingsDate").append('Last Updated Date : ' + $scope.Date);
                $scope.UpdatedDateSalesgwtBkg = $scope.MainResultlistSalesClientGwth.length == 0 ? "" : $scope.MainResultlistSalesClientGwth[0].M_date;
            }
            else {
                $("#ClientGrowthLwBookingsPopup").css("display", "none");
            }
        });
    }
    function GetClientGrowthLwDestination() {
        var query = "";
        if ($scope.Search == false) {
            if ($scope.LoginMemberTypeID == 1) {
                query = "select HotelName,Market,T_bookings, CW, LW2, LW3, LW4,M_date,BrId,Saleperson from rpt_nr_salesclientgrowth_destination_" + $scope.Year + "_bk order by T_bookings desc LIMIT 0, 5"
            }
            else if ($scope.LoginMemberTypeID == 2) {
                if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
                    query = "select HotelName,Market,T_bookings, CW, LW2, LW3, LW4,M_date,BrId,Saleperson from rpt_nr_salesclientgrowth_destination_" + $scope.Year + "_bk where  BrId=" + $scope.LoginBranchId + " and Saleperson = " + $scope.IsSalePersonUserId + " order by T_bookings desc LIMIT 0, 5"
                }
                else {
                    query = "select HotelName,Market,T_bookings, CW, LW2, LW3, LW4,M_date,BrId,Saleperson from rpt_nr_salesclientgrowth_destination_" + $scope.Year + "_bk where  BrId=" + $scope.LoginBranchId + "  order by T_bookings desc LIMIT 0, 5"
                }
            }
        }
        else {
            query = "select HotelName,  Market,T_bookings, CW, LW2, LW3, LW4,M_date,BrId,Saleperson from rpt_nr_salesclientgrowth_destination_" + $scope.Year + "_bk where  BrId=" + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + " order by T_bookings desc LIMIT 0, 5"
        }

        var ReportName = "SALES CLIENTS GROWTH VS LW - Destination";
        var settings = {
            "url": "https://osearch.xconnect.in/_opendistro/_sql",
            "method": "POST",
            "async": false,
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "query": query
            }),
        };
        var _Solution = [];
        $.ajax(settings).done(function (data) {
            var results = data['datarows'];
            _Solution = results;
            $scope.MainResultlstSalesClientGwthDest = results.map(
                c => {
                    return {
                        'HotelName': (c[0]),
                        'Market': (c[1]),
                        'T_bookings': (c[2]),                      
                        'CW': (c[3]),
                        'LW2': (c[4]),
                        'LW3': (c[5]),
                        'LW4': (c[6]),                       
                        'M_date': (c[7]),
                    }
                }
            );
            if ($scope.MainResultlstSalesClientGwthDest.length > 0) {
                $.each($scope.MainResultlstSalesClientGwthDest, function (i, item) {
                    if (i == 0) {
                        added_row = '<thead class="main-head hidden-xs">< tr ><th>Hotel Name</th><th>Destination</th><th style="text-align:right;" title="Reconfirm Bookings">BKG</th><th style="text-align:right;" title="Current Week Bookings" >CW</th><th style="text-align:right;" title="Last 2nd Week Bookings">LW2</th><th style="text-align:right;"  title="Last 3rd Week Bookings">LW3</th><th style="text-align:right;"  title="Last 4th Week Bookings">LW4</th></tr ></thead >';
                        added_row += '<tbody class="hsrr-tbody-main">';
                        $scope.Date = item.M_date;
                    }
                    added_row += '<tr>'
                        + '<td>' + item.HotelName + '</td>'                       
                        + '<td>' + item.Market + '</td>'
                        + '<td style="text-align:right;">' + item.T_bookings + '</td>'
                        + '<td style="text-align:right;">' + item.CW + '</td>'
                        + '<td style="text-align:right;">' + item.LW2 + '</td>'
                        + '<td style="text-align:right;">' + item.LW3 + '</td>'
                        + '<td style="text-align:right;">' + item.LW4 + '</td>'
                        + '</tr>';
                });
                added_row += '</tbody>';
                $("#ClientGrowthLWDestRpt").append(added_row);
                $("#ClientGrowthLWDestPopup").css("display", "none");
                $("#ClientGrowthLWDestDate").append('Last Updated Date : ' + $scope.Date);
                $scope.UpdatedDateSalesgwtdest = $scope.MainResultlstSalesClientGwthDest.length == 0 ? "" : $scope.MainResultlstSalesClientGwthDest[0].M_date;
            }
            else {
                $("#ClientGrowthLWDestPopup").css("display", "none");
            }
        });        
    }
    function GetClientGrowthLwRN() {
        //rpt_nr_salesclientgrowth_rn
        var query = "";
        if ($scope.Search == false) {
            if ($scope.LoginMemberTypeID == 1) {
                query = "select Dest,RN, CW, LW2, LW3, LW4,M_date,BrId,Saleperson,ClientName from rpt_nr_salesclientgrowth_rn_" + $scope.Year + "_bk order by RN desc LIMIT 0, 5"
            }
            else if ($scope.LoginMemberTypeID == 2) {
                if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
                    query = "select Dest,RN, CW, LW2, LW3, LW4,M_date,BrId,Saleperson ,ClientName from rpt_nr_salesclientgrowth_rn_" + $scope.Year + "_bk where  BrId=" + $scope.LoginBranchId + " and Saleperson = " + $scope.IsSalePersonUserId + " order by RN desc LIMIT 0, 5"
                }
                else {
                    query = "select Dest,RN, CW, LW2, LW3, LW4,M_date,BrId,Saleperson ,ClientName from rpt_nr_salesclientgrowth_rn_" + $scope.Year + "_bk where  BrId=" + $scope.LoginBranchId + "  order by RN desc LIMIT 0, 5"
                }
            }
        }
        else {
            query = "select Dest,RN, CW, LW2, LW3, LW4,M_date,BrId,Saleperson,ClientName from rpt_nr_salesclientgrowth_rn_" + $scope.Year + "_bk where  BrId=" + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + " order by RN desc LIMIT 0, 5"
        }

        var ReportName = "SALES CLIENTS GROWTH VS LW - RN";
        var settings = {
            "url": "https://osearch.xconnect.in/_opendistro/_sql",
            "method": "POST",
            "async": false,
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "query": query
            }),
        };
        var _Solution = [];
        $.ajax(settings).done(function (data) {
            var results = data['datarows'];
            _Solution = results;
            $scope.MainResultlstSalesClientGwthRN = results.map(
                c => {
                    return {                        
                        'Dest': (c[0]),
                        'RN': (c[1]),
                        'CW': (c[2]),
                        'LW2': (c[3]),
                        'LW3': (c[4]),
                        'LW4': (c[5]),
                        'M_date': (c[6]),
                        'ClientName': (c[9]),
                    }
                }
            );
            if ($scope.MainResultlstSalesClientGwthRN.length > 0) {
                $.each($scope.MainResultlstSalesClientGwthRN, function (i, item) {
                    if (i == 0) {
                        added_row = '<thead class="main-head hidden-xs">< tr ><th>Destination</th><th>Client Name</th><th style="text-align:right;" title="Total Room Night">RN</th><th style="text-align:right;" title="Current Week Room Nights">CW</th><th style="text-align:right;" title="Last 2nd Week Room Nights">LW2</th><th style="text-align:right;" title="Last 3rd Week Room Nights">LW3</th><th style="text-align:right;" title="Last 4th Week Room Nights">LW4</th></tr ></thead >';
                        added_row += '<tbody class="hsrr-tbody-main">';
                        $scope.Date = item.M_date;
                    }
                    added_row += '<tr>'                    
                        + '<td>' + item.Dest + '</td>'
                        + '<td>' + item.ClientName + '</td>'
                        + '<td style="text-align:right;">' + item.RN + '</td>'
                        + '<td style="text-align:right;">' + item.CW + '</td>'
                        + '<td style="text-align:right;">' + item.LW2 + '</td>'
                        + '<td style="text-align:right;">' + item.LW3 + '</td>'
                        + '<td style="text-align:right;">' + item.LW4 + '</td>'
                        + '</tr>';
                });
                added_row += '</tbody>';
                $("#ClientGrowthLWRNRpt").append(added_row);
                $("#ClientGrowthLWRNPopup").css("display", "none");
                $("#ClientGrowthLWRNDate").append('Last Updated Date : ' + $scope.Date);
                $scope.UpdatedDateSalesgwtRN = $scope.MainResultlstSalesClientGwthRN.length == 0 ? "" : $scope.MainResultlstSalesClientGwthRN[0].M_date;
            }
            else {
                $("#ClientGrowthLWRNPopup").css("display", "none");
            }
        });
    }

    function GetBookingErrLwClients() {        
        var query = "";
        if ($scope.Search == false) {
            if ($scope.LoginMemberTypeID == 1) {
                query = "select CName, Type, Market, Owner,T_bookings, CW_per, LW2_per, LW3_per, LW4_per,M_date,BrId,Saleperson from rpt_nr_salesbookingerr_clients_" + $scope.Year + "_bk order by T_bookings desc LIMIT 0, 5"
            }
            else if ($scope.LoginMemberTypeID == 2) {
                if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
                    query = "select CName, Type, Market, Owner,T_bookings, CW_per, LW2_per, LW3_per, LW4_per,M_date,BrId,Saleperson from rpt_nr_salesbookingerr_clients_" + $scope.Year + "_bk where  BrId=" + $scope.LoginBranchId + " and Saleperson = " + $scope.IsSalePersonUserId + " order by T_bookings desc LIMIT 0, 5"
                }
                else {
                    query = "select CName, Type, Market, Owner,T_bookings, CW_per, LW2_per, LW3_per, LW4_per,M_date,BrId,Saleperson from rpt_nr_salesbookingerr_clients_" + $scope.Year + "_bk where  BrId=" + $scope.LoginBranchId + "  order by T_bookings desc LIMIT 0, 5"
                }
            }
        }
        else {
            query = "select CName, Type, Market, Owner,T_bookings, CW_per, LW2_per, LW3_per, LW4_per,M_date,BrId,Saleperson from rpt_nr_salesbookingerr_clients_" + $scope.Year + "_bk where  BrId=" + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + " order by T_bookings desc LIMIT 0, 5"
        }

        var ReportName = "SALES BOOKING ERR VS LW - CLIENTS";
        var settings = {
            "url": "https://osearch.xconnect.in/_opendistro/_sql",
            "method": "POST",
            "async": false,
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "query": query
            }),
        };
        var _Solution = [];
        $.ajax(settings).done(function (data) {
            var results = data['datarows'];
            _Solution = results;
            $scope.MainResultlstBookErrClient = results.map(
                c => {
                    return {                       
                        'ClientName': (c[0]),
                        'Type': (c[1]),
                        'Market': (c[2]),
                        'Owner': (c[3]),
                        'T_bookings': (c[4]),
                        'CW_per': (c[5]).toFixed(2),
                        'LW2_per': (c[6]).toFixed(2),
                        'LW3_per': (c[7]).toFixed(2),
                        'LW4_per': (c[8]).toFixed(2),
                        'M_date': (c[9]),
                    }
                }
            );
            if ($scope.MainResultlstBookErrClient.length > 0) {
                $.each($scope.MainResultlstBookErrClient, function (i, item) {
                    if (i == 0) {
                        added_row = '<thead class="main-head hidden-xs">< tr ><th>Client Name </th><th>Type</th><th>Market</th><th title="Key Acccount Manager">KAM</th><th style="text-align:right;"  title="Total Bookings">BKG</th><th style="text-align:right;" title="Current Week Percentage">CW %</th><th style="text-align:right;" title="Last 2nd Week Percentage">LW2 %</th><th style="text-align:right;" title="Last 3rd Week Percentage">LW3 %</th><th style="text-align:right;" title="Last 4th Week Percentage">LW4 %</th></tr ></thead >';
                        added_row += '<tbody class="hsrr-tbody-main">';
                        $scope.Date = item.M_date;
                    }
                    added_row += '<tr>'
                        + '<td>' + item.ClientName + '</td>'
                        + '<td>' + item.Type + '</td>'
                        + '<td>' + item.Market + '</td>'
                        + '<td>' + item.Owner + '</td>'
                        + '<td style="text-align:right;">' + item.T_bookings + '</td>'
                        + '<td style="text-align:right;">' + item.CW_per + '</td>'
                        + '<td style="text-align:right;">' + item.LW2_per + '</td>'
                        + '<td style="text-align:right;">' + item.LW3_per + '</td>'
                        + '<td style="text-align:right;">' + item.LW4_per + '</td>'
                        + '</tr>';
                });
                added_row += '</tbody>';
                $("#BookingErrLWClientsRpt").append(added_row);
                $("#BookingErrLWClientsPopup").css("display", "none");
                $("#BookingErrLWClientsDate").append('Last Updated Date : ' + $scope.Date);
                $scope.UpdatedDateBookErrClient = $scope.MainResultlstBookErrClient.length == 0 ? "" : $scope.MainResultlstBookErrClient[0].M_date;
            }
            else {
                $("#BookingErrLWClientsPopup").css("display", "none");
            }
        });
    }
    function GetBookingErrLwSupplier() {
        //rpt_nr_salesbookingerr_supplier_2024_bk
        var query = "";
        //if ($scope.Search == false) {
        //    if ($scope.LoginMemberTypeID == 1) {
        //        query = "select SupplierName,T_bookings, CW_per, LW2_per, LW3_per, LW4_per,M_date,BrId,Saleperson from rpt_nr_salesbookingerr_supplier_" + $scope.Year + "_bk order by T_bookings desc LIMIT 0, 5"
        //    }
        //    else if ($scope.LoginMemberTypeID == 2) {
        //        if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
        //            query = "select SupplierName,T_bookings, CW_per, LW2_per, LW3_per, LW4_per,M_date,BrId,Saleperson from rpt_nr_salesbookingerr_supplier_" + $scope.Year + "_bk where  BrId=" + $scope.LoginBranchId + " and Saleperson = " + $scope.IsSalePersonUserId + " order by T_bookings desc LIMIT 0, 5"
        //        }
        //        else {
        //            query = "select SupplierName,T_bookings, CW_per, LW2_per, LW3_per, LW4_per,M_date,BrId,Saleperson from rpt_nr_salesbookingerr_supplier_" + $scope.Year + "_bk where  BrId=" + $scope.LoginBranchId + "  order by T_bookings desc LIMIT 0, 5"
        //        }
        //    }
        //}
        //else {
        //    query = "select SupplierName,T_bookings, CW_per, LW2_per, LW3_per, LW4_per,M_date,BrId,Saleperson from rpt_nr_salesbookingerr_supplier_" + $scope.Year + "_bk where  BrId=" + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + " order by T_bookings desc LIMIT 0, 5"
        //}
        if ($scope.Search == false) {
            if ($scope.LoginMemberTypeID == 1) {
                query = "select SupplierName,SUM(T_bookings) as T_bookings , AVG(CW_per) as CW_per, AVG(LW2_per) as LW2_per, AVG(LW3_per) as LW3_per, AVG(LW4_per) as LW4_per,M_date from rpt_nr_salesbookingerr_supplier_" + $scope.Year + "_bk Group by SupplierName,M_date order by T_bookings desc LIMIT 0, 5"
            }
            else if ($scope.LoginMemberTypeID == 2) {
                if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
                    query = "select SupplierName,SUM(T_bookings) as T_bookings , AVG(CW_per) as CW_per, AVG(LW2_per) as LW2_per, AVG(LW3_per) as LW3_per, AVG(LW4_per) as LW4_per ,M_date from rpt_nr_salesbookingerr_supplier_" + $scope.Year + "_bk where  BrId=" + $scope.LoginBranchId + " and Saleperson = " + $scope.IsSalePersonUserId + " Group by SupplierName ,M_date order by T_bookings desc LIMIT 0, 5"
                }
                else {
                    query = "select SupplierName,SUM(T_bookings) as T_bookings , AVG(CW_per) as CW_per, AVG(LW2_per) as LW2_per, AVG(LW3_per) as LW3_per, AVG(LW4_per) as LW4_per ,M_date from rpt_nr_salesbookingerr_supplier_" + $scope.Year + "_bk where  BrId=" + $scope.LoginBranchId + " Group by SupplierName ,M_date order by T_bookings desc LIMIT 0, 5"
                }
            }
        }
        else {
            query = "select SupplierName,SUM(T_bookings) as T_bookings , AVG(CW_per) as CW_per, AVG(LW2_per) as LW2_per, AVG(LW3_per) as LW3_per, AVG(LW4_per) as LW4_per ,M_date from rpt_nr_salesbookingerr_supplier_" + $scope.Year + "_bk where  BrId=" + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + " Group by SupplierName ,M_date order by T_bookings desc LIMIT 0, 5"
        }

        var ReportName = "SALES BOOKING ERR VS LW - CLIENTS";
        var settings = {
            "url": "https://osearch.xconnect.in/_opendistro/_sql",
            "method": "POST",
            "async": false,
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "query": query
            }),
        };
        var _Solution = [];
        $.ajax(settings).done(function (data) {
            var results = data['datarows'];
            _Solution = results;
            $scope.MainResultlstBookErrSupp = results.map(
                c => {
                    return {
                        'SupplierName': (c[0]),                       
                        'T_bookings': (c[1]),
                        'CW_per': (c[2]).toFixed(2),
                        'LW2_per': (c[3]).toFixed(2),
                        'LW3_per': (c[4]).toFixed(2),
                        'LW4_per': (c[5]).toFixed(2),
                        'M_date': (c[6]),
                    }
                }
            );
            if ($scope.MainResultlstBookErrSupp.length > 0) {
                $.each($scope.MainResultlstBookErrSupp, function (i, item) {
                    if (i == 0) {
                        added_row = '<thead class="main-head hidden-xs">< tr ><th>Supplier Name </th><th style="text-align:right;"  title="Total Bookings">BKG</th><th style="text-align:right;"  title="Current Week Percentage">CW %</th><th style="text-align:right;"  title="Last 2nd Week Percentage">LW2 %</th><th style="text-align:right;"  title="Last 3rd Week Percentage">LW3 %</th><th style="text-align:right;"  title="Last 4th Week Percentage">LW4 %</th></tr ></thead >';
                        added_row += '<tbody class="hsrr-tbody-main">';
                        $scope.Date = item.M_date;
                    }
                    added_row += '<tr>'
                        + '<td>' + item.SupplierName + '</td>'                       
                        + '<td style="text-align:right;">' + item.T_bookings + '</td>'
                        + '<td style="text-align:right;">' + item.CW_per + '</td>'
                        + '<td style="text-align:right;">' + item.LW2_per + '</td>'
                        + '<td style="text-align:right;">' + item.LW3_per + '</td>'
                        + '<td style="text-align:right;">' + item.LW4_per + '</td>'
                        + '</tr>';
                });
                added_row += '</tbody>';
                $("#BookingErrLWSuppRpt").append(added_row);
                $("#BookingErrLWSuppPopup").css("display", "none");
                $("#BookingErrLWSuppDate").append('Last Updated Date : ' + $scope.Date);
                $scope.UpdatedDateBookErrSupp = $scope.MainResultlstBookErrSupp.length == 0 ? "" : $scope.MainResultlstBookErrSupp[0].M_date;
            }
            else {
                $("#BookingErrLWSuppPopup").css("display", "none");
            }
        });
    }
    function GetBookingErrLwDestination() {
        var query = "";
        //if ($scope.Search == false) {
        //    if ($scope.LoginMemberTypeID == 1) {
        //        query = "select Dest,T_bookings, CW_per, LW2_per, LW3_per, LW4_per,M_date,BrId,Saleperson from rpt_nr_salesbookingerr_destination_" + $scope.Year + "_bk order by T_bookings desc LIMIT 0, 5"
        //    }
        //    else if ($scope.LoginMemberTypeID == 2) {
        //        if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
        //            query = "select Dest,T_bookings, CW_per, LW2_per, LW3_per, LW4_per,M_date,BrId,Saleperson from rpt_nr_salesbookingerr_destination_" + $scope.Year + "_bk where  BrId=" + $scope.LoginBranchId + " and Saleperson = " + $scope.IsSalePersonUserId + " order by T_bookings desc LIMIT 0, 5"
        //        }
        //        else {
        //            query = "select Dest,T_bookings, CW_per, LW2_per, LW3_per, LW4_per,M_date,BrId,Saleperson from rpt_nr_salesbookingerr_destination_" + $scope.Year + "_bk where  BrId=" + $scope.LoginBranchId + "  order by T_bookings desc LIMIT 0, 5"
        //        }
        //    }
        //}
        //else {
        //    query = "select Dest,T_bookings, CW_per, LW2_per, LW3_per, LW4_per,M_date,BrId,Saleperson from rpt_nr_salesbookingerr_destination_" + $scope.Year + "_bk where  BrId=" + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + " order by T_bookings desc LIMIT 0, 5"
        //}

        if ($scope.Search == false) {
            if ($scope.LoginMemberTypeID == 1) {
                query = "select Dest,SUM(T_bookings) as T_bookings,SUM(CW_per) as CW_per, SUM(LW2_per) as LW2_per, SUM(LW3_per) as LW3_per, SUM(LW4_per) as LW4_per,M_date from rpt_nr_salesbookingerr_destination_" + $scope.Year + "_bk Group by Dest,M_date  order by T_bookings desc LIMIT 0, 5"
            }
            else if ($scope.LoginMemberTypeID == 2) {
                if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
                    query = "select Dest,SUM(T_bookings) as T_bookings,SUM(CW_per) as CW_per, SUM(LW2_per) as LW2_per, SUM(LW3_per) as LW3_per, SUM(LW4_per) as LW4_per ,M_date from rpt_nr_salesbookingerr_destination_" + $scope.Year + "_bk where  BrId=" + $scope.LoginBranchId + " and Saleperson = " + $scope.IsSalePersonUserId + " Group by Dest,M_date order by T_bookings desc LIMIT 0, 5"
                }
                else {
                    query = "select Dest,SUM(T_bookings) as T_bookings,SUM(CW_per) as CW_per, SUM(LW2_per) as LW2_per, SUM(LW3_per) as LW3_per, SUM(LW4_per) as LW4_per ,M_date from rpt_nr_salesbookingerr_destination_" + $scope.Year + "_bk where  BrId=" + $scope.LoginBranchId + " Group by Dest,M_date  order by T_bookings desc LIMIT 0, 5"
                }
            }
        }
        else {
            query = "select Dest,SUM(T_bookings) as T_bookings,SUM(CW_per) as CW_per, SUM(LW2_per) as LW2_per, SUM(LW3_per) as LW3_per, SUM(LW4_per) as LW4_per ,M_date from rpt_nr_salesbookingerr_destination_" + $scope.Year + "_bk where  BrId=" + $scope.SaleABranchId + " and Saleperson = " + $scope.SalesAUserId + " Group by Dest,M_date order by T_bookings desc LIMIT 0, 5"
        }

        var ReportName = "SALES BOOKING ERR VS LW - DESTINATION";
        var settings = {
            "url": "https://osearch.xconnect.in/_opendistro/_sql",
            "method": "POST",
            "async": false,
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "query": query
            }),
        };
        var _Solution = [];
        $.ajax(settings).done(function (data) {
            var results = data['datarows'];
            _Solution = results;
            $scope.MainResultlstBookErrSupp = results.map(
                c => {
                    return {
                        'Dest': (c[0]),
                        'T_bookings': (c[1]),
                        'CW_per': (c[2]).toFixed(2),
                        'LW2_per': (c[3]).toFixed(2),
                        'LW3_per': (c[4]).toFixed(2),
                        'LW4_per': (c[5]).toFixed(2),
                        'M_date': (c[6]),
                    }
                }
            );
            if ($scope.MainResultlstBookErrSupp.length > 0) {
                $.each($scope.MainResultlstBookErrSupp, function (i, item) {
                    if (i == 0) {
                        added_row = '<thead class="main-head hidden-xs">< tr ><th>Destination</th><th style="text-align:right;" title="Total Bookings">BKG</th><th style="text-align:right;" title="Current Week Percentage">CW %</th><th style="text-align:right;" title="Last 2nd Week Percentage">LW2 %</th><th style="text-align:right;"  title="Last 3rd Week Percentage">LW3 %</th><th style="text-align:right;"  title="Last 4th Week Percentage">LW4 %</th></tr ></thead >';
                        added_row += '<tbody class="hsrr-tbody-main">';
                        $scope.Date = item.M_date;
                    }
                    added_row += '<tr>'
                        + '<td>' + item.Dest + '</td>'
                        + '<td style="text-align:right;">' + item.T_bookings + '</td>'
                        + '<td style="text-align:right;">' + item.CW_per + '</td>'
                        + '<td style="text-align:right;">' + item.LW2_per + '</td>'
                        + '<td style="text-align:right;">' + item.LW3_per + '</td>'
                        + '<td style="text-align:right;">' + item.LW4_per + '</td>'
                        + '</tr>';
                });
                added_row += '</tbody>';
                $("#BookingErrLWDestRpt").append(added_row);
                $("#BookingErrLWDestPopup").css("display", "none");
                $("#BookingErrLWDestDate").append('Last Updated Date : ' + $scope.Date);
                $scope.UpdatedDateBookErrSupp = $scope.MainResultlstBookErrSupp.length == 0 ? "" : $scope.MainResultlstBookErrSupp[0].M_date;
            }
            else {
                $("#BookingErrLWDestPopup").css("display", "none");
            }
        });
    }





    function GetMonth(Month) {
        switch (String(Month)) {
            case "1":
                return "jan";
                break;
            case "2":
                return "feb";
                break;
            case "3":
                return "mar";
                break;
            case "4":
                return "apr";
                break;
            case "5":
                return "may";
                break;
            case "6":
                return "jun";
                break;
            case "7":
                return "july";
                break;
            case "8":
                return "aug";
                break;
            case "9":
                return "sep";
                break;
            case "10":
                return "oct";
                break;
            case "11":
                return "nov";
                break;
            case "12":
                return "dec";
                break;
        }
    }

    function GetMonthName(Month) {
        switch (String(Month)) {
            case "1":
                return "January";
                break;
            case "2":
                return "February";
                break;
            case "3":
                return "March";
                break;
            case "4":
                return "April";
                break;
            case "5":
                return "May";
                break;
            case "6":
                return "June";
                break;
            case "7":
                return "July";
                break;
            case "8":
                return "August";
                break;
            case "9":
                return "September";
                break;
            case "10":
                return "October";
                break;
            case "11":
                return "November";
                break;
            case "12":
                return "December";
                break;
        }
    }


    // Modified by Vinayak on 11.10.2024
    function GetFromDate(Month) {
        var Year = $scope.Year;

        switch (String(Month)) {
            case "jan":
                return Year + "-01-01 00:00:00";
                break;
            case "feb":
                return Year + "-02-01 00:00:00";
                break;
            case "mar":
                return Year + "-03-01 00:00:00";
                break;
            case "apr":
                return Year + "-04-01 00:00:00";
                break;
            case "may":
                return Year + "-05-01 00:00:00";
                break;
            case "jun":
                return Year + "-06-01 00:00:00";
                break;
            case "july":
                return Year + "-07-01 00:00:00";
                break;
            case "aug":
                return Year + "-08-01 00:00:00";
                break;
            case "sep":
                return Year + "-09-01 00:00:00";
                break;
            case "oct":
                return Year + "-10-01 00:00:00";
                break;
            case "nov":
                return Year + "-11-01 00:00:00";
                break;
            case "dec":
                return Year + "-12-01 00:00:00";
                break;
        }
    }
    function GetToDate(Month) {
        var Year = $scope.Year;

        switch (String(Month)) {
            case "jan":
                return Year + "-01-31 00:00:00";
                break;
            case "feb":
                return Year + "-02-28 00:00:00";
                break;
            case "mar":
                return Year + "-03-31 00:00:00";
                break;
            case "apr":
                return Year + "-04-30 00:00:00";
                break;
            case "may":
                return Year + "-05-31 00:00:00";
                break;
            case "jun":
                return Year + "-06-30 00:00:00";
                break;
            case "july":
                return Year + "-07-31 00:00:00";
                break;
            case "aug":
                return Year + "-08-31 00:00:00";
                break;
            case "sep":
                return Year + "-09-30 00:00:00";
                break;
            case "oct":
                return Year + "-10-31 00:00:00";
                break;
            case "nov":
                return Year + "-11-30 00:00:00";
                break;
            case "dec":
                return Year + "-12-31 00:00:00";
                break;
        }
    }
    // End modification




    //function GetSupplierOverviewReport() {
    //    var query = "";
    //    if ($scope.LoginMemberTypeID == 1) {
    //        query = "select CName,Type,Market,TTV_K,Bgs,Can_Book,Can_Book_Per,RN,AVBV,OM_Per,Bk_Err_Per,M_date,SalePId FROM rpt_sales_overview_" + $scope.Year + "_bk order by Bgs desc LIMIT 0,5"
    //    }
    //    else if ($scope.LoginMemberTypeID == 2) {
    //        if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
    //            query = " select CName,Type,Market,TTV_K,Bgs,Can_Book,Can_Book_Per,RN,AVBV,OM_Per,Bk_Err_Per,M_date,SalePId FROM rpt_sales_overview_" + $scope.Year + "_bk where BrId =" + $scope.LoginBranchId + " and SalePId=" + $scope.IsSalePersonUserId + " order by Bgs desc LIMIT 0, 5"
    //        }
    //        else {
    //            query = " select CName,Type,Market,TTV_K,Bgs,Can_Book,Can_Book_Per,RN,AVBV,OM_Per,Bk_Err_Per,M_date,SalePId FROM rpt_sales_overview_" + $scope.Year + "_bk where BrId =" + $scope.LoginBranchId + "   order by Bgs desc LIMIT 0, 5"
    //        }
    //    }

    //    var ReportName = " Sales OverView Report";
    //    var settings = {
    //        "url": "https://osearch.xconnect.in/_opendistro/_sql",
    //        "method": "POST",
    //        "async": false,
    //        "timeout": 0,
    //        "headers": {
    //            "Content-Type": "application/json"
    //        },
    //        "data": JSON.stringify({
    //            query: query
    //        }),
    //    };
    //    var _Solution = [];
    //    $.ajax(settings).done(function (data) {
    //        var results = data['datarows'];
    //        _Solution = results;
    //        $scope.MainResultlistSalesOverview = results.map(
    //            c => {
    //                return {
    //                    'SupplierName': (c[0]),
    //                    'Type': (c[1]),
    //                    'Market': (c[2]),
    //                    'TTV_K_LY': (c[3]).toFixed(2),
    //                    'TTV_K_CY': (c[3]).toFixed(2),
    //                    'VS': (c[3]).toFixed(2),
    //                    'Bgs': (c[4]),
    //                    'RN': (c[7]),
    //                    'OM_Per': (c[9]).toFixed(2),
    //                    'M_date': (c[11]),
    //                }
    //            }
    //        );
    //        $.each($scope.MainResultlistSalesOverview, function (i, item) {
    //            if (i == 0) {
    //                //  $("#SalesOverviewReport").html('');
    //                if ($scope.LoginMemberTypeID == 1) {
    //                    added_row = ' <thead class="main-head hidden-xs" id="theaddiv1"><tr><th>Supplier Name</th><th>Type</th><th>Market</th><th style="text-align:right;">TTV(K) LY</th> <th style="text-align:right;">TTV(K) CY</th> <th style="text-align:right;">VS %</th><th title="Reconfirm Bookings" style="text-align:right;">BKG</th><th title="Room Nights" style="text-align:right;">RN</th><th title="Oparating Margine Percentage" style="text-align:right;" ng-if="LoginMemberTypeID==1">OM %</th></tr</thead>';
    //                }
    //                else {
    //                    added_row = ' <thead class="main-head hidden-xs" id="theaddiv1"><tr><th>Supplier Name</th><th>Type</th><th>Market</th><th style="text-align:right;">TTV(K) LY</th> <th style="text-align:right;">TTV(K) CY</th> <th style="text-align:right;">VS %</th><th title="Reconfirm Bookings" style="text-align:right;">BKG</th><th title="Room Nights" style="text-align:right;">RN</th></tr</thead>';
    //                }
    //                added_row += '<tbody class="hsrr-tbody-main">';
    //                $scope.Date = item.M_date;
    //            }
    //            if ($scope.LoginMemberTypeID == 1) {
    //                added_row += '<tr>'
    //                    + '<td>' + item.SupplierName + '</td>'
    //                    + '<td>' + item.Type + '</td>'
    //                    + '<td>' + item.Market + '</td>'
    //                    + '<td style="text-align:right;">' + item.TTV_K_LY + '</td>'
    //                    + '<td style="text-align:right;">' + item.TTV_K_CY + '</td>'
    //                    + '<td style="text-align:right;">' + item.VS + '</td>'
    //                    + '<td style="text-align:right;">' + item.Bgs + '</td>'
    //                    + '<td style="text-align:right;">' + item.RN + '</td>'
    //                    + '<td style="text-align:right;">' + item.OM_Per + '</td>'
    //                    + '</tr>';
    //            } else {
    //                added_row += '<tr>'
    //                    + '<td>' + item.SupplierName + '</td>'
    //                    + '<td>' + item.Type + '</td>'
    //                    + '<td>' + item.Market + '</td>'
    //                    + '<td style="text-align:right;">' + item.TTV_K_LY + '</td>'
    //                    + '<td style="text-align:right;">' + item.TTV_K_CY + '</td>'
    //                    + '<td style="text-align:right;">' + item.VS + '</td>'
    //                    + '<td style="text-align:right;">' + item.Bgs + '</td>'
    //                    + '<td style="text-align:right;">' + item.RN + '</td>'
    //                    + '</tr>';
    //            }
    //        });
    //        added_row += '</tbody>';
    //        $("#SupplierOverviewReport").append(added_row);
    //        $("#SupplierOverviewPopup").css("display", "none");
    //        $("#SuppSaleOverdate").append('Last Updated Date : ' + $scope.Date);
    //    });
    //}

    //function GetTopSellHotelSuppWiseReport() {
    //    var ReportName = " Hotel Sales Report";
    //    var query = "";
    //    if ($scope.LoginMemberTypeID == 1) {
    //        query = "SELECT HName, Dest, SUM(RN) as Rn, SUM(Bgs) as BKG, SUM(NoOfSearch) as NoOfSearch, SUM(TTV) as TTVK, M_date FROM rpt_sales_hotels_" + $scope.Year + "_bk GROUP BY HName, Dest, M_date order by BKG desc LIMIT 0, 5"

    //    }
    //    else if ($scope.LoginMemberTypeID == 2) {
    //        if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
    //            query = "SELECT HName, Dest, SUM(RN) as Rn, SUM(Bgs) as BKG, SUM(NoOfSearch) as NoOfSearch, SUM(TTV) as TTVK, M_date,BrId,Saleperson FROM rpt_sales_hotels_" + $scope.Year + "_bk WHERE BrId=" + $scope.LoginBranchId + " and  Saleperson = " + $scope.IsSalePersonUserId + " GROUP BY HName, Dest, M_date,BrId,Saleperson order by BKG desc LIMIT 0, 5"
    //        }
    //        else {
    //            query = "SELECT HName, Dest, SUM(RN) as Rn, SUM(Bgs) as BKG, SUM(NoOfSearch) as NoOfSearch, SUM(TTV) as TTVK, M_date FROM rpt_sales_hotels_" + $scope.Year + "_bk WHERE BrId=" + $scope.LoginBranchId + "  GROUP BY HName, Dest, M_date,BrId order by BKG desc LIMIT 0, 5"
    //        }
    //    }
    //    var settings = {
    //        "url": "https://osearch.xconnect.in/_opendistro/_sql",
    //        "method": "POST",
    //        "async": false,
    //        "timeout": 0,
    //        "headers": {
    //            "Content-Type": "application/json"
    //        },
    //        "data": JSON.stringify({
    //            "query": query
    //        }),
    //    };
    //    var _Solution = [];
    //    $.ajax(settings).done(function (data) {
    //        var results = data['datarows'];
    //        _Solution = results;
    //        $scope.MainResultlistHSales = results.map(
    //            c => {
    //                return {
    //                    //sum(SellAmount)/ (case when sum(Bgs) = 0 then cast(1 as long) else sum(Bgs) end) as ABV

    //                    'SupplierName': (c[0]),
    //                    'HotelName': (c[0]),
    //                    'Dest': (c[1]),
    //                    'TTV_K': (c[3]),
    //                    'RN': (c[2]),
    //                    'Bgs': (c[3]),
    //                    'OM_Per': (c[5]),
    //                    'M_date': (c[6]),

    //                }
    //            }
    //        );
    //        $.each($scope.MainResultlistHSales, function (i, item) {
    //            if (i == 0) {
    //                //  $("#SalesOverviewReport").html('');
    //                if ($scope.LoginMemberTypeID == 1) {
    //                    added_row = '<thead class="main-head hidden-xs"><tr><th>Supplier Name</th><th>Hotel Name</th><th>Destination</th> <th style="text-align:right;">TTV (K)</th><th title="Room Nights" style="text-align:right;">RN</th><th title="Reconfirm Bookings" style="text-align:right;">BKG</th><th title="Oparating Margine Percentage" style="text-align:right;">OM %</th></tr></thead>';
    //                }
    //                else {
    //                    added_row = '<thead class="main-head hidden-xs"><tr><th>Supplier Name</th><th>Hotel Name</th><th>Destination</th> <th style="text-align:right;">TTV (K)</th><th title="Room Nights" style="text-align:right;">RN</th><th title="Reconfirm Bookings" style="text-align:right;">BKG</th></tr></thead>';
    //                }
    //                added_row += '<tbody class="hsrr-tbody-main">';
    //                $scope.Date = item.M_date;

    //            }
    //            if ($scope.LoginMemberTypeID == 1) {
    //                added_row += '<tr>'
    //                    + '<td>' + item.SupplierName + '</td>'
    //                    + '<td>' + item.HotelName + '</td>'
    //                    + '<td>' + item.Dest + '</td>'
    //                    + '<td style="text-align:right;">' + item.TTV_K + '</td>'
    //                    + '<td style="text-align:right;">' + item.RN + '</td>'
    //                    + '<td style="text-align:right;">' + item.Bgs + '</td>'
    //                    + '<td style="text-align:right;">' + item.OM_Per + '</td>'
    //                    + '</tr>';
    //            } else {
    //                added_row += '<tr>'
    //                    + '<td>' + item.SupplierName + '</td>'
    //                    + '<td>' + item.HotelName + '</td>'
    //                    + '<td>' + item.Dest + '</td>'
    //                    + '<td style="text-align:right;">' + item.TTV_K + '</td>'
    //                    + '<td style="text-align:right;">' + item.RN + '</td>'
    //                    + '<td style="text-align:right;">' + item.Bgs + '</td>'
    //                    + '</tr>';
    //            }
    //        });
    //        added_row += '</tbody>';
    //        $("#TopSellHotelSuppwiseReport").append(added_row);
    //        $("#TopSellHotelSuppwisePopUp").css("display", "none");
    //        $("#SuppSaleHoteldate").append('Last Updated Date : ' + $scope.Date);
    //        $scope.UpadateSaleHoteldate = $scope.MainResultlistHSales.length == 0 ? "" : $scope.MainResultlistHSales[0].M_date;
    //    });
    //}

    //function GetTopSellDestSuppWiseReport() {
    //    var query = "";
    //    if ($scope.LoginMemberTypeID == 1) {
    //        query = "SELECT Dest,sum(RN) as RN, sum(Bgs) as BKG, sum(SellAmount)/ (case when sum(Bgs)=0 then cast(1 as long) else sum(Bgs) end)  as ABV, sum(RN)/ (case when sum(Bgs)=0 then cast(1 as long) else sum(Bgs) end)  as LoS, sum(NoOfSearch)/ (case when sum(Bgs)=0 then cast(1 as long) else sum(Bgs) end)  as L2B,M_date  from rpt_sales_destinations_" + $scope.Year + "_bk GROUP by Dest,M_date order by BKG Desc LIMIT 0,5"
    //    }
    //    else if ($scope.LoginMemberTypeID == 2) {
    //        if ($scope.IsSalePerson == "True" || $scope.IsSalePerson == "true" || $scope.IsSalePerson == true) {
    //            query = "SELECT Dest,sum(RN) as RN, sum(Bgs)  as BKG, sum(SellAmount)/(case when sum(Bgs)=0 then cast(1 as long) else sum(Bgs)end )  as ABV, sum(RN)/ (case when sum(Bgs)=0 then cast(1 as long) else sum(Bgs) end)  as LoS, sum(NoOfSearch)/ (case when sum(Bgs)=0 then cast(1 as long) else sum(Bgs) end)  as L2B,M_date,Saleperson  from rpt_sales_destinations_" + $scope.Year + "_bk where BrId=" + $scope.LoginBranchId + " and Saleperson = " + $scope.IsSalePersonUserId + " GROUP by Dest,M_date order by BKG Desc LIMIT 0,5"
    //        }
    //        else {
    //            query = "SELECT Dest,sum(RN) as RN, sum(Bgs) as BKG, sum(SellAmount)/ (case when sum(Bgs)=0 then cast(1 as long) else sum(Bgs) end) as ABV, sum(RN)/ (case when sum(Bgs)=0 then cast(1 as long) else sum(Bgs) end) as LoS, sum(NoOfSearch)/ (case when sum(Bgs)=0 then cast(1 as long) else sum(Bgs) end) as L2B,M_date  from rpt_sales_destinations_" + $scope.Year + "_bk where BrId=" + $scope.LoginBranchId + " GROUP by Dest,M_date order by BKG Desc LIMIT 0,5"
    //        }
    //    }
    //    var ReportName = "Sales Destination Report";
    //    var settings = {
    //        "url": "https://osearch.xconnect.in/_opendistro/_sql",
    //        "method": "POST",
    //        "async": false,
    //        "timeout": 0,
    //        "headers": {
    //            "Content-Type": "application/json"
    //        },
    //        "data": JSON.stringify({
    //            "query": query //"SELECT * from rpt_sales_destinations_" + $scope.Year + "_bk order by Bgs desc LIMIT 0,5"
    //        }),
    //    };
    //    var _Solution = [];
    //    $.ajax(settings).done(function (data) {
    //        var results = data['datarows'];
    //        _Solution = results;
    //        $scope.MainResultlistSalesDest = results.map(
    //            c => {
    //                return {
    //                    'SupplierName': (c[0]),
    //                    'Dest': (c[1]),
    //                    'TTV_K': (c[3]),
    //                    'RN': (c[2]),
    //                    'Bgs': (c[3]),
    //                    'OM_Per': (c[5]),
    //                    'M_date': (c[6]),
    //                }
    //            }
    //        );

    //        $.each($scope.MainResultlistSalesDest, function (i, item) {
    //            if (i == 0) {
    //                if ($scope.LoginMemberTypeID == 1) {
    //                    added_row = '<thead class="main-head hidden-xs"><tr><th>Supplier Name</th> <th>Destination</th> <th style="text-align:right;">TTV (K)</th><th title="Room Nights" style="text-align:right;">RN</th><th title="Reconfirm Bookings" style="text-align:right;">BKG</th><th title="Oparating Margine Percentage" style="text-align:right;">OM %</th></tr></thead>';
    //                }
    //                else {
    //                    added_row = '<thead class="main-head hidden-xs"><tr><th>Supplier Name</th> <th>Destination</th> <th style="text-align:right;">TTV (K)</th><th title="Room Nights" style="text-align:right;">RN</th><th title="Reconfirm Bookings" style="text-align:right;">BKG</th></tr></thead>';
    //                }
    //                added_row += '<tbody class="hsrr-tbody-main">';
    //                $scope.Date = item.M_date;
    //            }
    //            if ($scope.LoginMemberTypeID == 1) {
    //                added_row += '<tr>'
    //                    + '<td>' + item.SupplierName + '</td>'
    //                    + '<td>' + item.Dest + '</td>'
    //                    + '<td style="text-align:right;">' + item.TTV_K + '</td>'
    //                    + '<td style="text-align:right;">' + item.RN + '</td>'
    //                    + '<td style="text-align:right;">' + item.Bgs + '</td>'
    //                    + '<td style="text-align:right;">' + item.OM_Per + '</td>'
    //                    + '</tr>';
    //            }
    //            else {
    //                added_row += '<tr>'
    //                    + '<td>' + item.SupplierName + '</td>'
    //                    + '<td>' + item.Dest + '</td>'
    //                    + '<td style="text-align:right;">' + item.TTV_K + '</td>'
    //                    + '<td style="text-align:right;">' + item.RN + '</td>'
    //                    + '<td style="text-align:right;">' + item.Bgs + '</td>'                      
    //                    + '</tr>';
    //            }
    //        });
    //        added_row += '</tbody>';
    //        $("#TopSellDestSuppwiseReport").append(added_row);
    //        $("#TopSellDestSuppwiseReportPopUp").css("display", "none");
    //        $("#SuppSaleDestidate").append('Last Updated Date : ' + $scope.Date);
    //        $scope.UpdatedSaleDestDate = $scope.MainResultlistSalesDest.length == 0 ? "" : $scope.MainResultlistSalesDest[0].M_date;
    //    });
    //}




}]);

