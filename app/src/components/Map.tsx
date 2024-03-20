"use client";

import {CategoryTypeEnum, GetVenuesResponse} from "@/db/types";
import {APIProvider, Map as GoogleMap, useMap} from "@vis.gl/react-google-maps";
import Marker from "@/components/markers/Marker";
import Supercluster from "supercluster";
import React, {useEffect, useRef, useState} from "react";
import ClusterMarker from "@/components/markers/ClusterMarker";
import {getVenues} from "@/db/actions/venueActions";

interface P {
    venue: GetVenuesResponse[0];
}
interface C {
    venues: GetVenuesResponse;
}
function Map() {
    const map = useMap();
    const index = useRef<Supercluster<P, C> | null>(null);
    const [venues, setVenues] = useState<GetVenuesResponse>([]);
    const [clusters, setClusters] = useState<(Supercluster.PointFeature<P> | Supercluster.ClusterFeature<C>)[]>([]);
    const [boundsChanged, setBoundsChanged] = useState<boolean>(false);
    const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

    useEffect(() => {
        const data = getVenues({active: true});
        data.then(res => setVenues(res));
    }, []);

    useEffect(() => {
        if (venues.length > 0) {
            loadIndex();
            updateClusters();
        }
    }, [venues]);

    const makeClusterKey = (clusterId: number) => `0${clusterId}`;

    const loadIndex = () => {
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
    };

    const updateClusters = () => {
        if (index.current && venues.length > 0) {
            const mapZoom = map?.getZoom();
            const mapBounds = map?.getBounds()?.toJSON();

            if (mapZoom && mapBounds) {
                console.log("updating clusters");
                setClusters(index.current.getClusters(
                    [mapBounds.west, mapBounds.south, mapBounds.east, mapBounds.north],
                    mapZoom
                ));
            }
        }
    };

    const handleClusterClick = (clusterProperties: Supercluster.ClusterFeature<C>["properties"], ev: google.maps.MapMouseEvent) => {
        ev.stop();

        ev.latLng && map?.panTo(ev.latLng);

        const {venues, cluster_id} = clusterProperties;
        const venueLat = venues[0].lat;
        const venueLon = venues[0].lon;
        const isSame = !venues.find(venue => venue.lat !== venueLat && venue.lon !== venueLon);

        if (index.current && !isSame) {
            const zoom = index.current.getClusterExpansionZoom(cluster_id);

            if (zoom <= 19) {
                map?.setZoom(zoom);
                return;
            }
        }

        setSelectedMarkerId(makeClusterKey(cluster_id));
    };

    const handleMarkerClick = (markerId: string, ev: google.maps.MapMouseEvent) => {
        ev.stop();

        ev.latLng && map?.panTo(ev.latLng);
        setSelectedMarkerId(markerId);
    }

    const handleIdle = () => {
        if (boundsChanged) {
            updateClusters();
            setBoundsChanged(false);
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
            onBoundsChanged={() => setBoundsChanged(true)}
            onIdle={handleIdle}
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
                            key={makeClusterKey(clusterProperties.cluster_id)}
                            position={position}
                            count={getSchedulesCount(clusterProperties.venues)}
                            onClick={handleClusterClick.bind(null, clusterProperties.cluster_id)}
                            onClick={handleClusterClick.bind(null, clusterProperties)}
                        />
                    );
                } else {
                    const pointProperties = properties as Supercluster.PointFeature<P>["properties"];
                    const schedule = pointProperties.venue.schedules[0];

                    return pointProperties.venue.schedules.length > 1 ? (
                        <ClusterMarker
                            key={pointProperties.venue.id}
                            position={position}
                            count={pointProperties.venue.schedules.length}
                            onClick={handleMarkerClick.bind(null, pointProperties.venue.id.toString())}
                        />
                    ) : (
                        <Marker
                            key={pointProperties.venue.id}
                            position={position}
                            category={(schedule.event.category?.value as CategoryTypeEnum) || null}
                            scheduleId={schedule.id}
                            onClick={handleMarkerClick.bind(null, pointProperties.venue.id.toString())}
                            selected={selectedMarkerId === pointProperties.venue.id.toString()}
                        />
                    );
                }
            })}
        </GoogleMap>
    );
}

export default function MapWrapper() {
    return (
        <APIProvider
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
            region="CZ"
            language="cs"
        >
            <Map />
        </APIProvider>
    );
}

