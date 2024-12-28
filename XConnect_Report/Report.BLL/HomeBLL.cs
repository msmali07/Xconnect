using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Report.DO;
using Report.DAL;
using System.Web.UI.WebControls;
using System.Data;
using System.Web;
using System.Xml.Linq;
using Newtonsoft.Json.Linq;
using System.Web.Routing;
using Newtonsoft.Json;

namespace Report.BLL
{
    public class HomeBLL
    {
        #region DashBorad-Home
      
        public BookingCountListDO GetBookingListDS(HomeSearchDO SearchDO)
        {
          
            BookingCountListDO BookCount = new BookingCountListDO();

            BookCount = new HomeDAL().GetDashBoardDetails(SessionContext.Current.AISession.CompCode, SessionContext.Current.AISession.MemberId, SearchDO, SessionContext.Current.AISession.MemberType, SessionContext.Current.AISession.UserId);
            
            return BookCount;
        }

        public List<TopBranchListDO> GetTopBranchListDS(HomeSearchDO SearchDO)
        {
            List<TopBranchListDO> TopBranchList = new List<TopBranchListDO>();

            try
            {
                TopBranchList =new HomeDAL().GetDashBoardTopBranch(SessionContext.Current.AISession.CompCode, SessionContext.Current.AISession.MemberId, SearchDO, SessionContext.Current.AISession.MemberType, SessionContext.Current.AISession.UserId);
            }

            catch (Exception ex)
            {

            }
            return TopBranchList;
        }
        public List<TopAgencyListDO> GetTopAgencyListDS(HomeSearchDO SearchDO)
        {
            List<TopAgencyListDO> TopAgencyList = new List<TopAgencyListDO>();
            

           
            try
            {
               

                TopAgencyList =new HomeDAL().GetDashBoardTopAgency(SessionContext.Current.AISession.CompCode, SessionContext.Current.AISession.MemberId, SearchDO, SessionContext.Current.AISession.MemberType, SessionContext.Current.AISession.UserId);
            }

            catch (Exception ex)
            {

            }
            return TopAgencyList;
        }
        
        public List<TopSupplierListDO> GetTopSupplierListDS(HomeSearchDO SearchDO)
        {
            List<TopSupplierListDO> TopSupplierList = new List<TopSupplierListDO>();
          
            try
            {
               
                TopSupplierList =new HomeDAL().GetDashBoardTopSupplier(SessionContext.Current.AISession.CompCode, SessionContext.Current.AISession.MemberId, SearchDO, SessionContext.Current.AISession.MemberType, SessionContext.Current.AISession.UserId);
            }

            catch (Exception ex)
            {

            }
            return TopSupplierList;
        }

        public List<FailedSupplierListDO> GetFailedSupplierListDS(HomeSearchDO SearchDO)
        {
            List<FailedSupplierListDO> FailedSuppList = new List<FailedSupplierListDO>();
          
            try
            {
               

                FailedSuppList= new HomeDAL().GetDashBoardFailedSupplier(SessionContext.Current.AISession.CompCode, SessionContext.Current.AISession.MemberId, SearchDO, SessionContext.Current.AISession.MemberType, SessionContext.Current.AISession.UserId);
            }

            catch (Exception ex)
            {

            }
            return FailedSuppList;
        }

        public List<AgActiveListDO> GetAgActiveListDS(HomeSearchDO SearchDO)
        {
            List<AgActiveListDO> AgActiveList = new List<AgActiveListDO>();

            try
            {
                AgActiveList = new HomeDAL().GetDashBoardAgActive(SessionContext.Current.AISession.CompCode, SessionContext.Current.AISession.MemberId, SearchDO, SessionContext.Current.AISession.MemberType, SessionContext.Current.AISession.UserId);
            }
            catch (Exception ex)
            {
            }
            return AgActiveList;
        }

        public List<SerachBookByCityListDO> GetSearchBookListDS(HomeSearchDO SearchDO)
        {
            List<SerachBookByCityListDO> TopSearchBook = new List<SerachBookByCityListDO>();
           
            try
            {
               

                TopSearchBook= new HomeDAL().GetDashBoardTopSearchBook(SessionContext.Current.AISession.CompCode, SessionContext.Current.AISession.MemberId, SearchDO, SessionContext.Current.AISession.MemberType);
            }

            catch (Exception ex)
            {

            }
            return TopSearchBook;
        }

        public List<ServiceBookingListDO> GetServiceBookingList(HomeSearchDO SearchDO)
        {
            
           
            List<ServiceBookingListDO> BookingList = new List<ServiceBookingListDO>();

            try
            {
              


               

                BookingList=  new HomeDAL().GetDashBoardBookingByService(SessionContext.Current.AISession.CompCode, SessionContext.Current.AISession.MemberId, SearchDO, SessionContext.Current.AISession.MemberType, SessionContext.Current.AISession.UserId);
            }

            catch (Exception ex)
            {

            }
            return BookingList;
        }


        public List<SerachBookByAgencyListDO> GetSearchBookListByAgencyDS(HomeSearchDO SearchDO)
        {
            List<SerachBookByAgencyListDO> TopSearchBookByMember = new List<SerachBookByAgencyListDO>();
           
            try
            {
               

                    TopSearchBookByMember = new HomeDAL().GetDashBoardTopSearchBookByAgency(SessionContext.Current.AISession.CompCode, SessionContext.Current.AISession.MemberId, SearchDO, SessionContext.Current.AISession.MemberType);
               
            }

            catch (Exception ex)
            {

            }
            return TopSearchBookByMember;
        }

        public List<BlockedSupplierListDO> GetBlockedSupplierDS(HomeSearchDO SearchDO)
        {
            List<BlockedSupplierListDO> BlockedSupplier = new List<BlockedSupplierListDO>();
           
            return BlockedSupplier;
        }

        public List<BookingByYearList> GetYearlyBookingList(HomeSearchDO SearchDO)
        {
            List<BookingByYearList> BookingList = new List<BookingByYearList>();
            BookingList = new HomeDAL().GetYearlyBookingList(SessionContext.Current.AISession.CompCode, SessionContext.Current.AISession.MemberId, SessionContext.Current.AISession.UserId, SessionContext.Current.AISession.MemberType, SearchDO);
            return BookingList;
        }

        public List<Dictionary<string, object>> GetAgencyApiOutData(HomeSearchDO SearchDO)
        {
            List<Dictionary<string, object>> data = new HomeDAL().GetAgencyApiOutData(SessionContext.Current.AISession.CompCode, SessionContext.Current.AISession.MemberId, SearchDO, SessionContext.Current.AISession.MemberType, SessionContext.Current.AISession.UserId);
            return data;
        }

        #endregion

    }
}
