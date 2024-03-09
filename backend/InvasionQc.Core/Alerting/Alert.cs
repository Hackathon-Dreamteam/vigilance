using InvasionQc.Core.Constants;

namespace InvasionQc.Core.Alerting;

public record Alert(Guid Id, Alert.AlertType Type, string SpeciesName, Locations Locations, DateTimeOffset Date)
{
    public enum AlertType
    {
        UnexpectedSpecies = 1,
        ObservationsDropping = 2,
        ObservationsRaising = 3,
    }
}
