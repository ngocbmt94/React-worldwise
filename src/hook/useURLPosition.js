import { useSearchParams } from "react-router-dom";

export function useURLPosition() {
  // useSearchParams(react-router-dom) to get state from URL
  const [searhParams, setSetSearchParams] = useSearchParams();
  const lat = searhParams.get("lat");
  const lng = searhParams.get("lng");

  return [lat, lng];
}
