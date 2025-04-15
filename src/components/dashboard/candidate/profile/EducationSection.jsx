"use client"
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { TrashIcon } from "lucide-react";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

export default function EducationSection({ data, onUpdate, editMode }) {
    const [educations, setEducations] = useState(data);
    const [newEducation, setNewEducation] = useState({
      institution: '',
      degree: '',
      field: '',
      startYear: '',
      endYear: '',
      description: ''
    });
    const [isAdding, setIsAdding] = useState(false);
  
    const handleAdd = () => {
      if (newEducation.institution && newEducation.degree) {
        const updated = [...educations, { ...newEducation, id: Date.now() }];
        setEducations(updated);
        onUpdate(updated);
        setNewEducation({
          institution: '',
          degree: '',
          field: '',
          startYear: '',
          endYear: '',
          description: ''
        });
        setIsAdding(false);
      }
    };
  
    const handleRemove = (id) => {
      const updated = educations.filter(edu => edu.id !== id);
      setEducations(updated);
      onUpdate(updated);
    };
  
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Education</h2>
          {editMode && !isAdding && (
            <Button
              onClick={() => setIsAdding(true)}
              className="!px-3 py-1 !font-[500] !shadow-none text-white !text-sm rounded-md flex items-center gap-2"
            >
              <FaPlus className="h-3 w-3" />
              Add Education
            </Button>
          )}
        </div>
  
        {isAdding && (
          <div className="mb-6 p-4 border border-gray-200 rounded-md">
            <h3 className="font-medium mb-3">Add New Education</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Institution*"
                type="text"
                value={newEducation.institution}
                onChange={(e) => setNewEducation({...newEducation, institution: e.target.value})}
                className={"!px-3"}
              />
              <Input
                label="Degree*"
                type="text"
                value={newEducation.degree}
                onChange={(e) => setNewEducation({...newEducation, degree: e.target.value})}
                className={"!px-3"}
              />
              <Input
                label="Field of Study"
                type="text"
                value={newEducation.field}
                onChange={(e) => setNewEducation({...newEducation, field: e.target.value})}
                className={"!px-3"}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Start Year"
                  type="text"
                  value={newEducation.startYear}
                  onChange={(e) => setNewEducation({...newEducation, startYear: e.target.value})}
                  className={"!px-3"}
                />
                <Input
                  label="End Year"
                  type="text"
                  value={newEducation.endYear}
                  onChange={(e) => setNewEducation({...newEducation, endYear: e.target.value})}
                  className={"!px-3"}
                />
              </div>
              <div className="md:col-span-2">
                <div className="flex flex-col w-full">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newEducation.description}
                    onChange={(e) => setNewEducation({...newEducation, description: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-[12px] border border-gray-300 rounded-[12px] text-gray-800 placeholder-gray-400 
                               focus:outline-none focus:ring-1 focus:ring-colors-primary focus:border-colors-primary 
                               hover:border-gray-400 transition-all duration-200 ease-in-out"
                  />
                </div>
              </div>
            </div>
            <div className="mt-3 flex justify-end space-x-2">
              <button
                onClick={() => setIsAdding(false)}
                className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <Button
                onClick={handleAdd}
                disabled={!newEducation.institution || !newEducation.degree}
                className={`!px-3 py-1 text-white !shadow-none !rounded !text-sm ${
                  !newEducation.institution || !newEducation.degree
                    ? 'cursor-not-allowed'
                    : ''
                }`}
              >
                Save
              </Button>
            </div>
          </div>
        )}
  
        <div className="space-y-4">
          {educations.length === 0 ? (
            <p className="text-gray-500">No education added yet</p>
          ) : (
            educations.map(edu => (
              <div key={edu.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0 group">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-medium">
                      {edu.degree}{edu.field && ` in ${edu.field}`}
                    </h3>
                    <p className="text-gray-600">{edu.institution}</p>
                    {(edu.startYear || edu.endYear) && (
                      <p className="text-sm text-gray-500">
                        {edu.startYear} {edu.endYear && `- ${edu.endYear}`}
                      </p>
                    )}
                    {edu.description && (
                      <p className="mt-1 text-gray-700 text-sm">{edu.description}</p>
                    )}
                  </div>
                  {editMode && (
                    <button
                      onClick={() => handleRemove(edu.id)}
                      className="text-red-500 hover:text-red-700 transition-colors ml-4"
                      aria-label="Remove education"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
}