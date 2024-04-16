import { useEffect, useState } from "react";

const MOBILE_WIDTH_THRESHOLD = 768;

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    function handleWindowSizeChange() {
        setIsMobile(window.innerWidth <= MOBILE_WIDTH_THRESHOLD);
    }

    useEffect(() => {
        handleWindowSizeChange(); // Initial check
        window.addEventListener("resize", handleWindowSizeChange);
        return () => {
            window.removeEventListener("resize", handleWindowSizeChange);
        };
    }, []);

    return isMobile;
};

export default useIsMobile;
