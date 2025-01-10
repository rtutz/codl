import React from 'react';
import styled, { keyframes } from 'styled-components';

// Keyframes for the spinning animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styled container for the loader
const LoaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8); // Semi-transparent background
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; // Ensure it covers other elements
`;

// Styled loader spinner
const Spinner = styled.div`
  border: 8px solid #f3f3f3; /* Light grey */
  border-top: 8px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: ${spin} 2s linear infinite; /* Spinning animation */
`;

// Loader functional component
const Loader = () => {
    return (
        <LoaderContainer>
            <Spinner />
        </LoaderContainer>
    );
};

export default Loader;
