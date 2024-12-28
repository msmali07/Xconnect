using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace Report.BLL
{
    public class LoginBLL
    {
        public int[] GetApplicableUrl(XmlDocument docx, string Url)
        {

            int[] obj = new int[2];
            int AppUrl = 0;
            int CCode = 0;

            XmlNamespaceManager nsmanager = new XmlNamespaceManager(docx.NameTable);
            nsmanager.AddNamespace("", "");
            XmlNodeList nodelist = docx.SelectNodes(string.Format("//Clients/Client"), nsmanager);
            foreach (XmlNode node in nodelist)
            {
                XmlNode XnodeUrlName = node.SelectSingleNode(string.Format("Url"), nsmanager);
                string UrlName = XnodeUrlName.InnerText.Trim();
                if (Url == UrlName)
                {

                    XmlNode XCComanydetails = node.SelectSingleNode(string.Format("CompanyDetails/CompanyCode"), nsmanager);
                    XmlNode XCCode = XCComanydetails.Attributes["CCode"];
                    CCode = Convert.ToInt32(XCCode.InnerText);

                    XmlNode XAppUrl = XCComanydetails.Attributes["Appurl"];
                    AppUrl = Convert.ToInt32(XAppUrl.InnerText);

                    obj[0] = CCode;
                    obj[1] = AppUrl;
                    break;
                }

            }
            return obj;
        }
    }
}
