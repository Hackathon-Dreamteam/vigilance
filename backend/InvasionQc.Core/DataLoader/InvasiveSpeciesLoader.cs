using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Logging;

namespace InvasionQc.Core.DataLoader;

public class InvasiveSpeciesLoader
{
    private readonly ILogger<InvasiveSpeciesLoader> _logger;

    public InvasiveSpeciesLoader(ILogger<InvasiveSpeciesLoader> logger)
    {
        this._logger = logger;
    }

    public async Task<IReadOnlyCollection<InvasiveSpecies>> Load(CancellationToken cancellationToken)
    {
        await using FileStream json = File.OpenRead(GetFilePath());
        var invasiveSpecies = await JsonSerializer.DeserializeAsync(json, InvasiveSpeciesSourceGenerationContext.Default.ListInvasiveSpecies, cancellationToken);

        return invasiveSpecies ?? [];
    }

    private static string GetFilePath()
    {
        return Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data/sentinelle_liste_sp.json");
    }
}

public class InvasiveSpecies
{
    // Faune or Flore
    [JsonPropertyName("Regne")]
    public string BiodiversityType { get; set; } = string.Empty;

    [JsonPropertyName("Categorie")]
    public string Category { get; set; } = string.Empty;

    [JsonPropertyName("Code_espece")]
    public string SpeciesCode { get; set; } = string.Empty;

    [JsonPropertyName("Nom_francais")]
    public string FrenchName { get; set; } = string.Empty;

    [JsonPropertyName("Nom_latin")]
    public string LatinName { get; set; } = string.Empty;

    [JsonPropertyName("Nom_anglais")]
    public string EnglishName { get; set; } = string.Empty;
}

[JsonSerializable(typeof(List<InvasiveSpecies>))]
internal partial class InvasiveSpeciesSourceGenerationContext : JsonSerializerContext
{
}
