// mock login and logout
export function login(token) {
    // add cookie
    document.cookie = `session=${token};`;
}
export function logout() {
    // delete cookie
    document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}
  