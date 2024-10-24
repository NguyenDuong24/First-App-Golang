package config

import (
	"log"
)

var DBConfig string

func LoadConfig() {
	DBConfig = "root:@tcp(127.0.0.1:3306)/test1?charset=utf8mb4&parseTime=True&loc=Local"
	if DBConfig == "" {
		log.Fatal("Biến môi trường DB_DSN chưa được thiết lập")
	}
}
