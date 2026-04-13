import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";

/* ─── Fee schedule data ─── */
const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada",
  "New Hampshire","New Jersey","New Mexico","New York","North Carolina",
  "North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island",
  "South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
  "Virginia","Washington","West Virginia","Wisconsin","Wyoming",
];

const CA_PROVINCES = [
  "Alberta","British Columbia","Manitoba","New Brunswick",
  "Newfoundland and Labrador","Nova Scotia","Ontario",
  "Prince Edward Island","Quebec","Saskatchewan",
  "Northwest Territories","Nunavut","Yukon",
];

const TIER_B_STATES = new Set([
  "California","New York","Illinois","Florida","Texas","Pennsylvania",
  "Massachusetts","New Jersey","Ohio","Virginia",
]);

function getFee(country: string, state: string) {
  if (country === "Other / International") {
    return { tier: "International", amount: 200, priceId: "onboarding_tier_b" };
  }
  if (country === "Canada") {
    return { tier: "Tier A (lower filing complexity)", amount: 150, priceId: "onboarding_tier_a" };
  }
  if (TIER_B_STATES.has(state)) {
    return { tier: "Tier B (higher filing complexity)", amount: 200, priceId: "onboarding_tier_b" };
  }
  return { tier: "Tier A (lower filing complexity)", amount: 150, priceId: "onboarding_tier_a" };
}

export default function HpgOnboardingFee() {
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  /* Organization fields */
  const [orgName, setOrgName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  /* Jurisdiction */
  const [country, setCountry] = useState("United States");
  const [state, setState] = useState("Alabama");

  /* Payment */
  const [consent, setConsent] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const fee = useMemo(() => getFee(country, state), [country, state]);

  const stateLabel = country === "Canada" ? "Province" : "State / Province";
  const stateList =
    country === "United States"
      ? US_STATES
      : country === "Canada"
        ? CA_PROVINCES
        : [];

  const coverageScope =
    country === "Other / International"
      ? "International"
      : country === "Canada"
        ? `Canada • Province: ${state}`
        : `United States • State: ${state}`;

  const canPay = consent && orgName.trim() && contact.trim() && email.trim();

  const fetchClientSecret = async (): Promise<string> => {
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: {
        priceId: fee.priceId,
        customerEmail: email,
        environment: getStripeEnvironment(),
        returnUrl: `${window.location.origin}/hpg-onboarding-fee/thank-you?session_id={CHECKOUT_SESSION_ID}`,
        metadata: {
          orgName,
          contact,
          email,
          phone,
          country,
          state,
          tier: fee.tier,
        },
      },
    });
    if (error || !data?.clientSecret) {
      throw new Error(error?.message || "Failed to create checkout session");
    }
    return data.clientSecret;
  };

  return (
    <div className="min-h-screen bg-muted">
      <PaymentTestModeBanner />
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 pb-20 pt-[calc(var(--nav-height)+2rem)]">
        {/* Header bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 rounded-lg bg-card p-6 shadow-sm"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/20">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                  Humanity Pathways Global — Onboarding Fee Payment
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Administrative filing coverage for registered agent coordination and applicable government registrations.
                </p>
              </div>
            </div>
            <div className="shrink-0 text-right text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">Payment Intake</p>
              <p>Reference: HPG-ONB</p>
              <p>{today}</p>
            </div>
          </div>
        </motion.div>

        {showCheckout ? (
          /* ─── Stripe Embedded Checkout ─── */
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-xl font-semibold text-foreground">
                      Complete Payment
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {orgName} • {coverageScope} • ${fee.amount.toFixed(2)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCheckout(false)}
                  >
                    Back
                  </Button>
                </div>
                <EmbeddedCheckoutProvider
                  stripe={getStripe()}
                  options={{ fetchClientSecret }}
                >
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            {/* ─── LEFT: Organization + Jurisdiction ─── */}
            <div className="space-y-8">
              {/* Organization Details */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h2 className="font-display text-xl font-semibold text-foreground">
                      Organization Details
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      After compliance review, this payment finalizes the administrative onboarding step.
                      If your compliance review is still in progress, pause here and pay only when instructed by HPG.
                    </p>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="orgName">Organization / Project Name *</Label>
                        <Input
                          id="orgName"
                          placeholder="Example: Megabridge Foundation (U…"
                          value={orgName}
                          onChange={(e) => setOrgName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact">Primary Contact *</Label>
                        <Input
                          id="contact"
                          placeholder="Full name"
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@example.org"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (___) ___-____"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Jurisdiction & Fee */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h2 className="font-display text-xl font-semibold text-foreground">
                      Jurisdiction &amp; Fee
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Select your country and then your state/province. The total updates automatically.
                    </p>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Country</Label>
                        <Select value={country} onValueChange={(v) => { setCountry(v); setState(v === "United States" ? "Alabama" : v === "Canada" ? "Alberta" : ""); }}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="United States">United States</SelectItem>
                            <SelectItem value="Canada">Canada</SelectItem>
                            <SelectItem value="Other / International">Other / International</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {stateList.length > 0 && (
                        <div className="space-y-2">
                          <Label>{stateLabel}</Label>
                          <Select value={state} onValueChange={setState}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {stateList.map((s) => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    {/* Fee summary */}
                    <div className="mt-6 rounded-md border border-border bg-muted/50 p-4 text-sm">
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">Coverage scope</span>
                        <span className="font-medium text-foreground">{coverageScope}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">Government filing tier</span>
                        <span className="font-medium text-foreground">{fee.tier}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between py-1">
                        <span className="font-semibold text-foreground">Total due</span>
                        <span className="font-bold text-foreground">${fee.amount.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                      <p>
                        <span className="font-semibold text-foreground">What this fee is for:</span>{" "}
                        registered agent coordination (where applicable), secretary of state nonprofit
                        registration filing support, and charitable solicitation / charitable deduction
                        certificate preparation steps (where applicable).
                      </p>
                      <p>
                        <span className="font-semibold text-foreground">What it is not:</span>{" "}
                        it is not a donation, and it does not replace your fiscal sponsorship agreement
                        obligations. This payment is generally treated as an administrative onboarding charge.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* ─── RIGHT: Payment ─── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <Card className="sticky top-[calc(var(--nav-height)+2rem)]">
                <CardContent className="p-6">
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    Secure Payment
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Your card information is processed securely. HPG does not store card numbers.
                  </p>

                  {/* Consent */}
                  <div className="mt-6 flex items-start gap-3">
                    <Checkbox
                      id="consent"
                      checked={consent}
                      onCheckedChange={(v) => setConsent(v === true)}
                      className="mt-0.5"
                    />
                    <label htmlFor="consent" className="text-xs leading-relaxed text-muted-foreground">
                      I confirm I am authorized to make this payment on behalf of the organization/project
                      named above, and I understand this is an onboarding administrative fee tied to
                      jurisdictional filing preparation. If HPG determines a jurisdictional change is needed,
                      the fee may be adjusted and coordinated with me.
                    </label>
                  </div>

                  <Button
                    className="mt-6 w-full"
                    size="lg"
                    disabled={!canPay}
                    onClick={() => setShowCheckout(true)}
                  >
                    Proceed to Pay ${fee.amount.toFixed(2)}
                  </Button>

                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    A receipt will be sent to finance automatically upon successful payment.
                  </p>
                  <p className="mt-2 rounded bg-muted/50 p-3 text-center text-xs text-muted-foreground">
                    For receipt questions, reference your Stripe receipt email and include your
                    organization name in communications.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
