using InvasionQc.Core.Alerting;
using InvasionQc.Core.Observations;

namespace InvasionQc.Core.Species;

public record SpeciesReports(TaxonSummary? TaxonSummary , bool IsInvasive, bool IsPrecarious, string VulnerabilityDescription, IReadOnlyCollection<Alert> Alerts, IReadOnlyCollection<Observation> Observations);

public record TaxonSummary(string LatinName, string WikipediaUrl, string WikipediaSummary);
