"use client";
import { ChevronRight, Users, User } from "lucide-react";

export default function JobPipelineCard({
  jobTitle,
  stages,
  totalApplicants,
  hiringManager
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <h3 className="font-medium text-gray-900">{jobTitle}</h3>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <Users size={14} className="mr-1" />
          <span>{totalApplicants} applicants</span>
        </div>
        <div className="mt-1 flex items-center text-sm text-gray-500">
          <User size={14} className="mr-1" />
          <span>Hiring Manager: {hiringManager}</span>
        </div>

        <div className="mt-4 space-y-3">
          {stages.map((stage, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-500">{stage.name}</span>
                <span className="text-xs font-medium">{stage.count}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${stage.color.split(' ')[0]}`}
                  style={{ width: `${(stage.count / totalApplicants) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <button className="mt-4 w-full flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50">
          View Pipeline <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}