// import React, { useState, useEffect, useRef } from "react";
// import {
//   Package,
//   MapPin,
//   Barcode,
//   Plus,
//   CheckCircle,
//   AlertCircle,
//   Loader2,
//   X,
//   FileText,
//   Download,
// } from "lucide-react";
// import {
//   createPackingService,
//   checkPackingCodesService,
// } from "../../Services/Warehouse/createpackingService";
// import managerDestinationService from "../../Services/Manager/managerDestinationService";
// import CheckCreatePacking from "./CheckCreatePacking";
// import * as XLSX from "xlsx";

// const CreatePacking = () => {
//   const [destinations, setDestinations] = useState([]);
//   const [loadingDestinations, setLoadingDestinations] = useState(true);
//   const [formData, setFormData] = useState({
//     destinationId: "",
//     shipmentCodes: [""],
//   });
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState("");
//   const [showConfirmDialog, setShowConfirmDialog] = useState(false);
//   const [checkResult, setCheckResult] = useState(null);

//   const inputRefs = useRef([]);
//   const scrollContainerRef = useRef(null);

//   useEffect(() => {
//     fetchDestinations();
//   }, []);

//   useEffect(() => {
//     inputRefs.current = inputRefs.current.slice(
//       0,
//       formData.shipmentCodes.length
//     );
//   }, [formData.shipmentCodes.length]);

//   useEffect(() => {
//     if (inputRefs.current[0]) {
//       inputRefs.current[0].focus();
//     }
//   }, []);

//   useEffect(() => {
//     if (scrollContainerRef.current && formData.shipmentCodes.length > 15) {
//       scrollContainerRef.current.scrollTop =
//         scrollContainerRef.current.scrollHeight;
//     }
//   }, [formData.shipmentCodes.length]);

//   const fetchDestinations = async () => {
//     try {
//       const data = await managerDestinationService.getDestinations();
//       setDestinations(data);
//     } catch {
//       setError("Cannot load destination list.");
//     } finally {
//       setLoadingDestinations(false);
//     }
//   };

//   const exportToExcel = (packingData) => {
//     try {
//       const formattedDate = new Date(packingData.packedDate).toLocaleString(
//         "en-US",
//         {
//           year: "numeric",
//           month: "2-digit",
//           day: "2-digit",
//         }
//       );

//       const headerData = [
//         ["PACKING INFORMATION"],
//         [],
//         ["Packing ID:", packingData.packingId],
//         ["Packing Code:", packingData.packingCode],
//         ["Flight Code:", packingData.flightCode || "Not Assigned Yet"],
//         ["Status:", packingData.status],
//         ["Packed Date:", formattedDate],
//         ["Total Shipments:", packingData.packingList.length],
//         [],
//         ["SHIPMENT CODE LIST"],
//         ["No.", "Shipment Code"],
//       ];

//       const shipmentData = packingData.packingList.map((code, index) => [
//         index + 1,
//         code,
//       ]);

//       const allData = [...headerData, ...shipmentData];
//       const ws = XLSX.utils.aoa_to_sheet(allData);

//       ws["!cols"] = [{ wch: 20 }, { wch: 30 }];

//       if (ws["A1"]) {
//         ws["A1"].s = {
//           font: { bold: true, sz: 14 },
//           alignment: { horizontal: "center" },
//         };
//       }

//       ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];

//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Packing Details");

//       const filename = `Packing_${packingData.packingCode}.xlsx`;
//       XLSX.writeFile(wb, filename);

//       console.log("Excel file exported successfully:", filename);
//     } catch (error) {
//       console.error("Error exporting to Excel:", error);
//       setError("Failed to export Excel file. Please try again.");
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleShipmentCodeChange = (index, value) => {
//     const newShipmentCodes = [...formData.shipmentCodes];
//     newShipmentCodes[index] = value;
//     setFormData((prev) => ({ ...prev, shipmentCodes: newShipmentCodes }));
//   };

//   const addShipmentCode = () => {
//     setFormData((prev) => ({
//       ...prev,
//       shipmentCodes: [...prev.shipmentCodes, ""],
//     }));
//   };

//   const removeShipmentCode = (index) => {
//     const newShipmentCodes = formData.shipmentCodes.filter(
//       (_, i) => i !== index
//     );
//     setFormData((prev) => ({
//       ...prev,
//       shipmentCodes: newShipmentCodes.length > 0 ? newShipmentCodes : [""],
//     }));
//   };

//   const handleKeyDown = (e, index) => {
//     if (e.key === "Enter" && formData.shipmentCodes[index].trim() !== "") {
//       e.preventDefault();
//       const nextIndex = index + 1;
//       if (nextIndex < formData.shipmentCodes.length) {
//         inputRefs.current[nextIndex]?.focus();
//       } else {
//         addShipmentCode();
//         setTimeout(() => inputRefs.current[nextIndex]?.focus(), 0);
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setCheckResult(null);

//     const filteredShipmentCodes = formData.shipmentCodes.filter(
//       (code) => code.trim() !== ""
//     );

//     if (filteredShipmentCodes.length === 0) {
//       setError("Please enter at least one shipment code.");
//       return;
//     }

//     // Show dialog and start checking
//     setShowConfirmDialog(true);
//     setLoading(true);

//     try {
//       // Call check API
//       const result = await checkPackingCodesService(filteredShipmentCodes);
//       setCheckResult(result);
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.error ||
//         err.response?.data?.message ||
//         err.message ||
//         "Failed to validate shipment codes.";
//       setError(errorMessage);
//       setShowConfirmDialog(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleConfirmCreate = async () => {
//     setLoading(true);
//     setError("");
//     setResult(null);

//     try {
//       const filteredShipmentCodes = formData.shipmentCodes.filter(
//         (code) => code.trim() !== ""
//       );

//       const packingData = {
//         destinationId: parseInt(formData.destinationId),
//         shipmentCodes: filteredShipmentCodes,
//       };

//       const response = await createPackingService(packingData);
//       setResult(response);

//       // Auto export to Excel after successful creation
//       exportToExcel(response);

//       // Close dialog
//       setShowConfirmDialog(false);
//       setCheckResult(null);

//       // Reset form
//       setFormData({
//         destinationId: "",
//         shipmentCodes: [""],
//       });

//       setTimeout(() => inputRefs.current[0]?.focus(), 0);
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.error ||
//         err.response?.data?.message ||
//         err.message ||
//         "An unknown error occurred.";
//       setError(errorMessage);
//       setShowConfirmDialog(false);
//       setCheckResult(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getSelectedDestinationName = () => {
//     const selected = destinations.find(
//       (d) => d.destinationId === parseInt(formData.destinationId)
//     );
//     return selected ? selected.destinationName : "";
//   };

//   const handleManualDownload = () => {
//     if (result) {
//       exportToExcel(result);
//     }
//   };

//   return (
//     <div className="p-6 min-h-screen">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="bg-blue-600 rounded-xl shadow-sm p-5 mb-5">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
//                 <Package className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-xl font-semibold text-white">
//                   Create Packing
//                 </h1>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid lg:grid-cols-2 gap-6">
//           {/* Form Card */}
//           <div className="bg-white border border-gray-200 rounded-xl p-5">
//             <form onSubmit={handleSubmit} className="space-y-5">
//               {/* Destination Selection */}
//               <div>
//                 <label
//                   htmlFor="destinationId"
//                   className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
//                 >
//                   <MapPin className="w-4 h-4 text-blue-500" />
//                   Select Destination <span className="text-red-500">*</span>
//                 </label>
//                 {loadingDestinations ? (
//                   <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center gap-2">
//                     <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
//                     <span className="text-gray-500 text-sm">Loading...</span>
//                   </div>
//                 ) : (
//                   <select
//                     id="destinationId"
//                     name="destinationId"
//                     value={formData.destinationId}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                   >
//                     <option value="">Select Destination</option>
//                     {destinations.map((destination) => (
//                       <option
//                         key={destination.destinationId}
//                         value={destination.destinationId}
//                       >
//                         {destination.destinationName}
//                       </option>
//                     ))}
//                   </select>
//                 )}
//                 {destinations.length === 0 && !loadingDestinations && (
//                   <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
//                     <AlertCircle className="w-4 h-4" />
//                     No destination found.
//                   </p>
//                 )}
//               </div>

//               {/* Shipment Codes */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                   <Barcode className="w-4 h-4 text-blue-500" />
//                   Shipment Codes <span className="text-red-500">*</span>
//                 </label>
//                 <p className="text-xs text-gray-500 mb-3">
//                   You can type or scan barcode. Press Enter to jump to the next
//                   field.
//                 </p>

//                 <div
//                   ref={scrollContainerRef}
//                   className={`space-y-3 ${
//                     formData.shipmentCodes.length > 15
//                       ? "max-h-[400px] overflow-y-auto pr-2"
//                       : ""
//                   }`}
//                   style={{
//                     scrollbarWidth: "thin",
//                     scrollbarColor: "#3b82f6 #e5e7eb",
//                   }}
//                 >
//                   {formData.shipmentCodes.map((code, index) => (
//                     <div key={index} className="flex items-center gap-3">
//                       <div className="relative flex-1">
//                         <input
//                           type="text"
//                           ref={(el) => (inputRefs.current[index] = el)}
//                           value={code}
//                           onChange={(e) =>
//                             handleShipmentCodeChange(index, e.target.value)
//                           }
//                           onKeyDown={(e) => handleKeyDown(e, index)}
//                           placeholder={`Shipment Code ${index + 1}`}
//                           className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                         />
//                       </div>
//                       {formData.shipmentCodes.length > 1 && (
//                         <button
//                           type="button"
//                           onClick={() => removeShipmentCode(index)}
//                           className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
//                           title="Remove Shipment Code"
//                         >
//                           <X className="w-4 h-4" />
//                         </button>
//                       )}
//                     </div>
//                   ))}
//                 </div>

//                 <button
//                   type="button"
//                   onClick={addShipmentCode}
//                   className="w-full mt-3 py-2.5 px-4 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
//                 >
//                   <Plus className="w-4 h-4" />
//                   Add Shipment Code
//                 </button>

//                 {formData.shipmentCodes.length > 15 && (
//                   <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
//                     <Barcode className="w-3 h-3" />
//                     <span>
//                       {
//                         formData.shipmentCodes.filter((c) => c.trim() !== "")
//                           .length
//                       }{" "}
//                       shipment codes entered
//                     </span>
//                   </div>
//                 )}
//               </div>

//               {/* Submit */}
//               <button
//                 type="submit"
//                 disabled={loading || !formData.destinationId}
//                 className="w-full py-2.5 px-6 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                     Validating...
//                   </>
//                 ) : (
//                   <>
//                     <Package className="w-4 h-4" />
//                     Create Packing
//                   </>
//                 )}
//               </button>
//             </form>
//           </div>

//           {/* Right Column */}
//           <div className="space-y-4">
//             {error && (
//               <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
//                 <div className="flex items-center gap-2">
//                   <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
//                   <p className="text-sm text-red-700">{error}</p>
//                 </div>
//               </div>
//             )}

//             {result && (
//               <div className="bg-white rounded-xl shadow-sm border border-green-200 p-5">
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex items-center gap-2">
//                     <CheckCircle className="w-5 h-5 text-green-600" />
//                     <h3 className="text-sm font-semibold text-green-800">
//                       Packing Created Successfully
//                     </h3>
//                   </div>
//                   <button
//                     onClick={handleManualDownload}
//                     className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1.5"
//                     title="Download Excel Again"
//                   >
//                     <Download className="w-3.5 h-3.5" />
//                     Download Excel
//                   </button>
//                 </div>

//                 <div className="space-y-3 text-sm">
//                   <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
//                     <span className="text-gray-600 flex items-center gap-2">
//                       <Package className="w-4 h-4" />
//                       Packing ID
//                     </span>
//                     <span className="font-semibold">{result.packingId}</span>
//                   </div>
//                   <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
//                     <span className="text-gray-600 flex items-center gap-2">
//                       <Barcode className="w-4 h-4" />
//                       Packing Code
//                     </span>
//                     <span className="font-mono text-blue-600 font-semibold">
//                       {result.packingCode}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
//                     <span className="text-gray-600">Flight Code</span>
//                     <span className="font-semibold">
//                       {result.flightCode || (
//                         <span className="text-yellow-600">
//                           Not Assigned Yet
//                         </span>
//                       )}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
//                     <span className="text-gray-600">Packing Date</span>
//                     <span className="font-semibold">
//                       {new Date(result.packedDate).toLocaleString("en-US")}
//                     </span>
//                   </div>
//                   <div className="pt-1.5">
//                     <span className="text-gray-600 block mb-1.5 font-medium">
//                       Shipment Code List ({result.packingList.length})
//                     </span>
//                     <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto">
//                       {result.packingList.map((item, index) => (
//                         <div
//                           key={index}
//                           className="font-mono text-xs py-1 flex items-center gap-2"
//                         >
//                           <Barcode className="w-3 h-3 text-gray-400" />
//                           {item}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//             {!result && !error && (
//               <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
//                 <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
//                   <FileText className="w-4 h-4" />
//                   Packing Guide
//                 </h3>
//                 <ol className="space-y-2 text-sm text-blue-800">
//                   <li className="flex items-start gap-2">
//                     <span className="font-bold min-w-[18px]">1.</span>
//                     <span>Select a destination from the list.</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span className="font-bold min-w-[18px]">2.</span>
//                     <span>
//                       Enter shipment codes manually or scan barcodes. Press
//                       Enter after each code to move to the next field.
//                     </span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span className="font-bold min-w-[18px]">3.</span>
//                     <span>
//                       Click &quot;Create Packing&quot; - the system will
//                       validate all codes.
//                     </span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span className="font-bold min-w-[18px]">4.</span>
//                     <span>
//                       Review validation results. Fix any errors before
//                       proceeding.
//                     </span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span className="font-bold min-w-[18px]">5.</span>
//                     <span>
//                       Excel file will be automatically downloaded after
//                       successful creation.
//                     </span>
//                   </li>
//                 </ol>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Confirmation Dialog */}
//       <CheckCreatePacking
//         isOpen={showConfirmDialog}
//         onClose={() => {
//           setShowConfirmDialog(false);
//           setCheckResult(null);
//         }}
//         onConfirm={handleConfirmCreate}
//         loading={loading}
//         checkResult={checkResult}
//         data={{
//           destinationName: getSelectedDestinationName(),
//           shipmentCodes: formData.shipmentCodes,
//         }}
//       />

//       <style>
//         {`
//       div::-webkit-scrollbar {
//         width: 8px;
//       }
//       div::-webkit-scrollbar-track {
//         background: #e5e7eb;
//         border-radius: 4px;
//       }
//       div::-webkit-scrollbar-thumb {
//         background: #3b82f6;
//         border-radius: 4px;
//       }
//       div::-webkit-scrollbar-thumb:hover {
//         background: #2563eb;
//       }
//     `}
//       </style>
//     </div>
//   );
// };
// export default CreatePacking;
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
  Download,
} from "lucide-react";
import {
  createPackingService,
  checkPackingCodesService,
} from "../../Services/Warehouse/createpackingService";
import managerDestinationService from "../../Services/Manager/managerDestinationService";
import CheckCreatePacking from "./CheckCreatePacking";
import * as XLSX from "xlsx";

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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [checkResult, setCheckResult] = useState(null);

  const inputRefs = useRef([]);
  const scrollContainerRef = useRef(null);

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

  useEffect(() => {
    if (scrollContainerRef.current && formData.shipmentCodes.length > 15) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [formData.shipmentCodes.length]);

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

  const exportToExcel = (packingData) => {
    try {
      const formattedDate = new Date(packingData.packedDate).toLocaleString(
        "en-US",
        {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }
      );

      const headerData = [
        ["PACKING INFORMATION"],
        [],
        ["Packing ID:", packingData.packingId],
        ["Packing Code:", packingData.packingCode],
        ["Flight Code:", packingData.flightCode || "Not Assigned Yet"],
        ["Status:", packingData.status],
        ["Packed Date:", formattedDate],
        ["Total Shipments:", packingData.packingList.length],
        [],
        ["SHIPMENT CODE LIST"],
        ["No.", "Shipment Code"],
      ];

      const shipmentData = packingData.packingList.map((code, index) => [
        index + 1,
        code,
      ]);

      const allData = [...headerData, ...shipmentData];
      const ws = XLSX.utils.aoa_to_sheet(allData);

      ws["!cols"] = [{ wch: 20 }, { wch: 30 }];

      if (ws["A1"]) {
        ws["A1"].s = {
          font: { bold: true, sz: 14 },
          alignment: { horizontal: "center" },
        };
      }

      ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Packing Details");

      const filename = `Packing_${packingData.packingCode}.xlsx`;
      XLSX.writeFile(wb, filename);

      console.log("Excel file exported successfully:", filename);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      setError("Failed to export Excel file. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleShipmentCodeChange = (index, value) => {
    const newShipmentCodes = [...formData.shipmentCodes];
    // Tự động chuyển thành chữ hoa
    newShipmentCodes[index] = value.toUpperCase();
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
    setError("");
    setCheckResult(null);

    const filteredShipmentCodes = formData.shipmentCodes.filter(
      (code) => code.trim() !== ""
    );

    if (filteredShipmentCodes.length === 0) {
      setError("Please enter at least one shipment code.");
      return;
    }

    // Show dialog and start checking
    setShowConfirmDialog(true);
    setLoading(true);

    try {
      // Call check API
      const result = await checkPackingCodesService(filteredShipmentCodes);
      setCheckResult(result);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to validate shipment codes.";
      setError(errorMessage);
      setShowConfirmDialog(false);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCreate = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const filteredShipmentCodes = formData.shipmentCodes.filter(
        (code) => code.trim() !== ""
      );

      const packingData = {
        destinationId: parseInt(formData.destinationId),
        shipmentCodes: filteredShipmentCodes,
      };

      const response = await createPackingService(packingData);
      setResult(response);

      // Auto export to Excel after successful creation
      exportToExcel(response);

      // Close dialog
      setShowConfirmDialog(false);
      setCheckResult(null);

      // Reset form
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
      setShowConfirmDialog(false);
      setCheckResult(null);
    } finally {
      setLoading(false);
    }
  };

  const getSelectedDestinationName = () => {
    const selected = destinations.find(
      (d) => d.destinationId === parseInt(formData.destinationId)
    );
    return selected ? selected.destinationName : "";
  };

  const handleManualDownload = () => {
    if (result) {
      exportToExcel(result);
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
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
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Destination Selection */}
              <div>
                <label
                  htmlFor="destinationId"
                  className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-blue-500" />
                  Select Destination <span className="text-red-500">*</span>
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
                    <option value="">Select Destination</option>
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
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Barcode className="w-4 h-4 text-blue-500" />
                  Shipment Codes <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  You can type or scan barcode.
                </p>

                <div
                  ref={scrollContainerRef}
                  className={`space-y-3 ${
                    formData.shipmentCodes.length > 15
                      ? "max-h-[400px] overflow-y-auto pr-2"
                      : ""
                  }`}
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#3b82f6 #e5e7eb",
                  }}
                >
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
                          placeholder={`Shipment Code ${index + 1}`}
                          className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none uppercase font-mono"
                        />
                      </div>
                      {formData.shipmentCodes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeShipmentCode(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove Shipment Code"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addShipmentCode}
                  className="w-full mt-3 py-2.5 px-4 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Shipment Code
                </button>

                {formData.shipmentCodes.length > 15 && (
                  <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                    <Barcode className="w-3 h-3" />
                    <span>
                      {
                        formData.shipmentCodes.filter((c) => c.trim() !== "")
                          .length
                      }{" "}
                      shipment codes entered
                    </span>
                  </div>
                )}
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
                    Validating...
                  </>
                ) : (
                  <>
                    <Package className="w-4 h-4" />
                    Create Packing
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {result && (
              <div className="bg-white rounded-xl shadow-sm border border-green-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="text-sm font-semibold text-green-800">
                      Packing Created Successfully
                    </h3>
                  </div>
                  <button
                    onClick={handleManualDownload}
                    className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1.5"
                    title="Download Excel Again"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Excel
                  </button>
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
                          Not Assigned Yet
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                    <span className="text-gray-600">Packing Date</span>
                    <span className="font-semibold">
                      {new Date(result.packedDate).toLocaleString("en-US")}
                    </span>
                  </div>
                  <div className="pt-1.5">
                    <span className="text-gray-600 block mb-1.5 font-medium">
                      Shipment Code List ({result.packingList.length})
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

            {!result && !error && (
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Packing Guide
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
                    <span>
                      Click &quot;Create Packing&quot; - the system will
                      validate all codes.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold min-w-[18px]">4.</span>
                    <span>
                      Review validation results. Fix any errors before
                      proceeding.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold min-w-[18px]">5.</span>
                    <span>
                      Excel file will be automatically downloaded after
                      successful creation.
                    </span>
                  </li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <CheckCreatePacking
        isOpen={showConfirmDialog}
        onClose={() => {
          setShowConfirmDialog(false);
          setCheckResult(null);
        }}
        onConfirm={handleConfirmCreate}
        loading={loading}
        checkResult={checkResult}
        data={{
          destinationName: getSelectedDestinationName(),
          shipmentCodes: formData.shipmentCodes,
        }}
      />

      <style>
        {`
          div::-webkit-scrollbar {
            width: 8px;
          }
          div::-webkit-scrollbar-track {
            background: #e5e7eb;
            border-radius: 4px;
          }
          div::-webkit-scrollbar-thumb {
            background: #3b82f6;
            border-radius: 4px;
          }
          div::-webkit-scrollbar-thumb:hover {
            background: #2563eb;
          }
        `}
      </style>
    </div>
  );
};

export default CreatePacking;
