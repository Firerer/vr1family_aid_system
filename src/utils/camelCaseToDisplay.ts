function splitCamelCase(string: string) {
  return string.replace(/([a-z])([A-Z])/g, "$1 $2");
}

function captializeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function camelCaseToDisplay(camelCase: string): string {
  return captializeFirstLetter(splitCamelCase(camelCase));
}
