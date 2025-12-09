import type { FC } from "react";
import { NavLink } from "react-router";
import Carousel from "../components/Carousel";

export interface HomePageProps {}

export const HomePage: FC<HomePageProps> = () => {
  //   const [isPaused, setIsPaused] = useState(false);
  //   const [scrollOffset, setScrollOffset] = useState(0);
  //   const [isDragging, setIsDragging] = useState(false);
  //   const [startX, setStartX] = useState(0);
  //   const [scrollLeft, setScrollLeft] = useState(0);
  //   const containerRef = useRef<HTMLDivElement>(null);
  //   const resumeTimeoutRef = useRef<number | null>(null);

  const images = Array.from(
    { length: 9 },
    (_, i) => `src/assets/carosel/img${i + 1}.png`
  );

  // Duplicate images for infinite scroll effect
  const allImages = [...images, ...images, ...images];

  //   useEffect(() => {
  //     if (isPaused || !containerRef.current) return;

  //     const interval = setInterval(() => {
  //       setScrollOffset((prev) => prev - 1);
  //     }, 30); // Adjust speed here (lower = faster)

  //     return () => clearInterval(interval);
  //   }, [isPaused]);

  //   const handleDragStart = (clientX: number) => {
  //     setIsDragging(true);
  //     setIsPaused(true);
  //     setStartX(clientX);
  //     setScrollLeft(scrollOffset);

  //     if (resumeTimeoutRef.current) {
  //       clearTimeout(resumeTimeoutRef.current);
  //     }
  //   };

  //   const handleDragMove = (clientX: number) => {
  //     if (!isDragging) return;
  //     const diff = clientX - startX;
  //     setScrollOffset(scrollLeft + diff);
  //   };

  //   const handleDragEnd = () => {
  //     setIsDragging(false);

  //     // Resume scrolling after 3 seconds
  //     resumeTimeoutRef.current = window.setTimeout(() => {
  //       setIsPaused(false);
  //     }, 3000);
  //   };

  //   const textAnimate = {
  //     initial: { x: 0 },
  //     animate: {
  //       x: "-55%",
  //       transition: {
  //         repeat: Infinity,
  //         repeatType: "mirror",
  //         duration: 25,
  //       },
  //     },
  //   };

  return (
    <div className="flex flex-col items-center w-full bg-amber-200 p-5 h-full ">
      <h1 className="text-red-600 text-3xl font-bold">
        Welcome to the Home Page
      </h1>

      {/* Infinite Scrolling Carousel */}

      {/* <motion.div variants={textAnimate} initial="initial" animate="animate">
        {allImages.map((img, index) => (
          <img key={`${img}`} src={img} alt={"img" + index} />
        ))}
      </motion.div> */}
      <div className="h-2/3">
        <Carousel logos={allImages.map((link) => ({ link }))} />
      </div>

      {/* <div
        ref={containerRef}
        className="relative w-full h-96 overflow-hidden bg-gray-800 rounded-lg shadow-lg cursor-grab active:cursor-grabbing"
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
      >
        <div
          className="flex gap-4 h-full items-center"
          style={{
            transform: `translateX(${scrollOffset}px)`,
            transition: isDragging ? "none" : "transform 0.1s linear",
          }}
        >
          {allImages.map((img, index) => (
            <img
              key={`${img}-${index}`}
              src={img}
              alt={`Slide ${(index % images.length) + 1}`}
              className="h-full w-auto object-contain flex-shrink-0 pointer-events-none select-none"
              draggable={false}
            />
          ))}
        </div>
      </div> */}

      <NavLink to="/page2" className="text-blue-600 hover:underline text-lg">
        Go to Page 2
      </NavLink>
    </div>
  );
};
