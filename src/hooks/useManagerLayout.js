// hooks/useManagerLayout.js - CHỈ BUSINESS LOGIC
import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import debounce from "lodash/debounce";

export const useManagerLayout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Memoized searchable features
  const searchableFeatures = useMemo(
    () => [
      {
        name: t("features.dashboard"),
        path: "/manager/dashboard",
        keywords: [
          t("features.dashboard"),
          "dashboard",
          t("keywords.report"),
          t("keywords.analytics"),
        ],
      },
      {
        name: t("features.team"),
        path: "/manager/team",
        keywords: [
          t("features.team"),
          "team",
          t("keywords.group"),
          t("keywords.members"),
        ],
      },
      {
        name: t("features.customers"),
        path: "/manager/customers",
        keywords: [
          t("features.customers"),
          "customer",
          "client",
          t("keywords.client"),
        ],
      },
      {
        name: t("features.quote"),
        path: "/manager/quote",
        keywords: [
          t("features.quote"),
          "quote",
          t("keywords.price"),
          t("keywords.estimate"),
        ],
      },
      {
        name: t("features.marketing"),
        path: "/manager/ads",
        keywords: [
          t("features.marketing"),
          t("keywords.ads"),
          "ads",
          t("keywords.promotion"),
        ],
      },
      {
        name: t("features.paylater"),
        path: "/manager/cost/paylater",
        keywords: [
          t("features.paylater"),
          "pay later",
          t("keywords.deferred"),
          t("keywords.debt"),
        ],
      },
      {
        name: t("features.paybefore"),
        path: "/manager/cost/paybefore",
        keywords: [
          t("features.paybefore"),
          "pay before",
          t("keywords.prepaid"),
          t("keywords.advance"),
        ],
      },
      {
        name: t("features.routes"),
        path: "/manager/routes",
        keywords: [
          t("features.routes"),
          "routes",
          t("keywords.transport"),
          t("keywords.path"),
        ],
      },
      {
        name: t("features.transfer"),
        path: "/manager/transfer",
        keywords: [
          t("features.transfer"),
          "transfer",
          t("keywords.destination"),
          t("keywords.move"),
        ],
      },
      {
        name: t("features.producttype"),
        path: "/manager/producttype",
        keywords: [
          t("features.producttype"),
          "product type",
          t("keywords.category"),
          t("keywords.catalog"),
        ],
      },
      {
        name: t("features.website"),
        path: "/manager/website",
        keywords: [t("features.website"), "web", t("keywords.site"), "site"],
      },
      {
        name: t("features.order"),
        path: "/manager/order",
        keywords: [
          t("features.order"),
          "order",
          t("keywords.purchase"),
          t("keywords.buy"),
        ],
      },
    ],
    [t]
  );

  // Debounced search với useCallback
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.trim() === "") {
        setSearchResults([]);
        setShowSearchDropdown(false);
        return;
      }

      const results = searchableFeatures.filter(
        (feature) =>
          feature.keywords.some((keyword) =>
            keyword.toLowerCase().includes(query.toLowerCase())
          ) || feature.name.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(results);
      setShowSearchDropdown(true);
    }, 300),
    [searchableFeatures]
  );

  // Navigation with loading và error handling
  const navigateWithLoading = useCallback(
    async (path) => {
      setIsLoading(true);
      setError(null);

      try {
        navigate(path);
      } catch (err) {
        console.error("Navigation error:", err);
        setError("Có lỗi xảy ra khi điều hướng. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    },
    [navigate]
  );

  // Handlers
  const handleSearch = useCallback(
    (query) => {
      setSearchQuery(query);
      debouncedSearch(query);
    },
    [debouncedSearch]
  );

  const handleSearchSelect = useCallback(
    (feature) => {
      navigateWithLoading(feature.path);
      setSearchQuery("");
      setSearchResults([]);
      setShowSearchDropdown(false);
    },
    [navigateWithLoading]
  );

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchDropdown(false);
  }, []);

  const handleLogoClick = useCallback(() => {
    navigateWithLoading("/manager/dashboard");
  }, [navigateWithLoading]);

  const handleProfile = useCallback(() => {
    navigateWithLoading("/manager/profile");
    setIsDropdownOpen(false);
  }, [navigateWithLoading]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  }, [navigate]);

  const handleNotificationClick = useCallback(() => {
    setNotificationCount(0);
    navigateWithLoading("/manager/notifications");
  }, [navigateWithLoading]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // States
    isSidebarOpen,
    isDropdownOpen,
    notificationCount,
    searchQuery,
    searchResults,
    showSearchDropdown,
    isLoading,
    error,

    // Handlers
    handleSearch,
    handleSearchSelect,
    clearSearch,
    handleLogoClick,
    handleProfile,
    handleLogout,
    handleNotificationClick,
    toggleSidebar,
    toggleDropdown,
    setShowSearchDropdown,
    clearError,
  };
};
