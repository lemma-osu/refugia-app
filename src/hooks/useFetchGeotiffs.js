// Async loader of georeferenced images
import { useState, useEffect } from "react";
import { getCanvasData } from "../utils";

export function useFetchGeotiffs({ paths, lng, lat, width, height }) {
  const [state, setState] = useState({
    loading: true,
    done: 0,
    data: [],
  });

  const handleProgress = (result) => {
    setState((state) => ({ ...state, done: state.done + 1 }));
    return result;
  };

  useEffect(() => {
    const promises = paths
      .map((path) => {
        return getCanvasData(lng, lat, path, width, height);
      })
      .map((p) => p.then(handleProgress));
    Promise.all(promises).then((data) => {
      setState((state) => ({ loading: false, done: state.done, data }));
    });
  }, [paths, lng, lat, height, width]);

  return state;
}
