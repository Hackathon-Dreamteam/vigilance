import { Card } from 'flowbite-react';
import { useAppStore } from '../../state/useAppStore';
import AlpabeticalSorter from 'react-alphabet-sorter';
import MetaTags from 'react-meta-tags';

const SpeciesPage: ReactFC = () => {
  const {
    computed: { filteredSpecies }
  } = useAppStore();

  const data = filteredSpecies.map(x => {
    return { value: x, label: x, href: `/species/${x}` };
  });

  return (
    <>
      <MetaTags>
        <title>Vigilance - Liste des Espèces</title>
      </MetaTags>
      <div className="flex flex-col gap-5">
        <Card>
          <h4>Espèces</h4>
          <div>
            <AlpabeticalSorter asGroup={data} asName="link" navigator={navigator} type="link" />
          </div>
        </Card>
      </div>
    </>
  );
};

export default SpeciesPage;
