const MaxWidth = ({ children, className = "" }) => {
    return <div className={`max-w-screen-xl mx-auto px-4 ${className}`}>{children}</div>;
  };
  
  export default MaxWidth;
  