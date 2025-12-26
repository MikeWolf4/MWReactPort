import React, { useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

function ArtCarousel() {

  const images = useMemo(
    () => [
      { src: "../../public/art/Illustration_4_EllenJoe.jpg", width: 2400, height: 3000, alt: "Ellen study" },
      { src: "../../public/art/Illustration_2_Hibi_OC_crop.png", width: 3000, height: 2000, alt: "Cyberpunk scene" },
      { src: "../../public/art/Illustration_1_raidenshogun.png", width: 2400, height: 2400, alt: "Portrait" },
      { src: "../../public/art/IllustrationLineArtSamples.jpg", width: 3840, height: 2160, alt: "Soon" },
      { src: "../../public/art/Placeholder.jpg", width: 3840, height: 2160, alt: "Soon" },
      { src: "../../public/art/Placeholder.jpg", width: 3840, height: 2160, alt: "Soon" },
    ],
    []
  );    

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <section style={{ width: "100%",paddingTop: 80 }}>
      <h2 className="text-4xl font-bold mb-8 text-center">Illustrations</h2>

      <Swiper
        modules={[Navigation, FreeMode, Keyboard]}
        navigation
        keyboard={{ enabled: true }}
        freeMode={{ enabled: true, momentum: true }}
        spaceBetween={12}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        style={{ paddingBottom: 80, paddingTop: 0}}
      >
        {images.map((img, i) => (
          <SwiperSlide key={img.src}>
            <button
              type="button"
              onClick={() => {
                setIndex(i);
                setOpen(true);
              }}
              style={{
                border: "none",
                padding: 0,
                width: "100%",
                cursor: "zoom-in",
                background: "transparent",
              }}
              aria-label={`Open ${img.alt ?? `image ${i + 1}`}`}
            >
              <div
                style={{
                  aspectRatio: "1 / 1.8",
                  borderRadius: 5,
                  overflow: "hidden",
                  background: "#111",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                }}
              >
                <img
                  src={img.src}
                  alt={img.alt ?? ""}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transform: "scale(1.01)",
                  }}
                />
              </div>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={images}
        index={index}
        on={{ view: ({ index: i }) => setIndex(i) }}
        plugins={[Zoom]}
        zoom={{
          maxZoomPixelRatio: 4,
          scrollToZoom: true,
          wheelZoomDistanceFactor: 80,
          pinchZoomDistanceFactor: 120,
          doubleTapDelay: 250,
        }}
        carousel={{
          finite: false,
        }}
        animation={{ fade: 180, swipe: 220 }}
        controller={{ closeOnPullDown: true, closeOnBackdropClick: true }}
      />
    </section>
  );
}
export default ArtCarousel