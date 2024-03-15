using InvasionQc.Core.Advisory;
using MediatR;

namespace InvasionQc.Core.Species;

public record GetSpeciesDescriptionQuery(string SpeciesName) : IRequest<SpeciesDescription>;

public class GetSpeciesDescriptionQueryHandler : IRequestHandler<GetSpeciesDescriptionQuery, SpeciesDescription>
{
    private readonly IAdvisor _advisor;

    public GetSpeciesDescriptionQueryHandler(IAdvisor advisor)
    {
        this._advisor = advisor;
    }

    public async Task<SpeciesDescription> Handle(GetSpeciesDescriptionQuery request, CancellationToken cancellationToken)
    {
        var description = await this._advisor.GetMessage(this.GetAssistantContext(), this.GetAssistantInstruction(request.SpeciesName));

        return new SpeciesDescription(description);
    }

    private string GetAssistantContext()
    {
        var context = """
                      En tant qu'expert en génération de contenu et en biodiversité, votre mission est d'assister les élus municipaux en fournissant des informations approfondies sur différentes espèces. Lorsqu'un nom d'espèce animale ou végétale vous est donné, vous devez offrir une description détaillée comprenant :

                      Des conseils d'identification pour reconnaître l'espèce.
                      Son impact sur notre écosystème.
                      Les raisons pour lesquelles sa présence, son augmentation ou sa diminution est significative pour notre écosystème et pourquoi les responsables municipaux devraient y prêter attention.
                      Votre réponse devrait être structurée pour introduire d'abord l'espèce avec un bref aperçu, suivie par un segment détaillé sur comment l'identifier, en soulignant les caractéristiques distinctives. Ensuite, élaborez sur le rôle et l'impact de l'espèce au sein de l'écosystème, incluant les aspects positifs et négatifs si applicable. Concluez avec un argumentaire persuasif sur l'importance de cette espèce pour la santé de notre écosystème et les conséquences potentielles de négliger de telles considérations dans les efforts de planification municipale et de conservation.


                      """;

        return context;
    }

    private string GetAssistantInstruction(string speciesName)
    {
        return $"Donnez moi une description de {speciesName}.";
    }
}

public record SpeciesDescription(string Description);
