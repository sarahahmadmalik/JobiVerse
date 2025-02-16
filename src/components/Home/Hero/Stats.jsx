const statsData = [
  { value: "25k+", label: "Jobs Posted" },
  { value: "10k+", label: "Successful Placements" },
  { value: "1,200+", label: "Top Companies" },
];

const StatsSection = () => {
  return (
    <div className="mt-10  flex flex-row justify-center md:justify-start items-center gap-3 md:gap-5">
      {statsData.map((stat, index) => (
        <div
          key={index}
          className="relative text-center px-3 flex flex-col items-center"
        >
          {/* Vertical line as a pseudo-element */}
          {index !== 0 && (
            <div className="absolute left-0 top-1/2 transform -translate-x-3 -translate-y-1/2 w-[1px] h-12 bg-gray-300"></div>
          )}
          <h3 className="md:text-2xl text-lg font-bold text-colors-textPrimary">
            {stat.value}
          </h3>
          <p className="sm:text-md text-wrap text-[14px] text-colors-textSecondary">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatsSection;
