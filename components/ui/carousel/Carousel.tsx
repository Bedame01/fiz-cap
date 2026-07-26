"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
  FreeMode,
  EffectCards,
  Parallax,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-cards";
import './Carousel.css';
import Image from "next/image";

import project1 from '@/public/images/heroFeatured.jpeg'
import project2 from '@/public/images/showcase1.png'
import project3 from '@/public/images/showcase2.png'
import project4 from '@/public/images/showcase3.png'
import project5 from '@/public/images/showcase4.png'
import project6 from '@/public/images/showcase5.jpeg'

export default function HeroCarousel() {
  return (
    <Swiper
      modules={[
        Navigation,
        Pagination,
        Autoplay,
        FreeMode,
        EffectCards,
        Parallax,
      ]}
      speed={800}
      rewind={true}
      parallax={true}
      effect="creative"
      freeMode={{
        enabled: false,
      }}
      navigation={true}
      pagination={{
        clickable: true,
        dynamicBullets: true,
      }}
      autoplay={{
        delay: 3500,
        disableOnInteraction: false,
      }}
      grabCursor={true}
      centeredSlides={true}
      slidesPerView={"auto"}
      className="w-full h-full"
    >
      <SwiperSlide>
        <div
          data-swiper-parallax="-300"
          className="h-full overflow-hidden"
        >
          <Image
            src={project1}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div
          data-swiper-parallax="-300"
          className="h-full overflow-hidden"
        >
          <Image
            src={project2}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div
          data-swiper-parallax="-300"
          className="h-full overflow-hidden"
        >
          <Image
            src={project3}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div
          data-swiper-parallax="-300"
          className="h-full overflow-hidden"
        >
          <Image
            src={project4}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div
          data-swiper-parallax="-300"
          className="h-full overflow-hidden"
        >
          <Image
            src={project5}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div
          data-swiper-parallax="-300"
          className="h-full overflow-hidden"
        >
          <Image
            src={project6}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </SwiperSlide>
    </Swiper>
  );
}