import { INFOMANIAK_LINKS } from "@/config/affiliates";

/** Geautoriseerde Infomaniak-partnerlinks (utm_term = partner-ID). */
export const AFFILIATE_LINKS = {
  home: INFOMANIAK_LINKS.homepage,
  hosting: INFOMANIAK_LINKS.webHosting,
  mail: INFOMANIAK_LINKS.emailHosting,
  managedcloud: "https://www.infomaniak.com/goto/en/hosting.managed-cloud?utm_term=6a860a2ed3933",
  synology: "https://www.infomaniak.com/goto/en/hosting.synology?utm_term=6a860a2ed3933",
  wordpress: INFOMANIAK_LINKS.wordpress,
  kdrive: INFOMANIAK_LINKS.kDrive,
  swissbackup: INFOMANIAK_LINKS.swissBackup,
  jelastic: INFOMANIAK_LINKS.jelastic,
  publiccloud: INFOMANIAK_LINKS.publicCloud,
  ksuite: INFOMANIAK_LINKS.kSuite,
  ai: "https://www.infomaniak.com/en/hosting/llm-api?utm_term=6a860a2ed3933",
  vps: INFOMANIAK_LINKS.cloudVps,
  vpslite: INFOMANIAK_LINKS.vpsLite,
  sitecreator: "https://www.infomaniak.com/en/create-a-website/site-creator?utm_term=6a860a2ed3933",
  myksuite: INFOMANIAK_LINKS.myKSuite,
} as const;

export type AffiliateKey = keyof typeof AFFILIATE_LINKS;

export function isAffiliateKey(value: string): value is AffiliateKey {
  return Object.prototype.hasOwnProperty.call(AFFILIATE_LINKS, value);
}

export { externalLinkProps } from "@/config/affiliates";
export { INFOMANIAK_LINKS };
