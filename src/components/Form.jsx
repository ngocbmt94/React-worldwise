// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Form.module.css";
import Button from "./Button";
import { useURLPosition } from "../hook/useURLPosition";
import Message from "./Message";
import Spinner from "./Spinner";
import { useCities } from "../context/CitiesContext";

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";
function Form() {
  const [errMessage, setErrMessage] = useState("");
  const [isLoadingGeolocation, setIsLoadingGeolocation] = useState(false);
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [emoji, setEmoji] = useState(null);
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");

  const navigateFn = useNavigate();
  const [newLat, newLng] = useURLPosition();

  const { createNewCity, isLoading: isLoadingForm } = useCities();

  useEffect(() => {
    const getCity = async function () {
      try {
        setIsLoadingGeolocation(true);
        setErrMessage(""); // reset to click new postion
        const res = await fetch(`${BASE_URL}?latitude=${newLat}&longitude=${newLng}`);
        const data = await res.json();

        if (!data.countryName) throw new Error("Please click another place. That doesn't seem to be a country");

        setCityName(data.city || data.locality);
        setCountry(data.countryName);
        setEmoji(data.countryCode);
      } catch (err) {
        setErrMessage(err.message);
      } finally {
        setIsLoadingGeolocation(false);
      }
    };

    if (!newLat && !newLng) return;

    getCity();
  }, [newLat, newLng]);

  async function handleSumitForm(e) {
    e.preventDefault();

    if (!cityName && !date) return;

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: {
        lat: +newLat,
        lng: +newLng,
      },
    };

    await createNewCity(newCity);
    navigateFn("/app");
  }

  if (isLoadingGeolocation) return <Spinner />;
  if (!newLat && !newLng) return <Message message="Start by clicking somewhere on the map" />;
  if (errMessage) return <Message message={errMessage} />;

  return (
    <form className={`${styles.form} ${isLoadingForm ? `${styles.loading}` : ""}`} onSubmit={handleSumitForm}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input id="cityName" onChange={(e) => setCityName(e.target.value)} value={cityName} />
        <span className={styles.flag}>{country}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker selected={date} onChange={(date) => setDate(date)} />
        {/* 
        <input id="date" onChange={(e) => setDate(e.target.value)} value={date} /> */}
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea id="notes" onChange={(e) => setNotes(e.target.value)} value={notes} />
      </div>

      <div className={styles.buttons}>
        <Button typeClass="primary">Add</Button>
        <Button
          typeClass="back"
          onClickEvent={(e) => {
            e.preventDefault();
            navigateFn(-1);
          }}
        >
          &larr; Back
        </Button>
      </div>
    </form>
  );
}

export default Form;
