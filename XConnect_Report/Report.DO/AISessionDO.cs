using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Report.DO
{
    public class AISessionDO
    {
        public string CreditCurrency { get; set; }
        public decimal CreditBalance { get; set; }

        public DateTime LastLoginDate { get; set; }
        public DateTime LastPasswordChange { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public bool Connected { get; set; }
        public int MemberId { get; set; }
        public MemberTypes MemberType { get; set; }
        public int LoginMemberTypeId { get; set; }
        public string CompanyName { get; set; }
        public string Title { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool AdminUser { get; set; }
        public int CountryId { get; set; }

        public string CountryName { get; set; }
        public bool TestUser { get; set; }
        public string Role { get; set; }

        public string Reports { get; set; }


        public bool CreditStatus { get; set; }
        public string UserMail { get; set; }
        public int ApplicableUrl { get; set; }
        public string BranchCode { get; set; }
        public string Services { get; set; }
        public string CompanyLogo { get; set; }
        public bool IsOpenMember { get; set; }

        public RoleDefineDO role = new RoleDefineDO();

        public ReportRoleDefineDO ReportRole = new ReportRoleDefineDO();

       
        public int DepartmentId { get; set; }
        public string DisplayCurrency { get; set; }
        public string TimeZoneDifference { get; set; }
        public bool IsB2C { get; set; }
        public bool IsWithoutLogin { get; set; }
        public string B2CDisplayCurrency { get; set; }
        public string B2CIPCountry { get; set; }
        public int BranchId { get; set; }
        public int count { get; set; }
        public string Password { get; set; }
        public string SessionId { get; set; }
        public int CompCode { get; set; }
        public bool IsMultiBranchUser { get; set; }
        public bool IsOverSeas { get; set; }
        public string SellCurrency { get; set; }
        public float AgMarkup { get; set; }
        public bool bOld2NewSystem { get; set; } //Shailesh

        public string WlCompanyName { get; set; }
        public int WlYear { get; set; }

        public int AutoDeactivationdays { get; set; }

        public bool ShowPkgRates { get; set; }

        public bool AsyncLoad { get; set; }

        public string CountryInfo { get; set; }

        public string BaseCurrency { get; set; }

        public string CompServices { get; set; }
        public int PointsEarned { get; set; }
        public int RedeemPoints { get; set; }

        public string MemberTier { get; set; }
        public bool PaymentGatewayActive { get; set; }
        public bool PartialPayment { get; set; }
        public int CityId { get; set; }
        public string PhoneNo { get; set; }
        public int QuotationCount { get; set; }

        public string OldUserName { get; set; }

        public string ParentSite { get; set; }

       public bool IsCrossLogin { get; set; }     

        public int MainCompCode { get; set; }
        public int MainAppURL { get; set; }
        public bool IsSalePerson { get;set; }

    }

    public enum MemberTypes
    {
        NotLoggedIn = 0,
        HeadQuarter = 1,
        Branch = 2,
        Wholesaler = 3,
        Agent = 4,
        Corporate = 5
    }

    public class RoleDefineDO
    {
        public bool ConfirmationNo { get; set; }
        public bool confirm { get; set; }
        public bool AddNewUser { get; set; }
        public bool Approve { get; set; }
        public bool MemberDetails { get; set; }
        public bool Promotions { get; set; }
        public bool LoginStatistics { get; set; }
        public bool CurrencyUpdate { get; set; }
        public bool HomePromotion { get; set; }
        public bool NetAccountStatement { get; set; }
        public bool AccountStatement { get; set; }
        public bool ProductUpdation { get; set; }
        public bool NewBooking { get; set; }
        public bool Reconfirm { get; set; }
        public bool Cancel { get; set; }
        public bool AddNewPosition { get; set; }
        public bool Update { get; set; }
        public bool XXCharge { get; set; }
        public bool Voucher { get; set; }
        public bool SupplierRefNo { get; set; }
        public bool Reject { get; set; }
        public bool DeadLineDate { get; set; }
        public bool SendMail { get; set; }
        public bool Check { get; set; }
        public bool SendVoucher { get; set; }
        public bool Amendment { get; set; }
        public bool PriceBreakUp { get; set; }
        public bool SalesReport { get; set; }
        public bool PaymentDeatails { get; set; }
        public bool Invoice { get; set; }
        public bool Edit { get; set; }
        public bool AddBCInclusion { get; set; }
        public bool MarkUp { get; set; }
        public bool UtilityProduct { get; set; }
        public bool ChangeMarkUp { get; set; }
        public bool Accept { get; set; }
        public bool Receipt { get; set; }
        public bool RailEurope { get; set; }
        public bool RE4AllBooking { get; set; }
        public bool Refund { get; set; }
        public bool AdjustBooking { get; set; }
        public bool Report { get; set; }
        public bool BranchReport { get; set; }
        public bool AddAgent { get; set; }
        public bool SupplierBankAccount { get; set; }
        public bool Remittance { get; set; }
        public bool PostBooking { get; set; }
        //public bool FollowUpBooking { get; set; }
        public bool Utility { get; set; }
        public bool SupplierList { get; set; }
        public bool CreditCardDetails { get; set; }
        //public bool CCPaymentReport { get; set; }
        public bool PackageTray { get; set; }
        //public bool ConvertBooking  // Add by Viraj on 2-6-2012
        //{ get; set; }
        public bool ServiceTaxReport  // Add by Rupali on 31-8-2012
        { get; set; }
        public bool CancelReceipt// Add by Rupali on 1-10-2012
        { get; set; }
        public bool DepositReceipt// Add by Rupali on 19-03-2012
        { get; set; }
        public bool PendingPayment// Add by Rupali on 19-03-2012
        { get; set; }
        public bool PendingInvoiceReceipt// Add by Rupali on 19-03-2012
        { get; set; }
        public bool Quotation// Add by Rupali on 30-04-2012
        { get; set; }
        public bool CreditReport// Add by amita 7-11-2013
        { get; set; }
        public bool VCCCard// Add by satish 05-10-2014
        { get; set; }
        public bool BufferDays
        { get; set; }
        public bool ROEUpdate//add by sarita on 07-Sep-2015
        { get; set; }

        public bool CreditUpdate
        { get; set; }
        public bool ShiftBooking
        { get; set; }

        public bool GSTReportForTally
        { get; set; }
        public bool AllGSTReport
        { get; set; }
        public bool ReceiptReport
        { get; set; }

        public bool OnlineWorkReport
        { get; set; }


        public bool AddSupplier
        { get; set; }

        public bool ExQuotedReport
        { get; set; }

        public bool InvoiceCategory
        {
            get; set;
        }

        public bool OnlineEdit
        {
            get; set;
        }
        public bool NetAmount { get; set; }

        public bool ImportPNR { get; set; }

        public bool PendingAcknowledge { get; set; }
        public bool Promotion { get; set; }
    }

    public class ReportRoleDefineDO
    {
        public bool AccountReport { get; set; }
        public bool NetStatementReport { get; set; }
        public bool DailySalesReport { get; set; }
        public bool ProfitAndLossReport { get; set; }
        public bool HotelProductivityReport { get; set; }
        public bool UserSalesReport { get; set; }
        public bool CorporatAndCardUseReport { get; set; }
        public bool PickupReport { get; set; }
        public bool CreditReport { get; set; }
        public bool AgencyPerformanceReport { get; set; }
        public bool Dashboard { get; set; }
        public bool OperationalIssueReport { get; set; }

        public bool TransactionReport { get; set; }

        public bool AgencyUserReport { get; set; }
        public bool CountryProductivityReport { get; set; }
        public bool MemberCreditDetailsReport { get; set; }
        public bool HotelMizeReport { get; set; }
        public bool MarketingFee { get; set; }
        public bool SalesProductivityReport { get; set; }
        public bool HQProductivityReport { get; set; }
        public bool HotelProductivityReportAPI { get; set; }
        public bool SalesPersonWiseReport { get; set; }

        public bool ReportDashBoardV1 { get; set; }
        public bool SalesLoginAccess { get; set; }
        public bool GstReport { get; set; }
    }
}
