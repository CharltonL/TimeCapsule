import { useEffect, useRef } from "react";
import maplibregl, { Map as maplibreMap, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export interface MapPoint {
  id: string;
  coordinates: [number, number];
  title: string;
  description?: string;
  color?: string;
  onClick?: () => void;
  thumbnail?: string;
}

export interface MapProps {
  center?: [number, number];
  zoom?: number;
  bounds?: [[number, number], [number, number]];
  points?: MapPoint[];
  onPointHover?: (point: MapPoint | null) => void;
  className?: string;
  style?: React.CSSProperties;
  darkMode?: boolean;
  disableHover?: boolean;
}

export const OSMap: React.FC<MapProps> = ({
  center = [-77.67477774444974, 43.08457874853728],
  zoom = 15,
  bounds,
  points = [],
  onPointHover,
  className = "",
  style,
  darkMode = true,
  disableHover = false,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibreMap | null>(null);
  const markers = useRef<Map<string, Marker>>(new Map());

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: getMapStyle(darkMode),
      center: center,
      zoom: zoom,
      maxBounds: bounds,
    });

    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    return () => {
      markers.current.forEach((marker) => marker.remove());
      markers.current.clear();
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (map.current) {
      map.current.setStyle(getMapStyle(darkMode));
    }
  }, [darkMode]);

  useEffect(() => {
    if (!map.current) return;

    markers.current.forEach((marker) => marker.remove());
    markers.current.clear();

    points.forEach((point) => {
      const el = document.createElement("div");
      el.className = "custom-marker";

      if (point.thumbnail) {
        el.style.width = "50px";
        el.style.height = "50px";
        el.style.borderRadius = "50%";
        el.style.overflow = "hidden";
        el.style.border = "3px solid white";
        el.style.cursor = "pointer";
        el.style.boxShadow = "0 4px 8px rgba(0,0,0,0.5)";

        const img = document.createElement("img");
        img.src = point.thumbnail;
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "cover";
        img.style.pointerEvents = "none";
        el.appendChild(img);

        if (!disableHover) {
          el.addEventListener("mouseenter", () => {
            el.style.filter = "brightness(1.2)";
            el.style.boxShadow = "0 6px 16px rgba(0,0,0,0.7)";
            el.style.borderColor = point.color || "#f4d03f";
            onPointHover?.(point);
          });

          el.addEventListener("mouseleave", () => {
            el.style.filter = "brightness(1)";
            el.style.boxShadow = "0 4px 8px rgba(0,0,0,0.5)";
            el.style.borderColor = "white";
            onPointHover?.(null);
          });
        }
      } else {
        el.style.backgroundColor = point.color || "#3b82f6";
        el.style.width = "20px";
        el.style.height = "20px";
        el.style.borderRadius = "50%";
        el.style.border = "2px solid white";
        el.style.cursor = disableHover ? "default" : "pointer";
        el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";

        if (!disableHover) {
          el.addEventListener("mouseenter", () => {
            el.style.filter = "brightness(1.3)";
            el.style.boxShadow = "0 4px 8px rgba(0,0,0,0.5)";
            onPointHover?.(point);
          });

          el.addEventListener("mouseleave", () => {
            el.style.filter = "brightness(1)";
            el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
            onPointHover?.(null);
          });
        }
      }

      if (point.onClick) {
        el.addEventListener("click", () => {
          point.onClick?.();
        });
      }

      const marker = new maplibregl.Marker({ element: el, anchor: "center" })
        .setLngLat(point.coordinates)
        .addTo(map.current!);

      if (!disableHover) {
        const popup = new maplibregl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: point.thumbnail ? 35 : 25,
        }).setHTML(`
          <div style="padding: 8px;">
            <strong style="color: #1f2937;">${point.title}</strong>
            ${
              point.description
                ? `<p style="margin: 4px 0 0 0; color: #6b7280; font-size: 12px;">${point.description}</p>`
                : ""
            }
          </div>
        `);

        el.addEventListener("mouseenter", () => {
          popup.setLngLat(point.coordinates).addTo(map.current!);
        });

        el.addEventListener("mouseleave", () => {
          popup.remove();
        });
      }

      markers.current.set(point.id, marker);
    });
  }, [points, onPointHover, disableHover]);

  return (
    <div
      ref={mapContainer}
      className={`map-container ${className}`}
      style={{
        width: "100%",
        height: "100%",
        ...style,
      }}
    />
  );
};

function getMapStyle(darkMode: boolean): maplibregl.StyleSpecification {
  const baseColor = darkMode ? "#1a1a1a" : "#f8f9fa";

  return {
    version: 8 as const,
    sources: {
      "osm-raster": {
        type: "raster",
        tiles: [
          "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
          "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
          "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
        ],
        tileSize: 256,
        attribution: "© OpenStreetMap contributors",
      },
    },
    layers: [
      {
        id: "background",
        type: "background",
        paint: {
          "background-color": baseColor,
        },
      },
      {
        id: "osm-tiles",
        type: "raster",
        source: "osm-raster",
        paint: {
          "raster-opacity": darkMode ? 0.7 : 1,
          "raster-brightness-min": darkMode ? 0.3 : 0,
          "raster-brightness-max": darkMode ? 0.8 : 1,
          "raster-contrast": darkMode ? 0.2 : 0,
        },
      },
    ],
  };
}

export default OSMap;
