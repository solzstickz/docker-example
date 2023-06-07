import config from "../config/config";

///!! set Time login here /admin_path

export function setWithExpiry(key: string, value: string, ttl: number) {
  const now = new Date();

  // `item` is an object which contains the original value
  // as well as the time when it's supposed to expire
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

export function getWithExpiry(key: string) {
  if (typeof window !== "undefined") {
    console.log("we are running on the client");
  } else {
    console.log("we are running on the server");
  }
  try {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
      return null;
    }

    const item = JSON.parse(itemStr);
    const now = new Date();

    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return null
      localStorage.removeItem(key);
      alert("Session expired, please login again");
      window.location.href = `/${config.ADMIN_PATH}`;
    }
    return item.value;
  } catch (e) {
    console.log("storage err" + e);
  }
  // if the item doesn't exist, return null
}
