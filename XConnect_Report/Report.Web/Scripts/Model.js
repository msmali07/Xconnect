function PostBookingDO() {
    PostBookingDO = {
        "CompanyName": "",
        "DirectClient": false,
        "MemberTypeSelected": 0,
        "Ag_Id": 0,
        "Ws_Id": 0,
        "Br_Id": 0,
        "PostParentMemberId": 0,
        "PostMemberId": 0,
        "PostUserId": 0,
        "ReportCompanyName": "TestName",
    }
    return PostBookingDO;
}

function ReportFilterDO() {
    ReportFilterDO = {
        "IsOnePageReport": false,
        "ReportPath": "",
        "Status": 0,
        "type": 0,
        "Client": "",
        "Nts": "",
        "Pax": "",
        "SName": "",
        "SAmt": "",
        "CheckInDate": "",
        "RangeSellAmount": "",
        "RangeSellAmtOption": "",
        "GroupBy": "",
        "HideBy": "0",
        "ActiveFilters": "",
        "CustomDateOption": "",
        "DateFilter": false,
        "PaxFilter": false,
        "TypeFilter": false,
        "AgencyFilter": false,
        "SellAmtFilter": false,
        "StatusFilter": false,
        "IsInbound": "",
        "SuppName": "",
        "Invoiced": 0,
        "SellCur": "",
        "NetCur": "",
        "BrName": "",
        "AgName": "",
        "SType": "",
        "BType": "",
        "BookedBy": "",
        "NetAmt": "",
        "SNetAmt": "",
        "HQExtra": "",
        "BRExtra": "",
        "AGPay": "",
        "TaxPay": "",
        "SSNetAmt": "",
        "ProfitAmt": "",
        "Profit": "",
        "Country": "",
        "City": "",
        "HotelName": "",
        "NoOfRoomNts": "",
        "NoOfAdults": "",
        "NoOfChilds": "",
        "BCount": "",
        "TotalSell": "",
        "BRPay": "",
        "SellAmt": "",
        "NoOfPax": "",
        "Remarks":"",
        "RRdate": "",
        "Currency": "",
        "Balance": "",

        "HMStatus": "",
        "HM_SuppName": "",
        "HM_NetCur":""
    }

    return ReportFilterDO;
}

function SendMailDO() {
    SendMailDO = {

        "ReportName": "",
        "MailFrom": "",
        "MailTo": "",
        "MailCc": "",
        "Subject": "",
        "MailBody": "",
        "Attachment": "",
        "Message": "",
        "UserName": "",
        "SendMailDate": "",
        "UserId": 0,
    }
    return SendMailDO;
}

function AccountReportDO() {


    AccountReportDO = {

        "DateFrom": "",
        "DateTo": "",
        "MemberId": 0,
        "LoginUserId": 0,
        "BookingdateWise": false,

    }

    return AccountReportDO;
}

function PickupReportDO() {


    AccountReportDO = {
        "DateFrom": "",
        "DateTo": "",
    }

    return AccountReportDO;
}

function SaleProdReportDO() {


    SaleProdReportDO = {

        "DateFrom": "",
        "DateTo": "",
        "MemberId": 0,
        "LoginUserId": 0,
        "BookingdateWise": true,
        "InTermsOf": "",

    }

    return SaleProdReportDO;
}

function HQProdReportDO() {


    HQProdReportDO = {

        "DateFrom": "",
        "DateTo": "",
        "MemberId": 0,
        "LoginUserId": 0,
        "BookingdateWise": true,

    }

    return HQProdReportDO;
}

function CreditReportDO() {


    CreditReportDO = {
        "FromDate": "",
        "ToDate": "",
        "TotalRecords": 0,
        "MemberId": 0,
        // "CreditFilterDO":ReportFilterDO()

    }

    return CreditReportDO;
}

function SalesReportDO() {


    SalesReportDO = {
        "ChkInDateFrom": "",
        "ChkInDateTo": "",
        "ReceiptDateFrom": "",
        "ReceiptDateTo": "",
        "MemberId": 0,
        "LoginMemberId": 0,
        "LoginUserId": 0,


    }

    return SalesReportDO;
}
function GstReportDo() {


    GstReportDo = {
        "FromDate": "",
        "ToDate": "",
        "TotalRecords": 0,
        "MemberId": 0,
        // "CreditFilterDO":ReportFilterDO()

    }

    return GstReportDo;
}

function ProdReportDO() {


    ProdReportDO = {
        "From": "",
        "To": "",
        "MemberId": 0,
        "LoginUserId": 0,
        "BookingdateWise": false,
        "CityCountryName": "",
        "SupplierId": 0,
        "CityId": 0,
        "Status": "",

    }

    return ProdReportDO;
}

function ProfitLossDO() {


    ProfitLossDO = {
        "DateFrom": "",
        "DateTo": "",
        "MemberId": 0,
        "LoginUserId": 0,
        "BookingdateWise": 0,

        "BookStatus": "",


    }

    return ProfitLossDO;
}
function SortDetailDO() {


    SortDetailDO = {
        "SrNo": "1",
        "Column": "0",
        "Order": "0",



    }

    return SortDetailDO;
}


function BookStatusDO() {


    BookStatusDO = {
        "DateFrom": "",
        "DateTo": "",
        "MemberId": 0,
        "LoginUserId": 0,
        "BookingdateWise": false,

    }

    return BookStatusDO;
}

function ServiceBookDO() {


    ServiceBookDO = {
        "DateFrom": "",
        "DateTo": "",
        "MemberId": 0,
        "LoginUserId": 0,
        "BookingdateWise": false,

    }

    return ServiceBookDO;
}

function BranchReportDO() {


    BranchReportDO = {
        "DateFrom": "",
        "DateTo": "",
        "MemberId": 0,
        "LoginUserId": 0,
        "BookingdateWise": false,
        "Currency": "",
        "InTerms": 1

    }

    return BranchReportDO;
}

function AgentReportDO() {


    AgentReportDO = {
        "DateFrom": "",
        "DateTo": "",
        "MemberId": 0,
        "LoginUserId": 0,
        "BookingdateWise": false,
        "Currency": "",
        "InTerms": 1

    }

    return AgentReportDO;
}

function SupplierReportDO() {


    SupplierReportDO = {
        "DateFrom": "",
        "DateTo": "",
        "MemberId": 0,
        "LoginUserId": 0,
        "BookingdateWise": false,
        "Currency": "",
        "InTerms": 1,
        "ProdType":1


    }

    return SupplierReportDO;
}

function FailedBookReportDO() {


    FailedBookReportDO = {
        "DateFrom": "",
        "DateTo": "",
        "MemberId": 0,
        "LoginUserId": 0,
        "BookingdateWise": false,


    }

    return FailedBookReportDO;
}

function SearchCityBookReportDO() {


    SearchCityBookReportDO = {
        "DateFrom": "",
        "DateTo": "",
        "MemberId": 0,
        "LoginUserId": 0,
        "BookingdateWise": false,


    }

    return SearchCityBookReportDO;
}


function SearchAgentBookReportDO() {


    SearchAgentBookReportDO = {
        "DateFrom": "",
        "DateTo": "",
        "MemberId": 0,
        "LoginUserId": 0,
        "BookingdateWise": false,


    }

    return SearchAgentBookReportDO;
}

function HotelProdDO() {


    HotelProdDO = {
        "DateFrom": "",
        "DateTo": "",
        "MemberId": 0,
        "LoginUserId": 0,
        "BookingdateWise": false,
        "ReportView": 1,   //hotelwise,citywise,paxwise
        "BookingType": 0,
        "ServiceType": 0,
        "SupplierId": 0,
        "CityId": 0,
        "CityName": "",
        "CountryId": 0,
        "CountryName": "",
        "HotelName": "",
        "NationalityId" :0
    }

    return HotelProdDO;
}

function PickupReportDO() {
    PickupReportDO = {
        "DateFrom": "",
        "DateTo": "",
    }
    return PickupReportDO;
}

function NetStatementReportDO() {
    NetStatementReportDO = {
        "DateFrom": "",
        "DateTo": "",
        "MemberId": 0,
        "LoginUserId": 0,
        "BookingdateWise": false,
    }
    return NetStatementReportDO;
}

function DailySalesReportDO() {
    DailySalesReportDO = {
        "DateFrom": "",
        "DateTo": "",
        "MemberId": 0,
        "LoginUserId": 0,
        "BookingdateWise": false,
    }
    return DailySalesReportDO;
}

function CorporateCardUseDO() {
    CorporateCardUseDO = {
        "Id": 0,
        "Name": "",
    }
    return CorporateCardUseDO;
}

function CorporateCardUseReportDO() {
    CorporateCardUseReportDO = {
        "DateFrom": "",
        "DateTo": "",
        "CorporateId": 0,
        "CardUse": "",
        "LoginUserId": 0,
        "BookingdateWise": false,
        "ReportWise":""
    }
    return CorporateCardUseReportDO;
}

function UserSalesReportDO() {
    UserSalesReportDO = {
        "DateFrom": "",
        "DateTo": "",
        "MemberId": 0,
        "UserId": 0,
        "LoginUserId": 0,
        "BookingdateWise": false,
    }
    return UserSalesReportDO;
}



function ContractReportDO() {


    ContractReportDO = {

        "DateFrom": "",
        "DateTo": "",
        "MemberId": 0,
        "LoginUserId": 0,
        "BookingdateWise": false,

    }

    return ContractReportDO;
}

function AgencyReportDO() {


    AgencyReportDO = {

        "DateFrom": "",
        "DateTo": "",
        "MemberId": 0,
        "LoginUserId": 0,
        "BookingdateWise": false,

    }

    return AgencyReportDO;
}

function OperationalIssueReportDO() {


    OperationalIssueReportDO = {

        "DateFrom": "",
        "DateTo": "",
        "MemberId": 0,
        "LoginUserId": 0,
        "BookingdateWise": false,
        "SupplierId": "-1",
        "SupplierName":""

    }

    return OperationalIssueReportDO;
}

function TransactionReportDO() {


    TransactionReportDO = {

        "DateFrom": "",
        "DateTo": "",
        "MemberId": 0,
        "LoginUserId": 0,
        "BookingdateWise": false,

    }

    return TransactionReportDO;
}




//function DeclarePaxDO() {
//    var PAXDo = [];

//    Pax = {
//        "Title": "",
//        "FirstName": "",
//        "SurName": "",
//        "IsChild": false,
//        "PaxSrNo": 0

//    }
//    PAXDo.push(Pax);
//    return Pax;
//}


function AgencyUserReportDO() {


    AgencyUserReportDO = {

        "MemberId": 0,
        "LoginUserId": 0,

    }

    return AgencyUserReportDO;
}

function ProdReportFilterDO() {

    ProductivityReportDO = {
        "bRefNo":"",
        "BookDt": "",
        "CkInDt": "",
        "CkOutDt": "",
        "SellAmt": 0,
        "SellCcy": 0,
        "Agency": "",
        "Country": "",
        "City": "",
        "ServiceTyp": "",
        "nNTS": 0,
        "nRooms": 0,
        "nPax": 0,
        "bStatus": "",
        "bSource": "",
        "BrCode": 0,
        "Service": "",
        "StarCat": "",
        "SuppName":"",
        "GroupBy": "",
        "HideBy": "0",
        "ActiveFilters": "",
        "CustomDateOption": "",
        "DateFilter": false,
        "PaxFilter": false,
        "TypeFilter": false,
        "AgencyFilter": false,
        "SellAmtFilter": false,
        "StatusFilter": false,
    }
    return ProductivityReportDO
}

function ProdtivityReportDO() {
    ProdtivityReportDO = {
        "DateFrom": "",
        "DateTo": "",
        "MemberId": 0,
        "LoginUserId": 0,
        "BookingdateWise": false,
        "BookingType": 0,
        "SupplierId": 0,
        "CityId": 0,
        "CityName": "",
        "CountryId": 0,
        "CountryName": "",
        "BookingStatus": "",
    }
    return ProdtivityReportDO;
}
function MemberCreditDetailsReportDO() {


    MemberCreditDetailsReportDO = {

        "MemberId": 0,
        "LoginUserId": 0,

    }

    return MemberCreditDetailsReportDO;
}

function HotelMiseReportDO() {

    HotelMiseReportDO = {
        "DateFrom": "",
        "DateTo": "",
        "MemberId": 0,
        "LoginUserId": 0,
        "BookingdateWise": false,
        "SupplierId": "-1",
        "SupplierName": ""
    }
    return HotelMiseReportDO;

}

function SalesPersonWiseDO() {


    SalesPersonWiseDO = {
        "DateFrom": "",
        "DateTo": "",
        "MemberId": 0,
        "LoginUserId": 0,
        "BookingdateWise": 0,
        "InTerms": 1,
        "BookStatus": "",


    }

    return SalesPersonWiseDO;
}
/* Common DO For DashBoard V1 Reports  */
function CommonDashBoardV1DO() {

    CommonDashBoardV1DO = {
        "DateFrom": "",
        "DateTo": "",
        "MemberId": 0,
        "LoginUserId": 0,
        "BookingdateWise": 0,
        "InTerms": 1,
        "BookStatus": "",
        "Year": 0,
    }

    return CommonDashBoardV1DO;
}