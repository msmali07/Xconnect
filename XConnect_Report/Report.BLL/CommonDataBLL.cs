using Report.DAL;
using Report.DO;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Report.BLL
{
    public class CommonDataBLL
    {
        public List<PostBookingDO> GetPostBookingDetails()
        {
            return new CommonDataDAL().FindMemberDetails(Convert.ToInt32(SessionContext.Current.AISession.MemberType), SessionContext.Current.AISession.MemberId, SessionContext.Current.AISession.CompCode, SessionContext.Current.AISession.UserId);
        }

        public List<PostBookingDO> GetBranchWiseResult(int MemberType, int MemberId)
        {
            return new CommonDataDAL().FindMemberDetails(MemberType, MemberId, SessionContext.Current.AISession.CompCode, SessionContext.Current.AISession.UserId);
        }

        public List<PostBookingDO> GetUserDetailResult(int MemberId)
        {
            return new CommonDataDAL().GetUserDetails(MemberId, SessionContext.Current.AISession.CompCode);
        }

        public List<SupplierDO> GetSupplierList()
        {
            return new CommonDataDAL().GetSupplierList(SessionContext.Current.AISession.CompCode);
        }

        public List<CurrencyDO> GetCurrencyList()
        {
            return new CommonDataDAL().GetCurrencyDetails(SessionContext.Current.AISession.CompCode, SessionContext.Current.AISession.MemberId);
        }
        public List<SalesPersonAccessDo> GetSalesPersonList(int MemberTypeId, int MemberId)
        {
            return new CommonDataDAL().GetSalesPersonList(SessionContext.Current.AISession.CompCode, MemberTypeId, MemberId);
        }

    }
}
