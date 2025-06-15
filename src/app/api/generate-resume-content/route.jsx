import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)

export async function POST (request) {
  try {
    const { userData, jobData } = await request.json()
    console.log(JSON.stringify(userData), JSON.stringify(jobData))

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro-latest',
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 2000
      }
    })

    const prompt = `
You are an expert resume writer and job analyst. Your task is to create a PERFECT, COMPREHENSIVE resume for someone applying to this specific job. This should be a complete resume like a professional would have - with EVERY section filled and nothing missing.

REFERENCE STANDARD: Create a resume as complete and professional as top-tier candidates - with detailed sections, multiple projects, comprehensive experience, certifications, achievements, and volunteer work. NOTHING should be empty or missing.

JOB DATA:
${JSON.stringify(jobData)}

USER'S BASIC DATA (Use only the basic info provided, create ideal content for everything else):
${JSON.stringify(userData)}

CRITICAL INSTRUCTIONS:

1. ANALYSIS PHASE:
   - Thoroughly analyze the job description to understand required skills, experience, and qualifications
   - Identify key technologies, methodologies, and industry knowledge required
   - Note specific requirements like years of experience, certifications, education level

2. RESUME CREATION STRATEGY (ATS-OPTIMIZED):
   - Create a resume for an IDEAL CANDIDATE for this job that will pass ATS screening
   - Use the user's basic information (name, contact, company names, job titles, durations) AS-IS
   - For everything else (responsibilities, achievements, skills, projects), create PERFECT content that matches the job requirements
   - Make the candidate appear highly qualified and experienced for this specific role
   - PRIORITIZE ATS compatibility: use exact keywords from job posting, standard formatting, and clear section organization

3. CONTENT GENERATION RULES:
   - EXPERIENCE STRATEGY (CRITICAL):
     * Analyze the job level: Entry-level (0-2 years), Mid-level (3-5 years), Senior (5-8 years), Lead/Principal (8+ years)
     * ALWAYS include minimum 3 work experiences regardless of user data provided
     * For ENTRY LEVEL jobs: Create 1-3 years total experience with internships, junior roles, or relevant part-time work
     * For MID LEVEL jobs: Create 3-5 years progressive experience showing career growth
     * For SENIOR LEVEL jobs: Create 5-8 years experience with leadership and advanced technical skills
     * For LEAD/PRINCIPAL jobs: Create 8+ years with management, architecture, and strategic responsibilities
     * Use provided company names, job titles, and durations when available
     * If user has fewer than 3 experiences, create additional realistic ones that build a logical career progression
     * Write detailed responsibilities and achievements that perfectly align with the target job level and requirements
   - SKILLS: Include ALL technical and soft skills mentioned in the job description, plus additional relevant ones appropriate for the job level
   - PROJECTS: Create 2-3 impressive projects that demonstrate expertise matching the job level and required technologies
   - EDUCATION: Use provided education or create appropriate educational background for the role
   - CERTIFICATIONS: Include industry-relevant certifications that would impress for this job level
   - ACHIEVEMENTS: Add quantifiable achievements with metrics that show impact appropriate for the career level

4. COMPLETE JSON STRUCTURE - EVERY FIELD MUST BE FILLED:
{
  "header": {
    "name": "User's actual name or John Doe if not provided",
    "contact": {
      "email": "user's email or professional.email@example.com",
      "phone": "user's phone or (555) 123-4567",
      "location": "user's location or City, State",
      "linkedin": "linkedin.com/in/username"
    }
  },
  "summary": "Write a compelling 3-4 line professional summary that perfectly positions the candidate for THIS specific job. Highlight years of experience, key skills, and value proposition.",
  "skills": {
    "technical": ["MANDATORY: List exactly 8-12 technical skills directly relevant to the job - include exact keywords from job posting"],
    "soft": ["MANDATORY: List exactly 4-6 soft skills mentioned in job description or critical for the role"]
  },
  "experience": [
    {
      "title": "Create job titles that show career progression appropriate for target job level",
      "company": "Use provided company name or create realistic ones",
      "duration": "Use provided duration or create appropriate timeframes that total the right experience level",
      "location": "City, State",
      "achievements": [
        "Write 3-4 impressive achievements with specific metrics appropriate for this career level",
        "For Entry-level: Focus on learning, contributing to team projects, following best practices",
        "For Mid-level: Show independent work, process improvements, mentoring junior staff",
        "For Senior-level: Demonstrate leadership, architecture decisions, team management, strategic impact",
        "For Lead/Principal: Show organization-wide impact, technology strategy, cross-functional leadership"
      ]
    },
    {
      "title": "Second experience with logical career progression",
      "company": "Different company or internal promotion",
      "duration": "Chronologically consistent timeframe",
      "location": "City, State", 
      "achievements": [
        "Show growth from previous role",
        "Demonstrate expanded responsibilities",
        "Include relevant technologies and methodologies"
      ]
    },
    {
      "title": "Third experience completing the career story",
      "company": "Entry point or stepping stone role",
      "duration": "Earlier in career timeline",
      "location": "City, State",
      "achievements": [
        "Foundation-building experience",
        "Relevant to career trajectory",
        "Shows development of core skills"
      ]
    }
  ],
  "education": [
    {
      "degree": "Appropriate degree for the job (e.g., Bachelor's in Computer Science)",
      "institution": "Reputable University Name",
      "year": "Appropriate graduation year based on experience",
      "location": "City, State",
      "gpa": "3.7/4.0"
    }
  ],
  "projects": [
    {
      "name": "MANDATORY: Create atleast 3-5 impressive project names directly relevant to the job (like Sara's 11 projects)",
      "description": "MANDATORY: Detailed description (2-3 sentences) showing business impact and technical complexity",
      "technologies": ["MANDATORY: List 3-5 technologies mentioned in job description"],
      "achievements": ["MANDATORY: Include 2-3 quantifiable results and business impact statements"],
      "duration": "MANDATORY: MM/YYYY - MM/YYYY format or 'Completed MM/YYYY'"
    }
  ],
  "certifications": [
    {
      "name": "MANDATORY: Include 4-6 industry-relevant certifications (like Sara's 6 certifications)",
      "issuer": "MANDATORY: Recognized certification bodies (AWS, Google, Microsoft, Meta, etc.)",
      "dateObtained": "MANDATORY: Recent dates in MM/YYYY format",
    }
  ],
  "additionalSections": {
    "achievements": [
      "MANDATORY: Include 3-4 professional awards/recognitions (like Sara's competition positions and awards)",
      "MANDATORY: Each achievement must be impressive and specific with context",
      "MANDATORY: Include competition rankings, scholarships, recognition awards"
    ],
    "volunteerWork": [
      {
        "role": "MANDATORY: Leadership or active volunteer position title",
        "organization": "MANDATORY: Professional organization, student club, or community group",
        "duration": "MANDATORY: MM/YYYY - MM/YYYY format",
        "description": "MANDATORY: Detailed description showing leadership and impact"
      },
      {
        "role": "MANDATORY: Second volunteer position showing diverse involvement",
        "organization": "MANDATORY: Different organization type",
        "duration": "MANDATORY: MM/YYYY - MM/YYYY format", 
        "description": "MANDATORY: Specific responsibilities and achievements"
      }
    ],
    "languages": [
      "MANDATORY: Include at least 'English (Native/Fluent)'",
      "MANDATORY: Add 2-3 additional languages relevant to job location or global nature"
    ],
    "otherActivities": [
      "MANDATORY: Include 3-4 professional activities like competitions, bootcamps, conferences",
      "MANDATORY: Each activity should show professional development and skill building",
      "MANDATORY: Include specific event names, organizations, and skills developed"
    ]
  }
}

5. ATS OPTIMIZATION & QUALITY STANDARDS:
   - CRITICAL: Make this resume highly ATS-friendly by:
     * Including exact keywords and phrases from the job description
     * Using standard section headings (Experience, Education, Skills, etc.)
     * Avoiding graphics, tables, or complex formatting
     * Using common job titles and industry-standard terminology
     * Including both acronyms and full forms (e.g., "AI/Artificial Intelligence")
   - Every bullet point should be impressive and relevant
   - Use industry-specific terminology from the job description
   - Include metrics and quantifiable achievements wherever possible
   - Make the candidate appear as a top-tier professional in their field
   - Ensure keyword density matches job requirements without keyword stuffing

6. MANDATORY COMPLETION REQUIREMENTS - PROFESSIONAL STANDARD:
   - Create a resume as comprehensive as top-tier professionals with EVERY section fully populated
   - EVERY section in the JSON structure MUST be filled with relevant, high-quality content
   - NO empty arrays, null values, or placeholder text allowed
   - MINIMUM CONTENT REQUIREMENTS:
     * 6-8 detailed projects with diverse applications
     * 4-6 industry certifications from recognized bodies
     * 3-4 specific achievements with rankings/awards
     * 2+ volunteer positions with leadership roles
     * 3-4 other professional activities (competitions, bootcamps, etc.)
     * Comprehensive technical skills (10+ items)
     * Well-rounded soft skills (6+ items)
   - Each experience MUST have 3-4 detailed achievements with metrics and business impact
   - Projects MUST include diverse tech stacks and real-world applications
   - Make it so comprehensive that nothing appears missing or underdeveloped

7. FINAL DELIVERY:
   - Return ONLY the complete JSON object, no additional text or formatting
   - No markdown code blocks or explanations
   - Ensure all JSON is properly formatted and parseable
   - Verify EVERY section is populated with impressive, relevant content
   - Make this resume so comprehensive and ATS-friendly that it would pass automated screening and get an interview for this specific job

Create the perfect resume now:`

    const result = await model.generateContent(prompt)
    const response = result?.response
    console.log(response)
  
    let text = response?.text()

    // Clean the response by removing Markdown code block markers if present
    text = text.replace(/^```json|```$/g, '').trim()

    // Parse the JSON response
    const resumeData = JSON.parse(text)
    console.log(resumeData)

    return NextResponse.json({
      success: true,
      resume: resumeData,
      format: 'json'
    })
  } catch (error) {
    console.error('Error generating resume:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Resume generation failed',
        details: error.message
      },
      { status: 500 }
    )
  }
}