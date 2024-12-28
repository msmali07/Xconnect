using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ReportProject.API.Startup))]
namespace ReportProject.API
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
