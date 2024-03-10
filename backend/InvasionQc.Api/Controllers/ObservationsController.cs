using InvasionQc.Core.Constants;
using InvasionQc.Core.Observations;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace InvasionQc.Api.Controllers;

[ApiController]
[Route("api/observations")]
public class ObservationsController: ControllerBase
{
    private readonly IMediator _mediator;

    public ObservationsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [ProducesResponseType<Observation[]>(200)]
    public IAsyncEnumerable<Observation> Get(Locations location, CancellationToken cancellationToken)
    {
            return this._mediator.CreateStream(new GetObservationsQuery(location), cancellationToken);
    }

    [HttpGet("latest")]
    [ProducesResponseType<Observation[]>(200)]
    public IAsyncEnumerable<Observation> GetLatest(Locations location, CancellationToken cancellationToken)
    {
        return this._mediator.CreateStream(new GetObservationsLatestQuery(location), cancellationToken);
    }
}
