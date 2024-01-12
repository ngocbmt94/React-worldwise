import { useCities } from "../context/CitiesContext";
import CountryItem from "./CountryItem";
import styles from "./CountryList.module.css";
import Message from "./Message";
import Spinner from "./Spinner";

function CountryList() {
  const { cities, isLoading } = useCities();
  const countries = cities.reduce((acc, curValue) => {
    return !acc.map((el) => el.country).includes(curValue.country) ? [...acc, { country: curValue.country, emoji: curValue.emoji }] : acc;
  }, []);

  if (isLoading) return <Spinner />;

  if (countries.length === 0) return <Message message="No country" />;

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem key={country.country} country={country} />
      ))}
    </ul>
  );
}

export default CountryList;
