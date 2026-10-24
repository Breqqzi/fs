export default async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { status: 204 });
  if (request.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405 });
  const key = Netlify.env.get("OPENAI_API_KEY");
  if (!key) return Response.json({ error: "Der Coach ist noch nicht eingerichtet. Der API-Schlüssel muss serverseitig in Netlify hinterlegt und die Seite erneut bereitgestellt werden." }, { status: 503 });
  try {
    if (Number(request.headers.get("content-length")) > 60000) return Response.json({ error: "Die Nachricht ist zu gross." }, { status: 413 });
    let body;
    try { body = await request.json(); } catch { return Response.json({ error: "Ungültige Anfrage." }, { status: 400 }); }
    if (!body || typeof body !== "object") return Response.json({ error: "Ungültige Anfrage." }, { status: 400 });
    const message = String(body.message || "").slice(0, 6000);
    if (!message.trim()) return Response.json({ error: "Schreib zuerst eine Nachricht." }, { status: 400 });
    const p = body.profile || {};
    const instructions = `Du bist JN Performance Coach, ein freundlicher Fussball-Torhüter-Coach. Antworte praktisch und klar auf Deutsch/Schweizer Hochdeutsch. Hilf bei Trainingsplanung, Reflexen, Stellungsspiel, Flanken, 1-gegen-1, Fussarbeit, Spieleröffnung, Matchvorbereitung und Recovery. Gib konkrete Übungen mit Dauer, Wiederholungen, Pausen und Coaching-Hinweisen. Profil: Name ${p.name || "nicht angegeben"}, Alter ${p.age || "nicht angegeben"}, Trainings pro Woche ${p.sessions || "nicht angegeben"}, Fokus ${p.focus || "nicht angegeben"}. Letzter Check-in: ${JSON.stringify(body.latestRecovery || null)}. Trainings: ${JSON.stringify(body.recentTrainings || [])}. Sei altersgerecht und steigere Belastung schrittweise. Keine medizinischen Diagnosen. Bei Schmerzen oder Verletzungsverdacht Training stoppen und mit Eltern/Trainer/medizinischem Fachpersonal sprechen.`;
    const res = await fetch("https://api.openai.com/v1/responses", { method: "POST", signal: AbortSignal.timeout(35000), headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify({ model: "gpt-4.1-mini", instructions, input: message, max_output_tokens: 900 }) });
    const result = await res.json();
    if (!res.ok) return Response.json({ error: res.status === 429 ? "Der Coach ist gerade ausgelastet. Bitte versuche es später erneut." : "Der Coach konnte keine Antwort laden. Bitte prüfe die serverseitige Einrichtung oder versuche es später erneut." }, { status: 502 });
    const reply = result.output_text || (result.output || []).flatMap(x => x.content || []).filter(x => x.type === "output_text").map(x => x.text).join("\n");
    return Response.json({ reply: reply || "Keine Antwort erhalten. Versuch es nochmals." });
  } catch { return Response.json({ error: "Serverfehler beim KI-Coach. Bitte nochmals versuchen." }, { status: 500 }); }
};
export const config = { path: "/.netlify/functions/coach" };
