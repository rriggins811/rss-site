/**
 * Ryan's public-facing 20-minute discovery call. Single source of truth for
 * /work-with-ryan and any rss-site booking iframe or button.
 *
 * Booking runs on Google Calendar appointment schedules (Google Workspace,
 * already paid for). Google Meet auto-attaches to every confirmed booking.
 * cal.com + Zoom retired June 2026.
 *
 * BOOKING_URL is the plain booking page (use for links/buttons that open in a
 * new tab). BOOKING_EMBED_URL appends `?gv=true`, which Google requires for the
 * inline website-embed iframe to render the scheduler instead of redirecting.
 */
export const BOOKING_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ0y_kQQfkvnf6jQEBvA5X2Onolndq6VleuID3n9hDujDd4CjpOsaJzKqs_eXujvfVVayudxp2h5";

export const BOOKING_EMBED_URL = `${BOOKING_URL}?gv=true`;
