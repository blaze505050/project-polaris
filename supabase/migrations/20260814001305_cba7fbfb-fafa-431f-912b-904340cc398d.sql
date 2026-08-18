CREATE TABLE public.school_outreach_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name text NOT NULL,
  contact_name text NOT NULL,
  contact_role text,
  email text NOT NULL,
  phone text,
  city text,
  student_count text,
  program_type text NOT NULL DEFAULT 'workshop',
  preferred_timeline text,
  message text,
  consent boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.school_outreach_requests TO anon, authenticated;
GRANT ALL ON public.school_outreach_requests TO service_role;
ALTER TABLE public.school_outreach_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can request a school collaboration" ON public.school_outreach_requests FOR INSERT TO anon, authenticated WITH CHECK (consent = true AND char_length(school_name) BETWEEN 1 AND 200 AND char_length(contact_name) BETWEEN 1 AND 120 AND char_length(email) BETWEEN 3 AND 200 AND char_length(coalesce(message, '')) <= 5000);

CREATE TABLE public.project_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'other',
  summary text NOT NULL,
  description text,
  team text,
  contact_email text NOT NULL,
  link text,
  stage text NOT NULL DEFAULT 'in_progress',
  consent boolean NOT NULL DEFAULT false,
  approved boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.project_submissions TO anon, authenticated;
GRANT INSERT ON public.project_submissions TO anon, authenticated;
GRANT ALL ON public.project_submissions TO service_role;
ALTER TABLE public.project_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a project" ON public.project_submissions FOR INSERT TO anon, authenticated WITH CHECK (consent = true AND approved = false AND published = false AND char_length(title) BETWEEN 1 AND 200 AND char_length(summary) BETWEEN 1 AND 1000 AND char_length(contact_email) BETWEEN 3 AND 200);
CREATE POLICY "Approved projects are public" ON public.project_submissions FOR SELECT TO anon, authenticated USING (approved = true AND published = true);

CREATE TRIGGER project_submissions_updated_at BEFORE UPDATE ON public.project_submissions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();