import { Button } from 'flowbite-react';
import { Link } from 'react-router-dom';
import tw, { styled } from 'twin.macro';
import Icon from '@/assets/logo.svg?react';
import { HiOutlineHeart } from 'react-icons/hi';

const Content = styled.div`
  ${tw`flex flex-col items-center text-gray-700 gap-3 mt-2`}
  ${tw`animate-in fade-in-0 slide-in-from-top-1 delay-1200 duration-3000 fill-mode-both`}
  svg {
    ${tw`animate-bounce`}
  }
`;

// const StickyHeader = styled.div<{ $visible?: boolean }>`
//   ${tw`absolute top-0 w-full p-4 opacity-0 transition-all`}
//   ${({ $visible }) => $visible && tw`opacity-100`}
// `;

const Container = tw.div`min-h-screen flex justify-center items-center flex-col bg-gray-50`;

const Logo = styled.div`
  ${tw`animate-in fade-in-0 delay-200 duration-3000 fill-mode-both`}
  svg {
    ${tw`w-56`}
  }
`;

const LoginPage: ReactFC = () => {
  return (
    <Container>
      <Logo>
        <Icon />
      </Logo>
      <Content>
        <div className="ml-2">
          <span>Fait avec</span>
          <HiOutlineHeart className="inline-block mx-1" color="red" />
          <span>au Québec</span>
        </div>
        <Link to="/dashboard">
          <Button color="dark">Se connecter</Button>
        </Link>
      </Content>
    </Container>
  );
};

export default LoginPage;
