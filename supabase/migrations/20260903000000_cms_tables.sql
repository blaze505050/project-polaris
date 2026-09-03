-- Migration: Create CMS tables with RLS and initial seed data for Project Polaris
-- Tables: programs, past_sessions, articles, spotlights

-- Helper function to evaluate administrator privileges via app_metadata or official email
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    OR (auth.jwt() ->> 'email') = 'project.polaris8@gmail.com'
    OR (auth.jwt() ->> 'email') LIKE '%@projectpolaris.in',
    false
  );
$$;

-- 1. Programs Table
CREATE TABLE IF NOT EXISTS public.programs (
  id text PRIMARY KEY,
  title text NOT NULL,
  subtitle text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'workshop',
  status text NOT NULL DEFAULT 'upcoming',
  date text NOT NULL,
  time text,
  mode text NOT NULL DEFAULT 'Online',
  speaker jsonb,
  details text NOT NULL DEFAULT '',
  benefits text[] NOT NULL DEFAULT '{}',
  cta_text text NOT NULL DEFAULT 'Register Now →',
  cta_url text NOT NULL DEFAULT '#',
  featured boolean NOT NULL DEFAULT false,
  visibility boolean NOT NULL DEFAULT true,
  price text DEFAULT 'Free',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.programs TO anon, authenticated;
GRANT ALL ON public.programs TO authenticated, service_role;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view visible programs"
  ON public.programs FOR SELECT
  TO anon, authenticated
  USING (visibility = true OR public.is_admin());

CREATE POLICY "Admins have full access to programs"
  ON public.programs FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 2. Past Sessions Table
CREATE TABLE IF NOT EXISTS public.past_sessions (
  id text PRIMARY KEY,
  title text NOT NULL,
  date text NOT NULL,
  speaker text NOT NULL,
  designation text NOT NULL,
  speaker_linkedin text,
  topic text NOT NULL DEFAULT '',
  participants text NOT NULL DEFAULT '',
  summary text NOT NULL DEFAULT '',
  photo text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.past_sessions TO anon, authenticated;
GRANT ALL ON public.past_sessions TO authenticated, service_role;
ALTER TABLE public.past_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view past sessions"
  ON public.past_sessions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins have full access to past sessions"
  ON public.past_sessions FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 3. Articles Table
CREATE TABLE IF NOT EXISTS public.articles (
  id text PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  author jsonb NOT NULL DEFAULT '{"name": "Polaris Editorial", "role": "Contributor"}'::jsonb,
  category text NOT NULL DEFAULT 'Science & Astronomy',
  published_at text NOT NULL,
  read_time text NOT NULL DEFAULT '5 min read',
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.articles TO anon, authenticated;
GRANT ALL ON public.articles TO authenticated, service_role;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published articles"
  ON public.articles FOR SELECT
  TO anon, authenticated
  USING (published = true OR public.is_admin());

CREATE POLICY "Admins have full access to articles"
  ON public.articles FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4. Spotlights Table
CREATE TABLE IF NOT EXISTS public.spotlights (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Student Spotlight',
  headline text NOT NULL DEFAULT '',
  story text NOT NULL DEFAULT '',
  accomplishment text NOT NULL DEFAULT '',
  contribution_to_polaris text,
  image text NOT NULL DEFAULT '/polaris-logo.png',
  featured boolean NOT NULL DEFAULT false,
  date text NOT NULL DEFAULT '',
  links jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.spotlights TO anon, authenticated;
GRANT ALL ON public.spotlights TO authenticated, service_role;
ALTER TABLE public.spotlights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view spotlights"
  ON public.spotlights FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins have full access to spotlights"
  ON public.spotlights FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Triggers for automatic updated_at timestamp
CREATE TRIGGER programs_updated_at BEFORE UPDATE ON public.programs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER past_sessions_updated_at BEFORE UPDATE ON public.past_sessions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER spotlights_updated_at BEFORE UPDATE ON public.spotlights FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed initial programs
INSERT INTO public.programs (id, title, subtitle, category, status, date, time, mode, speaker, details, benefits, cta_text, cta_url, featured, visibility, price)
VALUES
('star-universe-aug29', 'Exploring the Star Universe: A Journey into the Wonders of Astronomy', 'Join us for an engaging astronomy session as we embark on a journey through the fascinating world of stars and cosmos.', 'workshop', 'upcoming', '29 August 2026', '6:00 PM IST', 'Online', '{"name": "Scientist Baldev Krishan Sharma", "designation": "Cosmo-scientist and Author", "bio": "Distinguished researcher in astrophysical cosmos modeling and author of comprehensive cosmological works."}'::jsonb, 'Whether you are an astronomy enthusiast or simply curious about the Universe, this session is an opportunity to explore the fascinating world of astronomy and deepen your understanding of the cosmos.', ARRAY['Chance to interact with expert scientist','Chance to interact with like-minded enthusiasts','Explore the COSMOS','Participation certificates for all','Rewards (To be revealed soon)','Interactive Q&A session'], 'Register Now →', 'https://forms.gle/EaZUGjUd7spcQfoF7', true, true, '100% Free'),
('polaris-volunteer-cohort', 'Build Polaris With Us (Volunteer Program)', 'Polaris isn''t built only for students. It''s built with students.', 'initiative', 'active', 'Cohort Open', NULL, 'Online', NULL, 'Join as a student volunteer across 4 core departments (Operations, Outreach, Research, Content & Design) to build real initiatives.', ARRAY['Hands-on project leadership','Direct collaboration with core team','Merit-based verification & recommendation'], 'Apply as Volunteer →', 'https://drive.google.com/file/d/1YxoWvwXBQvJQ9gewJyEYhez-C1NpLPph/view?usp=drive_link', false, true, 'Free & Open'),
('innovation-program-soon', 'Polaris Innovation Program', 'Long-term cohorts solving meaningful problems and building tangible projects.', 'bootcamp', 'coming-soon', 'Coming Soon', NULL, 'Online', NULL, 'Collaborative cohorts where student squads develop projects and practical prototypes.', ARRAY['TBD'], 'Details to be disclosed soon', '#', false, true, 'TBD'),
('chapter-lead-soon', 'Chapter Lead Program', 'Establish and lead an official Polaris Space Chapter at your school or university.', 'initiative', 'coming-soon', 'Coming Soon', NULL, 'Hybrid', NULL, 'Lead astronomy observation sessions, workshops, and science culture in Tier-2, Tier-3 cities and remote regions.', ARRAY['TBD'], 'Launching Soon', '/chapters', false, true, 'TBD'),
('mentor-panel-soon', 'Mentor Panel & Fellowships', 'Guidance and interactive reviews from experienced scientists, researchers, and mentors.', 'course', 'coming-soon', 'Coming Soon', NULL, 'Online', NULL, 'Direct technical guidance and reviews on student science projects, simulations, and research.', ARRAY['TBD'], 'Coming Soon', '#', false, true, 'TBD')
ON CONFLICT (id) DO NOTHING;

-- Seed initial past sessions
INSERT INTO public.past_sessions (id, title, date, speaker, designation, speaker_linkedin, topic, participants, summary)
VALUES
('session-1', 'Fundamentals of Rocket Development', '2 July 2026', 'Prakhar Vishwakarma', 'Missile Man of MP', 'https://www.linkedin.com/in/prakharmissileman?utm_source=share_via&utm_content=profile&utm_medium=member_android', 'Fundamentals of Rocket Development & Space Technology', '5+ Participants', 'Project Polaris began its journey with its very first session, introducing students to the fundamentals of rocket development and space technology. Mr. Prakhar Vishwakarma shared insights into how rockets are designed and developed, while also discussing his own experiences and projects in the field. The session aimed to make rocketry more accessible to students and encourage them to explore aerospace beyond the boundaries of traditional classroom learning.'),
('session-2', 'How to Pursue Your Career in ISRO', '12 July 2026', 'Ankit Gupta', 'Scientist/Engineer ''SC'', Master Control Facility, ISRO', 'https://www.linkedin.com/in/ankit-gupta-703b99227?utm_source=share_via&utm_content=profile&utm_medium=member_android', 'How to Pursue Your Career in ISRO & Spacecraft Systems', '22+ Participants', 'Our second session featured Mr. Ankit Gupta, Scientist/Engineer ''SC'' at ISRO, who took students through his journey from developing an early interest in aircraft and space to pursuing Aerospace Engineering and eventually working at ISRO''s Master Control Facility. Students gained insights into ISRO''s work across communication, weather forecasting, navigation, Earth observation, space science, and future missions. The session also introduced students to the lesser-known aspects of space missions after launch, including satellite tracking, orbit determination, collision avoidance, station keeping, and space situational awareness. It concluded by highlighting the diverse career pathways within the space sector, spanning engineering, physics, mathematics, computer science, AI, and data science.'),
('session-3', 'Cosmic Conversations', '26 July 2026', 'Project Polaris Team', 'Interactive Discussion', 'https://www.linkedin.com/company/project-polaris/', 'Cosmic Conversations & Night Sky Exploration', '10–12+ Participants', 'Our third session, Cosmic Conversations, moved beyond the traditional lecture format into an interactive exploration of space and astronomy. Through storytelling, quizzes, discussions, and a constellation-hunting challenge, participants explored the night sky while actively engaging with one another. The session was designed to make astronomy more experiential and encourage students to observe, question, and connect scientific concepts with the world around them.'),
('session-4', 'Dive into the World of Galaxies & Nebulae', '9 August 2026', 'Vranda Gupta', 'Founder, Stellar Freaks', 'https://www.linkedin.com/in/vranda-gupta-b34b742a7/', 'Dive into the World of Galaxies & Nebulae', '60+ Participants', 'The fourth session marked a major milestone for Project Polaris, bringing together 60+ participants for an interactive journey through galaxies, nebulae, and stellar evolution. Ms. Vranda Gupta introduced students to the different types and structures of galaxies, including our own Milky Way, before exploring nebulae as both stellar nurseries and remnants of dying stars. Quizzes, rapid-fire facts, discussions, and hands-on activities kept participants actively involved throughout the session. The session concluded with a Build-a-Galaxy Challenge, where participants designed and presented their own fictional galaxies, deciding their characteristics, appearance, and unique identities.'),
('session-5', 'Exploring the Star Universe: A Journey into the Wonders of Astronomy', '29 August 2026', 'Dr. Baldev Krishna Sharma', 'Cosmologist & Astrophysicist', 'https://www.linkedin.com/in/scientist-baldevkrishan-sharma-0343324?utm_source=share_via&utm_content=profile&utm_medium=member_android', 'Exploring the Star Universe: A Journey into the Wonders of Astronomy', '90+ Participants', 'Our fifth session marked another significant milestone in the journey of Project Polaris, with 90+ participants joining us for an exploration of the Universe with renowned cosmologist and astrophysicist Dr. Baldev Krishna Sharma. The session took students beyond individual celestial objects to explore the broader Universe — from stars and galaxies to cosmology and the questions that continue to shape our understanding of space. Through expert insights and scientific discussion, participants gained a deeper perspective on the scale, complexity, and mysteries of the Universe. The growing participation in this session reflected Project Polaris''s expanding community and the increasing curiosity among students to explore astronomy and space science beyond the classroom.')
ON CONFLICT (id) DO NOTHING;

-- Seed initial articles
INSERT INTO public.articles (id, title, slug, author, category, published_at, read_time, excerpt, content, featured, published)
VALUES
('art-1', 'Understanding Transonic Compressibility: Why Airfoils Shock', 'understanding-transonic-compressibility', '{"name": "Polaris Aerodynamics Squad", "role": "Student Research Cohort"}'::jsonb, 'Science & Astronomy', '20 August 2026', '5 min read', 'A computational breakdown of Mach numbers, critical drag rise, and how shockwaves form over supercritical wings in transonic flow.', 'When an aircraft approaches Mach 1, local airflow over the curved suction surface reaches supersonic velocity while the freestream velocity is still subsonic...', true, true),
('art-2', 'Keplerian Mechanics to N-Body Numerical Integration', 'keplerian-mechanics-to-n-body', '{"name": "Polaris Orbital Mechanics Group", "role": "Simulation Contributor"}'::jsonb, 'Research', '15 August 2026', '7 min read', 'Why classical two-body equations fail for Lagrange point transfers, and how Runge-Kutta 4th order solvers bridge the gap.', 'Classical orbital mechanics assumes a central gravitational field. In three-body regimes like the Earth-Moon Lagrangian points L1 and L2...', false, true),
('art-3', 'Building Experiential Engineering Cohorts from Tier-2 Cities', 'building-experiential-cohorts', '{"name": "Project Polaris Editorial", "role": "Ecosystem Note"}'::jsonb, 'Student Perspectives', '10 August 2026', '4 min read', 'How peer-to-peer open computational simulations eliminate geography and economic barriers in aerospace learning.', 'Curiosity has no pin code. When students have access to browser-based physics workstations, they build aerodynamic mesh solvers from anywhere...', false, true)
ON CONFLICT (id) DO NOTHING;

-- Seed initial spotlights
INSERT INTO public.spotlights (id, name, category, headline, story, accomplishment, contribution_to_polaris, image, featured, date, links)
VALUES
('spot-1', 'AeroForge AI Simulation Workstation', 'Project Spotlight', 'Building 40+ Browser-Based Numerical Solvers for Aerospace Explorers', 'The AeroForge initiative was built to provide free, high-fidelity computational fluid dynamics, structural finite element analysis, and orbital Keplerian simulation directly in modern web browsers without requiring complex supercomputing clusters.', 'Engineered 40+ physics solvers with WebGL 2.0 visualization, used across student workshops and research cohorts.', 'Flagship open-source simulation tool powering Project Polaris practical learning cohorts.', '/polaris-logo.png', true, 'August 2026', '[{"label": "Launch AeroForge", "url": "/aeroforge"}, {"label": "View Source Code", "url": "https://github.com/blaze505050/project-polaris"}]'::jsonb),
('spot-2', 'Galaxies & Nebulae Interactive Cohort', 'Winner Spotlight', '60+ Students Successfully Map Deep Space Nebula Spectroscopy', 'During our fourth masterclass, participants analyzed real astronomical spectral lines to identify chemical compositions of star-forming regions.', 'Highest single-session attendance and verified participation certificates issued to 60+ active learners.', 'Validated the experiential live masterclass model with active quizzes and hands-on exercises.', '/night-observation.webp', false, '9 August 2026', '[]'::jsonb),
('spot-3', 'Student Volunteer Operations Squad', 'Team Spotlight', '28+ Contributors Building Operations, Outreach, and Content', 'From scheduling ISRO scientist sessions to preparing study guides and computational models, our student volunteers power every single Polaris program.', 'Coordinated 4 interactive workshops reaching 1,000+ students across India.', 'The backbone of community moderation, outreach partnerships, and cohort onboarding.', '/students-building.webp', false, 'July - August 2026', '[]'::jsonb)
ON CONFLICT (id) DO NOTHING;
