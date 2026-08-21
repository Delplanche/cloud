/**
 * Centrale configuratie van alle officiële Infomaniak-partnerlinks.
 * Elke outbound link gebruikt target="_blank" + rel="noopener noreferrer nofollow sponsored".
 */
export const INFOMANIAK_LINKS = {
  webHosting: "https://www.infomaniak.com/goto/en/hosting.web?utm_term=6a860a2ed3933",
  emailHosting: "https://www.infomaniak.com/goto/en/hosting.mail?utm_term=6a860a2ed3933",
  cloudVps: "https://www.infomaniak.com/en/hosting/vps-cloud?utm_term=6a860a2ed3933",
  vpsLite: "https://www.infomaniak.com/en/hosting/vps-lite?utm_term=6a860a2ed3933",
  publicCloud: "https://www.infomaniak.com/en/hosting/public-cloud?utm_term=6a860a2ed3933",
  jelastic:
    "https://www.infomaniak.com/en/hosting/dedicated-and-cloud-servers/jelastic-cloud?utm_term=6a860a2ed3933",
  kSuite: "https://www.infomaniak.com/en/ksuite?utm_term=6a860a2ed3933",
  myKSuite: "https://www.infomaniak.com/en/ksuite/myksuite?utm_term=6a860a2ed3933",
  kDrive: "https://www.infomaniak.com/en/kdrive/?utm_term=6a860a2ed3933",
  swissBackup: "https://www.infomaniak.com/en/swiss-backup/?utm_term=6a860a2ed3933",
  wordpress: "https://www.infomaniak.com/goto/en/my-easy-site?utm_term=6a860a2ed3933",
  homepage: "https://www.infomaniak.com/goto/en/home?utm_term=6a860a2ed3933",
} as const;

export type InfomaniakLinkKey = keyof typeof INFOMANIAK_LINKS;

/** Beveiligde attributen voor elke externe affiliate-link. */
export const externalLinkProps = {
  target: "_blank",
  rel: "noopener noreferrer nofollow sponsored",
} as const;
