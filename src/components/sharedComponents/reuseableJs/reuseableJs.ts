export const generateRandomString = (): string => {
  const numbers: string = '0123456789';
  const alphabets: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let randomString: string = '';

  // Add four random numbers
  for (let i = 0; i < 4; i++) {
    randomString += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  // Add two random alphabets
  for (let i = 0; i < 2; i++) {
    randomString += alphabets.charAt(Math.floor(Math.random() * alphabets.length));
  }

  return randomString;
};

export const generateRandomNumber = (length: number): string => {
  const numbers: string = '0123456789';
  let randomString: string = '';

  for (let i = 0; i < length; i++) {
    randomString += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  return randomString;
};
