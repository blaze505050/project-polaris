import { useEffect } from "react";

export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | AeroForge AI`
      : "AeroForge AI — Connected Engineering Research Environment";
    document.title = fullTitle;

    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        const [key, val] = selector.replace("meta[", "").replace("]", "").split("=");
        el.setAttribute(key, val.replace(/"/g, ""));
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    if (description) {
      setMeta('meta[name="description"]', "content", description);
      setMeta('meta[property="og:description"]', "content", description);
      setMeta('meta[name="twitter:description"]', "content", description);
    }
    setMeta('meta[property="og:title"]', "content", fullTitle);
    setMeta('meta[name="twitter:title"]', "content", fullTitle);
  }, [title, description]);
}
