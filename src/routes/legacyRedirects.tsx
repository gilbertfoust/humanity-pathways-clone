import { Navigate, useLocation } from "react-router-dom";

/**
 * Legacy → current path aliases identifiable from earlier navbar
 * items, renamed initiative pages, and 404-inducing links surfaced
 * historically. Targets MUST be real, currently mounted routes to
 * avoid Navigate → NotFound loops; a self-referential mapping would
 * also loop, so we validate that source !== target.
 */
export const legacyRedirects: Record<string, string> = {
  // Historic navbar / footer variants
  "/home": "/",
  "/index": "/",
  "/index.html": "/",
  "/vision": "/hpg-vision",
  "/mission": "/hpg-vision",
  "/hpg-mission": "/hpg-vision",
  "/initiatives": "/hpg-initiatives",
  "/programs": "/hpg-initiatives",
  "/staff": "/hpg-staff",
  "/team": "/hpg-staff",
  "/board": "/hpg-board-of-directors",
  "/board-of-directors": "/hpg-board-of-directors",
  "/hpg-board": "/hpg-board-of-directors",
  "/sponsorship": "/hpg-sponsorship",
  "/sponsor": "/hpg-sponsorship",
  "/blog": "/hpg-blog",
  "/news": "/hpg-blog",
  "/contact": "/contact-us",
  "/volunteer": "/volunteer-application",
  "/apply-volunteer": "/volunteer-application",
  "/apply-sponsorship": "/sponsorship-application",
  "/apply-board": "/board-application",
  "/events": "/global-leaders-summit",
  "/summit": "/global-leaders-summit",
  "/next-gen-summit": "/global-leaders-summit",

  // Renamed initiative pages
  "/nazarene": "/nazarene-mission",
  "/youth-development-angola": "/nazarene-mission",
  "/megabridge": "/megabridge-kenya",
  "/sm-vm": "/sante-vie-meilleure",
  "/santevie": "/sante-vie-meilleure",
  "/hgl": "/hope-for-a-good-life",
  "/hope-good-life": "/hope-for-a-good-life",
  "/seishin": "/seishin-plus",
  "/executive-academy": "/hpg-executive-academy",
  "/mkcf": "/mkcf-sierra-leone",
  "/stem": "/youth-stem-robotics",
  "/robotics": "/youth-stem-robotics",
  "/rainroot": "/rainroot-wata",
  "/humane": "/humane-initiative",
  "/cuba": "/cuba-congo",
  "/wings": "/project-wings",
  "/humble": "/humble-pathways",
  "/philippines": "/triumphant-philippines",
  "/global-youth-leaders": "/gylfh",
  "/global-youth-leaders-for-humanity": "/gylfh",

  // Legal / info variants
  "/privacy-policy": "/privacy",
  "/terms-of-use": "/terms",
  "/terms-of-service": "/terms",
  "/tos": "/terms",
  "/reports": "/annual-reports",
  "/annual-report": "/annual-reports",
  "/a11y": "/accessibility",
};

// Guard: never emit a self-redirect.
for (const [from, to] of Object.entries(legacyRedirects)) {
  if (from === to) {
    // Fail fast in dev; the test suite also asserts this.
    delete legacyRedirects[from];
  }
}

/** Render a permanent client-side redirect to `to`. */
export function LegacyRedirect({ to }: { to: string }) {
  const location = useLocation();
  // Prevent runtime loops if a caller ever aliased a route to itself.
  if (location.pathname === to) return null;
  return <Navigate to={to} replace />;
}
