
app.controller('PostBookingController', ['$scope', '$http', '$window', '$rootScope', function ($scope, $http, $window, $rootScope) {
    load();
    $scope.WsFinallist = [];  
    function load() {

        var logintype = ($("#hdnLoginMemberTypeId")).val();
        var hdnAppUrl = $("#hdnAppUrl").val();

        switch (logintype) {
            case '1':  //HQ
                $http.get("../CommonData/GetBracnhList").then(function (d) {
                    $scope.branchlist = d.data;
                    if (hdnAppUrl = "1" && $scope.branchlist.length > 0) {
                        LoadOttilaBr();
                    }
                }, function (error) {
                    ErrorPopup.render('Branch Load failed');
                });
                break;
            case '2':   //Br
                document.getElementById("divbranch").style.display = "none";
                bid = $("#hdnLoginMemberId").val();
                var cCode = $("#hdnCCode").val();
                $scope.agentlist = [];
                membertypeid = 2;
                $http.get("../CommonData/GetBracnhWiseresult?MemberType=" + membertypeid + "&MemberId=" + bid).then(function (d) {
                    $scope.Wslist = d.data;
                    var datalength = d.data.length;
                    var index = 0;
                    angular.forEach($scope.Wslist, function (item) {
                        if (item.MemberTypeId == 3) {

                            $scope.WsFinallist.push(item);

                        }
                        else if (cCode == 1 && item.MemberTypeId == 4) {
                             $scope.agentlist.push(item);
                        }
                        if ($scope.WsFinallist.length != "0") {
                            document.getElementById("Wsdiv").style.display = "block";

                        }

                        if (cCode == 1 && $scope.agentlist.length != "0") {
                            document.getElementById("agentdiv").style.display = "block";
                        }
                        else if ((datalength - 1) == index) {
                            document.getElementById("Wsdiv").style.display = "none";
                            $scope.agentlist = d.data;
                            document.getElementById("agentdiv").style.display = "block";
                        }                       
                        index = index + 1;
                    });


                }, function (error) {
                    ErrorPopup.render('Ws Load failed');
                });
                break;
            case '3':   //Ws

                document.getElementById("divbranch").style.display = "none";
                document.getElementById("Wsdiv").style.display = "none";
                membertypeid = 3;
                Wsid = $("#hdnLoginMemberId").val();

                $http.get("../CommonData/GetBracnhWiseresult?MemberType=" + membertypeid + "&MemberId=" + Wsid).then(function (d) {

                    $scope.agentlist = d.data;
                    document.getElementById("agentdiv").style.display = "block";
                }, function (error) {

                    ErrorPopup.render('Agent Load failed');

                });
                break;
            case '4':  //Ag
                document.getElementById("divbranch").style.display = "none";
                document.getElementById("Wsdiv").style.display = "none";
                document.getElementById("agentdiv").style.display = "none";

                break;
            default:

        }
    }
    $("#ddl_BR").change(function () {
        $scope.WsFinallist = [];
        $scope.Brmemberid = $("#ddl_BR option:selected").val();
        document.getElementById("hdnParentmemberid").value = $scope.Brmemberid;
        document.getElementById("hdnParenttypeid").value = "2";
        bid = $scope.Brmemberid;
        membertypeid = 2;
        if (this.value == "0") {
            document.getElementById("Wsdiv").style.display = "none";
            document.getElementById("agentdiv").style.display = "none";
        }
        //  $scope.GetAgentWsList(bid, membertypeid);
        $scope.getWsList(bid, membertypeid);
        $("#ddl_AG").val("0");
        $("#ddl_WS").val("0");


        $rootScope.$emit("CallPostBooking", {});



    });

    $("#ddl_WS").change(function () {

        $scope.Wsmemberid = $("#ddl_WS option:selected").val();
        document.getElementById("hdnParentmemberid").value = $scope.Wsmemberid;
        document.getElementById("hdnParenttypeid").value = "3";
        Wsid = document.getElementById("hdnParentmemberid").value;
        membertypeid = 3;


        if (this.value == "0") {
            document.getElementById("agentdiv").style.display = "none";
        }
        else {
            $scope.getAgentList(Wsid, membertypeid);
            document.getElementById("agentdiv").style.display = "";
            $("#ddl_AG").val("0");
        }
        $rootScope.$emit("CallPostBooking", {});
    });

    $("#ddl_AG").change(function () {

        Agid = $("#ddl_AG option:selected").val();
        if ($scope.UserLevel == true) {
            //only if userlevel report = true
            if (this.value == "0") {
                document.getElementById("Userdiv").style.display = "none";
            }
            else {
                $scope.getUserList(Agid, membertypeid);
                document.getElementById("Userdiv").style.display = "";
                $("#ddl_User").val("0");
            }

        }

        $rootScope.$emit("CallPostBooking", {});

    });

    $scope.getWsList = function (bid, membertypeid) {
        //  document.getElementById("Userdiv").style.display = "none";
        membertypeid = 2;
        $scope.agentlist = [];
        $http.get("../CommonData/GetBracnhWiseresult?MemberType=" + membertypeid + "&MemberId=" + bid).then(function (d) {
            $scope.Wslist = d.data;
            var index = 0;
            angular.forEach($scope.Wslist, function (item) {
                if (item.MemberTypeId == 3) {

                    $scope.WsFinallist.push(item);

                }
                if (item.MemberTypeId == 4) {

                    $scope.agentlist.push(item);

                }

                index = index + 1;
            });
            if ($scope.agentlist.length != "0") {
                document.getElementById("agentdiv").style.display = "block";
            }
            else {
                document.getElementById("agentdiv").style.display = "none";
            }
            if ($scope.WsFinallist.length != "0") {
                document.getElementById("Wsdiv").style.display = "block";

            }
            else {
                document.getElementById("Wsdiv").style.display = "none";
                $scope.agentlist = d.data;
                document.getElementById("agentdiv").style.display = "block";
            }
            $rootScope.$emit("CallPostBooking", {});

        }, function (error) {
            ErrorPopup.render('Ws Load failed');
        });
    }

    $scope.getAgentList = function (Wsid, membertypeid) {
        // document.getElementById("Userdiv").style.display = "none";
        membertypeid = 3;
        $scope.agentlist = [];
        $http.get("../CommonData/GetBracnhWiseresult?MemberType=" + membertypeid + "&MemberId=" + Wsid).then(function (d) {

            $scope.agentlist = d.data;
            document.getElementById("agentdiv").style.display = "block";
        }, function (error) {

            ErrorPopup.render('Agent Load failed');

        });

    }

    $scope.GetAgentWsList = function (bid, membertypeid) {

        $http.get("../CommonData/GetBracnhWiseresult?MemberType=" + membertypeid + "&MemberId=" + bid).then(function (d) {

            $scope.Wslist = d.data;
            var index = 0;
            angular.forEach($scope.Wslist, function (item) {
                if (item.MemberTypeId == 3) {
                    //  alert('ok');
                    $scope.WsFinallist.push(item);

                }
                if ($scope.WsFinallist.length != "0") {
                    document.getElementById("Wsdiv").style.display = "block";

                }
                else {
                    document.getElementById("Wsdiv").style.display = "none";
                    $scope.agentlist = d.data;
                    document.getElementById("agentdiv").style.display = "block";
                }
                index = index + 1;
            });



        }, function (error) {

            //  alert('failed');

        });

    }


    $scope.getUserList = function (Agid, membertypeid) {

        membertypeid = 4;

        $http.get("../CommonData/GetUserList?MemberId=" + Agid).then(function (d) {

            $scope.Userlist = d.data;
            document.getElementById("Userdiv").style.display = "block";
        }, function (error) {

            ErrorPopup.render('User Load failed');

        });

    }


    if ($("#hdnIsGetMemberdetails").val() == "true") {
        GetMemberList();
    }
    function GetMemberList() {
        if (document.getElementById("hdnParenttypeid").value != "4") {
            $scope.WsFinallist = [];
            $scope.Br_Id = $("#hdnMemberdetails").val().split("_")[0];
            $scope.Ws_Id = $("#hdnMemberdetails").val().split("_")[1];
            $scope.Ag_Id = $("#hdnMemberdetails").val().split("_")[2];


            var Br_Id = ($("#hdnMemberdetails").val().split("_")[0]);
            $scope.getWsList(Br_Id, 2);
            if ($("#hdnMemberdetails").val().split("_")[3] == "All Branch") {
                GetE("ddl_BR").options[GetE("ddl_BR").selectedIndex].text = $("#hdnMemberdetails").val().split("_")[3];
            }
            if ($("#hdnMemberdetails").val().split("_").length > 3) {
                if ($("#hdnMemberdetails").val().split("_")[4] == "All Agent") {
                    GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text = $("#hdnMemberdetails").val().split("_")[4];
                }
            }
        }


    }
    function LoadOttilaBr() {
        if ($scope.CCode == 1) {
            $('#ddl_BR').prepend($('<option></option>').val("-2").html('All Ottila Overseas Branches'));
            $('#ddl_BR').prepend($('<option></option>').val("-1").html('All Ottila India Branches'));

        }
    }


}]);


