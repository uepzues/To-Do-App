// exports.module(getDate);
// export {dateFunc};
const lang = "en-GB";

let getDate = () => {
  const today = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const date = today.toLocaleDateString(lang, options);
  return date;
};

let getDay = () => {
  const today = new Date();
  const options = {
    weekday: "long",
  };

  const date = today.toLocaleDateString(lang, options);
  return date;
};

let getYear = () => {
  const year = new Date();
  const thisYear = year.getFullYear();

  return thisYear;
};
const dateFunc = [getDate(), getDay(), getYear()];

export default dateFunc;
