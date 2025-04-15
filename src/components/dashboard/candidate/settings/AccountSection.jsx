export default function AccountSection({ userData, updateUserData }) {
  return (
    <div className="flex border-b">
      <div className="w-1/4 bg-gray-50 p-6 font-medium">
        Account Settings
      </div>
      <div className="w-3/4 p-6">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">Change Password</p>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-600 mb-1">Current Plan</p>
            <p>{userData.plan}</p>
          </div>
          
          <div className="flex space-x-4 mt-4">
            <button className="bg-white text-indigo-600 border border-indigo-600 px-4 py-2 rounded-md">
              Change Plan
            </button>
            <button className="bg-white text-red-600 border border-red-600 px-4 py-2 rounded-md">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}