import { useState, useEffect } from 'react';
import { getLanguage } from '../assets/locale/config';

const useFetch = () => {
    const [status, setStatus] = useState({loading: true });
    const [lat, setLat] = useState("");
    const [long, setLong] = useState("");
    const [data, setData] = useState([]);
    //const [language, setLanguage] = useState("");
    const count = '50';
    

    useEffect(() => {
        setStatus({ loading: true });

        //let language = getLanguage();

        //setLanguage(getLanguage());

        const fetchData = async () => {
        // Get latitude and longitude from Geolocation API
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((location) => {
                    setLat(location.coords.latitude);
                    setLong(location.coords.longitude);
                });
            } else {
                // set latitude and longitude to default values if Geolocation API is not supported
                setLat("90.1994");
                setLong("38.6270");
                console.log("Geolocation is not supported by this browser.");
            }
        // Get data from OpenWeatherMap API
        try {
            if(!lat || !long){return false;}
            await fetch(`${process.env.REACT_APP_API_URL}/find?lat=${lat}&lon=${long}&cnt=${count}&appid=${process.env.REACT_APP_API_KEY}&lang=${getLanguage()}`).then((response) => response.json())
                .then((data) => {
                const {list} = data;
                const mapped = list.map(({ main: { humidity, pressure, temp }, name, id }) => ({ id: id, name: name, pressure: pressure, humidity: humidity, temp: temp }));
                setData(mapped);
                setStatus({ loading: false });
            });
            // reduce json to only required json for DataGrid to work
        } catch (error) {
            console.log(error);
        }
        }
        fetchData();
    }, [lat, long]);

    return { status, data };
};


export default useFetch;