const Input = ({ label, ...props }) => {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        {...props}
        className="w-full px-[24px] py-[12px] border border-gray-300 rounded-[12px] text-gray-800 placeholder-gray-400 
                     focus:outline-none focus:ring-1 focus:ring-colors-primary focus:border-colors-primary 
                     hover:border-gray-400 transition-all duration-200 ease-in-out"
      />
    </div>
  );
};

export default Input;
