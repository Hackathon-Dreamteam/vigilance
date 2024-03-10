namespace InvasionQc.Core.Observations;

public class Observation
{
    public string ObservationId { get; set; } = string.Empty;

    public string SpeciesName { get; set; } = string.Empty;

    public string Location { get; set; } = string.Empty;

    public bool IsInvasive { get; set; }

    public bool IsPrecarious { get; set; }

    public string ImageUrl { get; set; } = string.Empty;

    public DateTimeOffset Date { get; set; }

    public GeoLocation GeoLocation { get; set; } = new (0, 0);

    public string Source { get; set; } = string.Empty;
}
