import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./UI/Infraestructure/Firebase/HEADER/Presentation/Components/Header";
import SectionPreviousNoteList from "./NOTES/Presentation/Components/SectionPreviousNoteList";

export default function App() {


    return (
        <BrowserRouter>

            <SectionPreviousNoteList />

            <Routes>
                <Route path="*" element={'Page Not Found'} />


            </Routes>
        </BrowserRouter>
    )
}