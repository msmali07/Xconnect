using Report.DO;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Reporting.WebForms;
using System.Globalization;
using System.Collections;

namespace Report.DAL
{
    public class XConCalculationDAL
    {
       
        public decimal GetSupplierNetinSell(DataRow row)
        {
            decimal SuppNetinSell = 0;
            try
            {
                                       
               SuppNetinSell = (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["NetCancelCharge"]) : Util.GetDecimal(row["NetAmount"])) * Util.GetDecimal(row["XChangeRate"]);
            
            }
              


            catch (Exception ex) { }
            return Math.Round(SuppNetinSell);
        }
        
        public decimal GetAgPay(DataRow row)
        {
            decimal AgPAy = 0;
          

            decimal Markup = (Util.GetDecimal(row["nWsPer"]) + Util.GetDecimal(row["nAgentPer"]));
            decimal SellAmount = (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellCancelCharge"]) : Util.GetDecimal(row["SellAmount"]));
           
            try
            {
              AgPAy = SellAmount * ((100 - Markup) / 100);
             
            }
            catch (Exception ex) { }



            return Math.Round(AgPAy, 2);
        }
           
        public decimal GetProfitAmt(DataRow row)
        {
            decimal ProfitAmt = 0;
            decimal HQProfitAmt = 0;

            decimal SellAmount = Util.GetDecimal(row["SellAmount"]);
            decimal TotalNetCostinSell = GetSupplierNetinSell(row);
            decimal TotalMarkup = Util.GetDecimal(row["nBranchPer"]) + Util.GetDecimal(row["nWsPer"]) + Util.GetDecimal(row["nAgentPer"]);
            decimal Markup = (Util.GetDecimal(row["nWsPer"]) + Util.GetDecimal(row["nAgentPer"]));
           
            try
            {
                SellAmount= SellAmount * ((100 - Markup) / 100);
                ProfitAmt = Util.GetDecimal(SellAmount - TotalNetCostinSell);            
                //minus BR+Ag+Ws markup form profit
                //HQProfitAmt = Util.GetDecimal(ProfitAmt) - ((TotalMarkup * Util.GetDecimal(ProfitAmt)) / 100);

            }
            catch (Exception ex) { }


            return Math.Round(ProfitAmt, 2);
        }
        
        public decimal GetProfitinPer(DataRow row)
        {
          
            decimal TotalProfitPer = 0;
            decimal SellAmount = Util.GetDecimal(row["SellAmount"]);
            decimal ProfitAmt = GetProfitAmt(row);
            decimal Markup = (Util.GetDecimal(row["nWsPer"]) + Util.GetDecimal(row["nAgentPer"]));
            decimal TotalNetCostinSell = GetSupplierNetinSell(row);
            try
            {
                SellAmount = SellAmount * ((100 - Markup) / 100);
                ProfitAmt = Util.GetDecimal(SellAmount - TotalNetCostinSell);

                TotalProfitPer = (((ProfitAmt) / SellAmount) * 100);
            }
            catch (Exception ex)
            {

            }


            return Math.Round(TotalProfitPer, 2);
        }

      
    }
}
