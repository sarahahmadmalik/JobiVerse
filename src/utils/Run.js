import mongoose from 'mongoose';
import JobPost from '../models/jobpost.js';
import dotenv from 'dotenv';
dotenv.config();


const recruiterId = '684b4684a84f1a6f6521c662'; // replace with a valid Recruiter _id from your DB

const jobPosts = [
  {
    recruiterId,
    jobTitle: 'Frontend Engineer',
    jobDescription: 'Build and maintain responsive frontend applications using Vue.js.',
    responsibilities: [
      'Build and maintain UI components with Vue.js',
      'Translate designs and wireframes into high-quality code',
      'Optimize applications for performance and scalability',
      'Collaborate with backend developers and product teams'
    ],
    requirements: [
      '2+ years of frontend experience',
      'Proficient in Vue.js, JavaScript, HTML, CSS',
      'Familiarity with Vuex, REST APIs',
      'Experience with Git and modern CI/CD workflows'
    ],
    skills: ['Vue.js', 'JavaScript', 'HTML', 'CSS', 'Vuex', 'Git'],
    experienceLevel: 'Intermediate',
    jobType: 'Full-time',
    salary: {
      value: 5000,
      currency: 'USD'
    },
    location: 'Berlin, Germany',
    workMode: 'Hybrid'
  },
  {
    recruiterId,
    jobTitle: 'React Developer',
    jobDescription: 'Develop and maintain web applications using React.js and modern tooling.',
    responsibilities: [
      'Write clean, scalable code using React',
      'Integrate RESTful APIs and manage application state',
      'Participate in code reviews and maintain documentation',
      'Collaborate with designers and backend engineers'
    ],
    requirements: [
      '2+ years of experience with React',
      'Strong JavaScript fundamentals',
      'Experience with Redux or other state management tools',
      'Good understanding of component lifecycle and hooks'
    ],
    skills: ['React', 'Redux', 'JavaScript', 'HTML', 'CSS', 'REST APIs'],
    experienceLevel: 'Intermediate',
    jobType: 'Full-time',
    salary: {
      value: 5500,
      currency: 'USD'
    },
    location: 'Remote',
    workMode: 'Remote'
  },
  {
    recruiterId,
    jobTitle: 'Digital Marketing Specialist',
    jobDescription: 'Plan and execute SEO/SEM and digital campaigns to boost brand visibility.',
    responsibilities: [
      'Plan and execute SEO/SEM and email marketing campaigns',
      'Analyze and report on website and campaign performance',
      'Manage content calendars and social media channels',
      'Collaborate with designers and developers'
    ],
    requirements: [
      'Bachelor\'s degree in Marketing or relevant field',
      'Strong understanding of Google Analytics, SEO tools',
      'Experience with Meta Ads, Google Ads, HubSpot',
      'Excellent written and communication skills'
    ],
    skills: ['SEO', 'Google Analytics', 'Facebook Ads', 'Email Marketing', 'Content Strategy'],
    experienceLevel: 'Entry',
    jobType: 'Full-time',
    salary: {
      value: 2500,
      currency: 'USD'
    },
    location: 'Karachi, Pakistan',
    workMode: 'Onsite'
  },
  {
    recruiterId,
    jobTitle: 'Backend Developer',
    jobDescription: 'Develop scalable backend services and APIs using Node.js.',
    responsibilities: [
      'Develop RESTful APIs using Node.js',
      'Manage database design and optimization',
      'Implement authentication, logging, and error handling',
      'Ensure application performance and reliability'
    ],
    requirements: [
      '3+ years of backend development experience',
      'Strong knowledge of Node.js, Express, MongoDB',
      'Experience with Docker and cloud platforms',
      'Familiar with CI/CD and Git workflows'
    ],
    skills: ['Node.js', 'Express', 'MongoDB', 'Docker', 'AWS', 'Git'],
    experienceLevel: 'Senior',
    jobType: 'Contract',
    salary: {
      value: 7000,
      currency: 'USD'
    },
    location: 'Remote',
    workMode: 'Remote'
  },
  {
    recruiterId,
    jobTitle: 'Product Marketing Manager',
    jobDescription: 'Lead go-to-market strategies, messaging, and feature launch campaigns.',
    responsibilities: [
      'Develop product messaging and value propositions',
      'Launch new features and track adoption',
      'Work with product and sales teams on go-to-market strategies',
      'Analyze competitor trends and user feedback'
    ],
    requirements: [
      '5+ years of product marketing experience',
      'Excellent storytelling and communication skills',
      'Experience with product analytics and CRM tools',
      'Proven success in SaaS or tech environments'
    ],
    skills: ['Product Marketing', 'Go-to-Market', 'HubSpot', 'Analytics', 'Storytelling'],
    experienceLevel: 'Lead',
    jobType: 'Full-time',
    salary: {
      value: 8500,
      currency: 'USD'
    },
    location: 'London, UK',
    workMode: 'Hybrid'
  },
  {
    recruiterId,
    jobTitle: 'Data Analyst',
    jobDescription: 'Analyze complex data to support marketing and product decisions.',
    responsibilities: [
      'Analyze user behavior and campaign data',
      'Create dashboards and visualizations',
      'Work with stakeholders to define KPIs',
      'Run A/B tests and statistical models'
    ],
    requirements: [
      'Proficiency in SQL and Excel',
      'Experience with BI tools (e.g., Tableau, Power BI)',
      'Knowledge of statistics and data modeling',
      'Strong critical thinking skills'
    ],
    skills: ['SQL', 'Power BI', 'Statistics', 'A/B Testing', 'Data Visualization'],
    experienceLevel: 'Intermediate',
    jobType: 'Full-time',
    salary: {
      value: 5400,
      currency: 'USD'
    },
    location: 'Remote',
    workMode: 'Remote'
  }
];

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const inserted = await JobPost.insertMany(jobPosts);
    console.log(`✅ Inserted ${inserted.length} job posts.`);

    await mongoose.disconnect();
    console.log('🔌 Disconnected from database.');
  } catch (err) {
    console.error('❌ Error inserting job posts:', err);
    process.exit(1);
  }
}

run();
