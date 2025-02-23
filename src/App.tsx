import { BrowserRouter, Route, Routes } from "react-router-dom";
import TagList from "./TAG/Presentation/Components/TagList";
import { QueryClient, QueryClientProvider } from "react-query";
import React from "react";

export default function App() {

    const query = new QueryClient();

    // SI NO HAY INTERNET RETORNAR OTRO COMPONENTE
    // APLICAR LO DE CSS MODO OSCURO AUTOMATICO

    return (
        <React.StrictMode>
            <QueryClientProvider client={query}>
                <BrowserRouter>

                    <TagList />

                    <Routes>
                        <Route path="*" element={'Page Not Found'} />


                    </Routes>
                </BrowserRouter>
            </QueryClientProvider>
        </React.StrictMode>
    )
}