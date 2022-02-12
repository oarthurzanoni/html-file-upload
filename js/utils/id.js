/**
 * Generates a random id.
 *
 * @returns A random id string
 */
export function genRandomId() {
  const randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const id = randLetter + Date.now();

  return id;
}
