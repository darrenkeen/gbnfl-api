export function makeId(length: number): string {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function slugify(str: string): string {
  str = str.trim();
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  const from = 'åàáãäâèéëêìíïîòóöôùúüûñç·/_,:;';
  const to = 'aaaaaaeeeeiiiioooouuuunc------';

  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  return str
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-') // collapse dashes
    .replace(/^-+/, '') // trim - from start of text
    .replace(/-+$/, '') // trim - from end of text
    .replace(/-/g, '_');
}

export const mapErrors = (errors: Object[]) => {
  const mappedErrors: any = {};
  errors.forEach((err: any) => {
    const key = err.property;
    const value = Object.entries(err.constraints)[0][1];
    mappedErrors[key] = value;
  });
  return errors.reduce((prev: any, err: any) => {
    prev[err.property] = Object.entries(err.constraints)[0][1];
    return prev;
  }, {});
};

export const intSafeCheck = (value: number) =>
  value > 2000000000 ? 4000 : value;

export const checkTruthyInARow = (array: any, length: number) => {
  let count = 0;

  return array.some((a: any) => {
    if (a !== true) {
      count = 0;
    }
    return ++count === length;
  });
};
