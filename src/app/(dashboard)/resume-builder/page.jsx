'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Download,
  Save,
  Eye,
  Edit3,
  Plus,
  Trash2,
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Award,
  Code,
  Users,
  Briefcase,
  GraduationCap,
  Star,
  Globe,
  Heart,
  ChevronDown,
  ChevronUp,
  Github,
  X
} from 'lucide-react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import TraditionalResumeTemplate from '@/components/dashboard/candidate/resume/Traditional'
import { useUploadThing } from '@/utils/uploadthing'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Toast from '@/components/ui/toast'
import { resumeService } from '@/services/resume-service'
import { motion, AnimatePresence } from 'framer-motion'
import ResumeGuide from '@/components/dashboard/candidate/resume/ResumeGuide'
import { ResumeScoreChecker } from '@/components/dashboard/candidate/resume/ResumeScore'
import Loader from '@/components/ui/loader'
import { applicationService } from '@/services/applicant-service'
import JobSubmissionPopup from '@/components/dashboard/candidate/job-listing/JobSubmissionPopup'
import confetti from 'canvas-confetti'

const ResumeBuilder = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [parsedResume, setParsedResume] = useState(null)
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [collapsedSections, setCollapsedSections] = useState({})
  const [showToast, setShowToast] = useState(false)
  const [toastConfig, setToastConfig] = useState({
    type: 'success',
    title: '',
    message: ''
  })
  const [isSaving, setIsSaving] = useState(false)
  const [showResumeScore, setShowResumeScore] = useState(false)

  // Initialize with sample data or parsed resume
  const [resumeData, setResumeData] = useState({
    header: {
      name: 'Sarah Johnson',
      contact: {
        email: 'sarah.johnson@email.com',
        phone: '(555) 123-4567',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/sarahjohnson'
      }
    },
    summary:
      'Experienced Full Stack Developer with 5+ years of expertise in React, Node.js, and cloud technologies. Proven track record of delivering scalable web applications and leading development teams. Passionate about creating innovative solutions that drive business growth.',
    skills: {
      technical: [
        'React',
        'Node.js',
        'TypeScript',
        'Python',
        'AWS',
        'Docker',
        'GraphQL',
        'MongoDB',
        'PostgreSQL',
        'Git'
      ],
      soft: [
        'Leadership',
        'Problem Solving',
        'Team Collaboration',
        'Communication',
        'Project Management',
        'Agile Methodologies'
      ]
    },
    experience: [
      {
        title: 'Senior Full Stack Developer',
        company: 'TechCorp Inc.',
        duration: '2022 - Present',
        location: 'San Francisco, CA',
        achievements: [
          'Led development of microservices architecture serving 1M+ users',
          'Improved application performance by 40% through code optimization',
          'Mentored 3 junior developers and conducted technical interviews',
          'Implemented CI/CD pipeline reducing deployment time by 60%'
        ]
      }
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of California, Berkeley',
        year: '2019',
        location: 'Berkeley, CA',
        gpa: '3.8/4.0'
      }
    ],
    projects: [
      {
        name: 'E-commerce Platform',
        description:
          'Full-stack e-commerce solution with advanced features including real-time inventory management, payment processing, and user analytics dashboard.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API', 'AWS'],
        achievements: [
          'Processed $500K+ in transactions',
          'Served 10,000+ customers',
          '99.9% uptime'
        ],
        duration: '06/2023 - 08/2023'
      }
    ],
    certifications: [
      {
        name: 'AWS Certified Solutions Architect',
        issuer: 'Amazon Web Services',
        dateObtained: '03/2023'
      }
    ],
    additionalSections: {
      achievements: [
        '1st Place - HackTech 2023 Hackathon (Team of 4)',
        "Dean's List - Fall 2018, Spring 2019"
      ],
      volunteerWork: [
        {
          role: 'Technical Mentor',
          organization: 'Code for Good',
          duration: '01/2022 - Present',
          description:
            'Mentor underprivileged students in programming fundamentals and career guidance.'
        }
      ],
      languages: ['English (Native)', 'Spanish (Conversational)'],
      otherActivities: [
        'Google I/O 2023 Attendee - Learned about latest Android and web technologies',
        'React Conference 2022 Speaker'
      ]
    }
  })

  const [activeSection, setActiveSection] = useState('header')
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showSubmissionPopup, setShowSubmissionPopup] = useState(false)
  const [isApplying, setIsApplying] = useState(false)

  const handleApplyWithResume = async () => {
    try {
      setIsApplying(true)

      // 1. First save the resume (same as handleSaveResume)
      const pdfBlob = await generatePDFBlob()
      const file = new File(
        [pdfBlob],
        `${
          resumeData.header?.name?.replace(/\s+/g, '_') || 'Resume'
        }_${Date.now()}.pdf`,
        { type: 'application/pdf' }
      )

      const uploadResult = await startUpload([file])
      const resumeUrl = uploadResult[0].url
      const savedResume = await saveResumeData(resumeUrl)

      // 2. Create application record
      const jobId = searchParams.get('jobId')
      if (!jobId) {
        throw new Error('Job ID not found')
      }

      const applicationResponse = await applicationService.applyForJob(
        jobId,
        session.user.id,
        savedResume._id
      )

      // 3. Show success with confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })

      setShowSubmissionPopup(true)
    } catch (error) {
      console.error('Error applying with resume:', error)
      setToastConfig({
        type: 'error',
        title: 'Application Failed',
        message: error.message || 'Failed to submit application'
      })
      setShowToast(true)
    } finally {
      setIsApplying(false)
    }
  }

  const { startUpload, isUploading } = useUploadThing('resumeUploader', {
    onClientUploadComplete: res => {
      if (res && res[0]?.url) {
        saveResumeData(res[0].url)
      }
    },
    onUploadError: error => {
      setIsSaving(false)
      setToastConfig({
        type: 'error',
        title: 'Upload Failed',
        message: error.message || 'Failed to upload resume'
      })
      setShowToast(true)
    }
  })

  const generatePDFBlob = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const input = document.getElementById('resume-template')

        if (!input) {
          throw new Error('Resume template element not found')
        }

        // Import html2pdf
        const html2pdf = (await import('html2pdf.js')).default

        // Create a container to preserve original styles
        const container = document.createElement('div')
        container.style.cssText = `
          position: absolute;
          left: -9999px;
          top: 0;
          width: 794px;
          background: white;
        `
        document.body.appendChild(container)

        // Clone the element while preserving all original styles
        const clone = input.cloneNode(true)
        container.appendChild(clone)

        // Wait for fonts and images to load
        await new Promise(resolve => setTimeout(resolve, 500))

        const options = {
          margin: [10, 10, 10, 10],
          filename: 'temp-resume.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true,
            windowWidth: 794
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        }

        // Generate PDF and get as Blob
        const worker = html2pdf()
          .set(options)
          .from(clone)
          .toPdf()
          .get('pdf')
          .then(pdf => {
            const blob = pdf.output('blob')
            document.body.removeChild(container)
            resolve(blob)
          })
      } catch (error) {
        console.error('Error generating PDF blob:', error)
        reject(error)

        // Clean up any remaining elements
        const containers = document.querySelectorAll('[style*="left: -9999px"]')
        containers.forEach(el => el.parentNode?.removeChild(el))
      }
    })
  }

  const saveResumeData = async resumeUrl => {
    try {
      if (!session?.user?.id) {
        throw new Error('User not authenticated')
      }

      const existingResumeId = null // exisiting resume id causes issues like not saves in db

      const resumeDataToSave = {
        jobId: searchParams.get('jobId') || 'default-job-id',
        jobTitle: searchParams.get('jobTitle') || 'Resume',
        resumeLink: resumeUrl,
        resumeId: existingResumeId,
        fileName: searchParams.get('jobTitle'),
        content: resumeData // Save the full resume content if needed
      }

      // Use the resumeService to save the data
      const savedResume = await resumeService.saveResume(
        session.user.id,
        resumeDataToSave
      )

      console.log(savedResume)

      setToastConfig({
        type: 'success',
        title: 'Success!',
        message: 'Resume saved successfully'
      })
      setShowToast(true)

      return savedResume
    } catch (error) {
      console.error('Error saving resume:', error)
      setToastConfig({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to save resume data'
      })
      setShowToast(true)
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  // Combined save function
  const handleSaveResume = async () => {
    try {
      setIsSaving(true)

      // 1. Generate PDF
      const pdfBlob = await generatePDFBlob()

      // 2. Create file object
      const file = new File(
        [pdfBlob],
        `${
          resumeData.header?.name?.replace(/\s+/g, '_') || 'Resume'
        }_${Date.now()}.pdf`,
        { type: 'application/pdf' }
      )

      // 3. Upload to UploadThing
      const uploadResult = await startUpload([file])
      const resumeUrl = uploadResult[0].url
      const resume = await saveResumeData(resumeUrl)
      // console.log("Session", session.user.id)
      // console.log(sessionStorage.clear('currentResumeId'))
      console.log(resume)
      if (!sessionStorage.getItem('currentResumeId')) {
        sessionStorage.setItem('currentResumeId', resume._id)
      }
    } catch (error) {
      console.error('Error saving resume:', error)
      setIsSaving(false)
      setToastConfig({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to save resume'
      })
      setShowToast(true)
    }
  }

  //   useEffect(() => {
  //   return () => {
  //     sessionStorage.removeItem('currentResumeId');
  //   };
  // }, []);

  const downloadPDFWithHtml2Pdf = async () => {
    const input = document.getElementById('resume-template')

    if (!input) {
      console.error('Resume template element not found')
      return
    }

    try {
      // Import html2pdf
      const html2pdf = (await import('html2pdf.js')).default

      // Create a container to preserve original styles
      const container = document.createElement('div')
      container.style.cssText = `
      position: absolute;
      left: -9999px;
      top: 0;
      width: 794px;  // A4 width in pixels
      background: white;
    `
      document.body.appendChild(container)

      // Clone the element while preserving all original styles
      const clone = input.cloneNode(true)
      container.appendChild(clone)

      // Wait for fonts and images to load
      await new Promise(resolve => setTimeout(resolve, 500))

      const options = {
        margin: [10, 10, 10, 10], // margins in pixels (top, right, bottom, left)
        filename: resumeData?.header?.name
          ? `${resumeData.header.name.replace(/\s+/g, '_')}_Resume.pdf`
          : 'Resume.pdf',
        image: {
          type: 'jpeg',
          quality: 0.98
        },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          allowTaint: false,
          scrollX: 0,
          scrollY: 0,
          windowWidth: 794 // A4 width
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
          compress: true
        },
        pagebreak: {
          mode: ['css', 'avoid-all'],
          before: '.page-break-before', // Add this class to force page breaks
          after: '.page-break-after', // Add this class to force page breaks
          avoid: 'img, .no-break' // Elements to avoid breaking across pages
        }
      }

      // Generate PDF (will automatically handle multiple pages)
      await html2pdf().set(options).from(clone).save()

      // Clean up
      document.body.removeChild(container)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')

      // Clean up any remaining elements
      const containers = document.querySelectorAll('[style*="left: -9999px"]')
      containers.forEach(el => el.parentNode?.removeChild(el))
    }
  }

  // Enhanced downloadResume function with better error handling
  const downloadResume = () => {
    try {
      downloadPDFWithHtml2Pdf()
    } catch (error) {
      console.error('Error in downloadResume:', error)
      alert('An error occurred while downloading. Please try again.')
    }
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get query params
        const resumeDataParam = searchParams.get('resumeData')
        const jobTitleParam = searchParams.get('jobTitle')
        const jobId = searchParams.get('jobId')
        const companyNameParam = searchParams.get('companyName')

        if (resumeDataParam) {
          const parsed = JSON.parse(resumeDataParam)
          console.log(parsed)
          setParsedResume(parsed)
          const transformedData = {
            header: {
              name: parsed.resume.header?.name || '',
              contact: {
                email: parsed.resume.header?.contact?.email || '',
                phone: parsed.resume.header?.contact?.phone || '',
                location: parsed.resume.header?.contact?.location || '',
                linkedin: parsed.resume.header?.contact?.linkedin || '',
                github: parsed.resume.header?.contact?.github || ''
              }
            },
            summary: parsed.resume.summary || '',
            skills: {
              technical: parsed.resume.skills?.technical || [],
              soft: parsed.resume.skills?.soft || []
            },
            experience:
              parsed.resume.experience?.map(exp => ({
                title: exp.title || '',
                company: exp.company || '',
                duration: exp.duration || '',
                location: exp.location || '',
                achievements: exp.achievements || []
              })) || [],
            education:
              parsed.resume.education?.map(edu => ({
                degree: edu.degree || '',
                institution: edu.institution || '',
                year: edu.year || '',
                location: edu.location || '',
                gpa: edu.gpa || ''
              })) || [],
            projects:
              parsed.resume.projects?.map(proj => ({
                name: proj.name || '',
                description: proj.description || '',
                technologies: proj.technologies || [],
                achievements: proj.achievements || [],
                duration: proj.duration || ''
              })) || [],
            certifications:
              parsed.resume.certifications?.map(cert => ({
                name: cert.name || '',
                issuer: cert.issuer || '',
                dateObtained: cert.dateObtained || ''
              })) || [],
            additionalSections: {
              achievements:
                parsed.resume.additionalSections?.achievements || [],
              volunteerWork:
                parsed.resume.additionalSections?.volunteerWork?.map(vol => ({
                  role: vol.role || '',
                  organization: vol.organization || '',
                  duration: vol.duration || '',
                  description: vol.description || ''
                })) || [],
              languages: parsed.resume.additionalSections?.languages || [],
              otherActivities:
                parsed.resume.additionalSections?.otherActivities || []
            }
          }
          setResumeData(transformedData)
        }

        if (jobTitleParam) setJobTitle(jobTitleParam)
        if (companyNameParam) setCompany(companyNameParam)
      } catch (error) {
        console.error('Error loading resume data:', error)
        setToastConfig({
          type: 'error',
          title: 'Error',
          message: 'Failed to load resume data'
        })
        setShowToast(true)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
    setShowResumeScore(true)
  }, [searchParams])

  const handleShowResumeScore = () => {
    setShowResumeScore(true)
  }

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <Loader />
      </div>
    )
  }

  console.log(resumeData)

  const toggleCollapse = section => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleInputChange = (
    section,
    field,
    value,
    index = null,
    subfield = null
  ) => {
    setResumeData(prev => {
      const newData = JSON.parse(JSON.stringify(prev))

      if (index !== null) {
        if (subfield) {
          // Handle nested fields in arrays (e.g., experience[0].company)
          newData[section][index][subfield] = value
        } else if (Array.isArray(newData[section][index])) {
          // Handle array fields within arrays (e.g., experience[0].achievements)
          newData[section][index] = value
        } else {
          // Handle direct object fields in arrays
          newData[section][index][field] = value
        }
      } else if (
        field &&
        typeof newData[section] === 'object' &&
        !Array.isArray(newData[section])
      ) {
        // Handle nested objects (e.g., header.contact)
        if (subfield) {
          newData[section][field][subfield] = value
        } else {
          newData[section][field] = value
        }
      } else {
        // Handle direct fields (e.g., summary)
        newData[section] = value
      }

      return newData
    })
  }

  const addItem = (section, template) => {
    setResumeData(prev => ({
      ...prev,
      [section]: [...prev[section], template]
    }))
  }

  const addAdditionalItem = (subsection, template) => {
    setResumeData(prev => ({
      ...prev,
      additionalSections: {
        ...prev.additionalSections,
        [subsection]: [...prev.additionalSections[subsection], template]
      }
    }))
  }

  const removeItem = (section, index) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }))
  }

  const removeAdditionalItem = (subsection, index) => {
    setResumeData(prev => ({
      ...prev,
      additionalSections: {
        ...prev.additionalSections,
        [subsection]: prev.additionalSections[subsection].filter(
          (_, i) => i !== index
        )
      }
    }))
  }

  const saveResume = () => {
    localStorage.setItem('resumeData', JSON.stringify(resumeData))
    alert('Resume saved successfully!')
  }

  const renderEditor = () => {
    switch (activeSection) {
      case 'header':
        return (
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Full Name
              </label>
              <input
                type='text'
                value={resumeData.header.name}
                onChange={e =>
                  handleInputChange('header', 'name', e.target.value)
                }
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Email
              </label>
              <input
                type='email'
                value={resumeData.header.contact.email}
                onChange={e =>
                  handleInputChange('header', 'contact', {
                    ...resumeData.header.contact,
                    email: e.target.value
                  })
                }
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Phone
              </label>
              <input
                type='tel'
                value={resumeData.header.contact.phone}
                onChange={e =>
                  handleInputChange('header', 'contact', {
                    ...resumeData.header.contact,
                    phone: e.target.value
                  })
                }
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Location
              </label>
              <input
                type='text'
                value={resumeData.header.contact.location}
                onChange={e =>
                  handleInputChange('header', 'contact', {
                    ...resumeData.header.contact,
                    location: e.target.value
                  })
                }
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                LinkedIn
              </label>
              <input
                type='text'
                value={resumeData.header.contact.linkedin}
                onChange={e =>
                  handleInputChange('header', 'contact', {
                    ...resumeData.header.contact,
                    linkedin: e.target.value
                  })
                }
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>
          </div>
        )

      case 'summary':
        return (
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Professional Summary
            </label>
            <textarea
              value={resumeData.summary}
              onChange={e => handleInputChange('summary', null, e.target.value)}
              rows={6}
              className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='Write a compelling professional summary...'
            />
          </div>
        )

      case 'skills':
        return (
          <div className='space-y-6'>
            <div>
              <div className='flex justify-between items-center mb-2'>
                <label className='block text-sm font-medium text-gray-700'>
                  Technical Skills
                </label>
                <button
                  onClick={() =>
                    handleInputChange('skills', 'technical', [
                      ...resumeData.skills.technical,
                      ''
                    ])
                  }
                  className='text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1'
                >
                  <Plus size={16} /> Add Skill
                </button>
              </div>
              <div className='space-y-2'>
                {resumeData.skills.technical.map((skill, index) => (
                  <div key={index} className='flex gap-2'>
                    <input
                      type='text'
                      value={skill}
                      onChange={e => {
                        const newSkills = [...resumeData.skills.technical]
                        newSkills[index] = e.target.value
                        handleInputChange('skills', 'technical', newSkills)
                      }}
                      className='flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
                      placeholder='Enter technical skill'
                    />
                    <button
                      onClick={() => {
                        const newSkills = resumeData.skills.technical.filter(
                          (_, i) => i !== index
                        )
                        handleInputChange('skills', 'technical', newSkills)
                      }}
                      className='text-red-500 hover:text-red-700 p-2'
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className='flex justify-between items-center mb-2'>
                <label className='block text-sm font-medium text-gray-700'>
                  Soft Skills
                </label>
                <button
                  onClick={() =>
                    handleInputChange('skills', 'soft', [
                      ...resumeData.skills.soft,
                      ''
                    ])
                  }
                  className='text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1'
                >
                  <Plus size={16} /> Add Skill
                </button>
              </div>
              <div className='space-y-2'>
                {resumeData.skills.soft.map((skill, index) => (
                  <div key={index} className='flex gap-2'>
                    <input
                      type='text'
                      value={skill}
                      onChange={e => {
                        const newSkills = [...resumeData.skills.soft]
                        newSkills[index] = e.target.value
                        handleInputChange('skills', 'soft', newSkills)
                      }}
                      className='flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
                      placeholder='Enter soft skill'
                    />
                    <button
                      onClick={() => {
                        const newSkills = resumeData.skills.soft.filter(
                          (_, i) => i !== index
                        )
                        handleInputChange('skills', 'soft', newSkills)
                      }}
                      className='text-red-500 hover:text-red-700 p-2'
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'experience':
        return (
          <div className='space-y-6'>
            {resumeData.experience.map((exp, index) => (
              <div
                key={index}
                className='border border-gray-200 rounded-lg p-4 bg-gray-50'
              >
                <div className='flex justify-between items-start mb-4'>
                  <h3 className='text-lg font-medium'>
                    Experience {index + 1}
                  </h3>
                  <button
                    onClick={() => removeItem('experience', index)}
                    className='text-red-500 hover:text-red-700'
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className='grid grid-cols-2 gap-4 mb-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Job Title
                    </label>
                    <input
                      type='text'
                      value={exp.title}
                      onChange={e =>
                        handleInputChange(
                          'experience',
                          'title',
                          e.target.value,
                          index
                        )
                      }
                      className='w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Company
                    </label>
                    <input
                      type='text'
                      value={exp.company}
                      onChange={e =>
                        handleInputChange(
                          'experience',
                          'company',
                          e.target.value,
                          index
                        )
                      }
                      className='w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Duration
                    </label>
                    <input
                      type='text'
                      value={exp.duration}
                      onChange={e =>
                        handleInputChange(
                          'experience',
                          'duration',
                          e.target.value,
                          index
                        )
                      }
                      className='w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Location
                    </label>
                    <input
                      type='text'
                      value={exp.location}
                      onChange={e =>
                        handleInputChange(
                          'experience',
                          'location',
                          e.target.value,
                          index
                        )
                      }
                      className='w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Achievements
                  </label>
                  {exp.achievements.map((achievement, achIndex) => (
                    <div key={achIndex} className='flex gap-2 mb-2'>
                      <input
                        type='text'
                        value={achievement}
                        onChange={e => {
                          const newAchievements = [...exp.achievements]
                          newAchievements[achIndex] = e.target.value
                          handleInputChange(
                            'experience',
                            'achievements',
                            newAchievements,
                            index
                          )
                        }}
                        className='flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
                      />
                      <button
                        onClick={() => {
                          const newAchievements = exp.achievements.filter(
                            (_, i) => i !== achIndex
                          )
                          handleInputChange(
                            'experience',
                            'achievements',
                            newAchievements,
                            index
                          )
                        }}
                        className='text-red-500 hover:text-red-700'
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newAchievements = [...exp.achievements, '']
                      handleInputChange(
                        'experience',
                        'achievements',
                        newAchievements,
                        index
                      )
                    }}
                    className='text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1'
                  >
                    <Plus size={16} /> Add Achievement
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() =>
                addItem('experience', {
                  title: '',
                  company: '',
                  duration: '',
                  location: '',
                  achievements: ['']
                })
              }
              className='w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 flex items-center justify-center gap-2'
            >
              <Plus size={20} /> Add Experience
            </button>
          </div>
        )

      case 'education':
        return (
          <div className='space-y-6'>
            {resumeData.education.map((edu, index) => (
              <div
                key={index}
                className='border border-gray-200 rounded-lg p-4 bg-gray-50'
              >
                <div className='flex justify-between items-start mb-4'>
                  <h3 className='text-lg font-medium'>Education {index + 1}</h3>
                  <button
                    onClick={() => removeItem('education', index)}
                    className='text-red-500 hover:text-red-700'
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className='grid grid-cols-2 gap-4 mb-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Degree
                    </label>
                    <input
                      type='text'
                      value={edu.degree}
                      onChange={e =>
                        handleInputChange(
                          'education',
                          'degree',
                          e.target.value,
                          index
                        )
                      }
                      className='w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Institution
                    </label>
                    <input
                      type='text'
                      value={edu.institution}
                      onChange={e =>
                        handleInputChange(
                          'education',
                          'institution',
                          e.target.value,
                          index
                        )
                      }
                      className='w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Year
                    </label>
                    <input
                      type='text'
                      value={edu.year}
                      onChange={e =>
                        handleInputChange(
                          'education',
                          'year',
                          e.target.value,
                          index
                        )
                      }
                      className='w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Location
                    </label>
                    <input
                      type='text'
                      value={edu.location}
                      onChange={e =>
                        handleInputChange(
                          'education',
                          'location',
                          e.target.value,
                          index
                        )
                      }
                      className='w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      GPA
                    </label>
                    <input
                      type='text'
                      value={edu.gpa}
                      onChange={e =>
                        handleInputChange(
                          'education',
                          'gpa',
                          e.target.value,
                          index
                        )
                      }
                      className='w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() =>
                addItem('education', {
                  degree: '',
                  institution: '',
                  year: '',
                  location: '',
                  gpa: ''
                })
              }
              className='w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 flex items-center justify-center gap-2'
            >
              <Plus size={20} /> Add Education
            </button>
          </div>
        )

      case 'projects':
        return (
          <div className='space-y-6'>
            {resumeData.projects.map((project, index) => (
              <div
                key={index}
                className='border border-gray-200 rounded-lg p-4 bg-gray-50'
              >
                <div className='flex justify-between items-start mb-4'>
                  <h3 className='text-lg font-medium'>Project {index + 1}</h3>
                  <button
                    onClick={() => removeItem('projects', index)}
                    className='text-red-500 hover:text-red-700'
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className='grid grid-cols-2 gap-4 mb-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Project Name
                    </label>
                    <input
                      type='text'
                      value={project.name}
                      onChange={e =>
                        handleInputChange(
                          'projects',
                          'name',
                          e.target.value,
                          index
                        )
                      }
                      className='w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Duration
                    </label>
                    <input
                      type='text'
                      value={project.duration}
                      onChange={e =>
                        handleInputChange(
                          'projects',
                          'duration',
                          e.target.value,
                          index
                        )
                      }
                      className='w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                </div>
                <div className='mb-4'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Description
                  </label>
                  <textarea
                    value={project.description}
                    onChange={e =>
                      handleInputChange(
                        'projects',
                        'description',
                        e.target.value,
                        index
                      )
                    }
                    rows={3}
                    className='w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
                  />
                </div>
                <div className='mb-4'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Technologies
                  </label>
                  <div className='flex flex-wrap gap-2 mb-2'>
                    {project.technologies.map((tech, techIndex) => (
                      <div
                        key={techIndex}
                        className='flex items-center gap-1 bg-gray-100 px-2 py-1 rounded'
                      >
                        <input
                          type='text'
                          value={tech}
                          onChange={e => {
                            const newTechs = [...project.technologies]
                            newTechs[techIndex] = e.target.value
                            handleInputChange(
                              'projects',
                              'technologies',
                              newTechs,
                              index
                            )
                          }}
                          className='bg-transparent border-none focus:ring-0 p-0'
                        />
                        <button
                          onClick={() => {
                            const newTechs = project.technologies.filter(
                              (_, i) => i !== techIndex
                            )
                            handleInputChange(
                              'projects',
                              'technologies',
                              newTechs,
                              index
                            )
                          }}
                          className='text-red-500 hover:text-red-700'
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      const newTechs = [...project.technologies, '']
                      handleInputChange(
                        'projects',
                        'technologies',
                        newTechs,
                        index
                      )
                    }}
                    className='text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1'
                  >
                    <Plus size={16} /> Add Technology
                  </button>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Achievements
                  </label>
                  {project.achievements.map((achievement, achIndex) => (
                    <div key={achIndex} className='flex gap-2 mb-2'>
                      <input
                        type='text'
                        value={achievement}
                        onChange={e => {
                          const newAchievements = [...project.achievements]
                          newAchievements[achIndex] = e.target.value
                          handleInputChange(
                            'projects',
                            'achievements',
                            newAchievements,
                            index
                          )
                        }}
                        className='flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
                      />
                      <button
                        onClick={() => {
                          const newAchievements = project.achievements.filter(
                            (_, i) => i !== achIndex
                          )
                          handleInputChange(
                            'projects',
                            'achievements',
                            newAchievements,
                            index
                          )
                        }}
                        className='text-red-500 hover:text-red-700'
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newAchievements = [...project.achievements, '']
                      handleInputChange(
                        'projects',
                        'achievements',
                        newAchievements,
                        index
                      )
                    }}
                    className='text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1'
                  >
                    <Plus size={16} /> Add Achievement
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() =>
                addItem('projects', {
                  name: '',
                  description: '',
                  technologies: [''],
                  achievements: [''],
                  duration: ''
                })
              }
              className='w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 flex items-center justify-center gap-2'
            >
              <Plus size={20} /> Add Project
            </button>
          </div>
        )

      case 'certifications':
        return (
          <div className='space-y-6'>
            {resumeData.certifications.map((cert, index) => (
              <div
                key={index}
                className='border border-gray-200 rounded-lg p-4 bg-gray-50'
              >
                <div className='flex justify-between items-start mb-4'>
                  <h3 className='text-lg font-medium'>
                    Certification {index + 1}
                  </h3>
                  <button
                    onClick={() => removeItem('certifications', index)}
                    className='text-red-500 hover:text-red-700'
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className='grid grid-cols-2 gap-4 mb-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Certification Name
                    </label>
                    <input
                      type='text'
                      value={cert.name}
                      onChange={e =>
                        handleInputChange(
                          'certifications',
                          'name',
                          e.target.value,
                          index
                        )
                      }
                      className='w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Issuer
                    </label>
                    <input
                      type='text'
                      value={cert.issuer}
                      onChange={e =>
                        handleInputChange(
                          'certifications',
                          'issuer',
                          e.target.value,
                          index
                        )
                      }
                      className='w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Date Obtained
                    </label>
                    <input
                      type='text'
                      value={cert.dateObtained}
                      onChange={e =>
                        handleInputChange(
                          'certifications',
                          'dateObtained',
                          e.target.value,
                          index
                        )
                      }
                      className='w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() =>
                addItem('certifications', {
                  name: '',
                  issuer: '',
                  dateObtained: ''
                })
              }
              className='w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 flex items-center justify-center gap-2'
            >
              <Plus size={20} /> Add Certification
            </button>
          </div>
        )

      case 'additional':
        return (
          <div className='space-y-6'>
            {/* Achievements */}
            <div className='border border-gray-200 rounded-lg p-4 bg-gray-50'>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='text-lg font-medium'>Achievements</h3>
                <button
                  onClick={() => toggleCollapse('achievements')}
                  className='text-gray-500 hover:text-gray-700'
                >
                  {collapsedSections['achievements'] ? (
                    <ChevronDown size={20} />
                  ) : (
                    <ChevronUp size={20} />
                  )}
                </button>
              </div>
              {!collapsedSections['achievements'] && (
                <div className='space-y-4'>
                  {resumeData.additionalSections.achievements.map(
                    (achievement, index) => (
                      <div key={index} className='flex gap-2'>
                        <input
                          type='text'
                          value={achievement}
                          onChange={e => {
                            const newAchievements = [
                              ...resumeData.additionalSections.achievements
                            ]
                            newAchievements[index] = e.target.value
                            handleInputChange(
                              'additionalSections',
                              'achievements',
                              newAchievements
                            )
                          }}
                          className='flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
                        />
                        <button
                          onClick={() =>
                            removeAdditionalItem('achievements', index)
                          }
                          className='text-red-500 hover:text-red-700 p-2'
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )
                  )}
                  <button
                    onClick={() => addAdditionalItem('achievements', '')}
                    className='text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1'
                  >
                    <Plus size={16} /> Add Achievement
                  </button>
                </div>
              )}
            </div>

            {/* Volunteer Work */}
            <div className='border border-gray-200 rounded-lg p-4 bg-gray-50'>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='text-lg font-medium'>Volunteer Work</h3>
                <button
                  onClick={() => toggleCollapse('volunteerWork')}
                  className='text-gray-500 hover:text-gray-700'
                >
                  {collapsedSections['volunteerWork'] ? (
                    <ChevronDown size={20} />
                  ) : (
                    <ChevronUp size={20} />
                  )}
                </button>
              </div>
              {!collapsedSections['volunteerWork'] && (
                <div className='space-y-4'>
                  {resumeData.additionalSections.volunteerWork.map(
                    (volunteer, index) => (
                      <div
                        key={index}
                        className='space-y-3 border-b pb-4 last:border-b-0 last:pb-0'
                      >
                        <div className='grid grid-cols-2 gap-4'>
                          <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                              Role
                            </label>
                            <input
                              type='text'
                              value={volunteer.role}
                              onChange={e =>
                                handleInputChange(
                                  'additionalSections',
                                  'volunteerWork',
                                  {
                                    ...resumeData.additionalSections
                                      .volunteerWork,
                                    [index]: {
                                      ...volunteer,
                                      role: e.target.value
                                    }
                                  }
                                )
                              }
                              className='w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
                            />
                          </div>
                          <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                              Organization
                            </label>
                            <input
                              type='text'
                              value={volunteer.organization}
                              onChange={e =>
                                handleInputChange(
                                  'additionalSections',
                                  'volunteerWork',
                                  {
                                    ...resumeData.additionalSections
                                      .volunteerWork,
                                    [index]: {
                                      ...volunteer,
                                      organization: e.target.value
                                    }
                                  }
                                )
                              }
                              className='w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
                            />
                          </div>
                          <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                              Duration
                            </label>
                            <input
                              type='text'
                              value={volunteer.duration}
                              onChange={e =>
                                handleInputChange(
                                  'additionalSections',
                                  'volunteerWork',
                                  {
                                    ...resumeData.additionalSections
                                      .volunteerWork,
                                    [index]: {
                                      ...volunteer,
                                      duration: e.target.value
                                    }
                                  }
                                )
                              }
                              className='w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
                            />
                          </div>
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Description
                          </label>
                          <textarea
                            value={volunteer.description}
                            onChange={e =>
                              handleInputChange(
                                'additionalSections',
                                'volunteerWork',
                                {
                                  ...resumeData.additionalSections
                                    .volunteerWork,
                                  [index]: {
                                    ...volunteer,
                                    description: e.target.value
                                  }
                                }
                              )
                            }
                            rows={2}
                            className='w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
                          />
                        </div>
                        <button
                          onClick={() =>
                            removeAdditionalItem('volunteerWork', index)
                          }
                          className='text-red-500 hover:text-red-700 text-sm flex items-center gap-1'
                        >
                          <Trash2 size={14} /> Remove Volunteer Work
                        </button>
                      </div>
                    )
                  )}
                  <button
                    onClick={() =>
                      addAdditionalItem('volunteerWork', {
                        role: '',
                        organization: '',
                        duration: '',
                        description: ''
                      })
                    }
                    className='text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1'
                  >
                    <Plus size={16} /> Add Volunteer Work
                  </button>
                </div>
              )}
            </div>

            {/* Languages */}
            <div className='border border-gray-200 rounded-lg p-4 bg-gray-50'>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='text-lg font-medium'>Languages</h3>
                <button
                  onClick={() => toggleCollapse('languages')}
                  className='text-gray-500 hover:text-gray-700'
                >
                  {collapsedSections['languages'] ? (
                    <ChevronDown size={20} />
                  ) : (
                    <ChevronUp size={20} />
                  )}
                </button>
              </div>
              {!collapsedSections['languages'] && (
                <div className='space-y-4'>
                  {resumeData.additionalSections.languages.map(
                    (language, index) => (
                      <div key={index} className='flex gap-2'>
                        <input
                          type='text'
                          value={language}
                          onChange={e => {
                            const newLanguages = [
                              ...resumeData.additionalSections.languages
                            ]
                            newLanguages[index] = e.target.value
                            handleInputChange(
                              'additionalSections',
                              'languages',
                              newLanguages
                            )
                          }}
                          className='flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
                        />
                        <button
                          onClick={() =>
                            removeAdditionalItem('languages', index)
                          }
                          className='text-red-500 hover:text-red-700 p-2'
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )
                  )}
                  <button
                    onClick={() => addAdditionalItem('languages', '')}
                    className='text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1'
                  >
                    <Plus size={16} /> Add Language
                  </button>
                </div>
              )}
            </div>

            {/* Other Activities */}
            <div className='border border-gray-200 rounded-lg p-4 bg-gray-50'>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='text-lg font-medium'>Other Activities</h3>
                <button
                  onClick={() => toggleCollapse('otherActivities')}
                  className='text-gray-500 hover:text-gray-700'
                >
                  {collapsedSections['otherActivities'] ? (
                    <ChevronDown size={20} />
                  ) : (
                    <ChevronUp size={20} />
                  )}
                </button>
              </div>
              {!collapsedSections['otherActivities'] && (
                <div className='space-y-4'>
                  {resumeData.additionalSections.otherActivities.map(
                    (activity, index) => (
                      <div key={index} className='flex gap-2'>
                        <input
                          type='text'
                          value={activity}
                          onChange={e => {
                            const newActivities = [
                              ...resumeData.additionalSections.otherActivities
                            ]
                            newActivities[index] = e.target.value
                            handleInputChange(
                              'additionalSections',
                              'otherActivities',
                              newActivities
                            )
                          }}
                          className='flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
                        />
                        <button
                          onClick={() =>
                            removeAdditionalItem('otherActivities', index)
                          }
                          className='text-red-500 hover:text-red-700 p-2'
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )
                  )}
                  <button
                    onClick={() => addAdditionalItem('otherActivities', '')}
                    className='text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1'
                  >
                    <Plus size={16} /> Add Activity
                  </button>
                </div>
              )}
            </div>
          </div>
        )

      default:
        return <div className='text-gray-500'>Select a section to edit</div>
    }
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-4'>
            <div className='flex items-center gap-3'>
              <div className='bg-colors-primary text-white p-2 rounded-lg'>
                <Edit3 size={24} />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-colors-textPrimary'>
                  Resume Builder
                </h1>
                <p className='text-colors-textSecondary'>
                  Create and customize your professional resume
                </p>
              </div>
            </div>
            <div className='flex gap-3'>
              <button
                onClick={downloadResume}
                className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-[12px] flex items-center gap-2 transition-colors duration-200'
              >
                <Download size={16} />
                Download
              </button>
              <button
                onClick={handleSaveResume}
                className='bg-colors-primary hover:bg-indigo-700 text-white px-4 py-2 rounded-[12px] flex items-center gap-2 transition-colors duration-200'
                disabled={isSaving || isUploading}
              >
                <Save size={16} />
                {isSaving || isUploading ? 'Saving...' : 'Save'}
                {(isSaving || isUploading) && (
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                )}
              </button>
              <button
                onClick={handleApplyWithResume}
                className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-[12px] flex items-center gap-2 transition-colors duration-200'
                disabled={isApplying || isSaving || isUploading}
              >
                <Briefcase size={16} />
                {isApplying ? 'Applying...' : 'Apply with this Resume'}
                {isApplying && (
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='px-4 sm:px-4 lg:px-4 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          {/* Editor Panel */}
          <div className='bg-white rounded-xl shadow-lg border border-gray-200'>
            <div className='p-6 border-b border-gray-200'>
              <h2 className='text-xl font-semibold text-colors-textPrimary mb-4'>
                Edit Resume
              </h2>
              <div className='grid grid-cols-2 gap-2'>
                {[
                  { key: 'header', label: 'Header', icon: User },
                  { key: 'summary', label: 'Summary', icon: Edit3 },
                  { key: 'experience', label: 'Experience', icon: Briefcase },
                  { key: 'skills', label: 'Skills', icon: Code },
                  { key: 'projects', label: 'Projects', icon: Star },
                  { key: 'education', label: 'Education', icon: GraduationCap },
                  {
                    key: 'certifications',
                    label: 'Certifications',
                    icon: Award
                  },
                  { key: 'additional', label: 'Additional', icon: Plus }
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveSection(key)}
                    className={`p-3 rounded-[12px] flex items-center gap-2 text-sm font-medium transition-colors duration-200 ${
                      activeSection === key
                        ? 'bg-colors-primary/10 text-colors-primary border border-colors-primary/20'
                        : 'bg-gray-50 text-colors-textSecondary hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className='p-6 max-h-[700px] overflow-y-auto'>
              {renderEditor()}
            </div>
          </div>

          <div className='bg-white rounded-xl shadow-lg border border-gray-200'>
            <div className='p-6 border-b border-gray-200'>
              <h2 className='text-xl font-semibold text-colors-textPrimary'>
                {isEditing ? 'Resume Preview' : 'Your Resume'}
              </h2>
            </div>
            <div className='p-6 max-h-screen overflow-y-auto'>
              <TraditionalResumeTemplate resumeData={resumeData} />
            </div>
          </div>
        </div>
        {/* Resume Guide Section */}
        <div className='flex flex-col md:flex-row gap-4 '>
          <div className='mt-8 bg-white rounded-xl shadow-lg h-[1200px] overflow-auto border border-gray-200 p-6'>
            <ResumeGuide onComplete={handleShowResumeScore} />
          </div>

          {showResumeScore && (
            <div className='mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6'>
              <ResumeScoreChecker resumeData={resumeData} />
            </div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='fixed top-4 right-4 z-50'
          >
            <Toast
              type={toastConfig.type}
              title={toastConfig.title}
              message={toastConfig.message}
              onClose={() => setShowToast(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <JobSubmissionPopup
        isOpen={showSubmissionPopup}
        onClose={() => {
          setShowSubmissionPopup(false)
          router.push('/job-listings') 
        }}
        illustrationSrc='/assets/submit.svg' // Add this image to your public folder
      />
    </div>
  )
}

export default ResumeBuilder
