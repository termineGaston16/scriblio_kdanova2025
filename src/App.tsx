import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./UI/Infraestructure/Firebase/HEADER/Presentation/Components/Header";

export default function App() {


    return (
        <BrowserRouter>

            <Header />

            <Routes>
                <Route path="*" element={'Page Not Found'} />


            </Routes>
        </BrowserRouter>
    )
}