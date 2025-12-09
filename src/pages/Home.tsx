import type { FC } from "react";
import { NavLink } from "react-router-dom";
import Carousel from "../components/Carousel";

export interface HomePageProps {}

export const HomePage: FC<HomePageProps> = () => {
  const images = Array.from(
    { length: 9 },
    (_, i) => `/carosel/img${i + 1}.png`
  );

  const allImages = [...images, ...images, ...images];

  return (
    <div className="flex flex-col items-center w-full bg-amber-200 p-5 h-full overflow-hidden">
      <div className="h-2/3 ">
        <Carousel logos={allImages.map((link) => ({ link }))} />
      </div>

      <NavLink to="/page2" className="text-blue-600 hover:underline text-lg">
        Go to Page 2
      </NavLink>
    </div>
  );
};
