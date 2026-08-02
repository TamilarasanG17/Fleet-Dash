interface Props{

fps:number;

vehicles:number;

}

function CanvasStats({

fps,

vehicles

}:Props){

return(

<div className="flex gap-6 text-sm">

<p>

FPS : {fps}

</p>

<p>

Vehicles : {vehicles}

</p>

</div>

);

}

export default CanvasStats;