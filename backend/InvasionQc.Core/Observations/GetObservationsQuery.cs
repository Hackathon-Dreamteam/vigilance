using System.Runtime.CompilerServices;
using InvasionQc.Core.Constants;
using InvasionQc.Core.FileDataLoader;
using InvasionQc.Core.Utils;
using MediatR;

namespace InvasionQc.Core.Observations;

public record GetObservationsQuery(Locations Location) : IStreamRequest<Observation>;

public class GetObservationsQueryHandler : IStreamRequestHandler<GetObservationsQuery, Observation>
{
    private readonly FileObservationsLoader _fileObservationsLoader;

    public GetObservationsQueryHandler(FileObservationsLoader fileObservationsLoader)
    {
        this._fileObservationsLoader = fileObservationsLoader;
    }

    public async IAsyncEnumerable<Observation> Handle(GetObservationsQuery request, [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        await foreach (var observation in _fileObservationsLoader.GetSpecies(request.Location, cancellationToken))
        {
            yield return new Observation()
            {
                SpeciesName = observation.SpeciesName,
                Location = observation.Location,
                IsInvasive = observation.IsInvasive,
                IsPrecarious = true,
                Date = DateTimeOffset.UtcNow,
                GeoLocation = new GeoLocation(100, 100)

            };
        }
    }
}
