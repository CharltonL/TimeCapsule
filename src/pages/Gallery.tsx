import { useState, useMemo, useEffect } from "react";
import type { FC } from "react";
import OSMap from "../components/OSMap";
import { useNavigate } from "react-router-dom";

type FilterType = "all" | "buildings" | "interviews";
type SortOrderType = "alphabetically" | "randomly";
type ViewModeType = "full";

interface BuildingItem {
  id: string;
  name: string;
  type: "building";
  image: string;
  totalImages: number;
  location: string;
  coordinates?: [number, number];
}

interface InterviewItem {
  id: string;
  name: string;
  type: "interview";
  mediaType: "video" | "audio";
  path: string;
  thumbnail: string | null;
}

type GalleryItem = BuildingItem | InterviewItem;

export interface GalleryProps {}

export const Gallery: FC<GalleryProps> = () => {
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortOrder, setSortOrder] = useState<SortOrderType>("alphabetically");
  const [viewMode, setViewMode] = useState<ViewModeType>("full");
  const [randomSeed, setRandomSeed] = useState<number>(0);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [selectedInterview, setSelectedInterview] =
    useState<InterviewItem | null>(null);
  const [buildingCoordinates, setBuildingCoordinates] = useState<
    Record<string, [number, number]>
  >({});
  const navigate = useNavigate();

  const styles = `
    @keyframes slideIn {
      from { transform: scaleX(0); }
      to { transform: scaleX(1); }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes cardAppear {
      from { opacity: 0; transform: scale(0.95) translateY(20px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .gallery-grid { position: relative; }

    @keyframes shuffleToCenter {
      0% { opacity: 1; transform: translate(0, 0) scale(1); filter: blur(0px); }
      100% { opacity: 0; transform: translate(var(--center-x), var(--center-y)) scale(0.2); filter: blur(4px); }
    }
    @keyframes shuffleFromCenter {
      0% { opacity: 0; transform: translate(var(--center-x), var(--center-y)) scale(0.2); filter: blur(4px); }
      100% { opacity: 1; transform: translate(0, 0) scale(1); filter: blur(0px); }
    }

    .card-flip-container { perspective: 1000px; }
    .card-flip-inner {
      position: relative; width: 100%; height: 100%;
      transition: transform 0.6s; transform-style: preserve-3d;
    }
    .card-flip-inner.flipped { transform: rotateY(180deg); }
    .card-face {
      position: absolute; width: 100%; height: 100%;
      backface-visibility: hidden; -webkit-backface-visibility: hidden;
    }
    .card-face-back { transform: rotateY(180deg); }
  `;

  const imageModules = import.meta.glob(
    "/public/images/**/*.(png|jpg|jpeg|gif|webp)",
    { eager: true, as: "url" }
  );

  const interviewModules = import.meta.glob("/public/interviews/*.(mp4|mov)", {
    eager: true,
    as: "url",
  });

  const buildingData = useMemo<BuildingItem[]>(() => {
    const buildings: Record<string, string[]> = {};
    const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");

    Object.entries(imageModules).forEach(([path, url]) => {
      const match = path.match(/\/images\/([^/]+)\//);
      if (match) {
        const buildingName = match[1];
        if (!buildings[buildingName]) buildings[buildingName] = [];

        const cleanUrl = url.toString().replace(/^\//, "");
        buildings[buildingName].push(`${base}${cleanUrl}`);
      }
    });

    return Object.entries(buildings).map(([dirName, images]) => {
      const randomIndex = Math.floor(Math.random() * images.length);
      return {
        id: dirName,
        name: dirName.replace(/-|_/g, " "),
        type: "building" as const,
        image: images[randomIndex],
        totalImages: images.length,
        location: dirName.replace(/-|_/g, " "),
        coordinates: buildingCoordinates[dirName],
      };
    });
  }, [randomSeed, buildingCoordinates]);

  const interviewData = useMemo<InterviewItem[]>(() => {
    const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");

    return Object.entries(interviewModules).map(([path, url], index) => {
      const filename =
        path
          .split("/")
          .pop()
          ?.replace(/\.[^/.]+$/, "") ?? "";
      const isVideo = /\.(mp4|webm|mov)$/i.test(path);
      const cleanUrl = url.toString().replace(/^\//, "");
      const fullUrl = `${base}${cleanUrl}`;

      return {
        id: `interview-${index}`,
        name: filename.replace(/-|_/g, " "),
        type: "interview" as const,
        mediaType: isVideo ? "video" : "audio",
        path: fullUrl,
        thumbnail: isVideo ? fullUrl : null,
      };
    });
  }, []);

  const allItems = useMemo<GalleryItem[]>(() => {
    let items: GalleryItem[] = [];

    if (filter === "all" || filter === "buildings") items.push(...buildingData);
    if (filter === "all" || filter === "interviews")
      items.push(...interviewData);

    if (sortOrder === "alphabetically") {
      items.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      items.sort(() => Math.random() - 0.5);
    }

    return items;
  }, [buildingData, interviewData, filter, sortOrder, randomSeed]);

  const handleExplore = (item: GalleryItem): void => {
    if (item.type === "interview") {
      setSelectedInterview(item);
    } else {
      setFlippedCards((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(item.id)) newSet.delete(item.id);
        else newSet.add(item.id);
        return newSet;
      });
    }
  };

  useEffect(() => {
    const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");
    Object.values(imageModules).forEach((url) => {
      const cleanUrl = url.toString().replace(/^\//, "");
      const img = new Image();
      img.src = `${base}${cleanUrl}`;
    });
  }, []);

  useEffect(() => {
    const loadCoordinates = async () => {
      const buildings = new Set<string>();

      Object.keys(imageModules).forEach((path) => {
        const match = path.match(/\/images\/([^/]+)\//);
        if (match) buildings.add(match[1]);
      });

      const coordsMap: Record<string, [number, number]> = {};
      const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");

      for (const building of buildings) {
        try {
          const url = `${base}images/${building}/coordinates.txt`;
          const response = await fetch(url);
          if (response.ok) {
            const text = await response.text();
            const [lat, lng] = text.trim().split(",").map(Number);
            if (!isNaN(lat) && !isNaN(lng)) {
              coordsMap[building] = [lat, lng];
            }
          }
        } catch {}
      }

      setBuildingCoordinates(coordsMap);
    };

    loadCoordinates();
  }, []);

  return (
    <div className="min-h-screen p-8 font-mono">
      <div className="flex justify-between items-center mb-12 pb-6 border-b border-white/15 flex-wrap gap-4 md:flex-row flex-col md:items-center items-start">
        <div className="flex gap-6">
          <button
            className={`bg-transparent border-none font-mono text-sm font-semibold tracking-wider cursor-pointer transition-all duration-300 py-2 px-0 relative ${
              filter === "all"
                ? 'text-[#f4d03f] after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#f4d03f]'
                : "text-white/50 hover:text-white/90"
            }`}
            onClick={() => setFilter("all")}
          >
            ALL
          </button>

          <button
            className={`bg-transparent border-none font-mono text-sm font-semibold tracking-wider cursor-pointer transition-all duration-300 py-2 px-0 relative ${
              filter === "buildings"
                ? 'text-[#f4d03f] after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#f4d03f]'
                : "text-white/50 hover:text-white/90"
            }`}
            onClick={() => setFilter("buildings")}
          >
            BUILDINGS
          </button>

          <button
            className={`bg-transparent border-none font-mono text-sm font-semibold tracking-wider cursor-pointer transition-all duration-300 py-2 px-0 relative ${
              filter === "interviews"
                ? 'text-[#f4d03f] after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#f4d03f]'
                : "text-white/50 hover:text-white/90"
            }`}
            onClick={() => setFilter("interviews")}
          >
            INTERVIEWS
          </button>
        </div>

        <div className="flex gap-6">
          <button
            className={`bg-transparent border-none font-mono text-sm font-semibold tracking-wider cursor-pointer transition-all duration-300 py-2 px-0 relative ${
              viewMode === "full"
                ? 'text-[#f4d03f] after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#f4d03f]'
                : "text-white/50 hover:text-white/90"
            }`}
            onClick={() => setViewMode("full")}
          >
            FULL VIEW
          </button>
        </div>

        <div className="flex gap-6">
          <button
            className={`bg-transparent border-none font-mono text-sm font-semibold tracking-wider cursor-pointer transition-all duration-300 py-2 px-0 relative ${
              sortOrder === "alphabetically"
                ? 'text-[#f4d03f] after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#f4d03f]'
                : "text-white/50 hover:text-white/90"
            }`}
            onClick={() => setSortOrder("alphabetically")}
          >
            ALPHABETICALLY
          </button>

          <button
            className={`bg-transparent border-none font-mono text-sm font-semibold tracking-wider cursor-pointer transition-all duration-300 py-2 px-0 relative ${
              sortOrder === "randomly"
                ? 'text-[#f4d03f] after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#f4d03f]'
                : "text-white/50 hover:text-white/90"
            }`}
            onClick={() => {
              setIsShuffling(true);
              setSortOrder("randomly");
              setTimeout(() => {
                setRandomSeed((prev) => prev + 1);
                setIsShuffling(false);
              }, 500);
            }}
          >
            RANDOMLY
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 md:gap-8">
        {allItems.map((item, index) => {
          const gridCols =
            window.innerWidth < 768 ? 1 : Math.floor(window.innerWidth / 360);
          const col = index % gridCols;
          const row = Math.floor(index / gridCols);
          const cardWidth = window.innerWidth < 768 ? 280 : 320;
          const gap = window.innerWidth < 768 ? 24 : 32;
          const gridWidth = gridCols * cardWidth + (gridCols - 1) * gap;

          const centerX =
            gridWidth / 2 - (col * (cardWidth + gap) + cardWidth / 2);
          const centerY =
            300 - (row * (cardWidth * 1.25 + gap) + cardWidth * 0.625);

          return (
            <div
              key={`${item.id}-${randomSeed}`}
              className={`relative aspect-[4/5] overflow-hidden rounded group card-flip-container ${
                isShuffling
                  ? "animate-[shuffleToCenter_0.4s_ease-in_forwards]"
                  : "animate-[shuffleFromCenter_0.5s_ease-out_backwards]"
              }`}
              style={
                {
                  animationDelay: isShuffling
                    ? `${index * 0.02}s`
                    : `${index * 0.025}s`,
                  "--center-x": `${centerX}px`,
                  "--center-y": `${centerY}px`,
                } as React.CSSProperties
              }
            >
              <div
                className={`card-flip-inner ${
                  flippedCards.has(item.id) ? "flipped" : ""
                }`}
              >
                <div
                  className={`card-face ${
                    item.type === "building" && !flippedCards.has(item.id)
                      ? "cursor-pointer"
                      : "cursor-default"
                  }`}
                  onClick={() => {
                    if (
                      item.type === "building" &&
                      !flippedCards.has(item.id)
                    ) {
                      navigate(`/building/${item.id}`);
                    }
                  }}
                >
                  <div className="w-full h-full relative">
                    {item.type === "building" ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-[600ms] ease-in-out group-hover:scale-105"
                      />
                    ) : item.mediaType === "video" ? (
                      <div className="w-full h-full relative">
                        <video
                          src={item.path}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-24 h-24 rounded-full bg-white/90 flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110">
                            <svg
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-12 h-12 text-[#0a0a0a] ml-1"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#2c1810] to-[#1a1410] flex items-center justify-center relative">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="w-20 h-20 text-[#f4d03f] opacity-40"
                        >
                          <path d="M9 18V5l12-2v13" />
                          <circle cx="6" cy="18" r="3" />
                          <circle cx="18" cy="16" r="3" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-24 h-24 rounded-full bg-white/90 flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110">
                            <svg
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-12 h-12 text-[#0a0a0a] ml-1"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 flex flex-col justify-end p-6 pointer-events-none opacity-100 group-hover:opacity-0 transition-opacity duration-400">
                      <h3 className="text-2xl font-bold text-white m-0 leading-tight capitalize drop-shadow-[2px_2px_12px_rgba(0,0,0,0.9)]">
                        {item.name}
                      </h3>
                    </div>

                    {item.type === "building" && (
                      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70 flex flex-col justify-between p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                        <div>
                          <span className="inline-block text-xs text-[#f4d03f] uppercase tracking-[0.1em] mb-2 font-semibold">
                            📍 {item.totalImages}{" "}
                            {item.totalImages === 1 ? "photo" : "photos"}
                          </span>
                          <h3 className="text-2xl font-bold text-white m-0 leading-tight capitalize drop-shadow-[2px_2px_8px_rgba(0,0,0,0.8)]">
                            {item.name}
                          </h3>
                        </div>

                        <button
                          className="flex items-center gap-2 bg-white text-[#0a0a0a] border-none py-3 px-5 font-mono text-xs font-bold tracking-[0.1em] cursor-pointer transition-all duration-300 rounded-sm hover:bg-[#f4d03f]"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExplore(item);
                          }}
                        >
                          EXPLORE
                        </button>
                      </div>
                    )}

                    {item.type === "interview" && (
                      <div
                        className="absolute inset-0 cursor-pointer"
                        onClick={() => handleExplore(item)}
                      />
                    )}
                  </div>
                </div>

                <div className="card-face card-face-back bg-[#1a1410]">
                  <div className="w-full h-full relative flex flex-col">
                    {item.type === "building" && item.coordinates ? (
                      <>
                        <div className="flex-1 relative">
                          <OSMap
                            center={[item.coordinates[1], item.coordinates[0]]}
                            zoom={18}
                            darkMode={true}
                            disableHover={true}
                            points={[
                              {
                                id: item.id,
                                coordinates: [
                                  item.coordinates[1],
                                  item.coordinates[0],
                                ],
                                title: item.name,
                                color: "#f4d03f",
                              },
                            ]}
                            style={{ width: "100%", height: "100%" }}
                          />
                        </div>

                        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                          <h3 className="text-lg font-bold text-white capitalize drop-shadow-lg">
                            {item.name}
                          </h3>
                          <p className="text-xs text-[#f4d03f] font-mono">
                            {item.coordinates[0].toFixed(6)},{" "}
                            {item.coordinates[1].toFixed(6)}
                          </p>
                        </div>

                        <div className="absolute bottom-4 left-4">
                          <button
                            className="flex items-center gap-2 bg-white text-[#0a0a0a] border-none py-2 px-4 font-mono text-xs font-bold tracking-[0.1em] cursor-pointer rounded-sm hover:bg-[#f4d03f]"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExplore(item);
                            }}
                          >
                            ← BACK
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#0a0a0a] to-[#1a1410]">
                        <h3 className="text-xl font-bold text-white mb-2 capitalize">
                          {item.name}
                        </h3>
                        <p className="text-sm text-white/60 mb-4">
                          No coordinates available
                        </p>

                        <div className="w-full h-64 bg-black/30 rounded border border-white/10 flex items-center justify-center">
                          <svg
                            className="w-16 h-16 text-white/20"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" />
                          </svg>
                        </div>

                        <button
                          className="mt-6 flex items-center gap-2 bg-white text-[#0a0a0a] border-none py-3 px-5 font-mono text-xs font-bold tracking-[0.1em]"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExplore(item);
                          }}
                        >
                          ← BACK
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedInterview && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-8"
          onClick={() => setSelectedInterview(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/60 hover:text-white text-5xl leading-none"
            onClick={() => setSelectedInterview(null)}
          >
            ×
          </button>
          <div
            className="max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-bold text-white mb-4 capitalize">
              {selectedInterview.name}
            </h2>
            {selectedInterview.mediaType === "video" ? (
              <video
                src={selectedInterview.path}
                controls
                autoPlay
                className="w-full rounded shadow-2xl"
              />
            ) : (
              <div className="bg-gradient-to-br from-[#2c1810] to-[#1a1410] rounded p-12 flex flex-col items-center justify-center min-h-[400px]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-32 h-32 text-[#f4d03f] mb-8"
                >
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
                <audio
                  src={selectedInterview.path}
                  controls
                  autoPlay
                  className="w-full max-w-2xl"
                />
              </div>
            )}
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: styles }} />
    </div>
  );
};
