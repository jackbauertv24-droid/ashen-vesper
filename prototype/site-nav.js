// One navigation for every page.
//
// The four pages had four different menus: the Pilgrim Road listed the
// Cloister, the art library, the study and the repository; the Cloister
// listed only the Road and a roadmap; the study listed the library, an
// in-page anchor and the repository; the art library had no header at all.
// The study was also called three different things — "Original study" on the
// Road, "The study" in its own menu, and "The Abbey Gate" in its title tag.
// This module is the only place the menu is defined.
export const PAGES = [
  { href: "index.html", label: "Pilgrim Road" },
  { href: "cloister.html", label: "Ruined Cloister" },
  { href: "cistern.html", label: "Flooded Cistern" },
  { href: "study.html", label: "Art study" },
  { href: "art/library/gallery.html", label: "Art library" },
];

export const REPO = "https://github.com/jackbauertv24-droid/ashen-vesper";

const tidy = (pathname) => pathname.replace(/index\.html$/, "").replace(/\/$/, "");

/**
 * Render the shared header into `header.site-header`.
 * `base` is the relative path from this page back to the site root, so a
 * page nested in art/library passes "../../".
 */
export function mountNav(base = "./") {
  const header = document.querySelector("header.site-header");
  if (!header) return;
  const here = tidy(location.pathname);

  const brand = document.createElement("a");
  brand.className = "wordmark";
  brand.href = base;
  brand.innerHTML = '<span class="sigil" aria-hidden="true">✧</span> ASHEN VESPER';

  const nav = document.createElement("nav");
  nav.setAttribute("aria-label", "Main");
  for (const page of PAGES) {
    const a = document.createElement("a");
    a.href = base + page.href;
    a.textContent = page.label;
    if (tidy(new URL(a.href, location.href).pathname) === here)
      a.setAttribute("aria-current", "page");
    nav.append(a);
  }
  const repo = document.createElement("a");
  repo.href = REPO;
  repo.innerHTML = 'Repository <span aria-hidden="true">↗</span>';
  nav.append(repo);

  header.replaceChildren(brand, nav);
}
