import Image from "next/image";

const features = [
  {
    title: "Job Listings & Smart Matching",
    description:
      "Get matched with job opportunities that align with your skills, experience, and career goals. We make finding the right job faster and more efficient.",
    icon: "/assets/icon-1.svg",
  },
  {
    title: "Applicant Screening & Insights",
    description:
      "Get insights into each applicant’s strengths and skills with our AI-powered analysis. Quickly screen resumes to find the best fit for your company.",
    icon: "/assets/icon-4.svg",
  },
  {
    title: "Resume Builder & Optimizer",
    description:
      "Easily build or upload your resume and get real-time feedback on ways to improve it. Our AI-powered insights help you create a standout resume that appeals to recruiters.",
    icon: "/assets/icon-2.svg",
  },
  {
    title: "Job Posting & Management",
    description:
      "Easily post jobs and manage applications. Customize job listings to attract the right candidates and keep everything organized in one place.",
    icon: "/assets/icon-5.svg",
  },
  {
    title: "Application Tracker",
    description:
      "Keep track of all your applications in one place. Set reminders, update your status, and stay organized throughout your job search.",
    icon: "/assets/icon-3.svg",
  },
  {
    title: "Integrated Interview Room",
    description:
      "Easily schedule and conduct interviews within the platform. Coordinate with candidates, set up virtual interviews, and manage all your interviews in one place.",
    icon: "/assets/icon-6.svg",
  },
];

const FeatureItem = ({ title, description, icon }) => {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-6 p-4 md:p-6 rounded-lg shadow-sm transition duration-300 hover:shadow-lg">
      <div className="flex-shrink-0 flex items-center justify-center w-[80px] h-[80px] bg-[#f3efff] rounded-full">
        <Image src={icon} alt={title} width={40} height={40} />
      </div>
      <div>
        <h3 className="text-[20px] text-center lg:text-left font-[500] text-colors-textPrimary">
          {title}
        </h3>
        <p className="text-md max-w-[500px] text-center lg:text-left text-colors-textSecondary mt-3 sm:mt-1">
          {description}
        </p>
      </div>
    </div>
  );
};

const Features = () => {
  return (
    <section className="py-12 px-4 md:px-8 mx-auto text-center my-8">
      <h2 className="text-3xl lg:text-5xl font-bold text-colors-textPrimary">
        Designed for Your <span className="text-colors-primary">Journey</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 md:mt-[3rem]">
        {features.map((feature, index) => (
          <FeatureItem key={index} {...feature} />
        ))}
      </div>
    </section>
  );
};

export default Features;
