using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ChatbotController : ControllerBase
{
    public record AskRequest(string Soru);

    [HttpPost("ask")]
    public IActionResult Ask([FromBody] AskRequest req)
    {
        var q = (req.Soru ?? "").ToLowerInvariant();
        string yanit;

        if (q.Contains("sınav") || q.Contains("salon") || q.Contains("sıra"))
            yanit = "Yayınlanmış sınav oturumlarınızı ilgili sınav takvimi ekranından tarih, saat, salon ve sıra numarasıyla görebilirsiniz.";
        else if (q.Contains("çakış") || q.Contains("kontenjan") || q.Contains("ders"))
            yanit = "Ders kayıtlarında saat çakışması ve derslik/ders kontenjan sınırları sistem tarafından denetlenir.";
        else
            yanit = "Bu bilgiye ulaşılamadı; ders programı, kontenjanlar veya yayınlanmış sınavlarla ilgili soru sorabilirsiniz.";

        return Ok(new { yanit });
    }
}
