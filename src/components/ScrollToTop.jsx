import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const location = useLocation();
  const prevLocation = useRef(location);
  const scrollPosition = useRef(0);

  useEffect(() => {
    if (prevLocation.current !== location) {
      if (prevLocation.current.pathname === location.pathname) {
        window.scrollTo(0, scrollPosition.current);
      } else {
        window.scrollTo(0, 0);
      }
    }
    prevLocation.current = location;
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      scrollPosition.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return null;
};

export default ScrollToTop;
