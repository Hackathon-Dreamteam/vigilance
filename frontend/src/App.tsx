import tw, { styled } from 'twin.macro';
import Icon from './assets/logo.svg?react';
import { useEffect, useState } from 'react';
import { ApiHttpService } from './services/http/http-service';
import { Alert, Button } from 'flowbite-react';
import { Link } from 'react-router-dom';

const Title = styled.h1`
  color: #ff2219;
  ${tw`text-5xl font-black flex items-center flex-col`}
  p {
    ${tw`font-bold text-lg text-gray-700 mb-4`}
  }
`;

const StickyHeader = styled.div<{ $visible?: boolean }>`
  ${tw`absolute top-0 w-full p-4 opacity-0 transition-all`}
  ${({ $visible }) => $visible && tw`opacity-100`}
`;

const Container = tw.div`min-h-screen flex justify-center items-center flex-col bg-gray-50`;

const Logo = styled.div`
  ${tw`mb-4`}
  svg {
    ${tw`w-24 h-24`}
  }
`;

const App: ReactFC = () => {
  const [alert, setAlert] = useState<string>();

  const getAlert = async () => {
    const { response } = await ApiHttpService.get<string>('/helloworld');
    setAlert(response);
  };

  useEffect(() => {
    setTimeout(() => {
      getAlert();
    }, 1000);
  }, []);

  return (
    <Container>
      <StickyHeader $visible={!!alert}>
        <Alert color="failure">{alert}</Alert>
      </StickyHeader>
      <Title>
        <Logo>
          <Icon />
        </Logo>
        <div>Invasion QC</div>
        <p>Made with ❤︎ in Québec</p>
        <Link to="/dashboard">
          <Button color="dark">Log In</Button>
        </Link>
      </Title>
    </Container>
  );
};

export default App;
