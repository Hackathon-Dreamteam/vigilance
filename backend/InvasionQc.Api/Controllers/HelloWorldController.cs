using Microsoft.AspNetCore.Mvc;

namespace InvasionQc.Api.Controllers;

[ApiController]
[Route("HelloWorld")]
public class HelloWorldController : ControllerBase
{
    [HttpGet]
    [Route("hello-dinde")]
    [ProducesResponseType<string>(200)]
    public IActionResult Get()
    {
          return Ok("Alerte de Dinde Noir!");
    }
}
