export function formatDateTime(dateString: string, format: string): string {
    const date = new Date(dateString); // Parse the ISO 8601 string
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    };

    // Format the date to the user's local timezone
    const formattedDate = new Intl.DateTimeFormat('default', options).format(date);

    // Replace the default format with the desired format (dd.MM.yyyy HH:mm:ss)
    return formattedDate.replace(',', '').replace(/\//g, '.').replace(' ', ' ');
}