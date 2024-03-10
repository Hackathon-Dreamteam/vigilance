using System.Runtime.CompilerServices;
using InvasionQc.Core.Constants;
using InvasionQc.Core.INaturalistLoader;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Globalization;
using static System.Globalization.CultureInfo;
using static System.Globalization.DateTimeStyles;

namespace InvasionQc.Core.Observations;

public record GetObservationsLatestQuery(Locations Location) : IStreamRequest<Observation>;

public class GetObservationsLatestQueryHandler : IStreamRequestHandler<GetObservationsLatestQuery, Observation>
{
    private readonly INaturalistObservationsLoader _naturalistObservationsLoader;

    private readonly ILogger<GetObservationsLatestQueryHandler> _logger;

    public GetObservationsLatestQueryHandler(INaturalistObservationsLoader naturalistObservationsLoader, ILogger<GetObservationsLatestQueryHandler> logger)
    {
        this._naturalistObservationsLoader = naturalistObservationsLoader;
        this._logger = logger;
    }

    public async IAsyncEnumerable<Observation> Handle(GetObservationsLatestQuery request, [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        await foreach (var observationData in _naturalistObservationsLoader.GetLastObservation(request.Location, cancellationToken))
        {
            _logger.LogInformation("Observation data: {0}", observationData);
            DateTimeOffset observationDate;
            if (DateTimeOffset.TryParseExact(observationData.ObservationDate, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out observationDate))
            {
                yield return new Observation()
                {
                    SpeciesName = observationData.taxon.name,
                    Location = observationData.Location,
                    IsInvasive = true,
                    GeoLocation = new GeoLocation(observationData.geojson.coordinates[0], observationData.geojson.coordinates[1]),
                    Source = observationData.Source,
                    Date = observationDate
                };
            }
        }
    }
}
