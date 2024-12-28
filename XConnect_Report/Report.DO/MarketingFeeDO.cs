﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Reporting.WebForms;

namespace Report.DO
{
    public class MarketingFeeDO
    {
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public int MemberId { get; set; }
        public int LoginUserId { get; set; }
        public bool BookingdateWise { get; set; }
    }

    public class MarketingReportResultDO
    {

        public string RefNo { get; set; }
        public string ChkIn { get; set; }
        public string BookDate { get; set; }
        public int Nts { get; set; }
        public string SName { get; set; }
        public string Pax { get; set; }
        public string SCurr { get; set; }
        public string Status { get; set; }
        public string SType { get; set; }
        public string AgName { get; set; }

        public string AgRefNo { get; set; }

        public string AgCity { get; set; }
        public string AgCountry { get; set; }
        public decimal SAmt { get; set; }

        public decimal AGPay { get; set; }

        public decimal BRPay { get; set; }

        public string Postbyuser { get; set; }

        public string Posttouser { get; set; }

        public string InvoiceNo { get; set; }

        public string TaxServiceFee { get; set; }

        public string SalesTax { get; set; }

        public string ResortFee { get; set; }
        public decimal NAmt { get; set; }
        public string NCur { get; set; }
        public decimal MFee { get; set; }

    }

   
}
