import PropTypes from "prop-types";
import { useEffect } from "react";

const canUseDOM = () => {
  if (
    typeof window === "undefined" ||
    !window.document ||
    !window.document.createElement
  ) {
    return false;
  }
  return true;
};

const ZendeskAPI = (...args) => {
  if (canUseDOM && window.zE) {
    window.zE.apply(null, args);
  } else {
    console.warn("Zendesk is not initialized yet");
  }
};

const Zendesk = ({ zendeskKey, defer, onLoaded }) => {
  const onScriptLoaded = () => {
    if (typeof onLoaded === "function") {
      onLoaded();
    }
  };

  const insertScript = (zendeskKey, defer) => {
    const script = document.createElement("script");
    if (defer) {
      script.defer = true;
    } else {
      script.async = true;
    }
    script.id = "ze-snippet";
    script.src = `https://static.zdassets.com/ekr/snippet.js?key=${zendeskKey}`;
    script.addEventListener("load", onScriptLoaded);
    document.body.appendChild(script);
  };

  useEffect(() => {
    if (canUseDOM && !window.zE) {
      insertScript(zendeskKey, defer);
      window.zESettings = { defer, zendeskKey };
    }
    return () => {
      if (!canUseDOM || !window.zE) {
        return;
      }
      delete window.zE;
      delete window.zESettings;
    };
  }, [zendeskKey, defer]);

  return null;
};

Zendesk.propTypes = {
  zendeskKey: PropTypes.string.isRequired,
  defer: PropTypes.bool,
  onLoaded: PropTypes.func,
};

export default Zendesk;
export { ZendeskAPI };