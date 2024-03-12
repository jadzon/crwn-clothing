package main

import (
	"jwt_najnowszy/controllers"
	"jwt_najnowszy/initializers"
	"jwt_najnowszy/middleware"
	"jwt_najnowszy/models"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func init() {
	initializers.LoadEnvVariables()
}
func main() {
	userDB := models.CreateEmptyUserDB()
	router := gin.Default()
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusOK)
			return
		}
		c.Next()
	})
	router.POST("/api/signup", func(c *gin.Context) {
		controllers.Signup(c, userDB)
	})
	router.POST("/api/login", func(c *gin.Context) {
		controllers.Login(c, userDB)
	})
	router.POST("/api/logout", func(c *gin.Context) {
		middleware.RequireAuth(c, userDB)
	}, controllers.Logout)
	router.GET("/api/validate", func(c *gin.Context) {
		middleware.RequireAuth(c, userDB)
	}, controllers.Validate)
	router.Run(os.Getenv("PORT_NUM"))
}
