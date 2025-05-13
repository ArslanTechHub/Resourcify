import moment from "moment-timezone";

export const formatDateAndTime = (date) => {
  let formattedDate = moment(date).tz("Asia/Karachi").format("YYYY-MM-DD");
  let formattedTime = moment(date).tz("Asia/Karachi").format("HH-mm");

  return { formattedDate, formattedTime };
};
