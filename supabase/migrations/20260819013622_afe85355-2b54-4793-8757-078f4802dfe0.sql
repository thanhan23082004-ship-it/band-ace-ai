-- 1) Remove public read access to raw submissions
DROP POLICY IF EXISTS "Submissions are publicly readable" ON public.submissions;
REVOKE SELECT ON public.submissions FROM anon, authenticated;

-- 2) Tighten insert policy: signed-in users may only write their own user_id
DROP POLICY IF EXISTS "Anyone can record a submission" ON public.submissions;
CREATE POLICY "Learners can record their own submission"
ON public.submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(user_id) >= 16 AND char_length(user_id) <= 64
  AND char_length(display_name) >= 1 AND char_length(display_name) <= 60
  AND (auth.uid() IS NULL OR user_id = auth.uid()::text)
);

-- 3) Aggregated, non-identifying leaderboard feed
CREATE OR REPLACE FUNCTION public.get_leaderboard()
RETURNS TABLE (
  user_key text,
  name text,
  skill_group text,
  submission_count integer,
  avg_score numeric,
  best_score numeric
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    md5(s.user_id) AS user_key,
    max(s.display_name) AS name,
    CASE WHEN s.skill IN ('writing', 'speaking') THEN 'grading' ELSE 'practice' END AS skill_group,
    count(*)::integer AS submission_count,
    round(avg(s.score_overall), 2) AS avg_score,
    max(s.score_overall) AS best_score
  FROM public.submissions s
  WHERE s.created_at >= now() - interval '7 days'
  GROUP BY md5(s.user_id),
    CASE WHEN s.skill IN ('writing', 'speaking') THEN 'grading' ELSE 'practice' END
$$;

REVOKE ALL ON FUNCTION public.get_leaderboard() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_leaderboard() TO anon, authenticated;

-- 4) Own-submissions reader (unguessable local learner id acts as the bearer)
CREATE OR REPLACE FUNCTION public.get_my_submissions(_user_id text)
RETURNS TABLE (
  id uuid,
  prompt_id uuid,
  skill text,
  mode text,
  score_overall numeric,
  score_details jsonb,
  user_answers jsonb,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT s.id, s.prompt_id, s.skill, s.mode, s.score_overall, s.score_details, s.user_answers, s.created_at
  FROM public.submissions s
  WHERE char_length(_user_id) >= 16
    AND s.user_id = _user_id
  ORDER BY s.created_at DESC
  LIMIT 200
$$;

REVOKE ALL ON FUNCTION public.get_my_submissions(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_my_submissions(text) TO anon, authenticated;

-- 5) Harden vip_requests so no future read policy can leak emails to clients
REVOKE SELECT, UPDATE, DELETE ON public.vip_requests FROM anon, authenticated;
GRANT INSERT ON public.vip_requests TO anon, authenticated;
GRANT ALL ON public.vip_requests TO service_role;