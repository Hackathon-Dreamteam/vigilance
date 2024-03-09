import tw, { styled } from 'twin.macro';
import Icon from './assets/logo.svg?react';

const Title = styled.h1`
  color: #ff2219;
  ${tw`font-black flex items-center flex-col`}
  p {
    ${tw`font-bold text-lg text-gray-700`}
  }
`;

const Container = tw.div`min-h-screen flex justify-center items-center flex-col bg-gray-50`;

const Logo = styled.div`
  ${tw`mb-4`}
  svg {
    ${tw`w-24 h-24`}
  }
`;

const App: ReactFC = () => {
  return (
    <Container>
      <Title>
        <Logo>
          <Icon />
        </Logo>
        <div>Invasion QC</div>
        <p>Bonjour Monde!</p>
      </Title>
    </Container>
  );
};

export default App;
