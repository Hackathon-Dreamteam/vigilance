import Map, { Source, Layer, FullscreenControl, NavigationControl, Marker, MapRef } from 'react-map-gl';
import { HeatmapType, heatmapLayer } from './HeatmapLayer';
import { useAppStore } from '../../../state/useAppStore';
import { Badge } from 'flowbite-react';
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi';
import { map, uniq } from 'lodash';
import { HiMapPin } from 'react-icons/hi2';
import { ComponentProps, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MapInfowindow from './MapInfowindow';
import mapboxgl from 'mapbox-gl';
import type { Point } from 'geojson/index';
import useSupercluster, { UseSuperclusterArgument } from 'use-supercluster';
import { PointFeature } from 'supercluster';
import { theme } from 'twin.macro';

interface ClusterEntry {
  observationId: string;
}

export interface Cluster extends ClusterEntry {
  observationIds?: string[];
}

const PITCH = 55;
const mapboxAccessToken = import.meta.env.VITE_MAPBOX_API_KEY;

const DashboardMap: ReactFC = () => {
  const {
    computed: { filteredObservations }
  } = useAppStore();

  const [popupInfo, setPopupInfo] = useState<Cluster>();
  const [zoom, setZoom] = useState(11);
  const [bounds, setBounds] = useState<mapboxgl.LngLatBounds>();
  const [points, setPoints] = useState<PointFeature<ClusterEntry>[]>([]);

  // Map reference to update viewport if the data change
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    // Wait a little bit for the map zoom animation to finish before recomputing points to prevent lag
    const timeoutId = setTimeout(() => {
      setPoints(
        filteredObservations.map(x => ({
          type: 'Feature',
          properties: {
            observationId: x.observationId
          },
          geometry: { type: 'Point', coordinates: [x.geoLocation.longitude, x.geoLocation.latitude] }
        }))
      );
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [filteredObservations]);

  const reduce = useCallback((cluster: Cluster, entry: ClusterEntry) => {
    cluster.observationIds = uniq([...(cluster.observationIds ?? []), entry.observationId]);
    return cluster;
  }, []);

  const clusterOptions: UseSuperclusterArgument<ClusterEntry, Cluster> = useMemo(
    () => ({
      points,
      bounds: bounds && [bounds.getNorthWest().lng, bounds.getSouthEast().lat, bounds.getSouthEast().lng, bounds.getNorthWest().lat],
      zoom,
      options: {
        radius: 40,
        maxZoom: 30,
        reduce
      }
    }),
    [bounds, points, reduce, zoom]
  );

  const { clusters } = useSupercluster(clusterOptions);

  const fitMapBoundsToObservations = useCallback(() => {
    // Calculate max viewport
    const coordinates = filteredObservations.map(obs => obs.geoLocation).filter(obs => !!obs?.latitude && !!obs.longitude);

    if (Array.isArray(coordinates) && coordinates.length > 0) {
      // Create a 'LngLatBounds' with both corners at the first coordinate.
      const bounds = new mapboxgl.LngLatBounds(
        { lat: coordinates[0].latitude, lng: coordinates[0].longitude },
        { lat: coordinates[0].latitude, lng: coordinates[0].longitude }
      );

      // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
      for (const coord of coordinates) {
        bounds.extend({ lat: coord.latitude, lng: coord.longitude });
      }

      setBounds(bounds);

      // Fit to bounds and keep pitch
      mapRef.current?.fitBounds(bounds, { padding: 20, duration: 2000, pitch: PITCH, maxZoom: 16 });
    }
  }, [filteredObservations]);

  useEffect(() => {
    setPopupInfo(undefined);
    fitMapBoundsToObservations();
  }, [filteredObservations, fitMapBoundsToObservations]);

  const options: ComponentProps<typeof Map> = useMemo(
    () => ({
      ref: mapRef,
      mapboxAccessToken,
      mapLib: mapboxgl,
      initialViewState: {
        longitude: -73.75,
        latitude: 45.57,
        zoom,
        pitch: PITCH
      },
      onZoom: zoom => {
        setPopupInfo(undefined);
        setZoom(zoom.viewState.zoom);
      },
      style: { width: '100%', height: '100vh' },
      mapStyle: 'mapbox://styles/felixlechat21/cltltffsh00xw01qpceyi4h9l',
      // mapStyle: 'mapbox://styles/felixlechat21/cltq1jquf03ev01p0gbpue33d',
      doubleClickZoom: false,
      touchZoomRotate: false,
      touchPitch: false,
      boxZoom: false,
      // Prevent rorate on mouse drag
      dragRotate: false,
      terrain: { source: 'mapbox-dem', exaggeration: 5 },
      onLoad: fitMapBoundsToObservations,
      onMove: () => setPopupInfo(undefined),
      // Limits to +- Quebec
      maxBounds: [
        [-79.5031, 44.7499], // Southwest coordinates
        [-57.8113, 53.2532] // Northeast coordinates
      ]
    }),
    [fitMapBoundsToObservations, zoom]
  );

  const isPrecariousPoints: Point[] = useMemo(
    () =>
      filteredObservations
        .filter(observation => observation.isPrecarious)
        .map(observation => {
          return {
            type: 'Point',
            coordinates: [observation.geoLocation.longitude, observation.geoLocation.latitude]
          };
        }),
    [filteredObservations]
  );

  const isInvasivePoints: Point[] = useMemo(
    () =>
      filteredObservations
        .filter(observation => observation.isInvasive)
        .map(observation => {
          return {
            type: 'Point',
            coordinates: [observation.geoLocation.longitude, observation.geoLocation.latitude]
          };
        }),
    [filteredObservations]
  );

  return (
    <>
      <div>
        <Map {...options}>
          {/* Controls */}
          <FullscreenControl position="bottom-right" />
          <NavigationControl position="top-right" showCompass={false} visualizePitch={false} />

          <Source
            type="geojson"
            data={{
              type: 'GeometryCollection',
              geometries: isPrecariousPoints
            }}
          >
            <Layer {...heatmapLayer(HeatmapType.Precarious)} />
          </Source>
          <Source
            type="geojson"
            data={{
              type: 'GeometryCollection',
              geometries: isInvasivePoints
            }}
          >
            <Layer {...heatmapLayer(HeatmapType.Invasive)} />
          </Source>

          {/* Pin & Infowindow */}
          {map(clusters, (cluster, index) => {
            const [longitude, latitude] = cluster.geometry.coordinates;

            return (
              <Marker
                key={`marker-${index}`}
                longitude={longitude}
                latitude={latitude}
                anchor="bottom"
                onClick={e => {
                  e.originalEvent.stopPropagation();
                  setPopupInfo(cluster.properties);
                }}
              >
                <HiMapPin size={20} color={theme`colors.secondary`} cursor={'pointer'} />
              </Marker>
            );
          })}
          {popupInfo && <MapInfowindow cluster={popupInfo} observations={filteredObservations} setPopupInfo={setPopupInfo} />}

          {/* Terrain layer */}
          <Source id="mapbox-dem" type="raster-dem" url="mapbox://mapbox.mapbox-terrain-dem-v1" tileSize={512} maxzoom={14} />

          {/* TODO: Add custom overlay for parks */}
          {/* See: https://github.com/visgl/react-map-gl/blob/master/examples/custom-overlay/src/app.tsx */}
        </Map>
      </div>

      <div className="grid gap-2 grid-cols-3 place-items-center text-center">
        <div className="col-span-1 flex flex-col w-full">
          <Badge color="red" icon={HiOutlineQuestionMarkCircle}>
            Observation d'espèce invasive
          </Badge>
        </div>
        <div className="col-span-1 flex flex-col w-full">
          <Badge color="blue" icon={HiOutlineQuestionMarkCircle}>
            Observation d'espèce précaire
          </Badge>
        </div>
      </div>
    </>
  );
};

export default DashboardMap;
