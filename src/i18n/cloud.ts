import type { AffiliateKey } from "@/lib/affiliate";
import type { Locale } from "./config";

export const cloudTargets = ["hosting", "vps", "ksuite", "storage"] as const;
export type CloudTarget = (typeof cloudTargets)[number];

export function isCloudTarget(value: string): value is CloudTarget {
  return (cloudTargets as readonly string[]).includes(value);
}

export type CloudPlan = {
  name: string;
  price: string;
  unit: string;
  specs: string[];
  link: AffiliateKey;
  featured?: boolean;
};

export type CloudEntry = {
  index: string;
  title: string;
  lead: string;
  metaTitle: string;
  metaDescription: string;
  signupLabel: string;
  signupLink: AffiliateKey;
  plans: CloudPlan[];
  team: [string, string][];
  techSpecs?: [string, string][];
};

export type CloudDict = {
  labels: {
    pricingIndex: string;
    pricingTitle: string;
    teamIndex: string;
    teamTitle: string;
    teamLead: string;
    viewAt: string;
    disclaimer: string;
    techIndex: string;
    techTitle: string;
    techLead: string;
    turnkey: string;
    backToStack: string;
    notFoundTitle: string;
    notFoundLead: string;
  };
  targets: Record<CloudTarget, CloudEntry>;
};

const en: CloudDict = {
  labels: {
    pricingIndex: "A / Pricing",
    pricingTitle: "Current Infomaniak rates",
    teamIndex: "B / Onboarding Team",
    teamTitle: "Onboarding team & guidance",
    teamLead: "You sign up with Infomaniak; Delplanche handles the technical setup.",
    viewAt: "View at Infomaniak",
    techIndex: "SPEC / Systems",
    techTitle: "Technical specification sheet",
    techLead: "Network, storage and platform details for sysadmins and developers.",
    disclaimer:
      "All prices are starting rates based on annual billing: indicative public Infomaniak list prices (EUR (€), excl. VAT, converted from Infomaniak list rates) that may change. The current price is always shown on infomaniak.com. Delplanche may receive a commission through these authorised links — at no extra cost to you.",
    turnkey: "Turn-key setup",
    backToStack: "Back to the stack overview",
    notFoundTitle: "Unknown routing key",
    notFoundLead: "This stack does not exist. Review the curated pillars on the stack page.",
  },
  targets: {
    hosting: {
      index: "CLOUD / 01",
      title: "Managed Web Hosting & Mail — Infomaniak",
      lead: "Swiss shared hosting with NVMe storage, free SSL and included mailboxes. The rates below are public Infomaniak list prices (indicative, excl. VAT, annual billing).",
      metaTitle: "Managed Web Hosting & Mail — delplanche.cloud",
      metaDescription:
        "Swiss web hosting and mail on Infomaniak: NVMe storage, free SSL, included mailboxes and full technical setup by Delplanche.",
      signupLabel: "Sign up for Infomaniak Web Hosting",
      signupLink: "hosting",
      plans: [
        {
          name: "Web Hosting — Starter",
          price: "from € 6.50",
          unit: "/ month",
          specs: [
            "1 website, 20 GB NVMe",
            "Free SSL (Let's Encrypt)",
            "Unmetered traffic",
            "Daily backups (30 days)",
          ],
          link: "hosting",
        },
        {
          name: "Web Hosting — Standard",
          price: "from € 12.90",
          unit: "/ month",
          specs: [
            "Unlimited websites",
            "250 GB NVMe storage",
            "PHP workers & Node.js support",
            "Free domain on annual plans",
          ],
          link: "hosting",
          featured: true,
        },
        {
          name: "kMail Service",
          price: "from € 1.75",
          unit: "/ mailbox / month",
          specs: [
            "Swiss mail infrastructure",
            "No scanning, no advertising",
            "IMAP/SMTP + webmail",
            "Antispam & antivirus included",
          ],
          link: "mail",
        },
      ],
      team: [
        ["Onboarding team", "Delplanche Infrastructure Desk"],
        ["Role", "Technical administrator on your Infomaniak account"],
        ["Lead time", "< 24 hours after access is granted"],
        ["Included", "DNS, SSL, mail routing, web server configuration"],
      ],
    },
    vps: {
      index: "CLOUD / 02",
      title: "Cloud VPS & Bare-Metal — Infomaniak",
      lead: "Dedicated compute in Geneva with full root access. Public Infomaniak list prices, indicative and excl. VAT.",
      metaTitle: "Cloud VPS & Bare-Metal — delplanche.cloud",
      metaDescription:
        "Swiss Cloud VPS and bare-metal compute in Geneva: root access, snapshots, DDoS mitigation and hardening by Delplanche.",
      signupLabel: "Configure your Cloud VPS",
      signupLink: "vps",
      plans: [
        {
          name: "Cloud VPS — 2 vCPU",
          price: "from € 8.50",
          unit: "/ month",
          specs: [
            "2 vCPU / 4 GB RAM",
            "80 GB NVMe",
            "Root access, own distro",
            "Snapshots & backups",
          ],
          link: "vps",
        },
        {
          name: "Cloud VPS — 4 vCPU",
          price: "from € 21.50",
          unit: "/ month",
          specs: [
            "4 vCPU / 8 GB RAM",
            "160 GB NVMe",
            "Docker / Kubernetes-ready",
            "DDoS mitigation included",
          ],
          link: "vps",
          featured: true,
        },
        {
          name: "Public Cloud / Bare-Metal",
          price: "pay-per-use",
          unit: "from € 0.0099 / vCPU / h",
          specs: [
            "OpenStack API + Terraform provider",
            "Dedicated bare-metal, 1 Gbps uplink",
            "Scalable per hour",
            "100% renewable energy",
          ],
          link: "publiccloud",
        },
      ],
      team: [
        ["Onboarding team", "Delplanche Systems Engineering"],
        ["Role", "Provisioning, hardening & monitoring"],
        ["Lead time", "< 48 hours for a production-ready node"],
        ["Included", "Firewall, fail2ban, reverse proxy, TLS 1.3"],
      ],
      techSpecs: [
        ["Network", "1 Gbps port per node, unmetered traffic, IPv4 + IPv6 dual stack"],
        ["Storage", "Pure NVMe, high-IOPS (up to ~100k IOPS random read on 4 vCPU tiers)"],
        [
          "OS templates",
          "Ubuntu LTS, Debian, AlmaLinux, Rocky Linux, Fedora, Windows Server (BYOL)",
        ],
        ["Automation", "OpenStack-compatible API, Terraform provider, cloud-init on first boot"],
        ["Availability", "Geneva & Zurich datacentres, Tier III+, 100% renewable energy"],
        ["Protection", "Always-on DDoS mitigation, snapshots, off-site backup targets"],
      ],
    },
    ksuite: {
      index: "CLOUD / 03",
      title: "kSuite & Privacy Storage — Infomaniak",
      lead: "The sovereign alternative to Microsoft 365 and Google Workspace. Public Infomaniak list prices, indicative and excl. VAT.",
      metaTitle: "kSuite & Privacy Storage — delplanche.cloud",
      metaDescription:
        "Sovereign Swiss workspace: kMail, kDrive and kMeet under FADP jurisdiction, migrated and configured by Delplanche.",
      signupLabel: "Get started with kSuite",
      signupLink: "ksuite",
      plans: [
        {
          name: "kSuite Standard",
          price: "from € 2.80",
          unit: "/ user / month",
          specs: [
            "kMail, kDrive (cloud storage) & kChat",
            "kMeet video conferencing",
            "OnlyOffice document editing (docs, sheets, slides)",
            "1 TB shared storage, your own domain",
            "Swiss jurisdiction, no data mining",
          ],
          link: "ksuite",
          featured: true,
        },
        {
          name: "kDrive Solo / Team",
          price: "from € 4.95",
          unit: "/ month",
          specs: [
            "2 TB encrypted storage",
            "Desktop & mobile sync",
            "Version history",
            "No data mining",
          ],
          link: "kdrive",
        },
        {
          name: "my kSuite",
          price: "free",
          unit: "personal plan",
          specs: [
            "Swiss mailbox included",
            "15 GB kDrive storage",
            "No advertising, no profiling",
            "Upgrade path to kSuite",
          ],
          link: "myksuite",
        },
      ],
      team: [
        ["Onboarding team", "Delplanche Workspace Migration"],
        ["Role", "Migration of mailboxes, calendars and files"],
        ["Lead time", "1 – 3 working days depending on volume"],
        ["Included", "DNS/MX switch, user training, backup plan"],
      ],
    },
    storage: {
      index: "CLOUD / 04",
      title: "kDrive & Swiss Cloud Storage — Infomaniak",
      lead: "Encrypted Swiss storage and backup. Public Infomaniak list prices, indicative and excl. VAT.",
      metaTitle: "kDrive & Swiss Cloud Storage — delplanche.cloud",
      metaDescription:
        "Encrypted Swiss storage and backup: kDrive, Swiss Backup and Synology NAS, configured and validated by Delplanche.",
      signupLabel: "Get started with kDrive Storage",
      signupLink: "kdrive",
      plans: [
        {
          name: "kDrive Solo",
          price: "from € 4.95",
          unit: "/ month",
          specs: [
            "2 TB encrypted storage",
            "1 user",
            "Desktop & mobile sync",
            "30-day version history",
          ],
          link: "kdrive",
        },
        {
          name: "kDrive Team",
          price: "from € 9.60",
          unit: "/ month (3 users)",
          specs: [
            "3 TB shared storage",
            "Shared folders & permissions",
            "Real-time collaboration",
            "Swiss jurisdiction",
          ],
          link: "kdrive",
          featured: true,
        },
        {
          name: "Swiss Backup",
          price: "from € 1.10",
          unit: "/ 100 GB / month",
          specs: [
            "Server, NAS & device backup",
            "Acronis compatible",
            "Unlimited devices",
            "Data stored in Geneva",
          ],
          link: "swissbackup",
        },
      ],
      team: [
        ["Onboarding team", "Delplanche Data Stewardship"],
        ["Role", "Migration, retention policy & backup validation"],
        ["Lead time", "1 – 2 working days"],
        ["Included", "Sync configuration, permission matrix, restore test"],
      ],
    },
  },
};

const nl: CloudDict = {
  labels: {
    pricingIndex: "A / Tarieven",
    pricingTitle: "Actuele Infomaniak-tarieven",
    teamIndex: "B / Aanmeldingsteam",
    teamTitle: "Aanmeldingsteam & begeleiding",
    teamLead: "Je meldt aan bij Infomaniak; Delplanche voert de technische inrichting uit.",
    viewAt: "Bekijk bij Infomaniak",
    techIndex: "SPEC / Systems",
    techTitle: "Technische specificatiefiche",
    techLead: "Netwerk-, opslag- en platformdetails voor sysadmins en developers.",
    disclaimer:
      "Alle prijzen zijn startprijzen bij jaarfacturatie: indicatieve publieke lijstprijzen van Infomaniak (EUR (€), excl. btw, omgerekend van de Infomaniak-lijstprijzen) die kunnen wijzigen. De actuele prijs staat altijd op infomaniak.com. Delplanche kan een commissie ontvangen via deze geautoriseerde links — dit kost jou niets extra.",
    turnkey: "Turn-key setup",
    backToStack: "Terug naar het stack-overzicht",
    notFoundTitle: "Onbekende routingsleutel",
    notFoundLead: "Deze stack bestaat niet. Bekijk de gecureerde pijlers op de stackpagina.",
  },
  targets: {
    hosting: {
      index: "CLOUD / 01",
      title: "Managed Webhosting & Mail — Infomaniak",
      lead: "Zwitserse shared hosting met NVMe-storage, gratis SSL en inbegrepen mailboxen. Onderstaande tarieven zijn de publieke Infomaniak-lijstprijzen (indicatief, excl. btw, jaarfacturatie).",
      metaTitle: "Managed Webhosting & Mail — delplanche.cloud",
      metaDescription:
        "Zwitserse webhosting en mail via Infomaniak: NVMe-storage, gratis SSL, inbegrepen mailboxen en volledige technische inrichting door Delplanche.",
      signupLabel: "Aanmelden bij Infomaniak Webhosting",
      signupLink: "hosting",
      plans: [
        {
          name: "Web Hosting — Starter",
          price: "vanaf € 6.50",
          unit: "/ maand",
          specs: [
            "1 website, 20 GB NVMe",
            "Gratis SSL (Let's Encrypt)",
            "Onbeperkt dataverkeer",
            "Dagelijkse back-ups (30 dagen)",
          ],
          link: "hosting",
        },
        {
          name: "Web Hosting — Standard",
          price: "vanaf € 12.90",
          unit: "/ maand",
          specs: [
            "Onbeperkt aantal websites",
            "250 GB NVMe storage",
            "PHP-workers & Node.js-support",
            "Gratis domein bij jaarplan",
          ],
          link: "hosting",
          featured: true,
        },
        {
          name: "kMail Service",
          price: "vanaf € 1.75",
          unit: "/ mailbox / maand",
          specs: [
            "Zwitserse mailinfrastructuur",
            "Geen scanning, geen advertenties",
            "IMAP/SMTP + webmail",
            "Antispam & antivirus inbegrepen",
          ],
          link: "mail",
        },
      ],
      team: [
        ["Aanmeldingsteam", "Delplanche Infrastructure Desk"],
        ["Rol", "Technisch beheerder op jouw Infomaniak-account"],
        ["Doorlooptijd", "< 24 uur na toegangsverlening"],
        ["Inbegrepen", "DNS, SSL, mailrouting, webserverconfiguratie"],
      ],
    },
    vps: {
      index: "CLOUD / 02",
      title: "Cloud VPS & Bare-Metal — Infomaniak",
      lead: "Dedicated compute in Genève met volledige root-toegang. Publieke Infomaniak-lijstprijzen, indicatief en excl. btw.",
      metaTitle: "Cloud VPS & Bare-Metal — delplanche.cloud",
      metaDescription:
        "Zwitserse Cloud VPS en bare-metal compute in Genève: root-toegang, snapshots, DDoS-mitigatie en hardening door Delplanche.",
      signupLabel: "Configureer je Cloud VPS",
      signupLink: "vps",
      plans: [
        {
          name: "Cloud VPS — 2 vCPU",
          price: "vanaf € 8.50",
          unit: "/ maand",
          specs: [
            "2 vCPU / 4 GB RAM",
            "80 GB NVMe",
            "Root-toegang, eigen distro",
            "Snapshots & back-ups",
          ],
          link: "vps",
        },
        {
          name: "Cloud VPS — 4 vCPU",
          price: "vanaf € 21.50",
          unit: "/ maand",
          specs: [
            "4 vCPU / 8 GB RAM",
            "160 GB NVMe",
            "Docker / Kubernetes-ready",
            "DDoS-mitigatie inbegrepen",
          ],
          link: "vps",
          featured: true,
        },
        {
          name: "Public Cloud / Bare-Metal",
          price: "pay-per-use",
          unit: "vanaf € 0,0099 / vCPU / u",
          specs: [
            "OpenStack-compatibel",
            "Dedicated bare-metal opties",
            "Schaalbaar per uur",
            "100% hernieuwbare energie",
          ],
          link: "publiccloud",
        },
      ],
      team: [
        ["Aanmeldingsteam", "Delplanche Systems Engineering"],
        ["Rol", "Provisioning, hardening & monitoring"],
        ["Doorlooptijd", "< 48 uur voor een productieklare node"],
        ["Inbegrepen", "Firewall, fail2ban, reverse proxy, TLS 1.3"],
      ],
      techSpecs: [
        ["Netwerk", "1 Gbps-poort per node, ongelimiteerd verkeer, IPv4 + IPv6 dual stack"],
        ["Opslag", "Volledig NVMe, hoge IOPS (tot ~100k IOPS random read op de 4 vCPU-tiers)"],
        [
          "OS-templates",
          "Ubuntu LTS, Debian, AlmaLinux, Rocky Linux, Fedora, Windows Server (BYOL)",
        ],
        [
          "Automatisatie",
          "OpenStack-compatibele API, Terraform-provider, cloud-init bij eerste boot",
        ],
        ["Beschikbaarheid", "Datacenters Genève & Zürich, Tier III+, 100% hernieuwbare energie"],
        ["Bescherming", "Permanente DDoS-mitigatie, snapshots, off-site back-uptargets"],
      ],
    },
    ksuite: {
      index: "CLOUD / 03",
      title: "kSuite & Privacy Storage — Infomaniak",
      lead: "Het soevereine alternatief voor Microsoft 365 en Google Workspace. Publieke Infomaniak-lijstprijzen, indicatief en excl. btw.",
      metaTitle: "kSuite & Privacy Storage — delplanche.cloud",
      metaDescription:
        "Soevereine Zwitserse werkplek: kMail, kDrive en kMeet onder FADP-jurisdictie, gemigreerd en geconfigureerd door Delplanche.",
      signupLabel: "Start met kSuite",
      signupLink: "ksuite",
      plans: [
        {
          name: "kSuite Standard",
          price: "vanaf € 2.80",
          unit: "/ gebruiker / maand",
          specs: [
            "kMail, kDrive (cloudopslag) & kChat",
            "kMeet videovergaderen",
            "OnlyOffice documentbewerking (tekst, rekenblad, presentatie)",
            "1 TB gedeelde opslag, eigen domeinnaam",
            "Zwitserse jurisdictie, geen datamining",
          ],
          link: "ksuite",
          featured: true,
        },
        {
          name: "kDrive Solo / Team",
          price: "vanaf € 4.95",
          unit: "/ maand",
          specs: [
            "2 TB versleutelde opslag",
            "Desktop- & mobiele sync",
            "Versiebeheer",
            "Geen datamining",
          ],
          link: "kdrive",
        },
        {
          name: "my kSuite",
          price: "gratis",
          unit: "persoonlijk plan",
          specs: [
            "Zwitserse mailbox inbegrepen",
            "15 GB kDrive-opslag",
            "Geen advertenties, geen profilering",
            "Upgradepad naar kSuite",
          ],
          link: "myksuite",
        },
      ],
      team: [
        ["Aanmeldingsteam", "Delplanche Workspace Migration"],
        ["Rol", "Migratie van mailboxen, agenda's en bestanden"],
        ["Doorlooptijd", "1 – 3 werkdagen afhankelijk van volume"],
        ["Inbegrepen", "DNS/MX-switch, gebruikerstraining, back-upplan"],
      ],
    },
    storage: {
      index: "CLOUD / 04",
      title: "kDrive & Swiss Cloud Storage — Infomaniak",
      lead: "Versleutelde Zwitserse opslag en back-up. Publieke Infomaniak-lijstprijzen, indicatief en excl. btw.",
      metaTitle: "kDrive & Swiss Cloud Storage — delplanche.cloud",
      metaDescription:
        "Versleutelde Zwitserse opslag en back-up: kDrive, Swiss Backup en Synology NAS, geconfigureerd en gevalideerd door Delplanche.",
      signupLabel: "Start met kDrive Storage",
      signupLink: "kdrive",
      plans: [
        {
          name: "kDrive Solo",
          price: "vanaf € 4.95",
          unit: "/ maand",
          specs: [
            "2 TB versleutelde opslag",
            "1 gebruiker",
            "Desktop- & mobiele sync",
            "Versiebeheer 30 dagen",
          ],
          link: "kdrive",
        },
        {
          name: "kDrive Team",
          price: "vanaf € 9.60",
          unit: "/ maand (3 gebruikers)",
          specs: [
            "3 TB gedeelde opslag",
            "Gedeelde mappen & rechten",
            "Realtime samenwerking",
            "Zwitserse jurisdictie",
          ],
          link: "kdrive",
          featured: true,
        },
        {
          name: "Swiss Backup",
          price: "vanaf € 1.10",
          unit: "/ 100 GB / maand",
          specs: [
            "Server-, NAS- & device-back-up",
            "Acronis-compatibel",
            "Onbeperkt aantal toestellen",
            "Data in Genève",
          ],
          link: "swissbackup",
        },
      ],
      team: [
        ["Aanmeldingsteam", "Delplanche Data Stewardship"],
        ["Rol", "Migratie, retentiebeleid & back-upvalidatie"],
        ["Doorlooptijd", "1 – 2 werkdagen"],
        ["Inbegrepen", "Sync-configuratie, rechtenmatrix, herstel-test"],
      ],
    },
  },
};

const fr: CloudDict = {
  labels: {
    pricingIndex: "A / Tarifs",
    pricingTitle: "Tarifs Infomaniak actuels",
    teamIndex: "B / Équipe d'intégration",
    teamTitle: "Équipe d'intégration & accompagnement",
    teamLead: "Vous souscrivez chez Infomaniak ; Delplanche réalise la mise en œuvre technique.",
    viewAt: "Voir chez Infomaniak",
    techIndex: "SPEC / Systems",
    techTitle: "Fiche de spécifications techniques",
    techLead: "Détails réseau, stockage et plateforme pour sysadmins et développeurs.",
    disclaimer:
      "Tous les prix sont des tarifs de départ en facturation annuelle : prix publics indicatifs d'Infomaniak (EUR (€), hors TVA, convertis depuis les tarifs publics Infomaniak) susceptibles d'évoluer. Le prix actuel figure toujours sur infomaniak.com. Delplanche peut percevoir une commission via ces liens autorisés — sans coût supplémentaire pour vous.",
    turnkey: "Installation clé en main",
    backToStack: "Retour à l'aperçu de l'infrastructure",
    notFoundTitle: "Clé de routage inconnue",
    notFoundLead:
      "Cette configuration n'existe pas. Consultez les piliers sur la page infrastructure.",
  },
  targets: {
    hosting: {
      index: "CLOUD / 01",
      title: "Hébergement web & mail managé — Infomaniak",
      lead: "Hébergement mutualisé suisse avec stockage NVMe, SSL gratuit et boîtes mail incluses. Les tarifs ci-dessous sont les prix publics Infomaniak (indicatifs, hors TVA, facturation annuelle).",
      metaTitle: "Hébergement web & mail managé — delplanche.cloud",
      metaDescription:
        "Hébergement web et mail suisse chez Infomaniak : stockage NVMe, SSL gratuit, boîtes mail incluses et configuration technique complète par Delplanche.",
      signupLabel: "Souscrire à l'hébergement web Infomaniak",
      signupLink: "hosting",
      plans: [
        {
          name: "Web Hosting — Starter",
          price: "dès € 6.50",
          unit: "/ mois",
          specs: [
            "1 site web, 20 Go NVMe",
            "SSL gratuit (Let's Encrypt)",
            "Trafic illimité",
            "Sauvegardes quotidiennes (30 jours)",
          ],
          link: "hosting",
        },
        {
          name: "Web Hosting — Standard",
          price: "dès € 12.90",
          unit: "/ mois",
          specs: [
            "Sites web illimités",
            "250 Go de stockage NVMe",
            "Workers PHP & support Node.js",
            "Domaine offert en formule annuelle",
          ],
          link: "hosting",
          featured: true,
        },
        {
          name: "Service kMail",
          price: "dès € 1.75",
          unit: "/ boîte / mois",
          specs: [
            "Infrastructure mail suisse",
            "Aucune analyse, aucune publicité",
            "IMAP/SMTP + webmail",
            "Antispam & antivirus inclus",
          ],
          link: "mail",
        },
      ],
      team: [
        ["Équipe d'intégration", "Delplanche Infrastructure Desk"],
        ["Rôle", "Administrateur technique sur votre compte Infomaniak"],
        ["Délai", "< 24 heures après l'octroi des accès"],
        ["Inclus", "DNS, SSL, routage mail, configuration du serveur web"],
      ],
    },
    vps: {
      index: "CLOUD / 02",
      title: "Cloud VPS & bare-metal — Infomaniak",
      lead: "Puissance de calcul dédiée à Genève avec accès root complet. Prix publics Infomaniak, indicatifs et hors TVA.",
      metaTitle: "Cloud VPS & bare-metal — delplanche.cloud",
      metaDescription:
        "Cloud VPS et bare-metal suisses à Genève : accès root, snapshots, mitigation DDoS et durcissement par Delplanche.",
      signupLabel: "Configurez votre Cloud VPS",
      signupLink: "vps",
      plans: [
        {
          name: "Cloud VPS — 2 vCPU",
          price: "dès € 8.50",
          unit: "/ mois",
          specs: [
            "2 vCPU / 4 Go RAM",
            "80 Go NVMe",
            "Accès root, distro au choix",
            "Snapshots & sauvegardes",
          ],
          link: "vps",
        },
        {
          name: "Cloud VPS — 4 vCPU",
          price: "dès € 21.50",
          unit: "/ mois",
          specs: [
            "4 vCPU / 8 Go RAM",
            "160 Go NVMe",
            "Prêt pour Docker / Kubernetes",
            "Mitigation DDoS incluse",
          ],
          link: "vps",
          featured: true,
        },
        {
          name: "Public Cloud / bare-metal",
          price: "à l'usage",
          unit: "dès € 0,0099 / vCPU / h",
          specs: [
            "Compatible OpenStack",
            "Options bare-metal dédiées",
            "Évolutif à l'heure",
            "100 % énergie renouvelable",
          ],
          link: "publiccloud",
        },
      ],
      team: [
        ["Équipe d'intégration", "Delplanche Systems Engineering"],
        ["Rôle", "Provisioning, durcissement & supervision"],
        ["Délai", "< 48 heures pour un nœud prêt pour la production"],
        ["Inclus", "Pare-feu, fail2ban, reverse proxy, TLS 1.3"],
      ],
      techSpecs: [
        ["Réseau", "Port 1 Gbps par nœud, trafic illimité, double pile IPv4 + IPv6"],
        [
          "Stockage",
          "100 % NVMe, IOPS élevés (jusqu'à ~100k IOPS en lecture aléatoire sur les paliers 4 vCPU)",
        ],
        ["Modèles OS", "Ubuntu LTS, Debian, AlmaLinux, Rocky Linux, Fedora, Windows Server (BYOL)"],
        [
          "Automatisation",
          "API compatible OpenStack, provider Terraform, cloud-init au premier démarrage",
        ],
        ["Disponibilité", "Datacenters Genève & Zurich, Tier III+, 100 % énergie renouvelable"],
        ["Protection", "Mitigation DDoS permanente, snapshots, cibles de sauvegarde hors site"],
      ],
    },
    ksuite: {
      index: "CLOUD / 03",
      title: "kSuite & stockage privé — Infomaniak",
      lead: "L'alternative souveraine à Microsoft 365 et Google Workspace. Prix publics Infomaniak, indicatifs et hors TVA.",
      metaTitle: "kSuite & stockage privé — delplanche.cloud",
      metaDescription:
        "Espace de travail suisse souverain : kMail, kDrive et kMeet sous juridiction LPD, migrés et configurés par Delplanche.",
      signupLabel: "Démarrer avec kSuite",
      signupLink: "ksuite",
      plans: [
        {
          name: "kSuite Standard",
          price: "dès € 2.80",
          unit: "/ utilisateur / mois",
          specs: [
            "kMail, kDrive (stockage cloud) & kChat",
            "Visioconférence kMeet",
            "Édition de documents OnlyOffice (texte, tableur, présentation)",
            "1 To de stockage partagé, nom de domaine propre",
            "Juridiction suisse, aucune exploitation des données",
          ],
          link: "ksuite",
          featured: true,
        },
        {
          name: "kDrive Solo / Team",
          price: "dès € 4.95",
          unit: "/ mois",
          specs: [
            "2 To chiffrés",
            "Synchro desktop & mobile",
            "Historique de versions",
            "Aucune exploitation des données",
          ],
          link: "kdrive",
        },
        {
          name: "my kSuite",
          price: "gratuit",
          unit: "formule personnelle",
          specs: [
            "Boîte mail suisse incluse",
            "15 Go de stockage kDrive",
            "Sans publicité ni profilage",
            "Évolution vers kSuite",
          ],
          link: "myksuite",
        },
      ],
      team: [
        ["Équipe d'intégration", "Delplanche Workspace Migration"],
        ["Rôle", "Migration des boîtes mail, agendas et fichiers"],
        ["Délai", "1 à 3 jours ouvrés selon le volume"],
        ["Inclus", "Bascule DNS/MX, formation, plan de sauvegarde"],
      ],
    },
    storage: {
      index: "CLOUD / 04",
      title: "kDrive & stockage cloud suisse — Infomaniak",
      lead: "Stockage et sauvegarde suisses chiffrés. Prix publics Infomaniak, indicatifs et hors TVA.",
      metaTitle: "kDrive & stockage cloud suisse — delplanche.cloud",
      metaDescription:
        "Stockage et sauvegarde suisses chiffrés : kDrive, Swiss Backup et NAS Synology, configurés et validés par Delplanche.",
      signupLabel: "Démarrer avec kDrive Storage",
      signupLink: "kdrive",
      plans: [
        {
          name: "kDrive Solo",
          price: "dès € 4.95",
          unit: "/ mois",
          specs: [
            "2 To chiffrés",
            "1 utilisateur",
            "Synchro desktop & mobile",
            "Historique 30 jours",
          ],
          link: "kdrive",
        },
        {
          name: "kDrive Team",
          price: "dès € 9.60",
          unit: "/ mois (3 utilisateurs)",
          specs: [
            "3 To de stockage partagé",
            "Dossiers & droits partagés",
            "Collaboration en temps réel",
            "Juridiction suisse",
          ],
          link: "kdrive",
          featured: true,
        },
        {
          name: "Swiss Backup",
          price: "dès € 1.10",
          unit: "/ 100 Go / mois",
          specs: [
            "Sauvegarde serveurs, NAS & appareils",
            "Compatible Acronis",
            "Appareils illimités",
            "Données à Genève",
          ],
          link: "swissbackup",
        },
      ],
      team: [
        ["Équipe d'intégration", "Delplanche Data Stewardship"],
        ["Rôle", "Migration, politique de rétention & validation des sauvegardes"],
        ["Délai", "1 à 2 jours ouvrés"],
        ["Inclus", "Configuration de synchro, matrice de droits, test de restauration"],
      ],
    },
  },
};

export const cloudDictionaries: Record<Locale, CloudDict> = { en, nl, fr };

export function getCloudDict(locale: Locale): CloudDict {
  return cloudDictionaries[locale] ?? cloudDictionaries.en;
}
