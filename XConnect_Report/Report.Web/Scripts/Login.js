$(document).ready(function ()
{
    var ParentSiteName = localStorage.getItem("Parentwebsite");
    $("#hdnparentsitename").val(ParentSiteName);

    if ($("#hdnerror").val() == "1")
    {
        $("#error").modal('show');
    }
    else if (ParentSiteName != "")
    {       
        $("#session").modal('show');
       // var ParentUrLdesign = "Oops ! Session Timeout ! <br/>Click Here to Login <br/><br/><a style='cursor: pointer;' onclick='RedirectToParent();'  id='RediretToParent'>" + ParentSiteName + "</a>";
    }
     
    else{
        var ParentUrLdesign = "Sorry,Session has expried";
    }  
  //  $("#LoginMessage")[0].innerHTML = (ParentUrLdesign);

    
});

 function RedirectToParent() {

        window.opener.RefreshUrl2();
        close();

    }

var app = angular.module('myApp', []);
app.controller('validateCtrl', validateCtrl); // Registering the VM


function validateCtrl($scope, $http) {
    $scope.LoginDO = {
        "Username": "",
        "Password": ""
    };

    $scope.LoginDO = {};
    $scope.Errors = {};
    $scope.Login = function () {
        // make a call to server to add data
        $http({ method: "Post", data: $scope.LoginDO, url: "../Login/Login" }).
            success(function (data, status, headers, config) {
                if (data.IsValid) {
                    $scope.LoginDO = data.Data;
                    // Load the collection of customer.
                    $scope.LoginDO = {
                        "Username": "",
                        "Password": ""
                    };
                }
                else {
                    $scope.Errors = data.Data.Errors;
                }
            });
    }
}


function valid() {

    document.getElementById("txtUsernameForgot").value = "";
    document.getElementById("txtEmailForgot").value = "";
    document.getElementById("msgShow").innerHTML = "";
    var model1 = angular.element(document.querySelector('#access_account'));
    model1.modal('show');
    return false;
}






