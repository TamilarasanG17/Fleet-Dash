import LiveMap from "./LiveMap";

function MapCard() {

  return (

    <div className="rounded-xl bg-white p-5 shadow">

      <h2 className="mb-4 text-xl font-bold">

        Live Fleet Map

      </h2>

      <LiveMap/>

    </div>

  );

}

export default MapCard;