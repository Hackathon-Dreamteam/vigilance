using InvasionQc.Core.Constants;
using InvasionQc.Core.FileDataLoader;
using InvasionQc.Core.Observations;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace InvasionQc.Api.Controllers;

[ApiController]
[Route("observations")]
public class ObservationsController: ControllerBase
{
    private readonly IMediator _mediator;

    public ObservationsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [ProducesResponseType<FileObservations[]>(200)]
    public async Task<IActionResult> Get(Locations location)
    {
        var observations = await this._mediator.Send(new GetObservationsQuery(location));
        return this.Ok(observations);
    }

}
