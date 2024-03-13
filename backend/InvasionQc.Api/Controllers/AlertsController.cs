using InvasionQc.Core.Advisory;
using InvasionQc.Core.Alerting;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace InvasionQc.Api.Controllers;

[ApiController]
[Route("api/alerts")]
public class AlertsController: ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IMemoryCache _cache;

    public AlertsController(IMediator mediator, IMemoryCache cache)
    {
        _mediator = mediator;
        _cache = cache;
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

    [HttpGet]
    [Route("{alertId}/advice")]
    [ProducesResponseType<AlertAdvice>(200)]
    public async Task<IActionResult> Get(Guid alertId, CancellationToken cancellationToken)
    {
   string cacheKey = $"AlertAdvice_{alertId}";

    if (!_cache.TryGetValue(cacheKey, out AlertAdvice? advice))
    {
        advice = await this._mediator.Send(new GetActionableAdviceOnAlertQuery(alertId), cancellationToken);

        // Set cache options
        var cacheOptions = new MemoryCacheEntryOptions()
            .SetAbsoluteExpiration(TimeSpan.FromDays(1)); // Change this as needed

        // Save data in cache
        _cache.Set(cacheKey, advice, cacheOptions);
    }

    return this.Ok(advice);
    }
}
