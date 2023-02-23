import {lazy, Show} from "solid-js";

const AllOrders = lazy(() => import('./AllOrders'));
const Schedule = lazy(() => import('./Schedule'));

const Overview = () => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    return (
        // we should check if the user has the right permissions to view this page
        <Show when={true} fallback={
            <div>Loading...</div>
        } keyed>
            <div>
                <AllOrders/>
                <Schedule date={today}/>
                <Schedule date={tomorrow}/>
            </div>
        </Show>
    );
}

export default Overview;