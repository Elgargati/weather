import { Oval } from "react-loader-spinner";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFrown } from "@fortawesome/free-solid-svg-icons";

function Grp204WeatherApp() {
  const [input, setInput] = useState("");
  const [weather, setWeather] = useState({
    loading: false,
    data: {},
    error: false,
  });
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  const toDateFunction = (date) => {
    const months = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ];
    const weekDays = [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ];
    const currentDate = new Date(date);
    const formattedDate = `${
      weekDays[currentDate.getDay()]
    } ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
    return formattedDate;
  };

  const search = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setInput("");
      setWeather({ ...weather, loading: true });
      const url = "https://api.openweathermap.org/data/2.5/forecast";
      const api_key = "f00c38e0279b7bc85480c3fe775d518c";
      await axios
        .get(url, {
          params: {
            q: input,
            units: "metric",
            appid: api_key,
          },
        })
        .then((res) => {
          setWeather({ data: res.data, loading: false, error: false });
        })
        .catch((error) => {
          setWeather({ ...weather, data: {}, error: true });
          setInput("");
        });
    }
  };

  const addToFavorites = () => {
    const city = weather.data.city?.name;
    if (city && !favorites.includes(city)) {
      const newFavorites = [...favorites, city];
      setFavorites(newFavorites);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
    } else if (favorites.includes(city)) {
      alert("Cette ville est déjà dans vos favoris !");
    }
  };

  const searchFavorite = async (city) => {
    setWeather({ ...weather, loading: true });
    const url = "https://api.openweathermap.org/data/2.5/forecast";
    const api_key = "f00c38e0279b7bc85480c3fe775d518c";
    await axios
      .get(url, {
        params: {
          q: city,
          units: "metric",
          appid: api_key,
        },
      })
      .then((res) => {
        setWeather({ data: res.data, loading: false, error: false });
      })
      .catch((error) => {
        setWeather({ ...weather, data: {}, error: true });
      });
  };

  return (
    <div className="container mx-auto h-[100vh] flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-2xl overflow-hidden">
        <h1 className="text-gray-800 text-3xl font-semibold mb-6 text-center">
          Application Météo
        </h1>

        {favorites.length > 0 && (
          <div className="mb-6">
            <h3 className="text-gray-700 text-xl font-medium">
              Villes favorites :
            </h3>
            <ul className="flex space-x-4 mt-2 overflow-x-auto">
              {favorites.map((city, index) => (
                <li
                  key={index}
                  className="text-blue-600 cursor-pointer hover:underline whitespace-nowrap"
                  onClick={() => searchFavorite(city)}
                >
                  {city}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center mb-6">
          <input
            type="text"
            className="flex-1 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
            placeholder="Entrez le nom de la ville..."
            name="query"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyPress={search}
          />
          <button
            onClick={addToFavorites}
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          >
            Ajouter aux favoris
          </button>
        </div>

        {weather.loading && (
          <div className="flex justify-center my-6">
            <Oval type="Oval" color="blue" height={50} width={50} />
          </div>
        )}

        {weather.error && (
          <div className="text-center text-red-600 text-xl font-semibold">
            <FontAwesomeIcon icon={faFrown} /> Ville introuvable !
          </div>
        )}

        {weather && weather.data.list && (
          <div>
            <h2 className="text-center text-gray-800 text-2xl font-medium">
              {weather.data.city.name}, {weather.data.city.country}
            </h2>

            <div className="mt-6 space-y-4 max-h-[300px] overflow-y-auto">
              {weather.data.list
                .filter((forecast, index) => index % 8 === 0)
                .map((forecast, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow"
                  >
                    <h3 className="text-gray-700 font-medium">
                      {toDateFunction(forecast.dt_txt)}
                    </h3>
                    <img
                      src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                      alt={forecast.weather[0].description}
                      className="h-10 w-10"
                    />
                    <p className="text-gray-700 text-lg">
                      {Math.round(forecast.main.temp)}°C
                    </p>
                    <p className="text-gray-500">
                      Vitesse du vent : {forecast.wind.speed} m/s
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Grp204WeatherApp;
