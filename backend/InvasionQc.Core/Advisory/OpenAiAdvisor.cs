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

    public async Task<string> GetAdvice(string assistantContext, string userMessage)
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
}
