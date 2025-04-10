import { useEffect, useState } from "react";
import axios from "axios";
import CameraCapture from "./components/CameraCapture";
import CapturedImageDisplay from "./components/CapturedImageDisplay";
import OCRResult from "./components/OCRResult";
import AddIngredientForm from "./components/AddIngredientForm";
import AuthButtons from "./components/AuthButtons";
import { User } from "firebase/auth"
import IngredientList from "./components/IngredientList";
import fuzzysort from "fuzzysort";

interface Ingredient {
  id: number;
  name: string;
  isAllowed: boolean;
}


function App() {
  // State for ingredients fetched from the backend
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Holds the image captured from the webcam
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Holds the raw OCR result from the image
  const [ocrResult, setOcrResult] = useState<string>("");

  // List of matched ingredients found in the OCR text
  const [matchedIngredients, setMatchedIngredients] = useState<string[]>([]);

  // Indicates loading state while OCR is running
  const [isOcrLoading, setIsOcrLoading] = useState<boolean>(false);

  // auth state
  const [user, setUser] = useState<User | null>(null);

  useEffect(() =>{
    const fetchIngredients = async () => {
      try {
        const response = await axios.get("http://localhost:8080/ingredients");
        setIngredients(response.data);
        setLoading(false);
      } catch (error) {
        console.error("error fetching ingredients", error);
        setError("Error fetching ingredients");
        setLoading(false);
      }
    };
    fetchIngredients();
  }, [])

  // Run OCR on the captured image using Tesseract.js
  const runOCR = async () => {
    if (!capturedImage) return;

    setIsOcrLoading(true);           // Show loading indicator
    setOcrResult("Extracting text...");
    setMatchedIngredients([]);    // Clear any previous matches
    const Tesseract = await import("tesseract.js");

    try {
      // Run OCR on the base64 image
      const result = await Tesseract.recognize(capturedImage, "eng", {
        logger: (m) => console.log(m), // Log progress (optional)
      });

      const text = result.data.text;
      setOcrResult(text); // Save the raw text

      // Normalize OCR text: lowercase, remove punctuation, split into words
      const words = text
        .toLowerCase()
        .replace(/[^a-zA-Z\s]/g, "")
        .split(/\s+/)
        .filter(word => word.length > 2); // skip words  < 2

      const ingredientNames = ingredients.map((ing) => ing.name.toLowerCase());


      // Fuzzy match each OCR word to ingredient list
const matches: string[] = [];

words.forEach((word) => {
  const result = fuzzysort.go(word, ingredientNames, { threshold: -1000 });
  const best = result[0];

  if (best && best.score > -50) {
    matches.push(best.target);
  }
});

setMatchedIngredients([...new Set(matches)]);


      // Find any words that match known ingredients
      // const matches = words.filter((word) => ingredients.some((ing) => ing.name.toLowerCase() === word));
      // setMatchedIngredients([...new Set(matches)]); // Remove duplicates

    } catch (err) {
      console.error("OCR failed", err);
      setOcrResult("Failed to extract text.");
    }
    
    setIsOcrLoading(false); // Done
  };

  // Reset everything to take another photo
  const handleRetake = () => {
    setCapturedImage(null);
    setOcrResult("");
    setMatchedIngredients([]);
  };

  const refreshIngredients = () => {
    setLoading(true);
    axios.get("http://localhost:8080/ingredients")
      .then((res) => setIngredients(res.data))
      .catch(() => setError("Failed to refresh ingredients."))
      .finally(() => setLoading(false));
  };
  

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Ekadashi Scanner</h1>
      <AuthButtons onAuthChange={setUser} />
      {user && (
  <AddIngredientForm onIngredientAdded={() => {
    // Re-fetch ingredients after adding new one
    setLoading(true);
    axios.get("http://localhost:8080/ingredients")
      .then((res) => setIngredients(res.data))
      .catch(() => setError("Failed to refresh ingredients."))
      .finally(() => setLoading(false));
  }} />
)}

<IngredientList
  ingredients={ingredients}
  user={user}
  onRefresh={refreshIngredients}
/>


      {loading ? (
        <p>Loading ingredients...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {!capturedImage ? (
            <CameraCapture onCapture={setCapturedImage} />
          ) : (
            <CapturedImageDisplay
              imageData={capturedImage}
              onRunOCR={runOCR}
              onRetake={handleRetake}
              isLoading={isOcrLoading}
            />
          )}

          {ocrResult && <OCRResult text={ocrResult} />}

          {matchedIngredients.length > 0 && (
            <div className="mt-4 bg-green-100 p-4 rounded shadow">
              <h2 className="text-lg font-bold mb-2 text-green-700">Matched Ingredients</h2>
              <ul className="list-disc pl-5 text-green-800">
                {matchedIngredients.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}


export default App;
