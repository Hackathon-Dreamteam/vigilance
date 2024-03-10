using System.Runtime.CompilerServices;
using System.Text.Json;
using System.Text.Json.Serialization;
using InvasionQc.Core.Constants;
using Microsoft.Extensions.Logging;

namespace InvasionQc.Core.DataLoader;

public class FileObservationsLoader
{
    private readonly ILogger<FileObservationsLoader> _logger;

    public FileObservationsLoader(ILogger<FileObservationsLoader> logger)
    {
        this._logger = logger;
    }

    public async IAsyncEnumerable<FileObservations> GetSpecies(Locations location, [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        using FileStream json = File.OpenRead(GetFilePath());
        var observationsEnumerable =  JsonSerializer.DeserializeAsyncEnumerable(json, ObservationsSourceGenerationContext.Default.FileObservations, cancellationToken);
        await foreach (var observation in observationsEnumerable)
        {
            if(observation == null)
            {
                continue;
            }

            if(location == Locations.All)
            {
                yield return observation;
            }
            else if (observation.Location == location.ToString())
            {
                yield return observation;
            }
        }
    }

    private static string GetFilePath()
    {
        return Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data/observations.json");
    }
}

public class FileObservations
{
    [JsonPropertyName("id")]
    public string ObservationId { get; set; } = string.Empty;

    [JsonPropertyName("species_guess")]
    public string SpeciesName { get; set; } = string.Empty;

    [JsonPropertyName("location")]
    public string Location { get; set; } = string.Empty;

    [JsonPropertyName("isInvasive")]
    public bool IsInvasive { get; set; }

    [JsonPropertyName("isPrecarious")]
    public bool IsPrecarious { get; set; }

    [JsonPropertyName("observation_date")]
    public DateTimeOffset ObservationDate { get; set; }

    [JsonPropertyName("latitude")]
    public double Latitude { get; set; }

    [JsonPropertyName("longitude")]
    public double Longitude { get; set; }

    [JsonPropertyName("source")]
    public string Source { get; set; } = string.Empty;

    [JsonPropertyName("image_url")]
    public string? ImageUrl { get; set; }
}

[JsonSerializable(typeof(List<FileObservations>))]
internal partial class ObservationsSourceGenerationContext : JsonSerializerContext
{
}
