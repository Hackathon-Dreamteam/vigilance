using Microsoft.AspNetCore.Mvc;

namespace InvasionQc.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HelloWorldController : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<string>(200)]
    public IActionResult Get()
    {
        return Ok("Alerte de Dinde Noir!");
    }
}
