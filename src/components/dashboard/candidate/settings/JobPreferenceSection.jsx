export default function JobPreferencesSection({ userData, updateUserData, handleEmploymentTypeToggle }) {
    return (
      <div className="flex">
        <div className="w-1/4 bg-gray-50 p-6 font-medium">
          Job Preferences
        </div>
        <div className="w-3/4 p-6">
          <div className="space-y-4">
            <div className="mb-4">
              <p className="text-gray-600 mb-2">Availability Status</p>
              <div className="relative">
                <select 
                  className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500"
                  value={userData.availability}
                  onChange={(e) => updateUserData('availability', e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="available">Available Now</option>
                  <option value="openToOffers">Open to Offers</option>
                  <option value="notAvailable">Not Available</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-2">Location</p>
              <div className="relative">
                <input
                  type="text"
                  className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded leading-tight focus:outline-none focus:border-gray-500"
                  placeholder="Select or Enter"
                  value={userData.location}
                  onChange={(e) => updateUserData('location', e.target.value)}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-2">Industry</p>
              <div className="relative">
                <select 
                  className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500"
                  value={userData.industry}
                  onChange={(e) => updateUserData('industry', e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="technology">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="finance">Finance</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-2">Employment Type</p>
              <div className="flex flex-wrap gap-6">
                <EmploymentTypeCheckbox 
                  id="partTime"
                  label="Part Time"
                  checked={userData.employmentTypes.includes('Part Time')}
                  onChange={() => handleEmploymentTypeToggle('Part Time')}
                />
                
                <EmploymentTypeCheckbox 
                  id="fullTime"
                  label="Full Time"
                  checked={userData.employmentTypes.includes('Full Time')}
                  onChange={() => handleEmploymentTypeToggle('Full Time')}
                />
                
                <EmploymentTypeCheckbox 
                  id="contract"
                  label="Contract"
                  checked={userData.employmentTypes.includes('Contract')}
                  onChange={() => handleEmploymentTypeToggle('Contract')}
                />
                
                <EmploymentTypeCheckbox 
                  id="temporary"
                  label="Temporary"
                  checked={userData.employmentTypes.includes('Temporary')}
                  onChange={() => handleEmploymentTypeToggle('Temporary')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function EmploymentTypeCheckbox({ id, label, checked, onChange }) {
    return (
      <div className="flex items-center">
        <input 
          type="checkbox" 
          id={id} 
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          checked={checked}
          onChange={onChange}
        />
        <label htmlFor={id} className="ml-2 text-sm text-gray-700">{label}</label>
      </div>
    );
  }
  