import { Badge, Card } from 'flowbite-react';
import { useAppStore } from '../../state/useAppStore';
import { Timeline } from 'flowbite-react';
import { format } from 'date-fns';
import { HiExclamation } from 'react-icons/hi';

const AlertPage: ReactFC = () => {
  const {
    computed: { filteredAlerts }
  } = useAppStore();

  const renderAlertBadge = type => {
    switch (type) {
      case 'ObservationsDropping':
        return (
          <Badge className="inline-block ml-3" color="success">
            Nombre d'observations en diminution
          </Badge>
        );
      case 'ObservationsRaising':
        return (
          <Badge className="inline-block ml-3" color="failure">
            Nombre d'observations en augmentation
          </Badge>
        );
      default:
        return null;
    }
  };

  const renderAlertContent = type => {
    switch (type) {
      case 'ObservationsDropping':
        return <span className="inline-block">TODO</span>;
      case 'ObservationsRaising':
        return <span className="inline-block">TODO</span>;
      default:
        return null;
    }
  };

  return (
    <div>
      <Card>
        <h4>
          Alertes <HiExclamation className="inline-block" />
        </h4>
        <Timeline>
          {Array.isArray(filteredAlerts) &&
            filteredAlerts.length > 0 &&
            filteredAlerts.map(alert => (
              <Timeline.Item key={alert.id}>
                <Timeline.Point />
                <Timeline.Content>
                  <Timeline.Time>{format(alert.date, 'PP')}</Timeline.Time>
                  <Timeline.Title>
                    {alert.speciesName} <span>{renderAlertBadge(alert.type)}</span>
                  </Timeline.Title>
                  <Timeline.Body>{renderAlertContent(alert.type)}</Timeline.Body>
                </Timeline.Content>
              </Timeline.Item>
            ))}
          {!filteredAlerts ||
            (filteredAlerts.length == 0 && <p>Félicitations, aucune alerte n'est présente pour la ville sélectionnée.</p>)}
        </Timeline>
      </Card>
    </div>
  );
};

export default AlertPage;
