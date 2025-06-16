'use client';

import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react';

const ATSFriendlyResume = ({ resumeData }) => {
  const data = resumeData;

  return (
    <div id="resume-template" className="bg-white max-w-4xl mx-auto p-6 font-sans text-sm leading-snug print:shadow-none print:max-w-none">
      {/* Header - Full width */}
      <div className="flex flex-col md:flex-row justify-between mb-4 pb-2 border-b border-gray-300">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{data.header.name}</h1>
          <p className="text-gray-700">{data.header.title}</p>
        </div>
        <div className="mt-2 md:mt-0">
          <div className="flex items-center mb-1">
            <Mail className="w-4 h-4 mr-2 text-gray-700" />
            <a href={`mailto:${data.header.contact.email}`} className="text-gray-700">{data.header.contact.email}</a>
          </div>
          <div className="flex items-center mb-1">
            <Phone className="w-4 h-4 mr-2 text-gray-700" />
            <span className="text-gray-700">{data.header.contact.phone}</span>
          </div>
          <div className="flex items-center mb-1">
            <Linkedin className="w-4 h-4 mr-2 text-gray-700" />
            <a href={data.header.contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-700">LinkedIn Profile</a>
          </div>
          {data.header.contact.github && (
            <div className="flex items-center">
              <Github className="w-4 h-4 mr-2 text-gray-700" />
              <a href={data.header.contact.github} target="_blank" rel="noopener noreferrer" className="text-gray-700">GitHub Profile</a>
            </div>
          )}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Skills & Education */}
        <div className="md:col-span-1">
          {/* Skills */}
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900 mb-2 border-b border-gray-300 pb-1">SKILLS</h2>
            {data.skills?.technical?.length > 0 && (
              <div className="mb-3">
                <h3 className="font-semibold text-gray-800 mb-1">Technical Skills</h3>
                <ul className="space-y-1">
                  {data.skills.technical.map((skill, index) => (
                    <li key={index} className="text-gray-700">{skill}</li>
                  ))}
                </ul>
              </div>
            )}
            {data.skills?.soft?.length > 0 && (
              <div className="mb-3">
                <h3 className="font-semibold text-gray-800 mb-1">Soft Skills</h3>
                <ul className="space-y-1">
                  {data.skills.soft.map((skill, index) => (
                    <li key={index} className="text-gray-700">{skill}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Education */}
          {data.education?.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900 mb-2 border-b border-gray-300 pb-1">EDUCATION</h2>
              {data.education.map((edu, index) => (
                <div key={index} className="mb-3">
                  <h3 className="font-semibold text-gray-800">{edu.degree}</h3>
                  <p className="text-gray-700">{edu.institution}</p>
                  <p className="text-gray-600 text-sm">{edu.year}</p>
                  {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {data.certifications?.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900 mb-2 border-b border-gray-300 pb-1">CERTIFICATIONS</h2>
              {data.certifications.map((cert, index) => (
                <div key={index} className="mb-2">
                  <h3 className="font-semibold text-gray-800">{cert.name}</h3>
                  <p className="text-gray-700 text-sm">{cert.issuer}</p>
                  {cert.dateObtained && <p className="text-gray-600 text-sm">{cert.dateObtained}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {data.additionalSections?.languages?.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900 mb-2 border-b border-gray-300 pb-1">LANGUAGES</h2>
              <ul className="space-y-1">
                {data.additionalSections.languages.map((lang, index) => (
                  <li key={index} className="text-gray-700">{lang}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column - Experience & Projects */}
        <div className="md:col-span-2">
          {/* Professional Summary */}
          {data.summary && (
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900 mb-2 border-b border-gray-300 pb-1">PROFESSIONAL SUMMARY</h2>
              <p className="text-gray-700">{data.summary}</p>
            </div>
          )}

          {/* Experience */}
          {data.experience?.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900 mb-2 border-b border-gray-300 pb-1">PROFESSIONAL EXPERIENCE</h2>
              {data.experience.map((exp, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-gray-800">{exp.title}</h3>
                    <span className="text-gray-600 text-sm">{exp.duration}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <p className="text-gray-700 italic">{exp.company}</p>
                    {exp.location && <p className="text-gray-600 text-sm">{exp.location}</p>}
                  </div>
                  {exp.achievements?.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {exp.achievements.map((achievement, achIndex) => (
                        <li key={achIndex} className="text-gray-700 flex">
                          <span className="mr-2">•</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {data.projects?.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900 mb-2 border-b border-gray-300 pb-1">PROJECTS</h2>
              {data.projects.map((project, index) => (
                <div key={index} className="mb-3">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-gray-800">{project.name}</h3>
                    {project.duration && <span className="text-gray-600 text-sm">{project.duration}</span>}
                  </div>
                  {project.technologies?.length > 0 && (
                    <p className="text-gray-700 text-sm mb-1">
                      <span className="font-medium">Technologies:</span> {project.technologies.join(', ')}
                    </p>
                  )}
                  {project.description && <p className="text-gray-700 mb-1">{project.description}</p>}
                  {project.achievements?.length > 0 && (
                    <ul className="mt-1 space-y-1">
                      {project.achievements.map((achievement, achIndex) => (
                        <li key={achIndex} className="text-gray-700 flex">
                          <span className="mr-2">•</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ATSFriendlyResume;