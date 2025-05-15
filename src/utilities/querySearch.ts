
function coerceType(value: string): any {
  const trimmed = value.trim();

  if (/^true$/i.test(trimmed)) return true;
  if (/^false$/i.test(trimmed)) return false;
  if (/^null$/i.test(trimmed)) return null;
  if (/^undefined$/i.test(trimmed)) return undefined;
  if (!isNaN(Number(trimmed)) && trimmed !== '') return Number(trimmed);

  return decodeURIComponent(trimmed);
}

export {coerceType};

function searchParams<T = Record<string, any>>(url: string): T {
    const search = url.includes('?') ? url.split('?')[1] : url;
    const params = new URLSearchParams(search);
    const result: Record<string, any> = {};

    for (const [key, value] of params.entries()) {
        assignNestedParam(result, key, coerceType(value));
    }

    return result as T;
}
export {searchParams}

function assignNestedParam(obj: any, key: string, value: any): void {
    const path: (string | number)[] = [];
    const regex = /([^[\]]+)|(\[\])/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(key))) {
        path.push(match[1] !== undefined ? match[1] : '');
    }

    let current = obj;
    for (let i = 0; i < path.length; i++) {
        const part = path[i];
        const nextPart = path[i + 1];

        if (i === path.length - 1) {
            if (part === '') {
                if (!Array.isArray(current)) current = [];
                current.push(value);
            } else if (current[part] === undefined) {
                current[part] = value;
            } else if (Array.isArray(current[part])) {
                current[part].push(value);
            } else {
                current[part] = [current[part], value];
            }
        } else {
            if (part === '') {
                if (!Array.isArray(current)) current = [];
                if (!current.length || typeof current[current.length - 1] !== 'object') {
                    current.push({});
                }
                current = current[current.length - 1];
            } else {
                if (current[part] === undefined || typeof current[part] !== 'object') {
                    current[part] = nextPart === '' ? [] : {};
                }
                current = current[part];
            }
        }
    }
}
export {assignNestedParam}
