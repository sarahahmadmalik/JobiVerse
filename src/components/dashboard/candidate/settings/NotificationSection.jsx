// import { Toggle } from './Toggle';

export default function NotificationSection({ notifications, handleNotificationToggle }) {
  return (
    <div className="flex border-b">
      <div className="w-1/4 bg-gray-50 p-6 font-medium">
        Notification Preferences
      </div>
      <div className="w-3/4 p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="font-medium">All Notifications</p>
            <Toggle 
              enabled={notifications.all} 
              onChange={() => handleNotificationToggle('all')} 
            />
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Job Alerts</p>
            <Toggle 
              enabled={notifications.jobAlerts} 
              onChange={() => handleNotificationToggle('jobAlerts')} 
            />
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Application Updates</p>
            <Toggle 
              enabled={notifications.applicationUpdates} 
              onChange={() => handleNotificationToggle('applicationUpdates')} 
            />
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Recruiter Messages</p>
            <Toggle 
              enabled={notifications.recruiterMessages} 
              onChange={() => handleNotificationToggle('recruiterMessages')} 
            />
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Newsletter & Tips</p>
            <Toggle 
              enabled={notifications.newsletterAndTips} 
              onChange={() => handleNotificationToggle('newsletterAndTips')} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Toggle({ enabled, onChange }) {
    return (
      <div 
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${enabled ? 'bg-colors-primary' : 'bg-gray-200'}`}
        onClick={onChange}
      >
        <span 
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${enabled ? 'translate-x-6' : 'translate-x-1'}`} 
        />
      </div>
    );
  }
