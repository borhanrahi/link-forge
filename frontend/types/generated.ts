export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  email_verified: boolean;
  onboarding_completed: boolean;
  default_workspace_id?: string;
  created_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  plan: string;
  branding_enabled: boolean;
  custom_colors_enabled: boolean;
  member_count: number;
  created_at: string;
}

export interface Link {
  id: string;
  workspace_id: string;
  user_id: string;
  original_url: string;
  short_code: string;
  custom_alias?: string;
  title?: string;
  clicks_count: number;
  unique_clicks_count: number;
  is_active: boolean;
  is_cloaked: boolean;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Click {
  id: string;
  link_id: string;
  country_code?: string;
  city?: string;
  device_type?: string;
  browser?: string;
  os?: string;
  referrer?: string;
  clicked_at: string;
}

export interface BioPage {
  id: string;
  workspace_id: string;
  user_id: string;
  slug: string;
  title?: string;
  subtitle?: string;
  profile_image_url?: string;
  theme: string;
  brand_color: string;
  bg_color: string;
  font_family: string;
  is_published: boolean;
  seo_indexable: boolean;
  clicks_count: number;
  blocks: BioBlock[];
  created_at: string;
  updated_at: string;
}

export interface BioBlock {
  id: string;
  bio_page_id: string;
  block_type: string;
  label?: string;
  url?: string;
  icon?: string;
  image_url?: string;
  embed_html?: string;
  position: number;
  is_active: boolean;
  click_tracking_enabled: boolean;
  clicks_count: number;
}

export interface Subscription {
  id: string;
  workspace_id: string;
  plan: string;
  status: string;
  current_period_end?: string;
  cancel_at_period_end: boolean;
}

export interface Invoice {
  id: string;
  workspace_id: string;
  amount_due: number;
  amount_paid: number;
  currency: string;
  status: string;
  pdf_url?: string;
  invoice_date?: string;
}

export interface CustomDomain {
  id: string;
  workspace_id: string;
  domain: string;
  status: string;
  ssl_active: boolean;
  created_at: string;
}
