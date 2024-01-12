import { createContext, useContext, useEffect, useReducer, useCallback } from "react";

const BASE_URL = "http://localhost:3000";
const CitiesContext = createContext(null); // create new context component

const initState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  err: "",
};
function reducer(curState, action) {
  switch (action.type) {
    case "loading":
      return { ...curState, isLoading: true };
    case "cities/loaded":
      return { ...curState, isLoading: false, cities: action.payload };
    case "cities/add":
      return { ...curState, isLoading: false, cities: [...curState.cities, action.payload], currentCity: action.payload };
    case "cities/delete":
      return { ...curState, isLoading: false, cities: curState.cities.filter((c) => c.id !== action.payload), currentCity: {} };

    case "currentCity/loaded":
      return { ...curState, isLoading: false, currentCity: action.payload };

    case "rejected":
      return { ...curState, isLoading: false, err: action.payload };

    default:
      throw new Error("UNKNOWN ACTION TYPE");
  }
}
// import value into Provider Component
function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(reducer, initState);

  useEffect(function () {
    const fetchCities = async function () {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const dataCities = await res.json();

        dispatch({ type: "cities/loaded", payload: dataCities });
      } catch (err) {
        console.error(err.message);
        dispatch({ type: "rejected", payload: err.message });
      }
    };

    fetchCities();
  }, []);

  const getCurrentCity = useCallback(
    async function getCurrentCity(id) {
      if (Number(id) === currentCity.id) return;

      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const dataCurrentCity = await res.json();

        dispatch({ type: "currentCity/loaded", payload: dataCurrentCity });
      } catch (err) {
        console.error(err.message);
        dispatch({ type: "rejected", payload: err.message });
      }
    },
    [currentCity.id]
  );

  async function createNewCity(city) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(city),
      });
      const dataNewCity = await res.json();

      dispatch({ type: "cities/add", payload: dataNewCity });
    } catch (err) {
      console.error(err.message);
      dispatch({ type: "rejected", payload: err.message });
    }
  }

  async function deleteCity(idCity) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${BASE_URL}/cities/${idCity}`, {
        method: "DELETE",
      });

      dispatch({ type: "cities/delete", payload: idCity });
    } catch (err) {
      console.error(err.message);
      dispatch({ type: "rejected", payload: err.message });
    }
  }

  return <CitiesContext.Provider value={{ cities, isLoading, currentCity, getCurrentCity, createNewCity, deleteCity }}>{children}</CitiesContext.Provider>;
}

// cosuming value context
function useCities() {
  const value = useContext(CitiesContext);
  if (value === undefined) throw new Error("cities context was used out side Cities Provider");

  return value;
}

export { CitiesProvider, useCities };
