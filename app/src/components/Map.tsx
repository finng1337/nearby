"use client";

import {CategoryTypeEnum, GetVenuesResponse} from "@/db/types";
import {APIProvider, Map as GoogleMap, useMap} from "@vis.gl/react-google-maps";
import Marker from "@/components/markers/Marker";
import Supercluster from "supercluster";
import React, {useEffect, useRef, useState} from "react";
import ClusterMarker from "@/components/markers/ClusterMarker";

interface P {
    venue: GetVenuesResponse[0];
}
interface C {
    venues: GetVenuesResponse;
}

interface Props {
    venues: GetVenuesResponse;
}
function Map(props: Props) {
    const {venues} = props;
    const map = useMap();
    const index = useRef<Supercluster<P, C> | null>(null);
    const [loading, setLoading] = useState(true);
    const [clusters, setClusters] = useState<(Supercluster.PointFeature<P> | Supercluster.ClusterFeature<C>)[]>([]);
    const [bounds, setBounds] = useState<google.maps.LatLngBoundsLiteral | null>(null);
    const [isIdle, setIsIdle] = useState(true);

    useEffect(() => {
        if (!index.current) {
            index.current = new Supercluster<P, C>({
                radius: 160,
                maxZoom: 20,
                map: (props) => ({venues: [props.venue]}),
                reduce: (accumulated, props) => {
                    accumulated.venues = [...accumulated.venues, ...props.venues];
                }
            });

            index.current.load(venues.map(venue => ({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [parseFloat(venue.lon), parseFloat(venue.lat)]
                },
                properties: {venue}
            } as Supercluster.PointFeature<P>)));
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const mapBounds = map?.getBounds();

        if (mapBounds) {
            setBounds({
                west: mapBounds.getSouthWest().lng(),
                south: mapBounds.getSouthWest().lat(),
                east: mapBounds.getNorthEast().lng(),
                north: mapBounds.getNorthEast().lat()
            });
        }
    }, [map]);

    useEffect(() => {
        if (!!index.current && !loading && isIdle && bounds) {
            const mapZoom = map?.getZoom();

            if (mapZoom !== undefined) {
                console.log("updating clusters");
                setClusters(index.current.getClusters(
                    [bounds.west, bounds.south, bounds.east, bounds.north],
                    mapZoom
                ));
            }
        }
    }, [loading, isIdle, bounds]);

    const handleClusterClick = (id: number, ev: google.maps.MapMouseEvent) => {
        ev.stop();

        if (index.current && map && ev.latLng) {
            const zoom = index.current.getClusterExpansionZoom(id);
            map.setZoom(zoom);
            map.panTo(ev.latLng);
        }
    }

    const getSchedulesCount = (venues: GetVenuesResponse): number => {
        return venues.reduce((acc, venue) => {
            return acc + venue.schedules.length;
        }, 0);
    }

    return (
        <GoogleMap
            mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID!}
            defaultCenter={{lat: 49.803, lng: 15.474}}
            defaultZoom={8}
            maxZoom={19}
            minZoom={7}
            streetViewControl={false}
            mapTypeControl={false}
            fullscreenControl={false}
            clickableIcons={false}
            gestureHandling="greedy"
            onBoundsChanged={ev => {
                setBounds(ev.detail.bounds);
                setIsIdle(false);
            }}
            onIdle={() => setIsIdle(true)}
        >
            {clusters.map((cluster) => {
                const {geometry, properties} = cluster;
                const position = {
                    lat: geometry.coordinates[1],
                    lng: geometry.coordinates[0]
                };

                if (properties.hasOwnProperty("cluster")) {
                    const clusterProperties = properties as Supercluster.ClusterFeature<C>["properties"];

                    return (
                        <ClusterMarker
                            key={`0${clusterProperties.cluster_id}`}
                            position={position}
                            count={getSchedulesCount(clusterProperties.venues)}
                            onClick={handleClusterClick.bind(null, clusterProperties.cluster_id)}
                        />
                    );
                } else {
                    const pointProperties = properties as Supercluster.PointFeature<P>["properties"];

                    return pointProperties.venue.schedules.length > 1 ? (
                        <ClusterMarker
                            key={pointProperties.venue.id}
                            position={position}
                            count={pointProperties.venue.schedules.length}
                        />
                    ) : (
                        <Marker
                            key={pointProperties.venue.id}
                            position={position}
                            category={(pointProperties.venue.schedules[0].event.category?.value as CategoryTypeEnum) || null}
                        />
                    );
                }
            })}
        </GoogleMap>
    );
}

export default function MapWrapper(props: Props) {
    return (
        <APIProvider
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
            region="CZ"
            language="cs"
        >
            <Map venues={props.venues} />
        </APIProvider>
    );
}

