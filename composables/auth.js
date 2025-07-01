// useAuth composable
import service from "../service";

export const useAuth = () => {
  const isLoading = ref(false);

  const sendAuth = async (payload) => {
    try {
      const response = await service.auth.sendLogin(payload);
      console.log("Login successfully!", payload);

      // return ทั้ง success status และ token
      return {
        success: true,
        token: response.data.token, // หรือ response.token ขึ้นกับ structure ของ API
      };
    } catch (err) {
      console.error("Login failed:", err);
      return {
        success: false,
        token: null,
      };
    }
  };

  const sendLogout = async () => {
    try {
      await service.auth.sendLogout();
      console.log("Logout successfully!");
    } catch (err) {
      console.error("Logout failed");
    }
  };

  const sendRegister = async (payload) => {
    try {
      await service.auth.sendRegister(payload);
      console.log("Register successfully");
    } catch (err) {
      console.error("Register failed");
    }
  };

  return {
    sendAuth,
    sendLogout,
    sendRegister
  };
};
