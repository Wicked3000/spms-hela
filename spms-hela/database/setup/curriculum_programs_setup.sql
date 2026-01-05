-- Create curriculum_programs table for Academic and Vocational Pathways

-- Create the table
CREATE TABLE curriculum_programs (
  id SERIAL PRIMARY KEY,
  pathway TEXT NOT NULL CHECK (pathway IN ('Academic', 'Vocational')),
  program_type TEXT NOT NULL CHECK (program_type IN ('FODE', 'TVET')),
  title TEXT NOT NULL,
  duration TEXT NOT NULL,
  description TEXT,
  subjects_or_skills TEXT[] NOT NULL,
  certification TEXT,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Archived')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_curriculum_programs_pathway ON curriculum_programs(pathway);
CREATE INDEX idx_curriculum_programs_program_type ON curriculum_programs(program_type);
CREATE INDEX idx_curriculum_programs_status ON curriculum_programs(status);
CREATE INDEX idx_curriculum_programs_pathway_type ON curriculum_programs(pathway, program_type, status);

-- Enable Row Level Security
ALTER TABLE curriculum_programs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Policy: Public users can view active programs
CREATE POLICY "Public can view active programs"
ON curriculum_programs
FOR SELECT
USING (status = 'Active');

-- Policy: Authenticated admins can insert programs
CREATE POLICY "Admins can insert programs"
ON curriculum_programs
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Authenticated admins can update programs
CREATE POLICY "Admins can update programs"
ON curriculum_programs
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Authenticated admins can delete programs
CREATE POLICY "Admins can delete programs"
ON curriculum_programs
FOR DELETE
TO authenticated
USING (true);

-- Insert seed data for Academic Pathway (FODE Programs)
INSERT INTO curriculum_programs (
  pathway,
  program_type,
  title,
  duration,
  description,
  subjects_or_skills,
  certification,
  status
) VALUES
(
  'Academic',
  'FODE',
  'Grade 11 Foundation Program',
  '12 Months',
  'International secondary education standards preparation.',
  ARRAY['English', 'Mathematics', 'Science', 'Social Science'],
  'Grade 11 Certificate',
  'Active'
),
(
  'Academic',
  'FODE',
  'Grade 12 Advanced Program',
  '12 Months',
  'Advanced academic preparation for university entrance.',
  ARRAY['Advanced English', 'Applied Mathematics', 'Physics', 'Chemistry', 'Biology'],
  'University entrance qualification equivalent',
  'Active'
),
(
  'Academic',
  'FODE',
  'University Bridging Course',
  '6 Months',
  'Direct pathway to overseas universities.',
  ARRAY['Academic Writing', 'Research Methods', 'Critical Thinking'],
  'University Bridging Certificate',
  'Active'
);

-- Insert seed data for Vocational Pathway (TVET Programs)
INSERT INTO curriculum_programs (
  pathway,
  program_type,
  title,
  duration,
  description,
  subjects_or_skills,
  certification,
  status
) VALUES
(
  'Vocational',
  'TVET',
  'Technical Skills Certificate',
  '6–12 Months',
  'Hands-on training in essential technical trades.',
  ARRAY['Carpentry', 'Electrical', 'Plumbing', 'Masonry'],
  'National Certificate I & II',
  'Active'
),
(
  'Vocational',
  'TVET',
  'Vocational Diploma',
  '18–24 Months',
  'Comprehensive vocational education for career advancement.',
  ARRAY['Business Management', 'IT Fundamentals', 'Hospitality'],
  'Internationally Recognized Diploma',
  'Active'
),
(
  'Vocational',
  'TVET',
  'Trade Specialization',
  '12–18 Months',
  'Specialized training in high-demand trades.',
  ARRAY['Automotive', 'Welding', 'Computer Repair'],
  'Trade Certificate with Practical Assessment',
  'Active'
);

-- Verify the setup
SELECT 
  pathway,
  program_type,
  title,
  duration,
  array_length(subjects_or_skills, 1) as subject_count,
  status
FROM curriculum_programs 
WHERE status = 'Active' 
ORDER BY pathway, program_type, id;
