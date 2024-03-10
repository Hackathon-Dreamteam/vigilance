using InvasionQc.Core.Constants;
using InvasionQc.Core.Species;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace InvasionQc.Api.Controllers;

[ApiController]
[Route("api/species")]
public class SpeciesController: ControllerBase
{
    private readonly IMediator _mediator;

    public SpeciesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [Route("{speciesName}")]
    [ProducesResponseType<SpeciesDetails>(200)]
    public async Task<IActionResult> Get([FromRoute] string speciesName, [FromQuery] Locations location, CancellationToken cancellationToken)
    {
        var speciesDetails = await this._mediator.Send(new GetSpeciesDetails(speciesName, location), cancellationToken);
        return this.Ok(speciesDetails);
    }
}
