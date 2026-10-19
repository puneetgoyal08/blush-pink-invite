import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";

async function ipHash() {
  const ip =
    getRequestHeader("cf-connecting-ip") ||
    getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("np-wedding:" + ip));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

const rsvpSchema = z.object({
  name: z.string().trim().min(2).max(100),
  contact: z.string().trim().min(5).max(255),
  attending: z.boolean(),
  guests: z.number().int().min(0).max(10),
  events: z.array(z.string().max(40)).max(10),
  travel: z.string().trim().max(200).optional().default(""), // arrival day and mode
  message: z.string().trim().max(600).optional().default(""),
  website: z.string().max(0).optional().default(""), // honeypot
});

export const submitRsvp = createServerFn({ method: "POST" })
  .inputValidator((d) => rsvpSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const hash = await ipHash();
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from("rsvps").select("id", { count: "exact", head: true })
      .eq("ip_hash", hash).gte("updated_at", since);
    if ((count ?? 0) >= 8) return { ok: false as const, error: "Too many submissions — please try again later." };

    const contactKey = data.contact.toLowerCase().replace(/[^a-z0-9@.+]/g, "");
    const row = {
      name: data.name,
      contact: data.contact,
      contact_key: contactKey,
      attending: data.attending,
      guests: data.attending ? Math.max(1, data.guests) : 0,
      events: data.attending ? data.events : [],
      // No travel column yet, so travel plans are stored in the old dietary column.
      dietary: data.travel ? `Travel: ${data.travel}` : null,
      message: data.message || null,
      ip_hash: hash,
      updated_at: new Date().toISOString(),
    };
    const { data: existing } = await supabaseAdmin.from("rsvps").select("id").eq("contact_key", contactKey).maybeSingle();
    const { error } = await supabaseAdmin.from("rsvps").upsert(row, { onConflict: "contact_key" });
    if (error) {
      console.error("rsvp error", error);
      return { ok: false as const, error: "We couldn't save your RSVP. Please try again." };
    }
    return { ok: true as const, updated: !!existing };
  });

const wishSchema = z.object({
  name: z.string().trim().min(2).max(80),
  message: z.string().trim().min(3).max(300),
  website: z.string().max(0).optional().default(""),
});

export const submitWish = createServerFn({ method: "POST" })
  .inputValidator((d) => wishSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (/https?:\/\/|www\./i.test(data.message)) return { ok: false as const, error: "Links aren't allowed in wishes." };
    const hash = await ipHash();
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from("wishes").select("id", { count: "exact", head: true })
      .eq("ip_hash", hash).gte("created_at", since);
    if ((count ?? 0) >= 3) return { ok: false as const, error: "You've sent a few wishes already — thank you!" };
    const { error } = await supabaseAdmin.from("wishes").insert({ name: data.name, message: data.message, ip_hash: hash });
    if (error) {
      console.error("wish error", error);
      return { ok: false as const, error: "We couldn't send your wish. Please try again." };
    }
    return { ok: true as const };
  });
