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
    public class DashboardDAL
    {
        #region BookStatus Report
        public List<BookStatusReportResultList> GetStatusReport(BookStatusDO Param, int CompCode)
        {
            DataSet DS = new DataSet();
            DataTable dt = new DataTable();

            List<BookStatusReportResultList> StatusReportList = new List<BookStatusReportResultList>();
            try
            {
                if(CompCode ==1)
                {
                    Param.MemberId = new ClientSettings().CheckInboundByMemberId(Param.MemberId, CompCode);
                }
           

            List<SqlParameters> param = new List<SqlParameters>();
            param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, Param.MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 4, Param.LoginUserId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateFrom", SqlDbType.DateTime, 8, (Param.DateFrom == DateTime.MinValue ? (object)DBNull.Value : Param.DateFrom), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateTo", SqlDbType.DateTime, 8, (Param.DateTo == DateTime.MinValue ? (object)DBNull.Value : Param.DateTo), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, Param.BookingdateWise == true ? 1 : 0, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@BookStatus", SqlDbType.VarChar, 20, Param.BookStatus, ParameterDirection.Input));


            dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "Usp_Rpt_BookStatusReport", param, DBType.Booking, CompCode);


           

                StatusReportList = (from q in dt.AsEnumerable()
                                  select new BookStatusReportResultList
                                  {
                                      RefNo = Util.GetString(q["BookRefNo"]) + "/" + Util.GetString(q["BookPosition"]),
                                      BrName = Util.GetString(q["BranchName"]),
                                      AgName = Util.GetString(q["AgencyName"]), 
                                      SName = Util.GetString(q["ServiceName"]),
                                      SType = Util.GetString(q["ServiceType"]),
                                      BType = (Util.GetInteger(q["SupType"]) == 3 && Util.GetInteger(q["SourceId"]) == 1) ? 3 : Util.GetInteger(q["SourceId"]),
                                      BDate = Util.GetDateTime(q["BookDate"]).ToString("dd MMM yyyy"),
                                      ChkIn = Util.GetDateTime(q["ChkInDate"]).ToString("dd MMM yyyy"),
                                      Nts = Util.GetInteger(q["NoOfNts"]),
                                      CityName = Util.GetString(q["CityName"]) ,
                                      SuppName = Util.GetString(q["SupplierName"]),
                                      BookedBy = Util.GetInteger(q["BookedBy"]),
                                      Status = Util.GetString(q["BookStatus"]),
                                      Postbyuser = Util.GetString(q["Postbyuser"]),
                                  }).ToList();
            }
            catch (Exception ex)
            {
                Util.ErrorLock(ex.ToString());
            }

            return StatusReportList;
        }


        #endregion

        #region Servicewise Booking Report
        public List<SerBookReportResultListDO> GetSerBookingReport(SerBookingDO Param, int CompCode)
        {
            DataSet DS = new DataSet();
            DataTable dt = new DataTable();
            List<SerBookReportResultListDO> SerBookingReportList = new List<SerBookReportResultListDO>();
            try
            {
                if (CompCode == 1)
                {
                    Param.MemberId = new ClientSettings().CheckInboundByMemberId(Param.MemberId, CompCode);
                }
                List<SqlParameters> param = new List<SqlParameters>();
            param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, Param.MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 4, Param.LoginUserId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateFrom", SqlDbType.DateTime, 8, (Param.DateFrom == DateTime.MinValue ? (object)DBNull.Value : Param.DateFrom), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateTo", SqlDbType.DateTime, 8, (Param.DateTo == DateTime.MinValue ? (object)DBNull.Value : Param.DateTo), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, Param.BookingdateWise == true ? 1 : 0, ParameterDirection.Input));
           

            dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "Usp_Rpt_ServiceBookingReport", param, DBType.Booking, CompCode);


          
                SerBookingReportList = (from q in dt.AsEnumerable()
                                        where Util.GetInteger(q["IsAppServices"]) == 1
                                        select new SerBookReportResultListDO
                                        {

                                            Service = (Util.GetString(q["ServiceName"])),
                                            OnlineDirect = Util.GetInteger(q["Online-Direct"]),
                                            OnlinePosted = Util.GetInteger(q["Online-Posted"]),
                                            Offline = Util.GetInteger(q["Offline-Direct"]) + Util.GetInteger(q["Offline-Posted"]),
                                            OfflineDirect = Util.GetInteger(q["Offline-Direct"]),
                                            OfflinePosted = Util.GetInteger(q["Offline-Posted"]),
                                            Total = Util.GetInteger(q["Total"]),
                                            IsAppService = Util.GetBoolean(q["IsAppServices"]),

                                    }).ToList();

            }
            catch (Exception ex)
            {
                Util.ErrorLock(ex.ToString());
            }

            return SerBookingReportList;
        }



        #endregion

        #region BranchProductivity Report

        public List<BranchBookingReportResultList> GetBranchBookingReport(BranchBookingDO Param, int CompCode)
        {
            DataSet DS = new DataSet();
            DataTable dt = new DataTable();
            List<BranchBookingReportResultList> BRBookingReportList = new List<BranchBookingReportResultList>();
            try
            {
                List<SqlParameters> param = new List<SqlParameters>();
            param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, Param.MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 4, Param.LoginUserId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateFrom", SqlDbType.DateTime, 8, (Param.DateFrom == DateTime.MinValue ? (object)DBNull.Value : Param.DateFrom), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateTo", SqlDbType.DateTime, 8, (Param.DateTo == DateTime.MinValue ? (object)DBNull.Value : Param.DateTo), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, Param.BookingdateWise == true ? 1 : 0, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@Currency", SqlDbType.VarChar, 20, Param.Currency, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@InTerms", SqlDbType.Int, 4, Param.InTerms, ParameterDirection.Input));


            dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "Usp_Rpt_BranchBookingReport", param, DBType.Booking, CompCode);


           

                BRBookingReportList = (from q in dt.AsEnumerable()
                                    select new BranchBookingReportResultList
                                    {
                                        RefNo = Util.GetString(q["BookRefNo"]) + "/" + Util.GetString(q["BookPosition"]),
                                        SType = Util.GetString(q["ServiceType"]),
                                        BType = (Util.GetInteger(q["SupType"]) == 3 && Util.GetInteger(q["SourceId"]) == 1) ? 3 : Util.GetInteger(q["SourceId"]),
                                       
                                        ChkIn = Util.GetDateTime(q["ChkInDate"]).ToString("dd MMM yyyy"),
                                        Nts = Util.GetInteger(q["NoOfNts"]),
                                        Status = Util.GetString(q["BookStatus"]),
                                        SName = Util.GetString(q["ServiceName"]),
                                        SuppName = Util.GetString(q["SupplierName"]),
                                        City = Util.GetString(q["CityName"]),
                                        BrName = Util.GetString(q["BranchName"]),
                                        AgName = Util.GetString(q["AgencyName"]),
                                        SellAmt = Util.GetDecimal(q["SellAmount"]),
                                        MainSellAmt = Util.GetDecimal(q["MainSellAmount"]),
                                        SellCur = Util.GetString(q["SellCurrency"]),
                                        BCount = Util.GetInteger(1),
                                        TotalValue = Util.GetInteger(0),
                                        Postbyuser = Util.GetString(q["Postbyuser"]),
                                    }).ToList();



               
               
                var TotalList = (from t in BRBookingReportList
                              group  t by new { t.BrName } into grp
                              select new
                              {
                                  Brname = grp.First().BrName,
                                  Total = (Param.InTerms == 2 ? Convert.ToDecimal(grp.Sum(p => p.SellAmt)) : grp.Sum(p => p.BCount)),
                                 
                              }
                               ).ToList();

                BRBookingReportList = BRBookingReportList.Select(x =>
                {
                    x.TotalValue = ((TotalList.Where(t => t.Brname == x.BrName).Select(q => q.Total))).FirstOrDefault(); return x;
                }).ToList();


            }
            catch (Exception ex)
            {
                Util.ErrorLock(ex.ToString());
            }

            return BRBookingReportList;
        }

        #endregion

        #region AgencyProductivity Report

        public List<AgentBookingReportResultList> GetAgencyBookingReport(AgentBookingDO Param, int CompCode)
        {
            DataSet DS = new DataSet();
            DataTable dt = new DataTable();
            List<AgentBookingReportResultList> AgBookingReportList = new List<AgentBookingReportResultList>();
            try
            {
                if (CompCode == 1)
                {
                    Param.MemberId = new ClientSettings().CheckInboundByMemberId(Param.MemberId, CompCode);
                }
            List<SqlParameters> param = new List<SqlParameters>();
            param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, Param.MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 4, Param.LoginUserId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateFrom", SqlDbType.DateTime, 8, (Param.DateFrom == DateTime.MinValue ? (object)DBNull.Value : Param.DateFrom), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateTo", SqlDbType.DateTime, 8, (Param.DateTo == DateTime.MinValue ? (object)DBNull.Value : Param.DateTo), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, Param.BookingdateWise == true ? 1 : 0, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@Currency", SqlDbType.VarChar, 20, Param.Currency, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@InTerms", SqlDbType.Int, 4, Param.InTerms, ParameterDirection.Input));


            dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "Usp_Rpt_AgentBookingReport", param, DBType.Booking, CompCode);


           

                AgBookingReportList = (from q in dt.AsEnumerable()
                                       select new AgentBookingReportResultList
                                       {

                                           RefNo = Util.GetString(q["BookRefNo"]) + "/" + Util.GetString(q["BookPosition"]),
                                           SType = Util.GetString(q["ServiceType"]),
                                           BType = (Util.GetInteger(q["SupType"]) == 3 && Util.GetInteger(q["SourceId"]) == 1) ? 3 : Util.GetInteger(q["SourceId"]),

                                           ChkIn = Util.GetDateTime(q["ChkInDate"]).ToString("dd MMM yyyy"),
                                           Nts = Util.GetInteger(q["NoOfNts"]),
                                           Status = Util.GetString(q["BookStatus"]),
                                           SName = Util.GetString(q["ServiceName"]),
                                           SuppName = Util.GetString(q["SupplierName"]),
                                           City = Util.GetString(q["CityName"]),
                                           BrName = Util.GetString(q["BranchName"]),
                                           AgName = Util.GetString(q["AgencyName"]),
                                           SellAmt = Util.GetDecimal(q["SellAmount"]),
                                           MainSellAmt = Util.GetDecimal(q["MainSellAmount"]),
                                           SellCur = Util.GetString(q["SellCurrency"]),
                                           BCount = Util.GetInteger(1),
                                           TotalValue = Util.GetInteger(0),
                                           Postbyuser = Util.GetString(q["Postbyuser"]),
                                       }).ToList();

                var TotalList = (from t in AgBookingReportList
                                 group t by new { t.AgName } into grp
                                 select new
                                 {
                                     Agname = grp.First().AgName,
                                     Total = (Param.InTerms == 2 ? Convert.ToDecimal(grp.Sum(p => p.SellAmt)) : grp.Sum(p => p.BCount)),

                                 }
                             ).ToList();

                AgBookingReportList = AgBookingReportList.Select(x =>
                {
                    x.TotalValue = ((TotalList.Where(t => t.Agname == x.AgName).Select(q => q.Total))).FirstOrDefault(); return x;
                }).ToList();
            }
            catch (Exception ex)
            {
                Util.ErrorLock(ex.ToString());
            }

            return AgBookingReportList;
        }

        #endregion

        #region SupplierProductivity Report

        public List<SupplierBookingReportResultList> GetSupplierBookingReport(SupplierBookingDO Param, int CompCode)
        {
            DataSet DS = new DataSet();
            DataTable dt = new DataTable();
            List<SupplierBookingReportResultList> SuppBookingReportList = new List<SupplierBookingReportResultList>();
            try
            {
                if (CompCode == 1)
                {
                    Param.MemberId = new ClientSettings().CheckInboundByMemberId(Param.MemberId, CompCode);
                }
            List<SqlParameters> param = new List<SqlParameters>();
            param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, Param.MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 4, Param.LoginUserId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateFrom", SqlDbType.DateTime, 8, (Param.DateFrom == DateTime.MinValue ? (object)DBNull.Value : Param.DateFrom), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateTo", SqlDbType.DateTime, 8, (Param.DateTo == DateTime.MinValue ? (object)DBNull.Value : Param.DateTo), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, Param.BookingdateWise == true ? 1 : 0, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@Currency", SqlDbType.VarChar, 20, Param.Currency, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@InTerms", SqlDbType.Int, 4, Param.InTerms, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@ProdType", SqlDbType.Int, 4, (Param.ProdType), ParameterDirection.Input));


                dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "Usp_Rpt_SupplierBookingReport_V2", param, DBType.Booking, CompCode);


           

                SuppBookingReportList = (from q in dt.AsEnumerable()
                                       select new SupplierBookingReportResultList
                                       {

                                           RefNo = Util.GetString(q["BookRefNo"]) + "/" + Util.GetString(q["BookPosition"]),
                                           SType = Util.GetString(q["ServiceType"]),
                                           BType = (Util.GetInteger(q["SupType"]) == 3 && Util.GetInteger(q["SourceId"]) == 1) ? 3 : Util.GetInteger(q["SourceId"]),

                                           ChkIn = Util.GetDateTime(q["ChkInDate"]).ToString("dd MMM yyyy"),
                                           Nts = Util.GetInteger(q["NoOfNts"]),
                                           Status = Util.GetString(q["BookStatus"]),
                                           SName = Util.GetString(q["ServiceName"]),
                                           SuppName = Util.ToTitleCase(Util.GetString(q["SupplierName"])) +"~" + Util.GetInteger(q["Supplierid"]),
                                           City = Util.GetString(q["CityName"]),
                                           BrName = Util.GetString(q["BranchName"]),
                                           AgName = Util.GetString(q["AgencyName"]),
                                           SellAmt = Util.GetDecimal(q["SellAmount"]),
                                           MainSellAmt = Util.GetDecimal(q["MainSellAmount"]),
                                           SellCur = Util.GetString(q["SellCurrency"]),
                                           BCount = Util.GetInteger(1),
                                           TotalValue = Util.GetInteger(0),
                                           ProdType =  string.IsNullOrEmpty(Util.GetString(q["BookRefNo"])) ? "Non Productive Supplier" : "Productive Supplier",
                                           LastBookingDate = Util.GetDateTime(q["LastBookingDate"]).ToString("dd MMM yyyy"),
                                           Postbyuser = Util.GetString(q["Postbyuser"]),
                                       }).ToList();

                var TotalList = (from t in SuppBookingReportList 
                                 where t.RefNo != "/" || t.AgName != ""
                                group t by new { t.SuppName } into grp                                
                                 select new
                                 {
                                     SuppName = grp.First().SuppName,
                                     Total = (Param.InTerms == 2 ? Convert.ToDecimal(grp.Sum(p => p.SellAmt)) : grp.Sum(p => p.BCount)),

                                 }
                           ).ToList();

                SuppBookingReportList = SuppBookingReportList.Select(x =>
                {
                    x.TotalValue = ((TotalList.Where(t => t.SuppName == x.SuppName).Select(q => q.Total))).FirstOrDefault(); return x;
                }).ToList();

                


            }
            catch (Exception ex)
            {
                Util.ErrorLock(ex.ToString());
            }

            return SuppBookingReportList;
        }


        public List<BlockSupplierDO> GetBlockSupplierList(int CompCode)
        {
            DataTable dt = new DataTable();
            List<BlockSupplierDO> objBlockSupplierList = new List<BlockSupplierDO>();

            List<SqlParameters> param = new List<SqlParameters>();
            param.Add(SqlParameters.Add("@CompanyCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));

            try
            {
                dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "usp_Rpt_GetBlockSupplierList", param, DBType.Master, CompCode);
               

                objBlockSupplierList = (from q in dt.AsEnumerable()
                                         select new BlockSupplierDO
                                         {

                                             SId = Util.GetInteger(q["SuppId"]),
                                             SuppName = Util.GetString(q["SupplierName"]),
                                             Service = Util.GetString(q["ServiceName"]),
                                             ServId = Util.GetInteger(q["ServiceId"]),

                                         }).ToList();
            }
            catch (Exception ex)
            {
                Util.ErrorLock(ex.ToString());
            }

            return objBlockSupplierList;
        }
      


        #endregion

        #region Failed Booking Report

        public List<FailedBookingReportResultList> GetFailedBookingReport(FailedBookingDO Param, int CompCode)
        {
            DataSet DS = new DataSet();
            DataTable dt = new DataTable();
            List<FailedBookingReportResultList> FailedBookingReportList = new List<FailedBookingReportResultList>();
            try
            {
                if (CompCode == 1)
                {
                    Param.MemberId = new ClientSettings().CheckInboundByMemberId(Param.MemberId, CompCode);
                }
            List<SqlParameters> param = new List<SqlParameters>();
            param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, Param.MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 4, Param.LoginUserId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateFrom", SqlDbType.DateTime, 8, (Param.DateFrom == DateTime.MinValue ? (object)DBNull.Value : Param.DateFrom), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@DateTo", SqlDbType.DateTime, 8, (Param.DateTo == DateTime.MinValue ? (object)DBNull.Value : Param.DateTo), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, Param.BookingdateWise == true ? 1 : 0, ParameterDirection.Input));
           

            dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "Usp_Rpt_SuppFaliedBookingReport", param, DBType.Booking, CompCode);




                FailedBookingReportList = (from q in dt.AsEnumerable()
                                         select new FailedBookingReportResultList
                                         {

                                             RefNo = Util.GetString(q["BookRefNo"]) + "/" + Util.GetString(q["BookPosition"]),
                                             SType = Util.GetString(q["ServiceType"]),
                                             BType = (Util.GetInteger(q["SupType"]) == 3 && Util.GetInteger(q["SourceId"]) == 1) ? 3 : Util.GetInteger(q["SourceId"]),

                                             ChkIn = Util.GetDateTime(q["ChkInDate"]).ToString("dd MMM yyyy"),
                                             Nts = Util.GetInteger(q["NoOfNts"]),
                                             Status = Util.GetString(q["BookStatus"]),

                                             SuppName = Util.GetString(q["SupplierName"]),
                                             City = Util.GetString(q["CityName"]),
                                             BrName = Util.GetString(q["BranchName"]),
                                             AgName = Util.GetString(q["AgencyName"]),
                                             SellAmt = Util.GetDecimal(q["SellAmount"]),
                                             SellCur = Util.GetString(q["SellCurrency"]),
                                             BCount = Util.GetInteger(1),
                                             TotalValue = Util.GetInteger(0),
                                             IsAutoSoldOut = Util.GetString((Util.GetBoolean(q["IsAutoSoldOut"])) == true ?  "Y" : "N"),
                                             Error = Util.GetString(q["Error"]),
                                                                                      

                                         }).ToList();
                var TotalList = (from t in FailedBookingReportList
                                 group t by new { t.SuppName } into grp
                                 select new
                                 {
                                     SuppName = grp.First().SuppName,
                                     Total = grp.Sum(p => p.BCount),

                                 }
                        ).ToList();

                FailedBookingReportList = FailedBookingReportList.Select(x =>
                {
                    x.TotalValue = ((TotalList.Where(t => t.SuppName == x.SuppName).Select(q => q.Total))).FirstOrDefault(); return x;
                }).ToList();

                //FailedBookingReportList = FailedBookingReportList.Select(x =>{
                //    x.IsAutoSoldOut=(())
                //})
            }
            catch (Exception ex)
            {
                Util.ErrorLock(ex.ToString());
            }

            return FailedBookingReportList;
        }

        #endregion

        #region Serach City Booking Report

        public List<SearchCityBookingReportResultList> GetSearchCityBookingReport(SearchCityBookingDO Param, int CompCode)
        {
            DataSet DS = new DataSet();
            DataTable dt = new DataTable();
            List<SearchCityBookingReportResultList> SearchCityBookingReportList = new List<SearchCityBookingReportResultList>();
            List<SearchCityBookingReportResultList> SearchCountList = new List<SearchCityBookingReportResultList>();
            List<SearchCityBookingReportResultList> SearchCityBookingFinalReportList = new List<SearchCityBookingReportResultList>();
            try
            {
                if (CompCode == 1)
                {
                    Param.MemberId = new ClientSettings().CheckInboundByMemberId(Param.MemberId, CompCode);
                }
                List<SqlParameters> param = new List<SqlParameters>();
                param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, Param.MemberId, ParameterDirection.Input));
                param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 4, Param.LoginUserId, ParameterDirection.Input));
                param.Add(SqlParameters.Add("@DateFrom", SqlDbType.DateTime, 8, (Param.DateFrom == DateTime.MinValue ? (object)DBNull.Value : Param.DateFrom), ParameterDirection.Input));
                param.Add(SqlParameters.Add("@DateTo", SqlDbType.DateTime, 8, (Param.DateTo == DateTime.MinValue ? (object)DBNull.Value : Param.DateTo), ParameterDirection.Input));
                param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
                param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, Param.BookingdateWise == true ? 1 : 0, ParameterDirection.Input));


             //   dt = SqlManager.ex(CommandType.StoredProcedure, "Usp_Rpt_SearchCityBookingReport", param, DBType.Booking, CompCode);
                SqlDataReader reader = SqlManager.ExecuteReader(CommandType.StoredProcedure, "Usp_Rpt_SearchCityBookingReport", param, DBType.Master, CompCode);

                if(reader.HasRows)
                {
                    while (reader.Read())
                    {
                        SearchCityBookingReportList.Add(new SearchCityBookingReportResultList()
                        {
                            SearchDate = Util.GetDateTime(reader["SearchDate"]).ToString("dd MMM yyyy"),
                            ChkIn = Util.GetDateTime(reader["ChkInDate"]).ToString("dd MMM yyyy"),
                            ChkOut = Util.GetDateTime(reader["ChkOutDate"]).ToString("dd MMM yyyy"),
                            Nts = Util.GetInteger(reader["NoOfNts"]),
                            NRooms = Util.GetInteger(reader["NoOfRooms"]),
                            RoomCng = GetRoomDetails(Util.GetString(reader["RoomConfig"])),
                            HotelName = Util.GetString(reader["HotelName"]),
                            Status = Util.GetString(reader["BStatus"]),
                            AgName = Util.GetString(reader["AgencyName"]),
                            BrName = Util.GetString(reader["BranchName"]),
                            UserName = Util.GetString(reader["UserName"]),
                            City = Util.GetString(reader["CityName"]),
                            CityNo = Util.GetInteger(reader["CityId"]),
                            SearchId = Util.GetString(reader["SearchId"]),
                            TotalValue = Util.GetInteger(0)

                        });
                    }




                    //SearchCountList = new DashboardDAL().GetSearchCityReportSerachCount(Param, CompCode);

                    SearchCountList = (from t in SearchCityBookingReportList
                                       group t by new { t.CityNo } into grp
                                       select new SearchCityBookingReportResultList
                                       {
                                           City = grp.First().City,
                                           CityNo = grp.First().CityNo,
                                           SearchCount = grp.Count(),
                                           BCount = grp.Where(a => a.Status == "Booked").Count(),
                                           Ratio = Util.GetDecimal(grp.Where(a => a.Status == "Booked").Count() / grp.Count() * 100),

                                       }
                         ).ToList();

                    SearchCityBookingReportList = SearchCityBookingReportList.Select(x =>
                    {
                        x.SearchCount = ((SearchCountList.Where(t => t.City == x.City && t.CityNo == x.CityNo).Select(q => q.SearchCount))).FirstOrDefault();
                        x.BCount = ((SearchCountList.Where(t => t.City == x.City && t.CityNo == x.CityNo).Select(q => q.BCount))).FirstOrDefault();
                        x.TotalValue = ((SearchCountList.Where(t => t.City == x.City && t.CityNo == x.CityNo).Select(q => q.BCount))).FirstOrDefault();
                        x.Ratio = Util.GetDecimal(((SearchCountList.Where(t => t.City == x.City && t.CityNo == x.CityNo).Select(
                            q => q.Ratio
                            ))).FirstOrDefault());

                        return x;
                    }).ToList();

                }








            }
            catch (Exception ex)
            {
                Util.ErrorLock(ex.ToString());
            }

            return SearchCityBookingReportList;
        }



        public List<SearchCityBookingReportResultList> GetSearchCityReportSerachCount(SearchCityBookingDO Param, int CompCode)
        {
            DataSet DS = new DataSet();
            DataTable dt = new DataTable();
            List<SearchCityBookingReportResultList> SearchCountList = new List<SearchCityBookingReportResultList>();
            try
            {
                if (CompCode == 1)
                {
                    Param.MemberId = new ClientSettings().CheckInboundByMemberId(Param.MemberId, CompCode);
                }
                List<SqlParameters> param = new List<SqlParameters>();
                param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, Param.MemberId, ParameterDirection.Input));
                param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 4, Param.LoginUserId, ParameterDirection.Input));
                param.Add(SqlParameters.Add("@DateFrom", SqlDbType.DateTime, 8, (Param.DateFrom == DateTime.MinValue ? (object)DBNull.Value : Param.DateFrom), ParameterDirection.Input));
                param.Add(SqlParameters.Add("@DateTo", SqlDbType.DateTime, 8, (Param.DateTo == DateTime.MinValue ? (object)DBNull.Value : Param.DateTo), ParameterDirection.Input));
                param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
                param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, Param.BookingdateWise == true ? 1 : 0, ParameterDirection.Input));


                dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "Usp_Rpt_SearchCityBookingReportGetSerachCount", param, DBType.Booking, CompCode);

                SearchCountList = (from q in dt.AsEnumerable()
                                               select new SearchCityBookingReportResultList
                                               {

                                                 
                                                   City = Util.GetString(q["CityName"]),
                                                   CityNo = Util.GetInteger(q["CityId"]),
                                                   SearchCount = Util.GetInteger(q["SearchCount"]),
                                                   BCount = Util.GetInteger(q["TotalBookingCount"]),
                                                   Ratio = Util.GetDecimal(q["Ratio"]),




                                               }).ToList();
            } 

             catch (Exception ex)
            {
                Util.ErrorLock(ex.ToString());
            }

            return SearchCountList;
        }


        public string GetRoomDetails(string RoomCng)
        {
            //3_0-3_0-3_0
            string roomdetails = string.Empty;
            int totalAd = 0;
            int totalCh = 0;
            string[] RoomList = RoomCng.Split(new string[] { "-" }, StringSplitOptions.None).ToArray();

            
            for(int i = 0;i < RoomList.Count(); i++)
            {
                totalAd = +Convert.ToInt32(RoomList[i].Split('_')[0]);
                totalCh = +Convert.ToInt32(RoomList[i].Split('_')[1]);
            }

            if(totalCh > 0)
            {
                roomdetails = totalAd + "AD " + totalCh + " CH ";
            }
            else
            {
                roomdetails = totalAd + "AD " ;
            }
            

            return roomdetails;
        }
        #endregion


        #region Serach Agent Booking Report

        public List<SearchAgentBookingReportResultList> GetSearchAgentBookingReport(SearchAgentBookingDO Param, int CompCode,int  LoginMemberTypeId)
        {
            DataSet DS = new DataSet();
            DataTable dt = new DataTable();
            List<SearchAgentBookingReportResultList> SearchAgentBookingReportList = new List<SearchAgentBookingReportResultList>();
            List<SearchAgentBookingReportResultList> SearchCountList = new List<SearchAgentBookingReportResultList>();
            try
            {
                if (CompCode == 1)
                {
                    Param.MemberId = new ClientSettings().CheckInboundByMemberId(Param.MemberId, CompCode);
                }
                List<SqlParameters> param = new List<SqlParameters>();
                param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, Param.MemberId, ParameterDirection.Input));
                param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 4, Param.LoginUserId, ParameterDirection.Input));
                param.Add(SqlParameters.Add("@DateFrom", SqlDbType.DateTime, 8, (Param.DateFrom == DateTime.MinValue ? (object)DBNull.Value : Param.DateFrom), ParameterDirection.Input));
                param.Add(SqlParameters.Add("@DateTo", SqlDbType.DateTime, 8, (Param.DateTo == DateTime.MinValue ? (object)DBNull.Value : Param.DateTo), ParameterDirection.Input));
                param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
                param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, Param.BookingdateWise == true ? 1 : 0, ParameterDirection.Input));


                //dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "Usp_Rpt_SearchAgentBookingReport", param, DBType.Booking, CompCode);
                SqlDataReader reader = SqlManager.ExecuteReader(CommandType.StoredProcedure, "Usp_Rpt_SearchAgentBookingReport", param, DBType.Master, CompCode);

                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        SearchAgentBookingReportList.Add(new SearchAgentBookingReportResultList()
                        {
                            SearchDate = Util.GetDateTime(reader["SearchDate"]).ToString("dd MMM yyyy"),
                            ChkIn = Util.GetDateTime(reader["ChkInDate"]).ToString("dd MMM yyyy"),
                            ChkOut = Util.GetDateTime(reader["ChkOutDate"]).ToString("dd MMM yyyy"),
                            Nts = Util.GetInteger(reader["NoOfNts"]),
                            NRooms = Util.GetInteger(reader["NoOfRooms"]),
                            RoomCng = GetRoomDetails(Util.GetString(reader["RoomConfig"])),
                            HotelName = Util.GetString(reader["HotelName"]),
                            Status = Util.GetString(reader["BStatus"]),
                            BrName = Util.GetString(reader["BranchName"]),
                            City = Util.GetString(reader["CityName"]),
                            AgId = Util.GetInteger(reader["AgId"]),
                            UserName =  Util.GetString(reader["UserName"]),
                            AgName = GetAgencyName(reader,  CompCode, LoginMemberTypeId),
                            SearchId = Util.GetString(reader["SearchId"]),
                            TotalValue = Util.GetInteger(0),
                            
                        });
                    }





                    //  SearchCountList = new DashboardDAL().GetSearchAgentReportSerachCount(Param, CompCode);


                    SearchCountList = (from t in SearchAgentBookingReportList
                                       group t by new { t.AgId } into grp
                                       select new SearchAgentBookingReportResultList
                                       {
                                           AgName = grp.First().AgName,
                                           AgId = grp.First().AgId,
                                           SearchCount = grp.Count(),
                                           BCount = grp.Where(a => a.Status == "Booked").Count(),
                                           Ratio = Util.GetDecimal(grp.Where(a => a.Status == "Booked").Count() / grp.Count() * 100),




                                       }
                        ).ToList();


                    SearchAgentBookingReportList = SearchAgentBookingReportList.Select(x =>
                    {
                        x.SearchCount = ((SearchCountList.Where(t => t.AgName == x.AgName && t.AgId == x.AgId).Select(q => q.SearchCount))).FirstOrDefault();
                        x.BCount = ((SearchCountList.Where(t => t.AgName == x.AgName && t.AgId == x.AgId).Select(q => q.BCount))).FirstOrDefault();
                        x.TotalValue = ((SearchCountList.Where(t => t.AgName == x.AgName && t.AgId == x.AgId).Select(q => q.BCount))).FirstOrDefault();
                        x.Ratio = Util.GetDecimal(((SearchCountList.Where(t => t.AgName == x.AgName && t.AgId == x.AgId).Select(
                            q => q.Ratio
                            ))).FirstOrDefault());

                        return x;
                    }).ToList();

                }
            }
            catch (Exception ex)
            {
                Util.ErrorLock(ex.ToString());
            }

            return SearchAgentBookingReportList;
        }

        public List<SearchAgentBookingReportResultList> GetSearchToBookingReport(SearchAgentBookingDO Param, int CompCode, int LoginMemberTypeId)
        {
            DataSet DS = new DataSet();
            DataTable dt = new DataTable();
            List<SearchAgentBookingReportResultList> SearchAgentBookingReportList = new List<SearchAgentBookingReportResultList>();
            List<SearchAgentBookingReportResultList> SearchCountList = new List<SearchAgentBookingReportResultList>();
            try
            {
                if (CompCode == 1)
                {
                    Param.MemberId = new ClientSettings().CheckInboundByMemberId(Param.MemberId, CompCode);
                }
                List<SqlParameters> param = new List<SqlParameters>();
                param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, Param.MemberId, ParameterDirection.Input));
                param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 4, Param.LoginUserId, ParameterDirection.Input));
                param.Add(SqlParameters.Add("@DateFrom", SqlDbType.DateTime, 8, (Param.DateFrom == DateTime.MinValue ? (object)DBNull.Value : Param.DateFrom), ParameterDirection.Input));
                param.Add(SqlParameters.Add("@DateTo", SqlDbType.DateTime, 8, (Param.DateTo == DateTime.MinValue ? (object)DBNull.Value : Param.DateTo), ParameterDirection.Input));
                param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
                param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, Param.BookingdateWise == true ? 1 : 0, ParameterDirection.Input));

                SqlDataReader reader = SqlManager.ExecuteReader(CommandType.StoredProcedure, "Usp_Rpt_SearchToBookReport", param, DBType.Master, CompCode);

                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        //int searchCount = Util.GetInteger(reader["SearchCounts"]);
                        //int bookCount = Util.GetInteger(reader["BookCounts"]);

                        //// Avoid DivideByZero exception
                        //double ratio = searchCount == 0 ? 0 : Math.Round((bookCount / (double)searchCount) * 100, 2);

                        SearchAgentBookingReportList.Add(new SearchAgentBookingReportResultList
                        {
                            AgId = Util.GetInteger(reader["AgId"]),
                            AgName = Util.GetString(reader["AgencyName"]),
                            BrName = Util.GetString(reader["BranchName"]),
                            City = Util.GetString(reader["Destination"]),
                            SearchCount = Util.GetInteger(reader["SearchCounts"]),
                            BCount = Util.GetInteger(reader["BookCounts"]),
                            Ratio = (decimal) (Util.GetInteger(reader["SearchCounts"]) == 0 ? 0 : Math.Round((Util.GetInteger(reader["BookCounts"]) / (double)Util.GetInteger(reader["SearchCounts"])) * 100, 2))
                        });
                    }


                }
            }
            catch (Exception ex)
            {
                Util.ErrorLock(ex.ToString());
            }

            return SearchAgentBookingReportList;
        }


        public List<SearchAgentBookingReportResultList> GetSearchAgentReportSerachCount(SearchAgentBookingDO Param, int CompCode)
        {
            DataSet DS = new DataSet();
            DataTable dt = new DataTable();
            List<SearchAgentBookingReportResultList> SearchCountList = new List<SearchAgentBookingReportResultList>();
            try
            {
                if (CompCode == 1)
                {
                    Param.MemberId = new ClientSettings().CheckInboundByMemberId(Param.MemberId, CompCode);
                }
                List<SqlParameters> param = new List<SqlParameters>();
                param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, Param.MemberId, ParameterDirection.Input));
                param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 4, Param.LoginUserId, ParameterDirection.Input));
                param.Add(SqlParameters.Add("@DateFrom", SqlDbType.DateTime, 8, (Param.DateFrom == DateTime.MinValue ? (object)DBNull.Value : Param.DateFrom), ParameterDirection.Input));
                param.Add(SqlParameters.Add("@DateTo", SqlDbType.DateTime, 8, (Param.DateTo == DateTime.MinValue ? (object)DBNull.Value : Param.DateTo), ParameterDirection.Input));
                param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
                param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, Param.BookingdateWise == true ? 1 : 0, ParameterDirection.Input));


                dt = SqlManager.ExecuteDataTable(CommandType.StoredProcedure, "Usp_Rpt_SearchAgentBookingReportGetSerachCount", param, DBType.Booking, CompCode);

                SearchCountList = (from q in dt.AsEnumerable()
                                   select new SearchAgentBookingReportResultList
                                   {


                                       AgName = Util.GetString(q["CompanyName"]),
                                       AgId = Util.GetInteger(q["AgId"]),
                                       SearchCount = Util.GetInteger(q["SearchCount"]),
                                       Ratio = Util.GetDecimal(q["Ratio"]),
                                       BCount = Util.GetInteger(q["TotalBookingCount"]),




                                   }).ToList();
            }

            catch (Exception ex)
            {
                Util.ErrorLock(ex.ToString());
            }

            return SearchCountList;
        }

        public string GetAgencyName(SqlDataReader reader,int CompCode,int LoginMemberTypeId)
        {
            string AgName = string.Empty;

            if(CompCode == 1)
            {
                AgName = Util.GetString(reader["AgencyName"]) + ", " + Util.GetString(reader["AgCityName"]) + (LoginMemberTypeId == 1 ? (" (BrName: " + Util.GetString(reader["BranchName"]) + " )") : "");
            }
            else
            {

                AgName = Util.GetString(reader["AgencyName"]) + ", " + Util.GetString(reader["AgCityName"]) + (LoginMemberTypeId == 1 ? (" (BrName: " + Util.GetString(reader["BranchName"]) + " )") : "");

                if ( !string.IsNullOrEmpty(Util.GetString(reader["SalesPerson"])))
                {
                    AgName += " " + (LoginMemberTypeId == 1 ? (" (Sales Person: " + Util.GetString(reader["SalesPerson"]) + " )") : "");
                }
               
            }


            return AgName;
        }

        #endregion

    }
}
