import { useState, useRef } from "react";

/* ─── COLOR MAP ─────────────────────────────────────────────────────────── */
const MC  = ["purple","teal","blue","amber","coral"];
const MI  = ["ti-book","ti-scale","ti-shield-check","ti-lock","ti-world"];
const MB  = {purple:"#534AB7",teal:"#0F6E56",blue:"#185FA5",amber:"#854F0B",coral:"#993C1D"};
const MBG = {purple:"#EEEDFE",teal:"#E1F5EE",blue:"#E6F1FB",amber:"#FAEEDA",coral:"#FAECE7"};
const MT  = {purple:"#3C3489",teal:"#085041",blue:"#0C447C",amber:"#633806",coral:"#712B13"};

/* ─── LEVELS ─────────────────────────────────────────────────────────────── */
const LEVELS = [
  {min:0,   next:150,  label:"Neuling"},
  {min:150, next:350,  label:"Azubi"},
  {min:350, next:650,  label:"Kenner"},
  {min:650, next:1000, label:"Experte"},
  {min:1000,next:1500, label:"Profi"},
  {min:1500,next:2000, label:"Meister"},
];

/* ─── MODULES ────────────────────────────────────────────────────────────── */
const MODS = [
  {
    title:"Grundbegriffe", sub:"Datenschutz & Datensicherheit",
    lessons:[
      {t:"Datenschutz vs. Datensicherheit",
       b:"Datenschutz schützt personenbezogene Daten vor Missbrauch und sichert das Recht auf informationelle Selbstbestimmung. Datensicherheit umfasst technische Schutzmaßnahmen: Vertraulichkeit, Integrität und Verfügbarkeit (CIA-Triad). Datenschutz ist rechtlich/organisatorisch, Datensicherheit ist technisch. Die DSGVO regelt Datenschutz EU-weit seit dem 25. Mai 2018.",
       k:["Datenschutz = rechtlich (informationelle Selbstbestimmung)","Datensicherheit = technisch (CIA: Vertraulichkeit, Integrität, Verfügbarkeit)","DSGVO gilt seit 25.05.2018 in der gesamten EU"]},
      {t:"Personenbezogene Daten",
       b:"Personenbezogene Daten (Art. 4 DSGVO) sind alle Informationen, die eine natürliche Person direkt oder indirekt identifizierbar machen. Direkt: Name, Foto, Fingerabdruck. Indirekt: IP-Adresse, Kundennummer, Cookies, Kfz-Kennzeichen. Besondere Kategorien (Art. 9): Gesundheit, Biometrie, Religion, politische Meinung, Gewerkschaft, sexuelle Orientierung, ethnische Herkunft – erhöhter Schutz!",
       k:["Direkt: Name, Adresse, Foto, Fingerabdruck","Indirekt: IP-Adresse, Kundennummer, Cookies","Art. 9: Gesundheit, Biometrie, Religion = erhöhter Schutz"]},
      {t:"Rechtsgrundlagen nach Art. 6",
       b:"Das Verbotsprinzip mit Erlaubnisvorbehalt: Verarbeitung personenbezogener Daten ist grundsätzlich verboten, außer eine der 6 Rechtsgrundlagen nach Art. 6 DSGVO liegt vor: (1) Einwilligung, (2) Vertragserfüllung, (3) rechtliche Verpflichtung, (4) lebenswichtige Interessen, (5) öffentliches Interesse, (6) berechtigtes Interesse des Verantwortlichen.",
       k:["Verbotsprinzip: alles verboten ohne ausdrückliche Erlaubnis","6 Rechtsgrundlagen nach Art. 6 DSGVO","Einwilligung: freiwillig, informiert, eindeutig, widerrufbar"]},
    ],
    quiz:[
      {q:"Was ist der Unterschied zwischen Datenschutz und Datensicherheit?",
       opts:["Sie sind synonyme Begriffe","Datenschutz = rechtlich; Datensicherheit = technisch","Datenschutz gilt nur für Unternehmen","Datensicherheit schützt nur Passwörter"],c:1,
       e:"Datenschutz = rechtlicher Schutz personenbezogener Daten (informationelle Selbstbestimmung). Datensicherheit = technische Schutzziele: Vertraulichkeit, Integrität, Verfügbarkeit (CIA)."},
      {q:"Was sind besondere Kategorien nach Art. 9 DSGVO?",
       opts:["Name und Adresse","IP-Adresse und Cookies","Gesundheitsdaten, Biometrie, Religion, politische Überzeugungen u.a.","Alle Daten im Internet"],c:2,
       e:"Art. 9 schützt besonders sensible Daten: Gesundheit, Biometrie, Religion, politische Überzeugungen, Gewerkschaft, sexuelle Orientierung, ethnische Herkunft – mit erhöhtem Schutz."},
      {q:"Wann dürfen personenbezogene Daten verarbeitet werden?",
       opts:["Immer wenn es nötig ist","Nur mit schriftlicher Einwilligung","Nur wenn eine der 6 Rechtsgrundlagen (Art. 6) vorliegt","Nur bei Unternehmen > 50 MA"],c:2,
       e:"Verbotsprinzip mit Erlaubnisvorbehalt: Verarbeitung grundsätzlich verboten, außer eine der 6 Rechtsgrundlagen des Art. 6 DSGVO liegt vor (Einwilligung, Vertrag, gesetzl. Pflicht, ...)."},
      {q:"Welche Identifikation ist indirekt (nicht direkt)?",
       opts:["Name","Foto","IP-Adresse","Fingerabdruck"],c:2,
       e:"Die IP-Adresse ist eine indirekte Identifikation – sie erfordert Zusatzwissen (z.B. beim Provider). Name, Foto und Fingerabdruck identifizieren direkt."},
    ]
  },
  {
    title:"DSGVO Prinzipien", sub:"Die 7 Grundsätze nach Art. 5",
    lessons:[
      {t:"Grundsätze 1–4",
       b:"(1) Rechtmäßigkeit, Treu und Glauben, Transparenz: Verarbeitung muss legal, fair und nachvollziehbar sein. (2) Zweckbindung: Daten nur für festgelegte, eindeutige Zwecke erheben – kein Zweckwechsel ohne neue Rechtsgrundlage. (3) Datenminimierung: so wenige Daten wie nötig ('Privacy by Design' / 'Privacy by Default'). (4) Richtigkeit: Daten müssen korrekt und aktuell sein.",
       k:["Transparenz: Betroffene über Verarbeitung informieren","Zweckbindung: kein Zweckwechsel ohne neue Rechtsgrundlage","Datenminimierung: nur das Nötigste erheben","Richtigkeit: Korrektheit aktiv sicherstellen"]},
      {t:"Grundsätze 5–7",
       b:"(5) Speicherbegrenzung: Daten löschen, wenn Zweck erfüllt ist (Löschkonzept nötig!). Ausnahme: gesetzliche Aufbewahrungsfristen (z.B. Rechnungen: 10 Jahre). (6) Integrität & Vertraulichkeit: technische Schutzmaßnahmen (TOMs). (7) Rechenschaftspflicht: Einhaltung nachweisbar durch Verarbeitungsverzeichnis (Art. 30) und DSFA (Art. 35).",
       k:["Speicherbegrenzung: Löschen wenn Zweck erfüllt","TOMs für Integrität und Vertraulichkeit nötig","Rechenschaftspflicht: Compliance dokumentieren","Verarbeitungsverzeichnis nach Art. 30 DSGVO"]},
      {t:"Zweckbindung in der Praxis",
       b:"Zweckbindung: Daten nur für den angegebenen Zweck nutzen. Beispiel: E-Mail-Adresse für Bestellbestätigung darf NICHT ohne separate Einwilligung für Newsletter verwendet werden. Eine Zweckänderung erfordert stets eine neue Rechtsgrundlage. Privacy by Design: Datenschutz ab Entwicklungsbeginn. Privacy by Default: datenschutzfreundlichste Einstellung ist der Standard.",
       k:["E-Mail für Bestellung ≠ Newsletter ohne Einwilligung","Zweckänderung = neue Rechtsgrundlage nötig","Privacy by Design: Datenschutz eingebaut, nicht nachträglich","Privacy by Default: Opt-in als datenschutzfreundlicher Standard"]},
    ],
    quiz:[
      {q:"Online-Shop nutzt Kunden-E-Mails für Newsletter. Erlaubt?",
       opts:["Ja, freie Nutzung aller eigenen Daten","Nein – verletzt Zweckbindung ohne separate Einwilligung","Ja, wenn Opt-out angeboten wird","Ja, wenn ein DSB im Unternehmen vorhanden ist"],c:1,
       e:"Zweckbindung (Art. 5 lit. b): Die E-Mail wurde für Bestellbestätigungen erhoben, nicht für Marketing. Newsletter ohne eigene Einwilligung = klarer DSGVO-Verstoß."},
      {q:"Was bedeutet Datenminimierung?",
       opts:["Kleine Dateigrößen speichern","Nur so viele personenbezogene Daten erheben wie nötig","Minderjährige dürfen keine Daten erheben","Mindestens 10 Datenpunkte pro Person"],c:1,
       e:"Datenminimierung (Art. 5 lit. c): Es dürfen nur die Daten erhoben werden, die für den konkreten Zweck tatsächlich notwendig sind – so wenig wie möglich."},
      {q:"Welches Dokument fordert Art. 30 DSGVO?",
       opts:["Datenschutzerklärung auf der Website","Verarbeitungsverzeichnis aller Tätigkeiten","Datenschutz-Folgenabschätzung (DSFA)","Geheimhaltungsvereinbarung mit Mitarbeitern"],c:1,
       e:"Art. 30 DSGVO: Das Verarbeitungsverzeichnis dokumentiert alle Verarbeitungstätigkeiten des Unternehmens und erfüllt damit die Rechenschaftspflicht nach Art. 5 Abs. 2."},
      {q:"Welcher Grundsatz fordert das Löschen von Daten nach Zweckerfüllung?",
       opts:["Zweckbindung","Datenminimierung","Speicherbegrenzung","Richtigkeit"],c:2,
       e:"Speicherbegrenzung (Art. 5 lit. e): Daten nur so lange speichern wie nötig. Danach Löschen oder Anonymisieren. Ausnahme: gesetzliche Aufbewahrungsfristen."},
    ]
  },
  {
    title:"Betroffenenrechte", sub:"Art. 15–21 DSGVO",
    lessons:[
      {t:"Auskunft & Berichtigung",
       b:"Art. 15 – Auskunftsrecht: Jede Person kann kostenlos erfahren, welche Daten gespeichert sind, zu welchem Zweck und wie lange. Antwortfrist: 1 Monat (bei Komplexität verlängerbar auf max. 3 Monate, mit Benachrichtigungspflicht). Art. 16 – Berichtigungsrecht: Falsche oder unvollständige Daten müssen auf Anfrage berichtigt bzw. vervollständigt werden.",
       k:["Art. 15: Auskunft in 1 Monat (verlängerbar auf 3)","Auskunft ist für Betroffene kostenlos","Art. 16: Falsche Daten berichtigen lassen","Auch unvollständige Daten ergänzen"]},
      {t:"Löschung, Einschränkung & Portabilität",
       b:"Art. 17 – Recht auf Löschung ('Vergessenwerden'): bei Zweckentfall, Widerruf, Widerspruch, unrechtmäßiger Verarbeitung, Minderjährigendaten. Art. 18 – Einschränkung: Daten 'einfrieren' (vorhanden, aber nicht mehr genutzt). Art. 20 – Datenportabilität: Daten in maschinenlesbarem Format (CSV, JSON) erhalten und zu anderem Anbieter übertragen.",
       k:["Art. 17: Löschen bei Zweckentfall, Widerruf, Widerspruch","Art. 18: Einfrieren statt Löschen (Nutzungsstopp)","Art. 20: Daten portabel exportieren (CSV, JSON)","Portabilität: nur bei automatisierter Verarbeitung"]},
      {t:"Widerspruch & Widerruf",
       b:"Art. 21 – Widerspruchsrecht: Betroffene können der Verarbeitung auf Basis berechtigten Interesses widersprechen. Bei Direktwerbung: Widerspruch MUSS IMMER akzeptiert werden – absolut, keine Ausnahme! Art. 7 Abs. 3 – Widerruf: Einwilligungen jederzeit widerrufbar, so einfach wie die Einwilligung, gilt für die Zukunft (nicht rückwirkend).",
       k:["Art. 21: Widerspruch gegen berechtigtes Interesse möglich","Direktwerbung: absolutes Widerspruchsrecht (ohne Ausnahme)","Widerruf (Art. 7): jederzeit & so einfach wie Einwilligung","Widerruf gilt nicht rückwirkend"]},
    ],
    quiz:[
      {q:"Antwortfrist für Auskunft nach Art. 15 DSGVO?",
       opts:["24 Stunden","1 Woche","1 Monat (verlängerbar auf 3 Monate)","6 Monate"],c:2,
       e:"Art. 12: Antwort innerhalb von 1 Monat. Bei Komplexität verlängerbar auf max. 3 Monate – Betroffener muss über die Verlängerung informiert werden."},
      {q:"Wann gilt das Recht auf Löschung (Art. 17)?",
       opts:["Immer auf einfache Anfrage","Bei Zweckentfall, Widerruf der Einwilligung, Widerspruch u.a.","Nur für Minderjährige","Nur wenn Daten nachweislich falsch sind"],c:1,
       e:"Art. 17 greift bei: Zweckentfall, Widerruf der Einwilligung, berechtigtem Widerspruch, unrechtmäßiger Verarbeitung und Minderjährigendaten – nicht immer auf einfache Anfrage."},
      {q:"Was ermöglicht Art. 20 (Datenportabilität)?",
       opts:["Internationalen Datentransfer","Daten in maschinenlesbarem Format erhalten und zu anderem Anbieter übertragen","Automatische Datenlöschung","Datenverschlüsselung erzwingen"],c:1,
       e:"Portabilität: Daten in maschinenlesbarem Format (JSON, CSV) erhalten – z.B. Social-Media-Daten zu einem anderen Netzwerk übertragen ('Anbieterwechsel')."},
      {q:"Wann MUSS einem Widerspruch zwingend stattgegeben werden?",
       opts:["Immer und ohne Ausnahme","Bei Art. 9 Sonderkategorien","Bei Direktwerbung – absolut","Nur bei Minderjährigen unter 18"],c:2,
       e:"Art. 21 Abs. 3: Bei Direktwerbung ist der Widerspruch absolut – keine Abwägung möglich. Bei anderen Verarbeitungen kann der Verantwortliche überwiegende Interessen dagegen stellen."},
    ]
  },
  {
    title:"Techn. Maßnahmen", sub:"TOMs & Schutzmechanismen",
    lessons:[
      {t:"Anonymisierung vs. Pseudonymisierung",
       b:"Anonymisierung: Daten können NICHT mehr einer Person zugeordnet werden – irreversibel und endgültig. Anonymisierte Daten fallen vollständig aus dem DSGVO-Schutzbereich! Pseudonymisierung (Art. 4 Nr. 5): Merkmale durch Pseudonyme ersetzen. Reidentifikation über Schlüsseltabelle möglich → weiterhin personenbezogen! Schlüsseltabelle separat und sicher aufbewahren.",
       k:["Anonymisierung: irreversibel, nicht mehr DSGVO-pflichtig","Pseudonymisierung: reversibel, bleibt personenbezogen","Schlüsseltabelle separat und sicher aufbewahren","Pseudonymisierung gilt als empfohlene TOM"]},
      {t:"Verschlüsselung & Zugriffskontrolle",
       b:"Symmetrisch (z.B. AES): ein Schlüssel für Ver- und Entschlüsselung, schnell – Schlüsselverteilungsproblem. Asymmetrisch (z.B. RSA): öffentlicher + privater Schlüssel – löst Verteilungsproblem. HTTPS = TLS/SSL: Hybridverfahren. Zugriffsschutz: Authentifizierung (Wer bist du?), Autorisierung (Was darfst du?), Audit-Logs (Was wurde wann gemacht?). Need-to-know-Prinzip: minimale Rechte.",
       k:["AES = symmetrisch | RSA = asymmetrisch","HTTPS = TLS/SSL Hybridverfahren","Authentifizierung vs. Autorisierung unterscheiden","Need-to-know: minimale Zugriffsrechte vergeben"]},
      {t:"Privacy by Design & Backups",
       b:"Privacy by Design: Datenschutz von Beginn an in Systeme einbauen – nicht nachträglich. Privacy by Default: datenschutzfreundlichste Einstellung ist Standard (Opt-in, nicht Opt-out). 3-2-1-Backup: 3 Kopien, auf 2 verschiedenen Medien, davon 1 Offsite. DSFA (Art. 35): Pflicht-Risikoanalyse VOR besonders riskanter Verarbeitung (z.B. Videoüberwachung, umfangreiches Profiling).",
       k:["Privacy by Design: Datenschutz eingebaut, nicht nachträglich","Privacy by Default: Opt-in als datenschutzfreundlicher Standard","3-2-1-Backupregel (3 Kopien, 2 Medien, 1 Offsite)","DSFA (Art. 35) vor riskanter Verarbeitung Pflicht"]},
    ],
    quiz:[
      {q:"Hauptunterschied Anonymisierung vs. Pseudonymisierung?",
       opts:["Anonymisierung ist verschlüsselt, Pseudonymisierung nicht","Anonymisierung irreversibel (kein DSGVO); Pseudonymisierung reversibel (noch DSGVO)","Pseudonymisierung gilt nur für Gesundheitsdaten","Es gibt keinen Unterschied"],c:1,
       e:"Anonymisierung: endgültig, keine Reidentifikation möglich → kein DSGVO mehr. Pseudonymisierung: Schlüsseltabelle vorhanden → Reidentifikation möglich → DSGVO gilt weiterhin."},
      {q:"Was bedeutet das 'Need-to-know-Prinzip'?",
       opts:["Alle Mitarbeiter müssen alle Daten kennen","Nur nötige Datenzugänge für die jeweilige Aufgabe vergeben","Kunden müssen über alle gespeicherten Daten informiert sein","Eine Mindestdatenmenge definieren"],c:1,
       e:"Need-to-know: Jeder Mitarbeiter erhält nur die Datenzugänge, die er für seine konkrete Aufgabe tatsächlich benötigt – kein überflüssiger Zugang, minimales Risiko."},
      {q:"Fallen pseudonymisierte Daten unter die DSGVO?",
       opts:["Nein, wie vollständig anonymisierte Daten","Nur wenn Gesundheitsdaten betroffen sind","Ja – Reidentifikation über Schlüsseltabelle möglich","Nur bei Unternehmen über 250 Mitarbeiter"],c:2,
       e:"Pseudonymisierte Daten bleiben personenbezogen, weil über die Schlüsseltabelle eine Zuordnung zur Person möglich ist. Nur vollständig anonymisierte Daten fallen aus dem DSGVO-Schutzbereich."},
      {q:"Was bedeutet 'Privacy by Default'?",
       opts:["Standardmäßig keine Datenschutzeinstellungen aktiv","Datenschutz nur auf ausdrücklichen Wunsch","Datenschutzfreundlichste Einstellung ist Standard (Opt-in)","Alle Daten standardmäßig anonymisiert"],c:2,
       e:"Privacy by Default: Die datenschutzfreundlichste Option ist der Standard. Nutzer müssen aktiv zustimmen (Opt-in), nicht aktiv ablehnen (Opt-out). Kein vorausgefülltes 'Alles akzeptieren'."},
    ]
  },
  {
    title:"Datenschutz Praxis", sub:"Institutionen & Praxisfälle",
    lessons:[
      {t:"Cookies & Einwilligung",
       b:"Cookie-Kategorien: (1) Technisch notwendig → keine Einwilligung erforderlich. (2) Statistik/Analyse → Einwilligung nötig. (3) Marketing/Tracking → Einwilligung nötig. Gültige Einwilligung nach Art. 7: freiwillig, informiert, eindeutig (aktives Opt-in, KEIN vorausgewähltes Häkchen!), jederzeit widerrufbar. Cookie-Banner: stammt aus ePrivacy-Richtlinie, nicht direkt aus der DSGVO.",
       k:["Technische Cookies: kein Banner erforderlich","Tracking-Cookies: Opt-in Einwilligung Pflicht","Kein vorausgewähltes Häkchen! (= kein wirksames Opt-in)","Einwilligung muss so einfach widerrufbar sein wie erteilt"]},
      {t:"Datenschutzbeauftragter & Meldepflicht",
       b:"DSB Pflicht (Art. 37 / BDSG §38): mehr als 20 Personen mit regelmäßigem Datenzugang ODER Art. 9-Kategorien ODER systematische umfangreiche Überwachung. DSB-Rechte: weisungsfrei und mit Kündigungsschutz. Datenpanne Art. 33: Meldung bei Aufsichtsbehörde in 72 Stunden. Art. 34: Betroffene informieren bei hohem Risiko. In NRW: LDI NRW als Aufsichtsbehörde.",
       k:["DSB ab 20 Personen mit regelmäßigem Datenzugang","DSB: weisungsfrei & Kündigungsschutz","Art. 33: Datenpanne → 72 Stunden Meldepflicht","Art. 34: Betroffene bei hohem Risiko informieren"]},
      {t:"Datenschutzerklärung & Bußgelder",
       b:"Datenschutzerklärung Pflichtinhalte (Art. 13): (1) Verantwortlicher + Kontakt, (2) Zweck + Rechtsgrundlage, (3) Empfänger, (4) Speicherdauer, (5) Betroffenenrechte, (6) Beschwerderecht bei Behörde, (7) automatisierte Entscheidungen. Bußgelder Art. 83: Stufe 1 – bis 10 Mio. € / 2% Umsatz. Stufe 2 (schwere Verstöße) – bis 20 Mio. € / 4% Umsatz. Rekord: Meta 1,2 Mrd. € (2023).",
       k:["7 Pflichtangaben in der Datenschutzerklärung","Art. 83 Stufe 1: 10 Mio. € / 2% Jahresumsatz","Art. 83 Stufe 2: 20 Mio. € / 4% Jahresumsatz","Meta-Rekordstrafe: 1,2 Mrd. € (2023)"]},
    ],
    quiz:[
      {q:"Frist für Datenpannenmeldung nach Art. 33 DSGVO?",
       opts:["12 Stunden","72 Stunden","1 Woche","1 Monat"],c:1,
       e:"Art. 33 DSGVO: Datenpannen müssen der Aufsichtsbehörde innerhalb von 72 Stunden gemeldet werden. Bei Verzögerung muss der Grund angegeben werden."},
      {q:"Was ist bei der Cookie-Einwilligung nach Art. 7 FALSCH?",
       opts:["Freiwilligkeit des Nutzers","Vorausgewähltes Akzeptieren-Häkchen (Opt-out)","Informiertheit über den Zweck","Jederzeit widerrufbar"],c:1,
       e:"Ein vorausgewähltes Häkchen ist KEINE wirksame Einwilligung! Opt-in erfordert eine aktive Handlung des Nutzers. Vorausgefüllte Optionen verstoßen klar gegen Art. 7 DSGVO."},
      {q:"Maximale Strafe für schwere DSGVO-Verstöße (Art. 83 Abs. 5)?",
       opts:["1 Mio. € oder 1% Umsatz","10 Mio. € oder 2% Umsatz","20 Mio. € oder 4% Umsatz","Maximal 100.000 €"],c:2,
       e:"Art. 83 Abs. 5 (Stufe 2): bis 20 Mio. € oder 4% des weltweiten Jahresumsatzes – jeweils der höhere Betrag. Gilt bei schweren Verstößen gegen Grundprinzipien und Betroffenenrechte."},
      {q:"Ab wann besteht DSB-Pflicht in Deutschland?",
       opts:["Ab dem ersten Mitarbeiter","Ab 50 Mitarbeitern","Ab 20 Personen mit regelmäßigem Datenzugang","Nur bei Aktiengesellschaften"],c:2,
       e:"Deutschland (BDSG §38): DSB-Pflicht wenn mehr als 20 Personen regelmäßig personenbezogene Daten verarbeiten. Außerdem: bei Art. 9-Kategorien und systematischer umfangreicher Überwachung."},
    ]
  },
];

/* ─── BADGES ─────────────────────────────────────────────────────────────── */
const BDGS = [
  {id:"first",  icon:"ti-baby-carriage", title:"Erster Schritt",     desc:"Modul 1 abgeschlossen",        c:"teal"},
  {id:"bolt",   icon:"ti-bolt",          title:"Schnelldenker",       desc:"3 Antworten in Folge richtig", c:"amber"},
  {id:"perfect",icon:"ti-trophy",        title:"Perfektionist",       desc:"Quiz mit 4/4 bestanden",       c:"purple"},
  {id:"half",   icon:"ti-road",          title:"Halbzeit!",           desc:"3 Module abgeschlossen",       c:"blue"},
  {id:"gdpr",   icon:"ti-scale",         title:"DSGVO-Guru",          desc:"Modul 2 abgeschlossen",        c:"teal"},
  {id:"rights", icon:"ti-shield-check",  title:"Rechte-Experte",      desc:"Modul 3 abgeschlossen",        c:"blue"},
  {id:"tech",   icon:"ti-lock",          title:"Tech-Zauberer",       desc:"Modul 4 abgeschlossen",        c:"amber"},
  {id:"champ",  icon:"ti-award",         title:"Datenschutz-Champion",desc:"Alle 5 Module abgeschlossen!", c:"purple"},
];

/* ─── CHEATSHEET DATA ────────────────────────────────────────────────────── */
const CHEAT_EXTRA = [
  {head:"Wichtige Artikel auf einen Blick", items:[
    "Art. 4 – Begriffsbestimmungen (personenbezogene Daten, Verarbeitung, Pseudonymisierung ...)",
    "Art. 5 – Grundsätze für die Verarbeitung (7 Prinzipien)",
    "Art. 6 – Rechtmäßigkeit der Verarbeitung (6 Rechtsgrundlagen)",
    "Art. 7 – Bedingungen für die Einwilligung (freiwillig, informiert, eindeutig, widerrufbar)",
    "Art. 9 – Besondere Kategorien personenbezogener Daten",
    "Art. 12–14 – Transparenzpflichten und Informationspflichten",
    "Art. 15–21 – Rechte der betroffenen Personen",
    "Art. 25 – Datenschutz durch Technikgestaltung (Privacy by Design/Default)",
    "Art. 30 – Verarbeitungsverzeichnis",
    "Art. 33/34 – Meldung und Benachrichtigung bei Datenpannen (72h!)",
    "Art. 35 – Datenschutz-Folgenabschätzung (DSFA)",
    "Art. 37–39 – Datenschutzbeauftragter (DSB)",
    "Art. 83 – Allgemeine Bedingungen für die Verhängung von Geldbußen (Stufe 1/2)",
  ]},
  {head:"Typische Klausurfragen & Tipps", items:[
    "Unterschied Datenschutz vs. Datensicherheit immer klar benennen",
    "Pseudonymisierung bleibt personenbezogen – niemals mit Anonymisierung verwechseln!",
    "Zweckbindung: immer prüfen ob Zweck übereinstimmt",
    "Einwilligung: 4 Voraussetzungen nennen (freiwillig, informiert, eindeutig, widerrufbar)",
    "Bußgelder: höherer Betrag gilt (€-Betrag ODER %-Umsatz)",
    "Art. 33: 72 Stunden Meldepflicht bei Datenpannen – Zahl merken!",
    "DSB-Pflicht: > 20 Personen mit regelmäßigem Datenzugang",
    "Need-to-know-Prinzip als TOM immer erwähnenswert",
  ]},
];

/* ─── COMPONENT ──────────────────────────────────────────────────────────── */
export default function App() {
  const [nav,    setNav]    = useState("home");
  const [mi,     setMi]     = useState(0);
  const [li,     setLi]     = useState(0);
  const [phase,  setPhase]  = useState("lesson");
  const [xp,     setXp]     = useState(0);
  const [streak, setStreak] = useState(0);
  const [done,   setDone]   = useState(new Set());
  const [bdgs,   setBdgs]   = useState(new Set());
  const [qi,     setQi]     = useState(0);
  const [qs,     setQs]     = useState(0);
  const [picked, setPicked] = useState(null);
  const [reveal, setReveal] = useState(false);
  const [toast,  setToast]  = useState(null);
  const [bonus,  setBonus]  = useState(0);
  const [cheatUnlocked, setCheatUnlocked] = useState(false);
  const cheatClicks = useRef(0);
  const cheatClickTimer = useRef(null);

  const mod    = MODS[mi];
  const col    = MC[mi];
  const lesson = mod.lessons[li];
  const lvIdx  = LEVELS.reduce((a,l,i) => xp >= l.min ? i : a, 0);
  const lv     = LEVELS[lvIdx];
  const lvPct  = Math.min(100, Math.round(((xp - lv.min) / (lv.next - lv.min)) * 100));
  const cheat  = cheatUnlocked || done.size >= 3;

  function onNavClick(n) {
    const locked = n.s === "cheatsheet" && !cheat;
    if (!locked) {
      setNav(n.s);
      return;
    }

    cheatClicks.current += 1;
    if (cheatClickTimer.current) clearTimeout(cheatClickTimer.current);
    cheatClickTimer.current = setTimeout(() => {
      cheatClicks.current = 0;
      cheatClickTimer.current = null;
    }, 700);

    if (cheatClicks.current >= 3) {
      setCheatUnlocked(true);
      setNav("cheatsheet");
      showToast({
        icon: "ti ti-file-text",
        title: "Cheatsheet freigeschaltet",
        desc: "Du hast das Cheatsheet mit 3 schnellen Klicks direkt freigeschaltet!",
        c: "purple"
      });
      cheatClicks.current = 0;
      clearTimeout(cheatClickTimer.current);
      cheatClickTimer.current = null;
    }
  }

  function showToast(b) { setToast(b); setTimeout(() => setToast(null), 3500); }
  function earn(id) {
    if (bdgs.has(id)) return;
    setBdgs(p => new Set([...p, id]));
    const b = BDGS.find(x => x.id === id);
    if (b) showToast(b);
  }

  function onPick(idx) {
    if (reveal) return;
    setPicked(idx);
    setReveal(true);
    const ok = idx === mod.quiz[qi].c;
    const ns = ok ? streak + 1 : 0;
    setStreak(ns);
    if (ok) { setXp(p => p + 50); setQs(p => p + 1); }
    if (ns >= 3) earn("bolt");
  }

  function onNext() {
    if (!reveal) return;
    const last = qi === mod.quiz.length - 1;
    if (!last) {
      setQi(p => p + 1); setPicked(null); setReveal(false);
    } else {
      const finalScore = qs;
      const perfect    = finalScore === mod.quiz.length;
      const b          = 100 + (perfect ? 50 : 0);
      setBonus(b);
      setXp(p => p + b);
      const nd = new Set([...done, mi]);
      setDone(nd);
      if (perfect) earn("perfect");
      const m2b = {0:"first",1:"gdpr",2:"rights",3:"tech"};
      if (m2b[mi]) earn(m2b[mi]);
      if (nd.size >= 3) earn("half");
      if (nd.size >= 5) earn("champ");
      setPhase("result");
    }
  }

  function goMod(idx) { setMi(idx); setLi(0); setPhase("lesson"); setNav("module"); }
  function goQuiz()   { setQi(0); setQs(0); setPicked(null); setReveal(false); setPhase("quiz"); }

  /* ── helpers ── */
  const Pill = ({c, children, small}) => (
    <span style={{
      fontSize: small ? 10 : 11,
      background: MBG[c], color: MT[c],
      borderRadius: "var(--border-radius-md)",
      padding: small ? "1px 7px" : "2px 9px",
      display: "inline-flex", alignItems: "center", gap: 4
    }}>{children}</span>
  );

  const ProgressBar = ({pct, color, h=5}) => (
    <div style={{height:h, background:"var(--color-border-tertiary)", borderRadius:h, overflow:"hidden"}}>
      <div style={{height:"100%", width:`${pct}%`, background:color, borderRadius:h, transition:"width 0.35s"}}/>
    </div>
  );

  const Card = ({children, style={}}) => (
    <div style={{
      background: "var(--color-background-primary)",
      border: "0.5px solid var(--color-border-tertiary)",
      borderRadius: "var(--border-radius-lg)",
      padding: "16px",
      ...style
    }}>{children}</div>
  );

  const StatBox = ({icon, label, value, col:c}) => (
    <div style={{background:"var(--color-background-secondary)", borderRadius:"var(--border-radius-md)", padding:"12px 8px", textAlign:"center"}}>
      <i className={`ti ${icon}`} style={{fontSize:16, color:MB[c]}} aria-hidden="true"/>
      <div style={{fontSize:16, fontWeight:500, color:"var(--color-text-primary)", margin:"5px 0 2px"}}>{value}</div>
      <div style={{fontSize:10, color:"var(--color-text-secondary)"}}>{label}</div>
    </div>
  );

  return (
    <div style={{fontFamily:"var(--font-sans)", padding:"0 0 2rem"}}>
      {/* Continued in next file due to length */}
      {toast && (
        <div style={{background: MBG[toast.c], border:`1px solid ${MB[toast.c]}`, borderRadius:"var(--border-radius-lg)", padding:"10px 14px", marginBottom:12, display:"flex", alignItems:"center", gap:10}}>
          <i className={`ti ${toast.icon}`} style={{fontSize:18, color:MB[toast.c]}} aria-hidden="true"/>
          <div>
            <div style={{fontWeight:500, fontSize:13, color:MT[toast.c]}}>Badge freigeschaltet: {toast.title}</div>
            <div style={{fontSize:11, color:MT[toast.c], opacity:0.85}}>{toast.desc}</div>
          </div>
        </div>
      )}

      <div style={{background:"var(--color-background-secondary)", border:"0.5px solid var(--color-border-tertiary)", borderRadius:"var(--border-radius-lg)", padding:"10px 14px", marginBottom:12, display:"flex", alignItems:"center", gap:12, flexWrap:"wrap"}}>
        <Pill c="purple"><i className="ti ti-award" style={{fontSize:12}} aria-hidden="true"/>{lv.label}</Pill>
        <div style={{flex:1, minWidth:90}}>
          <div style={{display:"flex", justifyContent:"space-between", marginBottom:3}}>
            <span style={{fontSize:11, color:"var(--color-text-secondary)"}}>{xp} XP</span>
            <span style={{fontSize:11, color:"var(--color-text-secondary)"}}>{lv.next} XP</span>
          </div>
          <ProgressBar pct={lvPct} color={MB.purple}/>
        </div>
        <div style={{fontSize:12, color:"var(--color-text-secondary)", display:"flex", alignItems:"center", gap:3}}>
          <i className="ti ti-bolt" style={{fontSize:13, color:MB.amber}} aria-hidden="true"/>{streak} Streak
        </div>
        <div style={{fontSize:12, color:"var(--color-text-secondary)", display:"flex", alignItems:"center", gap:3}}>
          <i className="ti ti-medal" style={{fontSize:13, color:MB.teal}} aria-hidden="true"/>{bdgs.size}/{BDGS.length}
        </div>
        <div style={{fontSize:12, color:"var(--color-text-secondary)", display:"flex", alignItems:"center", gap:3}}>
          <i className="ti ti-check" style={{fontSize:13}} aria-hidden="true"/>{done.size}/5
        </div>
      </div>

      <div style={{display:"flex", gap:8, marginBottom:16, flexWrap:"wrap"}}>
        {[{s:"home", icon:"ti-home", label:"Dashboard"}, {s:"achievements", icon:"ti-medal", label:"Achievements"}, {s:"cheatsheet", icon:"ti-file-text", label:"Cheatsheet"}].map(n => {
          const locked = n.s === "cheatsheet" && !cheat;
          const active = nav === n.s && nav !== "module";
          return <button key={n.s} onClick={() => onNavClick(n)} style={{fontSize:12, opacity: locked ? 0.45 : 1, ...(active ? {background:MBG.purple, color:MT.purple, borderColor:MB.purple} : {})}} aria-disabled={locked}><i className={`ti ${n.icon}`} style={{fontSize:13}} aria-hidden="true"/>{n.label}{locked && " (ab 3 Modulen)"}</button>;
        })}
      </div>

      {nav === "home" && <div><div style={{fontSize:18, fontWeight:500, color:"var(--color-text-primary)", marginBottom:4}}>Datenschutz Lernpfad</div><div style={{fontSize:13, color:"var(--color-text-secondary)", marginBottom:16}}>Informatik Abitur NRW 2027 · Wähle ein Modul zum Starten</div><div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(175px,1fr))", gap:10}}>{MODS.map((m, i) => {const c = MC[i], isDone = done.has(i); return <div key={i} onClick={() => goMod(i)} style={{background:"var(--color-background-primary)", border: isDone ? `2px solid ${MB[c]}` : "0.5px solid var(--color-border-tertiary)", borderRadius:"var(--border-radius-lg)", padding:"14px", cursor:"pointer"}}><div style={{width:32, height:32, background:MBG[c], borderRadius:"var(--border-radius-md)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:8}}><i className={`ti ${MI[i]}`} style={{fontSize:15, color:MB[c]}} aria-hidden="true"/></div><div style={{fontWeight:500, fontSize:13, color:"var(--color-text-primary)", marginBottom:2}}>{m.title}</div><div style={{fontSize:11, color:"var(--color-text-secondary)", marginBottom:10}}>{m.sub}</div>{isDone ? <Pill c={c} small><i className="ti ti-check" style={{fontSize:11}} aria-hidden="true"/>Abgeschlossen</Pill> : <span style={{fontSize:11, color:"var(--color-text-secondary)"}}>{m.lessons.length} Lektionen + Quiz</span>}</div>;})}</div>{done.size > 0 && <div style={{marginTop:14, background:"var(--color-background-secondary)", borderRadius:"var(--border-radius-lg)", border:"0.5px solid var(--color-border-tertiary)", padding:"12px 14px"}}><div style={{fontWeight:500, fontSize:13, color:"var(--color-text-primary)", marginBottom:7}}>Gesamtfortschritt</div><ProgressBar pct={(done.size/5)*100} color={MB.teal} h={6}/><div style={{marginTop:5, fontSize:11, color:"var(--color-text-secondary)"}}>{done.size}/5 Module · {Math.round((done.size/5)*100)}%{!cheat && " · Cheatsheet ab 3 Modulen freischaltbar"}</div></div>}</div>}

      {nav === "module" && <div><button onClick={() => setNav("home")} style={{marginBottom:12, fontSize:12}}><i className="ti ti-arrow-left" style={{fontSize:13}} aria-hidden="true"/>Zur Übersicht</button><div style={{background:MBG[col], border:`0.5px solid ${MB[col]}`, borderRadius:"var(--border-radius-lg)", padding:"12px 14px", marginBottom:14}}><div style={{display:"flex", alignItems:"center", gap:8, marginBottom:2}}><i className={`ti ${MI[mi]}`} style={{fontSize:16, color:MB[col]}} aria-hidden="true"/><span style={{fontWeight:500, fontSize:15, color:MT[col]}}>{mod.title}</span>{done.has(mi) && <Pill c={col} small><i className="ti ti-check" style={{fontSize:10}} aria-hidden="true"/>Fertig</Pill>}</div><div style={{fontSize:12, color:MT[col], opacity:0.85}}>{mod.sub}</div></div>{phase === "lesson" && <div><div style={{display:"flex", gap:5, marginBottom:12}}>{mod.lessons.map((_,i) => <div key={i} onClick={() => setLi(i)} style={{flex:1, height:4, borderRadius:2, cursor:"pointer", background: i <= li ? MB[col] : "var(--color-border-tertiary)", transition:"background 0.2s"}}/>)}</div><Card style={{marginBottom:12}}><div style={{fontSize:11, color:"var(--color-text-secondary)", marginBottom:3}}>Lektion {li+1} von {mod.lessons.length}</div><div style={{fontWeight:500, fontSize:15, color:"var(--color-text-primary)", marginBottom:12}}>{lesson.t}</div><div style={{fontSize:13, color:"var(--color-text-primary)", lineHeight:1.75, marginBottom:14}}>{lesson.b}</div><div style={{background:"var(--color-background-secondary)", borderRadius:"var(--border-radius-md)", padding:"10px 12px", borderLeft:`3px solid ${MB[col]}`}}><div style={{fontSize:10, fontWeight:500, color:"var(--color-text-secondary)", letterSpacing:"0.06em", marginBottom:6}}>MERKSÄTZE</div>{lesson.k.map((k,i) => <div key={i} style={{display:"flex", gap:8, alignItems:"flex-start", marginBottom: i < lesson.k.length-1 ? 5 : 0}}><i className="ti ti-chevron-right" style={{fontSize:11, color:MB[col], marginTop:2, flexShrink:0}} aria-hidden="true"/><span style={{fontSize:12, color:"var(--color-text-primary)", lineHeight:1.5}}>{k}</span></div>)}</div></Card><div style={{display:"flex", justifyContent:"space-between", gap:10}}><button onClick={() => li > 0 && setLi(p => p-1)} disabled={li === 0} style={{fontSize:12}}><i className="ti ti-arrow-left" style={{fontSize:13}} aria-hidden="true"/>Zurück</button>{li < mod.lessons.length - 1 ? <button onClick={() => setLi(p => p+1)} style={{background:MBG[col], color:MT[col], borderColor:MB[col], fontSize:12}}>Weiter <i className="ti ti-arrow-right" style={{fontSize:13}} aria-hidden="true"/></button> : <button onClick={goQuiz} style={{background:MBG[col], color:MT[col], borderColor:MB[col], fontSize:12}}><i className="ti ti-brain" style={{fontSize:13}} aria-hidden="true"/>Quiz starten</button>}</div></div>}{phase === "quiz" && <div><div style={{display:"flex", gap:5, marginBottom:12}}>{mod.quiz.map((_,i) => <div key={i} style={{flex:1, height:4, borderRadius:2, background: i < qi ? MB[col] : i === qi ? MB[col]+"66" : "var(--color-border-tertiary)"}}/>)}</div><Card style={{marginBottom:12}}><div style={{fontSize:11, color:"var(--color-text-secondary)", marginBottom:3}}>Frage {qi+1} von {mod.quiz.length} · <span style={{color:MB.amber, fontWeight:500}}>+50 XP</span></div><div style={{fontWeight:500, fontSize:14, color:"var(--color-text-primary)", marginBottom:16, lineHeight:1.55}}>{mod.quiz[qi].q}</div><div style={{display:"flex", flexDirection:"column", gap:8}}>{mod.quiz[qi].opts.map((opt,i) => {let bc = "var(--color-border-tertiary)"; let bg = "var(--color-background-primary)"; let tc = "var(--color-text-primary)"; if (reveal) {if (i === mod.quiz[qi].c) {bc=MB.teal; bg=MBG.teal; tc=MT.teal;} else if (i === picked && i !== mod.quiz[qi].c) {bc=MB.coral; bg=MBG.coral; tc=MT.coral;}} else if (picked === i) {bc = "var(--color-border-secondary)"; bg = "var(--color-background-secondary)";} const isCorrect = reveal && i === mod.quiz[qi].c; const isWrong = reveal && i === picked && i !== mod.quiz[qi].c; return <div key={i} onClick={() => onPick(i)} style={{padding:"10px 14px", borderRadius:"var(--border-radius-md)", border:`0.5px solid ${bc}`, background:bg, cursor: reveal ? "default" : "pointer", display:"flex", alignItems:"flex-start", gap:10, transition:"background 0.15s, border-color 0.15s"}}><div style={{width:18, height:18, borderRadius:9, flexShrink:0, marginTop:1, border:`0.5px solid ${bc}`, display:"flex", alignItems:"center", justifyContent:"center", background: isCorrect ? MB.teal : isWrong ? MB.coral : "transparent"}}>{isCorrect && <i className="ti ti-check" style={{fontSize:10, color:"#fff"}} aria-hidden="true"/>}{isWrong && <i className="ti ti-x" style={{fontSize:10, color:"#fff"}} aria-hidden="true"/>}</div><span style={{fontSize:12, color:tc, lineHeight:1.5}}>{opt}</span></div>;})}</div>{reveal && <div style={{marginTop:14, padding:"10px 12px", borderRadius:"var(--border-radius-md)", background:"var(--color-background-secondary)", borderLeft:`3px solid ${MB[col]}`}}><div style={{fontSize:10, fontWeight:500, color:"var(--color-text-secondary)", letterSpacing:"0.06em", marginBottom:4}}>ERKLÄRUNG</div><div style={{fontSize:12, color:"var(--color-text-primary)", lineHeight:1.65}}>{mod.quiz[qi].e}</div></div>}</Card>{reveal && <div style={{display:"flex", justifyContent:"flex-end"}}><button onClick={onNext} style={{background:MBG[col], color:MT[col], borderColor:MB[col], fontSize:12}}>{qi < mod.quiz.length - 1 ? "Nächste Frage" : "Ergebnis ansehen"}<i className="ti ti-arrow-right" style={{fontSize:13}} aria-hidden="true"/></button></div>}</div>}{phase === "result" && <Card style={{textAlign:"center"}}><div style={{width:56, height:56, borderRadius:28, background:MBG[col], display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px"}}><i className="ti ti-trophy" style={{fontSize:24, color:MB[col]}} aria-hidden="true"/></div><div style={{fontWeight:500, fontSize:16, color:"var(--color-text-primary)", marginBottom:4}}>Modul abgeschlossen!</div><div style={{color:"var(--color-text-secondary)", fontSize:13, marginBottom:20}}>{mod.title} – {qs}/{mod.quiz.length} richtige Antworten</div><div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:20}}><StatBox icon="ti-target" label="Quiz-Score" value={`${qs}/${mod.quiz.length}`} col={col}/><StatBox icon="ti-star" label="Modul-Bonus" value={`+${bonus}`} col={col}/><StatBox icon="ti-chart-bar" label="Gesamt-XP" value={xp} col={col}/></div>{qs === mod.quiz.length && <div style={{marginBottom:16, padding:"8px 12px", background:MBG.amber, border:`0.5px solid ${MB.amber}`, borderRadius:"var(--border-radius-md)", display:"inline-flex", alignItems:"center", gap:6}}><i className="ti ti-trophy" style={{fontSize:14, color:MB.amber}} aria-hidden="true"/><span style={{fontSize:12, color:MT.amber, fontWeight:500}}>Perfektes Quiz! +50 XP Bonus</span></div>}<div style={{display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap"}}><button onClick={() => { setLi(0); setPhase("lesson"); }} style={{fontSize:12}}><i className="ti ti-refresh" style={{fontSize:13}} aria-hidden="true"/>Wiederholen</button><button onClick={() => setNav("home")} style={{background:MBG[col], color:MT[col], borderColor:MB[col], fontSize:12}}><i className="ti ti-home" style={{fontSize:13}} aria-hidden="true"/>Dashboard</button></div></Card>}</div>}

      {nav === "achievements" && <div><div style={{fontSize:16, fontWeight:500, color:"var(--color-text-primary)", marginBottom:4}}>Achievements</div><div style={{fontSize:13, color:"var(--color-text-secondary)", marginBottom:14}}>{bdgs.size} von {BDGS.length} Badges freigeschaltet</div><div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))", gap:10, marginBottom:20}}>{BDGS.map(b => {const ok = bdgs.has(b.id); return <div key={b.id} style={{background:"var(--color-background-primary)", border: ok ? `2px solid ${MB[b.c]}` : "0.5px solid var(--color-border-tertiary)", borderRadius:"var(--border-radius-lg)", padding:"14px", textAlign:"center", opacity: ok ? 1 : 0.45}}><div style={{width:40, height:40, borderRadius:20, background: ok ? MBG[b.c] : "var(--color-background-secondary)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 8px"}}><i className={`ti ${b.icon}`} style={{fontSize:18, color: ok ? MB[b.c] : "var(--color-text-secondary)"}} aria-hidden="true"/></div><div style={{fontSize:12, fontWeight:500, color:"var(--color-text-primary)", marginBottom:2}}>{b.title}</div><div style={{fontSize:11, color:"var(--color-text-secondary)", marginBottom: ok ? 8 : 0}}>{b.desc}</div>{ok && <Pill c={b.c} small>Freigeschaltet</Pill>}</div>;})}</div><Card><div style={{fontWeight:500, fontSize:13, color:"var(--color-text-primary)", marginBottom:12}}>Level-Übersicht</div>{LEVELS.map((l,i) => {const reached = xp >= l.min; return <div key={i} style={{display:"flex", alignItems:"center", gap:10, marginBottom: i < LEVELS.length-1 ? 8 : 0, opacity: reached ? 1 : 0.4}}><div style={{width:8, height:8, borderRadius:4, background: reached ? MB.purple : "var(--color-border-tertiary)", flexShrink:0}}/><span style={{fontSize:12, fontWeight: reached ? 500 : 400, color:"var(--color-text-primary)", width:70}}>{l.label}</span><span style={{fontSize:11, color:"var(--color-text-secondary)"}}>ab {l.min} XP</span>{reached && <Pill c="purple" small><i className="ti ti-check" style={{fontSize:10}} aria-hidden="true"/>Erreicht</Pill>}</div>;})}</Card></div>}

      {nav === "cheatsheet" && cheat && <div><div style={{fontSize:16, fontWeight:500, color:"var(--color-text-primary)", marginBottom:4}}>Cheatsheet</div><div style={{fontSize:13, color:"var(--color-text-secondary)", marginBottom:14}}>Kompaktübersicht aller Prüfungsinhalte für Informatik Abi NRW 2027</div>{MODS.map((m,i) => {const c = MC[i]; return <div key={i} style={{marginBottom:12, background:"var(--color-background-primary)", border:"0.5px solid var(--color-border-tertiary)", borderRadius:"var(--border-radius-lg)", overflow:"hidden"}}><div style={{background:MBG[c], borderBottom:`0.5px solid ${MB[c]}`, padding:"8px 14px", display:"flex", alignItems:"center", gap:8}}><i className={`ti ${MI[i]}`} style={{fontSize:14, color:MB[c]}} aria-hidden="true"/><span style={{fontWeight:500, fontSize:13, color:MT[c]}}>{m.title}</span><span style={{fontSize:11, color:MT[c], opacity:0.7}}> – {m.sub}</span></div><div style={{padding:"12px 14px"}}>{m.lessons.map((l,j) => <div key={j} style={{marginBottom: j < m.lessons.length-1 ? 10 : 0}}><div style={{fontSize:12, fontWeight:500, color:"var(--color-text-primary)", marginBottom:4}}>{l.t}</div>{l.k.map((k,ki) => <div key={ki} style={{display:"flex", gap:6, marginBottom:2}}><i className="ti ti-chevron-right" style={{fontSize:10, color:MB[c], marginTop:2, flexShrink:0}} aria-hidden="true"/><span style={{fontSize:11, color:"var(--color-text-secondary)"}}>{k}</span></div>)}</div>)}</div></div>;})}{CHEAT_EXTRA.map((sec,si) => <div key={si} style={{marginBottom:12, background:"var(--color-background-primary)", border:"0.5px solid var(--color-border-tertiary)", borderRadius:"var(--border-radius-lg)", overflow:"hidden"}}><div style={{background:MBG.purple, borderBottom:`0.5px solid ${MB.purple}`, padding:"8px 14px"}}><span style={{fontWeight:500, fontSize:13, color:MT.purple}}>{sec.head}</span></div><div style={{padding:"12px 14px"}}>{sec.items.map((item,ii) => <div key={ii} style={{display:"flex", gap:6, marginBottom: ii < sec.items.length-1 ? 5 : 0}}><i className="ti ti-chevron-right" style={{fontSize:10, color:MB.purple, marginTop:3, flexShrink:0}} aria-hidden="true"/><span style={{fontSize:12, color:"var(--color-text-primary)", lineHeight:1.5}}>{item}</span></div>)}</div></div>)}</div>}
    </div>
  );
}
