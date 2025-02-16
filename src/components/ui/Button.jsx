import clsx from "clsx";

const Button = ({ children, className, disabled, ...props }) => {
  return (
    <button
      className={clsx(
        "px-6 py-2 rounded-[12px] text-[14px] md:text-lg bg-primary text-white font-medium",
        "transition-all duration-500 ease-in-out", // Smooth transition (0.5s)
        "hover:bg-[#705af2]",
        "hover:shadow-[0px_7px_29px_0px_rgba(93,24,220,0.6)]", // Added box-shadow on hover
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
