using InvasionQc.Core.Constants;

namespace InvasionQc.Core.Alerting;

public class AlertRepositories
{
    private readonly Dictionary<Guid, Alert> _alerts;

    public AlertRepositories()
    {
        this._alerts = GenerateAlerts();
    }

    public IReadOnlyCollection<Alert> GetAlerts()
    {
        return _alerts.Values;
    }

    public Alert GetAlert(Guid alertId)
    {
        return _alerts[alertId];
    }

    public IReadOnlyCollection<Alert> GetAlerts(string speciesName)
    {
        return _alerts.Values.Where(a => string.Equals(a.SpeciesName, speciesName, StringComparison.InvariantCultureIgnoreCase)).ToList();
    }

    public void RemoveAlert(Guid alertId)
    {
        _alerts.Remove(alertId);
    }

    private static Dictionary<Guid, Alert> GenerateAlerts()
    {
        var alertsSeeds = new List<Alert>()
        {
            new (Guid.NewGuid(), Alert.AlertType.ObservationsRaising, "roseau commun", Locations.Gatineau, DateTimeOffset.Now),
            new (Guid.NewGuid(), Alert.AlertType.ObservationsDropping, "Pluvier siffleur melodus", Locations.Laval, DateTimeOffset.Now),
            new (Guid.NewGuid(), Alert.AlertType.UnexpectedSpecies, "Dinde Noir", Locations.Montreal, DateTimeOffset.Now),
        };

        return alertsSeeds.ToDictionary(a => a.Id);
    }
}
