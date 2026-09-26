# Pet BonBazaar V2.2 Final Release Candidate

Dit pakket is de laatste kandidaat vóór release.

## Wat is gehard

- gewone navigatie bevat geen God Mode-link;
- devconsole opent via **yannis**, hoofdletterongevoelig, terwijl de app actief is;
- `+devLegacy` is sluitbaar en kan tussen dock/pop-out wisselen;
- developer-identiteit is vastgezet op `bonbazaar-admin.dev`, `superadmin`, `full` binnen de app;
- imports kunnen die developer-identiteit niet overschrijven;
- lokaal dev-wachtwoord wordt niet hardcoded of in profielback-ups geëxporteerd;
- localStorage-fouten breken de app niet meer tijdens save/reset;
- Electron preload-versie is gelijkgetrokken naar V2.2.0;
- service worker heeft veiligere offline fallback;
- BonBazaar SoundPack v2 is preinstalled en bevat 24 WAV UI/theme sounds;
- sound aan/uit en Dark/Neon/Live sound theme staan onder Profiel;
- Vitest-suite bevat navigatie, opslag, project, developer shortcut en soundinstellingen.

## Laatste lokale conversie

Op Windows: dubbelklik `FINAL-CONVERT-WINDOWS.bat`.

Het script stopt bij de eerste fout en maakt `FINAL-VERIFY-REPORT.txt` en `FINAL-CONVERT.log`.
Het opent de installer niet automatisch.
