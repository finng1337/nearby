"use client";

import {CategoryTypeEnum, GetVenuesResponse} from "@/db/types";
import {APIProvider, Map as GoogleMap, useMap} from "@vis.gl/react-google-maps";
import Marker from "@/components/markers/Marker";
import Supercluster from "supercluster";
import React, {useEffect, useRef, useState} from "react";
import ClusterMarker from "@/components/markers/ClusterMarker";
import {getVenues} from "@/db/actions/venueActions";
import ScheduleDetailSmall from "@/components/ScheduleDetailSmall";

interface P {
    venue: GetVenuesResponse[0];
}
interface C {
    venues: GetVenuesResponse;
}
interface SelectedMarker {
    venueIds: number[];
    ref: google.maps.marker.AdvancedMarkerElement;
}

const getClusters = (
    index: Supercluster<P, C> | null,
    map: google.maps.Map,
    venues: GetVenuesResponse
): (Supercluster.PointFeature<P> | Supercluster.ClusterFeature<C>)[] => {
    if (index && venues.length > 0) {
        const mapZoom = map.getZoom();
        const mapBounds = map.getBounds()?.toJSON();

        if (mapZoom && mapBounds) {
            console.log("getClusters");
            return index.getClusters([mapBounds.west, mapBounds.south, mapBounds.east, mapBounds.north], mapZoom);
        }
    }

    return [];
};

const getSchedulesCount = (venues: GetVenuesResponse): number => {
    return venues.reduce((acc, venue) => {
        return acc + venue.schedules.length;
    }, 0);
};

const makeClusterKey = (clusterId: number) => `0${clusterId}`;

function Map() {
    const map = useMap();
    const index = useRef<Supercluster<P, C> | null>(null);
    const [venues, setVenues] = useState<GetVenuesResponse>([]);
    const [clusters, setClusters] = useState<(Supercluster.PointFeature<P> | Supercluster.ClusterFeature<C>)[]>([]);
    const [boundsChanged, setBoundsChanged] = useState<boolean>(false);
    const [selectedMarker, setSelectedMarker] = useState<SelectedMarker | null>(null);

    useEffect(() => {
        const data = getVenues({active: true});
        data.then((res) => setVenues(res));
    }, []);

    useEffect(() => {
        if (venues.length > 0) {
            index.current = new Supercluster<P, C>({
                radius: 160,
                maxZoom: 20,
                map: (props) => ({venues: [props.venue]}),
                reduce: (accumulated, props) => {
                    accumulated.venues = [...accumulated.venues, ...props.venues];
                },
            });
            index.current.load(
                venues.map(
                    (venue) =>
                        ({
                            type: "Feature",
                            geometry: {
                                type: "Point",
                                coordinates: [parseFloat(venue.lon), parseFloat(venue.lat)],
                            },
                            properties: {venue},
                        }) as Supercluster.PointFeature<P>
                )
            );

            map && setClusters(getClusters(index.current, map, venues));
        }
    }, [venues]);

    const handleClusterClick = (
        clusterProperties: Supercluster.ClusterFeature<C>["properties"],
        markerRef: google.maps.marker.AdvancedMarkerElement | null,
        ev: google.maps.MapMouseEvent
    ) => {
        ev.stop();

        ev.latLng && map?.panTo(ev.latLng);

        const {venues, cluster_id} = clusterProperties;
        const venueLat = venues[0].lat;
        const venueLon = venues[0].lon;
        const isSame = !venues.find((venue) => venue.lat !== venueLat && venue.lon !== venueLon);

        if (index.current && !isSame) {
            const zoom = index.current.getClusterExpansionZoom(cluster_id);

            if (zoom <= 19) {
                map?.setZoom(zoom);
                setSelectedMarker(null);
                return;
            }
        }

        const venueIds =
            index.current?.getLeaves(cluster_id, Infinity).map((marker) => marker.properties.venue.id) || [];

        markerRef && setSelectedMarker({venueIds, ref: markerRef});
    };

    const handleMarkerClick = (
        venueId: number,
        markerRef: google.maps.marker.AdvancedMarkerElement | null,
        ev: google.maps.MapMouseEvent
    ) => {
        ev.stop();

        if (selectedMarker && selectedMarker.venueIds.includes(venueId)) {
            setSelectedMarker(null);
            return;
        }

        markerRef && setSelectedMarker({venueIds: [venueId], ref: markerRef});
    };

    const handleIdle = () => {
        if (boundsChanged) {
            map && setClusters(getClusters(index.current, map, venues));
            setBoundsChanged(false);
        }
    };

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
            {selectedMarker && selectedMarker.venueIds.length === 1 && (
                <ScheduleDetailSmall
                    markerRef={selectedMarker.ref}
                    scheduleId={venues.find((venue) => venue.id === selectedMarker.venueIds[0])!.schedules[0].id}
                />
            )}
            {clusters.map((cluster) => {
                const {geometry, properties} = cluster;
                const position = {
                    lat: geometry.coordinates[1],
                    lng: geometry.coordinates[0],
                };

                if (properties.hasOwnProperty("cluster")) {
                    const clusterProperties = properties as Supercluster.ClusterFeature<C>["properties"];

                    return (
                        <ClusterMarker
                            key={makeClusterKey(clusterProperties.cluster_id)}
                            position={position}
                            count={getSchedulesCount(clusterProperties.venues)}
                            onClusterClick={handleClusterClick.bind(null, clusterProperties)}
                        />
                    );
                }

                const pointProperties = properties as Supercluster.PointFeature<P>["properties"];
                const venueId = pointProperties.venue.id;

                return pointProperties.venue.schedules.length > 1 ? (
                    <ClusterMarker
                        key={venueId}
                        position={position}
                        count={pointProperties.venue.schedules.length}
                        onClusterClick={handleMarkerClick.bind(null, venueId)}
                    />
                ) : (
                    <Marker
                        key={venueId}
                        position={position}
                        category={
                            (pointProperties.venue.schedules[0].event.category?.value as CategoryTypeEnum) || null
                        }
                        onMarkerClick={handleMarkerClick.bind(null, venueId)}
                    />
                );
            })}
        </GoogleMap>
    );
}

export default function MapWrapper() {
    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!} region="CZ" language="cs">
            <Map />
        </APIProvider>
    );
}
