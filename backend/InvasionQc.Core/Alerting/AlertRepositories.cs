using Bogus;
using InvasionQc.Core.Constants;
using MediatR;

namespace InvasionQc.Core.Alerting;

public class AlertRepositories
{
    private readonly IMediator _mediator;
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

    private Dictionary<Guid, Alert> GenerateAlerts()
    {
        var alertsSeeds = new List<Alert>()
        {
            new (Guid.NewGuid(), Alert.AlertType.ObservationsRaising, "roseau commun", Locations.Gatineau, DateTimeOffset.Now, true),
            new (Guid.NewGuid(), Alert.AlertType.ObservationsDropping, "Pluvier siffleur melodus", Locations.Laval, DateTimeOffset.Now, false),
            new (Guid.NewGuid(), Alert.AlertType.UnexpectedSpecies, "Dinde Noir", Locations.Montreal, DateTimeOffset.Now, false),
        };

        var speciesNames = new[] { "érable à giguère", "coccinelle asiatique", "érable de norvège", "caryer ovale", "nerprun bourdaine", "renouée du japon" };

        var random = new Random();
        var randomAlerts = new Faker<Alert>()
            .RuleFor(o => o.Id, f => f.Random.Guid())
            .RuleFor(o => o.Type, f => f.PickRandom<Alert.AlertType>())
            .RuleFor(o => o.SpeciesName, f => f.PickRandom(speciesNames))
            .RuleFor(o => o.Locations, f => f.PickRandom<Locations>())
            .RuleFor(o => o.Date, f => f.Date.RecentOffset(random.Next(0, 365)))
            .RuleFor(o => o.IsReal, f => false)
            .Generate(50);

        alertsSeeds.AddRange(randomAlerts);


        return alertsSeeds.ToDictionary(a => a.Id);
    }


}
