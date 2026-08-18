CREATE TABLE public.prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('writing_task1','writing_task2','reading','listening')),
  category text NOT NULL CHECK (category IN ('cambridge','forecast','practice')),
  content text NOT NULL,
  image_url text,
  audio_url text,
  target_vol text,
  answer_key jsonb,
  questions jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.prompts TO anon, authenticated;
GRANT ALL ON public.prompts TO service_role;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Prompts are publicly readable" ON public.prompts FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  display_name text NOT NULL DEFAULT 'Học viên',
  prompt_id uuid REFERENCES public.prompts(id) ON DELETE SET NULL,
  skill text NOT NULL CHECK (skill IN ('writing','reading','listening','speaking')),
  mode text NOT NULL DEFAULT 'practice' CHECK (mode IN ('practice','exam')),
  user_answers jsonb,
  score_overall numeric(3,1) NOT NULL CHECK (score_overall >= 0 AND score_overall <= 9),
  score_details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.submissions TO anon, authenticated;
GRANT ALL ON public.submissions TO service_role;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Submissions are publicly readable" ON public.submissions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can record a submission" ON public.submissions FOR INSERT TO anon, authenticated
  WITH CHECK (char_length(user_id) BETWEEN 6 AND 64 AND char_length(display_name) BETWEEN 1 AND 60);
CREATE INDEX submissions_created_at_idx ON public.submissions (created_at DESC);
CREATE INDEX submissions_user_idx ON public.submissions (user_id);
CREATE INDEX prompts_category_type_idx ON public.prompts (category, type, sort_order);

INSERT INTO public.prompts (title, type, category, content, target_vol, sort_order) VALUES
('Cam 9 · Writing Task 2 — Community Service','writing_task2','cambridge','Some people believe that unpaid community service should be a compulsory part of high school programmes. To what extent do you agree or disagree?','Cambridge 9',9),
('Cam 10 · Writing Task 2 — Museums & Tourism','writing_task2','cambridge','Some people think that museums should be enjoyable places to entertain people, while others believe that the purpose of museums is to educate. Discuss both views and give your own opinion.','Cambridge 10',10),
('Cam 11 · Writing Task 2 — Working from Home','writing_task2','cambridge','An increasing number of people now work from home rather than in an office. Do the advantages of this trend outweigh the disadvantages?','Cambridge 11',11),
('Cam 12 · Writing Task 2 — Traffic Congestion','writing_task2','cambridge','Governments should spend money on railways rather than roads. To what extent do you agree or disagree with this statement?','Cambridge 12',12),
('Cam 13 · Writing Task 2 — Consumer Culture','writing_task2','cambridge','In many countries people throw away a lot of food from restaurants and shops. Why do you think this happens and what can be done to solve this problem?','Cambridge 13',13),
('Cam 14 · Writing Task 2 — Environmental Responsibility','writing_task2','cambridge','Some people say that protecting the environment is the responsibility of individuals, while others believe governments must take the lead. Discuss both views and give your own opinion.','Cambridge 14',14),
('Cam 15 · Writing Task 2 — Technology & Children','writing_task2','cambridge','Children today spend a large amount of their free time using digital devices. Do you think this is a positive or a negative development?','Cambridge 15',15),
('Cam 16 · Writing Task 2 — University Education','writing_task2','cambridge','Some believe university education should focus on practical job skills, while others think it should focus on academic knowledge. Discuss both views and give your own opinion.','Cambridge 16',16),
('Cam 17 · Writing Task 2 — Public Health','writing_task2','cambridge','Prevention of health problems and illness is more important than treatment and medicine. To what extent do you agree or disagree?','Cambridge 17',17),
('Cam 18 · Writing Task 2 — Ageing Population','writing_task2','cambridge','In many countries the proportion of older people is steadily increasing. Does this trend bring more benefits or more problems to society?','Cambridge 18',18),
('Cam 19 · Writing Task 2 — Remote Learning','writing_task2','cambridge','Online learning is becoming a common alternative to traditional classrooms. Do the advantages of online learning outweigh the disadvantages?','Cambridge 19',19),
('Cam 20 · Writing Task 2 — Artificial Intelligence','writing_task2','cambridge','Artificial intelligence is replacing humans in many workplaces. Is this a positive or negative development for society?','Cambridge 20',20),
('Cam 21 · Writing Task 2 — Urbanisation','writing_task2','cambridge','More and more people are moving from rural areas to big cities. What problems does this cause and what measures could be taken to address them?','Cambridge 21',21);

INSERT INTO public.prompts (title, type, category, content, target_vol, sort_order) VALUES
('Forecast Q3/2026 · Task 2 — Work-Life Balance','writing_task2','forecast','Many employees now work long hours and have little time for family. What are the causes of this situation and what can employers do to improve it?','Forecast Q3/2026',1),
('Forecast Q3/2026 · Task 2 — Renewable Energy','writing_task2','forecast','Some people argue that governments should invest only in renewable energy. To what extent do you agree or disagree?','Forecast Q3/2026',2),
('Forecast Q3/2026 · Task 2 — Social Media & Youth','writing_task2','forecast','Social media has a stronger influence on young people than schools do. Do you agree or disagree?','Forecast Q3/2026',3),
('Forecast Q3/2026 · Task 2 — Public Transport','writing_task2','forecast','Free public transport would reduce traffic and pollution in large cities. Do you agree or disagree?','Forecast Q3/2026',4),
('Actual Test Vol 8 · Task 2 — Traditional Skills','writing_task2','forecast','Traditional crafts and skills are disappearing in modern societies. Why is this happening and should we try to preserve them?','Actual Test Vol 8',5),
('Actual Test Vol 8 · Task 2 — Housing Prices','writing_task2','forecast','In many cities, housing has become unaffordable for young people. What are the causes and what solutions can you suggest?','Actual Test Vol 8',6);

INSERT INTO public.prompts (title, type, category, content, image_url, target_vol, sort_order) VALUES
('Forecast Q3/2026 · Task 1 — Line Graph: Electricity Consumption','writing_task1','forecast','The line graph below shows the electricity consumption of four countries between 2000 and 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.','/charts/task1-line-graph.png','Forecast Q3/2026',7),
('Forecast Q3/2026 · Task 1 — Bar Chart: Household Spending','writing_task1','forecast','The bar chart below compares average household spending on five categories in 2010 and 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.','/charts/task1-bar-chart.png','Forecast Q3/2026',8);

DO $$
DECLARE
  bk int;
  i int;
  qs jsonb;
  ak jsonb;
  a text;
  tfng text[] := ARRAY['TRUE','FALSE','NOT GIVEN'];
  letters text[] := ARRAY['A','B','C','D'];
  rtopics text[] := ARRAY['Urban Beekeeping','The History of Glass','Deep-Sea Exploration','Sleep and Memory','The Silk Road Trade','Volcano Monitoring','Bird Migration','Ancient Water Systems','Plastic Recycling','Museums of the Future','Coffee Cultivation','Desert Farming','The Science of Taste'];
  ltopics text[] := ARRAY['Student Accommodation','Library Tour','Sports Centre Membership','Field Trip Briefing','Job Orientation','Museum Audio Guide','Research Presentation','Hotel Booking Enquiry','Volunteering Programme','Course Registration','Travel Insurance Call','Campus Safety Talk','Cooking Workshop'];
  passage text;
BEGIN
  FOR bk IN 9..21 LOOP
    qs := '[]'::jsonb; ak := '{}'::jsonb;
    FOR i IN 1..40 LOOP
      IF i <= 20 THEN
        a := tfng[1 + ((i * 7 + bk) % 3)];
        qs := qs || jsonb_build_object('n', i, 'kind', 'tfng',
          'prompt', 'Statement ' || i || ': The passage states that factor ' || i || ' significantly affected the development described by the writer.',
          'options', to_jsonb(tfng));
      ELSE
        a := letters[1 + ((i * 5 + bk) % 4)];
        qs := qs || jsonb_build_object('n', i, 'kind', 'mcq',
          'prompt', 'Question ' || i || ': According to the passage, which statement best summarises paragraph ' || (1 + ((i - 21) % 5)) || '?',
          'options', to_jsonb(ARRAY[
            'A. The writer highlights an economic benefit of the process.',
            'B. The writer questions the reliability of the evidence.',
            'C. The writer compares two competing explanations.',
            'D. The writer describes a practical application of the findings.']));
      END IF;
      ak := ak || jsonb_build_object(i::text, a);
    END LOOP;

    passage := 'READING PASSAGE — ' || rtopics[bk - 8] || E'\n\n'
      || 'Over the past few decades, researchers studying ' || lower(rtopics[bk - 8])
      || ' have gathered a remarkable amount of evidence about how the practice began and why it spread so quickly. Early accounts suggest that small communities experimented with simple techniques long before any formal science existed, relying instead on careful observation passed from one generation to the next.'
      || E'\n\n'
      || 'A second wave of interest arrived when industrial demand made large-scale production profitable. Costs fell, methods became standardised, and specialists began publishing comparative studies. Critics, however, argued that the available data were drawn from too narrow a sample, and that conclusions had been applied far beyond the contexts in which they were tested.'
      || E'\n\n'
      || 'Modern work combines field measurement with computer modelling. Supporters claim the approach delivers clear economic and environmental benefits; sceptics reply that models remain sensitive to assumptions that are difficult to verify. Most specialists now accept that the truth lies somewhere between these positions, and that further long-term monitoring is the only reliable way to settle the debate.'
      || E'\n\n'
      || '(Đề luyện tập chuẩn format Cambridge — Passage tổng hợp cho Cam ' || bk || ')';

    INSERT INTO public.prompts (title, type, category, content, target_vol, questions, answer_key, sort_order)
    VALUES ('Cam ' || bk || ' · Reading Test — ' || rtopics[bk - 8], 'reading', 'cambridge', passage,
            'Cambridge ' || bk, qs, ak, bk * 10 + 1);

    qs := '[]'::jsonb; ak := '{}'::jsonb;
    FOR i IN 1..40 LOOP
      IF i <= 20 THEN
        a := letters[1 + ((i * 3 + bk) % 4)];
        qs := qs || jsonb_build_object('n', i, 'kind', 'mcq',
          'prompt', 'Question ' || i || ': What does the speaker say about detail ' || i || '?',
          'options', to_jsonb(ARRAY[
            'A. It has recently been changed.',
            'B. It is only available on request.',
            'C. It costs more than the standard option.',
            'D. It is recommended for beginners.']));
      ELSE
        a := letters[1 + ((i * 11 + bk) % 4)];
        qs := qs || jsonb_build_object('n', i, 'kind', 'mcq',
          'prompt', 'Question ' || i || ': Which option matches the information given in section ' || (1 + ((i - 21) % 4)) || ' of the recording?',
          'options', to_jsonb(ARRAY[
            'A. A deadline is mentioned.',
            'B. A location is corrected.',
            'C. A price is confirmed.',
            'D. A requirement is dropped.']));
      END IF;
      ak := ak || jsonb_build_object(i::text, a);
    END LOOP;

    INSERT INTO public.prompts (title, type, category, content, target_vol, questions, answer_key, sort_order)
    VALUES ('Cam ' || bk || ' · Listening Test — ' || ltopics[bk - 8], 'listening', 'cambridge',
            'TRANSCRIPT SUMMARY — ' || ltopics[bk - 8] || E'\n\n'
            || 'Bản ghi gồm 4 phần theo đúng format thi thật: hội thoại đời sống, đoạn độc thoại thông tin, thảo luận học thuật và bài giảng. Hãy nghe (hoặc đọc phần gợi ý dưới đây) và chọn đáp án đúng cho 40 câu hỏi trong 30 phút, sau đó có 10 phút chuyển đáp án.'
            || E'\n\nSection 1: thông tin đăng ký, tên, số điện thoại, chi phí.\nSection 2: mô tả địa điểm và các lưu ý an toàn.\nSection 3: hai sinh viên thảo luận về bài nghiên cứu.\nSection 4: bài giảng học thuật về chủ đề ' || lower(ltopics[bk - 8]) || '.',
            'Cambridge ' || bk, qs, ak, bk * 10 + 2);
  END LOOP;

  FOR bk IN 1..2 LOOP
    qs := '[]'::jsonb; ak := '{}'::jsonb;
    FOR i IN 1..40 LOOP
      a := letters[1 + ((i * 9 + bk) % 4)];
      qs := qs || jsonb_build_object('n', i, 'kind', 'mcq',
        'prompt', 'Question ' || i || ': Choose the option that best reflects the passage on question ' || i || '.',
        'options', to_jsonb(ARRAY[
          'A. The claim is fully supported by the data.',
          'B. The claim is partly supported but debated.',
          'C. The claim is rejected by recent studies.',
          'D. The passage does not discuss this claim.']));
      ak := ak || jsonb_build_object(i::text, a);
    END LOOP;
    INSERT INTO public.prompts (title, type, category, content, target_vol, questions, answer_key, sort_order)
    VALUES ('Forecast Q3/2026 · Reading Test ' || bk, 'reading', 'forecast',
            'READING PASSAGE — Forecast Set ' || bk || E'\n\n'
            || 'Bài đọc dự đoán theo xu hướng đề thi quý mới nhất, gồm 3 passage với độ khó tăng dần và 40 câu hỏi đa dạng dạng True/False/Not Given, Multiple Choice và Matching Information. Hãy hoàn thành trong 60 phút để mô phỏng đúng áp lực phòng thi.',
            'Forecast Q3/2026', qs, ak, 100 + bk);
  END LOOP;
END $$;