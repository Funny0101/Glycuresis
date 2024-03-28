export function dealTime(dateTime) {
    var hour = dateTime.getHours() + 8;
    dateTime.setHours(hour);
    return new Date(dateTime).toISOString().replace(/\.[\d]{3}Z/, '')
}