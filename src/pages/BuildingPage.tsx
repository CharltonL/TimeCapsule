import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import type { FC } from "react";
import OSMap from "../components/OSMap";

interface BuildingPageProps {}

export const BuildingPage: FC<BuildingPageProps> = () => {
  const { buildingId } = useParams<{ buildingId: string }>();
  const navigate = useNavigate();
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const imageModules = import.meta.glob(
    "/public/images/**/*.(png|jpg|jpeg|gif|webp)",
    { eager: true, as: "url" }
  );

  const buildingImages = useMemo(() => {
    if (!buildingId) return [];

    const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");

    const images: string[] = [];
    Object.entries(imageModules).forEach(([path, url]) => {
      const match = path.match(/\/images\/([^/]+)\//);
      if (match && match[1] === buildingId) {
        const cleanUrl = url.toString().replace(/^\//, "");
        images.push(`${base}${cleanUrl}`);
      }
    });
    return images.sort(() => Math.random() - 0.5);
  }, [buildingId]);

  useEffect(() => {
    const loadCoordinates = async () => {
      if (!buildingId) return;

      const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");
      const url = `${base}images/${buildingId}/coordinates.txt`;

      try {
        const response = await fetch(url);
        if (response.ok) {
          const text = await response.text();
          const [lat, lng] = text.trim().split(",").map(Number);
          if (!isNaN(lat) && !isNaN(lng)) {
            setCoordinates([lat, lng]);
          }
        }
      } catch (error) {
        console.warn(`No coordinates found for ${buildingId}`);
      }
    };

    loadCoordinates();
  }, [buildingId]);

  if (!buildingId) {
    return <div className="p-8 text-white">Building not found</div>;
  }

  const buildingName = buildingId.replace(/-|_/g, " ");

  return (
    <div className="min-h-screen  text-white">
      <div className="p-8 border-b border-white/10">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-white/60 hover:text-white transition-colors font-mono text-sm flex items-center gap-2"
        >
          ← Back
        </button>
        <h1 className="text-4xl font-bold capitalize mb-2">{buildingName}</h1>
        <p className="text-white/60 font-mono text-sm">
          {buildingImages.length}{" "}
          {buildingImages.length === 1 ? "photo" : "photos"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
        {coordinates && (
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h2 className="text-xl font-bold mb-4">Location</h2>
              <div className="aspect-square rounded overflow-hidden border border-white/10">
                <OSMap
                  center={[coordinates[1], coordinates[0]]}
                  zoom={18}
                  darkMode={true}
                  points={[
                    {
                      id: buildingId,
                      coordinates: [coordinates[1], coordinates[0]],
                      title: buildingName,
                      color: "#f4d03f",
                    },
                  ]}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
              <p className="mt-2 text-xs text-[#f4d03f] font-mono">
                {coordinates[0].toFixed(6)}, {coordinates[1].toFixed(6)}
              </p>
            </div>
          </div>
        )}

        <div className={coordinates ? "lg:col-span-2" : "lg:col-span-3"}>
          <h2 className="text-xl font-bold mb-4">Photos</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {buildingImages.map((image, index) => (
              <div
                key={index}
                className="aspect-square overflow-hidden rounded cursor-pointer group relative"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image}
                  alt={`${buildingName} ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </div>
            ))}
          </div>

          {buildingImages.length === 0 && (
            <div className="text-center text-white/40 py-12">
              No photos available for this building
            </div>
          )}
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/60 hover:text-white text-4xl"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
          <img
            src={selectedImage}
            alt={buildingName}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-4 left-4 right-4 text-center">
            <p className="text-white/60 text-sm">
              {buildingImages.indexOf(selectedImage) + 1} /{" "}
              {buildingImages.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
