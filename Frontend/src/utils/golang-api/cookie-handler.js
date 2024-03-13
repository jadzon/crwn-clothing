export function CreateCookie(authToken){
    document.cookie = 'cookieName=cookieValue; max-age=3600; path=/'; // Example: Set cookie to expire in 1 hour
}