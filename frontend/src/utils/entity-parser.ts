/**
 * Checks if a string is a valid ISO 8601 date string.
 * @param s The string to be checked.
 * @returns True if the string is a valid ISO 8601 date string, false otherwise.
 */
const isISO8601DateString = (s: string) => {
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  return regex.test(s);
};

/**
 * Parses an entity object or array of entities by converting string values that represent dates into Date objects recursively.
 *
 * @param entity - The entity object or array of entities to be parsed.
 * @returns The parsed entity object or array of entities.
 */
const entityParser = <T>(entity: T): T => {
  // If it an array, then return array of parsed entity
  if (Array.isArray(entity)) {
    return entity.map((item: unknown) => entityParser(item)) as unknown as T;
  }

  // If it is an object, then parse it
  const parsedEntity: Partial<Record<keyof T, unknown>> = { ...entity };

  // Loop through the properties of the object
  Object.keys(parsedEntity).forEach((key) => {
    const value = parsedEntity[key as keyof T];

    if (typeof value === 'string' && isISO8601DateString(value)) {
      // If the value is a string that represents a date, then convert it to a Date object
      parsedEntity[key as keyof T] = new Date(value);
    } else if (typeof value === 'object' && value !== null) {
      // If the value is an object, then parse it recursively
      parsedEntity[key as keyof T] = entityParser(value);
    } else if (Array.isArray(value)) {
      // If the value is an array, then parse it recursively
      parsedEntity[key as keyof T] = value.map((item: unknown) => entityParser(item));
    }
  });
  return parsedEntity as T;
};

export default entityParser;
