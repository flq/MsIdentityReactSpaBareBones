using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace MsIdentityReactSpaBareBones
{
    // [Authorize]
    public class PushHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            await Clients.Caller.SendAsync("notification", "Hello - Payload");
        }
    }
}