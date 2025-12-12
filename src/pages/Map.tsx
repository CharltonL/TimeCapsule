import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OSMap, { type MapPoint } from "../components/OSMap";

const CAMPUS_CENTER: [number, number] = [-77.67477774444974, 43.08457874853728];
const CAMPUS_BOUNDS: [[number, number], [number, number]] = [
  [-77.687152344477, 43.07849632215922],
  [-77.66416427991189, 43.09110258268279],
];

interface BuildingPoint extends MapPoint {
  thumbnail: string;
}

export default function MapExample() {
  const navigate = useNavigate();
  const [buildingPoints, setBuildingPoints] = useState<BuildingPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const imageModules = import.meta.glob(
    "/public/images/**/*.(png|jpg|jpeg|gif|webp)",
    { eager: true }
  );

  useEffect(() => {
    const loadBuildingsForMap = async () => {
      setIsLoading(true);
      const buildings: Record<string, string[]> = {};

      Object.keys(imageModules).forEach((path) => {
        const match = path.match(/\/images\/([^\/]+)\//);
        if (match) {
          const buildingName = match[1];
          if (!buildings[buildingName]) {
            buildings[buildingName] = [];
          }
          buildings[buildingName].push(path.replace("/public", ""));
        }
      });

      const points: BuildingPoint[] = [];

      for (const [buildingName, images] of Object.entries(buildings)) {
        try {
          const response = await fetch(
            `/images/${buildingName}/coordinates.txt`
          );
          if (response.ok) {
            const text = await response.text();
            const [lat, lng] = text.trim().split(",").map(Number);

            if (!isNaN(lat) && !isNaN(lng)) {
              const randomImage =
                images[Math.floor(Math.random() * images.length)];

              points.push({
                id: buildingName,
                coordinates: [lng, lat],
                title: buildingName.replace(/-|_/g, " "),
                color: "#f4d03f",
                thumbnail: randomImage,
                onClick: () => {
                  navigate(`/building/${buildingName}`);
                },
              });
            }
          }
        } catch (error) {
          console.warn(`No coordinates found for ${buildingName}`);
        }
      }

      setBuildingPoints(points);
      setIsLoading(false);
    };

    loadBuildingsForMap();
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <OSMap
        center={CAMPUS_CENTER}
        zoom={16}
        bounds={CAMPUS_BOUNDS}
        points={buildingPoints}
        darkMode={true}
      />

      {isLoading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              border: "4px solid rgba(255, 255, 255, 0.1)",
              borderTop: "4px solid #f4d03f",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          display: "flex",
          gap: "10px",
          zIndex: 1000,
        }}
      >
        <button
          style={{
            background: "rgba(0, 0, 0, 0.8)",
            color: "white",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
          onClick={() => {
            window.location.reload();
          }}
        >
          Reset View
        </button>
      </div>
    </div>
  );
}
