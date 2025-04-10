package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/krishk/ekadashi-backend/db"
	"github.com/krishk/ekadashi-backend/handlers"
)

func main() {
	// Connect to the database
	db.Connect()

	// Create a new router using chi
	r := chi.NewRouter()

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"}, // frontend origin
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
	}))

	// Route: GET /ingredients → handled in another file
	r.Get("/ingredients", handlers.GetIngredients)

	// Route: POST /ingredients → handled in another file
	r.Post("/ingredients", handlers.CreateIngredient)

	// Route: PUT /ingredients/{id} → handled in another file
	r.Put("/ingredients/{id}", handlers.UpdateIngredient)

	// Route: DELETE /ingredients/{id} → handled in another file
	r.Delete("/ingredients/{id}", handlers.DeleteIngredient)

	// Start the server on port 8080
	log.Println("Server running on http://localhost:8080")
	http.ListenAndServe(":8080", r)
}
