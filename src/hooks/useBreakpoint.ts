import { useState, useEffect } from "react";

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState("desktop");

  useEffect(() => {
    const calcBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint("mobile");
      else if (width < 1024) setBreakpoint("tablet");
      else setBreakpoint("desktop");
    };

    calcBreakpoint();
    window.addEventListener("resize", calcBreakpoint);
    return () => window.removeEventListener("resize", calcBreakpoint);
  }, []);

  return breakpoint;
}
