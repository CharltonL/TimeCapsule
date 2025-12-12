import type { FC } from "react";
import Carousel from "../components/Carousel";

export interface HomePageProps {}

export const HomePage: FC<HomePageProps> = () => {
  const imageModules = import.meta.glob(
    `${import.meta.env.BASE_URL}images/**/*.(png|jpg|jpeg|gif|webp)`,
    { eager: true }
  );
  const images = Object.keys(imageModules)
    .map((path) => path.replace("/public", ""))
    .sort(() => Math.random() - 0.5);

  return (
    <div className="flex flex-col items-center w-full p-5 h-full overflow-hidden">
      <h1 className={`text-3xl text-white`}>
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
