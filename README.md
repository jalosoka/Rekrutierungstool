# Recruiting & Ausbildung Reporting

Ein einfacher React-Prototyp fuer das interne Wochenreporting ueber 28 Filialen.

## Start

```bash
npm install
npm run dev
```

Danach im Browser oeffnen:

```text
http://127.0.0.1:5173
```

## Enthalten

- Dashboard mit Gesamtzahlen
- Recruiting-Pipeline mit Statuspflege
- Ausbildungs- und Coachingpipeline
- Vakanzen pro Filiale erfassen und bearbeiten
- Kandidaten und Mitarbeitende in Ausbildung erfassen
- Wochenreport mit Kalenderwoche und Kommentar
- Filter nach Filiale und Status
- Suche nach Name, Filiale oder Vakanz
- CSV-Export
- Speicherung im LocalStorage

Die Daten sind bewusst lokal gehalten. Es gibt keine Benutzerverwaltung und keine Datenbank.

## Online-Link mit GitHub Pages

1. In GitHub unter `Settings` -> `Pages` als Quelle `GitHub Actions` auswaehlen.
2. Im Tab `Actions` den Workflow `Deploy to GitHub Pages` starten, falls er nicht automatisch startet.
3. Danach ist die App unter dieser Adresse erreichbar:

```text
https://jalosoka.github.io/Rekrutierungstool/
```
