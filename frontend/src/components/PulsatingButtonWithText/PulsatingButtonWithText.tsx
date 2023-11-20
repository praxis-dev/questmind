import styled, { keyframes } from "styled-components";

interface PulsatingButtonWithTextProps {
  disabled: boolean;
}

const pulsate = keyframes`
  0% { border-color: black; }
  50% { border-color: #cd7f32; }
  100% { border-color: black; }
`;

const PulsatingButtonWithText = styled.button<PulsatingButtonWithTextProps>`
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin: 2px 0;
  background-color: white;
  width: 100px;
  height: 32px;
  font-size: 14px;
  border-radius: 5px;
  transition: border-color 0.5s ease-in-out;
  border: 1px solid black;
  font-family: monospace;
  box-sizing: border-box;

  &:hover,
  &:focus-visible,
  &:active {
    background-color: white;
    color: #cd7f32;
    animation: ${pulsate} 4s infinite;
    border: 1px solid #cd7f32;
  }
`;

export default PulsatingButtonWithText;
