CREATE TABLE public.vip_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  amount INTEGER NOT NULL DEFAULT 49000,
  is_vip BOOLEAN NOT NULL DEFAULT false,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.vip_requests TO anon;
GRANT INSERT ON public.vip_requests TO authenticated;
GRANT ALL ON public.vip_requests TO service_role;

ALTER TABLE public.vip_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a VIP request"
  ON public.vip_requests FOR INSERT TO anon, authenticated
  WITH CHECK (email IS NOT NULL AND char_length(email) BETWEEN 5 AND 200 AND is_vip = false);

CREATE INDEX vip_requests_email_idx ON public.vip_requests (lower(email));