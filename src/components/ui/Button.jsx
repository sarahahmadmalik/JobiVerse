import clsx from "clsx";

const Button = ({ children, className, disabled, ...props }) => {
  return (
    <button
      className={clsx(
        "px-6 py-2 rounded-[12px] bg-primary text-white font-medium transition",
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
