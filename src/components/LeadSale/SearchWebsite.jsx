// src/components/SearchWebsite.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import searchService from "../../Services/SharedService/searchService";

const SearchWebsite = ({
  onSelectWebsite,
  value = "",
  onChange = () => {},
  onClear = () => {},
}) => {
  const [searchQuery, setSearchQuery] = useState(value || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filteredWebsites, setFilteredWebsites] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Sync với value từ props (controlled component)
  useEffect(() => {
    setSearchQuery(value || "");
  }, [value]);

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  // Click outside để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search websites từ API
  const searchWebsites = async (keyword) => {
    if (!keyword.trim()) {
      setFilteredWebsites([]);
      setShowDropdown(false);
      setSelectedIndex(-1);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await searchService.searchWebsite(keyword);

      // API trả về format: [{ websiteId: number, websiteName: string }]
      const limitedResults = Array.isArray(data) ? data.slice(0, 10) : [];
      setFilteredWebsites(limitedResults);
      setShowDropdown(limitedResults.length > 0);
      setSelectedIndex(-1);
    } catch (err) {
      setError("Không thể tìm kiếm website");
      console.error("Error searching websites:", err);
      setFilteredWebsites([]);
      setShowDropdown(false);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((keyword) => searchWebsites(keyword), 500),
    []
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Gọi onChange callback để update parent component
    if (onChange) {
      onChange(e);
    }

    debouncedSearch(value);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showDropdown || filteredWebsites.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredWebsites.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredWebsites.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelectWebsite(filteredWebsites[selectedIndex]);
        }
        break;
      case "Escape":
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Handle select website
  const handleSelectWebsite = (website) => {
    // API format: { websiteId, websiteName }
    setSearchQuery(website.websiteName || "");
    setShowDropdown(false);
    setSelectedIndex(-1);
    if (onSelectWebsite) {
      onSelectWebsite(website);
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    setFilteredWebsites([]);
    setShowDropdown(false);
    setSelectedIndex(-1);

    // Gọi onClear callback để clear selected website ở parent
    if (onClear) {
      onClear();
    }
  };

  // Highlight matched text
  const highlightMatch = (text, query) => {
    if (!query || !text) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Get website icon based on website name
  const getWebsiteIcon = (website) => {
    const websiteName = website.websiteName?.toLowerCase() || "";

    // Common website icons
    const getIconByName = (name) => {
      if (name.includes("amazon")) {
        return (
          <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
            <span className="text-orange-600 font-bold text-xs">AMZ</span>
          </div>
        );
      }
      if (name.includes("ebay")) {
        return (
          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
            <span className="text-blue-600 font-bold text-xs">eBay</span>
          </div>
        );
      }
      if (name.includes("lazada")) {
        return (
          <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
            <span className="text-purple-600 font-bold text-xs">LZD</span>
          </div>
        );
      }
      if (name.includes("shopee")) {
        return (
          <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
            <span className="text-red-600 font-bold text-xs">SPE</span>
          </div>
        );
      }
      if (name.includes("alibaba")) {
        return (
          <div className="w-8 h-8 bg-yellow-100 rounded flex items-center justify-center">
            <span className="text-yellow-600 font-bold text-xs">ALI</span>
          </div>
        );
      }

      // Default icon
      return (
        <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
          <svg
            className="w-4 h-4 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
            />
          </svg>
        </div>
      );
    };

    return getIconByName(websiteName);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          type="text"
          placeholder="Tìm kiếm website..."
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          onFocus={() =>
            searchQuery && setShowDropdown(filteredWebsites.length > 0)
          }
          className="w-full pl-10 pr-12 py-3 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
        />

        {/* Loading spinner */}
        {loading && (
          <div className="absolute inset-y-0 right-10 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Clear button */}
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
            type="button"
            title="Xóa tìm kiếm"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto"
        >
          {filteredWebsites.length > 0 ? (
            <ul className="py-1">
              {filteredWebsites.map((website, index) => (
                <li key={website.websiteId || index}>
                  <button
                    onClick={() => handleSelectWebsite(website)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ${
                      index === selectedIndex
                        ? "bg-blue-50 border-r-2 border-blue-500"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {getWebsiteIcon(website)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {highlightMatch(
                                website.websiteName || "Không có tên website",
                                searchQuery.trim()
                              )}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              ID: {website.websiteId}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            searchQuery &&
            !loading && (
              <div className="px-4 py-6 text-center text-gray-500">
                <svg
                  className="mx-auto h-8 w-8 text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <p className="text-sm">Không tìm thấy website nào</p>
                <p className="text-xs text-gray-400 mt-1">
                  Thử tìm kiếm với từ khóa khác
                </p>
              </div>
            )
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute z-50 w-full mt-1 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchWebsite;
