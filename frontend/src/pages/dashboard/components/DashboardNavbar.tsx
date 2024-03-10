import Icon from '@/assets/logo.svg?react';
import { Avatar, Button, Dropdown, Navbar } from 'flowbite-react';
import { IoIosNotifications } from 'react-icons/io';
import { useAppState } from '../../../state/useAppState';

const DashboardNavbar: ReactFC = () => {
  const { region, regions, setState } = useAppState();

  return (
    <Navbar fluid rounded>
      <Navbar.Brand href="https://flowbite-react.com">
        <Icon className="h-8 w-8 mr-3" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Invasion Québec</span>
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
        </Button>
        <Dropdown
          arrowIcon={false}
          inline
          label={<Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />}
        >
          <Dropdown.Header>
            <span className="block text-sm">Bonnie Green</span>
            <span className="block truncate text-sm font-medium">name@flowbite.com</span>
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
