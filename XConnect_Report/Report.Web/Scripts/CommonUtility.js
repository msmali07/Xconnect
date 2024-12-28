
var CCode = $("#hdnCCode").val();
function GetBookDisplayStatusDirective(status) {

    var GetStatus = status;
    switch (status) {
        case "PN":
            GetStatus = "PENDING NEED";
            break;
        case "RQ":
            GetStatus = "REQUESTED";
            break;
        case "KK":
            GetStatus = "CONFIRMED";
            break;
        case "RR":
            GetStatus = "RECONFIRMED";
            break;
        case "RN":
            GetStatus = "RECONFIRM REQUEST";
            break;
        case "XX":
            GetStatus = "CANCELLED";
            break;
        case "XN":
            GetStatus = "CANCELLATION REQUEST";
            break;
        case "UC":
            //if (SuppRefNo == null || SuppRefNo == "") {
            //    GetStatus = "UNSUCCESSFUL BOOKING"; /*"UNSUCCESSFUL BOOKING";*/
            //}
            //else {
                GetStatus = "SOLD OUT";
           // }
            break;
        case "HN":
            GetStatus = "STATUS REQUESTED";
            break;
        case "HL":
            GetStatus = "STATUS WAITLISTED";
            break;
        case "PC":
            GetStatus = "PARTIALLY CONFIRMED";
            break;
        case "AR":
            GetStatus = "AMEND REQUESTED";
            break;
        case "PP":
            GetStatus = "PAYMENT PENDING";
            break;
        case "CS":
            GetStatus = "CHECK STATUS";
            break;
        case "KK MAIL":
            GetStatus = "CONFIRMED MAIL TO SUPPLIER";
            break;
        case "XNMAIL":
            GetStatus = "CANCELLED MAIL TO SUPPLIER";
            break;
        default:
            GetStatus = status;
            break;
    }
    return GetStatus;
};

function GetBookingServiceNameDirective(type) {

    var GetServiceName = type;
    switch (type) {
        case "H":
            GetServiceName = "Hotel";
            break;
        case "T":
            GetServiceName = "Transfer";
            break;
        case "S":
            GetServiceName = "Tour";  
            break;
        case "R"://excusrsion
            GetServiceName = "Tour";
            break;
        case "F":
            GetServiceName = "Flight";
            break;
        case "E":
            GetServiceName = "Escorted";
            break;
        case "Ex":  
            GetServiceName = "Excursion";
            break;
        case "P":
            GetServiceName = "Package";
            break;
        case "M":
            GetServiceName = "Miscellaneous";
            break;
        case "NPR":
            GetServiceName = "Rail Europe";
            break;
        case "TR":
            GetServiceName = "Rail Europe";
            break;
        case "PR":
            GetServiceName = "Rail Europe";
            break;
        case "E_PR":
            GetServiceName = "Rail Europe";
            break;
        case "E_TR":
            GetServiceName = "Rail Europe";
            break;
        case "M_RE":
            GetServiceName = "Rail Europe";
            break;
        case "J_PR":
            GetServiceName = "Japan Pass";
            break;
        case "C":
            GetServiceName = "Car Rental";
            break;
        case "OP":
            GetServiceName = "Online Package";
            break;
        case "P":
            GetServiceName = "Package";
            break;
        case "I":
            GetServiceName = "Insurance";
            break;
        case "I_RP":
            GetServiceName = "Refundable Plan";
            break;


        default:
            GetServiceName = type;
            break;
    }
    return GetServiceName;
};

function GetBookingTypeDirective(type) {

    var GetType = type;
    switch (type) {
        case 1:
            GetType = "Online XML";
            break;
        case 2:
            GetType = "Offline";
            break;
        case 3:
            
            GetType = CCode == "1" ? "Online BestBuy" : "Contract";
            break;



        default:
            GetType = type;
            break;
    }
    return GetType;
};

function GetMemberTypeDirective(type) {

    var GetType = type;
    switch (type) {
        case 1:
            GetType = "HQ";
            break;
        case 2:
            GetType = "Br";
            break;
        case 3:
            GetType = "WS";
            break;
        case 4:
        GetType = "Ag";
        break;

        default:
            GetType = type;
            break;


            }
    return GetType;
    };

function GetTransferServiceTypeDirective(TransfertST) {

    var GetTransferService = TransfertST;
    switch (TransfertST) {
        case 1:
            GetTransferService = "Airport";
            break;
        case 2:
            GetTransferService = "Accommodation";
            break;
        case 3:
            GetTransferService = "Port";
            break;
        case 4:
            GetTransferService = "Station";
            break;
        case 5:
            GetTransferService = "Others";
            break;
        

        default:
            GetTransferService = TransfertST;
            break;
    }
    return GetTransferService;
};

function GetTransferTourTypeDirective(type) {

    var GetType = type;
    switch (type) {
        case 1:
            GetType = "SIC";
            break;
        case 2:
            GetType = "Private";
            break;
      


        default:
            GetType = type;
            break;
    }
    return GetType;
};

function Customdaterangelist() {
    var Customdaterangelist=[];
    
    const today = new Date()

    var Todayrange = ConvertCustomrangedate(new Date()) + "~" + ConvertCustomrangedate(new Date());
 
    DateRangeDO = {
        "Name": "Today",
        "Values":  Todayrange

    }
     Customdaterangelist.push(DateRangeDO);

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1);
    var Yesterdayrange = ConvertCustomrangedate(yesterday) + "~" + ConvertCustomrangedate(yesterday);
    DateRangeDO = {
        "Name": "Yesterday",
        "Values":Yesterdayrange

    }
     Customdaterangelist.push(DateRangeDO);


    //var curr = new Date; // get current date
    //var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    //var last = first + 6; // last day is the first day + 6
    //var Weekfirstday = new Date(curr.setDate(first));
    //var Weeklastday = new Date(curr.setDate(last));
    //var CurrentWeekrange = ConvertCustomrangedate(Weekfirstday) + "~" + ConvertCustomrangedate(Weeklastday);
    //DateRangeDO = {
    //    "Name": "Current Week",
    //    "Values":  CurrentWeekrange

    //}
    //Customdaterangelist.push(DateRangeDO);


    var current = new Date();     // get current date      
    var weekstart2 = (current.getDate() - current.getDay() - 1) + 1;
    //var weekstart = (current2.getDate() - current.getDay()) + 1;
    var monday = new Date(current.setDate(weekstart2));

    var current2 = new Date();     // get current date 
    var weekstart = (current2.getDate() - current2.getDay());
    var weekend = weekstart + 6;       // end day is the first day + 6 
    var sunday = new Date(current2.setDate(weekend));

    var CurrentWeekrange = ConvertCustomrangedate(monday) + "~" + ConvertCustomrangedate(sunday);
    DateRangeDO = {
        "Name": "Current Week",
        "Values": CurrentWeekrange

    }
    Customdaterangelist.push(DateRangeDO);



    var nowdate = new Date();
    var Monthfirstday = new Date(nowdate.getFullYear(), nowdate.getMonth(), 1);
    var Monthlastday = new Date(nowdate.getFullYear(), nowdate.getMonth() + 1, 0);
    var CurrentMonthrange = ConvertCustomrangedate(Monthfirstday) + "~" + ConvertCustomrangedate(Monthlastday);
    DateRangeDO = {
        "Name": "Current Month",
        "Values":  CurrentMonthrange

    }
     Customdaterangelist.push(DateRangeDO);


    var CurrentQuarterfirstday = getCurrentPreviousQuarter("current").StartDate;
    var CurrentQuarterlastday = getCurrentPreviousQuarter("current").EndDate;
    var CurrentQuarterrange = ConvertCustomrangedate(CurrentQuarterfirstday) + "~" + ConvertCustomrangedate(CurrentQuarterlastday);
    DateRangeDO = {
        "Name": "Current Quarter",
        "Values":  CurrentQuarterrange

    }
     Customdaterangelist.push(DateRangeDO);



     var CurrentYeartoDaterange = ConvertCustomrangedate(new Date(new Date().getFullYear(), 0, 1)) + "~" + ConvertCustomrangedate(new Date());
    DateRangeDO = {
        "Name": "Current Year to Date",
        "Values":  CurrentYeartoDaterange

    }
     Customdaterangelist.push(DateRangeDO);

    var beforeOneWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000)
    var beforeOneWeek2 = new Date(beforeOneWeek);
    day = beforeOneWeek.getDay();
    diffToMonday = beforeOneWeek.getDate() - day ;
    var PreviousWeekfirstday = new Date(beforeOneWeek.setDate(diffToMonday))
    var PreviousWeeklastday = new Date(beforeOneWeek2.setDate(diffToMonday + 6));
    var PreviousWeekrange = ConvertCustomrangedate(PreviousWeekfirstday) + "~" + ConvertCustomrangedate(PreviousWeeklastday);
    DateRangeDO = {
        "Name": "Previous Week",
        "Values":  PreviousWeekrange

    }
     Customdaterangelist.push(DateRangeDO);


    var now = new Date();
    var PreviousMonthlastday = new Date(now.getFullYear(), now.getMonth(), 0);
    var PreviousMonthfirstday = new Date(now.getFullYear() - (now.getMonth() > 0 ? 0 : 1), (now.getMonth() - 1 + 12) % 12, 1);
    var PreviousMonthrange = ConvertCustomrangedate(PreviousMonthfirstday) + "~" + ConvertCustomrangedate(PreviousMonthlastday);
    DateRangeDO = {
        "Name": "Previous Month",
        "Values":  PreviousMonthrange

    }
     Customdaterangelist.push(DateRangeDO);



    var PreviousQuarterfirstday = getCurrentPreviousQuarter("previous").StartDate;
    var PreviousQuarterlastday = getCurrentPreviousQuarter("previous").EndDate;
    var PreviousQuarterrange = ConvertCustomrangedate(PreviousQuarterfirstday) + "~" + ConvertCustomrangedate(PreviousQuarterlastday);
    DateRangeDO = {
        "Name": "Previous Quarter",
        "Values":  PreviousQuarterrange

    }
     Customdaterangelist.push(DateRangeDO);



    var lastyear = new Date(new Date().getFullYear() - 1, 0, 1);
    var PreviousYearfirstday = (new Date(lastyear.getFullYear(), 0, 1)),
    PreviousYearlastday = (new Date(lastyear.getFullYear(), 11, 31));
    var PreviousYearrange = ConvertCustomrangedate(PreviousYearfirstday) + "~" + ConvertCustomrangedate(PreviousYearlastday);
    DateRangeDO = {
        "Name": "Previous Year",
        "Values":  PreviousYearrange

    }
     Customdaterangelist.push(DateRangeDO);

    return  Customdaterangelist;



}


function getCurrentPreviousQuarter(value) {
    var today = new Date(),
        quarter = Math.floor((today.getMonth() / 3)),
        startDate,
        endDate;

    switch (value) {
        case "previous":
            startDate = new Date(today.getFullYear(), quarter * 3 - 3, 1);
            endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 3, 0);
            break;
        default:
            startDate = new Date(today.getFullYear(), quarter * 3, 1);
            endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 3, 0);
            break;
    }

    return {
        StartDate: startDate,
        EndDate: endDate
    };
}

function ConvertCustomrangedate(str) {

    var mnths = {
        '01': "Jan",
        '02': "Feb",
        '03': "Mar",
        '04': "Apr",
        '05': "May",
        '06': "Jun",
        '07': "Jul",
        '08': "Aug",
        '09': "Sep",
        '10': "Oct",
        '11': "Nov",
        '12': "Dec"
    };

    var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
    return [day, mnths[mnth], date.getFullYear()].join(" ");

  
    //  date = str.split(" ");
    //return [date[2], mnths[date[1]], date[3]].join(" ");
    //console.log(convert("Thu Jun 09 2011 00:00:00 GMT+0530 (India Standard Time)"))
    ////-> "2011-06-09"
}

function diffDate(date1, date2) {
    var diff = Math.floor(date1.getTime() - date2.getTime());
    var day = 1000 * 60 * 60 * 24;

    var days = Math.round(diff / day);
    var months = Math.round(days / 31);
    var years = Math.floor(months / 12);

    var mothnsdifftotal= diff / (1000 * 60 * 60 * 24 * 30);
    //var message = date2.toDateString();
    //message += " was "
    //message += days + " days "
    //message += months + " months "
    //message += years + " years ago \n"

    // return message
    return mothnsdifftotal;
}


//PostBooking Init
function PostBooking_Init(PostBooking, LoginMemberType)
{
    if (LoginMemberType == "1") {
        PostBooking.Br_Id = $("#hdnLoginMemberId").val();
        PostBooking.PostMemberId = $("#hdnLoginMemberId").val();
        PostBooking.MemberTypeSelected = GetE("hdnLoginMemberTypeId").value;
        PostBooking.PostParentMemberId = $("#hdnLoginMemberId").val();
       
    }
    else if (LoginMemberType == "2") {
        PostBooking.Br_Id = $("#hdnLoginMemberId").val();
        PostBooking.PostMemberId = $("#hdnLoginMemberId").val();
        PostBooking.MemberTypeSelected = GetE("hdnLoginMemberTypeId").value;
        PostBooking.PostParentMemberId = $("#hdnLoginMemberId").val();
        
    }
    else if (LoginMemberType == "3") {

        PostBooking.Ws_Id = $("#hdnLoginMemberId").val();
        PostBooking.PostMemberId = $("#hdnLoginMemberId").val();
        PostBooking.MemberTypeSelected = GetE("hdnLoginMemberTypeId").value;
        PostBooking.PostParentMemberId = $("#hdnLoginMemberId").val();
        
    }
    else if (LoginMemberType == "4") {
        PostBooking.Ag_Id = $("#hdnLoginMemberId").val();
        PostBooking.PostMemberId = $("#hdnLoginMemberId").val();
        PostBooking.PostUserId = $("#hdnLoginUserId").val();
        PostBooking.MemberTypeSelected = GetE("hdnLoginMemberTypeId").value;
        PostBooking.PostParentMemberId = $("#hdnLoginMemberId").val();
        
    }
    return PostBooking;
}

//Onchange 
function Set_PostMemberDetails(event, PostBooking) {

    switch (this.event.target.id) {
        case "ddl_BR":
            PostBooking.Ag_Id = 0;
            PostBooking.Ws_Id = 0;
            PostBooking.Br_Id = (this.event.target.value);
            PostBooking.ReportCompanyName = GetE("ddl_BR").options[GetE("ddl_BR").selectedIndex].text;
            PostBooking.MemberTypeSelected = 0;
            PostBooking.PostMemberId = 0;
            PostBooking.PostParentMemberId = this.event.target.value;
            break;
        case "ddl_WS":
            PostBooking.Ag_Id = 0;
            PostBooking.Ws_Id = (this.event.target.value);
            PostBooking.MemberTypeSelected = 3;
            PostBooking.PostMemberId = (this.event.target.value);
            PostBooking.PostParentMemberId = this.event.target.value;
            PostBooking.ReportCompanyName = GetE("ddl_WS").options[GetE("ddl_WS").selectedIndex].text;
            break;
        case "ddl_AG":
            PostBooking.Ag_Id = (this.event.target.value);
            PostBooking.MemberTypeSelected = 4;
            PostBooking.PostMemberId = (this.event.target.value);
            PostBooking.ReportCompanyName = GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text;
            break;

    }
    return PostBooking;
}

//PostBooking_Setting
function PostBooking_Setting(PostBooking, LoginMemberType)
{
    
    if (LoginMemberType == "1")
    {
        if (PostBooking.ReportCompanyName == "Select Branch" || PostBooking.ReportCompanyName == "" || GetE("ddl_BR").options[GetE("ddl_BR").selectedIndex].text == "All Branch") {
            PostBooking.ReportCompanyName = "All Branch";
        }

        if (PostBooking.ReportCompanyName == "All Branch" || GetE("ddl_BR").options[GetE("ddl_BR").selectedIndex].text == "All Branch") {
            PostBooking.PostMemberId = $("#hdnLoginMemberId").val();
            PostBooking.Br_Id = $("#hdnLoginMemberId").val();
        }

       

        if (PostBooking.ReportCompanyName == "All Agent" || GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text == "All Agent")
        {
            if ($("#ddl_WS") != null && GetE("ddl_WS").options[GetE("ddl_WS").selectedIndex].text != "Select Wholesaler" && GetE("ddl_WS").options[GetE("ddl_WS").selectedIndex].text != "All Wholesaler")
            {
                PostBooking.PostMemberId = PostBooking.Ws_Id;
            } else
            {
                PostBooking.PostMemberId = PostBooking.Br_Id;
            }
           
        }

    }
    else if (LoginMemberType == "2")
    {

        PostBooking.Br_Id = $("#hdnLoginMemberId").val();

        if (PostBooking.ReportCompanyName == "Select Agent" || PostBooking.ReportCompanyName == "" || GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text == "All Agent") {
            PostBooking.ReportCompanyName = "All Agent";
        }

        if (PostBooking.ReportCompanyName == "All Agent" || GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text == "All Agent")
        {
            if ($("#ddl_WS") != null && GetE("ddl_WS").options[GetE("ddl_WS").selectedIndex].text != "Select Wholesaler" && GetE("ddl_WS").options[GetE("ddl_WS").selectedIndex].text != "All Wholesaler") {
                PostBooking.PostMemberId = PostBooking.Ws_Id;
            } else {
                PostBooking.PostMemberId = PostBooking.Br_Id;
            }

        }

        //if (PostBooking.ReportCompanyName == "All Agent" || GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text == "All Agent") {
        //    PostBooking.PostMemberId = PostBooking.Br_Id;
        //}


    }
    else if (LoginMemberType == "3")
    {

        if (PostBooking.ReportCompanyName == "Select Agent" || PostBooking.ReportCompanyName == "" || GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text == "All Agent") {
            PostBooking.ReportCompanyName = "All Agent";
        }
        if (PostBooking.ReportCompanyName == "All Agent" || GetE("ddl_AG").options[GetE("ddl_AG").selectedIndex].text == "All Agent") {
            PostBooking.PostMemberId = PostBooking.Ws_Id;
        }

    }


   
   
    return PostBooking;
   
   
}


function removeElementsfromhidelist(array, elem) {
    var index = array.indexOf(elem);
    while (index > -1) {
        array.splice(index, 1);
        index = array.indexOf(elem);
    }

    return array;
}

//asc
function sortByKeyAsc(array, key) {
    return array.sort((a, b) => {
        let x = a[key];
        let y = b[key];

        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
//desc
function sortByKeyDesc(array, key) {
    return array.sort((a, b) => {
        let x = a[key];
        let y = b[key];

        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
}



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

//set filterlist in ddllist in popup
function Set_FilterList(FilterDOList, FilterTypeActive, MainResultlist, ReportFilter) {

    var OldSelectedfilterArrayValues = "";
    if (FilterDOList.length > 0) {
        FilterDOList.filter(r => {
            if (r.Name == FilterTypeActive) {
                OldSelectedfilterArrayValues = r.Values;               
            }
        });
    }
    else {

        OldSelectedfilterArrayValues = ReportFilter[FilterTypeActive]

       
    }



    var MainResultlistAfterFilter = MainResultlist;

    $.each(FilterDOList, function (index) {
        if (FilterDOList[index].Name != FilterTypeActive) {

            MainResultlistAfterFilter.filter(x => {

                MainResultlistAfterFilter = MainResultlistAfterFilter.filter(
                item=> {
                    if (FilterDOList[index].Values != "" && FilterDOList[index].Values != " " && FilterDOList[index].Values != undefined && FilterDOList[index].Values != 'undefined') {
                        if (FilterDOList[index].Values.indexOf('~') > -1)
                        {
                            if (FilterDOList[index].Values.split('~').includes((item[FilterDOList[index].Name]).toString())) {
                                return item;
                            }
                        }
                        else {
                            switch (FilterDOList[index].Range) {
                                case "Equals":
                                    if (FilterDOList[index].Values == (item[FilterDOList[index].Name])) {
                                        return item;
                                    }
                                    break;
                                case "NotEqualsTo":
                                    if (FilterDOList[index].Values != (item[FilterDOList[index].Name])) {
                                        return item;
                                    }
                                    break;
                                case "IsGreaterThan":
                                    if (FilterDOList[index].Values < (item[FilterDOList[index].Name])) {
                                        return item;
                                    }
                                    break;
                                case "IsGreaterThanOrEqualTo":
                                    if (FilterDOList[index].Values <= (item[FilterDOList[index].Name])) {
                                        return item;
                                    }
                                    break;
                                case "IsLessThan":
                                    if (FilterDOList[index].Values > (item[FilterDOList[index].Name])) {
                                        return item;
                                    }
                                    break;
                                case "IsLessThanOrEqualTo":
                                    if (FilterDOList[index].Values >= (item[FilterDOList[index].Name])) {
                                        return item;
                                    }
                                    break;
                            }
                        }

                    }
                    else {
                        return item;
                    }
                }
                );
            });


        }
    });

    var ShowddlFilterList = [];


    MainResultlistAfterFilter.filter(x => {
        if (ShowddlFilterList.indexOf(x[FilterTypeActive]) === -1) {
            ShowddlFilterList.push(x[FilterTypeActive]);
        }

    });


    ShowddlFilterList.sort();


    if (ShowddlFilterList.length > 0) {

        $('#ddlFilter').empty();
        $('#ddlFilter option').remove();
        $('#ddlFilter').multiselect('destroy');



        $.each(ShowddlFilterList, function (index)
        {
           
            if (OldSelectedfilterArrayValues.length > 0)
            {
               
                if (OldSelectedfilterArrayValues.split('~').includes(ShowddlFilterList[index].toString()) == true && OldSelectedfilterArrayValues.indexOf('~') > -1)  // && condition ->if same col apply  number filter and then if have ~ sign then its ddl selected else its number filter  so in ddl not selected
                {

                        $('#ddlFilter').append($('<option selected="selected"></option>').val(ShowddlFilterList[index]).html(ShowddlFilterList[index] + "  " + "(" + MainResultlistAfterFilter.filter(x => x[FilterTypeActive] == ShowddlFilterList[index]).length + ")"));


                }
                else {

                        $('#ddlFilter').append($('<option></option>').val(ShowddlFilterList[index]).html(ShowddlFilterList[index] + "  " + "(" + MainResultlistAfterFilter.filter(x => x[FilterTypeActive] == ShowddlFilterList[index]).length + ")"));

                    }
             }
            else
            {

                    $('#ddlFilter').append($('<option></option>').val(ShowddlFilterList[index]).html(ShowddlFilterList[index] + "  " + "(" + MainResultlistAfterFilter.filter(x => x[FilterTypeActive] == ShowddlFilterList[index]).length + ")"));


            }
            
           

        });
    }


    forMultiselect();

    return MainResultlistAfterFilter;

}


//on Apply btn Click
function Apply_Filter(FilterDOList, FilterTypeActive, MainResultlist) {

    var selectedArray = "";
    var selectDest = document.getElementById('ddlFilter');
    var i;
    var count = 0;
    for (i = 0; i < document.getElementById('ddlFilter').children.length; i++) {
        if (selectDest[i].selected) {
            selectedArray += selectDest[i].value + "~";
            count++;

        }
    }
    FilterDO = {
        "Name": FilterTypeActive,
        "Values": selectedArray,
        "Range": "",
        "IsNumberFilter": false
    }


    if (FilterDOList.length > 0) {

        if (FilterDOList.filter(item=> item.Name == FilterTypeActive).length == 0) {
            FilterDOList.push(FilterDO);
            $("#" + FilterTypeActive)[0].style.color = "red";
        }
        else {
            FilterDOList.filter(r => {
                if (r.Name == FilterTypeActive)
                {
                    r.Values = FilterDO.Values;
                }
                if (r.Values != "") {
                    $("#" + r.Name)[0].style.color = "red";
                }
                else {
                    $("#" + r.Name)[0].style.color = "#337ab7";
                }
            });

        }

    }
    else {
        $("#" + FilterTypeActive)[0].style.color = "red";
        FilterDOList.push(FilterDO);

    }



    var MainResultlistAfterFilter = MainResultlist;

    $.each(FilterDOList, function (index) {


        MainResultlistAfterFilter = MainResultlistAfterFilter.filter(
                item=> {
                    if (FilterDOList[index].Values != "" && FilterDOList[index].Values != " " && FilterDOList[index].Values != undefined && FilterDOList[index].Values != 'undefined') {
                        if (FilterDOList[index].Values.indexOf('~') > -1 ) {
                            if (FilterDOList[index].Values.split('~').includes((item[FilterDOList[index].Name]).toString())) {
                                return item;
                            }
                        }
                        else {
                            switch (FilterDOList[index].Range) {
                                case "Equals":
                                    if (FilterDOList[index].Values == (item[FilterDOList[index].Name])) {
                                        return item;
                                    }
                                    break;
                                case "NotEqualsTo":
                                    if (FilterDOList[index].Values != (item[FilterDOList[index].Name])) {
                                        return item;
                                    }
                                    break;
                                case "IsGreaterThan":
                                    if (FilterDOList[index].Values < (item[FilterDOList[index].Name])) {
                                        return item;
                                    }
                                    break;
                                case "IsGreaterThanOrEqualTo":
                                    if (FilterDOList[index].Values <= (item[FilterDOList[index].Name])) {
                                        return item;
                                    }
                                    break;
                                case "IsLessThan":
                                    if (FilterDOList[index].Values > (item[FilterDOList[index].Name])) {
                                        return item;
                                    }
                                    break;
                                case "IsLessThanOrEqualTo":
                                    if (FilterDOList[index].Values >= (item[FilterDOList[index].Name])) {
                                        return item;
                                    }
                                    break;
                            }
                        }
                    }
                    else {
                        return item;
                    }
                }
                );


    });
    return MainResultlistAfterFilter;
   
}



//Number Range Filter set
function Set_NumberRangeFilterList(FilterDOList, FilterTypeActive, MainResultlist, ReportFilter) {

   
    var OldSelectedfilterArrayValues = "";
    if (FilterDOList.length > 0) {
        FilterDOList.filter(r => {
            if (r.Name == FilterTypeActive) {
                OldSelectedfilterArrayValues = r.Values;             
            }
         
        });
    }
    else {
        OldSelectedfilterArrayValues = ReportFilter[FilterTypeActive];            
    }



    var MainResultlistAfterFilter = MainResultlist;

    $.each(FilterDOList, function (index) {
        if (FilterDOList[index].Name != FilterTypeActive) {

            MainResultlistAfterFilter.filter(x => {

                MainResultlistAfterFilter = MainResultlistAfterFilter.filter(
                item=> {
                    if (FilterDOList[index].Values != "" && FilterDOList[index].Values != " " && FilterDOList[index].Values != undefined && FilterDOList[index].Values != 'undefined') {
                        if (FilterDOList[index].Values.indexOf('~') > -1) {
                            if (FilterDOList[index].Values.split('~').includes((item[FilterDOList[index].Name]).toString())) {
                                return item;
                            }
                        }
                        else {
                            switch (FilterDOList[index].Range) {
                                case "Equals":
                                    if (FilterDOList[index].Values == (item[FilterDOList[index].Name])) {
                                        return item;
                                    }
                                    break;
                                case "NotEqualsTo":
                                    if (FilterDOList[index].Values != (item[FilterDOList[index].Name])) {
                                        return item;
                                    }
                                    break;
                                case "IsGreaterThan":
                                    if (FilterDOList[index].Values < (item[FilterDOList[index].Name])) {
                                        return item;
                                    }
                                    break;
                                case "IsGreaterThanOrEqualTo":
                                    if (FilterDOList[index].Values <= (item[FilterDOList[index].Name])) {
                                        return item;
                                    }
                                    break;
                                case "IsLessThan":
                                    if (FilterDOList[index].Values > (item[FilterDOList[index].Name])) {
                                        return item;
                                    }
                                    break;
                                case "IsLessThanOrEqualTo":
                                    if (FilterDOList[index].Values >= (item[FilterDOList[index].Name])) {
                                        return item;
                                    }
                                    break;
                            }
                        }
                    }
                    else {
                        return item;
                    }
                }
                );
            });


        }
    });

    var ShowddlFilterList = [];


    MainResultlistAfterFilter.filter(x => {
        if (ShowddlFilterList.indexOf(x[FilterTypeActive]) === -1) {
            ShowddlFilterList.push(x[FilterTypeActive]);
        }

    });


    ShowddlFilterList.sort();


    if (ShowddlFilterList.length > 0)
    {

        $('#numberrange option').remove();
        $('#numberrangetext').val("");
      
        
        $.each(ShowddlFilterList, function (index)
        {
          
            if (OldSelectedfilterArrayValues.length > 0) {
                if (OldSelectedfilterArrayValues.split('~').includes(ShowddlFilterList[index].toString()) == true && OldSelectedfilterArrayValues.indexOf('~') == -1)
                {
                    $('#numberrange').append($('<option selected="selected"></option>').val(ShowddlFilterList[index]).html((ShowddlFilterList[index])));
                    $('#numberrangetext').val(ShowddlFilterList[index]);
                }
                else {
                    $('#numberrange').append($('<option></option>').val(ShowddlFilterList[index]).html((ShowddlFilterList[index])));
                }
            }
            else {

                $('#numberrange').append($('<option></option>').val(ShowddlFilterList[index]).html((ShowddlFilterList[index])));


            }
        });


        var OldSelectedRangeOption = "";
        if (FilterDOList.length > 0) {
            FilterDOList.filter(r => {
                if (r.Name == FilterTypeActive && r.Values != "")
                {
                    OldSelectedRangeOption = r.Range;
                 
                }

            });
        }
        else {

            OldSelectedRangeOption = ReportFilter[FilterTypeActive];
           
        }

        $('#ddl_Range').empty();
        $('#ddl_Range option').remove();

        var Rangelist = SetRangeList();
        $.each(Rangelist, function (index)
        {
            if (OldSelectedRangeOption.length > 0)
            {
                if (OldSelectedRangeOption.includes(Rangelist[index].split('~')[0].toString()) == true)
                {
                    $('#ddl_Range').append($('<option selected="selected"></option>').val(Rangelist[index].split('~')[0]).html((Rangelist[index].split('~')[1])));
                }
                else {
                    $('#ddl_Range').append($('<option></option>').val(Rangelist[index].split('~')[0]).html((Rangelist[index].split('~')[1])));
                }
            }
            else {
                $('#ddl_Range').append($('<option></option>').val(Rangelist[index].split('~')[0]).html((Rangelist[index].split('~')[1])));
            }
        });

       

    }

    return MainResultlistAfterFilter;

    }

function SetRangeList()
    {
        var RangeList = ['0~None', 'Equals~Equals', 'NotEqualsTo~Not Equals To', 'IsGreaterThan~Is Greater Than', 'IsGreaterThanOrEqualTo~Is Greater Than Or Equal To', 'IsLessThan~Is Less Than', 'IsLessThanOrEqualTo~Is Less Than Or Equal To'];
        return RangeList;
    }

//apply  Number range validation
function Apply_NumberRangeFilterValidation()
{
    var isapply = true;
   

    if ($("#ddl_Range").val() == "0" ||
       ($("#numberrange option[value='" + $('#numberrangetext').val() + "']").attr('value') == "" || $("#numberrange option[value='" + $('#numberrangetext').val() + "']").attr('value') == undefined || $("#numberrange option[value='" + $('#numberrangetext').val() + "']").attr('value') == "undefined"))
    {
        if ($("#numberrangetext").val() == "" || $("#numberrangetext").val() == undefined || $("#numberrangetext").val() == 'undefined')
        {
            Alert.render("Please Select Range Filter Option", "");
            isapply = false;
        }
      
    }
    return isapply;
   
}
function Apply_NumberRangeFilter(FilterDOList, FilterTypeActive, MainResultlist) {

    var selectedArray = "";
   
    var i;
    var count = 0;
    if ($("#numberrange option[value='" + $('#numberrangetext').val() + "']").attr('value') != undefined && $("#numberrange option[value='" + $('#numberrangetext').val() + "']").attr('value') != 'undefined') {
        selectedArray = $("#numberrange option[value='" + $('#numberrangetext').val() + "']").attr('value')
    }
    else {
        if ($("#numberrangetext").val() != "" && $("#numberrangetext").val() != undefined && $("#numberrangetext").val() != 'undefined') {
            selectedArray = $("#numberrangetext").val();
        }
    }


    
        FilterDO = {
            "Name": FilterTypeActive,
            "Values": selectedArray,
            "Range": $("#ddl_Range").val(),
            "IsNumberFilter":true
        }
  

        if (FilterDOList.length > 0) {

            if (FilterDOList.filter(item=> item.Name == FilterTypeActive).length == 0) {
                FilterDOList.push(FilterDO);
                $("#" + FilterTypeActive)[0].style.color = "red";
            }
            else {
                FilterDOList.filter(r => {
                    if (r.Name == FilterTypeActive) {
                        r.Values = FilterDO.Values;
                        r.Range = $("#ddl_Range").val();
                        r.IsNumberFilter = true;
                    }
                    if (r.Values != "") {
                        $("#" + r.Name)[0].style.color = "red";
                    }
                    else {
                        $("#" + r.Name)[0].style.color = "#337ab7";
                    }
                });

            }

        }
        else {
            $("#" + FilterTypeActive)[0].style.color = "red";
            FilterDOList.push(FilterDO);

        }



    var MainResultlistAfterFilter = MainResultlist;


    $.each(FilterDOList, function (index) {

        MainResultlistAfterFilter = MainResultlistAfterFilter.filter(
                item=> {


                    if (FilterDOList[index].Values != "" && FilterDOList[index].Values != " " && FilterDOList[index].Values != undefined && FilterDOList[index].Values != 'undefined') {
                       
                        if (FilterDOList[index].Values.indexOf('~') > -1)
                        {
                            if (FilterDOList[index].Values.split('~').includes((item[FilterDOList[index].Name]).toString())) {
                                return item;
                            }
                        }
                        else {
                            switch (FilterDOList[index].Range) {
                                case "Equals":
                                    if (FilterDOList[index].Values == (item[FilterDOList[index].Name])) {
                                        return item;
                                    }
                                    break;
                                case "NotEqualsTo":
                                    if (FilterDOList[index].Values != (item[FilterDOList[index].Name])) {
                                        return item;
                                    }
                                    break;
                                case "IsGreaterThan":
                                    if (FilterDOList[index].Values < (item[FilterDOList[index].Name])) {
                                        return item;
                                    }
                                    break;
                                case "IsGreaterThanOrEqualTo":
                                    if (FilterDOList[index].Values <= (item[FilterDOList[index].Name])) {
                                        return item;
                                    }
                                    break;
                                case "IsLessThan":
                                    if (FilterDOList[index].Values > (item[FilterDOList[index].Name])) {
                                        return item;
                                    }
                                    break;
                                case "IsLessThanOrEqualTo":
                                    if (FilterDOList[index].Values >= (item[FilterDOList[index].Name])) {
                                        return item;
                                    }
                                    break;
                            }
                        }

                       
                    }
                    else {
                        return item;
                    }


                }
                );
    });



    return MainResultlistAfterFilter;

}

//onHide Popup Click
function Hide_Columns(table) {
    var oTable = $('#' + table).dataTable();
    var select = document.getElementById('ddlHide');
    var k;
    var count = 0;
    for (k = 0; k < document.getElementById('ddlHide').children.length; k++) {
        if (select[k].selected) {

            var iCol = parseInt(select[k].value);
            var bVis = true;
            oTable.fnSetColumnVis(iCol, bVis ? false : true);

        }
        else {
            var iCol = parseInt(select[k].value);
            var bVis = false;
            oTable.fnSetColumnVis(iCol, bVis ? false : true);
        }

    }

    var model1 = angular.element(document.querySelector('#hidecoldiv'));
    model1.modal('hide');
}

//on Custom Popup Apply sorting Click
function Apply_Sorting(table, SortDetails)
{
    var oTable = $('#' + table).dataTable();
    var levelcount = SortDetails.length;
    var sort = [];
    var Issort = false;


    for (var i = 0; i < levelcount; i++) {
        var sortcol = $('#sortcolunm_' + (i + 1)).val().split('~')[0];
        var sortorder = $('#sortorder_' + (i + 1)).val();

        if ($('#sortcolunm_' + (i + 1)).val() == "0") {
            Alert.render("Please Select Column for Sorting", "");
            Issort = false;
            return false;
        }
        else if ($('#sortcolunm_' + (i + 1)).val() == $('#sortcolunm_' + ((i + 1)-1)).val()) {
            Alert.render("There are two same Sort Columns not allowd,Please Select  another Column for Sorting", "");
            Issort = false;
            return false;
        }
        else {
            sort.push([sortcol, sortorder]);           
            Issort = true;
        }

    }
    if (Issort == true) {
        oTable.fnSort(sort);
    }


    $("#Sortcoldiv").modal('hide');
}

//Sorting Popup clear button Click
function Clear_Sorting(table) {
    var oTable = $('#' + table).dataTable();
    oTable.fnSort([]);
   
    var SortDetails = [];
    var objSort = [];
    objSort.SrNo = (1);
    objSort.Column = "0";
    objSort.Order = "0";
    SortDetails.push(objSort);
    $("#Sortcoldiv").modal('hide');

    if ($("#ddltopdatawithsort") != null)
    {
        $("#ddltopdatawithsort").val("0");
    }
    if ($("#ddltopdata") != null) {
        $("#ddltopdata").val("0");
    }
    return SortDetails;
}

//Add sorting level
function AddSorting_MoreLevel(currentsrno, SortDetails) {

    if ($('#sortcolunm_' + (currentsrno)).val() != "0") {

        var SrNo = SortDetails.length;
        if (SortDetails.length < 15) {
            var objSort = [];
            objSort.SrNo = (SrNo + 1);
            objSort.Column = "0";
            objSort.Order = "0";
            SortDetails.push(objSort);
            return SortDetails;
        }
    }
    else {
        Alert.render("Please Select Previous Column for Sorting then add new level", "");
        return false;
    }

}

//remove sorting level
function DeleteSorting_Level(SrNo, SortDetails) {
    SortDetails.splice(SrNo - 1, 1);
    for (var i = 0; i < SortDetails.length; i++) {
        SortDetails[i].SrNo = (i + 1);
    }

    return SortDetails;

}

//Top record show with Sorting 
function TopData_With_Sort(MainResultlistAfterFilter, SortDetails)
{
    
    var levelcount = SortDetails.length;
   
    for (var i = 0; i < levelcount; i++)
    {
        var sortcol = $('#sortcolunm_' + (i + 1)).val().split('~')[1];
        var sortorder = $('#sortorder_' + (i + 1)).val();
        if (sortorder == 'asc')
        {
            MainResultlistAfterFilter = sortByKeyAsc(MainResultlistAfterFilter, sortcol);
        }
        else {
            MainResultlistAfterFilter = sortByKeyDesc(MainResultlistAfterFilter, sortcol);
        }
      
    }

    return MainResultlistAfterFilter;
}


//Sessionout Redirect to Login
function SessionTimeout()
{
    window.location = "../Login/Login?Code=0";
}











