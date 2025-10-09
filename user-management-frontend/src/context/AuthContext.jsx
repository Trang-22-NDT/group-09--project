import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);

  // Hàm đăng nhập (giả lập hoặc gọi API thật)
  const login = async (email, password) => {
    // Gửi request tới API thật ở đây (tạm thời dùng mock)
    const fakeResponse = {
      success: true,
      token: "fake-jwt-token-123456",
      user: { name: "Nguyễn Văn A", email },
    };

    if (fakeResponse.success) {
      localStorage.setItem("token", fakeResponse.token);
      setToken(fakeResponse.token);
      setUser(fakeResponse.user);
    } else {
      throw new Error("Sai thông tin đăng nhập");
    }
  };

  // Hàm đăng ký (tạm thời mô phỏng)
  const signup = async (name, email, password) => {
    console.log("Đăng ký thành công:", name, email);
    // Gửi API thật nếu có backend
  };

  // Hàm đăng xuất
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // Tự động load lại user khi có token
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setUser({ name: "Nguyễn Văn A (từ token)", email: "user@example.com" });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
