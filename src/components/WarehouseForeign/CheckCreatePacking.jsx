import React from "react";
import {
  Package,
  MapPin,
  Barcode,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  FileText,
  XCircle,
  PackageX,
  PackageCheck,
} from "lucide-react";

const CheckCreatePacking = ({
  isOpen,
  onClose,
  onConfirm,
  data,
  loading,
  checkResult,
}) => {
  if (!isOpen) return null;

  const destination = data.destinationName;
  const shipmentCodes = data.shipmentCodes.filter((code) => code.trim() !== "");
  const totalCount = shipmentCodes.length;

  // Parse check result
  const canCreate = checkResult?.canCreate ?? true;
  const warehouseCount = checkResult?.warehouseCount ?? 0;
  const invalidCodes = checkResult?.invalidCodes || [];
  const notImportedCodes = checkResult?.notImportedCodes || [];
  const alreadyPackedCodes = checkResult?.alreadyPackedCodes || [];

  const allErrorCodes = [
    ...invalidCodes,
    ...notImportedCodes,
    ...alreadyPackedCodes,
  ];
  const validCodesCount = totalCount - allErrorCodes.length;
  const hasErrors = !canCreate || allErrorCodes.length > 0;

  // Function to get error reason for a code
  const getErrorReason = (code) => {
    if (invalidCodes.includes(code)) {
      return "Shipment code not found in system";
    }
    if (notImportedCodes.includes(code)) {
      return "Shipment not imported to warehouse yet";
    }
    if (alreadyPackedCodes.includes(code)) {
      return "Shipment already packed in another packing";
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div
          className={`px-6 py-4 flex items-center justify-between ${
            hasErrors ? "bg-red-600" : "bg-blue-600"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              {hasErrors ? (
                <XCircle className="w-6 h-6 text-white" />
              ) : (
                <Package className="w-6 h-6 text-white" />
              )}
            </div>
            <h2 className="text-lg font-semibold text-white">
              {checkResult ? "Validation Result" : "Validating Codes..."}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Destination info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-blue-800 mb-1">
              <MapPin className="w-5 h-5" />
              <span className="font-semibold">Destination</span>
            </div>
            <p className="text-lg font-bold text-blue-900 ml-7">
              {destination}
            </p>
          </div>

          {/* Validation Summary */}
          {checkResult && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              {/* Valid codes count */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex flex-col items-center text-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                  <span className="text-2xl font-bold text-green-900">
                    {validCodesCount}
                  </span>
                  <span className="text-xs text-green-700 font-medium mt-1">
                    Valid
                  </span>
                </div>
              </div>

              {/* In warehouse count */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex flex-col items-center text-center">
                  <PackageCheck className="w-6 h-6 text-blue-600 mb-2" />
                  <span className="text-2xl font-bold text-blue-900">
                    {warehouseCount}
                  </span>
                  <span className="text-xs text-blue-700 font-medium mt-1">
                    In Warehouse
                  </span>
                </div>
              </div>

              {/* Error codes count */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex flex-col items-center text-center">
                  <XCircle className="w-6 h-6 text-red-600 mb-2" />
                  <span className="text-2xl font-bold text-red-900">
                    {allErrorCodes.length}
                  </span>
                  <span className="text-xs text-red-700 font-medium mt-1">
                    Errors
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Error warning with message */}
          {hasErrors && checkResult?.message && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2 text-red-800">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold mb-1">Cannot Create Packing</p>
                  <p className="text-sm whitespace-pre-line">
                    {checkResult.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error breakdown */}
          {checkResult &&
            (invalidCodes.length > 0 ||
              notImportedCodes.length > 0 ||
              alreadyPackedCodes.length > 0) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-blue-900 mb-2 text-sm">
                  Error Breakdown:
                </h4>
                <div className="space-y-1 text-sm">
                  {invalidCodes.length > 0 && (
                    <div className="flex items-center gap-2 text-blue-800">
                      <XCircle className="w-4 h-4" />
                      <span>
                        <strong>{invalidCodes.length}</strong> code(s) not found
                        in system
                      </span>
                    </div>
                  )}
                  {notImportedCodes.length > 0 && (
                    <div className="flex items-center gap-2 text-blue-800">
                      <PackageX className="w-4 h-4" />
                      <span>
                        <strong>{notImportedCodes.length}</strong> code(s) not
                        imported to warehouse
                      </span>
                    </div>
                  )}
                  {alreadyPackedCodes.length > 0 && (
                    <div className="flex items-center gap-2 text-yellow-800">
                      <Package className="w-4 h-4" />
                      <span>
                        <strong>{alreadyPackedCodes.length}</strong> code(s)
                        already packed
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* Shipment codes list with validation status */}
          <div className="border border-gray-200 rounded-lg">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Shipment Code List ({totalCount} total)
              </h3>
            </div>
            <div className="p-4 max-h-64 overflow-y-auto">
              <div className="space-y-2">
                {shipmentCodes.map((code, index) => {
                  const isError = allErrorCodes.includes(code);
                  const errorReason = isError ? getErrorReason(code) : null;
                  const isValid = !isError;

                  return (
                    <div key={index}>
                      <div
                        className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors ${
                          isError
                            ? "bg-red-50 hover:bg-red-100 border border-red-200"
                            : isValid && checkResult
                            ? "bg-green-50 hover:bg-green-100 border border-green-200"
                            : "bg-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        <span
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                            isError
                              ? "bg-red-100 text-red-700"
                              : isValid && checkResult
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {index + 1}
                        </span>
                        <span className="font-mono text-sm text-gray-800 flex-1">
                          {code}
                        </span>
                        {isValid && checkResult && (
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        )}
                        {isError && (
                          <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                        )}
                        {!checkResult && (
                          <Loader2 className="w-4 h-4 text-blue-500 animate-spin flex-shrink-0" />
                        )}
                      </div>
                      {/* Error message */}
                      {isError && errorReason && (
                        <div className="ml-11 mt-1 text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errorReason}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-xs text-gray-600">
            {checkResult && hasErrors && (
              <span className="flex items-center gap-1 text-red-600 font-medium">
                <AlertCircle className="w-4 h-4" />
                Please fix all errors before creating packing
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {hasErrors ? "Close" : "Cancel"}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading || hasErrors || !checkResult}
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {checkResult ? "Creating..." : "Checking..."}
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Confirm & Create
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckCreatePacking;
