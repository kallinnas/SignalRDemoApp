using Microsoft.AspNetCore.Mvc;
using SignalRDemo.Models;
using SignalRDemo.Services;


namespace SignalRDemo.Controllers;

[Route("api/[controller]")]
[ApiController]
public class LoginController : ControllerBase
{
    private readonly JwtService jwtService;

    public LoginController(JwtService jwtService) { this.jwtService = jwtService; }

    [HttpPost("ValidateToken")]
    public async Task<IActionResult> ValidateToken([FromBody] TokenRequest request)
    {
        try
        {
            bool isValid = await Task.FromResult(jwtService.ValidateToken(request.Token));
            return Ok(isValid);
        }

        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
