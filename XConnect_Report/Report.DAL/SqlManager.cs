using Report.DO;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Report.DAL
{
    public struct SqlParameters
    {
        public string parameterName;
        public SqlDbType dbType;
        public int size;
        public object value;
        public ParameterDirection direction;
        public static SqlParameters Add(string parameterName, SqlDbType dbType, int size, object value, ParameterDirection parameterDirection)
        {
            SqlParameters sqlParameters = new SqlParameters();
            sqlParameters.parameterName = parameterName;
            sqlParameters.dbType = dbType;
            sqlParameters.size = size;
            sqlParameters.value = value;
            sqlParameters.direction = parameterDirection;
            return sqlParameters;
        }
    }

    public sealed class SqlManager
    {
        #region Properties
        public static DBType enumApprovalString { get; set; }
        public static int CompanyCode { get; set; }
        #endregion

        #region Connection String
        private static SqlConnection connection
        {
            get { return new SqlConnection(connectionString); }
        }

        private static string connectionString
        {
            get
            {
                switch (CompanyCode)
                {
                    case 1:
                        switch (enumApprovalString)
                        {
                            case DBType.Master: //Master DB
                                return ConfigurationManager.ConnectionStrings["MasterConnection"].ConnectionString;
                            case DBType.Booking: //Booking DB
                                return ConfigurationManager.ConnectionStrings["BookingConnection"].ConnectionString;
                            case DBType.Mapping: //Mapping DB
                                return ConfigurationManager.ConnectionStrings["MappingConnection"].ConnectionString;
                            case DBType.Online: //Online DB
                                return ConfigurationManager.ConnectionStrings["OnlineConnection"].ConnectionString;
                            default:
                                return ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;
                        }

                    default:
                            switch (enumApprovalString)
                            {
                                case DBType.Master: //Master DB
                                    return ConfigurationManager.ConnectionStrings["MasterConnection_04"].ConnectionString;
                                case DBType.Booking: //Booking DB
                                    return ConfigurationManager.ConnectionStrings["BookingConnection_04"].ConnectionString;
                                case DBType.Mapping: //Mapping DB
                                    return ConfigurationManager.ConnectionStrings["MappingConnection_04"].ConnectionString;
                                case DBType.Online: //Online DB
                                    return ConfigurationManager.ConnectionStrings["OnlineConnection"].ConnectionString;
                                default:
                                    return ConfigurationManager.ConnectionStrings["ConnectionString_V4"].ConnectionString;
                            }
                }
            }
        }
        #endregion


        #region Prepare Command
        private static void PrepareCommand(SqlCommand sqlCommand, SqlTransaction sqlTransaction, CommandType commandType, string commandText, List<SqlParameters> commandParameters, DBType dBPathId, int CompCode)
        {
            // sqlCommand.Connection = connection;

            sqlCommand.Connection = connection;
            if (sqlCommand.Connection.State != ConnectionState.Open)
            {
                sqlCommand.Connection.Open();
            }

            sqlCommand.CommandText = commandText;
            sqlCommand.CommandTimeout = 60;
            if (sqlTransaction != null)
            {
                sqlCommand.Transaction = sqlTransaction;
            }

            sqlCommand.CommandType = commandType;
            if (commandParameters != null)
            {
                foreach (SqlParameters paramNode in commandParameters)
                {
                    SqlParameter sqlParameter = new SqlParameter(paramNode.parameterName, paramNode.dbType, paramNode.size);
                    sqlParameter.Value = (sqlParameter.Direction == ParameterDirection.InputOutput) && (sqlParameter.Value == null) ? DBNull.Value : paramNode.value;
                    sqlCommand.Parameters.Add(sqlParameter);
                }

            }

            return;
        }
        #endregion

        #region Execute Reader
        public static SqlDataReader ExecuteReader(CommandType commandType, string commandText, List<SqlParameters> commandParameters, DBType dBPathId, int CompCode)
        {
            InitiliazeVariable(dBPathId, CompCode);


            using (connection)
            {
                SqlDataReader sqlDataReader;
                SqlCommand sqlCommand = new SqlCommand();
                PrepareCommand(sqlCommand, (SqlTransaction)null, commandType, commandText, commandParameters, dBPathId, CompCode);

                try
                {
                    sqlDataReader = sqlCommand.ExecuteReader(CommandBehavior.CloseConnection);
                }
                catch
                {
                    throw;
                }
                finally
                {
                    sqlCommand.Dispose();
                }
                return sqlDataReader;
            }
        }
        #endregion

        #region Execute NonQuery
        public static int ExecuteNonQuery(CommandType commandType, string commandText, List<SqlParameters> commandParameters, DBType dBPathId, int CompCode)
        {
            InitiliazeVariable(dBPathId, CompCode);


            using (connection)
            {
                int retval;
                SqlCommand sqlCommand = new SqlCommand();
                PrepareCommand(sqlCommand, (SqlTransaction)null, commandType, commandText, commandParameters, dBPathId, CompCode);

                try
                {
                    retval = sqlCommand.ExecuteNonQuery();
                }
                catch (Exception ex)
                {
                    throw;
                }
                finally
                {
                    sqlCommand.Connection.Close();
                    sqlCommand.Dispose();
                }
                return retval;
            }
        }
        #endregion

        #region Excecute Scalar
        public static object ExecuteScalar(CommandType commandType, string commandText, List<SqlParameters> commandParameters, DBType dBPathId, int CompCode)
        {
            InitiliazeVariable(dBPathId, CompCode);
            using (connection)
            {
                object retval;
                SqlCommand cmd = new SqlCommand();
                PrepareCommand(cmd, (SqlTransaction)null, commandType, commandText, commandParameters, dBPathId, CompCode);

                try
                {
                    retval = cmd.ExecuteScalar();
                }
                catch (Exception ex)
                {
                    throw;
                }
                finally
                {
                    cmd.Connection.Close();
                    cmd.Dispose();
                }
                return retval;
            }
        }
        #endregion

        #region ExecuteDataSet
        public static DataSet ExecuteDataSet(CommandType commandType, string commandText, List<SqlParameters> commandParameters, DBType dBPathId, int CompCode)
        {
            InitiliazeVariable(dBPathId, CompCode);

            using (connection)
            {
                SqlCommand sqlCommand = new SqlCommand();
                PrepareCommand(sqlCommand, (SqlTransaction)null, commandType, commandText, commandParameters, dBPathId, CompCode);
                SqlDataAdapter sqlDataAdapter = new SqlDataAdapter(sqlCommand);
                DataSet dataSet = new DataSet();

                try
                {
                    sqlDataAdapter.Fill(dataSet);
                }
                catch
                {
                    throw;
                }
                finally
                {
                    sqlCommand.Connection.Close();
                    sqlCommand.Dispose();
                }

                return dataSet;
            }
        }
        #endregion

        #region ExecuteDataTable
        public static DataTable ExecuteDataTable(CommandType commandType, string commandText, List<SqlParameters> commandParameters, DBType dBPathId, int CompCode)
        {
            InitiliazeVariable(dBPathId, CompCode);


            using (connection)
            {
                SqlCommand sqlCommand = new SqlCommand();
                PrepareCommand(sqlCommand, (SqlTransaction)null, commandType, commandText, commandParameters, dBPathId, CompCode);
                SqlDataAdapter sqlDataAdapter = new SqlDataAdapter(sqlCommand);
                DataTable dataTable = new DataTable();

                try
                {
                    sqlDataAdapter.Fill(dataTable);
                }
                catch (Exception ex)
                {
                    throw;
                }
                finally
                {
                    sqlCommand.Connection.Close();
                    sqlCommand.Dispose();
                }
                return dataTable;
            }
        }
        #endregion

        #region Common Methods
        public static void InitiliazeVariable(DBType approvalString, int cCode)
        {
            enumApprovalString = approvalString;
            CompanyCode = cCode;
        }
        #endregion 
    }
}
