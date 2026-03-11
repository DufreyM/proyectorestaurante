package seed

import (
	"context"
	"math/rand"
	"restaurant-system/config"
	"time"

	"go.mongodb.org/mongo-driver/bson"
)

func SeedOrdenes(n int) {

	var docs []interface{}

	for i := 0; i < n; i++ {
		docs = append(docs, bson.M{
			"fecha":  time.Now(),
			"estado": "completado",
			"total":  rand.Intn(500),
		})
	}

	config.DB.Collection("ordenes").InsertMany(context.Background(), docs)
}