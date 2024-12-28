using Report.DO;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Reporting.WebForms;
using System.Globalization;

namespace Report.DAL
{
    public class ProductionDAL
    {
        #region Hotel Productivity Report
        public List<HotelProductivityResultList> GetHotelProductivity(HotelProductivityReportDO Param, int CompCode)
        {
            DataSet DS = new DataSet();
            DataTable dt = new DataTable();
            List<HotelProductivityResultList> HotelProdList = new List<HotelProductivityResultList>();
            List<SqlParameters> param = new List<SqlParameters>();
            param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, Param.MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 4, Param.LoginUserId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateFrom", SqlDbType.DateTime, 8, (Param.DateFrom == DateTime.MinValue ? (object)DBNull.Value : Param.DateFrom), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateTo", SqlDbType.DateTime, 8, (Param.DateTo == DateTime.MinValue ? (object)DBNull.Value : Param.DateTo), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, Param.BookingdateWise == true ? 1 : 0, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CountryId", SqlDbType.Int, 4, Param.CountryId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CityId", SqlDbType.Int, 4, Param.CityId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@SupplierId", SqlDbType.Int, 4, Param.SupplierId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@HotelName", SqlDbType.VarChar, 1000, Param.HotelName, ParameterDirection.Input));

            param.Add(SqlParameters.Add("@BookingType", SqlDbType.Int, 4, Param.BookingType, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@ServiceType", SqlDbType.Int, 4, Param.ServiceType, ParameterDirection.Input));

            param.Add(SqlParameters.Add("@NationalityId", SqlDbType.Int, 4, Param.NationalityId, ParameterDirection.Input));

            if (Param.ReportView == 1)
            {
                dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "Usp_Rpt_GetHotelProductivityReport", param, DBType.Booking, CompCode);
                try
                {

                    HotelProdList = (from q in dt.AsEnumerable()
                                     select new HotelProductivityResultList
                                     {


                                         Country = Util.GetString(q["CountryName"]),
                                         City = Util.GetString(q["CityName"]),
                                         SName = Util.ToTitleCase(Util.GetString(q["HotelName"])),
                                         StarCat= Util.GetDecimal(q["StarCategory"]) > 0  ? Util.GetString(q["StarCategory"]) : "0", 
                                         Nts = Util.GetInteger(q["NoOfRoomNts"]),
                                         TTVinUSD = Math.Round(Util.GetDecimal(q["TTv"])),


                                     }).ToList();
                }
                catch (Exception ex)
                {
                    Util.ErrorLock(ex.ToString());
                }

            }
            else if (Param.ReportView == 2)
            {
                dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "Usp_Rpt_GetHotelProductivityReportDetail_Citywise", param, DBType.Booking, CompCode);
                try
                {

                    HotelProdList = (from q in dt.AsEnumerable()
                                     select new HotelProductivityResultList
                                     {


                                         Country = Util.GetString(q["CountryName"]),
                                         City = Util.GetString(q["CityName"]),
                                         Nts = Util.GetInteger(q["NoOfRoomNts"]),
                                         


                                     }).ToList();
                }
                catch (Exception ex)
                {
                    Util.ErrorLock(ex.ToString());
                }
            }
            else if (Param.ReportView == 3)
            {
                dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "Usp_Rpt_GetHotelProductivityReportDetail_PaxWise", param, DBType.Booking, CompCode);
                try
                {

                    HotelProdList = (from q in dt.AsEnumerable()
                                     select new HotelProductivityResultList
                                     {


                                         Country = Util.GetString(q["CountryName"]),
                                         City = Util.GetString(q["CityName"]),
                                         SName = Util.ToTitleCase(Util.GetString(q["HotelName"])),
                                         NoOfAdults = Util.GetInteger(q["NoOfAdults"]),
                                         NoOfChilds = Util.GetInteger(q["NoOfChilds"]),
                                         NoOfPax = Util.GetInteger(Util.GetInteger(q["NoOfAdults"]) + Util.GetInteger(q["NoOfChilds"])),



                                     }).ToList();
                }
                catch (Exception ex)
                {
                    Util.ErrorLock(ex.ToString());
                }
            }

            return HotelProdList;
        }


        #endregion


        #region Hotel Productivity Report API
        public List<HotelProductivityResultList> GetHotelProductivityAPI(HotelProductivityReportDO Param, int CompCode)
        {
            DataSet DS = new DataSet();
            DataTable dt = new DataTable();
            List<HotelProductivityResultList> HotelProdList = new List<HotelProductivityResultList>();
            List<SqlParameters> param = new List<SqlParameters>();
            param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, Param.MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 4, Param.LoginUserId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateFrom", SqlDbType.DateTime, 8, (Param.DateFrom == DateTime.MinValue ? (object)DBNull.Value : Param.DateFrom), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateTo", SqlDbType.DateTime, 8, (Param.DateTo == DateTime.MinValue ? (object)DBNull.Value : Param.DateTo), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, Param.BookingdateWise == true ? 1 : 0, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CountryId", SqlDbType.Int, 4, Param.CountryId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CityId", SqlDbType.Int, 4, Param.CityId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@SupplierId", SqlDbType.Int, 4, Param.SupplierId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@HotelName", SqlDbType.VarChar, 1000, Param.HotelName, ParameterDirection.Input));

            param.Add(SqlParameters.Add("@BookingType", SqlDbType.Int, 4, Param.BookingType, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@ServiceType", SqlDbType.Int, 4, Param.ServiceType, ParameterDirection.Input));

            param.Add(SqlParameters.Add("@NationalityId", SqlDbType.Int, 4, Param.NationalityId, ParameterDirection.Input));         
            dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "Usp_Rpt_GetHotelProductivityReportAPI", param, DBType.Booking, CompCode);
                try
                {

                HotelProdList = (from q in dt.AsEnumerable()
                                 select new HotelProductivityResultList
                                 {


                                     Country = Util.GetString(q["CountryName"]),
                                     City = Util.GetString(q["CityName"]),
                                     SName = Util.ToTitleCase(Util.GetString(q["HotelName"])),
                                     StarCat = Util.GetDecimal(q["StarCategory"]) > 0 ? Util.GetString(q["StarCategory"]) : "0",
                                     Nts = Util.GetInteger(q["NoOfRoomNts"]),
                                     HotelId = Util.GetString(q["HotelId"]),
                                     CountryCode = Util.GetString(q["CountryCode"]),
                                     HotelAddress = Util.GetString(q["HotelAddress"]),
                                     TelePhone = Util.GetString(q["TelePhone"]) != "" ? Util.GetString(q["TelePhone"]) : "-",
                                     HotelDescription = Util.GetString(q["HotelDescription"]) != "" ? Util.GetString(q["HotelDescription"]) : "-",
                                     ImagePath = Util.GetString(q["ImagePath"]) != "" ? Util.GetString(q["ImagePath"]) : "-",
                                     Latitude = Util.GetString(q["Latitude"]) != "" ? Util.GetString(q["Latitude"]) : "-",
                                     Longitude = Util.GetString(q["Longitude"]) != "" ? Util.GetString(q["Longitude"]) : "-",
                                     SuppCityCode = Util.GetString(q["SupplierCityCode"]) != "" ? Util.GetString(q["SupplierCityCode"]) : "-",
                                     GiataId = Util.GetString(q["GiataId"]) != "" ? Util.GetString(q["GiataId"]) : "-",
                                     ExpediaHCode = Util.GetString(q["ExpediaHotelCode"]) != "" ? Util.GetString(q["ExpediaHotelCode"]) : "-",
                                     HBHCode = Util.GetString(q["HotelBedsHotelCode"]) != "" ? Util.GetString(q["HotelBedsHotelCode"]) : "-",
                                     AgodaHCode = Util.GetString(q["AgodaHotelCode"]) != "" ? Util.GetString(q["AgodaHotelCode"]) : "-",
                                     TGXCode = Util.GetString(q["CityId"]) + "#" + Util.GetString(q["HotelId"]),
                                 }).ToList();
                }
                catch (Exception ex)
                {
                    Util.ErrorLock(ex.ToString());
                }
            
            return HotelProdList;
        }

        #endregion


        public List<ProductivityReportResultDO> GetProductivityRpt(ProductivityReportDO Para, int compcode)
        {
            DataSet DS = new DataSet();
            DataTable dt = new DataTable();
            List<ProductivityReportResultDO> Productivityeport = new List<ProductivityReportResultDO>();          
            List<SqlParameters> param = new List<SqlParameters>();
            param.Add(SqlParameters.Add("@DateFrom", SqlDbType.DateTime, 8, (Para.DateFrom == DateTime.MinValue ? (object)DBNull.Value : Para.DateFrom), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateTo", SqlDbType.DateTime, 8, (Para.DateTo == DateTime.MinValue ? (object)DBNull.Value : Para.DateTo), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 10, Para.MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 10, Para.LoginUserId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, compcode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, Para.BookingdateWise == true ? 1 : 0, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CountryId", SqlDbType.Int, 4, Para.CountryId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CityId", SqlDbType.Int, 4, Para.CityId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@SupplierId", SqlDbType.Int, 4, Para.SupplierId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@BookingType", SqlDbType.Int, 4, Para.BookingType, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@BookingStatus", SqlDbType.VarChar,50, Para.BookingStatus, ParameterDirection.Input));
            dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "Usp_Rpt_CCProductivityReport", param,  DBType.Booking, compcode);
            string Time2 = DateTime.Now.ToString("h:mm:ss tt");            
            try
            {
                Productivityeport = (from q in dt.AsEnumerable()
                                     select new ProductivityReportResultDO
                                     {
                                         bRefNo = Util.GetString(q["BookRefNo"]),
                                         BookDt = Util.GetDateTime(q["BookDate"]).ToString("dd MMM yyyy"),
                                         CkInDt = Util.GetDateTime(q["CheckinDate"]).ToString("dd MMM yyyy"),
                                         CkOutDt = Util.GetDateTime(q["CheckOutDate"]).ToString("dd MMM yyyy"),                                        
                                         SellAmt = Util.GetDecimal(q["SellAmt"]),                                       
                                         SellCcy = Util.GetString(q["SellCurrency"]),                                        
                                         nPax = Util.GetInteger(q["adult"])+ Util.GetInteger(q["child"]),
                                         Agency = Util.GetString(q["CompName"]),
                                         Country = Util.GetString(q["country"]),
                                         City = Util.GetString(q["city"]),
                                         ServiceTyp = Util.GetString(q["ServiceType"]),
                                         nNTS = Util.GetInteger(q["NoOfNts"]),
                                         nRooms = Util.GetInteger(q["NoOfRooms"]),                                          
                                         bStatus = Util.GetString(q["BookStatus"]),
                                         bSource = Util.GetString(q["BookingSource"]),
                                         BrCode = Util.GetInteger(q["BranchCode"]),
                                         Service= Util.GetString(q["ServiceName"]),
                                         StarCat = Util.GetString(q["StarCat"]),
                                         SuppName=Util.GetString(q["SupplierName"])                                         
                                     }).ToList();
            }
            catch (Exception ex)
            {
                Util.ErrorLock(ex.ToString());
            }
            return Productivityeport;
        }

        public List<SalesProductivityResultDO> SalesStatementNew(SalesProductivityReportDO Param, int CompCode)
        {
            DataSet DS = new DataSet();
            DataTable dt = new DataTable();
            List<SalesProductivityResultDO> SalesProductivityResult = new List<SalesProductivityResultDO>();
            List<SalesProductivityResultDO> SalesProductivityResult1 = new List<SalesProductivityResultDO>();
            List<SqlParameters> param = new List<SqlParameters>();

            string Currency = "AED";

            int SearchMemberId = 0;
           
            param.Add(SqlParameters.Add("@CompCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@SearchMemberId", SqlDbType.Int, 4, SearchMemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@Currency", SqlDbType.VarChar, 10, Currency, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, Param.BookingdateWise == true ? 1 : 0, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateFrom", SqlDbType.DateTime, 8, (Param.DateFrom == DateTime.MinValue ? (object)DBNull.Value : Param.DateFrom), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateTo", SqlDbType.DateTime, 8, (Param.DateTo == DateTime.MinValue ? (object)DBNull.Value : Param.DateTo), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginMemberId", SqlDbType.Int, 4, Param.MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 8, Param.LoginUserId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@InTermsOf", SqlDbType.Int, 4, Param.InTermsOf, ParameterDirection.Input));

            dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "Usp_Rpt_SalesProductivityReport", param, DBType.Booking, CompCode);

            string Time2 = DateTime.Now.ToString("h:mm:ss tt");
            try
            {


                SalesProductivityResult = (from q in dt.AsEnumerable()
                                           select new SalesProductivityResultDO
                                           {
                                               SName = Util.GetString(q["SalesPerson"]),
                                               BStatus = Util.GetString(q["cBookStatus"]),
                                               SellAmt = Util.GetDecimal(q["SellAmount"]),
                                               XXCharge = Util.GetDecimal(q["XXCharge"]),


                                           }).ToList();

                SalesProductivityResult1 = (from k in SalesProductivityResult
                                            orderby k.SName descending
                                            group k by new
                                            {
                                                k.SName
                                            } into Sales

                                            select new SalesProductivityResultDO
                                            {
                                                SName = Sales.First().SName,
                                                BStatus = Sales.First().BStatus,
                                                Confirm = Sales.Where(r => r.BStatus == "KK" || r.BStatus == "RN").Count(),
                                                ReCon = Sales.Where(r => r.BStatus == "RR").Count(),
                                                Cancel= Sales.Where(r => r.BStatus == "XX" || r.BStatus == "XN").Count(),
                                                Failed = Sales.Where(r => r.BStatus == "HN" || r.BStatus == "UC").Count(),
                                                //SellAmt = Sales.Select(r => r.SellAmt).Sum(),
                                                SellAmt = Sales.Where(r => r.BStatus == "RR").Sum(r => r.SellAmt),
                                                XXCharge = Sales.Where(r => r.BStatus == "XX").Sum(r => r.XXCharge),
                                                Total = Math.Round((Sales.Where(r => r.BStatus == "RR").Sum(r => r.SellAmt) + Sales.Where(r => r.BStatus == "XX").Sum(r => r.XXCharge)),2),
                                            }).ToList();


            }
            catch (Exception ex)
            {
                Util.ErrorLock(ex.ToString());
            }

            return SalesProductivityResult1;
        }


        public List<HQProductivityResultDO> HQStatementNew(HQProductivityReportDO Param, int CompCode)
        {
            DataSet DS = new DataSet();
            DataTable dt = new DataTable();
            List<HQProductivityResultDO> HQProductivityResult = new List<HQProductivityResultDO>();
            List<HQProductivityResultDO> HQProductivityResult1 = new List<HQProductivityResultDO>();
            List<SqlParameters> param = new List<SqlParameters>();
            string Currency = "AED";
            int SearchMemberId = 0;

            param.Add(SqlParameters.Add("@CompCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@SearchMemberId", SqlDbType.Int, 4, SearchMemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@Currency", SqlDbType.VarChar, 10, Currency, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, Param.BookingdateWise == true ? 1 : 0, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateFrom", SqlDbType.DateTime, 8, (Param.DateFrom == DateTime.MinValue ? (object)DBNull.Value : Param.DateFrom), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateTo", SqlDbType.DateTime, 8, (Param.DateTo == DateTime.MinValue ? (object)DBNull.Value : Param.DateTo), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginMemberId", SqlDbType.Int, 4, Param.MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 8, Param.LoginUserId, ParameterDirection.Input));

            dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "Usp_Rpt_HQProductivityReport", param, DBType.Booking, CompCode);

            string Time2 = DateTime.Now.ToString("h:mm:ss tt");
            try
            {


                HQProductivityResult = (from q in dt.AsEnumerable()
                                           select new HQProductivityResultDO
                                           {
                                               SName = Util.GetString(q["HQUser"]),
                                               BStatus = Util.GetString(q["cBookStatus"]),
                                               SellAmt = Util.GetDecimal(q["SellAmount"]),
                                               XXCharge = Util.GetDecimal(q["XXCharge"]),


                                           }).ToList();

                HQProductivityResult1 = (from k in HQProductivityResult
                                            orderby k.SName descending
                                            group k by new
                                            {
                                                k.SName
                                            } into Sales

                                            select new HQProductivityResultDO
                                            {
                                                SName = Sales.First().SName,
                                                BStatus = Sales.First().BStatus,
                                                Confirm = Sales.Where(r => r.BStatus == "KK" || r.BStatus == "RN").Count(),
                                                ReCon = Sales.Where(r => r.BStatus == "RR").Count(),
                                                Cancel = Sales.Where(r => r.BStatus == "XX" || r.BStatus == "XN").Count(),
                                                Failed = Sales.Where(r => r.BStatus == "HN" || r.BStatus == "UC").Count(),
                                                //SellAmt = Sales.Select(r => r.SellAmt).Sum(),
                                                SellAmt = Sales.Where(r => r.BStatus == "RR").Sum(r => r.SellAmt),
                                                XXCharge = Sales.Where(r => r.BStatus == "XX").Sum(r => r.XXCharge),
                                                Total = Math.Round((Sales.Where(r => r.BStatus == "RR").Sum(r => r.SellAmt) + Sales.Where(r => r.BStatus == "XX").Sum(r => r.XXCharge)), 2),
                                            }).ToList();


            }
            catch (Exception ex)
            {
                Util.ErrorLock(ex.ToString());
            }

            return HQProductivityResult1;
        }

    }

}
