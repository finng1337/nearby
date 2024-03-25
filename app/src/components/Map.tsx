"use client";

import {CategoryTypeEnum, GetVenuesResponse} from "@/db/types";
import {APIProvider, Map as GoogleMap, useMap} from "@vis.gl/react-google-maps";
import Marker from "@/components/markers/Marker";
import Supercluster from "supercluster";
import React, {useCallback, useEffect, useRef, useState} from "react";
import ClusterMarker from "@/components/markers/ClusterMarker";
import {getVenues} from "@/db/actions/venueActions";
import ScheduleDetailSmall from "@/components/schedules/ScheduleDetailSmall";
import ScheduleDetail from "@/components/schedules/ScheduleDetail";
import ScheduleList from "@/components/schedules/ScheduleList";

interface P {
    venue: GetVenuesResponse[0];
}
interface C {
    venues: GetVenuesResponse;
}

interface ScheduleListState {
    venueIds: number[];
    schedulesCount: number;
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

const loadNewIndex = (venues: GetVenuesResponse): Supercluster<P, C> => {
    const index = new Supercluster<P, C>({
        radius: 160,
        maxZoom: 20,
        map: (props) => ({venues: [props.venue]}),
        reduce: (accumulated, props) => {
            accumulated.venues = [...accumulated.venues, ...props.venues];
        },
    });

    index.load(
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

    return index;
}

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
    const [selectedMarker, setSelectedMarker] = useState<google.maps.marker.AdvancedMarkerElement | null>(null);
    const [showSmallDetail, setShowSmallDetail] = useState<number | null>(null);
    const [showSchedulesList, setShowSchedulesList] = useState<ScheduleListState | null>(null);
    const [showDetail, setShowDetail] = useState<number | null>(null);

    useEffect(() => {
        const data = getVenues({active: true});
        data.then((res) => setVenues(res));
    }, []);

    useEffect(() => {
        index.current = loadNewIndex(venues);
        map && setClusters(getClusters(index.current, map, venues));
    }, [venues]);

    useEffect(() => {
        if (map) {
            navigator.geolocation.getCurrentPosition((position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                map.panTo(pos);
                map.setZoom(15);
            });
        }
    }, [map]);

    const handleDetailDismiss = useCallback(() => {
        setShowSmallDetail(null);
        setShowSchedulesList(null);
        setSelectedMarker(null);
    }, []);

    const handleClusterClick = useCallback(
        (
            clusterProperties: Supercluster.ClusterFeature<C>["properties"],
            markerRef: google.maps.marker.AdvancedMarkerElement | null,
            ev: google.maps.MapMouseEvent
        ) => {
            ev.stop();

            const {venues, cluster_id} = clusterProperties;
            const venueLat = venues[0].lat;
            const venueLon = venues[0].lon;
            const isSame = !venues.find((venue) => venue.lat !== venueLat || venue.lon !== venueLon);

            if (index.current && !isSame) {
                const zoom = index.current.getClusterExpansionZoom(cluster_id);

                if (zoom <= 19) {
                    ev.latLng && map?.panTo(ev.latLng);
                    map?.setZoom(zoom);
                    return;
                }
            }

            if (selectedMarker === markerRef) {
                handleDetailDismiss();
                return;
            }

            handleDetailDismiss();

            const scheduleListState: ScheduleListState = {venueIds: [], schedulesCount: 0};
            for (const venue of venues) {
                scheduleListState.venueIds.push(venue.id);
                scheduleListState.schedulesCount += venue.schedules.length;
            }

            if (markerRef) {
                setSelectedMarker(markerRef);
                setShowSchedulesList(scheduleListState);
            }
        },
        [map, index, selectedMarker]
    );

    const handleMarkerClick = useCallback(
        (
            venueId: number,
            markerRef: google.maps.marker.AdvancedMarkerElement | null,
            ev: google.maps.MapMouseEvent
        ) => {
            ev.stop();

            if (selectedMarker === markerRef) {
                handleDetailDismiss();
                return;
            }

            handleDetailDismiss();

            if (markerRef) {
                setSelectedMarker(markerRef);
                const venue = venues.find((venue) => venue.id === venueId);
                venue?.schedules.length === 1
                    ? setShowSmallDetail(venue.schedules[0].id)
                    : setShowSchedulesList({venueIds: [venueId], schedulesCount: venue?.schedules.length || 0});
            }
        },
        [venues, selectedMarker, handleDetailDismiss]
    );

    const handleIdle = useCallback(() => {
        if (boundsChanged) {
            map && setClusters(getClusters(index.current, map, venues));
            setBoundsChanged(false);
        }
    }, [map, venues, boundsChanged]);

    const handleBoundsChanged = useCallback(() => {
        setBoundsChanged(true);
    }, []);

    const toggleDetail = useCallback((scheduleId: number) => {
        setShowDetail((prev) => (prev ? null : scheduleId));
    }, []);

    const handleSmallDetailToggleDetail = useCallback(
        (scheduleId: number) => {
            setShowSmallDetail(null);
            setSelectedMarker(null);
            toggleDetail(scheduleId);
        },
        [toggleDetail]
    );

    return (
        <>
            {showDetail && <ScheduleDetail scheduleId={showDetail} onDismiss={toggleDetail} />}
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
                onBoundsChanged={handleBoundsChanged}
                onIdle={handleIdle}
                onClick={handleDetailDismiss}
                onDragstart={handleDetailDismiss}
                onZoomChanged={handleDetailDismiss}
            >
                {showSmallDetail && selectedMarker && (
                    <ScheduleDetailSmall
                        markerRef={selectedMarker}
                        scheduleId={showSmallDetail}
                        onDetailToggle={handleSmallDetailToggleDetail}
                    />
                )}
                {showSchedulesList && selectedMarker && (
                    <ScheduleList
                        venueIds={showSchedulesList.venueIds}
                        markerRef={selectedMarker}
                        onDetailToggle={toggleDetail}
                        scheduleSkeletonsCount={
                            showSchedulesList.schedulesCount > 5 ? 5 : showSchedulesList.schedulesCount
                        }
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
        </>
    );
}

export default function MapWrapper() {
    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!} region="CZ" language="cs">
            <Map />
        </APIProvider>
    );
}
