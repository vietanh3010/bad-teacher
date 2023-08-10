import { memo } from "react";
import "./app.scss";
import "./index.css";
//primereact theme
import "primereact/resources/themes/lara-light-blue/theme.css";
//primereact core
import "primereact/resources/primereact.min.css";
import AppRouter from "./routers/AppRouter";
//primereact config
import PrimeReact from 'primereact/api';
//primereact icon style
import 'primeicons/primeicons.css';

import NotiSection from "./components/NotiSection";

//use in a component
PrimeReact.inputStyle = 'filled';
PrimeReact.ripple = true;

const App = (): JSX.Element => {
    
    return (
        <>
            <NotiSection/>
            <AppRouter/>
        </>
    );
};

export default memo(App);