CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  email text,
  school text,
  grade text,
  interests text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.student_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course text NOT NULL DEFAULT 'Not enrolled yet',
  attendance_percent integer NOT NULL DEFAULT 0,
  assignments_completed integer NOT NULL DEFAULT 0,
  assignments_total integer NOT NULL DEFAULT 0,
  quiz_score integer NOT NULL DEFAULT 0,
  project_progress integer NOT NULL DEFAULT 0,
  mentor_feedback text,
  skills text[] NOT NULL DEFAULT '{}',
  portfolio_url text,
  certificate_status text NOT NULL DEFAULT 'not_started',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, course)
);
GRANT SELECT ON public.student_progress TO authenticated;
GRANT ALL ON public.student_progress TO service_role;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can view their own progress" ON public.student_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER student_progress_set_updated_at BEFORE UPDATE ON public.student_progress FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''), NEW.email)
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.student_progress (user_id, course)
  VALUES (NEW.id, 'Polaris Community Track')
  ON CONFLICT (user_id, course) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();