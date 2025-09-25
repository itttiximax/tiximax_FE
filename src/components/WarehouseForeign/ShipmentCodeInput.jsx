import React, { useState, useCallback } from "react";
import { Camera, Trash2 } from "lucide-react";
import BarcodeScanner from "../../common/BarcodeScanner";

const ShipmentCodeInput = ({
  index,
  value,
  onChange,
  onRemove,
  canRemove = false,
  placeholder = "",
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState("");

  const handleCameraClick = useCallback(() => {
    setError("");
    setIsScanning(true);
  }, []);

  const handleBarcodeScanned = useCallback(
    (barcode) => {
      console.log(`Barcode scanned for input ${index + 1}:`, barcode);
      onChange(barcode);
      setIsScanning(false);
    },
    [onChange, index]
  );

  const handleScannerError = useCallback((errorMessage) => {
    setError(errorMessage);
    setIsScanning(false);
  }, []);

  const handleScanningStateChange = useCallback((scanning) => {
    if (!scanning) {
      setIsScanning(false);
    }
  }, []);

  const handleInputChange = useCallback(
    (e) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const handleRemove = useCallback(() => {
    if (isScanning) {
      setIsScanning(false);
    }
    onRemove();
  }, [onRemove, isScanning]);

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder || `Shipment code ${index + 1}`}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label={`Shipment code ${index + 1}`}
          />
          <button
            type="button"
            onClick={handleCameraClick}
            disabled={isScanning}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`Scan barcode for shipment code ${index + 1}`}
            title="Scan barcode"
          >
            <Camera size={20} />
          </button>
        </div>

        {canRemove && (
          <button
            type="button"
            onClick={handleRemove}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            aria-label={`Remove shipment code ${index + 1}`}
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

      {/* Individual Scanner Modal for this input only */}
      {isScanning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Camera size={20} />
              Scanning for Shipment Code {index + 1}
            </h3>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <BarcodeScanner
              isScanning={isScanning}
              onScan={handleBarcodeScanned}
              onError={handleScannerError}
              onScanningStateChange={handleScanningStateChange}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ShipmentCodeInput;
