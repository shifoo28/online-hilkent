import { useState, useEffect } from "react";
import clsx from "clsx"; // optional, for conditional classNames
import WishlistLink from "../../Common/WishlistLink";
import RecentlyViewed from "@/components/Common/RecentlyViewedLink";

const UserPicks = () => {
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchMoveY, setTouchMoveY] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const updateIsMobile = () => setIsMobile(window.innerWidth < 1024);
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0]?.clientY ?? null);
      setTouchMoveY(null);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isMobile || touchStartY === null) return;
      setTouchMoveY(e.touches[0]?.clientY ?? null);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isMobile || touchStartY === null || touchMoveY === null) return;
      const deltaY = touchStartY - touchMoveY;

      if (deltaY > 30) {
        setIsVisible(false); // swipe up → hide
      } else if (deltaY < -30) {
        setIsVisible(true); // swipe down → show
      }
      setTouchStartY(null);
      setTouchMoveY(null);
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [touchStartY, touchMoveY, isMobile]);

  // Calculate live offset for animation
  let offset = touchMoveY && touchStartY ? touchMoveY - touchStartY : 0;

  isVisible && offset < 0 && offset > -100 && (offset = offset); // limit upward offset
  isVisible && offset > 0 && offset < 100 && (offset = offset); // limit downward offset

  return (
    <div
      className={clsx(
        " transition-transform duration-300 ease-out",
        isVisible ? "translate-y-0" : "translate-y-full",
      )}
      style={{
        transform: `translateY(${isVisible ? Math.min(offset, 0) : "100%"})`,
      }}
    >
      <div className="block">
        <ul className="flex items-center gap-5.5">
          <li className="py-4">
            <RecentlyViewed />
          </li>

          <li className="py-4">
            <WishlistLink />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserPicks;
