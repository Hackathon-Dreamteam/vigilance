using InvasionQc.Core.Advisory;
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
    private readonly IAdvisor _advisor;

    public SpeciesController(IMediator mediator, IAdvisor advisor)
    {
        _mediator = mediator;
        this._advisor = advisor;
    }

    [HttpGet]
    [Route("{speciesName}")]
    [ProducesResponseType<SpeciesDetails>(200)]
    public async Task<IActionResult> Get([FromRoute] string speciesName, [FromQuery] Locations location, CancellationToken cancellationToken)
    {
        var speciesDetails = await this._mediator.Send(new GetSpeciesDetails(speciesName, location), cancellationToken);
        return this.Ok(speciesDetails);
    }

    [HttpGet]
    [Route("{speciesName}/description")]
    [ProducesResponseType<string>(200)]
    public async Task<IActionResult> GetImage([FromRoute] string speciesName, [FromQuery] Locations location, CancellationToken cancellationToken)
    {
        var speciesDetails = await this._mediator.Send(new GetSpeciesDescriptionQuery(speciesName, location), cancellationToken);
        return this.Ok(speciesDetails);
    }
}
