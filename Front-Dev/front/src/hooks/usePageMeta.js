import { useEffect } from "react";

const SITE_NAME = "MOUSIN";

const upsertMeta = (keyAttr, key, content) => {
  if (!content) return;

  let tag = document.head.querySelector(`meta[${keyAttr}="${key}"]`);

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(keyAttr, key);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
};

export const usePageMeta = ({ title, description, image, type = "website" }) => {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Periféricos de precisión`;

    document.title = fullTitle;

    upsertMeta("name", "description", description);
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:locale", "es_ES");
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", window.location.href);

    if (image) {
      upsertMeta("property", "og:image", image);
      upsertMeta("name", "twitter:card", "summary_large_image");
      upsertMeta("name", "twitter:title", fullTitle);
      upsertMeta("name", "twitter:description", description);
      upsertMeta("name", "twitter:image", image);
    }

    let canonical = document.head.querySelector('link[rel="canonical"]');

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }

    canonical.setAttribute("href", window.location.href);
  }, [title, description, image, type]);
};
