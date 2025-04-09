import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="flex align-items-center justify-content-center min-h-[80vh]">
            <div className="card shadow-4 border-round-xl w-11 md:w-8 lg:w-6">
                <div className="flex flex-column align-items-center text-center gap-4">
                    <i className="pi pi-heart text-6xl text-pink-500"></i>
                    <h1 className="text-4xl font-bold m-0">Bienvenido al Gestor de Unicornios</h1>
                    <p className="text-xl line-height-3 m-0">
                        Un lugar mágico donde puedes gestionar tu colección de unicornios.
                        Añade nuevos unicornios, edita sus poderes y mantén un registro de todos ellos.
                    </p>
                    <Button 
                        label="Ir al Gestor" 
                        icon="pi pi-arrow-right"
                        severity="success"
                        className="p-button-rounded p-button-lg"
                        onClick={() => navigate('/unicornios')}
                    />
                </div>
            </div>
        </div>
    );
};

export default Home; 