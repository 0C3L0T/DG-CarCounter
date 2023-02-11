import {lazy} from "solid-js";

const AllCars = lazy(() => import('./AllCars'));

const Overview = () => {
    return (
        <div>
            <AllCars/>
        </div>
    );
}

export default Overview;