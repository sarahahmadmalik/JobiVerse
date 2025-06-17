"use client"
import Link from "next/link";
import Image from "next/image";

const ErrorPage = ({ statusCode = 500, title = "Something went wrong", message = "We encountered an unexpected error. Please try again later." }) => {
  return (
    <section className="bg-white min-h-screen">
      <div className="py-8 px-4 mx-auto max-w-screen-xl flex items-center justify-center lg:py-16 lg:px-6">
        <div className="mx-auto flex flex-col items-center gap-5 max-w-screen-sm text-center">
          <Image 
            src="/error.svg" 
            height={300} 
            width={300} 
            alt="Error illustration" 
          />
          <h1 className="mb-4 text-7xl tracking-tight font-bold lg:text-9xl text-colors-primary">
             {title}
          </h1>
          {/* <p className="mb-4 text-3xl tracking-tight font-bold text-colors-textPrimary md:text-4xl">
          
          </p> */}
          <p className="mb-4 text-lg font-light text-colors-textSecondary">
            {message}
          </p>
          <Link
            href="/"
            className="inline-flex text-white bg-primary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-primary font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;