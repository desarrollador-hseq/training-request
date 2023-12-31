import { useEffect, useState } from "react";

const useImageError = () => {
    const [el, setEl] = useState(null); // contains image reference
    const [error, setError] = useState(false); // contains error flag
  
    const _handleError = () => { setError(true); }  // set error
    const retry = () => { setError(false); } // set error false to img can re-render
  
    useEffect(() => {
      // use of error event of the image tag
      el?.addEventListener(“error”, _handleError);
  
      return () => {
        el?.removeEventListener(“error”, _handleError);
      }
    }, [el]);
  
    return [
      setEl, // set the image ref
      error, // error flag
      retry, // a func, which can be used to re-render image
      el // img ref(for special case which requires ref)
    ];
  };