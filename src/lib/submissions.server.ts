import { z } from "zod";

export const INBOX_ADDRESS = "core@delplanche.cloud";
export const DESK_ADDRESS = "desk@delplanche.cloud";

export const localeSchema = z.enum(["en", "nl", "fr"]).default("en");

export const infraRequestSchema = z.object({
  locale: localeSchema,
  org: z.string().min(2).max(200),
  domain: z.string().min(3).max(200),
  stack: z.enum(["webhosting", "vps", "ksuite", "custom"]),
  account: z.enum(["existing", "new"]),
  email: z.string().email().max(200),
  notes: z.string().max(4000).optional().or(z.literal("")),
  company: z.string().max(200).optional(),
});

export const contactMessageSchema = z.object({
  locale: localeSchema,
  name: z.string().min(2).max(200),
  email: z.string().email().max(200),
  subject: z.string().min(2).max(200),
  message: z.string().min(10).max(5000),
});

export function makeTicket() {
  return `DPC-${Math.floor(100000 + Math.random() * 899999)}`;
}
