import { User } from "firebase/auth";
import { Ingredient } from "../types/ingredient";
import { useState } from "react";
import axios from "axios";

interface Props {
  ingredients: Ingredient[];
  user: User | null
  onRefresh: () => void
}

const IngredientList: React.FC<Props> = ({ ingredients, user, onRefresh }) => {
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editIsAllowed, setEditIsAllowed] = useState<boolean>(false);

  if (ingredients.length === 0) {
    return <p className="text-gray-500">No ingredients found.</p>;
  }

  
  const startEdit = (ingredient: Ingredient) => {
    setEditId(ingredient.id);
    console.log("Editing ingredient with ID: -", editId);
    setEditName(ingredient.name);
    console.log("editname", editName)
    setEditIsAllowed(ingredient.isAllowed);
    console.log("is it allowed", editIsAllowed)
  }
  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditIsAllowed(false);
  }

  const saveEdit = async () => {
    if(editId === null){
      alert("None found")
      return;
    }
    try{
      await axios.put(`http://localhost:8080/ingredients/${editId}`, {
        name: editName,
        isAllowed: editIsAllowed
      });
     cancelEdit();
     onRefresh();
    }
    catch (err) {
      console.error("Failed to update ingredient:", err);
      alert("Error updating ingredient.");
    }
  }
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`http://localhost:8080/ingredients/${id}`);
      onRefresh();
    } catch (err) {
      console.error("Failed to delete ingredient", err);
      alert("Delete failed.");
    }
  };

  return (
    <div className="grid gap-4 mt-4">
      {ingredients.map((ingredient) => (
        <div
          key={ingredient.id}
          className={`p-4 rounded-xl shadow border flex justify-between items-center ${
            ingredient.isAllowed ? "bg-green-100" : "bg-red-100"
          }`}
        >
         {editId === ingredient.id ? (
  <div className="flex flex-col w-full gap-2">
    <input
      className="border p-2 rounded"
      value={editName}
      onChange={(e) => setEditName(e.target.value)}
    />
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={editIsAllowed}
        onChange={(e) => setEditIsAllowed(e.target.checked)}
      />
      Allowed on Ekadashi
    </label>
    <div className="flex gap-2">
      <button className="bg-green-600 text-white px-3 py-1 text-sm rounded" onClick={saveEdit}>
        Save
      </button>
      <button className="bg-gray-400 text-white px-3 py-1 text-sm rounded" onClick={cancelEdit}>
        Cancel
      </button>
    </div>
  </div>
) : (
  <>
    <div>
      <p className="text-lg font-medium">{ingredient.name}</p>
      <p className={`text-sm ${ingredient.isAllowed ? "text-green-700" : "text-red-700"}`}>
        {ingredient.isAllowed ? "Allowed" : "Not Allowed"}
      </p>
    </div>

    {user && (
      <div className="flex gap-2">
        <button
          className="px-2 py-1 text-sm bg-yellow-500 text-white rounded"
          onClick={() => startEdit(ingredient)}
        >
          Edit
        </button>
        <button
          className="px-2 py-1 text-sm bg-red-600 text-white rounded"
          onClick={() => handleDelete(ingredient.id)}
        >
          Delete
        </button>
      </div>
    )}
  </>
)}

        </div>
      ))}
    </div>
  );
};

export default IngredientList;
