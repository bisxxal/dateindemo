'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import KitImage from './KitImage';

interface SwiperComponentProps {
  photo: {
    photos: { url: string }[];
  };
}

const SwiperComponent = ({ photo }: SwiperComponentProps) => {
  const swiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    swiperRef.current?.slideTo(0);
  }, [photo]);


  const goNext = () => swiperRef.current?.slideNext();
  const goPrev = () => swiperRef.current?.slidePrev();

  return (
    <div className="relative w-[450px] max-md:w-[100%] h-full">
      {/* Custom segmented progress bar */}
      <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-20 flex w-[90%] gap-2">
        {photo.photos.length > 1 && photo.photos.map((_, idx) => (
          <div
            key={idx}
            className={`
              flex-1 
              h-1.5 
              rounded-full 
              ${idx === activeIndex ? 'bg-whit glass ' : ' bg-[#00000040] backdrop-blur-[8px] border border-white/20'}
              transition-all duration-300
            `}
          />
        ))}
      </div>

      {/* Invisible left/right tap zones */}
      <div
        className="absolute top-0 left-0 w-1/2 h-full z-10 cursor-pointer"
        onClick={goPrev}
      />
      <div
        className="absolute top-0 right-0 w-1/2 h-full z-10 cursor-pointer"
        onClick={goNext}
      />

      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.activeIndex);
        }}
        navigation={false}
        modules={[Navigation]}
        className="mySwiper h-full"
      >
        {photo.photos.map((p, index) => (
          <SwiperSlide
            key={index}
            className="flex items-center justify-center h-full"
          >
            <KitImage
              loading='lazy'
              className="w-[100%] h-full object-cover rounded-lg"
              src={p.url}
              alt={`Photo ${index + 1}`}
              width={900}
              height={900}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperComponent;
