import React from 'react';
import Image from 'next/image';
import Button from '@/components/ui/button';

const JobSubmissionPopup = ({ isOpen, onClose, illustrationSrc = "/assets/submit.svg" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center shadow-2xl">

        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Application Submitted
        </h1>
        
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24">
            <Image
              src={illustrationSrc || "/assets/submit.svg"}
              alt="Submission successful"
              width={96}
              height={96}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        
        <p className="text-gray-500 text-lg leading-relaxed mb-8">
          Your response has been submitted.<br />
          Someone from our team will reach out<br />
          to you as soon as possible.
        </p>
        
        <Button 
          onClick={onClose}
          className=" px-8 py-3 text-base"
        >
          Go Back to Jobs
        </Button>
      </div>
    </div>
  );
};

export default JobSubmissionPopup;