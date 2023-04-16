package main

import (
	"github.com/dgrijalva/jwt-go"
)

var secret = []byte("q@4iMlcS!AnMC74ZfxB0GNh623VN!Qo*Jf$6wuKBFZ*f0doBJ1")

//Obté token d'accés per al SW
func GetAccesToken() string { 
	tokenString, _ := jwt.NewWithClaims(
		jwt.SigningMethodHS256, 
		jwt.MapClaims{"user": "admin",},
	).SignedString(secret)
	return tokenString
}