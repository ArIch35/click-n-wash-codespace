/**
 * Parses the entity to convert string dates to Date objects
 * @param entity The entity to parse
 * @returns The parsed entity
 */
const entityParser = <T>(entity: T): T => {
  const parsedEntity: Partial<Record<keyof T, unknown>> = { ...entity };
  Object.keys(parsedEntity).forEach((key) => {
    const value = parsedEntity[key as keyof T];
    if (typeof value === 'string' && !isNaN(Date.parse(value))) {
      parsedEntity[key as keyof T] = new Date(value);
    }
  });
  return parsedEntity as T;
};

export default entityParser;
