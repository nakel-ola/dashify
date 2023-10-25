const constant = {
  unauthenticatedPath: [
    "/",
    "/auth/login",
    "/auth/register",
    "/auth/forget_password",
    "/auth/change_password",
  ],
  authenticatedPath: ["/dashboard", "/project"],
  neutralPath: ["/about-us", "/faq", "/docs"],
  avatarColors: [
    {
      bg: "#fee2e2",
      text: "#dc2626",
    },
    {
      bg: "#fce7f3",
      text: "#db2777",
    },
    {
      bg: "#e0e7ff",
      text: "#4f46e5",
    },
    {
      bg: "#f3e8ff",
      text: "#9333ea",
    },
    {
      bg: "#dbeafe",
      text: "#2563eb",
    },
    {
      bg: "#ccfbf1",
      text: "#0d9488",
    },
    {
      bg: "#dcfce7",
      text: "#16a34a",
    },
    {
      bg: "#cffafe",
      text: "#0891b2",
    },
    {
      bg: "#f3f4f6",
      text: "#4b5563",
    },
  ],
};

export default constant;
