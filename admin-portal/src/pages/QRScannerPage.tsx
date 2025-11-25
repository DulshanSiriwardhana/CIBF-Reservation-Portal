import React, { useEffect, useRef, useState, useCallback } from "react";
import jsQR from "jsqr";
import { FiCameraOff, FiRefreshCw, FiUpload, FiCheckCircle } from "react-icons/fi";
import { apiService } from "../services/api";
import { useToast } from "../context/ToastContext";

type VerificationState = {
  status: "idle" | "success" | "error";
  message?: string;
  reservation?: any;
};

const QRScannerPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const streamRef = useRef<MediaStream | null>(null);
  const lastVerifiedCodeRef = useRef<string | null>(null);

  const [cameraError, setCameraError] = useState<string | null>(null);
  const [decodedValue, setDecodedValue] = useState<string | null>(null);
  const [verification, setVerification] = useState<VerificationState>({ status: "idle" });
  const [manualCode, setManualCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const { showToast } = useToast();

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const scanFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) {
      animationRef.current = requestAnimationFrame(scanFrame);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationRef.current = requestAnimationFrame(scanFrame);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });

    if (qrCode && qrCode.data) {
      setDecodedValue((prev) => {
        if (prev !== qrCode.data) {
          return qrCode.data;
        }
        return prev;
      });
    }

    animationRef.current = requestAnimationFrame(scanFrame);
  }, []);

  useEffect(() => {
    const initializeCamera = async () => {
      try {
        // Try environment camera first (back camera on mobile)
        let stream: MediaStream | null = null;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
          });
        } catch (envError) {
          // Fallback to any available camera
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
        }
        
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          // Wait for video to be ready before starting scan
          const handleLoadedMetadata = () => {
            if (videoRef.current) {
              videoRef.current.play()
                .then(() => {
                  scanFrame();
                })
                .catch((err) => {
                  console.error('Video play error:', err);
                  setCameraError("Unable to start camera. Please check permissions.");
                });
            }
          };
          
          videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
          
          // Also try to play immediately if metadata is already loaded
          if (videoRef.current.readyState >= 2) {
            handleLoadedMetadata();
          }
        }
        setCameraError(null);
      } catch (error) {
        console.error('Camera initialization error:', error);
        setCameraError("Unable to access camera. Please allow camera permissions or use image upload/manual code.");
      }
    };

    initializeCamera();
    return () => stopCamera();
  }, [scanFrame]);

  const verifyReservation = useCallback(async (code: string) => {
    setIsVerifying(true);
    setVerification({ status: "idle" });
    try {
      const reservation = await apiService.verifyReservationQr(code.trim());
      setVerification({
        status: "success",
        message: "Reservation verified successfully",
        reservation,
      });
      showToast("Reservation verified", "success");
    } catch (error: any) {
      setVerification({
        status: "error",
        message: error.message || "Failed to verify reservation",
      });
      showToast(error.message || "Failed to verify reservation", "error");
    } finally {
      setIsVerifying(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (decodedValue && decodedValue !== lastVerifiedCodeRef.current) {
      lastVerifiedCodeRef.current = decodedValue;
      verifyReservation(decodedValue);
    }
  }, [decodedValue, verifyReservation]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context) return;
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
        if (qrCode?.data) {
          setDecodedValue(qrCode.data);
          verifyReservation(qrCode.data);
        } else {
          showToast("Unable to read QR from image", "warning");
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) {
      showToast("Enter a code first", "warning");
      return;
    }
    setDecodedValue(manualCode.trim());
    verifyReservation(manualCode.trim());
  };

  const resetScanner = () => {
    setDecodedValue(null);
    setVerification({ status: "idle" });
    setManualCode("");
    lastVerifiedCodeRef.current = null;
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#02060d] pt-6 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#94a3b8]">Reservation security</p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white">QR Verification</h1>
          <p className="text-sm text-[#94a3b8]">Scan the QR sent to vendors to validate reservation authenticity.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#0b1320] border border-[#1f2b40] rounded-xl p-5 space-y-4">
            <div className="aspect-video bg-[#111e34] rounded-lg flex items-center justify-center overflow-hidden border border-[#1f2b40]">
              {cameraError ? (
                <div className="text-center px-6 py-8 text-[#94a3b8]">
                  <FiCameraOff className="w-8 h-8 mx-auto mb-3" />
                  <p className="text-sm">{cameraError}</p>
                </div>
              ) : (
                <video 
                  ref={videoRef} 
                  className="w-full h-full object-cover" 
                  playsInline 
                  autoPlay 
                  muted 
                />
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />

            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex-1 border border-[#1f2b40] rounded-lg px-4 py-3 text-sm text-[#e2e8f0] bg-[#111e34] cursor-pointer flex items-center gap-2 hover:border-[#20b368] transition-colors">
                <FiUpload className="w-4 h-4" />
                Upload QR Image
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
              <button
                onClick={resetScanner}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-[#1f2b40] rounded-lg text-sm text-[#94a3b8] hover:border-[#20b368] transition-colors"
              >
                <FiRefreshCw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>

          <div className="bg-[#0b1320] border border-[#1f2b40] rounded-xl p-5 space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#94a3b8] mb-1">Detected code</p>
              <div className="min-h-[64px] bg-[#111e34] border border-[#1f2b40] rounded-lg p-4 text-sm text-[#e2e8f0]">
                {decodedValue || "No QR detected yet"}
              </div>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-widest text-[#94a3b8]">Manual code</label>
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Enter reservation code"
                className="w-full px-4 py-3 bg-[#111e34] border border-[#1f2b40] rounded-lg text-sm text-white placeholder:text-[#475569] focus:outline-none focus:ring-2 focus:ring-[#20b368]/50 focus:border-[#20b368]"
              />
              <button
                type="submit"
                className="w-full py-3 bg-[#20b368] text-[#04110a] rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                disabled={isVerifying}
              >
                Verify Code
              </button>
            </form>

            <div className="pt-4 border-t border-[#1f2b40] space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#94a3b8]">Verification status</p>
              {verification.status === "success" && verification.reservation ? (
                <div className="rounded-lg border border-[#1f2b40] bg-[#111e34] p-4 text-sm text-white space-y-2">
                  <div className="flex items-center gap-2 text-[#20b368] font-semibold">
                    <FiCheckCircle className="w-4 h-4" />
                    {verification.message}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-[#94a3b8]">
                    <span>Reservation ID:</span>
                    <span className="text-white text-right">{verification.reservation.reservationId || "N/A"}</span>
                    <span>User:</span>
                    <span className="text-white text-right">{verification.reservation.userId || "N/A"}</span>
                    <span>Status:</span>
                    <span className="text-white text-right">{verification.reservation.status || "N/A"}</span>
                  </div>
                </div>
              ) : verification.status === "error" ? (
                <div className="rounded-lg border border-[#1f2b40] bg-[#1f0f19] p-4 text-sm text-[#f06363]">
                  {verification.message}
                </div>
              ) : (
                <p className="text-sm text-[#94a3b8]">Awaiting scan...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScannerPage;

