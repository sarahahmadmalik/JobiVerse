"use client";
import { useState } from "react";
import Button from "@/components/ui/button";
import InputAuto from "@/components/ui/input-auto";
import { X } from "lucide-react";
import { SKILLS } from "@/constants/constants";

export default function SkillsSection({ data, onUpdate, editMode }) {
  const [skills, setSkills] = useState(data);
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updated = [...skills, newSkill.trim()];
      setSkills(updated);
      onUpdate(updated);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updated = skills.filter(skill => skill !== skillToRemove);
    setSkills(updated);
    onUpdate(updated);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Skills</h2>
      </div>

      {editMode ? (
        <div>
          <div className="mb-4">
            <InputAuto
              label="Add Skills"
              placeholder="Type a skill, e.g., Project Management"
              suggestions={SKILLS}
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onSelect={(skill) => {
                setNewSkill('');
                if (!skills.includes(skill)) {
                  const updated = [...skills, skill];
                  setSkills(updated);
                  onUpdate(updated);
                }
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <div 
                key={skill} 
                className="flex items-center px-3 py-1 border border-colors-primary rounded-full text-sm font-[400] text-colors-primary"
              >
                <span>{skill}</span>
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-2 text-colors-primary hover:text-red-500"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.length === 0 ? (
            <p className="text-gray-500">No skills added yet</p>
          ) : (
            skills.map(skill => (
              <span 
                key={skill} 
                className="px-3 py-1 border border-colors-primary rounded-full text-sm font-[400] text-colors-primary"
              >
                {skill}
              </span>
            ))
          )}
        </div>
      )}
    </div>
  );
}