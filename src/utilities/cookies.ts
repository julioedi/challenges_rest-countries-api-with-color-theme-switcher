// types/ParsedCookieParams.ts

export type ParsedValue = string | number | boolean | null | undefined;

export type ParsedCookieParams = {
  [key: string]: ParsedValue | ParsedCookieParams | ParsedValue[] | ParsedCookieParams[];
};



// A function to parse cookies
function parseCookies(): ParsedCookieParams {
  const cookies = document.cookie.split(';').map(cookie => cookie.trim());
  const result: ParsedCookieParams = {};

  cookies.forEach(cookie => {
    const [key, value] = cookie.split('=');
    if (key) {
      const decodedValue = decodeURIComponent(value);
      const parsedValue = tryParseJSON(decodedValue);
      assignCookieParam(result, key, parsedValue || decodedValue);
    }
  });

  return result;
}

const defaultCookies = parseCookies();
export {defaultCookies}

export {parseCookies};

// Try to parse a value as JSON if possible
function tryParseJSON(value: string): any {
  try {
    return JSON.parse(value);
  } catch (e) {
    return undefined;  // Return undefined if not valid JSON
  }
}

export {tryParseJSON}

interface cookieCurrent {
  [key: string | number]: any;
}

// Helper function to assign parsed values to the result
function assignCookieParam(
  obj: ParsedCookieParams,
  key: string,
  value: any
): void {
  const path: string[] = [];
  const regex = /([^[\]]+)|(\[\])/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(key))) {
    path.push(match[1] !== undefined ? match[1] : '');
  }

  // Ensure `current` is initialized as an object or array as needed
  let current: cookieCurrent = obj || {};

  // Traverse the path for nested keys
  for (let i = 0; i < path.length; i++) {
    const part = path[i];
    const nextPart = path[i + 1];

    if (i === path.length - 1) {
      // Final key, so assign the value
      if (part === '') {
        // Handle arrays
        if (!Array.isArray(current)) current = [];
        current.push(value);
      } else if (current[part] === undefined) {
        // Handle new key
        current[part] = value;
      } else if (Array.isArray(current[part])) {
        // Handle existing array
        current[part].push(value);
      } else {
        // Handle other types
        current[part] = [current[part], value];
      }
    } else {
      // Intermediate keys, handle arrays and objects
      if (part === '') {
        // If it's an empty part, initialize as array if needed
        if (!Array.isArray(current)) current = [];
        if (!current.length || typeof current[current.length - 1] !== 'object') {
          current.push({});
        }
        current = current[current.length - 1];
      } else {
        // Handle objects and arrays for further nesting
        if (current[part] === undefined || typeof current[part] !== 'object') {
          current[part] = nextPart === '' ? [] : {};
        }
        current = current[part];
      }
    }
  }
}

