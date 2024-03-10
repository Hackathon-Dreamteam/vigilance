using System.Text;
using InvasionQc.Core.Advisory;
using InvasionQc.Core.Species;
using MediatR;

namespace InvasionQc.Core.Alerting;

public record GetActionableAdviceOnAlertQuery(Guid alertId) : IRequest<AlertAdvice>;

public class GetActionableAdviceOnAlertQueryHandler : IRequestHandler<GetActionableAdviceOnAlertQuery, AlertAdvice>
{
    private readonly IAdvisor _advisor;
    private readonly AlertRepositories _alertRepositories;
    private readonly IMediator _mediator;

    public GetActionableAdviceOnAlertQueryHandler(IAdvisor advisor, AlertRepositories alertRepositories, IMediator mediator)
    {
        this._advisor = advisor;
        this._alertRepositories = alertRepositories;
        this._mediator = mediator;
    }

    public async Task<AlertAdvice> Handle(GetActionableAdviceOnAlertQuery request, CancellationToken cancellationToken)
    {
        var alert = this._alertRepositories.GetAlert(request.alertId);

        var speciesReport = await this._mediator.Send(new GetSpeciesReport(alert.SpeciesName, alert.Locations), cancellationToken);

        var adviceTask =  this._advisor.GetMessage(this.GetAssistantContext(), this.GetAssistantInstruction(alert, speciesReport));
        var imageTask = this._advisor.GetImage(this.GetImagePrompt(alert, speciesReport));

        await Task.WhenAll(adviceTask, imageTask);

        return new AlertAdvice(adviceTask.Result, new Uri(imageTask.Result));
    }

    private string GetAssistantContext()
    {
        var context = """
                      Vous êtes un expert en génération de contenu et en biodiversité et vous devez aider les élues municipaux.
                      Je vais vous donner une situation et vous devez écrire un post de média sociaux indiquant
                      comment reconnaitre l'animal ou la plante, pourquoi il est important d'agir, ainsi que de lister des actions que les citoyens peuvent faire pour aider à la situation
                      """;

        return context;
    }

    private string GetAssistantInstruction(Alert alert, SpeciesReports speciesReports)
    {
        return alert.Type switch
        {
            Alert.AlertType.ObservationsDropping =>
                $"Il y a une baisse de population des {alert.SpeciesName}. {this.GetSpeciesDetails(speciesReports)}",
            Alert.AlertType.UnexpectedSpecies =>
                $"Il y a eu une détection inattendu de cette espèce {alert.SpeciesName}. {this.GetSpeciesDetails(speciesReports)}",
            Alert.AlertType.ObservationsRaising =>
                $"Il y a une hausse de population des {alert.SpeciesName}. {this.GetSpeciesDetails(speciesReports)}",
            _ => throw new ArgumentOutOfRangeException()
        };
    }

    private string GetSpeciesDetails(SpeciesReports speciesReports)
    {
        var details = new StringBuilder();
        if (speciesReports.IsInvasive)
        {
            details.AppendLine("Cette espèce est invasive, on ne veut pas encourager sa profilitation.");
        }

        if (speciesReports.IsPrecarious)
        {
            details.AppendLine($"Cette espèce est en danger de disparition avec ce niveau: {speciesReports.VulnerabilityDescription}, on veut la protéger.");
        }

        return details.ToString();
    }

    private string GetImagePrompt(Alert alert, SpeciesReports speciesReports)
    {
        return $"Crée une image réaliste d'un {alert.SpeciesName}, le but est de crée conscientisation des citoyens à cette situation: {this.GetAssistantInstruction(alert, speciesReports)}. Ne met pas de texte. Idéalement met un background de la ville de {alert.Locations.ToString()}";
    }
}

public record AlertAdvice(string Message, Uri ImageUri);
