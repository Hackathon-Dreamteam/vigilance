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

    public void RemoveAlert(Guid alertId)
    {
        _alerts.Remove(alertId);
    }

    private static Dictionary<Guid, Alert> GenerateAlerts()
    {
        var alertsSeeds = new List<Alert>()
        {
            new (Guid.NewGuid(), Alert.AlertType.ObservationsDropping, "Lapin", Locations.Gatineau, DateTimeOffset.Now),
            new (Guid.NewGuid(), Alert.AlertType.UnexpectedSpecies, "T-Rex", Locations.Laval, DateTimeOffset.Now),
            new (Guid.NewGuid(), Alert.AlertType.ObservationsRaising, "Dinde Noir", Locations.Laval, DateTimeOffset.Now),
        };

        return alertsSeeds.ToDictionary(a => a.Id);
    }
}
