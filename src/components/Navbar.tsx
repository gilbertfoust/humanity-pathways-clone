import { useState } from "react";
import { Link } from "react-router-dom";
import hpgLogo from "@/assets/hpg-logo.png";
import { Menu, X, ChevronDown, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "HOME", href: "/" },
  { label: "HPG VISION", href: "/hpg-vision" },
  { label: "HPG INITIATIVES", href: "/hpg-initiatives" },
  {
    label: "OUR TEAM",
    href: "#",
    children: [
      { label: "HPG Staff", href: "/hpg-staff" },
      { label: "HPG Board of Directors", href: "/hpg-board-of-directors" },
      { label: "Volunteer Application", href: "/volunteer-application" },
    ],
  },
  { label: "HPG SPONSORSHIP", href: "/hpg-sponsorship" },
  { label: "HPG BLOG", href: "/hpg-blog" },
  {
    label: "EVENTS",
    href: "#",
    children: [{ label: "Global Leaders Summit", href: "/global-leaders-summit" }],
  },
  { label: "CONTACT US", href: "/contact-us" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm" style={{ height: "var(--nav-height)" }}>
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={hpgLogo} alt="HPG Logo" className="h-10 w-10 object-contain" />
          <span className="font-display text-lg font-bold uppercase tracking-[0.25em] text-primary-foreground">
            Humanity Pathways Global
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <div
              key={link.label}
              className="relative"
              onMouseEnter={() => link.children && setOpenDropdown(link.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                to={link.href}
                className="flex items-center gap-1 px-3 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground/80 transition-colors hover:text-primary-foreground"
              >
                {link.label}
                {link.children && <ChevronDown className="h-3 w-3" />}
              </Link>

              {link.children && openDropdown === link.label && (
                <div className="absolute left-0 top-full min-w-[200px] rounded-sm bg-primary py-2 shadow-lg">
                  {link.children.map((child) => (
                    <Link
                      key={child.label}
                      to={child.href}
                      className="block px-4 py-2 text-xs font-medium text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <a
            href="https://gilbertfoust.github.io/hpg-workspace/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 p-2 text-primary-foreground/80 hover:text-primary-foreground"
            aria-label="HPG Workspace"
          >
            <User className="h-4 w-4" />
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-primary-foreground lg:hidden"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute left-0 right-0 top-full max-h-[80vh] overflow-y-auto bg-primary shadow-lg lg:hidden">
          {navLinks.map((link) => (
            <div key={link.label}>
              <Link
                to={link.href}
                onClick={() => !link.children && setMobileOpen(false)}
                className="flex items-center justify-between border-b border-primary-foreground/10 px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground/80"
              >
                {link.label}
                {link.children && <ChevronDown className="h-4 w-4" />}
              </Link>
              {link.children?.map((child) => (
                <Link
                  key={child.label}
                  to={child.href}
                  onClick={() => setMobileOpen(false)}
                  className="block border-b border-primary-foreground/5 bg-primary-foreground/5 px-10 py-2.5 text-xs font-medium text-primary-foreground/70"
                >
                  {child.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}
