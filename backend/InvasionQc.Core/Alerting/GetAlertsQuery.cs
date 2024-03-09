using MediatR;

namespace InvasionQc.Core.Alerting;

public record GetAlertsQuery : IRequest<IReadOnlyCollection<Alert>>;

public class GetAlertsQueryHandler : IRequestHandler<GetAlertsQuery, IReadOnlyCollection<Alert>>
{
    private readonly AlertRepositories _alertRepositories;

    public GetAlertsQueryHandler(AlertRepositories alertRepositories)
    {
        _alertRepositories = alertRepositories;
    }

    public Task<IReadOnlyCollection<Alert>> Handle(GetAlertsQuery request, CancellationToken cancellationToken)
    {
        return Task.FromResult(_alertRepositories.GetAlerts());
    }
}
