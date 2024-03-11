import Icon from '@/assets/logo.svg?react';
import { Avatar, Badge, Button, Dropdown, Navbar } from 'flowbite-react';
import { IoIosNotifications } from 'react-icons/io';
import { useAppStore } from '../../state/useAppStore';
import { Link } from 'react-router-dom';

const Header: ReactFC = () => {
  const {
    region,
    alertsCount,
    computed: { regions },
    setState
  } = useAppStore();

  return (
    <Navbar fluid rounded className="sticky top-0 z-10 drop-shadow-md">
      <Navbar.Brand as={Link} to="/dashboard">
        <Icon className="h-8 w-32 fade-in-0 animate-in slide-in-from-left-5 duration-500" />
      </Navbar.Brand>
      <div className="ml-6 animate-in slide-in-from-top-2 duration-1000 delay-500 fade-in fill-mode-both">
        <Dropdown label={region} inline>
          {regions.map(x => (
            <Dropdown.Item key={x} onClick={() => setState({ region: x })}>
              {x}
            </Dropdown.Item>
          ))}
        </Dropdown>
      </div>

      <div className="flex gap-4 ml-auto">
        <Button as={Link} size="xs" className="bg-transparent enabled:hover:bg-gray-200" to="/alerts">
          <IoIosNotifications className="h-6 w-6 fill-black" />
          <Badge className="-ml-2">{alertsCount}</Badge>
        </Button>
        <Dropdown
          arrowIcon={false}
          inline
          label={<Avatar alt="User settings" className="drop-shadow-lg" img="/img/logo-laval.png" rounded />}
        >
          <Dropdown.Header>
            <span className="block text-sm">Ville de Laval</span>
            <span className="block truncate text-sm font-medium">
              <a href="mailto:admin@laval.qc.ca">admin@laval.qc.ca</a>
            </span>
          </Dropdown.Header>
          <Dropdown.Item as={Link} to="/dashboard">
            Tableau de bord
          </Dropdown.Item>
          <Dropdown.Item as={Link} to="/alerts">
            Alertes
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item as={Link} to="/">
            Déconnexion
          </Dropdown.Item>
        </Dropdown>
      </div>
    </Navbar>
  );
};

export default Header;
