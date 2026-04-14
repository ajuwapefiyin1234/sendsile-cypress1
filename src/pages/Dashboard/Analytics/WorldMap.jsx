import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  ComposableMap,
  Geographies,
  Geography,
  //   Sphere,
  //   Graticule,
  Marker,
} from 'react-simple-maps';
import TOPOLOGY from '../../../utils/features.json';

const LocationMarker = ({ coordinates, userCount }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <Marker coordinates={coordinates}>
      <circle
        r={5}
        fill="orange"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
      {hovered && (
        <text
          textAnchor="middle"
          y={-10}
          style={{ fontFamily: 'system-ui', fill: '#5D5A6D', fontSize: '10px' }}
        >
          {userCount}
        </text>
      )}
    </Marker>
  );
};

LocationMarker.propTypes = {
  coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
  userCount: PropTypes.number.isRequired,
};

const buyingUsersLocation = [
  {
    id: 1,
    title: 'New York',
    subtitle: '780 Users',
    percent: '90%',
    coordinates: [-74.006, 40.7128],
    userCount: 780,
  },
  {
    id: 2,
    title: 'London',
    subtitle: '690 Users',
    percent: '85%',
    coordinates: [-0.1276, 51.5074],
    userCount: 690,
  },
  {
    id: 3,
    title: 'Tokyo',
    subtitle: '650 Users',
    percent: '82%',
    coordinates: [139.6917, 35.6895],
    userCount: 650,
  },
  {
    id: 4,
    title: 'Sydney',
    subtitle: '610 Users',
    percent: '80%',
    coordinates: [151.2093, -33.8688],
    userCount: 610,
  },
  {
    id: 5,
    title: 'Mumbai',
    subtitle: '580 Users',
    percent: '78%',
    coordinates: [72.8777, 19.076],
    userCount: 580,
  },
  {
    id: 6,
    title: 'Dubai',
    subtitle: '550 Users',
    percent: '75%',
    coordinates: [55.2708, 25.2048],
    userCount: 550,
  },
  {
    id: 7,
    title: 'Paris',
    subtitle: '520 Users',
    percent: '72%',
    coordinates: [2.3522, 48.8566],
    userCount: 520,
  },
  {
    id: 8,
    title: 'Sao Paulo',
    subtitle: '490 Users',
    percent: '70%',
    coordinates: [-46.6333, -23.5505],
    userCount: 490,
  },
  {
    id: 9,
    title: 'Lagos',
    subtitle: '460 Users',
    percent: '68%',
    coordinates: [3.3792, 6.5244],
    userCount: 460,
  },
  {
    id: 10,
    title: 'Moscow',
    subtitle: '430 Users',
    percent: '65%',
    coordinates: [37.6173, 55.7558],
    userCount: 430,
  },
  {
    id: 11,
    title: 'Berlin',
    subtitle: '400 Users',
    percent: '62%',
    coordinates: [13.405, 52.52],
    userCount: 400,
  },
  {
    id: 12,
    title: 'Istanbul',
    subtitle: '390 Users',
    percent: '60%',
    coordinates: [28.9784, 41.0082],
    userCount: 390,
  },
  {
    id: 13,
    title: 'Toronto',
    subtitle: '370 Users',
    percent: '58%',
    coordinates: [-79.3832, 43.6532],
    userCount: 370,
  },
  {
    id: 14,
    title: 'Rome',
    subtitle: '360 Users',
    percent: '55%',
    coordinates: [12.4964, 41.9028],
    userCount: 360,
  },
  {
    id: 15,
    title: 'Buenos Aires',
    subtitle: '350 Users',
    percent: '53%',
    coordinates: [-58.3838, -34.6037],
    userCount: 350,
  },
  {
    id: 16,
    title: 'Mexico City',
    subtitle: '340 Users',
    percent: '50%',
    coordinates: [-99.1332, 19.4326],
    userCount: 340,
  },
  {
    id: 17,
    title: 'Jakarta',
    subtitle: '330 Users',
    percent: '48%',
    coordinates: [106.8456, -6.2088],
    userCount: 330,
  },
  {
    id: 18,
    title: 'Seoul',
    subtitle: '320 Users',
    percent: '45%',
    coordinates: [126.978, 37.5665],
    userCount: 320,
  },
  {
    id: 19,
    title: 'Kuala Lumpur',
    subtitle: '310 Users',
    percent: '43%',
    coordinates: [101.6869, 3.139],
    userCount: 310,
  },
  {
    id: 20,
    title: 'Singapore',
    subtitle: '300 Users',
    percent: '40%',
    coordinates: [103.8198, 1.3521],
    userCount: 300,
  },
  {
    id: 21,
    title: 'Athens',
    subtitle: '290 Users',
    percent: '38%',
    coordinates: [23.8103, 37.9838],
    userCount: 290,
  },
  {
    id: 22,
    title: 'Vienna',
    subtitle: '280 Users',
    percent: '35%',
    coordinates: [16.3738, 48.2082],
    userCount: 280,
  },
  {
    id: 23,
    title: 'Cairo',
    subtitle: '270 Users',
    percent: '33%',
    coordinates: [31.2357, 30.0444],
    userCount: 270,
  },
  {
    id: 24,
    title: 'Lisbon',
    subtitle: '260 Users',
    percent: '30%',
    coordinates: [-9.1399, 38.7223],
    userCount: 260,
  },
  {
    id: 25,
    title: 'Stockholm',
    subtitle: '250 Users',
    percent: '28%',
    coordinates: [18.0686, 59.3293],
    userCount: 250,
  },
  {
    id: 26,
    title: 'Oslo',
    subtitle: '240 Users',
    percent: '25%',
    coordinates: [10.7522, 59.9139],
    userCount: 240,
  },
  {
    id: 27,
    title: 'Zurich',
    subtitle: '230 Users',
    percent: '22%',
    coordinates: [8.5417, 47.3769],
    userCount: 230,
  },
  {
    id: 28,
    title: 'Helsinki',
    subtitle: '220 Users',
    percent: '20%',
    coordinates: [24.941, 60.1699],
    userCount: 220,
  },
  {
    id: 29,
    title: 'Budapest',
    subtitle: '210 Users',
    percent: '18%',
    coordinates: [19.0402, 47.4979],
    userCount: 210,
  },
  {
    id: 30,
    title: 'Warsaw',
    subtitle: '200 Users',
    percent: '15%',
    coordinates: [21.0122, 52.2298],
    userCount: 200,
  },
  {
    id: 31,
    title: 'Prague',
    subtitle: '190 Users',
    percent: '13%',
    coordinates: [14.4208, 50.088],
    userCount: 190,
  },
  {
    id: 32,
    title: 'Brussels',
    subtitle: '180 Users',
    percent: '10%',
    coordinates: [4.8357, 50.8503],
    userCount: 180,
  },
  {
    id: 33,
    title: 'Dublin',
    subtitle: '170 Users',
    percent: '8%',
    coordinates: [-6.2603, 53.3497],
    userCount: 170,
  },
  {
    id: 34,
    title: 'Edinburgh',
    subtitle: '160 Users',
    percent: '7%',
    coordinates: [-3.1883, 55.9533],
    userCount: 160,
  },
  {
    id: 35,
    title: 'Bucharest',
    subtitle: '150 Users',
    percent: '6%',
    coordinates: [26.1025, 44.4268],
    userCount: 150,
  },
  {
    id: 36,
    title: 'Sofia',
    subtitle: '140 Users',
    percent: '5%',
    coordinates: [23.3219, 42.6977],
    userCount: 140,
  },
  {
    id: 37,
    title: 'Belgrade',
    subtitle: '130 Users',
    percent: '4%',
    coordinates: [20.4489, 44.8176],
    userCount: 130,
  },
  {
    id: 38,
    title: 'Zagreb',
    subtitle: '120 Users',
    percent: '3%',
    coordinates: [15.9819, 45.815],
    userCount: 120,
  },
  {
    id: 39,
    title: 'Ljubljana',
    subtitle: '110 Users',
    percent: '3%',
    coordinates: [14.5051, 46.0511],
    userCount: 110,
  },
  {
    id: 40,
    title: 'Podgorica',
    subtitle: '100 Users',
    percent: '2%',
    coordinates: [19.2636, 42.4411],
    userCount: 100,
  },
  {
    id: 41,
    title: 'Tirana',
    subtitle: '90 Users',
    percent: '2%',
    coordinates: [19.8189, 41.3275],
    userCount: 90,
  },
  {
    id: 42,
    title: 'Skopje',
    subtitle: '80 Users',
    percent: '1%',
    coordinates: [21.4254, 41.9981],
    userCount: 80,
  },
  {
    id: 43,
    title: 'Chisinau',
    subtitle: '70 Users',
    percent: '1%',
    coordinates: [28.8575, 47.0105],
    userCount: 70,
  },
  {
    id: 44,
    title: 'Vilnius',
    subtitle: '60 Users',
    percent: '1%',
    coordinates: [25.2798, 54.6872],
    userCount: 60,
  },
  {
    id: 45,
    title: 'Riga',
    subtitle: '50 Users',
    percent: '1%',
    coordinates: [24.1059, 56.9496],
    userCount: 50,
  },
  {
    id: 46,
    title: 'Tallinn',
    subtitle: '40 Users',
    percent: '1%',
    coordinates: [24.7535, 59.437],
    userCount: 40,
  },
  {
    id: 47,
    title: 'Minsk',
    subtitle: '30 Users',
    percent: '1%',
    coordinates: [27.5615, 53.9006],
    userCount: 30,
  },
  {
    id: 48,
    title: 'Kyiv',
    subtitle: '20 Users',
    percent: '1%',
    coordinates: [30.5236, 50.4501],
    userCount: 20,
  },
  {
    id: 49,
    title: 'Baku',
    subtitle: '10 Users',
    percent: '1%',
    coordinates: [49.893, 40.3772],
    userCount: 10,
  },
  {
    id: 50,
    title: 'Yerevan',
    subtitle: '5 Users',
    percent: '1%',
    coordinates: [44.5161, 40.1772],
    userCount: 5,
  },
];

const WorldMap = () => {
  // Sort locations by user count and get top 4 for the legend
  const topLocations = [...buyingUsersLocation]
    .sort((a, b) => b.userCount - a.userCount)
    .slice(0, 4);

  return (
    <div className="flex flex-col items-start bg-white rounded-[16px] w-full h-full">
      <header className="flex items-center py-3 px-6">
        <h3 className="font-medium text-[18px] leading-[25px] text-[#343C6A]">
          Top Buying User&apos;s Location
        </h3>
      </header>
      <div className="flex justify-center items-center p-5 gap-2.5 bg-white rounded-[25px] w-full">
        <div className="flex flex-col items-center gap-2.5 w-full">
          <div className="w-full h-[132px]">
            <ComposableMap
              projectionConfig={{
                scale: 140,
                rotation: [-11, 0, 0],
              }}
              height={350}
              style={{ width: '100%', height: 'auto' }}
            >
              {/* <Sphere stroke="#000" strokeWidth={0.5} /> */}
              {/* <Graticule stroke="#000" strokeWidth={0.5} /> */}
              <Geographies geography={TOPOLOGY}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#EAEAEC"
                      stroke="#D6D6DA"
                      strokeWidth={0.5}
                    />
                  ))
                }
              </Geographies>
              {buyingUsersLocation.map((location) => (
                <LocationMarker
                  key={location.id}
                  coordinates={location.coordinates}
                  userCount={location.userCount}
                />
              ))}
            </ComposableMap>
          </div>
          <div className="flex flex-col items-start gap-[15px] w-full">
            {topLocations.map((location, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-0 gap-[15px] w-full"
              >
                <div className="flex justify-between w-full items-center h-[14px] ">
                  <p className="font-medium text-[12px] leading-[14px] text-[#343A40]">
                    {location.title}
                  </p>
                  <p className="font-medium text-[12px] leading-[14px] text-[#868E96]">
                    {location.subtitle}
                  </p>
                </div>
                <div className="w-full h-[10px] bg-[#F5F5F5] flex items-center">
                  <div
                    style={{ width: location.percent }}
                    className="h-full bg-[#FFA900] rounded-[5px]"
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

WorldMap.propTypes = {
  // Add any props here if needed
};

export default WorldMap;
