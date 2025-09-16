import React, { useState, useEffect, useCallback, useRef } from "react";
import searchService from "../../Services/SharedService/searchService";

const SearchWebsite = ({
  onSelectWebsite,
  value = "",
  onChange = () => {},
  onClear = () => {},
}) => {
  const [searchQuery, setSearchQuery] = useState(value || "");
  const [filteredWebsites, setFilteredWebsites] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchRef = useRef(null);
  const timeoutRef = useRef(null);

  // Sync với value từ props
  useEffect(() => {
    setSearchQuery(value || "");
  }, [value]);

  // Click outside để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Search websites từ API (tối ưu - không loading state)
  const searchWebsites = useCallback(async (keyword) => {
    if (!keyword.trim()) {
      setFilteredWebsites([]);
      setShowDropdown(false);
      setSelectedIndex(-1);
      return;
    }

    try {
      const data = await searchService.searchWebsite(keyword);
      const results = Array.isArray(data) ? data.slice(0, 8) : []; // Giảm từ 10 xuống 8
      setFilteredWebsites(results);
      setShowDropdown(results.length > 0);
      setSelectedIndex(-1);
    } catch (err) {
      console.error("Error searching websites:", err);
      setFilteredWebsites([]);
      setShowDropdown(false);
    }
  }, []);

  // Handle search input change với debounce đơn giản
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Gọi onChange callback để update parent component
    onChange(e);

    // Clear timeout cũ và tạo mới
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      searchWebsites(value);
    }, 300); // Giảm từ 500ms xuống 300ms
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
    if (onClear) {
      onClear();
    }
  };

  // Highlight matched text (đơn giản hóa)
  const highlightMatch = (text, query) => {
    if (!query || !text) return text;

    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;

    return (
      <>
        {text.slice(0, index)}
        <mark className="bg-yellow-200 text-yellow-900">
          {text.slice(index, index + query.length)}
        </mark>
        {text.slice(index + query.length)}
      </>
    );
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
          // placeholder="Tìm kiếm website..."
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          onFocus={() =>
            searchQuery && setShowDropdown(filteredWebsites.length > 0)
          }
          className="w-full pl-10 pr-10 py-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        {/* Clear button */}
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
            type="button"
          >
            <svg
              className="w-4 h-4"
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

      {/* Dropdown Results - Đơn giản hóa */}
      {showDropdown && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredWebsites.length > 0 ? (
            <ul className="py-1">
              {filteredWebsites.map((website, index) => (
                <li key={website.websiteId}>
                  <button
                    onClick={() => handleSelectWebsite(website)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                      index === selectedIndex ? "bg-blue-50" : ""
                    }`}
                  >
                    <p className="text-sm text-gray-900">
                      {highlightMatch(
                        website.websiteName || "Không có tên website",
                        searchQuery.trim()
                      )}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            searchQuery && (
              <div className="px-4 py-3 text-center text-gray-500 text-sm">
                Không tìm thấy website nào
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default SearchWebsite;
