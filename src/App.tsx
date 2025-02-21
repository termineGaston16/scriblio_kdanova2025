import { BrowserRouter, Route, Routes } from "react-router-dom";
import TagList from "./TAG/Presentation/Components/TagList";

export default function App() {


    return (
        <BrowserRouter>

            <TagList />

            <Routes>
                <Route path="*" element={'Page Not Found'} />


            </Routes>
        </BrowserRouter>
    )
}