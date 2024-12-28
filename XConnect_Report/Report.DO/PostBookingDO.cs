using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Report.DO
{
    public class PostBookingDO
    {
        public int memberid { get; set; }
        public string CompanyName { get; set; }
        public int MemberTypeId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public int AgCommPer { get; set; }
        public bool IsOverSeasAgent { get; set; }
        public string DisplayCurrency { get; set; }
        public string SellCurrency { get; set; }
        public int NationalityId { get; set; }
        public string Nationality { get; set; }
        public bool DirectClient { get; set; }
    }
}
