using Report.DO;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Report.DAL
{
    public sealed class Util
    {
        public static int GetInteger(object obj)
        {
            return (obj == null || obj == DBNull.Value || obj.ToString() == "") ? 0 : Convert.ToInt32(obj);
        }

        public static int GetInteger(bool b)
        {
            return b ? 1 : 0;
        }

        public static string GetString(object obj)
        {
            return (obj == null || obj == DBNull.Value || obj.ToString() == "") ? string.Empty : obj.ToString().Trim();
        }

        public static DateTime GetDateTime(object str)
        {
            return (str == null || str == DBNull.Value || str.ToString() == "") ? DateTime.MinValue : Convert.ToDateTime(str);
        }

        public static Single GetSingle(object str)
        {
            return (str == null || str == DBNull.Value || str.ToString() == "") ? Convert.ToSingle(0.0) : Convert.ToSingle(str);
        }

        public static Decimal GetDecimal(object str)
        {
            return (str == null || str == DBNull.Value || str.ToString() == "") ? Convert.ToDecimal(0.0) : Convert.ToDecimal(str);
        }

        public static bool GetBoolean(object str)
        {
            return (str == null || str == DBNull.Value || str.ToString() == "") ? false : Convert.ToBoolean(str);
        }

        public static bool GetBoolean(int i)
        {
            return i == 0 ? false : true;
        }



        public static string GetGroupName(int GroupId)
        {
            string GroupName = string.Empty;
            switch (GroupId)
            {
                case 1:
                    GroupName = "Admin Controls";
                    break;
                case 2:
                    GroupName = "Booking";
                    break;
                case 3:
                    GroupName = "Reports";
                    break;
                case 4:
                    GroupName = "Account";
                    break;
                case 5:
                    GroupName = "Products";
                    break;
                case 6:
                    GroupName = "RailEurope";
                    break;
                case 7:
                    GroupName = "Booking Action";
                    break;
            }
            return GroupName;

        }
        public static MemberTypes GetMemberType(int i)
        {
            switch (i)
            {
                case 0:
                    return MemberTypes.NotLoggedIn;
                case 1:
                    return MemberTypes.HeadQuarter;
                case 2:
                    return MemberTypes.Branch;
                case 3:
                    return MemberTypes.Wholesaler;
                case 4:
                    return MemberTypes.Agent;
                case 5:
                    return MemberTypes.Corporate;
                default:
                    return MemberTypes.NotLoggedIn;
            }
        }

        public static string ToTitleCase(object str)
        {
            CultureInfo cultureInfo = Thread.CurrentThread.CurrentCulture;
            TextInfo textInfo = cultureInfo.TextInfo;

            return textInfo.ToTitleCase(str.ToString().ToLower());
        }



        public static string Substring(string str, int length)
        {
            var cleaned = string.Empty;
            if (!string.IsNullOrEmpty(str))
            {
                string textOnly = string.Empty;
                System.Text.RegularExpressions.Regex tagRemove = new System.Text.RegularExpressions.Regex(@"<[^>]*(>|$)");
                System.Text.RegularExpressions.Regex compressSpaces = new System.Text.RegularExpressions.Regex(@"[\s\r\n]+");
                textOnly = tagRemove.Replace(str, string.Empty);
                textOnly = compressSpaces.Replace(textOnly, " ");
                cleaned = textOnly;


                if (textOnly.Length > length)
                {
                    str = textOnly.Substring(0, length);

                    //str += "...</span>";
                }
            }
            return str;
        }

        public static string GetStarForSorting(string rating)
        {
            string starId = string.Empty;
            switch (rating)
            {
                case "1":
                case "1.5":
                    starId = "1";
                    break;
                case "2":
                case "2.5":
                    starId = "2";
                    break;
                case "3":
                case "3.5":
                    starId = "3";
                    break;
                case "4":
                case "4.5":
                    starId = "4";
                    break;
                case "5":
                    starId = "5";
                    break;
                default:
                    starId = "0";
                    break;
            }
            return starId;
        }

        public static string GetStarImage(string rating)
        {
            string imagePath = "images/star";

            switch (rating)
            {
                case "9":
                case "10":
                    imagePath += "/Apartment_Star.png";
                    break;
                case "7":
                case "7.0":
                case "SEVEN":
                    imagePath += "/5stars_result.gif";
                    break;
                case "6":
                case "6.0":
                case "SIX":
                    imagePath += "/5stars_result.gif";
                    break;
                case "5":
                case "5.0":
                case "FIVE":
                    imagePath += "/5stars_result.gif";
                    break;
                case "4.5":
                    imagePath += "/4.5stars_result.gif";
                    break;
                case "4":
                case "4.0":
                case "FOUR":
                    imagePath += "/4stars_result.gif";
                    break;
                case "3.5":
                    imagePath += "/3.5stars_result.gif";
                    break;
                case "3":
                case "3.0":
                case "THREE":
                    imagePath += "/3stars_result.gif";
                    break;
                case "2.5":
                    imagePath += "/2.5stars_result.gif";
                    break;
                case "2":
                case "2.0":
                case "TWO":
                    imagePath += "/2stars_result.gif";
                    break;
                case "1.5":
                    imagePath += "/1.5stars_result.gif";
                    break;
                case "1":
                case "1.0":
                case "ONE":
                    imagePath += "/1stars_result.gif";
                    break;
                case "Residence":
                case "Guest House":
                    imagePath = rating;
                    break;
                #region Add by Rupesh on 07-02-2014
                case "RSORT":
                    imagePath += "/Resort.png";
                    break;
                case "HS":
                case "ALBER":
                case "HSR":
                    imagePath += "/Hostel.png";
                    break;
                case "CAMP":
                    imagePath += "/Camping.png";
                    break;
                case "LL":
                case "1LL":
                    imagePath += "/1Key.png";
                    break;
                case "2LL":
                    imagePath += "/2Key.png";
                    break;
                case "3LL":
                    imagePath += "/3Key.png";
                    break;
                case "4LL":
                    imagePath += "/4Key.png";
                    break;
                case "5LL":
                    imagePath += "/5Key.png";
                    break;
                case "AG":
                case "HR":
                    imagePath += "/RuralHouse.png";
                    break;
                case "BB":
                    imagePath += "/bed_and _breakfast.png";
                    break;
                case "CHUES":
                    imagePath += "/GuestHouse.png";
                    break;
                case "H1S":
                    imagePath += "/1stars_result.gif";
                    break;
                case "H1_5":
                    imagePath += "/1.5stars_result.gif";
                    break;
                case "H2S":
                    imagePath += "/2stars_result.gif";
                    break;
                case "H2_5":
                    imagePath += "/2.5stars_result.gif";
                    break;
                case "H3S":
                    imagePath += "/3stars_result.gif";
                    break;
                case "H3_5":
                    imagePath += "/3.5stars_result.gif";
                    break;
                case "H4S":
                    imagePath += "/4stars_result.gif";
                    break;
                case "H4_5":
                    imagePath += "/4.5stars_result.gif";
                    break;
                case "H5S":
                case "H5_5":
                    imagePath += "/5stars_result.gif";
                    break;
                case "LODGE":
                    imagePath += "/Lodge.png";
                    break;
                #endregion

                default:
                    imagePath = "0";
                    break;
            }
            return imagePath;
        }



       

        //add full status for UC (but all ref at one time)
        public static string GetStatus(string Status, string SuppID, int CompCode, int Appurl, string SuppRefNo)
        {
            string GetStatus = string.Empty;
            Status = Status.Trim().ToUpper();
            switch (Status)
            {
                case "PN":
                    GetStatus = "PENDING NEED";
                    break;
                case "RQ":
                    GetStatus = "REQUESTED";
                    break;
                case "KK":
                    GetStatus = "CONFIRMED";
                    break;
                case "RR":
                    GetStatus = "RECONFIRMED";
                    break;
                case "RN":
                    GetStatus = "RECONFIRM REQUEST";
                    break;
                case "XX":
                    GetStatus = "CANCELLED";
                    break;
                case "XN":
                    GetStatus = "CANCELLATION REQUEST";
                    break;
                case "UC":
                    if (SuppRefNo == null || SuppRefNo == "")
                    {
                        GetStatus = "UNSUCCESSFUL BOOKING"; /*"UNSUCCESSFUL BOOKING";*/
                    }
                    else
                    {
                        GetStatus = "SOLD OUT";
                    }
                    break;
                case "HN":
                    GetStatus = "STATUS REQUESTED";
                    break;
                case "HL":
                    GetStatus = "STATUS WAITLISTED";
                    break;
                case "PC":
                    GetStatus = "PARTIALLY CONFIRMED";
                    break;
                case "AR":
                    GetStatus = "AMEND REQUESTED";
                    break;
                case "PP":
                    GetStatus = "PAYMENT PENDING";
                    break;
                case "CS":
                    GetStatus = "CHECK STATUS";
                    break;
                case "KK MAIL":
                    GetStatus = "CONFIRMED MAIL TO SUPPLIER";
                    break;
                case "XNMAIL":
                    GetStatus = "CANCELLED MAIL TO SUPPLIER";
                    break;
                default:
                    GetStatus = Status;
                    break;
            }
            return GetStatus;
        }

        public static string GetServiceName(string Type)
        {
            string ServiceName = string.Empty;
            switch (Type)
            {
                case "H":
                    ServiceName = "Hotel";
                    break;
                case "T":
                    ServiceName = "Transfer";
                    break;
                case "S":
                    ServiceName = "Tour";
                    break;
                case "F":
                    ServiceName = "Flight";
                    break;
                case "E":
                    ServiceName = "Escorted";
                    break;
                case "P":
                    ServiceName = "Package";
                    break;
                case "M":
                    ServiceName = "Miscellaneous";
                    break;
                case "NPR":
                    ServiceName = "Rail Europe";
                    break;
                case "TR":
                    ServiceName = "Rail Europe";
                    break;
                case "PR":
                    ServiceName = "Rail Europe";
                    break;
                case "C":
                    ServiceName = "Car Rental";
                    break;
                case "OP":
                    ServiceName = "Online Package";
                    break;
            }
            return ServiceName;
        }



        public static void ErrorLock(string errorMessage)
        {
            try
            {
                string path = "~/ErrorFile/" + DateTime.Today.ToString("dd-MMM-yyyy") + ".html";
                if (!File.Exists(System.Web.HttpContext.Current.Server.MapPath(path)))
                {
                    File.Create(System.Web.HttpContext.Current.Server.MapPath(path)).Close();
                }
                using (StreamWriter w = File.AppendText(System.Web.HttpContext.Current.Server.MapPath(path)))
                {
                    w.WriteLine("\r\nError Log  :<br/> ");
                    w.WriteLine("{0}", DateTime.Now.ToString("dd-MMM-yyyy hh:mm:ss#").ToString(CultureInfo.InvariantCulture));
                    string err = "<br/>Error in: " + System.Web.HttpContext.Current.Request.Url.ToString() +
                              "\r\n" + errorMessage;
                    w.WriteLine(err);

                    w.WriteLine("<br/>================================================================================<br/>");
                    w.Flush();
                    w.Close();

                }

                //delte old files
                string[] files = Directory.GetFiles(System.Web.HttpContext.Current.Server.MapPath("~/ErrorFile/"));
                int iCnt = 0;

                foreach (string file in files)
                {


                    FileInfo info = new FileInfo(file);

                    info.Refresh();

                    //if (fi.LastAccessTime < DateTime.Now.AddDays(-10))

                    //i.e todays before four days -only remain in flder and older files are deleted
                    if (info.LastWriteTime <= DateTime.Now.AddDays(-4))
                    {
                        info.Delete();
                        iCnt += 1;
                    }
                }
            }
            catch (Exception ex)
            {

            }
        }



    }
}
