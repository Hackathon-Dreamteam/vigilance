namespace InvasionQc.Core.Advisory;

public interface IAdvisor
{
    public Task<string> GetMessage(string assistantContext, string userMessage);

    public Task<string> GetImage(string prompt);
}
