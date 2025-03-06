import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./UI/Application/Redux/store/storeRedux";
import SectionPreviousNoteList from "./NOTES/Presentation/Components/SectionPreviousNoteList";
import Header from "./UI/Presentation/Components/HEADER/Presentation/Components/Header";
import React from "react";
import TagList from "./TAG/Presentation/Components/TagList";


export default function App() {

    const query = new QueryClient();

    const parametersToFilterNotes = [
        '/',
        '/favoritos',
        '/pendientes',
        '/completadas',
        '/fijas',
        '/archivadas',
    ];

    return (
        <React.StrictMode>
            <Provider store={store}>
                <QueryClientProvider client={query}>
                    <BrowserRouter>

                        <TagList />

                        {/* <Header />

                        <Routes>
                            <Route path="*" element={'Page Not Found'} />

                            {parametersToFilterNotes.map((path) => (
                                <Route key={path} path={path} element={<SectionPreviousNoteList />} />
                            ))}
                        </Routes> */}

                    </BrowserRouter>
                </QueryClientProvider>
            </Provider>
        </React.StrictMode >
    )
}
