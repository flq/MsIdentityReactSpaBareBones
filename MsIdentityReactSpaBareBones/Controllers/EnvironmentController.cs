using Microsoft.AspNetCore.Mvc;

namespace MsIdentityReactSpaBareBones.Controllers
{
    [Route("api/[controller]")]
    public class EnvironmentController : Controller
    {
        // GET
        public IActionResult Index()
        {
            return Json(new Environment {Env = "DEV"});
        }
    }

    public class Environment
    {
        public string Env { get; set; }
    }
}