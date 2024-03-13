import React, { useState, useEffect } from 'react';
import { ValidateTEMP } from '../../utils/golang-api/golang-api';

const textChange = (validBool) => {
    console.log(validBool);
    if (validBool) {
        return 'User valid';
    } else {
        return 'User not Valid';
    }
};

const Validate = () => {
    const [isValid, setIsValid] = useState(null); // Initially set to null, indicating validation has not been performed

    useEffect(() => {
        // Perform validation when the component is mounted
        ValidateTEMP().then(validBool => {
            setIsValid(validBool); // Update the isValid state with the result of the validation
        }).catch(error => {
            console.error('Error:', error);
            setIsValid(false); // Update isValid to false if an error occurs during validation
        });
    }, []); // Empty dependency array ensures that the effect runs only once when the component is mounted

    return (
        <div>
            {/* Render the validation result */}
            {isValid !== null && <h1>{textChange(isValid)}</h1>}
        </div>
    );
};

export default Validate;