using System.Text.Json;
using System.Text.Json.Serialization;
using InvasionQc.Core.Constants;

namespace InvasionQc.Core.FileDataLoader;

public static class FileObservationsLoader
{
    public static IReadOnlyCollection<FileObservations> GetSpecies(Locations location)
    {
        using FileStream json = File.OpenRead(GetFilePath(location));
        var species = JsonSerializer.Deserialize(json, FileDataLoader.ObservationsSourceGenerationContext.Default.ListFileObservations);
        return species ?? new List<FileObservations>();
    }

    private static string GetFilePath(Locations location) => location switch
    {
        Locations.Laval =>  Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data/laval_with_species.json") ,
        _ => throw new ArgumentOutOfRangeException(nameof(location), location, null)
    };
}

public class FileObservations
{
    [JsonPropertyName("species_guess")]
    public string SpeciesName { get; set; } = string.Empty;

    [JsonPropertyName("location")]
    public string Location { get; set; } = string.Empty;

    [JsonPropertyName("isEnvahissant")]
    public bool IsInvasive { get; set; }
}

[JsonSerializable(typeof(List<FileObservations>))]
internal partial class ObservationsSourceGenerationContext : JsonSerializerContext
{
}
