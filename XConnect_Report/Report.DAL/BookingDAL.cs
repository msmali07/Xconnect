using Report.DO;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Reporting.WebForms;
using System.Globalization;
using System.Data.SqlClient;

namespace Report.DAL
{
    public class BookingDAL
    {




        #region Account Report
        public List<AccountReportResultDO> AccountStatementNew(AccountReportDO Param, int CompCode)
        {
            DataSet DS = new DataSet();
            DataTable dt = new DataTable();
            List<AccountReportResultDO> AcctStatementList = new List<AccountReportResultDO>();
            List<SqlParameters> param = new List<SqlParameters>();
            param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, Param.MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 4, Param.LoginUserId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateFrom", SqlDbType.DateTime, 8, (Param.DateFrom == DateTime.MinValue ? (object)DBNull.Value : Param.DateFrom), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateTo", SqlDbType.DateTime, 8, (Param.DateTo == DateTime.MinValue ? (object)DBNull.Value : Param.DateTo), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, Param.BookingdateWise == true ? 1 : 0, ParameterDirection.Input));


            dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "usp_Rpt_AccountReport_V2", param, DBType.Booking, CompCode);

            string Time2 = DateTime.Now.ToString("h:mm:ss tt");
            try
            {
                //dt = DS.Tables[0];

                AcctStatementList = (from q in dt.AsEnumerable()
                                     select new AccountReportResultDO
                                     {

                                         RefNo = Util.GetString(q["BookRefNo"]) + "/" + Util.GetString(q["BookPosition"]),
                                         BookDate = Util.GetDateTime(q["BookDate"]).ToString("dd MMM yyyy"),
                                         ChkIn = Util.GetDateTime(q["ChkInDate"]).ToString("dd MMM yyyy"),
                                         Nts = Util.GetInteger(q["NoOfNts"]),
                                         SName = Util.ToTitleCase(q.Field<string>("HotelName")),
                                         Pax = Util.ToTitleCase(q.Field<string>("FirstName")),
                                         SCurr = Util.GetString(q["SellCurrency"]),
                                         SAmt = Util.GetDecimal(q["SellAmount"]),
                                         Status = Util.GetString(q["Bookstatus"]),
                                         SType = Util.GetString(q["Type"]),
                                         AgName = Util.GetString(q["ClientName"]),
                                         AgRefNo = Util.GetString(q["AgRefNo"]),
                                         AgCity = Util.GetString(q["ClientCity"]),
                                         AgCountry = Util.GetString(q["ClientCountry"]),
                                         AGPay = Util.GetDecimal(q["AGPay"]),
                                         BRPay = Util.GetDecimal(q["BRPay"]),
                                         Postbyuser = Util.GetString(q["Postbyuser"]),
                                         Posttouser = Util.GetString(q["Posttouser"]),
                                         InvoiceNo = Util.GetString(q["Invoicenumber"]),

                                     }).ToList();
            }
            catch (Exception ex)
            {
                Util.ErrorLock(ex.ToString());
            }

            #region Commented
            //try
            //{
            //    if (dt.Rows.Count > 0)
            //    {
            //        for (int i = 0; i < dt.Rows.Count; i++)
            //        {
            //            AccountReportResultDO AccParam = new AccountReportResultDO();
            //            AccParam.BookRefNo = Util.GetString(dt.Rows[i]["BookRefNo"]);
            //            AccParam.BookPosition = Util.GetString(dt.Rows[i]["BookPosition"]);
            //            AccParam.BookDate = Util.GetDateTime(dt.Rows[i]["BookDate"]);
            //            //AccParam.ChkInDate = Util.GetDateTime(dt.Rows[i]["ChkInDate"]);
            //            AccParam.ChkInDateStr = Util.GetDateTime(dt.Rows[i]["ChkInDate"]).ToString("dd MMM yyyy");
            //            AccParam.noofnts = Util.GetInteger(dt.Rows[i]["NoOfNts"]);
            //            AccParam.HotelName = Util.ToTitleCase(Util.GetString(dt.Rows[i]["HotelName"]));
            //            AccParam.FirstName = Util.ToTitleCase(Util.GetString(dt.Rows[i]["FirstName"]));
            //           // AccParam.SurName = Util.GetString(dt.Rows[i]["SurName"]);
            //            //AccParam.Title = Util.GetString(dt.Rows[i]["Title"]);
            //            //AccParam.MemberId = Util.GetInteger(dt.Rows[i][" MemberId"]);
            //            AccParam.SellCurrency = Util.GetString(dt.Rows[i]["SellCurrency"]);
            //            AccParam.SellAmount = Util.GetDecimal(dt.Rows[i]["SellAmount"]);
            //            AccParam.Bookstatus = Util.GetStatus(Util.GetString(dt.Rows[i]["Bookstatus"]), "", CompCode, 1, null); ;
            //            AccParam.type = Util.GetServiceName(Util.GetString(dt.Rows[i]["Type"]));
            //            //AccParam.NetAmount = Util.GetDecimal(dt.Rows[i]["NetAmount"] != DBNull.Value ? dt.Rows[i]["NetAmount"] : 0);
            //            //AccParam.DisplayROE = Util.GetDecimal(dt.Rows[i]["DisplayROE"]);
            //            AccParam.ClientName = Util.GetString(dt.Rows[i]["ClientName"]);
            //            //AccParam.BRPay = Util.GetDecimal(dt.Rows[i]["BRPay"] == null ? 0 : dt.Rows[i]["BRPay"]);
            //            //AccParam.AGPay = Util.GetDecimal(dt.Rows[i]["AGPay"] == null ? 0 : dt.Rows[i]["AGPay"]);
            //            //AccParam.CheckInMonthName = Util.GetString(dt.Rows[i]["CheckInMonthName"]);

            //            //AccParam.SupplierRefNo = Util.GetString(dt.Rows[i]["SupplierRefNo"]);
            //            AcctStatementList.Add(AccParam);
            //        }
            //    }
            //}
            //catch (Exception ex)
            //{

            //}
            //AcctStatementList[0].Time1 = Time1;
            //AcctStatementList[0].Time2 = Time2;
            //AcctStatementList[0].Time3 = DateTime.Now.ToString("h:mm:ss tt");
            #endregion

            return AcctStatementList;
        }

        public List<AccountReportResultDO> AccountStatementNewV2(AccountReportDO Param, int CompCode)
        {
            DataSet DS = new DataSet();
            DataTable dt = new DataTable();
            List<AccountReportResultDO> AcctStatementList = new List<AccountReportResultDO>();
            List<SqlParameters> param = new List<SqlParameters>();
            param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, Param.MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 4, Param.LoginUserId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateFrom", SqlDbType.DateTime, 8, (Param.DateFrom == DateTime.MinValue ? (object)DBNull.Value : Param.DateFrom), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateTo", SqlDbType.DateTime, 8, (Param.DateTo == DateTime.MinValue ? (object)DBNull.Value : Param.DateTo), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, Param.BookingdateWise == true ? 1 : 0, ParameterDirection.Input));


            dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "usp_Rpt_AccountReport_V2_64", param, DBType.Booking, CompCode);

            string Time2 = DateTime.Now.ToString("h:mm:ss tt");
            try
            {
                //dt = DS.Tables[0];

                AcctStatementList = (from q in dt.AsEnumerable()
                                     select new AccountReportResultDO
                                     {


                                         RefNo = Util.GetString(q["BookRefNo"]) + "/" + Util.GetString(q["BookPosition"]),
                                         BookDate = Util.GetDateTime(q["BookDate"]).ToString("dd MMM yyyy"),
                                         ChkIn = Util.GetDateTime(q["ChkInDate"]).ToString("dd MMM yyyy"),
                                         Nts = Util.GetInteger(q["NoOfNts"]),
                                         SName = Util.ToTitleCase(q.Field<string>("HotelName")),
                                         Pax = Util.ToTitleCase(q.Field<string>("FirstName")),
                                         SCurr = Util.GetString(q["SellCurrency"]),
                                         SAmt = Util.GetDecimal(q["SellAmount"]),
                                         Status = Util.GetString(q["Bookstatus"]),
                                         SType = Util.GetString(q["Type"]),
                                         AgName = Util.GetString(q["ClientName"]),
                                         AgRefNo = Util.GetString(q["AgRefNo"]),
                                         AgCity = Util.GetString(q["ClientCity"]),
                                         AgCountry = Util.GetString(q["ClientCountry"]),
                                         AGPay = Util.GetString(q["Type"]) != "TR" ? Math.Ceiling(Util.GetDecimal(q["AgPay"])) : Util.GetDecimal(q["AgPay"]),
                                         BRPay = Util.GetString(q["Type"]) != "TR" ? Math.Ceiling(Util.GetDecimal(q["BrPay"])) : Util.GetDecimal(q["BrPay"]),
                                         Postbyuser = Util.GetString(q["Postbyuser"]),
                                         Posttouser = Util.GetString(q["Posttouser"]),
                                         InvoiceNo = Util.GetString(q["Invoicenumber"]),
                                         WsNewPay = Util.GetString(q["Type"]) != "TR" ? Math.Ceiling(Util.GetDecimal(q["WsPay"])) : Util.GetDecimal(q["WsPay"]),
                                         NAmt = Util.GetDecimal(q["NetAmount"]),
                                         NCur = Util.GetString(q["NetCurrency"]),
                                         HqSell = Util.GetString(q["Type"]) != "TR" ? Math.Ceiling(Util.GetDecimal(q["HqSell"])) : Util.GetDecimal(q["HqSell"]),
                                         BrSell = Util.GetString(q["Type"]) != "TR" ? Math.Ceiling(Util.GetDecimal(q["BrSell"])) : Util.GetDecimal(q["BrSell"]),
                                         WsSell = Util.GetString(q["Type"]) != "TR" ? Math.Ceiling(Util.GetDecimal(q["WsSell"])) : Util.GetDecimal(q["WsSell"]),
                                     }).ToList();

            }
            catch (Exception ex)
            {
                Util.ErrorLock(ex.ToString());
            }

            return AcctStatementList;
        }
        #endregion

        public List<MarketingReportResultDO> MarketStatementNew(MarketingFeeDO Param, int CompCode)
        {
            DataSet DS = new DataSet();
            DataTable dt = new DataTable();
            List<MarketingReportResultDO> MarketFeeList = new List<MarketingReportResultDO>();
            List<SqlParameters> param = new List<SqlParameters>();
            param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, Param.MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 4, Param.LoginUserId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateFrom", SqlDbType.DateTime, 8, (Param.DateFrom == DateTime.MinValue ? (object)DBNull.Value : Param.DateFrom), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateTo", SqlDbType.DateTime, 8, (Param.DateTo == DateTime.MinValue ? (object)DBNull.Value : Param.DateTo), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, Param.BookingdateWise == true ? 1 : 0, ParameterDirection.Input));


            dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "usp_Rpt_MarketingFee", param, DBType.Booking, CompCode);

            string Time2 = DateTime.Now.ToString("h:mm:ss tt");
            try
            {


                MarketFeeList = (from q in dt.AsEnumerable()
                                 select new MarketingReportResultDO
                                 {

                                     RefNo = Util.GetString(q["BookRefNo"]) + "/" + Util.GetString(q["BookPosition"]),
                                     BookDate = Util.GetDateTime(q["BookDate"]).ToString("dd MMM yyyy"),
                                     ChkIn = Util.GetDateTime(q["ChkInDate"]).ToString("dd MMM yyyy"),
                                     Nts = Util.GetInteger(q["NoOfNts"]),
                                     SName = Util.ToTitleCase(q.Field<string>("HotelName")),
                                     Pax = Util.ToTitleCase(q.Field<string>("FirstName")),
                                     SCurr = Util.GetString(q["SellCurrency"]),
                                     SAmt = Util.GetDecimal(q["SellAmount"]),
                                     Status = Util.GetString(q["Bookstatus"]),
                                     SType = Util.GetString(q["Type"]),
                                     AgName = Util.GetString(q["ClientName"]),
                                     AgRefNo = Util.GetString(q["AgRefNo"]),
                                     AgCity = Util.GetString(q["ClientCity"]),
                                     AgCountry = Util.GetString(q["ClientCountry"]),
                                     AGPay = Util.GetDecimal(q["AGPay"]),
                                     BRPay = Util.GetDecimal(q["BRPay"]),
                                     Postbyuser = Util.GetString(q["Postbyuser"]),
                                     Posttouser = Util.GetString(q["Posttouser"]),
                                     InvoiceNo = Util.GetString(q["Invoicenumber"]),
                                     TaxServiceFee = Util.GetString(q["TaxServiceFee"]),
                                     SalesTax = Util.GetString(q["SalesTax"]),
                                     ResortFee = Util.GetString(q["ResortFee"]),
                                     NAmt = Util.GetDecimal(q["NetAmount"]),
                                     NCur = Util.GetString(q["NetCurrency"]),
                                     MFee = Util.GetDecimal(q["MarketingFee"]),

                                 }).ToList();
            }
            catch (Exception ex)
            {
                Util.ErrorLock(ex.ToString());
            }

            return MarketFeeList;
        }

        #region Credir Report
        public List<CreditReportResultList> GetCreditResultList(CreditReportDO objCreditSerach, int CompCode, int AppUrl)
        {
            List<SqlParameters> objSqlParameters = new List<SqlParameters>();
            objSqlParameters.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            objSqlParameters.Add(SqlParameters.Add("@FromDate", SqlDbType.DateTime, 12, (objCreditSerach.FromDate == DateTime.MinValue ? (object)DBNull.Value : objCreditSerach.FromDate), ParameterDirection.Input));
            objSqlParameters.Add(SqlParameters.Add("@ToDate", SqlDbType.DateTime, 12, (objCreditSerach.ToDate == DateTime.MinValue ? (object)DBNull.Value : objCreditSerach.ToDate), ParameterDirection.Input));
            objSqlParameters.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, objCreditSerach.MemberId == 0 ? (object)DBNull.Value : objCreditSerach.MemberId, ParameterDirection.Input));


            using (DataSet objDataSet = SqlManager.ExecuteDataSet(CommandType.StoredProcedure, "usp_Rpt_GetCreditReportList", objSqlParameters, DBType.Master, CompCode))
            {
                return BuildGetCreditReportList(objDataSet, CompCode, AppUrl);
            }
        }

        private List<CreditReportResultList> BuildGetCreditReportList(DataSet objDataSet, int CompCode, int AppUrl)
        {
            List<CreditReportResultList> objLedgerReportDOLst = new List<CreditReportResultList>();

            if (objDataSet.Tables.Count > 0)
            {
                try
                {
                    DataTable dtCreditList = new DataTable();
                    dtCreditList = objDataSet.Tables[0];

                    DataTable dtInitialBalance = new DataTable();
                    dtInitialBalance = objDataSet.Tables[1];

                    objLedgerReportDOLst = (from row in dtCreditList.AsEnumerable()
                                            select new CreditReportResultList
                                            {
                                                BookRefNo = row.Field<string>("BookRefNo"),
                                                BookingAction = CultureInfo.CurrentCulture.TextInfo.ToTitleCase((Util.GetStatus(row["Action"].ToString().ToLower(), "", CompCode, AppUrl, null).ToLower())),
                                                Credit = Util.GetSingle(row["Credit"]),
                                                Debit = Util.GetSingle(row["Debit"]),
                                                CurrentCreditBalance = Util.GetSingle(row["Outstanding"]),
                                                Action = Util.GetDateTime(row["ActionDate"]),
                                                ActionDate = Util.GetDateTime(row["ActionDate"]).ToString("dd MMM yyyy"),
                                                CompanyName = Util.GetString(row["CompanyName"]),
                                                CreditCurrency = Util.GetString(row["CreditCurrency"]),
                                                MemberTypeId = Util.GetInteger(row["MemberTypeId"]),
                                                Address = Util.GetString(row["Address"]),
                                                Remark = Util.GetString(row["Remark"]),
                                                LeadPaxName = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(Util.GetString(row["LeadPaxName"]).ToLower()),
                                                ServiceType = (Util.GetString(row["ServiceType"])),
                                                BookStatus = (Util.GetString(row["BookStatus"])),
                                                IniCreditBalance = Util.GetDecimal(dtInitialBalance.Rows[0]["CreditBalance"]),
                                                OpeningBal = Util.GetSingle(dtInitialBalance.Rows[0]["OpeningBal"]),
                                            }).ToList();
                }
                catch (Exception ex)
                {
                    Util.ErrorLock(ex.ToString());
                }

            }


            return objLedgerReportDOLst;
        }
        #endregion

        #region SalesReport
        public List<SalesReportResultList> GetSalesReportList(SalesReportDO Param, int CompCode, int AppUrl)
        {

            DataTable dt = new DataTable();
            List<SalesReportResultList> SalesResultList = new List<SalesReportResultList>();
            List<SqlParameters> param = new List<SqlParameters>();
            param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, Param.MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 4, Param.LoginUserId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@ReceiptDateFrom", SqlDbType.DateTime, 8, (Param.ReceiptDateFrom == DateTime.MinValue ? (object)DBNull.Value : Param.ReceiptDateFrom), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@ReceiptDateTo", SqlDbType.DateTime, 8, (Param.ReceiptDateTo == DateTime.MinValue ? (object)DBNull.Value : Param.ReceiptDateTo), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@ChkInDateFrom", SqlDbType.DateTime, 8, (Param.ChkInDateFrom == DateTime.MinValue ? (object)DBNull.Value : Param.ChkInDateFrom), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@ChkInDateTo", SqlDbType.DateTime, 8, (Param.ChkInDateTo == DateTime.MinValue ? (object)DBNull.Value : Param.ChkInDateTo), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));

            dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "usp_Rpt_SalesReport", param, DBType.Booking, CompCode);


            try
            {

                SalesResultList = (from q in dt.AsEnumerable()
                                   select new SalesReportResultList
                                   {
                                       RefNo = Util.GetString(q["BookRefNo"]).Trim() + "/" + Util.GetString(q["BookPosition"]).Trim(),
                                       ChkIn = Util.GetDateTime(q["ChkInDate"]).ToString("dd MMM yyyy"),
                                       ChkOut = Util.GetDateTime(q["CheckOutDate"]).ToString("dd MMM yyyy"),
                                       Nts = Convert.ToInt32(Util.GetInteger(q["NoOfNts"])),
                                       Destination = GetRelpace(Util.GetString(q["Destination"]).Trim()),
                                       ServiceName = GetRelpace(Util.GetString(q["Services"]).Trim()),
                                       Client = GetRelpace(Util.GetString(q["ClientName"]).Trim()),
                                       SuppName = GetRelpace(Util.GetString(q["SupplierName"]).Trim()),
                                       SuppRefNo = GetRelpace(Util.GetString(q["SuppRefNo"]).Trim()),
                                       Status = Util.GetString(q["Bookstatus"]).Trim(),
                                       SellCurrency = Util.GetString(q["SellCurrency"]).Trim(),
                                       SellAmt = Util.GetSingle(q["SellAmount"]),

                                       Commission = Util.GetSingle(q["CommissionPer"]) > 0 ? Util.GetSingle(q["CommissionPer"]) : Util.GetSingle(q["CommissionAmt"]),
                                       BookPaidAmt = Util.GetSingle(q["BookingPaidAmount"]),

                                       //not shown in report
                                       ReceiptCurrency = Util.GetString(q["ReceiptCurrency"]).Trim(),
                                       PaidAmount = Util.GetSingle(q["PaidAmount"]),
                                       ReceiptDate = Util.GetDateTime(q["ReceiptDate"]).ToString("dd MMM yyyy"),
                                       ReceiptFrom = GetRelpace(Util.GetString(q["ReceiptFrom"]).Trim()),
                                       ReceiptNo = Util.GetString(q["ReceiptNo"]).Trim(),


                                   }).ToList();
            }
            catch (Exception ex)
            {
                Util.ErrorLock(ex.ToString());
            }

            return SalesResultList;
        }
        public static string GetRelpace(string str)
        {
            if (str != string.Empty && str != null)
            {
                str = str.Replace("&", "&amp;");
                str = str.Replace("'", " ");
                str = str.Replace("<", "&lt;");
                str = str.Replace(">", "&gt;");
                str = str.Replace("\n", " ");
                str = str.Replace("\r", " ");
                str = str.Replace("-", "");

            }

            return str;
        }

        #endregion

        #region Production Report
        public ProductionReportResultList GetProductionReportList(ProductionReportDO Param, int CompCode, int ApplicableUrl)
        {
            DataSet DS = new DataSet();
            DataTable dt = new DataTable();

            List<SqlParameters> param = new List<SqlParameters>();
            param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, Param.MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 4, Param.LoginUserId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@From", SqlDbType.DateTime, 8, (Param.From == DateTime.MinValue ? (object)DBNull.Value : Param.From), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@To", SqlDbType.DateTime, 8, (Param.To == DateTime.MinValue ? (object)DBNull.Value : Param.To), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, Param.BookingdateWise == true ? 1 : 0, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CityId", SqlDbType.Int, 4, Param.CityId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@SupplierId", SqlDbType.Int, 4, Param.SupplierId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@Status", SqlDbType.VarChar, 100, Param.Status, ParameterDirection.Input));


            dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "usp_Rpt_ProductionReport", param, DBType.Booking, CompCode);

            ProductionReportResultList ProReportList = new ProductionReportResultList();
            List<ProHotelReportList> HotelList = new List<ProHotelReportList>();
            List<ProTransferReportList> TransferList = new List<ProTransferReportList>();
            List<ProTourReportList> TourList = new List<ProTourReportList>();

            try
            {
                HotelList = (from q in dt.AsEnumerable()
                             where q.Field<string>("ServiceType") == "H"
                             select new ProHotelReportList
                             {
                                 RefNo = Util.GetString(q["BookRefNo"]) + "/" + Util.GetString(q["BookPosition"]),
                                 ChkIn = q.Field<DateTime>("ChkInDate").ToString("dd MMM yyyy"),
                                 ChkOut = q.Field<DateTime>("ChkOutDate").ToString("dd MMM yyyy"),
                                 Nts = Util.GetInteger(q["NoOfNts"]),
                                 Type = Util.GetString(q["ServiceType"]),
                                 SName = Util.GetString(q["ServiceName"]),
                                 NoPax = Util.GetInteger(q["HotelNoofAdults"]) + Util.GetInteger(q["HotelNoofChilds"]),
                                 City = Util.GetString(q["CityName"]),
                                 Country = Util.GetString(q["CountryName"]),
                                 SuppN = Util.GetString(q["SupplierName"]),
                                 Sellcur = Util.GetString(q["SellCurrency"]),
                                 SellAmt = Util.GetDecimal(q["SellAmount"]),
                                 Client = Util.GetString(q["ClientName"]),
                                 Status = Util.GetString(q["Bookstatus"]),
                             }).ToList();

                TransferList = (from q in dt.AsEnumerable()
                                where q.Field<string>("ServiceType") == "T"
                                select new ProTransferReportList
                                {
                                    RefNo = Util.GetString(q["BookRefNo"]) + "/" + Util.GetString(q["BookPosition"]),
                                    TDate = q.Field<DateTime>("ChkInDate").ToString("dd MMM yyyy"),
                                    Type = Util.GetString(q["ServiceType"]),
                                    SName = Util.GetString(q["ServiceName"]),
                                    TType = Util.GetInteger(q["TransferType"]),
                                    PickId = Util.GetInteger(q["PickupService"]),
                                    DropId = Util.GetInteger(q["DropOffservice"]),
                                    NoPax = Util.GetInteger(q["TransferNoofAdults"]) + Util.GetInteger(q["TransferNoofChilds"]),
                                    City = Util.GetString(q["CityName"]),
                                    Country = Util.GetString(q["CountryName"]),
                                    SuppN = Util.GetString(q["SupplierName"]),
                                    Sellcur = Util.GetString(q["SellCurrency"]),
                                    SellAmt = Util.GetDecimal(q["SellAmount"]),
                                    Client = Util.GetString(q["ClientName"]),
                                    Status = Util.GetString(q["Bookstatus"]),
                                }).ToList();

                TourList = (from q in dt.AsEnumerable()
                            where q.Field<string>("ServiceType") == "S"
                            select new ProTourReportList
                            {
                                RefNo = Util.GetString(q["BookRefNo"]) + "/" + Util.GetString(q["BookPosition"]),
                                TDate = q.Field<DateTime>("ChkInDate").ToString("dd MMM yyyy"),
                                Type = Util.GetString(q["ServiceType"]),
                                SName = Util.GetString(q["ServiceName"]),
                                TType = Util.GetInteger(q["TourType"]),
                                PickPt = Util.GetString(q["TourPickupPoint"]),
                                Durtn = Util.GetString(q["TourDuration"]),
                                NoPax = Util.GetInteger(q["TourNoofAdults"]) + Util.GetInteger(q["TourNoofChilds"]),
                                City = Util.GetString(q["CityName"]),
                                Country = Util.GetString(q["CountryName"]),
                                SuppN = Util.GetString(q["SupplierName"]),
                                Sellcur = Util.GetString(q["SellCurrency"]),
                                SellAmt = Util.GetDecimal(q["SellAmount"]),
                                Client = Util.GetString(q["ClientName"]),
                                Status = Util.GetString(q["Bookstatus"]),
                            }).ToList();
            }
            catch (Exception ex)
            {
                Util.ErrorLock(ex.ToString());
            }
            ProReportList.ProHotelResultList = HotelList;
            ProReportList.ProTransferResultList = TransferList;
            ProReportList.ProTourResultList = TourList;

            return ProReportList;
        }
        #endregion

        #region Ottila Profit And Loss Report
        public List<ProfitLossReportResultList> GetProfitLoss(ProfitLossDO Param, int CompCode)
        {
            DataSet DS = new DataSet();
            DataTable dt = new DataTable();
            List<ProfitLossReportResultList> ProfitLossList = new List<ProfitLossReportResultList>();
            List<SqlParameters> param = new List<SqlParameters>();
            param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, Param.MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 4, Param.LoginUserId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateFrom", SqlDbType.DateTime, 8, (Param.DateFrom == DateTime.MinValue ? (object)DBNull.Value : Param.DateFrom), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateTo", SqlDbType.DateTime, 8, (Param.DateTo == DateTime.MinValue ? (object)DBNull.Value : Param.DateTo), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Int, 4, Param.BookingdateWise, ParameterDirection.Input));



            dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "Usp_Rpt_ProfitLossReport", param, DBType.Booking, CompCode);


            try
            {

                ProfitLossList = (from q in dt.AsEnumerable()
                                  select new ProfitLossReportResultList
                                  {
                                      RefNo = Util.GetString(q["BookRefNo"]) + "/" + Util.GetString(q["BookPosition"]),
                                      BrName = Util.GetString(q["BranchName"]),
                                      AgName = Util.GetString(q["AgencyName"]), //get Ws name in sp pending                                      
                                      AgCity = Util.GetString(q["AgencyCity"]),
                                      AgCountry = Util.GetString(q["AgencyCountry"]),
                                      SName = Util.GetString(q["ServiceName"]),
                                      SCity = Util.GetString(q["ServiceCity"]),
                                      SCountry = Util.GetString(q["ServiceCountry"]),
                                      SType = Util.GetString(q["ServiceType"]),
                                      BType = (Util.GetInteger(q["SupType"]) == 3 && Util.GetInteger(q["SourceId"]) == 1) ? 3 : Util.GetInteger(q["SourceId"]),
                                      BDate = Util.GetDateTime(q["BookDate"]).ToString("dd MMM yyyy"),
                                      ChkIn = Util.GetDateTime(q["ChkInDate"]).ToString("dd MMM yyyy"),
                                      Nts = Util.GetInteger(q["NoOfNts"]),
                                      NetAmt = Util.GetDecimal(q["NetAmount"]),
                                      NetCur = Util.GetString(q["NetCurrency"]),
                                      SellAmt = Util.GetDecimal(q["SellAmount"]),
                                      SellCur = Util.GetString(q["SellCurrency"]),

                                      SuppName = Util.GetString(q["SupplierName"]),
                                      Invoiced = Util.GetString((Util.GetBoolean(q["Invoiced"])) == true ? "Y" : "N"),
                                      IsInbound = Util.GetString(Util.GetInteger(q["CountryId"]) == (1) || Util.GetInteger(q["CountryId"]) == (147) || Util.GetInteger(q["CountryId"]) == (208) ? "Inbound" : "Outbound"),
                                      Status = Util.GetString(q["BookStatus"]),
                                      BookedBy = Util.GetInteger(q["BookedBy"]),

                                      SNetAmt = Util.GetDecimal(new CalculationDAL().GetSupplierNet(q)),
                                      SSNetAmt = Util.GetDecimal(new CalculationDAL().GetSupplierNetinSell(q)),
                                      AGPay = Util.GetDecimal(new CalculationDAL().GetAgPay(q)),
                                      TaxPay = Util.GetDecimal(new CalculationDAL().GetTaxPaytoGovt(q)),
                                      HQExtra = Util.GetDecimal(new CalculationDAL().GetHQExtraQuote(q)),
                                      BRExtra = Util.GetDecimal(new CalculationDAL().GetBRExtraQuote(q)),
                                      ProfitAmt = Util.GetDecimal(new CalculationDAL().GetProfitAmt(q)),
                                      Profit = Util.GetDecimal(new CalculationDAL().GetProfitinPer(q)), //in %
                                      ConvFeeAmt = Util.GetDecimal(new CalculationDAL().GetConvenienceFeeAmt(q)),
                                      IncludeExcludeConvFee = Util.GetBoolean(q["IncludeExcludeConv"]),
                                      ConvAmt = Util.GetDecimal(q["ConvAmt"]), //for ottila

                                      Version = Util.GetInteger(q["BookingVersion"]),
                                      RRDate = DateTime.MinValue != Util.GetDateTime(q["RRDate"]) ? Util.GetDateTime(q["RRDate"]).ToString("dd MMM yyyy") : "-",
                                      DeptName = Util.GetString(q["DepartmentName"])

                                  }).ToList();
            }
            catch (Exception ex)
            {
                Util.ErrorLock(ex.ToString());
            }

            return ProfitLossList;
        }


        #endregion


        #region Sales Person Wise Report
        public List<SalesPersonWiseReportResultList> GetSalesPersonWise(SalesPersonWiseDO Param, int CompCode)
        {
            DataSet DS = new DataSet();
            DataTable dt = new DataTable();
            List<SalesPersonWiseReportResultList> SalesPersonWiseList = new List<SalesPersonWiseReportResultList>();
            List<SqlParameters> param = new List<SqlParameters>();
            param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, Param.MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 4, Param.LoginUserId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateFrom", SqlDbType.DateTime, 8, (Param.DateFrom == DateTime.MinValue ? (object)DBNull.Value : Param.DateFrom), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateTo", SqlDbType.DateTime, 8, (Param.DateTo == DateTime.MinValue ? (object)DBNull.Value : Param.DateTo), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Int, 4, Param.BookingdateWise, ParameterDirection.Input));



            dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "Usp_Rpt_SalesPersonWiseReport", param, DBType.Booking, CompCode);


            try
            {

                SalesPersonWiseList = (from q in dt.AsEnumerable()
                                       select new SalesPersonWiseReportResultList
                                       {
                                           RefNo = Util.GetString(q["BookRefNo"]) + "/" + Util.GetString(q["BookPosition"]),
                                           AgName = Util.GetString(q["AgencyName"]), //get Ws name in sp pending                                      
                                           AgCity = Util.GetString(q["AgencyCity"]),
                                           SName = Util.GetString(q["ServiceName"]),
                                           SType = Util.GetString(q["ServiceType"]),
                                           BDate = Util.GetDateTime(q["BookDate"]).ToString("dd MMM yyyy"),
                                           ChkIn = Util.GetDateTime(q["ChkInDate"]).ToString("dd MMM yyyy"),
                                           Nts = Util.GetInteger(q["NoOfNts"]),
                                           NetAmt = Util.GetDecimal(q["NetAmount"]),
                                           NetCur = Util.GetString(q["NetCurrency"]),
                                           SellAmt = Util.GetDecimal(q["SellAmount"]),
                                           SellCur = Util.GetString(q["SellCurrency"]),
                                           Status = Util.GetString(q["BookStatus"]),
                                           SNetAmt = Util.GetDecimal(new CalculationDAL().GetSupplierNet(q)),
                                           SSNetAmt = Util.GetDecimal(new CalculationDAL().GetSupplierNetinSell(q)),
                                           AGPay = Util.GetDecimal(new CalculationDAL().GetAgPay(q)),
                                           TaxPay = Util.GetDecimal(new CalculationDAL().GetTaxPaytoGovt(q)),
                                           ProfitAmt = Util.GetDecimal(new CalculationDAL().GetProfitAmt(q)),
                                           Profit = Util.GetDecimal(new CalculationDAL().GetProfitinPer(q)), //in %
                                           ConvFeeAmt = Util.GetDecimal(new CalculationDAL().GetConvenienceFeeAmt(q)),
                                           SalesP = Util.GetString(q["SalesPerson"]),
                                       }).ToList();
            }
            catch (Exception ex)
            {
                Util.ErrorLock(ex.ToString());
            }


            return SalesPersonWiseList;
        }


        #endregion


        #region Net Statement Report
        public List<NetStatementReportResultDO> GeNetStatementReport(NetStatementReportDO Param, int CompCode)
        {
            DataSet DS = new DataSet();
            DataTable dt = new DataTable();
            List<NetStatementReportResultDO> NetStatementList = new List<NetStatementReportResultDO>();
            List<SqlParameters> param = new List<SqlParameters>();
            param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, Param.MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 4, Param.LoginUserId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateFrom", SqlDbType.DateTime, 8, (Param.DateFrom == DateTime.MinValue ? (object)DBNull.Value : Param.DateFrom), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateTo", SqlDbType.DateTime, 8, (Param.DateTo == DateTime.MinValue ? (object)DBNull.Value : Param.DateTo), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, Param.BookingdateWise == true ? 1 : 0, ParameterDirection.Input));


            dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "Usp_Rpt_NetStatementReport", param, DBType.Booking, CompCode);

            string Time2 = DateTime.Now.ToString("h:mm:ss tt");
            try
            {
                NetStatementList = (from q in dt.AsEnumerable()
                                    select new NetStatementReportResultDO
                                    {
                                        RefNo = Util.GetString(q["BookRefNo"]) + "/" + Util.GetString(q["BookPosition"]),
                                        BookDate = Util.GetDateTime(q["BookDate"]).ToString("dd MMM yyyy"),
                                        ChkIn = Util.GetDateTime(q["ChkInDate"]).ToString("dd MMM yyyy"),
                                        ChkOut = Util.GetDateTime(q["ChkOutDate"]).ToString("dd MMM yyyy"),
                                        Nts = Util.GetInteger(q["NoOfNts"]),
                                        SName = Util.ToTitleCase(Util.GetString(q["HotelName"])),
                                        Pax = Util.ToTitleCase(Util.GetString(q["PaxName"])),
                                        SCurr = Util.GetString(q["SellCurrency"]),
                                        SAmt = Util.GetDecimal(q["SellAmount"]),
                                        Status = Util.GetString(q["Bookstatus"]),
                                        SType = Util.GetString(q["Type"]),
                                        AgName = Util.GetString(q["AgencyName"]),
                                        AgCity = Util.GetString(q["AgencyCity"]),
                                        AgCountry = Util.GetString(q["AgencyCountry"]),

                                        NCurr = Util.GetString(q["NetCurrency"]),
                                        NAmt = Util.GetDecimal(q["NetAmount"]),
                                        ROE = Util.GetDecimal(q["ROE"]),
                                        SupName = Util.ToTitleCase(q.Field<string>("SupplierName")),
                                        ACode = Util.GetString(q["AgencyCode"]),
                                        VNo = Util.GetString(q["VoucherNo"]),
                                        SupRefNo = Util.GetString(q["SupRefNo"]),
                                        NInAED = Util.GetDecimal(q["NetInAED"]),
                                        SInAED = Util.GetDecimal(q["SellInAED"]),
                                        NORooms = Util.GetInteger(q["NoOfRooms"]),
                                        Postbyuser = Util.GetString(q["Postbyuser"]),
                                    }).ToList();
            }
            catch (Exception ex)
            {
                Util.ErrorLock(ex.ToString());
            }

            return NetStatementList;
        }
        #endregion

        #region Daily Sales Report
        public List<DailySalesReportResultDO> GetDailySalesReport(DailySalesReportDO Param, int CompCode)
        {
            DataSet DS = new DataSet();
            DataTable dt = new DataTable();
            List<DailySalesReportResultDO> DailySalesList = new List<DailySalesReportResultDO>();
            List<SqlParameters> param = new List<SqlParameters>();
            param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, Param.MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 4, Param.LoginUserId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateFrom", SqlDbType.DateTime, 8, (Param.DateFrom == DateTime.MinValue ? (object)DBNull.Value : Param.DateFrom), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateTo", SqlDbType.DateTime, 8, (Param.DateTo == DateTime.MinValue ? (object)DBNull.Value : Param.DateTo), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Int, 5, Param.BookingdateWise, ParameterDirection.Input));


            dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "Usp_Rpt_DailySalesReport", param, DBType.Booking, CompCode);

            string Time2 = DateTime.Now.ToString("h:mm:ss tt");
            try
            {
                DailySalesList = (from q in dt.AsEnumerable()
                                  select new DailySalesReportResultDO
                                  {
                                      RefNo = Util.GetString(q["BookRefNo"]) + "/" + Util.GetString(q["BookPosition"]),
                                      BookDate = Util.GetDateTime(q["BookDate"]).ToString("dd MMM yyyy"),
                                      ChkIn = Util.GetDateTime(q["ChkInDate"]).ToString("dd MMM yyyy"),
                                      ChkOut = Util.GetDateTime(q["ChkOutDate"]).ToString("dd MMM yyyy"),
                                      Nts = Util.GetInteger(q["NoNts"]),
                                      SName = Util.ToTitleCase(Util.GetString(q["ServiceName"])),
                                      Pax = Util.ToTitleCase(Util.GetString(q["PaxName"])),
                                      SCurr = Util.GetString(q["SellCurrency"]),
                                      SAmt = Util.GetDecimal(q["SellAmount"]),
                                      Status = Util.GetString(q["Bookstatus"]),
                                      SType = Util.GetString(q["Type"]),
                                      AgName = Util.GetString(q["AgencyName"]),
                                      NCurr = Util.GetString(q["NetCurrency"]),
                                      NAmt = Util.GetDecimal(q["NetAmount"]),
                                      ROE = Util.GetDecimal(q["ROE"]),
                                      SupName = Util.ToTitleCase(Util.GetString(q["SupplierName"])),
                                      INo = Util.GetString(q["InvoiceNo"]),
                                      IAmt = Util.GetDecimal(q["InvoiceAmount"]),
                                      City = Util.GetString(q["CityName"]),
                                      DDate = Util.GetDateTime(q["DeadlineDate"]).ToString("dd MMM yyyy"),
                                      GInAED = Util.GetDecimal(q["GrossInAED"]),
                                      SupRefNo = Util.GetString(q["SupRefNo"]),
                                      StId = Util.GetString(q["StaffId"]),
                                      VNo = Util.GetString(q["VoucherNo"]),
                                      Postbyuser = Util.GetString(q["Postbyuser"]),
                                      PostToUser = Util.GetString(q["PosttoUser"]),
                                      AcManager = Util.GetString(q["AccMangr"]),
                                      AgCountry = Util.GetString(q["AgCountry"]),
                                      AgCity = Util.GetString(q["AgCity"])

                                  }).ToList();
            }
            catch (Exception ex)
            {
                Util.ErrorLock(ex.ToString());
            }

            return DailySalesList;
        }
        #endregion

        #region Corporate And CardUse Report

        public List<CorporateCardUseDO> GetCorporateCardUseData(string ReportWise, int CompCode)
        {
            DataTable dt = new DataTable();
            List<CorporateCardUseDO> CorpCardUseDataList = new List<CorporateCardUseDO>();
            List<SqlParameters> param = new List<SqlParameters>();
            param.Add(SqlParameters.Add("@ReportWise", SqlDbType.VarChar, 50, ReportWise, ParameterDirection.Input));
            dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "Usp_Rpt_getCorporateandCardUse", param, DBType.Master, CompCode);
            try
            {
                CorpCardUseDataList = (from q in dt.AsEnumerable()
                                       select new CorporateCardUseDO
                                       {
                                           CId = ReportWise == "Corporate" ? Util.GetInteger(q["CorporateId"]) : 0,
                                           CName = ReportWise == "Corporate" ? Util.GetString(q["CorporateName"]) : "",
                                           Curr = ReportWise == "Corporate" ? "" : Util.GetString(q["CardName"]),
                                       }).ToList();
            }
            catch (Exception ex)
            {
                Util.ErrorLock(ex.ToString());
            }
            return CorpCardUseDataList;
        }

        public List<CorporateCardUseReportResultDO> GetCorporateCardUseReport(CorporateCardUseReportDO Param, int CompCode)
        {
            DataTable dt = new DataTable();
            List<CorporateCardUseReportResultDO> CorporateCardUseList = new List<CorporateCardUseReportResultDO>();
            List<SqlParameters> param = new List<SqlParameters>();
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 4, Param.LoginUserId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateFrom", SqlDbType.DateTime, 8, (Param.DateFrom == DateTime.MinValue ? (object)DBNull.Value : Param.DateFrom), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateTo", SqlDbType.DateTime, 8, (Param.DateTo == DateTime.MinValue ? (object)DBNull.Value : Param.DateTo), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, Param.BookingdateWise == true ? 1 : 0, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@Reportwise", SqlDbType.VarChar, 50, Param.ReportWise, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CardUse", SqlDbType.VarChar, 50, Param.CardUse, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CorporateId", SqlDbType.Int, 4, Param.CorporateId, ParameterDirection.Input));

            dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "Usp_Rpt_GetCorporateCardUseReport", param, DBType.Booking, CompCode);
            try
            {
                CorporateCardUseList = (from q in dt.AsEnumerable()
                                        select new CorporateCardUseReportResultDO
                                        {
                                            CName = Util.ToTitleCase(Util.GetString(q["CorporateName"])),
                                            CUse = Util.GetString(q["CardUse"]),
                                            VNo = Util.GetString(q["VoucherNo"]),
                                            RefNo = Util.GetString(q["cBookRefNo"]) + "/" + Util.GetString(q["nBookPosition"]),
                                            NORooms = Util.GetInteger(q["NoOfRooms"]),
                                            Nts = Util.GetInteger(q["NoOfNts"]),
                                            Pax = Util.GetString(q["PaxName"]),
                                            BookDate = Util.GetDateTime(q["BookDate"]).ToString("dd MMM yyyy"),
                                            ChkIn = Util.GetDateTime(q["ChkInDate"]).ToString("dd MMM yyyy"),
                                            ChkOut = Util.GetDateTime(q["ChkOutDate"]).ToString("dd MMM yyyy"),
                                            SName = Util.GetString(q["HotelName"]),
                                            City = Util.GetString(q["CityName"]),
                                            SupName = Util.GetString(q["SupplierName"]),
                                            NCurr = Util.GetString(q["NetCurrency"]),
                                            NAmt = Util.GetDecimal(q["NetAmount"]),
                                            SCurr = Util.GetString(q["SellCurrency"]),
                                            SAmt = Util.GetDecimal(q["SellAmount"]),
                                            NoOfAdult = Util.GetInteger(q["NoOfAdult"]),
                                            NoOfChild = Util.GetInteger(q["NoOfChild"]),
                                        }).ToList();
            }
            catch (Exception ex)
            {
                Util.ErrorLock(ex.ToString());
            }

            return CorporateCardUseList;
        }

        #endregion

        #region User Sales Report
        public List<UserSalesReportResultDO> GetUserSalesReport(UserSalesReportDO Param, int CompCode)
        {
            DataSet DS = new DataSet();
            DataTable dt = new DataTable();
            List<UserSalesReportResultDO> UserSalesList = new List<UserSalesReportResultDO>();
            List<SqlParameters> param = new List<SqlParameters>();
            param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, Param.MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@UserID", SqlDbType.Int, 4, Param.UserID, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 4, Param.LoginUserId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateFrom", SqlDbType.DateTime, 8, (Param.DateFrom == DateTime.MinValue ? (object)DBNull.Value : Param.DateFrom), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateTo", SqlDbType.DateTime, 8, (Param.DateTo == DateTime.MinValue ? (object)DBNull.Value : Param.DateTo), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, Param.BookingdateWise == true ? 1 : 0, ParameterDirection.Input));


            dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "Usp_Rpt_UserSalesReport", param, DBType.Booking, CompCode);

            string Time2 = DateTime.Now.ToString("h:mm:ss tt");
            try
            {
                UserSalesList = (from q in dt.AsEnumerable()
                                 select new UserSalesReportResultDO
                                 {
                                     RefNo = Util.GetString(q["BookRefNo"]) + "/" + Util.GetString(q["BookPosition"]),
                                     BookDate = Util.GetDateTime(q["BookDate"]).ToString("dd MMM yyyy"),
                                     ChkIn = Util.GetDateTime(q["ChkInDate"]).ToString("dd MMM yyyy"),
                                     BName = Util.ToTitleCase(Util.GetString(q["BranchName"])),
                                     Status = Util.GetString(q["Bookstatus"]),
                                     VNo = Util.GetString(q["VoucherNo"]),
                                     VIDate = string.IsNullOrEmpty(Util.GetString(q["VIssueDate"])) ? "" : Util.GetDateTime(q["VIssueDate"]).ToString("dd MMM yyyy"),
                                     UId = Util.GetInteger(q["UserId"]),
                                     AgName = Util.GetString(q["AgentName"]),
                                     StId = Util.GetString(q["StaffId"]),
                                     UName = Util.GetString(q["UserName"]),
                                     MId = Util.GetInteger(q["MemberId"]),

                                 }).ToList();
            }
            catch (Exception ex)
            {
                Util.ErrorLock(ex.ToString());
            }

            return UserSalesList;
        }
        #endregion

        #region Pickup Detail Report
        public List<PickupReportResultDO> GePickupDetailReport(PickupReportDO Param, int CompCode, int AppUrl)
        {
            DataSet DS = new DataSet();
            DataTable dt = new DataTable();
            List<PickupReportResultDO> NetStatementList = new List<PickupReportResultDO>();
            List<SqlParameters> param = new List<SqlParameters>();
            param.Add(SqlParameters.Add("@DateFrom", SqlDbType.DateTime, 8, (Param.DateFrom == DateTime.MinValue ? (object)DBNull.Value : Param.DateFrom), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateTo", SqlDbType.DateTime, 8, (Param.DateTo == DateTime.MinValue ? (object)DBNull.Value : Param.DateTo), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@AppUrl", SqlDbType.Int, 4, AppUrl, ParameterDirection.Input));


            dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "Usp_Rpt_PickupDetailReport", param, DBType.Booking, CompCode);

            string Time2 = DateTime.Now.ToString("h:mm:ss tt");
            try
            {
                NetStatementList = (from q in dt.AsEnumerable()
                                    select new PickupReportResultDO
                                    {
                                        BRefNo = Util.GetString(q["BookRefNo"]) + "/" + Util.GetString(q["BookPosition"]),
                                        SType = Util.GetString(q["Type"]),
                                        SName = Util.GetString(q["ServiceName"]),
                                        City = Util.GetString(q["CityName"]),
                                        PFrom = Util.GetString(q["PickupFrom"]),
                                        PDetail = Util.GetString(q["PickUpDetail"]) + (Util.GetString(q["Type"]) == "Sightseeing" ? (Util.GetString(q["PickUpDetail"]) == "" ? " Pickup Time: " : " !Pickup Time: ") + Util.GetString(q["ArrivalTime"]) : (Util.GetString(q["PickUpDetail"]) == "" ? (Util.GetInteger(q["PickupType"]) == 2 ? " Pickup Time: " : " Arrival Time: ") : (Util.GetInteger(q["PickupType"]) == 2 ? " !Pickup Time: " : (Util.GetInteger(q["PickupType"]) != 1 ? " Arrival Time: " : " !Arrival Time: "))) + Util.GetString(q["ArrivalTime"])),
                                        ATime = Util.GetString(q["ArrivalTime"]),
                                        PickupType = Util.GetInteger(q["PickupType"]),
                                        DropOff = Util.GetString(q["DropOff"]),
                                        DropOffInfo = Util.GetString(q["DropOffInfo"]),
                                        DropOffType = Util.GetInteger(q["DropOffType"]),
                                        LPaxName = Util.GetString(q["LeadPaxName"]) + " x " + Util.GetInteger(q["NoOfAdult"]) + (Util.GetInteger(q["NoOfAdult"]) > 1 ? " Adults" : " Adult") + (Util.GetInteger(q["NoOfChild"]) > 0 ? " + " + Util.GetInteger(q["NoOfChild"]) + (Util.GetInteger(q["NoOfChild"]) > 1 ? " Children" : " Child") : ""),
                                        NoOfAdult = Util.GetInteger(q["NoOfAdult"]),
                                        NoOfChild = Util.GetInteger(q["NoOfChild"]),
                                        SRequest = Util.GetString(q["SpecialRequest"]),
                                        VehicleName = (Util.GetString(q["Type"]) == "Sightseeing" ? Util.GetString(q["SVehicleName"]) : Util.GetString(q["TVehicleName"])),
                                        SDate = Util.GetDateTime(q["SBookDate"]).ToString("dd MMM yyyy"),
                                        BookingStatus = CultureInfo.CurrentCulture.TextInfo.ToTitleCase((Util.GetStatus(q["BookingStatus"].ToString().ToLower(), "", CompCode, AppUrl, null).ToLower()))
                                    }).ToList();
            }
            catch (Exception ex)
            {
                Util.ErrorLock(ex.ToString());
            }

            return NetStatementList;
        }
        #endregion

        #region XConnect Profit And Loss Report
        public List<ProfitLossReportResultList> GetXConProfitLoss(ProfitLossDO Param, int CompCode)
        {
            DataSet DS = new DataSet();
            DataTable dt = new DataTable();
            List<ProfitLossReportResultList> ProfitLossList = new List<ProfitLossReportResultList>();
            List<SqlParameters> param = new List<SqlParameters>();
            param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, Param.MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 4, Param.LoginUserId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateFrom", SqlDbType.DateTime, 8, (Param.DateFrom == DateTime.MinValue ? (object)DBNull.Value : Param.DateFrom), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateTo", SqlDbType.DateTime, 8, (Param.DateTo == DateTime.MinValue ? (object)DBNull.Value : Param.DateTo), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            //param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, Param.BookingdateWise == true ? 1 : 0, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Int, 5, Param.BookingdateWise, ParameterDirection.Input));


            dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "Usp_Rpt_ProfitLossReport", param, DBType.Booking, CompCode);

            try
            {

                ProfitLossList = (from q in dt.AsEnumerable()
                                  select new ProfitLossReportResultList
                                  {
                                      RefNo = Util.GetString(q["BookRefNo"]) + "/" + Util.GetString(q["BookPosition"]),
                                      BrName = Util.GetString(q["BranchName"]),
                                      AgName = Util.GetString(q["AgencyName"]),
                                      AgCity = Util.GetString(q["AgencyCity"]),
                                      AgCountry = Util.GetString(q["AgencyCountry"]),
                                      SName = Util.GetString(q["ServiceName"]),
                                      SCity = Util.GetString(q["ServiceCity"]),
                                      SCountry = Util.GetString(q["ServiceCountry"]),
                                      SType = Util.GetString(q["ServiceType"]),
                                      BType = (Util.GetInteger(q["SupType"]) == 3 && Util.GetInteger(q["SourceId"]) == 1) ? 3 : Util.GetInteger(q["SourceId"]),
                                      BDate = Util.GetDateTime(q["BookDate"]).ToString("dd MMM yyyy"),
                                      ChkIn = Util.GetDateTime(q["ChkInDate"]).ToString("dd MMM yyyy"),
                                      Nts = Util.GetInteger(q["NoOfNts"]),
                                      NetAmt = Util.GetDecimal(q["NetAmount"]),
                                      NetCur = Util.GetString(q["NetCurrency"]),
                                      SellAmt = Util.GetDecimal(q["SellAmount"]),
                                      SellCur = Util.GetString(q["SellCurrency"]),

                                      SuppName = Util.GetString(q["SupplierName"]),
                                      Status = Util.GetString(q["BookStatus"]),
                                      BookedBy = Util.GetInteger(q["BookedBy"]),

                                      SNetAmt = Util.GetDecimal(q["NetAmount"]),
                                      SSNetAmt = Util.GetDecimal(new XConCalculationDAL().GetSupplierNetinSell(q)),
                                      AGPay = Util.GetDecimal(new XConCalculationDAL().GetAgPay(q)),
                                      TaxPay = 0,
                                      HQExtra = Util.GetDecimal(q["HqExtraQuote"]),
                                      BRExtra = Util.GetDecimal(q["BrExtraQuote"]),
                                      ProfitAmt = Util.GetDecimal(new XConCalculationDAL().GetProfitAmt(q)),
                                      Profit = Util.GetDecimal(new XConCalculationDAL().GetProfitinPer(q)), //in %
                                      ConvFeeAmt = 0,
                                      ConvAmt = 0,
                                      RRDate = DateTime.MinValue != Util.GetDateTime(q["RRDate"]) ? Util.GetDateTime(q["RRDate"]).ToString("dd MMM yyyy") : "-",
                                      SalesP = Util.GetString(q["SalesPerson"]),

                                  }).ToList();
            }
            catch (Exception ex)
            {
                Util.ErrorLock(ex.ToString());
            }

            return ProfitLossList;
        }


        #endregion

        public List<ContractReportResultDO> GetContractReportDetail(ContractReportDO Param, int CompCode)
        {
            DataSet DS = new DataSet();
            DataTable dt = new DataTable();
            List<ContractReportResultDO> ContractReportList = new List<ContractReportResultDO>();
            List<SqlParameters> param = new List<SqlParameters>();
            param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, Param.MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 4, Param.LoginUserId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateFrom", SqlDbType.DateTime, 8, (Param.DateFrom == DateTime.MinValue ? (object)DBNull.Value : Param.DateFrom), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateTo", SqlDbType.DateTime, 8, (Param.DateTo == DateTime.MinValue ? (object)DBNull.Value : Param.DateTo), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            //param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, Param.BookingdateWise == true ? 1 : 0, ParameterDirection.Input));

            dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "Usp_Rpt_ContractReport", param, DBType.Booking, CompCode);


            string Time2 = DateTime.Now.ToString("h:mm:ss tt");
            try
            {
                ContractReportList = (from q in dt.AsEnumerable()
                                      select new ContractReportResultDO
                                      {


                                          Conid = Util.GetString(q["Contractid"]),
                                          Hname = Util.GetString(q["Hotelname"]) == "" ? "NA" : Util.GetString(q["Hotelname"]),
                                          ConFrom = Util.GetDateTime(q["convalidfrom"]) == DateTime.MinValue ? "NA" : Util.GetDateTime(q["convalidfrom"]).ToString("dd MMM yyyy"),
                                          ConTo = Util.GetDateTime(q["convalidto"]) == DateTime.MinValue ? "NA" : Util.GetDateTime(q["convalidto"]).ToString("dd MMM yyyy"),
                                          SCat = Util.GetString(q["startcat"]) == "" ? "NA" : Util.GetString(q["startcat"]),
                                          Remark = Util.GetString(q["remark"]) == "" ? "NA" : Util.GetString(q["remark"]),
                                          PName = Util.GetString(q["Promotionname"]) == "" ? "NA" : Util.GetString(q["Promotionname"]),
                                          PFrom = Util.GetDateTime(q["Pvalidfrom"]) == DateTime.MinValue ? "NA" : Util.GetDateTime(q["Pvalidfrom"]).ToString("dd MMM yyyy"),
                                          PTo = Util.GetDateTime(q["Pvalidto"]) == DateTime.MinValue ? "NA" : Util.GetDateTime(q["Pvalidto"]).ToString("dd MMM yyyy"),
                                          BookDate = Util.GetDateTime(q["BookDateFrom"]) == DateTime.MinValue ? "NA" : (Util.GetDateTime(q["BookDateFrom"]).ToString("dd MMM yyyy")
                                          + "- " + Util.GetDateTime(q["BookDateTo"]).ToString("dd MMM yyyy")),
                                          ProUp = Util.GetDateTime(q["PromoUpdated"]) == DateTime.MinValue ? "NA" : Util.GetDateTime(q["PromoUpdated"]).ToString("dd MMM yyyy"),
                                          SaleUp = Util.GetDateTime(q["ALLStopSaleLastUpdateON"]) == DateTime.MinValue ? "NA" : Util.GetDateTime(q["ALLStopSaleLastUpdateON"]).ToString("dd MMM yyyy"),
                                          SaleDate = Util.GetDateTime(q["StopSaleDates"]) == DateTime.MinValue ? "NA" : Util.GetDateTime(q["StopSaleDates"]).ToString("dd MMM yyyy"),

                                          //SrNo = Util.GetInteger(q["SrNo"]),
                                          //Hname = Util.GetString(q["Hotelname"]),
                                          //SCat = Util.GetString(q["Promovalidfrom"]) == "" ? "NA" : Util.GetString(q["startcat"]),
                                          //ConFrom = Util.GetDateTime(q["Promovalidfrom"]).ToString("dd MMM yyyy") == "" ? "NA" : Util.GetDateTime(q["convalidfrom"]).ToString("dd MMM yyyy"),
                                          //ConTo = Util.GetDateTime(q["Promovalidfrom"]).ToString("dd MMM yyyy") == "" ? "NA" : Util.GetDateTime(q["convalidto"]).ToString("dd MMM yyyy"),
                                          //Remark = Util.GetString(q["remark"]) == "" ? "NA" : Util.GetString(q["remark"]),
                                          //PName = "PayStay",
                                          //PFrom = Util.GetDateTime(q["Promovalidfrom"]).ToString("dd MMM yyyy") == "" ? "NA" : Util.GetDateTime(q["Promovalidfrom"]).ToString("dd MMM yyyy"),
                                          //PTo = Util.GetDateTime(q["Promovalidfrom"]).ToString("dd MMM yyyy") == "" ? "NA" : Util.GetDateTime(q["Promovalidto"]).ToString("dd MMM yyyy"),
                                          //BookDate = Util.GetDateTime(q["Promovalidfrom"]).ToString("dd MMM yyyy") == "" ? "NA" : Util.GetDateTime(q["bookdate"]).ToString("dd MMM yyyy"),
                                          //ProUp = Util.GetDateTime(q["Promovalidfrom"]).ToString("dd MMM yyyy") == "" ? "NA" : Util.GetDateTime(q["promoupdated"]).ToString("dd MMM yyyy"),
                                          //SaleUp = "24 Jun 2022",
                                          //SaleDate = "24 Jun 2022",



                                      }).ToList();
            }
            catch (Exception ex)
            {
                Util.ErrorLock(ex.ToString());
            }

            return ContractReportList;
        }



        #region AgencyPerformance Report
        public List<AgencyReportResultDO> GetAgencyReportDetail(AgencyReportDO Param, int CompCode)
        {
            DataSet DS = new DataSet();
            DataTable dt = new DataTable();
            List<AgencyReportResultDO> AgencyReportList = new List<AgencyReportResultDO>();
            List<SqlParameters> param = new List<SqlParameters>();
            param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, Param.MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 4, Param.LoginUserId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateFrom", SqlDbType.DateTime, 8, (Param.DateFrom == DateTime.MinValue ? (object)DBNull.Value : Param.DateFrom), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateTo", SqlDbType.DateTime, 8, (Param.DateTo == DateTime.MinValue ? (object)DBNull.Value : Param.DateTo), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, Param.BookingdateWise == true ? 1 : 0, ParameterDirection.Input));


            dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "Usp_Rpt_AgencyPerformanceReport", param, DBType.Booking, CompCode);

            string Time2 = DateTime.Now.ToString("h:mm:ss tt");
            try
            {
                AgencyReportList = (from q in dt.AsEnumerable()
                                    select new AgencyReportResultDO
                                    {

                                        Agname = Util.ToTitleCase(q["CompanyName"]),
                                        // Agname = char.ToUpper(Util.GetString(q["CompanyName"]).First()) + Util.GetString(q["CompanyName"]).Substring(1).ToLower(),
                                        search = Util.GetString(q["SearchCount"]),
                                        Book = Util.GetString(q["TotalBookingCount"]),
                                        Reconf = Util.GetString(q["TotalRRCount"]),
                                        finish = Util.GetString(q["TotalFinishedCount"]),
                                        //Cancel Status For Ottila only 
                                        cancel = (Util.GetInteger(q["TotalXXWithChargeCount"]) + Util.GetInteger(q["TotalXXWithChargeCount"])),

                                        canlwtc = Util.GetString(q["TotalXXWithChargeCount"]),
                                        canlwtnc = Util.GetString(q["TotalXXWithoutChargeCount"]),
                                        tlbook = Util.GetString(q["TotalUnderTLCount"]),
                                        fail = Util.GetString(q["TotalFailedCount"]),
                                        SalesPerson = Util.GetString(q["SalesPerson"]),
                                        City = Util.GetString(q["City"]),
                                        Email = Util.GetString(q["Email"]),
                                        Country = Util.GetString(q["Country"]),
                                        Regdate = CompCode == 1 ? null : Util.GetDateTime(q["RegstDate"]).ToString("dd MMM yyyy"),
                                        bkdate = Util.GetDateTime(q["LastBookdate"]) != DateTime.MinValue ? Util.GetDateTime(q["LastBookdate"]).ToString("dd MMM yyyy") : null,
                                        Paymode = Util.GetInteger(q["CreditStatus"]) == 0 ? "Cash" : "Credit",
                                        Active = Util.GetInteger(q["IsDisable"]) == 0 ? "Active" : "InActive",
                                        Currency = Util.GetString(q["SellCurrency"]),
                                        Tsale = Util.GetDecimal(q["TotalSell"]),
                                        Agnotlogged = Util.GetDateTime(q["Logindate"]) != DateTime.MinValue ? DateTime.Now.Subtract(Util.GetDateTime(q["Logindate"])).Days : 0,



                                    }).ToList();
            }
            catch (Exception ex)
            {
                Util.ErrorLock(ex.ToString());
            }

            return AgencyReportList;
        }

        #endregion

        #region AgencyActivity Report
        public List<AgencyReportResultDO> GetAgencyActivityReportDetail(AgencyReportDO Param, int CompCode)
        {
            DataSet DS = new DataSet();
            DataTable dt = new DataTable();
            List<AgencyReportResultDO> AgencyReportList = new List<AgencyReportResultDO>();
            List<SqlParameters> param = new List<SqlParameters>();
            param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, Param.MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 4, Param.LoginUserId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateFrom", SqlDbType.DateTime, 8, (Param.DateFrom == DateTime.MinValue ? (object)DBNull.Value : Param.DateFrom), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateTo", SqlDbType.DateTime, 8, (Param.DateTo == DateTime.MinValue ? (object)DBNull.Value : Param.DateTo), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, Param.BookingdateWise == true ? 1 : 0, ParameterDirection.Input));


            dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "Usp_Rpt_AgencyActivityReport", param, DBType.Booking, CompCode);

            string Time2 = DateTime.Now.ToString("h:mm:ss tt");
            try
            {
                AgencyReportList = (from q in dt.AsEnumerable()
                                    select new AgencyReportResultDO
                                    {

                                        Agname = Util.ToTitleCase(q["CompanyName"]),
                                        Book = Util.GetString(q["TotalBookingCount"]),
                                        Reconf = Util.GetString(q["TotalRRCount"]),
                                        cancel = (Util.GetInteger(q["TotalXXWithChargeCount"])),
                                        City = Util.GetString(q["City"]),
                                        Email = Util.GetString(q["Email"]).Replace("//",","),
                                        Country = Util.GetString(q["Country"]),
                                        RRPer = Util.GetDecimal(q["Vouchered_Per"]) == -1 ? 0  : Util.GetDecimal(q["Vouchered_Per"]),
                                        XXPer = Util.GetDecimal(q["XXL_Per"]) == -1 ? 0 : Util.GetDecimal(q["XXL_Per"]),



                                    }).ToList();
            }
            catch (Exception ex)
            {
                Util.ErrorLock(ex.ToString());
            }

            return AgencyReportList;
        }


        public decimal GetPerCal(int BCount, int RRCount, int XXCount)
        {
            decimal Per = 0;

            Per = Util.GetDecimal((BCount / (RRCount * XXCount) / 100));

            return Per;
        }
        #endregion

        #region AgentActivity Apiout Report



        public List<Dictionary<string, object>> GetAgencyApiOutData(AgencyReportDO Param, int CompCode)
        {
            List<Dictionary<string, object>> results = new List<Dictionary<string, object>>();
            List<SqlParameters> param = new List<SqlParameters>();
            param.Add(SqlParameters.Add("@SearchMemberId", SqlDbType.Int, 4, Param.MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 4, Param.LoginUserId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@FromDate", SqlDbType.DateTime, 8, (Param.DateFrom == DateTime.MinValue ? (object)DBNull.Value : Param.DateFrom), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@ToDate", SqlDbType.DateTime, 8, (Param.DateTo == DateTime.MinValue ? (object)DBNull.Value : Param.DateTo), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CompCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));


            SqlDataReader reader = SqlManager.ExecuteReader(CommandType.StoredProcedure, "Usp_Rpt_GetAgencyApiOutListDS_V2", param, DBType.Master, CompCode);

            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    Dictionary<string, object> row = new Dictionary<string, object>();
                    for (int i = 0; i < reader.FieldCount; i++)
                    {
                        row[reader.GetName(i)] = reader.GetValue(i);
                    }
                    results.Add(row);
                }

            }

            return results;
        }



        #region GetOperationalIssue Report
        public List<OperationalIssueResultDO> GetOperationalIssueDetail(OperationalIssueReportDO Param, int CompCode)
        {
            DataSet DS = new DataSet();
            DataTable dt = new DataTable();
            List<OperationalIssueResultDO> OperationalIssuelist = new List<OperationalIssueResultDO>();
            List<SqlParameters> param = new List<SqlParameters>();
            param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, Param.MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 4, Param.LoginUserId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateFrom", SqlDbType.DateTime, 8, (Param.DateFrom == DateTime.MinValue ? (object)DBNull.Value : Param.DateFrom), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateTo", SqlDbType.DateTime, 8, (Param.DateTo == DateTime.MinValue ? (object)DBNull.Value : Param.DateTo), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Int, 5, Param.BookingdateWise == true ? 1 : 0, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@SupplierId", SqlDbType.Int, 4, Param.SupplierId, ParameterDirection.Input));

            dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "Usp_Rpt_OperationalIssueReport", param, DBType.Booking, CompCode);

            string Time2 = DateTime.Now.ToString("h:mm:ss tt");
            try
            {
                OperationalIssuelist = (from q in dt.AsEnumerable()
                                        select new OperationalIssueResultDO
                                        {
                                            RefNo = Util.GetString(q["cBookRefNo"]) + "/" + Util.GetString(q["nBookPosition"]),
                                            SuppName = Util.GetString(q["supplierName"]),
                                            BDate = Util.GetDateTime(q["dBookDate"]) == DateTime.MinValue ? "NA" : Util.GetDateTime(q["dBookDate"]).ToString("dd MMM yyyy"),
                                            ChkIn = Util.GetDateTime(q["dCheckInDate"]) == DateTime.MinValue ? "NA" : Util.GetDateTime(q["dCheckInDate"]).ToString("dd MMM yyyy"),
                                            SType = Util.GetString(q["service"]),
                                            SName = Util.GetString(q["ServiceName"]),
                                            BType = (Util.GetInteger(q["nSourceId"]) == 3 && Util.GetInteger(q["nSourceId"]) == 1) ? 3 : Util.GetInteger(q["nSourceId"]),
                                            Postbyuser = Util.GetString(q["cUserName"]),
                                            RDate = Util.GetDateTime(q["dDate"]) == DateTime.MinValue ? "NA" : Util.GetDateTime(q["dDate"]).ToString("dd MMM yyyy"),
                                            MType = Util.GetInteger(q["nMemberTypeId"]),
                                            Remarks = Util.GetString(q["cOppsIssue"]),


                                        }).ToList();


            }
            catch (Exception ex)
            {
                Util.ErrorLock(ex.ToString());
            }


            OperationalIssuelist = OperationalIssuelist.Select(x =>
            {
                x.Count = (OperationalIssuelist.Where(t => t.RefNo == x.RefNo).ToList().Count());

                return x;
            }).ToList();

            return OperationalIssuelist;
        }
        #endregion

        #region GetTransactionDetailIssue Report
        public List<TransactionReportResultDO> GetTransactionDetail(TransactionReportDO Param, int CompCode)
        {
            DataSet DS = new DataSet();
            DataTable dt = new DataTable();
            List<TransactionReportResultDO> TransactionIssuelist = new List<TransactionReportResultDO>();
            List<SqlParameters> param = new List<SqlParameters>();
            param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, Param.MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 4, Param.LoginUserId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateFrom", SqlDbType.DateTime, 8, (Param.DateFrom == DateTime.MinValue ? (object)DBNull.Value : Param.DateFrom), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateTo", SqlDbType.DateTime, 8, (Param.DateTo == DateTime.MinValue ? (object)DBNull.Value : Param.DateTo), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, Param.BookingdateWise == true ? 1 : 0, ParameterDirection.Input));

            dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "Usp_Rpt_TransactionReport", param, DBType.Booking, CompCode);

            string Time2 = DateTime.Now.ToString("h:mm:ss tt");
            try
            {
                TransactionIssuelist = (from q in dt.AsEnumerable()
                                        select new TransactionReportResultDO
                                        {
                                            AgName = Util.GetString(q["CompanyName"]),
                                            Transact_Id = Util.GetString(q["TransactionID"]),
                                            SCurr = Util.GetString(q["PaymentCurrency"]),
                                            SAmt = Util.GetDecimal(q["Amount"]),
                                            Remarks = Util.GetString(q["Remarks"]),
                                            PDate = Util.GetDateTime(q["DateCreated"]).ToString("dd MMM yyyy"),
                                            RefNo = Util.GetString(q["BookRefNo"]) + "/" + Util.GetInteger(q["Position"]),
                                            Status = Util.GetString(q["Bookstatus"]),
                                            SName = Util.GetString(q["ServiceName"])



                                        }).ToList();


            }
            catch (Exception ex)
            {
                Util.ErrorLock(ex.ToString());
            }

            return TransactionIssuelist;
        }
        #endregion
        #region GetAgencyUserReport 
        public List<AgencyUserReportResultDO> GetAgencyUserDetail(AgencyUserReportDO Param, int CompCode)
        {
            DataSet DS = new DataSet();
            DataTable dt = new DataTable();
            List<AgencyUserReportResultDO> AgentUserReportList = new List<AgencyUserReportResultDO>();
            List<SqlParameters> param = new List<SqlParameters>();
            param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, Param.MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 4, Param.LoginUserId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));


            dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "Usp_Rpt_AgencyUserReport", param, DBType.Master, CompCode);

            string Time2 = DateTime.Now.ToString("h:mm:ss tt");
            try
            {
                AgentUserReportList = (from q in dt.AsEnumerable()
                                       select new AgencyUserReportResultDO
                                       {
                                           Agname = Util.GetString(q["AgencyName"]),
                                           AgCountry = Util.GetString(q["Country"]),
                                           AgCity = Util.GetString(q["City"]),
                                           Title = Util.GetString(q["Title"]),
                                           FirstName = Util.GetString(q["FirstName"]),
                                           LastName = Util.GetString(q["LastName"]),
                                           Mobile = Util.GetString(q["Mobile"]),
                                           Email = Util.GetString(q["Email"]),
                                           UsrCreatedDate = Util.GetDateTime(q["UsrCreatedDate"]).ToString("dd MMM yyyy"),
                                           SalesPerson = Util.GetString(q["SalesPerson"]),
                                           ReserveStaff = Util.GetString(q["ReserveStaff"]),
                                           Active = Util.GetString(q["Active"]),
                                           UName = Util.GetString(q["UserName"]),
                                       }).ToList();


            }
            catch (Exception ex)
            {
                Util.ErrorLock(ex.ToString());
            }

            return AgentUserReportList;
        }
        #endregion

        #region GetMemberCreditDetailsReport       
        public List<MemberCreditDetailsReportResultDO> GetMemberCreditDetails(MemberCreditDetailsReportDO Param, int CompCode)
        {
            DataSet DS = new DataSet();
            DataTable dt = new DataTable();
            List<MemberCreditDetailsReportResultDO> MemberCreditDetailsReportList = new List<MemberCreditDetailsReportResultDO>();
            List<SqlParameters> param = new List<SqlParameters>();
            param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, Param.MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 4, Param.LoginUserId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));


            dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "Usp_Rpt_MemberCreditDetailsReport", param, DBType.Master, CompCode);

            string Time2 = DateTime.Now.ToString("h:mm:ss tt");
            try
            {
                MemberCreditDetailsReportList = (from q in dt.AsEnumerable()
                                                 select new MemberCreditDetailsReportResultDO
                                                 {
                                                     AgName = Util.GetString(q["MemberName"]),
                                                     Member_Email = Util.GetString(q["MemberEmail"]),
                                                     BrName = Util.GetString(q["BranchName"]),
                                                     Status = Util.GetString(q["CreditStatus"]),
                                                     Currency = Util.GetString(q["CreditCurrency"]),
                                                     // Balance = Util.GetDecimal(q["Balance"]),
                                                     Balance = Util.GetDecimal(q["Balance"]).ToString() + (Util.GetSingle(q["TempCredit"]).ToString() == "0" ? "" : " " + "TempCredit" + "(" + Util.GetSingle(q["TempCredit"]).ToString() + ")"),
                                                 }).ToList();


            }
            catch (Exception ex)
            {
                Util.ErrorLock(ex.ToString());
            }

            return MemberCreditDetailsReportList;
        }
        #endregion

        #region Hotel Mize report
        public List<HotelMizeReportResultDo> GetHotelMizeReportDetail(HotelMizeReportDO Param, int CompCode)
        {
            DataSet DS = new DataSet();
            DataTable dt = new DataTable();
            List<HotelMizeReportResultDo> HotelMisesReportResultlist = new List<HotelMizeReportResultDo>();
            List<SqlParameters> param = new List<SqlParameters>();
            param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, Param.MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 4, Param.LoginUserId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateFrom", SqlDbType.DateTime, 8, (Param.DateFrom == DateTime.MinValue ? (object)DBNull.Value : Param.DateFrom), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateTo", SqlDbType.DateTime, 8, (Param.DateTo == DateTime.MinValue ? (object)DBNull.Value : Param.DateTo), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Int, 5, Param.BookingdateWise == true ? 1 : 0, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@SupplierId", SqlDbType.Int, 4, Param.SupplierId, ParameterDirection.Input));

            dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "Usp_Rpt_HotelMizeBookingsReport", param, DBType.Booking, CompCode);

            string Time2 = DateTime.Now.ToString("h:mm:ss tt");
            try
            {
                HotelMisesReportResultlist = (from q in dt.AsEnumerable()
                                              select new HotelMizeReportResultDo
                                              {
                                                  BId=Util.GetString(q["BookingId"]).ToString(),
                                                  RefNo = Util.GetString(q["BookRefNo"]) + "/" + Util.GetString(q["BookPosition"]),
                                                  BookDate = Util.GetDateTime(q["BookDate"]) == DateTime.MinValue ? "NA" : Util.GetDateTime(q["BookDate"]).ToString("dd MMM yyyy"),
                                                  ChkIn = Util.GetDateTime(q["CheckInDate"]) == DateTime.MinValue ? "NA" : Util.GetDateTime(q["CheckInDate"]).ToString("dd MMM yyyy"),
                                                  Chkout = Util.GetDateTime(q["CheckOutDate"]) == DateTime.MinValue ? "NA" : Util.GetDateTime(q["CheckOutDate"]).ToString("dd MMM yyyy"),
                                                  OriginalRefNo = Util.GetString(q["OriginalRefNo"]).ToString(),
                                                  HMStatus = Util.GetString(GetStatus(q)).ToString(),// Converted Book status
                                                  Status=Util.GetString(q["oldbookStatus"]).ToString(),
                                                  HM_SuppName = Util.GetString(q["SupplierName"]).ToString(),
                                                  HM_NetAmt = Util.GetDecimal(q["FinalNetAmt"]),
                                                  NetAmt = Util.GetDecimal(q["OldNetAmount"]),
                                                  Profit = Util.GetDecimal(q["Profit"]),
                                                  Error = Util.GetString(q["Error"]).ToString(),
                                                  HM_NetCur=Util.GetString(q["New_NetCurrency"]).ToString(),
                                                  NetCur= Util.GetString(q["Old_NetCurrency"]).ToString(),
                                                  Conv = Util.GetString(new BookingDAL().ConversionCheck(q)),
                                                  SuppName = Util.GetString(q["OldSupplierName"]).ToString(),
                                              }).ToList();


            }
            catch (Exception ex)
            {
                Util.ErrorLock(ex.ToString());
            }

            //HotelMisesReportResultlist = HotelMisesReportResultlist.Select(x =>
            //{
            //    x.count = (HotelMisesReportResultlist.Where(t => t.RefNo == x.RefNo).ToList().Count());

            //    return x;
            //}).ToList();

            return HotelMisesReportResultlist;
        }
        #endregion


        #region Credir Report
        public List<GstReportResultList> GetGstReportDetail(GstReportDo gstReportDO, int CompCode)
        {
            try
            {


                List<SqlParameters> objSqlParameters = new List<SqlParameters>();
                objSqlParameters.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
                objSqlParameters.Add(SqlParameters.Add("@FromDate", SqlDbType.VarChar, 12, gstReportDO.FromDate.ToString("MM-dd-yyyy"), ParameterDirection.Input));
                objSqlParameters.Add(SqlParameters.Add("@ToDate", SqlDbType.DateTime, 12, gstReportDO.ToDate.ToString("MM-dd-yyy"), ParameterDirection.Input));
                objSqlParameters.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, gstReportDO.MemberId, ParameterDirection.Input));

                using (DataSet objDataSet = SqlManager.ExecuteDataSet(CommandType.StoredProcedure, "usp_Rpt_GetGstReportList", objSqlParameters, DBType.Booking, CompCode))
                {
                    return BuildGetGstReportList(objDataSet, CompCode);
                }
            }
            catch (Exception ex)
            {

                throw;
            }
        }

        private List<GstReportResultList> BuildGetGstReportList(DataSet objDataSet, int CompCode)
        {
            List<GstReportResultList> objGstReportDOLst = new List<GstReportResultList>();

            if (objDataSet.Tables.Count > 0)
            {
                try
                {
                    DataTable dtList = new DataTable();
                    dtList = objDataSet.Tables[0];

                    objGstReportDOLst = (from row in dtList.AsEnumerable()
                                         select new GstReportResultList
                                         {
                                             InvNo = Util.GetString(row["cInvoiceNo"]),
                                             dtInv = Util.GetDateTime(row["InvDate"]).ToString("dd MMM yyyy"),
                                             bookRef = Util.GetString(row["BookRefNo"]),
                                             AgName = Util.GetString(row["AgencyName"]),
                                             AgNo = Util.GetString(row["AgencyID"]),
                                             SupName = Util.GetString(row["SupplierName"]),
                                             PaxName = Util.GetString(row["PaxName"]),
                                             Roe = Util.GetSingle(row["nXChangeRate"]),
                                             SupNetAmt = Util.GetDecimal(row["nNetAmount"]),
                                             SupNetCur = Util.GetString(row["cNetCurrency"]),
                                             NetAmt = Util.GetDecimal(row["NetAmountwithROE"]),
                                             NetCur = Util.GetString(row["NetCurrencyRoe"]),
                                             SrvCharge = Util.GetDecimal(row["ServiceCharge"]),
                                             DiscAmt = Util.GetDecimal(row["ncoupondiscount"]),
                                             OrgSrvCharge = Util.GetDecimal(row["OriginalServiceCharge"]),
                                             GstPer = Util.GetInteger(row["GST"]),
                                             HqPer = Util.GetDecimal(row["nHQPer"]),
                                             BrPer = Util.GetDecimal(row["nBranchPer"]),
                                             WsPer = Util.GetDecimal(row["nWsPer"]),
                                             AgPer = Util.GetDecimal(row["nAgentPer"]),
                                             SrvTax = Util.GetDecimal(row["ServiceChargeTax"]),
                                             SGST = Util.GetDecimal(row["SGST"]),
                                             CGST = Util.GetDecimal(row["CGST"]),
                                             IGST = Util.GetDecimal(row["IGST"]),
                                             HqPay = Util.GetDecimal(row["HQPayable"]),
                                             SellAmt = Util.GetDecimal(row["nSellAmount"]),
                                             SellCur = Util.GetString(row["DisSellCurrency"]),
                                             AgState = Util.GetString(row["cStateName"]),
                                             AgPan = Util.GetString(row["MemberPAN"]),
                                             AgGST = Util.GetString(row["MemberGST"]),
                                             BookPan = Util.GetString(row["BookingPAN"]),
                                             BookPanName = Util.GetString(row["BookingPanName"]),

                                         }).ToList();
                }
                catch (Exception ex)
                {
                    Util.ErrorLock(ex.ToString());
                }

            }


            return objGstReportDOLst;
        }
        #endregion
        #region TopUp Report
        public List<CreditReportResultList> GetTopUpResultList(CreditReportDO objTopUpSerach, int CompCode, int AppUrl)
        {
            List<SqlParameters> objSqlParameters = new List<SqlParameters>();
            objSqlParameters.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            objSqlParameters.Add(SqlParameters.Add("@FromDate", SqlDbType.DateTime, 12, (objTopUpSerach.FromDate == DateTime.MinValue ? (object)DBNull.Value : objTopUpSerach.FromDate), ParameterDirection.Input));
            objSqlParameters.Add(SqlParameters.Add("@ToDate", SqlDbType.DateTime, 12, (objTopUpSerach.ToDate == DateTime.MinValue ? (object)DBNull.Value : objTopUpSerach.ToDate), ParameterDirection.Input));
            objSqlParameters.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, objTopUpSerach.MemberId == 0 ? (object)DBNull.Value : objTopUpSerach.MemberId, ParameterDirection.Input));


            using (DataSet objDataSet = SqlManager.ExecuteDataSet(CommandType.StoredProcedure, "Usp_Rpt_GetTopupReportList", objSqlParameters, DBType.Master, CompCode))
            {
                return BuildGetTopUpReportList(objDataSet, CompCode, AppUrl);
            }
        }

        private List<CreditReportResultList> BuildGetTopUpReportList(DataSet objDataSet, int CompCode, int AppUrl)
        {
            List<CreditReportResultList> objTopUpReportDOLst = new List<CreditReportResultList>();

            if (objDataSet.Tables.Count > 0)
            {
                try
                {
                    DataTable dtCreditList = new DataTable();
                    dtCreditList = objDataSet.Tables[0];

                    objTopUpReportDOLst = (from row in dtCreditList.AsEnumerable()
                                           select new CreditReportResultList
                                           {
                                               BookRefNo = row.Field<string>("BookRefNo"),
                                               BookingAction = CultureInfo.CurrentCulture.TextInfo.ToTitleCase((Util.GetStatus(row["Action"].ToString().ToLower(), "", CompCode, AppUrl, null).ToLower())),
                                               Credit = Util.GetSingle(row["Credit"]),
                                               Debit = Util.GetSingle(row["Debit"]),
                                               Action = Util.GetDateTime(row["ActionDate"]),
                                               ActionDate = Util.GetDateTime(row["ActionDate"]).ToString("dd MMM yyyy"),
                                               Agname = Util.GetString(row["CompanyName"]),
                                               CreditCurrency = Util.GetString(row["CreditCurrency"]),
                                               MemberTypeId = Util.GetInteger(row["MemberTypeId"]),
                                               Address = Util.GetString(row["Address"]),
                                               Remark = Util.GetString(row["Remark"]),
                                               BookStatus = (Util.GetString(row["BookStatus"])),
                                               City = Util.GetString(row["City"]),
                                           }).ToList();
                }
                catch (Exception ex)
                {
                    Util.ErrorLock(ex.ToString());
                }

            }


            return objTopUpReportDOLst;
        }
        #endregion

        public string GetStatus(DataRow row)
        {
            string Bookstatus = Util.GetString(row["BookStatus"]).ToString();
            string status =string.Empty;
            switch (Bookstatus) {
                case "HN":
                    status = "Failed";
                    break;
                case "KK":
                    status = "Success";
                    break;
                case "XX" :
                    status = "Cancelled";
                    break;
            }
            return status;
        }
        public string ConversionCheck(DataRow row)
        {
            string Conv = string.Empty;


            decimal calculatedValue = 0;
            calculatedValue = (decimal)(Math.Round(Util.GetDecimal(row["nActual_NetAmt"]),2) * (100 - Util.GetDecimal(row["nSuppComm"]))) / 100;
            if (Util.GetDecimal(row["nSuppVatPer"]) > 0)
            {
                calculatedValue = calculatedValue / (100 + Util.GetDecimal(row["nSuppVatPer"])) * 100;
            }
            calculatedValue = calculatedValue * Convert.ToDecimal(Util.GetDecimal(row["nNew_ROE"]));
            Conv = Math.Ceiling(Util.GetDecimal(row["FinalNetAmt"])) == Math.Ceiling(calculatedValue) || Util.GetDecimal(row["FinalNetAmt"]) ==0 ? "-" : "Mismatch - (" + (Util.GetDecimal(row["FinalNetAmt"]) - Math.Round(calculatedValue,2)) + ")" ;

            return Conv;

        }
    }
}

#endregion
