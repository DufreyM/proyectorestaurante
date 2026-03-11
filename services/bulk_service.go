package services

import (
	"context"

	"restaurant-system/config"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func BulkInsertUsuarios() error {

	models := []mongo.WriteModel{
		mongo.NewInsertOneModel().
			SetDocument(bson.M{
				"nombre": "BulkUser1",
				"correo": "bulk1@mail.com",
			}),
		mongo.NewInsertOneModel().
			SetDocument(bson.M{
				"nombre": "BulkUser2",
				"correo": "bulk2@mail.com",
			}),
	}

	_, err := config.DB.Collection("usuarios").
		BulkWrite(context.Background(), models)

	return err
}