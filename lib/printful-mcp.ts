type Args = Record<string, any>;
const id = { type: "integer", minimum: 1 };
const payload = { type: "object", additionalProperties: true };
const definitions = [
  ["printful_list_stores", "List accessible Printful stores.", "GET", "/stores", {}, []],
  ["printful_list_catalog_products", "List Printful catalog products.", "GET", "/products", {}, []],
  ["printful_get_catalog_product", "Get catalog product and available variants.", "GET", "/products/:id", { id }, ["id"]],
  ["printful_list_products", "List store sync products; supports limit and offset.", "GET", "/store/products", { limit: {type:"integer",minimum:1,maximum:100}, offset:{type:"integer",minimum:0} }, []],
  ["printful_get_product", "Get a store sync product and its variants.", "GET", "/store/products/:id", { id }, ["id"]],
  ["printful_create_product", "Create a sync product in an API/manual store. Payload contains sync_product and sync_variants with print files.", "POST", "/store/products", { payload }, ["payload"]],
  ["printful_update_variant", "Update a sync variant's print files, catalog variant or retail price.", "PUT", "/store/variants/:id", { id, payload }, ["id","payload"]],
  ["printful_list_orders", "List Printful store orders.", "GET", "/orders", { limit:{type:"integer",minimum:1,maximum:100}, offset:{type:"integer",minimum:0} }, []],
  ["printful_get_order", "Get Printful order status and details.", "GET", "/orders/:id", { id }, ["id"]],
  ["printful_create_draft_order", "Create an unconfirmed draft order. Payload contains recipient and items. Does not submit fulfillment or charge payment.", "POST", "/orders", { payload }, ["payload"]],
  ["printful_update_order", "Update an unconfirmed order's recipient and items without confirming fulfillment.", "PUT", "/orders/:id", { id, payload }, ["id","payload"]],
  ["printful_confirm_order", "Confirm an order for paid fulfillment. Only use after the user explicitly approves this order and its cost.", "POST", "/orders/:id/confirm", { id, approved: {type:"boolean",const:true} }, ["id","approved"]],
] as const;
export const printfulTools = definitions.map(([name, description, method, , properties, required]) => ({
  name, description,
  inputSchema: { type: "object", properties: { ...properties, store_id: id }, required: [...required], additionalProperties: false },
  annotations: { readOnlyHint: method === "GET", destructiveHint: method !== "GET", idempotentHint: method === "GET" || method === "PUT", openWorldHint: true },
}));
export async function runPrintfulTool(name: string, args: Args): Promise<{data:unknown} | null> {
  const def = definitions.find(d => d[0] === name);
  if (!def) return null;
  const [, , method, path, properties, required] = def;
  if (!args || typeof args !== "object" || Array.isArray(args)) throw new Error("Arguments must be an object.");
  const allowed = new Set([...Object.keys(properties), "store_id"]);
  for (const key of Object.keys(args)) if (!allowed.has(key)) throw new Error(`Unknown argument: ${key}`);
  for (const key of required) if (args[key] === undefined) throw new Error(`${key} is required.`);
  for (const key of ["id", "store_id", "limit", "offset"]) {
    if (args[key] !== undefined && (!Number.isSafeInteger(args[key]) || args[key] < (key === "offset" ? 0 : 1) || (key === "limit" && args[key] > 100))) throw new Error(`Invalid ${key}.`);
  }
  if (args.payload !== undefined && (!args.payload || typeof args.payload !== "object" || Array.isArray(args.payload))) throw new Error("payload must be an object.");
  if (name === "printful_confirm_order" && args.approved !== true) throw new Error("Explicit order approval is required.");
  if (args.payload && ("confirm" in args.payload)) throw new Error("Use printful_confirm_order to confirm fulfillment.");
  const token = process.env.PRINTFUL_API_TOKEN?.trim();
  if (!token) throw new Error("Printful credentials are not configured on the server.");
  const url = new URL(`https://api.printful.com${path.replace(":id", String(args.id))}`);
  for (const key of ["limit", "offset"]) if (args[key] !== undefined) url.searchParams.set(key, String(args[key]));
  if (name === "printful_create_draft_order" || name === "printful_update_order") url.searchParams.set("confirm", "0");
  const response = await fetch(url, {
    method, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...(args.store_id ? {"X-PF-Store-Id":String(args.store_id)} : {}) },
    body: args.payload === undefined ? undefined : JSON.stringify(args.payload), cache: "no-store", signal: AbortSignal.timeout(25000),
  });
  if (!response.ok) throw new Error(`Printful API returned HTTP ${response.status}. Check token permissions, store selection and request fields.`);
  return { data: await response.json() };
}
