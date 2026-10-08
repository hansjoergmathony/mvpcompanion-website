# Cursor-Prompts: MVPCompanion – Variante A mit EN/DE und Annahmengenerierung

Stand: 8. Oktober 2026

Diese vier Prompts nacheinander im Cursor-Projekt mit dem Quellcode von MVPCompanion.com verwenden. Prompt 1 ist ausschließlich eine Bestandsanalyse; erst Prompt 2 autorisiert Codeänderungen. Jeder Prompt gilt nur für das geöffnete lokale Projekt.

## Gemeinsame Sicherheits- und KI-Regeln

- Lies vor jeder Arbeit Repository-Anweisungen, insbesondere `AGENTS.md`, sowie vorhandene Projektunterlagen.
- Veröffentliche nichts, ändere keine Produktionssysteme und erstelle oder rotiere keine API-Schlüssel.
- `OPENAI_API_KEY` ist ein ausschließlich serverseitiges Secret. Niemals auslesen, ausgeben, in den Browser, in Client-Code, JSON-Exporte, Logs oder Commits schreiben.
- Der private MVPCompanion-Prototyp kann als Referenz bereits eine serverseitige Annahmengenerierung enthalten: `/api/assumptions` erzeugt unbestätigte, editierbare Hypothesen aus Idee, Problem, Zielgruppe und Nutzen. Sie ist keine Marktvalidierung und ersetzt keine Nutzerforschung.
- Wenn diese Integration im geöffneten Projekt nicht vorhanden ist, zunächst den tatsächlichen Stand dokumentieren. Keine parallele oder nachgebaute KI-Integration anlegen, sofern der jeweilige Prompt das nicht ausdrücklich verlangt.
- Alle KI-bezogenen Tests nutzen, soweit möglich, vorhandene lokale Mocks oder Testantworten. Echte API-Aufrufe nur, wenn ein Server-Secret bereits korrekt konfiguriert ist und der Prompt sie ausdrücklich verlangt.

## Prompt 1: Bestandsanalyse und Plan

```text
Arbeite im bestehenden Quellcode-Projekt von MVPCompanion.com mit Cursor. Prüfe zuerst Repository-Anweisungen, Projektunterlagen und vorhandene Dateien.

Ziel ist Variante A: Clarify wird der Einstieg innerhalb eines gemeinsamen Arbeitsbereichs. Die Website hat bereits einen EN/DE-Language-Switcher.

Führe in diesem Schritt ausschließlich eine Bestandsanalyse durch:

- Ermittle Clarify-Komponenten, Fragen, Datenmodell, Browser-Speicherung, JSON-Import sowie PDF-, JSON- und Markdown-Export.
- Ermittle die bestehende Sprachverwaltung, Übersetzungskataloge, sprachabhängigen Routen und die Speicherung der Sprachwahl.
- Prüfe den verfügbaren privaten MVPCompanion-Prototyp als Referenz: https://mvpcompanion-werkstatt.blackfield4.chatgpt.site/ . Nutze vorhandenen Quellcode und das korrigierte BookScout-Beispiel, soweit zugänglich.
- Ermittle, ob bereits eine serverseitige Annahmengenerierung existiert. Dokumentiere Route, Laufzeit, Eingabeumfang, Antwortformat, Datenschutzgrenzen, Fehlerbehandlung, Tests und die Behandlung von OPENAI_API_KEY. Gib niemals Secret-Werte aus.
- Ordne Clarify exakt diesen sechs Stufen zu: 1 Idea, 2 Problem, 3 User, 4 Value, 5 Product, 6 Context.
- Erhalte das Framework: Understand (1–3), Define (4–6), Shape (7–9: Jobs, Scope, Experience), Specify (10–12: Information Architecture, Data, Requirements), Learn (13–15: Learning, Technical Boundaries, MVP Boundary).

Liefere einen konkreten Umsetzungsplan mit betroffenen Dateien, wiederverwendbaren Komponenten, gemeinsamer Entwurfsverwaltung, erforderlichen Datenmigrationen und dem Umgang mit einer bereits vorhandenen Annahmengenerierung. Kennzeichne fehlende Informationen.

Wenn der Quellcode der bestehenden Website oder des Prototyps fehlt, benenne den benötigten Zugriff, statt eine Ersatzwebsite anzulegen. Ändere in diesem Schritt keinen Code und keine externen Systeme. Veröffentliche nichts.
```

## Prompt 2: Gemeinsamer Arbeitsbereich, EN/DE und Annahmengenerierung

```text
Setze den abgestimmten Plan im bestehenden MVPCompanion.com-Projekt um. Erhalte Design, bestehende Inhalte, Framework, Technologie und EN/DE-Sprachverwaltung. Integriere Clarify und den vollständigen Arbeitsbereich als zwei Ansichten desselben Entwurfs.

Nutzerführung:
- „Idee klären“ / „Clarify your idea“ öffnet Clarify im gemeinsamen Arbeitsbereich.
- Clarify führt durch genau sechs Stufen: Idea, Problem, User, Value, Product, Context.
- Anschließend zeigt es einen Idea Snapshot und die Aktion „Spezifikation weiterentwickeln“ / „Develop your specification“.
- Diese Aktion öffnet die weiteren neun Stufen desselben Entwurfs, beginnend mit Jobs. Die ersten sechs bleiben bearbeitbar.
- Nutzer können zwischen Einstieg und vollständigem Arbeitsbereich wechseln, ohne Antworten erneut einzugeben.
- Unvollständige Entwürfe dürfen gespeichert, exportiert und weiterbearbeitet werden. Fehlende Inhalte bleiben offen.

Daten und Fortschritt:
- Verwende eine gemeinsame Entwurfsverwaltung und sprachunabhängige Feld- und Stufen-IDs.
- Erhalte vorhandene Entwürfe. Implementiere erforderliche Migrationen, bevor eine neue Speicherung alte Daten ersetzen könnte.
- Zeige Clarify-Fortschritt bezogen auf sechs Stufen und Gesamtfortschritt bezogen auf 15 Stufen.
- Benenne Fortschritt als „ausgefüllt“ / „completed fields“. Ausgefüllte Felder sind keine Marktvalidierung.
- Eine geänderte Produktidee ersetzt keine anderen Eingaben automatisch.

EN/DE:
- Verwende den vorhandenen Language-Switcher und seine Übersetzungsstruktur.
- Übersetze neue Navigation, Fragen, Hinweise, Platzhalter, Statusmeldungen, Dialoge, Fehlermeldungen und zugängliche Beschriftungen vollständig.
- Ein Sprachwechsel erhält Texte, Projektname, aktuellen Schritt, Ansicht und Fortschritt. Nutzereingaben werden nicht automatisch übersetzt.
- Behalte die bestehenden Regeln für Standard- und gespeicherte Sprache bei und aktualisiere die Dokumentsprache korrekt.

Annahmengenerierung:
- Wenn eine bestehende serverseitige Annahmengenerierung vorhanden ist, erhalte ihre Architektur und Sicherheitsgrenzen. OPENAI_API_KEY bleibt ausschließlich serverseitig und wird niemals in Client-Code, Exporte, Logs oder Commits übernommen.
- Annahmenvorschläge basieren nur auf Idee, Problem, Zielgruppe und Nutzen. Sie sind unbestätigte Hypothesen, keine Evidenz oder Marktvalidierung.
- Vorschläge müssen editierbar sein und erst nach ausdrücklicher Auswahl/Übernahme in den Entwurf gelangen.
- Änderungen am relevanten Kontext markieren ältere Vorschläge als überholt. Die Oberfläche zeigt klar, welche Inhalte an den KI-Dienst übermittelt werden.
- Die übrige Strukturprüfung darf regelbasiert bleiben. Stelle keine KI-Rückmeldungen zu einzelnen Stufen als vorhanden dar, falls sie technisch nicht implementiert sind.

Positionierung:
Clarify liefert einen ersten Idea Snapshot. Der Arbeitsbereich unterstützt das selbstständige Ausarbeiten eines MVP-Spezifikationsentwurfs. Die Annahmengenerierung hilft dabei, unbestätigte Hypothesen sichtbar zu machen; sie liefert keine Validierung. Die geplante App unterstützt vertiefende Analyse, Rückfragen und Verfeinerung derselben Methode. Stelle den tatsächlichen App-Status korrekt dar.

Erhalte die Website-Navigation und integriere passende Einstiegsaktionen. Prüfe die wichtigsten Interaktionen lokal in beiden Sprachen. Berichte Änderungen, Prüfungen und offene Punkte. Deploye nichts und ändere keine externen Systeme.
```

## Prompt 3: BookScout, Exporte und Datenübernahme

```text
Ergänze und vervollständige im gemeinsamen MVPCompanion-Arbeitsbereich das BookScout-Lehrbeispiel, Exporte und rückwärtskompatible Datenübernahme. Behalte die EN/DE-Regeln, die sechs Clarify-Stufen und die Sicherheitsgrenzen der vorhandenen Annahmengenerierung bei.

BookScout:
- Verbindliche Produktidee DE: „BookScout empfiehlt Leserinnen und Lesern Bücher auf Basis der Bücher in ihrem eigenen Bücherregal. Die Nützlichkeit dieser Idee ist eine Hypothese.“
- Entsprechende Produktidee EN: “BookScout recommends books to readers based on the books on their own bookshelves. The usefulness of this idea is a hypothesis.”
- Nutze den bereits korrigierten Beispieldatensatz, soweit verfügbar. Prüfe alle 15 Stufen auf Übereinstimmung mit dieser Idee.
- Der eigene Buchbestand ist die Empfehlungsgrundlage. Empfehlungen dürfen weitere Bücher umfassen. Besitz allein bedeutet nicht, dass ein Buch gefällt.
- Annahmen, Testkatalog, Umfangsentscheidungen und Messziele sind illustrative Beispiele, keine belegte Kundenevidenz.
- Stelle das Lehrbeispiel in EN und DE bereit. Clarify zeigt dessen erste sechs Stufen; der vollständige Arbeitsbereich alle 15.
- Halte die Beispielansicht vom persönlichen Entwurf getrennt. „Als Vorlage verwenden“ / „Use as a template“ übernimmt das Beispiel in der gewählten Sprache erst nach einer Bestätigung, wenn ein Entwurf ersetzt würde. Biete vorher eine JSON-Sicherung und anschließend Rückgängig an.
- Übersetze beim Sprachwechsel niemals einen persönlichen oder bearbeiteten Entwurf automatisch.

Exporte:
- Biete PDF, JSON und Markdown an; verwende vorhandene Exportkomponenten, soweit geeignet.
- Für PDF und Markdown ist der Umfang erkennbar wählbar: Idea Snapshot (Stufen 1–6) oder gesamter Spezifikationsentwurf (Stufen 1–15).
- PDF enthält Projektname, Stand/Exportdatum, ausgewählte Stufen mit zugehörigen Zusatzfeldern, offene Inhalte und Seitenzahlen. Prüfe A4-Layout, lange Texte und Umlaute.
- Exportbeschriftungen folgen der gewählten UI-Sprache. Nutzereingaben bleiben unverändert.
- JSON sichert den vollständigen aktiven Entwurf einschließlich bereits ausgefüllter späterer Stufen, auch aus der Clarify-Ansicht. Sprachwechsel ändern seine Feld-IDs nicht.
- Exporte enthalten nur ausdrücklich übernommene Annahmen, nie API-Schlüssel, interne Provider-Antworten oder nicht übernommene Vorschläge.

Import und Speicherung:
- Vergleiche die tatsächlichen bisherigen Clarify- und Prototyp-JSON-Formate. Implementiere explizite, versionierte Zuordnungen; nimm keine Kompatibilität allein wegen der Dateiendung an.
- Übernimm alte Clarify-Dateien, vorhandene Prototyp-Dateien und neue Sicherungen. Erhalte Texte, Metadaten und Zeitstempel, soweit vorhanden; fehlende Stufen bleiben offen.
- Ungültige Dateien oder fehlgeschlagene Migrationen dürfen bestehende Daten nicht überschreiben.
- Bestätige das Ersetzen eines vorhandenen Entwurfs mit Sicherungs- und Rückgängig-Möglichkeit.
- Erzeuge Exporte ohne Übermittlung der Entwurfsinhalte an externe Dienste.

Prüfe Datenübernahme und JSON-Roundtrips mit repräsentativen Dateien. Berichte, welche Altformate tatsächlich getestet wurden und welche Referenzdateien fehlen. Deploye nichts und ändere keine externen Systeme.
```

## Prompt 4: Browserprüfung und Abschluss

```text
Prüfe und korrigiere die fertig umgestaltete MVPCompanion-Website im Browser. Verwende den vorhandenen lokalen Testbetrieb oder eine bereits autorisierte private Vorschau. Berücksichtige vorhandene Projektvorgaben und führe passende Build-, Typ-, Lint- und vorhandene Worker-/API-Tests aus.

Validiere diese Abläufe in EN und DE:
1. Neue Idee über Clarify beginnen; alle sechs Stufen einschließlich Context bearbeiten.
2. Zum vollständigen Arbeitsbereich wechseln: Antworten bleiben erhalten, Jobs ist der nächste Schritt, insgesamt stehen 15 Stufen bereit.
3. Zu einer frühen Stufe zurückkehren, sie ändern und anschließend weiterarbeiten.
4. Während der Bearbeitung EN ↔ DE wechseln: Eingaben, Schritt, Ansicht und Fortschritt bleiben erhalten.
5. Seite neu laden: Entwurf wird entsprechend der vorhandenen Speicherregeln wiederhergestellt.
6. BookScout in beiden Sprachen ansehen; zwischen sechs und 15 Stufen wechseln. Persönlicher Entwurf bleibt erhalten. Vorlage übernehmen und Ersetzung rückgängig machen.
7. Alte Clarify-JSON, vorhandene Prototyp-JSON und neue Sicherungen importieren; unvollständige und ungültige Dateien prüfen.
8. JSON exportieren und wieder importieren: alle Inhalte einschließlich späterer Stufen bleiben erhalten.
9. PDF und Markdown mit beiden Exportumfängen erstellen. Prüfe Inhalte, offene Felder, Zusatzfelder, EN/DE-Beschriftungen und lange Texte.
10. Desktop und schmale mobile Ansicht, Tastaturbedienung, Dialogfokus und Sprachwechsel prüfen.
11. Falls eine Annahmengenerierung vorhanden ist: Prüfe ihre Verfügbarkeit, die Mindestkontext-Regeln, Lade- und Fehlerzustände, Bearbeitung, Auswahl, ausdrückliche Übernahme und das Markieren veralteter Vorschläge. Verwende bevorzugt vorhandene Testantworten oder Mocks; gib keine Secrets aus.

Prüfe außerdem, dass alte Clarify-Einstiegslinks zum gemeinsamen Arbeitsbereich führen, neue Texte vollständig übersetzt sind, Fortschrittsanzeigen keine inhaltliche Validierung behaupten und KI-Vorschläge stets als unbestätigte Hypothesen gekennzeichnet sind.

Behebe gefundene Fehler im autorisierten Codeumfang und wiederhole betroffene Prüfungen. Unterscheide im Bericht tatsächliche Browserprüfungen von automatisierten oder noch offenen Prüfungen. Wenn Browserzugriff fehlt, benenne die verbleibenden Abläufe ausdrücklich.

Liefere eine konkrete, überprüfbare Abschlussübersicht mit Änderungen, Testergebnissen, verbleibenden Problemen und dem Link zu einer vorhandenen privaten Vorschau, falls verfügbar. Ändere keine Produktionssysteme und veröffentliche nichts öffentlich. Bereite ein späteres Deployment nur vor; führe es erst nach meiner ausdrücklichen Zustimmung aus.
```
