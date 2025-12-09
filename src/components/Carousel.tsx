// Source - https://stackoverflow.com/a
// Posted by azfar razzaq
// Retrieved 2025-12-09, License - CC BY-SA 4.0

export default function Carousel({ logos }: { logos: { link: string }[] }) {
  return (
    <div className="w-full h-full relative flex overflow-x-hidden bg-scrollerColor">
      <div className="animate-marquee h-full py-6 flex whitespace-nowrap shrink-0">
        {logos.map((logo, index) => (
          <img
            key={`A${index}`}
            src={logo.link}
            className="h-full w-auto bg-gray-200 mx-4 object-cover"
            alt="Carousel Image"
          />
        ))}
      </div>
      <div className="animate-marquee top-0 h-full py-6 flex whitespace-nowrap shrink-0">
        {logos.map((logo, index) => (
          <img
            key={`B${index}`}
            src={logo.link}
            className="h-full w-auto bg-gray-200 mx-4 object-cover"
            alt="Carousel Image"
          />
        ))}
      </div>
    </div>
  );
}
