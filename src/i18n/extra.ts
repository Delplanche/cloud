import type { Locale } from "./config";

export type FaqItem = { q: string; a: string };
export type FaqGroup = { index: string; title: string; lead: string; items: FaqItem[] };

export type ExtraDict = {
  nav: { faq: string; gateway: string };
  faq: {
    metaTitle: string;
    metaDescription: string;
    index: string;
    title: string;
    lead: string;
    groups: FaqGroup[];
    ctaIndex: string;
    ctaTitle: string;
    ctaLead: string;
    ctaLabel: string;
  };
  gateway: {
    metaTitle: string;
    metaDescription: string;
    index: string;
    title: string;
    lead: string;
    hubIndex: string;
    hubTitle: string;
    hubLead: string;
    links: {
      code: string;
      title: string;
      body: string;
      label: string;
      href: string;
      external: boolean;
      status: string;
    }[];
    noteIndex: string;
    noteTitle: string;
    note: string;
    contactLabel: string;
  };
  flow: {
    index: string;
    title: string;
    lead: string;
    marker: string;
    hint: string;
    steps: {
      code: string;
      title: string;
      place: string;
      summary: string;
      specs: [string, string][];
    }[];
  };
};

const en: ExtraDict = {
  nav: { faq: "FAQ", gateway: "Gateway" },
  faq: {
    metaTitle: "FAQ & Migration Guide — Delplanche Infrastructure Desk",
    metaDescription:
      "Technical answers on migration timelines, DNS and MX cutovers, Swiss data residency and leaving Google Workspace or Microsoft 365.",
    index: "// MIGRATION PROTOCOL",
    title: "FAQ & Migration Guide",
    lead: "Everything a technical team needs before moving workloads to sovereign Swiss infrastructure.",
    groups: [
      {
        index: "A / Timelines",
        title: "Migration timelines & SLAs",
        lead: "Indicative windows per workload class, confirmed after the intake audit.",
        items: [
          {
            q: "How long does a mail or workspace migration take?",
            a: "1–3 working days for most teams. Up to 25 mailboxes usually complete within one working day; 25–250 mailboxes take two to three days depending on archive volume (IMAP sync runs in parallel, so mail stays reachable throughout).",
          },
          {
            q: "How fast is a Cloud VPS node deployed?",
            a: "Under 48 hours from signed spec sheet to handover: node provisioning, hardened base image, firewall policy, monitoring agent and encrypted backup schedule.",
          },
          {
            q: "What response SLA applies after handover?",
            a: "Business-hours response within 4 hours, critical incidents (unreachable production) within 1 hour. Infrastructure-level SLAs remain those of Infomaniak's Swiss data centres.",
          },
        ],
      },
      {
        index: "B / DNS + MX",
        title: "DNS & MX record switch",
        lead: "Zero-downtime routing, executed as a controlled cutover.",
        items: [
          {
            q: "How do you avoid downtime during the cutover?",
            a: "Destination mailboxes and web nodes are fully synced and tested before any public record changes. Only then do MX, A/AAAA and CNAME records switch, with a delta sync afterwards to catch mail delivered during propagation.",
          },
          {
            q: "How are TTLs handled?",
            a: "TTL is lowered to 300 seconds 24–48 hours before the cutover so propagation is near-instant, then raised back to 3600 seconds once the new records are verified.",
          },
          {
            q: "Who manages SPF, DKIM and DMARC?",
            a: "We do. SPF is rewritten for the new sending infrastructure, DKIM keys are published before the switch, and DMARC starts at p=none with reporting, moving to quarantine and reject once alignment is clean.",
          },
        ],
      },
      {
        index: "C / Residency",
        title: "Data residency & privacy",
        lead: "Swiss jurisdiction, FADP compliance, zero-logging architecture.",
        items: [
          {
            q: "Where is the data physically stored?",
            a: "In Infomaniak's own data centres in Switzerland (Geneva region). No replication to US or Asian regions, no third-party subprocessor holding a copy.",
          },
          {
            q: "Why does Swiss jurisdiction matter?",
            a: "Swiss providers fall under the revised FADP/DSG, not the US CLOUD Act. Foreign authorities must go through mutual legal assistance, which is judicially reviewed in Switzerland instead of served directly on the provider.",
          },
          {
            q: "What does zero-logging mean in practice?",
            a: "No analytics scripts, no marketing pixels, no visitor profiling. Operational server logs stay within Swiss/EU jurisdiction and are retained only briefly for security and troubleshooting.",
          },
        ],
      },
      {
        index: "D / Big Tech exit",
        title: "Leaving Google Workspace or Microsoft 365",
        lead: "A practical, reversible exit path.",
        items: [
          {
            q: "How do we move off Google Workspace?",
            a: "Export via Google Takeout or direct IMAP sync into kSuite mail, Drive content into kDrive with folder structure preserved, contacts and calendars via CardDAV/ICS. Old accounts remain read-only for 30 days as a fallback.",
          },
          {
            q: "And Microsoft 365?",
            a: "Exchange mailboxes migrate over IMAP or PST import, SharePoint/OneDrive libraries sync into kDrive, and Teams channels are replaced by kMeet plus a shared kDrive structure or a self-hosted Matrix channel.",
          },
          {
            q: "What happens to documents in proprietary formats?",
            a: "kSuite handles Office formats natively, so .docx, .xlsx and .pptx keep working. Where conversion is needed, we run a batch pass and report anything that needs manual review.",
          },
        ],
      },
    ],
    ctaIndex: "E / Handoff",
    ctaTitle: "Start a managed migration",
    ctaLead:
      "Send the current setup — mailbox count, domains, workloads — and you receive a migration plan with a fixed window.",
    ctaLabel: "Secure contact",
  },
  gateway: {
    metaTitle: "Client Gateway — Delplanche Infrastructure Desk",
    metaDescription:
      "Static access hub for existing Delplanche clients: infrastructure panel, communication hub, documentation and the infrastructure desk.",
    index: "// ACCESS HUB",
    title: "Client Gateway",
    lead: "A static launch board for existing clients. No login here — authentication happens on the destination platforms.",
    hubIndex: "A / Endpoints",
    hubTitle: "Managed endpoints",
    hubLead: "Four entry points, each secured by the platform behind it.",
    links: [
      {
        code: "NODE / 01",
        title: "Infrastructure Panel",
        body: "Your managed Infomaniak dashboard: hosting, mail, VPS nodes, backups and invoices.",
        label: "Open panel",
        href: "https://manager.infomaniak.com",
        external: true,
        status: "[ SERVICE: ONLINE ]",
      },
      {
        code: "NODE / 02",
        title: "Communication Hub",
        body: "Secure webmail and the encrypted Matrix channel used for operational updates.",
        label: "Open webmail",
        href: "https://mail.infomaniak.com",
        external: true,
        status: "[ SERVICE: ONLINE ]",
      },
      {
        code: "NODE / 03",
        title: "Documentation & Migration",
        body: "Migration protocol, DNS cutover procedure, SLAs and residency documentation.",
        label: "Open knowledge base",
        href: "",
        external: false,
        status: "[ SERVICE: ONLINE ]",
      },
      {
        code: "NODE / 04",
        title: "Secure Contact",
        body: "Open a support ticket directly with the infrastructure desk.",
        label: "Open a ticket",
        href: "",
        external: false,
        status: "[ DESK: STAFFED ]",
      },
    ],
    noteIndex: "B / Security",
    noteTitle: "Security model",
    note: "This gateway stores nothing and authenticates no one. It holds no database, no session and no client data — every link routes to a platform that performs its own authentication and enforces its own jurisdiction.",
    contactLabel: "Secure contact",
  },
  flow: {
    index: "// DATAFLOW SCHEMA",
    title: "Sovereign data path",
    lead: "Three stages between your device and Swiss jurisdiction. Select a stage for technical detail.",
    marker: "[ PATH // ACTIVE ]",
    hint: "SECURE FLUX",
    steps: [
      {
        code: "STEP 01",
        title: "Client Endpoint",
        place: "Brussels, Belgium",
        summary: "Local client device. Zero-tracking initialisation, no analytics runtime.",
        specs: [
          ["Runtime", "No third-party scripts, no cookies, no fingerprinting"],
          ["Key material", "Device-local; private keys never leave the endpoint"],
          ["Legal basis", "GDPR — controller in the EU"],
        ],
      },
      {
        code: "STEP 02",
        title: "Sovereign Transit Layer",
        place: "EU ↔ CH backbone",
        summary: "End-to-end encryption, TLS 1.3 enforced, signed DNS, zero-logging nodes.",
        specs: [
          ["Transport", "TLS 1.3 only, HSTS preloaded, no downgrade path"],
          ["Resolution", "DNSSEC-signed zones, DoH/DoT resolvers"],
          ["Nodes", "Zero-logging transit, no payload inspection"],
        ],
      },
      {
        code: "STEP 03",
        title: "Swiss Jurisdiction Core",
        place: "Geneva, Switzerland",
        summary:
          "Infomaniak data centre. Physical security, FADP/DSG protection, US CLOUD Act immunity.",
        specs: [
          ["Storage", "AES-256 at rest, encrypted backups in Swiss vaults"],
          ["Facility", "Owned data centre, biometric access, ISO 27001 scope"],
          ["Legal basis", "Swiss FADP/DSG — outside US CLOUD Act reach"],
        ],
      },
    ],
  },
};

const nl: ExtraDict = {
  nav: { faq: "FAQ", gateway: "Gateway" },
  faq: {
    metaTitle: "FAQ & Migratiegids — Delplanche Infrastructure Desk",
    metaDescription:
      "Technische antwoorden over migratietermijnen, DNS- en MX-omschakeling, Zwitserse dataresidentie en het verlaten van Google Workspace of Microsoft 365.",
    index: "// MIGRATIEPROTOCOL",
    title: "FAQ & Migratiegids",
    lead: "Alles wat een technisch team nodig heeft vóór de overstap naar soevereine Zwitserse infrastructuur.",
    groups: [
      {
        index: "A / Termijnen",
        title: "Migratietermijnen & SLA's",
        lead: "Indicatieve vensters per type workload, bevestigd na de intake-audit.",
        items: [
          {
            q: "Hoelang duurt een mail- of workspace-migratie?",
            a: "1–3 werkdagen voor de meeste teams. Tot 25 mailboxen is doorgaans binnen één werkdag klaar; 25–250 mailboxen nemen twee tot drie dagen, afhankelijk van het archiefvolume (de IMAP-sync loopt parallel, dus mail blijft bereikbaar).",
          },
          {
            q: "Hoe snel staat een Cloud VPS-node klaar?",
            a: "Onder de 48 uur van getekende spec sheet tot oplevering: node-provisioning, gehard basis-image, firewallbeleid, monitoringagent en versleuteld back-upschema.",
          },
          {
            q: "Welke SLA geldt na oplevering?",
            a: "Reactie binnen 4 uur tijdens kantooruren, kritieke incidenten (productie onbereikbaar) binnen 1 uur. Op infrastructuurniveau gelden de SLA's van de Zwitserse datacenters van Infomaniak.",
          },
        ],
      },
      {
        index: "B / DNS + MX",
        title: "DNS- en MX-omschakeling",
        lead: "Routing zonder downtime, uitgevoerd als een gecontroleerde cutover.",
        items: [
          {
            q: "Hoe vermijden jullie downtime tijdens de omschakeling?",
            a: "Doelmailboxen en webnodes zijn volledig gesynchroniseerd en getest vóór er ook maar één publiek record wijzigt. Pas daarna schakelen MX-, A/AAAA- en CNAME-records om, met een delta-sync achteraf voor mail die tijdens de propagatie binnenkwam.",
          },
          {
            q: "Hoe gaan jullie om met TTL's?",
            a: "De TTL gaat 24–48 uur vóór de cutover naar 300 seconden zodat propagatie vrijwel onmiddellijk is, en daarna terug naar 3600 seconden zodra de nieuwe records geverifieerd zijn.",
          },
          {
            q: "Wie beheert SPF, DKIM en DMARC?",
            a: "Wij. SPF wordt herschreven voor de nieuwe verzendinfrastructuur, DKIM-sleutels worden vóór de switch gepubliceerd, en DMARC start op p=none met rapportage en gaat daarna naar quarantine en reject.",
          },
        ],
      },
      {
        index: "C / Residentie",
        title: "Dataresidentie & privacy",
        lead: "Zwitserse jurisdictie, FADP-conformiteit, zero-logging architectuur.",
        items: [
          {
            q: "Waar staat de data fysiek?",
            a: "In de eigen datacenters van Infomaniak in Zwitserland (regio Genève). Geen replicatie naar VS- of Aziatische regio's, geen derde partij die een kopie bewaart.",
          },
          {
            q: "Waarom is Zwitserse jurisdictie belangrijk?",
            a: "Zwitserse aanbieders vallen onder de herziene FADP/DSG, niet onder de Amerikaanse CLOUD Act. Buitenlandse overheden moeten via rechtshulp, die in Zwitserland rechterlijk getoetst wordt in plaats van rechtstreeks bij de provider te belanden.",
          },
          {
            q: "Wat betekent zero-logging concreet?",
            a: "Geen analytics-scripts, geen marketingpixels, geen bezoekersprofielen. Operationele serverlogs blijven binnen Zwitserse/EU-jurisdictie en worden slechts kort bewaard voor beveiliging en probleemoplossing.",
          },
        ],
      },
      {
        index: "D / Big Tech-exit",
        title: "Weg van Google Workspace of Microsoft 365",
        lead: "Een praktisch en omkeerbaar exitpad.",
        items: [
          {
            q: "Hoe stappen we weg van Google Workspace?",
            a: "Export via Google Takeout of directe IMAP-sync naar kSuite-mail, Drive-inhoud naar kDrive met behoud van mappenstructuur, contacten en agenda's via CardDAV/ICS. De oude accounts blijven 30 dagen read-only als terugvaloptie.",
          },
          {
            q: "En Microsoft 365?",
            a: "Exchange-mailboxen migreren via IMAP of PST-import, SharePoint/OneDrive-bibliotheken syncen naar kDrive, en Teams-kanalen worden vervangen door kMeet plus een gedeelde kDrive-structuur of een zelfgehost Matrix-kanaal.",
          },
          {
            q: "Wat met documenten in propriëtaire formaten?",
            a: "kSuite werkt native met Office-formaten, dus .docx, .xlsx en .pptx blijven werken. Waar conversie nodig is, draaien we een batch en rapporteren we alles dat manuele controle vraagt.",
          },
        ],
      },
    ],
    ctaIndex: "E / Overdracht",
    ctaTitle: "Start een beheerde migratie",
    ctaLead:
      "Stuur de huidige situatie door — aantal mailboxen, domeinen, workloads — en je krijgt een migratieplan met een vast venster.",
    ctaLabel: "Beveiligd contact",
  },
  gateway: {
    metaTitle: "Client Gateway — Delplanche Infrastructure Desk",
    metaDescription:
      "Statische toegangshub voor bestaande klanten: infrastructuurpaneel, communicatiehub, documentatie en de infrastructure desk.",
    index: "// ACCESS HUB",
    title: "Client Gateway",
    lead: "Een statisch startbord voor bestaande klanten. Geen login hier — authenticatie gebeurt op de bestemmingsplatformen.",
    hubIndex: "A / Endpoints",
    hubTitle: "Beheerde endpoints",
    hubLead: "Vier toegangspunten, elk beveiligd door het platform erachter.",
    links: [
      {
        code: "NODE / 01",
        title: "Infrastructuurpaneel",
        body: "Jouw beheerde Infomaniak-dashboard: hosting, mail, VPS-nodes, back-ups en facturen.",
        label: "Paneel openen",
        href: "https://manager.infomaniak.com",
        external: true,
        status: "[ SERVICE: ONLINE ]",
      },
      {
        code: "NODE / 02",
        title: "Communicatiehub",
        body: "Beveiligde webmail en het versleutelde Matrix-kanaal voor operationele updates.",
        label: "Webmail openen",
        href: "https://mail.infomaniak.com",
        external: true,
        status: "[ SERVICE: ONLINE ]",
      },
      {
        code: "NODE / 03",
        title: "Documentatie & migratie",
        body: "Migratieprotocol, DNS-cutoverprocedure, SLA's en documentatie over dataresidentie.",
        label: "Kennisbank openen",
        href: "",
        external: false,
        status: "[ SERVICE: ONLINE ]",
      },
      {
        code: "NODE / 04",
        title: "Beveiligd contact",
        body: "Open rechtstreeks een ticket bij de infrastructure desk.",
        label: "Ticket openen",
        href: "",
        external: false,
        status: "[ DESK: BEMAND ]",
      },
    ],
    noteIndex: "B / Beveiliging",
    noteTitle: "Beveiligingsmodel",
    note: "Deze gateway bewaart niets en authenticeert niemand. Geen database, geen sessie, geen klantdata — elke link gaat naar een platform dat zelf authenticeert en zijn eigen jurisdictie afdwingt.",
    contactLabel: "Beveiligd contact",
  },
  flow: {
    index: "// DATAFLOW SCHEMA",
    title: "Soeverein datapad",
    lead: "Drie fasen tussen jouw toestel en de Zwitserse jurisdictie. Selecteer een fase voor technische details.",
    marker: "[ PATH // ACTIVE ]",
    hint: "SECURE FLUX",
    steps: [
      {
        code: "STAP 01",
        title: "Client endpoint",
        place: "Brussel, België",
        summary: "Lokaal clienttoestel. Zero-tracking initialisatie, geen analytics-runtime.",
        specs: [
          ["Runtime", "Geen scripts van derden, geen cookies, geen fingerprinting"],
          [
            "Sleutelmateriaal",
            "Lokaal op het toestel; private sleutels verlaten het endpoint nooit",
          ],
          ["Rechtsgrond", "AVG — verwerkingsverantwoordelijke in de EU"],
        ],
      },
      {
        code: "STAP 02",
        title: "Soevereine transitlaag",
        place: "EU ↔ CH-backbone",
        summary: "End-to-end encryptie, TLS 1.3 afgedwongen, ondertekende DNS, zero-logging nodes.",
        specs: [
          ["Transport", "Enkel TLS 1.3, HSTS preloaded, geen downgradepad"],
          ["Resolutie", "DNSSEC-ondertekende zones, DoH/DoT-resolvers"],
          ["Nodes", "Zero-logging transit, geen payload-inspectie"],
        ],
      },
      {
        code: "STAP 03",
        title: "Zwitserse jurisdictiekern",
        place: "Genève, Zwitserland",
        summary:
          "Infomaniak-datacenter. Fysieke beveiliging, FADP/DSG-bescherming, immuun voor de US CLOUD Act.",
        specs: [
          ["Opslag", "AES-256 at rest, versleutelde back-ups in Zwitserse kluizen"],
          ["Faciliteit", "Eigen datacenter, biometrische toegang, ISO 27001-scope"],
          ["Rechtsgrond", "Zwitserse FADP/DSG — buiten het bereik van de US CLOUD Act"],
        ],
      },
    ],
  },
};

const fr: ExtraDict = {
  nav: { faq: "FAQ", gateway: "Gateway" },
  faq: {
    metaTitle: "FAQ & guide de migration — Delplanche Infrastructure Desk",
    metaDescription:
      "Réponses techniques sur les délais de migration, la bascule DNS/MX, la résidence des données en Suisse et la sortie de Google Workspace ou Microsoft 365.",
    index: "// PROTOCOLE DE MIGRATION",
    title: "FAQ & guide de migration",
    lead: "Tout ce qu'une équipe technique doit savoir avant de basculer vers une infrastructure suisse souveraine.",
    groups: [
      {
        index: "A / Délais",
        title: "Délais de migration & SLA",
        lead: "Fenêtres indicatives par type de charge, confirmées après l'audit d'entrée.",
        items: [
          {
            q: "Combien de temps prend une migration mail ou workspace ?",
            a: "1 à 3 jours ouvrés pour la plupart des équipes. Jusqu'à 25 boîtes : généralement un jour ouvré ; de 25 à 250 boîtes : deux à trois jours selon le volume d'archives (la synchronisation IMAP tourne en parallèle, le courrier reste accessible).",
          },
          {
            q: "En combien de temps un nœud Cloud VPS est-il déployé ?",
            a: "Moins de 48 heures entre la fiche technique signée et la remise : provisionnement, image durcie, politique de pare-feu, agent de supervision et sauvegardes chiffrées.",
          },
          {
            q: "Quel SLA s'applique après la remise ?",
            a: "Réponse sous 4 heures en heures ouvrables, incidents critiques (production injoignable) sous 1 heure. Au niveau infrastructure, les SLA des centres de données suisses d'Infomaniak s'appliquent.",
          },
        ],
      },
      {
        index: "B / DNS + MX",
        title: "Bascule DNS & MX",
        lead: "Routage sans interruption, exécuté comme une bascule contrôlée.",
        items: [
          {
            q: "Comment évitez-vous toute interruption ?",
            a: "Les boîtes et nœuds web de destination sont entièrement synchronisés et testés avant toute modification publique. Ensuite seulement les enregistrements MX, A/AAAA et CNAME basculent, avec une synchronisation delta après coup.",
          },
          {
            q: "Comment gérez-vous les TTL ?",
            a: "Le TTL passe à 300 secondes 24 à 48 heures avant la bascule pour une propagation quasi immédiate, puis revient à 3600 secondes une fois les nouveaux enregistrements vérifiés.",
          },
          {
            q: "Qui gère SPF, DKIM et DMARC ?",
            a: "Nous. SPF est réécrit pour la nouvelle infrastructure d'envoi, les clés DKIM sont publiées avant la bascule, et DMARC démarre en p=none avec rapports avant de passer en quarantine puis reject.",
          },
        ],
      },
      {
        index: "C / Résidence",
        title: "Résidence des données & vie privée",
        lead: "Juridiction suisse, conformité LPD/FADP, architecture zero-logging.",
        items: [
          {
            q: "Où les données sont-elles physiquement stockées ?",
            a: "Dans les centres de données propres d'Infomaniak en Suisse (région genevoise). Aucune réplication vers les États-Unis ou l'Asie, aucun sous-traitant tiers détenant une copie.",
          },
          {
            q: "Pourquoi la juridiction suisse compte-t-elle ?",
            a: "Les prestataires suisses relèvent de la LPD/FADP révisée, pas du CLOUD Act américain. Les autorités étrangères doivent passer par l'entraide judiciaire, contrôlée par un juge suisse.",
          },
          {
            q: "Que signifie zero-logging concrètement ?",
            a: "Aucun script d'analyse, aucun pixel marketing, aucun profilage. Les journaux serveurs opérationnels restent en juridiction suisse/UE et sont conservés brièvement, pour la sécurité et le diagnostic.",
          },
        ],
      },
      {
        index: "D / Sortie Big Tech",
        title: "Quitter Google Workspace ou Microsoft 365",
        lead: "Un chemin de sortie pratique et réversible.",
        items: [
          {
            q: "Comment quitter Google Workspace ?",
            a: "Export via Google Takeout ou synchronisation IMAP directe vers kSuite Mail, contenus Drive vers kDrive en conservant l'arborescence, contacts et agendas via CardDAV/ICS. Les anciens comptes restent en lecture seule 30 jours.",
          },
          {
            q: "Et Microsoft 365 ?",
            a: "Les boîtes Exchange migrent en IMAP ou par import PST, les bibliothèques SharePoint/OneDrive se synchronisent vers kDrive, et les canaux Teams sont remplacés par kMeet plus une structure kDrive partagée ou un canal Matrix auto-hébergé.",
          },
          {
            q: "Et les documents en formats propriétaires ?",
            a: "kSuite gère nativement les formats Office : .docx, .xlsx et .pptx continuent de fonctionner. Si une conversion est nécessaire, nous la traitons par lot et signalons ce qui demande une revue manuelle.",
          },
        ],
      },
    ],
    ctaIndex: "E / Transfert",
    ctaTitle: "Lancer une migration gérée",
    ctaLead:
      "Envoyez la situation actuelle — nombre de boîtes, domaines, charges — et vous recevez un plan de migration avec une fenêtre fixe.",
    ctaLabel: "Contact sécurisé",
  },
  gateway: {
    metaTitle: "Client Gateway — Delplanche Infrastructure Desk",
    metaDescription:
      "Hub d'accès statique pour les clients existants : panneau d'infrastructure, hub de communication, documentation et infrastructure desk.",
    index: "// ACCESS HUB",
    title: "Client Gateway",
    lead: "Un tableau de lancement statique pour les clients existants. Pas de login ici — l'authentification se fait sur les plateformes de destination.",
    hubIndex: "A / Endpoints",
    hubTitle: "Endpoints gérés",
    hubLead: "Quatre points d'entrée, chacun sécurisé par la plateforme qui se trouve derrière.",
    links: [
      {
        code: "NODE / 01",
        title: "Panneau d'infrastructure",
        body: "Votre tableau de bord Infomaniak géré : hébergement, mail, nœuds VPS, sauvegardes et factures.",
        label: "Ouvrir le panneau",
        href: "https://manager.infomaniak.com",
        external: true,
        status: "[ SERVICE: ONLINE ]",
      },
      {
        code: "NODE / 02",
        title: "Hub de communication",
        body: "Webmail sécurisé et canal Matrix chiffré pour les mises à jour opérationnelles.",
        label: "Ouvrir le webmail",
        href: "https://mail.infomaniak.com",
        external: true,
        status: "[ SERVICE: ONLINE ]",
      },
      {
        code: "NODE / 03",
        title: "Documentation & migration",
        body: "Protocole de migration, procédure de bascule DNS, SLA et documentation de résidence.",
        label: "Ouvrir la base de connaissances",
        href: "",
        external: false,
        status: "[ SERVICE: ONLINE ]",
      },
      {
        code: "NODE / 04",
        title: "Contact sécurisé",
        body: "Ouvrez directement un ticket auprès de l'infrastructure desk.",
        label: "Ouvrir un ticket",
        href: "",
        external: false,
        status: "[ DESK: STAFFED ]",
      },
    ],
    noteIndex: "B / Sécurité",
    noteTitle: "Modèle de sécurité",
    note: "Cette gateway ne stocke rien et n'authentifie personne. Aucune base de données, aucune session, aucune donnée client — chaque lien mène à une plateforme qui gère sa propre authentification et sa propre juridiction.",
    contactLabel: "Contact sécurisé",
  },
  flow: {
    index: "// SCHÉMA DE FLUX",
    title: "Chemin de données souverain",
    lead: "Trois étapes entre votre appareil et la juridiction suisse. Sélectionnez une étape pour les détails techniques.",
    marker: "[ PATH // ACTIVE ]",
    hint: "SECURE FLUX",
    steps: [
      {
        code: "ÉTAPE 01",
        title: "Endpoint client",
        place: "Bruxelles, Belgique",
        summary: "Appareil client local. Initialisation zero-tracking, aucun runtime d'analyse.",
        specs: [
          ["Runtime", "Aucun script tiers, aucun cookie, aucun fingerprinting"],
          ["Clés", "Locales à l'appareil ; les clés privées ne quittent jamais l'endpoint"],
          ["Base légale", "RGPD — responsable de traitement dans l'UE"],
        ],
      },
      {
        code: "ÉTAPE 02",
        title: "Couche de transit souveraine",
        place: "Dorsale UE ↔ CH",
        summary: "Chiffrement de bout en bout, TLS 1.3 imposé, DNS signé, nœuds zero-logging.",
        specs: [
          ["Transport", "TLS 1.3 uniquement, HSTS preload, aucun downgrade"],
          ["Résolution", "Zones signées DNSSEC, résolveurs DoH/DoT"],
          ["Nœuds", "Transit sans journalisation, aucune inspection de payload"],
        ],
      },
      {
        code: "ÉTAPE 03",
        title: "Cœur de juridiction suisse",
        place: "Genève, Suisse",
        summary:
          "Centre de données Infomaniak. Sécurité physique, protection LPD/DSG, immunité au CLOUD Act.",
        specs: [
          ["Stockage", "AES-256 au repos, sauvegardes chiffrées en coffres suisses"],
          ["Site", "Centre de données en propre, accès biométrique, périmètre ISO 27001"],
          ["Base légale", "LPD/DSG suisse — hors de portée du CLOUD Act américain"],
        ],
      },
    ],
  },
};

export const extraDictionaries: Record<Locale, ExtraDict> = { en, nl, fr };

export function getExtraDict(locale: Locale): ExtraDict {
  return extraDictionaries[locale] ?? en;
}
