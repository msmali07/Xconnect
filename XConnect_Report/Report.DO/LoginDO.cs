using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Report.DO
{
    public class LoginDO
    {

        public string Username { get; set; }

        public string Password { get; set; }

        public bool RememberMe { get; set; }
    }

    public class CrossLoginDO
    {
        public string MainCompanyName { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public int CrossAppUrl { get; set; }

        public int CrossCompCode { get; set; }

        public int LoginType { get; set; }

        public bool IsCrossLogin { get; set; }
    }
}
