import { useEffect, useState } from "react";
import "./Loading.css";

export default function Loading() {

    const [progress, setProgress] = useState(0);
    const [text, setText] = useState("Initializing Expedition...");
    const [hidden, setHidden] = useState(false);

    useEffect(() => {

        const messages = [

            "Initializing Expedition...",
            "Loading Terrain...",
            "Loading Fossils...",
            "Scanning Ecosystem...",
            "Preparing DNA Database...",
            "Entering Jurassic Journey..."

        ];

        let value = 0;

        const interval = setInterval(() => {

            value += 1;

            setProgress(value);

            if(value===15) setText(messages[1]);
            if(value===35) setText(messages[2]);
            if(value===55) setText(messages[3]);
            if(value===75) setText(messages[4]);
            if(value===90) setText(messages[5]);

            if(value>=100){

                clearInterval(interval);

                setTimeout(()=>{

                    setHidden(true);

                },700);

            }

        },35);

        return ()=>clearInterval(interval);

    },[]);

    return(

        <div className={`loadingScreen ${hidden ? "hideLoading" : ""}`}>

            <div className="loadingLogo">

                JURASSIC

                <span>

                    JOURNEY

                </span>

            </div>

            <div className="loadingText">

                {text}

            </div>

            <div className="loadingBar">

                <div

                    className="loadingFill"

                    style={{

                        width:`${progress}%`

                    }}

                ></div>

            </div>

            <div className="loadingPercent">

                {progress}%

            </div>

        </div>

    )

}