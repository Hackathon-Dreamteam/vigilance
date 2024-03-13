using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Logging;

namespace InvasionQc.Core.DataLoader;

public class TaxonLoader
{
    private readonly ILogger<TaxonLoader> _logger;

    public TaxonLoader(ILogger<TaxonLoader> logger)
    {
        this._logger = logger;
    }

    public async Task<IReadOnlyCollection<TaxonData>> Load(CancellationToken cancellationToken)
    {
        await using FileStream json = File.OpenRead(GetFilePath());
        var taxons = await JsonSerializer.DeserializeAsync(json, TaxonDataSourceGenerationContext.Default.ListTaxonData, cancellationToken);

        return taxons ?? [];
    }

    private static string GetFilePath()
    {
        return Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data/taxon.json");
    }
}

public class TaxonData
{
    [JsonPropertyName("taxon_id")]
    public string TaxonId { get; set; } = string.Empty;

    [JsonPropertyName("nom_latin")]
    public string LatinName { get; set; } = string.Empty;

    [JsonPropertyName("nom_anglais")]
    public string EnglishName { get; set; } = string.Empty;

    [JsonPropertyName("wikipedia_url")]
    public string WikipediaUrl { get; set; } = string.Empty;

    [JsonPropertyName("wikipedia_summary")]
    public string WikipediaSummary { get; set; } = string.Empty;
}

[JsonSerializable(typeof(List<TaxonData>))]
internal partial class TaxonDataSourceGenerationContext : JsonSerializerContext
{
}
