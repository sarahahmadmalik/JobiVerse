'use client'
import Input from '@/components/ui/input'
import { useState } from 'react'
import Dropdown from '@/components/ui/dropdown'

export default function CompanyInfoSection ({ data, onUpdate, editMode }) {
  const [formData, setFormData] = useState(data)

  const companySizes = [
    { value: '1-10 employees', label: '1-10 employees' },
    { value: '11-50 employees', label: '11-50 employees' },
    { value: '51-200 employees', label: '51-200 employees' },
    { value: '201-500 employees', label: '201-500 employees' },
    { value: '501-1000 employees', label: '501-1000 employees' },
    { value: '1001-5000 employees', label: '1001-5000 employees' },
    { value: '5000+ employees', label: '5000+ employees' }
  ]

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleDropdownChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    onUpdate(formData)
  }

  // Helper function to display field value or "Not specified"
  const displayValue = value => {
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : 'Not specified'
    }
    return value ? value : 'Not specified'
  }

  return (
    <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
      <h2 className='text-xl font-semibold mb-6'>Company Information</h2>

      {editMode ? (
        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <Input
              label='Company Name'
              name='name'
              value={formData.name || ''}
              onChange={handleChange}
              required
            />

            <Input
              label='Industry'
              name='industry'
              value={formData.industry || ''}
              onChange={handleChange}
              required
            />

            <Dropdown
              label='Company Size'
              options={companySizes}
              value={formData.size || ''}
              onChange={value => handleDropdownChange('size', value)}
              placeholder='Select size'
              required
            />

            <Input
              label='Founded Year'
              name='founded'
              value={formData.founded || ''}
              onChange={handleChange}
              type='number'
              min='1900'
              max={new Date().getFullYear()}
            />

            <Input
              label='Location'
              name='location'
              value={formData.location || ''}
              onChange={handleChange}
            />

            <Input
              label='Headquarters'
              name='hqLocation'
              value={formData.hqLocation || ''}
              onChange={handleChange}
            />

            <div className='md:col-span-2'>
              <Input
                label='Specialties (comma separated)'
                name='specialties'
                value={
                  Array.isArray(formData.specialties)
                    ? formData.specialties.join(', ')
                    : formData.specialties || ''
                }
                onChange={e => {
                  const specialtiesArray = e.target.value
                    .split(',')
                    .map(item => item.trim())
                  setFormData(prev => ({
                    ...prev,
                    specialties: specialtiesArray
                  }))
                }}
              />
            </div>
          </div>

          <div className='mt-6 flex justify-end space-x-3'>
            <button
              type='button'
              onClick={() => setFormData(data)}
              className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700'
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-4'>
            <div>
              <h3 className='text-sm font-medium text-gray-500'>
                Company Name
              </h3>
              <p className='mt-1 text-sm'>{displayValue(data.name)}</p>
            </div>

            <div>
              <h3 className='text-sm font-medium text-gray-500'>Industry</h3>
              <p className='mt-1 text-sm'>
                {displayValue(
                  data.industry.charAt(0).toUpperCase() + data.industry.slice(1)
                )}
              </p>
            </div>

            <div>
              <h3 className='text-sm font-medium text-gray-500'>
                Company Size
              </h3>
              <p className='mt-1 text-sm'>{displayValue(data.size)}</p>
            </div>

            <div>
              <h3 className='text-sm font-medium text-gray-500'>
                Founded Year
              </h3>
              <p className='mt-1 text-sm'>{displayValue(data.founded)}</p>
            </div>
          </div>

          <div className='space-y-4'>
            <div>
              <h3 className='text-sm font-medium text-gray-500'>Location</h3>
              <p className='mt-1 text-sm'>{displayValue(data.location)}</p>
            </div>

            <div>
              <h3 className='text-sm font-medium text-gray-500'>
                Headquarters
              </h3>
              <p className='mt-1 text-sm'>{displayValue(data.hqLocation)}</p>
            </div>

            <div>
              <h3 className='text-sm font-medium text-gray-500'>Specialties</h3>
              <p className='mt-1 text-sm'>{displayValue(data.specialties)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
