import type { FC } from "react";
import Carousel from "../components/Carousel";

export const HomePage: FC = () => {
  const imageModules = import.meta.glob(
    "/public/images/**/*.(png|jpg|jpeg|gif|webp)",
    { eager: true, as: "url" }
  );

  const images = Object.values(imageModules)
    .map((url) => url as string)
    .sort(() => Math.random() - 0.5);

  return (
    <div className="flex flex-col items-center w-full p-5 h-full overflow-hidden">
      <h1 className="text-3xl text-white">
        The RIT Fall 2025 Time Capsule attempts to preserve RIT as it existed
        during Fall 2025. Through campus photography, interviews, and 360°
        tours, the project captures not just what the campus looked like, but
        how it felt to be here, documenting the spaces we inhabited and the
        stories we shared during this semester.
      </h1>
      <div className="h-full">
        <Carousel logos={images.map((link) => ({ link }))} />
      </div>
    </div>
  );
};
