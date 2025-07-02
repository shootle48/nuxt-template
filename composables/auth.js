import { jwtDecode } from "jwt-decode";
import service from "~/service";

export const useAuth = () => {
  const user = ref(null);
  const isLoading = ref(false);

  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.permission === "admin");
  const isUser = computed(() => user.value?.permission === "user");

  const sendAuth = async (payload) => {
    try {
      isLoading.value = true;
      const res = await service.auth.sendLogin(payload);
      const token = res.data.token;

      if (token && res.data.user) {
        useCookie("token").value = token;

        const u = res.data.user;
        user.value = {
          id: u.id || u.user_id,
          full_name: u.name,
          email: u.email,
          student_id: u.student_id,
          permission: u.permission || u.role || "user",
          exp: jwtDecode(token).exp,
        };

        return {
          success: true,
          user: user.value,
          token,
        };
      }

      return { success: false, message: "Token not found" };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    } finally {
      isLoading.value = false;
    }
  };

  const sendLogout = async () => {
    try {
      isLoading.value = true;
      await service.auth.sendLogout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      user.value = null;
      useCookie("token").value = null;
      await navigateTo("/login");
      isLoading.value = false;
    }
  };

  const sendRegister = async (payload) => {
    try {
      isLoading.value = true;
      await service.auth.sendRegister({
        ...payload,
        permission: "user",
        role: "user",
      });
      return { success: true, message: "Register success" };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Register failed",
      };
    } finally {
      isLoading.value = false;
    }
  };

  const getRedirectPath = (role = null) => {
    const r = role || user.value?.permission || "user";
    return r === "admin" ? "/admin" : "/";
  };

  const initializeAuth = async () => {
    const token = useCookie("token");
    if (!token.value) return false;

    try {
      const decoded = jwtDecode(token.value);
      const now = Math.floor(Date.now() / 1000);

      if (decoded.exp && decoded.exp < now) {
        token.value = null;
        user.value = null;
        return false;
      }

      user.value = {
        id: decoded.user_id || decoded.id,
        full_name: decoded.name || "User",
        email: decoded.email,
        student_id: decoded.student_id,
        permission: decoded.permission || decoded.role || "user",
        role: decoded.role || decoded.permission || "user",
        exp: decoded.exp,
      };

      return true;
    } catch (err) {
      token.value = null;
      user.value = null;
      return false;
    }
  };

  return {
    // state
    user: readonly(user),
    isLoading: readonly(isLoading),
    isAuthenticated,
    isAdmin,
    isUser,

    // methods
    sendAuth,
    sendLogout,
    sendRegister,
    getRedirectPath,
    initializeAuth,
  };
};
