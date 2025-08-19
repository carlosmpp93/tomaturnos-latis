import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const CdnProvider = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    const isLoginPage = location.pathname === '/login';

    if (isLoginPage) {
      // Add CDN
      const cdnLink = document.createElement('link');
      cdnLink.href = "https://framework-gb.cdn.gob.mx/gm/v3/assets/styles/main.css";
      cdnLink.rel = "stylesheet";
      cdnLink.id = "gob-mx-cdn";
      document.head.appendChild(cdnLink);

      const cdnScript = document.createElement('script');
      cdnScript.src = "https://framework-gb.cdn.gob.mx/gm/v3/assets/js/gobmx.js";
      cdnScript.id = "gob-mx-script";
      document.body.appendChild(cdnScript);
    } else {
      // Remove CDN
      const cdnElement = document.getElementById("gob-mx-cdn");
      if (cdnElement) {
        document.head.removeChild(cdnElement);
      }
      const scriptElement = document.getElementById("gob-mx-script");
      if (scriptElement) {
        document.body.removeChild(scriptElement);
      }
    }

    // Cleanup on component unmount
    return () => {
      const cdnElement = document.getElementById("gob-mx-cdn");
      if (cdnElement) {
        document.head.removeChild(cdnElement);
      }
      const scriptElement = document.getElementById("gob-mx-script");
      if (scriptElement) {
        document.body.removeChild(scriptElement);
      }
    };
  }, [location]);

  return <>{children}</>;
};

export default CdnProvider;
