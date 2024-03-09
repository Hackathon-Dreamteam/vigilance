using InvasionQc.Core.Alerting;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace InvasionQc.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AlertsController: ControllerBase
{
    private readonly IMediator _mediator;

    public AlertsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [ProducesResponseType<Alert[]>(200)]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        var alerts = await this._mediator.Send(new GetAlertsQuery(), cancellationToken);
        return this.Ok(alerts);
    }

    [HttpGet]
    [Route("remove-alert")]
    public async Task<IActionResult> RemoveAlert(Guid alertId, CancellationToken cancellationToken)
    {
        await this._mediator.Send(new DeleteAlertsCommand(alertId), cancellationToken);
        return this.Ok();
    }
}
