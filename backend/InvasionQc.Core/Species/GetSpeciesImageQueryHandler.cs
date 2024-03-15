using InvasionQc.Core.Advisory;
using InvasionQc.Core.Constants;
using MediatR;

namespace InvasionQc.Core.Species;

public record GetSpeciesImageQuery(string SpeciesName, Locations Location) : IRequest<SpeciesImage>;

public class GetSpeciesImageQueryHandler : IRequestHandler<GetSpeciesImageQuery, SpeciesImage>
{
    private readonly IAdvisor _advisor;

    public GetSpeciesImageQueryHandler(IAdvisor advisor)
    {
        this._advisor = advisor;
    }

    public async Task<SpeciesImage> Handle(GetSpeciesImageQuery request, CancellationToken cancellationToken)
    {
        var image = await this._advisor.GetImage(this.GetImagePrompt(request.SpeciesName, request.Location));

        return new SpeciesImage(new Uri(image));
    }

    private string GetImagePrompt(string speciesName, Locations location)
    {

        return """
                Envision a photo-realistic scene featuring an invasive species—be it plant or animal—thriving in a specific Canadian city.
                This detailed image captures the essence of the creature or flora amidst the unique urban backdrop of the chosen city,
                illustrating how the invasive species adapts and interacts with its new environment.
                The foreground focuses on the subject,
                whether it's a plant growing through cracks in the pavement or an animal navigating the streets,
                each portrayed with vivid, life-like colors and textures.
                Behind, the city's landmarks and daily life continue, with buildings, parks, and rivers characteristic of the location,
                under the natural lighting of a typical day, adding depth and context.
                The scene juxtaposes the natural resilience of the invasive species against the human-made environment,
                highlighting the surprising and sometimes unnoticed ways nature manifests in urban settings.
                The mood conveys a sense of curiosity and coexistence, inviting viewers to ponder the relationship between nature and urban development.
                """ + $"the specie is {speciesName} and the city is {location}";

    }s
}

public record SpeciesImage(Uri ImageUri);
