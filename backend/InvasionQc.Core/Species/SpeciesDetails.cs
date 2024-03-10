using InvasionQc.Core.Alerting;
using InvasionQc.Core.Observations;

namespace InvasionQc.Core.Species;

public record SpeciesDetails(IReadOnlyCollection<Alert> Alerts, IReadOnlyCollection<Observation> Observations);
