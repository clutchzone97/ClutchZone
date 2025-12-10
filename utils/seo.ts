export const setMetaTag = (attr: { name?: string; property?: string }, content: string) => {
  const selector = attr.name ? `meta[name="${attr.name}"]` : attr.property ? `meta[property="${attr.property}"]` : '';
  let el = selector ? document.head.querySelector(selector) as HTMLMetaElement | null : null;
  if (!el) {
    el = document.createElement('meta');
    if (attr.name) el.setAttribute('name', attr.name);
    if (attr.property) el.setAttribute('property', attr.property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

export const setCanonical = (href: string) => {
  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
};

export const setPageSEO = (opts: { title: string; description: string; canonicalUrl?: string; image?: string }) => {
  document.title = opts.title;
  setMetaTag({ name: 'description' }, opts.description);
  setMetaTag({ property: 'og:title' }, opts.title);
  setMetaTag({ property: 'og:description' }, opts.description);
  if (opts.image) setMetaTag({ property: 'og:image' }, opts.image);
  if (opts.canonicalUrl) setCanonical(opts.canonicalUrl);
};

export const canonicalForHashRouter = (base: string) => {
  const hash = window.location.hash || '#/';
  const path = hash.startsWith('#') ? hash.slice(1) : hash;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}`;
};
