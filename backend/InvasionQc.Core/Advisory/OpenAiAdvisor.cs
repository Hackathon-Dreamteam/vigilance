using Azure;
using Azure.AI.OpenAI;
using Microsoft.Extensions.Options;

namespace InvasionQc.Core.Advisory;

public class OpenAiAdvisor: IAdvisor
{
    private readonly OpenAIClient _openAiClient;

    public OpenAiAdvisor(IOptions<AdvisoryOptions> options)
    {
        this._openAiClient = new OpenAIClient(options.Value.ApiKey);
    }

    public async Task<string> GetMessage(string assistantContext, string userMessage)
    {
        var chatCompletionsOptions = new ChatCompletionsOptions()
        {
            DeploymentName = "gpt-3.5-turbo", // Use DeploymentName for "model" with non-Azure clients
            Messages =
            {
                new ChatRequestSystemMessage(assistantContext),
                new ChatRequestUserMessage(userMessage),
            }
        };

        var response = await this._openAiClient.GetChatCompletionsAsync(chatCompletionsOptions);
        var responseMessage = response.Value.Choices[0].Message;

        return responseMessage.Content;
    }

    public async Task<string> GetImage(string prompt)
    {
        var response = await _openAiClient.GetImageGenerationsAsync(
            new ImageGenerationOptions()
            {
                DeploymentName = "dall-e-3",
                Prompt = prompt,
                Size = ImageSize.Size1024x1024,
                Quality = ImageGenerationQuality.Standard
            });

        var generatedImage = response.Value.Data[0];
        if (!string.IsNullOrEmpty(generatedImage.RevisedPrompt))
        {
            Console.WriteLine($"Input prompt automatically revised to: {generatedImage.RevisedPrompt}");
        }

        return generatedImage.Url.AbsoluteUri;
    }
}
