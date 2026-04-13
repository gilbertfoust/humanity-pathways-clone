import { createClient } from "npm:@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { type StripeEnv, verifyWebhook, createStripeClient } from "../_shared/stripe.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const url = new URL(req.url);
  const env = (url.searchParams.get('env') || 'sandbox') as StripeEnv;

  try {
    const event = await verifyWebhook(req, env);
    console.log("Received event:", event.type, "env:", env);

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object, env);
        break;
      default:
        console.log("Unhandled event:", event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Webhook error:", e);
    return new Response("Webhook error", { status: 400 });
  }
});

async function handleCheckoutCompleted(session: any, env: StripeEnv) {
  console.log("Checkout completed:", session.id, "mode:", session.mode);

  // If metadata includes orgName, send receipt email to finance
  const meta = session.metadata || {};
  if (meta.orgName) {
    try {
      await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "onboarding-fee-receipt",
          recipientEmail: "finance@humanitypathwaysglobal.com",
          idempotencyKey: `onboarding-finance-${session.id}`,
          templateData: {
            orgName: meta.orgName,
            contact: meta.contact || "",
            email: meta.email || "",
            phone: meta.phone || "",
            country: meta.country || "",
            state: meta.state || "",
            tier: meta.tier || "",
            amount: (session.amount_total / 100).toFixed(2),
            date: new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }),
          },
        },
      });
      console.log("Receipt email sent for session:", session.id);
    } catch (emailErr) {
      console.error("Failed to send receipt email:", emailErr);
    }
  }
}
