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
        return $"Return a realistic image of {speciesName} in the city of {location.ToString()}, the one in Canada.";
    }
}

public record SpeciesImage(Uri ImageUri);
