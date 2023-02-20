import {lazy, Show} from "solid-js";

const AllOrders = lazy(() => import('./AllOrders'));
const Schedule = lazy(() => import('./Schedule'));
const today = new Date();
// get tomorrow's date
today.setDate(today.getDate() + 1);

const Overview = () => {
    return (
        // we should check if the user has the right permissions to view this page
        <Show when={true} fallback={
            <div>Loading...</div>
        } keyed>
            <div>
                <AllOrders/>
                <Schedule date={today}/>
            </div>
        </Show>
    );
}

export default Overview;