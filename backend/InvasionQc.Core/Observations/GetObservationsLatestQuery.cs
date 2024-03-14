
﻿using System.Globalization;
using System.Runtime.CompilerServices;
using InvasionQc.Core.Constants;
using InvasionQc.Core.DataLoader;
using MediatR;
using Microsoft.Extensions.Logging;

namespace InvasionQc.Core.Observations;

public record GetObservationsLatestQuery(Locations Location) : IStreamRequest<Observation>;

public class GetObservationsLatestQueryHandler : IStreamRequestHandler<GetObservationsLatestQuery, Observation>
{
    private readonly ILogger<GetObservationsLatestQueryHandler> _logger;
    private readonly NaturalistObservationsLoader _naturalistObservationsLoader;

    public GetObservationsLatestQueryHandler(NaturalistObservationsLoader naturalistObservationsLoader, ILogger<GetObservationsLatestQueryHandler> logger)
    {
        _naturalistObservationsLoader = naturalistObservationsLoader;
        _logger = logger;
    }

    public async IAsyncEnumerable<Observation> Handle(GetObservationsLatestQuery request, [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        await foreach (var observationData in _naturalistObservationsLoader.GetLastObservation(request.Location, cancellationToken))
        {
            _logger.LogInformation("Observation data: {0}", observationData);
            DateTimeOffset observationDate;
            if (DateTimeOffset.TryParseExact(observationData.ObservationDate, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out observationDate))
            {
                yield return new Observation
                {
                    SpeciesName = observationData.taxon.name,
                    Location = observationData.Location,
                    IsInvasive = true,
                    GeoLocation = new GeoLocation(observationData.geojson.coordinates[0], observationData.geojson.coordinates[1]),
                    Source = "Community",
                    Date = observationDate,
                    TaxonId = observationData.taxonId,
                    ObservationId = $"c_{observationData.ObservationId}",
                    ImageUrl = observationData.ObservationPhotos
                        .Select(x => x.Metadata?.Url?.Replace("square.jpeg", "large.jpeg")?.Replace("square.jpg", "large.jpg"))
                        .FirstOrDefault() ?? string.Empty,
                    iNaturalistLink = $"https://www.inaturalist.org/observations/{observationData.ObservationId}"
                };
            }
        }
    }
}
