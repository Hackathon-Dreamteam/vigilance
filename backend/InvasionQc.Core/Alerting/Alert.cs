using InvasionQc.Core.Constants;

namespace InvasionQc.Core.Alerting;

public record Alert
{
    public Alert()
    {

    }

    public Alert(Guid id, AlertType type, string speciesName, Locations locations, DateTimeOffset date, bool isReal)
    {
        Id = id;
        Type = type;
        SpeciesName = speciesName;
        Locations = locations;
        Date = date;
        IsReal = isReal;
    }

    public Guid Id { get; set; }
    public AlertType Type { get; set; }
    public string SpeciesName { get; set; }
    public Locations Locations { get; set; }
    public DateTimeOffset Date { get; set; }
    public bool IsReal { get; set; }


    public enum AlertType
    {
        UnexpectedSpecies = 1,
        ObservationsDropping = 2,
        ObservationsRaising = 3,
    }
}
