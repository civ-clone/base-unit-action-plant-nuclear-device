import City from '@civ-clone/core-city/City';
import CityRegistry from '@civ-clone/core-city/CityRegistry';
import Criterion from '@civ-clone/core-rule/Criterion';
import Unit from '@civ-clone/core-unit/Unit';
/**
 * The criteria for planting a nuclear device in the city on `to`, in order: a neighbouring tile, moves left, a city of
 * another player on `to`, and `canPlant(unit, city)` (Civ2: a Spy, whose player knows Rocketry and
 * Nuclear Fission, once the Manhattan Project has been built anywhere). A rule set adds its own peace criteria after these.
 */
export declare const plantNuclearDeviceCriteria: (
  {
    cityRegistry,
  }: {
    cityRegistry: CityRegistry;
  },
  canPlant: (unit: Unit, city: City) => boolean
) => Criterion[];
export default plantNuclearDeviceCriteria;
