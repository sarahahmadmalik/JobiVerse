import { User, Edit3, Code, Briefcase, GraduationCap, Star, Award, Plus } from "lucide-react";

const ResumeGuide = () => {
  const resumeWritingPrinciples = [
    {
      title: "Professional Structure",
      icon: <User className="text-colors-primary" size={24} />,
      description: "A well-structured resume follows a logical flow that hiring managers expect.",
      principles: [
        "Our builder automatically organizes sections in the optimal order: Header, Summary, Experience, Education, Skills",
        "Proper hierarchy ensures your most relevant qualifications appear first",
        "Automatic formatting creates visual consistency throughout the document",
        "Section spacing and alignment follow professional standards"
      ],
      automation: "Your content is automatically structured for maximum impact without manual formatting."
    },
    {
      title: "Content Optimization",
      icon: <Edit3 className="text-colors-primary" size={24} />,
      description: "Effective resumes use precise language and proper emphasis.",
      principles: [
        "Action verbs should begin each bullet point (e.g., 'Developed', 'Managed')",
        "Quantifiable achievements carry more weight than responsibilities",
        "Technical skills should be specific and relevant to the position",
        "Education should include degree, institution, and graduation year"
      ],
      automation: "Our system suggests powerful action verbs and helps quantify achievements where possible."
    },
    {
      title: "ATS Compliance",
      icon: <Code className="text-colors-primary" size={24} />,
      description: "Applicant Tracking Systems parse resumes before human review.",
      principles: [
        "Standard section headers improve parsing accuracy",
        "Keyword optimization for the target position is crucial",
        "Proper formatting ensures content isn't misread by the system",
        "Avoiding graphics and unusual fonts maintains compatibility"
      ],
      automation: "We automatically format your resume for optimal ATS performance while maintaining readability."
    },
    {
      title: "Visual Presentation",
      icon: <Star className="text-colors-primary" size={24} />,
      description: "Clean design improves readability and professionalism.",
      principles: [
        "Consistent spacing between sections creates visual balance",
        "Limited color use maintains professional appearance",
        "Readable fonts (11-12pt for body text) ensure accessibility",
        "Proper margins prevent content from feeling cramped"
      ],
      automation: "Our templates apply professional design principles automatically, so you don't have to."
    },
    {
      title: "Customization Guidance",
      icon: <Award className="text-colors-primary" size={24} />,
      description: "Tailoring your resume for each application improves results.",
      principles: [
        "Highlight different experiences based on job requirements",
        "Adjust technical skills emphasis for different positions",
        "Modify summary to align with specific job descriptions",
        "Include/exclude projects based on relevance"
      ],
      automation: "Our builder makes it easy to create multiple versions while maintaining consistent formatting."
    }
  ];

  return (
    <div >
      <div className="">
        <div className="">
          <h2 className="text-2xl font-bold text-colors-textPrimary mb-6">
            Professional Resume Writing Principles
          </h2>
          <p className="text-gray-600 mb-6">
            While our builder automates the technical aspects, understanding these resume best practices will help you provide better content:
          </p>
          
          <div className="space-y-8">
            {resumeWritingPrinciples.map((principle, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex items-start gap-4">
                  <div className="bg-colors-primary/10 p-3 rounded-lg">
                    {principle.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-colors-textPrimary mb-2">
                      {principle.title}
                    </h3>
                    <p className="text-gray-600 mb-3">{principle.description}</p>
                    
                    <h4 className="font-medium text-colors-textPrimary mt-4 mb-2">
                      Key Principles:
                    </h4>
                    <ul className="space-y-2 mb-4">
                      {principle.principles.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-colors-primary mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </span>
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="bg-colors-primary/5 p-3 rounded-lg border border-colors-primary/10">
                      <h4 className="font-medium text-colors-primary mb-1">How Our Builder Helps:</h4>
                      <p className="text-gray-600">{principle.automation}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="text-lg font-semibold text-colors-textPrimary mb-2">
              Pro Tip: Getting the Best Results
            </h3>
            <p className="text-gray-600">
              While our builder handles formatting and structure, the most effective resumes combine:
            </p>
            <ul className="mt-2 space-y-1 text-gray-600">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>Complete information</strong> - Provide all relevant experiences and details</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>Specific achievements</strong> - Quantify results where possible</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>Relevant keywords</strong> - Include terms from the job description</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeGuide;