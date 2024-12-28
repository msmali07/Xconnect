using Report.DAL;
using Report.DO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Report.BLL
{
    public class SessionContext
    {
        private AISessionDO aiSession = null;

        public AISessionDO AISession
        {
            get
            {
                if (aiSession == null)
                {
                    aiSession = new AISessionDO();
                }
                return aiSession;
            }
        }

        public bool Connected
        {
            get { return aiSession != null && aiSession.Connected; }
        }

        public static SessionContext Current
        {
            get
            {
                SessionContext sessionContext
                    = (SessionContext)HttpContext.Current.Session["_userSession_Report"];

                if (sessionContext == null)
                {
                    sessionContext = new SessionContext();
                }

                return sessionContext;
            }
        }

        #region User Authentication

        public AISessionDO Login(string _userId, string _password, string _IpAddress, int _Appurl, string _SessionId, int CompCode, int LoginType)
        {
            aiSession = null;
            AISessionDO session = new LoginDAL().Authenticate(_userId, _password, this.AISession, _IpAddress, _Appurl, _SessionId, CompCode, LoginType);



            HttpContext.Current.Session["_userSession_Report"] = this;




            return session;
        }
        #endregion



        public bool AllowBooking(bool bCreditstatus)
        {
            bool bAllowbooking = false;
            try
            {
                if (bCreditstatus == true)
                {
                    bAllowbooking = true;
                }
                else if (bCreditstatus == false)
                {
                    bAllowbooking = true;
                }
                else if (bCreditstatus == false)
                {
                    bAllowbooking = false;
                }
            }
            catch
            {
                bAllowbooking = false;
            }
            return bAllowbooking;
        }
    }
}
