# JN Goalie Performance — Netlify

## Enthalten
- Responsive Premium-Dark-Mode App mit schwarzem/blauem Design
- Dashboard: Trainings diese Woche, Recovery Score, Wasser, Schlaf
- Goalie-Trainingsbibliothek und Plan-Builder
- Recovery-Check-ins, Trainingshistorie, Fortschritt und JSON-Export
- KI-Coach via Netlify Function; API-Key bleibt serverseitig

## Netlify-Setup
1. ZIP entpacken und Inhalt in ein GitHub-Repository hochladen.
2. Das Repository in Netlify importieren. Build command leer lassen, Publish directory `.`; die Netlify Function liegt in `netlify/functions`.
3. In Netlify: Site configuration → Environment variables → Add variable:
   - Key: `OPENAI_API_KEY`
   - Value: dein NEUER OpenAI API-Key
4. Redeploy ausführen. Danach im Menü **KI Goalie Coach** testen.

Niemals einen API-Key in `app.js` oder `index.html` eintragen. Falls ein Key zuvor in einem Chat veröffentlicht wurde, widerrufe ihn und nutze einen neuen.

## Daten
Trainings, Profil, Check-ins und Trinkmenge werden aktuell im Browser (`localStorage`) gespeichert, nicht über mehrere Geräte synchronisiert. Es gibt in dieser Version noch keinen Login/Cloud-Datenspeicher.
