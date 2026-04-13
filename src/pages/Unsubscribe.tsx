import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, XCircle, Loader2, MailX } from "lucide-react";

type Status = "loading" | "valid" | "already" | "invalid" | "success" | "error";

export default function Unsubscribe() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    const validate = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const res = await fetch(
          `${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: anonKey } }
        );
        const data = await res.json();
        if (res.ok && data.valid === true) setStatus("valid");
        else if (data.reason === "already_unsubscribed") setStatus("already");
        else setStatus("invalid");
      } catch {
        setStatus("invalid");
      }
    };
    validate();
  }, [token]);

  const handleUnsubscribe = async () => {
    setStatus("loading");
    try {
      const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });
      if (error) throw error;
      if (data?.success) setStatus("success");
      else if (data?.reason === "already_unsubscribed") setStatus("already");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <Navbar />
      <main className="mx-auto max-w-lg px-4 pb-20 pt-[calc(var(--nav-height)+4rem)]">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            {status === "loading" && (
              <>
                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                <p className="text-muted-foreground">Processing…</p>
              </>
            )}
            {status === "valid" && (
              <>
                <MailX className="h-10 w-10 text-accent" />
                <h1 className="font-display text-2xl font-bold text-foreground">Unsubscribe</h1>
                <p className="text-sm text-muted-foreground">
                  Click the button below to unsubscribe from future emails.
                </p>
                <Button onClick={handleUnsubscribe} size="lg">Confirm Unsubscribe</Button>
              </>
            )}
            {status === "success" && (
              <>
                <CheckCircle2 className="h-10 w-10 text-green-600" />
                <h1 className="font-display text-2xl font-bold text-foreground">Unsubscribed</h1>
                <p className="text-sm text-muted-foreground">
                  You have been unsubscribed and will no longer receive emails.
                </p>
              </>
            )}
            {status === "already" && (
              <>
                <CheckCircle2 className="h-10 w-10 text-muted-foreground" />
                <h1 className="font-display text-2xl font-bold text-foreground">Already Unsubscribed</h1>
                <p className="text-sm text-muted-foreground">
                  This email address has already been unsubscribed.
                </p>
              </>
            )}
            {(status === "invalid" || status === "error") && (
              <>
                <XCircle className="h-10 w-10 text-destructive" />
                <h1 className="font-display text-2xl font-bold text-foreground">
                  {status === "invalid" ? "Invalid Link" : "Something Went Wrong"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {status === "invalid"
                    ? "This unsubscribe link is invalid or has expired."
                    : "Please try again later."}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
