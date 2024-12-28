using Microsoft.Reporting.WebForms;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;

namespace Report.DO
{
    public class HotelProductivityReportDO
    {
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public int MemberId { get; set; }
        public int LoginUserId { get; set; }
        public bool BookingdateWise { get; set; }

        public int ReportView { get; set; }
        public int BookingType { get; set; }
        public int ServiceType { get; set; }

        public int SupplierId { get; set; }
        public int CityId { get; set; }
        public int CountryId { get; set; }

        public int NationalityId { get; set; }

        public string HotelName { get; set; }
    }

    public class HotelProductivityResultList
    {      
       
        public string Country { get; set; }
        public string City { get; set; }
        public string SName { get; set; }
        public string StarCat { get; set; }        
        public int Nts { get; set; }
        public int NoOfAdults { get; set; }
        public int NoOfChilds { get; set; }
        public decimal TTVinUSD { get; set; }
        public int NoOfPax { get; set; }
        public string HotelId { get; set; }
        public string CountryCode { get; set; }
        public string HotelAddress { get; set; }
        public string TelePhone { get; set; }
        public string HotelDescription { get; set; }
        public string ImagePath { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public string SuppCityCode { get; set; }
        public string GiataId { get; set; }
        public string ExpediaHCode { get; set; }
        public string HBHCode { get; set; }
        public string AgodaHCode { get; set; }
        public string TGXCode { get; set; }

    }
}
