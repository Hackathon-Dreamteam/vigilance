using InvasionQc.Core.Constants;
using InvasionQc.Core.Observations;
using InvasionQc.Core.Utils;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace InvasionQc.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
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
}
