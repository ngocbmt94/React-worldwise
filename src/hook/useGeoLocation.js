import { useState } from "react";

export function useGeoLocation(defaultPosition = null) {
  const [isLoadingPosition, setIsLoadingPosition] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userPosition, setUserPosition] = useState(defaultPosition);

  function getGeoLocation() {
    if (!navigator.geolocation) return setErrorMessage("Your browser does not support geolocation");

    setIsLoadingPosition(true);
    function success(pos) {
      const crd = pos.coords;
      setUserPosition([crd.latitude, crd.longitude]);
      setIsLoadingPosition(false);
    }
    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
      setErrorMessage(err.message);
    }
    navigator.geolocation.getCurrentPosition(success, error);
  }

  return { isLoadingPosition, userPosition, getGeoLocation };
}
