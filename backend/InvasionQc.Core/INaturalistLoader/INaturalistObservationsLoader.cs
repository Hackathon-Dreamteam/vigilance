using System.Diagnostics;
using System.Runtime.CompilerServices;
using System.Text.Json;
using System.Text.Json.Serialization;
using InvasionQc.Core.Constants;
using Microsoft.Extensions.Logging;


namespace InvasionQc.Core.INaturalistLoader;

public class INaturalistObservationsLoader
{
    private readonly ILogger<INaturalistObservationsLoader> _logger;

    public INaturalistObservationsLoader(ILogger<INaturalistObservationsLoader> logger)
    {
        _logger = logger;
    }

    public async IAsyncEnumerable<NatObservations> GetLastObservation(Locations location, [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        // Rest call to Inaturalist API
        var client = new HttpClient();
        // Filter call on a certain user
        
        string apiUrl = "https://api.inaturalist.org/v1/observations?user_id=sebastien37537";
        var response = await client.GetAsync(apiUrl);

        var content = await response.Content.ReadAsStringAsync();
       
        // deserialize the field Results and then get the list in the field Results
        var observations = JsonSerializer.Deserialize<Result>(content);

        foreach (var observation in observations.Results)
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
    public String ObservationDate { get; set; }

    [JsonPropertyName("latitude")]
    public double Latitude { get; set; }

    [JsonPropertyName("longitude")]
    public double Longitude { get; set; }

    [JsonPropertyName("source")]
    public string Source { get; set; } = string.Empty;

    [JsonPropertyName("taxon")]
    public Taxon taxon { get; set; } = new Taxon();

    [JsonPropertyName("geojson")]
    public Geojson geojson { get; set; } = new Geojson();
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

// [JsonSerializable(typeof(List<NaturalistObservations>))]
// internal partial class ObservationsSourceGenerationContext : JsonSerializerContext
// {
// }
