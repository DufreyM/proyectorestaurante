package main

import (
	"restaurant-system/config"
	"restaurant-system/handlers"

	"github.com/gin-gonic/gin"
)

func main() {

	config.ConnectDatabase()

	r := gin.Default()

	r.POST("/usuarios", handlers.CreateUsuario)
	r.GET("/usuarios", handlers.GetUsuarios)

	r.POST("/restaurantes", handlers.CreateRestaurante)
	r.GET("/restaurantes", handlers.GetRestaurantes)

	r.POST("/ordenes", handlers.CreateOrden)
	r.GET("/ordenes", handlers.GetOrdenes)

	r.POST("/resenas", handlers.CreateResena)
	r.GET("/resenas", handlers.GetResenas)

	r.GET("/reportes/mejores-restaurantes", handlers.RestaurantesMejorCalificados)

	r.GET("/reportes/ventas-por-mes", handlers.VentasPorMes)
	r.POST("/usuarios/bulk", handlers.BulkUsuarios)
	r.GET("/debug/explain-ordenes", handlers.ExplainOrdenes)
	r.GET("/restaurantes/cercanos", handlers.RestaurantesCercanos)
	r.Run(":8080")
}