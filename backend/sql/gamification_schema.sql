-- CareerLens Gamification schema (PostgreSQL / Neon)

CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE,
  description VARCHAR(500) NOT NULL DEFAULT '',
  icon VARCHAR(40) NOT NULL DEFAULT 'book-open',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quizzes (
  id BIGSERIAL PRIMARY KEY,
  category_id BIGINT NOT NULL
    REFERENCES categories(id) ON DELETE RESTRICT,
  title VARCHAR(160) NOT NULL,
  description VARCHAR(1000) NOT NULL DEFAULT '',
  difficulty VARCHAR(20) NOT NULL DEFAULT 'beginner'
    CHECK (difficulty IN ('beginner','intermediate','advanced')),
  time_limit_seconds INTEGER NOT NULL DEFAULT 600
    CHECK (time_limit_seconds BETWEEN 30 AND 7200),
  total_marks INTEGER NOT NULL DEFAULT 0
    CHECK (total_marks >= 0),
  reward_xp INTEGER NOT NULL DEFAULT 40
    CHECK (reward_xp BETWEEN 0 AND 10000),
  reward_credits INTEGER NOT NULL DEFAULT 1
    CHECK (reward_credits BETWEEN 0 AND 20),
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','active','inactive')),
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_by VARCHAR(320) NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (category_id, title)
);

CREATE INDEX IF NOT EXISTS quizzes_status_schedule_idx
  ON quizzes(status, starts_at, ends_at);

CREATE INDEX IF NOT EXISTS quizzes_category_idx
  ON quizzes(category_id);

CREATE TABLE IF NOT EXISTS questions (
  id BIGSERIAL PRIMARY KEY,
  quiz_id BIGINT NOT NULL
    REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL
    CHECK (
      jsonb_typeof(options) = 'array'
      AND jsonb_array_length(options) = 4
    ),
  correct_option SMALLINT NOT NULL
    CHECK (correct_option BETWEEN 0 AND 3),
  explanation TEXT NOT NULL DEFAULT '',
  marks INTEGER NOT NULL DEFAULT 1
    CHECK (marks BETWEEN 1 AND 100),
  position INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (quiz_id, position)
);

CREATE INDEX IF NOT EXISTS questions_quiz_position_idx
  ON questions(quiz_id, position, id);

CREATE TABLE IF NOT EXISTS games (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  game_type VARCHAR(40) NOT NULL DEFAULT 'typing_sprint'
    CHECK (game_type IN ('typing_sprint')),
  description VARCHAR(1000) NOT NULL DEFAULT '',
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  reward_xp INTEGER NOT NULL DEFAULT 20
    CHECK (reward_xp BETWEEN 0 AND 10000),
  reward_credits INTEGER NOT NULL DEFAULT 1
    CHECK (reward_credits BETWEEN 0 AND 10),
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','active','inactive')),
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_by VARCHAR(320) NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS games_status_schedule_idx
  ON games(status, starts_at, ends_at);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id BIGSERIAL PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  user_name VARCHAR(160) NOT NULL DEFAULT 'CareerLens Learner',
  quiz_id BIGINT NOT NULL
    REFERENCES quizzes(id) ON DELETE RESTRICT,
  score INTEGER NOT NULL DEFAULT 0,
  total_marks INTEGER NOT NULL DEFAULT 0,
  time_taken_seconds INTEGER NOT NULL DEFAULT 0,
  accuracy NUMERIC(5,2) NOT NULL DEFAULT 0,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  credits_earned INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'in_progress'
    CHECK (status IN ('in_progress','completed','expired')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS quiz_attempts_user_date_idx
  ON quiz_attempts(user_id, completed_at DESC);

CREATE INDEX IF NOT EXISTS quiz_attempts_quiz_status_idx
  ON quiz_attempts(quiz_id, status);

CREATE TABLE IF NOT EXISTS game_scores (
  id BIGSERIAL PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  user_name VARCHAR(160) NOT NULL DEFAULT 'CareerLens Learner',
  game_id BIGINT NOT NULL
    REFERENCES games(id) ON DELETE RESTRICT,
  score INTEGER NOT NULL DEFAULT 0,
  max_score INTEGER NOT NULL DEFAULT 100,
  level INTEGER NOT NULL DEFAULT 1,
  challenge_text TEXT NOT NULL DEFAULT '',
  time_limit_seconds INTEGER NOT NULL DEFAULT 90
    CHECK (time_limit_seconds BETWEEN 30 AND 300),
  time_taken_seconds INTEGER NOT NULL DEFAULT 0,
  accuracy NUMERIC(5,2) NOT NULL DEFAULT 0,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  credits_earned INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'in_progress'
    CHECK (status IN ('in_progress','completed','expired')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS game_scores_user_date_idx
  ON game_scores(user_id, completed_at DESC);

CREATE INDEX IF NOT EXISTS game_scores_game_status_idx
  ON game_scores(game_id, status);

CREATE TABLE IF NOT EXISTS reward_rules (
  id BIGSERIAL PRIMARY KEY,
  rule_key VARCHAR(80) NOT NULL UNIQUE,
  title VARCHAR(160) NOT NULL,
  condition_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  reward_xp INTEGER NOT NULL DEFAULT 0
    CHECK (reward_xp BETWEEN 0 AND 10000),
  reward_credits INTEGER NOT NULL DEFAULT 0
    CHECK (reward_credits BETWEEN 0 AND 20),
  limit_count INTEGER NOT NULL DEFAULT 0
    CHECK (limit_count >= 0),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reward_transactions (
  id BIGSERIAL PRIMARY KEY,
  event_key VARCHAR(160) NOT NULL UNIQUE,
  user_id VARCHAR(64) NOT NULL,
  source_type VARCHAR(40) NOT NULL,
  source_id VARCHAR(80) NOT NULL,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  credits_earned INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','applied','failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  applied_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS reward_transactions_user_date_idx
  ON reward_transactions(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS reward_transactions_pending_idx
  ON reward_transactions(status, created_at);

-- Initial categories
INSERT INTO categories (name, description, icon) VALUES
  ('Aptitude', 'Quantitative aptitude and logical reasoning', 'brain'),
  ('Programming', 'Java, JavaScript, Python and coding fundamentals', 'code-2'),
  ('DSA', 'Data structures and algorithms', 'network'),
  ('Database', 'SQL, DBMS and data modelling', 'database'),
  ('Web Development', 'HTML, CSS, React and backend development', 'globe')
ON CONFLICT (name) DO NOTHING;

-- Configurable default reward rules
INSERT INTO reward_rules (
  rule_key, title, condition_data,
  reward_xp, reward_credits, limit_count, is_active
)
VALUES
  (
    'quiz_completion',
    'Quiz completion reward',
    '{"min_accuracy":70,"daily_credit_cap":3,"daily_xp_cap":200,"min_duration_seconds":15}',
    40, 1, 3, TRUE
  ),
  (
    'typing_sprint',
    'Typing sprint reward',
    '{"min_accuracy":75,"daily_credit_cap":2,"daily_xp_cap":100,"min_duration_seconds":10}',
    20, 1, 2, TRUE
  )
ON CONFLICT (rule_key) DO NOTHING;

-- Sample quiz: Java Basics
INSERT INTO quizzes (
  category_id, title, description, difficulty,
  time_limit_seconds, total_marks, reward_xp,
  reward_credits, status, created_by
)
SELECT
  c.id,
  'Java Basics',
  'Core Java and OOP fundamentals for placement preparation.',
  'beginner',
  300, 4, 40, 1, 'active', 'CareerLens Seed'
FROM categories c
WHERE c.name = 'Programming'
ON CONFLICT (category_id, title) DO NOTHING;

-- Sample quiz: SQL Fundamentals
INSERT INTO quizzes (
  category_id, title, description, difficulty,
  time_limit_seconds, total_marks, reward_xp,
  reward_credits, status, created_by
)
SELECT
  c.id,
  'SQL Fundamentals',
  'Practice SQL basics, filtering and aggregation.',
  'beginner',
  300, 4, 40, 1, 'active', 'CareerLens Seed'
FROM categories c
WHERE c.name = 'Database'
ON CONFLICT (category_id, title) DO NOTHING;

-- Java Basics questions
INSERT INTO questions (
  quiz_id, question_text, options, correct_option,
  explanation, marks, position
)
SELECT
  q.id,
  v.question_text,
  v.options::jsonb,
  v.correct_option,
  v.explanation,
  1,
  v.position
FROM quizzes q
CROSS JOIN (
  VALUES
  (
    'Which keyword is used to inherit a class in Java?',
    '["this","super","extends","implements"]',
    2,
    'The extends keyword establishes class inheritance.',
    1
  ),
  (
    'Which method is the usual entry point of a Java application?',
    '["start()","main()","run()","init()"]',
    1,
    'The JVM starts a standard Java application from main(String[] args).',
    2
  ),
  (
    'Which concept allows the same method name to have different parameter lists?',
    '["Encapsulation","Method overloading","Abstraction","Serialization"]',
    1,
    'Method overloading uses the same name with different parameter lists.',
    3
  ),
  (
    'Which collection does not allow duplicate elements?',
    '["ArrayList","LinkedList","HashSet","Vector"]',
    2,
    'A Set collection stores unique elements.',
    4
  )
) AS v(question_text, options, correct_option, explanation, position)
WHERE q.title = 'Java Basics'
AND NOT EXISTS (
  SELECT 1
  FROM questions existing
  WHERE existing.quiz_id = q.id
  AND existing.position = v.position
);

-- SQL Fundamentals questions
INSERT INTO questions (
  quiz_id, question_text, options, correct_option,
  explanation, marks, position
)
SELECT
  q.id,
  v.question_text,
  v.options::jsonb,
  v.correct_option,
  v.explanation,
  1,
  v.position
FROM quizzes q
CROSS JOIN (
  VALUES
  (
    'Which SQL clause filters rows before grouping?',
    '["ORDER BY","WHERE","HAVING","LIMIT"]',
    1,
    'WHERE filters rows before GROUP BY is evaluated.',
    1
  ),
  (
    'Which aggregate function counts rows?',
    '["SUM()","TOTAL()","COUNT()","ROWS()"]',
    2,
    'COUNT() returns the number of rows or non-null values.',
    2
  ),
  (
    'Which command retrieves data from a table?',
    '["FETCH TABLE","SELECT","OPEN","READ"]',
    1,
    'SELECT retrieves rows from one or more tables.',
    3
  ),
  (
    'Which clause filters grouped results?',
    '["WHERE","HAVING","FROM","DISTINCT"]',
    1,
    'HAVING filters groups after GROUP BY.',
    4
  )
) AS v(question_text, options, correct_option, explanation, position)
WHERE q.title = 'SQL Fundamentals'
AND NOT EXISTS (
  SELECT 1
  FROM questions existing
  WHERE existing.quiz_id = q.id
  AND existing.position = v.position
);

-- Correct the total marks from the question records
UPDATE quizzes q
SET total_marks = (
  SELECT COALESCE(SUM(questions.marks), 0)::int
  FROM questions
  WHERE questions.quiz_id = q.id
),
updated_at = NOW()
WHERE q.title IN ('Java Basics', 'SQL Fundamentals');