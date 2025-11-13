import React, { useState, useEffect } from "react";

interface StallFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (stall: any) => void;
  initialData?: any;
}

const StallFormModal: React.FC<StallFormModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [stallName, setStallName] = useState("");
  const [size, setSize] = useState("SMALL");
  const [dimension, setDimension] = useState(10);
  const [price, setPrice] = useState(100);
  const [status, setStatus] = useState("AVAILABLE");

  useEffect(() => {
    if (initialData) {
      setStallName(initialData.stallName);
      setSize(initialData.size);
      setDimension(initialData.dimension);
      setPrice(initialData.price);
      setStatus(initialData.status);
    }
  }, [initialData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{initialData ? "Edit Stall" : "Add Stall"}</h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Stall Name"
            className="w-full p-2 border rounded"
            value={stallName}
            onChange={(e) => setStallName(e.target.value)}
          />
          <select className="w-full p-2 border rounded" value={size} onChange={(e) => setSize(e.target.value)}>
            <option value="SMALL">SMALL</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LARGE">LARGE</option>
          </select>
          <input
            type="number"
            placeholder="Dimension"
            className="w-full p-2 border rounded"
            value={dimension}
            onChange={(e) => setDimension(Number(e.target.value))}
          />
          <input
            type="number"
            placeholder="Price"
            className="w-full p-2 border rounded"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
          <select className="w-full p-2 border rounded" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="RESERVED">RESERVED</option>
            <option value="MAINTENANCE">MAINTENANCE</option>
          </select>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button className="px-4 py-2 rounded bg-gray-400 text-white" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-teal-600 text-white"
            onClick={() => {
              onSubmit({ id: initialData?.id, stallName, size, dimension, price, status });
              onClose();
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default StallFormModal;
