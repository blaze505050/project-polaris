-- Migration: Create team_members table with RLS and initial seed data
-- Table: team_members

CREATE TABLE IF NOT EXISTS public.team_members (
  id text PRIMARY KEY,
  name text NOT NULL,
  department text NOT NULL,
  role text NOT NULL,
  intro text NOT NULL DEFAULT '',
  what_i_bring text NOT NULL DEFAULT '',
  photo text,
  linkedin text,
  orbit_radius double precision NOT NULL DEFAULT 180,
  orbit_angle double precision NOT NULL DEFAULT 1.0,
  speed double precision NOT NULL DEFAULT 0.0005,
  visibility boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.team_members TO anon, authenticated;
GRANT ALL ON public.team_members TO authenticated, service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view visible team members"
  ON public.team_members FOR SELECT
  TO anon, authenticated
  USING (visibility = true OR public.is_admin());

CREATE POLICY "Admins have full access to team members"
  ON public.team_members FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Seed initial team members
INSERT INTO public.team_members (id, name, department, role, intro, what_i_bring, photo, linkedin, orbit_radius, orbit_angle, speed, visibility)
VALUES
  (
    'engineering-lead',
    'Engineering Squad',
    'Simulation & Systems',
    'Aerospace & Systems Engineering',
    'Computational physics, aerodynamics, and rocketry tools built by students for students to explore real-world mechanics.',
    'Architecting numerical simulation engines, software platforms, and scientific workflows.',
    NULL,
    NULL,
    130,
    0.2,
    0.0006,
    true
  ),
  (
    'operations-lead',
    'Core Operations',
    'Operations & Logistics',
    'Program & Logistics Lead',
    'Managing session timelines, scientist masterclasses, student cohort registration, and certificate verification.',
    'Ensuring smooth execution of every workshop and real-time student support.',
    NULL,
    NULL,
    190,
    1.8,
    -0.0004,
    true
  ),
  (
    'research-lead',
    'Research Cohort',
    'Scientific Research',
    'Research & Simulation Fellow',
    'Guiding students through formulating research hypotheses, data collection, and peer-reviewed technical paper preparation.',
    'Bridging textbook theory with numerical CFD and orbital trajectory verification.',
    NULL,
    NULL,
    240,
    3.4,
    0.0003,
    true
  ),
  (
    'outreach-lead',
    'Outreach & Partnerships',
    'Community & Schools',
    'Institutional Outreach Lead',
    'Connecting Project Polaris with schools, colleges, and astronomy clubs across Tier-2 and Tier-3 cities.',
    'Expanding access to space science for students without institutional infrastructure.',
    NULL,
    NULL,
    160,
    4.8,
    -0.0005,
    true
  ),
  (
    'content-lead',
    'Content & Design',
    'Design & Publications',
    'Media & Publications Lead',
    'Crafting technical explainers, Aaj Ka Gyan drops, and open educational resources.',
    'Translating complex aerospace concepts into engaging, digestible visual knowledge.',
    NULL,
    NULL,
    210,
    5.9,
    0.0004,
    true
  )
ON CONFLICT (id) DO NOTHING;
