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
        console.log(response.data);
        return response.data
    } catch(error){
        console.error('Error:', error);
        throw error;
    }
}