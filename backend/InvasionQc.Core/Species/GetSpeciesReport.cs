using InvasionQc.Core.Alerting;
using InvasionQc.Core.Constants;
using InvasionQc.Core.Observations;
using InvasionQc.Core.Utils;
using MediatR;

namespace InvasionQc.Core.Species;

public record GetSpeciesReport(string SpeciesName, Locations Location) : IRequest<SpeciesReports>;

public class GetSpeciesReportHandler : IRequestHandler<GetSpeciesReport, SpeciesReports>
{
    private readonly AlertRepositories _alertRepositories;
    private readonly IMediator _mediator;

    public GetSpeciesReportHandler(AlertRepositories alertRepositories, IMediator mediator)
    {
        _alertRepositories = alertRepositories;
        this._mediator = mediator;
    }

    public async Task<SpeciesReports> Handle(GetSpeciesReport request, CancellationToken cancellationToken)
    {
        var alerts = this._alertRepositories.GetAlerts(request.SpeciesName);

        var observations = await this._mediator.CreateStream(new GetObservationsQuery(request.Location), cancellationToken).ToListAsync();

        var observationsForSpecies = observations.Where(o => string.Equals(request.SpeciesName, o.SpeciesName, StringComparison.InvariantCultureIgnoreCase)).ToList();

        return new SpeciesReports(
            alerts,
            observationsForSpecies);
    }
}
