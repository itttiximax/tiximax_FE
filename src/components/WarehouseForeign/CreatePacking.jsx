import React, { useState, useEffect, useRef } from "react";
import {
  Package,
  MapPin,
  Barcode,
  Plus,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  FileText,
} from "lucide-react";
import { createPackingService } from "../../Services/Warehouse/createpackingService";
import managerDestinationService from "../../Services/Manager/managerDestinationService";

const CreatePacking = () => {
  const [destinations, setDestinations] = useState([]);
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  const [formData, setFormData] = useState({
    destinationId: "",
    shipmentCodes: [""],
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const inputRefs = useRef([]);

  useEffect(() => {
    fetchDestinations();
  }, []);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(
      0,
      formData.shipmentCodes.length
    );
  }, [formData.shipmentCodes.length]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const fetchDestinations = async () => {
    try {
      const data = await managerDestinationService.getDestinations();
      setDestinations(data);
    } catch {
      setError("Cannot load destination list.");
    } finally {
      setLoadingDestinations(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleShipmentCodeChange = (index, value) => {
    const newShipmentCodes = [...formData.shipmentCodes];
    newShipmentCodes[index] = value;
    setFormData((prev) => ({ ...prev, shipmentCodes: newShipmentCodes }));
  };

  const addShipmentCode = () => {
    setFormData((prev) => ({
      ...prev,
      shipmentCodes: [...prev.shipmentCodes, ""],
    }));
  };

  const removeShipmentCode = (index) => {
    const newShipmentCodes = formData.shipmentCodes.filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({
      ...prev,
      shipmentCodes: newShipmentCodes.length > 0 ? newShipmentCodes : [""],
    }));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter" && formData.shipmentCodes[index].trim() !== "") {
      e.preventDefault();
      const nextIndex = index + 1;
      if (nextIndex < formData.shipmentCodes.length) {
        inputRefs.current[nextIndex]?.focus();
      } else {
        addShipmentCode();
        setTimeout(() => inputRefs.current[nextIndex]?.focus(), 0);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const filteredShipmentCodes = formData.shipmentCodes.filter(
        (code) => code.trim() !== ""
      );

      if (filteredShipmentCodes.length === 0) {
        setError("Please enter at least one shipment code.");
        setLoading(false);
        return;
      }

      const packingData = {
        destinationId: parseInt(formData.destinationId),
        shipmentCodes: filteredShipmentCodes,
      };

      const response = await createPackingService(packingData);
      setResult(response);

      setFormData({
        destinationId: "",
        shipmentCodes: [""],
      });

      setTimeout(() => inputRefs.current[0]?.focus(), 0);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "An unknown error occurred.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header - đồng bộ style với các màn khác */}
        <div className="bg-blue-600 rounded-xl shadow-sm p-5 mb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">
                  Create Packing
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Form Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            {/* <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-gray-700" />
              <h2 className="text-base font-semibold text-gray-800">
                Packing details
              </h2>
            </div> */}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Destination Selection */}
              <div>
                <label
                  htmlFor="destinationId"
                  className="block text-xl font-medium text-gray-700 mb-2 flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-blue-500" />
                  Select destination <span className="text-red-500">*</span>
                </label>
                {loadingDestinations ? (
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                    <span className="text-gray-500 text-sm">Loading...</span>
                  </div>
                ) : (
                  <select
                    id="destinationId"
                    name="destinationId"
                    value={formData.destinationId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="">Select destination</option>
                    {destinations.map((destination) => (
                      <option
                        key={destination.destinationId}
                        value={destination.destinationId}
                      >
                        {destination.destinationName}
                      </option>
                    ))}
                  </select>
                )}
                {destinations.length === 0 && !loadingDestinations && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    No destination found.
                  </p>
                )}
              </div>

              {/* Shipment Codes */}
              <div>
                <label className="block text-xl font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Barcode className="w-4 h-4 text-blue-500" />
                  Shipment codes <span className="text-red-500">*</span>
                </label>
                <p className="text-xs font-medium text-gray-500 mb-3">
                  You can type or scan barcode. Press Enter to jump to the next
                  field.
                </p>
                <div className="space-y-3">
                  {formData.shipmentCodes.map((code, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          ref={(el) => (inputRefs.current[index] = el)}
                          value={code}
                          onChange={(e) =>
                            handleShipmentCodeChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          placeholder={`Shipment code ${index + 1}`}
                          className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                      {formData.shipmentCodes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeShipmentCode(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove shipment code"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addShipmentCode}
                    className="w-full py-2.5 px-4 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add shipment code
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !formData.destinationId}
                className="w-full py-2.5 px-6 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Package className="w-4 h-4" />
                    Create packing
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Result / Error / Guide */}
          <div className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Success Result */}
            {result && (
              <div className="bg-white rounded-xl shadow-sm border border-green-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="text-sm font-semibold text-green-800">
                    Packing created
                  </h3>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Packing ID
                    </span>
                    <span className="font-semibold">{result.packingId}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Barcode className="w-4 h-4" />
                      Packing Code
                    </span>
                    <span className="font-mono text-blue-600 font-semibold">
                      {result.packingCode}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                    <span className="text-gray-600">Flight Code</span>
                    <span className="font-semibold">
                      {result.flightCode || (
                        <span className="text-yellow-600">
                          Not assigned yet
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                    <span className="text-gray-600">Packing date</span>
                    <span className="font-semibold">
                      {new Date(result.packedDate).toLocaleString("en-US")}
                    </span>
                  </div>
                  <div className="pt-1.5">
                    <span className="text-gray-600 block mb-1.5 font-medium">
                      Shipment code list
                    </span>
                    <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                      {result.packingList.map((item, index) => (
                        <div
                          key={index}
                          className="font-mono text-xs py-1 flex items-center gap-2"
                        >
                          <Barcode className="w-3 h-3 text-gray-400" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            {!result && !error && (
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Packing guide
                </h3>
                <ol className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="font-bold min-w-[18px]">1.</span>
                    <span>Select a destination from the list.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold min-w-[18px]">2.</span>
                    <span>
                      Enter shipment codes manually or scan barcodes. Press
                      Enter after each code to move to the next field.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold min-w-[18px]">3.</span>
                    <span>Click &quot;Create packing&quot; to save.</span>
                  </li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePacking;
