import {memo, useCallback, useEffect, useState} from "react";
import styles from "./LocationButton.module.scss";
import LocationIcon from "@/icons/location.svg";
import {cx} from "@/utils";
import {useMap} from "@vis.gl/react-google-maps";

function LocationButton() {
    const map = useMap();
    const [active, setActive] = useState(false);

    const handleClick = useCallback(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            map?.panTo({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
            map?.setZoom(15);
            setActive(true);
        }, () => {
            setActive(false);
        });
    }, [map]);

    useEffect(() => {
        handleClick();
    }, [handleClick]);

    return (
      <button
        onClick={handleClick}
          className={cx({
          [styles.button]: true,
          [styles.active]: active,
          [styles.disabled]: !active,
      })}>
          <LocationIcon height={26} />
      </button>
    );
}
export default memo(LocationButton);