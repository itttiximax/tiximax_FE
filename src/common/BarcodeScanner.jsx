import React, { useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

const BarcodeScanner = ({ onDetected }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    codeReader.listVideoInputDevices().then((devices) => {
      if (devices.length > 0) {
        const selectedDeviceId = devices[0].deviceId;

        codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (res, err) => {
            if (res) {
              onDetected(res.getText()); // gọi callback truyền ra ngoài
            }
          }
        );
      }
    });

    return () => {
      codeReader.reset();
    };
  }, [onDetected]);

  return (
    <div>
      <video
        ref={videoRef}
        width="300"
        height="200"
        style={{ border: "1px solid gray" }}
      />
    </div>
  );
};

export default BarcodeScanner;
