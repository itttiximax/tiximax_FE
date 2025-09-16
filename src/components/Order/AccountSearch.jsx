// src/components/AccountSearch.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import searchService from "../../Services/SharedService/searchService";

const AccountSearch = ({
  onSelectAccount,
  value = "",
  onChange = () => {},
  onClear = () => {},
}) => {
  const [searchQuery, setSearchQuery] = useState(value || "");
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filteredAccounts, setFilteredAccounts] = useState([]);
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

  // Load all accounts khi component mount
  useEffect(() => {
    loadAllAccounts();
  }, []);

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

  const loadAllAccounts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await searchService.getAllAccounts();
      setAccounts(data);
    } catch (err) {
      setError("Không thể tải danh sách tài khoản");
      console.error("Error loading accounts:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter accounts và show dropdown
  const filterAccounts = useCallback(
    (query) => {
      if (!query.trim()) {
        setFilteredAccounts([]);
        setShowDropdown(false);
        setSelectedIndex(-1);
        return;
      }

      const filtered = accounts
        .filter((account) => {
          const searchTerm = query.toLowerCase();
          return (
            (account.customerCode &&
              account.customerCode.toLowerCase().includes(searchTerm)) ||
            (account.name && account.name.toLowerCase().includes(searchTerm)) ||
            (account.phone &&
              account.phone.toLowerCase().includes(searchTerm)) ||
            (account.email && account.email.toLowerCase().includes(searchTerm))
          );
        })
        .slice(0, 10); // Giới hạn 10 kết quả

      setFilteredAccounts(filtered);
      setShowDropdown(filtered.length > 0);
      setSelectedIndex(-1);
    },
    [accounts]
  );

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => filterAccounts(query), 300),
    [filterAccounts]
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
    if (!showDropdown || filteredAccounts.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredAccounts.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredAccounts.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelectAccount(filteredAccounts[selectedIndex]);
        }
        break;
      case "Escape":
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Handle select account
  const handleSelectAccount = (account) => {
    setSearchQuery(`${account.customerCode} - ${account.name}`);
    setShowDropdown(false);
    setSelectedIndex(-1);
    if (onSelectAccount) {
      onSelectAccount(account);
    }
  };

  // Clear search - Gọi onClear để clear cả selected customer
  const handleClearSearch = () => {
    setSearchQuery("");
    setFilteredAccounts([]);
    setShowDropdown(false);
    setSelectedIndex(-1);

    // Gọi onClear callback để clear selected customer ở parent
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
          placeholder="Tìm kiếm hoặc nhập mã khách hàng..."
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          onFocus={() =>
            searchQuery && setShowDropdown(filteredAccounts.length > 0)
          }
          className="w-full pl-10 pr-12 py-3 text-gray-700 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
        />

        {/* Loading spinner */}
        {loading && (
          <div className="absolute inset-y-0 right-10 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Clear button - Quan trọng: Gọi onClear khi bấm */}
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

      {/* Dropdown Recommendations */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto"
        >
          {filteredAccounts.length > 0 ? (
            <ul className="py-1">
              {filteredAccounts.map((account, index) => (
                <li key={account.accountId}>
                  <button
                    onClick={() => handleSelectAccount(account)}
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
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {account.name
                                  ? account.name.charAt(0).toUpperCase()
                                  : "N"}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {highlightMatch(
                                account.customerCode,
                                searchQuery.trim()
                              )}
                            </p>
                            <p className="text-sm text-gray-600 truncate">
                              {highlightMatch(
                                account.name || "Chưa có tên",
                                searchQuery.trim()
                              )}
                            </p>
                            <div className="flex items-center space-x-4 mt-1">
                              {account.email && (
                                <span className="text-xs text-gray-500 truncate">
                                  {highlightMatch(
                                    account.email,
                                    searchQuery.trim()
                                  )}
                                </span>
                              )}
                              {account.phone && (
                                <span className="text-xs text-gray-500">
                                  {highlightMatch(
                                    account.phone,
                                    searchQuery.trim()
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            searchQuery && (
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
                <p className="text-sm">Không tìm thấy khách hàng nào</p>
              </div>
            )
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute z-50 w-full mt-1 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
};

export default AccountSearch;
