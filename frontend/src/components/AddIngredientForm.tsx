import { useState } from "react";
import axios from "axios";

interface Props {
  onIngredientAdded: () => void; // Called to refresh list after add
}

const AddIngredientForm: React.FC<Props> = ({ onIngredientAdded }) => {
  const [name, setName] = useState<string>("");
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset messages
    setError("");
    setSuccess("");

    
    // Basic validation
    if (!name.trim()) {
      setError("Ingredient name is required.");
      return;
    }
setIsSubmitting(true);
    try {
      await axios.post("http://localhost:8080/ingredients", {
        name,
        isAllowed,
      });

      // Clear form and notify parent to refresh list
      setSuccess("Ingredient Added")
      setName("");
      setIsAllowed(false);
      setError("");

      setTimeout(() => {
        setSuccess("");
      }, 900); // 3000 milliseconds = 3 seconds
  
      onIngredientAdded();
      setIsSubmitting(false);
    } catch (err) {
      console.error("Failed to add ingredient:", err);
      setError("Error adding ingredient.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow p-4 rounded mb-6">
      <h2 className="text-xl font-bold mb-2">Add New Ingredient</h2>

      <div className="mb-3">
        <label className="block mb-1 font-medium">Name</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="mb-3 flex items-center gap-2">
        <input
          type="checkbox"
          id="isAllowed"
          checked={isAllowed}
          onChange={(e) => setIsAllowed(e.target.checked)}
          disabled={isSubmitting}
        />
        <label htmlFor="isAllowed">Allowed on Ekadashi</label>
      </div>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <button
        type="submit"
        className={`px-4 py-2 rounded text-white ${
          isSubmitting ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
        }`}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Adding..." : "Add Ingredient"}
      </button>
    </form>
  );
};

export default AddIngredientForm;
