import { useParams } from 'react-router-dom';

const SimulationPage: React.FC = () => {
    const { contractId } = useParams<string>();

    // Rest of the component code

    return (
        <div>
            <h1>Simulation Page</h1>
            <p>Contract ID: {contractId}</p>
        </div>
    );
};

export default SimulationPage;
