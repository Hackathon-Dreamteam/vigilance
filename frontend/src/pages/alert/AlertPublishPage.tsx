import { Card, Spinner } from 'flowbite-react';
import { useAppStore } from '../../state/useAppStore';
import { useParams } from 'react-router-dom';
import { chain, replace } from 'lodash';
import { useEffect, useState } from 'react';
import { ApiHttpService } from '../../services/http/http-service';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { HiOutlineChatBubbleOvalLeft, HiHeart, HiOutlinePaperAirplane, HiOutlineBookmark } from 'react-icons/hi2';

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

        let message = replace(value.response.message, '1️⃣', '\n');
        message = replace(message, '2️⃣', '\n');
        message = replace(message, '3️⃣', '\n');
        message = replace(message, '4️⃣', '\n');
        message = replace(message, '3 ', '\n');
        message = replace(message, '');
        message = replace(message, '');

        setAlertContent({
          ...value.response,
          message
        });
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
            <div className="m-auto max-w-4xl">
              <div className="grid grid-cols-6 gap-4">
                <div className="col-start-2 col-span-4">
                  <img className="drop-shadow-md mt-5 mb-3" src={alertContent.imageUri} />
                  <div>
                    <HiHeart className="inline-block w-8 h-8 mr-5 ml-2 cursor-pointer" style={{ color: '#F93822' }} />
                    <HiOutlineChatBubbleOvalLeft className="inline-block w-8 h-8 mr-5 ml-2 cursor-pointer" />
                    <HiOutlinePaperAirplane className="inline-block w-8 h-8 mr-5 ml-2 cursor-pointer" />
                    <HiOutlineBookmark className="inline-block w-8 h-8 mr-5 cursor-pointer float-right" />
                  </div>
                  <Markdown className="mt-5 alert-markdown" remarkPlugins={[[remarkGfm, { singleTilde: false }]]}>
                    {alertContent.message}
                  </Markdown>
                  <div className="text-center mt-5">
                    <img src="/img/socials/instagram.png" className="inline-block w-10 m-5 cursor-pointer" />
                    <img src="/img/socials/facebook.png" className="inline-block w-10 m-5 cursor-pointer" />
                    <img src="/img/socials/reddit.png" className="inline-block w-10 m-5 cursor-pointer" />
                    <img src="/img/socials/twitter.png" className="inline-block w-10 m-5 cursor-pointer" />
                    <img src="/img/socials/discord.png" className="inline-block w-10 m-5 cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default AlertPublishPage;
