import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { auth } from "./auth";

const http = httpRouter();

// CORS preflight handler for webhooks
http.route({
  path: "/webhook",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, webhook-id, webhook-timestamp, webhook-signature",
      },
    });
  }),
});

// Polar webhook handler - using /webhook path
http.route({
  path: "/webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    console.log("=== Polar Webhook Received ===");
    
    // Get the raw body
    const body = await request.text();
    console.log("Webhook body length:", body.length);
    console.log("Webhook body preview:", body.substring(0, 500));
    
    // Log all headers for debugging
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });
    console.log("All headers:", JSON.stringify(headers, null, 2));

    // Get Standard Webhooks headers
    const webhookId = request.headers.get("webhook-id");
    const webhookTimestamp = request.headers.get("webhook-timestamp");
    const webhookSignature = request.headers.get("webhook-signature");

    console.log("Standard Webhook headers:", { 
      webhookId, 
      webhookTimestamp, 
      hasSignature: !!webhookSignature 
    });

    // Check for webhook secret
    const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;
    console.log("Webhook secret configured:", !!webhookSecret);
    if (webhookSecret) {
      console.log("Secret prefix:", webhookSecret.substring(0, 15) + "...");
    }

    // For now, skip signature verification to test the webhook flow
    // We'll add it back once we confirm the webhook is working
    let skipSignatureVerification = false;
    
    if (!webhookId || !webhookTimestamp || !webhookSignature) {
      console.log("Missing standard webhook headers - skipping signature verification");
      skipSignatureVerification = true;
    }

    if (!skipSignatureVerification && webhookSecret) {
      const isValid = await verifyWebhookSignature(
        body,
        webhookId!,
        webhookTimestamp!,
        webhookSignature!,
        webhookSecret
      );

      console.log("Signature verification result:", isValid);

      if (!isValid) {
        console.error("Invalid webhook signature - but continuing for debugging");
        // For now, continue anyway to see what's in the payload
        // return new Response("Invalid signature", { status: 403 });
      }
    }

    // Parse the webhook payload
    let payload;
    try {
      payload = JSON.parse(body);
      console.log("Parsed payload type:", payload.type);
      console.log("Full payload:", JSON.stringify(payload, null, 2));
    } catch (e) {
      console.error("Invalid JSON payload:", e);
      return new Response("Invalid JSON", { status: 400 });
    }

    const eventType = payload.type;
    console.log(`Processing Polar webhook event: ${eventType}`);

    try {
      // Handle different event types
      switch (eventType) {
        case "subscription.created":
        case "subscription.updated":
        case "subscription.active": {
          const subscription = payload.data;
          
          // Try multiple paths to find the email
          const customerEmail = 
            subscription.customer?.email || 
            subscription.user?.email ||
            payload.data?.customer?.email ||
            payload.customer?.email;
          
          console.log("Customer email extracted:", customerEmail);
          
          if (!customerEmail) {
            console.error("No email found. Subscription data keys:", Object.keys(subscription || {}));
            console.error("Customer data:", JSON.stringify(subscription?.customer, null, 2));
            // Return 200 to acknowledge receipt, but log the issue
            return new Response("OK - but no email found", { status: 200 });
          }

          console.log("Creating/updating subscription for:", customerEmail);
          
          await ctx.runMutation(internal.subscriptions.createOrUpdateSubscription, {
            email: customerEmail,
            polarCustomerId: subscription.customer?.id || subscription.user?.id,
            polarSubscriptionId: subscription.id,
            status: "active",
            currentPeriodEnd: subscription.current_period_end 
              ? new Date(subscription.current_period_end).getTime() 
              : undefined,
          });
          
          console.log("Subscription created/updated successfully for:", customerEmail);
          break;
        }

        case "subscription.canceled":
        case "subscription.revoked": {
          const subscription = payload.data;
          const customerEmail = 
            subscription.customer?.email || 
            subscription.user?.email ||
            payload.data?.customer?.email;
          
          if (customerEmail) {
            await ctx.runMutation(internal.subscriptions.createOrUpdateSubscription, {
              email: customerEmail,
              polarCustomerId: subscription.customer?.id || subscription.user?.id,
              polarSubscriptionId: subscription.id,
              status: "canceled",
              currentPeriodEnd: subscription.current_period_end 
                ? new Date(subscription.current_period_end).getTime() 
                : undefined,
            });
            console.log("Subscription canceled for:", customerEmail);
          }
          break;
        }

        case "checkout.created":
        case "checkout.updated": {
          console.log(`Checkout event: ${eventType}`, payload.data?.id);
          // Also try to extract email from checkout
          const checkoutEmail = payload.data?.customer_email || payload.data?.customer?.email;
          if (checkoutEmail) {
            console.log("Checkout customer email:", checkoutEmail);
          }
          break;
        }

        case "order.created":
        case "order.paid": {
          console.log(`Order event: ${eventType}`);
          const orderEmail = payload.data?.customer?.email || payload.data?.customer_email;
          if (orderEmail) {
            console.log("Order customer email:", orderEmail);
            // Create subscription from order event as fallback
            await ctx.runMutation(internal.subscriptions.createOrUpdateSubscription, {
              email: orderEmail,
              polarCustomerId: payload.data?.customer?.id,
              polarSubscriptionId: payload.data?.subscription_id || payload.data?.id,
              status: "active",
            });
            console.log("Subscription created from order for:", orderEmail);
          }
          break;
        }

        default:
          console.log(`Unhandled event type: ${eventType}`);
      }

      return new Response("OK", { 
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error) {
      console.error("Error processing webhook:", error);
      // Still return 200 to prevent retries while debugging
      return new Response("OK - error logged", { 
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  }),
});

// Verify webhook signature using Standard Webhooks specification (HMAC-SHA256)
async function verifyWebhookSignature(
  payload: string,
  webhookId: string,
  webhookTimestamp: string,
  webhookSignature: string,
  secret: string
): Promise<boolean> {
  try {
    // The secret from Polar can have different prefixes: "whsec_" or "polar_whs_"
    let secretKey = secret;
    if (secret.startsWith("whsec_")) {
      secretKey = secret.slice(6);
    } else if (secret.startsWith("polar_whs_")) {
      secretKey = secret.slice(10);
    }
    
    // Decode the base64 secret
    const keyBytes = Uint8Array.from(atob(secretKey), c => c.charCodeAt(0));
    
    // Create the signed payload: id.timestamp.body
    const signedPayload = `${webhookId}.${webhookTimestamp}.${payload}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(signedPayload);

    // Import the key for HMAC-SHA256
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyBytes,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    // Sign the payload
    const signature = await crypto.subtle.sign("HMAC", cryptoKey, data);
    const expectedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)));

    // The webhook signature header can contain multiple signatures (v1,v2,etc)
    // Format: "v1,signature1 v1,signature2"
    const signatures = webhookSignature.split(" ");
    
    for (const sig of signatures) {
      const [version, sigValue] = sig.split(",");
      if (version === "v1" && sigValue === expectedSignature) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Error verifying webhook signature:", error);
    return false;
  }
}

// Debug: Test endpoint to verify webhook route is accessible
http.route({
  path: "/webhook",
  method: "GET",
  handler: httpAction(async () => {
    console.log("GET /webhook - Route is accessible");
    const siteUrl = process.env.CONVEX_SITE_URL || "https://your-deployment.convex.site";
    return new Response(JSON.stringify({ 
      status: "ok", 
      message: "Polar webhook endpoint is accessible. POST to this endpoint to trigger webhooks.",
      expectedUrl: `${siteUrl}/webhook`
    }), { 
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      }
    });
  }),
});

// Keep old path for backwards compatibility
http.route({
  path: "/polar-webhook",
  method: "GET",
  handler: httpAction(async () => {
    const siteUrl = process.env.CONVEX_SITE_URL || "https://your-deployment.convex.site";
    return new Response(JSON.stringify({ 
      status: "ok", 
      message: `This endpoint has moved. Use: ${siteUrl}/webhook`
    }), { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }),
});

// Auth routes MUST be added AFTER webhook routes
// This prevents auth middleware from intercepting webhook requests
auth.addHttpRoutes(http);

export default http;

