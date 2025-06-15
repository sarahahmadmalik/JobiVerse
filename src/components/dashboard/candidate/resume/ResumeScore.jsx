"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, Info, ArrowUp, AlertTriangle, Award, Zap, Loader2 } from "lucide-react"

export function ResumeScoreChecker({ resumeData }) {
  const [score, setScore] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Calculate score immediately when component mounts
    try {
      const calculatedScore = calculateScore(resumeData)
      setScore(calculatedScore)
      setError(null)
    } catch (err) {
      console.error('Error calculating score:', err)
      setError(err instanceof Error ? err.message : 'Failed to calculate score')
    } finally {
      setLoading(false)
    }
  }, [resumeData])

  const calculateScore = (data) => {
    // Initialize score object
    const score = {
      overall: 0,
      sections: {
        header: { score: 0, feedback: "", improvements: [] },
        summary: { score: 0, feedback: "", improvements: [] },
        experience: { score: 0, feedback: "", improvements: [] },
        education: { score: 0, feedback: "", improvements: [] },
        skills: { score: 0, feedback: "", improvements: [] },
        projects: { score: 0, feedback: "", improvements: [] },
        certifications: { score: 0, feedback: "", improvements: [] },
      },
      recommendations: [],
      keywordsMissing: [],
      keywordsFound: [],
      improvementPriorities: [],
    }

    // Calculate header section score (15% weight)
    if (data.header?.name) score.sections.header.score += 20
    if (data.header?.contact?.email) score.sections.header.score += 15
    if (data.header?.contact?.phone) score.sections.header.score += 10
    if (data.header?.contact?.location) score.sections.header.score += 5
    if (data.header?.contact?.linkedin) score.sections.header.score += 10
    if (data.header?.contact?.github) score.sections.header.score += 5
    score.sections.header.feedback = score.sections.header.score >= 50 ?
      "Your contact information is complete" :
      "Add more contact information"
    if (score.sections.header.score < 50) {
      score.improvementPriorities.push({
        section: "header",
        priority: "high",
        action: "Add missing contact information"
      })
    }

    // Calculate summary section score (10% weight)
    if (data.summary) {
      const wordCount = data.summary.split(/\s+/).length
      score.sections.summary.score = Math.min(100, wordCount * 2)
      score.sections.summary.feedback = wordCount > 50 ?
        "Your summary is well-written and detailed" :
        "Consider expanding your summary with more keywords"
      if (wordCount <= 50) {
        score.improvementPriorities.push({
          section: "summary",
          priority: "medium",
          action: "Expand summary to at least 50 words"
        })
      }
    }

    // Calculate experience section score (25% weight)
    if (data.experience?.length > 0) {
      let expScore = 0
      const maxPerJob = 100 / data.experience.length
      
      data.experience.forEach(exp => {
        let jobScore = 0
        if (exp.company && exp.title) jobScore += 20
        if (exp.duration) jobScore += 10
        if (exp.location) jobScore += 5
        
        // Check achievements
        if (exp.achievements?.length > 0) {
          jobScore += Math.min(40, exp.achievements.length * 10)
          
          // Check for quantifiable achievements
          const hasQuantifiable = exp.achievements.some(ach => /\d+%/.test(ach) || /\d+\+/.test(ach))
          if (hasQuantifiable) jobScore += 25
        }
        
        expScore += Math.min(maxPerJob, jobScore)
      })
      
      score.sections.experience.score = Math.min(100, expScore)
      score.sections.experience.feedback = expScore >= 70 ?
        "Strong experience section with good achievements" :
        "Add more details and quantifiable achievements"
      
      if (expScore < 70) {
        score.improvementPriorities.push({
          section: "experience",
          priority: "high",
          action: "Add more quantifiable achievements (use numbers)"
        })
      }
    }

    // Calculate education section score (10% weight)
    if (data.education?.length > 0) {
      let eduScore = 0
      const maxPerEdu = 100 / data.education.length
      
      data.education.forEach(edu => {
        let institutionScore = 0
        if (edu.institution && edu.degree) institutionScore += 40
        if (edu.year) institutionScore += 20
        if (edu.location) institutionScore += 10
        if (edu.gpa) institutionScore += 30
        
        eduScore += Math.min(maxPerEdu, institutionScore)
      })
      
      score.sections.education.score = Math.min(100, eduScore)
      score.sections.education.feedback = eduScore >= 70 ?
        "Complete education section" :
        "Add more education details like GPA"
    }

    // Calculate skills section score (15% weight)
    if (data.skills) {
      let skillsScore = 0
      if (data.skills.technical?.length > 0) {
        skillsScore += Math.min(70, data.skills.technical.length * 7)
      }
      if (data.skills.soft?.length > 0) {
        skillsScore += Math.min(30, data.skills.soft.length * 3)
      }
      
      score.sections.skills.score = Math.min(100, skillsScore)
      score.sections.skills.feedback = skillsScore >= 70 ?
        "Good variety of technical and soft skills" :
        "Consider adding more skills (both technical and soft)"
      
      if (skillsScore < 70) {
        score.improvementPriorities.push({
          section: "skills",
          priority: "medium",
          action: "Add more technical skills (especially for the job you're targeting)"
        })
      }
    }

    // Calculate projects section score (15% weight)
    if (data.projects?.length > 0) {
      let projectsScore = 0
      const maxPerProject = 100 / data.projects.length
      
      data.projects.forEach(proj => {
        let projectScore = 0
        if (proj.name && proj.description) projectScore += 30
        if (proj.technologies?.length > 0) projectScore += Math.min(30, proj.technologies.length * 5)
        if (proj.achievements?.length > 0) projectScore += Math.min(40, proj.achievements.length * 10)
        
        projectsScore += Math.min(maxPerProject, projectScore)
      })
      
      score.sections.projects.score = Math.min(100, projectsScore)
      score.sections.projects.feedback = projectsScore >= 70 ?
        "Strong projects section with good details" :
        "Add more details to your projects, especially achievements"
    }

    // Calculate certifications section score (10% weight)
    if (data.certifications?.length > 0) {
      const certCount = data.certifications.length
      score.sections.certifications.score = Math.min(100, certCount * 20)
      score.sections.certifications.feedback = certCount >= 3 ?
        "Excellent certifications that boost your credibility" :
        "Consider adding more relevant certifications"
    }

    // Calculate overall weighted score
    score.overall = Math.round(
      (score.sections.header.score * 0.15) +
      (score.sections.summary.score * 0.10) +
      (score.sections.experience.score * 0.25) +
      (score.sections.education.score * 0.10) +
      (score.sections.skills.score * 0.15) +
      (score.sections.projects.score * 0.15) +
      (score.sections.certifications.score * 0.10)
    )

    // Sort improvement priorities by priority (high first)
    score.improvementPriorities.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })

    return score
  }

  const renderScoreResults = () => {
    if (!score) return null

    return (
      <div className="space-y-6">
        {/* Overall Score */}
        <div className="text-center p-6 bg-colors-secondary rounded-lg border border-colors-primary/10">
          <h3 className="text-2xl font-bold text-colors-textPrimary mb-3">
            Overall Resume Score: {score.overall}%
          </h3>
          <div className="relative h-3 w-full bg-gray-200 rounded-full overflow-hidden mb-4">
            <div
              className={`absolute top-0 left-0 h-full rounded-full ${
                score.overall >= 80 ? "bg-green-500" : score.overall >= 60 ? "bg-amber-500" : "bg-red-500"
              }`}
              style={{ width: `${score.overall}%` }}
            ></div>
          </div>
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              score.overall >= 80
                ? "bg-green-100 text-green-800"
                : score.overall >= 60
                  ? "bg-amber-100 text-amber-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            {score.overall >= 80 ? (
              <>
                <Award className="h-4 w-4" />
                Excellent! Your resume is well-optimized
              </>
            ) : score.overall >= 60 ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Good job! Your resume is strong
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4" />
                Needs improvement for better impact
              </>
            )}
          </div>
        </div>

        {/* Priority Improvements */}
        {score.improvementPriorities?.length > 0 && (
          <div className="border rounded-lg border-colors-primary/10 p-6 bg-colors-primary/5">
            <h4 className="font-medium text-lg text-colors-textPrimary mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-colors-primary" />
              Priority Improvements
            </h4>
            <div className="space-y-4">
              {score.improvementPriorities.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div
                    className={`flex-shrink-0 w-20 text-center text-xs font-medium px-3 py-1.5 rounded-full ${
                      item.priority === "high"
                        ? "bg-red-100 text-red-800"
                        : item.priority === "medium"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {item.priority.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-colors-textPrimary">{item.action}</p>
                    <p className="text-sm text-colors-textSecondary mt-1 capitalize">Section: {item.section}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(score.sections).map(([section, data]) => (
            <div key={section} className="border rounded-lg border-colors-primary/10 p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-colors-textPrimary capitalize">{section}</h4>
                <span
                  className={`text-sm font-medium ${
                    data.score >= 80
                      ? "text-green-600"
                      : data.score >= 60
                        ? "text-amber-600"
                        : "text-red-600"
                  }`}
                >
                  {data.score}%
                </span>
              </div>
              <div className="relative h-2 w-full bg-gray-200 rounded-full overflow-hidden mb-4">
                <div
                  className={`absolute top-0 left-0 h-full rounded-full ${
                    data.score >= 80 ? "bg-green-500" : data.score >= 60 ? "bg-amber-500" : "bg-red-500"
                  }`}
                  style={{ width: `${data.score}%` }}
                ></div>
              </div>
              <p className="text-colors-textSecondary mb-3">{data.feedback}</p>

              {data.improvements?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-colors-textSecondary">Suggested improvements:</p>
                  <ul className="space-y-2">
                    {data.improvements.map((improvement, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <ArrowUp className="h-4 w-4 text-colors-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-colors-textSecondary">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Info className="h-6 w-6 text-colors-primary" />
        <h2 className="text-xl font-bold text-colors-textPrimary">Resume Score Checker</h2>
      </div>
      <p className="text-colors-textSecondary">
        Get your resume's compatibility score and improvement suggestions.
      </p>

      {loading && (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-colors-primary" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {renderScoreResults()}
    </div>
  )
}