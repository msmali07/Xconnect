using Report.DO;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Report.DAL
{
    public class CommonDataDAL
    {
        #region Get Post Booking Memberdetails
        public List<PostBookingDO> FindMemberDetails(int MemberTypeId, int MemberId, int CompCode,int UserID)
        {

            List<SqlParameters> param = new List<SqlParameters>();
            param.Add(SqlParameters.Add("@MemberType", SqlDbType.Int, 4, MemberTypeId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, MemberId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@UserID", SqlDbType.Int, 8, UserID, ParameterDirection.Input));
            using (SqlDataReader reader = SqlManager.ExecuteReader(CommandType.StoredProcedure, "Usp_Rpt_PostBooking", param, DBType.Master, CompCode))
            {
                return GetPostBookingDetail(reader);
            }
        }

        private List<PostBookingDO> GetPostBookingDetail(SqlDataReader reader)
        {
            List<PostBookingDO> postBooking = new List<PostBookingDO>();
            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    postBooking.Add(new PostBookingDO()
                    {
                        memberid = Util.GetInteger(reader["nmemberid"]),
                        MemberTypeId = Util.GetInteger(reader["nmembertypeid"]),
                        CompanyName = Util.ToTitleCase(Util.GetString(reader["ccompanyname"])),
                        DirectClient = Util.GetBoolean(reader["bDirectClient"]),
                        //DisplayBranchCode = Util.GetString(reader["cDisplayBranchcode"]),
                        //Email = Util.GetString(reader["cEMail"]),
                    }
                   );
                }
            }
            reader.Close();
            return postBooking;
        }



        public List<PostBookingDO> GetUserDetails(int memberid, int CompCode)
        {
            List<SqlParameters> param = new List<SqlParameters>();
            param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, memberid, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            using (SqlDataReader reader = SqlManager.ExecuteReader(CommandType.StoredProcedure, "Usp_Rpt_GetUserByMemberId", param, DBType.Master, CompCode))
            {
                return GetUserDetail(reader);
            }
        }

        private List<PostBookingDO> GetUserDetail(SqlDataReader reader)
        {
            List<PostBookingDO> postBooking = new List<PostBookingDO>();
            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    postBooking.Add(new PostBookingDO()
                    {
                        UserId = Util.GetInteger(reader["UserId"]),
                        UserName = Util.ToTitleCase(Util.GetString(reader["UserName"])),


                    }
                   );
                }
            }
            reader.Close();
            return postBooking;
        }


        #endregion

        #region GetSupplierList
        public List<SupplierDO> GetSupplierList(int CompCode)
        {
            List<SupplierDO> Sup = new List<SupplierDO>();

            List<SqlParameters> param = new List<SqlParameters>();

            param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            using (SqlDataReader reader = SqlManager.ExecuteReader(CommandType.StoredProcedure, "Usp_Rpt_GetSupplier", param, DBType.Master, CompCode))
            {
                Sup = BuildSupplier(reader);
                reader.Close();
            }
            return Sup;
        }


        private List<SupplierDO> BuildSupplier(SqlDataReader reader)
        {
            List<SupplierDO> Sup = new List<SupplierDO>();

            if (reader.HasRows)
            {
                while (reader.Read())
                    Sup.Add(new SupplierDO()
                    {
                        SId = Util.GetInteger(reader["SupplierId"]),
                        SName = Util.GetString(reader["CompanyName"]),
                        Type = !string.IsNullOrEmpty(reader["SupplierType"].ToString()) ? Util.GetInteger(reader["SupplierType"]) : 0,

                    });
            }
            reader.Close();
            return Sup;

        }
        #endregion


        #region GetCurrencyDetails
        public List<CurrencyDO> GetCurrencyDetails(int CompCode,int MemberId)
        {
            List<SqlParameters> param = new List<SqlParameters>();
            param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@Memberid", SqlDbType.Int, 4, MemberId, ParameterDirection.Input));
            using (SqlDataReader reader = SqlManager.ExecuteReader(CommandType.StoredProcedure, "Usp_Rpt_GetCurrency", param, DBType.Master, CompCode))
            {
                return BuildCurrencyDetails(reader);
            };
        }


        private List<CurrencyDO> BuildCurrencyDetails(SqlDataReader reader)
        {
            List<CurrencyDO> objCurrencyDO = new List<CurrencyDO>();
            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    objCurrencyDO.Add(new CurrencyDO()
                    {

                        CurrencyCode = Util.GetString(reader["CurrencyCode"]),

                    });
                }
            }
            reader.Close();
            return objCurrencyDO;
        }
        #endregion
        public List<SalesPersonAccessDo> GetSalesPersonList(int CompCode, int MemberTypeId, int MemberId)
        {
            List<SqlParameters> param = new List<SqlParameters>();
            //param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, memberid, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CompCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@MemberType", SqlDbType.Int, 4, MemberTypeId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@MemberId", SqlDbType.Int, 4, MemberId, ParameterDirection.Input));
            using (SqlDataReader reader = SqlManager.ExecuteReader(CommandType.StoredProcedure, "Usp_GetSalesPersonForDashBoard", param, DBType.Master, CompCode))
            {
                return GetSalesPersonDetail(reader);
            }
        }

        private List<SalesPersonAccessDo> GetSalesPersonDetail(SqlDataReader reader)
        {
            List<SalesPersonAccessDo> objSalesPerAcessDO = new List<SalesPersonAccessDo>();
            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    objSalesPerAcessDO.Add(new SalesPersonAccessDo()
                    {
                        SalesPersonName = Util.GetString(reader["SalesPerson"]),
                        UserId = Util.GetInteger(reader["nUserId"]),
                        MemberId = Util.GetInteger(reader["memberid"]),
                        bSalesPerson=Util.GetBoolean(reader["bSalePerson"])
                    });
                }
            }
            reader.Close();
            return objSalesPerAcessDO;
        }
    }
}
