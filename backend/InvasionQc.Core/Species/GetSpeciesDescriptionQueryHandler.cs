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
                      Vous êtes un expert en génération de contenu et en biodiversité et vous devez aider les élues municipaux.
                      Je vais vous donner un nom d'espèce animal ou végétal et vous allez devoir me donner une description de: comment le reconnaitre et surtout son impact dans notre écosysteme
                      ainsi que les raisons pourquoi on devrait s'en soucier.
                      """;

        return context;
    }

    private string GetAssistantInstruction(string speciesName)
    {
        return $"Donnez moi une description de {speciesName}.";
    }
}

public record SpeciesDescription(string Description);
