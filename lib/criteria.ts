import {
  hasMovesLeft,
  isNeighbouringTile,
} from '@civ-clone/core-unit/Rules/Action';
import City from '@civ-clone/core-city/City';
import CityRegistry from '@civ-clone/core-city/CityRegistry';
import Criterion from '@civ-clone/core-rule/Criterion';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';

/**
 * The criteria for planting a nuclear device in the city on `to`, in order: a neighbouring tile, moves left, a city of
 * another player on `to`, and `canPlant(unit, city)` (Civ2: a Spy, whose player knows Rocketry and
 * Nuclear Fission, once the Manhattan Project has been built anywhere). A rule set adds its own peace criteria after these.
 */
export const plantNuclearDeviceCriteria = (
  { cityRegistry }: { cityRegistry: CityRegistry },
  canPlant: (unit: Unit, city: City) => boolean
): Criterion[] => [
  isNeighbouringTile,
  hasMovesLeft,
  new Criterion((unit: Unit, to: Tile): boolean => {
    const city = cityRegistry.getByTile(to);

    return city !== null && city.player() !== unit.player();
  }),
  new Criterion((unit: Unit, to: Tile): boolean =>
    canPlant(unit, cityRegistry.getByTile(to) as City)
  ),
];

export default plantNuclearDeviceCriteria;
