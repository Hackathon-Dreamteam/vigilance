using System.Runtime.CompilerServices;
using System.Text.Json;
using System.Text.Json.Serialization;
using InvasionQc.Core.Constants;
using Microsoft.Extensions.Logging;

namespace InvasionQc.Core.DataLoader;

public class PrecariousSpeciesLoader
{
    private readonly ILogger<PrecariousSpeciesLoader> _logger;

    public PrecariousSpeciesLoader(ILogger<PrecariousSpeciesLoader> logger)
    {
        this._logger = logger;
    }

    public async Task<IReadOnlyCollection<PrecariousSpecies>> Load(CancellationToken cancellationToken)
    {
        await using FileStream json = File.OpenRead(GetFilePath());
        var precariousSpecies = await JsonSerializer.DeserializeAsync(json, PrecariousSpeciesSourceGenerationContext.Default.ListPrecariousSpecies, cancellationToken);

        return precariousSpecies ?? [];
    }

    private static string GetFilePath()
    {
        return Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data/animaux_precaires.json");
    }
}

public class PrecariousSpecies
{
    [JsonPropertyName("COSEWIC")]
    public string EndangeredStatus { get; set; } = string.Empty;

    [JsonPropertyName("GGROUPE")]
    public string SpeciesCategory { get; set; } = string.Empty;

    [JsonPropertyName("GROUPE")]
    public string SpeciesGroup { get; set; } = string.Empty;

    [JsonPropertyName("LOIEMV")]
    public string ConvervationStatus { get; set; } = string.Empty;

    [JsonPropertyName("SCOMNAME")]
    public string SpeciesName { get; set; } = string.Empty;

    [JsonPropertyName("SNAME")]
    public string ScientificSpeciesName { get; set; } = string.Empty;
}

[JsonSerializable(typeof(List<PrecariousSpecies>))]
internal partial class PrecariousSpeciesSourceGenerationContext : JsonSerializerContext
{
}
