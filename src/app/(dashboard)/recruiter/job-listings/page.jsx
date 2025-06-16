'use client'
import { useState, useEffect } from 'react'
import RecruiterJobsForYou from '@/components/dashboard/recruiter/job-listings/JobListings'
import Loader from '@/components/ui/loader'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import {
  getJobPosts,
  updateJobPost,
  deleteJobPost
} from '@/services/jobpost-service'
import { useSession } from 'next-auth/react'

export default function RecruiterJobsPage () {
  const { data: session } = useSession()
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)
        setError(null)

        if (session?.user?.id) {
          const jobPosts = await getJobPosts(session.user.id)
          console.log(jobPosts)
          setJobs(jobPosts)
          filterJobs(jobPosts, statusFilter)
        }
      } catch (err) {
        console.error('Failed to fetch jobs:', err)
        setError('Failed to load job listings. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [session?.user?.id])

  useEffect(() => {
    filterJobs(jobs, statusFilter)
  }, [statusFilter, jobs])

  const filterJobs = (jobsToFilter, filter) => {
    const filtered =
      filter === 'all'
        ? jobsToFilter
        : jobsToFilter.filter(job =>
            filter === 'open' ? job.isOpen : !job.isOpen
          )
    setFilteredJobs(filtered)
  }

  const handleDeleteJob = async jobId => {
    try {
      setLoading(true)
      await deleteJobPost(jobId)
      setJobs(prevJobs => prevJobs.filter(job => job._id !== jobId))
      setFilteredJobs(prev => prev.filter(job => job._id !== jobId))
    } catch (err) {
      console.error('Failed to delete job:', err)
      setError('Failed to delete job. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleJobStatus = async (jobId, currentStatus) => {
    console.log(jobId, !currentStatus)
    try {
      setLoading(true)
      const updatedJob = await updateJobPost(jobId, { isOpen: !currentStatus })
      setJobs(prevJobs =>
        prevJobs.map(job =>
          job._id === jobId ? { ...job, isOpen: !currentStatus } : job
        )
      )
    } catch (err) {
      console.error('Failed to update job status:', err)
      setError('Failed to update job status. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6'>
        <div>
          <h1 className='text-lg md:text-xl font-semibold text-gray-900'>
            My Job Listings
          </h1>
          <p className='text-sm text-gray-500 mt-1'>
            Manage all your posted job listings
          </p>
        </div>

        <Link href='/recruiter/job-post'>
          <button className='flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors'>
            <PlusCircle size={20} />
            <span>Create Job</span>
          </button>
        </Link>
      </div>

      <div className='py-3'>
        {error && (
          <div className='mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded'>
            {error}
          </div>
        )}

        <div className='flex mb-4 border-b'>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 font-medium ${
              statusFilter === 'all'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Jobs
          </button>
          <button
            onClick={() => setStatusFilter('open')}
            className={`px-4 py-2 font-medium ${
              statusFilter === 'open'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Open Jobs
          </button>
          <button
            onClick={() => setStatusFilter('closed')}
            className={`px-4 py-2 font-medium ${
              statusFilter === 'closed'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Closed Jobs
          </button>
        </div>

        {loading ? (
          <div className='h-screen w-full flex justify-center items-center'>
            <Loader />
          </div>
        ) : (
          <RecruiterJobsForYou
            jobs={filteredJobs}
            onDelete={handleDeleteJob}
            onToggleStatus={(jobId, currentStatus) =>
              handleToggleJobStatus(jobId, currentStatus)
            }
            onEdit={jobId => console.log('Edit job', jobId)}
          />
        )}
      </div>
    </div>
  )
}
