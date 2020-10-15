using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace MsIdentityReactSpaBareBones.Controllers
{
    [Route("api/[controller]")]
    public class EnvironmentController : Controller
    {
        private readonly IHubContext<PushHub> _pushHubContext;

        public EnvironmentController(IHubContext<PushHub> pushHubContext)
        {
            _pushHubContext = pushHubContext;
        }
        // GET
        public IActionResult Index()
        {
            return Json(new {Env = "DEV"});
        }

        [HttpGet("push")]
        public async Task<IActionResult> Push()
        {
            await _pushHubContext.Clients.All.SendAsync("notification", "There is a news waiting for you!");
            return Ok();
        }
    }
}