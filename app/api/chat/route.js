export const runtime = "edge"; // ideal para Netlify

export async function POST(req) {
  try {
    const { messages = [] } = await req.json();

    // Normaliza y limita historial
    const normalized = messages
      .map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content || "").slice(0, 2000)
      }))
      .slice(-8);

    const system = {
      role: "system",
      content:
        "Eres LÍA, un asistente consultivo en bienes raíces para México. " +
        "Responde claro, profesional y sin prometer rendimientos. " +
        "Enfócate en claridad, plusvalía, ROI y negociación. " +
        "Si falta información, pide los datos mínimos para ayudar mejor."
    };

    const body = {
      model: "gpt-4o-mini",
      messages: [system, ...normalized],
      temperature: 0.3,
      max_tokens: 500
    };

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": Bearer ${process.env.OPENAI_API_KEY},
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!resp.ok) {
      const text = await resp.text();
      return new Response(JSON.stringify({ error: "OpenAI error", detail: text }), { status: 500 });
    }

    const data = await resp.json();
    const reply = data?.choices?.[0]?.message?.content?.trim() || "No encontré respuesta.";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
