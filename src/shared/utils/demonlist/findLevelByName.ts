import type { DemonlistLevel } from '@/shared/api/getDemonList';

export function findLevelByName(
  levels: DemonlistLevel[],
  levelName: string
): DemonlistLevel | null {
  return (
    levels.find(
      (level) => level.name.toLowerCase() === levelName.toLowerCase()
    ) || null
  );
}
