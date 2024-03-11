"use client";

import {useEffect} from "react";
import {Loader} from "@googlemaps/js-api-loader";
import styles from "@/components/Map.module.scss";

export default function Map() {

    useEffect(() => {
        const loader = new Loader({
            apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
            version: "weekly",
            region: "CZ",
            language: "cs",
        });

        loader.load().then(async () => {
            const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;

            const map = new Map(document.getElementById("map") as HTMLElement, {
                mapId: "DEMO_MAP_ID",
                center: {lat: 49.803, lng: 15.474},
                zoom: 8,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
            });
        });
    }, []);

    return (
        <div id="map" className={styles.map}/>
    );
}