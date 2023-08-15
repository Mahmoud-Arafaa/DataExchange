using Microsoft.AspNetCore.SignalR;

namespace ApiProject.Hubs
{
    public class DataTimeHub : Hub
    {
        public async Task SendDateTime(string dateTime)
        {
            await Clients.All.SendAsync("ReceiveDateTime", dateTime);
        }

    }
}
