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
   
    public class SupplierDO
    {
        public int SId
        { get; set; }

        public string SName
        { get; set; }

        public int Type
        { get; set; }


    }
}
