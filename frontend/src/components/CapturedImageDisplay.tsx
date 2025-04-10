interface Props {
  imageData: string;
  onRunOCR: () => void;
  onRetake: () => void;
  isLoading: boolean;
}

const CapturedImageDisplay: React.FC<Props> = ({
  imageData,
  onRunOCR,
  onRetake,
  isLoading,
}) => {
  return (
    <div className="flex flex-col items-center gap-4 mt-4">
      <img src={imageData} alt="Captured" className="max-w-sm rounded shadow" />

      <div className="flex gap-4">
        <button
          onClick={onRunOCR}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          {isLoading ? "Running OCR..." : "Run OCR"}
        </button>

        <button
          onClick={onRetake}
          className="px-4 py-2 bg-gray-400 text-white rounded"
        >
          Retake Photo
        </button>
      </div>
    </div>
  );
};

export default CapturedImageDisplay;
