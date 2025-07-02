import { jwtDecode } from "jwt-decode";
import service from "~/service";

export const useAuth = () => {
  const user = ref(null);
  const isLoading = ref(false);

  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => {
    const role = user.value?.permission || user.value?.role;
    console.log('isAdmin computed - role:', role);
    return ["admin", "super_admin"].includes(role);
  });
  const isUser = computed(() => {
    const role = user.value?.permission || user.value?.role;
    return role === "user";
  });

  const sendAuth = async (payload) => {
    try {
      isLoading.value = true;
      const res = await service.auth.sendLogin(payload);
      const token = res.data.token;

      if (token && res.data.user) {
        // เก็บ token ใน cookie
        const tokenCookie = useCookie("token", {
          default: () => null,
          secure: true,
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7 // 7 days
        });
        tokenCookie.value = token;

        // ตั้งค่า user data
        const u = res.data.user;
        user.value = {
          id: u.id || u.user_id,
          full_name: u.name || u.full_name,
          email: u.email,
          student_id: u.student_id,
          permission: u.permission || u.role || "user",
          role: u.role || u.permission || "user",
          exp: jwtDecode(token).exp,
        };

        console.log('User set after login:', user.value);

        return {
          success: true,
          user: user.value,
          token,
        };
      }

      return { success: false, message: "Token not found" };
    } catch (err) {
      console.error('Login error:', err);
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
      const tokenCookie = useCookie("token");
      tokenCookie.value = null;
      await navigateTo("/login");
      isLoading.value = false;
    }
  };

  const sendRegister = async (payload) => {
    try {
      isLoading.value = true;
      const res = await service.auth.sendRegister({
        ...payload,
        permission: "user",
        role: "user",
      });
      return { success: true, message: "Register success" };
    } catch (err) {
      console.error('Register error:', err);
      return {
        success: false,
        message: err.response?.data?.message || "Register failed",
      };
    } finally {
      isLoading.value = false;
    }
  };

  const getRedirectPath = (role = null) => {
    const r = role || user.value?.permission || user.value?.role || "user";
    console.log('getRedirectPath - role:', r);
    return ["admin", "super_admin"].includes(r) ? "/admin" : "/";
  };

  const initializeAuth = async () => {
    const tokenCookie = useCookie("token");
    if (!tokenCookie.value) {
      console.log('No token found in initializeAuth');
      return false;
    }

    try {
      const decoded = jwtDecode(tokenCookie.value);
      const now = Math.floor(Date.now() / 1000);

      if (decoded.exp && decoded.exp < now) {
        console.log('Token expired in initializeAuth');
        tokenCookie.value = null;
        user.value = null;
        return false;
      }

      // ตั้งค่า user จาก token
      user.value = {
        id: decoded.user_id || decoded.id,
        full_name: decoded.name || decoded.full_name || "User",
        email: decoded.email,
        student_id: decoded.student_id,
        permission: decoded.permission || decoded.role || "user",
        role: decoded.role || decoded.permission || "user",
        exp: decoded.exp,
      };

      console.log('User initialized from token:', user.value);
      
      // รอให้ reactive system อัพเดท
      await nextTick();
      
      return true;
    } catch (err) {
      console.error('Token decode error:', err);
      tokenCookie.value = null;
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