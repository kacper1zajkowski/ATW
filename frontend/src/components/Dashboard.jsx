import { SkeletonTile } from './SkeletonTile';
import { WeatherTile } from './tiles/WeatherTile';
import { AirQualityTile } from './tiles/AirQualityTile';
import { UVTile } from './tiles/UVTile';
import { ForecastTile } from './tiles/ForecastTile';
import { SatelliteTile } from './tiles/SatelliteTile';

export function Dashboard({ data }) {
  if (!data) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:[grid-auto-flow:row_dense] lg:grid-cols-6">
        <SkeletonTile className="lg:col-span-2" />
        <SkeletonTile className="lg:col-span-2" />
        <SkeletonTile className="lg:col-span-2" />
        <SkeletonTile className="md:col-span-2 lg:col-span-4" tall />
        <SkeletonTile className="lg:col-span-2" tall />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:[grid-auto-flow:row_dense] lg:grid-cols-6">
      <div className="lg:col-span-2">
        <WeatherTile current={data.current} location={data.location} index={0} />
      </div>
      <div className="lg:col-span-2">
        <AirQualityTile airQuality={data.air_quality} index={1} />
      </div>
      <div className="lg:col-span-2">
        <UVTile uv={data.uv} index={2} />
      </div>
      <div className="md:col-span-2 lg:col-span-4">
        <ForecastTile forecast={data.forecast} summary={data.forecast_summary} index={3} />
      </div>
      <div className="lg:col-span-2">
        <SatelliteTile location={data.location} index={4} />
      </div>
    </div>
  );
}
