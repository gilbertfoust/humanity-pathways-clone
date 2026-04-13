import { useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function OnboardingThankYou() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-screen bg-muted">
      <Navbar />
      <main className="mx-auto max-w-lg px-4 pb-20 pt-[calc(var(--nav-height)+4rem)]">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
            <h1 className="font-display text-2xl font-bold text-foreground">
              Payment Successful
            </h1>
            <p className="text-sm text-muted-foreground">
              Thank you! Your onboarding fee has been received. A receipt has been
              sent to HPG Finance for processing.
            </p>
            {sessionId && (
              <p className="text-xs text-muted-foreground">
                Reference: {sessionId.slice(0, 20)}…
              </p>
            )}
            <Button variant="outline" asChild className="mt-4">
              <a href="/">Return to Homepage</a>
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
