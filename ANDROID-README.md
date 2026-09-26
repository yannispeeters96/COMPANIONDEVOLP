# Abonazaar V2.2 Android/PWA

## Final convert op Android

In Termux, vanuit de uitgepakte map:

```bash
chmod +x FINAL-CONVERT-ANDROID.sh
./FINAL-CONVERT-ANDROID.sh
```

Het script voert dependency-installatie, broncontrole, volledige Vitest-suite en productiebuild uit. Bij succes staat `Status: 100% PASS FOR THIS TEST MATRIX` in `FINAL-VERIFY-ANDROID.txt`.

## Starten

```bash
bash START-ABONAZAAR-ANDROID.sh
```

Open `http://127.0.0.1:4173` in Chrome en kies **App installeren** / **Toevoegen aan startscherm**.

## Developer console

De devfuncties staan niet in de gewone navigatie. Druk **hoofdletter G**, daarna **hoofdletter M**, daarna **Enter** binnen 2,5 seconden. Dit opent `+devLegacy` voor `bonbazaar-admin.dev`. Bij eerste gebruik stel je zelf een lokaal wachtwoord in.

## Sounds

BonBazaar SoundPack v2 is vooraf ingebouwd met 24 WAV-bestanden. Onder **Profiel** kun je UI-sounds uitschakelen en kiezen tussen Dark, Neon en Live Mode.
