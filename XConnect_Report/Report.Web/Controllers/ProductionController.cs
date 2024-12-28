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
using Newtonsoft.Json.Linq;
using System.Web.Routing;
using System.Text;
using System.Reflection;
using SautinSoft;
using System.IO;
using System.Web.Hosting;

namespace Report.Web.Controllers
{
    public class ProductionController : ApplicationController
    {
        public string _SessionId = SessionContext.Current.AISession.SessionId;
        // GET: Production
        public ActionResult HotelProductivityReport()
        {
            return View();
        }

        [HTTPCompression.ActionFilters.Compress]
        public JsonResult GetHotelProductivityReport(HotelProductivityReportDO HProdReportDO)
        {
            List<string> finalList = new List<string>();
            List<HotelProductivityResultList> HotelProdList = new List<HotelProductivityResultList>();
            HotelProdList = new ProductionBLL().GetHotelProductivity(HProdReportDO, SessionContext.Current.AISession.CompCode);

            var jsonResult = Json(HotelProdList.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return jsonResult;
        }

        public ActionResult HotelProductivityReportAPI()
        {
            return View();

        }


        [HTTPCompression.ActionFilters.Compress]
        public JsonResult GetHotelProductivityReportAPI(HotelProductivityReportDO HProdReportDO)
        {
            List<string> finalList = new List<string>();
            List<HotelProductivityResultList> HotelProdList = new List<HotelProductivityResultList>();
            HotelProdList = new ProductionBLL().GetHotelProductivityAPI(HProdReportDO, SessionContext.Current.AISession.CompCode);

            var jsonResult = Json(HotelProdList.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return jsonResult;
        }
        public ActionResult CountryProductivityReport()
        {
            return View();
        }

        [HTTPCompression.ActionFilters.Compress]
        public JsonResult GetProductivityReport(ProductivityReportDO productivityReportDO)
        {
            List<string> finalList = new List<string>();
            List<ProductivityReportResultDO> ProdReport = new List<ProductivityReportResultDO>();
            ProdReport = new ProductionBLL().GetProductivityReport(productivityReportDO, SessionContext.Current.AISession.CompCode);            
            var jsonResult = Json(ProdReport.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return jsonResult;
        }

        public ActionResult SalesProductivityReport()
        {
            return View();
        }


        public JsonResult GetSalesProductivityDetail(SalesProductivityReportDO AccSearchReportDO)
        {
            List<string> finalList = new List<string>();
            List<SalesProductivityResultDO> SalesProductivityList = new List<SalesProductivityResultDO>();
            SalesProductivityList = new ProductionBLL().GetSalesReport(AccSearchReportDO, SessionContext.Current.AISession.CompCode);

            var jsonResult = Json(SalesProductivityList.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return jsonResult;


        }
        public ActionResult HQProductivityReport()
        {
            return View();
        }
        public JsonResult GetHQProductivityDetail(HQProductivityReportDO AccSearchReportDO)
        {
            List<string> finalList = new List<string>();
            List<HQProductivityResultDO> HQProductivityList = new List<HQProductivityResultDO>();
            HQProductivityList = new ProductionBLL().GetHQReport(AccSearchReportDO, SessionContext.Current.AISession.CompCode);

            var jsonResult = Json(HQProductivityList.ToList(), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            JsonConvert.SerializeObject(jsonResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });
            return jsonResult;


        }

    }
}