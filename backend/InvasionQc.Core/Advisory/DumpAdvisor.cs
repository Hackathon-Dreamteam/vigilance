namespace InvasionQc.Core.Advisory;

public class DumpAdvisor: IAdvisor
{
    public Task<string> GetMessage(string assistantContext, string userMessage)
    {
        return Task.FromResult("N'ait pas peur de la dinde noir!");
    }

    public Task<string> GetImage(string prompt)
    {
        throw new NotImplementedException();
    }
}
