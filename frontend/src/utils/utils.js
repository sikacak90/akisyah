export const getCurrentTime = () => {
  // Create a new Date object
  const now = new Date();

  // Get the current hour and minute as two separate numbers
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // Pad the numbers with a leading zero if necessary
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  // Combine the formatted hours and minutes into a string with a colon separator
  const currentTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  return currentTime;
};
