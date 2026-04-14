import images from "@/assets/images";

export const accessTTL = 60 * 60 * 1000; // 1 hour
export const refreshTTL = 7 * 24 * 60 * 60 * 1000; // 1 week

export const formatDate = (date) => {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
  const yyyy = date.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
};

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export const convertDate = (date, yearFirst = false) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const pad = (num) => (num < 10 ? `0${num}` : num);

  if (yearFirst) {
    return `${year}-${pad(month)}-${pad(day)} ${pad(hours)}:${pad(
      minutes
    )}:${pad(seconds)}`;
  }
  return `${pad(day)}-${pad(month)}-${year} ${pad(hours)}:${pad(minutes)}:${pad(
    seconds
  )}`;
};

export function generateTextColor() {
  const r = Math.floor(Math.random() * 64); // Darker range 0-63
  const g = Math.floor(Math.random() * 64); // Darker range 0-63
  const b = Math.floor(Math.random() * 64); // Darker range 0-63
  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export function generateBackgroundColor(textColor) {
  // Convert text color to RGB
  const r = parseInt(textColor.slice(1, 3), 16);
  const g = parseInt(textColor.slice(3, 5), 16);
  const b = parseInt(textColor.slice(5, 7), 16);

  // Determine luminance of text color
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Generate a random color with sufficient contrast
  const minContrast = 0.5; // Adjust as needed, 0.5 is a good starting point
  let newColor;
  do {
    const newR = Math.floor(Math.random() * 96) + 160; // Generate a light color component (160 to 255)
    const newG = Math.floor(Math.random() * 96) + 160;
    const newB = Math.floor(Math.random() * 96) + 160;
    newColor = `#${newR.toString(16).padStart(2, "0")}${newG
      .toString(16)
      .padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
    const newLuminance = (0.299 * newR + 0.587 * newG + 0.114 * newB) / 255; // Calculate luminance of new color
    var contrast =
      newLuminance > luminance
        ? (newLuminance + 0.05) / (luminance + 0.05)
        : (luminance + 0.05) / (newLuminance + 0.05); // Calculate contrast ratio
  } while (contrast < minContrast); // Loop until contrast is sufficient

  return newColor;
}

export function addCommasToNumber(number) {
  let numberStr = number.toString();
  numberStr = numberStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return numberStr;
}
export function maskId(id) {
    if (!id) return 'N/I';
  const firstPart = id.split('-')[0]; // Split the ID by '-' and return the first part
  return firstPart;
}

export const returnColor = (status) => {
  if (!status || typeof status !== 'string') {
    return {
      bg: 'transparent',
      text: '#000000',
    };
  }

  const statusNew = status.toLowerCase();
  switch (statusNew) {
    case 'successful':
    case 'fully paid':
    case 'paid':
    case 'enabled':
    case 'completed':
    case 'settled':
    case 'active':
    case 'in-stock':
    case 'in stock':
      return {
        bg: '#ECFDF3',
        text: '#1EB564',
        dot: '#12B76A',
      };
    case 'approved':
      return {
        bg: '#ECFDF3',
        text: '#027A48',
        dot: '#027A48',
      };
    case 'draft':
    case 'initiated':
    case 'shipped':
      return {
        bg: '#F8F3F9',
        text: '#6A0B73',
        dot: '#6A0B73',
      };
    case 'issued':
    case 'low in stock':
    case 'low stock':
      return {
        bg: '#FFFAEB',
        text: '#F79009',
        dot: '#F79009',
      };
    case 'pending':
    case 'partly paid':
    case 'in progress':
    case 'processing':
      return {
        bg: '#FFFAEB',
        text: '#B54708',
        dot: '#F79009',
      };
    case 'not successful':
    case 'outstanding':
    case 'unsettled':
    case 'suspended':
    case 'cancelled':
    case 'out of stock':
    case 'inactive':
    case 'failed':
      return {
        bg: '#FFECEF',
        text: '#DD6262',
        dot: '#F79009',
      };
    case 'declined':
      return {
        bg: '#EEEEEE',
        text: '#000000',
        dot: '#000000',
      };
    default:
      return {
        bg: 'transparent',
        text: '#000000',
        dot: '#000000',
      };
  }
};

export function getInitials(fullName) {
  if (!fullName) return 'N/A';
  // Split the full name by spaces
  const nameParts = fullName.split(' ');

  // If there's only one part, return the first two characters of the name
  if (nameParts.length === 1) {
    return nameParts[0].substring(0, 2).toUpperCase();
  }

  // Take the first letter of the first and last parts of the name
  const firstInitial = nameParts[0][0];
  const lastInitial = nameParts[nameParts.length - 1][0];

  // Combine the initials and return them in uppercase
  return (firstInitial + lastInitial).toUpperCase();
}

export const REASONS = [
  'Item out of stock',
  'Customer request',
  'Incorrect order',
  'Delivery issues',
];

export const VARAITIONTYPEOPTIONS = [
  { value: 'Size', label: 'Size' },
  { value: 'Color', label: 'Color' },
  { value: 'Quantity', label: 'Quantity' },
];

export const discountOptions = [
  { value: 'percentage', label: 'Percentage Discount' },
  { value: 'fixedAmount', label: 'Fixed Amount Discount' },
  { value: 'bogo', label: 'Buy One Get One Free (BOGO)' },
  { value: 'seasonal', label: 'Seasonal Discount' },
  { value: 'clearance', label: 'Clearance Discount' },
  { value: 'member', label: 'Member Discount' },
  { value: 'volume', label: 'Volume Discount' },
];

export const productCategory = [
  { value: 'Fruits', label: 'Fruits' },
  {
    value: 'Foodstuff',
    label: 'Foodstuff',
  },
  { value: 'Oil & spices', label: 'Oil & spices' },

  { value: 'Soup & ingredients', label: 'Soup & ingredients' },
  { value: 'Drinks & Beverages', label: 'Drinks & Beverages' },
  { value: ' Meat, poultry & seafood', label: ' Meat, poultry & seafood' },
];

export const convertFileToUrl = (file) => {
  if (typeof file === 'string') {
    // If the file is a string path, return it directly
    return file;
  } else if (file?.length < 1) {
    return images.gallary;
  } else if (typeof file[0] === 'string') {
    return file[0];
  } else {
    // If the file is a File object, create a URL for it
    return URL.createObjectURL(file[0]);
  }
};


// Function to encode SVG data to be used as a data URL
export const encodeSVG = (svgString) => {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgString)}`;
};



export const resizeImage = (file, maxSizeKB = 128) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio
        const maxFileSizeBytes = maxSizeKB * 1024;

        // Reduce the canvas size by adjusting the width and height
        if (file.size > maxFileSizeBytes) {
          const scale = Math.sqrt(maxFileSizeBytes / file.size);
          width *= scale;
          height *= scale;
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob && blob.size <= maxFileSizeBytes) {
              resolve(blob);
            } else {
              reject(new Error('Image size could not be reduced enough'));
            }
          },
          'image/jpeg', // You can adjust the format here if needed
          0.8 // You can adjust the quality of the image here (0 to 1)
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load the image'));
      };
    };

    reader.onerror = (error) => {
      reject(error);
    };
  });
};
