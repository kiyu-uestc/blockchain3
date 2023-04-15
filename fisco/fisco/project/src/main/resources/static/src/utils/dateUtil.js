// 日期时间格式处理，把日期统一转化成 YYYY-MM-DD hh:mm:ss 的格式
const dateTime = time => {
    let newDate = new Date(time);
    let dateCollection = { y: newDate.getFullYear(), M: newDate.getMonth() + 1, d: newDate.getDate(), h: newDate.getHours(), m: newDate.getMinutes(), s: newDate.getSeconds() };
    for(let i in dateCollection) {
        if (dateCollection[i] < 10) dateCollection[i] = `0${dateCollection[i]}`;
    }
    let { y, M, d, h, m, s } = dateCollection;
    return `${y}-${M}-${d} ${h}:${m}:${s}`;
}