export const logoutUser = (): void => {
  localStorage.removeItem("token");
  console.log("User logged out successfully.");
};
