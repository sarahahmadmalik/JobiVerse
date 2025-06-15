"use client";
import { useState, useEffect } from "react";
import { ArrowUpDown } from "lucide-react";
import Dropdown from "@/components/ui/dropdown";
import ApplicationCard from "@/components/dashboard/candidate/home/ApplicationCard";
import { STATUS_PRIORITY } from "@/constants/constants";
import { applicationService } from "@/services/applicant-service";
import { useSession } from "next-auth/react";
import Loader from "@/components/ui/loader";
import Button from "@/components/ui/button";

export default function ApplicationTracker() {
  const [sortOption, setSortOption] = useState('recent');
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'salary-high', label: 'Salary (High to Low)' },
    { value: 'salary-low', label: 'Salary (Low to High)' },
    { value: 'status', label: 'Application Status' },
    { value: 'company-asc', label: 'Company (A-Z)' },
    { value: 'company-desc', label: 'Company (Z-A)' },
  ];

  useEffect(() => {
    const fetchApplications = async () => {
      if (!session?.user?.id) return;
      
      try {
        setIsLoading(true);
        const data = await applicationService.getCandidateApplications(session.user.id);
        console.log(data)
        if (data && data.success) {
          // Transform the API data to match your card component's expected format
        const transformedApplications = data.data.map(app => ({
            id: app._id,
            status: app.status,
            jobTitle: app.jobDetails?.jobTitle || 'Unknown Position',
            company: app.jobDetails?.recruiterInfo?.company?.name || 'Unknown Company',
            date: new Date(app.appliedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            }),
            companyIcon: app.jobDetails?.recruiterInfo?.company?.logo,
            analysis: app.analysis || {}
          }));

          setApplications(transformedApplications);
        } else {
          throw new Error(data?.message || 'Failed to fetch applications');
        }
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError(err.message || 'Failed to load applications');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [session?.user?.id]);

  const sortedApplications = [...applications].sort((a, b) => {
    switch (sortOption) {
      case 'recent':
        return new Date(b.jobDetails?.postedAt || b.date) - new Date(a.jobDetails?.postedAt || a.date);
      case 'oldest':
        return new Date(a.jobDetails?.postedAt || a.date) - new Date(b.jobDetails?.postedAt || b.date);
      case 'salary-high':
        return (b.jobDetails?.salary?.value || 0) - (a.jobDetails?.salary?.value || 0);
      case 'salary-low':
        return (a.jobDetails?.salary?.value || 0) - (b.jobDetails?.salary?.value || 0);
      case 'status':
        return STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status];
      case 'company-asc':
        return a.company.localeCompare(b.company);
      case 'company-desc':
        return b.company.localeCompare(a.company);
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 text-blue-600 hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-lg md:text-xl font-semibold text-gray-900">Track Your Applications</h1>
          <p className="text-gray-600 text-md mt-1">
            {applications.length} {applications.length === 1 ? 'application' : 'applications'} found
          </p>
        </div>
        <div className="w-full sm:w-48">
          <Dropdown
            options={sortOptions}
            onChange={setSortOption}
            placeholder="Sort by"
            value={sortOption}
            icon={ArrowUpDown}
          />
        </div>
      </div>
      
      <div className="flex-1">
        {sortedApplications.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedApplications.map((app) => (
              <ApplicationCard
                key={app.id}
                id={app.id}
                status={app.status}
                jobTitle={app.jobTitle}
                company={app.company}
                date={app.date}
                companyIcon={app.companyIcon}
                analysis={app.analysis}
              />
            ))}
          </div>
        ) : (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="max-w-md mx-auto text-center">
              <Image
                src="/assets/no-applications.svg"
                alt="No applications"
                width={150}
                height={150}
                className="mx-auto mb-6"
              />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No applications yet
              </h3>
              <p className="text-gray-500 mb-6">
                You haven't applied to any jobs yet. Start your job search today!
              </p>
              <Link href="/job-listings">
                <Button className="px-4 py-2">
                  Browse Jobs
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}