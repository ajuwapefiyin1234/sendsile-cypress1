import { jwtDecode } from 'jwt-decode';
import {
  Canada,
  Nig,
  UK,
  USA,
  meat,
  oilSpices,
  fruits,
  drinks,
  foodstuff,
  DefaultImage,
} from '../assets/images';
import dayjs from 'dayjs';
import { axiosPrivate } from '../services/axios';

export const getProvider = (state: number) => {
  switch (state) {
    case 0:
      return 'MTN Direct Top-up';

    case 1:
      return 'Airtel Airtime Recharge';

    case 2:
      return 'Glo Mobile Recharge';

    case 3:
      return '9mobile Direct Top-up';
  }
};

export const priceFormatter = (price: number, count?: number) => {
  return new Intl.NumberFormat('en-NG', {
    currency: 'NGN',
    style: 'currency',
    maximumFractionDigits: count || 0,
    minimumFractionDigits: count || 0,
  }).format(price);
};

export const FormatCurrency = (value: number) => {
  return `₦${new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}`;
};

export function getProducts(id: string) {
  const slug = id.toLowerCase();
  if (slug === 'soup ingredients') {
    return 0;
  } else if (slug === 'meat, poultry seafood') {
    return 1;
  } else if (slug === 'oil and spices') {
    return 2;
  } else if (slug === 'fruits') {
    return 3;
  } else if (slug === 'drinks beverages') {
    return 4;
  } else {
    return 5;
  }
}

export const showCountryFlag = (location: string) => {
  switch (location) {
    case 'nigeria':
      return Nig;

    case 'canada':
      return Canada;

    case 'usa':
      return USA;

    case 'uk':
      return UK;

    default:
      return Nig;
  }
};

export const chipStatusColor = (status: string) => {
  const statusNew = status.toLowerCase();
  switch (statusNew) {
    case 'successful':
    case 'shipped':
      return {
        bg: 'bg-[#4712B7]',
        text: 'text-[#30027A]',
      };

    case 'processing':
      return {
        bg: 'bg-[#F2C31B]',
        text: 'text-[#BC8034]',
      };
    case 'pending':
    case 'partly paid':
    case 'incomplete':
      return {
        bg: 'bg-[#E4702E]',
        text: 'text-[#993955]',
      };

    default:
      return {
        bg: 'bg-[#12B76A]',
        text: 'text-[#027A48]',
      };
  }
};

export function statusStyling(statusText: string) {
  const statusNew = statusText.toLowerCase();
  switch (statusNew) {
    case 'pending':
      return true;
    case 'processing':
      return true;
    case 'shipped':
      return true;
    case 'delivered':
      return true;
  }
}

export const extractCharacter = (name: string) => {
  if (!name) {
    return 'OO';
  }
  const splitName = name.split(' ');
  if (splitName?.length > 1) {
    const firstChar = splitName[0].charAt(0);
    const secondeChar = splitName[1].charAt(0);
    const combinedCharacter = firstChar + secondeChar;
    return combinedCharacter.toUpperCase();
  } else {
    return name.substring(0, 2).toUpperCase();
  }
};

export const getTokenExpiry = (token: string) => {
  if (token == null || token === '') {
    return true;
  }
  const decodedToken = jwtDecode(token);
  const expirationTime = decodedToken.exp! * 1000;
  const currentTime = Date.now();
  const tokenExpired = currentTime > expirationTime;
  return tokenExpired;
};

export const isLoggedIn = () => {
  const accessToken = localStorage.getItem('__user_access')
    ? localStorage.getItem('__user_access')
    : null;
  if (accessToken) {
    return true;
  } else {
    return false;
  }
};

export function formatDate(date: string | Date): string {
  if (date === null) return date;
  return dayjs(date).format('YYYY-MM-DD');
}

export const extractFirstName = (name: string) => {
  const nameList = name.split(' ');

  if (nameList?.length === 1) return nameList[0];
  else if (nameList?.length > 1) {
    return nameList[0];
  } else {
    return name;
  }
};

export function extractSvg(svgString: string) {
  if (svgString === '') return '';
  let cleaned = svgString.replace(/<\?xml[^>]+\?>/, '');

  // Remove surrounding quotation marks if present
  cleaned = cleaned.replace(/^["']|["']$/g, '');
  return cleaned.trim();
}

export async function extractCategoryID() {
  const res = await axiosPrivate.get('/categories');
  return res?.data?.data[0];
}

export const logoutUser = async (navigate: any) => {
  await axiosPrivate.get('/logout');
  localStorage.clear();
  sessionStorage.clear();
  navigate('/login');
  window.location.reload();
};

export function extractEmail(text: string, visibleChars: number) {
  const textLength = text?.length;
  if (text?.length > visibleChars) {
    const extractChar = text.substring(0, visibleChars);
    const hiddenText = '*'.repeat(textLength - visibleChars);
    return extractChar + hiddenText;
  } else {
    return text;
  }
}

export const formatText = (text: string) => {
  if (text === 'most_popular') return 'Most Popular';
  else if (text === 'least_popular') return 'Least Popular';
  else '';
};

export const returnCategoryImg = (name: string) => {
  switch (name) {
    case 'Foodstuff':
      return foodstuff;
    case 'Oil and spices':
      return oilSpices;
    case 'Fruits & Vegetables':
      return fruits;
    case 'Drinks & beverages':
      return drinks;
    case 'Meat, poultry & seafood':
      return meat;

    default:
      return DefaultImage;
      break;
  }
};

export const capitalizeFirstChar = (word: string) => {
  if (!word) return '';
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export const getGreeting = () => {
  const currentHour = new Date().getHours();

  if (currentHour < 12) {
    return 'Good morning';
  } else if (currentHour < 18) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
  // else {
  //     return "Good night";
  // }
};

export const convertNairaToUSD = async (
  amountInNaira: number
): Promise<{ amountInUSD: number; conversionRate: number }> => {
  try {
    // const response = await fetch(
    //   `https://v6.exchangerate-api.com/v6/e56870bb4ad88f5a6c836b49/latest/NGN`
    // );
    // const data = await response.json();

    // if (data.result === "error") {
    //   throw new Error(data["error-type"]);
    // }

    // const usdRate = data.conversion_rates.USD;
    const usdRate = 0.00067;
    const amountInUSD = (amountInNaira * usdRate).toFixed(2);

    return {
      amountInUSD: parseFloat(amountInUSD),
      conversionRate: usdRate,
    };
  } catch (error) {
    console.error('Currency conversion failed:', error);
    throw error;
  }
};
