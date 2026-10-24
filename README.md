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

## Mobile-App / PWA

Die App hat eine mobile Bottom Navigation für Home, Training, Recovery, Progress und Coach. Die Desktop-Sidebar bleibt verfügbar. Trainingspläne, absolvierte Einheiten, Profil, Check-ins, Wasser und erfolgreiche Coach-Unterhaltungen bleiben unter dem bisherigen Speicherschlüssel auf dem jeweiligen Gerät erhalten. Es findet keine automatische Synchronisierung zwischen Geräten statt. Unter Progress lassen sich die Daten als JSON sichern.

Nach dem ersten Online-Aufruf speichert der Service Worker ausschliesslich die öffentlichen statischen App-Dateien für Offline-Nutzung. Coach-Anfragen und API-Antworten werden nicht gecacht. Der KI-Coach benötigt Internet und nutzt weiterhin `/.netlify/functions/coach` mit dem serverseitigen `OPENAI_API_KEY`.

Installation: In Safari auf iPhone/iPad über Teilen → Zum Home-Bildschirm. In Chrome auf Android über das Menü → App installieren / Zum Startbildschirm hinzufügen. Die Schaltfläche „App installieren“ erklärt beide Wege und bietet die direkte Installation an, wenn der Browser sie unterstützt. Voraussetzung für Installation und Service Worker ist HTTPS (oder localhost zur Entwicklung).

Deployment: Die bestehende Netlify-Konfiguration veröffentlicht weiterhin das Repository-Verzeichnis und die vorhandene Function. Keine zusätzlichen Pakete oder Build-Schritte erforderlich. Nach dem Deploy die HTTPS-Adresse einmal online öffnen; anschliessend Installation und Offline-Modus prüfen. Bei späteren Änderungen an statischen Dateien die Cache-Version in `sw.js` erhöhen. Ein neuer Service Worker wird nach dem Schliessen aller alten App-Fenster aktiv.
