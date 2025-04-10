package handlers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/krishk/ekadashi-backend/db"
	"github.com/krishk/ekadashi-backend/models"
)

func GetIngredients(w http.ResponseWriter, r *http.Request) {
	var ingredients []models.Ingredient

	// Query all rows from the ingredients table
	result := db.DB.Find(&ingredients)
	if result.Error != nil {
		http.Error(w, "Error fetching ingredients", http.StatusInternalServerError)
		return
	}

	// Set response header
	w.Header().Set("Content-Type", "application/json")

	// Encode data to JSON and send to client
	json.NewEncoder(w).Encode(ingredients)
}

func CreateIngredient(w http.ResponseWriter, r *http.Request) {
	var newIngredient models.Ingredient

	// Decode JSON from request body into Go struct
	err := json.NewDecoder(r.Body).Decode(&newIngredient)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	// Save to the database
	result := db.DB.Create(&newIngredient)
	if result.Error != nil {
		http.Error(w, "Failed to create ingredient", http.StatusInternalServerError)
		return
	}

	// Respond with the created object
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(newIngredient)
}

func UpdateIngredient(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	log.Println(", id", id)
	var updatedIngredient models.Ingredient

	// Decode JSON from request body into Go struct
	// Decode request body into struct
	if err := json.NewDecoder(r.Body).Decode(&updatedIngredient); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	// Update in DB
	result := db.DB.Model(&models.Ingredient{}).Where("id = ?", id).Updates(updatedIngredient)
	if result.Error != nil {
		http.Error(w, "Failed to update ingredient", http.StatusInternalServerError)
		return
	}

	// Respond with the updated object
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(updatedIngredient)
}

func DeleteIngredient(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	log.Println("Deleting ingredient with ID:", id)

	// Delete by ID
	result := db.DB.Delete(&models.Ingredient{}, id)

	if result.Error != nil {
		log.Println("Error:", result.Error)
	} else {
		log.Printf("Successfully deleted %d ingredient(s)", result.RowsAffected)
	}
	if result.Error != nil {
		http.Error(w, "Failed to delete ingredient", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent) // 204 No Content
}
