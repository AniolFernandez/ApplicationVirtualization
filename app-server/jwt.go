package main

import (
	"github.com/dgrijalva/jwt-go"
	"time"
	"net"
	"log"
	"fmt"
)

var secret = []byte("q@4iMlcS!AnMC74ZfxB0GNh623VN!Qo*Jf$6wuKBFZ*f0doBJ1")
var ip = GetIPAddress()

//Obté token d'accés per al SW
func GetAccesToken() string { 
	tokenString, _ := jwt.NewWithClaims(
		jwt.SigningMethodHS256, 
		jwt.MapClaims{"user": "admin",},
	).SignedString(secret)
	return tokenString
}

func ProcessToken(access_token string) (string, bool) {
	// Parse JWT token
	token, err := jwt.Parse(access_token, func(token *jwt.Token) (interface{}, error) {
		// Validació de la clau
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("invalid signing method")
		}
		return secret, nil //Retorna el secret si el mètode de signatura és correcte
	})
	if err != nil {
		log.Println("Rebut token invàlid.")
		return "", false
	}

	// Extreu la informació emmagatzemada al token
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {

		//Comprova que el token no hagi expirat
		expirationTime := time.Unix(int64(claims["exp"].(float64)), 0)
		if expirationTime.Before(time.Now()) {
			log.Println("Rebut token vàlid pero expirat.")
			return "", false//El token ha expirat
		}

		//Comprova que el servidor de destí sigui el que toca
		if servidor, ok := claims["server"].(string); ok {
			if servidor != ip {
				log.Println("S'ha intentat accedir a ",ip," amb un token per ",servidor)
				return "", false
			}
			
		}

		// Check if the "user" claim exists
		if app, ok := claims["app"].(string); ok {
			log.Println("Rebut token correcte per a ",app)
			return app, true
		}
	}

	return "", false
}

func GetIPAddress() string {
    addrs, err := net.InterfaceAddrs()
    if err != nil {
        return ""
    }
    for _, addr := range addrs {
        // Check if the address is not a loopback address and is an IP address
        if ipnet, ok := addr.(*net.IPNet); ok && !ipnet.IP.IsLoopback() && ipnet.IP.To4() != nil {
            return ipnet.IP.String()
        }
    }
    return ""
}