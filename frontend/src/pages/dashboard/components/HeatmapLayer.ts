import type { HeatmapLayer } from 'react-map-gl';

const MAX_ZOOM_LEVEL = 22;
export enum HeatmapType {
  Precarious = 'precarious',
  Invasive = 'invasive'
}

export const heatmapLayer = (type: HeatmapType): HeatmapLayer => {
  const color = (
    type == HeatmapType.Invasive
      ? [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0,
          'rgba(254,129,129,0)',
          0.2,
          'rgb(254,87,87)',
          0.4,
          'rgb(254,46,46)',
          0.6,
          'rgb(203,36,36)',
          0.8,
          'rgb(182,32,32)'
        ]
      : [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0,
          'rgba(236,222,239,0)',
          0.2,
          'rgb(208,209,230)',
          0.4,
          'rgb(166,189,219)',
          0.6,
          'rgb(103,169,207)',
          0.8,
          'rgb(28,144,153)'
        ]
  ) as mapboxgl.StyleFunction;
  return {
    id: `heatmap-${type}`,
    maxzoom: MAX_ZOOM_LEVEL,
    type: 'heatmap',
    paint: {
      // Increase the heatmap weight based on frequency and property magnitude
      'heatmap-weight': ['interpolate', ['linear'], ['get', 'mag'], 0, 0, 6, 1],
      // Increase the heatmap color weight weight by zoom level
      // heatmap-intensity is a multiplier on top of heatmap-weight
      'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, MAX_ZOOM_LEVEL, 3],
      // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
      // Begin color ramp at 0-stop with a 0-transparancy color
      // to create a blur-like effect.
      'heatmap-color': color,
      // Adjust the heatmap radius by zoom level
      'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, MAX_ZOOM_LEVEL, 15],
      // Transition from heatmap to circle layer by zoom level
      'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, MAX_ZOOM_LEVEL, 0.3]
    }
  };
};
