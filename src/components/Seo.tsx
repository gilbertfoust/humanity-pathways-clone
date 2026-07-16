import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { SITE_NAME, SITE_URL, routeMetaByPath } from "@/data/routeMeta";

interface SeoProps {
  /** Optional overrides — otherwise inferred from current route. */
  title?: string;
  description?: string;
  /** Extra path override (e.g. dynamic pages). */
  path?: string;
  /** Absolute or same-origin og:image URL. */
  image?: string;
  noindex?: boolean;
}

/**
 * Per-route metadata. Renders title, description, canonical,
 * Open Graph and Twitter tags for the current route based on the
 * central routeMeta registry, with optional overrides.
 */
export default function Seo(props: SeoProps) {
  const location = useLocation();
  const path = props.path ?? location.pathname;
  const meta = routeMetaByPath[path];

  const title = props.title ?? meta?.title ?? SITE_NAME;
  const description = props.description ?? meta?.description ??
    "Humanity Pathways Global — building self-sustaining communities worldwide.";
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  const noindex = props.noindex ?? meta?.noindex ?? false;

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      {props.image && <meta property="og:image" content={props.image} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {props.image && <meta name="twitter:image" content={props.image} />}
    </Helmet>
  );
}
