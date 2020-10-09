using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph;
using Microsoft.Identity.Web.Resource;

namespace MsIdentityReactSpaBareBones.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : Controller
    {
        /// <summary>
        ///     The Web API will only accept tokens 1) for users, and
        ///     2) having the access_as_user scope for this API
        /// </summary>
        private static readonly string[] scopeRequiredByApi = {"read_profile"};

        private readonly GraphServiceClient _graphServiceClient;

        public ProfileController(GraphServiceClient graphServiceClient)
        {
            _graphServiceClient = graphServiceClient;
        }

        [HttpGet("me")]
        public async Task<ActionResult<object>> GetProfile()
        {
            HttpContext.VerifyUserHasAnyAcceptedScope(scopeRequiredByApi);
            var profile = await _graphServiceClient.Me.Request().GetAsync();
            return Json(new
            {
                profile.Id,
                profile.UserPrincipalName,
                profile.GivenName,
                profile.Surname,
                profile.JobTitle,
                profile.MobilePhone,
                profile.PreferredLanguage
            });
        }
    }
}