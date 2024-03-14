using System.Runtime.CompilerServices;
using InvasionQc.Core.Constants;
using InvasionQc.Core.DataLoader;
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
        await foreach (var observationData in _fileObservationsLoader.GetSpecies(request.Location, cancellationToken))
        {

            yield return new Observation()
            {
                ObservationId = observationData.ObservationId,
                SpeciesName = observationData.SpeciesName,
                Location = observationData.Location,
                IsInvasive = observationData.IsInvasive,
                IsPrecarious = observationData.IsPrecarious,
                GeoLocation = new GeoLocation(observationData.Latitude, observationData.Longitude),
                ImageUrl = observationData.ImageUrl?.Replace("\\", "") ?? string.Empty,
                Source = observationData.Source,
                Date = observationData.ObservationDate,
                TaxonId = observationData.TaxonId!,
                iNaturalistLink = $"https://www.inaturalist.org/observations/{observationData.ObservationId.Substring(2)}"
            };
        }
    }
}
