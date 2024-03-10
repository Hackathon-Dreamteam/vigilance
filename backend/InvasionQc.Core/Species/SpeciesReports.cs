using InvasionQc.Core.Alerting;
using InvasionQc.Core.Observations;

namespace InvasionQc.Core.Species;

public record SpeciesReports(bool IsInvasive, bool IsPrecarious, string VulnerabilityDescription, IReadOnlyCollection<Alert> Alerts, IReadOnlyCollection<Observation> Observations);
