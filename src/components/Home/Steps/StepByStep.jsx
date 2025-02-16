import Image from "next/image";

const steps = [
  {
    id: 1,
    title: "Sign Up",
    description:
      "Create your account to get started on your job search journey.",
    image: "/assets/user.svg",
    bgColor: "bg-[#B0A3FF]",
    color: "#B0A3FF",
  },
  {
    id: 2,
    title: "Build Resume",
    description: "Build or upload a resume that stands out to recruiters.",
    image: "/assets/resume.svg",
    bgColor: "bg-[#A3BBFF]",
    color: "#A3BBFF",
  },
  {
    id: 3,
    title: "Find Jobs & Apply",
    description: "Explore job listings and apply with a single click.",
    image: "/assets/jobs.svg",
    color: "#FFA3DF",
    bgColor: "bg-[#FFA3DF]",
  },
];

const StepConnector = ({ start, end }) => {
  return (
    <div className="flex items-center justify-center my-10 -mx-[3rem]">
      <div className="flex items-center w-[200px]">
        {/* Left Circle */}
        <span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: start }}
        ></span>

        {/* Dashed Line with Gradient Effect */}
        <div
          className="flex-1 h-[2px] mx-1"
          style={{
            background: `linear-gradient(to right, ${start}, ${end})`,
            maskImage:
              "repeating-linear-gradient(90deg, #000 0px, #000 8px, transparent 8px, transparent 16px)",
            WebkitMaskImage:
              "repeating-linear-gradient(90deg, #000 0px, #000 8px, transparent 8px, transparent 16px)",
          }}
        ></div>

        {/* Right Circle */}
        <span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: end }}
        ></span>
      </div>
    </div>
  );
};

const StepItem = ({ title, description, image, bgColor }) => (
  <div className="flex flex-col w-[250px] items-center text-center ">
    <div
      className={`py-[23px] px-[13px] flex justify-center items-center rounded-[12px] ${bgColor} w-[80px] h-[80px]`}
    >
      <Image src={image} alt={title} width={32} height={32} />
    </div>
    <h3 className="mt-4 font-[500] text-lg">{title}</h3>
    <p className="text-colors-textSecondary text-sm mt-2">{description}</p>
  </div>
);

const StepByStep = () => {
  return (
    <section className="py-12 text-center w-full  ">
      <h1 className="text-3xl lg:text-5xl font-bold">
        Step-by-Step to Your{" "}
        <span className="text-colors-primary">Next Job</span>
      </h1>
      <div className="flex flex-col md:flex-row justify-center w-full items-center my-[5rem]">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start">
            <StepItem {...step} />
            {index < steps.length - 1 && (
              <StepConnector start={step.color} end={steps[index + 1].color} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default StepByStep;
