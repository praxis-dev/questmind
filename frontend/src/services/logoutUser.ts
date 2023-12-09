// logoutUser.ts

export const logoutUser = (): void => {
  localStorage.removeItem("token");
};
