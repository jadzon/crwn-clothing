package controllers

import (
	"jwt_najnowszy/models"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// czemu bez wskaznik na interfejs???
func Signup(c *gin.Context, db models.Database) {
	var body struct {
		Username string `json:"username"`
		Password string `json:"password"`
		Email    string `json:"email"`
	}
	if c.ShouldBindJSON(&body) != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Failed to read body"})
		return
	}
	_, err := db.GetUserByUsername(body.Username)
	if err == nil {
		c.IndentedJSON(http.StatusConflict, gin.H{"message": "username already taken"})
		return
	}
	hashPassword, err := bcrypt.GenerateFromPassword([]byte(body.Password), 10)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Failed to create hash from password"})
	}
	var newUser models.User
	newUser.Password = string(hashPassword)
	newUser.Username = body.Username
	newUser.Email = body.Email
	newUser.ID = db.NumberOfUsers() + 1
	newUser.CreatedAt = time.Now()
	db.AddUserToDB(newUser)
	c.IndentedJSON(http.StatusCreated, gin.H{"message": "Account created"})
	log.Println(newUser)
}
func Login(c *gin.Context, db models.Database) {
	valid := false
	var body struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	c.ShouldBindJSON(&body)
	foundUser, err := db.GetUserByUsername(body.Username)
	if err == nil {
		err := bcrypt.CompareHashAndPassword([]byte(foundUser.Password), []byte(body.Password))
		if err == nil {
			valid = true
		}
	}
	if !valid {
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "Invalid username or password", "valid": false})
	} else {
		// Creating new token
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"id":        foundUser.ID,
			"username":  foundUser.Username,
			"expiresAt": time.Now().Add(time.Hour * 2).Unix(),
		})
		tokenString, err := token.SignedString([]byte(os.Getenv("TOKEN_SECRET_KEY")))
		if err != nil {
			c.IndentedJSON(http.StatusNotFound, gin.H{"message": "Failed to create token"})
			return
		}
		// c.SetCookie("Authcookerson", tokenString, 60*60*2, "localhost", "localhost", false, true)
		c.IndentedJSON(http.StatusAccepted, gin.H{"message": "Created token", "valid": true, "authToken": tokenString})
	}
}
func Logout(c *gin.Context) {
	c.SetCookie("Authcookerson", "", -1, "", "localhost", false, true)
	c.JSON(http.StatusOK, gin.H{"message": "Logged out"})
}
func Validate(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, gin.H{"valid": true, "message": "User Valid"})
}
