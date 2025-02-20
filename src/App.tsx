import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./UI/Infraestructure/Firebase/HEADER/Presentation/Components/Header";
import Toolbar from "./UI/TOOLBAR/Presentation/Components/Toolbar";

export default function App() {


    return (
        <BrowserRouter>

            <Header />
            <Toolbar />

            <Routes>
                <Route path="*" element={'Page Not Found'} />


            </Routes>
        </BrowserRouter>
    )
}