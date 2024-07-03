import {Validators} from "@angular/forms";
import {delay, mergeMap, Observable, of, retryWhen, throwError} from "rxjs";
import {HttpErrorResponse, HttpParams} from "@angular/common/http";
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_BACKOFF = 1000;

export const EmailValidation = [Validators.required, Validators.email];

export const PasswordValidation = [
  Validators.required,
  Validators.minLength(8),
  Validators.maxLength(24),
];

function buildFormData(formData, data, parentKey?) {
  if (
    data &&
    typeof data === 'object' &&
    !(data instanceof Date) &&
    !(data instanceof File)
  ) {
    Object.keys(data).forEach((key) => {
      buildFormData(
        formData,
        data[key],
        parentKey ? `${parentKey}[${key}]` : key
      );
    });
  } else {
    const value = data == null ? '' : data;

    formData.append(parentKey, value);
  }
}

export function jsonToFormData(data) {
  const formData = new FormData();

  buildFormData(formData, data);

  return formData;
}


const is_array = (value): boolean =>
  Object.prototype.toString.call(value) === '[object Array]';

const is_object = (value): boolean =>
  Object.prototype.toString.call(value) === '[object Object]';

export const isEmptyArray = (value): boolean =>
  (is_array(value) && JSON.stringify(value) === '[]') ||
  value === undefined ||
  value === null ||
  value.length === 0;

export const isEmptyObject = (value): boolean =>
  (is_object(value) && JSON.stringify({ ...value }) === '{}') ||
  value === undefined ||
  value === null ||
  Object.keys({ ...value }).length === 0;

export const isEmptyString = (str): boolean =>
  str === undefined ||
  str === null ||
  String(str).trimStart().trimEnd().match(/^ *$/) !== null;

export const capitalize_words = (word: string) => {
  return !isEmptyString(word)
    ? word
      .toLocaleLowerCase()
      .split(' ')
      .map((str) => str[0].toLocaleUpperCase() + str.substring(1))
      .join(' ')
    : word;
};

export const getObjectPropertyValue = <T>(
  targetObj: T,
  keys: string[],
  lowerCased = false
): any => {
  if (!isEmptyObject(targetObj) && !isEmptyArray(keys)) {
    const property = [...keys]
      .filter((key) => !isEmptyString(key))
      .reduce(
        (previousObject: T, key: string) =>
          // provided targetObj is the starting point during execution of previousObject.
          previousObject[key],
        // initial value.
        targetObj
      );

    switch (typeof property) {
      case 'object': {
        return !isEmptyObject(property) ? property : property;
      }

      case 'string': {
        const propAsString = String(property).trimStart().trimEnd();

        return lowerCased ? propAsString.toLocaleLowerCase() : propAsString;
      }

      case 'number': {
        return Number(property);
      }

      default:
        return property;
    }
  }

  return targetObj;
};

export const parse_html_string = (html_String: string) => {
  // Create a new DOM parser
  const parser = new DOMParser();

  // Parse the HTML string into a Document object
  return parser.parseFromString(html_String, 'text/html');
};

export const genericRetryStrategy = ({
                                       delayMs = 4000,
                                       maxRetryAttempts = DEFAULT_MAX_RETRIES,
                                       scalingDuration = DEFAULT_BACKOFF,
                                       allowedStatusCodes = [],
                                       toastFunc = null,
                                     }: {
  delayMs?: number;
  maxRetryAttempts?: number;
  scalingDuration?: number;
  allowedStatusCodes?: number[];
  toastFunc?: (...args) => void;
} = {}) => {
  let retries = maxRetryAttempts;

  return (src: Observable<any>) =>
    src.pipe(
      retryWhen((errors: Observable<HttpErrorResponse>) =>
        errors.pipe(
          mergeMap((error: HttpErrorResponse, i: number) => {
            const retryAttempt = i + 1;

            if (allowedStatusCodes.includes(error.status)) {
              // if maximum number of retries have been met,
              // return empty observable
              if (retryAttempt > maxRetryAttempts) {
                toastFunc(`Connection failed, Please try again later!`);

                return throwError(error);
              }

              if (retries-- > 0) {
                const backoffTime =
                  delayMs + (maxRetryAttempts - retries) * scalingDuration;

                toastFunc(`Connecting...`, 'Close', {
                  duration: backoffTime,
                  verticalPosition: 'top',
                });

                return of(error).pipe(delay(backoffTime));
              }
            }

            // if response is a status code we don't wish to retry, throw error
            return throwError(error);
          })
        )
      )
    );
};


/**
 * REF: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
 *
 * @param func is the intended function to be used as a callback.
 * @param targetObject is the object containing the target function.
 * generic type F is the return type of the target function.
 * generic type O is the type of the the target object.
 *
 * This function allows one to pass other functions contained in different classes as params.
 */
export const functionToObjectBinder = <F, O>({
                                               func = null,
                                               targetObject = null,
                                             }: {
  func?: (...args: unknown[]) => F;
  targetObject?: O;
} = {}): ((...args: unknown[]) => F) => {
  if (typeof func === 'function' && !!targetObject) {
    return func.bind(targetObject) as (...args: unknown[]) => F;
  }

  return null;
};

export const getHttpParams = (data: Map<string, string>): HttpParams => {
  if (data === undefined || data === null) {
    return new HttpParams();
  }

  let httpParams: HttpParams = new HttpParams();
  data.forEach((value: string, key: string) => {
    httpParams = httpParams.append(key, value);
  });
  return httpParams;
};
