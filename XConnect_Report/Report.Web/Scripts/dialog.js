function CustomAlert() {
    this.render = function (dialog, id) {

        var winW = window.innerWidth;
        var winH = window.innerHeight;
        var dialogoverlay = document.getElementById('dialogoverlay');
        var dialogbox = document.getElementById('dialogbox');
        dialogbox.className = 'col-md-4 col-md-offset-4 col-lg-4 col-lg-offset-4 col-sm-4 col-sm-offset-4 col-xs-12';
        dialogoverlay.style.display = "block";
        dialogoverlay.style.height = winH + "px";
        //dialogbox.style.left = (winW/2) - (550 * .5)+"px";
        dialogbox.style.top = "30%";
        dialogbox.style.display = "block";
        document.getElementById('dialogboxhead').innerHTML = '<i class="fa fa-exclamation-triangle" style="font-size:17px; top:3px;"></i>' + "&nbsp;Warning";
        document.getElementById('dialogboxbody').innerHTML = dialog;
        document.getElementById('dialogboxfoot').innerHTML = "<a class=\"btn btn-primary\" onclick=\"Alert.ok('" + id + "')\">Ok</a>";

    }
    this.ok = function (id) {
        document.getElementById('dialogbox').style.display = "none";
        document.getElementById('dialogoverlay').style.display = "none";
        if (id == "btnExpire") {
            var href = $('#liLogout').attr('href');
            window.location.href = href;
        }
        else if (id != "") {
            $("#" + id).focus();
        }
    }
    this.okV1 = function (id) {
        document.getElementById('dialogbox').style.display = "none";
        document.getElementById('dialogoverlay').style.display = "none";
        if (id != "") {
            window.location.href = id;
        }
    }
}
var Alert = new CustomAlert();
function CustomConfirm() {
    this.render = function (dialog, op, value) {
        var winW = window.innerWidth;
        var winH = window.innerHeight;
        var dialogoverlay = document.getElementById('dialogoverlay');
        var dialogbox = document.getElementById('dialogbox');
        dialogbox.className = 'col-md-4 col-md-offset-4 col-lg-4 col-lg-offset-4 col-sm-4 col-sm-offset-4 col-xs-12';
        dialogoverlay.style.display = "block";
        dialogoverlay.style.height = winH + "px";
        //dialogbox.style.left = (winW/2) - (550 * .5)+"px";
        dialogbox.style.top = "100px";
        dialogbox.style.display = "block";

        document.getElementById('dialogboxhead').innerHTML = '<i class="glyphicon glyphicon-info-sign" style="font-size:17px; top:3px;"></i>' + "&nbsp;Confirm that action";
        document.getElementById('dialogboxbody').innerHTML = dialog;
        document.getElementById('dialogboxfoot').innerHTML = '<a class="btn btn-primary" onclick="Confirm.yes(\'' + op + '\',\'' + value + '\')">Yes</a> <a class="btn btn-primary" onclick="Confirm.no()">No</a>';
    }
    this.no = function () {
        document.getElementById('dialogbox').style.display = "none";
        document.getElementById('dialogoverlay').style.display = "none";
       // return false;
    }
    this.yes = function (op, value) {


        switch (op) {
            case "deleteUser":
                DeleteUser(value);
                break;
            case "deleteMember":
                deleteMember(value);
                break;
            case "ActionOnBookCard":
                var Values = value.split("#");
                ActionOnBookCard(Values[0], Values[1], Values[2], (Values[3] == "" ? 0 : parseInt(Values[3])), Values[4]);
                break;
            case "CancelInvoice":
                var Values = value.split("#");
                CancelInvoice(Values[0], Values[1]);
                break;
            case "MakefinalListForAmend":
                var Values = value.split("#");
                MakefinalListForAmend(Values[0], Values[1]);
                break;
            default:
                document.getElementById('dialogbox').style.display = "none";
                document.getElementById('dialogoverlay').style.display = "none";
              //  document.getElementById('hdnAlertconfirm').value = "true";
             //   document.getElementById(value).click();
              //  $(value).trigger("click");
      //  confirmdelete(value);
            
               // var value = "true";
                break;
                 
        }

        document.getElementById('dialogbox').style.display = "none";
        document.getElementById('dialogoverlay').style.display = "none";
    }
}
var Confirm = new CustomConfirm();
function CustomPrompt() {
    this.render = function (dialog, func) {
        var winW = window.innerWidth;
        var winH = window.innerHeight;
        var dialogoverlay = document.getElementById('dialogoverlay');
        var dialogbox = document.getElementById('dialogbox');
        dialogoverlay.style.display = "block";
        dialogoverlay.style.height = winH + "px";
        //dialogbox.style.left = (winW/2) - (550 * .5)+"px";
        dialogbox.style.top = "100px";
        dialogbox.style.display = "block";
        document.getElementById('dialogboxhead').innerHTML = '<i class="glyphicon glyphicon-info-sign" style="font-size:17px; top:3px;"></i>' + "&nbsp;A value is required";
        document.getElementById('dialogboxbody').innerHTML = dialog;
        document.getElementById('dialogboxbody').innerHTML += '<br><input id="prompt_value1">';
        document.getElementById('dialogboxfoot').innerHTML = '<a class="btn btn-primary" onclick="Prompt.ok(\'' + func + '\')">OK</a> <a class="btn btn-primary" onclick="Prompt.cancel()">Cancel</a>';
    }
    this.cancel = function () {
        document.getElementById('dialogbox').style.display = "none";
        document.getElementById('dialogoverlay').style.display = "none";
    }
    this.ok = function (func) {
        var prompt_value1 = document.getElementById('prompt_value1').value;
        window[func](prompt_value1);
        document.getElementById('dialogbox').style.display = "none";
        document.getElementById('dialogoverlay').style.display = "none";
    }
}
var Prompt = new CustomPrompt();


var Success = new SuccessAlert();
function SuccessAlert() {
    this.render = function (dialog, id) {
        var winW = window.innerWidth;
        var winH = window.innerHeight;
        var dialogoverlay = document.getElementById('dialogoverlay');
        var dialogbox = document.getElementById('dialogbox');
        dialogbox.className = 'col-md-4 col-md-offset-4 col-lg-4 col-lg-offset-4 col-sm-4 col-sm-offset-4 col-xs-12';
        dialogoverlay.style.display = "block";
        dialogoverlay.style.height = winH + "px";
        //dialogbox.style.left = (winW/2) - (550 * .5)+"px";
        dialogbox.style.top = "100px";
        dialogbox.style.display = "block";
        document.getElementById('dialogboxhead').innerHTML = '<i class="glyphicon glyphicon-info-sign" style="font-size:17px; top:3px;"></i>' + "&nbsp;Success";
        document.getElementById('dialogboxbody').innerHTML = dialog;
        document.getElementById('dialogboxfoot').innerHTML = "<a class=\"btn btn-primary\" onclick=\"Alert.ok('" + id + "')\">Ok</a>";

    }
    this.ok = function (id) {
        document.getElementById('dialogbox').style.display = "none";
        document.getElementById('dialogoverlay').style.display = "none";
        $("#" + id).focus();
    }
}


////for new admin control
function SucessAlertURL() {
    this.render = function (dialog,url) {     
        var winW = window.innerWidth;
        var winH = window.innerHeight;
        var dialogoverlay = document.getElementById('dialogoverlay');
        var dialogbox = document.getElementById('dialogbox');
        dialogbox.className = 'col-md-4 col-md-offset-4 col-lg-4 col-lg-offset-4 col-sm-4 col-sm-offset-4 col-xs-12';
        dialogoverlay.style.display = "block";
        dialogoverlay.style.height = winH + "px";
        //dialogbox.style.left = (winW/2) - (550 * .5)+"px";
        dialogbox.style.top = "100px";
        dialogbox.style.display = "block";
        document.getElementById('dialogboxhead').innerHTML = '<i class="glyphicon glyphicon-info-sign" style="font-size:17px; top:3px;"></i>' + "&nbsp;Success";
        document.getElementById('dialogboxbody').innerHTML = dialog;
        document.getElementById('dialogboxfoot').innerHTML = "<a class=\"btn btn-primary\" onclick=\"SucessURL.ok('" + url + "')\">Ok</a>";
       
    }
    this.ok = function ( url) {
       
        document.getElementById('dialogbox').style.display = "none";
        document.getElementById('dialogoverlay').style.display = "none";
        //if (id != "") {
        //    $("#" + id).focus();
        //}
        window.location.href = url;
    }
}
var SucessURL = new SucessAlertURL();


////for new edit
var AlertWithParentWindow = new AlertWithParentWindow();
function AlertWithParentWindow() {
    this.render = function (dialog) {
        var winW = window.innerWidth;
        var winH = window.innerHeight;
        var dialogoverlay = document.getElementById('dialogoverlay');
        var dialogbox = document.getElementById('dialogbox');
        dialogbox.className = 'col-md-4 col-md-offset-4 col-lg-4 col-lg-offset-4 col-sm-4 col-sm-offset-4 col-xs-12';
        dialogoverlay.style.display = "block";
        dialogoverlay.style.height = winH + "px";
        //dialogbox.style.left = (winW/2) - (550 * .5)+"px";
        dialogbox.style.top = "100px";
        dialogbox.style.display = "block";
        document.getElementById('dialogboxhead').innerHTML = '<i class="glyphicon glyphicon-info-sign" style="font-size:17px; top:3px;"></i>' + "&nbsp;Success";
        document.getElementById('dialogboxbody').innerHTML = dialog;
        document.getElementById('dialogboxfoot').innerHTML = "<a class=\"btn btn-primary\" onclick=\"AlertWithParentWindow.ok()\">Ok</a>";

    }
    this.ok = function () {
        document.getElementById('dialogbox').style.display = "none";
        document.getElementById('dialogoverlay').style.display = "none";
        window.opener.RefreshUrl();
        window.close();
    }
}

var SucessURL = new SucessAlertURL();




var ErrorPopup = new ErrorAlert();
function ErrorAlert() {
    this.render = function (dialog, id) {
        var winW = window.innerWidth;
        var winH = window.innerHeight;
        var dialogoverlay = document.getElementById('dialogoverlay');
        var dialogbox = document.getElementById('dialogbox');
        dialogbox.className = 'col-md-4 col-md-offset-4 col-lg-4 col-lg-offset-4 col-sm-4 col-sm-offset-4 col-xs-12';
        dialogoverlay.style.display = "block";
        dialogoverlay.style.height = winH + "px";
        //dialogbox.style.left = (winW/2) - (550 * .5)+"px";
        dialogbox.style.top = "100px";
        dialogbox.style.display = "block";
        document.getElementById('dialogboxhead').innerHTML = '<i class="fa fa-exclamation-triangle" style="font-size:17px; top:3px;"></i>' + "&nbsp;UnSuccess";
        document.getElementById('dialogboxbody').innerHTML = dialog;
        document.getElementById('dialogboxfoot').innerHTML = "<a class=\"btn btn-primary\" onclick=\"ErrorPopup.ok('" + id + "')\">Ok</a>";

    }
    this.ok = function (id) {
        document.getElementById('dialogbox').style.display = "none";
        document.getElementById('dialogoverlay').style.display = "none";
        $("#" + id).focus();
    }
}





//function DeleteConfirm() {
//    this.render = function (dialog) {
//        var winW = window.innerWidth;
//        var winH = window.innerHeight;
//        var dialogoverlay = document.getElementById('dialogoverlay');
//        var dialogbox = document.getElementById('dialogbox');
//        dialogbox.className = 'col-md-4 col-md-offset-4 col-lg-4 col-lg-offset-4 col-sm-4 col-sm-offset-4 col-xs-12';
//        dialogoverlay.style.display = "block";
//        dialogoverlay.style.height = winH + "px";
//        //dialogbox.style.left = (winW/2) - (550 * .5)+"px";
//        dialogbox.style.top = "100px";
//        dialogbox.style.display = "block";

//        document.getElementById('dialogboxhead').innerHTML = '<i class="glyphicon glyphicon-info-sign" style="font-size:17px; top:3px;"></i>' + "&nbsp;Confirm that action";
//        document.getElementById('dialogboxbody').innerHTML = dialog;
//        document.getElementById('dialogboxfoot').innerHTML = '<a class="btn btn-primary" onclick="DConfirm.yes()">Yes</a> <a class="btn btn-primary" onclick="Confirm.no()">No</a>';
//    }
//    this.no = function () {
//        document.getElementById('dialogbox').style.display = "none";
//        document.getElementById('dialogoverlay').style.display = "none";
//        return false;
//    }
//    this.yes = function () {
//        document.getElementById('dialogbox').style.display = "none";
//        document.getElementById('dialogoverlay').style.display = "none";
//        return true;
//    }
//}
//var DConfirm = new DeleteConfirm();