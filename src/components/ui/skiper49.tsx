import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import {
  EffectCoverflow,
  Keyboard,
  Mousewheel,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";

type CarouselItem = {
  name: string;
  color: string;
  logoSrc: string | null;
  youtubeUrl: string | null;
};

const getYouTubeEmbedUrl = (youtubeUrl: string) => {
  const url = new URL(youtubeUrl);
  const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
  let videoId: string | undefined;

  if (hostname === "youtu.be") {
    videoId = url.pathname.split("/").filter(Boolean)[0];
  } else if (
    hostname === "youtube.com" ||
    hostname.endsWith(".youtube.com") ||
    hostname === "youtube-nocookie.com"
  ) {
    videoId =
      url.pathname === "/watch"
        ? (url.searchParams.get("v") ?? undefined)
        : url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1];
  }

  if (!videoId) {
    throw new Error(`Unsupported YouTube URL: ${youtubeUrl}`);
  }

  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&playsinline=1`;
};

type Skiper49Props = {
  items: CarouselItem[];
  sectionLabel: string;
  titleId: string;
  carouselId: string;
  placeholderSrc: string;
};

const Skiper49 = ({
  items,
  sectionLabel,
  titleId,
  carouselId,
  placeholderSrc,
}: Skiper49Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [playingBrand, setPlayingBrand] = useState<string | null>(null);
  const swiperRef = useRef<SwiperInstance | null>(null);
  const activeItem = items[activeIndex] ?? items[0];

  useEffect(() => {
    const resetCarousel = () => {
      const swiper = swiperRef.current;
      if (!swiper || swiper.destroyed) return;

      swiper.slideToLoop(0, 0);
      setActiveIndex(0);
      setPlayingBrand(null);
    };

    window.addEventListener("pageshow", resetCarousel);
    document.addEventListener("astro:page-load", resetCarousel);

    const homeSection = document.querySelector("#landing");
    const homeObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) resetCarousel();
    });

    if (homeSection) homeObserver.observe(homeSection);

    return () => {
      window.removeEventListener("pageshow", resetCarousel);
      document.removeEventListener("astro:page-load", resetCarousel);
      homeObserver.disconnect();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3 }}
      className="brand-carousel-content"
    >
      <div className="about-heading">
        <div>
          <p className="about-kicker">{sectionLabel}</p>
          <h2
            id={titleId}
            className="about-title"
            style={{
              color: activeItem.color,
              textShadow:
                activeItem.color.toLowerCase() === "#000000"
                  ? "0 0 0.12em rgb(255 255 255 / 90%)"
                  : activeItem.color.toLowerCase() === "#ffffff"
                    ? "0 0 0.12em rgb(0 0 0 / 90%)"
                    : undefined,
            }}
          >
            {activeItem.name}
          </h2>
        </div>
      </div>

      <div className="brand-carousel-shell">
        <Swiper
          modules={[
            EffectCoverflow,
            Keyboard,
            Mousewheel,
            Navigation,
            Pagination,
          ]}
          effect="coverflow"
          coverflowEffect={{
            rotate: 40,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          slidesPerView="auto"
          centeredSlides
          grabCursor
          keyboard={{ enabled: true, onlyInViewport: true }}
          mousewheel={{ forceToAxis: true, sensitivity: 0.8 }}
          navigation={{
            nextEl: `.${carouselId}-next`,
            prevEl: `.${carouselId}-prev`,
          }}
          pagination={{ clickable: true }}
          loop
          spaceBetween={24}
          className="brand-carousel"
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.realIndex);
            setPlayingBrand(null);
          }}
        >
          {items.map((item) => {
            const embedUrl = item.youtubeUrl
              ? getYouTubeEmbedUrl(item.youtubeUrl)
              : null;

            return (
              <SwiperSlide key={item.name}>
                {playingBrand === item.name && embedUrl ? (
                  <div className="brand-carousel-card">
                    <iframe
                      src={embedUrl}
                      title={`${item.name} video`}
                      allow="autoplay; encrypted-media; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <button
                    className="brand-carousel-card"
                    type="button"
                    disabled={!embedUrl}
                    aria-label={
                      embedUrl
                        ? `Play ${item.name} video`
                        : `${item.name} video link is not configured`
                    }
                    title={
                      embedUrl
                        ? `Play ${item.name} video`
                        : "Video link will be added later"
                    }
                    onClick={() => setPlayingBrand(item.name)}
                  >
                    <img
                      className="brand-carousel-placeholder"
                      src={placeholderSrc}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                    />
                    {item.logoSrc ? (
                      <img
                        className="brand-carousel-logo"
                        src={item.logoSrc}
                        alt={`${item.name} artwork`}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <span style={{ color: item.color }}>{item.name}</span>
                    )}
                    {embedUrl && (
                      <span
                        className="brand-carousel-play-icon"
                        aria-hidden="true"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width="22"
                          height="22"
                          fill="currentColor"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    )}
                  </button>
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>

        <div className="brand-carousel-controls">
          <button
            className={`brand-carousel-control ${carouselId}-prev`}
            type="button"
            aria-label="Previous item"
          >
            <ChevronLeftIcon aria-hidden="true" />
          </button>
          <button
            className={`brand-carousel-control ${carouselId}-next`}
            type="button"
            aria-label="Next item"
          >
            <ChevronRightIcon aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export { Skiper49 };
export default Skiper49;
