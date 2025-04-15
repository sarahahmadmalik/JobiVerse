export default function ProfileSection({ userData, updateUserData }) {
    return (
      <div className="flex border-b">
        <div className="w-1/4 bg-gray-50 p-6 font-medium">
          Profile setting
        </div>
        <div className="w-3/4 p-6">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-purple-300 mr-4">
              <img src="/avatar-placeholder.jpg" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-lg font-medium">{userData.name}</h3>
              <button className="text-blue-600 text-sm">Change</button>
            </div>
          </div>
          
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-600">{userData.email}</p>
            <button className="text-blue-600 text-sm">Edit</button>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-gray-600">{userData.phone}</p>
            <button className="text-blue-600 text-sm">Edit</button>
          </div>
        </div>
      </div>
    );
  }