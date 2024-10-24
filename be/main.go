package main

import (
	"log"

	"first-app/api/controllers"
	"first-app/config"
	"first-app/internal/user/repository"
	"first-app/internal/user/service"
	"first-app/pkg/db"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	config.LoadConfig()

	dbConn, err := db.ConnectMySQL(config.DBConfig)
	if err != nil {
		log.Fatal("Không thể kết nối với cơ sở dữ liệu:", err)
	}

	userRepo := repository.NewUserRepository(dbConn)
	userService := service.NewUserService(userRepo)

	r := gin.Default()

	r.Use(cors.Default())
	r.GET("/users", func(c *gin.Context) { controllers.GetUsers(c, userService) })

	r.GET("/users/:id", func(c *gin.Context) { controllers.GetUsersDetail(c, userService) })
	r.POST("/users", func(c *gin.Context) { controllers.CreateUser(c, userService) })
	r.PUT("/users/:id", func(c *gin.Context) { controllers.UpdateUser(c, userService) })
	r.DELETE("/users/:id", func(c *gin.Context) { controllers.DeleteUser(c, userService) })

	r.Run(":9090")
}
