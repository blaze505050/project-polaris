CREATE TABLE public.opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL,
  summary text NOT NULL,
  description text,
  what_you_do text[] NOT NULL DEFAULT '{}',
  who_can_apply text[] NOT NULL DEFAULT '{}',
  requirements text[] NOT NULL DEFAULT '{}',
  timeline text[] NOT NULL DEFAULT '{}',
  what_you_gain text[] NOT NULL DEFAULT '{}',
  faqs jsonb NOT NULL DEFAULT '[]'::jsonb,
  level text NOT NULL DEFAULT 'open_to_all',
  audience text NOT NULL DEFAULT 'open_to_all',
  status text NOT NULL DEFAULT 'open',
  start_date date,
  deadline date,
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.opportunities TO anon, authenticated;
GRANT ALL ON public.opportunities TO service_role;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published opportunities are public" ON public.opportunities FOR SELECT TO anon, authenticated USING (published = true);

CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  speaker text,
  speaker_note text,
  event_date date,
  registration_link text,
  status text NOT NULL DEFAULT 'past',
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.events TO anon, authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published events are public" ON public.events FOR SELECT TO anon, authenticated USING (published = true);

CREATE TABLE public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  description text,
  author text,
  url text,
  published_date date,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.resources TO anon, authenticated;
GRANT ALL ON public.resources TO service_role;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published resources are public" ON public.resources FOR SELECT TO anon, authenticated USING (published = true);

CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  age_group text,
  location text,
  role text NOT NULL,
  organisation text,
  interests text[] NOT NULL DEFAULT '{}',
  experience text,
  motivation text,
  link text,
  consent boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.applications TO anon, authenticated;
GRANT ALL ON public.applications TO service_role;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit an application" ON public.applications FOR INSERT TO anon, authenticated WITH CHECK (consent = true AND char_length(full_name) BETWEEN 1 AND 120 AND char_length(email) BETWEEN 3 AND 200);

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  topic text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can send a message" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (char_length(name) BETWEEN 1 AND 120 AND char_length(email) BETWEEN 3 AND 200 AND char_length(message) BETWEEN 1 AND 5000);

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER opportunities_updated_at BEFORE UPDATE ON public.opportunities FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER resources_updated_at BEFORE UPDATE ON public.resources FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.opportunities (title, slug, category, summary, description, what_you_do, who_can_apply, requirements, timeline, what_you_gain, faqs, level, audience, status, featured) VALUES
('Volunteer with Project Polaris', 'volunteer-with-project-polaris', 'volunteer',
 'Join the volunteer program and contribute to research, content, operations and community initiatives.',
 'Our volunteer program is the most direct way to become part of Project Polaris. Volunteers work inside one of our departments — Research, Content or Operations — and help run the initiatives that keep the community learning every week.',
 ARRAY['Work inside the Research, Content or Operations department','Support weekly sessions, Aaj Ka Gyan and Saturday Polls','Help create educational content for the community','Take ownership of a small piece of a real initiative'],
 ARRAY['School students','College students','Anyone who wants to learn by contributing'],
 ARRAY['A few consistent hours each week','Willingness to communicate and meet deadlines','No prior experience required'],
 ARRAY['Apply through the join form','Short introductory conversation','Department onboarding','Start contributing'],
 ARRAY['Real experience running educational initiatives','Mentorship from core members','Contribution points and recognition','Certificate and recommendation letter for sustained contribution'],
 '[{"q":"Do I need experience?","a":"No. We onboard volunteers with no prior experience and match tasks to your comfort level."},{"q":"How much time does it take?","a":"A few hours a week. We care more about consistency than volume."}]'::jsonb,
 'beginner','open_to_all','open', true),
('Student-Led Research Program', 'student-led-research-program', 'research',
 'Work on a student-led research project with guidance from the Research department.',
 'The Research department runs student-led research projects, literature reviews and scientific exploration, currently centred around space science. Participants learn how real research actually works: framing a question, reading existing work, verifying information and writing up findings.',
 ARRAY['Choose or join a research question','Run a structured literature review','Verify information and document sources','Write up and present findings to the community'],
 ARRAY['High-school students','College students','Anyone comfortable with reading and writing'],
 ARRAY['Curiosity and consistency','Basic reading and writing ability','Interest in space science, engineering or a related field'],
 ARRAY['Application','Research department onboarding','Project scoping with a mentor','Research and documentation','Community presentation'],
 ARRAY['A real research output with your name on it','Experience with evidence-based work','Guidance from mentors and peers','Recognition for completed projects'],
 '[{"q":"Is this only about space?","a":"Our current projects are centred around space science because that is where the community''s interest is strongest, but the program is not limited to it."},{"q":"Can school students join?","a":"Yes. We scope projects to the level of the participant."}]'::jsonb,
 'intermediate','open_to_all','open', true),
('Weekly Expert Sessions', 'weekly-expert-sessions', 'workshops',
 'Interactive sessions with researchers, professionals and educators — open to the whole community.',
 'We run sessions where practitioners share how their work actually happens. Past sessions have covered rocket development fundamentals and a conversation with an ISRO scientist, plus Cosmic Conversations — a discussion session with storytelling, a quiz and a constellation-hunting challenge.',
 ARRAY['Attend live sessions with experts','Ask questions directly','Take part in quizzes and challenges','Continue the discussion in the community'],
 ARRAY['Middle-school students','High-school students','College students','Anyone who wants to learn'],
 ARRAY['None — sessions are open to the community'],
 ARRAY['Join the community','Session announcements are shared in advance','Attend live'],
 ARRAY['Direct exposure to people doing the work','Practical understanding beyond textbooks','A community to keep learning with'],
 '[{"q":"Are the sessions free?","a":"Yes. Community sessions are open to members."},{"q":"When is the next session?","a":"Session dates are announced in the community ahead of time."}]'::jsonb,
 'open_to_all','open_to_all','ongoing', true),
('Innovation Projects', 'innovation-projects', 'projects',
 'Collaborative projects that solve real-world problems while building practical skills.',
 'Innovation projects are small teams building something real. The goal is not a perfect result — it is the experience of scoping a problem, building a solution, failing, improving and shipping.',
 ARRAY['Join a small project team','Scope a real problem','Build, test and iterate','Share what you built with the community'],
 ARRAY['School students','College students','Self-taught learners'],
 ARRAY['Willingness to build and to learn in public','Ability to work with a team'],
 ARRAY['Apply','Team formation','Build phase','Showcase'],
 ARRAY['A finished project you can point to','Teamwork and problem-solving experience','Feedback from mentors'],
 '[{"q":"What if my idea fails?","a":"That is part of it. We treat failed attempts as legitimate learning outcomes."}]'::jsonb,
 'intermediate','open_to_all','coming_soon', false),
('Become a Mentor', 'become-a-mentor', 'mentorship',
 'Guide students academically, professionally and personally — or run a session in your field.',
 'We are always looking for researchers, engineers, educators and professionals willing to spend a small amount of time with students who are genuinely curious. Mentorship can be a one-off session or ongoing guidance for a project team.',
 ARRAY['Run a workshop or speaker session','Guide a research or innovation project','Give feedback on student work','Advise on academic and career paths'],
 ARRAY['Researchers','Engineers and professionals','Educators','Graduate students'],
 ARRAY['Experience in your field','A small, predictable time commitment'],
 ARRAY['Reach out through the mentor form','Intro conversation with the core team','Scope your involvement','Begin'],
 ARRAY['Direct impact on students who rarely get access to practitioners','A structured, respectful environment for your time'],
 '[{"q":"How much time is expected?","a":"As little as one session. Ongoing mentorship is welcome but never assumed."}]'::jsonb,
 'open_to_all','open_to_all','open', false),
('Community Learning: Aaj Ka Gyan & Saturday Polls', 'community-learning', 'events',
 'Daily facts, weekly polls, discussions and learning challenges inside the Polaris community.',
 'Aaj Ka Gyan has been running since 12 June as a daily educational initiative in our community. Saturday Polls, discussions and quizzes keep the community learning between sessions.',
 ARRAY['Read and discuss the daily Aaj Ka Gyan','Take part in Saturday Polls','Join discussions and quizzes','Share what you are learning'],
 ARRAY['Open to everyone'],
 ARRAY['None'],
 ARRAY['Join the community','Start participating the same day'],
 ARRAY['A daily habit of learning something new','A peer group that is genuinely curious'],
 '[{"q":"Where does this happen?","a":"Inside the Project Polaris community."}]'::jsonb,
 'open_to_all','open_to_all','ongoing', false);

INSERT INTO public.events (title, description, speaker, speaker_note, event_date, status) VALUES
('Fundamentals of Rocket Development', 'Our very first session, covering the fundamentals of rocket development.', 'Mr. Prakhar Vishwakarma', 'Missile Man of MP', '2026-07-02', 'past'),
('Session with an ISRO Scientist', 'Our second session, attended by 22 participants.', 'Mr. Ankit Gupta', 'ISRO scientist', '2026-07-12', 'past'),
('Cosmic Conversations', 'A discussion session featuring storytelling, a quiz and a constellation-hunting challenge.', NULL, NULL, '2026-07-26', 'past');

INSERT INTO public.resources (title, category, description, author, published_date) VALUES
('Aaj Ka Gyan', 'educational-content', 'A daily educational initiative running inside the Polaris community since 12 June, sharing one fact or idea a day.', 'Project Polaris Content Department', '2026-06-12'),
('Saturday Polls', 'educational-content', 'A weekly poll that turns a question into a discussion across the community.', 'Project Polaris Content Department', NULL),
('Session Materials: Fundamentals of Rocket Development', 'session-materials', 'Notes and takeaways from our first expert session. Being prepared for publication.', 'Project Polaris Research Department', NULL),
('Research Guides', 'guides', 'Practical guides on how to run a literature review, verify sources and document findings. In progress.', 'Project Polaris Research Department', NULL);