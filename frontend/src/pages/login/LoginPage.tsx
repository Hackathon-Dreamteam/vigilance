import { Button } from 'flowbite-react';
import { Link } from 'react-router-dom';
import tw, { styled } from 'twin.macro';
import Icon from '@/assets/logo.svg?react';

const Title = styled.h1`
  ${tw`text-5xl font-black flex items-center flex-col`}
  p {
    ${tw`font-normal text-base text-gray-700 mb-8 mt-2`}
  }
`;

// const StickyHeader = styled.div<{ $visible?: boolean }>`
//   ${tw`absolute top-0 w-full p-4 opacity-0 transition-all`}
//   ${({ $visible }) => $visible && tw`opacity-100`}
// `;

const Container = tw.div`min-h-screen flex justify-center items-center flex-col bg-gray-50`;

const Logo = styled.div`
  svg {
    ${tw`w-40 h-full`}
  }
`;

const LoginPage: ReactFC = () => {
  return (
    <Container>
      <Title>
        <Logo>
          <Icon />
        </Logo>
        <p>Made with ❤︎ in Québec</p>
        <Link to="/dashboard">
          <Button color="dark">Log In</Button>
        </Link>
      </Title>
    </Container>
  );
};

export default LoginPage;
