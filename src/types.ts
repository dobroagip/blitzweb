// src/types.ts

export type Language = 'en' | 'ua';

export type Page =
  | 'home'
  | 'services'
  | 'portfolio'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'cookies'
  | 'admin';

export interface SeoData {
  title: string;
  description: string;
  keywords: string;
}

export interface TeamMember {
  name: string;
  role: string;
  desc: string;
  image: string;
}

export interface PageContent {
  seo: SeoData;
  hero?: {
    title: string;
    subtitle: string;
    cta: string;
  };
  story?: {
    title: string;
    p1: string;
    p2: string;
  };
  team?: {
    title: string;
    members: TeamMember[];
  };
}

export interface Translation {
  nav: Record<Page, string>;
  common: {
    changeLang: string;
    startProject: string;
    footerText: string;
    rights: string;
  };
  contactForm: any;
  footerLinks: any;
  pages: Record<Page, PageContent>;
  servicesList?: Array<{ title: string; desc: string; icon: string }>;
  utp?: {
    title: string;
    subtitle: string;
    items: { title: string; desc: string }[];
  };
  process?: {
    title: string;
    steps: { title: string; desc: string }[];
  };
}
