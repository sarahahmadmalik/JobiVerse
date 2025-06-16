"use client";
import Button from "@/components/ui/button";
import { CheckCircle2, Clock, MapPin, Video, Mail, MoreVertical } from "lucide-react";

export default function InterviewCard({
  candidate,
  role,
  time,
  type,
  interviewers,
  status,
  meetingType,
  meetingLink,
  location
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900">{candidate}</h3>
            <p className="text-sm text-gray-500">{role}</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical size={18} />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2">
          {status === "Invited" ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircle2 size={14} /> Invited
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <Clock size={14} /> Pending
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {type}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
          <Clock size={14} className="text-gray-400" />
          <span>{time}</span>
        </div>

        {meetingType === "Zoom" || meetingType === "Google Meet" ? (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <Video size={14} className="text-gray-400" />
            <a href={meetingLink} className="text-blue-600 hover:underline">
              Join {meetingType} Meeting
            </a>
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={14} className="text-gray-400" />
            <span>{location}</span>
          </div>
        )}

        <div className="mt-4">
          <h4 className="text-xs font-medium text-gray-500 mb-1">INTERVIEWERS</h4>
          <div className="flex flex-wrap gap-1">
            {interviewers.map((interviewer, i) => (
              <span key={i} className="px-2 py-1 bg-gray-100 rounded-md text-xs">
                {interviewer}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50">
            <Mail size={14} /> Message
          </button>
          <Button className="flex-1 !px-3 py-2  text-white rounded-md !text-sm font-medium !shadow-none">
            View Profile
          </Button>
        </div>
      </div>
    </div>
  );
}