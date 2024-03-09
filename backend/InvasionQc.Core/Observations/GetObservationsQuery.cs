using InvasionQc.Core.Constants;
using InvasionQc.Core.FileDataLoader;
using MediatR;

namespace InvasionQc.Core.Observations;

public record GetObservationsQuery(Locations Location) : IRequest< IReadOnlyCollection<Observations>>;

public class GetObservationsQueryHandler : IRequestHandler<GetObservationsQuery, IReadOnlyCollection<Observations>>
{
    public Task<IReadOnlyCollection<Observations>> Handle(GetObservationsQuery request, CancellationToken cancellationToken)
    {
        var fileObservations = FileObservationsLoader.GetSpecies(request.Location);

        var observations = fileObservations.Select(x => new Observations
        {
            SpeciesName = x.SpeciesName,
            Location = x.Location,
            IsInvasive = x.IsInvasive
        }).ToList();

        return Task.FromResult<IReadOnlyCollection<Observations>>(observations);
    }
}

public class Observations
{
    public string SpeciesName { get; set; } = string.Empty;

    public string Location { get; set; } = string.Empty;

    public bool IsInvasive { get; set; }
}
