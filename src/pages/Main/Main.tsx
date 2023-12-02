import Header from '../../components/Header';
import FilesTable from './FilesTable';

const Main = () => {
  return (
    <div>
      <Header accountInfo="Account"/>
      <div className="mx-6 my-3">
        <FilesTable />
      </div>
    </div>
  );
};

export default Main;
