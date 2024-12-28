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
    public class CalculationDAL
    {
        //done
        public decimal GetSupplierNet(DataRow row)
        {
            decimal SuppNet = 0;
            try
            {
                #region New Nell To Sell
                if (Util.GetInteger(row["BookingVersion"]) > 2)
                {      
                            SuppNet = GetOttilaToSupplierPay(row);
                    
                            //as per discuss RebateFromSupplierinSell minus from SupplierNetinSell
                            decimal GetRebateFromSupplierNet = GetRebateFromSupplier(row);
                            SuppNet = SuppNet - GetRebateFromSupplierNet;
                }
                #endregion
                #region Old
                else
                {
                    decimal NetAmount = 0;
                    NetAmount = Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["NetCancelCharge"]) : Util.GetDecimal(row["NetAmount"]);

                    switch (Util.GetInteger(row["SupplierType"]))
                    {
                        #region Suppliertype = 1
                        case 0:
                        case 1:
                            if (Util.GetBoolean(row["bGrossOrNet"]) == true)
                            {
                                SuppNet = NetAmount * (100 - Util.GetInteger(row["SuppComm"])) / 100;
                            }
                            else
                            {
                                SuppNet = NetAmount;
                            }
                            break;
                       
                        case 10:
                        case 12:
                        case 16:
                            //1.Take Gross Amount
                            SuppNet = NetAmount;
                            // 2.Minus Supplier Commision from Amount
                            SuppNet = SuppNet * (100 - (Util.GetDecimal(row["SuppComm"]))) / 100;
                            // 3.Add Net Segment Fee
                            SuppNet = SuppNet + (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["XXNetSegment"]) : Util.GetDecimal(row["NetSegment"]) * (Util.GetDecimal(row["SegROE"])) / Util.GetDecimal(row["XChangeRate"]));
                            SuppNet = Math.Round(SuppNet, 2);
                            break;

                     
                            #endregion
                    }

                }
                #endregion

            }
            catch (Exception ex) { }
            return Math.Round(SuppNet, 2);
        }
        //done 
        public decimal GetSupplierNetinSell(DataRow row)
        {
            decimal SuppNetinSell = 0;
            try
            {
                decimal SuppNet = GetSupplierNet(row);
                //as per discuss RebateFromSupplierinSell minus from SupplierNetinSell
                //decimal GetRebateFromSupplierNet = GetRebateFromSupplier(row);
                SuppNetinSell = Math.Round(SuppNet * Util.GetDecimal(row["XChangeRate"]), 2);
                // SuppNetinSell = SuppNetinSell - RebateFromSupp_Sell;
            }
            catch (Exception ex) { }
            return Math.Round(SuppNetinSell, 2);
        }
        //done for supp type 1,2,7,8,11,3,4,5,13 and OverSeas - 1
        //misssing 14
        public decimal GetAgPay(DataRow row)
        {
            decimal AgPAy = 0;
            decimal CommissionPer = 0;
            decimal CommissionAmt = 0;
            decimal CommPer_From_CommAmt = 0;
            decimal Markup = (Util.GetDecimal(row["nWsPer"]) + Util.GetDecimal(row["nAgentPer"]));
            decimal SellAmount = Util.GetString(row["BookStatus"]) == "UC" ? 0 : (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellCancelCharge"]) : Util.GetDecimal(row["SellAmount"]));
            CommissionPer = Util.GetDecimal(row["CommissionPer"]);
            CommissionAmt = Util.GetDecimal(row["CommissionAmt"]);
            decimal TDS_WS = 0;
            decimal SuppTaxAmount = Util.GetString(row["BookStatus"]) == "UC" ? 0 : (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SuppTaxAmtCharge"]) : Util.GetDecimal(row["SuppTaxAmount"]));

            decimal sellsegment = Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellSegmentXXCharge"]) : Util.GetDecimal(row["SellSegment"]);
            try
            {
                #region New Nell To Sell
                if (Util.GetInteger(row["BookingVersion"]) > 2)
                {
                    switch (Util.GetInteger(row["SupplierType"]))
                    {
                        #region Suppliertype = 1,2,5,7,8,11,13,15
                        case 1:
                        case 2:
                        case 5:
                        case 7:
                        case 8:
                        case 11:
                        case 13:
                        case 15:
                            if (Util.GetBoolean(row["Invoiced"]) != true)
                            {
                                AgPAy = SellAmount * ((100 - Markup) / 100);
                            }
                            else if (Util.GetBoolean(row["Invoiced"]) == true && Util.GetDecimal(row["CommissionAmt"]) == 0)
                            {

                                AgPAy = SellAmount * ((100 - CommissionPer) / 100);
                            }
                            else if (Util.GetBoolean(row["Invoiced"]) == true && Util.GetDecimal(row["CommissionAmt"]) != 0)
                            {
                                CommPer_From_CommAmt = (CommissionAmt / SellAmount * 100);
                                AgPAy = SellAmount * ((100 - CommPer_From_CommAmt) / 100);

                            }
                            break;
                        #endregion
                        #region Suppliertype = 3
                        case 3:
                            if (Util.GetBoolean(row["Invoiced"]) != true)
                            {
                                TDS_WS = GetTDSForWS(row);
                                // 1. Minus TCS From Sell Amount (If Applicable)
                                AgPAy = SellAmount / (100 + Util.GetDecimal(row["TCSPer"])) * 100;
                                // 2. Minus Supplier Tax Amount                                      
                                AgPAy = AgPAy - (SuppTaxAmount * Util.GetDecimal(row["XChangeRate"]));
                                // 3. Get WS + AG Commission on SellAmount                           
                                AgPAy = AgPAy * (Markup) / 100;
                                // 4. Minus WS TDS Amount From Above                                                                                                            
                                AgPAy = AgPAy - TDS_WS;
                                // 5. Minus Calculated value from SellAmount                                                                             
                                AgPAy = SellAmount - AgPAy;
                                AgPAy = Math.Round(AgPAy, 2);
                            }
                            else if (Util.GetBoolean(row["Invoiced"]) == true && Util.GetDecimal(row["CommissionAmt"]) == 0)
                            {
                                TDS_WS = GetTDSForWS(row);
                                // 1. Minus TCS From Sell Amount (If Applicable)
                                AgPAy = SellAmount / (100 + Util.GetDecimal(row["TCSPer"])) * 100;
                                // 2. Minus Supplier Tax Amount                                      
                                AgPAy = AgPAy - (SuppTaxAmount * Util.GetDecimal(row["XChangeRate"]));
                                // 3. Get CommissionPer on SellAmount                           
                                AgPAy = AgPAy * (CommissionPer) / 100;
                                // 4. Minus WS TDS Amount From Above                                                                                                            
                                AgPAy = AgPAy - TDS_WS;
                                // 5. Minus Calculated value from SellAmount                                                                             
                                AgPAy = SellAmount - AgPAy;
                                AgPAy = Math.Round(AgPAy, 2);
                            }
                            else if (Util.GetBoolean(row["Invoiced"]) == true && Util.GetDecimal(row["CommissionAmt"]) != 0)
                            {

                                CommPer_From_CommAmt = (CommissionAmt / SellAmount * 100);

                                TDS_WS = GetTDSForWS(row);
                                // 1. Minus TCS From Sell Amount (If Applicable)
                                AgPAy = SellAmount / (100 + Util.GetDecimal(row["TCSPer"])) * 100;
                                // 2. Minus Supplier Tax Amount                                      
                                AgPAy = AgPAy - (SuppTaxAmount * Util.GetDecimal(row["XChangeRate"]));
                                // 3. Get CommPer_From_CommAmt on SellAmount                           
                                AgPAy = AgPAy * (CommPer_From_CommAmt) / 100;
                                // 4. Minus WS TDS Amount From Above                                                                                                            
                                AgPAy = AgPAy - TDS_WS;
                                // 5. Minus Calculated value from SellAmount                                                                             
                                AgPAy = SellAmount - AgPAy;
                                AgPAy = Math.Round(AgPAy, 2);
                            }
                            break;
                        #endregion
                        #region Suppliertype = 4
                        case 4:
                            if (Util.GetBoolean(row["Invoiced"]) != true)
                            {
                                TDS_WS = GetTDSForWS(row);
                                // 1. Minus Supplier GST from SellAmount
                                AgPAy = SellAmount / (100 + Util.GetDecimal(row["SuppGST"])) * 100;
                                // 2. Minus TCS (If Applicable)                                    
                                AgPAy = AgPAy / (100 + Util.GetDecimal(row["TCSPer"])) * 100;
                                // 3. Minus Supplier Tax Amount                                       
                                AgPAy = AgPAy - (SuppTaxAmount * Util.GetDecimal(row["XChangeRate"]));
                                // 4. Get WS + AG Commission on Above             
                                AgPAy = AgPAy * (Markup) / 100;
                                // 5. Minus WS TDS Amount From Above    
                                AgPAy = AgPAy - TDS_WS;
                                // 6. Minus Calculated value from SellAmount                                                                               
                                AgPAy = SellAmount - AgPAy;
                                AgPAy = Math.Round(AgPAy, 2);
                            }
                            else if (Util.GetBoolean(row["Invoiced"]) == true && Util.GetDecimal(row["CommissionAmt"]) == 0)
                            {
                                TDS_WS = GetTDSForWS(row);
                                // 1. Minus Supplier GST from SellAmount
                                AgPAy = SellAmount / (100 + Util.GetDecimal(row["SuppGST"])) * 100;
                                // 2. Minus TCS (If Applicable)                                    
                                AgPAy = AgPAy / (100 + Util.GetDecimal(row["TCSPer"])) * 100;
                                // 3. Minus Supplier Tax Amount                                       
                                AgPAy = AgPAy - (SuppTaxAmount * Util.GetDecimal(row["XChangeRate"]));
                                // 4. Get CommissionPer on Above             
                                AgPAy = AgPAy * (CommissionPer) / 100;
                                // 5. Minus WS TDS Amount From Above    
                                AgPAy = AgPAy - TDS_WS;
                                // 6. Minus Calculated value from SellAmount                                                                               
                                AgPAy = SellAmount - AgPAy;
                                AgPAy = Math.Round(AgPAy, 2);
                            }
                            else if (Util.GetBoolean(row["Invoiced"]) == true && Util.GetDecimal(row["CommissionAmt"]) != 0)
                            {
                                CommPer_From_CommAmt = (CommissionAmt / SellAmount * 100);

                                TDS_WS = GetTDSForWS(row);
                                // 1. Minus Supplier GST from SellAmount
                                AgPAy = SellAmount / (100 + Util.GetDecimal(row["SuppGST"])) * 100;
                                // 2. Minus TCS (If Applicable)                                    
                                AgPAy = AgPAy / (100 + Util.GetDecimal(row["TCSPer"])) * 100;
                                // 3. Minus Supplier Tax Amount                                       
                                AgPAy = AgPAy - (SuppTaxAmount * Util.GetDecimal(row["XChangeRate"]));
                                // 4. Get CommPer_From_CommAmt on Above             
                                AgPAy = AgPAy * (CommPer_From_CommAmt) / 100;
                                // 5. Minus WS TDS Amount From Above    
                                AgPAy = AgPAy - TDS_WS;
                                // 6. Minus Calculated value from SellAmount                                                                               
                                AgPAy = SellAmount - AgPAy;
                                AgPAy = Math.Round(AgPAy, 2);
                            }
                            break;
                        #endregion

                        #region SupplierType = 9,10,12
                        case 10:
                        case 9:
                            //Minus TCS (if Applied)
                            AgPAy = SellAmount / (100 + (Util.GetDecimal(row["TCSPer"]))) * 100;
                            //Get WS + Ag Commission =Q17*(100-(I8+L8))/100
                            AgPAy = AgPAy * (100 - Util.GetDecimal(row["nAgentPer"])) / 100;
                            //Add TCS =Q18*(100+C23)/100
                            AgPAy = AgPAy * (100 + (Util.GetDecimal(row["TCSPer"]))) / 100;
                            //Add Sell Segment Fee
                            AgPAy = AgPAy + GetSellSegmentFee(row);
                            //Final Pay Amount for WS
                            AgPAy = Math.Round(AgPAy, 2);
                            //Take Sell Amount(Without Segment Fee)                            
                            break;
                        case 12:
                            //Take Sell Amount  (Without Segment Fee)
                            //Get Ag Commission
                            AgPAy = SellAmount * (Util.GetDecimal(row["nAgentPer"])) / 100;
                            //Minus above Amount from Sell Amount
                            AgPAy = SellAmount - AgPAy;
                            //Add Sell Segment Fee
                            AgPAy = AgPAy + (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellSegmentXXCharge"]) : Util.GetDecimal(row["SellSegment"]));
                            //Final Pay Amount for Ag
                            AgPAy = Math.Round(AgPAy, 2);
                            break;
                        #endregion
                        case 16:
                        case 17:
                            decimal HqBrAg = Util.GetDecimal(row["nHQPer"]) + Util.GetDecimal(row["nBranchPer"]) + Util.GetDecimal(row["nAgentPer"]);
                            //Take Sell Amount 
                            AgPAy = SellAmount;
                            //Minus HQ + BR + AG Markup
                            AgPAy = AgPAy * (100 - HqBrAg) / 100;
                            //Add AgPer and SellAmt
                            AgPAy = AgPAy + GetSellServiceCharge(row) + GetSellSegmentFee(row);
                            //Final Pay Amount for Ag
                            AgPAy = Math.Round(AgPAy, 2);
                            break;
                    }
                }
                #endregion
                #region Old cal
                else
                {
                    switch (Util.GetInteger(row["SupplierType"]))
                    {
                        #region Suppliertype = 1
                        case 0:
                        case 1:
                            if (Util.GetBoolean(row["Invoiced"]) != true)
                            {
                                AgPAy = SellAmount * ((100 - Markup) / 100);
                            }
                            else if (Util.GetBoolean(row["Invoiced"]) == true && Util.GetDecimal(row["CommissionAmt"]) == 0)
                            {

                                AgPAy = SellAmount * ((100 - CommissionPer) / 100);
                            }
                            else if (Util.GetBoolean(row["Invoiced"]) == true && Util.GetDecimal(row["CommissionAmt"]) != 0)
                            {
                                CommPer_From_CommAmt = (CommissionAmt / SellAmount * 100);
                                AgPAy = SellAmount * ((100 - CommPer_From_CommAmt) / 100);

                            }
                            break;
                        #endregion

                        #region SupplierType = 9,10,12
                        case 10:
                        case 9:
                            //Take Sell Amount(Without Segment Fee)
                            //Minus TCS(if Applied)
                            AgPAy = SellAmount / (100 + (Util.GetDecimal(row["TCSPer"]))) * 100;
                            //Get Ag Commission
                            AgPAy = AgPAy * (Util.GetDecimal(row["nAgentPer"])) / 100;                           
                            //Minus above Amount from Sell Amount
                            AgPAy = SellAmount - AgPAy;
                            //Add Sell Segment Fee                            
                            AgPAy = AgPAy + GetSellSegmentFee(row);
                            //Final Pay Amount for Ag
                            AgPAy = Math.Round(AgPAy, 2);
                            break;
                        case 12:
                            //Take Sell Amount  (Without Segment Fee)
                            //Get Ag Commission
                            AgPAy = SellAmount * (Util.GetDecimal(row["nAgentPer"])) / 100;
                            //Minus above Amount from Sell Amount
                            AgPAy = SellAmount - AgPAy;
                            //Add Sell Segment Fee
                            AgPAy = AgPAy + (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellSegmentXXCharge"]) : Util.GetDecimal(row["SellSegment"]));
                            //Final Pay Amount for Ag
                            AgPAy = Math.Round(AgPAy, 2);
                            break;
                        #endregion
                        case 16:
                        case 17:
                            decimal HqBrAg = Util.GetDecimal(row["nHQPer"]) + Util.GetDecimal(row["nBranchPer"]) + Util.GetDecimal(row["nAgentPer"]);
                            //Take Sell Amount 
                            AgPAy = SellAmount;
                            //Minus HQ + BR + AG Markup
                            AgPAy = AgPAy * (100 - HqBrAg) / 100;
                            //Add AgPer and SellAmt
                            AgPAy = AgPAy + GetSellServiceCharge(row);
                            //Final Pay Amount for Ag
                            AgPAy = Math.Round(AgPAy, 2);
                            break;
                    }
                }
                #endregion

            }
            catch (Exception ex) { }



            return Math.Round(AgPAy, 2);
        }
        //done supp type 1,2,7,8,11,3,4,5,13 and OverSeas - 1
        public decimal GetTaxPaytoGovt(DataRow row)
        {
            decimal TaxPay = 0;
            decimal AgPay = 0;
            decimal SuppNetinSell = 0;
            decimal OurVat = 5;

            decimal GetOttilaToGovt_GSTPay = 0;
            decimal GetOttilaToGovt_TCSPay = 0;
            decimal GetOttilaToGovt_TDSPay = 0;
            decimal GetOttilaToGovt_VATPay = 0;
            //ArrayList SupplierList = new ArrayList() { 12, 15, 52, 21, 58, 77,53 };
            decimal VatPercentforBestBuy = (Util.GetInteger(row["CityId"]) == 989 && Util.GetInteger(row["CountryId"]) == 88) ? Util.GetDecimal(4.49) : Util.GetDecimal(0);
            decimal AgWSMarkup = (Util.GetDecimal(row["nWsPer"]) + Util.GetDecimal(row["nAgentPer"]));
            decimal SellAmount = (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellCancelCharge"]) : Util.GetDecimal(row["SellAmount"]));
            decimal SuppTaxAmount = Util.GetString(row["BookStatus"]) == "UC" ? 0 : (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SuppTaxAmtCharge"]) : Util.GetDecimal(row["SuppTaxAmount"]));

            decimal NetAmount = Util.GetString(row["BookStatus"]) == "UC" ? 0 : (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["NetCancelCharge"]) : Util.GetDecimal(row["NetAmount"]));

            try
            {

                #region New Nell To Sell
                if (Util.GetInteger(row["BookingVersion"]) > 2)
                {
                    switch (Util.GetInteger(row["SupplierType"]))
                    {

                        #region Suppliertype= 1                                          
                        case 1:
                            #region OverSeas
                            if (Util.GetBoolean(row["IsOverSeas"]) == true)
                            {
                                #region OverSeas-Offline
                                if (Util.GetInteger(row["SourceId"]) != 1)
                                {
                                    // 1.Minus WS + AG MarkUp From SellAmount 
                                    GetOttilaToGovt_VATPay = SellAmount * (100 - (AgWSMarkup)) / 100;
                                    // 2.Take VAT on Above  
                                    GetOttilaToGovt_VATPay = GetOttilaToGovt_VATPay - (GetOttilaToGovt_VATPay / (100 + Convert.ToDecimal(row["OurVat"])) * 100);
                                    GetOttilaToGovt_VATPay = Math.Round(GetOttilaToGovt_VATPay, 2);
                                    TaxPay = GetOttilaToGovt_VATPay;
                                }
                                #endregion
                                #region OverSeas-Online                            
                                else if (Util.GetInteger(row["SourceId"]) == 1)
                                {
                                    if (Util.GetString(row["ServiceType"]) == "H" /*&& tblBookGSTInfoDate*/) /*date condition pending*/
                                    {
                                        //our VAT is DB based
                                        if (Util.GetInteger(row["SupType"]) != 1 && Util.GetInteger(row["SourceId"]) == 1 && Util.GetInteger(row["SupplierId"]) == 5537)
                                        {
                                            AgPay = GetAgPay(row);
                                            TaxPay = (AgPay - (AgPay / ((100 + Convert.ToDecimal(row["OurVat"])) / 100)));
                                        }
                                        else if (Util.GetBoolean(row["DMCCSuppliersTYpe"]) == true)
                                        {
                                            AgPay = GetAgPay(row);
                                            // TaxPay = AgPay - (AgPay / ((100 + Convert.ToDecimal(row["OurVat"])) / 100)) - (GetSupplierNetinSell(row) - (GetSupplierNetinSell(row) / (100 + Util.GetDecimal(row["SupplierVat"])) * 100));
                                            TaxPay = AgPay - (AgPay / ((100 + Convert.ToDecimal(row["OurVat"])) / 100));
                                        }
                                        else
                                        {
                                            AgPay = GetAgPay(row);
                                            TaxPay = AgPay - ((AgPay) / ((100 + Convert.ToDecimal(row["OurVat"])) / 100));
                                        }
                                    }
                                    else
                                    {
                                        if (Util.GetBoolean(row["IsVATApplicable"]) == true)
                                        {
                                            //Our VAT Hardcoded
                                            if (Util.GetInteger(row["SupType"]) != 1 && Util.GetInteger(row["SourceId"]) == 1 && Util.GetInteger(row["SupplierId"]) == 5537)
                                            {
                                                AgPay = GetAgPay(row);
                                                TaxPay = (AgPay - (AgPay / ((100 + OurVat) / 100)));
                                            }
                                            else if (Util.GetBoolean(row["DMCCSuppliersTYpe"]) == true)
                                            {
                                                AgPay = GetAgPay(row);
                                                //  TaxPay = AgPay - (AgPay / ((100 + OurVat) / 100)) - (GetSupplierNetinSell(row) - (GetSupplierNetinSell(row) / (100 + Util.GetDecimal(row["SupplierVat"])) * 100));
                                                TaxPay = AgPay - (AgPay / ((100 + OurVat) / 100));
                                            }
                                            else
                                            {
                                                AgPay = GetAgPay(row);
                                                TaxPay = AgPay - ((AgPay) / ((100 + OurVat) / 100));
                                            }
                                        }
                                        else
                                        {
                                            TaxPay = 0;
                                        }
                                    }
                                }
                                #endregion
                            }
                            #endregion

                            #region Ottila
                            else
                            {
                                // 1. Minus WS + AG MarkUp From SellAmount  
                                GetOttilaToGovt_GSTPay = SellAmount * (100 - (AgWSMarkup)) / 100;
                                // 2. Minus TCS From SellAmount                                                                                                                                                                                                                 
                                GetOttilaToGovt_GSTPay = GetOttilaToGovt_GSTPay / (100 + Util.GetDecimal(row["TCSPer"])) * 100;
                                // 3. Minus Ottila Pay to Supplier                                   
                                GetOttilaToGovt_GSTPay = GetOttilaToGovt_GSTPay - ((GetOttilaToSupplierPay(row)) * Util.GetDecimal(row["XChangeRate"]));
                                // 4. Take GST on Above                                                          
                                GetOttilaToGovt_GSTPay = GetOttilaToGovt_GSTPay - (GetOttilaToGovt_GSTPay / (100 + Util.GetDecimal((row["TaxPer"]))) * 100);
                                GetOttilaToGovt_GSTPay = Math.Round(GetOttilaToGovt_GSTPay, 2);

                                // 1.Minus WS + AG MarkUp From SellAmount 
                                GetOttilaToGovt_TCSPay = SellAmount * (100 - (AgWSMarkup)) / 100;
                                // 2.Take TCS on Above
                                GetOttilaToGovt_TCSPay = GetOttilaToGovt_TCSPay - (GetOttilaToGovt_TCSPay / (100 + Util.GetDecimal((row["TCSPer"]))) * 100);
                                GetOttilaToGovt_TCSPay = Math.Round(GetOttilaToGovt_TCSPay, 2);

                                TaxPay = GetOttilaToGovt_GSTPay + GetOttilaToGovt_TCSPay;
                            }
                            #endregion
                            break;
                        #endregion
                        #region Suppliertype= 2,7,11,13                
                        case 2:
                        case 7:
                        case 11:
                        case 13:
                            #region OverSeas and Ottila Same 

                            // 1.Minus WS + AG MarkUp From SellAmount
                            GetOttilaToGovt_GSTPay = SellAmount * (100 - (AgWSMarkup)) / 100;
                            // 2.Minus TCS From SellAmount                                                                                                                                                                                                                           
                            GetOttilaToGovt_GSTPay = GetOttilaToGovt_GSTPay / (100 + (Util.GetDecimal((row["TCSPer"])))) * 100;
                            // 3.Get Ottila GST                                    
                            GetOttilaToGovt_GSTPay = GetOttilaToGovt_GSTPay - (GetOttilaToGovt_GSTPay / (100 + Util.GetDecimal((row["TaxPer"]))) * 100);
                            // 3.Take 2 Digit RoundOff               
                            GetOttilaToGovt_GSTPay = Math.Round(GetOttilaToGovt_GSTPay, 2);


                            // 1.Minus WS + AG MarkUp From SellAmount 
                            GetOttilaToGovt_TCSPay = SellAmount * (100 - (AgWSMarkup)) / 100;
                            // 2.Take TCS on Above                                                  
                            GetOttilaToGovt_TCSPay = GetOttilaToGovt_TCSPay - (GetOttilaToGovt_TCSPay / (100 + Util.GetDecimal((row["TCSPer"]))) * 100);
                            GetOttilaToGovt_TCSPay = Math.Round(GetOttilaToGovt_TCSPay, 2);

                            TaxPay = GetOttilaToGovt_GSTPay + GetOttilaToGovt_TCSPay;

                            #endregion
                            break;
                        #endregion
                        #region Suppliertype= 8                                        
                        case 8:
                            #region OverSeas and Ottila Same

                            decimal GetRebateFromSupplierNet = GetRebateFromSupplier(row);
                            decimal RebateFromSupp_Sell = Math.Round(GetRebateFromSupplierNet * Util.GetDecimal(row["XChangeRate"]), 2);

                            // 1.Minus WS + AG MarkUp From SellAmount
                            GetOttilaToGovt_GSTPay = SellAmount * (100 - (AgWSMarkup)) / 100;
                            // 2.Minus TCS From SellAmount                                                 
                            GetOttilaToGovt_GSTPay = GetOttilaToGovt_GSTPay / (100 + (Util.GetDecimal((row["TCSPer"])))) * 100;
                            // 3.Get Ottila GST                                                                                                                                                                                                            
                            GetOttilaToGovt_GSTPay = GetOttilaToGovt_GSTPay - (GetOttilaToGovt_GSTPay / (100 + Util.GetDecimal((row["TaxPer"]))) * 100);
                            // 4.Add Rebate From Supplier               
                            GetOttilaToGovt_GSTPay = GetOttilaToGovt_GSTPay + RebateFromSupp_Sell;
                            // 5.Take 2 Digit RoundOff                                                                  
                            GetOttilaToGovt_GSTPay = Math.Round(GetOttilaToGovt_GSTPay, 2);

                            // 1.Minus WS + AG MarkUp From SellAmount 
                            GetOttilaToGovt_TCSPay = SellAmount * (100 - (AgWSMarkup)) / 100;
                            // 2.Take TCS on Above
                            GetOttilaToGovt_TCSPay = GetOttilaToGovt_TCSPay - (GetOttilaToGovt_TCSPay / (100 + Util.GetDecimal((row["TCSPer"]))) * 100);
                            GetOttilaToGovt_TCSPay = Math.Round(GetOttilaToGovt_TCSPay, 2);

                            TaxPay = GetOttilaToGovt_GSTPay + GetOttilaToGovt_TCSPay;

                            #endregion
                            break;
                        #endregion
                        #region Suppliertype= 3                                          
                        case 3:
                            #region OverSeas
                            if (Util.GetBoolean(row["IsOverSeas"]) == true)
                            {

                                TaxPay = 0;

                            }
                            #endregion
                            #region Ottila
                            else
                            {
                                // 1. Get SellAmount
                                GetOttilaToGovt_GSTPay = SellAmount;
                                // 2. Minus TCS (If Applied)                                                                              
                                GetOttilaToGovt_GSTPay = GetOttilaToGovt_GSTPay / (100 + Util.GetDecimal(row["TCSPer"])) * 100;
                                // 3. Minus Supplier Tax Amount                               
                                GetOttilaToGovt_GSTPay = GetOttilaToGovt_GSTPay - (SuppTaxAmount * Util.GetDecimal(row["XChangeRate"]));
                                // 4. Get Suplier Commission on SellAmount                     
                                GetOttilaToGovt_GSTPay = GetOttilaToGovt_GSTPay * Util.GetDecimal(row["SuppComm"]) / 100;
                                // 5. Get Ottila GST on Above                          
                                GetOttilaToGovt_GSTPay = GetOttilaToGovt_GSTPay - (GetOttilaToGovt_GSTPay / (100 + Util.GetDecimal(row["TaxPer"])) * 100);
                                GetOttilaToGovt_GSTPay = Math.Round(GetOttilaToGovt_GSTPay, 2);


                                // 1. Get SellAmount
                                GetOttilaToGovt_TCSPay = SellAmount;
                                // 2. Get TCS Tax Amount                                                                             
                                GetOttilaToGovt_TCSPay = GetOttilaToGovt_TCSPay - (GetOttilaToGovt_TCSPay / (100 + Util.GetDecimal(row["TCSPer"])) * 100);
                                GetOttilaToGovt_TCSPay = Math.Round(GetOttilaToGovt_TCSPay, 2);


                                // 1. Minus TCS From SellAmount
                                GetOttilaToGovt_TDSPay = SellAmount / (100 + Util.GetDecimal(row["TCSPer"])) * 100;
                                // 2. Minus Supplier Tax Amount                                            
                                GetOttilaToGovt_TDSPay = GetOttilaToGovt_TDSPay - (SuppTaxAmount * Util.GetDecimal(row["XChangeRate"]));
                                // 3. Get WS+AG Commission on Above                            
                                GetOttilaToGovt_TDSPay = GetOttilaToGovt_TDSPay * (AgWSMarkup) / 100;
                                // 4. Minus AG Tax GST on Above                           
                                GetOttilaToGovt_TDSPay = GetOttilaToGovt_TDSPay / (100 + Util.GetDecimal(row["AgInvGST"])) * 100;
                                // 5. Get TDS on Above                                  
                                GetOttilaToGovt_TDSPay = GetOttilaToGovt_TDSPay * Util.GetDecimal(row["TDS"]) / 100;
                                GetOttilaToGovt_TDSPay = Math.Round(GetOttilaToGovt_TDSPay, 2);

                                TaxPay = GetOttilaToGovt_GSTPay + GetOttilaToGovt_TCSPay + GetOttilaToGovt_TDSPay;
                            }
                            #endregion
                            break;
                        #endregion
                        #region Suppliertype= 4                                          
                        case 4:
                            #region OverSeas and Ottila Same


                            // 1. Minus Suplier GST from SellAmount
                            GetOttilaToGovt_GSTPay = SellAmount / (100 + Util.GetDecimal(row["SuppGST"])) * 100;
                            // 2. Minus TCS (If Applied)                              
                            GetOttilaToGovt_GSTPay = GetOttilaToGovt_GSTPay / (100 + Util.GetDecimal(row["TCSPer"])) * 100;
                            // 3. Minus Supplier Tax Amount                           
                            GetOttilaToGovt_GSTPay = GetOttilaToGovt_GSTPay - (SuppTaxAmount * Util.GetDecimal(row["XChangeRate"]));
                            // 4. Get Suplier Commission on Above               
                            GetOttilaToGovt_GSTPay = GetOttilaToGovt_GSTPay * Util.GetDecimal(row["SuppComm"]) / 100;
                            // 5. Get Ottila GST on Above                              
                            GetOttilaToGovt_GSTPay = GetOttilaToGovt_GSTPay * Util.GetDecimal(row["TaxPer"]) / 100;
                            GetOttilaToGovt_GSTPay = Math.Round(GetOttilaToGovt_GSTPay, 2);


                            // 1. Get SellAmount
                            GetOttilaToGovt_TCSPay = SellAmount;
                            // 2. Get TCS Tax Amount                                                                               
                            GetOttilaToGovt_TCSPay = GetOttilaToGovt_TCSPay - (GetOttilaToGovt_TCSPay / (100 + Util.GetDecimal(row["TCSPer"])) * 100);
                            GetOttilaToGovt_TCSPay = Math.Round(GetOttilaToGovt_TCSPay, 2);


                            // 1. Minus Supplier GST From SellAmount
                            GetOttilaToGovt_TDSPay = SellAmount / (100 + Util.GetDecimal(row["SuppGST"])) * 100;
                            // 2. Minus TCS From SellAmount (If Applied)                                         
                            GetOttilaToGovt_TDSPay = GetOttilaToGovt_TDSPay / (100 + Util.GetDecimal(row["TCSPer"])) * 100;
                            // 3. Minus Supplier Tax Amount                                       
                            GetOttilaToGovt_TDSPay = GetOttilaToGovt_TDSPay - (SuppTaxAmount * Util.GetDecimal(row["XChangeRate"]));
                            // 4. Get WS+AG Commission on Above                             
                            GetOttilaToGovt_TDSPay = GetOttilaToGovt_TDSPay * (AgWSMarkup) / 100;
                            // 5. Minus AG Tax GST on Above                           
                            GetOttilaToGovt_TDSPay = GetOttilaToGovt_TDSPay / (100 + Util.GetDecimal(row["AgInvGST"])) * 100;
                            // 6. Get TDS on Above                                 
                            GetOttilaToGovt_TDSPay = GetOttilaToGovt_TDSPay * Util.GetDecimal(row["TDS"]) / 100;
                            GetOttilaToGovt_TDSPay = Math.Round(GetOttilaToGovt_TDSPay, 2);

                            TaxPay = GetOttilaToGovt_GSTPay + GetOttilaToGovt_TCSPay + GetOttilaToGovt_TDSPay;

                            #endregion
                            break;
                        #endregion
                        #region Suppliertype= 5                                          
                        case 5:
                            #region OverSeas and Ottila Same

                            decimal SupplierPay = GetOttilaToSupplierPay(row);
                            decimal SupplierPay_Sell = Math.Round(SupplierPay * Util.GetDecimal(row["XChangeRate"]), 2);

                            // 1. Minus WS + AG MarkUp From SellAmount
                            GetOttilaToGovt_GSTPay = SellAmount * (100 - (AgWSMarkup)) / 100;
                            // 2. Minus TCS (If Applied) 
                            GetOttilaToGovt_GSTPay = GetOttilaToGovt_GSTPay / (100 + Util.GetDecimal(row["TCSPer"])) * 100;
                            // 3. Minsu Above from Supplier Pay in Sell Currency 
                            GetOttilaToGovt_GSTPay = GetOttilaToGovt_GSTPay - SupplierPay_Sell;
                            // 4. Get Ottila GST on Above                                                       
                            GetOttilaToGovt_GSTPay = GetOttilaToGovt_GSTPay - (GetOttilaToGovt_GSTPay / (100 + Util.GetDecimal(row["TaxPer"])) * 100);
                            GetOttilaToGovt_GSTPay = Math.Round(GetOttilaToGovt_GSTPay, 2);


                            // 1.Minus WS + AG MarkUp From SellAmount  
                            GetOttilaToGovt_TCSPay = SellAmount * (100 - (AgWSMarkup)) / 100;
                            // 2.Take TCS on Above                                                  
                            GetOttilaToGovt_TCSPay = GetOttilaToGovt_TCSPay - (GetOttilaToGovt_TCSPay / (100 + Util.GetDecimal((row["TCSPer"]))) * 100);
                            GetOttilaToGovt_TCSPay = Math.Round(GetOttilaToGovt_TCSPay, 2);



                            TaxPay = GetOttilaToGovt_GSTPay + GetOttilaToGovt_TCSPay;

                            #endregion
                            break;
                        #endregion
                        #region Suppliertype= 15   
                        case 15:
                            GetOttilaToGovt_GSTPay = SellAmount * (100 - (AgWSMarkup)) / 100;
                            GetOttilaToGovt_GSTPay = GetOttilaToGovt_GSTPay - (GetOttilaToGovt_GSTPay / (100 + Util.GetDecimal((row["TaxPer"]))) * 100);
                            TaxPay = Math.Round(GetOttilaToGovt_GSTPay, 2);
                            break;
                        #endregion
                        #region Suppliertype= 10,12   
                        case 9:
                        case 10:
                            //Get GST 
                            GetOttilaToGovt_GSTPay = SellAmount;
                            GetOttilaToGovt_GSTPay = (GetOttilaToGovt_GSTPay / (100 + Util.GetDecimal((row["TCSPer"]))) * 100);  
                            GetOttilaToGovt_GSTPay = (GetOttilaToGovt_GSTPay * (Util.GetDecimal(row["nHQPer"]) + Util.GetDecimal(row["nBranchPer"]))) / 100;
                            GetOttilaToGovt_GSTPay = GetOttilaToGovt_GSTPay- (GetOttilaToGovt_GSTPay /(100+ Util.GetDecimal((row["TaxPer"])))) * 100;                          
                            GetOttilaToGovt_GSTPay = Math.Round(GetOttilaToGovt_GSTPay, 2);

                            //Get TCS
                            decimal GetOttilaToGovt_TCSPayOnSell = SellAmount;//=Q77*(100-(I8+L8))/100
                            GetOttilaToGovt_TCSPayOnSell = GetOttilaToGovt_TCSPayOnSell * (100 - (AgWSMarkup)) / 100;
                            GetOttilaToGovt_TCSPayOnSell = GetOttilaToGovt_TCSPayOnSell - (GetOttilaToGovt_TCSPayOnSell / (100 + Util.GetDecimal((row["TCSPer"]))) * 100);
                            //Segment GST
                            
                            decimal GetOttilaToGovt_TCSPaySellSeg = Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellSegmentXXCharge"]) : Util.GetDecimal(row["SellSegment"]);
                            GetOttilaToGovt_TCSPaySellSeg = GetOttilaToGovt_TCSPaySellSeg - (GetOttilaToGovt_TCSPaySellSeg / (100 + Util.GetDecimal((row["TCSPer"]))) * 100);
                            //Total GST = sellamt gst + segment GSt
                            GetOttilaToGovt_TCSPay = GetOttilaToGovt_TCSPayOnSell + GetOttilaToGovt_TCSPaySellSeg;

                            //Get SegGST                        
                            decimal GetOttilaToGovt_GSTPayOnSegement = Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellSegmentXXCharge"]) : Util.GetDecimal(row["SellSegment"]);
                            GetOttilaToGovt_GSTPayOnSegement = GetOttilaToGovt_GSTPayOnSegement * Util.GetDecimal((row["TaxPer"])) / 100;
                            
                            //Final Tax Pay
                            TaxPay = GetOttilaToGovt_GSTPay + GetOttilaToGovt_TCSPay + GetOttilaToGovt_GSTPayOnSegement+ GetOttilaToGovt_TDSPay;
                            break;
                        case 12:
                            GetOttilaToGovt_GSTPay = SellAmount * (100 - (AgWSMarkup)) / 100;
                            GetOttilaToGovt_GSTPay = (GetOttilaToGovt_GSTPay / (100 + Util.GetDecimal((row["TCSPer"]))) * 100);
                            GetOttilaToGovt_GSTPay = (GetOttilaToGovt_GSTPay - (NetAmount * ((100-Util.GetDecimal(row["SuppComm"]))/100) * Util.GetDecimal(row["XChangeRate"])));
                            GetOttilaToGovt_GSTPay =  (GetOttilaToGovt_GSTPay * Util.GetDecimal((row["TaxPer"])) / 100);
                            GetOttilaToGovt_GSTPay = Math.Round(GetOttilaToGovt_GSTPay, 2);


                            decimal GetOttilaToGovt_TCSPayOnSell1 = SellAmount;
                            GetOttilaToGovt_TCSPayOnSell = GetOttilaToGovt_TCSPayOnSell1 - (GetOttilaToGovt_TCSPayOnSell1 / (100 + Util.GetDecimal((row["TCSPer"]))) * 100);

                            decimal GetOttilaToGovt_TCSPaySellSeg1 = Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellSegmentXXCharge"]) : Util.GetDecimal(row["SellSegment"]);
                            GetOttilaToGovt_TCSPaySellSeg = GetOttilaToGovt_TCSPaySellSeg1 - (GetOttilaToGovt_TCSPaySellSeg1 / (100 + Util.GetDecimal((row["TCSPer"]))) * 100);

                            GetOttilaToGovt_TCSPay = GetOttilaToGovt_TCSPayOnSell + GetOttilaToGovt_TCSPaySellSeg;



                            decimal GetOttilaToGovt_GSTPayOnSegement1 = Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellSegmentXXCharge"]) : Util.GetDecimal(row["SellSegment"]);
                            GetOttilaToGovt_GSTPayOnSegement = GetOttilaToGovt_GSTPayOnSegement1  - (GetOttilaToGovt_GSTPayOnSegement1 /(100 + Util.GetDecimal((row["TaxPer"])))*100);


                            TaxPay = GetOttilaToGovt_GSTPay + GetOttilaToGovt_TCSPay + GetOttilaToGovt_GSTPayOnSegement;
                            break;
                        #endregion
                        
                        case 16:                            
                        case 17:
                            decimal OttilaPaytoGovSegTCS = 0;
                            //Ottila To Government  - TCS [Sell Currency]
                            //Ottila To Government - GST [Sell Currency]
                            //Ottila To Government  - Segment TCS [Sell Currency] =(Q101-(Q101/(100+F14)*100))
                            OttilaPaytoGovSegTCS = Math.Round(Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellSegmentXXChargeGST"]) : Util.GetDecimal(row["SellSegmentGST"]), 2);                            
                            OttilaPaytoGovSegTCS = OttilaPaytoGovSegTCS - (OttilaPaytoGovSegTCS / (100 + Util.GetDecimal(row["TCSPer"])) * 100);
                            OttilaPaytoGovSegTCS=Math.Round(OttilaPaytoGovSegTCS,2);
                            TaxPay = GetOttilaToGvtTCS(row) + GetOttilaToGvtBOSGST(row)+ GetOttilaToGvtSegGST(row)+ OttilaPaytoGovSegTCS;                           
                            break;
                    }

                    //as per discuss RebateFromGovtinSell minus from TAX
                    decimal GetTotalRebateFromGovtNet = TotalRebateFromGovt(row);// Need to Discussion with Rupesh sir In Sheet Not Minus Rebate in Tax pay
                    TaxPay = TaxPay - GetTotalRebateFromGovtNet;
                    
                }
                #endregion
                #region Old cal
                else
                {

                    switch (Util.GetInteger(row["SupplierType"]))
                    {
                        #region Suppliertype = 1
                        case 0:
                        case 1:
                            #region OverSeas
                            if (Util.GetBoolean(row["IsOverSeas"]) == true)
                            {
                                #region Fze Br (OverSeas VAT)
                                if (Util.GetBoolean(row["IsVATApplicable"]) == true)
                                {
                                    // if (SupplierList.Contains(Util.GetInteger(row["SupplierId"])))
                                    if (Util.GetBoolean(row["DMCCSuppliersTYpe"]) == true)
                                    {
                                        //(( Ag|Ws Payable) - [( Ag|Ws Payable) / ((100 +ourVat)/100)]) -{ NetAmount -  {NetAmount / (100+Supp.VAT)*100}} 
                                        AgPay = GetAgPay(row);
                                        TaxPay = AgPay - (AgPay / ((100 + OurVat) / 100)) - (GetSupplierNetinSell(row) - (GetSupplierNetinSell(row) / (100 + Util.GetDecimal(row["SupplierVat"])) * 100));
                                    }
                                    //here need one more condition for hotelrackid and type = 4?
                                    else if (Util.GetInteger(row["SupType"]) != 1 && Util.GetInteger(row["SourceId"]) == 1 && Util.GetInteger(row["SupplierId"]) == 5537)
                                    {
                                        //(( Ag|Ws Payable) - [( Ag|Ws Payable) / ((100 +ourVat)/100)]) -{ NetAmount -  {NetAmount - (NetAmount * (VatPercent) /100 )}}  
                                        AgPay = GetAgPay(row);
                                        TaxPay = (AgPay - (AgPay / ((100 + OurVat) / 100))) - (GetSupplierNetinSell(row) - (GetSupplierNetinSell(row) - (GetSupplierNetinSell(row) * VatPercentforBestBuy / 100)));
                                    }
                                    else
                                    {
                                        //( Ag|Ws Payable) - [( Ag|Ws Payable) / 1.05]
                                        AgPay = GetAgPay(row);
                                        TaxPay = AgPay - ((AgPay) / ((100 + OurVat) / 100));
                                    }



                                }
                                #endregion
                                #region Other then VAT 
                                else
                                {
                                    TaxPay = 0;
                                }
                                #endregion
                            }
                            #endregion
                            #region Ottila
                            else
                            {
                                //( Ag|Ws Payable - Supplier Net in Sell Currency ) * 0.18
                                AgPay = GetAgPay(row);
                                SuppNetinSell = GetSupplierNetinSell(row);
                                TaxPay = (AgPay - SuppNetinSell) * Util.GetDecimal(0.18);
                            }
                            #endregion
                            break;
                        #endregion                                   
                        case 10:
                        case 12:
                            GetOttilaToGovt_GSTPay = SellAmount * (100 - (AgWSMarkup)) / 100;
                            GetOttilaToGovt_GSTPay = (GetOttilaToGovt_GSTPay / (100 + Util.GetDecimal((row["TCSPer"]))) * 100);
                            GetOttilaToGovt_GSTPay = (GetOttilaToGovt_GSTPay - (NetAmount * ((100 - Util.GetDecimal(row["SuppComm"])) / 100) * Util.GetDecimal(row["XChangeRate"])));
                            GetOttilaToGovt_GSTPay = (GetOttilaToGovt_GSTPay * Util.GetDecimal((row["TaxPer"])) / 100);
                            GetOttilaToGovt_GSTPay = Math.Round(GetOttilaToGovt_GSTPay, 2);


                            decimal GetOttilaToGovt_TCSPayOnSell = SellAmount;
                            GetOttilaToGovt_TCSPayOnSell = GetOttilaToGovt_TCSPayOnSell - (GetOttilaToGovt_TCSPayOnSell / (100 + Util.GetDecimal((row["TCSPer"]))) * 100);

                            decimal GetOttilaToGovt_TCSPaySellSeg = (Util.GetDecimal(row["SellSegment"]));
                            GetOttilaToGovt_TCSPaySellSeg = GetOttilaToGovt_TCSPaySellSeg - (GetOttilaToGovt_TCSPaySellSeg / (100 + Util.GetDecimal((row["TCSPer"]))) * 100);

                            GetOttilaToGovt_TCSPay = GetOttilaToGovt_TCSPayOnSell + GetOttilaToGovt_TCSPaySellSeg;



                            decimal GetOttilaToGovt_GSTPayOnSegement = (Util.GetDecimal(row["SellSegment"]));
                            GetOttilaToGovt_GSTPayOnSegement = GetOttilaToGovt_GSTPayOnSegement - (GetOttilaToGovt_GSTPayOnSegement / (100 + Util.GetDecimal((row["TaxPer"]))) * 100);


                            TaxPay = GetOttilaToGovt_GSTPay + GetOttilaToGovt_TCSPay + GetOttilaToGovt_GSTPayOnSegement;
                            break;
                          
                          

                    }
                }
                #endregion

            }
            catch (Exception ex) { }

            return Math.Round(TaxPay, 2);
        }
        //done for supp type 1,2,7,8,11 and OverSeas - 1
        public decimal GetHQExtraQuote(DataRow row)
        {
            decimal HqQuoteAmt = Util.GetDecimal(0.00);
            decimal AgWsMarkup = 0; decimal BrMarkup = 0;
            decimal HqExtraQuote = 0;
            decimal CommissionPer = 0;
            decimal CommissionAmt = 0;
            int GSTVAT = 0;
            decimal CommPer_From_CommAmt = 0;
            decimal SellAmount = (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellCancelCharge"]) : Util.GetDecimal(row["SellAmount"]));

            HqExtraQuote = Util.GetString(row["BookStatus"]) != "XX" ? Util.GetDecimal(row["HqExtraQuote"]) : Util.GetDecimal(row["XXHqExtraQuote"]);
            AgWsMarkup = (Util.GetDecimal(row["nWsPer"]) + Util.GetDecimal(row["nAgentPer"]));
            BrMarkup = Util.GetDecimal(row["nBranchPer"]);
            CommissionPer = Util.GetDecimal(row["CommissionPer"]);
            CommissionAmt = Util.GetDecimal(row["CommissionAmt"]);
            bool IsDirectBranch = Util.GetBoolean(row["IsDirectBranch"]);

            if (Util.GetBoolean(row["IsOverSeas"]) == true)
            {
                if (Util.GetBoolean(row["IsVATApplicable"]) == true)
                {
                    GSTVAT = 5;
                }
            }
            else
            {
                GSTVAT = 18;
            }


            try
            {
                #region New Nell To Sell
                if (Util.GetInteger(row["BookingVersion"]) > 2)
                {
                    #region Ottila
                    if (Util.GetBoolean(row["IsOverSeas"]) != true)
                    {
                        switch (Util.GetInteger(row["SupplierType"]))
                        {
                            #region Suppliertype = 1,2,7,8,11,15
                            case 1:
                            case 2:
                            case 7:
                            case 8:
                            case 11:
                            case 15:
                                if (Util.GetBoolean(row["Invoiced"]) != true)
                                {
                                    // 1. Take HQ Extra Quote Amount
                                    // 2. Minus WS + AG MarkUp From Above    
                                    HqQuoteAmt = HqExtraQuote * (100 - (AgWsMarkup)) / 100; /// As Per Discussion With Rupesh sir change the brackets
                                    // 3. Minus BR MarkUp From Above                                                                                                                                                       
                                    HqQuoteAmt = HqQuoteAmt * (100 - BrMarkup) / 100;
                                    // 4. Minus TCS                                                                           
                                    HqQuoteAmt = HqQuoteAmt / (100 + (Util.GetDecimal(row["TCSPer"]))) * 100;
                                    // 5. Minus GST                                                      
                                    HqQuoteAmt = HqQuoteAmt / (100 + (Util.GetDecimal(row["TaxPer"]))) * 100;
                                    HqQuoteAmt = Math.Round(HqQuoteAmt, 2);

                                }
                                else if (Util.GetBoolean(row["Invoiced"]) == true && Util.GetDecimal(row["CommissionAmt"]) == 0)
                                {
                                    // 1. Take HQ Extra Quote Amount
                                    // 2. Minus CommissionPer From Above
                                    HqQuoteAmt = HqExtraQuote * (100 - CommissionPer) / 100;
                                    // 3. Minus BR MarkUp From Above
                                    HqQuoteAmt = HqQuoteAmt * (100 - BrMarkup) / 100;
                                    // 4. Minus TCS                                                                             
                                    HqQuoteAmt = HqQuoteAmt / (100 + (Util.GetDecimal(row["TCSPer"]))) * 100;
                                    // 5. Minus GST                                                     
                                    HqQuoteAmt = HqQuoteAmt / (100 + (Util.GetDecimal(row["TaxPer"]))) * 100;
                                    HqQuoteAmt = Math.Round(HqQuoteAmt, 2);

                                }
                                else if (Util.GetBoolean(row["Invoiced"]) == true && Util.GetDecimal(row["CommissionAmt"]) != 0)
                                {
                                    CommPer_From_CommAmt = (CommissionAmt / SellAmount * 100);

                                    // 1. Take HQ Extra Quote Amount
                                    // 2. Minus CommPer_From_CommAmt From Above
                                    HqQuoteAmt = HqExtraQuote * ((100 - CommPer_From_CommAmt) / 100);
                                    // 3. Minus BR MarkUp From Above
                                    HqQuoteAmt = HqQuoteAmt * (100 - BrMarkup) / 100;
                                    // 4. Minus TCS                                                                             
                                    HqQuoteAmt = HqQuoteAmt / (100 + (Util.GetDecimal(row["TCSPer"]))) * 100;
                                    // 5. Minus GST                                                        
                                    HqQuoteAmt = HqQuoteAmt / (100 + (Util.GetDecimal(row["TaxPer"]))) * 100;
                                    HqQuoteAmt = Math.Round(HqQuoteAmt, 2);
                                }



                                break;
                                #endregion
                        }
                    }
                    #endregion
                    #region OverSeas
                    else
                    {
                        switch (Util.GetInteger(row["SupplierType"]))
                        {
                            case 1:

                                // 1. Take HQ Extra Quote Amount
                                // 2. Minus WS + AG MarkUp From Above
                                HqQuoteAmt = HqExtraQuote * (100 - (AgWsMarkup)) / 100;
                                // 3. Minus BR MarkUp From Above                                                                                       
                                HqExtraQuote = HqExtraQuote * (100 - (!IsDirectBranch ? BrMarkup : 0)) / 100;
                                // 4. Minus Our VAT                                         
                                HqQuoteAmt = HqExtraQuote / (100 + (Util.GetDecimal(row["OurVat"]))) * 100;
                                //// 5. Add Supp VAT                                          
                                //HqQuoteAmt = HqExtraQuote * (100 + (Util.GetDecimal(row["SupplierVat"]))) / 100;                                          
                                HqQuoteAmt = Math.Round(HqExtraQuote, 2);
                                break;
                            case 2:
                            case 7:
                            case 8:
                            case 11:
                                if (Util.GetBoolean(row["Invoiced"]) != true)
                                {
                                    // 1. Take HQ Extra Quote Amount
                                    // 2. Minus WS + AG MarkUp From Above    
                                    HqQuoteAmt = HqExtraQuote * (100 - (AgWsMarkup) / 100);
                                    // 3. Minus BR MarkUp From Above                                                                                                                                                       
                                    HqQuoteAmt = HqQuoteAmt * (100 - BrMarkup) / 100;
                                    // 4. Minus TCS                                                                           
                                    HqQuoteAmt = HqQuoteAmt / (100 + (Util.GetDecimal(row["TCSPer"]))) * 100;
                                    // 5. Minus GST                                                      
                                    HqQuoteAmt = HqQuoteAmt / (100 + (Util.GetDecimal(row["TaxPer"]))) * 100;
                                    HqQuoteAmt = Math.Round(HqQuoteAmt, 2);

                                }
                                else if (Util.GetBoolean(row["Invoiced"]) == true && Util.GetDecimal(row["CommissionAmt"]) == 0)
                                {
                                    // 1. Take HQ Extra Quote Amount
                                    // 2. Minus CommissionPer From Above
                                    HqQuoteAmt = HqExtraQuote * (100 - CommissionPer) / 100;
                                    // 3. Minus BR MarkUp From Above
                                    HqQuoteAmt = HqQuoteAmt * (100 - BrMarkup) / 100;
                                    // 4. Minus TCS                                                                             
                                    HqQuoteAmt = HqQuoteAmt / (100 + (Util.GetDecimal(row["TCSPer"]))) * 100;
                                    // 5. Minus GST                                                     
                                    HqQuoteAmt = HqQuoteAmt / (100 + (Util.GetDecimal(row["TaxPer"]))) * 100;
                                    HqQuoteAmt = Math.Round(HqQuoteAmt, 2);

                                }
                                else if (Util.GetBoolean(row["Invoiced"]) == true && Util.GetDecimal(row["CommissionAmt"]) != 0)
                                {
                                    CommPer_From_CommAmt = (CommissionAmt / SellAmount * 100);

                                    // 1. Take HQ Extra Quote Amount
                                    // 2. Minus CommPer_From_CommAmt From Above
                                    HqQuoteAmt = HqExtraQuote * ((100 - CommPer_From_CommAmt) / 100);
                                    // 3. Minus BR MarkUp From Above
                                    HqQuoteAmt = HqQuoteAmt * (100 - BrMarkup) / 100;
                                    // 4. Minus TCS                                                                             
                                    HqQuoteAmt = HqQuoteAmt / (100 + (Util.GetDecimal(row["TCSPer"]))) * 100;
                                    // 5. Minus GST                                                        
                                    HqQuoteAmt = HqQuoteAmt / (100 + (Util.GetDecimal(row["TaxPer"]))) * 100;
                                    HqQuoteAmt = Math.Round(HqQuoteAmt, 2);
                                }
                                break;
                            case 16:
                            case 17:
                                //Take HQ Extra Quote Amount
                                //Minus AG + WS Markup 
                                HqQuoteAmt = HqExtraQuote * ((100 - AgWsMarkup) / 100);
                                //Minus BR Markup
                                HqQuoteAmt = HqQuoteAmt * (100 - BrMarkup) / 100;
                                //Minus TCS Tax
                                HqQuoteAmt = HqQuoteAmt / (100 + (Util.GetDecimal(row["TCSPer"]))) * 100;
                                //Minus GST
                                HqQuoteAmt = HqQuoteAmt / (100 + (Util.GetDecimal(row["TaxPer"]))) * 100;
                                //Final Amount
                                HqQuoteAmt = Math.Round(HqQuoteAmt, 2);
                                break;
                        }
                    }
                    #endregion
                }
                #endregion

                #region Old cal
                else
                {
                    switch (Util.GetInteger(row["SupplierType"]))
                    {
                        #region Suppliertype = 1
                        case 0:
                        case 1:
                            if (Util.GetBoolean(row["Invoiced"]) != true)
                            {
                                HqQuoteAmt = HqExtraQuote * ((100 - AgWsMarkup) / 100);
                                HqQuoteAmt = HqQuoteAmt * ((100 - BrMarkup) / 100);
                                HqQuoteAmt = HqQuoteAmt / (100 + GSTVAT) * 100;
                            }
                            else if (Util.GetBoolean(row["Invoiced"]) == true && Util.GetDecimal(row["CommissionAmt"]) == 0)
                            {
                                HqQuoteAmt = HqExtraQuote * (100 - CommissionPer) / 100;
                                HqQuoteAmt = HqQuoteAmt * (100 - BrMarkup) / 100;
                                HqQuoteAmt = HqQuoteAmt / (100 + GSTVAT) * 100;

                            }
                            else if (Util.GetBoolean(row["Invoiced"]) == true && Util.GetDecimal(row["CommissionAmt"]) != 0)
                            {
                                CommPer_From_CommAmt = (CommissionAmt / SellAmount * 100);
                                HqQuoteAmt = HqExtraQuote * ((100 - CommPer_From_CommAmt) / 100);
                                HqQuoteAmt = HqQuoteAmt * ((100 - BrMarkup) / 100);
                                HqQuoteAmt = HqQuoteAmt / (100 + GSTVAT) * 100;
                            }
                            break;
                            #endregion

                    }
                }
                #endregion


            }
            catch (Exception ex) { }
            return Math.Round(HqQuoteAmt, 2);
        }
        //done for supp type 1,2,7,8,11 and OverSeas - 1
        public decimal GetBRExtraQuote(DataRow row)
        {
            decimal BrQuoteAmt = Util.GetDecimal(0.00);
            decimal AgWsMarkup = 0;
            decimal BrExtraQuote = 0;
            decimal CommissionPer = 0;
            decimal CommissionAmt = 0;
            int GSTVAT = 0;
            decimal CommPer_From_CommAmt = 0;
            decimal SellAmount = (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellCancelCharge"]) : Util.GetDecimal(row["SellAmount"]));

            BrExtraQuote = Util.GetString(row["BookStatus"]) != "XX" ? Util.GetDecimal(row["BrExtraQuote"]) : Util.GetDecimal(row["XXBrExtraQuote"]);
            AgWsMarkup = (Util.GetDecimal(row["nWsPer"]) + Util.GetDecimal(row["nAgentPer"]));

            CommissionPer = Util.GetDecimal(row["CommissionPer"]);
            CommissionAmt = Util.GetDecimal(row["CommissionAmt"]);
            if (Util.GetBoolean(row["IsOverSeas"]) == true)
            {
                if (Util.GetBoolean(row["IsVATApplicable"]) == true)
                {
                    GSTVAT = 5;
                }
            }
            else
            {
                GSTVAT = 18;
            }


            try
            {
                #region New Nell To Sell
                if (Util.GetInteger(row["BookingVersion"]) > 2)
                {
                    #region Ottila
                    if (Util.GetBoolean(row["IsOverSeas"]) != true)
                    {
                        switch (Util.GetInteger(row["SupplierType"]))
                        {
                            #region Suppliertype = 1,2,7,8,11,15
                            case 1:
                            case 2:
                            case 7:
                            case 8:
                            case 11:
                            case 15:
                                if (Util.GetBoolean(row["Invoiced"]) != true)
                                {
                                    // 1. Take HQ Extra Quote Amount
                                    // 2. Minus WS + AG MarkUp From Above   
                                    BrQuoteAmt = BrExtraQuote * (100 - (AgWsMarkup)) / 100;
                                    // 3. Minus TCS                                                                                  
                                    BrQuoteAmt = BrQuoteAmt / (100 + (Util.GetDecimal(row["TCSPer"]))) * 100;
                                    // 4. Minus GST                                             
                                    BrQuoteAmt = BrQuoteAmt / (100 + (Util.GetDecimal(row["TaxPer"]))) * 100;
                                    BrQuoteAmt = Math.Round(BrQuoteAmt, 2);

                                }
                                else if (Util.GetBoolean(row["Invoiced"]) == true && Util.GetDecimal(row["CommissionAmt"]) == 0)
                                {
                                    // 1. Take HQ Extra Quote Amount
                                    // 2. Minus CommissionPer From Above 
                                    BrQuoteAmt = BrExtraQuote * (100 - CommissionPer) / 100;
                                    // 3. Minus TCS 
                                    BrQuoteAmt = BrQuoteAmt / (100 + (Util.GetDecimal(row["TCSPer"]))) * 100;
                                    // 4. Minus GST                                            
                                    BrQuoteAmt = BrQuoteAmt / (100 + (Util.GetDecimal(row["TaxPer"]))) * 100;
                                    BrQuoteAmt = Math.Round(BrQuoteAmt, 2);

                                }
                                else if (Util.GetBoolean(row["Invoiced"]) == true && Util.GetDecimal(row["CommissionAmt"]) != 0)
                                {

                                    CommPer_From_CommAmt = (CommissionAmt / SellAmount * 100);

                                    // 1. Take HQ Extra Quote Amount
                                    // 2. CommPer_From_CommAmt From Above 
                                    BrQuoteAmt = BrExtraQuote * ((100 - CommPer_From_CommAmt) / 100);
                                    // 3. Minus TCS
                                    BrQuoteAmt = BrQuoteAmt / (100 + (Util.GetDecimal(row["TCSPer"]))) * 100;
                                    // 4. Minus GST                                               
                                    BrQuoteAmt = BrQuoteAmt / (100 + (Util.GetDecimal(row["TaxPer"]))) * 100;
                                    BrQuoteAmt = Math.Round(BrQuoteAmt, 2);
                                }



                                break;
                                #endregion
                        }
                    }
                    #endregion
                    #region OverSeas
                    else
                    {
                        switch (Util.GetInteger(row["SupplierType"]))
                        {
                            case 1:
                                // 1. Take BR Extra Quote Amount
                                // 2. Minus WS + AG MarkUp From Above 
                                BrQuoteAmt = BrExtraQuote * (100 - (AgWsMarkup)) / 100;
                                // 3. Minus Our VAT                                                                                      
                                BrQuoteAmt = BrQuoteAmt / (100 + (Util.GetDecimal(row["OurVat"]))) * 100;

                                BrQuoteAmt = Math.Round(BrQuoteAmt, 2);
                                break;
                            case 2:
                            case 7:
                            case 8:
                            case 11:
                                if (Util.GetBoolean(row["Invoiced"]) != true)
                                {
                                    // 1. Take HQ Extra Quote Amount
                                    // 2. Minus WS + AG MarkUp From Above   
                                    BrQuoteAmt = BrExtraQuote * (100 - (AgWsMarkup)) / 100;
                                    // 3. Minus TCS                                                                                  
                                    BrQuoteAmt = BrQuoteAmt / (100 + (Util.GetDecimal(row["TCSPer"]))) * 100;
                                    // 4. Minus GST                                             
                                    BrQuoteAmt = BrQuoteAmt / (100 + (Util.GetDecimal(row["TaxPer"]))) * 100;
                                    BrQuoteAmt = Math.Round(BrQuoteAmt, 2);

                                }
                                else if (Util.GetBoolean(row["Invoiced"]) == true && Util.GetDecimal(row["CommissionAmt"]) == 0)
                                {
                                    // 1. Take HQ Extra Quote Amount
                                    // 2. Minus CommissionPer From Above 
                                    BrQuoteAmt = BrExtraQuote * (100 - CommissionPer) / 100;
                                    // 3. Minus TCS 
                                    BrQuoteAmt = BrQuoteAmt / (100 + (Util.GetDecimal(row["TCSPer"]))) * 100;
                                    // 4. Minus GST                                            
                                    BrQuoteAmt = BrQuoteAmt / (100 + (Util.GetDecimal(row["TaxPer"]))) * 100;
                                    BrQuoteAmt = Math.Round(BrQuoteAmt, 2);

                                }
                                else if (Util.GetBoolean(row["Invoiced"]) == true && Util.GetDecimal(row["CommissionAmt"]) != 0)
                                {

                                    CommPer_From_CommAmt = (CommissionAmt / SellAmount * 100);

                                    // 1. Take HQ Extra Quote Amount
                                    // 2. CommPer_From_CommAmt From Above 
                                    BrQuoteAmt = BrExtraQuote * ((100 - CommPer_From_CommAmt) / 100);
                                    // 3. Minus TCS
                                    BrQuoteAmt = BrQuoteAmt / (100 + (Util.GetDecimal(row["TCSPer"]))) * 100;
                                    // 4. Minus GST                                               
                                    BrQuoteAmt = BrQuoteAmt / (100 + (Util.GetDecimal(row["TaxPer"]))) * 100;
                                    BrQuoteAmt = Math.Round(BrQuoteAmt, 2);
                                }



                                break;
                            case 16:
                            case 17:
                                // Take BR Extra Quote Amount
                                //Minus AG + WS Markup
                                BrQuoteAmt = BrExtraQuote * (100 - (AgWsMarkup)) / 100;
                                //Minus TCS Tax
                                BrQuoteAmt = BrQuoteAmt / (100 + (Util.GetDecimal(row["TCSPer"]))) * 100;
                                //Minus GST
                                BrQuoteAmt = BrQuoteAmt / (100 + (Util.GetDecimal(row["TaxPer"]))) * 100;
                                //Final Amount
                                BrQuoteAmt = Math.Round(BrQuoteAmt, 2);
                                break;
                        }
                    }
                    #endregion
                }
                #endregion

                #region Old cal
                else
                {
                    switch (Util.GetInteger(row["SupplierType"]))
                    {
                        #region Suppliertype = 1
                        case 0:
                        case 1:
                            if (Util.GetBoolean(row["Invoiced"]) != true)
                            {
                                BrQuoteAmt = BrExtraQuote * ((100 - AgWsMarkup) / 100);
                                BrQuoteAmt = BrQuoteAmt / (100 + GSTVAT) * 100;
                            }
                            else if (Util.GetBoolean(row["Invoiced"]) == true && Util.GetDecimal(row["CommissionAmt"]) == 0)
                            {
                                BrQuoteAmt = BrExtraQuote * (100 - CommissionPer) / 100;
                                BrQuoteAmt = BrQuoteAmt / (100 + GSTVAT) * 100;

                            }
                            else if (Util.GetBoolean(row["Invoiced"]) == true && Util.GetDecimal(row["CommissionAmt"]) != 0)
                            {
                                CommPer_From_CommAmt = (CommissionAmt / SellAmount * 100);
                                BrQuoteAmt = BrExtraQuote * ((100 - CommPer_From_CommAmt) / 100);
                                BrQuoteAmt = BrQuoteAmt / (100 + GSTVAT) * 100;
                            }
                            break;
                            #endregion

                    }
                }
                #endregion

            }
            catch (Exception ex) { }
            return Math.Round(BrQuoteAmt, 2);
        }
        //done supp type  1,2,11,7,8,3,4,5,13 and OverSeas - 1
        public decimal GetProfitAmt(DataRow row)
        {
            decimal ProfitAmt = 0;

            decimal TaxPay = 0;
            decimal AgPay = 0;
            decimal SuppNetinSell = 0;
            decimal ConvenienceFeeAmt = 0;
            decimal CollectionAmt = 0;
            decimal calculateTaxInv = 0;
            decimal TaxableValue = 0;
            decimal GST = 0;
            decimal GetRebateFromSupplierNet = 0; decimal RebateFromSupp_Sell = 0;
            decimal AgWSMarkup = (Util.GetDecimal(row["nWsPer"]) + Util.GetDecimal(row["nAgentPer"]));
            bool IsDirectBranch = Util.GetBoolean(row["IsDirectBranch"]);
            CollectionAmt = GetCollectionAmount(row);
            decimal SupplierPay_Sell = GetSupplierNetinSell(row);

            decimal collamt = 0, OPayToBr, OPayToSupp, OPayToGov, RbtFmGvt;
            try
            {
                #region New Nell To Sell
                if (Util.GetInteger(row["BookingVersion"]) > 2)
                {
                    #region Ottila
                    if (Util.GetBoolean(row["IsOverSeas"]) != true)
                    {
                        switch (Util.GetInteger(row["SupplierType"]))
                        {
                            #region Suppliertype =1,2

                            case 1:
                            case 2:

                                TaxPay = GetTaxPaytoGovt(row);

                                // 1.Take Collection Amount
                                ProfitAmt = GetCollectionAmount(row);
                                // 2.Minus Ottila Pay to BR Pay (Only for Independant Branch)                                                                              
                                ProfitAmt = ProfitAmt - (!(IsDirectBranch) ? (GetHQToBRPay(row, CollectionAmt)) : 0);
                                // 3.Minus Ottila Pay to Supplier                                        
                                ProfitAmt = ProfitAmt - SupplierPay_Sell;
                                // 4.Minus Ottila Pay to Government                                               
                                ProfitAmt = ProfitAmt - (TaxPay);
                                ProfitAmt = Math.Round(ProfitAmt, 2);

                                break;
                            #endregion
                            #region Suppliertype =7,11

                            case 7:
                            case 11:
                            case 15:
                                TaxPay = GetTaxPaytoGovt(row);

                                // 1.Take Collection Amount
                                ProfitAmt = GetCollectionAmount(row);
                                // 2.Minus Ottila Pay to BR Pay (Only for Independant Branch)                                                                            
                                ProfitAmt = ProfitAmt - (!(IsDirectBranch) ? (GetHQToBRPay(row, CollectionAmt)) : 0);
                                // 3.Minus Ottila Pay to Supplier                                          
                                ProfitAmt = ProfitAmt - SupplierPay_Sell;
                                // 4.Minus Ottila Pay to Government                                             
                                ProfitAmt = ProfitAmt - (TaxPay);
                                // 5.Add Total Rebate AMmount From Government                                
                                //ProfitAmt = ProfitAmt + (TotalRebateFromGovt(row));   ---commented bcz from TAx pay minus rebate                          
                                ProfitAmt = Math.Round(ProfitAmt, 2);

                                break;
                            #endregion                            
                            #region Suppliertype =13
                            case 13:

                                TaxPay = GetTaxPaytoGovt(row);

                                // 1.Take Collection Amount
                                ProfitAmt = GetCollectionAmount(row);
                                // 2.Minus Ottila Pay to BR Pay (Only for Independant Branch)                                                                            
                                ProfitAmt = ProfitAmt - (!(IsDirectBranch) ? (GetHQToBRPay(row, CollectionAmt)) : 0);
                                // 3.Minus Ottila Pay to Supplier                                          
                                ProfitAmt = ProfitAmt - SupplierPay_Sell;
                                // 4.Minus Ottila Pay to Government                                             
                                ProfitAmt = ProfitAmt - (TaxPay);
                                // 5.Add Total Rebate AMmount From Government                                                                 
                                //ProfitAmt = ProfitAmt + (TotalRebateFromGovt(row));                          
                                ProfitAmt = Math.Round(ProfitAmt, 2);

                                break;
                            #endregion
                            #region Suppliertype = 8
                            case 8:

                                TaxPay = GetTaxPaytoGovt(row);
                                GetRebateFromSupplierNet = GetRebateFromSupplier(row);
                                RebateFromSupp_Sell = Math.Round(GetRebateFromSupplierNet * Util.GetDecimal(row["XChangeRate"]), 2);

                                // 1.Take Collection Amount
                                ProfitAmt = GetCollectionAmount(row);
                                // 2.Minus Ottila Pay to BR Pay (Only for Independant Branch)                                                                    
                                ProfitAmt = ProfitAmt - (!(IsDirectBranch) ? (GetHQToBRPay(row, CollectionAmt)) : 0);
                                // 3.Minus Ottila Pay to Supplier             
                                ProfitAmt = ProfitAmt - SupplierPay_Sell;
                                // 4.Minus Ottila Pay to Government                                     
                                ProfitAmt = ProfitAmt - (TaxPay);
                                // 5.Add Rebate Ammount From Supplier                                                      
                                ///ProfitAmt = ProfitAmt + (RebateFromSupp_Sell); --- ---commented bcz from Suppliernet minus rebate  
                                // 5.Add Total Rebate AMmount From Government                           
                                // ProfitAmt = ProfitAmt + (TotalRebateFromGovt(row));  ---commented bcz from TAx pay minus rebate                               
                                ProfitAmt = Math.Round(ProfitAmt, 2);
                                break;
                            #endregion
                            #region Suppliertype =3
                            case 3:

                                TaxPay = GetTaxPaytoGovt(row);
                                //GetRebateFromSupplierNet = GetRebateFromSupplier(row);
                                //RebateFromSupp_Sell = Math.Round(GetRebateFromSupplierNet * Util.GetDecimal(row["XChangeRate"]), 2);

                                // 1.Take Collection Amount
                                ProfitAmt = CollectionAmt;
                                // 2.Minus HQ To BR Pay from Collection Amount                                                                   
                                ProfitAmt = ProfitAmt - (GetHQToBRPay(row, CollectionAmt));
                                // 3.Minus Supplier Pay from Above                                        
                                ProfitAmt = ProfitAmt - SupplierPay_Sell;
                                // 4.Minus GOVT Pay from Above   
                                ProfitAmt = ProfitAmt - TaxPay;
                                ////5.Add Total Rebate Ammount From Government
                                //ProfitAmt = ProfitAmt + (TotalRebateFromGovt(row)); //commented bcz from TAx pay minus rebate

                                ProfitAmt = Math.Round(ProfitAmt, 2);

                                break;
                            #endregion
                            #region Suppliertype =4
                            case 4:

                                TaxPay = GetTaxPaytoGovt(row);
                                GetRebateFromSupplierNet = GetRebateFromSupplier(row);
                                RebateFromSupp_Sell = Math.Round(GetRebateFromSupplierNet * Util.GetDecimal(row["XChangeRate"]), 2);


                                // 1.Take Collection Amount
                                ProfitAmt = CollectionAmt;
                                // 2.Minus HQ To BR Pay from Collection Amount                                                                    
                                ProfitAmt = ProfitAmt - (GetHQToBRPay(row, CollectionAmt));
                                // 3.Minus Supplier Pay from Above                                        
                                ProfitAmt = ProfitAmt - SupplierPay_Sell;
                                // 4.Minus GOVT Pay from Above  
                                ProfitAmt = ProfitAmt - TaxPay;
                                // 5.Add Total Rebate Ammount From Supplier                                
                                // ProfitAmt = ProfitAmt + (RebateFromSupp_Sell);   -----commented bcz from Suppliernet minus rebate  
                                // 6.Add Total Rebate Ammount From Government                            
                                // ProfitAmt = ProfitAmt + (TotalRebateFromGovt(row));   ---commented bcz from TAx pay minus rebate                          
                                ProfitAmt = Math.Round(ProfitAmt, 2);

                                break;
                            #endregion
                            #region Suppliertype =5
                            case 5:

                                TaxPay = GetTaxPaytoGovt(row);

                                // 1.Take Collection Amount
                                ProfitAmt = CollectionAmt;
                                // 2.Minus Ottila Pay to BR Pay (Only for Independant Branch)                                                                      
                                ProfitAmt = ProfitAmt - (!(IsDirectBranch) ? (GetHQToBRPay(row, CollectionAmt)) : 0);
                                // 3.Minus Ottila Pay to Supplier        
                                ProfitAmt = ProfitAmt - SupplierPay_Sell;
                                // 4.Minus Ottila Pay to Government   
                                ProfitAmt = ProfitAmt - TaxPay;
                                ProfitAmt = Math.Round(ProfitAmt, 2);

                                break;
                            #endregion
                            #region SupplierType =9,10                          

                            case 9:
                                //Collection Amount
                                collamt = GetBOSTCS(row) - GetAgToOttilaTaxInvoice(row) + GetSegmentFeeTaxInv(row);
                                //Ottila Pay To BR(-)  
                                OPayToBr = GetHQToBRPay(row, collamt);
                                //Ottila Pay To Supplier[Sell Currency] (-) q95 q149
                                OPayToSupp = GetOttilaToSuppSell(row);
                                //Ottila Pay To Government(-)
                                OPayToGov = GetTaxPaytoGovt(row);
                                //Total Rebate From Government(+) 
                                RbtFmGvt = GetRebateFromGovt(row);
                                //Final Profit Amount
                                ProfitAmt = collamt - OPayToBr - OPayToSupp - OPayToGov;
                                ProfitAmt = Math.Round(ProfitAmt, 2);
                                break;

                            case 10:
                                //Collection Amount
                                //collamt = GetBOSTCS(row)+ GetSegmentFeeTaxInv(row);
                                collamt = GetWsPay(row);
                                //Ottila Pay To BR(-)
                                //OPayToBr = GetHQToBRPay(row, collamt);
                                //Ottila Pay To Supplier[Sell Currency] (-)
                                OPayToSupp = GetSupplierNetinSell(row);
                                TaxPay = GetTaxPaytoGovt(row);
                                ProfitAmt = collamt - OPayToSupp - TaxPay ;

                                ProfitAmt = Math.Round(ProfitAmt, 2);
                                break;
                            case 12:
                                //Collection Amount
                                collamt = GetWsPay(row);
                                //Ottila Pay To BR(-)
                                //OPayToBr = GetHQToBRPay(row, collamt);
                                //Ottila Pay To Supplier[Sell Currency] (-)
                                OPayToSupp = GetSupplierNetinSell(row);

                                TaxPay = 0;
                                RbtFmGvt = 0;


                                ProfitAmt = collamt - OPayToSupp - TaxPay + RbtFmGvt;

                                ProfitAmt = Math.Round(ProfitAmt, 2);



                                break;
                            #endregion
                            case 16:
                            case 17:
                                //Take WS pay (COLLECTION AMT)
                                //Ottila To Supplier[Sell Currency]
                                //Ottila Pay To BR(-)
                                //Ottila Pay To Government(-)
                               // ProfitAmt = GetWsPay(row) - GetOttilaToSuppSell(row) - GetHQToBRPay(row, 0) - GetTaxPaytoGovt(row);
                                ProfitAmt = GetAgPay(row) - GetOttilaToSuppSell(row) - GetTaxPaytoGovt(row);
                                //Final Amount 
                                ProfitAmt = Math.Round(ProfitAmt, 2);
                                break;
                        }
                    }
                    #endregion
                    #region OverSeas
                    else
                    {
                        switch (Util.GetInteger(row["SupplierType"]))
                        {
                            case 1:
                                TaxPay = GetTaxPaytoGovt(row);
                                // 1.Take Collection Amount (SOB + VAT)
                                ProfitAmt = GetCollectionAmount(row);
                                // 2.Minus HQ To BR Pay from Collection Amount                                                                   
                                ProfitAmt = ProfitAmt - (!(IsDirectBranch) ? (GetHQToBRPay(row, CollectionAmt)) : 0);
                                // 3.Minus Supplier Pay from Above                                      
                                ProfitAmt = ProfitAmt - SupplierPay_Sell;
                                // 4.Minus GOVT Pay from Above (Our VAT)                                                  
                                ProfitAmt = ProfitAmt - TaxPay;
                                // 5.Add Total Rebate Ammount From Government (Supp VAT)                              
                                //ProfitAmt = ProfitAmt + (TotalRebateFromGovt(row)); ---commented bcz from TAx pay minus rebate                            
                                ProfitAmt = Math.Round(ProfitAmt, 2);
                                break;
                            #region Suppliertype 2
                            case 2:

                                TaxPay = GetTaxPaytoGovt(row);

                                // 1.Take Collection Amount
                                ProfitAmt = GetCollectionAmount(row);
                                // 2.Minus Ottila Pay to BR Pay (Only for Independant Branch)                                                                              
                                ProfitAmt = ProfitAmt - (!(IsDirectBranch) ? (GetHQToBRPay(row, CollectionAmt)) : 0);
                                // 3.Minus Ottila Pay to Supplier                                        
                                ProfitAmt = ProfitAmt - SupplierPay_Sell;
                                // 4.Minus Ottila Pay to Government                                               
                                ProfitAmt = ProfitAmt - (TaxPay);
                                ProfitAmt = Math.Round(ProfitAmt, 2);

                                break;
                            #endregion   #region Suppliertype =4
                            #region Suppliertype 4
                            case 4:

                                TaxPay = GetTaxPaytoGovt(row);
                                GetRebateFromSupplierNet = GetRebateFromSupplier(row);
                                RebateFromSupp_Sell = Math.Round(GetRebateFromSupplierNet * Util.GetDecimal(row["XChangeRate"]), 2);


                                // 1.Take Collection Amount
                                ProfitAmt = CollectionAmt;
                                // 2.Minus HQ To BR Pay from Collection Amount                                                                    
                                ProfitAmt = ProfitAmt - (GetHQToBRPay(row, CollectionAmt));
                                // 3.Minus Supplier Pay from Above                                        
                                ProfitAmt = ProfitAmt - SupplierPay_Sell;
                                // 4.Minus GOVT Pay from Above  
                                ProfitAmt = ProfitAmt - TaxPay;
                                // 5.Add Total Rebate Ammount From Supplier                                
                                // ProfitAmt = ProfitAmt + (RebateFromSupp_Sell);   -----commented bcz from Suppliernet minus rebate  
                                // 6.Add Total Rebate Ammount From Government                            
                                // ProfitAmt = ProfitAmt + (TotalRebateFromGovt(row));   ---commented bcz from TAx pay minus rebate                          
                                ProfitAmt = Math.Round(ProfitAmt, 2);

                                break;
                            #endregion
                            #region Suppliertype =5
                            case 5:

                                TaxPay = GetTaxPaytoGovt(row);

                                // 1.Take Collection Amount
                                ProfitAmt = CollectionAmt;
                                // 2.Minus Ottila Pay to BR Pay (Only for Independant Branch)                                                                      
                                ProfitAmt = ProfitAmt - (!(IsDirectBranch) ? (GetHQToBRPay(row, CollectionAmt)) : 0);
                                // 3.Minus Ottila Pay to Supplier        
                                ProfitAmt = ProfitAmt - SupplierPay_Sell;
                                // 4.Minus Ottila Pay to Government   
                                ProfitAmt = ProfitAmt - TaxPay;
                                ProfitAmt = Math.Round(ProfitAmt, 2);

                                break;
                            #endregion
                            #region Suppliertype =7,11,15

                            case 7:
                            case 11:
                            case 15:
                                TaxPay = GetTaxPaytoGovt(row);

                                // 1.Take Collection Amount
                                ProfitAmt = GetCollectionAmount(row);
                                // 2.Minus Ottila Pay to BR Pay (Only for Independant Branch)                                                                            
                                ProfitAmt = ProfitAmt - (!(IsDirectBranch) ? (GetHQToBRPay(row, CollectionAmt)) : 0);
                                // 3.Minus Ottila Pay to Supplier                                          
                                ProfitAmt = ProfitAmt - SupplierPay_Sell;
                                // 4.Minus Ottila Pay to Government                                             
                                ProfitAmt = ProfitAmt - (TaxPay);
                                // 5.Add Total Rebate AMmount From Government                                                                 
                                //ProfitAmt = ProfitAmt + (TotalRebateFromGovt(row));   ---commented bcz from TAx pay minus rebate                          
                                ProfitAmt = Math.Round(ProfitAmt, 2);

                                break;
                            #endregion
                            #region Suppliertype = 8
                            case 8:

                                TaxPay = GetTaxPaytoGovt(row);
                                GetRebateFromSupplierNet = GetRebateFromSupplier(row);
                                RebateFromSupp_Sell = Math.Round(GetRebateFromSupplierNet * Util.GetDecimal(row["XChangeRate"]), 2);

                                // 1.Take Collection Amount
                                ProfitAmt = GetCollectionAmount(row);
                                // 2.Minus Ottila Pay to BR Pay (Only for Independant Branch)                                                                    
                                ProfitAmt = ProfitAmt - (!(IsDirectBranch) ? (GetHQToBRPay(row, CollectionAmt)) : 0);
                                // 3.Minus Ottila Pay to Supplier             
                                ProfitAmt = ProfitAmt - SupplierPay_Sell;
                                // 4.Minus Ottila Pay to Government                                     
                                ProfitAmt = ProfitAmt - (TaxPay);
                                // 5.Add Rebate Ammount From Supplier                                                      
                                ///ProfitAmt = ProfitAmt + (RebateFromSupp_Sell); --- ---commented bcz from Suppliernet minus rebate  
                                // 5.Add Total Rebate AMmount From Government                           
                                // ProfitAmt = ProfitAmt + (TotalRebateFromGovt(row));  ---commented bcz from TAx pay minus rebate                               
                                ProfitAmt = Math.Round(ProfitAmt, 2);
                                break;
                            #endregion
                            #region SupplierType=12
                            case 12:
                                //Collection Amount
                                collamt = GetWsPay(row);
                                //Ottila Pay To BR(-)
                                //OPayToBr = GetHQToBRPay(row, collamt);
                                //Ottila Pay To Supplier[Sell Currency] (-)
                                OPayToSupp = GetSupplierNetinSell(row);

                                TaxPay = 0;
                                RbtFmGvt = 0;


                                ProfitAmt = collamt - OPayToSupp - TaxPay + RbtFmGvt;

                                ProfitAmt = Math.Round(ProfitAmt, 2);
                                break;
                            case 16:
                            case 17:
                                //Take WS pay (COLLECTION AMT)
                                //Ottila To Supplier[Sell Currency]
                                //Ottila Pay To BR(-)
                                //Ottila Pay To Government(-)
                                ProfitAmt = GetAgPay(row) - GetOttilaToSuppSell(row) -  GetTaxPaytoGovt(row);
                                //Final Amount 
                                ProfitAmt = Math.Round(ProfitAmt, 2);
                                break;
                                #endregion
                        }
                    }
                    #endregion

                    ConvenienceFeeAmt = GetConvenienceFeeAmt(row);

                    ProfitAmt = ProfitAmt - ConvenienceFeeAmt;

                }
                #endregion

                #region Old cal
                else
                {
                    switch (Util.GetInteger(row["SupplierType"]))
                    {
                        #region Suppliertype = 1,9,10,12
                        case 0:
                        case 1:
                            //Ag|Ws Payable - Supplier net in sell currency - Tax payable to Government
                            AgPay = GetAgPay(row);
                            SuppNetinSell = GetSupplierNetinSell(row);
                            TaxPay = GetTaxPaytoGovt(row);
                            ProfitAmt = AgPay - SuppNetinSell - TaxPay;
                            ConvenienceFeeAmt = GetConvenienceFeeAmt(row);

                            //Profitamt = ProfitAmt- Conv.FeeAmt
                            ProfitAmt = ProfitAmt - ConvenienceFeeAmt;
                            break;

                        case 9:
                            //Collection Amount
                            collamt = GetBOSTCS(row) - GetAgToOttilaTaxInvoice(row) + GetSegmentFeeTaxInv(row);
                            //Ottila Pay To BR(-)  
                            OPayToBr = GetHQToBRPay(row, collamt);
                            //Ottila Pay To Supplier[Sell Currency] (-) q95 q149
                            OPayToSupp = GetOttilaToSuppSell(row);
                            //Ottila Pay To Government(-)
                            OPayToGov = GetTaxPaytoGovt(row);
                            //Total Rebate From Government(+) 
                            RbtFmGvt = GetRebateFromGovt(row);
                            //Final Profit Amount
                            ProfitAmt = collamt - OPayToBr - OPayToSupp - OPayToGov + RbtFmGvt;
                            ProfitAmt = Math.Round(ProfitAmt, 2);
                            break;

                        case 10:
                            //Collection Amount
                            collamt = GetWsPay(row);
                            //Ottila Pay To BR(-)
                            //OPayToBr = GetHQToBRPay(row, collamt);
                            //Ottila Pay To Supplier[Sell Currency] (-)
                            OPayToSupp = GetSupplierNetinSell(row);

                            TaxPay = GetTaxPaytoGovt(row);
                            RbtFmGvt = TotalRebateFromGovt(row);


                            ProfitAmt = collamt - OPayToSupp - TaxPay + RbtFmGvt;

                            ProfitAmt = Math.Round(ProfitAmt, 2);
                            break;
                        case 12:
                            //Collection Amount
                            collamt = GetWsPay(row);
                            //Ottila Pay To BR(-)
                            //OPayToBr = GetHQToBRPay(row, collamt);
                            //Ottila Pay To Supplier[Sell Currency] (-)
                            OPayToSupp = GetSupplierNetinSell(row);

                            TaxPay = 0;
                            RbtFmGvt = 0;


                            ProfitAmt = collamt - OPayToSupp - TaxPay + RbtFmGvt;

                            ProfitAmt = Math.Round(ProfitAmt, 2);
                            break;
                        case 16:
                        case 17:
                            //Take WS pay (COLLECTION AMT)
                            //Ottila To Supplier[Sell Currency]
                            //Ottila Pay To BR(-)
                            //Ottila Pay To Government(-)
                            ProfitAmt = GetAgPay(row) - GetOttilaToSuppSell(row) - GetHQToBRPay(row, 0) - GetTaxPaytoGovt(row);
                            //Final Amount 
                            ProfitAmt = Math.Round(ProfitAmt, 2);
                            break;
                            #endregion

                    }
                }
                #endregion

            }
            catch (Exception ex) { }


            return Math.Round(ProfitAmt, 2);
        }
        //done
        public decimal GetProfitinPer(DataRow row)
        {
            decimal ProfitInPer = 0;
            decimal ProfitAmt = 0;
            decimal AgPay = 0;
            decimal CollectionAmt = 0;
            decimal TaxPay = 0;
            decimal OurVat = 5;
            decimal calculateTaxInv = 0;
            decimal TaxableValue = 0;
            decimal GST = 0, collamt;
            decimal AgWSMarkup = (Util.GetDecimal(row["nWsPer"]) + Util.GetDecimal(row["nAgentPer"]));
            //ArrayList SupplierList = new ArrayList() { 12, 15, 52, 21, 58, 77,53 };

            CollectionAmt = GetCollectionAmount(row);
            try
            {
                #region New Nell To Sell
                if (Util.GetInteger(row["BookingVersion"]) > 2)
                {
                    switch (Util.GetInteger(row["SupplierType"]))
                    {
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 7:
                        case 8:
                        //case 9:
                        case 11:
                        case 13:
                        case 15:
                            ProfitAmt = GetProfitAmt(row);

                            // 1.Take Ottila Profit Amount
                            ProfitInPer = ProfitAmt;
                            // 2.Ottila Profit Percent                      
                            ProfitInPer = ProfitInPer * 100 / CollectionAmt;
                            ProfitInPer = Math.Round(ProfitInPer, 2);
                            break;

                        case 9:
                            collamt = GetBOSTCS(row) - GetAgToOttilaTaxInvoice(row) + GetSegmentFeeTaxInv(row);
                            // Ottila Profit Amount
                            //Ottila Profit Amount / Collection Amount * 100
                            ProfitInPer = GetProfitAmt(row) / collamt * 100;
                            //Profit (%)
                            ProfitInPer = Math.Round(ProfitInPer, 2);
                            break;
                        case 10:
                            collamt = GetSegmentFeeTaxInv(row) + GetBOSTCS(row);
                            // Ottila Profit Amount
                            //Ottila Profit Amount / Collection Amount * 100
                            ProfitInPer = GetProfitAmt(row) / collamt * 100;
                            //Profit (%)
                            ProfitInPer = Math.Round(ProfitInPer, 2);
                            break;
                        case 12:
                            collamt = GetSOBSeg(row);
                            // Ottila Profit Amount
                            //Ottila Profit Amount / Collection Amount * 100
                            ProfitInPer = GetProfitAmt(row) / collamt * 100;
                            //Profit (%)
                            ProfitInPer = Math.Round(ProfitInPer, 2);
                            break;
                        case 16:
                        case 17:
                            // Ottila Profit Amount
                            // Ottila Profit Amount / Collection Amount * 100
                            ProfitInPer = GetProfitAmt(row) / GetWsPay(row) * 100;
                            //Profit (%)
                            ProfitInPer = Math.Round(ProfitInPer, 2);
                            break;
                    }
                }
                #endregion
                #region Old cal
                else
                {
                    switch (Util.GetInteger(row["SupplierType"]))
                    {
                        #region Suppliertype = 1,9,10,12
                        case 0:
                        case 1:
                            //Profit Amount / Ag|Ws Payable * 100
                            AgPay = GetAgPay(row);
                            ProfitAmt = GetProfitAmt(row);
                            if (Util.GetBoolean(row["IsVATApplicable"]) == true)
                            {
                                //if (SupplierList.Contains(Util.GetInteger(row["SupplierId"])))
                                if (Util.GetBoolean(row["DMCCSuppliersTYpe"]) == true)
                                {
                                    //Profit Amount / ((Ag|Ws Payable-( Ag|Ws Payable) - [( Ag|Ws Payable) / ((100 +ourVat)/100)]  ) * 100)
                                    ProfitInPer = ProfitAmt / (AgPay - (AgPay - (AgPay / ((100 + OurVat) / 100)))) * 100;
                                }
                                else if (Util.GetInteger(row["SupType"]) != 1 && Util.GetInteger(row["SourceId"]) == 1 && Util.GetInteger(row["SupplierId"]) == 5537)
                                {
                                    // Profit Amount /(Ag|Ws Payable-(Ag|Ws Payable-(Ag|Ws Payable/((100+OurVAT)/100))))*100 
                                    ProfitInPer = ProfitAmt / (AgPay - (AgPay - (AgPay / ((100 + OurVat) / 100)))) * 100;
                                }
                                else
                                {
                                    //new ->Profit Amount / ((Ag|Ws Payable-Tax) * 100)
                                    ////Profit Amount / ((Ag|Ws Payable-( Ag|Ws Payable) - [( Ag|Ws Payable) / ((100 +ourVat)/100)]  ) * 100)
                                    ProfitInPer = ProfitAmt / (AgPay - (AgPay - (AgPay / ((100 + OurVat) / 100)))) * 100;
                                }
                            }
                            else
                            {
                                //new ->Profit Amount / ((Ag|Ws Payable) * 100)
                                ProfitInPer = ProfitAmt / (AgPay) * 100;
                            }
                            break;

                        case 9:
                            collamt = GetBOSTCS(row) - GetAgToOttilaTaxInvoice(row) + GetSegmentFeeTaxInv(row);
                            // Ottila Profit Amount
                            //Ottila Profit Amount / Collection Amount * 100
                            ProfitInPer = GetProfitAmt(row) / collamt * 100;
                            //Profit (%)
                            ProfitInPer = Math.Round(ProfitInPer, 2);
                            break;
                        case 10:
                            collamt = GetSegmentFeeTaxInv(row) + GetBOSTCS(row);
                            // Ottila Profit Amount
                            //Ottila Profit Amount / Collection Amount * 100
                            ProfitInPer = GetProfitAmt(row) / collamt * 100;
                            //Profit (%)
                            ProfitInPer = Math.Round(ProfitInPer, 2);
                            break;
                        case 12:
                            collamt = GetSOBSeg(row);
                            // Ottila Profit Amount
                            //Ottila Profit Amount / Collection Amount * 100
                            ProfitInPer = GetProfitAmt(row) / collamt * 100;
                            //Profit (%)
                            ProfitInPer = Math.Round(ProfitInPer, 2);
                            break;
                            #endregion
                    }
                }
                #endregion
            }
            catch (Exception ex) { }
            return Math.Round(ProfitInPer, 2);
        }
        public decimal GetConvenienceFeeAmt(DataRow row)
        {
            decimal ConvenienceFeeAmt = 0;
            decimal SellAmount = (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellCancelCharge"]) : Util.GetDecimal(row["SellAmount"]));
            decimal HqExtraQuote = Util.GetString(row["BookStatus"]) != "XX" ? Util.GetDecimal(row["HqExtraQuote"]) : Util.GetDecimal(row["XXHqExtraQuote"]);
            decimal BrExtraQuote = Util.GetString(row["BookStatus"]) != "XX" ? Util.GetDecimal(row["BrExtraQuote"]) : Util.GetDecimal(row["XXBrExtraQuote"]);
            decimal AgWsMarkup = (Util.GetDecimal(row["nWsPer"]) + Util.GetDecimal(row["nAgentPer"]));
            decimal OurVat = 0;
            if (Util.GetString(row["ServiceType"]) == "H")
            {
                OurVat = Util.GetDecimal(row["OurVat"]);
            }
            else
            {
                OurVat = 5;
            }
            if (!Util.GetBoolean(row["IncludeExcludeConv"]))
            {
                ConvenienceFeeAmt = 0;
            }
            else
            {
                //1.From Sell Amt Minus Extra Quote Adjustment
                ConvenienceFeeAmt = SellAmount - (HqExtraQuote + BrExtraQuote + Util.GetDecimal(row["Adjustment"]));
                //2.Minus Markup
                decimal ConvenienceFeeAmtstep3 = ConvenienceFeeAmt * (100 - AgWsMarkup) / 100;
                //3.ConvFeeper
                decimal ConvenienceFeeAmtstep4 = (ConvenienceFeeAmtstep3 / (100 + Util.GetDecimal(row["ConvFeePer"]))) * 100;
                //4.Step 3- Step 4
                ConvenienceFeeAmt = ConvenienceFeeAmtstep3 - ConvenienceFeeAmtstep4;
            }
            return Math.Round(ConvenienceFeeAmt, 2);
        }
        public decimal GetHQToBRPay(DataRow row, decimal CollectionAmt)
        {
            decimal HQToBRPay = 0;

            //As per Discuss with Prasad sir Currently  not have data fro Online Booking so its set 0 now.
            //decimal AgWSMarkup = (Util.GetDecimal(row["nWsPer"]) + Util.GetDecimal(row["nAgentPer"]));
            //decimal BrMarkup = (Util.GetDecimal(row["nBranchPer"]));
            //decimal HqMarkup = (Util.GetDecimal(row["nHQPer"]));
            //decimal SuppTaxAmount = Util.GetString(row["BookStatus"]) == "UC" ? 0 : (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SuppTaxAmtCharge"]) : Util.GetDecimal(row["SuppTaxAmount"]));
            //decimal SellAmount = (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellCancelCharge"]) : Util.GetDecimal(row["SellAmount"]));
            //decimal BrExtraQuote = Util.GetString(row["BookStatus"]) != "XX" ? Util.GetDecimal(row["BrExtraQuote"]) : Util.GetDecimal(row["XXBrExtraQuote"]);
            //decimal NetAmount = Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["NetCancelCharge"]) : Util.GetDecimal(row["NetAmount"]);
            decimal SellAmount = Util.GetString(row["BookStatus"]) == "UC" ? 0 : (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellCancelCharge"]) : Util.GetDecimal(row["SellAmount"]));
            switch (Util.GetInteger(row["SupplierType"]))
            {
                case 10:
                case 9:
                    //Take Sell Amount  (Without Segment Fee)
                    //Minus TCS(if Applied)
                    HQToBRPay = SellAmount / (100 + (Util.GetDecimal(row["TCSPer"]))) * 100;
                    //Get  BR Commision
                    HQToBRPay = HQToBRPay * Util.GetDecimal(row["nBranchPer"]) / 100;
                    //Final HQ To BR Pay Amount
                    HQToBRPay = Math.Round(HQToBRPay, 2);
                    break;
                case 12:
                    //Take Sell Amount  (Without Segment Fee)
                    //Get BR Commision
                    HQToBRPay = SellAmount * Util.GetDecimal(row["nBranchPer"]) / 100;
                    //Final HQ To BR Pay Amount
                    HQToBRPay = Math.Round(HQToBRPay, 2);
                    break;
                case 15:
                    /// Extra Branch Quate insert
                    HQToBRPay = GetBRExtraQuote(row);
                    break;

                //    case 2:
                //    case 7:
                //    case 8:
                //    case 11:
                //        // 1. Take SellAmount                 
                //        HQToBRPay = SellAmount;
                //        // 2. Minus BR Extra Quote                                                                                   
                //        HQToBRPay = HQToBRPay -BrExtraQuote;
                //        // 3. Minus WS+AG Mark Up                                                                                                
                //        HQToBRPay = HQToBRPay * (100 - Util.GetDecimal(AgWSMarkup)) / 100;
                //        // 4. Minus BR Mark Up                                
                //        HQToBRPay = HQToBRPay * (100 - Util.GetDecimal(BrMarkup)) / 100;
                //        // 5. Minus Prev. Amount from Collection Amount                                               
                //        HQToBRPay = CollectionAmt - HQToBRPay;
                //        // 6. Minus TCS Tax                                                                                                         
                //        HQToBRPay = HQToBRPay / (100 + Util.GetDecimal(row["TCSPer"])) * 100;
                //        // 7. Minus GST from Prev. Amount                                                 
                //        HQToBRPay = HQToBRPay / (100 + Util.GetDecimal(row["TaxPer"])) * 100;                           
                //        HQToBRPay = Math.Round(HQToBRPay, 2);
                //        break;
                //    case 3:
                //    case 9:
                //        // 1. Minus TCS From SellAmount 
                //        HQToBRPay = SellAmount / (100 + Util.GetDecimal(row["TCSPer"])) * 100;
                //        // 2. Minus Supplier Tax Amount                           
                //        HQToBRPay = HQToBRPay - (SuppTaxAmount * Util.GetDecimal(row["XChangeRate"]));
                //        // 3. Get BR Commission on Above    
                //        HQToBRPay = (HQToBRPay * BrMarkup) / 100;
                //        // 4. RoundOff upto 2 Digit                      
                //        HQToBRPay = Math.Round(HQToBRPay, 2);                                                      
                //        break;
                //    case 4:
                //        // 1. Minus TCS From SellAmount 
                //        HQToBRPay = SellAmount / (100 + Util.GetDecimal(row["TCSPer"])) * 100;
                //        // 2. Get Supplier GST on Above                                                  
                //        HQToBRPay = HQToBRPay / (100 + Util.GetDecimal(row["SuppGST"])) * 100;
                //        // 3. Minsu Supplier Tax Amount           
                //        HQToBRPay = HQToBRPay - (SuppTaxAmount * Util.GetDecimal(row["XChangeRate"]));
                //        // 4. Get BR Commission on Sell Amount       
                //        HQToBRPay = (HQToBRPay * BrMarkup) / 100;
                //        // 5. RoundOff upto 2 Digit                    
                //        HQToBRPay = Math.Round(HQToBRPay, 2);                                                       
                //        break;

                //    case 5:
                //        // 1. Minus TCS From SellAmount 
                //        HQToBRPay = SellAmount / (100 + Util.GetDecimal(row["TCSPer"])) * 100;
                //        // 2. Minus WS+AG Mark Up                                                                                                
                //        HQToBRPay = HQToBRPay * (100 - Util.GetDecimal(AgWSMarkup)) / 100;
                //        HQToBRPay = (HQToBRPay * NetAmount) / (NetAmount + (HqMarkup + BrMarkup * Util.GetDecimal(row["TaxPer"])));
                //        // 4. Get BR Commission on Above    
                //        HQToBRPay = (HQToBRPay * BrMarkup) / 100;
                //        // 5. RoundOff upto 2 Digit                      
                //        HQToBRPay = Math.Round(HQToBRPay, 2);       
                //        break;
                case 16:
                case 17:
                    //Take Sell Amount                    
                    HQToBRPay = SellAmount;
                    //Minus TCS PER 
                    HQToBRPay = HQToBRPay / (100 + Util.GetDecimal(row["TCSPer"])) * 100;
                    //Get Branch Commission
                    HQToBRPay = HQToBRPay * (Util.GetDecimal(row["nBranchPer"])) / 100;
                    //Final HQ2BrPay
                    HQToBRPay = Math.Round(HQToBRPay, 2);
                    break;
            }

            return HQToBRPay;
        }

        //10,14 missing
        public decimal GetOttilaToSupplierPay(DataRow row)
        {
            decimal SupplierPay = 0;
            decimal SuppTaxAmount = Util.GetString(row["BookStatus"]) == "UC" ? 0 : (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SuppTaxAmtCharge"]) : Util.GetDecimal(row["SuppTaxAmount"]));
            decimal NetAmount = Util.GetString(row["BookStatus"]) == "UC" ? 0 : (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["NetCancelCharge"]) : Util.GetDecimal(row["NetAmount"]));


            switch (Util.GetInteger(row["SupplierType"]))
            {
                case 2:
                case 7:
                case 11:
                    // 1. Take Net Amount
                    SupplierPay = NetAmount;
                    // 2. Add Supplier GST In Amount                                                          
                    SupplierPay = SupplierPay * (100 + (Util.GetDecimal(row["SuppGST"]))) / 100;
                    SupplierPay = Math.Round(SupplierPay, 2);
                    break;
                case 1:
                case 3:
                    // 1. Take Net/Gross Amount
                    SupplierPay = NetAmount;
                    // 2. Minus Supplier Tax Amount
                    SupplierPay = SupplierPay - SuppTaxAmount;
                    // 3. Minus Supplier Commision from Amount                             
                    SupplierPay = SupplierPay * (100 - (Util.GetDecimal(row["SuppComm"]))) / 100;
                    // 4. Add Supplier Tax Amount 
                    SupplierPay = SupplierPay + SuppTaxAmount;
                    SupplierPay = Math.Round(SupplierPay, 2);
                    break;

                case 4:
                case 8:
                    // Minus Supplier Tax Amount from Supplier Gross Amount
                    decimal ActualCommissionAmt = NetAmount - SuppTaxAmount;


                    // 1. Take Net/Gross Amount
                    SupplierPay = NetAmount;
                    // 2. Add Supplier GST In Amount                                                                           
                    SupplierPay = SupplierPay * (100 + (Util.GetDecimal(row["SuppGST"]))) / 100;
                    // 3. Minus Commission Based on Gross Amount                          
                    SupplierPay = SupplierPay - (ActualCommissionAmt * Util.GetDecimal(row["SuppComm"]) / 100);
                    SupplierPay = Math.Round(SupplierPay, 2);
                    break;
                case 5:
                    // 1. Take Net/Gross Amount
                    SupplierPay = NetAmount;
                    // 2. Add Supplier GST In Amount                                                               
                    SupplierPay = SupplierPay * (100 + (Util.GetDecimal(row["SuppGST"]))) / 100;
                    break;
                case 13:
                    decimal Step1 = 0;
                    // 1. Take Gross Amount
                    Step1 = NetAmount;
                    // 2. Add Supplier GST In Amount 
                    Step1 = Step1 * (100 + (Util.GetDecimal(row["SuppGST"]))) / 100;

                    decimal Step2 = 0;
                    // 3. Take Gross Amount
                    Step2 = NetAmount;
                    // 4. Minus Supplier Commision from Amount
                    Step2 = Step2 * (Util.GetDecimal(row["SuppComm"])) / 100;

                    // 5. Minus Step2 from Step1
                    SupplierPay = Step1 - Step2;
                    SupplierPay = Math.Round(SupplierPay, 2);
                    break;
                //case 9:
                //    //1.Take Gross Amount
                //    SupplierPay = NetAmount;
                //    // 2.Minus Supplier Commision from Amount
                //    SupplierPay = SupplierPay * (100 - (Util.GetDecimal(row["SuppComm"]))) / 100;
                //    // 3.Add Net Segment Fee
                //    SupplierPay = SupplierPay + (Util.GetDecimal(row["NetSegment"]) * (SegROE / BookingROE));  //missing
                //    SupplierPay = Math.Round(SupplierPay, 2);
                //    break;

                case 10:
                case 12:
                case 16:
                    //1.Take Gross Amount
                    SupplierPay = NetAmount;
                    // 2.Minus Supplier Commision from Amount
                    SupplierPay = SupplierPay * (100 - (Util.GetDecimal(row["SuppComm"]))) / 100;
                    // 3.Add Net Segment Fee
                    SupplierPay = SupplierPay + (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["XXNetSegment"]) : Util.GetDecimal(row["NetSegment"]) * (Util.GetDecimal(row["SegROE"]))/ Util.GetDecimal(row["XChangeRate"]));
                    SupplierPay = Math.Round(SupplierPay, 2);
                    break;
                case 15:
                    SupplierPay = NetAmount;
                    break;
                //case 16:
                //    //1.Take Net Amount
                //    SupplierPay = NetAmount;
                //    //Minus Commission based on Gross Amount
                //    SupplierPay = SupplierPay * (100 - (Util.GetDecimal(row["SuppComm"]))) / 100;
                //    //Final Ottila To Supplier Pay
                //    SupplierPay = Math.Round(SupplierPay, 2);
                //    break;
                case 17:
                    //1.Take Net Amount
                    SupplierPay = NetAmount;
                    //Minus Commission based on Gross Amount
                    SupplierPay = SupplierPay * (100 - (Util.GetDecimal(row["SuppComm"]))) / 100;                   
                    //Final Ottila To Supplier Pay
                    SupplierPay = Math.Round(SupplierPay, 2);
                    break;
            }
            return SupplierPay;
        }
        public decimal GetCollectionAmount(DataRow row)
        {
            decimal CollectionAmt = 0; decimal TaxableValue = 0; decimal GST = 0; decimal calculateTaxInv = 0;
            decimal AgWSMarkup = (Util.GetDecimal(row["nWsPer"]) + Util.GetDecimal(row["nAgentPer"]));
            decimal SellAmount = (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellCancelCharge"]) : Util.GetDecimal(row["SellAmount"]));
            decimal CommissionPer = Util.GetDecimal(row["CommissionPer"]);
            decimal CommissionAmt = Util.GetDecimal(row["CommissionAmt"]);

            if (Util.GetBoolean(row["Invoiced"]) != true)
            {
                AgWSMarkup = AgWSMarkup;
            }
            else if (Util.GetBoolean(row["Invoiced"]) == true && Util.GetDecimal(row["CommissionAmt"]) == 0)
            {

                AgWSMarkup = CommissionPer;
            }
            else if (Util.GetBoolean(row["Invoiced"]) == true && Util.GetDecimal(row["CommissionAmt"]) != 0)
            {
                AgWSMarkup = (CommissionAmt / SellAmount * 100);


            }

            decimal TCS = 0;


            if (Util.GetBoolean(row["IsOverSeas"]) != true)
            {
                switch (Util.GetInteger(row["SupplierType"]))
                {
                    case 1:
                        CollectionAmt = GetcalculateBOS(row);
                        break;
                    case 2:
                    case 7:
                    case 8:
                    case 11:
                    case 15: // Q30 Calculation
                        //1. Minus WS + AG MarkUp From SellAmount
                        TaxableValue = SellAmount * (100 - (AgWSMarkup)) / 100;
                        // 2. Minus GST it will be Taxable Value
                        TaxableValue = TaxableValue / (100 + (Util.GetDecimal(row["SuppGST"]))) * 100;
                        // 3. Take 2 Digit RoundOff                                      
                        TaxableValue = Math.Round(TaxableValue, 2);
                        // 4. Take GST on Taxable Value
                        GST = (TaxableValue * Util.GetDecimal(row["SuppGST"])) / 100;
                        // 5. Add Taxable Value and GST
                        calculateTaxInv = TaxableValue + GST;
                        calculateTaxInv = Math.Round(calculateTaxInv, 2);

                        CollectionAmt = calculateTaxInv;
                        break;
                    case 13:
                        //1. Minus WS + AG MarkUp From SellAmount
                        TaxableValue = SellAmount * (100 - (AgWSMarkup)) / 100;
                        //2. Minus BOS from Above
                        TaxableValue = TaxableValue - GetcalculateBOS(row);
                        // 3. Minus GST from Above
                        TaxableValue = TaxableValue / (100 + (Util.GetDecimal(row["SuppGST"]))) * 100;
                        // 4. Minus TCS from Above
                        TaxableValue = TaxableValue / (100 + (Util.GetDecimal(row["TCSPer"]))) * 100;
                        // 5. Take GST on Taxable Value
                        GST = (TaxableValue * Util.GetDecimal(row["SuppGST"])) / 100;
                        // 6. Take TCS on Taxable Value And GST Value
                        TCS = ((TaxableValue + GST) * Util.GetDecimal(row["TCSPer"])) / 100;

                        // 7. Add Taxable Value, GST and TCS
                        calculateTaxInv = TaxableValue + GST + TCS;
                        CollectionAmt = Math.Round(calculateTaxInv, 2);
                        break;
                    case 3:
                    case 4:
                        CollectionAmt = GetcalculateBOS(row) - GetcalculateAgTaxInv(row);
                        break;
                    case 5:
                        CollectionAmt = GetcalculateBOS(row) + GetcalculateTaxInv(row);
                        break;
                        //case 9:
                        //    CollectionAmt = objMarkUpDtl.BOS - objMarkUpDtl.AgTaxInvoice + objMarkUpDtl.SegmentInvoice;
                        //    break;
                }
            }
            else
            {
                switch (Util.GetInteger(row["SupplierType"]))
                {
                    case 1:
                        CollectionAmt = SellAmount * (100 - (AgWSMarkup)) / 100;
                        CollectionAmt = Math.Round(CollectionAmt, 2);
                        break;
                    case 2:
                    case 7:
                    case 8:
                    case 11:
                        //1. Minus WS + AG MarkUp From SellAmount
                        TaxableValue = SellAmount * (100 - (AgWSMarkup)) / 100;
                        // 2. Minus GST it will be Taxable Value
                        TaxableValue = TaxableValue / (100 + (Util.GetDecimal(row["SuppGST"]))) * 100;
                        // 3. Take 2 Digit RoundOff                                      
                        TaxableValue = Math.Round(TaxableValue, 2);
                        // 4. Take GST on Taxable Value
                        GST = (TaxableValue * Util.GetDecimal(row["SuppGST"])) / 100;
                        // 5. Add Taxable Value and GST
                        calculateTaxInv = TaxableValue + GST;
                        calculateTaxInv = Math.Round(calculateTaxInv, 2);

                        CollectionAmt = calculateTaxInv;
                        break;
                    case 4:
                        CollectionAmt = GetcalculateBOS(row) - GetcalculateAgTaxInv(row);
                        break;
                    case 5:
                        CollectionAmt = GetcalculateBOS(row) + GetcalculateTaxInv(row);
                        break;
                }
            }

            return CollectionAmt;
        }
        //Total Rebate From Government 
        public decimal TotalRebateFromGovt(DataRow row)
        {

            decimal calculateTRbtFromGovt = 0;

            if (Util.GetBoolean(row["IsOverSeas"]) != true)
            {
                switch (Util.GetInteger(row["SupplierType"]))
                {
                    case 7:
                    case 8:
                    case 11:
                    case 13:
                        //1. Take Supplier Rebate Amount
                        calculateTRbtFromGovt = GetRebateFromGovt(row);
                        // 2. Take 2 Digit RoundOff             
                        calculateTRbtFromGovt = Math.Round(calculateTRbtFromGovt, 2);
                        break;

                    case 3:
                    case 4:
                        // case 9:
                        // 1. Add WS AG Rebate and BR Rebate
                        calculateTRbtFromGovt = GetRbtFromGovtAGWS(row) + GetRbtFromGovtBR(row);
                        // 2. Take 2 Digit RoundOff 
                        calculateTRbtFromGovt = Math.Round(calculateTRbtFromGovt, 2);
                        break;
                    case 10:
                    case 9:
                        //Take Ag| WS GST Rebate
                        //Take BR Rebate
                        //Add both                        
                        calculateTRbtFromGovt = GetRbtFromGovtAGWS(row) + GetRbtFromGovtBR(row);
                        //Total GST Rebatable Amount
                        calculateTRbtFromGovt = Math.Round(calculateTRbtFromGovt, 2);
                        break;
                    case 15:
                        //// return SupplierTax* ROE
                        calculateTRbtFromGovt = Math.Round(Util.GetDecimal(row["SuppTaxAmount"]) * Util.GetDecimal(row["XChangeRate"]), 2);
                        break;

                }
            }
            else
            {
                switch (Util.GetInteger(row["SupplierType"]))
                {
                    case 1:
                        // 1. Add Supp VAT Rebate
                        calculateTRbtFromGovt = GetRebateFromGovt(row);
                        // 2. Take 2 Digit RoundOff         
                        calculateTRbtFromGovt = Math.Round(calculateTRbtFromGovt, 2);
                        break;

                    case 4:

                        // 1. Add WS AG Rebate and BR Rebate
                        calculateTRbtFromGovt = GetRbtFromGovtAGWS(row) + GetRbtFromGovtBR(row);
                        // 2. Take 2 Digit RoundOff 
                        calculateTRbtFromGovt = Math.Round(calculateTRbtFromGovt, 2);
                        break;
                    case 7:
                    case 8:
                    case 11:
                        //1. Take Supplier Rebate Amount
                        calculateTRbtFromGovt = GetRebateFromGovt(row);
                        // 2. Take 2 Digit RoundOff             
                        calculateTRbtFromGovt = Math.Round(calculateTRbtFromGovt, 2);
                        break;

                    case 10:
                    case 9:
                        //Take Ag| WS GST Rebate
                        //Take BR Rebate
                        //Add both                        
                        calculateTRbtFromGovt = GetRbtFromGovtAGWS(row) + GetRbtFromGovtBR(row);
                        //Total GST Rebatable Amount
                        calculateTRbtFromGovt = Math.Round(calculateTRbtFromGovt, 2);
                        break;
                }

            }

            return calculateTRbtFromGovt;

        }
        public decimal GetRebateFromGovt(DataRow row)
        {
            decimal VatPercentforBestBuy = (Util.GetInteger(row["CityId"]) == 989 && Util.GetInteger(row["CountryId"]) == 88) ? Util.GetDecimal(4.49) : Util.GetDecimal(0);
            decimal calculateRbtFromGovt = 0;
            decimal NetAmount = Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["NetCancelCharge"]) : Util.GetDecimal(row["NetAmount"]);

            if (Util.GetBoolean(row["IsOverSeas"]) != true)
            {
                switch (Util.GetInteger(row["SupplierType"]))
                {
                    case 7:
                    case 8:
                    case 11:
                    case 13:
                        //1. Take Net Amount
                        calculateRbtFromGovt = NetAmount;
                        // 2. Get Supplier GST                                                   
                        calculateRbtFromGovt = calculateRbtFromGovt * Util.GetDecimal(row["SuppGST"]) / 100;
                        // 3. Multiply by ROE
                        calculateRbtFromGovt = calculateRbtFromGovt * Util.GetDecimal(row["XChangeRate"]);
                        // 4. Take 2 Digit RoundOff                     
                        calculateRbtFromGovt = Math.Round(calculateRbtFromGovt, 2);
                        break;

                }
            }
            else
            {
                switch (Util.GetInteger(row["SupplierType"]))
                {
                    case 1:

                        if (Util.GetInteger(row["SupType"]) != 1 && Util.GetInteger(row["SourceId"]) == 1 && Util.GetInteger(row["SupplierId"]) == 5537)
                        {
                            calculateRbtFromGovt = (GetSupplierNetinSell(row) - (GetSupplierNetinSell(row) - (GetSupplierNetinSell(row) * VatPercentforBestBuy / 100)));
                            calculateRbtFromGovt = Math.Round(calculateRbtFromGovt, 2);
                        }
                        else
                        {
                            // 1. Net Amount without VAT
                            calculateRbtFromGovt = NetAmount / (100 + Util.GetDecimal(row["SupplierVat"])) * 100;
                            // 2. Minus without vat amount from net amount                                                           
                            calculateRbtFromGovt = NetAmount - calculateRbtFromGovt;
                            // 3. Multiply by ROE                                                    
                            calculateRbtFromGovt = calculateRbtFromGovt * Util.GetDecimal(row["XChangeRate"]);
                            // 4. Take 2 Digit RoundOff                  
                            calculateRbtFromGovt = Math.Round(calculateRbtFromGovt, 2);

                        }
                        break;
                    case 7:
                    case 8:
                    case 11:
                        //1. Take Net Amount
                        calculateRbtFromGovt = NetAmount;
                        // 2. Get Supplier GST                                                   
                        calculateRbtFromGovt = calculateRbtFromGovt * Util.GetDecimal(row["SuppGST"]) / 100;
                        // 3. Multiply by ROE
                        calculateRbtFromGovt = calculateRbtFromGovt * Util.GetDecimal(row["XChangeRate"]);
                        // 4. Take 2 Digit RoundOff                     
                        calculateRbtFromGovt = Math.Round(calculateRbtFromGovt, 2);
                        break;

                }
            }

            return calculateRbtFromGovt;

        }
        //Rebate From Government WS|AG GST
        public decimal GetRbtFromGovtAGWS(DataRow row)
        {
            decimal calculateRbtFromGovt = 0;
            decimal AgWsMarkup = (Util.GetDecimal(row["nWsPer"]) + Util.GetDecimal(row["nAgentPer"]));
            decimal SuppTaxAmount = Util.GetString(row["BookStatus"]) == "UC" ? 0 : (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SuppTaxAmtCharge"]) : Util.GetDecimal(row["SuppTaxAmount"]));
            decimal SellAmount = (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellCancelCharge"]) : Util.GetDecimal(row["SellAmount"]));
            switch (Util.GetInteger(row["SupplierType"]))
            {
                case 3:
                case 9:
                    ////1. Take Net Sell Amount
                    //calculateRbtFromGovt = SellAmount;
                    ////2. Minus TCS (If Applied)                                                                                                
                    //calculateRbtFromGovt = calculateRbtFromGovt / (100 + (Util.GetDecimal(row["TCSPer"]))) * 100;
                    ////3. Minus Supplier Tax Amount                                      
                    //calculateRbtFromGovt = calculateRbtFromGovt - (SuppTaxAmount * Util.GetDecimal(row["XChangeRate"]));
                    ////4. Take AG + WS Commission                           
                    //calculateRbtFromGovt = calculateRbtFromGovt * (AgWsMarkup) / 100;
                    ////5. Get AG Tax GST  
                    //calculateRbtFromGovt = calculateRbtFromGovt - (calculateRbtFromGovt / (100 + Util.GetDecimal(row["AgInvGST"])) * 100);
                    //// 6. Take 2 Digit RoundOff         
                    //calculateRbtFromGovt = Math.Round(calculateRbtFromGovt, 2);





                    // Take Sell Amount(Without Segment Fee)
                    //Minus TCS(if Applied)       
                    calculateRbtFromGovt = SellAmount / (100 + (Util.GetDecimal(row["TCSPer"]))) * 100;
                    // Take Ag +WS  Commision 
                    calculateRbtFromGovt = calculateRbtFromGovt * (AgWsMarkup) / 100;
                    // Get  Ag Tax GST 
                    calculateRbtFromGovt = calculateRbtFromGovt - (calculateRbtFromGovt / (100 + Util.GetDecimal(row["AgInvGST"])) * 100);
                    //  Final Ag | WS GST Amount
                    calculateRbtFromGovt = Math.Round(calculateRbtFromGovt, 2);


                    break;
                case 10:
                    // Take Sell Amount(Without Segment Fee)
                    //Minus TCS(if Applied) =Q134/(100+C23)*100        
                    calculateRbtFromGovt = SellAmount / (100 + (Util.GetDecimal(row["TCSPer"]))) * 100;
                    // Take Ag +WS  Commision =Q135*(I8+L8)/100
                    calculateRbtFromGovt = calculateRbtFromGovt * (AgWsMarkup) / 100;
                    // Get  Ag Tax GST =ROUND(Q136-(Q136/(100+F20)*100),2)
                    calculateRbtFromGovt = calculateRbtFromGovt - (calculateRbtFromGovt / (100 + Util.GetDecimal(row["AgInvGST"])) * 100);
                    //  Final Ag | WS GST Amount
                    calculateRbtFromGovt = Math.Round(calculateRbtFromGovt, 2);
                    break;
                case 4:
                    //1. Take Net Sell Amount
                    calculateRbtFromGovt = SellAmount; ;
                    //2. Get Supplier GST on Above                                                                               
                    calculateRbtFromGovt = calculateRbtFromGovt / (100 + Util.GetDecimal(row["SuppGST"])) * 100;
                    //3. Minus TCS (If Applied)                                                                                                                                    
                    calculateRbtFromGovt = calculateRbtFromGovt / (100 + (Util.GetDecimal(row["TCSPer"]))) * 100;
                    //4. Minus Supplier Tax Amount                                     
                    calculateRbtFromGovt = calculateRbtFromGovt - (SuppTaxAmount * Util.GetDecimal(row["XChangeRate"]));
                    //6. Get AG Tax GST                       
                    calculateRbtFromGovt = calculateRbtFromGovt * (AgWsMarkup) / 100;
                    //5. Take AG + WS Commission 
                    calculateRbtFromGovt = calculateRbtFromGovt - (calculateRbtFromGovt / (100 + Util.GetDecimal(row["AgInvGST"])) * 100);
                    // 7. Take 2 Digit RoundOff          
                    calculateRbtFromGovt = Math.Round(calculateRbtFromGovt, 2);
                    break;
            }



            return calculateRbtFromGovt;

        }
        //Rebate From Government BR GST
        public decimal GetRbtFromGovtBR(DataRow row)
        {
            decimal calculateRbtFromGovt = 0;
            //Commted as per Discuss with nilesh ji
            //decimal CollectionAmount = GetCollectionAmount(row);


            //switch (Util.GetInteger(row["SupplierType"]))
            //{
            //    case 3:
            //    case 4:
            //    case 9:
            //        //1. Take HQ To BR Pay
            //        calculateRbtFromGovt = GetHQToBRPay(row, CollectionAmount);
            //        //2. Get BOS GST on Above                                                                            
            //        calculateRbtFromGovt = calculateRbtFromGovt - (calculateRbtFromGovt / (100 + Util.GetDecimal(row["TaxPer"])) * 100);
            //        // 3. Take 2 Digit RoundOff  
            //        calculateRbtFromGovt = Math.Round(calculateRbtFromGovt, 2);                                                               
            //        break;

            //}
            decimal CollectionAmt = 0;
            switch (Util.GetInteger(row["SupplierType"]))
            {
                case 10:
                case 9:
                    //Ottila Pay To BR                    
                    //Get BR Paid GST 
                    calculateRbtFromGovt = GetHQToBRPay(row, CollectionAmt) - (GetHQToBRPay(row, CollectionAmt) / (100 + Util.GetDecimal(row["TaxPer"])) * 100);
                    //Final BR GST Amount 
                    calculateRbtFromGovt = Math.Round(calculateRbtFromGovt, 2);
                    break;
            }
            return calculateRbtFromGovt;

        }
        public decimal GetRebateFromSupplier(DataRow row)
        {
            decimal calculateSuppNet = 0; decimal SuppComm = 0; decimal GSTAmt = 0;

            decimal SuppTaxAmount = Util.GetString(row["BookStatus"]) == "UC" ? 0 : (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SuppTaxAmtCharge"]) : Util.GetDecimal(row["SuppTaxAmount"]));
            decimal NetAmount = Util.GetString(row["BookStatus"]) == "UC" ? 0 : (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["NetCancelCharge"]) : Util.GetDecimal(row["NetAmount"]));

            switch (Util.GetInteger(row["SupplierType"]))
            {
                case 4:
                case 8:
                    //1. Minus Supplier Tax Amount from Gross Amount
                    calculateSuppNet = NetAmount - SuppTaxAmount;

                    //2. Get Supplier Commission
                    SuppComm = calculateSuppNet * Util.GetDecimal(row["SuppComm"]) / 100;

                    //3. Get GST on Commission Amount 
                    GSTAmt = SuppComm * Util.GetDecimal(row["HotelGST"]) / 100;
                    calculateSuppNet = GSTAmt;                                 
                    break;
            }

            return calculateSuppNet;
        }
        public decimal GetTDSForWS(DataRow row)
        {
            decimal calculatedValue = 0;
            decimal SuppTaxAmount = Util.GetString(row["BookStatus"]) == "UC" ? 0 : (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SuppTaxAmtCharge"]) : Util.GetDecimal(row["SuppTaxAmount"]));
            decimal AgWsMarkup = (Util.GetDecimal(row["nWsPer"]) + Util.GetDecimal(row["nAgentPer"]));

            decimal SellAmount = (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellCancelCharge"]) : Util.GetDecimal(row["SellAmount"]));



            switch (Util.GetInteger(row["SupplierType"]))
            {
                case 3:
                case 9:
                    //// 1. Minus TCS From SellAmount
                    //calculatedValue = SellAmount / (100 + (Util.GetDecimal(row["TCSPer"]))) * 100;
                    //// 2. Minsu Supplier Tax Amount                                        
                    //calculatedValue = calculatedValue - (SuppTaxAmount * Util.GetDecimal(row["XChangeRate"]));
                    //// 3. Get WS + AG Commission on Sell Amount                           
                    //calculatedValue = calculatedValue * (AgWsMarkup) / 100;
                    //// 4. Minsu AG TAX GST
                    //calculatedValue = calculatedValue * 100 / (100 + Util.GetDecimal(row["AgInvGST"]));
                    //// 5. Take 2 digit decimal                                   
                    //calculatedValue = Math.Round(calculatedValue, 2);
                    //// 6. Get TDS on Above Value                                                                  
                    //calculatedValue = Math.Round(calculatedValue * Util.GetDecimal(row["TDS"]) / 100, 2);


                    //condition for supplier 9 Rail+TCS
                    //Minus TCS (if Applied)                                     
                    calculatedValue = SellAmount / (100 + (Util.GetDecimal(row["TCSPer"]))) * 100;
                    //Get WS + AG Commission on Sell Amount     
                    calculatedValue = calculatedValue * (AgWsMarkup) / 100;
                    // Minus AG TAX GST
                    calculatedValue = calculatedValue * 100 / (100 + Util.GetDecimal(row["AgInvGST"]));
                    // Take 2 digit decimal                                   
                    calculatedValue = Math.Round(calculatedValue, 2);
                    // Get TDS on Above Value                                                                  
                    calculatedValue = Math.Round(calculatedValue * Util.GetDecimal(row["TDS"]) / 100, 2);

                    break;

                case 10:
                    //Minus TCS (if Applied)                                     
                    calculatedValue = SellAmount / (100 + (Util.GetDecimal(row["TCSPer"]))) * 100;
                    //Get WS + AG Commission on Sell Amount     
                    calculatedValue = calculatedValue * (AgWsMarkup) / 100;
                    // Minus AG TAX GST
                    calculatedValue = Math.Round(calculatedValue * 100 / (100 + Util.GetDecimal(row["AgInvGST"])), 2);
                    // Get TDS on Above Value                                                                  
                    calculatedValue = Math.Round(calculatedValue * Util.GetDecimal(row["TDS"]) / 100, 2);
                    break;

                case 4:
                    //1. Get SupplierGST on SellAmount
                    calculatedValue = SellAmount / (100 + Util.GetDecimal(row["SuppGST"])) * 100;
                    //2. Minus TCS From SellAmount                                     
                    calculatedValue = calculatedValue / (100 + (Util.GetDecimal(row["TCSPer"]))) * 100;
                    //3. Minus Supplier Tax Amount                               
                    calculatedValue = calculatedValue - (SuppTaxAmount * Util.GetDecimal(row["XChangeRate"]));
                    //4. Get WS + AG Commission on Above                           
                    calculatedValue = calculatedValue * (AgWsMarkup) / 100;
                    //5. Minsu AG TAX GST                                                             
                    calculatedValue = calculatedValue * 100 / (100 + Util.GetDecimal(row["AgInvGST"]));
                    //6. Take 2 digit decimal                                
                    calculatedValue = Math.Round(calculatedValue, 2);
                    //7. Get TDS on Above Value                                                                      
                    calculatedValue = Math.Round(calculatedValue * Util.GetDecimal(row["TDS"]) / 100, 2);
                    break;
            }

            return calculatedValue;
        }
        public decimal GetcalculateBOS(DataRow row)
        {
            decimal calculateBOS = 0;
            decimal AgWsMarkup = (Util.GetDecimal(row["nWsPer"]) + Util.GetDecimal(row["nAgentPer"]));
            decimal SellAmount = (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellCancelCharge"]) : Util.GetDecimal(row["SellAmount"]));
            decimal NetAmount = Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["NetCancelCharge"]) : Util.GetDecimal(row["NetAmount"]);

            decimal CommissionPer = Util.GetDecimal(row["CommissionPer"]);
            decimal CommissionAmt = Util.GetDecimal(row["CommissionAmt"]);

            if (Util.GetBoolean(row["Invoiced"]) != true)
            {
                AgWsMarkup = AgWsMarkup;
            }
            else if (Util.GetBoolean(row["Invoiced"]) == true && Util.GetDecimal(row["CommissionAmt"]) == 0)
            {

                AgWsMarkup = CommissionPer;
            }
            else if (Util.GetBoolean(row["Invoiced"]) == true && Util.GetDecimal(row["CommissionAmt"]) != 0)
            {
                AgWsMarkup = (CommissionAmt / SellAmount * 100);


            }

            if (Util.GetBoolean(row["IsOverSeas"]) == false || (Util.GetBoolean(row["IsOverSeas"]) == true && (Util.GetInteger(row["SupplierType"]) == 2 || Util.GetInteger(row["SupplierType"]) == 4 || Util.GetInteger(row["SupplierType"]) == 5 || Util.GetInteger(row["SupplierType"]) == 7 || Util.GetInteger(row["SupplierType"]) == 8 || Util.GetInteger(row["SupplierType"]) == 8 || Util.GetInteger(row["SupplierType"]) == 11)))
            {
                switch (Util.GetInteger(row["SupplierType"]))
                {
                    case 1:
                        // Minus WS + AG MarkUp From SellAmount
                        calculateBOS = SellAmount * (100 - (AgWsMarkup)) / 100;
                        calculateBOS = Math.Round(calculateBOS, 2);
                        break;
                    case 3:
                    case 4:
                    case 9:
                        // 1. Take Sell Amount
                        calculateBOS = SellAmount;
                        break;
                    case 5:
                        // 1. Add Supplier GST on Net Amount
                        calculateBOS = NetAmount * (100 + Util.GetDecimal(row["SuppGST"])) / 100;
                        // 2. Multiply by ROE   
                        calculateBOS = calculateBOS * Util.GetDecimal(row["XChangeRate"]);
                        // 3. Apply TCS If Applicable                           
                        calculateBOS = calculateBOS * (100 + Util.GetDecimal((row["TCSPer"]))) / 100;
                        calculateBOS = Math.Round(calculateBOS, 2);
                        break;
                }
            }


            return calculateBOS;
        }
        public decimal GetcalculateAgTaxInv(DataRow row)
        {
            decimal calculateAgTaxInv = 0; decimal Ag_TaxableValue = 0; decimal Ag_GST = 0; decimal Ag_TDS = 0;
            decimal SuppTaxAmount = Util.GetString(row["BookStatus"]) == "UC" ? 0 : (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SuppTaxAmtCharge"]) : Util.GetDecimal(row["SuppTaxAmount"]));
            decimal AgWsMarkup = (Util.GetDecimal(row["nWsPer"]) + Util.GetDecimal(row["nAgentPer"]));
            decimal SellAmount = (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellCancelCharge"]) : Util.GetDecimal(row["SellAmount"]));


            switch (Util.GetInteger(row["SupplierType"]))
            {
                case 3:
                case 9:
                    // 1. Minus TCS From SellAmount
                    Ag_TaxableValue = SellAmount / (100 + (Util.GetDecimal(row["TCSPer"]))) * 100;
                    // 2. Minus Supplier Tax Amount In Sell Currency                                      
                    Ag_TaxableValue = Ag_TaxableValue - (SuppTaxAmount * (Util.GetDecimal(row["XChangeRate"])));
                    // 3. Minus WS + AG MarkUp From Above                       
                    Ag_TaxableValue = Ag_TaxableValue * (AgWsMarkup) / 100;
                    // 4. Minus AG Invoice GST
                    Ag_TaxableValue = Ag_TaxableValue / (100 + Util.GetDecimal(row["AgInvGST"])) * 100;
                    Ag_TaxableValue = Math.Round(Ag_TaxableValue, 2);
                    // 4. Get GST On Taxable Value
                    Ag_GST = Ag_TaxableValue * (Util.GetDecimal(row["AgInvGST"])) / 100;
                    // 5 .Get TDS On Taxable Value
                    Ag_TDS = Ag_TaxableValue * (Util.GetDecimal(row["TDS"])) / 100;
                    // 6. Add Taxable Value and GST and Minus TDS
                    calculateAgTaxInv = Ag_TaxableValue + Ag_GST - Ag_TDS;
                    // 7. Take 2 Digit RoundOff                                                                   
                    calculateAgTaxInv = Math.Round(calculateAgTaxInv, 2);
                    break;
                case 4:
                    // 1. Minus TCS From SellAmount
                    Ag_TaxableValue = SellAmount / (100 + (Util.GetDecimal(row["TCSPer"]))) * 100;
                    // 2. Minus Supplier GST from SellAmount                                          
                    Ag_TaxableValue = Ag_TaxableValue / (100 + Util.GetDecimal(row["SuppGST"])) * 100;
                    // 3. Minus Supplier Tax Amount In Sell Currency                                  
                    Ag_TaxableValue = Ag_TaxableValue - (SuppTaxAmount * (Util.GetDecimal(row["XChangeRate"])));
                    // 4. Minus WS + AG MarkUp From SellAmount                       
                    Ag_TaxableValue = Ag_TaxableValue * (AgWsMarkup) / 100;
                    // 5. Minus AG Invoice GST                                                                
                    Ag_TaxableValue = Ag_TaxableValue / (100 + Util.GetDecimal(row["AgInvGST"])) * 100;
                    Ag_TaxableValue = Math.Round(Ag_TaxableValue, 2);
                    // 6. Get GST On Taxable Value
                    Ag_GST = Ag_TaxableValue * (Util.GetDecimal(row["AgInvGST"])) / 100;
                    // 7. Get TDS On Taxable Value
                    Ag_TDS = Ag_TaxableValue * (Util.GetDecimal(row["TDS"])) / 100;
                    // 8. Add Taxable Value and GST and Minus TDS
                    calculateAgTaxInv = Ag_TaxableValue + Ag_GST - Ag_TDS;
                    // 9. Take 2 Digit RoundOff                                                               
                    calculateAgTaxInv = Math.Round(calculateAgTaxInv, 2);
                    break;
            }

            return calculateAgTaxInv;
        }
        public decimal GetcalculateTaxInv(DataRow row)
        {

            decimal SuppTaxAmount = Util.GetString(row["BookStatus"]) == "UC" ? 0 : (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SuppTaxAmtCharge"]) : Util.GetDecimal(row["SuppTaxAmount"]));
            decimal AgWsMarkup = (Util.GetDecimal(row["nWsPer"]) + Util.GetDecimal(row["nAgentPer"]));
            decimal SellAmount = (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellCancelCharge"]) : Util.GetDecimal(row["SellAmount"]));


            decimal calculateTaxInv = 0; decimal TaxableValue = 0; decimal GST = 0; decimal TCS = 0;

            switch (Util.GetInteger(row["SupplierType"]))
            {
                case 2:
                case 7:
                case 8:
                case 11:
                    //1. Minus WS + AG MarkUp From SellAmount
                    TaxableValue = SellAmount * (100 - (AgWsMarkup)) / 100;
                    // 2. Minus GST it will be Taxable Value
                    TaxableValue = TaxableValue / (100 + (Util.GetDecimal(row["SuppGST"]))) * 100;
                    // 3. Take 2 Digit RoundOff                                      
                    TaxableValue = Math.Round(TaxableValue, 2);
                    // 4. Take GST on Taxable Value
                    GST = (TaxableValue * Util.GetDecimal(row["SuppGST"])) / 100;
                    // 5. Add Taxable Value and GST
                    calculateTaxInv = TaxableValue + GST;
                    // 6. Take 2 Digit RoundOff                                                                                 
                    calculateTaxInv = Math.Round(calculateTaxInv, 2);
                    break;
                case 5:
                    //1. Minus WS + AG MarkUp From SellAmount
                    TaxableValue = SellAmount * (100 - (AgWsMarkup)) / 100;
                    //2. Minus BOS from Above                                
                    TaxableValue = TaxableValue - GetcalculateBOS(row);
                    // 3. Minus GST from Above                                                                      
                    TaxableValue = TaxableValue / (100 + (Util.GetDecimal(row["SuppGST"]))) * 100;
                    // 4. Minus TCS from Above                                       
                    TaxableValue = TaxableValue / (100 + (Util.GetDecimal(row["TCSPer"]))) * 100;
                    // 5. Take GST on Taxable Value
                    GST = (TaxableValue * Util.GetDecimal(row["SuppGST"])) / 100;
                    // 6. Take TCS on Taxable Value And GST Value                                                       
                    TCS = ((TaxableValue + GST) * Util.GetDecimal(row["TCSPer"])) / 100;
                    // 7. Add Taxable Value, GST and TCS
                    calculateTaxInv = TaxableValue + GST + TCS;
                    // 8. Take 2 Digit RoundOff                                                                             
                    calculateTaxInv = Math.Round(calculateTaxInv, 2);
                    break;
            }

            return calculateTaxInv;
        }

        // for Gross Amount(Sellamount)
        //public decimal GetSellAmount(DataRow row)
        //{
        //    decimal SellAmount = 0;
        //    //Take Gross Amount(Net Amount)          
        //    decimal NetAmount = Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["NetCancelCharge"]) : Util.GetDecimal(row["NetAmount"]);
        //    switch (Util.GetInteger(row["SupplierType"]))
        //    {
        //        case 10:
        //        case 9:
        //            //Multiply By Net To Sell ROE
        //            SellAmount = NetAmount * Util.GetDecimal(row["XChangeRate"]);
        //            //Add TCS(If Applicable)
        //            SellAmount = SellAmount * (100 + (Util.GetDecimal(row["TCSPer"]))) / 100;
        //            //final sell amount
        //            SellAmount = Math.Ceiling(SellAmount);
        //            break;
        //        case 12:
        //            //Take Gross Amount
        //            //Multiply By Net To Sell ROE
        //            SellAmount = NetAmount * Util.GetDecimal(row["XChangeRate"]);
        //            //final sell amount
        //            SellAmount = Math.Ceiling(SellAmount);
        //            break;
        //        case 16:
        //        case 17:
        //            //Take Gross/Net Amount;
        //            SellAmount = NetAmount;
        //            //Mulitply By ROE
        //            SellAmount = SellAmount * Util.GetDecimal(row["XChangeRate"]);
        //            //Add TCS (If Applicable) on Gross Amount
        //            SellAmount = SellAmount * (100 + Util.GetDecimal(row["TCSPer"])) / 100;
        //            //Ceil Amount 
        //            SellAmount = Math.Ceiling(SellAmount);                  
        //            break;
        //    }

        //    return SellAmount;
        //}
        public decimal GetSellServiceCharge(DataRow row)
        {
            decimal SellServiceCharge = 0;
            decimal NetAmount = Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["NetCancelCharge"]) : Util.GetDecimal(row["NetAmount"]);
            decimal HQBRMarkup = (Util.GetDecimal(row["nHQPer"]) + Util.GetDecimal(row["nBranchPer"]));
            switch (Util.GetInteger(row["SupplierType"]))
            {
                case 16:
                case 17:                   
                    //Take Gross / Net Amount
                    SellServiceCharge = NetAmount;
                    //  Get HQ + BR Commission 
                    SellServiceCharge = SellServiceCharge * (HQBRMarkup) / 100;
                    //  Add GST on HQ + BR Commission 
                    SellServiceCharge = SellServiceCharge * (100 + Util.GetDecimal(row["TaxPer"])) / 100;
                    //  Multiply By Net To Sell ROE
                    SellServiceCharge = SellServiceCharge * Util.GetDecimal(row["XChangeRate"]);
                    //  Add TCS(If Applicable)  
                    SellServiceCharge = SellServiceCharge * (100 + Util.GetDecimal(row["TCSPer"])) / 100;
                    //Final Sell Service Charge
                    SellServiceCharge = Math.Round(SellServiceCharge, 2);
                    break;
            }
            return SellServiceCharge;
        }
        public decimal GetSegmnentServiceCharge(DataRow row)
        {
            decimal SellServiceCharge = 0;
            decimal NetSegment = Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["XXNetSegment"]) : Util.GetDecimal(row["NetSegment"]);
            decimal sellsegment = Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellSegmentXXCharge"]) : Util.GetDecimal(row["SellSegment"]);           
            switch (Util.GetInteger(row["SupplierType"]))
            {                
                case 16:
                    //Take Net Segment
                    SellServiceCharge = NetSegment;
                    //  Apply Segment ROE 
                    SellServiceCharge = SellServiceCharge * Util.GetDecimal(row["SegROE"]);
                    //  Take Sell Segment
                    //  Sell Minus Net
                    SellServiceCharge = sellsegment- SellServiceCharge ;
                    //  Add Gst On above
                    SellServiceCharge = SellServiceCharge * (100 + Util.GetDecimal(row["TaxPer"])) / 100;
                    //Add TCS (If Applicable)
                    SellServiceCharge = SellServiceCharge * (100 + Util.GetDecimal(row["TCSPer"])) / 100;
                    //Final Sell Service Charge
                    SellServiceCharge = Math.Round(SellServiceCharge, 2);
                    break;
            }
            return SellServiceCharge;
        }
        public decimal GetSellSegmentFee(DataRow row)
        {
            decimal calculatedvalue = 0;
            decimal sellsegment = Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellSegmentXXCharge"]) : Util.GetDecimal(row["SellSegment"]);
            decimal NetSegment = Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["XXNetSegment"]) : Util.GetDecimal(row["NetSegment"]);
            switch (Util.GetInteger(row["SupplierType"]))               
            {
                case 10:
                case 9:
                    //Add  GST On Segment
                    calculatedvalue = sellsegment * (100 + Util.GetDecimal(row["TaxPer"])) / 100;
                    //Add TCS (If Applicable)
                    calculatedvalue = calculatedvalue * (100 + (Util.GetDecimal(row["TCSPer"]))) / 100;
                    //Final Sell Segment Fee
                    calculatedvalue = Math.Round(calculatedvalue, 2);
                    break;
                case 16:                    
                    //Take Net Segment
                    calculatedvalue = NetSegment;
                    //Apply Segment ROE
                    calculatedvalue = calculatedvalue * (Util.GetDecimal(row["SegROE"]));
                    //Add TCS (If Applicable)
                    calculatedvalue = calculatedvalue * (100 + (Util.GetDecimal(row["TCSPer"]))) / 100;
                    //Add Segment Service Charge
                    calculatedvalue = calculatedvalue + GetSegmnentServiceCharge(row);
                    calculatedvalue=Math.Round(calculatedvalue, 2);
                    break;
            }
            return calculatedvalue;
        }
        public decimal GetWsPay(DataRow row)
        {
            decimal WsPay = 0;
            decimal AgWsMarkup = (Util.GetDecimal(row["nWsPer"]) + Util.GetDecimal(row["nAgentPer"]));
            decimal SellAmount = Util.GetString(row["BookStatus"]) == "UC" ? 0 : (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellCancelCharge"]) : Util.GetDecimal(row["SellAmount"]));

            switch (Util.GetInteger(row["SupplierType"]))
            {
                case 10:
                case 9:
                    //Minus TCS (if Applied)
                    WsPay = SellAmount / (100 + (Util.GetDecimal(row["TCSPer"]))) * 100;
                    //Get WS + Ag Commission =Q17*(100-(I8+L8))/100
                    WsPay = WsPay * (100 - AgWsMarkup) / 100;
                    //Add TCS =Q18*(100+C23)/100
                    WsPay = WsPay * (100 + (Util.GetDecimal(row["TCSPer"]))) / 100;                                       
                    //Add Sell Segment Fee
                    WsPay = WsPay + GetSellSegmentFee(row);
                    //Final Pay Amount for WS
                    WsPay = Math.Round(WsPay, 2);
                    break;
                case 12:
                    //Take Sell Amount(Without Segment Fee)
                    //Get WS + Ag Commission
                    WsPay = SellAmount * ((AgWsMarkup)) / 100;
                    //Minus above Amount from Sell Amount (Without Seg. Fee)
                    WsPay = SellAmount - WsPay;
                    //Add Sell Segment Fee
                    WsPay = WsPay + (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellSegmentXXCharge"]) : Util.GetDecimal(row["SellSegment"]));
                    //Final Pay Amount for WS
                    WsPay = Math.Round(WsPay, 2);
                    break;
                case 16:
                case 17:
                    //Take Sell Amount            
                    WsPay = SellAmount;
                    //Minus Supplier Commission 
                    WsPay = WsPay * (100 - Util.GetDecimal(row["SuppComm"])) / 100;
                    //Add Sell Service Charge
                    WsPay = WsPay + GetSellServiceCharge(row)+ GetSellSegmentFee(row);
                    //Final Pay Amount for WS
                    WsPay = Math.Round(WsPay, 2);
                    break;
            }
            return WsPay;
        }
        public decimal GetTDSforAg(DataRow row)
        {
            decimal TDSForAg = 0;
            decimal SellAmount = Util.GetString(row["BookStatus"]) == "UC" ? 0 : (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellCancelCharge"]) : Util.GetDecimal(row["SellAmount"]));
            switch (Util.GetInteger(row["SupplierType"]))
            {
                case 10:
                case 9:
                    //Take Sell Amount  (Without Segment Fee)
                    //Minus TCS (if Applied)
                    TDSForAg = SellAmount / (100 + (Util.GetDecimal(row["TCSPer"]))) * 100;
                    //Get Ag Commission
                    TDSForAg = TDSForAg * (Util.GetDecimal(row["nAgentPer"])) / 100;
                    //Minus Ag Tax GST
                    TDSForAg = Math.Round(TDSForAg * 100 / (100 + Util.GetDecimal(row["AgInvGST"])), 2);
                    //Get TDS on Above
                    TDSForAg = TDSForAg * Util.GetDecimal(row["TDS"]) / 100;
                    //Final Ag  TDS Amount
                    TDSForAg = Math.Round(TDSForAg, 2);
                    break;
            }
            return TDSForAg;
        }
        public decimal GetBrPayToHQ(DataRow row)
        {
            decimal BrPaytoHq = 0;
            decimal BrAgWsMarkup =  (Util.GetDecimal(row["nWsPer"]) + Util.GetDecimal(row["nAgentPer"]));
            decimal SellAmount = Util.GetString(row["BookStatus"]) == "UC" ? 0 : (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellCancelCharge"]) : Util.GetDecimal(row["SellAmount"]));
            switch (Util.GetInteger(row["SupplierType"]))
            {
                case 10:
                case 9:
                    //Take Sell Amount(Without Segment Fee)                   
                    //Minus TCS(if Applied)
                    BrPaytoHq = SellAmount / (100 + Util.GetDecimal(row["TCSPer"])) * 100;
                    //Minus WS +Ag + BR Commission
                    BrPaytoHq = BrPaytoHq * (BrAgWsMarkup) / 100;
                    //Add TCS =Q40*(100+C23)/100
                    BrPaytoHq = BrPaytoHq * (100 + Util.GetDecimal(row["TCSPer"])) / 100;                   
                    //Add Sell Segment Fee
                    BrPaytoHq = BrPaytoHq + GetSellSegmentFee(row);
                    //Minus above Amount from Sell Amount
                    BrPaytoHq = BrPaytoHq - GetHQToBRPay(row,0);
                    //Final BR Pay To HQ Amount {For Credit | Wallet System}
                    BrPaytoHq = Math.Round(BrPaytoHq, 2);
                    break;
                case 12:
                    //Take Sell Amount(Without Segment Fee)  
                    //Minus  WS + Ag + BR Commission
                    BrPaytoHq = SellAmount * BrAgWsMarkup / 100;
                    //Minus above Amount from Sell Amount
                    BrPaytoHq = SellAmount - BrPaytoHq;
                    //Add Sell Segment Fee
                    BrPaytoHq = BrPaytoHq + (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellSegmentXXCharge"]) : Util.GetDecimal(row["SellSegment"]));
                    //Final BR Pay To HQ Amount {For Credit | Wallet System}
                    BrPaytoHq = Math.Round(BrPaytoHq, 2);
                    break;
                case 16:
                case 17:
                    decimal InvAmt = 0, HQtoBrPay = 0;
                    //Take Invoice Amount
                    InvAmt = GetWsPay(row);
                    //Take HQ To BR Pay
                    HQtoBrPay = GetHQToBRPay(row, 0);
                    //Minus HQtoBrPay from InvAmt
                    BrPaytoHq = InvAmt - HQtoBrPay;
                    //Final BR Pay To HQ Amount { For Credit | Wallet System}
                    BrPaytoHq = Math.Round(BrPaytoHq, 2);
                    break;
            }
            return BrPaytoHq;
        }
        public decimal GetBOSTCS(DataRow row)
        {
            decimal BOS, TCS, BOSTCS = 0;
            decimal AgWsMarkup = (Util.GetDecimal(row["nWsPer"]) + Util.GetDecimal(row["nAgentPer"]));
            decimal SellAmount = Util.GetString(row["BookStatus"]) == "UC" ? 0 : (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellCancelCharge"]) : Util.GetDecimal(row["SellAmount"]));
            switch (Util.GetInteger(row["SupplierType"]))
            {
                case 9:
                    //BOS Amount
                    BOS = SellAmount / (100 + (Util.GetDecimal(row["TCSPer"]))) * 100;
                    // Total Amount
                    BOSTCS = SellAmount;
                    //TCS Amount (If Applicable)
                    TCS = BOSTCS - BOS;
                    // Total BOS +TCS Amount
                    BOSTCS = Math.Round(BOSTCS, 2);
                    break;
                case 10:
                    //Take Sell Amount(Without Segment Fee)
                    //Minus WS +AG Commission
                    BOS = SellAmount * (100 - AgWsMarkup) / 100;
                    //TCS Amount (If Applicable)
                    BOS = BOS-(BOS * (Util.GetDecimal(row["TCSPer"])) / 100);
                    //Minus TCS Amount
                    BOSTCS = BOS;// - TCS;                   
                    BOSTCS = Math.Round(BOSTCS, 2);
                    break;
                case 12:
                    //Take Sell Amount(Without Segment Fee)
                    //Minus WS +AG Commission
                    BOS = SellAmount * (100 - (AgWsMarkup)) / 100;
                    //TCS Amount (If Applicable)
                    //TCS = BOS * (Util.GetDecimal(row["TCSPer"])) / 100;
                    //Minus TCS Amount
                    BOSTCS = BOS;// - TCS;
                    //Total Amount
                    //BOSTCS = BOSTCS + TCS;
                    BOSTCS = Math.Round(BOSTCS, 2);
                    break;
            }
            return BOSTCS;
        }
        public decimal GetAgToOttilaTaxInvoice(DataRow row)
        {
            decimal AgToOttila = 0;
            decimal TaxableValue, GST, TDS = 0;
            decimal SellAmount = Util.GetString(row["BookStatus"]) == "UC" ? 0 : (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellCancelCharge"]) : Util.GetDecimal(row["SellAmount"]));
            decimal BOS = SellAmount / (100 + (Util.GetDecimal(row["TCSPer"]))) * 100;
            decimal AgWsMarkup = (Util.GetDecimal(row["nWsPer"]) + Util.GetDecimal(row["nAgentPer"]));
            switch (Util.GetInteger(row["SupplierType"]))
            {
                case 9:
                    //Taxable Value 
                    TaxableValue = Math.Round((BOS * (AgWsMarkup / 100)) / (100 + Util.GetDecimal(row["AgInvGST"])) * 100, 2);
                    //GST
                    GST = Math.Round((TaxableValue * Util.GetDecimal(row["nAgentPer"])) / 100, 2);
                    // TDS(minus)
                    TDS = Math.Round((TaxableValue * Util.GetDecimal(row["TDS"])) / 100, 2);
                    //Total  Ag To Ottila Tax Invoice Amount
                    AgToOttila = TaxableValue + GST + TDS;
                    //Total  Ag To Ottila Tax Invoice Amount
                    AgToOttila = Math.Round(AgToOttila, 2);
                    break;
            }
            return AgToOttila;
        }
        public decimal GetSegmentFeeTaxInv(DataRow row)
        {
            decimal SegFeeTax = 0, TCSamt, TaxableVal, GST = 0;
            switch (Util.GetInteger(row["SupplierType"]))
            {
                case 10:
                case 9:
                    //Taxable Value 
                    //TaxableVal = Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellSegmentXXCharge"]) : Util.GetDecimal(row["SellSegment"]);
                    //GST
                    //GST = Math.Round((TaxableVal * (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellSegmentXXChargeGST"]) : Util.GetDecimal(row["SellSegmentGST"]))) / 100, 2);

                    GST = Math.Round(Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellSegmentXXChargeGST"]) : Util.GetDecimal(row["SellSegmentGST"]), 2);
                    //TCS Amount (If Applicable)
                    TCSamt = (GST) * Util.GetDecimal(row["TCSPer"]) / 100;
                    //Total Tax Invoice
                    SegFeeTax =  GST + TCSamt;
                    //Total Segment FeeTax Invoice Amount
                    SegFeeTax = Math.Round(SegFeeTax, 2);
                    break;
            }
            return SegFeeTax;
        }
        public decimal GetOttilaToSuppNet(DataRow row)
        {
            decimal SuppPayN = 0;
            decimal NetAmount = Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["NetCancelCharge"]) : Util.GetDecimal(row["NetAmount"]);
            switch (Util.GetInteger(row["SupplierType"]))
            {
                case 12:
                case 10:
                case 9:
                    //Take Gross Amount                    
                    //Minus Commission based on Gross Amount
                    SuppPayN = NetAmount * (100 - Util.GetDecimal(row["SuppComm"])) / 100;
                    //Add Net Segment Fee
                    SuppPayN = SuppPayN +  Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["XXNetSegment"]) : Util.GetDecimal(row["NetSegment"]); 
                    //Final Amount
                    SuppPayN = Math.Round(SuppPayN, 2);
                    break;
                case 16:
                case 17:
                    //Take Net Amount
                    //Minus Commission based on Gross Amount
                    SuppPayN = NetAmount * (100 - Util.GetDecimal(row["SuppComm"])) / 100;
                    //Final Amount
                    SuppPayN = Math.Round(SuppPayN, 2);
                    break;
            }
            return SuppPayN;


        }
        public decimal GetOttilaToSuppSell(DataRow row)
        {
            decimal SuppPayS = 0;
            decimal NetAmount = Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["NetCancelCharge"]) : Util.GetDecimal(row["NetAmount"]);
            switch (Util.GetInteger(row["SupplierType"]))
            {
                case 12:
                case 10:
                case 9:
                    //Take Gross Amount                    
                    //Minus Commission based on Gross Amount
                    SuppPayS = NetAmount * (100 - Util.GetDecimal(row["SuppComm"])) / 100;
                    //Add Net Segment Fee
                    SuppPayS = SuppPayS + Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["XXNetSegment"]) : Util.GetDecimal(row["NetSegment"]) ;
                    //Multiply By Net To Sell ROE                   
                    SuppPayS = SuppPayS * Util.GetDecimal(row["XChangeRate"]);
                    //Final Amount
                    SuppPayS = Math.Round(SuppPayS, 2);
                    break;
                case 16:
                    decimal NetSegWithRoe;
                    //Take Gross Amount                    
                    //Minus Commission based on Gross Amount
                    SuppPayS = NetAmount * (100 - Util.GetDecimal(row["SuppComm"])) / 100;
                    //Apply ROE
                    SuppPayS = SuppPayS * Util.GetDecimal(row["XChangeRate"]);
                    //Add Net Segment Fee
                    NetSegWithRoe = Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["XXNetSegment"]) : Util.GetDecimal(row["NetSegment"])* Util.GetDecimal(row["SegROE"]);
                    //Add SuppPayS & NetSegWithRoe                  
                    SuppPayS = SuppPayS + NetSegWithRoe;
                    //Final Amount
                    SuppPayS = Math.Round(SuppPayS, 2);
                    break;
                case 17:
                    //Take Gross Amount                    
                    //Minus Commission based on Gross Amount
                    SuppPayS = NetAmount * (100 - Util.GetDecimal(row["SuppComm"])) / 100;
                    //Multiply By Net To Sell ROE                   
                    SuppPayS = SuppPayS * Util.GetDecimal(row["XChangeRate"]);
                    //Final Amount
                    SuppPayS = Math.Round(SuppPayS, 2);
                    break;
            }
            return SuppPayS;


        }
        public decimal GetOttilaToGvtTCS(DataRow row)
        {
            decimal TCSAmt = 0, TCSSeg, TCSTax;
            decimal SellAmount = Util.GetString(row["BookStatus"]) == "UC" ? 0 : (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellCancelCharge"]) : Util.GetDecimal(row["SellAmount"]));
            switch (Util.GetInteger(row["SupplierType"]))
            {
                case 10:
                case 9:
                    //Take Sell Amount   (Without Segment Fee)                   
                    //Get TCS tax Amount
                    TCSTax = SellAmount - (SellAmount / (100 + Util.GetDecimal(row["TCSPer"]))) * 100;
                    //Take Sell Segment                    
                    //Get TCS in Segment  amount
                    TCSSeg = GetSellSegmentFee(row) - (GetSellSegmentFee(row) / (100 + Util.GetDecimal(row["TCSPer"]))) * 100;
                    // Add tcs tax  + tcs seg
                    TCSAmt = TCSTax + TCSSeg;
                    //Final TCS Amount
                    TCSAmt = Math.Round(TCSAmt, 2);
                    break;
                case 16:
                case 17:
                    // Take Sell Amount 
                    TCSAmt = SellAmount;
                    //Minus Supplier Commission
                    TCSAmt = TCSAmt * (100 - Util.GetDecimal(row["SuppComm"])) / 100;
                    //Add Sell Service Charge
                    TCSAmt = TCSAmt + GetSellServiceCharge(row);
                    //Get TCS tax Amount        
                    TCSAmt = TCSAmt - (TCSAmt / (100 + Util.GetDecimal(row["TCSPer"])) * 100);
                    //Final Amount
                    TCSAmt = Math.Round(TCSAmt, 2) < 0 ? 0 : Math.Round(TCSAmt, 2);
                    break;
            }
            return TCSAmt;
        }
        public decimal GetOttilaToGvtBOSGST(DataRow row)
        {
            decimal BOSGSTAmt = 0;
            decimal SellAmount = Util.GetString(row["BookStatus"]) == "UC" ? 0 : (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellCancelCharge"]) : Util.GetDecimal(row["SellAmount"]));
            switch (Util.GetInteger(row["SupplierType"]))
            {
                case 10:
                case 9:
                    // Take Sell Amount(Without Segment Fee)
                    //Minus TCS(if Applied)
                    BOSGSTAmt = SellAmount / (100 + Util.GetDecimal(row["TCSPer"])) * 100;
                    //Get Commission Received From Supplier
                    BOSGSTAmt = BOSGSTAmt * Util.GetDecimal(row["SuppComm"]) / 100;
                    //Get Ottila GST on Commission
                    BOSGSTAmt = BOSGSTAmt - (BOSGSTAmt / (100 + (Util.GetDecimal(row["TaxPer"])))) * 100;
                    //Final BOS GST Amount
                    BOSGSTAmt = Math.Round(BOSGSTAmt, 2);
                    break;
                case 16:
                case 17:                   
                    //Take Sell Service Charge
                    BOSGSTAmt = GetSellServiceCharge(row);
                    //Minus TCS Tax 
                    BOSGSTAmt = BOSGSTAmt / (100 + Util.GetDecimal(row["TCSPer"])) * 100;
                    //Get GST Amount
                    BOSGSTAmt = BOSGSTAmt - (BOSGSTAmt / (100 + Util.GetDecimal(row["TaxPer"])) * 100);
                    //Round Upto 2 Decimal
                    BOSGSTAmt = Math.Round(BOSGSTAmt, 2);
                    break;
            }
            return BOSGSTAmt;
        }
        public decimal GetOttilaToGvtSegGST(DataRow row)
        {
            decimal SegGSTAmt =0, NetSeg=0;
            SegGSTAmt = Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellSegmentXXCharge"]) : Util.GetDecimal(row["SellSegment"]);
            NetSeg = Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellSegmentXXCharge"]) : Util.GetDecimal(row["SellSegment"]);
            switch (Util.GetInteger(row["SupplierType"]))
            {
                case 10:
                case 9:
                case 16:
                    //Take Sell Service Charge
                    SegGSTAmt = GetSegmnentServiceCharge(row);                   
                    //Minus TCS Tax 
                    SegGSTAmt = SegGSTAmt /(100+(Util.GetDecimal(row["TCSPer"]))) * 100; 
                     //Get GST Amount 
                     SegGSTAmt = SegGSTAmt - (SegGSTAmt / (100 + Util.GetDecimal(row["TaxPer"])) * 100);
                    //Final Segment GST Amount
                    SegGSTAmt = Math.Round(SegGSTAmt, 2);
                    break;
            }
            return SegGSTAmt;
        }
        public decimal GetOttilaToGvtTDS(DataRow row)
        {
            decimal TDSAmt = 0;
            decimal AgWsMarkup = (Util.GetDecimal(row["nWsPer"]) + Util.GetDecimal(row["nAgentPer"]));
            decimal SellAmount = Util.GetString(row["BookStatus"]) == "UC" ? 0 : (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellCancelCharge"]) : Util.GetDecimal(row["SellAmount"]));
            switch (Util.GetInteger(row["SupplierType"]))
            {
                case 9:
                    //Take Sell Amount   (Without Segment Fee)
                    //Minus TCS (if Applied)
                    TDSAmt = SellAmount / (100 + Util.GetDecimal(row["TCSPer"])) * 100;
                    //Get WS + Ag Commission
                    TDSAmt = TDSAmt * (AgWsMarkup) / 100;
                    //Minus Ag Tax GST
                    TDSAmt = Math.Round(TDSAmt / (100 + Util.GetDecimal(row["AgInvGST"])) * 100, 2);
                    //Get TDS on Above
                    TDSAmt = TDSAmt * Util.GetDecimal(row["TDS"]) / 100;
                    //Final TDS Amount
                    TDSAmt = Math.Round(TDSAmt, 2);
                    break;
            }
            return TDSAmt;
        }
        //public decimal GetTotalPayToGvt(DataRow row)
        //{
        //    decimal PayToGvt = 0;
        //    switch (Util.GetInteger(row["SupplierType"]))
        //    {
        //        case 10:

        //            //Take BOS GST Pay
        //            //Take Segment GST Pay
        //            //Take TDS Pay
        //            //Take TCS Pay
        //            //Add All Above
        //            PayToGvt = GetOttilaToGvtBOSGST(row) + GetOttilaToGvtSegGST(row) + GetOttilaToGvtTDS(row) + GetOttilaToGvtTCS(row);
        //            //Total Pay To Government
        //            PayToGvt = Math.Round(PayToGvt, 2);
        //            break;
        //        case 16:
        //        case 17:
        //            //Ottila To Government  - TCS [Sell Currency]
        //            //Ottila To Government - GST [Sell Currency]
        //            //Add Ottila To Government  - TCS and Ottila To Government - GST
        //            PayToGvt = GetOttilaToGvtTCS(row) + GetOttilaToGvtBOSGST(row);
        //            break;
        //    }
        //    return PayToGvt;
        //}

        public decimal GetSOBSeg(DataRow row)
        {
            decimal SOBseg = 0;
            decimal Markup = (Util.GetDecimal(row["nWsPer"]) + Util.GetDecimal(row["nAgentPer"]));
            decimal SellAmount = Util.GetString(row["BookStatus"]) == "UC" ? 0 : (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellCancelCharge"]) : Util.GetDecimal(row["SellAmount"]));
            switch (Util.GetInteger(row["SupplierType"]))
            {
                case 12:
                    //Sell Amount (Without Segment Fee)
                    //Minus WS +AG Commission
                    SOBseg = SellAmount * (100 - (Markup)) / 100;
                    //Add Sell Segment Fee
                    SOBseg = SOBseg + (Util.GetString(row["BookStatus"]) == "XX" ? Util.GetDecimal(row["SellSegmentXXCharge"]) : Util.GetDecimal(row["SellSegment"]));
                    //Total SOB + Segment Amount
                    SOBseg = Math.Round(SOBseg, 2);
                    break;
            }
            return SOBseg;
        }
    }
}
