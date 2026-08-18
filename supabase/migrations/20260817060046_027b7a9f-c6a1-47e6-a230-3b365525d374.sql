CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  source text NOT NULL DEFAULT 'site',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX newsletter_subscribers_email_key ON public.newsletter_subscribers (lower(email));
GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated
WITH CHECK (char_length(email) >= 3 AND char_length(email) <= 200 AND char_length(source) <= 50);