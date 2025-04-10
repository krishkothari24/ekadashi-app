package db

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	dsn := "host=localhost user=krish password=1 dbname=ekadashi_db port=5432 sslmode=disable"

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Automatically create the table if it doesn't exist
	// DB.AutoMigrate(&models.Ingredient{})
	// // Optional: insert sample data if empty
	// var count int64
	// DB.Model(&models.Ingredient{}).Count(&count)
	// if count == 0 {
	// 	DB.Create(&models.Ingredient{Name: "Potato", IsAllowed: true})
	// 	DB.Create(&models.Ingredient{Name: "Cucumber", IsAllowed: true})
	// 	DB.Create(&models.Ingredient{Name: "Sabudana", IsAllowed: true})
	// 	DB.Create(&models.Ingredient{Name: "Rice", IsAllowed: false})
	// 	DB.Create(&models.Ingredient{Name: "Wheat", IsAllowed: false})
	// }

}
