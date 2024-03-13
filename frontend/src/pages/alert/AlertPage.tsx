import { Badge, Button, Card } from 'flowbite-react';
import { useAppStore } from '../../state/useAppStore';
import { Timeline } from 'flowbite-react';
import { format } from 'date-fns';
import { HiArrowNarrowRight, HiExclamation } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const AlertPage: ReactFC = () => {
  const {
    computed: { filteredAlerts }
  } = useAppStore();

  const renderAlertBadge = type => {
    switch (type) {
      case 'ObservationsDropping':
        return (
          <Badge className="inline-block ml-3" color="success">
            Observations en diminution
          </Badge>
        );
      case 'ObservationsRaising':
        return (
          <Badge className="inline-block ml-3" color="failure">
            Observations en augmentation
          </Badge>
        );
      case 'UnexpectedSpecies':
        return (
          <Badge className="inline-block ml-3" color="warning">
            Espèce inattendue
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Card>
        <h4>Alertes ⚠️</h4>
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
                  <Timeline.Body>
                    <Link to={`/alerts/${alert.id}`}>
                      <Button className="mt-3">
                        Publier une alerte citoyenne
                        <HiArrowNarrowRight className="ml-2 h-3 w-3" />
                      </Button>
                    </Link>
                  </Timeline.Body>
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
