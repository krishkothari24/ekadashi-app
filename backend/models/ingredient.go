package models

type Ingredient struct {
	ID        uint   `json:"id" gorm:"primaryKey"`
	Name      string `json:"name"`
	IsAllowed bool   `json:"isAllowed"`
}
