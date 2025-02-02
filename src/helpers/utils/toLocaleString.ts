export const toLocaleString = (datetime: string): string =>
    new Date(datetime).toLocaleString("vi-VN", {timeZone: "Asia/Ho_Chi_Minh"});
