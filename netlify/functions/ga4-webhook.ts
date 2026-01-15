import type { Handler, HandlerEvent, HandlerResponse } from "@netlify/functions";

interface WebhookPayload {
  event_name: "purchase" | "generate_lead";
  client_id?: string;
  transaction_id?: string;
  value?: number;
  currency?: string;
  city?: string;
  class_category?: string;
  class_name?: string;
  class_id?: string;
  booking_provider?: "rezclick" | "eventbrite" | "acuity" | "groupon" | "unknown";
  link_url?: string;
}

interface GA4Event {
  client_id: string;
  events: Array<{
    name: string;
    params: Record<string, any>;
  }>;
}

/**
 * Generates a random client ID for GA4 when one isn't provided
 * Format: random number + timestamp (similar to GA's format)
 */
function generateClientId(): string {
  const randomNum = Math.floor(Math.random() * 2147483647);
  const timestamp = Math.floor(Date.now() / 1000);
  return `${randomNum}.${timestamp}`;
}

/**
 * Validates webhook payload based on event type
 */
function validatePayload(payload: WebhookPayload): { valid: boolean; error?: string } {
  if (!payload.event_name) {
    return { valid: false, error: "Missing required field: event_name" };
  }

  if (!["purchase", "generate_lead"].includes(payload.event_name)) {
    return { valid: false, error: "event_name must be 'purchase' or 'generate_lead'" };
  }

  // Purchase-specific validation
  if (payload.event_name === "purchase") {
    if (!payload.transaction_id) {
      return { valid: false, error: "purchase events require transaction_id" };
    }
    if (typeof payload.value !== "number") {
      return { valid: false, error: "purchase events require numeric value" };
    }
    if (!payload.currency) {
      return { valid: false, error: "purchase events require currency" };
    }
  }

  // Generate_lead validation (best effort)
  if (payload.event_name === "generate_lead") {
    if (!payload.city && !payload.class_name && !payload.class_id) {
      return { valid: false, error: "generate_lead events require at least city, class_name, or class_id" };
    }
  }

  return { valid: true };
}

/**
 * Sends event to GA4 Measurement Protocol
 */
async function sendToGA4(
  measurementId: string,
  apiSecret: string,
  payload: WebhookPayload
): Promise<{ success: boolean; error?: string }> {
  const clientId = payload.client_id || generateClientId();
  
  // Build GA4 event
  const eventParams: Record<string, any> = {
    engagement_time_msec: "100", // Required minimal engagement
  };

  // Add all available parameters
  if (payload.city) eventParams.city = payload.city;
  if (payload.class_category) eventParams.class_category = payload.class_category;
  if (payload.class_name) eventParams.class_name = payload.class_name;
  if (payload.class_id) eventParams.class_id = payload.class_id;
  if (payload.booking_provider) eventParams.booking_provider = payload.booking_provider;
  if (payload.link_url) eventParams.link_url = payload.link_url;

  // Purchase-specific parameters
  if (payload.event_name === "purchase") {
    eventParams.transaction_id = payload.transaction_id;
    eventParams.value = payload.value;
    eventParams.currency = payload.currency;
    
    // Add purchase items (GA4 ecommerce format)
    eventParams.items = [
      {
        item_id: payload.class_id || "unknown",
        item_name: payload.class_name || "Workshop",
        item_category: payload.class_category || "workshop",
        price: payload.value,
        quantity: 1
      }
    ];
  }

  const ga4Payload: GA4Event = {
    client_id: clientId,
    events: [
      {
        name: payload.event_name,
        params: eventParams
      }
    ]
  };

  // Send to GA4 Measurement Protocol
  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`;
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ga4Payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { 
        success: false, 
        error: `GA4 API returned ${response.status}: ${errorText}` 
      };
    }

    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error sending to GA4" 
    };
  }
}

/**
 * Netlify Function handler for GA4 webhook
 */
export const handler: Handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  // Only accept POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed. Use POST." }),
    };
  }

  // Check webhook secret for security
  const webhookSecret = process.env.WEBHOOK_SECRET;
  const providedSecret = event.headers["x-webhook-secret"];

  if (!webhookSecret) {
    console.error("WEBHOOK_SECRET environment variable not configured");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server configuration error" }),
    };
  }

  if (!providedSecret || providedSecret !== webhookSecret) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Unauthorized: Invalid or missing X-Webhook-Secret header" }),
    };
  }

  // Check GA4 configuration
  const measurementId = process.env.GA4_MEASUREMENT_ID;
  const apiSecret = process.env.GA4_API_SECRET;

  if (!measurementId || !apiSecret) {
    console.error("GA4_MEASUREMENT_ID or GA4_API_SECRET not configured");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "GA4 not configured" }),
    };
  }

  // Parse and validate payload
  let payload: WebhookPayload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON in request body" }),
    };
  }

  // Validate payload
  const validation = validatePayload(payload);
  if (!validation.valid) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: validation.error }),
    };
  }

  // Send to GA4
  const result = await sendToGA4(measurementId, apiSecret, payload);
  
  if (!result.success) {
    console.error("Failed to send to GA4:", result.error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Failed to send event to GA4", 
        details: result.error 
      }),
    };
  }

  // Success response
  return {
    statusCode: 200,
    body: JSON.stringify({ 
      success: true,
      message: `${payload.event_name} event sent to GA4`,
      client_id: payload.client_id || "generated",
      transaction_id: payload.transaction_id
    }),
  };
};
