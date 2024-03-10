using InvasionQc.Core.Alerting;
using InvasionQc.Core.Constants;
using InvasionQc.Core.Observations;
using InvasionQc.Core.Utils;
using MediatR;

namespace InvasionQc.Core.Species;

public record GetSpeciesDetails(string SpeciesName, Locations Location) : IRequest<SpeciesDetails>;

public class GetSpeciesDetailsHandler : IRequestHandler<GetSpeciesDetails, SpeciesDetails>
{
    private readonly AlertRepositories _alertRepositories;
    private readonly IMediator _mediator;

    public GetSpeciesDetailsHandler(AlertRepositories alertRepositories, IMediator mediator)
    {
        _alertRepositories = alertRepositories;
        this._mediator = mediator;
    }

    public async Task<SpeciesDetails> Handle(GetSpeciesDetails request, CancellationToken cancellationToken)
    {
        var alerts = this._alertRepositories.GetAlerts(request.SpeciesName);

        var observations = await this._mediator.CreateStream(new GetObservationsQuery(request.Location), cancellationToken).ToListAsync();

        var observationsForSpecies = observations.Where(o => string.Equals(request.SpeciesName, o.SpeciesName, StringComparison.InvariantCultureIgnoreCase)).ToList();

        return new SpeciesDetails(
            request.SpeciesName,
            "TODO",
            observationsForSpecies.FirstOrDefault()?.ImageUrl ?? string.Empty,
            alerts,
            observationsForSpecies);
    }
}
