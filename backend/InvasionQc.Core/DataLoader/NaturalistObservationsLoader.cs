using System.Runtime.CompilerServices;
using System.Text.Json;
using System.Text.Json.Serialization;
using InvasionQc.Core.Constants;
using Microsoft.Extensions.Logging;

namespace InvasionQc.Core.DataLoader;

public class NaturalistObservationsLoader
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<NaturalistObservationsLoader> _logger;

    public NaturalistObservationsLoader(HttpClient httpClient, ILogger<NaturalistObservationsLoader> logger)
    {
        this._httpClient = httpClient;
        this._logger = logger;
    }

    public async IAsyncEnumerable<NatObservations> GetLastObservation(Locations location, [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        // Filter call on a certain user
        string apiUrl = "https://api.inaturalist.org/v1/observations?user_id=sebastien37537";
        var response = await _httpClient.GetAsync(apiUrl, cancellationToken);

        response.EnsureSuccessStatusCode(); // Ensure success before further processing

        await using var responseStream = await response.Content.ReadAsStreamAsync(cancellationToken);
        // deserialize the field Results and then get the list in the field Results
        var observations = await JsonSerializer.DeserializeAsync<Result>(responseStream, cancellationToken: cancellationToken);

        foreach (var observation in observations!.Results)
        {
            yield return observation;
        }
    }
}

public class Result
{
    [JsonPropertyName("results")]
    public List<NatObservations> Results { get; set; } = new List<NatObservations>();
}

public class NatObservations
{
    [JsonPropertyName("species_guess")]
    public string SpeciesName { get; set; } = string.Empty;

    [JsonPropertyName("place_guess")]
    public string Location { get; set; } = string.Empty;

    [JsonPropertyName("isInvasive")]
    public bool IsInvasive { get; set; }

    [JsonPropertyName("observed_on")]
    public string ObservationDate { get; set; } = string.Empty;

    [JsonPropertyName("latitude")]
    public double Latitude { get; set; }

    [JsonPropertyName("longitude")]
    public double Longitude { get; set; }

    [JsonPropertyName("source")]
    public string Source { get; set; } = string.Empty;

    [JsonPropertyName("id")]
    public int ObservationId { get; set; }

    [JsonPropertyName("observation_photos")]
    public NatObservationPhoto[] ObservationPhotos { get; set; } = [];

    [JsonPropertyName("taxon")]
    public Taxon taxon { get; set; } = new Taxon();

    [JsonPropertyName("community_taxon_id")]
    public string taxonId { get; set; } = string.Empty;
    
    [JsonPropertyName("geojson")]
    public Geojson geojson { get; set; } = new Geojson();
}

public class NatObservationPhoto
{
    [JsonPropertyName("photo")]
    public NatObservationPhotoMetadata? Metadata { get; set; }
}

public class NatObservationPhotoMetadata
{
    [JsonPropertyName("url")]
    public string Url { get; set; } = string.Empty;
}

public class Taxon
{
    [JsonPropertyName("name")]
    public String name { get; set; } = string.Empty;
}

public class Geojson
{
    [JsonPropertyName("type")]
    public string type { get; set; } = string.Empty;

    [JsonPropertyName("coordinates")]
    public List<double> coordinates { get; set; } = new List<double>();
}
