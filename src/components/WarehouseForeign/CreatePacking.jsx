import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const data = await managerDestinationService.getDestinations();
      setDestinations(data);
    } catch {
      setError("Failed to load destinations");
    } finally {
      setLoadingDestinations(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleShipmentCodeChange = (index, value) => {
    const newShipmentCodes = [...formData.shipmentCodes];
    newShipmentCodes[index] = value;
    setFormData((prev) => ({
      ...prev,
      shipmentCodes: newShipmentCodes,
    }));
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
        setError("Please enter at least one shipment code");
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
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Create Packing
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Packing Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Destination Selection */}
              <div>
                <label
                  htmlFor="destinationId"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Destination
                </label>
                {loadingDestinations ? (
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                    <span className="text-gray-500">
                      Loading destinations...
                    </span>
                  </div>
                ) : (
                  <select
                    id="destinationId"
                    name="destinationId"
                    value={formData.destinationId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
                  <p className="text-sm text-red-500 mt-1">
                    No destinations available
                  </p>
                )}
              </div>

              {/* Shipment Codes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shipment Codes
                </label>
                <div className="space-y-3">
                  {formData.shipmentCodes.map((code, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={code}
                        onChange={(e) =>
                          handleShipmentCodeChange(index, e.target.value)
                        }
                        placeholder={`Shipment code ${index + 1}`}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {formData.shipmentCodes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeShipmentCode(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
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
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addShipmentCode}
                    className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                  >
                    + Add Another Shipment Code
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !formData.destinationId}
                className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Creating..." : "Create Packing"}
              </button>
            </form>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-400 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            {result && (
              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-400">
                <div className="flex items-center mb-4">
                  <svg
                    className="w-6 h-6 text-green-500 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-green-800">
                    Packing Created Successfully!
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Packing ID:</span>
                    <span className="font-semibold">{result.packingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Packing Code:</span>
                    <span className="font-mono text-blue-600">
                      {result.packingCode}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Flight Code:</span>
                    <span className="font-semibold">
                      {result.flightCode || (
                        <span className="text-yellow-600">Not assigned</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Packed Date:</span>
                    <span className="font-semibold">
                      {new Date(result.packedDate).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 block mb-2">
                      Packing List:
                    </span>
                    <div className="bg-gray-50 rounded p-3">
                      {result.packingList.map((item, index) => (
                        <div key={index} className="font-mono text-sm">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!result && !error && (
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  Instructions
                </h3>
                <ol className="space-y-2 text-blue-700">
                  <li>1. Select a destination from the dropdown</li>
                  <li>2. Add shipment codes</li>
                  <li>3. Click create to generate packing</li>
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
