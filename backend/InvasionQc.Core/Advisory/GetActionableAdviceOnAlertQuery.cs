using InvasionQc.Core.Alerting;
using MediatR;

namespace InvasionQc.Core.Advisory;

public record GetActionableAdviceOnAlertQuery(Guid alertId) : IRequest<AlertAdvice>;

public class GetActionableAdviceOnAlertQueryHandler : IRequestHandler<GetActionableAdviceOnAlertQuery, AlertAdvice>
{
    private readonly IAdvisor _advisor;
    private readonly AlertRepositories _alertRepositories;

    public GetActionableAdviceOnAlertQueryHandler(IAdvisor advisor, AlertRepositories alertRepositories)
    {
        this._advisor = advisor;
        this._alertRepositories = alertRepositories;
    }

    public async Task<AlertAdvice> Handle(GetActionableAdviceOnAlertQuery request, CancellationToken cancellationToken)
    {
        var alert = _alertRepositories.GetAlert(request.alertId);

        var advice = await this._advisor.GetMessage(this.GetAssistantContext(), GetAssistantInstruction(alert));

        var adviceTask =  this._advisor.GetMessage(this.GetAssistantContext(), GetAssistantInstruction(alert));
        var imageTask = this._advisor.GetImage(GetImagePrompt(alert));

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

    private string GetAssistantInstruction(Alert alert)
    {
        return alert.Type switch
        {
            Alert.AlertType.ObservationsDropping =>
                $"Il y a une baisse d'observation des {alert.SpeciesName}.",
            Alert.AlertType.UnexpectedSpecies =>
                $"Il y a eu une détection inattendu d'un {alert.SpeciesName}.",
            Alert.AlertType.ObservationsRaising =>
                $"Il y a une hausse de {alert.SpeciesName}.",
            _ => throw new ArgumentOutOfRangeException()
        };
    }
    private string GetImagePrompt(Alert alert)
    {
        return $"Crée une image réaliste d'un {alert.SpeciesName}, le but est de crée conscientisation des citoyens à cette situation: {GetAssistantInstruction(alert)}.";
    }
}

public record AlertAdvice(string Message, Uri ImageUri);
