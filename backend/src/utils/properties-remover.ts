/**
 * Removes specified properties from an object.
 * If the object is an array, an error will be thrown.
 *
 * @template T - The type of the object.
 * @param {T} entity - The object from which properties will be removed.
 * @param {string[]} properties - The properties to be removed.
 * @returns {T} - The object with the specified properties removed.
 * @throws {Error} - If the object is an array or if a property is not an object.
 * @example propertyRemover({ a: { b: 1, c: 2 }, d: 3 }, ['a.b']) => { a: { c: 2 }, d: 3 }
 */
const propertiesRemover = <T>(entity: T, properties: string[]): T => {
  // If it an array, then throw an error
  if (Array.isArray(entity)) {
    throw new Error('Property remover does not support arrays.');
  }

  const parsedEntity: Partial<Record<keyof T, unknown>> = { ...entity };

  // Convert the properties to an array of paths
  const paths = properties.map((property) => property.split('.'));

  // Loop through the paths
  paths.forEach((path) => {
    // Each path should start from the original entity
    let currentEntity = parsedEntity;
    path.forEach((key, index) => {
      if (index === path.length - 1) {
        // Delete the property if it the last
        delete currentEntity[key as keyof T];
      } else {
        // Otherwise checks whether the property is an object and then go through it
        const property = currentEntity[key as keyof T];
        if (typeof property === 'object' && property !== null) {
          currentEntity = property as unknown as T;
        } else {
          throw new Error(`Property ${key} is not an object.`);
        }
      }
    });
  });
  return parsedEntity as T;
};

export default propertiesRemover;
