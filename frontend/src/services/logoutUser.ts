export const logoutUser = (): void => {
  localStorage.removeItem("token");
};
