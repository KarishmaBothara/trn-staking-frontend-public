import * as t from 'io-ts';

/**
 * Turns a metadata image URL into an optimised webp format using cloudimg.
 */
export function prepareOptimisedImageUrl(imageUrl: string): string {
  if (imageUrl.endsWith('.mp4') || imageUrl.endsWith('.MP4')) {
    return imageUrl;
  }

  const httpsImageUrl = imageUrl.startsWith('ipfs://')
    ? imageUrl.replace('ipfs://', 'https://ipfs.io/ipfs/')
    : imageUrl;
  const imageUrlWithoutHttps = httpsImageUrl.replace('https://', '');
  const optimisedImageUrl = `https://autbcmlsgr.cloudimg.io/${imageUrlWithoutHttps}`;
  return optimisedImageUrl;
}

export const challengeModalDateFormat = (date: Date): string => {
  const suffixes = new Map<string, string>([
    ['1', 'st'],
    ['2', 'nd'],
    ['3', 'rd'],
  ]);
  const day = date.getDate();

  const suffix = suffixes.get(day.toString().slice(-1)) || 'th';

  const formattedDate = date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return formattedDate.replace(/\b(\d{1,2})\b/g, '$1' + suffix).replace(',', '');
};

// TODO: assetLocation should be string | address
export function isAssetOfCollection(collectionAddress: string) {
  return function (collectionId?: string) {
    return function (assetLocation: string) {
      // TODO: we should use a better form, like addressEquals
      return (
        assetLocation.toLowerCase() === collectionId?.toLowerCase() ||
        assetLocation.toLowerCase() === collectionAddress.toLowerCase()
      );
    };
  };
}

export function toJSONString<A>(type: t.Encoder<A, unknown>, input: A): string {
  return JSON.stringify(type.encode(input));
}

export function fromJSONString<A>(
  type: t.Decoder<unknown, A>,
  input: string,
  ctx: t.Context = []
): t.Validation<A> {
  let json: unknown;
  try {
    json = JSON.parse(input);
  } catch (e) {
    return t.failure(input, ctx, 'Invalid JSON');
  }
  return type.decode(json);
}

export function numericLocalize(
  digits: string | number,
  options?: Intl.NumberFormatOptions
): string {
  let locale = 'en-US';

  if (typeof window !== 'undefined') {
    locale = window.navigator.language;
  }
  if (isNaN(Number(digits))) {
    return '0';
  }
  return Number(digits).toLocaleString(locale, options);
}

export function truncateAddress(address?: string): string {
  if (address == null) {
    return '';
  }

  return address.substring(0, 6) + '...' + address.substring(address.length - 4, address.length);
}

export function hush<T>(result: t.Validation<T>): T | null {
  return result._tag === 'Right' ? result.right : null;
}
