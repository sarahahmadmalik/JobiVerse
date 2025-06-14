'use client'
import Button from '@/components/ui/button'
import { Camera } from 'lucide-react'

export default function ProfileHeader ({ user, editMode, toggleEditMode }) {
  return (
    <div className='bg-white shadow-sm border-b'>
      <div className='max-w-7xl mx-auto'>
        {/* Fixed Gradient Cover Photo - Cannot be changed */}
        <div
          className='h-48 w-full rounded-t-[16px] relative'
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        >
          {/* No edit button for cover photo */}
        </div>

        {/* Company Info */}
        <div className='flex flex-col md:flex-row items-start md:items-end relative px-4 sm:px-6 -mt-16'>
          {/* Company Logo */}
          <div className='relative'>
            <div className='h-32 w-32 rounded-full bg-white border-4 border-white shadow-md overflow-hidden'>
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.company?.name || 'Company'} logo`}
                  className='h-full w-full object-cover'
                />
              ) : (
                <div className='h-full w-full bg-gray-200 flex items-center justify-center text-gray-400'>
                  <span className='text-lg font-medium'>
                    {user.company?.name?.charAt(0) || 'C'}
                  </span>
                </div>
              )}
            </div>
            {editMode && (
              <button
                className='absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100'
                aria-label='Change logo'
              >
                <Camera size={16} />
                <input type='file' className='hidden' />
              </button>
            )}
          </div>

          {/* Company Details */}
          <div className='mt-4 md:mt-0 md:ml-6 pb-4 flex-1'>
            <div className='flex items-start justify-between'>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>
                  {user.company?.name || 'Company Name'}
                </h1>
                <p className='text-lg text-gray-600'>
                  {user.company?.industry
                    ? user.company.industry.charAt(0).toUpperCase() +
                      user.company.industry.slice(1)
                    : 'Industry'}
                </p>

                <div className='mt-2 flex items-center text-sm text-gray-500'>
                  <span>{user.company?.location || 'Location'}</span>
                  {user.company?.hqLocation &&
                    user.company?.hqLocation !== user.company?.location && (
                      <>
                        <span className='mx-2'>•</span>
                        <span>HQ: {user.company.hqLocation}</span>
                      </>
                    )}
                </div>
              </div>

              <Button
                onClick={toggleEditMode}
                className='px-4 py-2 !shadow-none rounded-md text-sm font-medium'
              >
                {editMode ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>

            {/* Company Tags */}
            {user.company?.specialties && (
              <div className='mt-3 flex flex-wrap gap-2'>
                {user.company.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className='px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded-full'
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
