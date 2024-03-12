import {useState} from 'react';
import FormInput from '../form-input/form-input.component';
import { LoginWithUsernameAndPassword } from '../../utils/golang-api/golang-api';
// import { createAuthUserWithEmailAndPassword } from '../../utils/firebase/firebase.utils';
import './sign-in-form.styles.scss'
import Button from '../button/button.component';
const defaultformFields ={
    displayName:'',
    email: '',
    password:'',
    confirmPassword:'',
}
const SignInForm= ()=>{
    const [formFields,setFormFields] = useState(defaultformFields);
    const{displayName,password} = formFields;
    console.log(formFields)
    const handleSubmit = async (event)=>{
        event.preventDefault();
        try{
            const response = await LoginWithUsernameAndPassword(displayName, password);
            console.log(response);
        }catch(error){
            console.log('user creation encountered an error', error);
        }
        setFormFields(defaultformFields)

    }
    const handleChange = (event)=>{
        const{name,value} = event.target;

        setFormFields({...formFields,[name]: value});
    };
    return(
        <div className='sign-up-container'>
            <h2>Already have an account?</h2>
            <span>Sign in with your username and password</span>
            <form onSubmit={handleSubmit}>
                <FormInput
                    label="Username"
                    type="text" 
                    required 
                    onChange={handleChange} 
                    name="displayName" 
                    value={displayName}/>
                <FormInput
                    label="Password"
                    type ="password" 
                    required onChange={handleChange} 
                    name="password" 
                    value={password}/>
                <Button type="submit">Sign In</Button>
            </form>
        </div>
    )
}
export default SignInForm;