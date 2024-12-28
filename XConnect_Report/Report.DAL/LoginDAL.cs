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
    public class LoginDAL
    {
        public AISessionDO Authenticate(string _userId, string _password, AISessionDO session, string _IpAddress, int _AppUrl, string _SessionId, int CompCode, int LoginType)
        {
            List<SqlParameters> param = new List<SqlParameters>();
            param.Add(SqlParameters.Add("@UserName", SqlDbType.VarChar, 50, _userId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@Password", SqlDbType.VarChar, 50, _password, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@IPAddress", SqlDbType.VarChar, 50, _IpAddress, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@AppUrl", SqlDbType.Int, 4, _AppUrl, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@UserSessionId", SqlDbType.NVarChar, 10, _SessionId, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@CCode", SqlDbType.Int, 4, CompCode, ParameterDirection.Input));
            param.Add(SqlParameters.Add("@LoginType", SqlDbType.Int, 4, LoginType, ParameterDirection.Input));


            using (SqlDataReader reader = SqlManager.ExecuteReader(CommandType.StoredProcedure, "Usp_Rpt_Login", param, DBType.Master, CompCode))
            {
                if (reader.HasRows)
                {
                    reader.Read();
                    string lookupPassword = Util.GetString(reader["Password"]);
                    // case sensitive comparision of password
                    if (0 == string.Compare(lookupPassword, _password, true))
                    {
                        session = BuildReader(reader, session, _IpAddress, _SessionId);
                    }
                }
                reader.Close();
            }
            return session;
        }

        #region Build AISession variable
        private AISessionDO BuildReader(SqlDataReader reader, AISessionDO session, string _IpAddress, string _SessionId)
        {
            session.SessionId = Util.GetString(_SessionId);
            session.UserId = Util.GetInteger(reader["UserId"]);
            session.UserName = Util.GetString(reader["UserName"]);
            session.MemberId = Util.GetInteger(reader["MemberId"]);
            session.CompanyName = Util.GetString(Util.GetString(reader["CompanyName"]));
            session.Title = Util.GetString(reader["Title"]);
            session.FirstName = Util.GetString(reader["FirstName"]);
            session.LastName = Util.GetString(reader["LastName"]);
            session.MemberType = Util.GetMemberType((int)reader["MemberType"]);
            session.LoginMemberTypeId = Util.GetInteger(reader["MemberType"]);
            session.AdminUser = Util.GetBoolean(reader["AdminUser"]);
            session.UserMail = Util.GetString(reader["UserMail"]);
            session.CountryId = Util.GetInteger(reader["CountryId"]);
            session.CountryName = Util.GetString(Util.GetString(reader["CountryName"]).ToLower());
            session.TestUser = Util.GetBoolean(reader["TestUser"]);
            session.CreditStatus = Util.GetBoolean(reader["CreditStatus"]);
            session.ApplicableUrl = Util.GetInteger(reader["ApplicableURL"]);
            session.BranchCode = Util.GetString(reader["BranchCode"]);
            session.Role = Util.GetString(reader["Role"]); //+ Util.GetString(reader["ITRole"]);
            session.CompanyLogo = "../images/CompanyLogo/" + Util.GetString(reader["CompanyLogo"]);
            session.Services = Util.GetString(reader["cService"]);
            session.IsOpenMember = Util.GetBoolean(reader["IsOpenMember"]);
            session.DepartmentId = Util.GetInteger(reader["DepartmentId"]);
            session.DisplayCurrency = Util.GetString(reader["DisplayCurrency"]);
            session.TimeZoneDifference = Util.GetString(reader["TimeZoneDifference"]);
            session.IsB2C = Util.GetBoolean(reader["IsB2C"]);
            session.BranchId = Util.GetInteger(reader["nBranchId"]);
            session.count = Util.GetInteger(reader["nCount"]);
            session.Password = Util.GetString(reader["Password"]);

            session.WlCompanyName = Util.GetString(reader["WlComapnyName"]);
            session.WlYear = Util.GetInteger(reader["WlYear"]);

            session.IsOverSeas = Util.GetBoolean(reader["IsOverSeas"]);
            session.SellCurrency = Util.GetString(reader["SellCurrency"]);
            session.AgMarkup = Util.GetSingle(reader["AgMarkup"]);

            session.IsSalePerson= Util.GetBoolean(reader["bSalePerson"]);
            session.Reports = Util.GetString(reader["ReportRoles"]);
            string[] ReportList = session.Reports.Split(";".ToCharArray());
            ReportRoleDefineDO ObjReportRoleslist = new ReportRoleDefineDO();
            for (int rr = 0; rr < ReportList.Length; rr++)
            {
                switch (Util.GetInteger(ReportList[rr]))
                {
                    case 1:
                        ObjReportRoleslist.AccountReport = true;
                        break;
                    case 2:
                        ObjReportRoleslist.NetStatementReport = true;
                        break;
                    case 3:
                        ObjReportRoleslist.DailySalesReport = true;
                        break;
                    case 4:
                        ObjReportRoleslist.ProfitAndLossReport = true;
                        break;
                    case 5:
                        ObjReportRoleslist.HotelProductivityReport = true;
                        break;
                    case 6:
                        ObjReportRoleslist.UserSalesReport = true;
                        break;
                    case 7:
                        ObjReportRoleslist.CorporatAndCardUseReport = true;
                        break;
                    case 8:
                        ObjReportRoleslist.PickupReport = true;
                        break;
                    case 9:                      
                        ObjReportRoleslist.MemberCreditDetailsReport = true;
                        if (session.CompCode == 1)
                        {                            
                            ObjReportRoleslist.CreditReport = false;
                        }
                        else
                        {
                            ObjReportRoleslist.CreditReport = true;
                        }                          
                        break;
                    case 10:
                        ObjReportRoleslist.AgencyPerformanceReport = true;                      
                        break;
                    case 11:
                        ObjReportRoleslist.Dashboard = true;
                        break;
                    case 12:
                        ObjReportRoleslist.OperationalIssueReport = true;
                        break;
                    case 13:
                        ObjReportRoleslist.TransactionReport = true;
                        break;
                    case 14:
                        ObjReportRoleslist.AgencyUserReport = true;
                        break;
                    case 15:
                        ObjReportRoleslist.CountryProductivityReport = true;
                        break ;
                    case 16:
                        ObjReportRoleslist.HotelMizeReport = true;
                        break;
                    case 17:
                        ObjReportRoleslist.MarketingFee = true;
                        break;
                    case 18:
                        ObjReportRoleslist.SalesProductivityReport = true;
                        break;
                    case 19:
                        ObjReportRoleslist.HQProductivityReport = true;
                        break;
                    case 20:              
                        ObjReportRoleslist.HotelProductivityReportAPI = true;
                        break;
                     case 21:              
                        ObjReportRoleslist.SalesPersonWiseReport = true;
                        break;
                    case 22:
                        ObjReportRoleslist.ReportDashBoardV1 = true;
                        break;
                    case 23:
                        ObjReportRoleslist.SalesLoginAccess = true;
                        break;
                    case 24:
                        ObjReportRoleslist.GstReport = true;
                        break;
                    default:
                        ObjReportRoleslist.CreditReport = false;
                        break;

                }             
                

            }


            session.ReportRole = ObjReportRoleslist;
            session.Connected = true;
            session.LastPasswordChange = Util.GetDateTime(reader["LastPasswordChange"]);
            session.LastLoginDate = Util.GetDateTime(reader["LoginDate"]);
            session.CompCode = Util.GetInteger(reader["CompCode"]);
            session.IsMultiBranchUser = Util.GetString(reader["BranchAllocateMemberId"]) != "" ? true : false;
            session.ShowPkgRates = Util.GetBoolean(reader["IsShowPkgRates"]);          
            session.CountryInfo = Util.GetString(reader["IataCode"]) + "~" + Util.GetInteger(reader["CountryId"]);            
           
       
          
            session.PhoneNo = Util.GetString(reader["Mobile"]);
            session.CityId = Util.GetInteger(reader["CityId"]);


            return session;
        }
        #endregion
    }
}
