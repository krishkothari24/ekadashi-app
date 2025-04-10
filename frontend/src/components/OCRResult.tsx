interface Props {
    text: string;
  }
  
  const OCRResult: React.FC<Props> = ({ text }) => {
    return (
      <div className="mt-4 bg-gray-100 p-4 rounded shadow max-w-sm mx-auto">
        <h2 className="text-lg font-semibold mb-2">OCR Result</h2>
        <p className="whitespace-pre-wrap">{text}</p>
      </div>
    );
  };
  
  export default OCRResult;
  