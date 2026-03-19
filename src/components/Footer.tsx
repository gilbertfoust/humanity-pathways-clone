import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import hpgLogo from "@/assets/hpg-logo.png";

const footerLinks = [
  { label: "HPG Vision", href: "/hpg-vision" },
  { label: "HPG Sponsorship", href: "/hpg-sponsorship" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "GYLFH", href: "/gylfh" },
];

const socials = [
  { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61559558202133", label: "Facebook" },
  { icon: Instagram, href: "https://www.instagram.com/humanity_pathways_global", label: "Instagram" },
  { icon: Linkedin, href: "https://www.linkedin.com/company/humanity-pathways-global/", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Branding */}
          <div>
            <h3 className="font-display text-2xl font-semibold">Humanity Pathways Global</h3>
            <p className="mt-3 text-sm leading-relaxed text-primary-foreground/70">
              220 West Congress Street Ste 698, Detroit, MI, USA
            </p>
            <p className="mt-1 text-sm text-primary-foreground/70">Open Mon–Fri: 9:00 AM – 5:00 PM</p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-primary-foreground/50">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-primary-foreground/50">
              Connect
            </h4>
            <div className="flex gap-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-primary-foreground/20 p-2.5 text-primary-foreground/60 transition-colors hover:border-primary-foreground/50 hover:text-primary-foreground"
                  aria-label={s.label}
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-primary-foreground/10 pt-8 text-center">
          <p className="text-xs text-primary-foreground/50">
            Copyright © {new Date().getFullYear()} Humanity Pathways Global - All Rights Reserved.
          </p>
          <p className="mt-2 text-[10px] text-primary-foreground/30">
            *HPG is currently registered to solicit in Michigan and Illinois. We are not actively soliciting donations from residents of other states at this time.
          </p>
        </div>
      </div>
    </footer>
  );
}
