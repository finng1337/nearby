"use client";

import {useEffect} from "react";
import {Loader} from "@googlemaps/js-api-loader";
import styles from "@/components/Map.module.scss";
import {GetVenuesResponse} from "@/db/types";

interface Props {
    venues: GetVenuesResponse;
}
export default function Map(props: Props) {

    useEffect(() => {
        const loader = new Loader({
            apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
            version: "weekly",
            region: "CZ",
            language: "cs",
        });

        loader.load().then(async () => {
            const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
            const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

            const map = new Map(document.getElementById("map") as HTMLElement, {
                mapId: "DEMO_MAP_ID",
                center: {lat: 49.803, lng: 15.474},
                zoom: 8,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
            });

            for (const venue of props.venues) {
                new AdvancedMarkerElement({
                    map,
                    position: {lat: parseFloat(venue.lat), lng: parseFloat(venue.lon)},
                    title: venue.title,
                });
            }
        });
    }, []);

    return (
        <div id="map" className={styles.map}/>
    );
}