-- Create a function to get leaderboard data securely
CREATE OR REPLACE FUNCTION public.get_leaderboard()
RETURNS TABLE (
  user_id uuid,
  full_name text,
  avatar_url text,
  department text,
  courses_completed bigint,
  average_score numeric,
  total_points bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.user_id,
    p.full_name,
    p.avatar_url,
    p.department,
    COUNT(DISTINCT c.id) as courses_completed,
    COALESCE(ROUND(AVG(ta.score)::numeric, 1), 0) as average_score,
    (COUNT(DISTINCT c.id) * 100 + COALESCE(SUM(CASE WHEN ta.passed THEN ta.score ELSE 0 END), 0))::bigint as total_points
  FROM public.profiles p
  LEFT JOIN public.certificates c ON c.user_id = p.user_id
  LEFT JOIN public.test_attempts ta ON ta.user_id = p.user_id AND ta.passed = true
  GROUP BY p.user_id, p.full_name, p.avatar_url, p.department
  ORDER BY total_points DESC, courses_completed DESC
  LIMIT 50
$$;