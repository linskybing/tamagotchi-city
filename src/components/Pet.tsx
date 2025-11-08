import { useEffect, useRef, useState } from "react";
import bg from "@/assets/image/background.png";

interface PetProps {
  stage: "egg" | "small" | "medium" | "large" | "buff";
  mood: number;
  message?: string;
}

const Pet = ({ stage, mood, message }: PetProps) => {
  const petRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x: 150, y: 150 });
  const [velocity, setVelocity] = useState({ x: 1, y: 1 });
  const [containerSize, setContainerSize] = useState({ width: 300, height: 300 });

  const petSizes = {
    egg: 40,
    small: 50,
    medium: 65,
    large: 80,
    buff: 95,
  } as const;

  const petSize = petSizes[stage];

  // measure container and update on resize
  useEffect(() => {
    const updateSize = () => {
      const el = containerRef.current;
      if (el) {
        const w = el.clientWidth;
        const h = el.clientHeight;
        setContainerSize({ width: w, height: h });
        // clamp pet position
        setPosition((prev) => ({
          x: Math.max(0, Math.min(prev.x, w - petSize)),
          y: Math.max(0, Math.min(prev.y, h - petSize)),
        }));
      }
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", updateSize);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, [petSize]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => {
        let newX = prev.x + velocity.x;
        let newY = prev.y + velocity.y;
        let newVelX = velocity.x;
        let newVelY = velocity.y;

        // Collision detection with measured boundaries
        if (newX <= 0 || newX + petSize >= containerSize.width) {
          newVelX = -newVelX;
          newX = Math.max(0, Math.min(newX, containerSize.width - petSize));
        }

        if (newY <= 0 || newY + petSize >= containerSize.height) {
          newVelY = -newVelY;
          newY = Math.max(0, Math.min(newY, containerSize.height - petSize));
        }

        // occasional random change
        if (Math.random() > 0.98) {
          newVelX = (Math.random() - 0.5) * 2;
          newVelY = (Math.random() - 0.5) * 2;
        }

        // update velocity for next tick
        setVelocity({ x: newVelX, y: newVelY });

        return { x: newX, y: newY };
      });
    }, 50);

    return () => clearInterval(interval);
  }, [velocity, petSize, containerSize]);

  const getPetEmoji = () => {
    switch (stage) {
      case "egg":
        return "🥚";
      case "small":
        return "🐣";
      case "medium":
        return "🐤";
      case "large":
        return "🐥";
      case "buff":
        return "💪🐔";
      default:
        return "🐣";
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl shadow-inner overflow-hidden w-full"
      style={{
        aspectRatio: "1 / 1",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        ref={petRef}
        className="absolute transition-all duration-200 flex items-center justify-center"
        style={{
          width: petSize,
          height: petSize,
          left: position.x,
          top: position.y,
          fontSize: petSize * 0.8,
          filter: mood < 40 ? "grayscale(30%)" : "none",
          transform: `scaleX(${velocity.x > 0 ? 1 : -1})`,
          animation: "bounce 0.5s infinite",
        }}
      >
        {getPetEmoji()}
      </div>

      {message && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: position.x + petSize / 2,
            top: Math.max(8, position.y - petSize * 0.8),
            transform: "translateX(-50%)",
            maxWidth: 200,
            zIndex: 20,
            transition: "left 0.12s linear, top 0.12s linear",
          }}
        >
          <div style={{ position: "relative" }}>
            <div
              className="px-3 py-2 rounded-lg"
              style={{
                backgroundColor: "#EDF8FA",
                color: "var(--tp-grayscale-800)",
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                width: 200,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textAlign: 'center',
                wordBreak: 'break-word'
              }}
            >
              {message}
            </div>
            <div
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                top: "100%",
                width: 0,
                height: 0,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderTop: "8px solid #EDF8FA",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Pet;
