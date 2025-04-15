"use client"
import { useState } from "react";
import { Linkedin, Github, Dribbble } from "lucide-react";
import Input from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";

export default function PortfolioSection({ data, onUpdate, editMode }) {
  const [links, setLinks] = useState(data);
  
  const handleChange = (platform, value) => {
    const updated = { ...links, [platform]: value };
    setLinks(updated);
    onUpdate(updated);
  };

  const platforms = [
    { 
      id: 'linkedin', 
      name: 'LinkedIn', 
      icon: <Linkedin className="h-5 w-5" />, 
      placeholder: 'linkedin.com/in/username',
      color: 'text-[#0A66C2]'
    },
    { 
      id: 'github', 
      name: 'GitHub', 
      icon: <Github className="h-5 w-5" />, 
      placeholder: 'github.com/username',
      color: 'text-gray-800'
    },
    { 
      id: 'dribbble', 
      name: 'Dribbble', 
      icon: <Dribbble className="h-5 w-5" />, 
      placeholder: 'dribbble.com/username',
      color: 'text-[#EA4C89]'
    },
    { 
      id: 'behance', 
      name: 'Behance', 
      icon: (
        <Image 
          src={"/assets/behance.png"}
          alt="Behance"
          width={20}
          height={20}
          className="h-5 w-5"
        />
      ),
      placeholder: 'behance.net/username',
      color: 'text-[#1769FF]'
    },
  ];

  const formatUrl = (url) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `https://${url}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Portfolio & Social Links</h2>
      </div>

      <div className="space-y-4">
        {platforms.map(platform => (
          <div key={platform.id} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 ${platform.color}`}>
              {platform.icon}
            </div>
            {editMode ? (
              <div className="flex-1 flex items-center gap-2">
                <span className="text-gray-500">https://</span>
                <Input
                  type="text"
                  value={links[platform.id]?.replace(/^https?:\/\//, '') || ''}
                  onChange={(e) => handleChange(platform.id, e.target.value)}
                  placeholder={platform.placeholder}
                  className="flex-1 !px-3"
                />
              </div>
            ) : (
              <div className="flex-1">
                {links[platform.id] ? (
                  <Link
                    href={formatUrl(links[platform.id])}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`hover:underline flex items-center gap-2 ${platform.color}`}
                  >
                    <span>{links[platform.id].replace(/^https?:\/\//, '')}</span>
                  </Link>
                ) : (
                  <div className="text-gray-400">
                    Not provided
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}