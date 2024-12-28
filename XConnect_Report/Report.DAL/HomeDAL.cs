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
    public class HomeDAL
    {
        #region DashBoard-Home
        public BookingCountListDO GetDashBoardDetails(int CompCode, int MemberId,  HomeSearchDO SearchDO, MemberTypes LoginMemberType,int UserID)
        {

            BookingCountListDO BookCountDO = new BookingCountListDO();
            List<SqlParameters> param = new List<SqlParameters>();

            string Today = Convert.ToDateTime(SearchDO.DashboardDate).ToString("MM/dd/yyyy");

            SearchDO.Currency = string.IsNullOrEmpty(SearchDO.Currency) ? "INR" : SearchDO.Currency;

            int SearchMemberId = 0;

            if ((LoginMemberType == MemberTypes.HeadQuarter))
            {
                SearchMemberId = SearchDO.BranchId;
            }
            else
            {
                SearchMemberId = MemberId;
            }

            param.Add(SqlParameters.Add("@CompCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@SearchMemberId", SqlDbType.Int, 4, SearchMemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, SearchDO.IsBookingdateWise == true ? 1 : 0, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@Date", SqlDbType.DateTime, 5, Today, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginMemberId", SqlDbType.Int, 4, MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 8, UserID, ParameterDirection.Input));

            SqlDataReader reader = SqlManager.ExecuteReader(CommandType.StoredProcedure, "Usp_Rpt_GetHomeDetails_DS", param, DBType.Booking, CompCode);

            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    //BookCountDO.Add(new BookingCountListDO()
                    switch(Util.GetString(reader["GrpStatus"]))
                    {

                        case "Confirmed":
                            BookCountDO.Confirmed = Util.GetInteger(reader["BookingCount"]);
                            break;
                        case "ReConfirmed":
                            BookCountDO.Reconfirmed = Util.GetInteger(reader["BookingCount"]);
                            break;
                        case "Cancelled":
                            BookCountDO.Cancelled = Util.GetInteger(reader["BookingCount"]);
                            break;
                        case "Failed":
                            BookCountDO.Failed = Util.GetInteger(reader["BookingCount"]);
                            break;
                        case "Requested":
                            BookCountDO.Requested = Util.GetInteger(reader["BookingCount"]);
                            break;


                    }
                }
            }
            reader.Close();
            return BookCountDO;
        }

        public List<TopBranchListDO> GetDashBoardTopBranch(int CompCode, int MemberId, HomeSearchDO SearchDO, MemberTypes LoginMemberType,int UserId)
        {
            List<SqlParameters> param = new List<SqlParameters>();

            List<TopBranchListDO> TopBranchList = new List<TopBranchListDO>();

            string Today = Convert.ToDateTime(SearchDO.DashboardDate).ToString("MM/dd/yyyy");

            SearchDO.Currency = string.IsNullOrEmpty(SearchDO.Currency) ? "INR" : SearchDO.Currency;

            int SearchMemberId = 0;

            if ((LoginMemberType == MemberTypes.HeadQuarter))
            {
                SearchMemberId = SearchDO.BranchId;
            }
            else
            {
                SearchMemberId = MemberId;
            }

            param.Add(SqlParameters.Add("@CompCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@SearchMemberId", SqlDbType.Int, 4, SearchMemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, SearchDO.IsBookingdateWise == true ? 1 : 0, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@Date", SqlDbType.DateTime, 5, Today, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginMemberId", SqlDbType.Int, 4, MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@Currency", SqlDbType.VarChar, 10, SearchDO.Currency, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@InTerms", SqlDbType.Int, 4, SearchDO.InTerms, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 8, UserId, ParameterDirection.Input));



            SqlDataReader reader = SqlManager.ExecuteReader(CommandType.StoredProcedure, "Usp_Rpt_GetTopBranchListDS", param, DBType.Booking, CompCode);


            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    if (SearchDO.InTerms == 1)
                    {
                        TopBranchList.Add(new TopBranchListDO()
                        {

                            BranchName = Util.ToTitleCase(Util.GetString(reader["cCompanyName"])),
                            City = Util.GetString(reader["CityName"]),
                            BookingCount = Util.GetInteger(reader["Value"]),

                        });
                    }
                    else if (SearchDO.InTerms == 2)
                    {
                        TopBranchList.Add(new TopBranchListDO()
                        {

                            BranchName = Util.ToTitleCase(Util.GetString(reader["cCompanyName"])),
                            City = Util.GetString(reader["CityName"]),
                            TotalSelling = Util.GetInteger(reader["Value"]),

                        });
                    }
                }
            }

            return TopBranchList;
        }

        public List<TopAgencyListDO> GetDashBoardTopAgency(int CompCode, int MemberId, HomeSearchDO SearchDO,MemberTypes LoginMemberType,int UserID)
        {
            List<SqlParameters> param = new List<SqlParameters>();

            List<TopAgencyListDO> TopAgencyList = new List<TopAgencyListDO>();

            string Today = Convert.ToDateTime(SearchDO.DashboardDate).ToString("MM/dd/yyyy");

            SearchDO.Currency = string.IsNullOrEmpty(SearchDO.Currency) ? "INR" : SearchDO.Currency;

            int SearchMemberId = 0;

            if ((LoginMemberType == MemberTypes.HeadQuarter))
            {
                SearchMemberId = SearchDO.BranchId;
            }
            else
            {
                SearchMemberId = MemberId;
            }

            param.Add(SqlParameters.Add("@CompCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@SearchMemberId", SqlDbType.Int, 4, SearchMemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, SearchDO.IsBookingdateWise == true ? 1 : 0, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@Date", SqlDbType.DateTime, 5, Today, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginMemberId", SqlDbType.Int, 4, MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@Currency", SqlDbType.VarChar, 10, SearchDO.Currency, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@InTerms", SqlDbType.Int, 4, SearchDO.InTerms, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 8, UserID, ParameterDirection.Input));


            SqlDataReader reader = SqlManager.ExecuteReader(CommandType.StoredProcedure, "Usp_Rpt_GetTopAgencyListDS", param, DBType.Booking, CompCode);
            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    if (SearchDO.InTerms == 1)
                    {
                        TopAgencyList.Add(new TopAgencyListDO()
                        {

                            AgencyName = Util.ToTitleCase(Util.GetString(reader["cCompanyName"])),
                            AgCity = Util.GetString(reader["CityName"]),
                            BookingCount = Util.GetInteger(reader["Value"]),

                        });
                    }
                    else if (SearchDO.InTerms == 2)
                    {
                        TopAgencyList.Add(new TopAgencyListDO()
                        {

                            AgencyName = Util.ToTitleCase(Util.GetString(reader["cCompanyName"])),
                            AgCity = Util.GetString(reader["CityName"]),
                            TotalSelling = Util.GetInteger(reader["Value"]),

                        });
                    }
                }
            }

            return TopAgencyList;


        }

        public List<TopSupplierListDO> GetDashBoardTopSupplier(int CompCode, int MemberId,  HomeSearchDO SearchDO, MemberTypes LoginMemberType,int UserID)
        {
            List<SqlParameters> param = new List<SqlParameters>();

            List<TopSupplierListDO> TopSupplierList = new List<TopSupplierListDO>();

            string Today = Convert.ToDateTime(SearchDO.DashboardDate).ToString("MM/dd/yyyy");

            SearchDO.Currency = string.IsNullOrEmpty(SearchDO.Currency) ? "INR" : SearchDO.Currency;

            int SearchMemberId = 0;

            if ((LoginMemberType == MemberTypes.HeadQuarter))
            {
                SearchMemberId = SearchDO.BranchId;
            }
            else
            {
                SearchMemberId = MemberId;
            }

            param.Add(SqlParameters.Add("@CompCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@SearchMemberId", SqlDbType.Int, 4, SearchMemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, SearchDO.IsBookingdateWise == true ? 1 : 0, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@Date", SqlDbType.DateTime, 5, Today, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginMemberId", SqlDbType.Int, 4, MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@Currency", SqlDbType.VarChar, 10, SearchDO.Currency, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@InTerms", SqlDbType.Int, 4, SearchDO.InTerms, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserID", SqlDbType.Int, 8, UserID, ParameterDirection.Input));

            SqlDataReader reader = SqlManager.ExecuteReader(CommandType.StoredProcedure, "Usp_Rpt_GetTopSupplierListDS", param, DBType.Booking, CompCode);

            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    if (SearchDO.InTerms == 1)
                    {
                        TopSupplierList.Add(new TopSupplierListDO()
                        {

                            SupplierName = Util.ToTitleCase(Util.GetString(reader["SupplierName"])),
                            BookingCount = Util.GetInteger(reader["Value"]),

                        });
                    }
                    else if (SearchDO.InTerms == 2)
                    {
                        TopSupplierList.Add(new TopSupplierListDO()
                        {

                            SupplierName = Util.ToTitleCase(Util.GetString(reader["SupplierName"])),
                            TotalSelling = Util.GetInteger(reader["Value"]),

                        });
                    }
                }
            }

            return TopSupplierList;
        }


        public List<FailedSupplierListDO> GetDashBoardFailedSupplier(int CompCode, int MemberId,  HomeSearchDO SearchDO, MemberTypes LoginMemberType,int UserId)
        {
            List<SqlParameters> param = new List<SqlParameters>();

            List<FailedSupplierListDO> FailedSuppList = new List<FailedSupplierListDO>();

            string Today = Convert.ToDateTime(SearchDO.DashboardDate).ToString("MM/dd/yyyy");


            SearchDO.Currency = string.IsNullOrEmpty(SearchDO.Currency) ? "INR" : SearchDO.Currency;


            int SearchMemberId = 0;

            if ((LoginMemberType == MemberTypes.HeadQuarter))
            {
                SearchMemberId = SearchDO.BranchId;
            }
            else
            {
                SearchMemberId = MemberId;
            }

            param.Add(SqlParameters.Add("@CompCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@SearchMemberId", SqlDbType.Int, 4, SearchMemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, SearchDO.IsBookingdateWise == true ? 1 : 0, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@Date", SqlDbType.DateTime, 5, Today, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginMemberId", SqlDbType.Int, 4, MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 8, UserId, ParameterDirection.Input));

            SqlDataReader reader = SqlManager.ExecuteReader(CommandType.StoredProcedure, "Usp_Rpt_GetTopSuppFaliedBookingListDS", param, DBType.Booking, CompCode);

            while (reader.Read())
            {

                FailedSuppList.Add(new FailedSupplierListDO()
                    {

                        SupplierName = Util.ToTitleCase(Util.GetString(reader["SupplierName"])),
                        BookingCount = Util.GetInteger(reader["Value"]),

                    });
                
              
            }

            FailedSuppList= FailedSuppList.Take(5).ToList();

            return FailedSuppList;
        }


        public List<AgActiveListDO> GetDashBoardAgActive(int CompCode, int MemberId, HomeSearchDO SearchDO, MemberTypes LoginMemberType, int UserId)
        {
            List<SqlParameters> param = new List<SqlParameters>();

            List<AgActiveListDO> AgActiveList = new List<AgActiveListDO>();

            string Today = Convert.ToDateTime(SearchDO.DashboardDate).ToString("MM/dd/yyyy");


          


            int SearchMemberId = 0;

            if ((LoginMemberType == MemberTypes.HeadQuarter))
            {
                SearchMemberId = SearchDO.BranchId;
            }
            else
            {
                SearchMemberId = MemberId;
            }

            param.Add(SqlParameters.Add("@CompCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@SearchMemberId", SqlDbType.Int, 4, SearchMemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, SearchDO.IsBookingdateWise == true ? 1 : 0, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@Date", SqlDbType.DateTime, 5, Today, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginMemberId", SqlDbType.Int, 4, MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 8, UserId, ParameterDirection.Input));

            SqlDataReader reader = SqlManager.ExecuteReader(CommandType.StoredProcedure, "Usp_Rpt_GetTopAgActiveListDS", param, DBType.Booking, CompCode);

            while (reader.Read())
            {

                AgActiveList.Add(new AgActiveListDO()
                {

                    AgName = Util.ToTitleCase(Util.GetString(reader["CompanyName"])),
                    City = Util.ToTitleCase(Util.GetString(reader["City"])),
                    Country = Util.ToTitleCase(Util.GetString(reader["Country"])),
                    Email = Util.ToTitleCase(Util.GetString(reader["Email"])),
                    Bookings = Util.GetInteger(reader["TotalBookingCount"]),
                    Reconfirmed = Util.GetInteger(reader["TotalRRCount"]),
                    Cancelled = Util.GetInteger(reader["TotalXXWithChargeCount"]),
                    RRPer = Util.GetDecimal(reader["Vouchered_Per"]) == -1 ? 0: Util.GetDecimal(reader["Vouchered_Per"]),
                    XXPer = Util.GetDecimal(reader["XXL_Per"]) == -1 ? 0 : Util.GetDecimal(reader["XXL_Per"]),
                }); 


            }

            AgActiveList = AgActiveList.Take(5).ToList();

            return AgActiveList;
        }

      
        public List<SerachBookByCityListDO> GetDashBoardTopSearchBook(int CompCode, int MemberId, HomeSearchDO SearchDO, MemberTypes LoginMemberType)
        {
            List<SqlParameters> param = new List<SqlParameters>();

            List<SerachBookByCityListDO> TopSearchBookList = new List<SerachBookByCityListDO>();

            string Today = Convert.ToDateTime(SearchDO.DashboardDate).ToString("MM/dd/yyyy");


            SearchDO.Currency = string.IsNullOrEmpty(SearchDO.Currency) ? "INR" : SearchDO.Currency;


            int SearchMemberId = 0;

            if ((LoginMemberType == MemberTypes.HeadQuarter))
            {
                SearchMemberId = SearchDO.BranchId;
            }
            else
            {
                SearchMemberId = MemberId;
            }

            param.Add(SqlParameters.Add("@CompCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@SearchMemberId", SqlDbType.Int, 4, SearchMemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, SearchDO.IsBookingdateWise == true ? 1 : 0, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@Date", SqlDbType.DateTime, 5, Today, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginMemberId", SqlDbType.Int, 4, MemberId, ParameterDirection.Input));


            SqlDataReader reader = SqlManager.ExecuteReader(CommandType.StoredProcedure, "Usp_Rpt_GetTopSearchCityBookingListDS", param, DBType.Booking, CompCode);


            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    TopSearchBookList.Add(new SerachBookByCityListDO()
                    {

                        CityName = Util.GetString(reader["CityName"]),
                        BookingCount = Util.GetInteger(reader["TotalBookingCount"]),
                        SearchCount = Util.GetInteger(reader["SearchCount"]),
                        Ratio = Util.GetDecimal(reader["Ratio"]),
                    });
                }
            }


            TopSearchBookList= TopSearchBookList.Take(5).ToList();

            return TopSearchBookList;
        }


        public List<ServiceBookingListDO> GetDashBoardBookingByService(int CompCode, int MemberId,  HomeSearchDO SearchDO, MemberTypes LoginMemberType,int UserId)
        {
            List<SqlParameters> param = new List<SqlParameters>();
            List<ServiceBookingListDO> BookingList = new List<ServiceBookingListDO>();

            string Today = Convert.ToDateTime(SearchDO.DashboardDate).ToString("MM/dd/yyyy");

            SearchDO.Currency = string.IsNullOrEmpty(SearchDO.Currency) ? "INR" : SearchDO.Currency;

            int SearchMemberId = 0;

            if ((LoginMemberType == MemberTypes.HeadQuarter))
            {
                SearchMemberId = SearchDO.BranchId;
            }
            else
            {
                SearchMemberId = MemberId;
            }

            param.Add(SqlParameters.Add("@CompCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@SearchMemberId", SqlDbType.Int, 4, SearchMemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, SearchDO.IsBookingdateWise == true ? 1 : 0, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@Date", SqlDbType.DateTime, 5, Today, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginMemberId", SqlDbType.Int, 4, MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 8, UserId, ParameterDirection.Input));
            SqlDataReader reader = SqlManager.ExecuteReader(CommandType.StoredProcedure, "Usp_Rpt_GetServiceBookingListDS_V2", param, DBType.Booking, CompCode);

            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    BookingList.Add(new ServiceBookingListDO()
                    {

                        Service = (Util.GetString(reader["ServiceName"])),
                                            OnlineDirect = Util.GetInteger(reader["Online-Direct"]),
                                            OnlinePosted = Util.GetInteger(reader["Online-Posted"]),
                                            OfflineDirect = Util.GetInteger(reader["Offline-Direct"]),
                                            OfflinePosted = Util.GetInteger(reader["Offline-Posted"]),
                                            Total = Util.GetInteger(reader["Total"]),
                                            IsAppService = Util.GetBoolean(reader["IsAppServices"]),
                    });
                }
            }
            List<ServiceBookingListDO> NewBookingList = new List<ServiceBookingListDO>();
            NewBookingList = (from q in BookingList
                              where q.IsAppService == true
                              select new ServiceBookingListDO
                              {
                                  Service = Util.GetString(q.Service),
                                  OnlineDirect = Util.GetInteger(q.OnlineDirect),
                                  OnlinePosted = Util.GetInteger(q.OnlinePosted),
                                  OfflineDirect = Util.GetInteger(q.OfflineDirect),
                                  OfflinePosted = Util.GetInteger(q.OfflinePosted),
                                  Total = Util.GetInteger(q.Total),
                                  IsAppService = Util.GetBoolean(q.IsAppService),
                              }).ToList();

            return NewBookingList;
        }



        public List<SerachBookByAgencyListDO> GetDashBoardTopSearchBookByAgency(int CompCode, int MemberId, HomeSearchDO SearchDO, MemberTypes LoginMemberType)
        {
            List<SqlParameters> param = new List<SqlParameters>();

            string Today = Convert.ToDateTime(SearchDO.DashboardDate).ToString("MM/dd/yyyy");
            List<SerachBookByAgencyListDO> TopSearchBookByMember = new List<SerachBookByAgencyListDO>();

            SearchDO.Currency = string.IsNullOrEmpty(SearchDO.Currency) ? "INR" : SearchDO.Currency;


            int SearchMemberId = 0;

            if ((LoginMemberType == MemberTypes.HeadQuarter))
            {
                SearchMemberId = SearchDO.BranchId;
            }
            else
            {
                SearchMemberId = MemberId;
            }

            param.Add(SqlParameters.Add("@CompCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@SearchMemberId", SqlDbType.Int, 4, SearchMemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, SearchDO.IsBookingdateWise == true ? 1 : 0, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@Date", SqlDbType.DateTime, 5, Today, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginMemberId", SqlDbType.Int, 4, MemberId, ParameterDirection.Input));

            SqlDataReader reader = SqlManager.ExecuteReader(CommandType.StoredProcedure, "Usp_Rpt_GetTopAgencySearchCityBookingListDS", param, DBType.Booking, CompCode);

            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    TopSearchBookByMember.Add(new SerachBookByAgencyListDO()
                    {

                        AgencyName = Util.ToTitleCase(Util.GetString(reader["CompanyName"])),
                        AgCityName = Util.ToTitleCase(Util.GetString(reader["AgCityName"])),
                        BookingCount = Util.GetInteger(reader["TotalBookingCount"]),
                        SearchCount = Util.GetInteger(reader["SearchCount"]),
                        Ratio = Util.GetDecimal(reader["Ratio"]),
                    });
                }
            }


            TopSearchBookByMember = TopSearchBookByMember.Take(5).ToList();

            return TopSearchBookByMember;
        }

        public DataSet GetDashBoardBlockedSupplier(int CompCode, int MemberId,  HomeSearchDO SearchDO)
        {
            List<SqlParameters> param = new List<SqlParameters>();
            List<BlockedSupplierListDO> BlockedSupplier = new List<BlockedSupplierListDO>();


            string Today = Convert.ToDateTime(SearchDO.DashboardDate).ToString("yyyy");
            //Today = "2019-05-07";
            SearchDO.Currency = string.IsNullOrEmpty(SearchDO.Currency) ? "INR" : SearchDO.Currency;


            param.Add(SqlParameters.Add("@CompCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, (SearchDO.BranchId == 0 ? MemberId : SearchDO.BranchId), ParameterDirection.Input));
           
            param.Add(SqlParameters.Add("@IsBookDateWise", SqlDbType.Bit, 5, SearchDO.IsBookingdateWise == true ? 1 : 0, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@Date", SqlDbType.DateTime, 5, Today, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@Currency", SqlDbType.VarChar, 10, SearchDO.Currency, ParameterDirection.Input));


            return SqlManager.ExecuteDataSet(CommandType.StoredProcedure, "", param, DBType.Booking, CompCode);
        }

        public List<BookingByYearList> GetYearlyBookingList(int CompCode, int MemberId, int UserId, MemberTypes MemberTypeId, HomeSearchDO SearchDO)
        {
            DataSet DS = new DataSet();
            List<BookingByYearList> BookingList = new List<BookingByYearList>();
            List<SqlParameters> param = new List<SqlParameters>();

            if (CompCode == 1)
            {
                MemberId = new ClientSettings().CheckInboundByMemberId(MemberId, CompCode);
            }
            param.Add(SqlParameters.Add("@CompCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, (SearchDO.BranchId == 0 ? MemberId : SearchDO.BranchId), ParameterDirection.Input));
            param.Add(SqlParameters.Add("@UserId", SqlDbType.Int, 4, UserId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@MemberType", SqlDbType.Int, 4, MemberTypeId, ParameterDirection.Input));

            DS = SqlManager.ExecuteDataSet(CommandType.StoredProcedure, "Usp_Rpt_GetBookingByYearly", param, DBType.Booking, CompCode);


            DataTable dt = new DataTable();
            dt = DS.Tables[0];
            try
            {
                if (dt.Rows.Count > 0)
                {
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        BookingByYearList Booking = new BookingByYearList();
                        Booking.BookingYear = Util.GetString(dt.Rows[i]["BookingYear"]);
                        Booking.BookingMonth = Util.GetString(dt.Rows[i]["BookingMonth"]);
                        Booking.BookingCount = Util.GetInteger(dt.Rows[i]["BookingCount"]);
                        Booking.MonthNo = Util.GetInteger(dt.Rows[i]["MonthNo"]);


                        BookingList.Add(Booking);
                    }
                }
            }

            catch (Exception ex)
            {

            }
            return BookingList;
        }

        public List<Dictionary<string, object>> GetAgencyApiOutData(int CompCode, int MemberId, HomeSearchDO SearchDO, MemberTypes LoginMemberType, int UserId)
        {
            List<Dictionary<string, object>> results = new List<Dictionary<string, object>>();
            List<SqlParameters> param = new List<SqlParameters>();


            string Today = Convert.ToDateTime(SearchDO.DashboardDate).ToString("MM/dd/yyyy");

            int SearchMemberId = 0;

            if ((LoginMemberType == MemberTypes.HeadQuarter))
            {
                SearchMemberId = SearchDO.BranchId;
            }
            else
            {
                SearchMemberId = MemberId;
            }


            param.Add(SqlParameters.Add("@SearchMemberId", SqlDbType.Int, 4, SearchMemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginUserId", SqlDbType.Int, 4, UserId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@FromDate", SqlDbType.DateTime, 8, Today, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@ToDate", SqlDbType.DateTime, 8, Today, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CompCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@Count", SqlDbType.Int, 4, 5, ParameterDirection.Input));


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

        #endregion
    }
}
