namespace InvasionQc.Core.Advisory;

public class DumpAdvisor: IAdvisor
{
    public Task<string> GetAdvice(string assistantContext, string userMessage)
    {
        return Task.FromResult("N'ait pas peur de la dinde noir!");
    }
}
