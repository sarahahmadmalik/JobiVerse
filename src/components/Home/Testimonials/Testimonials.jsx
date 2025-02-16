"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

const testimonials = [
  {
    id: 1,
    name: "James R.",
    text: "This platform made my job search so much easier! The resume builder is fantastic, and I found a job in no time. Highly recommend it!",
    image: "/assets/review-user.svg",
    rating: 4,
  },
  {
    id: 2,
    name: "Sarah L.",
    text: "An amazing experience! The job recommendations were perfect, and the interview scheduling feature saved me so much time.",
    image: "/assets/review-user.svg",
    rating: 5,
  },
  {
    id: 3,
    name: "Michael D.",
    text: "I love the simplicity and effectiveness of this platform. Within a week, I had multiple interview offers. Highly recommended!",
    image: "/assets/review-user.svg",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section
      className="relative  py-[10rem] px-4 md:px-6 mx-0 lg:mx-8 text-center"
      //   style={{
      //     backgroundImage: "url('/assets/review.svg')",
      //     backgroundPosition: "center",
      //     backgroundSize: "1200px",
      //     backgroundRepeat: "no-repeat",
      //   }}
    >
      <div
        className="absolute inset-0 bg-center bg-no-repeat  lg:bg-[length:1200px] md:bg-[length:600px] sm:bg-[length:600px] bg-[length:400px] opacity-75"
        style={{
          backgroundImage: "url('/assets/review.svg')",
        }}
      ></div>

      <h2 className="text-3xl lg:text-5xl  text-colors-textPrimary  font-bold mb-10 lg:mb-[8rem]">
        Our <span className="text-colors-primary">Impact</span>, Told by You
      </h2>

      {/* Swiper Slider */}
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={false}
        centeredSlides={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className="flex justify-center"
      >
        {testimonials.map((testimonial) => (
          <SwiperSlide key={testimonial.id} className=" mx-auto ">
            <div className="flex flex-col !items-center py-10 px-6 ">
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                width={100}
                height={100}
                className="rounded-full shadow-lg mb-4"
              />
              <p className="text-lg font-[300] bg-white py-6 text-colors-textSecondary max-w-xl">
                {testimonial.text}
              </p>
              <h4 className="mt-4 font-[400] text-xl">{testimonial.name}</h4>
              {/* Star Ratings */}
              <div className="flex mt-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span
                    key={index}
                    className={
                      index < testimonial.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Testimonials;
