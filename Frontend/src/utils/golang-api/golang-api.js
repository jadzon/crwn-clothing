import axios from 'axios';

const PORT_NUM = 7654;

export async function CreateUserWithEmail(username, email, password){
    try {
        const response = await axios.post(`http://localhost:${PORT_NUM}/api/signup`, {
            username,
            password,
            email
        });
        console.log(response.data); // Assuming you want to log the response data
        return response.data; // Return the response data if needed
    } catch (error) {
        console.error('Error:', error);
        throw error; // Rethrow the error to handle it in the caller function if needed
    }
};
export async function LoginWithUsernameAndPassword(username,password){
    try{
        const response = await axios.post(`http://localhost:${PORT_NUM}/api/login`,{
            username,
            password
        });
        return response.data
    } catch(error){
        console.error('Error:', error);
        throw error;
    }
}
export async function ValidateTEMP() {
    console.log('In validate');
    let isValid = false;
    try {
        // Extract authToken from cookie
        const authToken = document.cookie.replace(/(?:(?:^|.*;\s*)authToken\s*=\s*([^;]*).*$)|^.*$/, '$1');

        const response = await axios.post(`http://localhost:${PORT_NUM}/api/validate`, {
            authToken: authToken // Send authToken in the request payload
        });

        isValid = response.data.valid;
        console.log(isValid);
    } catch (error) {
        console.error('Error:', error);
        // Handle error appropriately
    }
    
    return isValid;
}