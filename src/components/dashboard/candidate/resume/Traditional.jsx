'use client';

import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react';

const TraditionalResumeTemplate = ({ resumeData }) => {

  const data = resumeData;

  return (
    <div id="resume-template" className="bg-white max-w-4xl mx-auto p-6 font-serif text-sm leading-tight print:shadow-none print:max-w-none">
      {/* Header */}
      <div className="text-center mb-3 pb-2 border-b border-black">
        <h1 className="text-2xl font-bold text-black mb-1">{data.header.name}</h1>
        <div className="flex flex-wrap justify-center gap-2 text-sm text-black">
          <span>{data.header.contact.phone}</span>
          <span>|</span>
          <a href={`mailto:${data.header.contact.email}`} className="underline text-blue-600">{data.header.contact.email}</a>
          <span>|</span>
          <a href={data.header.contact.linkedin} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">LinkedIn</a>
          <span>|</span>
          <a href={data.header.contact.github} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">GitHub</a>
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-3">
          <h2 className="text-base font-bold text-black mb-1 border-b border-black pb-0">
            Summary
          </h2>
          <p className="text-black text-justify leading-tight mt-1">{data.summary}</p>
        </div>
      )}

      {/* Technical Skills */}
      {data.skills?.technical?.length > 0 && (
        <div className="mb-3">
          <h2 className="text-base font-bold text-black mb-1 border-b border-black pb-0">
            Technical Skills
          </h2>
          <div className="grid grid-cols-3 gap-x-6 gap-y-0 mt-1">
            {data.skills.technical.map((skill, index) => (
              <div key={index} className="text-black flex items-center">
                <span className="mr-2">•</span>
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Soft Skills */}
      {data.skills?.soft?.length > 0 && (
        <div className="mb-3">
          <h2 className="text-base font-bold text-black mb-1 border-b border-black pb-0">
            Soft Skills
          </h2>
          <div className="grid grid-cols-3 gap-x-6 gap-y-0 mt-1">
            {data.skills.soft.map((skill, index) => (
              <div key={index} className="text-black flex items-center">
                <span className="mr-2">•</span>
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {data.experience?.length > 0 && (
        <div className="mb-3">
          <h2 className="text-base font-bold text-black mb-1 border-b border-black pb-0">
            Experience
          </h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-2 mt-1">
              <div className="flex justify-between items-start mb-0">
                <div>
                  <h3 className="font-bold text-black">{exp.company}</h3>
                  <p className="text-black italic -mt-0">{exp.title}</p>
                </div>
                <div className="text-right text-black font-bold">
                  <p>{exp.duration}</p>
                </div>
              </div>
              {exp.achievements?.length > 0 && (
                <ul className="text-black text-justify space-y-0 mt-1">
                  {exp.achievements.map((achievement, achIndex) => (
                    <li key={achIndex} className="flex items-start leading-tight">
                      <span className="mr-2 mt-0">•</span>
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
        <div className="mb-3">
          <h2 className="text-base font-bold text-black mb-1 border-b border-black pb-0">
            Projects
          </h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-2 mt-1">
              <div className="flex justify-between items-start mb-0">
                <h3 className="font-bold text-black">{project.name}</h3>
                {project.duration && <span className="text-black font-bold">{project.duration}</span>}
              </div>
              {project.description && <p className="text-black text-justify mb-0 leading-tight">{project.description}</p>}
              {project.technologies?.length > 0 && (
                <div className="text-black mb-0">
                  <span className="font-semibold">Technologies: </span>
                  {project.technologies.join(', ')}
                </div>
              )}
              {project.achievements?.length > 0 && (
                <ul className="text-black text-justify space-y-0">
                  {project.achievements.map((achievement, achIndex) => (
                    <li key={achIndex} className="flex items-start leading-tight">
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

      {/* Education */}
      {data.education?.length > 0 && (
        <div className="mb-3">
          <h2 className="text-base font-bold text-black mb-1 border-b border-black pb-0">
            Education
          </h2>
          {data.education.map((edu, index) => (
            <div key={index} className="flex justify-between items-start mb-1 mt-1">
              <div>
                <h3 className="font-bold text-black">{edu.institution}</h3>
                <p className="text-black italic -mt-0">{edu.degree}</p>
                {edu.location && <p className="text-black -mt-0">{edu.location}</p>}
              </div>
              <div className="text-right text-black font-bold">
                <p>{edu.year}</p>
                {edu.gpa && <p>GPA: {edu.gpa}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {data.certifications?.length > 0 && (
        <div className="mb-3">
          <h2 className="text-base font-bold text-black mb-1 border-b border-black pb-0">
            Certifications
          </h2>
          <div className="space-y-1 mt-1">
            {data.certifications.map((cert, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-black">{cert.name}</h3>
                  {cert.issuer && <p className="text-black italic -mt-0">{cert.issuer}</p>}
                </div>
                {cert.dateObtained && <span className="text-black font-bold">{cert.dateObtained}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Sections */}
      {data.additionalSections && (
        <>
          {/* Achievements */}
          {data.additionalSections.achievements?.length > 0 && (
            <div className="mb-3">
              <h2 className="text-base font-bold text-black mb-1 border-b border-black pb-0">
                Achievements
              </h2>
              <ul className="text-black space-y-0 mt-1">
                {data.additionalSections.achievements.map((ach, index) => (
                  <li key={index} className="flex items-start leading-tight">
                    <span className="mr-2">•</span>
                    <span>{ach}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Volunteer Work */}
          {data.additionalSections.volunteerWork?.length > 0 && (
            <div className="mb-3">
              <h2 className="text-base font-bold text-black mb-1 border-b border-black pb-0">
                Volunteer Work
              </h2>
              {data.additionalSections.volunteerWork.map((vol, index) => (
                <div key={index} className="mb-2 mt-1">
                  <div className="flex justify-between items-start mb-0">
                    <h3 className="font-bold text-black">{vol.role}</h3>
                    {vol.duration && <span className="text-black font-bold">{vol.duration}</span>}
                  </div>
                  {vol.organization && <div className="text-black italic -mt-0">{vol.organization}</div>}
                  {vol.description && <p className="text-black text-justify mt-0 leading-tight">{vol.description}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {data.additionalSections.languages?.length > 0 && (
            <div className="mb-3">
              <h2 className="text-base font-bold text-black mb-1 border-b border-black pb-0">
                Languages
              </h2>
              <div className="text-black mt-1">
                {data.additionalSections.languages.join(', ')}
              </div>
            </div>
          )}

          {/* Other Activities */}
          {data.additionalSections.otherActivities?.length > 0 && (
            <div className="mb-3">
              <h2 className="text-base font-bold text-black mb-1 border-b border-black pb-0">
                Other Activities
              </h2>
              <ul className="text-black space-y-0 mt-1">
                {data.additionalSections.otherActivities.map((act, index) => (
                  <li key={index} className="flex items-start leading-tight">
                    <span className="mr-2">•</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TraditionalResumeTemplate;