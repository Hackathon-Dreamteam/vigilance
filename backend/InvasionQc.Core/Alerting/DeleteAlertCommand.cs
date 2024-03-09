using MediatR;

namespace InvasionQc.Core.Alerting;

public record DeleteAlertsCommand(Guid AlertId) : IRequest;

public class DeleteAlertsQueryHandler : IRequestHandler<DeleteAlertsCommand>
{
    private readonly AlertRepositories _alertRepositories;

    public DeleteAlertsQueryHandler(AlertRepositories alertRepositories)
    {
        _alertRepositories = alertRepositories;
    }

    public Task Handle(DeleteAlertsCommand request, CancellationToken cancellationToken)
    {
        this._alertRepositories.RemoveAlert(request.AlertId);

        return Task.CompletedTask;
    }
}
