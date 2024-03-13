package middleware

import (
	"fmt"
	"jwt_najnowszy/models"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func RequireAuth(c *gin.Context, db models.Database) {
	var body struct {
		AuthToken string `json:"authToken"`
	}
	var err error
	// Attempt to bind JSON
	if err := c.ShouldBindJSON(&body); err != nil {
		// If there's an error, it means there was no JSON data in the request
		// Respond with appropriate JSON message
		c.AbortWithStatusJSON(http.StatusOK, gin.H{"valid": false, "message": "User Not Valid: No authToken provided"})
		return
	}

	// Proceed with token validation
	tokenString := body.AuthToken
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		_, _ = token, err
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("TOKEN_SECRET_KEY")), nil
	})
	if err != nil || !token.Valid {
		// Handle invalid or expired token
		c.AbortWithStatusJSON(http.StatusOK, gin.H{"valid": false, "message": "User Not Valid: Invalid authToken"})
		return
	}

	// Token is valid, proceed with user authentication
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		// Handle invalid claims
		c.AbortWithStatusJSON(http.StatusOK, gin.H{"valid": false, "message": "User Not Valid: Invalid authToken"})
		return
	}

	// Check token expiration
	expiresAt, ok := claims["expiresAt"].(float64)
	if !ok || float64(time.Now().Unix()) > expiresAt {
		c.AbortWithStatusJSON(http.StatusOK, gin.H{"valid": false, "message": "User Not Valid: authToken expired"})
		return
	}

	// Token is valid, extract user information from the token and proceed
	userID, ok := claims["id"].(float64)
	if !ok {
		c.AbortWithStatusJSON(http.StatusOK, gin.H{"valid": false, "message": "User Not Valid: Invalid authToken"})
		return
	}

	// Convert userID to integer
	userIDInt := int(userID)

	// Retrieve user from database
	theUser, err := db.GetUserByID(userIDInt)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusOK, gin.H{"valid": false, "message": "User Not Valid: Error retrieving user information"})
		return
	}

	// Set the user information in the context and proceed
	c.Set("user", theUser)
	c.Next()
}
