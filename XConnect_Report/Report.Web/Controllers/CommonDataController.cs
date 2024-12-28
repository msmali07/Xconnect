using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.UI.WebControls;
using Report.DO;
using Report.BLL;
using Report.DAL;
using Newtonsoft.Json;

namespace Report.Web.Controllers
{
    public class CommonDataController : ApplicationController
    {
        // GET: CommonData
        public ActionResult Index()
        {
            return View();
        }

        #region PostBooking
        [HttpGet]
        public JsonResult GetBracnhList()
        {
            List<PostBookingDO> objPostBookingDO = new List<PostBookingDO>();
            objPostBookingDO = new CommonDataBLL().GetPostBookingDetails();
            return Json(objPostBookingDO, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetBracnhWiseresult(int MemberType, int MemberId)
        {
            List<PostBookingDO> objPostBookingDO = new List<PostBookingDO>();
            objPostBookingDO = new CommonDataBLL().GetBranchWiseResult(MemberType, MemberId);
            return Json(objPostBookingDO, JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetUserList(int MemberId)
        {
            List<PostBookingDO> objPostBookingDO = new List<PostBookingDO>();
            objPostBookingDO = new CommonDataBLL().GetUserDetailResult(MemberId);
            return Json(objPostBookingDO, JsonRequestBehavior.AllowGet);
        }
        #endregion

        [HTTPCompression.ActionFilters.Compress]
        public JsonResult GetSuppiler()
        {
            List<SupplierDO> SuppList = new List<SupplierDO>();
            SuppList = new CommonDataBLL().GetSupplierList();
            
            var jsonResult = Json(SuppList, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return jsonResult;

        }

        [HTTPCompression.ActionFilters.Compress]
        public JsonResult GetCurrency()
        {
            List<CurrencyDO> CurrencyList = new List<CurrencyDO>();
            CurrencyList = new CommonDataBLL().GetCurrencyList();

            var jsonResult = Json(CurrencyList, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return jsonResult;

        }
        public JsonResult GetSalesPersonList(int MemberTypeId, int MemberId)
        {
            List<SalesPersonAccessDo>  objSalesPersonDo = new List<SalesPersonAccessDo>();
            objSalesPersonDo = new CommonDataBLL().GetSalesPersonList(MemberTypeId, MemberId);
            return Json(objSalesPersonDo, JsonRequestBehavior.AllowGet);
        }
    }
}