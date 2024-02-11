
export function formatDateYMD(date) {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;

  return `${year}-${month}-${day}`;
}

export function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, '0'); // Ensures two digits
  const minutes = String(date.getMinutes()).padStart(2, '0'); // Ensures two digits
  return `${hours}:${minutes}`;
}