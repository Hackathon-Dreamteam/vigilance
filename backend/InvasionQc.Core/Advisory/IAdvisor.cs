namespace InvasionQc.Core.Advisory;

public interface IAdvisor
{
    public Task<string> GetAdvice(string assistantContext, string userMessage);
}
