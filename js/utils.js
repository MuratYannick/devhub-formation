// Named exports
export const API_BASE_URL = "https://api.devhub.com";

export const formatDate = (date) => {
  return new Intl.DateTimeFormat("fr-FR").format(new Date(date));
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Export en fin de fichier (style préféré)
const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// export avec renommage
export { slugify, API_BASE_URL as API_URL };
