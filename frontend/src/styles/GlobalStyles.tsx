import { createGlobalStyle } from 'styled-components';
import tw from 'twin.macro';
// import { GlobalStyles as BaseStyles } from 'twin.macro';

// To apply formatting
const styled = { createGlobalStyle };

const CustomStyles = styled.createGlobalStyle`
  :root {
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    font-weight: 400;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    flex: 1;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    ${tw`text-base`}
    &:has(main) {
      overflow-y: scroll;
    }
  }
`;

const GlobalStyles = () => (
  <>
    {/* Conflicting with Flowbite: <BaseStyles /> */}
    <CustomStyles />
  </>
);

export default GlobalStyles;
