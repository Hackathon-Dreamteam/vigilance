import Icon from '@/assets/logo.svg?react';
import { Avatar, Badge, Button, Dropdown, Navbar } from 'flowbite-react';
import { IoIosNotifications } from 'react-icons/io';
import { useAppState } from '../../../state/useAppState';

const DashboardNavbar: ReactFC = () => {
  const { region, regions, setState } = useAppState();

  return (
    <Navbar fluid rounded>
      <Navbar.Brand href="/">
        <Icon className="h-8 w-32 mr-3" />
      </Navbar.Brand>
      <div className="ml-6">
        <Dropdown label={region} inline>
          {regions.map(x => (
            <Dropdown.Item key={x} onClick={() => setState({ region: x })}>
              {x}
            </Dropdown.Item>
          ))}
        </Dropdown>
      </div>

      <div className="flex gap-4 ml-auto">
        <Button size="xs" className="bg-transparent enabled:hover:bg-gray-200">
          <IoIosNotifications className="h-6 w-6 fill-black" />
          <Badge className="-ml-2">5</Badge>
        </Button>
        <Dropdown
          arrowIcon={false}
          inline
          label={<Avatar alt="User settings" className='drop-shadow-lg' img="/img/logo-laval.png" rounded />}
        >
          <Dropdown.Header>
            <span className="block text-sm">Ville de Laval</span>
            <span className="block truncate text-sm font-medium"><a href="mailto:admin@laval.qc.ca">admin@laval.qc.ca</a></span>
          </Dropdown.Header>
          <Dropdown.Item>Dashboard</Dropdown.Item>
          <Dropdown.Item>Settings</Dropdown.Item>
          <Dropdown.Item>Earnings</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>Sign out</Dropdown.Item>
        </Dropdown>
      </div>
    </Navbar>
  );
};

export default DashboardNavbar;
