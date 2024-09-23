export function getFirstTagContent(htmlString: string) {
  // Parse the string into a DOM object
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  // Get the first element
  const firstElement = doc.body.firstElementChild;

  // Return the content of the first element if it exists
  return firstElement ? firstElement.textContent : null;
}
