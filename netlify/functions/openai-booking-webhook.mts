import { sql } from "drizzle-orm";
import { getDb } from "../../db/index";
import { privacyStore } from "../../lib/privacy.server";
import { receiveOpenAIBooking } from "../../lib/openaiConversions.server";

export default async function handler(request: Request): Promise<Response> {
  return receiveOpenAIBooking(request, {
    env: key => Netlify.env.get(key), fetch, now: Date.now,
    preferences: id => privacyStore.read(id),
    claim: async key => {
      const result: any = await getDb().execute(sql`
        insert into openai_event_deliveries(event_key,status) values(${key},'sending')
        on conflict(event_key) do update set status='sending', updated_at=now()
        where openai_event_deliveries.status='retry' or
          (openai_event_deliveries.status='sending' and openai_event_deliveries.updated_at < now() - interval '2 minutes')
        returning event_key`);
      if ((result.rows ?? result).length > 0) return "claimed";
      const existing: any = await getDb().execute(sql`select status from openai_event_deliveries where event_key=${key}`);
      return (existing.rows ?? existing)[0]?.status === "sent" ? "sent" : "busy";
    },
    finish: async (key, status) => {
      await getDb().execute(sql`update openai_event_deliveries set status=${status},updated_at=now() where event_key=${key}`);
    },
  });
}
