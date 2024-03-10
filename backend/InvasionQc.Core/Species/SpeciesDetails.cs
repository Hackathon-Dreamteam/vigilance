using InvasionQc.Core.Alerting;
using InvasionQc.Core.Observations;

namespace InvasionQc.Core.Species;

public record SpeciesDetails(string SpeciesName, string Description, string ImageUrl, IReadOnlyCollection<Alert> Alerts, IReadOnlyCollection<Observation> Observations);
