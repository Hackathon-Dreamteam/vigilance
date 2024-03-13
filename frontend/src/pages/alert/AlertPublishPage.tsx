import { Card, Spinner } from 'flowbite-react';
import { useAppStore } from '../../state/useAppStore';
import { useParams } from 'react-router-dom';
import { chain } from 'lodash';
import { useEffect, useState } from 'react';
import { ApiHttpService } from '../../services/http/http-service';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export interface AlertContent {
  message: string;
  imageUri: string;
}

const AlertPublishPage: ReactFC = () => {
  const { alerts } = useAppStore();
  const { alertId } = useParams();
  const selectedAlert = chain(alerts)
    .filter(x => x.id == alertId)
    .first()
    .value();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [alertContent, setAlertContent] = useState<AlertContent>();

  const loadAlertContent = id => {
    ApiHttpService.get<AlertContent>(`/alerts/${id}/advice`).then(value => {
      if (value.response) {
        setIsLoading(false);
        setAlertContent(value.response);
      }
    });
  };

  useEffect(() => {
    if (isLoading) {
      loadAlertContent(alertId);
    }
  }, [alertId, isLoading]);

  return (
    <div>
      {!!selectedAlert && (
        <Card>
          <h4>Alerte: {selectedAlert.speciesName}</h4>
          {isLoading && (
            <span>
              <Spinner aria-label="Default status example" />
              <span className="ml-3">Création de la publication en cours</span>
            </span>
          )}
          {!isLoading && alertContent && (
            <div className="grid grid-cols-6 gap-4">
              <div className="col-start-2 col-span-4">
                <img className="drop-shadow-md" src={alertContent.imageUri} />
                <Markdown className="mt-5 alert-markdown" remarkPlugins={[[remarkGfm, { singleTilde: false }]]}>
                  {alertContent.message}
                </Markdown>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default AlertPublishPage;
